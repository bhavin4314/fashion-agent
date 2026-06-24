"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { QuantityInput } from "@/components/ui";

export function CartClient() {
  const {
    cart,
    cartTotal,
    isLoaded,
    updateQuantity,
    removeFromCart,
  } = useCart();

  if (!isLoaded) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-charcoal mb-8 uppercase select-none">
        Your Selection
      </h1>

      {cart.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-xl min-h-[350px]">
          <ShoppingBag className="h-16 w-16 text-muted mb-6 opacity-40" />
          <h2 className="text-lg font-bold text-charcoal">Your bag is empty</h2>
          <p className="text-xs text-muted mt-2 max-w-[280px] font-semibold leading-relaxed">
            Explore the luxury collection and add quiet luxury pieces to your bag.
          </p>
          <Link
            href="/collection"
            className="mt-8 px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest cursor-pointer border-none no-underline"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Cart Items list */}
          <div className="lg:col-span-8 space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 p-5 rounded-2xl border border-border-light bg-white hover:shadow-sm transition-all duration-200"
              >
                {/* Product Image */}
                <div className="w-24 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Details */}
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-charcoal">
                          {item.title}
                        </h3>
                        {item.size && (
                          <p className="text-[10px] text-muted font-bold mt-1">
                            Size: {item.size}
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-black text-primary">
                        ₹{item.price.toLocaleString("en-US")}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Delete Actions */}
                  <div className="flex items-center justify-between mt-6">
                    {(() => {
                      const otherSizesQty = cart
                        .filter(
                          (cartItem) =>
                            cartItem.productId === item.productId &&
                            cartItem.id !== item.id
                        )
                        .reduce((sum, cartItem) => sum + cartItem.quantity, 0);
                      const maxAllowed =
                        item.stock_quantity !== undefined
                          ? Math.max(0, item.stock_quantity - otherSizesQty)
                          : undefined;
                      return (
                        <QuantityInput
                          value={item.quantity}
                          onChange={(qty) => updateQuantity(item.id, qty)}
                          size="md"
                          stockQuantity={maxAllowed}
                          showDeleteAtOne
                          onDelete={() => removeFromCart(item.id)}
                        />
                      );
                    })()}

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-1.5 p-2 hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors rounded-lg border-none bg-transparent cursor-pointer font-bold text-xs"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-stone-50 rounded-2xl p-6 border border-border-light space-y-6 lg:sticky lg:top-[120px]">
              <h2 className="text-xs font-extrabold text-charcoal uppercase tracking-widest">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-muted">
                  <span className="uppercase tracking-wider">Subtotal</span>
                  <span className="text-sm font-bold text-charcoal">
                    ₹{cartTotal.toLocaleString("en-US")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-muted">
                  <span className="uppercase tracking-wider">Shipping</span>
                  <span className="text-success-green uppercase tracking-wider">
                    Complimentary
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-muted">
                  <span className="uppercase tracking-wider">Duties & Taxes</span>
                  <span className="text-charcoal uppercase tracking-wider">
                    Included
                  </span>
                </div>
              </div>

              <hr className="border-t border-border-light" />

              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-charcoal uppercase tracking-wider">
                  Total
                </span>
                <span className="text-lg font-black text-primary">
                  ₹{cartTotal.toLocaleString("en-US")}
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href="/checkout"
                  className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-sm shadow-md transition-all active:scale-[0.98] no-underline tracking-widest uppercase cursor-pointer"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/collection"
                  className="w-full h-11 bg-white hover:bg-neutral-100 text-charcoal border border-border-light rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center no-underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
