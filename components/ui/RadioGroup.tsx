import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <RadioGroupPrimitive.Root
        className={cn("grid gap-2", className)}
        {...props}
        ref={ref}
      />
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {}

export const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          "aspect-square h-5 w-5 rounded-full bg-white transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50",
          // Spec from DESIGN.md:
          // 1px border. Selected uses Radical Coral (#ff385c) background/border or inner indicator.
          "border border-[#ebebeb] text-[#ff385c] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ff385c]",
          "data-[state=checked]:border-[#ff385c]",
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className="h-2.5 w-2.5 fill-current text-[#ff385c]" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";
