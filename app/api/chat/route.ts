import { streamText, generateText, Output, embed, tool, stepCountIs, createUIMessageStream, createUIMessageStreamResponse, generateId, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createClient } from "@/utils/supabase/server";
import { mapDbProduct } from "@/lib/db-products";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const CHAT_MODEL = process.env.NEXT_PUBLIC_AI_CHAT_MODEL as string;
const EMBEDDING_MODEL = process.env.NEXT_PUBLIC_AI_EMBEDDING_MODEL as string;
const MIN_SIMILARITY_THRESHOLD = 0.5;

if (!CHAT_MODEL) {
  throw new Error("NEXT_PUBLIC_AI_CHAT_MODEL is not defined in environment variables");
}
if (!EMBEDDING_MODEL) {
  throw new Error("NEXT_PUBLIC_AI_EMBEDDING_MODEL is not defined in environment variables");
}

interface QueryAnalysis {
  isRelevant: boolean;
  categories: ("apparel" | "footwear" | "accessories" | "other")[];
  productTypes: string[];
}

/**
 * Combined helper to determine fashion relevance and classify query details in one step.
 */
async function analyzeQuery(query: string): Promise<QueryAnalysis> {
  try {
    const { output } = await generateText({
      model: google(CHAT_MODEL),
      output: Output.object({
        schema: z.object({
          isRelevant: z.boolean().describe("True if query is fashion, clothing, apparel, footwear, accessories, styling, wardrobe coordination, colors, materials, or fashion catalog related."),
          categories: z.array(z.enum(["apparel", "footwear", "accessories", "other"])).describe("The general database categories representing the items requested"),
          productTypes: z.array(z.string()).describe("The specific singular fashion items requested (e.g. ['shirt', 'watch'])"),
        }),
      }),
      system: "You are an AI Fashion Concierge query analyzer. Determine if the query is relevant to a fashion store. Extract all general categories and specific fashion items requested.",
      prompt: query,
    });
    return output;
  } catch (e) {
    console.error("Error analyzing query:", e);
    return { isRelevant: true, categories: [], productTypes: [] };
  }
}

/**
 * Checks if a user query matches common greetings or off-topic questions locally.
 * This saves LLM tokens for simple inputs.
 */
function isLocallyIntercepted(query: string): boolean {
  const cleanQuery = query.trim().toLowerCase();
  
  const isGreeting = [
    "hi", "hello", "hey", "yo", "good morning", "good afternoon", 
    "good evening", "how are you", "what's up", "sup", "how's it going", "greetings"
  ].includes(cleanQuery);
  
  const isCommonOffTopic = 
    cleanQuery.includes("what is js") || 
    cleanQuery.includes("what is javascript") || 
    cleanQuery.startsWith("who are you") || 
    cleanQuery.includes("tell me a joke") || 
    cleanQuery.includes("how to compile") || 
    cleanQuery === "test" || 
    cleanQuery === "testing";

  return isGreeting || isCommonOffTopic;
}

interface DBProductRecord {
  id: string | number;
  title: string;
  description?: string;
  price: number | string;
  category: string;
  similarity: number;
}



/**
 * Runs hybrid search using the Supabase RPC function.
 * If the function is not found or fails, it falls back to a standard database text query.
 */
