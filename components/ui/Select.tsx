import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ options, placeholder = "Select an option", value, onChange, id, className, disabled, ...props }, ref) => {
    return (
      <SelectPrimitive.Root value={value} onValueChange={onChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          id={id}
          ref={ref}
          className={cn(
            "flex h-10 w-full items-center justify-between bg-white px-3 py-2 text-sm text-on-surface transition-colors duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50",
            // Spec from DESIGN.md:
            // 1px Cloud Gray border, transitioning to Mine Shaft Charcoal on focus.
            // 12px rounded corners (rounded-xl).
            "border border-border-light focus:border-charcoal data-[state=open]:border-charcoal rounded-xl",
            className
          )}
          {...props}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 text-secondary opacity-50" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "relative z-[150] min-w-[8rem] overflow-hidden bg-white text-on-surface shadow-[0px_12px_28px_rgba(0,0,0,0.15)] rounded-xl border border-border-light",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            )}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="p-1 h-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm outline-none transition-colors duration-150 text-on-surface",
                    "focus:bg-surface-container focus:text-on-surface data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  )}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                     <SelectPrimitive.ItemIndicator>
                      <Check className="h-4 w-4 text-brand" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  }
);

Select.displayName = "Select";
