"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FileUpload } from "@/components/ui/FileUpload";
import { cn } from "@/lib/utils";

interface FormFileUploadProps {
  name: string;
  label: string;
  accept?: string;
  maxSizeMB?: number;
  description?: string;
  className?: string;
}

export function FormFileUpload({
  name,
  label,
  accept,
  maxSizeMB,
  description,
  className,
}: FormFileUploadProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-neutral-800">{label}</label>
      {description && (
        <p className="text-xs text-neutral-500">{description}</p>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <FileUpload
            accept={accept}
            maxSizeMB={maxSizeMB}
            value={value as File | undefined}
            onChange={onChange}
            aria-invalid={!!error}
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
