"use client";

import * as React from "react";
import { Search, Plus } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";
import { KpiCards } from "./KpiCards";
import { RevenueTrend } from "./RevenueTrend";
import { RecentOrders } from "./RecentOrders";
import { RevenueByCategory } from "./RevenueByCategory";

interface OrderItem {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface CategoryRevenue {
  apparel: number;
  footwear: number;
  accessories: number;
}

interface TrendPoint {
  day: string;
  value: number;
  x: number;
  y: number;
}

interface AdminOverviewClientProps {
  stats: {
    totalRevenue: number;
    activeProductsCount: number;
    customersCount: number;
    totalOrdersCount: number;
    pendingOrdersCount: number;
    unpaidOrdersCount: number;
    lowStockCount: number;
    inStockCount: number;
    recentOrders: OrderItem[];
    categoryRevenue: CategoryRevenue;
    dailyTrend: TrendPoint[];
  };
}

export function AdminOverviewClient({ stats }: AdminOverviewClientProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  const handleCreateProduct = () => {
    window.location.href = "/admin/inventory/create";
  };

  // Filter recent orders based on search query
  const filteredRecentOrders = React.useMemo(() => {
    if (!searchQuery.trim()) return stats.recentOrders;
    const q = searchQuery.toLowerCase();
    return stats.recentOrders.filter(
      (order) =>
        order.customerName.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q) ||
        order.status.toLowerCase().includes(q)
    );
  }, [searchQuery, stats.recentOrders]);

  return (
    <div className="flex flex-col flex-grow select-none w-full min-h-screen">
      {/* TopAppBar Navigation */}
      <header className="flex justify-between items-center w-full px-margin-desktop py-md bg-white border-b border-secondary-container z-40 select-none">
        <div className="flex items-center flex-1">
          <div
            className={`relative w-96 flex items-center bg-surface-container-low rounded-xl px-md transition-all duration-200 border ${
              isSearchFocused
                ? "border-brand ring-2 ring-brand/10 bg-white"
                : "border-transparent"
            }`}
          >
            <Search className="h-4 w-4 text-on-surface-variant shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="flex-1 min-w-0 pl-sm pr-md bg-transparent border-none text-xs font-semibold text-charcoal focus:outline-none focus:ring-0 placeholder:text-on-surface-variant/50 h-10"
              placeholder="Search orders, products, or clients..."
            />
          </div>
        </div>

        <div className="flex items-center gap-md select-none">


          <button
            onClick={handleCreateProduct}
            className="bg-brand hover:bg-brand-hover text-white px-lg py-2.5 rounded-xl text-xs font-bold hover:shadow-lg transition-all active:scale-[0.98] border-none cursor-pointer tracking-wider flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            New Product
          </button>
        </div>
      </header>

      {/* Main Canvas Viewport */}
      <div className="flex-grow overflow-y-auto p-xl bg-footer-bg w-full select-none">
        <div className="max-w-7xl mx-auto space-y-xl">
          {/* Dashboard Header */}
          <DashboardHeader />

          {/* Bento Style Metrics Grid */}
          <KpiCards
            totalRevenue={stats.totalRevenue}
            totalOrdersCount={stats.totalOrdersCount}
            customersCount={stats.customersCount}
            activeProductsCount={stats.activeProductsCount}
          />

          {/* SVG Chart Section */}
          <RevenueTrend dailyTrend={stats.dailyTrend} />

          {/* Grid Layout for Recent Orders & Revenue by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            {/* Recent Orders Table */}
            <RecentOrders recentOrders={filteredRecentOrders} />

            {/* Revenue by Category Donut Chart */}
            <RevenueByCategory categoryRevenue={stats.categoryRevenue} />
          </div>
        </div>
      </div>
    </div>
  );
}
