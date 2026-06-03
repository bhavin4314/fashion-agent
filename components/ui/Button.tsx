import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          // Typography and Shapes from DESIGN.md:
          // 12px rounded corners ("rounded-xl" in tailwind is 12px/0.75rem)
          // Font weight semi-bold / text-sm (14px font size matches label-md)
          "rounded-xl select-none",
          
          // Variants from DESIGN.md
          variant === "primary" && "bg-[#ff385c] text-white hover:bg-[#e02d4f] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] focus-visible:ring-[#ff385c]",
          variant === "secondary" && "bg-white text-[#222222] border border-[#222222] hover:bg-[#f9f9f9] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] focus-visible:ring-[#222222]",
          variant === "destructive" && "bg-[#ba1a1a] text-white hover:bg-[#93000a] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] focus-visible:ring-[#ba1a1a]",
          variant === "ghost" && "text-[#222222] hover:bg-[#eeeeee] focus-visible:ring-[#222222]",
          
          // Sizes
          size === "sm" && "px-3 py-1.5 text-xs",
          size === "md" && "px-5 py-2.5 text-sm", // 14px / label-md matches this size
          size === "lg" && "px-6 py-3 text-base",
          
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
