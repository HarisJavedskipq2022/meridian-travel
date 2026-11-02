import { findPlace } from "@/data/places";
import { passports, visaDestinations } from "@/data/visa";
import { daysBetween, isISODate } from "@/lib/dates";
import type { QueryFor, SearchType } from "./types";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

function dateError(value: string, today: string, label: string) {
  if (!isISODate(value)) return `Choose a ${label}.`;
  if (value < today) return `The ${label} can't be in the past.`;
  return undefined;
}

function rangeError(start: string, end: string, label: string) {
  if (!isISODate(end)) return `Choose a ${label}.`;
  if (isISODate(start) && daysBetween(start, end) < 1) return `The ${label} must be after the start date.`;
  return undefined;
}

function compact<T>(errors: FieldErrors<T>): FieldErrors<T> {
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => v)) as FieldErrors<T>;
}

const validators: { [T in SearchType]: (q: QueryFor[T], today: string) => FieldErrors<QueryFor[T]> } = {
  flights: (q, today) =>
    compact({
      from: findPlace(q.from) ? undefined : "Choose where you're flying from.",
      to: !findPlace(q.to)
        ? "Choose where you're flying to."
        : q.to === q.from
          ? "Pick a destination different from the origin."
          : undefined,
      depart: dateError(q.depart, today, "departure date"),
      return: q.trip === "return" ? rangeError(q.depart, q.return, "return date") : undefined,
    }),
  hotels: (q, today) =>
    compact({
      city: findPlace(q.city) ? undefined : "Choose a destination.",
      checkIn: dateError(q.checkIn, today, "check-in date"),
      checkOut: rangeError(q.checkIn, q.checkOut, "check-out date"),
      rooms: q.rooms > q.guests ? "You need at least one guest per room." : undefined,
    }),
  cars: (q, today) =>
    compact({
      location: findPlace(q.location) ? undefined : "Choose a pick-up location.",
      pickUp: dateError(q.pickUp, today, "pick-up date"),
      dropOff: rangeError(q.pickUp, q.dropOff, "drop-off date"),
      driverAge: q.driverAge < 21 ? "Drivers must be 21 or older." : undefined,
    }),
  visa: (q) =>
    compact({
      passport: passports.some((p) => p.code === q.passport) ? undefined : "Choose your passport.",
      destination: visaDestinations.some((d) => d.code === q.destination) ? undefined : "Choose a destination.",
    }),
};

/** `today` is passed in (YYYY-MM-DD) so validation stays pure and testable. */
export function validateQuery<T extends SearchType>(type: T, query: QueryFor[T], today: string) {
  return validators[type](query, today);
}
