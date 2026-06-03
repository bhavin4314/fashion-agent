"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, ShoppingBag, Sparkles, X, ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

import { type Product, PRODUCTS } from "@/lib/products";

export function CollectionClient() {
  // Modal states
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = React.useState(false);

  // Wishlist state
  const [wishlist, setWishlist] = React.useState<number[]>([]);

  // Selected size state
  const [selectedSize, setSelectedSize] = React.useState<string>("M");

  // Filtering & Sorting states
  const [priceRanges, setPriceRanges] = React.useState<string[]>([]);
  const [selectedColors, setSelectedColors] = React.useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = React.useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<string>("Recommended");

  const openDetailView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      setIsAnimatingIn(true);
    }, 50);
  };

  const closeDetailView = () => {
    setIsAnimatingIn(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedProduct(null);
      document.body.style.overflow = "auto";
    }, 400);
  };

  const toggleWishlist = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handlePriceChange = (range: string) => {
    setPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleMaterialChange = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]
    );
  };

  const handleOccasionChange = (occasion: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(occasion) ? prev.filter((o) => o !== occasion) : [...prev, occasion]
    );
  };

  // Filtering Logic
  const filteredProducts = React.useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Price filter
      if (priceRanges.length > 0) {
        const matchesPrice = priceRanges.some((range) => {
          if (range === "0-100") return product.price <= 100;
          if (range === "100-250") return product.price > 100 && product.price <= 250;
          if (range === "250+") return product.price > 250;
          return false;
        });
        if (!matchesPrice) return false;
      }

      // Color filter
      if (selectedColors.length > 0 && !selectedColors.includes(product.color)) {
        return false;
      }

      // Material filter
      if (selectedMaterials.length > 0) {
        const matchesMaterial = selectedMaterials.some((mat) =>
          product.material.toLowerCase().includes(mat.toLowerCase())
        );
        if (!matchesMaterial) return false;
      }

      // Occasion filter
      if (selectedOccasions.length > 0 && !selectedOccasions.includes(product.occasion)) {
        return false;
      }

      return true;
    });
  }, [priceRanges, selectedColors, selectedMaterials, selectedOccasions]);

  // Sorting Logic
  const sortedProducts = React.useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "Price: Low to High") {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "Price: High to Low") {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "Newest") {
      return list.sort((a, b) => b.id - a.id);
    }
    return list; // Recommended / default
  }, [filteredProducts, sortBy]);

  const handleAddToBag = () => {
    if (!selectedProduct) return;
    alert(`Added size ${selectedSize} of "${selectedProduct.title}" to your Shopping Bag!`);
  };

  const handleAskStylist = () => {
    if (!selectedProduct) return;
    alert(`Initiating AI Stylist consultation regarding "${selectedProduct.title}".`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-gutter relative select-none">
      {/* Sidebar Filter System */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="sticky top-[100px] space-y-xl">
          <h2 className="text-headline-md font-headline-md mb-xl select-none">Filter & Sort</h2>

          {/* Price Filter */}
          <div className="space-y-md">
            <h3 className="text-label-md font-label-md select-none">Price</h3>
            <div className="space-y-sm">
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={priceRanges.includes("0-100")}
                  onChange={() => handlePriceChange("0-100")}
                  className="rounded border-outline-variant text-[#ff385c] focus:ring-[#ff385c] h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">$0 - $100</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={priceRanges.includes("100-250")}
                  onChange={() => handlePriceChange("100-250")}
                  className="rounded border-outline-variant text-[#ff385c] focus:ring-[#ff385c] h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">$100 - $250</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={priceRanges.includes("250+")}
                  onChange={() => handlePriceChange("250+")}
                  className="rounded border-outline-variant text-[#ff385c] focus:ring-[#ff385c] h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">$250+</span>
              </label>
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-md">
            <h3 className="text-label-md font-label-md select-none">Color</h3>
            <div className="flex flex-wrap gap-sm">
              <button
                onClick={() => handleColorToggle("white")}
                className={`w-8 h-8 rounded-full border border-outline-variant bg-white transition-all cursor-pointer ${
                  selectedColors.includes("white") ? "ring-2 ring-neutral-800 ring-offset-2 scale-110" : ""
                }`}
                title="White"
              />
              <button
                onClick={() => handleColorToggle("black")}
                className={`w-8 h-8 rounded-full border border-outline-variant bg-black transition-all cursor-pointer ${
                  selectedColors.includes("black") ? "ring-2 ring-neutral-800 ring-offset-2 scale-110" : ""
                }`}
                title="Black"
              />
              <button
                onClick={() => handleColorToggle("grey")}
                className={`w-8 h-8 rounded-full border border-outline-variant bg-stone-400 transition-all cursor-pointer ${
                  selectedColors.includes("grey") ? "ring-2 ring-neutral-800 ring-offset-2 scale-110" : ""
                }`}
                title="Grey"
              />
              <button
                onClick={() => handleColorToggle("tan")}
                className={`w-8 h-8 rounded-full border border-outline-variant bg-amber-800 transition-all cursor-pointer ${
                  selectedColors.includes("tan") ? "ring-2 ring-neutral-800 ring-offset-2 scale-110" : ""
                }`}
                title="Tan"
              />
            </div>
          </div>

          {/* Material Filter */}
          <div className="space-y-md">
            <h3 className="text-label-md font-label-md select-none">Material</h3>
            <div className="space-y-sm">
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes("linen")}
                  onChange={() => handleMaterialChange("linen")}
                  className="rounded border-outline-variant text-[#ff385c] focus:ring-[#ff385c] h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">Linen</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes("cashmere")}
                  onChange={() => handleMaterialChange("cashmere")}
                  className="rounded border-outline-variant text-[#ff385c] focus:ring-[#ff385c] h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">Cashmere</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes("cotton")}
                  onChange={() => handleMaterialChange("cotton")}
                  className="rounded border-outline-variant text-[#ff385c] focus:ring-[#ff385c] h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">Cotton</span>
              </label>
            </div>
          </div>

          {/* Occasion Filter */}
          <div className="space-y-md">
            <h3 className="text-label-md font-label-md select-none">Occasion</h3>
            <div className="space-y-sm">
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedOccasions.includes("Formal")}
                  onChange={() => handleOccasionChange("Formal")}
                  className="rounded border-outline-variant text-[#ff385c] focus:ring-[#ff385c] h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">Formal</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedOccasions.includes("Casual")}
                  onChange={() => handleOccasionChange("Casual")}
                  className="rounded border-outline-variant text-[#ff385c] focus:ring-[#ff385c] h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">Casual</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedOccasions.includes("Workwear")}
                  onChange={() => handleOccasionChange("Workwear")}
                  className="rounded border-outline-variant text-[#ff385c] focus:ring-[#ff385c] h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">Workwear</span>
              </label>
            </div>
          </div>
        </div>
      </aside>

      {/* Product Listing Area */}
      <div className="flex-1">
        {/* Grid Header Controls */}
        <div className="flex justify-between items-center mb-xl select-none">
          <span className="text-label-md text-secondary font-medium">
            {sortedProducts.length} items found
          </span>
          <div className="flex items-center gap-sm">
            <span className="text-label-md text-secondary">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-label-md font-bold focus:ring-0 cursor-pointer h-10 select-none"
            >
              <option>Recommended</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards Catalog */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter mb-xxl">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                window.location.href = `/product/${product.id}`;
              }}
              className="group cursor-pointer flex flex-col"
            >
              <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-surface-container-low mb-sm relative select-none">
                <Image
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[600ms] ease-out pointer-events-none"
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-surface/90 px-lg py-sm rounded-full text-label-sm font-label-sm shadow-lg backdrop-blur-md">
                    Quick View
                  </span>
                </div>
                <button
                  onClick={(e) => toggleWishlist(product.id, e)}
                  className="absolute top-md right-md bg-white/60 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm border border-white/40 group/heart"
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${
                      wishlist.includes(product.id)
                        ? "text-[#ff385c] fill-[#ff385c]"
                        : "text-on-surface group-hover/heart:text-[#ff385c]"
                    }`}
                  />
                </button>
              </div>
              <div className="flex flex-col gap-xs pt-2 select-none">
                <p className="text-label-sm font-bold uppercase tracking-widest text-secondary mb-0.5">
                  {product.category}
                </p>
                <h3 className="text-body-md font-headline-md text-on-surface tracking-tight font-semibold">
                  {product.title}
                </h3>
                <p className="text-body-md font-bold text-on-surface">${product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic loading indicator pagination */}
        <div className="flex flex-col items-center justify-center gap-md py-xxl select-none pointer-events-none">
          <div className="flex items-center gap-sm text-secondary animate-pulse">
            <RefreshCw className="h-4 w-4 text-sm animate-spin" />
            <span className="text-label-md font-label-md tracking-wider uppercase font-bold text-xs">
              Loading more items...
            </span>
          </div>
          <div className="w-12 h-1 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-[#ff385c]/30 w-1/3 animate-[loading_1.5s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      {/* Split-screen Product Detail View Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Blur backdrop overlay */}
          <div
            className={`absolute inset-0 bg-[#1a1c1c]/40 backdrop-blur-sm transition-opacity duration-300 ${
              isAnimatingIn ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeDetailView}
          />

          {/* Slider Drawer Content Panel */}
          <div
            className={`absolute right-0 top-0 h-full w-full lg:w-[90%] bg-surface flex flex-col lg:flex-row transform transition-transform duration-[400ms] ease-out shadow-2xl ${
              isAnimatingIn ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Modal Exit close button */}
            <button
              className="absolute top-md right-md z-10 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md border-none cursor-pointer"
              onClick={closeDetailView}
            >
              <X className="h-5 w-5 text-charcoal font-bold" />
            </button>

            {/* Left: 60% Large Portrait Image Area */}
            <div className="w-full lg:w-[60%] h-[512px] lg:h-full overflow-hidden bg-surface-container-lowest select-none relative">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-full h-full object-cover pointer-events-none"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                unoptimized
              />
            </div>

            {/* Right: 40% Product Information Detail Area */}
            <div className="w-full lg:w-[40%] h-full p-xl lg:p-xxl flex flex-col overflow-y-auto justify-center bg-white">
              <div className="mb-xxl">
                <p className="text-label-md font-label-md text-secondary uppercase tracking-widest mb-xs font-bold text-xs select-none">
                  {selectedProduct.material}
                </p>
                <h1 className="text-3xl lg:text-[40px] font-bold text-on-surface mb-sm leading-tight tracking-tight select-none">
                  {selectedProduct.title}
                </h1>
                <p className="text-2xl font-bold text-[#ff385c] mb-xl select-none">
                  ${selectedProduct.price}
                </p>

                {/* Quiet luxury editorial brand description */}
                <p className="text-body-md font-body-md text-secondary mb-xl leading-relaxed select-none">
                  Ethically sourced and meticulously crafted for a timeless silhouette. This piece embodies Vistra's commitment to quiet luxury and sustainable fashion excellence.
                </p>

                {/* Sizing Selector */}
                <div className="mb-xl">
                  <span className="text-label-md font-label-md text-on-surface block mb-md font-bold text-sm select-none">
                    Select Size
                  </span>
                  <div className="flex flex-wrap gap-sm select-none">
                    {["S", "M", "L", "XL"].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-14 h-14 rounded-lg flex items-center justify-center text-label-md font-label-md font-bold cursor-pointer transition-all duration-150 ${
                          selectedSize === sz
                            ? "border-2 border-neutral-800 bg-surface-container-high scale-105"
                            : "border border-outline-variant hover:border-on-surface bg-white"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add to Bag and Prominent Coral AI Stylist Buttons */}
                <div className="flex flex-col gap-md">
                  <button
                    onClick={handleAddToBag}
                    className="w-full py-lg bg-neutral-900 text-white rounded-xl font-label-md text-label-md hover:bg-neutral-850 transition-colors flex items-center justify-center gap-sm border-none cursor-pointer font-semibold shadow-md active:scale-[0.98]"
                  >
                    <ShoppingBag className="h-5 w-5 text-white" />
                    Add to Bag
                  </button>

                  <button
                    onClick={handleAskStylist}
                    className="w-full py-lg bg-[#ffdada] text-[#ba0036] rounded-xl font-label-md text-label-md hover:shadow-md transition-all flex items-center justify-center gap-sm border-2 border-[#ffb2b6]/40 cursor-pointer font-bold active:scale-[0.98]"
                  >
                    <Sparkles className="h-5 w-5 fill-[#ba0036]/20 text-[#ba0036]" />
                    Ask Stylist about this item
                  </button>
                </div>
              </div>

              {/* Product Specifications Accordions */}
              <div className="border-t border-surface-container pt-xl select-none">
                <div className="flex flex-col gap-lg">
                  <div
                    onClick={() => alert("100% sustainably sourced. Wash with similar colors.")}
                    className="flex justify-between items-center cursor-pointer group py-2"
                  >
                    <span className="text-label-md font-label-md font-bold text-sm text-neutral-800 group-hover:text-[#ff385c] transition-colors">
                      Material & Care
                    </span>
                    <ChevronDown className="h-5 w-5 text-secondary group-hover:text-[#ff385c] transition-colors" />
                  </div>
                  <div
                    onClick={() => alert("Free global courier shipping and 30-day hassle-free returns.")}
                    className="flex justify-between items-center cursor-pointer group py-2"
                  >
                    <span className="text-label-md font-label-md font-bold text-sm text-neutral-800 group-hover:text-[#ff385c] transition-colors">
                      Shipping & Returns
                    </span>
                    <ChevronDown className="h-5 w-5 text-secondary group-hover:text-[#ff385c] transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Continuous Loading bar CSS styling */}
      <style jsx global>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}
