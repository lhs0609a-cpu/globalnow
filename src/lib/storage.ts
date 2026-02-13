"use client";

export function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // QuotaExceededError — evict oldest entries if possible
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      console.warn("localStorage quota exceeded, clearing old data");
      try {
        // Remove trend data older than 7 days as a fallback
        const keys = Object.keys(localStorage).filter((k) =>
          k.startsWith("globalnow_")
        );
        if (keys.length > 0) {
          localStorage.removeItem(keys[0]);
          localStorage.setItem(key, JSON.stringify(value));
        }
      } catch {
        // Give up
      }
    }
  }
}

export function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function appendToArray<T>(
  key: string,
  item: T,
  maxLength: number = 200
): void {
  const arr = getItem<T[]>(key) || [];
  arr.unshift(item);
  if (arr.length > maxLength) arr.length = maxLength;
  setItem(key, arr);
}
