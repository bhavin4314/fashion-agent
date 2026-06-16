"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Sparkles, Heart, Plus, ArrowLeft, Edit } from "lucide-react";
import { type Product, PRODUCTS } from "@/lib/products";
import { cn } from "@/lib/utils";

interface ProductDetailClientProps {
  product: Product;
  userRole?: string;
}

export function ProductDetailClient({ product, userRole }: ProductDetailClientProps) {
  const isAdmin = userRole === "admin";
  const isAccessory = product.category === "Accessories" || product.category?.toLowerCase() === "accessories";
  // Client state
  const [selectedSize, setSelectedSize] = React.useState<string>("M");
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

  const handleCrossSellAdd = (title: string, price: number) => {
    alert(`Added "${title}" (₹${price}) to your Shopping Bag to complete the look!`);
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
        <button
          onClick={() => (window.location.href = "/collection")}
          className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-charcoal transition-colors duration-150 border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore Collection
        </button>
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
                    "w-full h-full object-cover transition-all ease-out pointer-events-none",
                    index === 0 ? "hover:scale-105 duration-700 cursor-zoom-in" : "hover:scale-110 duration-500"
                  )}
                  src={imgUrl}
                  fill
                  sizes={colSpanClass.includes("col-span-2") ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 1024px) 50vw, 30vw"}
                  unoptimized
                />
                {index === 0 && (
                  <button
                    onClick={() => setWishlist((prev) => !prev)}
                    className="absolute top-md right-md bg-white/60 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-md border border-white/40 group/heart"
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors ${
                        wishlist ? "text-brand fill-brand" : "text-on-surface group-hover/heart:text-brand"
                      }`}
                    />
                  </button>
                )}
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
              <div className="flex items-center gap-xs text-rating-yellow">
                <Star className="h-5 w-5 fill-rating-yellow text-rating-yellow" />
                <span className="text-label-md font-label-md text-on-surface font-semibold">
                  {product.rating} ({product.reviewsCount})
                </span>
              </div>
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
                <button
                  onClick={() => alert("Standard Vistra size measurements fit true to luxury sizing tables.")}
                  className="text-xs font-bold text-muted underline hover:text-brand transition-colors bg-transparent border-none cursor-pointer"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex gap-sm select-none">
                {["S", "M", "L", "XL"].map((sz) => (
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

            {/* AI Stylist Assistant Widget */}
            {!isAccessory && (
              <div className="p-lg rounded-xl flex flex-col gap-sm border-l-4 border-brand bg-gradient-to-br from-white to-primary-light-bg border border-error-container shadow-sm select-none">
                <div className="flex items-center gap-sm text-brand">
                  <Sparkles className="h-5 w-5 fill-brand/25 text-brand" />
                  <span className="text-label-md font-label-md font-bold text-sm">AI Stylist Assistant</span>
                </div>
                <p className="text-xs font-medium text-secondary italic leading-relaxed">
                  &ldquo;{product.aiRecommendation}&rdquo;
                </p>
                <button
                  onClick={() => setIsAiOpen(true)}
                  className="mt-xs w-full h-11 bg-white border border-outline-variant hover:border-on-surface text-on-surface rounded-lg font-label-md text-label-md hover:shadow-md transition-all flex items-center justify-center gap-sm cursor-pointer font-bold shadow-sm"
                >
                  Ask AI Stylist
                </button>
              </div>
            )}
          </div>


        </div>
      </section>

      {/* Complete the Look Cross-Sells Section */}
      {product.completeTheLook && product.completeTheLook.length > 0 && (
        <section className="max-w-7xl mx-auto py-xxl bg-surface-container-low rounded-3xl mb-20 px-xl lg:px-xxl select-none border border-border-light/40 shadow-sm">
          <h2 className="text-2xl font-bold text-on-surface mb-xl text-center tracking-tight">
            Complete the Look
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {product.completeTheLook.map((lookItem, index) => {
              let itemLink = "/collection";
              if (lookItem.id) {
                itemLink = `/product/${lookItem.id}`;
              } else {
                const matched = PRODUCTS.find((p) => p.title.toLowerCase() === lookItem.title.toLowerCase());
                if (matched) {
                  itemLink = `/product/${matched.id}`;
                }
              }

              return (
                <Link key={index} href={itemLink} className="group flex flex-col cursor-pointer text-current no-underline">
                  <div className="aspect-[3/4] overflow-hidden rounded-xl bg-white relative mb-md shadow-sm">
                    <Image
                      alt={lookItem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 pointer-events-none"
                      src={lookItem.image}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      unoptimized
                    />
                    {!isAdmin && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCrossSellAdd(lookItem.title, lookItem.price);
                        }}
                        className="absolute bottom-md right-md w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 border-none cursor-pointer z-10"
                      >
                        <Plus className="h-5 w-5 text-brand" />
                      </button>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-on-surface tracking-tight">
                    {lookItem.title}
                  </h3>
                  <p className="text-xs font-bold text-secondary mt-1">
                    ₹{lookItem.price}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

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
