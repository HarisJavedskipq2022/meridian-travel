import { BookUser, Car, Hotel, Plane, type LucideIcon } from "lucide-react";
import type { SearchType } from "@/lib/search/types";

export const searchTabs: Record<SearchType, { label: string; icon: LucideIcon }> = {
  visa: { label: "Visa", icon: BookUser },
  flights: { label: "Flights", icon: Plane },
  hotels: { label: "Hotels", icon: Hotel },
  cars: { label: "Cars", icon: Car },
};
