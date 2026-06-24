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

interface SearchFilters {
  category?: string;
  productType?: string;
  gender?: string;
  color?: string;
  occasion?: string[];
  materials?: string[];
  aesthetics?: string[];
  season?: string[];
  fit?: string;
  maxPrice?: number;
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
async function runHybridSearch(query: string, filters: SearchFilters) {
  console.log(">>> [runHybridSearch] Started with query:", query, "filters:", filters);
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
      filter_category: filters.category || null,
      filter_product_type: filters.productType || null,
      filter_gender: filters.gender || null,
      filter_occasions: filters.occasion || null,
      filter_materials: filters.materials || null,
      filter_aesthetics: filters.aesthetics || null,
      filter_seasons: filters.season || null,
      filter_fit: filters.fit || null,
      max_price: filters.maxPrice || null,
      filter_color: filters.color || null,
    });
    
    if (error) {
      console.warn(">>> [runHybridSearch] match_products_hybrid RPC failed, falling back to text query:", error);
      throw error;
    }

    if (dbProducts) {
      console.log(">>> [runHybridSearch] RPC returned:", dbProducts.length, "candidates.", dbProducts);
      return (dbProducts as DBProductRecord[]).map(mapDbProduct);
    }
  } catch (err) {
    console.warn(">>> [runHybridSearch] Executing database text search fallback:", err);
    try {
      const supabase = await createClient();
      let dbQuery = supabase.from("products").select("*");
      
      // Apply filters to DB query fallback
      if (filters.category) {
        dbQuery = dbQuery.eq("category", filters.category);
      }
      if (filters.gender) {
        dbQuery = dbQuery.eq("gender", filters.gender);
      }
      if (filters.fit) {
        dbQuery = dbQuery.eq("fit", filters.fit);
      }
      if (filters.maxPrice) {
        dbQuery = dbQuery.lte("price", filters.maxPrice);
      }
      if (filters.occasion && filters.occasion.length > 0) {
        dbQuery = dbQuery.overlaps("occasions", filters.occasion);
      }
      if (filters.materials && filters.materials.length > 0) {
        dbQuery = dbQuery.overlaps("materials", filters.materials);
      }
      if (filters.aesthetics && filters.aesthetics.length > 0) {
        dbQuery = dbQuery.overlaps("aesthetics", filters.aesthetics);
      }
      if (filters.season && filters.season.length > 0) {
        dbQuery = dbQuery.overlaps("season", filters.season);
      }
      if (filters.color) {
        dbQuery = dbQuery.or(`title.ilike.%${filters.color}%,description.ilike.%${filters.color}%`);
      }
      
      if (filters.productType) {
        dbQuery = dbQuery.or(`title.ilike.%${filters.productType}%,description.ilike.%${filters.productType}%`);
      } else {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }
      
      const { data: dbTextMatches } = await dbQuery.limit(8);

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

    if (isIntercepted) {
      console.log(">>> [POST /api/chat] Local intercept triggered. Streaming static out-of-scope response.");
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

    console.log(">>> [POST /api/chat] Request passed local intercept. Streaming model response using:", CHAT_MODEL);

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
- If products are found, instruct the user that they can click on any product card in the recommended carousel to view details and sizes on the product page.
- If the user's query is completely unrelated to fashion, clothing, styling, or our catalog (off-topic / general knowledge), politely refuse to answer and state that you are Vistra's AI Fashion Concierge and can only assist with fashion-related queries.`,
      tools: {
        searchInventory: tool({
          description: "Search the real-time fashion product inventory using hybrid search (semantic + keywords) to find matching items, filtered by structured criteria.",
          inputSchema: z.object({
            query: z.string().describe("The search terms or style description (e.g. 'silk dress', 'linen shirt', 'grey suit')."),
            category: z.enum(["apparel", "footwear", "accessories"]).optional().describe("General category of the product."),
            productType: z.string().optional().describe("Specific type of item (e.g. 'shirt', 'dress', 'shoes', 'jeans', 'watch')."),
            gender: z.enum(["men", "women", "unisex"]).optional().describe("Target gender / fit category."),
            occasion: z.array(z.string()).optional().describe("Array of occasions suitable for the product (e.g. ['wedding', 'formal', 'casual', 'sports'])."),
            materials: z.array(z.string()).optional().describe("Array of materials (e.g. ['linen', 'cotton', 'leather', 'silk'])."),
            aesthetics: z.array(z.string()).optional().describe("Array of aesthetics / style vibes (e.g. ['minimalist', 'retro', 'streetwear', 'classic'])."),
            season: z.array(z.string()).optional().describe("Array of target seasons (e.g. ['summer', 'winter', 'spring', 'autumn'])."),
            fit: z.string().optional().describe("Fit of the apparel item (e.g. 'slim fit', 'regular fit', 'oversized', 'loose fit')."),
            maxPrice: z.number().optional().describe("Maximum price ceiling for budget constraints."),
            color: z.string().optional().describe("Specific color filter (e.g. 'black', 'red', 'blue', 'white').")
          }),
          execute: async (filters) => {
            console.log(">>> [searchInventory Tool] Executing search with filters:", filters);
            const results = await runHybridSearch(filters.query, filters);
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
