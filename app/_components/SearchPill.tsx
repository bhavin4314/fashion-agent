"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function SearchPill() {
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // If customer is logged in, redirect directly to stylist page with the query
        router.push(`/stylist?q=${encodeURIComponent(query.trim())}`);
      } else {
        // For non-logged user, redirect to login page with redirect URL parameter
        const targetUrl = `/stylist?q=${encodeURIComponent(query.trim())}`;
        router.push(`/login?redirect=${encodeURIComponent(targetUrl)}`);
      }
    } catch (error) {
      console.error("Error checking auth status in SearchPill:", error);
      // Fallback redirect to stylist page
      router.push(`/stylist?q=${encodeURIComponent(query.trim())}`);
    }
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
        className="bg-brand hover:bg-brand-hover text-white p-4 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-md border-none cursor-pointer"
        aria-label="Search styles"
      >
        <Search className="h-5 w-5 text-white font-bold" />
      </button>
    </form>
  );
}
