# Antigravity — AI Agent Codebase Rules
**Version:** 1.0.0 | **Stack:** Next.js (App Router) · React · TypeScript · Tailwind CSS · React Hook Form · Zod

> These rules are **non-negotiable**. Every rule below is a hard constraint.
> Do not deviate, suggest alternatives, or ask for confirmation before applying them.
> When in doubt, apply the stricter interpretation.

---

## Table of Contents

1. [TypeScript Strictness](#1-typescript-strictness)
2. [Project & Folder Structure](#2-project--folder-structure)
3. [Next.js: Server vs. Client Components](#3-nextjs-server-vs-client-components)
4. [Forms & Validation](#4-forms--validation)
5. [Design System & Base Components](#5-design-system--base-components)
6. [Styling & Tailwind CSS](#6-styling--tailwind-css)
7. [Performance & Optimization](#7-performance--optimization)
8. [Data Fetching](#8-data-fetching)
9. [State Management](#9-state-management)
10. [Error Handling](#10-error-handling)
11. [Naming Conventions](#11-naming-conventions)
12. [Imports & Module Resolution](#12-imports--module-resolution)
13. [Testing Standards](#13-testing-standards)
14. [Accessibility (a11y)](#14-accessibility-a11y)
15. [Forbidden Patterns](#15-forbidden-patterns)

---

## 1. TypeScript Strictness

### 1.1 Compiler Settings

The following `tsconfig.json` options are **required** and must never be relaxed:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 1.2 `any` is Forbidden

- **Never** use `any` explicitly or implicitly. ESLint rule `@typescript-eslint/no-explicit-any` is set to `error`.
- Use `unknown` for genuinely unknown values and narrow with type guards.
- Use `never` to assert exhaustive branches.

```typescript
// ❌ FORBIDDEN
const data: any = await fetchSomething();

// ✅ CORRECT — narrow with a type guard
const data: unknown = await fetchSomething();
if (isUserResponse(data)) { /* ... */ }
```

### 1.3 Infer Types from Zod Schemas

Every data shape that crosses a network or form boundary **must** be defined as a Zod schema first. TypeScript types are inferred — never written separately for the same shape.

```typescript
// schemas/user.schema.ts
import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["admin", "member", "viewer"]),
});

// ✅ Type is inferred — never re-declare manually
export type User = z.infer<typeof userSchema>;
```

### 1.4 Utility Types

Use built-in utility types instead of re-implementing them:

| Situation | Use |
|---|---|
| Optional version of a type | `Partial<T>` |
| Required version of a type | `Required<T>` |
| Read-only data | `Readonly<T>` |
| Subset of keys | `Pick<T, K>` |
| Exclude keys | `Omit<T, K>` |
| Function return type | `ReturnType<typeof fn>` |
| Unwrap a Promise | `Awaited<T>` |
| Component props from element | `React.ComponentPropsWithoutRef<"button">` |

### 1.5 Interface vs. Type

- Use `interface` for object shapes that may be extended (component props, API responses).
- Use `type` for unions, intersections, primitives, and Zod-inferred types.
- **Never** use `Function` as a type — use explicit signatures: `(id: string) => Promise<void>`.

---

## 2. Project & Folder Structure

```
src/
├── app/                        # Next.js App Router: routes only
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── dashboard/
│   │   ├── _components/        # Route-private components (not shared)
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── api/
│   │   └── [...route]/
│   └── layout.tsx
│
├── components/                 # Shared, reusable UI components
│   ├── ui/                     # Design system primitives (Button, Input, Modal…)
│   ├── forms/                  # Form system — wrapper + all field primitives
│   │   ├── Form.tsx            # <Form /> wrapper: owns useForm + FormProvider
│   │   ├── FormInput.tsx       # Text, email, number, tel, URL fields
│   │   ├── FormPassword.tsx    # Password field with show/hide toggle
│   │   ├── FormSelect.tsx      # Dropdown selection
│   │   ├── FormTextarea.tsx    # Multi-line text
│   │   ├── FormCheckbox.tsx    # Boolean checkbox
│   │   ├── FormRadioGroup.tsx  # Radio button group
│   │   ├── FormFileUpload.tsx  # File input
│   │   └── index.ts            # Barrel export
│   └── shared/                 # Composite components used across features
│
├── features/                   # Feature-scoped modules
│   └── [feature-name]/
│       ├── components/         # Components used only within this feature
│       ├── hooks/              # Hooks scoped to this feature
│       ├── schemas/            # Zod schemas for this feature
│       ├── actions/            # Next.js Server Actions for this feature
│       └── types.ts            # Feature-local types (if not derivable from schemas)
│
├── hooks/                      # Shared custom hooks
├── lib/                        # Utility functions, third-party client configs
│   ├── utils.ts
│   └── validators.ts
├── schemas/                    # Global/shared Zod schemas
├── types/                      # Global TypeScript types and declaration files
└── styles/
    └── globals.css
```

### 2.1 Placement Rules

- `app/` contains **only** route segments (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- Logic, components, and hooks **never** live directly in `app/` unless they are route-specific and prefixed with `_`.
- A component used by more than one feature **must** be promoted to `components/shared/`.
- A Zod schema used by more than one feature **must** be promoted to `schemas/`.

---

## 3. Next.js: Server vs. Client Components

### 3.1 Default to Server Components

Every component is a **React Server Component (RSC)** by default. Add `"use client"` only when explicitly required. This is the most commonly violated rule — enforce it strictly.

### 3.2 When to Add `"use client"`

Add `"use client"` **only** when the component uses:

- React state (`useState`, `useReducer`)
- React lifecycle effects (`useEffect`, `useLayoutEffect`)
- Browser-only APIs (`window`, `document`, `navigator`)
- Event handlers that must be interactive on the client (onClick on dynamic UI, not static links)
- Context providers that wrap client state
- Third-party libraries that are not RSC-compatible

```typescript
// ❌ WRONG — "use client" added out of habit
"use client";
export default function StaticCard({ title }: { title: string }) {
  return <div>{title}</div>;
}

// ✅ CORRECT — no client directive needed
export default function StaticCard({ title }: { title: string }) {
  return <div>{title}</div>;
}
```

### 3.3 Push `"use client"` to the Leaves

Isolate client interactivity in the smallest possible subtree. Wrap only the interactive part in a Client Component, not the entire page or layout.

```typescript
// ✅ CORRECT — only the interactive counter is a Client Component
// app/dashboard/page.tsx (Server Component)
import { CounterButton } from "./_components/CounterButton"; // "use client"

export default async function DashboardPage() {
  const data = await fetchDashboardData(); // runs on server
  return (
    <main>
      <h1>{data.title}</h1>
      <CounterButton /> {/* Only this subtree is client-side */}
    </main>
  );
}
```

### 3.4 Server Actions

- Server Actions are defined in files with `"use server"` at the top or as inline `async` functions in Server Components.
- Server Actions **must** validate all inputs with Zod before processing.
- Server Actions **must** be placed in `features/[feature]/actions/` or `app/[route]/actions.ts`.
- Return a typed result object — never `throw` across the client/server boundary.

```typescript
// features/auth/actions/login.action.ts
"use server";

import { loginSchema } from "../schemas/login.schema";

export async function loginAction(formData: unknown) {
  const parsed = loginSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }
  // ... proceed with validated data
  return { success: true };
}
```

### 3.5 Metadata

- Page metadata **must** be exported from `page.tsx` or `layout.tsx` as a `metadata` object or `generateMetadata` function — never set via `<Head>` or third-party libraries.

```typescript
// app/dashboard/page.tsx
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dashboard | Antigravity",
  description: "Your project overview.",
};
```

### 3.6 Navigation & Redirection

- **Always** use Next.js `<Link>` component from `next/link` for redirection/navigation to another page within the application.
- **Never** use `window.location` (e.g., `window.location.href`, `window.location.replace`) or similar browser-native commands to redirect, as they trigger full page reloads.

---

## 4. Forms & Validation

### 4.1 Mandatory Stack

Every form in this codebase **must** use:
1. **React Hook Form** (`useForm`) for form state management.
2. **Zod** for schema definition and validation.
3. **`@hookform/resolvers/zod`** to connect the two.
4. The centralized **`<Form />`** wrapper component (see §4.3).
5. **Pre-built form component primitives** from `components/forms/` for every field type (see §4.4).

No exceptions. Do not use `useState` to manage form fields. Do not use `formik`, `react-final-form`, or uncontrolled HTML forms.

### 4.2 Schema-First Workflow

1. Define the Zod schema in `features/[feature]/schemas/`.
2. Infer the TypeScript type from the schema.
3. Pass the schema to the `<Form />` wrapper — it becomes the single source of truth for validation.

```typescript
// features/auth/schemas/register.schema.ts
import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "member", "viewer"]),
  bio: z.string().max(300).optional(),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms" }),
  }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
```

### 4.3 Centralized `<Form />` Wrapper

All forms **must** use the shared `<Form />` component located at `components/forms/Form.tsx`. This is the **only** place `useForm` is ever instantiated. This component:

- Instantiates `useForm` with the Zod resolver internally — consumers never call `useForm` themselves.
- Exposes the full React Hook Form context via `FormProvider` so all child form components can self-register via `useFormContext()`.
- Owns the `handleSubmit` orchestration.
- Accepts a typed `onSubmit` callback — the parent feature component handles submission logic.

```typescript
// components/forms/Form.tsx
"use client";

import {
  useForm,
  FormProvider,
  type UseFormReturn,
  type DefaultValues,
  type FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { cn } from "@/lib/utils";

interface FormProps<TValues extends FieldValues> {
  schema: ZodType<TValues>;
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
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",       // validate on blur, re-validate on change after first error
    reValidateMode: "onChange",
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((values) => onSubmit(values, methods))}
        className={cn("flex flex-col gap-4", className)}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
}
```

### 4.4 Form Component Family — The Complete Primitives

This is the **definitive list** of form field components. Every field in every form **must** use one of these components. Raw `<input>`, `<select>`, `<textarea>`, or `<input type="password">` are **never** used directly inside forms.

All components in this family follow the same contract:
- They live in `components/forms/`.
- They call `useFormContext()` internally to self-register — **no `register`, `control`, or `errors` props are ever passed from the parent**.
- They accept a `name` prop (keyof the form schema) and a `label` prop.
- They render their own label, field, and error message as a self-contained unit.
- They are always `"use client"` components.

---

#### `<FormInput />` — Text, Email, Number, Tel, URL

For all standard single-line text inputs.

```typescript
// components/forms/FormInput.tsx
"use client";

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
}

export function FormInput({
  name,
  label,
  type = "text",
  placeholder,
  description,
  className,
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
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${name}-error` : description ? `${name}-description` : undefined
        }
        {...register(name)}
      />
      {error?.message && (
        <p id={`${name}-error`} role="alert" className="text-xs text-red-600">
          {String(error.message)}
        </p>
      )}
    </div>
  );
}
```

---

#### `<FormPassword />` — Password Fields with Toggle

For all password inputs. Includes a show/hide toggle button built in. **Never** use `<FormInput type="password" />` — always use this dedicated component so the toggle behaviour is consistent.

```typescript
// components/forms/FormPassword.tsx
"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormPasswordProps {
  name: string;
  label: string;
  placeholder?: string;
  showStrengthIndicator?: boolean;
  className?: string;
}

export function FormPassword({
  name,
  label,
  placeholder = "••••••••",
  className,
}: FormPasswordProps) {
  const [isVisible, setIsVisible] = useState(false);
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
      <div className="relative">
        <Input
          id={name}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className="pr-10"
          {...register(name)}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700"
          onClick={() => setIsVisible((v) => !v)}
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
        </Button>
      </div>
      {error?.message && (
        <p id={`${name}-error`} role="alert" className="text-xs text-red-600">
          {String(error.message)}
        </p>
      )}
    </div>
  );
}
```

---

#### `<FormSelect />` — Dropdown Selection

For all single-value dropdown selections. Uses the `<Select />` design system primitive, not a raw `<select>`.

```typescript
// components/forms/FormSelect.tsx
"use client";

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
            {...field}
            id={name}
            options={options}
            placeholder={placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
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
```

---

#### `<FormTextarea />` — Multi-line Text

For all multi-line text inputs. **Never** use `<FormInput />` for textarea-like fields.

```typescript
// components/forms/FormTextarea.tsx
"use client";

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
}

export function FormTextarea({
  name,
  label,
  placeholder,
  rows = 4,
  maxLength,
  description,
  className,
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
```

---

#### `<FormCheckbox />` — Single Boolean Checkbox

For single true/false toggles and agreement checkboxes.

```typescript
// components/forms/FormCheckbox.tsx
"use client";

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
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
            />
            <div className="flex flex-col gap-0.5">
              <label htmlFor={name} className="text-sm font-medium text-neutral-800 cursor-pointer">
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
```

---

#### `<FormRadioGroup />` — Single Selection from Visible Options

For mutually exclusive options that need to be visible simultaneously (as opposed to hidden in a dropdown).

```typescript
// components/forms/FormRadioGroup.tsx
"use client";

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
            aria-invalid={!!error}
            className={cn(
              orientation === "horizontal" ? "flex flex-row gap-4" : "flex flex-col gap-2"
            )}
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem id={`${name}-${option.value}`} value={option.value} />
                <label
                  htmlFor={`${name}-${option.value}`}
                  className="text-sm text-neutral-700 cursor-pointer"
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
```

---

#### `<FormFileUpload />` — File Input

For all file upload interactions.

```typescript
// components/forms/FormFileUpload.tsx
"use client";

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
```

---

### 4.5 Form Component Family — Quick Reference

| Field Type | Component | When to Use |
|---|---|---|
| Text, email, number, tel, URL | `<FormInput />` | Any single-line plain text input |
| Password | `<FormPassword />` | All password fields — has built-in show/hide toggle |
| Dropdown | `<FormSelect />` | Single value from a long list of options |
| Multi-line text | `<FormTextarea />` | Bios, messages, descriptions — anything multi-line |
| Boolean toggle | `<FormCheckbox />` | Yes/no fields, terms agreement, feature toggles |
| Visible options | `<FormRadioGroup />` | Mutually exclusive choices that should all be visible |
| File upload | `<FormFileUpload />` | Avatar uploads, document attachments |

> **Adding a new field type?** Create a new `Form[Type].tsx` in `components/forms/` following the same contract: `useFormContext()` internally, `name` + `label` props, self-contained label + field + error rendering.

### 4.6 The `components/forms/` Directory Structure

```
components/forms/
├── Form.tsx              # The <Form /> wrapper — instantiates useForm + FormProvider
├── FormInput.tsx         # Text, email, number, tel, URL
├── FormPassword.tsx      # Password with show/hide toggle
├── FormSelect.tsx        # Dropdown selection
├── FormTextarea.tsx      # Multi-line text
├── FormCheckbox.tsx      # Boolean checkbox
├── FormRadioGroup.tsx    # Radio button group
├── FormFileUpload.tsx    # File input
└── index.ts              # Barrel export (permitted for this directory only)
```

### 4.7 Complete Form Usage Example

This is the **only** valid pattern for building a form. Notice that:
- The parent feature component never calls `useForm`.
- No `register`, `control`, or `errors` props are passed from parent to child.
- Every field uses its dedicated form component primitive.

```typescript
// features/auth/components/RegisterForm.tsx
"use client";

import { Form } from "@/components/forms/Form";
import { FormInput } from "@/components/forms/FormInput";
import { FormPassword } from "@/components/forms/FormPassword";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { FormCheckbox } from "@/components/forms/FormCheckbox";
import { Button } from "@/components/ui/Button";
import { registerSchema, type RegisterFormValues } from "../schemas/register.schema";
import { registerAction } from "../actions/register.action";

const defaultValues: RegisterFormValues = {
  fullName: "",
  email: "",
  password: "",
  role: "member",
  bio: "",
  agreeToTerms: false,
};

const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Member", value: "member" },
  { label: "Viewer", value: "viewer" },
];

export function RegisterForm() {
  async function handleSubmit(values: RegisterFormValues) {
    const result = await registerAction(values);
    if (!result.success) {
      // handle server-side error
    }
  }

  return (
    <Form
      schema={registerSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      className="w-full max-w-md"
    >
      <FormInput
        name="fullName"
        label="Full Name"
        placeholder="Jane Smith"
      />
      <FormInput
        name="email"
        label="Email Address"
        type="email"
        placeholder="jane@example.com"
      />
      <FormPassword
        name="password"
        label="Password"
      />
      <FormSelect
        name="role"
        label="Role"
        options={ROLE_OPTIONS}
      />
      <FormTextarea
        name="bio"
        label="Bio"
        placeholder="Tell us about yourself..."
        maxLength={300}
      />
      <FormCheckbox
        name="agreeToTerms"
        label="I agree to the Terms of Service and Privacy Policy"
      />
      <Button type="submit" className="w-full">
        Create Account
      </Button>
    </Form>
  );
}
```

---

### 4.8 Static Options & Default Values

- **Static Options**: Any static options arrays (e.g., options for `<FormSelect />`, `<FormRadioGroup />`, chips, etc.) **must** be defined as constants *outside* the component render function (or imported from a constants file). Defining them inline or inside the component triggers unnecessary re-renders and is strictly prohibited.
- **Default Values**: Default values objects used with `<Form />` **must** also be defined as constants *outside* the component or memoized/computed only when dynamically derived.
- **Standardized Forms**: Every form in the application must use the common `<Form />` component and standardized form primitives (`<FormInput />`, `<FormSelect />`, etc.). Do not build ad-hoc forms using native HTML `<form>` or `<input>` tags.

---

## 5. Design System & Base Components

### 5.1 Mandatory Component Usage

**Never** use raw HTML elements for interactive UI or design-significant layout. Always use the design system primitive.

| Situation | Forbidden | Required |
|---|---|---|
| Clickable actions | `<button>`, `<a onClick>` | `<Button />` |
| Text inputs | `<input type="text">` | `<Input />` |
| Overlays / dialogs | `<div role="dialog">` | `<Modal />` |
| Navigation links | `<a href>` | `<Link />` from `next/link` wrapped in a design system component |
| Images | `<img>` | `<Image />` from `next/image` |
| Select dropdowns | `<select>` | `<Select />` |
| Checkboxes | `<input type="checkbox">` | `<Checkbox />` |
| Text areas | `<textarea>` | `<Textarea />` |

### 5.2 Component API Rules

Design system components **must** follow these interface standards:

```typescript
// ✅ CORRECT — Button component interface example
interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  // Never use `disabled` as a custom prop — use the native HTML attribute (inherited via ...rest)
}
```

- Components **must** forward refs using `React.forwardRef` when wrapping HTML elements.
- Components **must** spread remaining props (`...rest`) onto the underlying element to preserve native HTML attributes.
- Components **must** expose a `className` prop to allow contextual overrides via `cn()`.

### 5.3 The `cn()` Utility

All components use `cn()` (a `clsx` + `tailwind-merge` wrapper) for conditional and overridable class names:

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```typescript
// ✅ CORRECT — using cn() inside a component
<button className={cn("px-4 py-2 rounded-md font-medium", variantClasses[variant], className)}>
```

### 5.4 Modal Component Rules

- Modals **must** be built on a headless, accessible primitive (e.g., Radix UI `Dialog`).
- Modal open/close state is managed by the **parent** component via props — the `<Modal />` component itself is never self-managing.
- Focus trapping and `aria-` attributes are handled by the primitive, **not** manually.

### 5.5 Shared & Common UI Components

- **Create Reusable Components**: If a component or interactive layout pattern is used in more than one place (e.g., `<Pagination />` used in products and orders tables), **always** extract it to a shared component inside `components/ui/` (for design primitives) or `components/shared/` (for composite elements).
- **Never Duplicate Layout or Interactivity**: Avoid inline implementations of repeated patterns. Extracting common components prevents drift, makes maintenance simpler, and ensures accessibility/style fixes apply system-wide.

---

## 6. Styling & Tailwind CSS

### 6.1 Design Tokens First

- **Never** use arbitrary values when a design token exists: use `text-neutral-700` not `text-[#404040]`.
- **Never** hardcode colors, spacing, or font sizes as inline styles.
- All custom tokens are defined in `tailwind.config.ts` under `theme.extend`.

```typescript
// ❌ FORBIDDEN
<div style={{ color: "#1a1a1a", marginTop: "14px" }} />
<div className="text-[#1a1a1a] mt-[14px]" />

// ✅ CORRECT — use design tokens
<div className="text-neutral-900 mt-3.5" />
```

### 6.2 Class Ordering

Tailwind classes **must** follow this order (enforced via `prettier-plugin-tailwindcss`):

1. Layout (display, position, flex/grid, overflow)
2. Sizing (width, height, padding, margin)
3. Typography (font, text, leading, tracking)
4. Visual (background, border, ring, shadow)
5. Interactive (cursor, pointer-events, transition, hover/focus variants)
6. Responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
7. Dark mode variants (`dark:`)

### 6.3 Conditional Classes

Always use `cn()` for conditional class logic — never template literals or ternaries directly in JSX `className`.

```typescript
// ❌ FORBIDDEN
<div className={`base-class ${isActive ? "bg-blue-500" : "bg-gray-200"}`} />

// ✅ CORRECT
<div className={cn("base-class", isActive ? "bg-blue-500" : "bg-gray-200")} />
```

### 6.4 No `@apply` Abuse

- `@apply` in CSS files is restricted to truly global, repeated utility patterns (e.g., a `prose` override).
- Component-level styles live in JSX via Tailwind classes, not in `.css` files with `@apply`.

### 6.5 Responsive Design

- Design mobile-first: base classes apply to mobile, responsive prefixes apply upward.
- **Never** use `max-` breakpoints unless there is no other option.

```typescript
// ❌ FORBIDDEN — desktop-first with max breakpoints
<div className="grid-cols-4 max-md:grid-cols-1" />

// ✅ CORRECT — mobile-first
<div className="grid-cols-1 md:grid-cols-4" />
```

---

## 7. Performance & Optimization

### 7.1 `next/image` is Mandatory

**Never** use a raw `<img>` tag. All images **must** use `<Image />` from `next/image`.

```typescript
// ❌ FORBIDDEN
<img src="/hero.jpg" alt="Hero" />

// ✅ CORRECT
import Image from "next/image";
<Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />
```

- Set `priority` on images that are above the fold (LCP candidates).
- Always provide meaningful `alt` text. `alt=""` is only valid for decorative images.
- Specify `sizes` prop for responsive images to prevent oversized downloads.

### 7.2 `next/link` is Mandatory

**Never** use `<a>` for internal navigation. Always use `<Link />` from `next/link`.

```typescript
// ❌ FORBIDDEN
<a href="/dashboard">Go to Dashboard</a>

// ✅ CORRECT
import Link from "next/link";
<Link href="/dashboard">Go to Dashboard</Link>
```

### 7.3 `React.memo` and `useMemo` / `useCallback`

- Do **not** wrap every component in `React.memo` by default — this is premature optimization.
- Apply `React.memo` only when a component is proven to re-render unnecessarily via profiling.
- `useMemo` is for **expensive computations** — not for objects or arrays passed as props to avoid referential inequality (use state restructuring instead).
- `useCallback` is required when passing a stable function reference to a memoized child component.

```typescript
// ❌ WRONG — useMemo used unnecessarily
const style = useMemo(() => ({ color: "red" }), []); // just write the object inline

// ✅ CORRECT — useMemo for genuinely expensive computation
const sortedList = useMemo(() => expensiveSort(items), [items]);
```

### 7.4 Dynamic Imports

Use `next/dynamic` for components that:
- Are only needed after user interaction (modals, drawers, tooltips with heavy content).
- Include large third-party libraries not needed on initial paint.

```typescript
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("@/components/shared/HeavyChart"), {
  loading: () => <ChartSkeleton />,
  ssr: false, // only if the library requires browser APIs
});
```

### 7.5 Font Optimization

**Always** use `next/font` for loading fonts. Never load fonts via `<link>` tags in `layout.tsx` or via CSS `@import`.

```typescript
// app/layout.tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
```

---

## 8. Data Fetching

### 8.1 Fetch in Server Components

Data fetching **must** happen in Server Components by default — never in `useEffect`.

```typescript
// ✅ CORRECT — data fetched on the server
export default async function UsersPage() {
  const users = await getUsers(); // direct DB call or server-side fetch
  return <UserList users={users} />;
}
```

### 8.2 Parallel Data Fetching

Use `Promise.all` for independent parallel requests. Never chain `await` sequentially for independent data.

```typescript
// ❌ SLOW — sequential fetches (waterfalls)
const user = await getUser(id);
const posts = await getPosts(id);

// ✅ FAST — parallel fetches
const [user, posts] = await Promise.all([getUser(id), getPosts(id)]);
```

### 8.3 `fetch` Cache and Revalidation

Explicitly declare the caching strategy on every `fetch` call — never rely on defaults.

```typescript
// Static data (never changes)
fetch(url, { cache: "force-cache" });

// Dynamic data (always fresh)
fetch(url, { cache: "no-store" });

// Time-based revalidation
fetch(url, { next: { revalidate: 3600 } }); // revalidate every 1 hour
```

### 8.4 Client-Side Data Fetching

When client-side data fetching is required (e.g., after user interaction), use **TanStack Query** (`@tanstack/react-query`). Never use raw `useEffect` + `useState` for async data management.

```typescript
// ✅ CORRECT — client-side fetching with TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => fetchUser(userId),
});
```

### 8.5 Streaming with Suspense

Wrap async Server Components in `<Suspense>` with meaningful fallbacks to enable streaming.

```typescript
import { Suspense } from "react";
import { UserCardSkeleton } from "@/components/shared/UserCardSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<UserCardSkeleton />}>
      <UserCard /> {/* async Server Component */}
    </Suspense>
  );
}
```

---

## 9. State Management

### 9.1 State Hierarchy

Choose the simplest appropriate solution:

1. **`useState`** — component-local UI state (toggles, input values before form submission).
2. **`useReducer`** — complex local state with multiple sub-values or transitions.
3. **React Context** — shared state for a specific subtree (e.g., theme, auth session). Do **not** use Context for high-frequency updates.
4. **TanStack Query** — all server/async state.
5. **Zustand** — global client state that is not server-derived (e.g., sidebar open state, multi-step wizard state).

**Never** use Redux, MobX, or Recoil. **Never** reach for a global store when local state suffices.

### 9.2 Context Rules

- Every Context **must** have an explicit type for its value.
- Every Context **must** have a custom hook (e.g., `useAuth`) that throws if used outside its provider.
- Context providers that manage client state **must** have `"use client"`.

```typescript
// ✅ CORRECT — typed context with guard hook
const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
```

---

## 10. Error Handling

### 10.1 Route Error Boundaries

Every route segment **must** have a colocated `error.tsx` file that renders a graceful fallback UI.

```typescript
// app/dashboard/error.tsx
"use client"; // error boundaries must be Client Components

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong.</h2>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
```

### 10.2 Typed Error Results

Server Actions and data-fetching utilities **must** return typed result objects. Never rely on unhandled promise rejection.

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
```

### 10.3 `not-found.tsx`

Every major route group **must** export a `not-found.tsx` to handle 404 states gracefully. Call `notFound()` from `next/navigation` whenever a resource is not found in a Server Component.

---

## 11. Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| React components | `PascalCase` | `UserProfileCard.tsx` |
| Hooks | `camelCase` prefixed with `use` | `useUserProfile.ts` |
| Zod schemas | `camelCase` + `Schema` suffix | `userProfileSchema` |
| Inferred Zod types | `PascalCase` matching schema | `UserProfile` |
| Server Actions | `camelCase` + `Action` suffix | `updateUserAction` |
| Utility functions | `camelCase` | `formatCurrency.ts` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_FILE_SIZE_MB` |
| CSS variables | `--kebab-case` | `--color-primary-500` |
| Route folders | `kebab-case` | `app/user-settings/` |
| Feature folders | `kebab-case` | `features/user-profile/` |

---

## 12. Imports & Module Resolution

### 12.1 Path Aliases

Always use the `@/` path alias for imports. Never use relative paths that traverse more than one level up (`../../`).

```typescript
// ❌ FORBIDDEN
import { Button } from "../../../components/ui/Button";

// ✅ CORRECT
import { Button } from "@/components/ui/Button";
```

### 12.2 Import Order

ESLint `import/order` enforces this sequence:

1. React and Next.js built-ins
2. Third-party packages
3. Internal aliases (`@/`)
4. Relative imports (same directory)
5. Type imports (`import type { ... }`)

### 12.3 Type-Only Imports

Always use `import type` for types and interfaces to ensure they are erased at compile time:

```typescript
import type { User } from "@/types/user";
import type { Metadata } from "next";
```

### 12.4 Barrel Files (`index.ts`)

- Barrel files are **permitted** in `components/ui/`, `components/forms/`, and `lib/`.
- Barrel files are **forbidden** in `app/` and `features/` — they obscure the module graph and harm tree-shaking.

---

## 13. Testing Standards

### 13.1 Stack

- **Unit & Integration**: Vitest + React Testing Library
- **End-to-End**: Playwright
- **Component Snapshots**: Forbidden — they are brittle and low-value.

### 13.2 What to Test

| Test Type | What It Covers |
|---|---|
| Unit | Pure utility functions, Zod schema validation logic |
| Integration | Form submission flows, component interactions, Server Action outputs |
| E2E | Critical user journeys (login, checkout, key workflows) |

### 13.3 Testing Philosophy

- Test **behavior**, not implementation. Never assert on internal state or private methods.
- Query elements by accessibility role first: `getByRole`, `getByLabelText`, `getByText`. Never query by class name or test ID unless there is no accessible alternative.
- Every form component **must** have an integration test covering: valid submission, invalid submission with errors, and field-level validation messages.

```typescript
// ✅ CORRECT — test behavior, not internals
test("shows error when email is invalid", async () => {
  render(<ContactForm />);
  await userEvent.type(screen.getByLabelText("Email Address"), "not-an-email");
  await userEvent.click(screen.getByRole("button", { name: /send/i }));
  expect(await screen.findByRole("alert")).toHaveTextContent("valid email");
});
```

---

## 14. Accessibility (a11y)

### 14.1 Baseline Requirements

- All interactive elements **must** be keyboard-navigable and have visible focus indicators.
- All images **must** have descriptive `alt` text. Decorative images use `alt=""`.
- Color contrast **must** meet WCAG AA (4.5:1 for normal text, 3:1 for large text).
- **Never** remove `outline` on focused elements without providing an equally visible custom focus style.

### 14.2 ARIA Rules

- Use semantic HTML elements before reaching for ARIA. `<button>` is always better than `<div role="button">`.
- Never use ARIA to override broken semantics — fix the semantics instead.
- Required ARIA patterns: `aria-label` or `aria-labelledby` on all landmark regions, `aria-describedby` on form fields with helper/error text, `aria-live="polite"` on dynamic status messages.

### 14.3 Form Accessibility

- Every `<input>`, `<select>`, and `<textarea>` **must** have an associated `<label>` (via `htmlFor`/`id` — not just placeholder text).
- Validation error messages **must** use `role="alert"` and be linked to their field via `aria-describedby`.
- Submit buttons **must** have `type="submit"` explicitly set.

---

## 15. Forbidden Patterns

The following are **strictly prohibited**. The AI agent must refuse to generate them and must flag them in code review.

```typescript
// ❌ 1. Using `any`
const value: any = getData();

// ❌ 2. useEffect for data fetching
useEffect(() => { fetch('/api/users').then(...) }, []);

// ❌ 3. Raw HTML elements inside forms — always use form component primitives
<input type="text" className="border rounded p-2" />
<input type="password" />
<select><option>Admin</option></select>
<textarea className="border p-2" />
<input type="checkbox" />

// ❌ 4. Using <FormInput type="password"> — always use <FormPassword /> instead
<FormInput name="password" type="password" label="Password" />

// ❌ 5. Calling useForm directly outside of Form.tsx
"use client";
const methods = useForm({ resolver: zodResolver(schema) }); // FORBIDDEN — only Form.tsx does this

// ❌ 6. Passing RHF internals as props — form primitives self-register via useFormContext()
<FormInput name="email" label="Email" register={register} errors={errors} />
<FormSelect name="role" label="Role" control={control} />

// ❌ 7. Unvalidated form submission — all data must go through <Form /> + Zod schema
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  await createUser(rawFormData); // no schema, no <Form /> wrapper
}

// ❌ 8. Building a custom ad-hoc field instead of using/extending the form primitive family
// If a new field type is needed, add Form[Type].tsx to components/forms/ — don't inline it
<div>
  <label>Tags</label>
  <Controller name="tags" control={control} render={...} />
  {errors.tags && <span>{errors.tags.message}</span>}
</div>

// ❌ 9. Raw <img> tags
<img src={user.avatar} alt="avatar" />

// ❌ 10. Raw <a> for internal navigation
<a href="/profile">Profile</a>

// ❌ 11. Adding "use client" to a page or layout unnecessarily
"use client"; // on a component with no hooks or browser APIs
export default function StaticPage() { ... }

// ❌ 12. Inline styles for design-significant properties
<div style={{ padding: "16px", color: "#333" }} />

// ❌ 13. Hardcoded arbitrary values instead of design tokens
<div className="text-[#1a1a1a] mt-[14px]" />

// ❌ 14. Type assertions that bypass safety
const user = data as User; // use a type guard or Zod .parse() instead

// ❌ 15. Default export for non-page, non-layout components
export default function Button() { ... } // use named exports in component files

// ❌ 16. Mutating state directly
state.user.name = "Jane"; // use setState or immer

// ❌ 17. Barrel files in features/ or app/
// features/user-profile/index.ts — FORBIDDEN

// ❌ 18. Prop drilling more than 2 levels deep without Context or composition
<GrandParent value={x}>
  <Parent value={x}>
    <Child value={x} /> {/* use context instead */}
  </Parent>
</GrandParent>

// ❌ 19. Non-async Server Actions without validation
"use server";
export function updateUser(data: unknown) { // must be async + must validate with Zod
  db.update(data);
}

// ❌ 20. Defining static options (select/radio options) or default values inline or inside the component render function
"use client";
export function MyForm() {
  const options = [{ label: "A", value: "a" }]; // FORBIDDEN — define outside the component or as a constant
  const defaultValues = { choice: "" }; // FORBIDDEN — define outside the component or as a constant
  return <FormSelect name="choice" label="Choice" options={options} />;
}

// ❌ 21. Creating ad-hoc HTML <form> or <input> elements instead of using common Form and form primitive components
<form onSubmit={handleSubmit}>
  <input type="text" value={name} onChange={...} /> // FORBIDDEN — use <Form /> and <FormInput />
</form>
```

- Always consult `DESIGN.md` for exact styling tokens, colors, and layout configurations.

---

*This file is the single source of truth for code standards in the Antigravity codebase. All AI-generated and human-written code is subject to these rules without exception. Last updated: 2025.*