async function runHybridSearch(query: string, maxPrice?: number) {
  console.log(">>> [runHybridSearch] Started with query:", query, "maxPrice:", maxPrice);
  try {
    const supabase = await createClient();

    // 1. Generate dense query embedding
    console.log(">>> [runHybridSearch] Calling embedding API for model:", EMBEDDING_MODEL);
    const { embedding } = await embed({
      model: google.embedding(EMBEDDING_MODEL),
      value: query.trim(),
      providerOptions: {
        google: {
          outputDimensionality: 1536,
        },
      },
    });
    console.log(">>> [runHybridSearch] Embedding generated successfully.");

    // 2. Query Supabase RPC
    console.log(">>> [runHybridSearch] Invoking Supabase RPC match_products_hybrid...", query);
    const { data: dbProducts, error } = await supabase.rpc("match_products_hybrid", {
      query_text: query,
      query_embedding: embedding,
      match_count: 8,
      max_price: maxPrice || null,
    });
    
    if (error) {
      console.warn(">>> [runHybridSearch] match_products_hybrid RPC failed, falling back to text query:", error);
      throw error;
    }

    if (dbProducts) {
      console.log(">>> [runHybridSearch] RPC returned:", dbProducts.length, "raw candidates.", dbProducts);
      
      // Filter out products with low similarity scores to exclude completely off-topic items
      const filtered = (dbProducts as DBProductRecord[]).filter((p) => p.similarity >= MIN_SIMILARITY_THRESHOLD);
      
      console.log(
        ">>>> [runHybridSearch] Filtered by similarity threshold:",
        filtered.length, "items. Excluded:", dbProducts.length - filtered.length
      );
      
      return filtered.map(mapDbProduct);
    }
  } catch (err) {
    console.warn(">>> [runHybridSearch] Executing database text search fallback:", err);
    try {
      const supabase = await createClient();
      let dbQuery = supabase.from("products").select("*");
      if (maxPrice) {
        dbQuery = dbQuery.lte("price", maxPrice);
      }
      const { data: dbTextMatches } = await dbQuery
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(8);

      if (dbTextMatches && dbTextMatches.length > 0) {
        return dbTextMatches.map(mapDbProduct);
      }
    } catch (dbErr) {
      console.error("Database fallback search failed:", dbErr);
    }
  }

  return [];
}

