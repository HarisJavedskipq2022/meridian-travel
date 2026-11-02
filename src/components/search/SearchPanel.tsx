"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { emptyQuery } from "@/lib/search/defaults";
import { searchHref } from "@/lib/search/params";
import { searchTypes, type QueryFor, type SearchType } from "@/lib/search/types";
import type { FieldErrors } from "@/lib/search/validate";
import { CarForm } from "./forms/CarForm";
import { FlightForm } from "./forms/FlightForm";
import { HotelForm } from "./forms/HotelForm";
import { VisaForm } from "./forms/VisaForm";
import { searchTabs } from "./search-tabs";

/** A query to prefill one tab with, e.g. the current search on the results page. */
export type SearchPreset = {
  [T in SearchType]: { type: T; query: QueryFor[T]; errors?: FieldErrors<QueryFor[T]> };
}[SearchType];

type Props = {
  defaultType?: SearchType;
  preset?: SearchPreset;
  className?: string;
};

function presetFor<T extends SearchType>(preset: SearchPreset | undefined, type: T) {
  if (preset?.type !== type) return { query: emptyQuery(type), errors: undefined };
  // `preset.type === type` guarantees the shapes match; TS can't narrow a generic union.
  return preset as unknown as { query: QueryFor[T]; errors?: FieldErrors<QueryFor[T]> };
}

export function SearchPanel({ defaultType = "flights", preset, className }: Props) {
  const [active, setActive] = useState<SearchType>(preset?.type ?? defaultType);
  const rootRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<Partial<Record<SearchType, HTMLButtonElement | null>>>({});
  const isFirstRender = useRef(true);
  const baseId = useId();

  // Slide the pill under the active tab, and fade the new form in.
  useGSAP(
    () => {
      const moveIndicator = (animate: boolean) => {
        const tab = tabRefs.current[active];
        if (!tab) return;
        gsap.to(indicatorRef.current, {
          x: tab.offsetLeft,
          width: tab.offsetWidth,
          duration: animate && !prefersReducedMotion() ? 0.45 : 0,
          ease: "power3.out",
        });
      };
      moveIndicator(!isFirstRender.current);

      if (!isFirstRender.current && !prefersReducedMotion()) {
        gsap.fromTo(
          "[data-search-form]",
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
        );
      }
      isFirstRender.current = false;

      const onResize = () => moveIndicator(false);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: rootRef, dependencies: [active] },
  );

  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = searchTypes[(searchTypes.indexOf(active) + step + searchTypes.length) % searchTypes.length];
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  const tabId = (type: SearchType) => `${baseId}-tab-${type}`;
  const panelId = `${baseId}-panel`;
  const presetKey = preset ? searchHref(preset.type, preset.query) : "empty";

  return (
    <div
      ref={rootRef}
      className={cn(
        "rounded-[var(--radius-panel)] bg-white p-4 shadow-[0_30px_80px_-30px_rgba(15,39,51,0.45)] sm:p-6",
        className,
      )}
    >
      <div
        role="tablist"
        aria-label="What are you booking?"
        className="relative mb-5 grid grid-cols-4 gap-1 rounded-2xl bg-mist p-1 sm:inline-flex sm:rounded-full"
      >
        <span
          ref={indicatorRef}
          aria-hidden
          className="absolute top-1 bottom-1 left-0 w-0 rounded-xl bg-ink sm:rounded-full"
        />
        {searchTypes.map((type) => {
          const { label, icon: Icon } = searchTabs[type];
          const selected = type === active;
          return (
            <button
              key={type}
              ref={(el) => {
                tabRefs.current[type] = el;
              }}
              id={tabId(type)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(type)}
              onKeyDown={onTabKeyDown}
              className={cn(
                "relative z-10 flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold transition-colors duration-300 sm:flex-row sm:gap-2 sm:rounded-full sm:px-5 sm:py-2.5 sm:text-sm",
                selected ? "text-paper" : "text-slate hover:text-ink",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </button>
          );
        })}
      </div>

      <div id={panelId} role="tabpanel" aria-labelledby={tabId(active)} data-search-form>
        {active === "flights" && <FlightForm key={presetKey} {...toFormProps(presetFor(preset, "flights"))} />}
        {active === "hotels" && <HotelForm key={presetKey} {...toFormProps(presetFor(preset, "hotels"))} />}
        {active === "cars" && <CarForm key={presetKey} {...toFormProps(presetFor(preset, "cars"))} />}
        {active === "visa" && <VisaForm key={presetKey} {...toFormProps(presetFor(preset, "visa"))} />}
      </div>
    </div>
  );
}

function toFormProps<Q>({ query, errors }: { query: Q; errors?: FieldErrors<Q> }) {
  return { initial: query, initialErrors: errors };
}
