"use server";

import { createClient } from "@/utils/supabase/server";
import { signUpSchema } from "./schema";

export async function signUpAction(formData: unknown) {
  const parsed = signUpSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password, fullName } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    user: data.user ? { id: data.user.id, email: data.user.email } : null,
  };
}
