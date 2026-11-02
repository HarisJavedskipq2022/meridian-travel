"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Destination } from "@/data/destinations";
import { formatPrice } from "@/lib/format";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { unsplash } from "@/lib/images";
import { searchHref } from "@/lib/search/params";

export function DestinationCard({ destination }: { destination: Destination }) {
  const ref = useRef<HTMLAnchorElement>(null);

  // Hover: photo zooms, the note slides up from under the title.
  const { contextSafe } = useGSAP({ scope: ref });
  const hover = contextSafe((entering: boolean) => {
    if (prefersReducedMotion()) return;
    gsap.to("[data-dest-image]", { scale: entering ? 1.08 : 1, duration: 0.9, ease: "power3.out" });
    gsap.to("[data-dest-note]", {
      height: entering ? "auto" : 0,
      autoAlpha: entering ? 1 : 0,
      duration: 0.45,
      ease: "power3.out",
    });
  });

  return (
    <Link
      ref={ref}
      href={searchHref("flights", { to: destination.code })}
      onPointerEnter={() => hover(true)}
      onPointerLeave={() => hover(false)}
      onFocus={() => hover(true)}
      onBlur={() => hover(false)}
      className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] bg-ink text-paper"
      aria-label={`Search flights to ${destination.city}, ${destination.country}. Return fares from ${formatPrice(destination.fareFrom)}.`}
    >
      <Image
        data-dest-image
        src={unsplash(destination.image)}
        alt=""
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

      <span className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full bg-paper/15 backdrop-blur-md transition-colors group-hover:bg-saffron group-hover:text-ink">
        <ArrowUpRight className="size-5" aria-hidden />
      </span>

      <div className="relative p-5">
        <p className="text-sm text-paper/70">{destination.country}</p>
        <h3 className="font-display text-[1.75rem] leading-tight font-bold tracking-[-0.02em]">{destination.city}</h3>
        {/* Visible by default on touch/no-hover screens; collapsed until hover where hover exists. */}
        <p
          data-dest-note
          className="overflow-hidden text-sm leading-relaxed text-paper/80 [@media(hover:hover)]:invisible [@media(hover:hover)]:h-0"
        >
          <span className="block pt-2">{destination.note}</span>
        </p>
        <div className="mt-4 flex items-end justify-between border-t border-paper/20 pt-3 text-sm">
          <span>
            <span className="block text-paper/60">Return from</span>
            <span className="font-display text-lg font-bold text-saffron">{formatPrice(destination.fareFrom)}</span>
          </span>
          <span className="text-right">
            <span className="block text-paper/60">Best time</span>
            {destination.bestMonths}
          </span>
        </div>
      </div>
    </Link>
  );
}
