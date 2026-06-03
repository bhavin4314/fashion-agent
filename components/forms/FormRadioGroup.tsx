"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { cn } from "@/lib/utils";

interface RadioOption {
  label: string;
  value: string;
  description?: string;
}

interface FormRadioGroupProps {
  name: string;
  label: string;
  options: RadioOption[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function FormRadioGroup({
  name,
  label,
  options,
  orientation = "vertical",
  className,
}: FormRadioGroupProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-sm font-medium text-neutral-800">{label}</span>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value as string}
            onValueChange={field.onChange}
            disabled={field.disabled}
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            className={cn(
              orientation === "horizontal" ? "flex flex-row gap-4" : "flex flex-col gap-2"
            )}
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem id={`${name}-${option.value}`} value={option.value} />
                <label
                  htmlFor={`${name}-${option.value}`}
                  className="text-sm text-neutral-700 cursor-pointer select-none"
                >
                  {option.label}
                  {option.description && (
                    <span className="block text-xs text-neutral-500">{option.description}</span>
                  )}
                </label>
              </div>
            ))}
          </RadioGroup>
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
