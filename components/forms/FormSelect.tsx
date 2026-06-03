"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  className?: string;
}

export function FormSelect({
  name,
  label,
  options,
  placeholder = "Select an option",
  description,
  className,
}: FormSelectProps) {
  const {
    control,
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
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            options={options}
            placeholder={placeholder}
            id={name}
            value={field.value as string}
            onChange={field.onChange}
            disabled={field.disabled}
          />
        )}
      />
      {error?.message && (
        <p id={`${name}-error`} role="alert" className="text-xs text-red-600">
          {String(error.message)}
        </p>
      )}
    </div>
  );
}
