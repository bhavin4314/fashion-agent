"use server";

import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

interface StripeAddress {
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
}

interface StripeShippingDetails {
  name: string | null;
  phone?: string | null;
  address: StripeAddress | null;
}

interface StripeCheckoutSession extends Omit<Stripe.Checkout.Session, "collected_information"> {
  shipping_details?: StripeShippingDetails | null;
  collected_information: {
    shipping_details?: StripeShippingDetails | null;
  } | null;
}

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

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function verifyStripeSessionAndCreateOrder(sessionId: string) {
  try {
    if (!stripeSecretKey) {
      return { success: false, error: "Stripe is not configured on the server." };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized access." };
    }

    // 1. Check if the order already exists in Supabase
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (existingOrder) {
      return { success: true, orderId: existingOrder.id };
    }

    // 2. Retrieve session details from Stripe
    const stripe = new Stripe(stripeSecretKey);

    const session = (await stripe.checkout.sessions.retrieve(sessionId)) as unknown as StripeCheckoutSession;

    if (!session || session.payment_status !== "paid") {
      return {
        success: false,
        error: "Stripe payment has not been successfully completed.",
      };
    }

    const userId = session.metadata?.user_id;
    if (!userId || userId !== user.id) {
      return { success: false, error: "Session identity mismatch." };
    }

    // 3. Extract shipping and contact info
    const shippingDetails =
      session.shipping_details ||
      session.collected_information?.shipping_details;

    const customerName =
      shippingDetails?.name ||
      session.customer_details?.name ||
      "Luxe Customer";
    const phone =
      shippingDetails?.phone ||
      session.customer_details?.phone ||
      "No phone collected";

    const address = shippingDetails?.address || session.customer_details?.address;
    let addressString = address
      ? [
          address.line1,
          address.line2,
          address.city,
          address.state,
          address.postal_code,
          address.country,
        ]
          .filter(Boolean)
          .join(", ")
      : "";

    if (!addressString) {
      addressString = "No address collected";
    }

    const totalAmount = Number(session.amount_total || 0) / 100;
    const cartItemsStr = session.metadata?.cart_items;

    if (!cartItemsStr) {
      return { success: false, error: "Cart details missing in session metadata." };
    }

    const cartItems = JSON.parse(cartItemsStr) as Array<{
      productId: string;
      size: string | null;
      quantity: number;
      price: number;
    }>;

    // 4. Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: "ordered",
        shipping_address: `${addressString}\nPhone: ${phone}`,
        customer_name: customerName,
        customer_email: session.customer_details?.email || user.email || "",
        payment_status: "paid",
        stripe_session_id: sessionId,
        total_amount: totalAmount,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Stripe success handler failed to insert order:", orderError);
      return { success: false, error: "Failed to save order details." };
    }

    // 5. Insert order items
    const orderItemsToInsert = cartItems.map((item) => ({
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
      console.error("Stripe success handler failed to insert order items:", itemsError);
      // Clean up order
      await supabase.from("orders").delete().eq("id", order.id);
      return { success: false, error: "Failed to record order item details." };
    }

    // 6. Update inventory stock quantities
    for (const item of cartItems) {
      // Use RPC call to decrement stock securely (bypasses RLS via SECURITY DEFINER)
      const { error: decrementError } = await supabase.rpc(
        "decrement_product_stock",
        {
          product_id: item.productId,
          quantity_to_decrement: item.quantity,
        }
      );
      if (decrementError) {
        console.error("Failed to decrement product stock:", decrementError);
      }
    }

    // Update profile shipping address and phone if not set
    await supabase
      .from("profiles")
      .update({
        shipping_address: addressString,
        phone: phone,
      })
      .eq("id", user.id);

    return {
      success: true,
      orderId: order.id,
    };
  } catch (err: unknown) {
    console.error("verifyStripeSessionAndCreateOrder error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal error occurred",
    };
  }
}

export async function getOrderDetailsAction(orderId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return { success: false, error: "Order not found" };
    }

    // Security check: User must own the order or be an admin
    if (order.user_id !== user.id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        return { success: false, error: "Unauthorized access to order details" };
      }
    }

    // Get items with product info
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
      return { success: false, error: "Failed to load order items" };
    }

    // Format items
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
      },
      items: formattedItems,
    };
  } catch (err: unknown) {
    console.error("getOrderDetailsAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal error occurred",
    };
  }
}
