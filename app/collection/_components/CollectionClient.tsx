"use client";

import * as React from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

import { type Product } from "@/lib/products";

interface CollectionClientProps {
  initialProducts: Product[];
}

export function CollectionClient({ initialProducts }: CollectionClientProps) {
  // Wishlist state
  const [wishlist, setWishlist] = React.useState<Array<number | string>>([]);

  // Filtering & Sorting states
  const [priceRanges, setPriceRanges] = React.useState<string[]>([]);
  const [selectedColors, setSelectedColors] = React.useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = React.useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<string>("Recommended");

  const toggleWishlist = (productId: number | string, e: React.MouseEvent) => {
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
    return initialProducts.filter((product) => {
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
  }, [initialProducts, priceRanges, selectedColors, selectedMaterials, selectedOccasions]);

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
      return list.sort((a, b) => {
        if (typeof a.id === "number" && typeof b.id === "number") {
          return b.id - a.id;
        }
        return String(b.id).localeCompare(String(a.id));
      });
    }
    return list; // Recommended / default
  }, [filteredProducts, sortBy]);

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
                  className="rounded border-outline-variant text-brand focus:ring-brand h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">₹0 - ₹100</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={priceRanges.includes("100-250")}
                  onChange={() => handlePriceChange("100-250")}
                  className="rounded border-outline-variant text-brand focus:ring-brand h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">₹100 - ₹250</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={priceRanges.includes("250+")}
                  onChange={() => handlePriceChange("250+")}
                  className="rounded border-outline-variant text-brand focus:ring-brand h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">₹250+</span>
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
                  className="rounded border-outline-variant text-brand focus:ring-brand h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">Linen</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes("cashmere")}
                  onChange={() => handleMaterialChange("cashmere")}
                  className="rounded border-outline-variant text-brand focus:ring-brand h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">Cashmere</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes("cotton")}
                  onChange={() => handleMaterialChange("cotton")}
                  className="rounded border-outline-variant text-brand focus:ring-brand h-4 w-4 cursor-pointer"
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
                  className="rounded border-outline-variant text-brand focus:ring-brand h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">Formal</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedOccasions.includes("Casual")}
                  onChange={() => handleOccasionChange("Casual")}
                  className="rounded border-outline-variant text-brand focus:ring-brand h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">Casual</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedOccasions.includes("Workwear")}
                  onChange={() => handleOccasionChange("Workwear")}
                  className="rounded border-outline-variant text-brand focus:ring-brand h-4 w-4 cursor-pointer"
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
                        ? "text-brand fill-brand"
                        : "text-on-surface group-hover/heart:text-brand"
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
                <p className="text-body-md font-bold text-on-surface">₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State message if no products found */}
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-md py-xxl select-none">
            <span className="text-label-md text-secondary font-medium">
              No products found matching active filters in our collection.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
