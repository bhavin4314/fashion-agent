import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AdminOverviewClient } from "./_components/AdminOverviewClient";

export const metadata: Metadata = {
  title: "Vistra Concierge | Admin Dashboard",
  description: "Secure administrative dashboard providing premium concierge metrics, interactive client engagement analytics, and curated luxury catalog tracking.",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/"); // Route non-admins away
  }

  // Fetch real statistics from Supabase
  
  // 1. Total Revenue (sum of total_amount from paid orders)
  const { data: revenueData } = await supabase
    .from("orders")
    .select("total_amount")
    .eq("payment_status", "paid");
    
  const totalRevenue = (revenueData || []).reduce(
    (sum, order) => sum + Number(order.total_amount),
    0
  );

  // 2. Active Products Count
  const { count: activeProductsCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  // 3. Customer Accounts Count
  const { count: customersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "customer");

  const stats = {
    totalRevenue,
    activeProductsCount: activeProductsCount || 0,
    customersCount: customersCount || 0,
  };

  return <AdminOverviewClient stats={stats} />;
}
