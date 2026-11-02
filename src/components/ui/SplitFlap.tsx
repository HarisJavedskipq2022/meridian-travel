"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

type TileProps = { char: string; index: number };

function Tile({ char, index }: TileProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(char);

  useGSAP(
    () => {
      if (char === shown) return;
      const tl = gsap.timeline({ delay: index * 0.045 });
      if (prefersReducedMotion()) {
        tl.call(() => setShown(char));
        return;
      }
      tl.to(ref.current, { rotationX: -90, duration: 0.14, ease: "power1.in" })
        .call(() => setShown(char))
        .fromTo(ref.current, { rotationX: 90 }, { rotationX: 0, duration: 0.22, ease: "back.out(2.4)" });
    },
    { dependencies: [char] },
  );

  return (
    <span className="relative inline-flex [perspective:400px]">
      <span
        ref={ref}
        className={cn(
          "relative inline-flex h-[1.22em] w-[0.86em] items-center justify-center overflow-hidden rounded-[0.12em]",
          "bg-ink-soft text-saffron shadow-[inset_0_-0.06em_0_rgba(0,0,0,0.35)] [backface-visibility:hidden]",
          // The hinge line across the middle of a physical flap.
          "after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-ink/70",
        )}
      >
        {shown === " " ? " " : shown}
      </span>
    </span>
  );
}

type Props = {
  word: string;
  /** Tile count; shorter words are padded with blank tiles so the board doesn't jump. */
  length: number;
  className?: string;
};

/** Departure-board style word. Change `word` to flip tiles to the new value. */
export function SplitFlap({ word, length, className }: Props) {
  const chars = word.toUpperCase().padEnd(length, " ").slice(0, length).split("");

  return (
    <span className={cn("inline-flex gap-[0.06em] font-display font-bold", className)} aria-hidden>
      {chars.map((char, i) => (
        <Tile key={i} char={char} index={i} />
      ))}
    </span>
  );
}
