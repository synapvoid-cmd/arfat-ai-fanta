"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { staggerContainer, staggerItem, buttonHover, buttonTap } from "@/lib/motion";
import type { FlavorConfig } from "@/lib/flavors";
import { FLAVORS } from "@/lib/flavors";
import { useUI } from "@/context/UIContext";

const CHIPS = ["Zero Sugar", "Natural Extract", "Real Fruit Taste"];

interface HeroContentProps {
  flavor: FlavorConfig;
  activeDot: number;
  onPrev: () => void;
  onNext: () => void;
  onSetFlavor: (idx: number) => void;
}

export default function HeroContent({ flavor, activeDot, onPrev, onNext, onSetFlavor }: HeroContentProps) {
  const [quantity, setQuantity] = useState(2);
  const { addToCart, openCart, toast } = useUI();

  const handleBuyNow = () => {
    addToCart({
      flavorId: flavor.frameFolder,
      name: flavor.name,
      size: 330,
      qty: quantity,
      price: 1.99,
      accent: flavor.accent,
      frame: flavor.frameFolder,
    });
    toast(`${flavor.name} × ${quantity} added to cart!`);
    openCart();
  };

  const handleExploreFlavors = () => {
    const el = document.getElementById("flavors");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      variants={staggerContainer}
      className="relative z-30 flex max-w-xl flex-col gap-2 sm:gap-4 lg:gap-6"
    >
      {/* kicker chip */}
      <motion.span
        variants={staggerItem}
        className="inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md"
        style={{ borderColor: flavor.accent + "4d", backgroundColor: flavor.accent + "1a", color: flavor.accent }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: flavor.accent, boxShadow: `0 0 8px ${flavor.accent}e6` }} />
        New · Zero Sugar
      </motion.span>

      {/* headline */}
      <motion.h1 variants={staggerItem} className="font-display leading-[0.95] text-white">
        <span
          className="block text-[2.2rem] text-white sm:text-[clamp(2.8rem,7vw,5.5rem)]"
          style={{ WebkitTextStroke: `2px ${flavor.stroke}`, paintOrder: "stroke fill" }}
        >
          FANTA
        </span>
        <span
          className="block text-[1.25rem] transition-colors duration-700 sm:text-[clamp(1.4rem,3.4vw,2.75rem)]"
          style={{ color: flavor.accent }}
        >
          {flavor.name}
        </span>
      </motion.h1>

      {/* description */}
      <motion.p
        variants={staggerItem}
        className="max-w-md text-xs leading-relaxed text-white/75 line-clamp-2 sm:line-clamp-none sm:text-base lg:text-lg"
      >
        {flavor.description}
      </motion.p>

      {/* chips — hidden on smallest mobile */}
      <motion.div variants={staggerItem} className="hidden flex-wrap gap-2 xs:flex sm:gap-2.5">
        {CHIPS.map((chip) => (
          <span key={chip} className="rounded-full border border-white/20 bg-white/[0.06] px-3 py-1.5 text-xs text-white/85 backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm">
            {chip}
          </span>
        ))}
      </motion.div>

      {/* CTAs */}
      <motion.div variants={staggerItem} className="mt-1 flex flex-wrap items-center gap-2.5 sm:gap-4">
        <motion.button
          whileHover={buttonHover}
          whileTap={buttonTap}
          onClick={handleBuyNow}
          className="rounded-full px-5 py-2.5 text-sm font-semibold transition-shadow sm:px-8 sm:py-3.5"
          style={{ backgroundColor: flavor.accent, color: flavor.accentDark, boxShadow: `0 8px 30px ${flavor.shadowAccent}` }}
        >
          Buy Now
        </motion.button>
        <motion.button
          whileHover={buttonHover}
          whileTap={buttonTap}
          onClick={handleExploreFlavors}
          className="rounded-full border border-white/25 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/[0.12] sm:px-8 sm:py-3.5"
        >
          Explore Flavors
        </motion.button>
      </motion.div>

      {/* quantity + flavor nav — hidden on mobile */}
      <motion.div variants={staggerItem} className="mt-1 hidden flex-wrap items-center gap-6 sm:flex sm:mt-4">
        <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 backdrop-blur-md">
          <button aria-label="Decrease" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10">−</button>
          <span className="w-4 text-center text-sm font-medium text-white">{quantity}</span>
          <button aria-label="Increase" onClick={() => setQuantity((q) => q + 1)} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10">+</button>
        </div>

        <div className="flex items-center gap-2">
          <button aria-label="Previous flavor" onClick={onPrev} className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:scale-105 transition-transform" style={{ backgroundColor: flavor.stroke, boxShadow: `0 4px 16px ${flavor.shadowAccent}` }}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button aria-label="Next flavor" onClick={onNext} className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:scale-105 transition-transform" style={{ backgroundColor: flavor.stroke, boxShadow: `0 4px 16px ${flavor.shadowAccent}` }}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          <div className="ml-1 flex items-center gap-1.5">
            {FLAVORS.map((f, i) => (
              <button
                key={f.id}
                aria-label={`Switch to ${f.label}`}
                onClick={() => onSetFlavor(i)}
                className="h-1 rounded-full transition-all duration-300"
                style={{ width: i === activeDot ? "1.5rem" : "0.625rem", backgroundColor: i === activeDot ? flavor.accent : "rgba(255,255,255,0.3)" }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
