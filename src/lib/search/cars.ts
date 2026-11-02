import { findPlace } from "@/data/places";
import { daysBetween } from "@/lib/dates";
import { createRandom } from "@/lib/random";
import type { CarQuery } from "./types";

export const carCategories = ["Economy", "Compact", "SUV", "Premium", "Van", "Electric"] as const;
export type CarCategory = (typeof carCategories)[number];

type FleetModel = {
  category: CarCategory;
  model: string;
  seats: number;
  bags: number;
  transmission: "Automatic" | "Manual";
  baseDayRate: number;
};

const FLEET: FleetModel[] = [
  { category: "Economy", model: "Suzuki Swift or similar", seats: 4, bags: 1, transmission: "Manual", baseDayRate: 24 },
  {
    category: "Economy",
    model: "Toyota Yaris or similar",
    seats: 5,
    bags: 2,
    transmission: "Automatic",
    baseDayRate: 29,
  },
  {
    category: "Compact",
    model: "Honda Civic or similar",
    seats: 5,
    bags: 2,
    transmission: "Automatic",
    baseDayRate: 38,
  },
  { category: "SUV", model: "Toyota RAV4 or similar", seats: 5, bags: 3, transmission: "Automatic", baseDayRate: 56 },
  { category: "SUV", model: "Kia Sorento or similar", seats: 7, bags: 3, transmission: "Automatic", baseDayRate: 64 },
  {
    category: "Premium",
    model: "Mercedes E-Class or similar",
    seats: 5,
    bags: 3,
    transmission: "Automatic",
    baseDayRate: 98,
  },
  { category: "Van", model: "Toyota Hiace or similar", seats: 9, bags: 6, transmission: "Manual", baseDayRate: 82 },
  {
    category: "Electric",
    model: "Tesla Model 3 or similar",
    seats: 5,
    bags: 2,
    transmission: "Automatic",
    baseDayRate: 72,
  },
];

const SUPPLIERS = ["Northwind Rentals", "Kestrel Car Hire", "Open Road", "Harbour Cars"];

/** Daily surcharge for drivers under 25, common across rental desks. */
export const YOUNG_DRIVER_SURCHARGE = 12;

export type CarOffer = FleetModel & {
  id: string;
  supplier: string;
  location: string;
  dayRate: number;
  days: number;
  totalPrice: number;
  freeCancellation: boolean;
  youngDriverFee: number;
};

export function searchCars(query: CarQuery): CarOffer[] {
  const place = findPlace(query.location);
  const days = daysBetween(query.pickUp, query.dropOff);
  if (!place || days < 1) return [];

  const seed = `${query.location}-${query.pickUp}`;
  const youngDriverFee = query.driverAge < 25 ? YOUNG_DRIVER_SURCHARGE : 0;

  return FLEET.map((car, i) => {
    const r = createRandom(`${seed}:${i}`);
    const dayRate = Math.round(car.baseDayRate * (0.85 + r.next() * 0.4)) + youngDriverFee;
    return {
      ...car,
      id: `${seed}:${i}`,
      supplier: r.pick(SUPPLIERS),
      location: `${place.city} airport (${place.code})`,
      dayRate,
      days,
      totalPrice: dayRate * days,
      freeCancellation: r.chance(0.7),
      youngDriverFee,
    };
  });
}

export const carSorts = { price: "Lowest price", seats: "Most seats" } as const;
export type CarSort = keyof typeof carSorts;

export type CarFilters = { categories: CarCategory[]; transmission: "Any" | CarOffer["transmission"] };

export function filterAndSortCars(offers: CarOffer[], filters: CarFilters, sort: CarSort) {
  const compare: Record<CarSort, (a: CarOffer, b: CarOffer) => number> = {
    price: (a, b) => a.totalPrice - b.totalPrice,
    seats: (a, b) => b.seats - a.seats || a.totalPrice - b.totalPrice,
  };
  return offers
    .filter((c) => !filters.categories.length || filters.categories.includes(c.category))
    .filter((c) => filters.transmission === "Any" || c.transmission === filters.transmission)
    .sort(compare[sort]);
}
