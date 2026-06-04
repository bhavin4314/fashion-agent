import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full bg-white px-3 py-2 text-sm text-on-surface placeholder:text-secondary/50 disabled:cursor-not-allowed disabled:opacity-50 outline-none transition-colors duration-200",
          // Spec from DESIGN.md:
          // 1px Cloud Gray border.
          // On focus, border transitions to Mine Shaft Charcoal.
          // 12px rounded corners (rounded-xl).
          "border border-border-light focus:border-charcoal rounded-xl resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
