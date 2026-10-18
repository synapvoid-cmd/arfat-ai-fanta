"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { useUI } from "@/context/UIContext";

const NAV_LINKS = [
  { label: "Products",  href: "#" },
  { label: "Flavors",   href: "#flavors" },
  { label: "Contact",   href: "#footer" },
];

export default function Nav() {
  const { openCart, cartCount } = useUI();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      variants={fadeUp}
      className="relative z-30 flex items-center justify-between px-5 pt-5 sm:px-10 sm:pt-8"
    >
      {/* logo */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-lime-accent/90 shadow-[0_0_18px_rgba(183,225,29,0.55)]">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-deep" fill="currentColor">
            <path d="M12 2c3 3 5 6 5 9.5A5 5 0 0 1 7 11.5C7 8 9 5 12 2Z" />
          </svg>
        </span>
        <span className="font-display text-2xl tracking-wide text-white">FANTA</span>
      </div>

      {/* desktop nav links */}
      <div className="hidden items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1 backdrop-blur-md sm:flex">
        {NAV_LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="rounded-full px-5 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white first:bg-white first:text-emerald-deep first:shadow-sm"
          >
            {l.label}
          </a>
        ))}
      </div>

      {/* right icons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* cart */}
        <button
          aria-label="Cart"
          onClick={openCart}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-deep shadow-sm transition-transform hover:scale-105"
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
            <path d="M9 8a3 3 0 0 1 6 0" strokeLinecap="round" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#B7E11D] text-[9px] font-bold text-[#004D2A]">
              {cartCount}
            </span>
          )}
        </button>

        {/* mobile hamburger */}
        <button
          aria-label="Menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md sm:hidden"
        >
          <span className="flex flex-col gap-1.5">
            <span className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {/* mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 right-4 top-[calc(100%+8px)] z-50 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl sm:hidden"
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="px-6 py-4 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white border-b border-white/[0.06] last:border-0"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
