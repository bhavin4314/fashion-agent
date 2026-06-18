"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Sparkles, Heart, ArrowLeft, Edit } from "lucide-react";
import { type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

interface ProductDetailClientProps {
  product: Product;
  userRole?: string;
}

export function ProductDetailClient({ product, userRole }: ProductDetailClientProps) {
  const isAdmin = userRole === "admin";
  const isAccessory = product.category === "Accessories" || product.category?.toLowerCase() === "accessories";
  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"];
  // Client state
  const [selectedSize, setSelectedSize] = React.useState<string>(availableSizes[0] || "M");
  const [wishlist, setWishlist] = React.useState<boolean>(false);
  const [isBagging, setIsBagging] = React.useState<boolean>(false);
  


  // AI Stylist active chat state
  const [isAiOpen, setIsAiOpen] = React.useState<boolean>(false);
  const [chatInput, setChatInput] = React.useState<string>("");
  const [chatHistory, setChatHistory] = React.useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: `Hello! I'm your Vistra AI Fashion Stylist. I'm here to consult on styling the "${product.title}" (₹${product.price}). ${product.aiRecommendation} How else can I style this for your look?`
    }
  ]);



  const handleAddToBag = () => {
    setIsBagging(true);
    setTimeout(() => {
      setIsBagging(false);
      const sizeMsg = isAccessory ? "" : ` size ${selectedSize}`;
      alert(`Added${sizeMsg} of "${product.title}" to your Shopping Bag!`);
    }, 800);
  };



  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);

    // Simulated premium stylist response logic
    setTimeout(() => {
      let aiResponse = "";
      const lower = userMsg.toLowerCase();
      if (lower.includes("size") || lower.includes("fit")) {
        aiResponse = `The ${product.title} is designed for a relaxed, slightly oversized luxury silhouette. If you prefer a closer fit, I'd recommend sizing down. Otherwise, stick to your standard size for the intended editorial drape.`;
      } else if (lower.includes("color") || lower.includes("match") || lower.includes("pair")) {
        aiResponse = `For high-end coordination, I suggest pairing this ${product.color} piece with tones like ecru, rich espresso, or slate grey. It is best styled with quiet luxury trousers or tailored high-waisted shorts.`;
      } else if (lower.includes("occasion") || lower.includes("wear") || lower.includes("formal")) {
        aiResponse = `Absolutely! This is extremely versatile. For a casual coastal mood, style it open with light trousers. For a more formal, elevated setting, tuck it into structured pleated trousers, adding a leather belt and premium slides or loaders.`;
      } else {
        aiResponse = `What a sophisticated question! The ${product.material} of this item lends itself beautifully to textured layering. I highly recommend complementing it with fine gold link jewelry and minimalist leather accessories to pull the entire Vistra look together.`;
      }

      setChatHistory((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    }, 600);
  };

  return (
    <div className="text-charcoal antialiased bg-white select-none">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/collection"
          className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-charcoal transition-colors duration-150 border-none bg-transparent cursor-pointer no-underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore Collection
        </Link>
      </div>

      {/* Main product detail grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-20">
        
        {/* Gallery: Dynamic Bento Style Left (7 columns) */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-md h-fit">
          {product.galleryImages.map((imgUrl, index) => {
            const isSingle = product.galleryImages.length === 1;
            const isDouble = product.galleryImages.length === 2;
            
            const colSpanClass = isSingle 
              ? "col-span-2 aspect-[4/3] md:aspect-[16/10]" 
              : isDouble 
              ? "col-span-1 aspect-[3/4]" 
              : index === 0 
              ? "col-span-2 aspect-[4/3] md:aspect-[16/10]" 
              : "col-span-1 aspect-[3/4]";

            return (
              <div key={index} className={cn("overflow-hidden rounded-xl bg-surface-container-low relative group", colSpanClass)}>
                <Image
                  alt={`${product.title} View ${index + 1}`}
                  className={cn(
                    "w-full h-full object-contain transition-all ease-out pointer-events-none",
                    index === 0 ? "hover:scale-105 duration-700 cursor-zoom-in" : "hover:scale-110 duration-500"
                  )}
                  src={imgUrl}
                  fill
                  sizes={colSpanClass.includes("col-span-2") ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 1024px) 50vw, 30vw"}
                  unoptimized
                />

              </div>
            );
          })}
        </div>

        {/* Product Info: Sticky Sidebar Right (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-xl lg:sticky lg:top-[120px] h-fit">
          <div>
            <nav className="flex gap-xs text-xs font-bold uppercase tracking-wider text-muted mb-2 select-none">
              <span>{product.category}</span>
              {product.subcategory && (
                <>
                  <span className="mx-1">/</span>
                  <span>{product.subcategory}</span>
                </>
              )}
            </nav>
            <h1 className="text-3xl lg:text-[40px] font-bold text-on-surface leading-tight tracking-tight mb-2 select-none">
              {product.title}
            </h1>
            <div className="flex items-center gap-md">
              <span className="text-2xl font-bold text-brand">₹{product.price}</span>
            </div>
          </div>

          <p className="text-body-md font-body-md text-secondary leading-relaxed select-none">
            {product.description}
          </p>

          {/* Size Selector */}
          {!isAccessory && (
            <div className="flex flex-col gap-md">
              <div className="flex justify-between items-center select-none">
                <span className="text-label-md font-label-md text-on-surface font-bold text-sm">
                  Select Size
                </span>
              </div>
              <div className="flex gap-sm select-none">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-label-md font-label-md font-bold cursor-pointer transition-all duration-150 ${
                      selectedSize === sz
                        ? "border-2 border-neutral-800 bg-surface-container-high scale-105 shadow-sm"
                        : "border border-outline-variant hover:border-on-surface bg-white"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-md">
            {isAdmin && (
              <Link
                href={`/admin/inventory/create?edit=${product.id}`}
                className="w-full h-14 bg-primary hover:bg-primary-dark text-white rounded-xl font-label-md text-label-md flex items-center justify-center gap-sm active:scale-95 transition-all duration-200 shadow-md no-underline font-semibold cursor-pointer"
              >
                <Edit className="h-5 w-5 text-white" />
                Edit Product
              </Link>
            )}

            {!isAdmin && (
              <button
                onClick={handleAddToBag}
                disabled={isBagging}
                className={`w-full h-14 text-white rounded-xl font-label-md text-label-md flex items-center justify-center gap-sm active:scale-95 transition-all duration-200 shadow-md border-none cursor-pointer font-semibold ${
                  isBagging ? "bg-neutral-700" : "bg-primary hover:bg-primary-dark"
                }`}
              >
                <ShoppingBag className="h-5 w-5 text-white" />
                {isBagging ? "Adding to Bag..." : "Add to Bag"}
              </button>
            )}


          </div>


        </div>
      </section>



      {/* Dynamic AI Stylist Dialogue Overlay Drawer */}
      {isAiOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsAiOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="absolute right-0 top-0 h-full w-full sm:w-[450px] bg-white shadow-2xl flex flex-col border-l border-border-light animate-[slideIn_0.35s_cubic-bezier(0.16,1,0.3,1)]">
            
            {/* Header */}
            <div className="p-xl border-b border-border-light flex justify-between items-center bg-gradient-to-r from-white to-primary-light-bg">
              <div className="flex items-center gap-sm text-brand">
                <Sparkles className="h-5 w-5 fill-brand/25 text-brand" />
                <div>
                  <h3 className="text-sm font-extrabold text-charcoal">Vistra AI Stylist</h3>
                  <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">Premium Concierge</span>
                </div>
              </div>
              <button
                onClick={() => setIsAiOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container border-none flex items-center justify-center hover:bg-neutral-100 transition-all cursor-pointer font-bold text-charcoal"
              >
                ✕
              </button>
            </div>

            {/* Chats Stream */}
            <div className="flex-1 overflow-y-auto p-xl space-y-md bg-stone-50/50">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-lg text-xs leading-relaxed font-semibold shadow-sm ${
                      msg.sender === "user"
                        ? "bg-neutral-900 text-white rounded-tr-none"
                        : "bg-white border border-border-light text-secondary rounded-tl-none border-l-4 border-l-brand"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChat} className="p-lg border-t border-border-light flex gap-sm bg-white">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about size, coordinates, or occasions..."
                className="flex-1 h-11 px-md rounded-xl border border-outline-variant bg-background text-xs font-semibold focus:outline-none focus:border-neutral-900 input-focus-ring"
              />
              <button
                type="submit"
                className="h-11 px-lg bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-850 transition-colors border-none cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Custom sliding animations style */}
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
