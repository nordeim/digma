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

// Session 67 (S67-C — the fifteenth audit's M-2, the documented B-15):
// the assistant's DEDICATED bucket. The pre-fix route had no limiter at
// all — an authenticated caller drove unbounded LLM completions (API cost
// burn + up to 60s of held server work per request). The bucket is its
// OWN `ai:` prefix, NEVER the shared `auth:` key: the e2e/smoke suites
// drive this route from the same localhost IP as their auth calls, so a
// shared bucket would break their budgets (the documented deferral
// reason). 20 requests / 5 min sits far above the UI's interactive use
// while capping scripted burn.
const AI_LIMIT = 20;
const AI_WINDOW_MS = 5 * 60 * 1000;

/** Assistant-route wrapper: 20 requests / 5 min per IP. */
export function aiRateLimit(ip: string, now: number = Date.now()): RateLimitResult {
  return checkRate(buckets, `ai:${ip}`, AI_LIMIT, AI_WINDOW_MS, now);
}

/**
 * The declared proxy-topology trust depth (session 69, S69-A — the
 * seventeenth audit's M-A, the promoted M-class carry-over).
 *
 * DIGMA_PROXY_HOPS: unset (the default) = 1 — exactly one appending
 * proxy, the standing S62-D last-hop trust. 0 = direct exposure (the
 * client-supplied header family is ignored entirely). N >= 2 = N
 * trusted appending proxies in front of the app. Unparsable or
 * negative values fail CLOSED onto the default — a bad env var never
 * widens trust.
 */
export function proxyHopDepth(): number {
  const raw = process.env.DIGMA_PROXY_HOPS;
  if (raw === undefined || raw === "") return 1;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return 1;
  return parsed;
}

/**
 * The client IP behind a DECLARED proxy topology.
 *
 * Session 62 (S62-D / B-M1): the limiter keys on the LAST
 * x-forwarded-for hop — the proxy-APPENDED real IP. The pre-fix
 * first-hop keying trusted a client-suppliable value: a spoofing
 * client PREPENDS a fake IP and the proxy appends the real one after
 * it, so the first hop was attacker-chosen and the auth brute-force
 * defense (10/IP/15min) was evadable by rotating the header. A
 * single-value header (the e2e/smoke suites' dedicated-bucket form)
 * is both first and last — unaffected.
 *
 * Session 69 (S69-A / M-A): the last hop is correct only behind
 * EXACTLY ONE appending proxy — the trust is now DEPLOY-DECLARED
 * through DIGMA_PROXY_HOPS. A direct-exposure deploy (depth 0) gets
 * one honest shared bucket instead of a per-request header rotation
 * that fully bypasses the limiter; a two-or-more-hop topology (depth
 * N) keys on the hop the Nth trusted proxy preserved — the LAST hop
 * there is the innermost PROXY's own IP, which would collapse every
 * user into one self-DoS bucket. A list shorter than the declared
 * depth fails closed onto "unknown" (an attacker sending single-value
 * headers under a declared depth of 2 cannot rotate buckets). The
 * x-real-ip fallback applies only at depth >= 1 with XFF absent —
 * unchanged at the default, ignored entirely at depth 0.
 */
export function clientIpOf(headers: Headers): string {
  const depth = proxyHopDepth();
  if (depth === 0) return "unknown";
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded.split(",").map((hop) => hop.trim()).filter(Boolean);
    if (hops.length < depth) return "unknown";
    return hops[hops.length - depth] ?? "unknown";
  }
  const real = headers.get("x-real-ip");
  return real?.trim() || "unknown";
}
