"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface ChipOption {
  label: string;
  value: string;
}

interface FormChipsProps {
  name: string;
  label?: string;
  options: readonly string[] | readonly ChipOption[];
  multiple?: boolean;
  allowCustom?: boolean;
  customPlaceholder?: string;
  variant?: "chips" | "segmented";
  description?: string;
  className?: string;
  onChange?: (value: string | string[] | null) => void;
}

export function FormChips({
  name,
  label,
  options,
  multiple = false,
  allowCustom = false,
  customPlaceholder = "Add custom...",
  variant = "chips",
  description,
  className,
  onChange: customOnChange,
}: FormChipsProps) {
  const { control, watch, formState: { errors } } = useFormContext();
  const error = errors[name];

  const [customInputValue, setCustomInputValue] = React.useState("");
  const [addedCustomOptions, setAddedCustomOptions] = React.useState<string[]>([]);

  const fieldValue = watch(name);

  // Normalize options to { label: string, value: string }
  const normalizedOptions = React.useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "string") {
        return { label: opt, value: opt };
      }
      return opt;
    });
  }, [options]);

  // Sync custom options from field value as they get added or hydrated
  React.useEffect(() => {
    if (fieldValue !== undefined && fieldValue !== null) {
      if (multiple && Array.isArray(fieldValue)) {
        const customVals = fieldValue.filter(
          (val) => !normalizedOptions.some((opt) => opt.value === val)
        );
        if (customVals.length > 0) {
          setAddedCustomOptions((prev) => {
            const merged = [...prev];
            customVals.forEach((val) => {
              if (!merged.includes(val)) {
                merged.push(val);
              }
            });
            return merged;
          });
        }
      } else if (!multiple && typeof fieldValue === "string" && fieldValue !== "") {
        const isPreset = normalizedOptions.some((opt) => opt.value === fieldValue);
        if (!isPreset) {
          setAddedCustomOptions((prev) => (prev.includes(fieldValue) ? prev : [fieldValue]));
        }
      }
    }
  }, [fieldValue, multiple, normalizedOptions]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const value = field.value as string | string[] | null | undefined;

        // Helper to check if a value is selected
        const isSelected = (val: string) => {
          if (multiple) {
            return Array.isArray(value) && value.includes(val);
          }
          return value === val;
        };

        // Helper to toggle a value
        const handleToggle = (val: string) => {
          let newValue: string | string[] | null;
          if (multiple) {
            const currentArray = Array.isArray(value) ? value : [];
            if (currentArray.includes(val)) {
              newValue = currentArray.filter((v) => v !== val);
            } else {
              newValue = [...currentArray, val];
            }
          } else {
            newValue = value === val ? null : val;
          }

          field.onChange(newValue);
          if (customOnChange) {
            customOnChange(newValue);
          }
        };

        // Helper to add custom value
        const handleAddCustom = (e: React.FormEvent) => {
          e.preventDefault();
          const trimmed = customInputValue.trim();
          if (!trimmed) return;

          let newValue: string | string[] | null;
          if (multiple) {
            const currentArray = Array.isArray(value) ? value : [];
            if (!currentArray.includes(trimmed)) {
              newValue = [...currentArray, trimmed];
            } else {
              newValue = currentArray;
            }
          } else {
            newValue = trimmed;
          }

          field.onChange(newValue);
          if (customOnChange) {
            customOnChange(newValue);
          }
          setCustomInputValue("");
        };

        // Helper to handle text input typing for single-select custom overrides
        const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value || null;
          field.onChange(val);
          if (customOnChange) {
            customOnChange(val);
          }
        };



        return (
          <div className={cn("flex flex-col gap-1.5 w-full", className)}>
            {label && (
              <label htmlFor={name} className="text-sm font-medium text-neutral-800">
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-neutral-500">{description}</p>
            )}

            {variant === "segmented" ? (
              <div className="flex bg-surface-container-low p-1 rounded-xl border border-secondary-container/60 w-full">
                {normalizedOptions.map((opt) => {
                  const active = isSelected(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleToggle(opt.value)}
                      className={cn(
                        "flex-grow text-center py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer",
                        active
                          ? "bg-white text-primary shadow-sm"
                          : "text-secondary hover:text-charcoal bg-transparent"
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-md">
                <div className="flex flex-wrap gap-sm">
                  {normalizedOptions.map((opt) => {
                    const active = isSelected(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleToggle(opt.value)}
                        className={cn(
                          "px-lg py-2.5 rounded-xl transition-all font-semibold text-xs border cursor-pointer",
                          active
                            ? "bg-primary text-white border-transparent shadow-sm scale-[1.02]"
                            : "bg-white border-secondary-container text-secondary hover:bg-neutral-50"
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {addedCustomOptions.length > 0 && (
                  <div className="mt-md pt-md border-t border-neutral-100 w-full space-y-sm">
                    <div className="flex flex-wrap items-center gap-xs text-[10px] text-neutral-500 font-extrabold uppercase tracking-wider select-none">
                      <span className="material-symbols-outlined text-[14px] text-primary">auto_awesome</span>
                      <span>AI Generated & Custom Tags</span>
                      <span className="text-[10px] text-neutral-400 font-medium normal-case normal-case-none tracking-normal pl-xs">
                        (unchecking and saving will remove these permanently)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-sm">
                      {addedCustomOptions.map((val) => {
                        const active = isSelected(val);
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleToggle(val)}
                            className={cn(
                              "px-lg py-2.5 rounded-xl transition-all font-semibold text-xs border cursor-pointer",
                              active
                                ? "bg-primary text-white border-transparent shadow-sm scale-[1.02]"
                                : "bg-white border-secondary-container text-secondary hover:bg-neutral-50"
                            )}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {allowCustom && (
                  <div className="mt-md">
                    {multiple ? (
                      // Multi-select custom input
                      <div className="flex gap-sm items-center max-w-[280px]">
                        <Input
                          type="text"
                          value={customInputValue}
                          onChange={(e) => setCustomInputValue(e.target.value)}
                          placeholder={customPlaceholder}
                          className="flex-grow h-9"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCustom(e);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="primary"
                          onClick={handleAddCustom}
                          className="h-9 px-4 text-xs font-bold"
                        >
                          Add
                        </Button>
                      </div>
                    ) : (
                      // Single-select custom text input override
                      <Input
                        type="text"
                        value={typeof value === "string" ? value : ""}
                        onChange={handleTextInputChange}
                        placeholder={customPlaceholder}
                        className="w-full max-w-[320px] h-9"
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {error?.message && (
              <p id={`${name}-error`} role="alert" className="text-xs text-red-600 font-medium mt-1">
                {String(error.message)}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
