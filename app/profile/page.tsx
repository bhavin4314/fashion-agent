import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/app/_components/Navbar";
import { ProfileClient } from "./_components/ProfileClient";

interface DBOrderItem {
  id: string;
  quantity: number;
  size: string | null;
  price: number;
  product_id: string;
  products: {
    title: string;
    image_urls: string[] | null;
  } | null;
}

interface DBOrder {
  id: string;
  created_at: string;
  status: string;
  shipping_address: string;
  payment_status: string;
  total_amount: number;
  order_items: DBOrderItem[] | null;
}

export const metadata: Metadata = {
  title: "My Profile | Vistra",
  description: "Manage your luxury concierge profile and track styling orders.",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profile");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // If profiles table has no entry, create one (trigger should do this, but just in case)
    redirect("/login");
  }

  // Fetch orders with item lists
  const { data: dbOrders } = await supabase
    .from("orders")
    .select(`
      id,
      created_at,
      status,
      shipping_address,
      payment_status,
      total_amount,
      order_items (
        id,
        quantity,
        size,
        price,
        product_id,
        products (
          title,
          image_urls
        )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Format orders
  const formattedOrders = (dbOrders as unknown as DBOrder[] || []).map((order) => ({
    id: order.id,
    createdAt: order.created_at,
    status: order.status,
    shippingAddress: order.shipping_address,
    totalAmount: Number(order.total_amount),
    paymentStatus: order.payment_status,
    items: (order.order_items || []).map((item) => ({
      id: item.id,
      quantity: item.quantity,
      size: item.size,
      price: Number(item.price),
      title: item.products?.title || "Luxury Garment",
      image:
        item.products?.image_urls && item.products.image_urls[0]
          ? item.products.image_urls[0]
          : "https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg",
    })),
  }));

  const formattedProfile = {
    id: profile.id,
    fullName: profile.full_name,
    email: user.email || "",
    phone: profile.phone,
    shippingAddress: profile.shipping_address,
  };

  return (
    <div className="text-charcoal antialiased min-h-screen flex flex-col bg-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Profile Canvas */}
      <main className="pt-[120px] pb-xxl max-w-7xl w-full mx-auto px-margin-mobile md:px-margin-desktop flex-grow">
        <ProfileClient profile={formattedProfile} orders={formattedOrders} />
      </main>

      {/* Footer Section */}
      <footer className="w-full py-xl bg-footer-bg border-t border-border-light mt-auto">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center text-[11px] text-muted font-bold select-none">
          <div>© 2026 Vistra AI Fashion Concierge. All rights reserved.</div>
          <div className="flex gap-lg">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
