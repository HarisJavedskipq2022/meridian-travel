"use client";

import { MessageCircle, Plane } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SearchPanel } from "@/components/search/SearchPanel";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { SplitFlap } from "@/components/ui/SplitFlap";
import { destinations } from "@/data/destinations";
import { formatPrice } from "@/lib/format";
import { gsap, MOTION_OK, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";
import { unsplash } from "@/lib/images";

const ROTATE_MS = 3600;
const BOARD_LENGTH = Math.max(...destinations.map((d) => d.city.length));

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const current = destinations[index];

  // Page-load sequence: headline lines rise, board drops in, photo unmasks, search panel lifts.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create("[data-hero-title]", { type: "lines", mask: "lines" });
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(split.lines, { yPercent: 110, duration: 1, stagger: 0.08 })
          .from(
            "[data-hero-board] > span",
            { yPercent: -60, autoAlpha: 0, duration: 0.6, stagger: 0.04, ease: "back.out(2)" },
            "-=0.6",
          )
          .from("[data-hero-fade]", { y: 20, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, "-=0.4")
          .from(
            "[data-hero-photo]",
            { clipPath: "inset(12% 12% 12% 12% round 2rem)", scale: 1.08, duration: 1.3, ease: "expo.out" },
            0.2,
          )
          .from("[data-hero-ticket]", { x: -30, autoAlpha: 0, duration: 0.7 }, "-=0.7")
          .from("[data-hero-search]", { y: 60, autoAlpha: 0, duration: 1 }, "-=0.9");
        return () => split.revert();
      });
    },
    { scope: rootRef },
  );

  // Cycle the departure board. Paused for reduced motion and while the tab is hidden.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % destinations.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  // Crossfade the photo to match the board.
  useGSAP(
    () => {
      const images = gsap.utils.toArray<HTMLElement>("[data-hero-image]");
      images.forEach((img, i) => {
        const active = i === index;
        gsap.to(img, { autoAlpha: active ? 1 : 0, duration: prefersReducedMotion() ? 0 : 1.1, ease: "power2.inOut" });
        if (active && !prefersReducedMotion())
          gsap.fromTo(img, { scale: 1.08 }, { scale: 1, duration: ROTATE_MS / 1000 + 1, ease: "none" });
      });
    },
    { scope: rootRef, dependencies: [index] },
  );

  return (
    <section ref={rootRef} aria-labelledby="hero-title" className="relative overflow-hidden bg-ink text-paper">
      {/* Dotted route line, the only decoration on the page. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-40 h-[46rem] w-[70rem] text-paper/[0.07]"
        viewBox="0 0 1100 720"
        fill="none"
      >
        <path
          d="M20 640 C 260 120, 760 60, 1080 300"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="2 12"
          strokeLinecap="round"
        />
      </svg>

      <div className="container-page relative grid gap-12 pt-28 pb-16 sm:pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:pt-36 lg:pb-24">
        <div>
          <h1 id="hero-title" className="font-display font-bold tracking-[-0.035em]">
            <span data-hero-title className="block text-[2.6rem] leading-[0.98] sm:text-6xl lg:text-[4.5rem]">
              Your next stop
            </span>
            <span className="sr-only">: {destinations.map((d) => d.city).join(", ")} and beyond</span>
            <span data-hero-board className="mt-4 block text-[2.3rem] sm:mt-5 sm:text-[3.6rem] lg:text-[4.1rem]">
              <SplitFlap word={current.city} length={BOARD_LENGTH} />
            </span>
          </h1>

          <p data-hero-fade className="mt-8 max-w-lg text-lg leading-relaxed text-paper/70">
            Visas, flights, hotels and car hire, planned by one team in Karachi. Search the fares yourself, or hand the
            whole trip to a planner.
          </p>

          <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <ButtonLink href="#search" size="lg">
                <Plane className="size-4.5" aria-hidden />
                Start a search
              </ButtonLink>
            </Magnetic>
            <ButtonLink href="#contact" size="lg" variant="outline-light">
              <MessageCircle className="size-4.5" aria-hidden />
              Talk to a planner
            </ButtonLink>
          </div>
        </div>

        <div className="relative">
          <div
            data-hero-photo
            className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-panel)] bg-ink-soft sm:aspect-[16/10] lg:aspect-[4/5]"
          >
            {destinations.map((d, i) => (
              <Image
                key={d.code}
                data-hero-image
                src={unsplash(d.image)}
                alt={i === index ? `${d.city}, ${d.country}` : ""}
                fill
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                style={{ opacity: i === 0 ? 1 : 0 }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          </div>

          {/* Boarding-pass stub for the destination on the board. */}
          <div
            data-hero-ticket
            aria-live="polite"
            className="absolute -bottom-6 left-4 flex items-stretch overflow-hidden rounded-2xl bg-paper text-ink shadow-xl sm:left-6"
          >
            <div className="px-5 py-3.5">
              <p className="text-xs text-slate">Karachi to {current.city}</p>
              <p className="font-display text-xl font-bold tracking-tight">
                {formatPrice(current.fareFrom)} <span className="text-sm font-medium text-slate">return</span>
              </p>
            </div>
            <div className="flex items-center border-l-2 border-dashed border-line bg-saffron px-4 font-display text-lg font-bold">
              {current.code}
            </div>
          </div>
        </div>
      </div>

      <div
        id="search"
        data-hero-search
        className="relative scroll-mt-24 bg-[linear-gradient(to_bottom,var(--color-ink)_50%,var(--color-paper)_50%)] pt-6"
      >
        <div className="container-page">
          <SearchPanel defaultType="flights" />
        </div>
      </div>
    </section>
  );
}
