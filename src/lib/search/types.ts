export const searchTypes = ["visa", "flights", "hotels", "cars"] as const;
export type SearchType = (typeof searchTypes)[number];

export function isSearchType(value: string | null | undefined): value is SearchType {
  return searchTypes.includes(value as SearchType);
}

export const tripTypes = ["return", "oneway"] as const;
export type TripType = (typeof tripTypes)[number];

export type FlightQuery = {
  trip: TripType;
  from: string;
  to: string;
  depart: string;
  /** Ignored for one-way trips. */
  return: string;
  travellers: number;
  cabin: Cabin;
};

export const cabins = ["Economy", "Premium economy", "Business", "First"] as const;
export type Cabin = (typeof cabins)[number];

export type HotelQuery = {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
};

export type CarQuery = {
  location: string;
  pickUp: string;
  dropOff: string;
  driverAge: number;
};

export type VisaQuery = {
  passport: string;
  destination: string;
  purpose: string;
};

export type QueryFor = {
  flights: FlightQuery;
  hotels: HotelQuery;
  cars: CarQuery;
  visa: VisaQuery;
};
