import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = (await request.json()) as {
      items: Array<{ productId: string; size: string | null; quantity: number }>;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Empty cart items" }, { status: 400 });
    }

    // Check if Stripe keys are configured
    if (!stripeSecretKey) {
      // Return custom status so frontend fallback sandbox is activated
      return NextResponse.json({ stripe_keys_missing: true });
    }

    // Fetch products securely from DB to verify prices
    const productIds = items.map((item) => item.productId);
    const { data: dbProducts, error: dbError } = await supabase
      .from("products")
      .select("id, title, price, image_urls, description")
      .in("id", productIds);

    if (dbError || !dbProducts) {
      return NextResponse.json(
        { error: "Failed to verify product inventory" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const lineItems = items.map((item) => {
      const dbProduct = dbProducts.find((p) => p.id === item.productId);
      if (!dbProduct) {
        throw new Error(`Product not found in inventory: ${item.productId}`);
      }

      const imageUrl =
        dbProduct.image_urls && dbProduct.image_urls[0]
          ? dbProduct.image_urls[0]
          : "https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg";

      // Price is in numeric(10,2) in DB, convert to cents (Stripe uses lowest denomination)
      const unitAmountCents = Math.round(Number(dbProduct.price) * 100);

      const description = [
        dbProduct.description ? dbProduct.description.substring(0, 100) : "",
        item.size ? `Size: ${item.size}` : "",
      ]
        .filter(Boolean)
        .join(" · ");

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: dbProduct.title,
            description,
            images: [imageUrl],
          },
          unit_amount: unitAmountCents,
        },
        quantity: item.quantity,
      };
    });

    const origin = request.headers.get("origin") || "";

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["IN", "US", "GB", "CA", "FR", "DE", "IT"],
      },
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        user_id: user.id,
        // Store simple summary of cart items
        cart_items: JSON.stringify(
          items.map((i) => ({
            productId: i.productId,
            size: i.size,
            quantity: i.quantity,
            price: Number(
              dbProducts.find((p) => p.id === i.productId)?.price || 0
            ),
          }))
        ),
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/collection`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Stripe Checkout Session error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
