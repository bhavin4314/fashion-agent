import { type Product } from "./products";

export interface DbProduct {
  id: number | string;
  title: string;
  description?: string;
  price: number | string;
  stock_quantity?: number;
  category?: string;
  gender?: string;
  image_urls?: string[];
  sizes?: string[];
  materials?: string[];
  aesthetics?: string[];
  occasions?: string[];
  season?: string[];
  fit?: string | null;
  sku?: string;
}

export interface InventoryItem {
  id: string;
  title: string;
  sku: string;
  category: string;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  image: string;
  quantity: number;
}

/**
 * Maps a Supabase product record to the customer-facing Product type.
 */
export function mapDbProduct(db: DbProduct): Product {
  const gallery = db.image_urls && db.image_urls.length > 0
    ? db.image_urls
    : [db.image_urls?.[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60"];

  let occasion: "Formal" | "Casual" | "Workwear" = "Casual";
  if (db.occasions && db.occasions.length > 0) {
    const firstOcc = db.occasions[0];
    if (firstOcc) {
      const occ = firstOcc.toLowerCase();
      if (occ.includes("formal") || occ.includes("gala") || occ.includes("evening")) {
        occasion = "Formal";
      } else if (occ.includes("work") || occ.includes("office") || occ.includes("business")) {
        occasion = "Workwear";
      }
    }
  }

  let color: "white" | "black" | "grey" | "tan" = "white";
  const searchStr = `${db.title} ${db.description || ""} ${db.aesthetics?.join(" ") || ""}`.toLowerCase();
  if (searchStr.includes("black") || searchStr.includes("charcoal") || searchStr.includes("dark")) {
    color = "black";
  } else if (searchStr.includes("grey") || searchStr.includes("slate") || searchStr.includes("silver")) {
    color = "grey";
  } else if (searchStr.includes("tan") || searchStr.includes("beige") || searchStr.includes("camel") || searchStr.includes("brown") || searchStr.includes("sand")) {
    color = "tan";
  }

  return {
    id: db.id,
    title: db.title,
    price: Number(db.price),
    material: db.materials?.join(", ") || "Premium Blend",
    category: db.category === "apparel"
      ? "Apparel"
      : db.category === "footwear"
      ? "Footwear"
      : db.category === "accessories"
      ? "Accessories"
      : db.category || "Apparel",
    subcategory: db.fit || undefined,
    occasion,
    color,
    image: db.image_urls?.[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60",
    galleryImages: gallery,
    rating: 4.8,
    reviewsCount: 12,
    description: db.description || "",
    aiRecommendation: `This item highlights your ${db.aesthetics?.join(" or ") || "refined"} aesthetic.`,
    completeTheLook: [],
    sizes: db.sizes || []
  };
}

/**
 * Maps a Supabase product record to the admin-facing InventoryItem type.
 */
export function mapDbToInventoryItem(db: DbProduct): InventoryItem {
  let status: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock";
  if (db.stock_quantity === 0) {
    status = "Out of Stock";
  } else if (db.stock_quantity !== undefined && db.stock_quantity <= 5) {
    status = "Low Stock";
  }

  return {
    id: String(db.id),
    title: db.title,
    sku: db.sku || `VIST-${db.id}-${db.category?.substring(0, 2).toUpperCase() || "AP"}`,
    category: db.category === "apparel"
      ? "Apparel"
      : db.category === "footwear"
      ? "Footwear"
      : db.category === "accessories"
      ? "Accessories"
      : db.category || "Apparel",
    price: Number(db.price),
    status,
    image: db.image_urls?.[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60",
    quantity: db.stock_quantity ?? 0,
  };
}
