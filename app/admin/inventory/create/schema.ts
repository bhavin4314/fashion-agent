import { z } from "zod";

export const productWizardSchema = z.object({
  images: z.array(z.string()).min(1, "Please upload at least one product image"),
  title: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Product description must be at least 10 characters"),
  price: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ message: "Price must be a valid number" }).min(0.01, "Price must be greater than 0")
  ),
  stock: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ message: "Stock quantity must be a valid number" }).min(0, "Stock cannot be negative")
  ),
  category: z.enum(["Apparel", "Footwear"]),
  gender: z.enum(["Men", "Women", "Unisex"]),
  season: z.enum(["Summer", "Autumn", "Winter", "Spring"]),
  sizes: z.array(z.string()).min(1, "Please select at least one size"),
  aesthetics: z.array(z.string()).min(1, "Please select at least one aesthetic"),
  occasions: z.array(z.string()).min(1, "Please select at least one occasion"),
  materials: z.array(z.string()).min(1, "Please add at least one material"),
});

export type ProductWizardFormValues = z.infer<typeof productWizardSchema>;
