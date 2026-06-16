import { z } from "zod";

export const step1Schema = z.object({
  image_urls: z
    .array(z.string())
    .min(1, "Please upload at least one product image")
    .max(4, "You can upload a maximum of 4 images"),
});

export const step2Schema = z.object({
  title: z.string().min(2, "Product title must be at least 2 characters"),
  description: z.string().min(10, "Product description must be at least 10 characters"),
  price: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ message: "Price must be a valid number" }).positive("Price must be a positive number")
  ),
  stock_quantity: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ message: "Stock quantity must be a valid number" }).int().nonnegative("Stock cannot be negative")
  ),
  category: z.enum(["apparel", "footwear", "accessories"]),
  gender: z.enum(["Men", "Women", "Unisex"]),
});

export const step3Schema = z.object({
  sizes: z.array(z.string()),
  materials: z.array(z.string()).min(1, "Please add at least one material"),
  aesthetics: z.array(z.string()).min(1, "Please select at least one aesthetic"),
  occasions: z.array(z.string()).min(1, "Please select at least one occasion"),
  season: z.array(z.string()).min(1, "Please select at least one season"),
  fit: z.string().nullable().optional(),
});

export const productWizardSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .refine(
    (data) => {
      if (data.category !== "accessories") {
        return Array.isArray(data.sizes) && data.sizes.length > 0;
      }
      return true;
    },
    {
      message: "Please select at least one size",
      path: ["sizes"],
    }
  );

export type ProductWizardFormValues = z.infer<typeof productWizardSchema>;
