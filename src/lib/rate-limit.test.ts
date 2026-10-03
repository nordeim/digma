import { describe, expect, it } from "vitest";
import { checkRate, clientIpOf, type RateBuckets } from "@/lib/rate-limit";

// The fixed-window limiter (ADR-009 in the inherited architecture): pure
// core, opportunistic eviction, retry-after math.

describe("checkRate", () => {
  it("allows the first request and starts a window", () => {
    const buckets: RateBuckets = new Map();
    const result = checkRate(buckets, "auth:1.2.3.4", 10, 1000, 1000);
    expect(result.allowed).toBe(true);
    expect(result.retryAfterSeconds).toBe(0);
    expect(buckets.get("auth:1.2.3.4")?.count).toBe(1);
  });

  it("counts up to the limit and then throttles", () => {
    const buckets: RateBuckets = new Map();
    for (let i = 0; i < 10; i++) {
      expect(checkRate(buckets, "ip", 10, 1000, 2000).allowed).toBe(true);
    }
    const blocked = checkRate(buckets, "ip", 10, 1000, 2500);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(1); // window resets at 3000
  });

  it("evicts expired buckets opportunistically", () => {
    const buckets: RateBuckets = new Map();
    buckets.set("old", { count: 10, resetAt: 999 });
    const result = checkRate(buckets, "new", 2, 1000, 1000);
    expect(result.allowed).toBe(true);
    expect(buckets.has("old")).toBe(false);
  });

  it("tracks keys independently", () => {
    const buckets: RateBuckets = new Map();
    checkRate(buckets, "a", 1, 1000, 1000);
    expect(checkRate(buckets, "a", 1, 1000, 1100).allowed).toBe(false);
    expect(checkRate(buckets, "b", 1, 1000, 1100).allowed).toBe(true);
  });

  it("reopens a fresh window after the old one expires", () => {
    const buckets: RateBuckets = new Map();
    checkRate(buckets, "ip", 1, 1000, 1000);
    expect(checkRate(buckets, "ip", 1, 1000, 1500).allowed).toBe(false);
    // After resetAt (2000) the entry is evicted and counting starts over.
    expect(checkRate(buckets, "ip", 1, 1000, 2001).allowed).toBe(true);
  });
});

describe("clientIpOf", () => {
  // Session 62 (S62-D / B-M1 — a legitimate contract change): the
  // limiter keys on the LAST x-forwarded-for hop — the proxy-APPENDED
  // real IP. The pre-fix first-hop behavior trusted a client-suppliable
  // value (a spoofing client prepends a fake IP; the proxy appends the
  // real one after it), making the auth brute-force defense evadable by
  // rotating the header. A single-value header (the e2e/smoke suites'
  // dedicated-bucket form) is both first and last — unaffected.
  it("keys on the last x-forwarded-for hop (the proxy-appended real IP)", () => {
    const headers = new Headers({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" });
    expect(clientIpOf(headers)).toBe("2.2.2.2");
  });

  it("a single-value header is unaffected (first and last coincide)", () => {
    expect(clientIpOf(new Headers({ "x-forwarded-for": "9.9.9.9" }))).toBe("9.9.9.9");
  });

  it("falls back to x-real-ip, then unknown", () => {
    expect(clientIpOf(new Headers({ "x-real-ip": "3.3.3.3" }))).toBe("3.3.3.3");
    expect(clientIpOf(new Headers())).toBe("unknown");
  });
});
