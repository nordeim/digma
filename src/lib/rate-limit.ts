// Fixed-window per-IP rate limiting for the auth endpoints (the PAD §6
// Security Architecture's rate-limiting row — the S5 control; the
// historical "ADR-009 in the inherited architecture" citation
// re-anchored in session 124, S124-D / B124-I3: the inherited
// template's registry never existed in this repo, and the PAD's own
// ADR-009 is the Untitled editor decision). The pure core keeps the
// window math and eviction
// unit-testable without timers; buckets live in process memory — per-process
// only (single-node deploy), and restarting the server clears them.

export type RateBuckets = Map<string, { count: number; resetAt: number }>;

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

/** Session 76 (S76-G — the twenty-fourth audit's B-M2, the deferred
 * queue's design from session 75): the eviction sweep is AMORTIZED. A
 * per-buckets watermark (the minimum live resetAt, held in a WeakMap
 * side-channel keyed by the buckets instance — checkRate already
 * mutates the passed Map, so the signature stays pure) gates the sweep:
 * calls before the watermark skip it entirely, and an expired entry
 * resets LAZILY at its own key's access. The per-key observable behavior
 * is identical to the always-sweep form; only the memory reclamation of
 * UN-ACCESSED keys is deferred to the watermark crossing — rotated-key
 * growth no longer costs O(n) per call (the O(n²) burst family). */
const sweepWatermarks = new WeakMap<RateBuckets, number>();

/** Pure: does the key fit in the window? Sweeps expired entries at the
 * watermark; an expired key resets lazily at its own access. */
export function checkRate(
  buckets: RateBuckets,
  key: string,
  limit: number,
  windowMs: number,
  now: number,
): RateLimitResult {
  const watermark = sweepWatermarks.get(buckets);
  if (watermark === undefined || now >= watermark) {
    let minReset = Number.POSITIVE_INFINITY;
    for (const [k, v] of buckets) {
      if (v.resetAt <= now) {
        buckets.delete(k);
      } else if (v.resetAt < minReset) {
        minReset = v.resetAt;
      }
    }
    // No live entries: sweep again on the next call (an empty sweep is
    // O(1)); otherwise the watermark holds until the earliest expiry.
    sweepWatermarks.set(buckets, minReset === Number.POSITIVE_INFINITY ? now : minReset);
  }
  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    // A fresh window — the lazy reset: an expired entry resets at its
    // own key's access (identical observable to the evict-then-insert
    // form the always-sweep ran).
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
// burn + held server work — unbounded on the self-hosted posture until
// S114-D, now bounded at 25s by the route's own LLM_REQUEST_TIMEOUT_MS
// race, with `maxDuration` remaining the serverless-only hint the
// standalone server ignores). The bucket is its
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

// Session 112 (S112-B — the sixtieth audit's B-I4, the s111 plan's
// deferred front, the s112 measured design): the scoped `crud:` bucket
// for the FIVE creation routes (projects POST, duplicate POST, teams
// POST, members POST, elements POST). Pre-fix, an authenticated caller
// could drive unbounded row creation — each call is cheap, but the
// absolute ceilings (PROJECT_LIMIT 500 / TEAM_LIMIT 100 /
// MEMBER_LIMIT 100 / ELEMENT_LIMIT 2000) bound only the TOTALS, never
// the RATE (a scripted loop reaches every ceiling in seconds and the
// duplicate route multiplies up to 2000 element rows per call). 60
// creations / 5 min per IP sits far above every legitimate UI flow
// (the Create-dialog/invite/duplicate interactions are human-scale)
// while capping scripted burn. The bucket is its OWN `crud:` prefix,
// NEVER the shared `auth:`/`ai:` keys (the S67-C doctrine — the
// smoke/e2e suites drive these routes from the same localhost IP as
// their auth and assistant calls). THE ELEMENTS PUT IS EXCLUDED BY
// DESIGN: the client's 800ms-debounced autosave rides the PUT (an
// active editing session fires one PUT per quiet edit batch plus an
// exit flush on every navigation — hundreds per session, exactly the
// legitimate traffic a rate cap must never throttle); the PUT's own
// abuse surface is independently bounded by the 32 MB body cap, the
// ELEMENT_LIMIT ceiling, and the 30s transaction timeout. The measured
// suite burn: smoke's in-bucket execution count is single-digit per
// run (the S112-B burn probe rides its own dedicated XFF identity),
// and the e2e suite's is ~31 (the fixture-creating specs plus the
// UI-driven dialog pair — comfortably under 60; the `page.route`
// interception sites in the specs are route MOCKS, never server
// calls).
const CRUD_LIMIT = 60;
const CRUD_WINDOW_MS = 5 * 60 * 1000;

/** Creation-route wrapper: 60 mutations / 5 min per IP. */
export function crudRateLimit(ip: string, now: number = Date.now()): RateLimitResult {
  return checkRate(buckets, `crud:${ip}`, CRUD_LIMIT, CRUD_WINDOW_MS, now);
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
