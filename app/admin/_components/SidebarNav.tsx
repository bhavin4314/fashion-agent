"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function SidebarNav() {
  const pathname = usePathname();

  const isOverviewActive = pathname === "/admin";
  const isInventoryActive = pathname?.startsWith("/admin/inventory") ?? false;

  return (
    <nav className="flex-1 space-y-xs px-md select-none">
      {/* Overview */}
      <Link
        className={`flex items-center gap-sm px-lg py-md rounded-xl transition-all duration-200 ${
          isOverviewActive
            ? "text-primary font-bold border-r-4 border-primary bg-surface-container-low"
            : "text-on-surface-variant hover:bg-surface-container-low"
        }`}
        href="/admin"
      >
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isOverviewActive ? "'FILL' 1" : "'FILL' 0" }}>
          dashboard
        </span>
        <span className="text-xs font-bold uppercase tracking-wider">Overview</span>
      </Link>

      {/* Inventory */}
      <Link
        className={`flex items-center gap-sm px-lg py-md rounded-xl transition-all duration-200 ${
          isInventoryActive
            ? "text-primary font-bold border-r-4 border-primary bg-surface-container-low"
            : "text-on-surface-variant hover:bg-surface-container-low"
        }`}
        href="/admin/inventory"
      >
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isInventoryActive ? "'FILL' 1" : "'FILL' 0" }}>
          inventory_2
        </span>
        <span className="text-xs font-bold uppercase tracking-wider">Inventory</span>
      </Link>
    </nav>
  );
}
