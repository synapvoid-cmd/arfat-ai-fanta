"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

export interface CartItem {
  id: string;
  flavorId: string;
  name: string;
  size: number;
  qty: number;
  price: number;
  accent: string;
  frame: string;
}

export interface ToastMsg {
  id: string;
  message: string;
  type: "success" | "info";
}

interface UIContextType {
  /* toasts */
  toasts: ToastMsg[];
  toast: (message: string, type?: "success" | "info") => void;
  /* cart */
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  /* store modal */
  isStoreOpen: boolean;
  openStore: () => void;
  closeStore: () => void;
}

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts]       = useState<ToastMsg[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isStoreOpen, setStoreOpen] = useState(false);
  const toastCounter = useRef(0);

  const toast = useCallback((message: string, type: "success" | "info" = "success") => {
    const id = `t-${++toastCounter.current}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const addToCart = useCallback((item: Omit<CartItem, "id">) => {
    setCartItems((prev) => {
      const key = `${item.flavorId}-${item.size}`;
      const existing = prev.find((c) => `${c.flavorId}-${c.size}` === key);
      if (existing) {
        return prev.map((c) => c.id === existing.id ? { ...c, qty: c.qty + item.qty } : c);
      }
      return [...prev, { ...item, id: key }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCartItems((prev) => prev.map((c) => c.id === id ? { ...c, qty } : c));
  }, [removeFromCart]);

  const cartCount = cartItems.reduce((sum, c) => sum + c.qty, 0);

  return (
    <UIContext.Provider value={{
      toasts, toast,
      cartItems, cartCount, addToCart, removeFromCart, updateQty,
      isCartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false),
      isStoreOpen, openStore: () => setStoreOpen(true), closeStore: () => setStoreOpen(false),
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be inside UIProvider");
  return ctx;
}
