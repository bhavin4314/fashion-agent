import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/app/_components/Navbar";
import { ProductDetailClient } from "./_components/ProductDetailClient";
import { createClient } from "@/utils/supabase/server";
import { mapDbProduct } from "@/lib/db-products";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate dynamic metadata for extreme SEO efficiency
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const query = supabase.from("products").select("title, description");
  if (/^\d+$/.test(id)) {
    query.eq("id", parseInt(id, 10));
  } else {
    query.eq("id", id);
  }

  const { data: product } = await query.maybeSingle();

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
  const supabase = await createClient();

  // Get current user role
  const { data: { user } } = await supabase.auth.getUser();
  let userRole = "customer";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role) {
      userRole = profile.role;
    }
  }

  // Fetch product from Supabase
  const query = supabase.from("products").select("*");
  if (/^\d+$/.test(id)) {
    query.eq("id", parseInt(id, 10));
  } else {
    query.eq("id", id);
  }
  const { data: dbProduct } = await query.maybeSingle();

  if (!dbProduct) {
    return (
      <div className="text-charcoal antialiased min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="pt-[150px] pb-xxl max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-center flex-1">
          <h1 className="text-3xl font-extrabold text-charcoal mb-4">Garment Not Found</h1>
          <p className="text-muted mb-8 text-center max-w-[448px] font-semibold text-sm">
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

  // Fetch up to 4 other related items to complete the look
  const { data: dbRelatedProducts } = await supabase
    .from("products")
    .select("id, title, price, image_urls")
    .neq("id", dbProduct.id)
    .limit(4);

  const product = mapDbProduct(dbProduct);
  product.completeTheLook = (dbRelatedProducts || []).map((p) => ({
    id: p.id,
    title: p.title,
    price: Number(p.price),
    image: p.image_urls?.[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60"
  }));

  return (
    <div className="text-charcoal antialiased min-h-screen flex flex-col bg-white">
      {/* Top navigation header */}
      <Navbar activeTab="explore" />

      {/* Main product detail interactive catalog */}
      <main className="pt-[120px] pb-xxl max-w-7xl w-full mx-auto px-margin-mobile md:px-margin-desktop flex-1">
        <ProductDetailClient product={product} userRole={userRole} />
      </main>

      {/* Footer Section */}
      <footer className="w-full py-xl bg-footer-bg border-t border-border-light mt-auto">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md select-none">
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
