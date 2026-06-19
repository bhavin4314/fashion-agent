import * as React from "react";

interface QuickAlertsProps {
  pendingOrdersCount: number;
  unpaidOrdersCount: number;
  lowStockCount: number;
  inStockCount: number;
  totalProductsCount: number;
}

export function QuickAlerts({
  pendingOrdersCount,
  unpaidOrdersCount,
  lowStockCount,
  inStockCount,
  totalProductsCount,
}: QuickAlertsProps) {
  const inStockPercent = totalProductsCount > 0
    ? Math.round((inStockCount / totalProductsCount) * 100)
    : 100;

  return (
    <div className="bg-white border border-border-light rounded-xl p-xl flex flex-col select-none">
      <h4 className="text-lg font-bold text-on-surface mb-xl">Quick Alerts</h4>
      
      <div className="space-y-md flex-grow">
        {/* Pending Orders */}
        <div className="flex items-center justify-between p-md bg-surface-container-low rounded-xl border border-secondary-container/30">
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-amber-500">pending_actions</span>
            <span className="text-xs font-semibold text-on-surface">Pending Orders</span>
          </div>
          <span className="bg-amber-100 text-amber-700 px-sm py-xs rounded font-bold text-xs">
            {pendingOrdersCount}
          </span>
        </div>

        {/* Unpaid Orders */}
        <div className="flex items-center justify-between p-md bg-surface-container-low rounded-xl border border-secondary-container/30">
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-error">credit_card_off</span>
            <span className="text-xs font-semibold text-on-surface">Unpaid Orders</span>
          </div>
          <span className="bg-red-100 text-error px-sm py-xs rounded font-bold text-xs">
            {unpaidOrdersCount}
          </span>
        </div>

        {/* Low Stock Items */}
        <div className="flex items-center justify-between p-md bg-surface-container-low rounded-xl border border-secondary-container/30">
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-amber-600">low_priority</span>
            <span className="text-xs font-semibold text-on-surface">Low Stock Items</span>
          </div>
          <span className="bg-amber-100 text-amber-700 px-sm py-xs rounded font-bold text-xs">
            {lowStockCount}
          </span>
        </div>
      </div>

      <div className="mt-xl p-lg bg-brand/5 border border-brand/10 rounded-xl">
        <p className="text-xs font-bold text-brand uppercase tracking-wider mb-xs">
          Inventory Health
        </p>
        <div className="w-full bg-surface-container rounded-full h-1.5 mb-sm">
          <div
            className="bg-brand h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${inStockPercent}%` }}
          />
        </div>
        <p className="text-xs font-medium text-on-surface-variant">
          {inStockPercent}% of products are in stock and ready for delivery.
        </p>
      </div>
    </div>
  );
}
