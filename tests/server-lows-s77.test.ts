import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-77 server low batch (S77-F + S77-G — the twenty-fifth
// audit's B-L1, B-L2, B77-I1, A-I2, B-I2).
//
// S77-F — THE DEFECT (B-L1): the AI route's targetIds/lockedTargetIds
// filters were count-capped (.slice(0, 100)) but not length-capped —
// each string could run to ~320 KB under the 32 MB body cap, and both
// arrays were JSON.stringify-interpolated into the LLM system prompt
// (the sibling fields were bounded: message at 1000, elementSummary
// sanitized to 500). A scripted authenticated caller could pad the
// system prompt with megabytes of id-shaped prose.
//
// THE FIX: the per-string clamp at the filter — i.length <= 64 (real
// element ids are cuid-length ~25; a longer string is padding).
//
// S77-G (the Set form, A-I2): reorderElements' membership scans ran
// includes() (the O(n*k) form) — the S74-B Set family's one leftover;
// once per drag-drop, but the family form is the Set.
//
// S77-G (the P2024/P2028 arms, B-I2): the elements PUT's replace
// transaction and the duplicate route's copy transaction could abort
// with Prisma's transaction-timeout (P2028) or pool-wait (P2024)
// families — both escaped as unstructured 500s outside the { ok, data }
// envelope the route's own comments enforce. The S73-C 30s raise
// mitigated the likelihood; the honesty loop closes with the catch arm
// answering the structured 503 UNAVAILABLE envelope.
//
// S77-G (the shared-buckets pin, B77-I1 — DELIVERED): the session-76
// plan promised a behavioral pin for the shared-buckets semantics (the
// auth + ai families coexisting on one Map) and shipped only the
// watermark pins. This delivers the promise: driving both wrappers
// against the module-level shared Map, each family's budget stays
// independent.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

// ---------------------------------------------------------------------------
// S77-F — the per-string id clamp on the AI route
// ---------------------------------------------------------------------------
describe("the AI route's per-string id clamp (S77-F / B-L1)", () => {
  const route = src("src/app/api/ai-assistant/route.ts");

  it("the targetIds filter bounds each string's length (the count cap alone left the system prompt pad-able)", () => {
    // THE DEFECT PIN: pre-fix the filter only checked typeof — a
    // 320 KB "id" sailed into the system role beside the bounded
    // message/elementSummary siblings.
    const m = route.match(
      /\(body\.targetIds as unknown\[\]\)\.filter\(\(i\): i is string => ([^)]+)\)/,
    );
    expect(m).not.toBeNull();
    expect(m?.[1]).toMatch(/typeof i === "string"/);
    expect(m?.[1]).toMatch(/i\.length <= 64/);
  });

  it("the lockedTargetIds twin carries the same per-string bound", () => {
    // THE DEFECT PIN: the twin filter's identical gap.
    const m = route.match(
      /\(body\.lockedTargetIds as unknown\[\]\)\.filter\(\(i\): i is string => ([^)]+)\)/,
    );
    expect(m).not.toBeNull();
    expect(m?.[1]).toMatch(/typeof i === "string"/);
    expect(m?.[1]).toMatch(/i\.length <= 64/);
  });

  it("the count caps and the sibling field bounds are preserved", () => {
    // PRESERVATION: the .slice(0, 100) count caps stay; message keeps
    // its 1000-char slice; the summary keeps the sanitizer.
    expect(route).toMatch(/\.slice\(0, 100\)/);
    expect(route).toMatch(/body\.message\.trim\(\)\.slice\(0, 1000\)/);
    expect(route).toMatch(/sanitizeElementSummary\(/);
  });
});

