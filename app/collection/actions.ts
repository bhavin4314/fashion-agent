"use server";

import { createClient } from "@/utils/supabase/server";
import { mapDbProduct } from "@/lib/db-products";
import { type Product } from "@/lib/products";

interface FetchProductsParams {
  page: number;
  limit: number;
  priceRanges: string[];
  selectedCategories: string[];
  sortBy: string;
}

export async function fetchFilteredProductsAction(params: FetchProductsParams) {
  try {
    const { page, limit, priceRanges, selectedCategories, sortBy } = params;
    
    const supabase = await createClient();
    
    // 1. Fetch all products from Supabase
    const { data: dbProducts, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return { success: false, error: error.message, products: [], hasMore: false };
    }

    if (!dbProducts) {
      return { success: true, products: [], hasMore: false };
    }

    // 2. Filter DB products by Category (Product Type) if any are selected
    let dbList = dbProducts;
    if (selectedCategories.length > 0) {
      dbList = dbList.filter((p) =>
        p.category && selectedCategories.map(c => c.toLowerCase()).includes(p.category.toLowerCase())
      );
    }

    // 3. Map DB products to customer-facing Product type
    let list = dbList.map(mapDbProduct);

    // 4. Apply price filter
    if (priceRanges.length > 0) {
      list = list.filter((product) => {
        return priceRanges.some((range) => {
          if (range === "0-100") return product.price <= 100;
          if (range === "100-250") return product.price > 100 && product.price <= 250;
          if (range === "250+") return product.price > 250;
          return false;
        });
      });
    }

    // 5. Apply sorting logic
    if (sortBy === "Price: Low to High") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Newest") {
      list.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    }

    // 6. Paginate/slice the results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = list.slice(startIndex, endIndex);
    const hasMore = endIndex < list.length;

    return {
      success: true,
      products: paginatedProducts,
      hasMore,
      totalCount: list.length,
    };
  } catch (err: unknown) {
    console.error("Error in fetchFilteredProductsAction:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch filtered products",
      products: [],
      hasMore: false,
    };
  }
}
