import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters").or(z.literal("")),
  address: z.string().min(10, "Shipping address must be at least 10 characters").or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
