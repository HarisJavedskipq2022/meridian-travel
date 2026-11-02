const DAY_MS = 86_400_000;

/** Local calendar date as YYYY-MM-DD, the format `<input type="date">` uses. */
export function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function addDays(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  return toISODate(new Date(y, m - 1, d + days));
}

export function daysBetween(fromISO: string, toISO: string) {
  return Math.round((Date.parse(toISO) - Date.parse(fromISO)) / DAY_MS);
}

export function isISODate(value: string | null | undefined): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

const shortDate = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });

export function formatShortDate(iso: string) {
  return shortDate.format(new Date(`${iso}T00:00:00`));
}

/** Minutes since midnight to "HH:MM". */
export function formatClock(minutes: number) {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