// ---------------------------------------------------------------------------
// S77-G — the reorderElements Set membership
// ---------------------------------------------------------------------------
describe("the reorderElements Set membership (S77-G / A-I2)", () => {
  const store = src("src/components/editor/editor-store.ts");

  it("the membership scans consume a Set (the S74-B family's last member)", () => {
    // THE DEFECT PIN: pre-fix both scans ran fromIds.includes(el.id)
    // — the O(n*k) form the canvas/panels retired in S73-H/S74-B.
    // (The [\s\S]*? window rides over the fix's explanatory comment —
    // the wrapped-form discipline, F58.)
    const m = store.match(
      /reorderElements: \(fromIds, toIndex\) =>\s*set\(\(state\) => \{[\s\S]*?const fromIdSet = new Set\(fromIds\);\s*const moving = state\.elements\.filter\(\(el\) => fromIdSet\.has\(el\.id\)\);\s*const rest = state\.elements\.filter\(\(el\) => !fromIdSet\.has\(el\.id\)\);/,
    );
    expect(m).not.toBeNull();
    expect(store).not.toMatch(/fromIds\.includes\(el\.id\)/);
  });
});

// ---------------------------------------------------------------------------
// S77-G — the P2024/P2028 envelope arms
// ---------------------------------------------------------------------------
describe("the transaction-abort family answers the envelope (S77-G / B-I2)", () => {
  const elementsRoute = src("src/app/api/projects/[id]/elements/route.ts");
  const duplicateRoute = src("src/app/api/projects/[id]/duplicate/route.ts");

  it("the elements PUT catches the P2024/P2028 family and answers the structured 503", () => {
    // THE DEFECT PIN: pre-fix the catch knew only P2025/P2003 — the
    // transaction-abort family rethrowed as an unstructured 500 (the
    // route's own S73-C comment claimed the escape honestly).
    const m = elementsRoute.match(
      /error\.code === "P2025" \|\| error\.code === "P2003"/,
    );
    expect(m).not.toBeNull();
    expect(elementsRoute).toMatch(/P2024/);
    expect(elementsRoute).toMatch(/P2028/);
    expect(elementsRoute).toMatch(/fail\("UNAVAILABLE", "[^"]+", 503\)/);
  });

  it("the duplicate route's copy transaction gains the same arm (it had NO catch)", () => {
    // THE DEFECT PIN: pre-fix the duplicate transaction aborted
    // straight through — a bare 500 outside every envelope.
    expect(duplicateRoute).toMatch(/P2024/);
    expect(duplicateRoute).toMatch(/P2028/);
    expect(duplicateRoute).toMatch(/fail\("UNAVAILABLE", "[^"]+", 503\)/);
  });

  it("the P2025/P2003 NOT_FOUND arms are preserved on the elements route", () => {
    // PRESERVATION: the vanished-row family keeps its 404.
    const m = elementsRoute.match(/return fail\("NOT_FOUND", "Project not found", 404\);/);
    expect(m).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// S77-G — the shared-buckets behavioral pin (the s76 plan's delivered promise)
// ---------------------------------------------------------------------------
describe("the shared-buckets semantics (S77-G / B77-I1 — the s76 promise delivered)", () => {
  it("the auth and ai families coexist on the shared Map without consuming each other's budgets", async () => {
    // DELIVERY (not a defect pin): the session-76 plan promised this
    // behavioral check and shipped only the watermark pins. The
    // behavior already holds — this pin delivers the promise.
    const mod = await import("../src/lib/rate-limit");
    const t0 = 2_000_000_000_000; // a fixed clock far from Date.now()
    const ip = "203.0.113.77"; // the s77 probe IP (dedicated bucket)

    // Drive the auth family to exhaustion (10/15min)...
    let auth = { allowed: true, retryAfterSeconds: 0 };
    for (let i = 0; i < 12; i++) {
      auth = mod.authRateLimit(ip, t0 + i);
    }
    expect(auth.allowed).toBe(false);

    // ...and the ai family on the SAME Map is untouched (its own
    // 20/5min budget on its own ai:-prefixed key):
    let ai = mod.aiRateLimit(ip, t0 + 100);
    expect(ai.allowed).toBe(true);

    // Drive the ai family to ITS exhaustion...
    for (let i = 0; i < 25; i++) {
      ai = mod.aiRateLimit(ip, t0 + 200 + i);
    }
    expect(ai.allowed).toBe(false);

    // ...and the auth family stays exhausted (no cross-consumption):
    expect(mod.authRateLimit(ip, t0 + 300).allowed).toBe(false);
  });
});
