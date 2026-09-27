// Fixed-window per-IP rate limiting for the auth endpoints (ADR-009 in the
// inherited architecture). The pure core keeps the window math and eviction
// unit-testable without timers; buckets live in process memory — per-process
// only (single-node deploy), and restarting the server clears them.

export type RateBuckets = Map<string, { count: number; resetAt: number }>;

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

/** Pure: does the key fit in the window? Opportunistically evicts expired entries. */
export function checkRate(
  buckets: RateBuckets,
  key: string,
  limit: number,
  windowMs: number,
  now: number,
): RateLimitResult {
  for (const [k, v] of buckets) {
    if (v.resetAt <= now) buckets.delete(k);
  }
  const entry = buckets.get(key);
  if (!entry) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (entry.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

const buckets: RateBuckets = new Map();
const AUTH_LIMIT = 10;
const AUTH_WINDOW_MS = 15 * 60 * 1000;

/** Auth-route wrapper: 10 attempts / 15 min per IP. */
export function authRateLimit(ip: string, now: number = Date.now()): RateLimitResult {
  return checkRate(buckets, `auth:${ip}`, AUTH_LIMIT, AUTH_WINDOW_MS, now);
}

/** The client IP behind a single trusted proxy. */
export function clientIpOf(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip") || "unknown";
}
