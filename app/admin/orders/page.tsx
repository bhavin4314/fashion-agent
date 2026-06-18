import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AdminOrdersClient } from "./_components/AdminOrdersClient";

export const metadata: Metadata = {
  title: "Order Curation | Admin",
  description: "Secure order status updates and curation logs.",
};

interface DBOrderSummary {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  payment_status: string;
  stripe_session_id: string | null;
}

interface PageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q || "";
  const page = parseInt(params.page || "1", 10) || 1;
  const itemsPerPage = 5;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/orders");
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/"); // Non-admins are routed away
  }

  // Fetch orders in the system with search and pagination
  let query = supabase
    .from("orders")
    .select("id, created_at, status, total_amount, customer_name, customer_email, payment_status, stripe_session_id", { count: "exact" });

  if (q.trim()) {
    query = query.or(`customer_name.ilike.%${q.trim()}%,customer_email.ilike.%${q.trim()}%`);
  }

  // Order by created_at desc
  query = query.order("created_at", { ascending: false });

  // Pagination range
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  query = query.range(from, to);

  const { data: dbOrders, count } = await query;

  const formattedOrders = (dbOrders as unknown as DBOrderSummary[] || []).map((o) => ({
    id: o.id,
    createdAt: o.created_at,
    status: o.status,
    totalAmount: Number(o.total_amount),
    customerName: o.customer_name,
    customerEmail: o.customer_email,
    paymentStatus: o.payment_status,
    stripeSessionId: o.stripe_session_id,
  }));

  const totalCount = count || 0;

  return (
    <AdminOrdersClient
      orders={formattedOrders}
      totalCount={totalCount}
      currentPage={page}
      searchQuery={q}
    />
  );
}
