"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

let activeLenis: Lenis | null = null;

/** Stop the smooth-scroll animation while a menu is covering the page. */
export function pausePageScroll() {
  activeLenis?.stop();
}

/** Restore smooth scrolling at the position the page had before the menu opened. */
export function resumePageScroll(y: number) {
  activeLenis?.start();
  requestAnimationFrame(() => {
    document.documentElement.scrollTop = y;
    activeLenis?.scrollTo(y, { immediate: true, force: true });
  });
}

/** Lenis breaks `position: sticky` and causes janky scroll on long legal docs. */
function shouldUseLenis(pathname: string) {
  return !pathname.startsWith("/termsandcondition") && !pathname.startsWith("/contactus");
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!shouldUseLenis(pathname)) {
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.8,
    });

    lenisRef.current = lenis;
    activeLenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      if (activeLenis === lenis) activeLenis = null;
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, [pathname]);

  return <>{children}</>;
}
