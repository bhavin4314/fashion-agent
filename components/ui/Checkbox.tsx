import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "peer h-5 w-5 shrink-0 bg-white transition-colors duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50",
          // Spec from DESIGN.md:
          // 1px border. Checked state uses Radical Coral (#ff385c) background and border.
          // 4px-8px rounded corners (rounded-lg or rounded-md).
          "border border-[#ebebeb] rounded-lg",
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ff385c]",
          "data-[state=checked]:bg-[#ff385c] data-[state=checked]:border-[#ff385c] data-[state=checked]:text-white",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  }
);

Checkbox.displayName = "Checkbox";
