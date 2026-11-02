"use client";

import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { searchTabs } from "@/components/search/search-tabs";
import type { Service } from "@/data/content";
import { cn } from "@/lib/cn";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { unsplash } from "@/lib/images";

type Variant = "feature" | "standard" | "wide";

const layout: Record<Variant, { card: string; media: string; sizes: string }> = {
  feature: {
    card: "bg-ink text-paper sm:col-span-2 lg:col-span-7 lg:row-span-2",
    media: "aspect-[16/10] lg:aspect-auto lg:min-h-[22rem] lg:flex-1",
    sizes: "(min-width: 1024px) 55vw, 100vw",
  },
  standard: {
    card: "bg-white lg:col-span-5",
    media: "aspect-[16/9]",
    sizes: "(min-width: 1024px) 38vw, (min-width: 640px) 50vw, 100vw",
  },
  wide: {
    card: "bg-white sm:col-span-2 lg:col-span-12 lg:flex-row",
    media: "aspect-[16/9] lg:aspect-auto lg:min-h-[20rem] lg:w-1/2",
    sizes: "(min-width: 1024px) 50vw, 100vw",
  },
};

export function ServiceCard({ service, variant }: { service: Service; variant: Variant }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const Icon = searchTabs[service.type].icon;
  const styles = layout[variant];
  const dark = variant === "feature";

  // Hover: photo drifts in, arrow pops toward the corner.
  const { contextSafe } = useGSAP({ scope: ref });
  const hover = contextSafe((entering: boolean) => {
    if (prefersReducedMotion()) return;
    gsap.to("[data-card-image]", { scale: entering ? 1.06 : 1, duration: 0.8, ease: "power3.out" });
    gsap.to("[data-card-arrow]", {
      x: entering ? 3 : 0,
      y: entering ? -3 : 0,
      rotate: entering ? 0 : -8,
      duration: 0.4,
      ease: "back.out(3)",
    });
  });

  return (
    <Link
      ref={ref}
      href={`/search?type=${service.type}`}
      onPointerEnter={() => hover(true)}
      onPointerLeave={() => hover(false)}
      onFocus={() => hover(true)}
      onBlur={() => hover(false)}
      data-reveal
      className={cn(
        "group flex flex-col overflow-hidden rounded-[var(--radius-panel)] ring-1 ring-line transition-shadow duration-300 hover:shadow-[0_24px_60px_-30px_rgba(15,39,51,0.5)]",
        dark && "ring-0",
        styles.card,
      )}
    >
      <div className={cn("relative overflow-hidden", styles.media)}>
        <Image
          data-card-image
          src={unsplash(service.image)}
          alt=""
          fill
          sizes={styles.sizes}
          className="object-cover"
        />
      </div>

      <div className={cn("flex flex-1 flex-col p-6 sm:p-8", variant === "wide" && "lg:justify-center lg:p-12")}>
        <div className="flex items-start justify-between gap-4">
          <span
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full",
              dark ? "bg-saffron text-ink" : "bg-mist text-lagoon",
            )}
          >
            <Icon className="size-5" aria-hidden />
          </span>
          <ArrowUpRight
            data-card-arrow
            aria-hidden
            className={cn("size-6 -rotate-[8deg]", dark ? "text-saffron" : "text-ink")}
          />
        </div>

        <h3 className="mt-6 font-display text-2xl font-bold tracking-[-0.02em] sm:text-3xl">{service.title}</h3>
        <p className={cn("mt-2 max-w-md leading-relaxed", dark ? "text-paper/70" : "text-slate")}>{service.summary}</p>

        <ul className="mt-5 space-y-2 text-[0.95rem]">
          {service.points.map((point) => (
            <li key={point} className="flex items-start gap-2.5">
              <Check aria-hidden className={cn("mt-0.5 size-4.5 shrink-0", dark ? "text-saffron" : "text-lagoon")} />
              {point}
            </li>
          ))}
        </ul>

        <span
          className={cn(
            "mt-7 inline-flex items-center gap-1.5 font-semibold underline-offset-4 group-hover:underline",
            dark ? "text-saffron" : "text-ink",
          )}
        >
          {service.cta}
        </span>
      </div>
    </Link>
  );
}
