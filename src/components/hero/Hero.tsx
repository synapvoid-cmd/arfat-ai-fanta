"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, type Transition } from "framer-motion";
import gsap from "gsap";
import Nav from "./Nav";
import HeroBackground from "./HeroBackground";
import CanPlayer from "./CanPlayer";
import HeroContent from "./HeroContent";
import SizeSelector from "./SizeSelector";
import { FLAVORS } from "@/lib/flavors";

const ENTRY_DURATION = 0.8;
const PAUSE_DURATION = 3.5;
const EXIT_DURATION  = 2.8;

export default function Hero() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRef   = useRef(true);

  const [activeFlavorIdx, setActiveFlavorIdx] = useState(0);
  const [direction, setDirection]             = useState(1);

  const flavor = FLAVORS[activeFlavorIdx];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const isFirst = isFirstRef.current;
    const waitMs = ((isFirst ? 1.4 + ENTRY_DURATION : ENTRY_DURATION) + PAUSE_DURATION) * 1000;
    timerRef.current = setTimeout(() => {
      isFirstRef.current = false;
      setDirection(1);
      setActiveFlavorIdx((i) => (i + 1) % FLAVORS.length);
    }, waitMs);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeFlavorIdx]);

  const onNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    isFirstRef.current = false;
    setDirection(1);
    setActiveFlavorIdx((i) => (i + 1) % FLAVORS.length);
  }, []);

  const onPrev = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    isFirstRef.current = false;
    setDirection(-1);
    setActiveFlavorIdx((i) => (i - 1 + FLAVORS.length) % FLAVORS.length);
  }, []);

  const onSetFlavor = useCallback((idx: number) => {
    if (idx === activeFlavorIdx) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    isFirstRef.current = false;
    setDirection(idx > activeFlavorIdx ? 1 : -1);
    setActiveFlavorIdx(idx);
  }, [activeFlavorIdx]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".gsap-bg",      { opacity: 0 }, { opacity: 1, duration: 1.3 })
        .fromTo(".gsap-glow",    { opacity: 0 }, { opacity: 1, duration: 1.4, stagger: 0.1 }, "-=0.9")
        .fromTo(".gsap-type",    { opacity: 0, scale: 0.92 }, { opacity: 0.16, scale: 1, duration: 1.6 }, "-=1.1")
        .fromTo(".gsap-can",     { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=1.2")
        .fromTo(".gsap-content", { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.7");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const isFirst = isFirstRef.current;

  const initialState = isFirst
    ? { x: 0, opacity: 0, scale: 0.82 }
    : { x: direction > 0 ? "100vw" : "-100vw", opacity: 1, scale: 1 };

  const entryTransition: Transition = {
    duration: ENTRY_DURATION,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    delay: isFirst ? 1.4 : 0,
  };

  const exitTarget = direction > 0 ? "-110vw" : "110vw";

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[600px] w-full"
    >
      <div ref={containerRef} className="relative flex w-full flex-col overflow-hidden">

        {/* Background */}
        <div className="gsap-bg absolute inset-0">
          <HeroBackground scrollProgress={scrollYProgress} flavor={flavor} />
        </div>

        {/* Nav */}
        <Nav />

        {/* ── MOBILE layout: can fills top half, content pinned to bottom ── */}
        {/* ── DESKTOP layout: can absolutely centred, content left/right   ── */}

        {/* Can slot */}
        {/* Mobile: in-flow taking top 52%; Desktop: absolute centred */}
        <div
          className={[
            "gsap-can z-10",
            "relative mx-auto flex items-center justify-center",
            "h-[52%] w-full overflow-hidden",
            "sm:absolute sm:left-1/2 sm:top-1/2 sm:h-auto sm:w-auto sm:overflow-visible",
            "sm:-translate-x-1/2 sm:-translate-y-1/2",
          ].join(" ")}
        >
          {/* inner sizing wrapper */}
          <div className="pointer-events-none relative h-full w-[62vw] sm:h-auto sm:w-auto">
            <style>{`@media(min-width:640px){.can-sizer{width:clamp(180px,28vw,420px)!important;height:clamp(300px,65vh,580px)!important}}`}</style>
            <div className="can-sizer pointer-events-auto relative h-full w-full">
              <AnimatePresence mode="sync">
                <motion.div
                  key={activeFlavorIdx}
                  className="absolute inset-0"
                  initial={initialState}
                  animate={{ x: 0, opacity: 1, scale: 1, transition: entryTransition }}
                  exit={{ x: exitTarget, transition: { duration: EXIT_DURATION, ease: "linear" } }}
                >
                  <CanPlayer
                    scrollProgress={scrollYProgress}
                    flavorFolder={flavor.frameFolder}
                    glowColor={flavor.glowColor}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Content area */}
        {/* Mobile: glass card pinned to bottom; Desktop: flex row left+right */}
        <div className="relative z-20 sm:absolute sm:inset-0 sm:flex sm:items-center sm:justify-between sm:px-10 sm:pb-10 lg:px-14">

          {/* mobile: bottom content card */}
          <div
            className={[
              "gsap-content",
              // mobile: pinned bottom card with glass bg
              "flex flex-1 flex-col justify-end px-5 pb-7 pt-5",
              "sm:flex-none sm:justify-start sm:p-0",
            ].join(" ")}
          >
            {/* mobile gradient fade behind text */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] sm:hidden"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)",
              }}
            />
            <div className="relative z-10">
              <HeroContent
                flavor={flavor}
                activeDot={activeFlavorIdx}
                onPrev={onPrev}
                onNext={onNext}
                onSetFlavor={onSetFlavor}
              />
            </div>
          </div>

          {/* size selector — desktop only */}
          <SizeSelector
            accent={flavor.accent}
            accentDark={flavor.accentDark}
            shadowAccent={flavor.shadowAccent}
          />
        </div>

        {/* mobile flavor dot nav — pinned above content */}
        <div className="absolute bottom-[calc(52%+8px)] left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 sm:hidden">
          {FLAVORS.map((f, i) => (
            <button
              key={f.id}
              aria-label={`Switch to ${f.label}`}
              onClick={() => onSetFlavor(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === activeFlavorIdx ? "1.75rem" : "0.5rem",
                backgroundColor: i === activeFlavorIdx ? flavor.accent : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
