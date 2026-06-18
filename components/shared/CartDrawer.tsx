"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export function CartDrawer() {
  const {
    cart,
    cartTotal,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
  } = useCart();

  // Handle escape key to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDrawerOpen(false);
    };
    if (isDrawerOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen, setIsDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[450px] bg-white shadow-2xl flex flex-col border-l border-border-light animate-[slideIn_0.35s_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header */}
        <div className="p-lg border-b border-border-light flex justify-between items-center bg-stone-50">
          <div className="flex items-center gap-sm text-brand">
            <ShoppingBag className="h-5 w-5 text-charcoal" />
            <div>
              <h3 className="text-sm font-extrabold text-charcoal uppercase tracking-wider">
                Shopping Bag
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="w-8 h-8 rounded-full bg-white border border-border-light flex items-center justify-center hover:bg-neutral-100 transition-all cursor-pointer font-bold text-charcoal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-grow overflow-y-auto p-lg space-y-md bg-white">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-xl">
              <ShoppingBag className="h-12 w-12 text-muted mb-4 opacity-40" />
              <p className="text-sm font-bold text-charcoal">Your bag is empty</p>
              <p className="text-xs text-muted mt-1 max-w-[250px] font-semibold">
                Explore the luxury collection and add quiet luxury pieces to your bag.
              </p>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="mt-6 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-widest cursor-pointer border-none"
              >
                Continue Curation
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-md p-sm rounded-xl border border-border-light hover:shadow-sm transition-all duration-200"
              >
                {/* Image */}
                <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 relative">
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
                    <h4 className="text-xs font-bold text-charcoal truncate max-w-[200px]">
                      {item.title}
                    </h4>
                    {item.size && (
                      <p className="text-[10px] text-muted font-bold mt-0.5">
                        Size: {item.size}
                      </p>
                    )}
                    <p className="text-xs font-black text-primary mt-1">
                      ₹{item.price.toLocaleString("en-US")}
                    </p>
                  </div>

                  {/* Quantity & Delete Actions */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-border-light rounded-lg bg-stone-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 px-2 hover:bg-neutral-200 transition-colors border-none bg-transparent cursor-pointer flex items-center"
                      >
                        <Minus className="h-3 w-3 text-secondary" />
                      </button>
                      <span className="text-xs font-bold px-2 select-none text-charcoal">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 px-2 hover:bg-neutral-200 transition-colors border-none bg-transparent cursor-pointer flex items-center"
                      >
                        <Plus className="h-3 w-3 text-secondary" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors rounded-lg border-none bg-transparent cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-lg border-t border-border-light bg-stone-50 space-y-md">
            <div className="space-y-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                  Subtotal
                </span>
                <span className="text-lg font-black text-charcoal">
                  ₹{cartTotal.toLocaleString("en-US")}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-success-green font-bold uppercase tracking-wider">
                <span>Shipping</span>
                <span>Complementary</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsDrawerOpen(false)}
              className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-sm shadow-md transition-all active:scale-[0.98] no-underline tracking-widest uppercase cursor-pointer"
            >
              Proceed to Checkout
            </Link>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="w-full h-11 bg-transparent hover:bg-neutral-100 text-charcoal border border-border-light rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
