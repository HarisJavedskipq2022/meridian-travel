"use client";

import { Briefcase, CarFront, Cog, Users, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatShortDate } from "@/lib/dates";
import { formatPrice, plural } from "@/lib/format";
import {
  carCategories,
  carSorts,
  filterAndSortCars,
  searchCars,
  type CarFilters,
  type CarOffer,
  type CarSort,
} from "@/lib/search/cars";
import type { CarQuery } from "@/lib/search/types";
import { AnimatedList } from "./AnimatedList";
import { BookingDialog, type BookingSummary } from "./BookingDialog";
import { Badge, EmptyResults, FilterGroup, FilterOption, ResultsLayout, SortSelect } from "./filters";

const NO_FILTERS: CarFilters = { categories: [], transmission: "Any" };
const transmissions: CarFilters["transmission"][] = ["Any", "Automatic", "Manual"];

function CarCard({ car, onSelect }: { car: CarOffer; onSelect: () => void }) {
  const Icon = car.category === "Electric" ? Zap : CarFront;
  return (
    <article className="grid overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-line transition-shadow hover:shadow-lg sm:grid-cols-[10rem_1fr] md:grid-cols-[10rem_1fr_12rem]">
      <div className="flex items-center justify-center bg-mist py-8 sm:py-0">
        <Icon className="size-14 text-lagoon" strokeWidth={1.25} aria-hidden />
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-sm font-semibold text-lagoon">{car.category}</p>
        <h3 className="mt-1 font-display text-xl font-bold tracking-tight">{car.model}</h3>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate">
          <li className="flex items-center gap-1.5">
            <Users className="size-4" aria-hidden />
            {plural(car.seats, "seat")}
          </li>
          <li className="flex items-center gap-1.5">
            <Briefcase className="size-4" aria-hidden />
            {plural(car.bags, "bag")}
          </li>
          <li className="flex items-center gap-1.5">
            <Cog className="size-4" aria-hidden />
            {car.transmission}
          </li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge>{car.supplier}</Badge>
          {car.freeCancellation && <Badge tone="positive">Free cancellation</Badge>}
          {car.youngDriverFee > 0 && <Badge tone="warning">Young driver fee included</Badge>}
        </div>
      </div>
      <div className="flex flex-col justify-end border-t border-line p-5 sm:col-span-2 sm:p-6 md:col-span-1 md:border-t-0 md:border-l md:text-right">
        <p className="font-display text-3xl font-bold tracking-tight">{formatPrice(car.totalPrice)}</p>
        <p className="text-sm text-slate">
          {formatPrice(car.dayRate)} a day, {plural(car.days, "day")}
        </p>
        <Button variant="dark" className="mt-4 w-full" onClick={onSelect}>
          Select car
        </Button>
      </div>
    </article>
  );
}

export function CarResults({ query }: { query: CarQuery }) {
  const offers = useMemo(() => searchCars(query), [query]);
  const [filters, setFilters] = useState<CarFilters>(NO_FILTERS);
  const [sort, setSort] = useState<CarSort>("price");
  const [booking, setBooking] = useState<BookingSummary | null>(null);

  const visible = filterAndSortCars(offers, filters, sort);
  const reset = () => setFilters(NO_FILTERS);

  function select(car: CarOffer) {
    setBooking({
      id: car.id,
      item: "car",
      title: `${car.model} from ${car.supplier}`,
      details: [
        car.location,
        `${formatShortDate(query.pickUp)} to ${formatShortDate(query.dropOff)}, ${plural(car.days, "day")}`,
        "Collision damage cover and unlimited mileage included",
      ],
      total: car.totalPrice,
    });
  }

  if (!offers.length) return <EmptyResults message="No cars available for these dates." />;

  return (
    <>
      <ResultsLayout
        count={visible.length}
        noun="car"
        onReset={reset}
        sort={<SortSelect options={carSorts} value={sort} onChange={setSort} />}
        filters={
          <>
            <FilterGroup legend="Car type">
              {carCategories.map((category) => (
                <FilterOption
                  key={category}
                  label={category}
                  meta={offers.filter((o) => o.category === category).length}
                  checked={filters.categories.includes(category)}
                  onChange={() =>
                    setFilters((f) => ({
                      ...f,
                      categories: f.categories.includes(category)
                        ? f.categories.filter((c) => c !== category)
                        : [...f.categories, category],
                    }))
                  }
                />
              ))}
            </FilterGroup>
            <FilterGroup legend="Transmission">
              {transmissions.map((transmission) => (
                <FilterOption
                  key={transmission}
                  type="radio"
                  name="transmission"
                  label={transmission === "Any" ? "Any transmission" : transmission}
                  checked={filters.transmission === transmission}
                  onChange={() => setFilters((f) => ({ ...f, transmission }))}
                />
              ))}
            </FilterGroup>
          </>
        }
      >
        {visible.length ? (
          <AnimatedList animationKey={`${sort}-${filters.categories.join()}-${filters.transmission}`}>
            {visible.map((car) => (
              <li key={car.id}>
                <CarCard car={car} onSelect={() => select(car)} />
              </li>
            ))}
          </AnimatedList>
        ) : (
          <EmptyResults message="No cars match these filters." onReset={reset} />
        )}
      </ResultsLayout>
      <BookingDialog booking={booking} onClose={() => setBooking(null)} />
    </>
  );
}
