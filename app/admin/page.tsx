import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AdminOverviewClient } from "./_components/AdminOverviewClient";

export const metadata: Metadata = {
  title: "Vistra Concierge | Admin Dashboard",
  description: "Secure administrative dashboard providing premium concierge metrics, interactive client engagement analytics, and selected luxury catalog tracking.",
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
    .neq("role", "admin");

  // 4. Total Orders Count
  const { count: totalOrdersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // 5. Pending Orders Count
  const { count: pendingOrdersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // 6. Unpaid Orders Count
  const { count: unpaidOrdersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("payment_status", "unpaid");

  // 7. Low Stock Items Count (stock <= 5)
  const { count: lowStockCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .lte("stock_quantity", 5);

  // 8. In Stock Items Count (stock > 0)
  const { count: inStockCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .gt("stock_quantity", 0);

  // 9. Recent Orders (5)
  const { data: recentOrdersData } = await supabase
    .from("orders")
    .select("id, customer_name, total_amount, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const recentOrders = (recentOrdersData || []).map((o) => ({
    id: o.id,
    customerName: o.customer_name,
    totalAmount: Number(o.total_amount),
    status: o.status,
    createdAt: o.created_at,
  }));

  // 10. Revenue by Category (Apparel, Footwear, Accessories)
  const { data: paidOrders } = await supabase
    .from("orders")
    .select(`
      id,
      order_items (
        price,
        quantity,
        products (
          category
        )
      )
    `)
    .eq("payment_status", "paid");

  let apparelRev = 0;
  let footwearRev = 0;
  let accessoriesRev = 0;

  if (paidOrders) {
    for (const order of paidOrders) {
      if (order.order_items) {
        for (const item of order.order_items as any[]) {
          const category = item.products?.category || "apparel";
          const itemRev = Number(item.price) * (item.quantity || 1);
          if (category === "apparel") {
            apparelRev += itemRev;
          } else if (category === "footwear") {
            footwearRev += itemRev;
          } else if (category === "accessories") {
            accessoriesRev += itemRev;
          }
        }
      }
    }
  }

  const totalCategoryRev = apparelRev + footwearRev + accessoriesRev;
  const categoryRevenue = {
    apparel: totalCategoryRev > 0 ? apparelRev : 55,
    footwear: totalCategoryRev > 0 ? footwearRev : 30,
    accessories: totalCategoryRev > 0 ? accessoriesRev : 15,
  };

  // 11. Daily Trend over Last 7 Days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data: trendOrders } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .eq("payment_status", "paid")
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const trendDataMap: { [key: string]: number } = {};
  
  const last7DaysLabels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayLabel = dayNames[d.getDay()] || "";
    trendDataMap[dayLabel] = 0;
    last7DaysLabels.push(dayLabel);
  }

  if (trendOrders) {
    for (const order of trendOrders) {
      const date = new Date(order.created_at);
      const dayLabel = dayNames[date.getDay()] || "";
      if (dayLabel in trendDataMap) {
        trendDataMap[dayLabel] += Number(order.total_amount);
      }
    }
  }

  const xCoords = [50, 166, 282, 398, 514, 630, 746];
  const maxTrendVal = Math.max(...Object.values(trendDataMap), 1000);

  const dailyTrend = last7DaysLabels.map((day, idx) => {
    const value = trendDataMap[day] || 0;
    const y = 180 - (value / maxTrendVal) * 165;
    return {
      day,
      value,
      x: xCoords[idx] || 50,
      y: Math.round(y),
    };
  });

  const stats = {
    totalRevenue,
    activeProductsCount: activeProductsCount || 0,
    customersCount: customersCount || 0,
    totalOrdersCount: totalOrdersCount || 0,
    pendingOrdersCount: pendingOrdersCount || 0,
    unpaidOrdersCount: unpaidOrdersCount || 0,
    lowStockCount: lowStockCount || 0,
    inStockCount: inStockCount || 0,
    recentOrders,
    categoryRevenue,
    dailyTrend,
  };

  return <AdminOverviewClient stats={stats} />;
}
