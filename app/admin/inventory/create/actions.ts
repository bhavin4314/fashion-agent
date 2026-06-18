"use server";

import { generateText, Output, embed } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { productWizardSchema } from "./schema";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const CHAT_MODEL = process.env.AI_CHAT_MODEL as string;
const EMBEDDING_MODEL = process.env.AI_EMBEDDING_MODEL as string;

if (!CHAT_MODEL) {
  throw new Error("AI_CHAT_MODEL is not defined in environment variables");
}
if (!EMBEDDING_MODEL) {
  throw new Error("AI_EMBEDDING_MODEL is not defined in environment variables");
}

// Schema for Gemini attribute extraction
const aiAnalysisSchema = z.object({
  isRelevantFashionItem: z.boolean().describe("True if the uploaded image represents an item of clothing, apparel, footwear, or a fashion accessory (e.g. watches, bags, jewelry, sunglasses, wallets). False if it is completely irrelevant to fashion (e.g. food, animals, electronics, vehicles, landscapes, etc.)"),
  title: z.string().describe("A descriptive, luxury-focused title for the product"),
  description: z.string().describe("An elegant, high-end editorial product description of 2-3 sentences"),
  category: z.enum(["apparel", "footwear", "accessories"]).describe("The category of the item: apparel, footwear, or accessories"),
  gender: z.enum(["Men", "Women", "Unisex"]).describe("Target gender"),
  sizes: z.array(z.string()).describe("Suggested list of available sizes appropriate for the category (leave empty/null for accessories). For footwear, sizes must be purely numeric strings (e.g. '8', '9', '10') without any 'US', 'UK', or 'EU' text."),
  materials: z.array(z.string()).describe("Materials used, e.g. Cashmere, Leather, Suede"),
  aesthetics: z.array(z.string()).describe("Aesthetic styles, e.g. Quiet Luxury, Minimalist, Vintage"),
  occasions: z.array(z.string()).describe("Occasions for use, e.g. Evening Lounge, Travel, Casual"),
  season: z.string().describe("Appropriate season. Must be one of or a comma-separated list of: Summer, Winter, Monsoon"),
  fit: z.string().optional().nullable().describe("The fit description, e.g. Relaxed, Slim, Oversized (leave empty/null for footwear or accessories)"),
});

/**
 * Server Action to analyze a product image via multimodal Gemini 3.5 Flash
 */
export async function analyzeProductMediaAction(imageUrl: string) {
  try {
    if (!imageUrl) {
      return { success: false, error: "Image URL is required" };
    }

    const { output } = await generateText({
      model: google(CHAT_MODEL),
      output: Output.object({
        schema: aiAnalysisSchema,
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this fashion/footwear item and extract structural details, materials, aesthetics, recommended occasions, season, fit, category, and gender targeting. Adhere strictly to the requested schema.",
            },
            {
              type: "image",
              image: new URL(imageUrl),
            },
          ],
        },
      ],
    });
    console.log("OUTPUT ::: ", output)
    if (!output.isRelevantFashionItem) {
      return {
        success: false,
        error: "The uploaded image is not a fashion, apparel, or footwear item.",
        isIrrelevant: true,
      };
    }
    return {
      success: true,
      data: output,
    };
  } catch (err: unknown) {
    console.error("Error analyzing product media:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to analyze product media using AI",
    };
  }
}

/**
 * Server Action to create the product, generate embedding vector and save to Supabase
 */
export async function createProductAction(formData: unknown) {
  try {
    const parsed = productWizardSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed: " + JSON.stringify(parsed.error.flatten().fieldErrors),
      };
    }

    const product = parsed.data;

    // 1. Build dense text block for embedding
    const metadataText = `
Title: ${product.title}
Description: ${product.description}
Price: ₹${product.price}
Category: ${product.category}
Gender: ${product.gender}
Season: ${product.season.join(", ")}
Sizes: ${product.sizes.join(", ")}
Materials: ${product.materials.join(", ")}
Aesthetics: ${product.aesthetics.join(", ")}
Occasions: ${product.occasions.join(", ")}
${product.fit ? `Fit: ${product.fit}` : ""}
`.trim();

    // 2. Compute 1,536-dimension embedding via gemini-embedding-2-preview
    const { embedding } = await embed({
      model: google.embedding(EMBEDDING_MODEL),
      value: metadataText,
      providerOptions: {
        google: {
          outputDimensionality: 1536,
        },
      },
    });

    // 3. Insert directly into Supabase products table
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .insert({
        title: product.title,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity,
        category: product.category,
        gender: product.gender,
        image_urls: product.image_urls,
        sizes: product.sizes,
        materials: product.materials,
        aesthetics: product.aesthetics,
        occasions: product.occasions,
        season: product.season,
        fit: product.fit,
        text_embedding: embedding, // 1,536-dimension float array
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return {
        success: false,
        error: error.message || "Failed to insert product record into database",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err: unknown) {
    console.error("Error creating product:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to execute product creation workflow",
    };
  }
}

/**
 * Server Action to update an existing product and re-generate embedding vector
 */
export async function updateProductAction(id: string, formData: unknown) {
  try {
    const parsed = productWizardSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed: " + JSON.stringify(parsed.error.flatten().fieldErrors),
      };
    }

    const product = parsed.data;

    // 1. Build dense text block for embedding
    const metadataText = `
Title: ${product.title}
Description: ${product.description}
Price: ₹${product.price}
Category: ${product.category}
Gender: ${product.gender}
Season: ${product.season.join(", ")}
Sizes: ${product.sizes.join(", ")}
Materials: ${product.materials.join(", ")}
Aesthetics: ${product.aesthetics.join(", ")}
Occasions: ${product.occasions.join(", ")}
${product.fit ? `Fit: ${product.fit}` : ""}
`.trim();

    // 2. Compute 1,536-dimension embedding via gemini-embedding-2-preview
    const { embedding } = await embed({
      model: google.embedding(EMBEDDING_MODEL),
      value: metadataText,
      providerOptions: {
        google: {
          outputDimensionality: 1536,
        },
      },
    });

    // 3. Update directly in Supabase products table
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .update({
        title: product.title,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity,
        category: product.category,
        gender: product.gender,
        image_urls: product.image_urls,
        sizes: product.sizes,
        materials: product.materials,
        aesthetics: product.aesthetics,
        occasions: product.occasions,
        season: product.season,
        fit: product.fit,
        text_embedding: embedding, // 1,536-dimension float array
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return {
        success: false,
        error: error.message || "Failed to update product record in database",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err: unknown) {
    console.error("Error updating product:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to execute product update workflow",
    };
  }
}
