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
          variant === "primary" && "bg-brand text-white hover:bg-brand-hover hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] focus-visible:ring-brand",
          variant === "secondary" && "bg-white text-charcoal border border-charcoal hover:bg-background hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] focus-visible:ring-charcoal",
          variant === "destructive" && "bg-error text-white hover:bg-on-error-container hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] focus-visible:ring-error",
          variant === "ghost" && "text-charcoal hover:bg-surface-container focus-visible:ring-charcoal",
          
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
