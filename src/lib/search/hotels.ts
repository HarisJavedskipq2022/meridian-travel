import { findPlace } from "@/data/places";
import { daysBetween } from "@/lib/dates";
import { photos } from "@/lib/images";
import { createRandom } from "@/lib/random";
import type { HotelQuery } from "./types";

const hotelAmenities = [
  "Free Wi-Fi",
  "Breakfast included",
  "Pool",
  "Airport shuttle",
  "Spa",
  "Gym",
  "Sea view",
  "Family rooms",
] as const;

const NAMES = [
  "The Marlowe",
  "Casa Lumen",
  "Harbour House",
  "Saltwater Suites",
  "Palm Court Hotel",
  "Atrium Residences",
  "Cedar & Stone",
  "The Lantern",
  "Hotel Azure",
  "Meadow Lane Inn",
  "The Gilded Key",
  "Kite Hill Lodge",
];

const AREAS = ["Old Town", "Waterfront", "City Centre", "Marina", "Business District", "Arts Quarter", "Beachfront"];

const IMAGES = [photos.hotelPool, photos.resortPalms, photos.hotelNight, photos.waterVillas, photos.hotelDining];

export type HotelOffer = {
  id: string;
  name: string;
  area: string;
  city: string;
  stars: 3 | 4 | 5;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
  pricePerNight: number;
  nights: number;
  totalPrice: number;
  freeCancellation: boolean;
  distanceKm: number;
};

export function searchHotels(query: HotelQuery): HotelOffer[] {
  const place = findPlace(query.city);
  const nights = daysBetween(query.checkIn, query.checkOut);
  if (!place || nights < 1) return [];

  const seed = `${query.city}-${query.checkIn}`;
  const rnd = createRandom(seed);
  const names = rnd.shuffle(NAMES).slice(0, rnd.int(8, 10));

  return names.map((name, i) => {
    const r = createRandom(`${seed}:${i}`);
    const stars = r.pick([3, 4, 4, 5, 5] as const);
    const pricePerNight = Math.round((40 + stars * 32) * (0.8 + r.next() * 0.9));
    const amenities = hotelAmenities.filter(() => r.chance(0.45));

    return {
      id: `${seed}:${i}`,
      name,
      area: r.pick(AREAS),
      city: place.city,
      stars,
      rating: Math.round((7.4 + r.next() * 2.3) * 10) / 10,
      reviews: r.int(80, 2400),
      image: IMAGES[i % IMAGES.length],
      amenities: amenities.length ? amenities : ["Free Wi-Fi"],
      pricePerNight,
      nights,
      totalPrice: pricePerNight * nights * query.rooms,
      freeCancellation: r.chance(0.65),
      distanceKm: Math.round(r.next() * 60) / 10,
    };
  });
}

export const hotelSorts = { price: "Lowest price", rating: "Top rated", distance: "Closest to centre" } as const;
export type HotelSort = keyof typeof hotelSorts;

export type HotelFilters = { minStars: number; freeCancellation: boolean; maxNightly: number | null };

export function filterAndSortHotels(offers: HotelOffer[], filters: HotelFilters, sort: HotelSort) {
  const compare: Record<HotelSort, (a: HotelOffer, b: HotelOffer) => number> = {
    price: (a, b) => a.pricePerNight - b.pricePerNight,
    rating: (a, b) => b.rating - a.rating,
    distance: (a, b) => a.distanceKm - b.distanceKm,
  };
  return offers
    .filter((h) => h.stars >= filters.minStars)
    .filter((h) => !filters.freeCancellation || h.freeCancellation)
    .filter((h) => filters.maxNightly === null || h.pricePerNight <= filters.maxNightly)
    .sort(compare[sort]);
}
