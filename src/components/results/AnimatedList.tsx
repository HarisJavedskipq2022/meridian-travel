"use client";

import { useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/** Staggers its items in whenever `animationKey` changes (new search, filter or sort). */
export function AnimatedList({ animationKey, children }: { animationKey: string; children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(":scope > li", {
        y: 18,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power3.out",
        clearProps: "all",
      });
    },
    { scope: ref, dependencies: [animationKey] },
  );

  return (
    <ul ref={ref} className="space-y-4">
      {children}
    </ul>
  );
}
