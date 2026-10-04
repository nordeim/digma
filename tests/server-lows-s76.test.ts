import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { checkRate, type RateBuckets } from "@/lib/rate-limit";
import { readBoundedJson, REQUEST_BODY_LIMIT_BYTES } from "@/lib/validation";

// The session-76 server low batch (S76-F + S76-G — the twenty-fourth
// audit's B-L2, B-L3, B-L4, and the rate-limit amortization the
// deferred queue designed in session 75).
//
// S76-F — THE DEFECTS (the honesty batch): (1) the 32 MB ceiling's
// doc comment claimed a 2000-element image-fill board sits far under
// the cap — the elements route's own arithmetic (2000 x ~722KB =
// ~1.45 GB) says far over; (2) the readBoundedJson content-length
// fast path returned without cancelling the unconsumed request
// stream — the asymmetric twin of the stream-counter path's own
// cancel (a kept-open stream holds the connection and buffers the
// producer's remaining chunks); (3) the elements GET route lacked the
// honest consumer note its POST sibling and the duplicate route
// carry (the family's N−1).
//
// S76-G — THE DEFECT: checkRate swept the whole buckets Map on EVERY
// call — rotated-key growth cost O(n) per call, O(n²) over a burst.
// THE FIX: the watermark form — a per-buckets WeakMap holds the
// minimum live resetAt; the sweep runs only at/after the watermark,
// and an expired entry resets LAZILY at its own key's access (the
// per-key observable behavior identical to the always-sweep form;
// only the memory reclamation of un-accessed keys is deferred).

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the honesty batch — validation comment (S76-F / B-L2)", () => {
  it("the ceiling's doc comment carries the honest arithmetic (the 1.45 GB full-image family)", () => {
    // THE DEFECT PIN: pre-fix the comment claimed the full
    // image-carrying board family sat far UNDER the cap — flatly
    // contradicting the 1.45 GB arithmetic the same sentence cited.
    // (The phrase wraps across comment lines, so the check flattens
    // whitespace before matching.)
    const validation = src("src/lib/validation.ts");
    const idx = validation.indexOf("REQUEST_BODY_LIMIT_BYTES = ");
    const doc = validation.slice(Math.max(0, idx - 600), idx).replace(/[*\s]+/g, " ");
    expect(doc).toMatch(/1\.45 GB/);
    expect(doc).not.toMatch(/2000-element board of image fills sits far under/);
  });
});

describe("the honesty batch — the fast-path stream cancel (S76-F / B-L3)", () => {
  it("an over-cap DECLARED body observes its stream cancelled before the 400 maps", async () => {
    // THE DEFECT PIN: pre-fix the fast path returned without touching
    // the body — the producer's stream stayed open.
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(JSON.stringify({ a: 1 })));
      },
      cancel() {
        cancelled = true;
      },
    });
    const request = new Request("http://localhost/api", {
      method: "POST",
      body: stream,
      headers: { "content-length": String(REQUEST_BODY_LIMIT_BYTES + 1) },
      duplex: "half",
    } as RequestInit);
    const result = await readBoundedJson(request);
    expect(result.tooLarge).toBe(true);
    expect(cancelled).toBe(true);
  });
});

describe("the honesty batch — the elements GET consumer note (S76-F / B-L4)", () => {
  it("the GET docstring carries the honest API-surface note (the S72-D family form)", () => {
    // THE DEFECT PIN: pre-fix only the POST sibling and duplicate
    // carried the note.
    const route = src("src/app/api/projects/[id]/elements/route.ts");
    const head = route.slice(0, route.indexOf("export async function GET"));
    expect(head).toMatch(/GET \/api\/projects\/\[id\]\/elements/);
    expect(head).toMatch(/no first-party client surface/);
  });
});

describe("the rate-limit eviction amortization (S76-G / B-M2 — the deferred queue's design)", () => {
  it("the watermark mechanism exists (the WeakMap side-channel keyed by the buckets instance)", () => {
    // THE DEFECT PIN: pre-fix no watermark — the sweep ran on every
    // call.
    const lib = src("src/lib/rate-limit.ts");
    expect(lib).toMatch(/new WeakMap/);
  });

  it("the sweep is gated: an expired UN-ACCESSED key lingers until the watermark passes", () => {
    // THE DEFECT PIN: pre-fix the sweep evicted the stale key on the
    // very next call (the O(n) per call cost the amortization
    // removes). The observable: with the watermark set by a live
    // entry's resetAt, a manually-planted stale key survives calls
    // made BEFORE that time.
    const buckets: RateBuckets = new Map();
    const W = 1000;
    const t0 = 5000;
    // Seed the watermark: two calls (the first sweeps empty, the
    // second computes the live minimum).
    checkRate(buckets, "A", 10, W, t0);
    checkRate(buckets, "A", 10, W, t0 + 1);
    // A rotated stale key from an earlier window — expired long ago.
    buckets.set("B-stale", { count: 5, resetAt: t0 - 1000 });
    // A call BEFORE the watermark (A's resetAt = t0 + W): no sweep.
    checkRate(buckets, "C", 10, W, t0 + 2);
    expect(buckets.has("B-stale")).toBe(true);
  });

  it("the reclamation still lands: after the watermark passes, the stale key is evicted", () => {
    // PRESERVATION: the amortization defers memory reclamation, it
    // never removes it.
    const buckets: RateBuckets = new Map();
    const W = 1000;
    const t0 = 5000;
    checkRate(buckets, "A", 10, W, t0);
    checkRate(buckets, "A", 10, W, t0 + 1);
    buckets.set("B-stale", { count: 5, resetAt: t0 - 1000 });
    // Advance PAST the watermark (A's resetAt).
    checkRate(buckets, "C", 10, W, t0 + W + 1);
    expect(buckets.has("B-stale")).toBe(false);
    expect(buckets.has("A")).toBe(false);
  });

  it("an expired key resets LAZILY at its own access (the per-key behavior identical to the old form)", () => {
    // PRESERVATION: the observable contract for an ACCESSED key —
    // expiry answers a fresh window with count 1, exactly as the
    // always-sweep form answered.
    const buckets: RateBuckets = new Map();
    const W = 1000;
    const t0 = 5000;
    // limit 1: the first call consumes the budget.
    expect(checkRate(buckets, "K", 1, W, t0).allowed).toBe(true);
    expect(checkRate(buckets, "K", 1, W, t0 + 5).allowed).toBe(false);
    // Expire the entry out from under the watermark (the rotated-key
    // shape: resetAt long past, watermark still ahead).
    const entry = buckets.get("K");
    if (entry) entry.resetAt = t0;
    // The next access answers a FRESH window, not the throttled one.
    const result = checkRate(buckets, "K", 1, W, t0 + 6);
    expect(result.allowed).toBe(true);
    expect(buckets.get("K")?.count).toBe(1);
  });
});
