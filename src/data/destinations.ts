import type { Region } from "./places";

export type Destination = {
  code: string;
  city: string;
  country: string;
  region: Region;
  image: string;
  /** Lowest return fare from Karachi in USD, used on the card. */
  fareFrom: number;
  bestMonths: string;
  note: string;
};

export const destinations: Destination[] = [
  {
    code: "LIS",
    city: "Lisbon",
    country: "Portugal",
    region: "Europe",
    image: "1585208798174-6cedd86e019a",
    fareFrom: 689,
    bestMonths: "Apr – Jun",
    note: "Tiled hills, tram 28 and long Atlantic evenings.",
  },
  {
    code: "HND",
    city: "Tokyo",
    country: "Japan",
    region: "Asia",
    image: "1540959733332-eab4deabeeaf",
    fareFrom: 812,
    bestMonths: "Mar – May",
    note: "Neon nights in Shinjuku, quiet mornings in Yanaka.",
  },
  {
    code: "JTR",
    city: "Santorini",
    country: "Greece",
    region: "Europe",
    image: "1533105079780-92b9be482077",
    fareFrom: 744,
    bestMonths: "May – Sep",
    note: "Caldera sunsets from a cliffside terrace in Oia.",
  },
  {
    code: "DXB",
    city: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    image: "1512453979798-5ea266f8880c",
    fareFrom: 219,
    bestMonths: "Nov – Mar",
    note: "Two hours from Karachi, and the desert is warm all winter.",
  },
  {
    code: "DPS",
    city: "Bali",
    country: "Indonesia",
    region: "Asia",
    image: "1537996194471-e657df975ab4",
    fareFrom: 598,
    bestMonths: "Apr – Oct",
    note: "Water temples, rice terraces and slow surf towns.",
  },
  {
    code: "CPT",
    city: "Cape Town",
    country: "South Africa",
    region: "Africa",
    image: "1580060839134-75a5edca2e99",
    fareFrom: 903,
    bestMonths: "Oct – Apr",
    note: "Table Mountain at dawn, wine country by lunch.",
  },
  {
    code: "AMS",
    city: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    image: "1534351590666-13e3e96b5017",
    fareFrom: 702,
    bestMonths: "Apr – Sep",
    note: "Canal-side bikes, gabled houses and the Rijksmuseum.",
  },
  {
    code: "SYD",
    city: "Sydney",
    country: "Australia",
    region: "Oceania",
    image: "1506973035872-a4ec16b8e8d9",
    fareFrom: 1140,
    bestMonths: "Sep – Nov",
    note: "Harbour ferries, coastal walks and Bondi at 7 a.m.",
  },
];

export const destinationRegions = ["All", ...new Set(destinations.map((d) => d.region))] as const;
