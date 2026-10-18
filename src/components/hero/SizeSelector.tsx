"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp } from "@/lib/motion";

const SIZES = [500, 330, 250];

interface SizeSelectorProps {
  accent: string;
  accentDark: string;
  shadowAccent: string;
}

export default function SizeSelector({ accent, accentDark, shadowAccent }: SizeSelectorProps) {
  const [active, setActive] = useState(330);

  return (
    <motion.div
      variants={fadeUp}
      className="relative z-30 hidden flex-col items-center gap-5 lg:flex"
    >
      {SIZES.map((size) => {
        const isActive = size === active;
        return (
          <motion.button
            key={size}
            onClick={() => setActive(size)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-semibold backdrop-blur-md transition-all duration-500"
            style={
              isActive
                ? {
                    backgroundColor: accent,
                    color: accentDark,
                    boxShadow: `0 0 24px ${shadowAccent}`,
                  }
                : {
                    border: "1px solid rgba(255,255,255,0.2)",
                    backgroundColor: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.5)",
                  }
            }
          >
            {size}
          </motion.button>
        );
      })}
      <span className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">ml</span>
    </motion.div>
  );
}
