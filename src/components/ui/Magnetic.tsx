"use client";

import { useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

type Props = { children: ReactNode; strength?: number; className?: string };

/** Pulls its child slightly toward the pointer on hover (fine pointers only). */
export function Magnetic({ children, strength = 0.3, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

      const onMove = contextSafe((e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        xTo((e.clientX - rect.left - rect.width / 2) * strength);
        yTo((e.clientY - rect.top - rect.height / 2) * strength);
      });
      const onLeave = contextSafe(() => {
        xTo(0);
        yTo(0);
      });

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [strength] },
  );

  return (
    <span ref={ref} className={className ?? "inline-flex"}>
      {children}
    </span>
  );
}
