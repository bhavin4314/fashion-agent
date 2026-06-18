"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

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

const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["ordered", "confirmed", "shipped", "out_for_delivery", "delivered", "cancelled"]),
  internalNote: z.string().optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

export async function updateOrderStatusAction(input: unknown) {
  try {
    const parsed = updateOrderStatusSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid input: " + parsed.error.message,
      };
    }

    const { orderId, status, internalNote } = parsed.data;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in." };
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Unauthorized access. Admins only." };
    }

    // Update order status
    const { error } = await supabase
      .from("orders")
      .update({
        status: status,
        internal_note: internalNote || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      console.error("Failed to update order status:", error);
      return { success: false, error: "Failed to update order: " + error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("updateOrderStatusAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal error occurred",
    };
  }
}

export async function getAdminOrderDetailsAction(orderId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in." };
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Unauthorized access. Admins only." };
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return { success: false, error: "Order not found." };
    }

    // Fetch buyer profile to get original signup email
    const { data: buyerProfile } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", order.user_id)
      .single();

    // Get items with product images and details
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        id,
        quantity,
        size,
        price,
        product_id,
        products (
          title,
          image_urls
        )
      `)
      .eq("order_id", orderId);

    if (itemsError || !items) {
      return { success: false, error: "Failed to load order items." };
    }

    const formattedItems = (items as unknown as DBOrderItem[]).map((item) => ({
      id: item.id,
      quantity: item.quantity,
      size: item.size,
      price: Number(item.price),
      title: item.products?.title || "Luxury Garment",
      image:
        item.products?.image_urls && item.products.image_urls[0]
          ? item.products.image_urls[0]
          : "https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg",
    }));

    return {
      success: true,
      order: {
        id: order.id,
        createdAt: order.created_at,
        status: order.status,
        shippingAddress: order.shipping_address,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        paymentStatus: order.payment_status,
        totalAmount: Number(order.total_amount),
        stripeSessionId: order.stripe_session_id,
        internalNote: order.internal_note,
        buyerId: order.user_id,
      },
      items: formattedItems,
    };
  } catch (err: unknown) {
    console.error("getAdminOrderDetailsAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal error occurred",
    };
  }
}
