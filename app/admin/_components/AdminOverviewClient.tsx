"use client";

import * as React from "react";
import Image from "next/image";
import {
  Search,
  Bell,
  HelpCircle,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  IndianRupee,
  Shirt,
  Sparkle,
  Users,
  ChevronLeft,
  ChevronRight,
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

const FEATURED_ITEMS: FeaturedItem[] = [
  {
    id: "feat-1",
    designer: "Loro Piana",
    name: "Silk Evening Gown",
    price: 4200,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKJZGEXi7-WXNbjqneE4rDNHBpoax1JYBPU1cBR2RsmpEUULna5DUcfcdPVX1YVwy-f78MYjeJhvIeziuaC4_epJmChu3vvWmYWrqabg10Hos7PGXRSRh68xfJATKiBaIx99BOJNmyT4pyvAGz-LSxKx4y9jzyFseAlHREST2W_P42RJOOLelf42uUXKzdM8pnvLubVvedIt8Tu8WezLMI9iUAabBaIrFDP2r1RhyiazjP1HShr9029mjhRozCaRNeoHscT-Mg-fpD",
    isNew: true,
  },
  {
    id: "feat-2",
    designer: "The Row",
    name: "Margaux 15 Bag",
    price: 5800,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCiahCGQx9w2TYOdicl54WxbYgl-z_b34hbGTb6OQpigngIdbhe2wwmw58bXOCvaNz6OQSPoJMUUtBNV9g9yb1v8YvDn7PqwCiGhQ4xZDowJJL7uxWOSnbbmt5WmzyCmFWbgjgsp2zmusLJY0CxWk1vEptJfyZ5vu9uiOP-gIToG2oSlzIvEDHMF6v0Hx3_GwTVmoalscDjoNo4U6k7hRbpr7wKtyl98Ze9ixAfSaet6sjpUTk18Jk76l5l9rxn6riu8c9RDvqdQXf",
  },
  {
    id: "feat-3",
    designer: "Saint Laurent",
    name: "Le Loafer 15",
    price: 895,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtEYJpt8rFU2Os8CB3s62upgFuH93j0yFf2FwQfWmHNYLMdjlz-2Ir6sRHGSHxStx2kx2ouW4J2f3c_4ywJgcb4Oh7Hhya1dCP2dj0tnWSku2GbUwrX2e-DwgHD1EYVGIGdTMFscqGtmlUhZTYDV7w23pYLloWUoX2FOTek9TNGbn_Q8hAdaFMo_-FtzbmEoeEgunzButtbMDCj4zkE0dNPmxKjSra0nwqKJFY8LhgYqn9PS6atCTORnx3t7XULycTI4Zfo1FTGr9O",
  },
  {
    id: "feat-4",
    designer: "Celine",
    name: "Triomphe Sunglasses",
    price: 510,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSvKTDw_TPM5V23o4nlBYhWVrG3rxI60fTv12TC2pjSmwFxP-paNkr3c6n6VxN9GwNygeTDGf0wcWqFUD7MRHyVT55PClEOzTtURezx7ATuJiinZW_Mu1cpF_-QvuL-Quz-PuU9_tCxg3jnlCigTwg8ZeO71o3kV7mLrsdsqShr_0QOabuXAudy0uHQvlgrclrg0yF7k3iRRnQZ58bOAFKvybaoQH0YWJTzeKu5vJi_U-Kq7jP_BEjgubtT_8qNu57E-78sI-8L7vC",
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

export function AdminOverviewClient() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [hoveredDotIndex, setHoveredDotIndex] = React.useState<number | null>(null);

  // Dynamic search suggestion states
  const filteredFeatured = React.useMemo(() => {
    if (!searchQuery.trim()) return FEATURED_ITEMS;
    return FEATURED_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.designer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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
              onClick={() => alert("Curator Support Center. Contact milan-concierge@vistra.ai")}
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
                <h3 className="text-2xl font-black text-charcoal mt-1">₹142,850.00</h3>
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
                <h3 className="text-2xl font-black text-charcoal mt-1">3,240</h3>
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
                <h3 className="text-2xl font-black text-charcoal mt-1">156</h3>
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

          {/* Featured Curation: Recent Inventory Arrivals */}
          <section className="select-none">
            <div className="flex justify-between items-center mb-xl">
              <div>
                <h4 className="text-lg font-black text-charcoal tracking-tight">Recent Inventory Additions</h4>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mt-0.5">
                  Exclusive luxury items recently verified into the Vistra concierge catalog.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => alert("Slide view is fully optimized.")}
                  className="hover:text-black hover:border-black transition-all border border-secondary-container p-2 rounded-full cursor-pointer flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4 text-charcoal" />
                </button>
                <button
                  onClick={() => alert("Slide view is fully optimized.")}
                  className="hover:text-black hover:border-black transition-all border border-secondary-container p-2 rounded-full cursor-pointer flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4 text-charcoal" />
                </button>
              </div>
            </div>

            {/* Grid display for arrivals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-lg">
              {filteredFeatured.map((item) => (
                <div key={item.id} className="flex flex-col gap-sm select-none group">
                  <div className="aspect-[4/5] bg-stone-100 rounded-2xl overflow-hidden relative border border-border-light shadow-sm select-none shrink-0">
                    <Image
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none select-none"
                      src={item.image}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                      unoptimized
                    />
                    {item.isNew && (
                      <div className="absolute top-md right-md bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl font-extrabold text-[9px] uppercase tracking-widest text-primary shadow-sm select-none">
                        New
                      </div>
                    )}
                  </div>
                  <div className="mt-2 select-none">
                    <p className="text-[10px] font-extrabold text-secondary uppercase tracking-widest leading-none">
                      {item.designer}
                    </p>
                    <p className="text-xs font-bold text-charcoal mt-1 truncate">{item.name}</p>
                    <p className="text-xs font-black text-primary mt-1.5 leading-none">
                      ₹{item.price.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
              ))}

              {filteredFeatured.length === 0 && (
                <div className="col-span-full py-xxl bg-white border border-border-light rounded-2xl text-center text-xs font-bold text-secondary select-none">
                  No arrivals found matching current search query filters.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
