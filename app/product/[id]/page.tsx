import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/app/_components/Navbar";
import { PRODUCTS } from "@/lib/products";
import { ProductDetailClient } from "./_components/ProductDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate dynamic metadata for extreme SEO efficiency
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = parseInt(id, 10);
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return {
      title: "Product Not Found | Vistra",
      description: "The luxury garment you are looking for could not be found.",
    };
  }

  return {
    title: `Vistra | ${product.title}`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  const product = PRODUCTS.find((p) => p.id === productId);

  // Fallback if the product ID is not in our database
  if (!product) {
    return (
      <div className="text-charcoal antialiased min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="pt-[150px] pb-xxl max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-center flex-1">
          <h1 className="text-3xl font-extrabold text-charcoal mb-4">Garment Not Found</h1>
          <p className="text-muted mb-8 text-center max-w-md font-semibold text-sm">
            We apologize, but the quiet luxury piece you requested is currently unavailable or has been archived.
          </p>
          <Link
            href="/collection"
            className="px-8 py-4 bg-neutral-900 text-white font-bold rounded-xl shadow-md text-xs hover:bg-neutral-800 transition-colors uppercase tracking-widest"
          >
            Explore Collection
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="text-charcoal antialiased min-h-screen flex flex-col bg-white">
      {/* Top navigation header */}
      <Navbar activeTab="explore" />

      {/* Main product detail interactive catalog */}
      <main className="pt-[120px] pb-xxl max-w-7xl w-full mx-auto px-margin-mobile md:px-margin-desktop flex-1">
        <ProductDetailClient product={product} />
      </main>

      {/* Footer Section */}
      <footer className="w-full py-xl bg-footer-bg border-t border-border-light mt-auto">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md select-none">
          <div className="text-sm text-charcoal">
            © 2026 Vistra AI Fashion Concierge. All rights reserved.
          </div>
          <div className="flex gap-lg">
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
          </div>
        </div>
      </footer>
    </div>
  );
}
