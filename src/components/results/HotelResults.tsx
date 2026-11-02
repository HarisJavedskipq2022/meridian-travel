"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { formatShortDate } from "@/lib/dates";
import { formatPrice, plural } from "@/lib/format";
import { unsplash } from "@/lib/images";
import {
  filterAndSortHotels,
  hotelSorts,
  searchHotels,
  type HotelFilters,
  type HotelOffer,
  type HotelSort,
} from "@/lib/search/hotels";
import type { HotelQuery } from "@/lib/search/types";
import { AnimatedList } from "./AnimatedList";
import { BookingDialog, type BookingSummary } from "./BookingDialog";
import { Badge, EmptyResults, FilterGroup, FilterOption, PriceRange, ResultsLayout, SortSelect } from "./filters";

const NO_FILTERS: HotelFilters = { minStars: 0, freeCancellation: false, maxNightly: null };
const starOptions = [
  { value: 0, label: "Any rating" },
  { value: 4, label: "4 stars and up" },
  { value: 5, label: "5 stars only" },
];

function ratingWord(rating: number) {
  if (rating >= 9) return "Exceptional";
  if (rating >= 8.5) return "Excellent";
  if (rating >= 8) return "Very good";
  return "Good";
}

function HotelCard({ hotel, query, onSelect }: { hotel: HotelOffer; query: HotelQuery; onSelect: () => void }) {
  return (
    <article className="grid overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-line transition-shadow hover:shadow-lg sm:grid-cols-[14rem_1fr] md:grid-cols-[16rem_1fr_12rem]">
      <div className="relative aspect-[16/10] sm:aspect-auto sm:min-h-full">
        <Image
          src={unsplash(hotel.image)}
          alt={`${hotel.name}, ${hotel.city}`}
          fill
          sizes="(min-width: 640px) 16rem, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-5 sm:p-6">
        <Stars count={hotel.stars} />
        <h3 className="mt-2 font-display text-xl font-bold tracking-tight">{hotel.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate">
          <MapPin className="size-3.5" aria-hidden />
          {hotel.area}, {hotel.distanceKm} km from centre
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {hotel.freeCancellation && <Badge tone="positive">Free cancellation</Badge>}
          {hotel.amenities.slice(0, 4).map((amenity) => (
            <Badge key={amenity}>{amenity}</Badge>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-between gap-4 border-t border-line p-5 sm:col-span-2 sm:flex-row sm:items-end sm:p-6 md:col-span-1 md:flex-col md:items-stretch md:border-t-0 md:border-l">
        <div className="flex items-center gap-2 md:justify-end">
          <span className="text-right text-sm">
            <span className="block font-semibold">{ratingWord(hotel.rating)}</span>
            <span className="text-slate">{hotel.reviews.toLocaleString("en-US")} reviews</span>
          </span>
          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-ink font-display font-bold text-paper">
            {hotel.rating.toFixed(1)}
          </span>
        </div>
        <div className="md:text-right">
          <p className="font-display text-3xl font-bold tracking-tight">{formatPrice(hotel.totalPrice)}</p>
          <p className="text-sm text-slate">
            {formatPrice(hotel.pricePerNight)} a night, {plural(hotel.nights, "night")}
            {query.rooms > 1 && `, ${query.rooms} rooms`}
          </p>
          <Button variant="dark" className="mt-4 w-full" onClick={onSelect}>
            Select room
          </Button>
        </div>
      </div>
    </article>
  );
}

export function HotelResults({ query }: { query: HotelQuery }) {
  const offers = useMemo(() => searchHotels(query), [query]);
  const bounds = useMemo(() => {
    const prices = offers.map((o) => o.pricePerNight);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [offers]);

  const [filters, setFilters] = useState<HotelFilters>(NO_FILTERS);
  const [sort, setSort] = useState<HotelSort>("price");
  const [booking, setBooking] = useState<BookingSummary | null>(null);

  const visible = filterAndSortHotels(offers, filters, sort);
  const reset = () => setFilters(NO_FILTERS);

  function select(hotel: HotelOffer) {
    setBooking({
      id: hotel.id,
      item: "room",
      title: `${hotel.name}, ${hotel.city}`,
      details: [
        `${formatShortDate(query.checkIn)} to ${formatShortDate(query.checkOut)}, ${plural(hotel.nights, "night")}`,
        `${plural(query.guests, "guest")}, ${plural(query.rooms, "room")}`,
        hotel.freeCancellation ? "Free cancellation until 48 hours before check-in" : "Non-refundable rate",
      ],
      total: hotel.totalPrice,
    });
  }

  if (!offers.length) return <EmptyResults message="No hotels for these dates. Try different dates." />;

  return (
    <>
      <ResultsLayout
        count={visible.length}
        noun="stay"
        onReset={reset}
        sort={<SortSelect options={hotelSorts} value={sort} onChange={setSort} />}
        filters={
          <>
            <FilterGroup legend="Star rating">
              {starOptions.map((option) => (
                <FilterOption
                  key={option.value}
                  type="radio"
                  name="stars"
                  label={option.label}
                  checked={filters.minStars === option.value}
                  onChange={() => setFilters((f) => ({ ...f, minStars: option.value }))}
                />
              ))}
            </FilterGroup>
            <FilterGroup legend="Booking terms">
              <FilterOption
                label="Free cancellation"
                checked={filters.freeCancellation}
                onChange={() => setFilters((f) => ({ ...f, freeCancellation: !f.freeCancellation }))}
              />
            </FilterGroup>
            <FilterGroup legend="Budget">
              <PriceRange
                label="Max price a night"
                min={bounds.min}
                max={bounds.max}
                value={filters.maxNightly ?? bounds.max}
                onChange={(maxNightly) => setFilters((f) => ({ ...f, maxNightly }))}
              />
            </FilterGroup>
          </>
        }
      >
        {visible.length ? (
          <AnimatedList animationKey={`${sort}-${filters.minStars}-${filters.freeCancellation}`}>
            {visible.map((hotel) => (
              <li key={hotel.id}>
                <HotelCard hotel={hotel} query={query} onSelect={() => select(hotel)} />
              </li>
            ))}
          </AnimatedList>
        ) : (
          <EmptyResults message="No stays match these filters." onReset={reset} />
        )}
      </ResultsLayout>
      <BookingDialog booking={booking} onClose={() => setBooking(null)} />
    </>
  );
}
