"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function StripeRedirectClient() {
  const { cart, isLoaded } = useCart();
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isLoaded) return;

    if (cart.length === 0) {
      router.push("/collection");
      return;
    }

    const triggerCheckout = async () => {
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cart.map((item) => ({
              productId: item.productId,
              size: item.size,
              quantity: item.quantity,
            })),
          }),
        });

        const data = (await response.json()) as {
          url?: string;
          error?: string;
        };

        if (data.url) {
          // Redirect directly to Stripe hosted checkout page
          window.location.href = data.url;
        } else if (data.error) {
          setError(data.error);
          toast.error(data.error);
        } else {
          setError("Failed to initialize payment gateway.");
          toast.error("Failed to initialize payment gateway.");
        }
      } catch (err: unknown) {
        console.error(err);
        const errMsg = err instanceof Error ? err.message : "Network error occurred";
        setError(errMsg);
        toast.error(errMsg);
      }
    };

    triggerCheckout();
  }, [cart, router]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white px-margin-mobile md:px-margin-desktop py-xxl">
        <div className="text-center p-lg md:p-xl bg-white rounded-xl border border-border-light w-full max-w-2xl shadow-sm flex flex-col items-center justify-center">
          <p className="text-sm font-bold text-red-600 uppercase tracking-widest">Checkout Error</p>
          <p className="text-xs text-secondary font-semibold mt-3 w-full break-words leading-relaxed">{error}</p>
          <button
            onClick={() => router.push("/collection")}
            className="mt-6 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-widest cursor-pointer border-none"
          >
            Back to Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-white px-margin-mobile md:px-margin-desktop py-xxl select-none">
      <div className="text-center flex flex-col items-center gap-md w-full">
        <Loader2 className="h-10 w-10 text-brand animate-spin" />
        <h3 className="text-sm font-extrabold text-charcoal uppercase tracking-widest">
          Connecting to Stripe
        </h3>
        <p className="text-xs text-muted font-semibold max-w-[300px]">
          Redirecting you securely to Stripe to complete your purchase. Please do not reload.
        </p>
      </div>
    </div>
  );
}
