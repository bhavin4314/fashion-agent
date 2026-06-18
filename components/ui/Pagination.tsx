"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  totalCount,
  currentPage,
  itemsPerPage,
  onPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  return (
    <div className={`px-xl py-md bg-surface-container-low border-t border-secondary-container flex items-center justify-between select-none ${className || ""}`}>
      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">
        Showing {totalCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
        {Math.min(totalCount, currentPage * itemsPerPage)} of {totalCount} items
      </p>
      <div className="flex items-center gap-sm">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="p-1.5 bg-white border border-secondary-container hover:border-charcoal disabled:opacity-40 disabled:hover:border-secondary-container rounded-lg transition-all cursor-pointer flex items-center"
        >
          <ChevronLeft className="h-4 w-4 text-charcoal" />
        </button>
        <div className="flex items-center gap-xs">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold cursor-pointer transition-all ${
                currentPage === page
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white border border-secondary-container hover:border-charcoal text-charcoal"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="p-1.5 bg-white border border-secondary-container hover:border-charcoal disabled:opacity-40 disabled:hover:border-secondary-container rounded-lg transition-all cursor-pointer flex items-center"
        >
          <ChevronRight className="h-4 w-4 text-charcoal" />
        </button>
      </div>
    </div>
  );
}