export async function POST(req: Request) {
  console.log(">>> [POST /api/chat] Handler started.");
  try {
    const { messages } = await req.json();

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1];
    let userQuery = lastUserMessage?.content || "";
    
    // Fallback to parts if content is empty (common in AI SDK v4 UIMessage payloads)
    if (!userQuery && lastUserMessage?.parts) {
      userQuery = (lastUserMessage.parts as { type: string; text?: string }[])
        .filter((part) => part.type === "text")
        .map((part) => part.text ?? "")
        .join("");
    }
    console.log(">>> [POST /api/chat] User Query:", JSON.stringify(userQuery));

    // Local intercept check to save all tokens for common greetings/questions
    const isIntercepted = isLocallyIntercepted(userQuery);
    console.log(">>> [POST /api/chat] Local check results - isIntercepted:", isIntercepted);

    // 1. Guardrail & Classification: Check relevance and extract category/type in one LLM call
    let analysis: QueryAnalysis = { isRelevant: true, categories: [], productTypes: [] };
    if (isIntercepted) {
      analysis.isRelevant = false;
    } else {
      console.log(">>> [POST /api/chat] Running analyzeQuery via LLM model:", CHAT_MODEL);
      analysis = await analyzeQuery(userQuery);
      console.log(">>> [POST /api/chat] LLM analyzeQuery result:", analysis);
    }

    if (!analysis.isRelevant) {
      console.log(">>> [POST /api/chat] Guardrail triggered. Streaming static out-of-scope response.");
      const staticMessage = "I am Vistra's AI Fashion Concierge. I am specialized in premium apparel, footwear, and accessories, and cannot assist with general conversations, greetings, or off-topic queries.\n\nFeel free to ask me for wardrobe styling coordination or catalog searches (e.g., 'linen shirts under 300').";
      
      const stream = createUIMessageStream({
        originalMessages: messages,
        execute: ({ writer }) => {
          const messageId = generateId();
          const textPartId = generateId();
          writer.write({ type: "start", messageId });
          writer.write({ type: "text-start", id: textPartId });
          writer.write({ type: "text-delta", id: textPartId, delta: staticMessage });
          writer.write({ type: "text-end", id: textPartId });
          writer.write({ type: "finish", finishReason: "stop" });
        },
      });

      console.log(">>> [POST /api/chat] Static UIMessage stream returned.");
      return createUIMessageStreamResponse({ stream });
    }

    console.log(">>> [POST /api/chat] Request is relevant. Streaming model response using:", CHAT_MODEL);

    // 2. Stream stylist conversation with real-time hybrid search tool calling
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: google(CHAT_MODEL),
      messages: modelMessages,
      stopWhen: [stepCountIs(5)], // Allow the agent to call the tool, receive the results, and reply
      system: `You are Vistra's AI Fashion Stylist, an upscale, professional concierge.
Your role is to coordinate and suggest clothing, footwear, accessories, eyewear, sunglasses, bags, watches, jewellery, and all fashion-related products.
You have access to a real-time inventory search tool called 'searchInventory'. Use it when searching the catalog.

CRITICAL INSTRUCTIONS:
- Keep your text responses extremely brief, concise, and direct (max 2-3 sentences).
- Do NOT include long descriptions, footnotes, or notes.
- Do NOT output, mention, or print any product IDs, database IDs, UUIDs, or SKUs.
- ALWAYS keep your response contextually relevant to the SPECIFIC product category the user asked about. If they asked for sunglasses, talk about sunglasses — never give a generic apparel or clothing response.
- Reference the exact product type, style, and category the user mentioned in your reply.
- When the user asks for "other" products, different brands, or alternative styles (e.g., "is there other shoes" after looking at "Puma shoes"), call the searchInventory tool with a broader search term (e.g. "shoes" or "sneakers" instead of "Puma shoes") so you can retrieve alternative options.
- If the searchInventory tool returns any products (non-empty list), you must present them (e.g. acknowledging the alternative styles) and do NOT output the unavailability apology under any circumstances.
- If the searchInventory tool returns no products (an empty list), respond with a humble, user-friendly apology stating that the requested product is not available in our inventory at the moment. Do NOT use category-specific wording for the unavailability (e.g., do NOT say "I do not have any purses available"), but rather use a general, polite phrasing like "I am sorry, but the requested product is not available in our inventory at the moment. Please let me know if I can assist you with other styles." Do NOT suggest other products, and do NOT tell the user to click on other featured/above items.
- Proactively, do NOT talk about sizes or ask the user to select or reserve sizes in the chat, and do NOT suggest sizing options.
- HOWEVER, if the user explicitly asks about sizes, price, materials, or details for the products, you must answer their questions accurately using the search results or context (e.g., list the available sizes or the exact price).
- If products are found, instruct the user that they can click on any product card in the recommended carousel to view details and sizes on the product page.`,
      tools: {
        searchInventory: tool({
          description: "Search the real-time fashion product inventory using hybrid search (semantic + keywords) to find matching items, optionally filtered by a price limit.",
          inputSchema: z.object({
            query: z.string().describe("The search terms or style description (e.g. 'silk dress', 'linen shirt', 'grey suit')."),
            maxPrice: z.number().optional().describe("Optional maximum price ceiling for budget constraints (e.g., 200 for items under ₹200).")
          }),
          execute: async ({ query, maxPrice }) => {
            console.log(">>> [searchInventory Tool] Executing search for query:", query, "maxPrice:", maxPrice);
            const results = await runHybridSearch(query, maxPrice);
            console.log(">>> [searchInventory Tool] Found", results.length, "results.");

            if (results.length > 0) {
              console.log(">>> [searchInventory Tool] Filtering results with LLM against user query:", userQuery);
              try {
                const { output } = await generateText({
                  model: google(CHAT_MODEL),
                  output: Output.object({
                    schema: z.object({
                      matchingIds: z.array(z.string()).describe("The list of product IDs from the candidates that are a genuine match for the user's specific request or follow-up question."),
                    }),
                  }),
                  system: `You are an AI inventory validation assistant.
Your job is to compare a user's shopping request or follow-up question with a list of search result candidates from our database.
Determine which candidates are actual matches for the user's request.

Guidelines:
1. If the user is searching for a specific item (e.g., "shoes", "shirt", "jacket"), only match candidates that are of that type. Be conservative: do not match a shirt when they asked for shoes.
2. If the user's request is a follow-up question (e.g. asking about sizes, price, colors, materials, or other details) for products currently being discussed (implied by the search query, e.g. "shoes" or "sneakers"), match the candidates that fit that search query type.
3. Only match candidates that are relevant to what the user is looking for or asking about.`,
                  prompt: `User Request: "${userQuery}"
Search query used: "${query}"

Candidate Products:
${results.map((r, i) => `${i + 1}. ID: "${r.id}" | Title: "${r.title}" | Category: "${r.category}" | Description: "${r.description}"`).join("\n")}`,
                });

                console.log(">>> [searchInventory Tool] LLM Filter returned matching IDs:", output.matchingIds);
                const filteredResults = results.filter((r) => output.matchingIds.includes(String(r.id)));
                console.log(">>> [searchInventory Tool] Filtered from", results.length, "to", filteredResults.length);
                return filteredResults;
              } catch (filterErr) {
                console.error(">>> [searchInventory Tool] Error filtering search results with LLM:", filterErr);
                return results;
              }
            }

            return results;
          },
        }),
      },
    });

    console.log(">>> [POST /api/chat] Stream initialized, returning SSE stream response.");
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in chat route handler:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
