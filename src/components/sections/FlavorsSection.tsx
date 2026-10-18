"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { FLAVORS, type FlavorConfig } from "@/lib/flavors";
import { useUI } from "@/context/UIContext";
import FlavorDetailModal from "@/components/ui/FlavorDetailModal";

const SIZES = ["250 ml", "330 ml", "500 ml"];

const FRONT_FRAME: Record<string, number> = {
  green:  22,
  blue:    0,
  red:     5,
  purple:  0,
  mixed:   0,
};

export default function FlavorsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const { addToCart, openCart, toast } = useUI();
  const [detailFlavor, setDetailFlavor] = useState<FlavorConfig | null>(null);

  const handleAddToCart = (flavor: FlavorConfig) => {
    addToCart({ flavorId: flavor.frameFolder, name: flavor.name, size: 330, qty: 1, price: 1.99, accent: flavor.accent, frame: flavor.frameFolder });
    toast(`${flavor.name} added to cart!`);
    openCart();
  };

  return (
    <>
      <section id="flavors" ref={ref} className="relative bg-[#080808] py-24 overflow-hidden">

        {/* subtle dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
          {/* heading */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 text-center"
          >
            <span className="mb-3 inline-block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35 sm:text-xs">
              Full Lineup
            </span>
            <h2 className="font-display text-[2rem] leading-tight text-white sm:text-5xl sm:leading-normal lg:text-6xl">
              Five Flavors.{" "}
              <span className="text-white/25">Zero Sugar.</span>
            </h2>
          </motion.div>

          {/* cards — horizontal scroll on mobile, grid on sm+ */}
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5 lg:gap-5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FLAVORS.map((flavor, i) => (
              <motion.article
                key={flavor.id}
                initial={{ opacity: 0, y: 52 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative flex w-[72vw] max-w-[260px] shrink-0 flex-col overflow-hidden rounded-2xl sm:w-auto sm:max-w-none"
                style={{ background: flavor.bgGradient }}
              >
                {/* hover glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at 50% 40%, ${flavor.glowColor} 0%, transparent 70%)`,
                  }}
                />

                {/* can image — clickable to explore */}
                <button
                  onClick={() => setDetailFlavor(flavor)}
                  className="relative mx-auto h-52 w-full sm:h-60 cursor-pointer"
                  aria-label={`Explore ${flavor.name}`}
                >
                  <Image
                    src={`/can-frames/${flavor.frameFolder}/frame_${String(FRONT_FRAME[flavor.frameFolder] ?? 0).padStart(3, "0")}.webp`}
                    alt={flavor.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-contain drop-shadow-[0_18px_44px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-105"
                  />
                </button>

                {/* info */}
                <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-2">
                  {/* name + label */}
                  <div>
                    <span
                      className="block text-[11px] font-bold uppercase tracking-[0.18em]"
                      style={{ color: flavor.accent }}
                    >
                      {flavor.label}
                    </span>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/45 line-clamp-2">
                      {flavor.description}
                    </p>
                  </div>

                  {/* sizes */}
                  <div className="flex flex-wrap gap-1.5">
                    {SIZES.map((size) => (
                      <span
                        key={size}
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                        style={{
                          background: flavor.accent + "1a",
                          color: flavor.accent,
                          border: `1px solid ${flavor.accent}33`,
                        }}
                      >
                        {size}
                      </span>
                    ))}
                  </div>

                  {/* divider */}
                  <div className="h-px w-full" style={{ background: flavor.accent + "22" }} />

                  {/* price row + cta */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => setDetailFlavor(flavor)}
                      className="text-[11px] font-semibold text-white/40 underline-offset-2 hover:text-white/70 transition-colors"
                    >
                      Explore
                    </button>
                    <button
                      onClick={() => handleAddToCart(flavor)}
                      className="rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
                      style={{ background: flavor.accent, color: flavor.accentDark }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <FlavorDetailModal
        flavor={detailFlavor}
        onClose={() => setDetailFlavor(null)}
      />
    </>
  );
}
