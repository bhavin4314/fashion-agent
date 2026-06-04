"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface FormInputProps {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "tel" | "url" | "search";
  placeholder?: string;
  description?: string;
  className?: string;
  leftIcon?: React.ReactNode;
  inputClassName?: string;
  min?: string | number;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
}

export function FormInput({
  name,
  label,
  type = "text",
  placeholder,
  description,
  className,
  leftIcon,
  inputClassName,
  min,
  onKeyDown,
  onPaste,
}: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={name} className="text-sm font-medium text-neutral-800">
        {label}
      </label>
      {description && (
        <p id={`${name}-description`} className="text-xs text-neutral-500">
          {description}
        </p>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-on-surface-variant pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${name}-error` : description ? `${name}-description` : undefined
          }
          className={cn(leftIcon && "pl-11", inputClassName)}
          min={min}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          {...register(name)}
        />
      </div>
      {error?.message && (
        <p id={`${name}-error`} role="alert" className="text-xs text-red-600">
          {String(error.message)}
        </p>
      )}
    </div>
  );
}

