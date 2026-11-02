export type Region = "Europe" | "Asia" | "Middle East" | "Africa" | "Americas" | "Oceania";

export type Place = {
  /** IATA airport code, also used as the city key for hotels and cars. */
  code: string;
  city: string;
  country: string;
  region: Region;
  lat: number;
  lon: number;
};

export const places: Place[] = [
  { code: "KHI", city: "Karachi", country: "Pakistan", region: "Asia", lat: 24.9, lon: 67.16 },
  { code: "LHE", city: "Lahore", country: "Pakistan", region: "Asia", lat: 31.52, lon: 74.4 },
  { code: "ISB", city: "Islamabad", country: "Pakistan", region: "Asia", lat: 33.55, lon: 72.83 },
  { code: "DXB", city: "Dubai", country: "United Arab Emirates", region: "Middle East", lat: 25.25, lon: 55.36 },
  { code: "DOH", city: "Doha", country: "Qatar", region: "Middle East", lat: 25.27, lon: 51.6 },
  { code: "IST", city: "Istanbul", country: "Türkiye", region: "Europe", lat: 41.26, lon: 28.74 },
  { code: "LHR", city: "London", country: "United Kingdom", region: "Europe", lat: 51.47, lon: -0.45 },
  { code: "CDG", city: "Paris", country: "France", region: "Europe", lat: 49.01, lon: 2.55 },
  { code: "LIS", city: "Lisbon", country: "Portugal", region: "Europe", lat: 38.77, lon: -9.13 },
  { code: "FCO", city: "Rome", country: "Italy", region: "Europe", lat: 41.8, lon: 12.25 },
  { code: "VCE", city: "Venice", country: "Italy", region: "Europe", lat: 45.5, lon: 12.35 },
  { code: "AMS", city: "Amsterdam", country: "Netherlands", region: "Europe", lat: 52.31, lon: 4.76 },
  { code: "JTR", city: "Santorini", country: "Greece", region: "Europe", lat: 36.4, lon: 25.48 },
  { code: "HND", city: "Tokyo", country: "Japan", region: "Asia", lat: 35.55, lon: 139.78 },
  { code: "SIN", city: "Singapore", country: "Singapore", region: "Asia", lat: 1.36, lon: 103.99 },
  { code: "BKK", city: "Bangkok", country: "Thailand", region: "Asia", lat: 13.69, lon: 100.75 },
  { code: "DPS", city: "Bali", country: "Indonesia", region: "Asia", lat: -8.75, lon: 115.17 },
  { code: "MLE", city: "Malé", country: "Maldives", region: "Asia", lat: 4.19, lon: 73.53 },
  { code: "CPT", city: "Cape Town", country: "South Africa", region: "Africa", lat: -33.97, lon: 18.6 },
  { code: "JFK", city: "New York", country: "United States", region: "Americas", lat: 40.64, lon: -73.78 },
  { code: "YYZ", city: "Toronto", country: "Canada", region: "Americas", lat: 43.68, lon: -79.63 },
  { code: "SYD", city: "Sydney", country: "Australia", region: "Oceania", lat: -33.94, lon: 151.18 },
];

export function findPlace(code: string | null | undefined) {
  return places.find((p) => p.code === code);
}

/** Great-circle distance in kilometres. */
export function distanceKm(a: Place, b: Place) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
