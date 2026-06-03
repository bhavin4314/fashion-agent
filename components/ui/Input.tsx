import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full bg-white px-3 py-2 text-sm text-[#1a1c1c] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#5f5e5e]/50 disabled:cursor-not-allowed disabled:opacity-50 outline-none transition-colors duration-200",
          // Spec from DESIGN.md:
          // 1px Cloud Gray (#EBEBEB) border.
          // On focus, border transitions to Mine Shaft Charcoal (#222222).
          // 12px rounded corners ("rounded-xl" in tailwind matches 12px).
          "border border-[#ebebeb] focus:border-[#222222] rounded-xl",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
