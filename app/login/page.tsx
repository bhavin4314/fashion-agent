import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./_components/LoginForm";

export const metadata: Metadata = {
  title: "Vistra | Login",
  description: "Log in or sign up to Vistra to discover your personal style, selected by AI.",
};

interface PageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const redirectUrl = resolvedSearchParams.redirect;

  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-surface text-on-surface font-sans select-none overflow-x-hidden">
      {/* Left Section: Login Panel */}
      <section className="w-full md:w-1/2 bg-surface flex items-center justify-center p-gutter md:p-margin-desktop order-2 md:order-1">
        <div className="w-full max-w-[440px] flex flex-col items-center">
          {/* Brand Anchor & Identity */}
          <div className="mb-xxl text-center">
            <div className="flex items-center justify-center gap-xs mb-md select-none">
              <Link href="/" className="cursor-pointer">
                <Image
                  src="/logo-with-name.png"
                  alt="Vistra Logo"
                  className="h-10 w-auto object-contain"
                  width={150}
                  height={40}
                  priority
                />
              </Link>
            </div>
          </div>

          {/* Login Card Leaf Client Component */}
          <LoginForm redirectUrl={redirectUrl} />

          {/* Footer Links */}
          <footer className="mt-xxl flex flex-wrap justify-center gap-md">
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
          </footer>
        </div>
      </section>

      {/* Right Section: Editorial Imagery */}
      <section className="hidden md:block w-1/2 relative overflow-hidden h-screen order-1 md:order-2 select-none pointer-events-none">
        <div
          className="hero-image h-full w-full transform scale-105 hover:scale-100 transition-transform duration-[1500ms] ease-out"
          role="img"
          aria-label="High-end editorial fashion photography of a model wearing minimalist, premium knitwear."
        />
        <div className="absolute bottom-12 left-12 z-10">
          <p className="text-white font-headline-md text-headline-md opacity-90 tracking-tight">
            Selected by AI. Designed for you.
          </p>
        </div>
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      </section>
    </main>
  );
}
