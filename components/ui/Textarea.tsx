import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full bg-white px-3 py-2 text-sm text-[#1a1c1c] placeholder:text-[#5f5e5e]/50 disabled:cursor-not-allowed disabled:opacity-50 outline-none transition-colors duration-200",
          // Spec from DESIGN.md:
          // 1px Cloud Gray (#EBEBEB) border.
          // On focus, border transitions to Mine Shaft Charcoal (#222222).
          // 12px rounded corners (rounded-xl).
          "border border-[#ebebeb] focus:border-[#222222] rounded-xl resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
