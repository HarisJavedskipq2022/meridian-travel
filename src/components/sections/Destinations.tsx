"use client";

import { useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { destinationRegions, destinations } from "@/data/destinations";
import { cn } from "@/lib/cn";
import { Flip, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { DestinationCard } from "./DestinationCard";

type RegionFilter = (typeof destinationRegions)[number];

export function Destinations() {
  const [region, setRegion] = useState<RegionFilter>("All");
  const gridRef = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const visible = region === "All" ? destinations : destinations.filter((d) => d.region === region);

  function selectRegion(next: RegionFilter) {
    if (next === region) return;
    // Record positions before React re-renders so Flip can animate the reflow.
    if (!prefersReducedMotion()) flipState.current = Flip.getState("[data-dest-item]", { simple: true });
    setRegion(next);
  }

  useGSAP(
    () => {
      if (!flipState.current) return;
      Flip.from(flipState.current, {
        targets: "[data-dest-item]",
        duration: 0.6,
        ease: "power3.inOut",
        absolute: true,
        scale: true,
        // Cards that weren't in the previous filter fade in where they land.
        onEnter: (els) =>
          gsap.fromTo(els, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.5, delay: 0.15 }),
      });
      flipState.current = null;
    },
    { scope: gridRef, dependencies: [region] },
  );

  const filters = (
    <div
      role="group"
      aria-label="Filter destinations by region"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {destinationRegions.map((r) => (
        <button
          key={r}
          type="button"
          aria-pressed={region === r}
          onClick={() => selectRegion(r)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            region === r
              ? "bg-ink text-paper"
              : "bg-white text-slate ring-1 ring-line hover:text-ink hover:ring-ink/30",
          )}
        >
          {r}
        </button>
      ))}
    </div>
  );

  return (
    <section id="destinations" aria-labelledby="destinations-title" className="bg-mist py-24 sm:py-32">
      <Reveal className="container-page">
        <SectionHeading
          id="destinations-title"
          title="Where our travellers are flying this season"
          intro="Fares are the lowest return prices from Karachi we've booked in the past 30 days."
          aside={filters}
        />
        <ul ref={gridRef} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {visible.map((destination) => (
            <li key={destination.code} data-dest-item data-flip-id={destination.code}>
              <DestinationCard destination={destination} />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
