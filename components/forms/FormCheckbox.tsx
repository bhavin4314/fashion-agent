"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils";

interface FormCheckboxProps {
  name: string;
  label: string | React.ReactNode;
  description?: string;
  className?: string;
}

export function FormCheckbox({ name, label, description, className }: FormCheckboxProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex items-start gap-3">
            <Checkbox
              id={name}
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
              disabled={field.disabled}
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
            />
            <div className="flex flex-col gap-0.5">
              <label htmlFor={name} className="text-sm font-medium text-neutral-800 cursor-pointer select-none">
                {label}
              </label>
              {description && (
                <p className="text-xs text-neutral-500">{description}</p>
              )}
            </div>
          </div>
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
