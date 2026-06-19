"use client";

import * as React from "react";
import { createClient } from "@/utils/supabase/client";

interface TrendPoint {
  day: string;
  value: number;
  x: number;
  y: number;
}

interface RevenueTrendProps {
  dailyTrend: TrendPoint[];
}

export function RevenueTrend({ dailyTrend }: RevenueTrendProps) {
  const [timeRange, setTimeRange] = React.useState<"7" | "30">("7");
  const [trend30Days, setTrend30Days] = React.useState<TrendPoint[]>([]);
  const [isLoading30, setIsLoading30] = React.useState(false);
  const [hoveredDotIndex, setHoveredDotIndex] = React.useState<number | null>(null);

  // Fetch 30-day data on-demand when "30" is selected and not already loaded
  React.useEffect(() => {
    if (timeRange === "30" && trend30Days.length === 0) {
      const fetch30Days = async () => {
        setIsLoading30(true);
        try {
          const supabase = createClient();
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const { data: trendOrders } = await supabase
            .from("orders")
            .select("created_at, total_amount")
            .eq("payment_status", "paid")
            .gte("created_at", thirtyDaysAgo.toISOString())
            .order("created_at", { ascending: true });

          const trendDataMap: { [key: string]: number } = {};
          const labels: string[] = [];
          
          // Generate 30 days labels
          for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayLabel = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
            trendDataMap[dayLabel] = 0;
            labels.push(dayLabel);
          }

          if (trendOrders) {
            for (const order of trendOrders) {
              const date = new Date(order.created_at);
              const dayLabel = date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
              if (dayLabel in trendDataMap) {
                trendDataMap[dayLabel] += Number(order.total_amount);
              }
            }
          }

          const maxTrendVal = Math.max(...Object.values(trendDataMap), 1000);
          const trend30 = labels.map((day, idx) => {
            const value = trendDataMap[day] || 0;
            const x = 50 + (idx / 29) * 700;
            const y = 180 - (value / maxTrendVal) * 165;
            return {
              day,
              value,
              x: Math.round(x),
              y: Math.round(y),
            };
          });

          setTrend30Days(trend30);
        } catch (e) {
          console.error("Failed to fetch 30-day trend data:", e);
        } finally {
          setIsLoading30(false);
        }
      };

      fetch30Days();
    }
  }, [timeRange, trend30Days]);

  const currentTrend = timeRange === "7" ? dailyTrend : trend30Days;

  // Generate SVG path for the line
  const pathD = currentTrend.length > 0
    ? currentTrend.map((pt, idx) => `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`).join(" ")
    : "";

  // Generate SVG path for the filled gradient area underneath
  const areaD = currentTrend.length > 0
    ? `${pathD} L ${currentTrend[currentTrend.length - 1]?.x} 200 L ${currentTrend[0]?.x} 200 Z`
    : "";

  return (
    <div className="bg-white border border-border-light rounded-xl p-xl flex flex-col relative select-none">
      <div className="flex justify-between items-center mb-xl">
        <div>
          <h4 className="text-lg font-bold text-on-surface tracking-tight">Revenue Trend</h4>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
            Daily sales performance
          </p>
        </div>
        <div className="flex bg-surface-container-low p-xs rounded-lg select-none">
          <button
            onClick={() => setTimeRange("7")}
            className={`px-md py-sm rounded-md text-xs font-bold transition-all cursor-pointer border-none ${
              timeRange === "7"
                ? "bg-white shadow-sm text-brand"
                : "text-on-surface-variant hover:text-on-surface bg-transparent"
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange("30")}
            className={`px-md py-sm rounded-md text-xs font-bold transition-all cursor-pointer border-none ${
              timeRange === "30"
                ? "bg-white shadow-sm text-brand"
                : "text-on-surface-variant hover:text-on-surface bg-transparent"
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      <div className="relative h-72 w-full pt-md">
        {isLoading30 ? (
          <div className="h-full flex flex-col items-center justify-center text-xs text-on-surface-variant gap-2 animate-pulse">
            <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
            <span>Fetching 30-day analytics...</span>
          </div>
        ) : currentTrend.length > 0 ? (
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200">
            <defs>
              <linearGradient id="revenueGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#FF385C" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#FF385C" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line stroke="#EBEBEB" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="0" y2="0" />
            <line stroke="#EBEBEB" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="50" y2="50" />
            <line stroke="#EBEBEB" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="100" y2="100" />
            <line stroke="#EBEBEB" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="150" y2="150" />

            {/* Area Fill */}
            <path d={areaD} fill="url(#revenueGradient)" className="transition-all duration-300" />

            {/* Stroke Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#FF385C"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-300"
            />

            {/* Interactive Dots */}
            {currentTrend.map((pt, index) => {
              const isHovered = hoveredDotIndex === index;
              return (
                <g key={pt.day}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4}
                    fill="#FF385C"
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 2 : 1.5}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredDotIndex(index)}
                    onMouseLeave={() => setHoveredDotIndex(null)}
                  />
                </g>
              );
            })}
          </svg>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-on-surface-variant">
            No sales data available.
          </div>
        )}

        {/* Dynamic Tooltip */}
        {hoveredDotIndex !== null && currentTrend[hoveredDotIndex] && (
          <div
            className="absolute bg-charcoal text-white rounded-lg py-1.5 px-3.5 shadow-xl pointer-events-none select-none text-[10px] font-bold uppercase tracking-widest border border-white/10"
            style={{
              left: `${(currentTrend[hoveredDotIndex].x / 800) * 100}%`,
              top: `${(currentTrend[hoveredDotIndex].y / 200) * 100 - 15}%`,
              transform: "translate(-50%, -100%)",
              transition: "left 0.1s ease-out, top 0.1s ease-out",
            }}
          >
            {currentTrend[hoveredDotIndex].day}:{" "}
            <span className="text-brand font-extrabold">
              ₹{currentTrend[hoveredDotIndex].value.toLocaleString("en-US")}
            </span>
          </div>
        )}
      </div>

      {/* Day Labels */}
      <div className="relative mt-lg h-5 font-semibold text-[10px] text-on-surface-variant select-none">
        {currentTrend.map((pt, idx) => {
          const shouldShowLabel = timeRange === "7" || idx === 0 || idx === currentTrend.length - 1 || idx % 6 === 0;
          if (!shouldShowLabel) return null;
          return (
            <span
              key={pt.day}
              className="absolute -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${(pt.x / 800) * 100}%` }}
            >
              {pt.day}
            </span>
          );
        })}
      </div>
    </div>
  );
}
