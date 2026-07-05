"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Register ScrollTrigger with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // 2. Initialize Lenis kinetic scroll engine with snappier duration
    const lenis = new Lenis({
      duration: 0.75, // Snappier duration for faster feeling
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // 3. Connect Lenis events to GSAP ScrollTrigger update loops
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // 4. Sync Lenis animation frame requests directly to GSAP ticker
    const gsapTickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapTickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(gsapTickerCallback);
      lenisRef.current = null;
    };
  }, []);

  // Instant scroll reset on page change to prevent scrolling transition lag
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
}
