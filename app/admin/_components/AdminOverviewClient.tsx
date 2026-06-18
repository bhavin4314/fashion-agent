"use client";

import * as React from "react";
import {
  Search,
  Bell,
  HelpCircle,
  IndianRupee,
  Shirt,
  Sparkle,
  Users,
  Plus
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "styling" | "inventory" | "customer" | "order";
  title: string;
  detail: string;
  time: string;
}

interface FeaturedItem {
  id: string;
  designer: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
}

const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    type: "styling",
    title: "Styling Request",
    detail: "Evening Gala for User #9421",
    time: "2 minutes ago",
  },
  {
    id: "act-2",
    type: "inventory",
    title: "Inventory Update",
    detail: "Hermès Birkin 25 Gold added",
    time: "45 minutes ago",
  },
  {
    id: "act-3",
    type: "customer",
    title: "New Customer Registered",
    detail: "Elena Petrov",
    time: "2 hours ago",
  },
  {
    id: "act-4",
    type: "order",
    title: "Order Shipped",
    detail: "Order #VST-1088 to Milan",
    time: "5 hours ago",
  },
  {
    id: "act-5",
    type: "styling",
    title: "Styling Completed",
    detail: "Vacation Wardrobe for User #3312",
    time: "Yesterday",
  },
];

// Interactive styling engagement data points
const CHART_DATA = [
  { day: "Mon", value: 120, x: 50, y: 150 },
  { day: "Tue", value: 180, x: 166, y: 120 },
  { day: "Wed", value: 140, x: 282, y: 140 },
  { day: "Thu", value: 290, x: 398, y: 60 },
  { day: "Fri", value: 220, x: 514, y: 95 },
  { day: "Sat", value: 310, x: 630, y: 45 },
  { day: "Sun", value: 380, x: 746, y: 15 },
];

interface AdminOverviewClientProps {
  stats: {
    totalRevenue: number;
    activeProductsCount: number;
    customersCount: number;
  };
}

