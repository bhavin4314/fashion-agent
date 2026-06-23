"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { type Product } from "@/lib/products";
import { Select } from "@/components/ui";
import { fetchFilteredProductsAction } from "../actions";

interface CollectionClientProps {
  initialProducts: Product[];
}

export function CollectionClient({ initialProducts }: CollectionClientProps) {
  // Filtering & Sorting states
  const [priceRanges, setPriceRanges] = React.useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<string>("Recommended");

  // Infinite Scroll & Backend Filtering states
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [page, setPage] = React.useState<number>(1);
  const [hasMore, setHasMore] = React.useState<boolean>(initialProducts.length >= 8);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handlePriceChange = (range: string) => {
    setPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const isFirstMount = React.useRef(true);

  // Trigger backend fetch when filters or sort changes
  React.useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const reloadProducts = async () => {
      setIsLoading(true);
      setPage(1);
      
      const res = await fetchFilteredProductsAction({
        page: 1,
        limit: 8,
        priceRanges,
        selectedCategories,
        sortBy,
      });

      if (res.success) {
        setProducts(res.products);
        setHasMore(res.hasMore);
      } else {
        console.error("Failed to load products:", res.error);
      }
      setIsLoading(false);
    };

    reloadProducts();
  }, [priceRanges, selectedCategories, sortBy]);

  // Load more callback for infinite scroll
  const loadMoreProducts = React.useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    const nextPage = page + 1;
    
    const res = await fetchFilteredProductsAction({
      page: nextPage,
      limit: 8,
      priceRanges,
      selectedCategories,
      sortBy,
    });

    if (res.success) {
      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => String(p.id)));
        const newProducts = res.products.filter((p) => !existingIds.has(String(p.id)));
        return [...prev, ...newProducts];
      });
      setPage(nextPage);
      setHasMore(res.hasMore);
    } else {
      console.error("Failed to load more products:", res.error);
    }
    setIsLoading(false);
  }, [page, isLoading, hasMore, priceRanges, selectedCategories, sortBy]);

  const observerTargetRef = React.useRef<HTMLDivElement>(null);

  // IntersectionObserver effect for triggering loadMore
  React.useEffect(() => {
    const target = observerTargetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => {
      observer.unobserve(target);
    };
  }, [loadMoreProducts]);

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

          {/* Product Type (Category) Filter */}
          <div className="space-y-md">
            <h3 className="text-label-md font-label-md select-none">Product Type</h3>
            <div className="space-y-sm">
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes("apparel")}
                  onChange={() => handleCategoryChange("apparel")}
                  className="rounded border-outline-variant text-brand focus:ring-brand h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">Apparel</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes("footwear")}
                  onChange={() => handleCategoryChange("footwear")}
                  className="rounded border-outline-variant text-brand focus:ring-brand h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">Footwear</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes("accessories")}
                  onChange={() => handleCategoryChange("accessories")}
                  className="rounded border-outline-variant text-brand focus:ring-brand h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md">Accessories</span>
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
            {products.length} {products.length === 1 ? "item" : "items"} displayed
          </span>
          <div className="flex items-center gap-sm select-none">
            <span className="text-label-md text-secondary whitespace-nowrap">Sort by:</span>
            <Select
              options={[
                { value: "Recommended", label: "Recommended" },
                { value: "Newest", label: "Newest" },
                { value: "Price: Low to High", label: "Price: Low to High" },
                { value: "Price: High to Low", label: "Price: High to Low" },
              ]}
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              className="w-48 text-xs font-bold border-secondary-container text-charcoal hover:border-primary"
            />
          </div>
        </div>

        {/* Product Cards Catalog */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter mb-xxl">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
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
            </Link>
          ))}
        </div>

        {/* Empty State message if no products found */}
        {products.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center gap-md py-xxl select-none">
            <span className="text-label-md text-secondary font-medium">
              No products found matching active filters in our collection.
            </span>
          </div>
        )}

        {/* Intersection Target / Loading Indicator */}
        <div ref={observerTargetRef} className="w-full flex justify-center py-xl select-none">
          {isLoading && (
            <div className="flex items-center gap-sm text-secondary font-semibold text-xs animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Loading more exquisite items...</span>
            </div>
          )}
          {!isLoading && !hasMore && products.length > 0 && (
            <span className="text-[10px] text-muted font-bold uppercase tracking-widest">
              You have viewed all items in this collection.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
