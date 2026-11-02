"use client";

import Image from "next/image";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { steps } from "@/data/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { photos, unsplash } from "@/lib/images";

export function HowItWorks() {
  const listRef = useRef<HTMLDivElement>(null);

  // The route line fills as you scroll through the steps.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-route-fill]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: listRef.current, start: "top 70%", end: "bottom 60%", scrub: 0.6 },
          },
        );
      });
    },
    { scope: listRef },
  );

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="py-24 sm:py-32">
      <Reveal className="container-page grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="how-title"
            title="From first message to boarding gate"
            intro="Most trips are booked within two days. Visa timelines depend on the embassy, and we tell you the real number up front."
          />
          <div
            data-reveal
            className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[var(--radius-panel)] lg:block"
          >
            <Image
              src={unsplash(photos.friends)}
              alt="A group of friends resting on a mountain hike"
              fill
              sizes="45vw"
              className="object-cover"
            />
          </div>
        </div>

        <div ref={listRef} className="relative pl-16 sm:pl-20">
          {/* Static track plus the scroll-driven fill. */}
          <span aria-hidden className="absolute top-2 bottom-2 left-[1.375rem] w-0.5 bg-line sm:left-[1.625rem]" />
          <span
            aria-hidden
            data-route-fill
            className="absolute top-2 bottom-2 left-[1.375rem] w-0.5 origin-top bg-lagoon sm:left-[1.625rem]"
          />
          <ol className="space-y-12">
            {steps.map((step, i) => (
              <li key={step.title} data-reveal className="relative">
                <span
                  aria-hidden
                  className="absolute top-0 -left-16 inline-flex size-11 items-center justify-center rounded-full bg-ink font-display text-lg font-bold text-saffron ring-8 ring-paper sm:-left-20 sm:size-[3.25rem]"
                >
                  {i + 1}
                </span>
                <h3 className="font-display text-2xl font-bold tracking-[-0.02em] sm:text-3xl">{step.title}</h3>
                <p className="mt-3 max-w-md text-lg leading-relaxed text-slate">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}
