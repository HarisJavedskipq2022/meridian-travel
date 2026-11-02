"use client";

import { useRef, type ComponentProps } from "react";
import { gsap, MOTION_OK, REDUCED_MOTION, ScrollTrigger, useGSAP } from "@/lib/gsap";

type Props = ComponentProps<"div"> & {
  /** Vertical offset each item travels, in px. */
  distance?: number;
  stagger?: number;
};

/**
 * Scroll-reveals every descendant marked `data-reveal`. Items entering the
 * viewport together are batched into one staggered tween.
 */
export function Reveal({ distance = 32, stagger = 0.08, children, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current);
      if (!targets.length) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set(targets, { autoAlpha: 0, y: distance });
        ScrollTrigger.batch(targets, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger, overwrite: true }),
        });
      });
      mm.add(REDUCED_MOTION, () => {
        gsap.set(targets, { autoAlpha: 1, y: 0 });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
