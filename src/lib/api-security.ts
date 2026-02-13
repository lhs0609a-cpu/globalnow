import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS, type RateLimitResult } from "./rate-limiter";

type RateLimitTier = keyof typeof RATE_LIMITS;

/**
 * Extract client IP from request.
 * Checks x-forwarded-for (behind proxies), x-real-ip, then falls back to "unknown".
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs: client, proxy1, proxy2
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * Apply rate limiting to a request. Returns a 429 response if rate limited,
 * or null if the request is allowed.
 */
export function applyRateLimit(
  request: NextRequest,
  tier: RateLimitTier = "standard"
): NextResponse | null {
  const ip = getClientIP(request);
  const config = RATE_LIMITS[tier];
  const routeKey = `${ip}:${new URL(request.url).pathname}`;
  const result: RateLimitResult = checkRateLimit(
    routeKey,
    config.maxRequests,
    config.windowMs
  );

  if (!result.allowed) {
    const retryAfterSec = Math.ceil(result.retryAfterMs / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Limit": String(config.maxRequests),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(retryAfterSec),
        },
      }
    );
  }

  return null; // Allowed
}

/**
 * CSRF protection for POST/PUT/DELETE requests.
 *
 * Strategy: Verify that the request originates from the same site.
 * - Check Origin header matches the host
 * - If no Origin, check Referer header
 * - Require X-Requested-With header (can't be set by cross-origin forms)
 *
 * This blocks:
 * - Cross-origin form submissions (no custom headers)
 * - Cross-origin fetch without CORS (blocked by browser)
 */
export function verifyCsrf(request: NextRequest): NextResponse | null {
  const method = request.method.toUpperCase();

  // Only protect state-changing methods
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return null;
  }

  // Check X-Requested-With header (forms can't set custom headers)
  const xRequestedWith = request.headers.get("x-requested-with");
  if (xRequestedWith === "XMLHttpRequest") {
    return null; // Trusted client request
  }

  // Check Origin header
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost === host) {
        return null; // Same-origin request
      }
    } catch {
      // Invalid origin URL
    }
  }

  // Check Referer as fallback
  const referer = request.headers.get("referer");
  if (referer && host) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost === host) {
        return null; // Same-origin referer
      }
    } catch {
      // Invalid referer URL
    }
  }

  return NextResponse.json(
    { error: "Forbidden: Invalid request origin" },
    { status: 403 }
  );
}

/**
 * Combined security middleware. Apply at the top of each API route handler.
 * Returns a NextResponse if the request should be blocked, or null if allowed.
 *
 * @example
 * export async function POST(request: NextRequest) {
 *   const blocked = apiGuard(request, "ai");
 *   if (blocked) return blocked;
 *   // ... handler logic
 * }
 */
export function apiGuard(
  request: NextRequest,
  rateLimitTier: RateLimitTier = "standard"
): NextResponse | null {
  // 1. CSRF check (POST/PUT/DELETE only)
  const csrfBlock = verifyCsrf(request);
  if (csrfBlock) return csrfBlock;

  // 2. Rate limit check
  const rateBlock = applyRateLimit(request, rateLimitTier);
  if (rateBlock) return rateBlock;

  return null;
}
