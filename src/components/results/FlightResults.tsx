"use client";

import { Briefcase, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { findPlace } from "@/data/places";
import { formatClock, formatDuration, formatShortDate } from "@/lib/dates";
import { formatPrice, plural } from "@/lib/format";
import {
  airlines,
  filterAndSortFlights,
  flightSorts,
  searchFlights,
  type FlightFilters,
  type FlightLeg,
  type FlightOffer,
  type FlightSort,
} from "@/lib/search/flights";
import type { FlightQuery } from "@/lib/search/types";
import { AnimatedList } from "./AnimatedList";
import { BookingDialog, type BookingSummary } from "./BookingDialog";
import { Badge, EmptyResults, FilterGroup, FilterOption, PriceRange, ResultsLayout, SortSelect } from "./filters";

const NO_FILTERS: FlightFilters = { maxStops: null, airlines: [], maxPrice: null };
const stopOptions = [
  { value: null, label: "Any number of stops" },
  { value: 0, label: "Non-stop only" },
  { value: 1, label: "1 stop at most" },
];

function stopsLabel(stops: number) {
  return stops === 0 ? "Non-stop" : plural(stops, "stop");
}

function LegRow({ leg, date }: { leg: FlightLeg; date: string }) {
  const dayOffset = Math.floor(leg.arriveMin / 1440);
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
      <div>
        <p className="font-display text-2xl font-bold tracking-tight tabular-nums">{formatClock(leg.departMin)}</p>
        <p className="text-sm text-slate">
          {leg.from} <span className="hidden sm:inline">{formatShortDate(date)}</span>
        </p>
      </div>
      <div className="text-center text-xs text-slate">
        <p>{formatDuration(leg.durationMin)}</p>
        <div className="relative my-1.5 h-px bg-line">
          {Array.from({ length: leg.stops }, (_, i) => (
            <span
              key={i}
              className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-saffron ring-2 ring-white"
              style={{ left: `${((i + 1) / (leg.stops + 1)) * 100}%` }}
            />
          ))}
        </div>
        <p className={leg.stops === 0 ? "font-semibold text-lagoon" : undefined}>
          {stopsLabel(leg.stops)}
          {leg.via.length > 0 && ` via ${leg.via.join(", ")}`}
        </p>
      </div>
      <div className="text-right">
        <p className="font-display text-2xl font-bold tracking-tight tabular-nums">
          {formatClock(leg.arriveMin)}
          {dayOffset > 0 && <sup className="ml-0.5 text-xs font-semibold text-danger">+{dayOffset}</sup>}
        </p>
        <p className="text-sm text-slate">{leg.to}</p>
      </div>
    </div>
  );
}

function FlightCard({ offer, query, onSelect }: { offer: FlightOffer; query: FlightQuery; onSelect: () => void }) {
  const { airline } = offer.outbound;
  return (
    <article className="grid overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-line transition-shadow hover:shadow-lg md:grid-cols-[1fr_13rem]">
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-flex size-9 items-center justify-center rounded-lg font-display text-sm font-bold text-white"
            style={{ backgroundColor: airline.color }}
          >
            {airline.code}
          </span>
          <div>
            <h3 className="font-semibold">{airline.name}</h3>
            <p className="text-xs text-slate">
              {offer.outbound.flightNumber}
              {offer.inbound && `, return ${offer.inbound.flightNumber}`}
            </p>
          </div>
        </div>
        <LegRow leg={offer.outbound} date={query.depart} />
        {offer.inbound && <LegRow leg={offer.inbound} date={query.return} />}
      </div>

      <div className="flex flex-col justify-between gap-4 border-t border-dashed border-line bg-paper/60 p-5 sm:p-6 md:border-t-0 md:border-l">
        <div className="flex flex-wrap gap-1.5">
          <Badge>
            <Briefcase className="size-3" aria-hidden />
            {offer.baggageKg} kg
          </Badge>
          {offer.refundable && (
            <Badge tone="positive">
              <RefreshCcw className="size-3" aria-hidden />
              Refundable
            </Badge>
          )}
          {offer.seatsLeft <= 3 && <Badge tone="warning">{plural(offer.seatsLeft, "seat")} left</Badge>}
        </div>
        <div>
          <p className="font-display text-3xl font-bold tracking-tight">{formatPrice(offer.totalPrice)}</p>
          <p className="text-sm text-slate">
            {query.travellers > 1 ? `${formatPrice(offer.pricePerTraveller)} per traveller, ` : ""}
            {query.cabin.toLowerCase()}
          </p>
          <Button variant="dark" className="mt-4 w-full" onClick={onSelect}>
            Select
          </Button>
        </div>
      </div>
    </article>
  );
}

