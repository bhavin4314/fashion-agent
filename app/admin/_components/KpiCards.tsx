import * as React from "react";

interface KpiCardsProps {
  totalRevenue: number;
  totalOrdersCount: number;
  customersCount: number;
  activeProductsCount: number;
}

export function KpiCards({
  totalRevenue,
  totalOrdersCount,
  customersCount,
  activeProductsCount,
}: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-xxl select-none">
      {/* Total Revenue */}
      <div className="bg-white border border-border-light rounded-xl p-lg flex flex-col gap-sm hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start">
          <span className="material-symbols-outlined text-brand text-[28px] shrink-0">
            payments
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase mb-xs">
            Total Revenue
          </p>
          <h3 className="text-2xl font-bold text-on-surface">
            ₹{totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* Total Orders */}
      <div className="bg-white border border-border-light rounded-xl p-lg flex flex-col gap-sm hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start">
          <span className="material-symbols-outlined text-brand text-[28px] shrink-0">
            shopping_bag
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase mb-xs">
            Total Orders
          </p>
          <h3 className="text-2xl font-bold text-on-surface">
            {totalOrdersCount.toLocaleString("en-US")}
          </h3>
        </div>
      </div>

      {/* Total Customers */}
      <div className="bg-white border border-border-light rounded-xl p-lg flex flex-col gap-sm hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start">
          <span className="material-symbols-outlined text-brand text-[28px] shrink-0">
            person
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase mb-xs">
            Total Customers
          </p>
          <h3 className="text-2xl font-bold text-on-surface">
            {customersCount.toLocaleString("en-US")}
          </h3>
        </div>
      </div>

      {/* Total Products */}
      <div className="bg-white border border-border-light rounded-xl p-lg flex flex-col gap-sm hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start">
          <span className="material-symbols-outlined text-brand text-[28px] shrink-0">
            inventory_2
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase mb-xs">
            Total Products
          </p>
          <h3 className="text-2xl font-bold text-on-surface">
            {activeProductsCount.toLocaleString("en-US")}
          </h3>
        </div>
      </div>
    </div>
  );
}
