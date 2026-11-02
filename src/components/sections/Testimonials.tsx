"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Stars";
import { testimonials } from "@/data/content";
import { unsplash } from "@/lib/images";

export function Testimonials() {
  const trackRef = useRef<HTMLUListElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    const card = track?.querySelector("li");
    if (!track || !card) return;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  }

  const controls = (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Previous stories"
        aria-controls="stories-track"
        className="inline-flex size-12 items-center justify-center rounded-full ring-1 ring-paper/25 transition-colors hover:bg-paper hover:text-ink"
      >
        <ChevronLeft className="size-5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Next stories"
        aria-controls="stories-track"
        className="inline-flex size-12 items-center justify-center rounded-full ring-1 ring-paper/25 transition-colors hover:bg-paper hover:text-ink"
      >
        <ChevronRight className="size-5" aria-hidden />
      </button>
    </div>
  );

  return (
    <section id="stories" aria-labelledby="stories-title" className="overflow-hidden bg-ink py-24 text-paper sm:py-32">
      <Reveal className="container-page">
        <SectionHeading
          id="stories-title"
          tone="light"
          title="Rated 4.9 by the people who flew"
          intro="From 2,300 verified reviews after trips booked with us."
          aside={controls}
        />

        <ul
          id="stories-track"
          ref={trackRef}
          data-reveal
          className="-mx-4 mt-12 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
        >
          {testimonials.map((t) => (
            <li
              key={t.name}
              className="flex w-[85%] shrink-0 snap-start flex-col rounded-[var(--radius-card)] bg-ink-soft p-7 sm:w-[calc(50%-0.625rem)] lg:w-[calc((100%-2.5rem)/3)]"
            >
              <figure className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <Stars count={t.rating} />
                  <Quote className="size-7 text-saffron/40" aria-hidden />
                </div>
                <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-paper/90">
                  <p>{t.quote}</p>
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3 border-t border-paper/10 pt-5">
                  <Image
                    src={unsplash(t.avatar)}
                    alt=""
                    width={48}
                    height={48}
                    className="shrink-0 rounded-full object-cover"
                  />
                  <span>
                    <span className="block font-semibold">{t.name}</span>
                    <span className="block text-sm text-paper/60">{t.trip}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
