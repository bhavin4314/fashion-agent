"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";

interface FormTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  description?: string;
  className?: string;
  inputClassName?: string;
}

export function FormTextarea({
  name,
  label,
  placeholder,
  rows = 4,
  maxLength,
  description,
  className,
  inputClassName,
}: FormTextareaProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];
  const currentLength = (watch(name) as string | undefined)?.length ?? 0;

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
      <Textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClassName}
        {...register(name)}
      />
      <div className="flex items-center justify-between">
        {error?.message ? (
          <p id={`${name}-error`} role="alert" className="text-xs text-red-600">
            {String(error.message)}
          </p>
        ) : (
          <span />
        )}
        {maxLength && (
          <span className="text-xs text-neutral-400">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
