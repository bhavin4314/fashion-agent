import type { Metadata } from "next";
import { Navbar } from "../_components/Navbar";
import { CollectionClient } from "./_components/CollectionClient";
import { createClient } from "@/utils/supabase/server";
import { mapDbProduct } from "@/lib/db-products";

export const metadata: Metadata = {
  title: "Vistra | Explore Collection",
  description: "Explore Vistra's curated premium fashion essentials.",
};

export default async function CollectionPage() {
  const supabase = await createClient();
  const { data: dbProducts } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false })
    .limit(8);

  const initialProducts = (dbProducts || []).map(mapDbProduct);

  return (
    <div className="text-charcoal antialiased min-h-screen flex flex-col bg-white">
      {/* TopNavBar with Explore Collection active tab */}
      <Navbar activeTab="explore" />

      {/* Main Content Area */}
      <main className="pt-[100px] pb-xxl max-w-7xl w-full mx-auto px-margin-mobile md:px-margin-desktop flex-1">
        <CollectionClient initialProducts={initialProducts} />
      </main>

      {/* Footer Section */}
      <footer className="w-full py-xl bg-footer-bg border-t border-border-light mt-auto">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-center items-center gap-md select-none">
          <div className="text-sm text-charcoal">
            © 2026 Vistra AI Fashion Concierge. All rights reserved.
          </div>
          {/* <div className="flex gap-lg">
            <a
              className="text-sm font-semibold text-charcoal underline hover:no-underline transition-all duration-150"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-sm font-semibold text-charcoal underline hover:no-underline transition-all duration-150"
              href="#"
            >
              Terms of Service
            </a>
          </div> */}
        </div>
      </footer>
    </div>
  );
}
