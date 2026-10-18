"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";
import type { FlavorConfig } from "@/lib/flavors";

const SIZES = [
  { label: "250 ml", price: 1.49 },
  { label: "330 ml", price: 1.99 },
  { label: "500 ml", price: 2.49 },
];

const FRONT_FRAME: Record<string, number> = {
  green: 22, blue: 0, red: 5, purple: 0, mixed: 0,
};

interface Props {
  flavor: FlavorConfig | null;
  onClose: () => void;
}

export default function FlavorDetailModal({ flavor, onClose }: Props) {
  const [selectedSize, setSelectedSize] = useState(1); // default 330ml
  const { addToCart, openCart, toast } = useUI();

  const handleAdd = () => {
    if (!flavor) return;
    const sz = SIZES[selectedSize];
    addToCart({
      flavorId: flavor.frameFolder,
      name: flavor.name,
      size: parseInt(sz.label),
      qty: 1,
      price: sz.price,
      accent: flavor.accent,
      frame: flavor.frameFolder,
    });
    toast(`${flavor.name} (${sz.label}) added to cart!`);
    onClose();
    openCart();
  };

  return (
    <AnimatePresence>
      {flavor && (
        <>
          {/* backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* sheet — slides up on mobile, centred modal on sm+ */}
          <motion.div
            key="sheet"
            initial={{ y: "100%", opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-[91] flex flex-col rounded-t-3xl bg-[#0f0f0f] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[480px] sm:rounded-3xl"
            style={{ border: `1px solid ${flavor.accent}22` }}
          >
            {/* drag handle */}
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-white/10 sm:hidden" />

            {/* can image */}
            <div
              className="relative h-52 w-full overflow-hidden rounded-t-3xl sm:rounded-t-3xl"
              style={{ background: flavor.bgGradient }}
            >
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at 50% 60%, ${flavor.glowColor} 0%, transparent 65%)`,
                }}
              />
              <Image
                src={`/can-frames/${flavor.frameFolder}/frame_${String(FRONT_FRAME[flavor.frameFolder] ?? 0).padStart(3, "0")}.webp`}
                alt={flavor.name}
                fill
                sizes="480px"
                className="object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
              />
            </div>

            {/* content */}
            <div className="flex flex-col gap-4 p-6">
              {/* title */}
              <div>
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: flavor.accent }}
                >
                  {flavor.label}
                </span>
                <h3 className="mt-0.5 font-display text-2xl text-white">{flavor.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/45">{flavor.description}</p>
              </div>

              {/* size picker */}
              <div>
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  Select size
                </span>
                <div className="flex gap-2">
                  {SIZES.map((sz, i) => (
                    <button
                      key={sz.label}
                      onClick={() => setSelectedSize(i)}
                      className="flex flex-1 flex-col items-center gap-0.5 rounded-xl border py-3 transition-all"
                      style={{
                        borderColor: selectedSize === i ? flavor.accent : "rgba(255,255,255,0.08)",
                        background: selectedSize === i ? flavor.accent + "18" : "transparent",
                        color: selectedSize === i ? flavor.accent : "rgba(255,255,255,0.45)",
                      }}
                    >
                      <span className="text-xs font-bold">{sz.label}</span>
                      <span className="text-[10px]">${sz.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* add to cart */}
              <button
                onClick={handleAdd}
                className="w-full rounded-full py-3.5 text-sm font-bold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95"
                style={{
                  background: flavor.accent,
                  color: flavor.accentDark,
                  boxShadow: `0 0 28px ${flavor.accent}44`,
                }}
              >
                Add to Cart — ${SIZES[selectedSize].price.toFixed(2)}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
