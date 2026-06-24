import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/app/_components/Navbar";
import { StripeRedirectClient } from "./_components/StripeRedirectClient";

export const metadata: Metadata = {
  title: "Checkout | Vistra",
  description: "Secure payment gateway for your luxury fashion selection.",
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/cart");
  }

  return (
    <div className="text-charcoal antialiased min-h-screen flex flex-col bg-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Render Stripe redirect to complete purchase */}
      <StripeRedirectClient />

      {/* Simple footer */}
      <footer className="w-full py-lg bg-footer-bg border-t border-border-light mt-auto">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center text-[11px] text-muted font-bold">
          <div>© 2026 Vistra AI Fashion Concierge.</div>
          <div className="flex gap-md">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
