"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  size: z.string().nullable(),
  price: z.number().positive(),
});

const createOrderSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  address: z.string().min(10),
  totalAmount: z.number().positive(),
  stripeSessionId: z.string().nullable().optional(),
  items: z.array(orderItemSchema).min(1),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export async function createOrderAction(input: unknown) {
  try {
    const parsed = createOrderSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid order inputs: " + parsed.error.message,
      };
    }

    const { fullName, phone, address, totalAmount, stripeSessionId, items } =
      parsed.data;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in to make a purchase." };
    }

    // 1. Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: "ordered",
        shipping_address: `${address}\nPhone: ${phone}`,
        customer_name: fullName,
        customer_email: user.email || "",
        payment_status: "paid", // For demo/stripe checkout sessions, payment is captured
        stripe_session_id: stripeSessionId || null,
        total_amount: totalAmount,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Failed to insert order:", orderError);
      return {
        success: false,
        error: "Failed to process order. " + orderError?.message,
      };
    }

    // 2. Insert order items
    const orderItemsToInsert = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      size: item.size,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error("Failed to insert order items:", itemsError);
      // Clean up the order in case items fail
      await supabase.from("orders").delete().eq("id", order.id);
      return { success: false, error: "Failed to record order details." };
    }

    // 3. Update stock quantities and update profile shipping details if empty
    for (const item of items) {
      // Fetch current stock
      const { data: product } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", item.productId)
        .single();

      if (product) {
        const newStock = Math.max(0, product.stock_quantity - item.quantity);
        await supabase
          .from("products")
          .update({ stock_quantity: newStock })
          .eq("id", item.productId);
      }
    }

    // Update profile shipping address and phone if not set
    const { data: profile } = await supabase
      .from("profiles")
      .select("shipping_address, phone")
      .eq("id", user.id)
      .single();

    if (profile && (!profile.shipping_address || !profile.phone)) {
      await supabase
        .from("profiles")
        .update({
          shipping_address: profile.shipping_address || address,
          phone: profile.phone || phone,
        })
        .eq("id", user.id);
    }

    return {
      success: true,
      orderId: order.id,
    };
  } catch (error: unknown) {
    console.error("Failed to create order server action:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error occurred",
    };
  }
}
