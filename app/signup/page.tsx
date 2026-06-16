import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SignUpForm } from "./_components/SignUpForm";

export const metadata: Metadata = {
  title: "Vistra | Sign Up",
  description: "Create an account on Vistra to discover your personal style, curated by AI.",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen bg-surface text-on-surface font-sans overflow-x-hidden">
      {/* Left Side: Registration Form */}
      <section className="w-full lg:w-1/2 xl:w-[45%] flex flex-col justify-center px-margin-mobile md:px-margin-desktop py-xl md:py-xxl">
        <div className="w-full max-w-[440px] mx-auto flex flex-col h-full justify-between min-h-[600px]">
          {/* Brand Logo Lockup */}
          <div className="mb-12 flex items-center gap-sm select-none pointer-events-none">
            <Image
              alt="Vistra Logo"
              className="h-10 w-auto object-contain"
              src="/logo-with-name.png"
              width={150}
              height={40}
              priority
            />
          </div>

          <div>
            {/* Header Section */}
            <div className="mb-xl select-none">
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs tracking-tight">
                Create your account
              </h1>
              <p className="font-body-lg text-body-lg text-secondary leading-relaxed">
                Join Vistra to discover your personal AI-curated style.
              </p>
            </div>

            {/* Registration Form Leaf client component */}
            <SignUpForm />

            {/* Redirect Footer Link */}
            <p className="mt-xl font-body-md text-body-md text-center text-secondary select-none">
              Already have an account?{" "}
              <Link
                className="text-on-surface font-bold hover:underline transition-colors duration-150"
                href="/login"
              >
                Log in
              </Link>
            </p>
          </div>

          {/* Bottom Legal Links */}
          <div className="mt-auto pt-xxl flex flex-wrap gap-md justify-center lg:justify-start">
            <a
              className="font-label-sm text-label-sm text-secondary hover:text-on-surface transition-colors duration-150 font-medium"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="font-label-sm text-label-sm text-secondary hover:text-on-surface transition-colors duration-150 font-medium"
              href="#"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </section>

      {/* Right Side: Editorial Image */}
      <section className="hidden lg:block relative lg:w-1/2 xl:w-[55%] select-none pointer-events-none">
        <div className="absolute inset-0 w-full h-full">
          <Image
            alt="Editorial Fashion"
            className="w-full h-full object-cover"
            src="/images/auth-cover.png"
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          {/* Soft overlay for depth and text legibility */}
          <div className="absolute inset-0 editorial-overlay flex flex-col justify-end p-xxl pb-xxl">
            <p className="text-white font-display-lg text-display-lg max-w-[448px] drop-shadow-sm leading-tight">
              Curated by AI. Designed for you.
            </p>
            <div className="mt-md w-16 h-1 bg-white opacity-40" />
          </div>
        </div>
      </section>
    </main>
  );
}
