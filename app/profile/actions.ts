"use server";

import { createClient } from "@/utils/supabase/server";
import { profileSchema } from "./schemas";

export async function updateProfileAction(input: unknown) {
  try {
    const parsed = profileSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid input: " + parsed.error.message,
      };
    }

    const { fullName, phone, address } = parsed.data;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in to update your profile." };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone || null,
        shipping_address: address || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Failed to update profile:", error);
      return { success: false, error: "Failed to update profile info. " + error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("updateProfileAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal error occurred",
    };
  }
}
