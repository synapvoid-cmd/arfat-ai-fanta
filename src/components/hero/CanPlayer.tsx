"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";

const FRAME_COUNT = 41;
const FRAME_PATH = (folder: string, i: number) =>
  `/can-frames/${folder}/frame_${String(i).padStart(3, "0")}.webp`;
const FRAME_DURATION_MS = 70;

interface CanPlayerProps {
  scrollProgress: MotionValue<number>;
  flavorFolder: string;
  glowColor: string;
}

export default function CanPlayer({ scrollProgress, flavorFolder, glowColor }: CanPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const directionRef = useRef(1);
  const rafIdRef = useRef<number>(0);
  const [ready, setReady] = useState(false);
  const firstFrameReady = useRef(false);
  const reducedMotionRef = useRef(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltX = useSpring(pointerY, { stiffness: 80, damping: 18, mass: 0.6 });
  const tiltY = useSpring(pointerX, { stiffness: 80, damping: 18, mass: 0.6 });

  const scale = useTransform(scrollProgress, [0, 1], [1, 0.86]);
  const translateY = useTransform(scrollProgress, [0, 1], [0, 90]);
  const opacity = useTransform(scrollProgress, [0, 0.85, 1], [1, 1, 0]);

  // Reload frames when flavor changes
  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Stop current animation loop before loading new frames
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = 0;
    }

    setReady(false);
    firstFrameReady.current = false;

    let cancelled = false;
    const images: HTMLImageElement[] = [];

    const load = () => {
      Array.from({ length: FRAME_COUNT }, (_, i) => {
        const img = new window.Image();
        img.src = FRAME_PATH(flavorFolder, i);
        img.decoding = "async";
        images[i] = img;
        const onDone = () => {
          if (cancelled) return;
          imagesRef.current = images;
          // Start canvas animation as soon as frame 0 is ready
          if (i === 0 && !firstFrameReady.current) {
            firstFrameReady.current = true;
            frameIndexRef.current = 0;
            directionRef.current = 1;
            setReady(true);
          }
        };
        if (img.complete) { onDone(); } else { img.onload = onDone; img.onerror = onDone; }
      });
    };

    load();
    return () => { cancelled = true; };
  }, [flavorFolder]);

  // Start/restart animation loop when frames are ready
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Offscreen canvas used as double-buffer so the visible canvas is
    // never in a partially-drawn state (eliminates flash-of-blank flicker)
    const offscreen = document.createElement("canvas");
    let offCtx = offscreen.getContext("2d")!;

    // Returns true when the canvas has valid (non-zero) pixel dimensions.
    const resize = (): boolean => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width  * dpr);
      const h = Math.round(rect.height * dpr);
      if (w === 0 || h === 0) return false;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width     = w;
        canvas.height    = h;
        offscreen.width  = w;
        offscreen.height = h;
        offCtx = offscreen.getContext("2d")!;
      }
      return true;
    };

    const draw = (idx: number) => {
      const img = imagesRef.current[idx];
      // Guard: skip if offscreen has no area (canvas not yet laid out)
      if (!img || offscreen.width === 0 || offscreen.height === 0) return;
      offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
      offCtx.drawImage(img, 0, 0, offscreen.width, offscreen.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreen, 0, 0);
    };

    let lastTime = performance.now();
    let accumulator = 0;
    let started = false;

    const tick = (time: number) => {
      // Re-check dimensions every tick so the first valid frame is always drawn
      if (!started) {
        if (!resize()) {
          rafIdRef.current = requestAnimationFrame(tick);
          return;
        }
        started = true;
        draw(reducedMotionRef.current ? Math.floor(FRAME_COUNT / 2) : 0);
        if (reducedMotionRef.current) return;
        lastTime = time;
      }

      const delta = time - lastTime;
      lastTime = time;
      accumulator += delta;

      if (accumulator >= FRAME_DURATION_MS) {
        accumulator -= FRAME_DURATION_MS;
        let next = frameIndexRef.current + directionRef.current;
        if (next >= FRAME_COUNT - 1) { next = FRAME_COUNT - 1; directionRef.current = -1; }
        else if (next <= 0)          { next = 0;                directionRef.current =  1; }
        frameIndexRef.current = next;
        draw(next);
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);

    const handleResize = () => { resize(); draw(frameIndexRef.current); };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = 0;
      window.removeEventListener("resize", handleResize);
    };
  }, [ready]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(relX * 14);
    pointerY.set(relY * -10);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      ref={wrapperRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ scale, y: translateY, opacity, perspective: 1200 }}
      className="relative flex h-full w-full items-center justify-center"
    >
      <motion.div
        style={{ rotateX: tiltX, rotateY: tiltY }}
        className="relative flex h-full w-full items-center justify-center will-change-transform"
      >
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative aspect-[680/1440] h-full max-h-[760px] w-auto"
        >
          {/* radial glow directly behind the can — color follows flavor */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-[120%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-all duration-700"
            style={{
              background: `radial-gradient(circle at center, ${glowColor} 0%, rgba(0,0,0,0.1) 65%, transparent 100%)`,
              opacity: 0.85,
            }}
          />

          {/* placeholder — shows the correct flavor's frame 0 while canvas loads */}
          {!ready && (
            <Image
              src={FRAME_PATH(flavorFolder, 0)}
              alt="Fanta can"
              fill
              priority
              sizes="(max-width: 768px) 60vw, 30vw"
              className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
            />
          )}

          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
            style={{ opacity: ready ? 1 : 0, transition: "opacity 0.5s ease" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
