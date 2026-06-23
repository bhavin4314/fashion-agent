"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, X, ShoppingBag } from "lucide-react";
import { type Product } from "@/lib/products";
import { useCart } from "@/hooks/use-cart";
import { QuantityInput } from "@/components/ui";

interface ProductDetailInspectorProps {
  product: Product;
  onClose: () => void;
}

export function ProductDetailInspector({ product, onClose }: ProductDetailInspectorProps) {
  const [selectedSize, setSelectedSize] = React.useState<string>("M");
  const [quantity, setQuantity] = React.useState<number>(1);
  const { cart, addToCart, clearCart, setIsDrawerOpen } = useCart();
  const router = useRouter();

  const isAccessory = product.category === "Accessories" || product.category?.toLowerCase() === "accessories";
  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"];

  const itemId = isAccessory ? String(product.id) : `${String(product.id)}-${selectedSize}`;
  const quantityInCart = cart
    .filter((item) => item.productId === String(product.id))
    .reduce((sum, item) => sum + item.quantity, 0);
  const remainingStock = product.stock_quantity !== undefined ? Math.max(0, product.stock_quantity - quantityInCart) : undefined;

  React.useEffect(() => {
    if (remainingStock !== undefined && remainingStock > 0 && quantity > remainingStock) {
      setQuantity(remainingStock);
    }
  }, [remainingStock, quantity]);

  // Reset selected size and quantity when product changes
  React.useEffect(() => {
    const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"];
    setSelectedSize(sizes[0] || "M");
    setQuantity(1);
  }, [product]);

  const handleAddToBag = () => {
    const itemId = isAccessory ? String(product.id) : `${String(product.id)}-${selectedSize}`;
    const img = (product.galleryImages && product.galleryImages[0]) || product.image || "https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg";
    
    addToCart({
      id: itemId,
      productId: String(product.id),
      title: product.title,
      price: product.price,
      size: isAccessory ? null : selectedSize,
      image: img,
      stock_quantity: product.stock_quantity,
    }, quantity);
    setQuantity(1);
  };

  const handleBuyNow = () => {
    clearCart();
    const itemId = isAccessory ? String(product.id) : `${String(product.id)}-${selectedSize}`;
    const img = (product.galleryImages && product.galleryImages[0]) || product.image || "https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg";
    
    addToCart({
      id: itemId,
      productId: String(product.id),
      title: product.title,
      price: product.price,
      size: isAccessory ? null : selectedSize,
      image: img,
      stock_quantity: product.stock_quantity,
    }, quantity);
    setIsDrawerOpen(false);
    setQuantity(1);
    router.push("/checkout");
  };

  return (
    <aside className="absolute lg:relative inset-y-0 right-0 w-full sm:w-[400px] lg:w-[450px] bg-white border-l border-surface-container flex flex-col h-full overflow-y-auto shrink-0 z-30 shadow-2xl lg:shadow-none animate-slide-in">
      {/* Header */}
      <div className="p-lg border-b border-surface-container flex justify-between items-center bg-white sticky top-0 z-10">
        <h2 className="text-headline-md font-headline-md text-charcoal truncate">Garment Details</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-neutral-100 rounded-full text-secondary hover:text-charcoal cursor-pointer border-none bg-transparent"
          aria-label="Close panel"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Details Content */}
      <div className="p-lg flex flex-col gap-lg select-none">
        {/* Product Image */}
        <div className="aspect-[3/4] w-full relative overflow-hidden rounded-xl bg-surface-container shadow-inner">
          <Image
            alt={product.title}
            src={product.image}
            fill
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>

        {/* Title, Category & Price */}
        <div className="flex flex-col gap-xs">
          <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">
            {product.category} • {product.material}
          </span>
          <h1 className="text-headline-lg font-headline-lg text-charcoal">
            {product.title}
          </h1>
          <p className="text-lg font-extrabold text-brand mt-xs">₹{product.price}</p>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-sm border-t border-surface-container pt-md">
          <h3 className="text-xs font-bold uppercase text-charcoal tracking-wide">Description</h3>
          <p className="text-xs text-secondary leading-relaxed font-semibold">
            {product.description}
          </p>
        </div>

        {/* AI Recommendation */}
        <div className="bg-primary-light-bg border border-outline-variant p-md rounded-xl flex flex-col gap-xs relative">
          <div className="flex items-center gap-xs text-[10px] font-bold text-primary uppercase tracking-wider">
            <Sparkles className="h-3 w-3 fill-primary/10" />
            AI Stylist recommendation
          </div>
          <p className="text-xs text-secondary italic font-semibold leading-relaxed">
            {product.aiRecommendation || `Matches beautifully with your selected aesthetics.`}
          </p>
        </div>

        {/* Size Selector */}
        {!isAccessory && (
          <div className="flex flex-col gap-sm border-t border-surface-container pt-md">
            <span className="text-xs font-bold uppercase text-charcoal tracking-wide">
              Select Size
            </span>
            <div className="flex gap-sm">
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-150 ${
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

        {/* Quantity Selector */}
        <QuantityInput
          value={quantity}
          onChange={setQuantity}
          size="md"
          label="Select Quantity"
          uppercaseLabel
          stockQuantity={remainingStock}
        />

        {/* Action Buttons */}
        <div className="mt-md pt-lg border-t border-surface-container flex flex-col gap-sm">
          <div className="flex gap-sm">
            {remainingStock !== undefined && remainingStock <= 0 ? (
              <button
                disabled
                className="flex-1 py-4 bg-neutral-200 text-neutral-450 rounded-xl text-xs font-bold flex items-center justify-center gap-sm cursor-not-allowed uppercase tracking-wider border-none opacity-60"
              >
                {product.stock_quantity !== undefined && product.stock_quantity <= 0 ? "Out of Stock" : "All Stock Added to Bag"}
              </button>
            ) : (
              <>
                <button
                  onClick={handleAddToBag}
                  className="flex-1 py-4 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-sm active:scale-[0.98] transition-all shadow-md uppercase tracking-wider border-none cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4 text-white" />
                  Add to Bag
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-sm active:scale-[0.98] transition-all shadow-md uppercase tracking-wider border-none cursor-pointer"
                >
                  Buy Now
                </button>
              </>
            )}
          </div>
          <Link
            href={`/product/${product.id}`}
            className="w-full block py-3 border border-outline-variant hover:border-on-surface text-charcoal rounded-xl text-xs font-bold text-center no-underline hover:bg-neutral-50 active:scale-[0.98] transition-all uppercase tracking-wider"
          >
            View Full Details Page
          </Link>
        </div>
      </div>
    </aside>
  );
}