export function FlightResults({ query }: { query: FlightQuery }) {
  const offers = useMemo(() => searchFlights(query), [query]);
  const priceBounds = useMemo(() => {
    const prices = offers.map((o) => o.totalPrice);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [offers]);

  const [filters, setFilters] = useState<FlightFilters>(NO_FILTERS);
  const [sort, setSort] = useState<FlightSort>("cheapest");
  const [booking, setBooking] = useState<BookingSummary | null>(null);

  const visible = filterAndSortFlights(offers, filters, sort);
  const route = `${findPlace(query.from)?.city} to ${findPlace(query.to)?.city}`;
  const offeredAirlines = airlines.filter((a) => offers.some((o) => o.outbound.airline.code === a.code));
  const reset = () => setFilters(NO_FILTERS);

  function select(offer: FlightOffer) {
    setBooking({
      id: offer.id,
      item: "fare",
      title: `${offer.outbound.airline.name}, ${route}`,
      details: [
        `Depart ${formatShortDate(query.depart)} at ${formatClock(offer.outbound.departMin)}, ${stopsLabel(offer.outbound.stops)}`,
        ...(offer.inbound
          ? [
              `Return ${formatShortDate(query.return)} at ${formatClock(offer.inbound.departMin)}, ${stopsLabel(offer.inbound.stops)}`,
            ]
          : []),
        `${plural(query.travellers, "traveller")}, ${query.cabin}, ${offer.baggageKg} kg checked bag`,
      ],
      total: offer.totalPrice,
    });
  }

  if (!offers.length) return <EmptyResults message="No flights on this route. Try a nearby airport." />;

  return (
    <>
      <ResultsLayout
        count={visible.length}
        noun="flight"
        onReset={reset}
        sort={<SortSelect options={flightSorts} value={sort} onChange={setSort} />}
        filters={
          <>
            <FilterGroup legend="Stops">
              {stopOptions.map((option) => (
                <FilterOption
                  key={option.label}
                  type="radio"
                  name="stops"
                  label={option.label}
                  checked={filters.maxStops === option.value}
                  onChange={() => setFilters((f) => ({ ...f, maxStops: option.value }))}
                />
              ))}
            </FilterGroup>
            <FilterGroup legend="Airlines">
              {offeredAirlines.map((airline) => (
                <FilterOption
                  key={airline.code}
                  label={airline.name}
                  checked={filters.airlines.includes(airline.code)}
                  onChange={() =>
                    setFilters((f) => ({
                      ...f,
                      airlines: f.airlines.includes(airline.code)
                        ? f.airlines.filter((c) => c !== airline.code)
                        : [...f.airlines, airline.code],
                    }))
                  }
                />
              ))}
            </FilterGroup>
            <FilterGroup legend="Budget">
              <PriceRange
                label="Max total price"
                min={priceBounds.min}
                max={priceBounds.max}
                value={filters.maxPrice ?? priceBounds.max}
                onChange={(maxPrice) => setFilters((f) => ({ ...f, maxPrice }))}
              />
            </FilterGroup>
          </>
        }
      >
        {visible.length ? (
          <AnimatedList animationKey={`${sort}-${filters.maxStops}-${filters.airlines.join()}`}>
            {visible.map((offer) => (
              <li key={offer.id}>
                <FlightCard offer={offer} query={query} onSelect={() => select(offer)} />
              </li>
            ))}
          </AnimatedList>
        ) : (
          <EmptyResults message="No flights match these filters." onReset={reset} />
        )}
      </ResultsLayout>
      <BookingDialog booking={booking} onClose={() => setBooking(null)} />
    </>
  );
}
