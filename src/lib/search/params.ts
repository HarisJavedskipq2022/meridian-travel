import { cabins, type Cabin, type QueryFor, type SearchType } from "./types";

type Params = Pick<URLSearchParams, "get">;

function str(params: Params, key: string, fallback = "") {
  return params.get(key)?.trim() ?? fallback;
}

function int(params: Params, key: string, fallback: number, min: number, max: number) {
  const value = Number.parseInt(params.get(key) ?? "", 10);
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

function cabin(params: Params): Cabin {
  const value = params.get("cabin");
  return cabins.find((c) => c === value) ?? "Economy";
}

/** Reads a typed query from URL params. Missing or malformed values fall back to safe defaults. */
const parsers: { [T in SearchType]: (params: Params) => QueryFor[T] } = {
  flights: (p) => ({
    trip: p.get("trip") === "oneway" ? "oneway" : "return",
    from: str(p, "from", "KHI").toUpperCase(),
    to: str(p, "to").toUpperCase(),
    depart: str(p, "depart"),
    return: p.get("trip") === "oneway" ? "" : str(p, "return"),
    travellers: int(p, "travellers", 1, 1, 9),
    cabin: cabin(p),
  }),
  hotels: (p) => ({
    city: str(p, "city").toUpperCase(),
    checkIn: str(p, "checkIn"),
    checkOut: str(p, "checkOut"),
    guests: int(p, "guests", 2, 1, 12),
    rooms: int(p, "rooms", 1, 1, 6),
  }),
  cars: (p) => ({
    location: str(p, "location").toUpperCase(),
    pickUp: str(p, "pickUp"),
    dropOff: str(p, "dropOff"),
    driverAge: int(p, "driverAge", 30, 18, 99),
  }),
  visa: (p) => ({
    passport: str(p, "passport", "PK").toUpperCase(),
    destination: str(p, "destination").toUpperCase(),
    purpose: str(p, "purpose", "Tourism"),
  }),
};

export function parseQuery<T extends SearchType>(type: T, params: Params): QueryFor[T] {
  return parsers[type](params);
}

export function searchHref<T extends SearchType>(type: T, query: Partial<QueryFor[T]>) {
  const params = new URLSearchParams({ type });
  for (const [key, value] of Object.entries(query)) {
    if (value !== "" && value !== undefined && value !== null) params.set(key, String(value));
  }
  return `/search?${params.toString()}`;
}
