"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Form } from "@/components/forms/Form";
import { FormInput } from "@/components/forms/FormInput";
import { FormPassword } from "@/components/forms/FormPassword";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { loginSchema, type LoginFormValues } from "../schema";
import { loginAction } from "../actions";

const defaultValues: LoginFormValues = {
  email: "",
  password: "",
};

interface LoginFormProps {
  redirectUrl?: string;
}

export function LoginForm({ redirectUrl }: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Subtle 3D Card tilt dynamic effect on mousemove for premium feel
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768 || !cardRef.current) return;
      const xAxis = (window.innerWidth / 2 - e.pageX) / 80;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 80;
      cardRef.current.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };

    const handleMouseLeave = () => {
      if (!cardRef.current) return;
      cardRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  async function handleSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await loginAction(values);
      if (!response.success) {
        setErrorMessage(response.error ?? "Invalid email or password.");
        setIsSubmitting(false);
      } else {
        // Redirect user based on their role using window.location for a full reload cache clearance
        const role = response.role;
        if (role === "admin") {
          window.location.href = "/admin/inventory";
        } else {
          window.location.href = redirectUrl || "/collection";
        }
      }
    } catch {
      setErrorMessage("Failed to connect to the authentication server. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div
      ref={cardRef}
      className="w-full bg-surface-container-lowest p-lg md:p-xl rounded-xl border border-surface-container-highest shadow-sm transition-all duration-300 ease-out"
      style={{ transform: "rotateY(0deg) rotateX(0deg)", transformStyle: "preserve-3d" }}
    >
      <header className="mb-xl text-center md:text-left select-none">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs tracking-tight">
          Welcome to Vistra
        </h1>
        <p className="font-body-md text-body-md text-secondary leading-relaxed">
          Log in or sign up to discover your style.
        </p>
      </header>

      {/* Centralized AGENTS.md wrapper form component */}
      <Form
        schema={loginSchema}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        className="space-y-md"
      >
        {errorMessage && (
          <div
            className="p-md bg-error-container text-on-error-container border border-error/20 rounded-xl font-body-md text-body-md"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        {/* Email controlled form input using design custom specifications */}
        <FormInput
          name="email"
          label="Email address"
          type="email"
          placeholder="name@example.com"
          className="gap-xs"
          inputClassName="w-full h-[56px] px-md rounded-xl border-border-light border bg-surface-container-low text-on-surface font-body-md placeholder:text-secondary-fixed-dim input-focus-ring transition-all duration-200"
        />

        {/* Password controlled form input with hide/show toggle */}
        <FormPassword
          name="password"
          label="Password"
          placeholder="••••••••"
          className="gap-xs"
          inputClassName="w-full h-[56px] px-md rounded-xl border-border-light border bg-surface-container-low text-on-surface font-body-md placeholder:text-secondary-fixed-dim input-focus-ring transition-all duration-200"
        />

        {/* CTA submit button matching radical coral and sizes from design system */}
        <div className="pt-base">
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full h-[56px] bg-brand hover:bg-brand-hover active:scale-[0.98] text-white font-label-md text-label-md rounded-xl transition-all duration-200 shadow-md shadow-brand/20 flex items-center justify-center gap-base border-none cursor-pointer"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-1 select-none pointer-events-none" />
          </Button>
        </div>
      </Form>

      {/* Sign-up option divider */}
      <div className="mt-xl pt-xl border-t border-surface-container-highest text-center select-none">
        <p className="font-body-md text-body-md text-secondary">
          Don&apos;t have an account?{" "}
          <Link
            className="text-on-surface font-semibold hover:underline decoration-2 underline-offset-4 transition-all duration-150"
            href={redirectUrl ? `/signup?redirect=${encodeURIComponent(redirectUrl)}` : "/signup"}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
