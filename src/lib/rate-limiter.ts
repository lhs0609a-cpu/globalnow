/**
 * In-memory sliding window rate limiter for API routes.
 * Tracks request timestamps per IP within a rolling window.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

/**
 * Check and consume one request from the rate limit bucket.
 *
 * @param ip - Client identifier (IP address)
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Rolling window duration in milliseconds
 */
export function checkRateLimit(
  ip: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();

  cleanup(windowMs);

  let entry = store.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(ip, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    // Rate limited
    const oldestInWindow = entry.timestamps[0];
    const retryAfterMs = oldestInWindow + windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(retryAfterMs, 1000),
    };
  }

  // Allow request
  entry.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxRequests - entry.timestamps.length,
    retryAfterMs: 0,
  };
}

/**
 * Predefined rate limit configurations.
 */
export const RATE_LIMITS = {
  // Expensive operations (AI calls)
  ai: { maxRequests: 10, windowMs: 60 * 1000 },         // 10/min
  // Standard data fetching
  standard: { maxRequests: 30, windowMs: 60 * 1000 },    // 30/min
  // Cached/lightweight endpoints
  cached: { maxRequests: 60, windowMs: 60 * 1000 },      // 60/min
} as const;
