"use server";

import { createClient } from "@/utils/supabase/server";
import { loginSchema } from "./schema";

export async function loginAction(formData: unknown) {
  const parsed = loginSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  const user = data.user;
  if (!user) {
    return {
      success: false,
      error: "Authentication succeeded but user session could not be established.",
    };
  }

  // Fetch the role from the profiles database table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Failed to retrieve profile role, defaulting to customer:", profileError.message);
  }

  const role = profile?.role || "customer";

  return {
    success: true,
    role,
  };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
