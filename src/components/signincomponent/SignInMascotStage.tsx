"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";

/** Full-section animated navy showcase featuring the TrustValue mascot (tablet and desktop side-by-side view). */
export function SignInMascotStage() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 20 });

  const mascotOffsetX = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);
  const mascotOffsetY = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);
  const auraOffsetX = useTransform(smoothX, [-0.5, 0.5], [20, -20]);
  const auraOffsetY = useTransform(smoothY, [-0.5, 0.5], [16, -16]);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <aside
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex-1 flex flex-col justify-between overflow-hidden md:px-6 md:py-6 lg:px-10 lg:py-8 xl:px-12 h-full select-none"
      aria-label="TrustValue mascot showcase"
    >
      {/* Architectural hairline grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
        }}
      />

      {/* Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 flex items-center justify-between gap-3"
      >
        <span
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.07)",
            border: "1px solid rgba(255, 255, 255, 0.13)",
            color: "#F8FAFC",
          }}
        >
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ backgroundColor: "#FFAA00", boxShadow: "0 0 10px #FFAA00" }}
          />
          TrustValue Verified Identity
        </span>

        <span className="hidden lg:inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "#9FB0D0" }}>
          <ShieldCheck size={14} style={{ color: "#FFAA00" }} />
          OTP-Secured Access
        </span>
      </motion.div>

      {/* Center Mascot Stage */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center py-2">
        {/* Ambient Orange/Amber Halo */}
        <motion.div
          aria-hidden="true"
          style={{ x: auraOffsetX, y: auraOffsetY }}
          animate={{ scale: [1, 1.07, 1], opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute md:h-[260px] md:w-[260px] lg:h-[340px] lg:w-[340px] xl:h-[400px] xl:w-[400px] rounded-full blur-3xl"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255, 170, 0, 0.34) 0%, rgba(255, 90, 10, 0.24) 45%, transparent 72%)",
            }}
          />
        </motion.div>

        {/* Orbital Ring */}
        <motion.div
          aria-hidden="true"
          animate={{ rotate: 360 }}
          transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute md:h-[250px] md:w-[250px] lg:h-[320px] lg:w-[320px] xl:h-[360px] xl:w-[360px] rounded-full"
          style={{ border: "1px dashed rgba(255, 255, 255, 0.14)" }}
        />

        {/* Floating Accent Pill */}
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, -8, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[6%] lg:right-[10%] top-[8%] lg:top-[10%] flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md"
          style={{
            backgroundColor: "rgba(7, 27, 70, 0.72)",
            border: "1px solid rgba(255, 170, 0, 0.35)",
            color: "#FFE3B3",
          }}
        >
          <Sparkles size={12} style={{ color: "#FFAA00" }} />
          Real Experiences Only
        </motion.div>

        {/* Mascot Image */}
        <motion.div
          style={{ x: mascotOffsetX, y: mascotOffsetY }}
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center"
        >
          <motion.img
            src="/brand/status__mascot.webp"
            alt="TrustValue Mascot"
            width={365}
            height={760}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            className="h-auto md:w-[165px] lg:w-[200px] xl:w-[235px] max-h-[44vh] object-contain"
            style={{
              filter: "drop-shadow(0 24px 38px rgba(3, 9, 28, 0.7))",
            }}
          />
          <motion.div
            aria-hidden="true"
            animate={{ scaleX: [1, 0.9, 1], opacity: [0.55, 0.35, 0.55] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-3 h-4 w-36 lg:w-40 rounded-full blur-md"
            style={{ background: "rgba(2, 6, 20, 0.78)" }}
          />
        </motion.div>
      </div>

      {/* Bottom Content Below Mascot */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
        className="relative z-10 flex flex-col gap-2 pt-4 lg:pt-5"
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.12)" }}
      >
        <p
          className="text-lg lg:text-xl xl:text-[22px] font-extrabold tracking-tight leading-snug max-w-[34ch]"
          style={{ color: "#FFFFFF" }}
        >
          One OTP. Verified reviews. Zero paid influence.
        </p>
        <p className="text-xs lg:text-sm leading-relaxed max-w-[44ch]" style={{ color: "#94A3C0" }}>
          Every review on TrustValue comes from a real, OTP-verified person.
        </p>
      </motion.div>
    </aside>
  );
}
