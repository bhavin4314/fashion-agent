import type { Metadata } from "next";
import { Navbar } from "../_components/Navbar";
import { CartClient } from "./_components/CartClient";

export const metadata: Metadata = {
  title: "Your Selection | Vistra",
  description: "Review and manage your luxury selection before proceeding to checkout.",
};

export default function CartPage() {
  return (
    <div className="text-charcoal antialiased min-h-screen flex flex-col bg-white">
      {/* TopNavBar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="pt-[100px] pb-xxl max-w-7xl w-full mx-auto px-margin-mobile md:px-margin-desktop flex-grow flex flex-col">
        <CartClient />
      </main>

      {/* Footer Section */}
      <footer className="w-full py-xl bg-footer-bg border-t border-border-light mt-auto">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-center items-center gap-md select-none">
          <div className="text-sm text-charcoal">
            © 2026 Vistra AI Fashion Concierge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
