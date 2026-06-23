"use client";

import * as React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  onDelete?: () => void;
  showDeleteAtOne?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
  uppercaseLabel?: boolean;
  stockQuantity?: number;
}

export function QuantityInput({
  value,
  onChange,
  onDelete,
  showDeleteAtOne,
  className,
  size = "md",
  label,
  uppercaseLabel,
  stockQuantity,
}: QuantityInputProps) {
  const [localVal, setLocalVal] = React.useState<string>(String(value));

  React.useEffect(() => {
    setLocalVal(String(value));
  }, [value]);

  const showStockError = (limit: number) => {
    toast.dismiss();
    toast.error(`Only ${limit} units of this item are available in stock.`);
  };

  const handleBlur = () => {
    const parsed = parseInt(localVal, 10);
    if (isNaN(parsed) || parsed < 1) {
      setLocalVal(String(value));
      onChange(value);
    } else {
      if (stockQuantity !== undefined && parsed > stockQuantity) {
        showStockError(stockQuantity);
        const clamped = stockQuantity;
        setLocalVal(String(clamped));
        onChange(clamped);
      } else {
        setLocalVal(String(parsed));
        onChange(parsed);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalVal(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      if (stockQuantity !== undefined && parsed > stockQuantity) {
        showStockError(stockQuantity);
        const clamped = stockQuantity;
        setLocalVal(String(clamped));
        onChange(clamped);
      } else {
        onChange(parsed);
      }
    }
  };

  const handleDecrement = () => {
    if (value === 1) {
      if (showDeleteAtOne && onDelete) {
        onDelete();
      }
      return;
    }
    const newVal = value - 1;
    setLocalVal(String(newVal));
    onChange(newVal);
  };

  const handleIncrement = () => {
    const newVal = value + 1;
    if (stockQuantity !== undefined && newVal > stockQuantity) {
      showStockError(stockQuantity);
      return;
    }
    setLocalVal(String(newVal));
    onChange(newVal);
  };

  const heightClass =
    size === "sm" ? "h-8" : size === "lg" ? "h-12" : "h-10";

  const isOutOfStock = stockQuantity !== undefined && stockQuantity <= 0;
  const showLowStock = stockQuantity !== undefined && stockQuantity > 0 && stockQuantity <= 5;
  const showAdvanced = label !== undefined;

  const isTrash = showDeleteAtOne && value === 1;

  const inputEl = (
    <div
      className={cn(
        "flex items-center border border-border-light rounded-xl bg-stone-50 overflow-hidden w-32",
        heightClass,
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= 1 && !showDeleteAtOne}
        className="w-10 h-full hover:bg-neutral-200 disabled:hover:bg-transparent disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center text-secondary hover:text-red-650"
        aria-label={isTrash ? "Remove item" : "Decrease quantity"}
      >
        {isTrash ? (
          <Trash2 className={cn("text-red-500", size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")} />
        ) : (
          <Minus className={cn("text-secondary", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
        )}
      </button>
      <input
        type="number"
        min="1"
        value={localVal}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(
          "w-12 h-full text-center font-bold bg-transparent border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-charcoal",
          size === "sm" ? "text-xs" : "text-sm"
        )}
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={stockQuantity !== undefined && value >= stockQuantity}
        className="w-10 h-full hover:bg-neutral-200 disabled:hover:bg-transparent disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center"
        aria-label="Increase quantity"
      >
        <Plus className={cn("text-secondary", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
      </button>
    </div>
  );

  if (!showAdvanced) {
    return inputEl;
  }

  // Label styling
  const labelClass = size === "lg"
    ? "text-sm font-bold text-on-surface font-semibold text-charcoal"
    : cn(
        "text-xs font-bold text-charcoal tracking-wide",
        uppercaseLabel ? "uppercase" : ""
      );

  // Out of Stock styling
  const outOfStockEl = size === "lg" ? (
    <span className="text-sm font-bold text-red-600">Out of Stock</span>
  ) : (
    <span className={cn(
      "text-xs font-bold text-red-600 tracking-wide",
      uppercaseLabel ? "uppercase" : ""
    )}>
      Out of Stock
    </span>
  );

  return (
    <div className="flex flex-col gap-sm border-t border-surface-container pt-md">
      <div className="flex justify-between items-center w-full">
        {label && <span className={labelClass}>{label}</span>}
        {showLowStock && (
          <span className="text-xs text-red-600 font-bold animate-pulse">
            Only {stockQuantity} left!
          </span>
        )}
      </div>
      {isOutOfStock ? outOfStockEl : inputEl}
    </div>
  );
}
