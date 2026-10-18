"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const REVIEWS = [
  {
    name: "Lucas M.",
    location: "São Paulo, BR",
    flavor: "Guaraná Zero",
    accent: "#B7E11D",
    stars: 5,
    text: "Finally a zero sugar drink that actually tastes like the real thing. The guaraná kick is exactly what I needed for my workouts.",
    initials: "LM",
  },
  {
    name: "Sofia R.",
    location: "Lisbon, PT",
    flavor: "Strawberry",
    accent: "#FF4D6D",
    stars: 5,
    text: "The strawberry flavor is insane — sweet but not sickly. I've replaced my morning juice with this and never looked back.",
    initials: "SR",
  },
  {
    name: "James T.",
    location: "London, UK",
    flavor: "Blue Citrus",
    accent: "#4DD8FF",
    stars: 5,
    text: "Crisp, cold and electric. Blue Citrus hits different at 3pm when you need to push through the afternoon slump.",
    initials: "JT",
  },
  {
    name: "Mei L.",
    location: "Singapore",
    flavor: "Tutti Frutti",
    accent: "#FFB347",
    stars: 5,
    text: "Limited edition and it absolutely shows. Every sip is a different fruit — it's like they packed an entire fruit bowl into one can.",
    initials: "ML",
  },
  {
    name: "Diego V.",
    location: "Buenos Aires, AR",
    flavor: "Grape",
    accent: "#C77DFF",
    stars: 4,
    text: "Bold grape taste, no artificial aftertaste. The zero sugar formula is genuinely impressive — can't tell the difference.",
    initials: "DV",
  },
  {
    name: "Aisha K.",
    location: "Dubai, UAE",
    flavor: "Guaraná Zero",
    accent: "#B7E11D",
    stars: 5,
    text: "I ordered a case of 24. My whole office is hooked now. The guaraná energy without any of the sugar crash is a game changer.",
    initials: "AK",
  },
];

function Stars({ count, accent }: { count: number; accent: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 12 12" className="h-3 w-3" fill={i < count ? accent : "rgba(255,255,255,0.15)"}>
          <path d="M6 1l1.4 2.9 3.2.5-2.3 2.2.5 3.2L6 8.4 3.2 9.8l.5-3.2L1.4 4.4l3.2-.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section id="reviews" ref={ref} className="relative overflow-hidden bg-[#080808] py-16 px-5 sm:py-24 sm:px-10 lg:px-16">
      {/* subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 sm:mb-14"
        >
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30 sm:text-xs">
            What people say
          </span>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-[1.9rem] leading-tight text-white sm:text-5xl">
              Rush approved.
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 12 12" className="h-4 w-4" fill="#B7E11D">
                    <path d="M6 1l1.4 2.9 3.2.5-2.3 2.2.5 3.2L6 8.4 3.2 9.8l.5-3.2L1.4 4.4l3.2-.5z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-white">4.9</span>
              <span className="text-sm text-white/30">· 2,400+ reviews</span>
            </div>
          </div>
        </motion.div>

        {/* cards — horizontal scroll on mobile, 3-col grid on md+ */}
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 sm:gap-4 lg:grid-cols-3 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
              className="flex w-[80vw] max-w-[320px] shrink-0 flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 sm:w-auto sm:max-w-none"
            >
              {/* stars + flavor tag */}
              <div className="flex items-center justify-between">
                <Stars count={r.stars} accent={r.accent} />
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{ background: r.accent + "1a", color: r.accent, border: `1px solid ${r.accent}33` }}
                >
                  {r.flavor}
                </span>
              </div>

              {/* text */}
              <p className="flex-1 text-sm leading-relaxed text-white/55">&ldquo;{r.text}&rdquo;</p>

              {/* reviewer */}
              <div className="flex items-center gap-3 border-t border-white/[0.06] pt-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{ background: r.accent + "22", color: r.accent }}
                >
                  {r.initials}
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">{r.name}</p>
                  <p className="text-[10px] text-white/30">{r.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
