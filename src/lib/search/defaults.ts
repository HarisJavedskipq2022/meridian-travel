import { addDays, isISODate } from "@/lib/dates";
import { parseQuery } from "./params";
import type { QueryFor, SearchType } from "./types";

const EMPTY = new URLSearchParams();

/** Default query for a search type, before any dates are known. */
export function emptyQuery<T extends SearchType>(type: T): QueryFor[T] {
  return parseQuery(type, EMPTY);
}

type DateFiller<T> = (query: T, today: string) => Partial<T>;

const dateFillers: { [T in SearchType]: DateFiller<QueryFor[T]> } = {
  flights: (q, today) => {
    const depart = isISODate(q.depart) ? q.depart : addDays(today, 14);
    if (q.trip === "oneway") return { depart, return: "" };
    return { depart, return: isISODate(q.return) ? q.return : addDays(depart, 7) };
  },
  hotels: (q, today) => {
    const checkIn = isISODate(q.checkIn) ? q.checkIn : addDays(today, 14);
    return { checkIn, checkOut: isISODate(q.checkOut) ? q.checkOut : addDays(checkIn, 4) };
  },
  cars: (q, today) => {
    const pickUp = isISODate(q.pickUp) ? q.pickUp : addDays(today, 14);
    return { pickUp, dropOff: isISODate(q.dropOff) ? q.dropOff : addDays(pickUp, 5) };
  },
  visa: () => ({}),
};

/**
 * Fills missing dates relative to `today` (two weeks out), so links like
 * "/search?type=hotels&city=LIS" still produce a valid search.
 * Returns the query unchanged while `today` is unknown (during prerender).
 */
export function withDateDefaults<T extends SearchType>(type: T, query: QueryFor[T], today: string): QueryFor[T] {
  if (!today) return query;
  return { ...query, ...dateFillers[type](query, today) };
}
