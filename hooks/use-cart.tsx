"use client";

import * as React from "react";
import toast from "react-hot-toast";

export interface CartItem {
  id: string; // Composite ID: productId + size
  productId: string;
  title: string;
  price: number;
  size: string | null;
  quantity: number;
  image: string;
  stock_quantity?: number;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  isDrawerOpen: boolean;
  isLoaded: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">, quantityToAdd?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  // Load cart on mount
  React.useEffect(() => {
    const loadCart = async () => {
      // Yield to event loop to avoid synchronous state updates in the effect body
      await new Promise((resolve) => setTimeout(resolve, 0));
      try {
        const saved = localStorage.getItem("vistra_cart");
        if (saved) {
          setCart(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load cart from localStorage:", e);
      }
      setIsMounted(true);
    };
    loadCart();
  }, []);

  // Save cart to localStorage
  React.useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem("vistra_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
  }, [cart, isMounted]);

  const addToCart = React.useCallback((newItem: Omit<CartItem, "quantity">, quantityToAdd: number = 1) => {
    setCart((prev) => {
      const stock = newItem.stock_quantity ?? Infinity;
      const otherSizesQty = prev
        .filter((item) => item.productId === newItem.productId && item.id !== newItem.id)
        .reduce((sum, item) => sum + item.quantity, 0);
      const maxAllowed = Math.max(0, stock - otherSizesQty);

      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        const totalNewQty = existing.quantity + quantityToAdd;
        if (totalNewQty > maxAllowed) {
          toast.dismiss();
          if (maxAllowed <= 0) {
            toast.error(`All available ${stock} units of this item are already in your bag.`);
          } else {
            toast.error(`Only ${stock} units of this item are available in total. You can only add ${maxAllowed - existing.quantity} more.`);
          }
          return prev.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: maxAllowed }
              : item
          );
        }
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: totalNewQty }
            : item
        );
      }
      if (quantityToAdd > maxAllowed) {
        toast.dismiss();
        if (maxAllowed <= 0) {
          toast.error(`All available ${stock} units of this item are already in your bag.`);
        } else {
          toast.error(`Only ${stock} units of this item are available in total. Adding ${maxAllowed} to bag.`);
        }
        if (maxAllowed <= 0) {
          return prev;
        }
        return [...prev, { ...newItem, quantity: maxAllowed }];
      }
      return [...prev, { ...newItem, quantity: quantityToAdd }];
    });
    setIsDrawerOpen(true);
  }, []);

  const removeFromCart = React.useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = React.useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => {
      const itemToUpdate = prev.find((item) => item.id === id);
      if (!itemToUpdate) return prev;

      const stock = itemToUpdate.stock_quantity ?? Infinity;
      const otherSizesQty = prev
        .filter((item) => item.productId === itemToUpdate.productId && item.id !== id)
        .reduce((sum, item) => sum + item.quantity, 0);
      const maxAllowed = Math.max(0, stock - otherSizesQty);

      if (quantity > maxAllowed) {
        toast.dismiss();
        toast.error(`Only ${stock} units of this item are available in total.`);
        return prev.map((item) => (item.id === id ? { ...item, quantity: maxAllowed } : item));
      }
      return prev.map((item) => (item.id === id ? { ...item, quantity } : item));
    });
  }, [removeFromCart]);

  const clearCart = React.useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = React.useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartTotal = React.useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        isDrawerOpen,
        isLoaded: isMounted,
        setIsDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
