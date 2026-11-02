"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

type Props = {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
};

function format(n: number, decimals: number, suffix: string) {
  return `${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
}

/** Counts up from zero when scrolled into view. Server HTML shows the final value. */
export function Counter({ value, decimals = 0, suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = format(value, decimals, suffix);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const state = { n: 0 };
      el.textContent = format(0, decimals, suffix);
      gsap.to(state, {
        n: value,
        duration: 2.2,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: () => {
          el.textContent = format(state.n, decimals, suffix);
        },
      });
    },
    { dependencies: [value, decimals, suffix] },
  );

  return (
    <span className={className}>
      <span ref={ref} aria-hidden className="tabular-nums">
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
