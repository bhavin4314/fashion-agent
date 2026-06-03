"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

export function SidebarNav() {
  const pathname = usePathname();

  const isOverviewActive = pathname === "/admin";
  const isInventoryActive = pathname?.startsWith("/admin/inventory") ?? false;

  return (
    <nav className="flex-1 space-y-xs px-md select-none">
      {/* Overview */}
      <a
        className={`flex items-center gap-sm px-lg py-md rounded-xl transition-all duration-200 ${
          isOverviewActive
            ? "text-[#ba0036] font-bold border-r-4 border-[#ba0036] bg-[#f4f3f3]"
            : "text-[#5c3f41] hover:bg-[#f4f3f3]"
        }`}
        href="/admin"
      >
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isOverviewActive ? "'FILL' 1" : "'FILL' 0" }}>
          dashboard
        </span>
        <span className="text-xs font-bold uppercase tracking-wider">Overview</span>
      </a>

      {/* Inventory */}
      <a
        className={`flex items-center gap-sm px-lg py-md rounded-xl transition-all duration-200 ${
          isInventoryActive
            ? "text-[#ba0036] font-bold border-r-4 border-[#ba0036] bg-[#f4f3f3]"
            : "text-[#5c3f41] hover:bg-[#f4f3f3]"
        }`}
        href="/admin/inventory"
      >
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isInventoryActive ? "'FILL' 1" : "'FILL' 0" }}>
          inventory_2
        </span>
        <span className="text-xs font-bold uppercase tracking-wider">Inventory</span>
      </a>

      {/* Styling Queue */}
      <a
        className="flex items-center gap-sm px-lg py-md text-[#5c3f41] hover:bg-[#f4f3f3] rounded-xl transition-all duration-200"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          alert("Styling queue feature integration is currently handled by active concierge curators.");
        }}
      >
        <span className="material-symbols-outlined text-[20px]">reorder</span>
        <span className="text-xs font-bold uppercase tracking-wider">Stylist Queue</span>
      </a>

      {/* Analytics */}
      <a
        className="flex items-center gap-sm px-lg py-md text-[#5c3f41] hover:bg-[#f4f3f3] rounded-xl transition-all duration-200"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          alert("Analytical dashboard is securely integrated with high-end telemetry curation tools.");
        }}
      >
        <span className="material-symbols-outlined text-[20px]">analytics</span>
        <span className="text-xs font-bold uppercase tracking-wider">Analytics</span>
      </a>
    </nav>
  );
}
