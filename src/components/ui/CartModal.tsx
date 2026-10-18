"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useUI } from "@/context/UIContext";

const FRONT_FRAME: Record<string, number> = { green: 22, blue: 0, red: 5, purple: 0, mixed: 0 };

export default function CartModal() {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQty, toast } = useUI();
  const total = cartItems.reduce((s, c) => s + c.price * c.qty, 0);

  const handleCheckout = () => {
    closeCart();
    toast("Order placed! You'll receive a confirmation email soon.", "success");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
          />
          {/* panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed bottom-0 right-0 top-0 z-[100] flex w-full max-w-md flex-col bg-[#0d0d0d] shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
              <h2 className="font-display text-xl text-white">
                Your Cart
                {cartItems.length > 0 && (
                  <span className="ml-2 rounded-full bg-[#B7E11D] px-2 py-0.5 text-xs font-bold text-[#004D2A]">
                    {cartItems.reduce((s, c) => s + c.qty, 0)}
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <span className="text-5xl opacity-20">🧃</span>
                  <p className="text-sm text-white/40">Your cart is empty.<br />Add a flavor to get started.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cartItems.map((item) => {
                    const frameNum = FRONT_FRAME[item.flavorId] ?? 0;
                    const frameSrc = `/can-frames/${item.flavorId}/frame_${String(frameNum).padStart(3, "0")}.webp`;
                    return (
                      <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                        <div className="relative h-16 w-12 shrink-0">
                          <Image src={frameSrc} alt={item.name} fill className="object-contain" />
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                          <span className="text-sm font-semibold text-white">{item.name}</span>
                          <span className="text-xs text-white/40">{item.size} ml</span>
                          <span className="text-sm font-bold" style={{ color: item.accent }}>
                            ${(item.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-white/10 px-2 py-1">
                          <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-5 text-center text-white/50 hover:text-white">−</button>
                          <span className="w-4 text-center text-sm text-white">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-5 text-center text-white/50 hover:text-white">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-white/25 hover:text-red-400 transition-colors text-xs">✕</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-white/[0.08] px-6 py-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Total</span>
                  <span className="font-display text-2xl text-white">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full rounded-full bg-[#B7E11D] py-4 text-sm font-bold uppercase tracking-wider text-[#004D2A] shadow-[0_0_30px_rgba(183,225,29,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_0_46px_rgba(183,225,29,0.5)]"
                >
                  Checkout — ${total.toFixed(2)}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
