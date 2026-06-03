"use client";

import * as React from "react";
import { type UseFormReturn } from "react-hook-form";
import { Form } from "@/components/forms/Form";
import { FormInput } from "@/components/forms/FormInput";
import { FormPassword } from "@/components/forms/FormPassword";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { signUpSchema, type SignUpFormValues } from "../schema";
import { signUpAction } from "../actions";

const defaultValues: SignUpFormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(
    values: SignUpFormValues,
    methods: UseFormReturn<SignUpFormValues>
  ) {
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await signUpAction(values);
      if (!response.success) {
        setStatus({
          type: "error",
          message: response.error ?? "An unexpected error occurred. Please try again.",
        });
      } else {
        setStatus({
          type: "success",
          message: "Account created successfully! Redirecting you...",
        });
        window.location.href = "/collection";
      }
    } catch {
      setStatus({
        type: "error",
        message: "Failed to connect to the authentication server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form
      schema={signUpSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      className="space-y-md"
    >
      {status && (
        <div
          className={cn(
            "p-md border rounded-xl font-body-md text-body-md",
            status.type === "error"
              ? "bg-error-container text-on-error-container border-error/20"
              : "bg-emerald-50 text-emerald-800 border-emerald-200/50"
          )}
          role="alert"
        >
          {status.message}
        </div>
      )}

      {/* Full name input field */}
      <FormInput
        name="fullName"
        label="Full name"
        type="text"
        placeholder="Enter your full name"
        className="space-y-sm"
        inputClassName="w-full h-14 px-md rounded-xl border border-surface-container-highest bg-surface-container-lowest font-body-md text-body-md form-input-focus outline-none transition-all duration-200"
      />

      {/* Email input field */}
      <FormInput
        name="email"
        label="Email address"
        type="email"
        placeholder="name@company.com"
        className="space-y-sm"
        inputClassName="w-full h-14 px-md rounded-xl border border-surface-container-highest bg-surface-container-lowest font-body-md text-body-md form-input-focus outline-none transition-all duration-200"
      />

      {/* Password input field */}
      <FormPassword
        name="password"
        label="Password"
        placeholder="Min. 8 characters"
        className="space-y-sm"
        inputClassName="w-full h-14 px-md rounded-xl border border-surface-container-highest bg-surface-container-lowest font-body-md text-body-md form-input-focus outline-none transition-all duration-200"
      />

      {/* Confirm Password input field */}
      <FormPassword
        name="confirmPassword"
        label="Confirm password"
        placeholder="Re-enter your password"
        className="space-y-sm"
        inputClassName="w-full h-14 px-md rounded-xl border border-surface-container-highest bg-surface-container-lowest font-body-md text-body-md form-input-focus outline-none transition-all duration-200"
      />

      {/* Primary CTA submit button */}
      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full h-14 bg-[#ff385c] hover:bg-[#e03150] text-on-primary font-label-md text-label-md rounded-xl border-none shadow-md hover:shadow-lg transform active:scale-[0.98] transition-all duration-200 mt-md cursor-pointer flex items-center justify-center"
      >
        Sign Up
      </Button>
    </Form>
  );
}
