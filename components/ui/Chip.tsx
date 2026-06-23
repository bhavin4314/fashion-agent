import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "badge" | "flat";
  color?: "default" | "success" | "warning" | "error" | "info" | "primary" | "secondary" | "purple";
  className?: string;
}

export function Chip({
  label,
  icon,
  variant = "badge",
  color = "default",
  className,
  ...props
}: ChipProps) {
  const colorMap = {
    default: "bg-surface-container-highest text-charcoal",
    success: "bg-success-green/10 text-success-green",
    primary: "bg-primary/10 text-primary",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    secondary: "bg-stone-100 text-stone-800",
    purple: "bg-purple-100 text-purple-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-xs select-none",
        variant === "badge"
          ? cn("px-sm py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider", colorMap[color])
          : "text-xs font-bold",
        className
      )}
      {...props}
    >
      {icon && <span className="flex items-center shrink-0">{icon}</span>}
      <span>{label}</span>
    </span>
  );
}
