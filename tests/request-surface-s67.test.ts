import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-67 request-surface hardening batch (S67-B — the
// fifteenth audit's M-4 + L-1).
//
// THE DEFECTS: (M-4, NEW) the elements PUT/POST parse `request.json()`
// into memory BEFORE any validation — the per-field caps bound each
// field (fillImage ≤ 700,000 chars) and the count (≤ 2000), but the
// PRODUCT (2000 × ~722 KB ≈ 1.45 GB) is unbounded: App Router handlers
// have no default body-size cap, so an authenticated caller OOMs a
// small self-hosted box and holds the SQLite write lock inside the
// interactive transaction. (L-1, NEW) the projects/teams/members
// creation routes have no ceiling at all — an authenticated loop
// inserts unbounded rows (each duplicate copies up to 2000 element
// rows per call).
//
// THE FIX: a pure `bodySizeRejected(contentLength)` seam +
// `REQUEST_BODY_LIMIT_BYTES` (32 MB) checked BEFORE the parse at both
// element routes, and PROJECT_LIMIT/TEAM_LIMIT/MEMBER_LIMIT ceilings
// on the four creation routes — the ELEMENT_LIMIT style reaching the
// surfaces it missed.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

// ---------------------------------------------------------------------------
// bodySizeRejected — the behavioral pins (the pure seam executes)
// ---------------------------------------------------------------------------
import { bodySizeRejected, REQUEST_BODY_LIMIT_BYTES } from "../src/lib/validation";

describe("bodySizeRejected — the aggregate body cap (S67-B / M-4)", () => {
  it("a content-length over the limit is rejected", () => {
    expect(bodySizeRejected(String(REQUEST_BODY_LIMIT_BYTES + 1))).toBe(true);
    expect(bodySizeRejected(String(REQUEST_BODY_LIMIT_BYTES * 40))).toBe(true); // the 1.45 GB family
  });

  it("a content-length at or under the limit passes", () => {
    expect(bodySizeRejected(String(REQUEST_BODY_LIMIT_BYTES))).toBe(false);
    expect(bodySizeRejected("0")).toBe(false);
    expect(bodySizeRejected("1024")).toBe(false);
  });

  it("an absent or non-numeric content-length passes (chunked bodies — the per-field caps still bound those)", () => {
    expect(bodySizeRejected(null)).toBe(false);
    expect(bodySizeRejected("")).toBe(false);
    expect(bodySizeRejected("not-a-number")).toBe(false);
  });

  it("the limit is 32 MB (the documented self-hosted ceiling)", () => {
    expect(REQUEST_BODY_LIMIT_BYTES).toBe(32_000_000);
  });
});

// ---------------------------------------------------------------------------
// The elements routes — the cap ordering (the source contracts)
// ---------------------------------------------------------------------------
describe("the element routes check the body size BEFORE parsing (S67-B / M-4)", () => {
  const elementsRoute = src("src/app/api/projects/[id]/elements/route.ts");

  it("the PUT rejects an oversized body with the VALIDATION envelope before request.json()", () => {
    // THE DEFECT PIN: pre-fix the route parses first — the only bound
    // is the post-parse element-count check. (The call form
    // `await request.json()` discriminates the CALL from comment text.)
    expect(elementsRoute).toMatch(/bodySizeRejected/);
    const puts = elementsRoute.split(/export async function PUT/);
    expect(puts.length).toBeGreaterThan(1);
    const putBody = puts[1] ?? "";
    const firstParse = putBody.indexOf("await request.json()");
    const firstCheck = putBody.indexOf("bodySizeRejected(");
    expect(firstCheck).toBeGreaterThan(-1);
    expect(firstParse).toBeGreaterThan(firstCheck);
    expect(putBody).toMatch(/Elements payload too large/);
    expect(putBody).toMatch(/fail\("VALIDATION"/);
  });

  it("the single-element POST carries the same guard (preservation of the family's symmetry)", () => {
    // The S60-D discipline: the POST enforces the SAME ceilings the
    // PUT carries. The body guard belongs to that family.
    const posts = elementsRoute.split(/export async function POST/);
    expect(posts.length).toBeGreaterThan(1);
    const postBody = posts[1] ?? "";
    expect(postBody).toMatch(/bodySizeRejected/);
    const firstParse = postBody.indexOf("await request.json()");
    const firstCheck = postBody.indexOf("bodySizeRejected(");
    expect(firstParse).toBeGreaterThan(firstCheck);
  });
});

// ---------------------------------------------------------------------------
// The creation ceilings (L-1)
// ---------------------------------------------------------------------------
describe("the creation ceilings (S67-B / L-1)", () => {
  it("validation.ts single-sources the three limits", () => {
    const source = src("src/lib/validation.ts");
    expect(source).toMatch(/export const PROJECT_LIMIT = 500/);
    expect(source).toMatch(/export const TEAM_LIMIT = 100/);
    expect(source).toMatch(/export const MEMBER_LIMIT = 100/);
  });

  it("the projects POST rejects past PROJECT_LIMIT with the VALIDATION envelope", () => {
    // THE DEFECT PIN: pre-fix the route validates the name and inserts
    // — no count bound anywhere.
    const source = src("src/app/api/projects/route.ts");
    expect(source).toMatch(/PROJECT_LIMIT/);
    expect(source).toMatch(/Too many projects \(max 500\)/);
    expect(source).toMatch(/fail\("VALIDATION"/);
  });

  it("the duplicate route honors the same project ceiling before the copy", () => {
    const source = src("src/app/api/projects/[id]/duplicate/route.ts");
    expect(source).toMatch(/PROJECT_LIMIT/);
    expect(source).toMatch(/Too many projects \(max 500\)/);
  });

  it("the teams POST rejects past TEAM_LIMIT", () => {
    const source = src("src/app/api/teams/route.ts");
    expect(source).toMatch(/TEAM_LIMIT/);
    expect(source).toMatch(/Too many teams \(max 100\)/);
  });

  it("the members POST rejects past MEMBER_LIMIT", () => {
    const source = src("src/app/api/teams/[id]/members/route.ts");
    expect(source).toMatch(/MEMBER_LIMIT/);
    expect(source).toMatch(/Too many members \(max 100\)/);
  });

  it("ELEMENT_LIMIT's single-sourcing survives untouched (preservation)", () => {
    const source = src("src/lib/editor.ts");
    expect(source).toMatch(/export const ELEMENT_LIMIT = 2000/);
  });
});
