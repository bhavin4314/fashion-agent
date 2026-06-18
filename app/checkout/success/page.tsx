import type { Metadata } from "next";
import { Navbar } from "@/app/_components/Navbar";
import { CheckoutSuccessClient } from "./_components/CheckoutSuccessClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmed | Vistra",
  description: "Your quiet luxury fashion curation order is confirmed.",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="text-charcoal antialiased min-h-screen flex flex-col bg-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="pt-[100px] pb-xxl flex-grow w-full">
        <Suspense
          fallback={
            <div className="flex flex-col items-center gap-md">
              <Loader2 className="h-10 w-10 text-brand animate-spin" />
              <p className="text-xs font-bold text-muted uppercase tracking-widest">
                Loading Receipt...
              </p>
            </div>
          }
        >
          <CheckoutSuccessClient />
        </Suspense>
      </main>

      {/* Simple Footer */}
      <footer className="w-full py-lg bg-footer-bg border-t border-border-light">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center text-[11px] text-muted font-bold">
          <div>© 2026 Vistra AI Fashion Concierge. All rights reserved.</div>
          <div className="flex gap-md">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
