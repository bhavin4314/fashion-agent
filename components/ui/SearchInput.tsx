"use client";

import * as React from "react";
import { Search } from "lucide-react";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div
      className={`relative w-96 flex items-center bg-surface-container-low rounded-xl px-md transition-all duration-200 border ${
        isFocused ? "border-primary ring-2 ring-primary/10 bg-white" : "border-transparent"
      } ${className || ""}`}
    >
      <Search className="h-4 w-4 text-on-surface-variant shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 min-w-0 pl-sm pr-md bg-transparent border-none text-xs font-semibold text-charcoal focus:outline-none focus:ring-0 placeholder:text-on-surface-variant/50 h-10"
        placeholder={placeholder}
      />
    </div>
  );
}
