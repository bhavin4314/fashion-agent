"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { verifyStripeSessionAndCreateOrder, getOrderDetailsAction } from "../actions";

interface OrderDetail {
  id: string;
  createdAt: string;
  status: string;
  shippingAddress: string;
  customerName: string;
  customerEmail: string;
  paymentStatus: string;
  totalAmount: number;
}

interface OrderItemDetail {
  id: string;
  quantity: number;
  size: string | null;
  price: number;
  title: string;
  image: string;
}

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [order, setOrder] = React.useState<OrderDetail | null>(null);
  const [items, setItems] = React.useState<OrderItemDetail[]>([]);

  React.useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const orderId = searchParams.get("order_id");

    const processCheckoutSuccess = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));

      if (!sessionId && !orderId) {
        setError("No session identifier or order ID was provided.");
        setLoading(false);
        return;
      }

      try {
        let finalOrderId = orderId;

        if (sessionId) {
          const verifyResult = await verifyStripeSessionAndCreateOrder(sessionId);
          if (verifyResult.success && verifyResult.orderId) {
            finalOrderId = verifyResult.orderId;
          } else {
            setError(verifyResult.error ?? "Failed to verify Stripe session.");
            setLoading(false);
            return;
          }
        }

        if (finalOrderId) {
          const detailsResult = await getOrderDetailsAction(finalOrderId);
          if (detailsResult.success && detailsResult.order && detailsResult.items) {
            setOrder(detailsResult.order);
            setItems(detailsResult.items);
            clearCart();
          } else {
            setError(detailsResult.error ?? "Failed to retrieve order details.");
          }
        }
      } catch (err: unknown) {
        console.error(err);
        setError("An unexpected error occurred while loading your order confirmation.");
      } finally {
        setLoading(false);
      }
    };

    processCheckoutSuccess();
  }, [searchParams, clearCart]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-md select-none">
        <Loader2 className="h-10 w-10 text-brand animate-spin" />
        <h3 className="text-sm font-extrabold text-charcoal uppercase tracking-widest">
          Confirming Order
        </h3>
        <p className="text-xs text-muted font-semibold">
          Finalizing payment details and securing your luxury order...
        </p>
      </div>
    );
  }

  if (error ?? !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-xl">
        <p className="text-sm font-bold text-red-600">Verification Failed</p>
        <p className="text-xs text-secondary font-semibold mt-2 max-w-md leading-relaxed">
          {error ?? "We could not fetch details for this order."}
        </p>
        <button
          onClick={() => router.push("/collection")}
          className="mt-6 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-widest cursor-pointer border-none"
        >
          Back to Collection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-16 select-none">
      <div className="max-w-4xl mx-auto">
        {/* Success Indicator */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 border border-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-charcoal tracking-tight">
            Order Confirmed
          </h1>
          <p className="text-xs text-muted font-semibold mt-2 leading-relaxed">
            Thank you for choosing Vistra. Your order{" "}
            <span className="font-black text-charcoal">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>{" "}
            has been successfully placed and is being curated by our design team.
          </p>
        </div>

        {/* Details Card */}
        <div className="w-full bg-surface-container-lowest border border-border-light rounded-2xl shadow-sm overflow-hidden">
          {/* Receipt Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 md:p-8 border-b border-border-light">
            <div>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">
                Order ID
              </p>
              <p className="font-black text-sm text-charcoal">
                VST-{order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">
                Date
              </p>
              <p className="font-bold text-sm text-charcoal">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">
                Payment Status
              </p>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-green-100 text-green-800 uppercase tracking-wide">
                {order.paymentStatus}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">
                Total Paid
              </p>
              <p className="font-black text-sm text-brand">
                ₹{order.totalAmount.toLocaleString("en-US")}
              </p>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="p-6 md:p-8 border-b border-border-light">
            <h4 className="text-[10px] font-black text-charcoal uppercase tracking-widest mb-5">
              Garments Curation
            </h4>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 relative border border-border-light">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-sm text-charcoal leading-snug">{item.title}</h5>
                    {item.size && (
                      <p className="text-[11px] text-muted font-bold mt-1">Size: {item.size}</p>
                    )}
                    <p className="text-sm text-charcoal font-semibold mt-1">
                      ₹{item.price.toLocaleString("en-US")}
                    </p>
                  </div>
                  <div className="text-right text-xs font-semibold text-secondary whitespace-nowrap pt-1">
                    Qty: {item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address & Contact */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] font-black text-charcoal uppercase tracking-widest mb-3">
                Shipping Address
              </h4>
              <p className="text-sm text-secondary font-semibold leading-relaxed">
                {order.customerName}
              </p>
              <p className="text-sm text-secondary font-semibold leading-relaxed whitespace-pre-line mt-1">
                {order.shippingAddress}
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-charcoal uppercase tracking-widest mb-3">
                Contact Information
              </h4>
              <p className="text-sm text-secondary font-semibold leading-relaxed">
                {order.customerEmail}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={() => router.push("/profile?tab=orders")}
            className="flex-1 h-14 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer border-none uppercase tracking-widest"
          >
            Track Styling Order
            <ArrowRight className="h-4 w-4 text-white" />
          </button>
          <button
            onClick={() => router.push("/collection")}
            className="flex-1 h-14 bg-transparent hover:bg-neutral-100 text-charcoal border border-border-light rounded-xl text-xs font-bold transition-all cursor-pointer uppercase tracking-widest"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
