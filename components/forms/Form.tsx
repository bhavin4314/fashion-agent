"use client";

import * as React from "react";

import {
  useForm,
  FormProvider,
  type UseFormReturn,
  type DefaultValues,
  type FieldValues,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { cn } from "@/lib/utils";

interface FormProps<TValues extends FieldValues> {
  schema: ZodType<TValues, any, any>;
  defaultValues: DefaultValues<TValues>;
  onSubmit: (values: TValues, methods: UseFormReturn<TValues>) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export function Form<TValues extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: FormProps<TValues>) {
  const methods = useForm<TValues>({
    resolver: zodResolver(schema) as unknown as Resolver<TValues, any>,
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((values) => onSubmit(values as TValues, methods))}
        className={cn("flex flex-col gap-4", className)}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
}

