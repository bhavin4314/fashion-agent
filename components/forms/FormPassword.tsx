"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormPasswordProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  leftIcon?: React.ReactNode;
  rightLabelAction?: React.ReactNode;
  inputClassName?: string;
}

export function FormPassword({
  name,
  label,
  placeholder = "••••••••",
  className,
  leftIcon,
  rightLabelAction,
  inputClassName,
}: FormPasswordProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex justify-between items-center">
        <label htmlFor={name} className="text-sm font-medium text-neutral-800">
          {label}
        </label>
        {rightLabelAction}
      </div>
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-[#5c3f41] pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <Input
          id={name}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={cn("pr-10", leftIcon && "pl-11", inputClassName)}
          {...register(name)}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 h-auto"
          onClick={() => setIsVisible((v) => !v)}
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </Button>
      </div>
      {error?.message && (
        <p id={`${name}-error`} role="alert" className="text-xs text-red-600">
          {String(error.message)}
        </p>
      )}
    </div>
  );
}

