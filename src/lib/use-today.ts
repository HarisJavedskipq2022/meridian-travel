"use client";

import { useSyncExternalStore } from "react";
import { todayISO } from "./dates";

const subscribe = () => () => {};

/**
 * Today's date (YYYY-MM-DD) on the client, "" during prerender.
 * Keeps prerendered HTML free of build-time dates without a setState-in-effect.
 */
export function useToday() {
  return useSyncExternalStore(subscribe, todayISO, () => "");
}
