"use client";

import * as React from "react";
import { Search } from "lucide-react";

export function SearchPill() {
  const [query, setQuery] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    console.log("Searching for style:", query);
    alert(`Style query submitted: "${query}" (AI stylist coordination coming soon!)`);
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="search-pill bg-white rounded-full p-2 flex items-center gap-md max-w-2xl mx-auto border border-border-light shadow-md"
    >
      <div className="flex-1 px-lg flex items-center gap-sm">
        <Search className="h-5 w-5 text-charcoal shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border-none focus:outline-none focus:ring-0 bg-transparent text-base font-medium placeholder:text-muted h-10 select-text"
          placeholder="What style are you looking for today?"
          type="text"
        />
      </div>
      <button
        type="submit"
        className="bg-[#ff385c] hover:bg-[#E31C5F] text-white p-4 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-md border-none cursor-pointer"
        aria-label="Search styles"
      >
        <Search className="h-5 w-5 text-white font-bold" />
      </button>
    </form>
  );
}
