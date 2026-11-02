"use client";

import { CircleAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { SearchPanel, type SearchPreset } from "@/components/search/SearchPanel";
import { findPlace } from "@/data/places";
import { passports, visaDestinations } from "@/data/visa";
import { formatShortDate } from "@/lib/dates";
import { plural } from "@/lib/format";
import { withDateDefaults } from "@/lib/search/defaults";
import { parseQuery, searchHref } from "@/lib/search/params";
import { isSearchType, type SearchType } from "@/lib/search/types";
import { validateQuery } from "@/lib/search/validate";
import { useToday } from "@/lib/use-today";
import { CarResults } from "./CarResults";
import { FlightResults } from "./FlightResults";
import { HotelResults } from "./HotelResults";
import { ResultsSkeleton } from "./ResultsSkeleton";
import { VisaResult } from "./VisaResult";

/** Mock "network" delay so the loading state is visible, as it would be with a real API. */
const SIMULATED_LATENCY_MS = 650;

function useSimulatedLatency(key: string) {
  const [readyKey, setReadyKey] = useState<string | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setReadyKey(key), SIMULATED_LATENCY_MS);
    return () => window.clearTimeout(timer);
  }, [key]);
  return readyKey !== key;
}

function buildSearch<T extends SearchType>(type: T, params: Pick<URLSearchParams, "get">, today: string): SearchPreset {
  const query = withDateDefaults(type, parseQuery(type, params), today);
  const errors = today ? validateQuery(type, query, today) : {};
  // `type` and `query` are produced together above, so they always match.
  return { type, query, errors } as SearchPreset;
}

function city(code: string) {
  return findPlace(code)?.city ?? code;
}

function describe(search: SearchPreset): { title: string; subtitle: string } {
  switch (search.type) {
    case "flights": {
      const q = search.query;
      const dates =
        q.trip === "return"
          ? `${formatShortDate(q.depart)} to ${formatShortDate(q.return)}`
          : `${formatShortDate(q.depart)}, one way`;
      return {
        title: `${city(q.from)} to ${city(q.to)}`,
        subtitle: `${dates}, ${plural(q.travellers, "traveller")}, ${q.cabin}`,
      };
    }
    case "hotels": {
      const q = search.query;
      return {
        title: `Stays in ${city(q.city)}`,
        subtitle: `${formatShortDate(q.checkIn)} to ${formatShortDate(q.checkOut)}, ${plural(q.guests, "guest")}, ${plural(q.rooms, "room")}`,
      };
    }
    case "cars": {
      const q = search.query;
      return {
        title: `Car hire in ${city(q.location)}`,
        subtitle: `Airport pick-up ${formatShortDate(q.pickUp)}, drop-off ${formatShortDate(q.dropOff)}`,
      };
    }
    case "visa": {
      const q = search.query;
      const from = passports.find((p) => p.code === q.passport)?.country ?? q.passport;
      const to = visaDestinations.find((d) => d.code === q.destination)?.country ?? q.destination;
      return { title: `Visa check for ${to}`, subtitle: `${from} passport, ${q.purpose.toLowerCase()}` };
    }
  }
}

function renderResults(search: SearchPreset): ReactNode {
  switch (search.type) {
    case "flights":
      return <FlightResults query={search.query} />;
    case "hotels":
      return <HotelResults query={search.query} />;
    case "cars":
      return <CarResults query={search.query} />;
    case "visa":
      return <VisaResult query={search.query} />;
  }
}

export function SearchResults() {
  const params = useSearchParams();
  const today = useToday();
  const rawType = params.get("type");
  const type: SearchType = isSearchType(rawType) ? rawType : "flights";

  const search = useMemo(() => buildSearch(type, params, today), [type, params, today]);
  const key = searchHref(search.type, search.query);
  const loading = useSimulatedLatency(key);
  const hasErrors = Object.keys(search.errors ?? {}).length > 0;
  const ready = today !== "" && !hasErrors;
  const { title, subtitle } = ready ? describe(search) : { title: "Finish your search", subtitle: "" };

  return (
    <>
      <section className="bg-ink pt-28 text-paper sm:pt-32">
        <div className="container-page pb-10">
          <h1 className="font-display text-4xl font-bold tracking-[-0.03em] text-balance sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-2 text-paper/70">{subtitle}</p>}
        </div>
        <div className="bg-[linear-gradient(to_bottom,var(--color-ink)_50%,var(--color-paper)_50%)]">
          <div className="container-page">
            {/* Keyed by type so the active tab follows the URL. */}
            <SearchPanel key={search.type} preset={search} />
          </div>
        </div>
      </section>

      <section aria-label="Results" className="container-page py-10 sm:py-14">
        {!today || (ready && loading) ? (
          <ResultsSkeleton />
        ) : hasErrors ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line"
          >
            <CircleAlert className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden />
            <p>Fill in the highlighted fields above, then search again to see results.</p>
          </div>
        ) : (
          <div key={key}>{renderResults(search)}</div>
        )}
      </section>
    </>
  );
}
