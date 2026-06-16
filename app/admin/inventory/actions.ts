"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Server Action to delete/archive a product from Supabase by its ID.
 */
export async function archiveProductAction(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return {
        success: false,
        error: error.message || "Failed to delete product from database",
      };
    }

    return {
      success: true,
    };
  } catch (err: unknown) {
    console.error("Error archiving product:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to archive product",
    };
  }
}
