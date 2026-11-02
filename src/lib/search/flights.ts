import { distanceKm, findPlace } from "@/data/places";
import { createRandom } from "@/lib/random";
import type { Cabin, FlightQuery } from "./types";

export type Airline = { code: string; name: string; color: string };

export const airlines: Airline[] = [
  { code: "AR", name: "Aurora Air", color: "#2F5D8A" },
  { code: "CD", name: "Cedar Airways", color: "#1D7A72" },
  { code: "MN", name: "Monsoon Air", color: "#7A4E9C" },
  { code: "AT", name: "Atlas Wings", color: "#B5542C" },
  { code: "NL", name: "Northline", color: "#344955" },
  { code: "SK", name: "Saffron Sky", color: "#C38A12" },
];

const HUBS = ["DXB", "DOH", "IST"];
const CRUISE_KMH = 820;
const TAXI_AND_CLIMB_MIN = 35;

const cabinMultiplier: Record<Cabin, number> = {
  Economy: 1,
  "Premium economy": 1.7,
  Business: 3.6,
  First: 6.2,
};

const cabinBaggageKg: Record<Cabin, number> = {
  Economy: 23,
  "Premium economy": 30,
  Business: 40,
  First: 50,
};

export type FlightLeg = {
  from: string;
  to: string;
  airline: Airline;
  flightNumber: string;
  /** Minutes after midnight local departure day; may exceed 1440 for next-day arrival. */
  departMin: number;
  arriveMin: number;
  durationMin: number;
  stops: number;
  /** Connection airports, one per stop. */
  via: string[];
};

export type FlightOffer = {
  id: string;
  outbound: FlightLeg;
  inbound?: FlightLeg;
  pricePerTraveller: number;
  totalPrice: number;
  baggageKg: number;
  refundable: boolean;
  seatsLeft: number;
};

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step;
}

function buildLeg(from: string, to: string, seed: string): { leg: FlightLeg; fareFactor: number } {
  const origin = findPlace(from)!;
  const destination = findPlace(to)!;
  const rnd = createRandom(seed);
  const km = distanceKm(origin, destination);
  const directMin = (km / CRUISE_KMH) * 60 + TAXI_AND_CLIMB_MIN;

  const maxStops = km < 1500 ? 0 : km < 5000 ? 1 : 2;
  const stops = rnd.chance(km < 1500 ? 0 : 0.6) ? rnd.int(1, Math.max(1, maxStops)) : 0;
  const hubs = HUBS.filter((h) => h !== from && h !== to);
  const via = rnd.shuffle(hubs).slice(0, stops);

  const layover = stops * rnd.int(70, 230);
  const durationMin = roundTo(directMin * (1 + stops * 0.08) + layover + rnd.int(-10, 25), 5);
  const departMin = roundTo(rnd.int(5 * 60, 23 * 60 + 30), 5);
  const airline = rnd.pick(airlines);

  return {
    leg: {
      from,
      to,
      airline,
      flightNumber: `${airline.code} ${rnd.int(100, 989)}`,
      departMin,
      arriveMin: departMin + durationMin,
      durationMin,
      stops,
      via,
    },
    // Direct flights cost more; random spread keeps the list realistic.
    fareFactor: (1 - stops * 0.12) * (0.85 + rnd.next() * 0.45),
  };
}

export function searchFlights(query: FlightQuery): FlightOffer[] {
  const origin = findPlace(query.from);
  const destination = findPlace(query.to);
  if (!origin || !destination || origin.code === destination.code) return [];

  const km = distanceKm(origin, destination);
  const baseFare = 55 + km * 0.082;
  const seed = `${query.from}-${query.to}-${query.depart}-${query.trip === "return" ? query.return : "ow"}`;
  const count = createRandom(seed).int(8, 12);

  return Array.from({ length: count }, (_, i) => {
    const outbound = buildLeg(query.from, query.to, `${seed}:out:${i}`);
    const inbound = query.trip === "return" ? buildLeg(query.to, query.from, `${seed}:in:${i}`) : undefined;
    const rnd = createRandom(`${seed}:offer:${i}`);

    const cabinFactor = cabinMultiplier[query.cabin];
    const returnFare = inbound ? baseFare * inbound.fareFactor * cabinFactor * 0.85 : 0;
    const pricePerTraveller = Math.round(baseFare * outbound.fareFactor * cabinFactor + returnFare);

    return {
      id: `${seed}:${i}`,
      outbound: outbound.leg,
      inbound: inbound?.leg,
      pricePerTraveller,
      totalPrice: pricePerTraveller * query.travellers,
      baggageKg: cabinBaggageKg[query.cabin],
      refundable: query.cabin !== "Economy" || rnd.chance(0.3),
      seatsLeft: rnd.int(1, 9),
    };
  });
}

export const flightSorts = { cheapest: "Cheapest", fastest: "Fastest", earliest: "Earliest departure" } as const;
export type FlightSort = keyof typeof flightSorts;

export type FlightFilters = { maxStops: number | null; airlines: string[]; maxPrice: number | null };

export function filterAndSortFlights(offers: FlightOffer[], filters: FlightFilters, sort: FlightSort) {
  const totalMinutes = (o: FlightOffer) => o.outbound.durationMin + (o.inbound?.durationMin ?? 0);
  const compare: Record<FlightSort, (a: FlightOffer, b: FlightOffer) => number> = {
    cheapest: (a, b) => a.totalPrice - b.totalPrice,
    fastest: (a, b) => totalMinutes(a) - totalMinutes(b),
    earliest: (a, b) => a.outbound.departMin - b.outbound.departMin,
  };
  const maxLegStops = (o: FlightOffer) => Math.max(o.outbound.stops, o.inbound?.stops ?? 0);

  return offers
    .filter((o) => filters.maxStops === null || maxLegStops(o) <= filters.maxStops)
    .filter((o) => !filters.airlines.length || filters.airlines.includes(o.outbound.airline.code))
    .filter((o) => filters.maxPrice === null || o.totalPrice <= filters.maxPrice)
    .sort(compare[sort]);
}
