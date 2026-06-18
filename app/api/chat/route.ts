import { streamText, generateText, Output, embed, tool, stepCountIs, createUIMessageStream, createUIMessageStreamResponse, generateId, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createClient } from "@/utils/supabase/server";
import { mapDbProduct } from "@/lib/db-products";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const CHAT_MODEL = process.env.AI_CHAT_MODEL as string;
const EMBEDDING_MODEL = process.env.AI_EMBEDDING_MODEL as string;
const MIN_SIMILARITY_THRESHOLD = 0.4;

if (!CHAT_MODEL) {
  throw new Error("AI_CHAT_MODEL is not defined in environment variables");
}
if (!EMBEDDING_MODEL) {
  throw new Error("AI_EMBEDDING_MODEL is not defined in environment variables");
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
 * Determines if a product matches the requested product type using common synonyms.
 */
function isProductTypeAlignment(title: string, description: string, productType: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  const type = productType.toLowerCase();

  const synonymMap: Record<string, string[]> = {
    purse: ["purse", "bag", "handbag", "tote", "clutch", "satchel"],
    bag: ["bag", "handbag", "backpack", "tote", "purse", "clutch", "satchel"],
    handbag: ["handbag", "bag", "tote", "purse", "clutch", "satchel"],
    tote: ["tote", "bag", "handbag", "purse"],
    shoe: ["shoe", "sneaker", "boot", "loafer", "sandal", "footwear", "slipper", "trainer", "trainers"],
    sneaker: ["sneaker", "shoe", "trainer", "trainers", "footwear"],
    boot: ["boot", "shoe", "footwear"],
    loafer: ["loafer", "shoe", "footwear"],
    sandal: ["sandal", "shoe", "footwear"],
    shirt: ["shirt", "t-shirt", "tee", "polo", "top", "blouse"],
    watch: ["watch", "timepiece", "chronograph"],
    timepiece: ["timepiece", "watch"],
    sunglasses: ["sunglass", "glass", "eyewear", "shade", "spectacles", "sunglasses"],
    glasses: ["glass", "eyewear", "shade", "spectacles", "sunglasses", "glasses"],
    eyewear: ["glass", "eyewear", "shade", "spectacles", "sunglasses", "glasses"],
    dress: ["dress", "gown", "frock"],
    gown: ["dress", "gown"],
    suit: ["suit", "blazer", "tuxedo", "jacket"],
    blazer: ["blazer", "suit", "jacket"],
    jacket: ["jacket", "blazer", "coat", "outerwear"],
    pant: ["pant", "trouser", "jean", "short", "denim", "pants", "trousers", "jeans", "shorts"],
    pants: ["pant", "trouser", "jean", "short", "denim", "pants", "trousers", "jeans", "shorts"],
    trouser: ["pant", "trouser", "jean", "short", "denim", "pants", "trousers", "jeans", "shorts"],
    trousers: ["pant", "trouser", "jean", "short", "denim", "pants", "trousers", "jeans", "shorts"],
    jean: ["pant", "trouser", "jean", "short", "denim", "pants", "trousers", "jeans", "shorts"],
    jeans: ["pant", "trouser", "jean", "short", "denim", "pants", "trousers", "jeans", "shorts"],
  };

  const synonyms = synonymMap[type] || [type];
  return synonyms.some((syn) => text.includes(syn));
}

/**
 * Runs hybrid search using the Supabase RPC function.
 * If the function is not found or fails, it falls back to a standard database text query.
 */
async function runHybridSearch(query: string, analysis: QueryAnalysis, maxPrice?: number) {
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
      console.log(">>> [runHybridSearch] RPC returned:", dbProducts.length, "items.");
      
      // Filter out products with low similarity scores to exclude completely off-topic items
      let filtered = (dbProducts as DBProductRecord[]).filter((p) => p.similarity >= MIN_SIMILARITY_THRESHOLD);
      
      // Filter by expected categories based on AI classification to prevent showing irrelevant types of products
      if (analysis.categories && analysis.categories.length > 0) {
        filtered = filtered.filter((p) => analysis.categories.includes(p.category as QueryAnalysis["categories"][number]));
      }
      
      // Filter by query product type alignment via deterministic code-level helper
      if (analysis.productTypes && analysis.productTypes.length > 0 && filtered.length > 0) {
        filtered = filtered.filter((p) => 
          analysis.productTypes.some((type) => isProductTypeAlignment(p.title, p.description || "", type))
        );
      }

      console.log(
        ">>>> [runHybridSearch] Filtered by category & product type alignment:",
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
- If the searchInventory tool returns no products (an empty list), respond with a humble, user-friendly apology stating that the requested product is not available in our inventory at the moment. Do NOT use category-specific wording for the unavailability (e.g., do NOT say "I do not have any purses available"), but rather use a general, polite phrasing like "I am sorry, but the requested product is not available in our inventory at the moment. Please let me know if I can assist you with other styles." Do NOT suggest other products, and do NOT tell the user to click on other featured/above items.
- Do NOT talk about sizes or ask the user to select or reserve sizes in the chat.
- Do NOT suggest sizing options.
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
            const results = await runHybridSearch(query, analysis, maxPrice);
            console.log(">>> [searchInventory Tool] Found", results.length, "results.");
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
