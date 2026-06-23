import type { Metadata } from "next";
import { InventoryClient } from "./_components/InventoryClient";
import { createClient } from "@/utils/supabase/server";
import { mapDbToInventoryItem } from "@/lib/db-products";

export const metadata: Metadata = {
  title: "Vistra Concierge | Inventory Management",
  description: "Secure, quiet luxury product inventory management and real-time replenishment controls.",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function InventoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q || "";
  const category = params.category || "All";
  const status = params.status || "All";
  const sort = params.sort || "Newest";
  const page = parseInt(params.page || "1", 10) || 1;
  const itemsPerPage = 5;

  const supabase = await createClient();
  let query = supabase.from("products").select("*", { count: "exact" });

  // 1. Search filter
  if (q.trim()) {
    query = query.ilike("title", `%${q.trim()}%`);
  }

  // 2. Category filter
  if (category !== "All") {
    query = query.ilike("category", category);
  }

  // 3. Status filter
  // "In Stock" -> stock_quantity > 5
  // "Low Stock" -> stock_quantity > 0 AND stock_quantity <= 5
  // "Out of Stock" -> stock_quantity = 0
  if (status === "Out of Stock") {
    query = query.eq("stock_quantity", 0);
  } else if (status === "Low Stock") {
    query = query.gt("stock_quantity", 0).lte("stock_quantity", 5);
  } else if (status === "In Stock") {
    query = query.or("stock_quantity.gt.5,stock_quantity.is.null");
  }

  // 4. Sort
  if (sort === "Price: Low to High") {
    query = query.order("price", { ascending: true });
  } else if (sort === "Price: High to Low") {
    query = query.order("price", { ascending: false });
  } else {
    // Default or "Newest"
    query = query.order("created_at", { ascending: false });
  }

  // 5. Pagination range
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  query = query.range(from, to);

  const { data: dbProducts, count } = await query;

  const items = (dbProducts || []).map(mapDbToInventoryItem);
  const totalCount = count || 0;

  return (
    <InventoryClient
      items={items}
      totalCount={totalCount}
      currentPage={page}
      searchQuery={q}
      categoryFilter={category}
      statusFilter={status}
      sortBy={sort}
    />
  );
}

