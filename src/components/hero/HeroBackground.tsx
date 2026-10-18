"use client";

import { motion, AnimatePresence, useTransform, type MotionValue } from "framer-motion";
import dynamic from "next/dynamic";
import type { FlavorConfig } from "@/lib/flavors";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

interface HeroBackgroundProps {
  scrollProgress: MotionValue<number>;
  flavor: FlavorConfig;
}

export default function HeroBackground({ scrollProgress, flavor }: HeroBackgroundProps) {
  const typeY = useTransform(scrollProgress, [0, 1], [0, -70]);
  const typeOpacity = useTransform(scrollProgress, [0, 1], [0.16, 0.05]);
  const glowScale = useTransform(scrollProgress, [0, 1], [1, 1.15]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* base gradient — crossfades on flavor change */}
      <AnimatePresence mode="sync">
        <motion.div
          key={flavor.id}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75 }}
          className="absolute inset-0"
          style={{ background: flavor.bgGradient }}
        />
      </AnimatePresence>

      {/* deep vignette for premium depth */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 105%, rgba(0,0,0,0.55) 0%, transparent 55%), radial-gradient(circle at 0% 0%, rgba(0,0,0,0.35) 0%, transparent 45%)",
        }}
      />

      {/* ambient glow blobs — GSAP owns opacity (entrance only), Framer owns scale (scroll) */}
      <motion.div
        aria-hidden
        style={{ scale: glowScale, backgroundColor: flavor.particle1 + "1a" }}
        className="gsap-glow absolute left-[8%] top-[12%] h-[28rem] w-[28rem] rounded-full blur-[110px] transition-colors duration-700"
      />
      <motion.div
        aria-hidden
        style={{ scale: glowScale, backgroundColor: flavor.particle2 + "26" }}
        className="gsap-glow absolute bottom-[6%] right-[10%] h-[24rem] w-[24rem] rounded-full blur-[110px] transition-colors duration-700"
      />

      {/* large center radial glow behind the can */}
      <div
        aria-hidden
        className="gsap-glow absolute left-1/2 top-1/2 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-700"
        style={{
          background: `radial-gradient(circle at center, ${flavor.glowColor} 0%, ${flavor.glowColor2} 35%, rgba(0,0,0,0.08) 65%, transparent 100%)`,
        }}
      />

      {/* oversized decorative FANTA watermark — GSAP owns entrance (outer div), Framer owns scroll parallax (inner span) */}
      <div
        aria-hidden
        className="gsap-type absolute inset-0 flex items-center justify-center select-none"
      >
        <motion.span
          style={{ y: typeY, opacity: typeOpacity }}
          className="font-display whitespace-nowrap text-[26vw] leading-none text-white sm:text-[24vw] lg:text-[22vw]"
        >
          FANTA
        </motion.span>
      </div>

      {/* glass reflection sweep */}
      <div
        aria-hidden
        className="absolute -left-1/4 top-0 h-full w-1/2 rotate-6 bg-gradient-to-r from-white/[0.04] to-transparent"
      />

      <ParticleField particle1={flavor.particle1} particle2={flavor.particle2} />

      {/* inner shadow for luxury depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.55)]"
      />
    </div>
  );
}
