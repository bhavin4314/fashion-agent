import * as React from "react";

interface CategoryRevenue {
  apparel: number;
  footwear: number;
  accessories: number;
}

interface RevenueByCategoryProps {
  categoryRevenue: CategoryRevenue;
}

export function RevenueByCategory({ categoryRevenue }: RevenueByCategoryProps) {
  const total = categoryRevenue.apparel + categoryRevenue.footwear + categoryRevenue.accessories;
  
  const apparelPercent = total > 0 ? Math.round((categoryRevenue.apparel / total) * 100) : 55;
  const footwearPercent = total > 0 ? Math.round((categoryRevenue.footwear / total) * 100) : 30;
  const accessoriesPercent = 100 - apparelPercent - footwearPercent;

  return (
    <div className="bg-white border border-border-light rounded-xl p-xl flex flex-col select-none">
      <h4 className="text-lg font-bold text-on-surface mb-xl">Revenue by Category</h4>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-48 h-48">
          {/* Donut SVG */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle
              className="text-surface-container"
              cx="18"
              cy="18"
              fill="transparent"
              r="15.9155"
              stroke="currentColor"
              strokeWidth="4"
            />
            {/* Apparel */}
            <circle
              className="text-brand"
              cx="18"
              cy="18"
              fill="transparent"
              r="15.9155"
              stroke="currentColor"
              strokeDasharray={`${apparelPercent} 100`}
              strokeDashoffset="0"
              strokeWidth="4"
            />
            {/* Footwear */}
            <circle
              className="text-on-surface-variant"
              cx="18"
              cy="18"
              fill="transparent"
              r="15.9155"
              stroke="currentColor"
              strokeDasharray={`${footwearPercent} 100`}
              strokeDashoffset={`-${apparelPercent}`}
              strokeWidth="4"
            />
            {/* Accessories */}
            <circle
              className="text-secondary-fixed-dim"
              cx="18"
              cy="18"
              fill="transparent"
              r="15.9155"
              stroke="currentColor"
              strokeDasharray={`${accessoriesPercent} 100`}
              strokeDashoffset={`-${apparelPercent + footwearPercent}`}
              strokeWidth="4"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-on-surface">100%</span>
            <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Total Shares
            </span>
          </div>
        </div>

        <div className="mt-xl w-full space-y-md">
          {/* Apparel */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-sm text-xs font-semibold">
              <div className="w-3 h-3 rounded-full bg-brand" />
              <span className="text-on-surface">Apparel</span>
            </div>
            <span className="text-xs font-semibold text-on-surface-variant">
              {apparelPercent}%
            </span>
          </div>
          {/* Footwear */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-sm text-xs font-semibold">
              <div className="w-3 h-3 rounded-full bg-on-surface-variant" />
              <span className="text-on-surface">Footwear</span>
            </div>
            <span className="text-xs font-semibold text-on-surface-variant">
              {footwearPercent}%
            </span>
          </div>
          {/* Accessories */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-sm text-xs font-semibold">
              <div className="w-3 h-3 rounded-full bg-secondary-fixed-dim" />
              <span className="text-on-surface">Accessories</span>
            </div>
            <span className="text-xs font-semibold text-on-surface-variant">
              {accessoriesPercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
