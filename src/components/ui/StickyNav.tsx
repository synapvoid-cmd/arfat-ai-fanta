"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";

const LINKS = [
  { label: "Flavors",  href: "#flavors" },
  { label: "Promise",  href: "#promise" },
  { label: "Shop",     href: "#cta" },
];

export default function StickyNav() {
  const [visible, setVisible] = useState(false);
  const { openCart, cartCount } = useUI();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -64, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 top-0 z-[80] flex items-center justify-between border-b border-white/[0.07] bg-black/80 px-5 py-3 backdrop-blur-xl sm:px-10"
        >
          {/* logo */}
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B7E11D]">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#004D2A]" fill="currentColor">
                <path d="M12 2c3 3 5 6 5 9.5A5 5 0 0 1 7 11.5C7 8 9 5 12 2Z" />
              </svg>
            </span>
            <span className="font-display text-lg tracking-wide text-white">FANTA</span>
          </div>

          {/* links — desktop */}
          <nav className="hidden items-center gap-1 sm:flex">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* cart */}
          <button
            onClick={openCart}
            aria-label="Cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#004D2A] shadow-sm transition-transform hover:scale-105"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
              <path d="M9 8a3 3 0 0 1 6 0" strokeLinecap="round" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#B7E11D] text-[9px] font-bold text-[#004D2A]">
                {cartCount}
              </span>
            )}
          </button>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
