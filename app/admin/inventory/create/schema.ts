import { z } from "zod";

export const productWizardSchema = z.object({
  images: z.array(z.string()).min(1, "Please upload at least one product image"),
  title: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Product description must be at least 10 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  price: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ message: "Price must be a valid number" }).min(0.01, "Price must be greater than 0")
  ),
  stock: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ message: "Stock quantity must be a valid number" }).min(0, "Stock cannot be negative")
  ),
  gender: z.enum(["Men", "Women", "Unisex"]),
  season: z.enum(["Summer", "Autumn", "Winter", "Spring"]),
  sizes: z.array(z.string()).min(1, "Please select at least one size"),
  aesthetic: z.string().min(1, "Please select an aesthetic"),
  occasion: z.string().min(1, "Please select an occasion"),
  materials: z.array(z.string()).min(1, "Please add at least one material"),
  fit: z.enum(["Regular", "Slim"]),
});

export type ProductWizardFormValues = z.infer<typeof productWizardSchema>;
