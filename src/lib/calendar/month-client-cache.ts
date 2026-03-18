import type { CalendarMonthData } from "@/src/lib/calendar/month-view";

const MONTH_CACHE_TTL_MS = 5 * 60 * 1000;
const MONTH_DATA_CHANGED_EVENT = "calendar:month-data-changed";

type MonthCacheEntry = {
  expiresAt: number;
  data: CalendarMonthData;
};

const monthDataCache = new Map<string, MonthCacheEntry>();

export function buildMonthCacheKey(branchName: string | null | undefined, year: number, month: number): string {
  return `${branchName ?? "no-branch"}:${year}-${month}`;
}

export function readMonthCache(key: string): CalendarMonthData | null {
  const cached = monthDataCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt <= Date.now()) {
    monthDataCache.delete(key);
    return null;
  }
  return cached.data;
}

export function writeMonthCache(key: string, data: CalendarMonthData): void {
  monthDataCache.set(key, {
    expiresAt: Date.now() + MONTH_CACHE_TTL_MS,
    data,
  });
}

export function invalidateMonthCache(branchName?: string | null, year?: number, month?: number): void {
  if (branchName != null && year != null && month != null) {
    monthDataCache.delete(buildMonthCacheKey(branchName, year, month));
    return;
  }
  monthDataCache.clear();
}

export function notifyCalendarMonthDataChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(MONTH_DATA_CHANGED_EVENT));
}

export function subscribeCalendarMonthDataChanged(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(MONTH_DATA_CHANGED_EVENT, handler);
  return () => window.removeEventListener(MONTH_DATA_CHANGED_EVENT, handler);
}