export function AdminOverviewClient({ stats }: AdminOverviewClientProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [hoveredDotIndex, setHoveredDotIndex] = React.useState<number | null>(null);



  const handleCreateProduct = () => {
    window.location.href = "/admin/inventory/create";
  };

  return (
    <div className="flex flex-col flex-grow select-none w-full min-h-screen">
      {/* TopAppBar Navigation */}
      <header className="flex justify-between items-center w-full px-margin-desktop py-md bg-white border-b border-secondary-container z-40 select-none">
        <div className="flex items-center flex-1">
          <div
            className={`relative w-96 flex items-center bg-surface-container-low rounded-xl px-md transition-all duration-200 border ${
              isSearchFocused
                ? "border-primary ring-2 ring-primary/10 bg-white"
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
          <div className="flex items-center gap-sm shrink-0">
            <button
              onClick={() => alert("Notification panel represents clean curate logs.")}
              className="p-2 hover:bg-surface-container-low rounded-full transition-all text-on-surface-variant border-none bg-transparent cursor-pointer shrink-0"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              onClick={() => alert("Stylist Support Center. Contact milan-concierge@vistra.ai")}
              className="p-2 hover:bg-surface-container-low rounded-full transition-all text-on-surface-variant border-none bg-transparent cursor-pointer shrink-0"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
          <div className="h-8 w-px bg-secondary-container mx-sm"></div>

          <button
            onClick={handleCreateProduct}
            className="bg-primary hover:bg-primary-dark text-white px-lg py-2.5 rounded-xl text-xs font-bold hover:shadow-lg transition-all active:scale-[0.98] border-none cursor-pointer tracking-wider flex items-center gap-1"
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
          <div className="flex flex-col gap-xs mb-lg select-none">
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Dashboard</h2>
            <p className="text-sm font-medium text-on-surface-variant opacity-80">
              Welcome back. Here is what is happening with Vistra today.
            </p>
          </div>

          {/* Bento Style Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
            {/* Total Revenue */}
            <div className="bg-white border border-border-light rounded-2xl p-xl flex flex-col justify-between min-h-[140px] transition-all hover:shadow-lg duration-300">
              <div className="flex justify-between items-start select-none">
                <span className="p-3 bg-primary-light-bg text-primary rounded-xl">
                  <IndianRupee className="w-6 h-6" />
                </span>
                <span className="bg-primary-fixed text-primary px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                  +12.5%
                </span>
              </div>
              <div className="mt-4 select-none">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                  Total Revenue
                </p>
                <h3 className="text-2xl font-black text-charcoal mt-1">
                  ₹{stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>

            {/* Active Products */}
            <div className="bg-white border border-border-light rounded-2xl p-xl flex flex-col justify-between min-h-[140px] transition-all hover:shadow-lg duration-300">
              <div className="flex justify-between items-start select-none">
                <span className="p-3 bg-primary-light-bg text-primary rounded-xl">
                  <Shirt className="w-6 h-6" />
                </span>
                <span className="bg-surface-container text-secondary px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                  Active
                </span>
              </div>
              <div className="mt-4 select-none">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                  Active Products
                </p>
                <h3 className="text-2xl font-black text-charcoal mt-1">
                  {stats.activeProductsCount.toLocaleString("en-US")}
                </h3>
              </div>
            </div>

            {/* AI Styling Requests */}
            <div className="bg-white border border-border-light rounded-2xl p-xl flex flex-col justify-between min-h-[140px] transition-all hover:shadow-lg duration-300">
              <div className="flex justify-between items-start select-none">
                <span className="p-3 bg-primary-light-bg text-primary rounded-xl animate-pulse">
                  <Sparkle className="w-6 h-6" />
                </span>
                <span className="bg-primary-fixed text-primary px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-0.5">
                  Hot
                </span>
              </div>
              <div className="mt-4 select-none">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                  AI Styling Requests
                </p>
                <h3 className="text-2xl font-black text-charcoal mt-1">842</h3>
              </div>
            </div>

            {/* New Customers */}
            <div className="bg-white border border-border-light rounded-2xl p-xl flex flex-col justify-between min-h-[140px] transition-all hover:shadow-lg duration-300">
              <div className="flex justify-between items-start select-none">
                <span className="p-3 bg-primary-light-bg text-primary rounded-xl">
                  <Users className="w-6 h-6" />
                </span>
                <span className="bg-primary-fixed text-primary px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                  +48
                </span>
              </div>
              <div className="mt-4 select-none">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                  New Customers
                </p>
                <h3 className="text-2xl font-black text-charcoal mt-1">
                  {stats.customersCount.toLocaleString("en-US")}
                </h3>
              </div>
            </div>
          </div>

          {/* Grid Layout for Interactive SVG Chart & Recent Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg select-none">
            {/* SVG Chart Section */}
            <div className="lg:col-span-2 bg-white border border-border-light rounded-2xl p-xl flex flex-col relative select-none">
              <div className="flex justify-between items-center mb-lg">
                <div>
                  <h4 className="text-lg font-black text-charcoal tracking-tight">Styling Engagement</h4>
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wider mt-0.5">
                    Daily AI Stylist interactions over the last 7 days.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-surface-container-low text-charcoal px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    7 Days
                  </button>
                  <button
                    onClick={() => alert("Historical logs currently archived in Milan curation servers.")}
                    className="text-on-surface-variant hover:bg-surface-container-low px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    30 Days
                  </button>
                </div>
              </div>

              {/* Responsive SVG Chart Panel */}
              <div className="relative h-64 w-full flex-grow my-sm select-none">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines matching Stitch */}
                  <line stroke="var(--color-border-light)" strokeWidth="1" x1="0" x2="800" y1="0" y2="0" />
                  <line stroke="var(--color-border-light)" strokeWidth="1" x1="0" x2="800" y1="50" y2="50" />
                  <line stroke="var(--color-border-light)" strokeWidth="1" x1="0" x2="800" y1="100" y2="100" />
                  <line stroke="var(--color-border-light)" strokeWidth="1" x1="0" x2="800" y1="150" y2="150" />
                  <line stroke="var(--color-border-light)" strokeWidth="1" x1="0" x2="800" y1="200" y2="200" />

                  {/* Gradient Area Fill under Bezier line */}
                  <path
                    d="M 50 150 C 100 130, 120 120, 166 120 C 220 120, 240 135, 282 140 C 330 145, 360 80, 398 60 C 440 40, 480 85, 514 95 C 560 110, 590 55, 630 45 C 670 35, 710 20, 746 15 L 746 200 L 50 200 Z"
                    fill="url(#chartGradient)"
                    className="transition-all duration-500"
                  />

                  {/* Curved Bezier Stroke Line */}
                  <path
                    d="M 50 150 C 100 130, 120 120, 166 120 C 220 120, 240 135, 282 140 C 330 145, 360 80, 398 60 C 440 40, 480 85, 514 95 C 560 110, 590 55, 630 45 C 670 35, 710 20, 746 15"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="chart-line"
                  />

                  {/* Datapoints representing hover triggers */}
                  {CHART_DATA.map((pt, index) => {
                    const isHovered = hoveredDotIndex === index;
                    return (
                      <g key={pt.day}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 8 : 4.5}
                          fill="var(--color-primary)"
                          stroke="#ffffff"
                          strokeWidth={isHovered ? 2.5 : 1.5}
                          className="cursor-pointer transition-all duration-150 shadow-sm"
                          onMouseEnter={() => setHoveredDotIndex(index)}
                          onMouseLeave={() => setHoveredDotIndex(null)}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Highly premium absolute interactive Tooltip */}
                {hoveredDotIndex !== null && CHART_DATA[hoveredDotIndex] && (
                  <div
                    className="absolute bg-charcoal text-white rounded-xl py-2 px-3 shadow-2xl pointer-events-none select-none text-[10px] font-bold uppercase tracking-widest border border-white/10"
                    style={{
                      left: `${(CHART_DATA[hoveredDotIndex].x / 800) * 100}%`,
                      top: `${(CHART_DATA[hoveredDotIndex].y / 200) * 100 - 30}%`,
                      transform: "translate(-50%, -50%)",
                      transition: "all 0.1s ease-out",
                    }}
                  >
                    {CHART_DATA[hoveredDotIndex].day}:{" "}
                    <span className="text-brand font-extrabold">
                      {CHART_DATA[hoveredDotIndex].value} requests
                    </span>
                  </div>
                )}
              </div>

              {/* Day Labels */}
              <div className="flex justify-between mt-sm font-extrabold text-[10px] text-on-surface-variant opacity-70 uppercase tracking-widest px-xs select-none">
                {CHART_DATA.map((pt) => (
                  <span key={pt.day}>{pt.day}</span>
                ))}
              </div>
            </div>

            {/* Recent Activity Curation Feed */}
            <div className="bg-white border border-border-light rounded-2xl p-xl flex flex-col select-none">
              <div className="mb-lg flex justify-between items-center">
                <h4 className="text-lg font-black text-charcoal tracking-tight">Recent Activity</h4>
                <button
                  onClick={() => alert("Historical dynamic activities fully loaded.")}
                  className="text-primary font-bold text-xs hover:underline uppercase tracking-wider"
                >
                  View All
                </button>
              </div>

              <div className="flex-1 space-y-md overflow-y-auto max-h-[300px] pr-xs select-none">
                {RECENT_ACTIVITIES.map((act) => {
                  let badgeColor = "bg-primary-light-badge text-primary";
                  if (act.type === "inventory") badgeColor = "bg-surface-container-low text-secondary";
                  if (act.type === "customer") badgeColor = "bg-green-50 text-green-700";
                  if (act.type === "order") badgeColor = "bg-amber-light text-amber-700";

                  return (
                    <div key={act.id} className="flex gap-md group items-start select-none">
                      <span
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${badgeColor}`}
                      >
                        {act.type === "styling" && "AI"}
                        {act.type === "inventory" && "INV"}
                        {act.type === "customer" && "CST"}
                        {act.type === "order" && "SHP"}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <p className="text-xs font-bold text-charcoal leading-tight">
                          {act.title}:{" "}
                          <span className="font-medium text-secondary">{act.detail}</span>
                        </p>
                        <span className="text-[10px] text-secondary tracking-wide mt-1">
                          {act.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
