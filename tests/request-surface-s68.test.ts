import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-68 parse-guard family completion (S68-A — the sixteenth
// audit's M-A, "the M-4 family is only half-closed").
//
// THE DEFECT: session 67 (S67-B / M-4) landed the pure
// `bodySizeRejected` content-length cap BEFORE `request.json()` at the
// TWO element routes — but `request.json()` parses at FOURTEEN sites
// across the API. Twelve routes still buffer an unbounded body into
// memory before their per-field caps reject, SIX of them
// unauthenticated (login/register/verify-otp/resend-otp/
// forgot-password/reset-password): App Router handlers ship no default
// body-size cap, so a credential-less attacker pushes a multi-GB body
// to /api/auth/login and Node buffers it before the 200-char cap
// answers 400.
//
// THE FIX: the same 3-line guard at every parse site, answering the
// VALIDATION 400 envelope ("Request body too large (max 32 MB)") —
// the elements routes keep their own pinned S67-B message; the
// ordering discipline keeps the guard AFTER the rate-limit/session
// gates (no parse work burns a slot) and BEFORE the parse.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

// The twelve routes that gained the guard (the two element routes are
// the S67-B preservation family below). Keyed by the route file.
const GUARDED_ROUTES: Array<{ file: string; handler: string; auth: "public" | "gated" | "ratelimited" }> = [
  { file: "src/app/api/auth/login/route.ts", handler: "POST", auth: "ratelimited" },
  { file: "src/app/api/auth/register/route.ts", handler: "POST", auth: "ratelimited" },
  { file: "src/app/api/auth/verify-otp/route.ts", handler: "POST", auth: "ratelimited" },
  { file: "src/app/api/auth/resend-otp/route.ts", handler: "POST", auth: "ratelimited" },
  { file: "src/app/api/auth/forgot-password/route.ts", handler: "POST", auth: "ratelimited" },
  { file: "src/app/api/auth/reset-password/route.ts", handler: "POST", auth: "ratelimited" },
  { file: "src/app/api/projects/route.ts", handler: "POST", auth: "gated" },
  { file: "src/app/api/projects/[id]/route.ts", handler: "PATCH", auth: "gated" },
  { file: "src/app/api/teams/route.ts", handler: "POST", auth: "gated" },
  { file: "src/app/api/teams/[id]/route.ts", handler: "PATCH", auth: "gated" },
  { file: "src/app/api/teams/[id]/members/route.ts", handler: "POST", auth: "gated" },
  { file: "src/app/api/ai-assistant/route.ts", handler: "POST", auth: "gated" },
];

describe("every body-parse site consumes the bounded seam (S68-A / M-A, re-anchored S75-B)", () => {
  // Session 75 (S75-B / B75-F1 — the chunked-parse bound) RE-ANCHORED
  // this spec's pins: the guard+parse pair (a content-length-only
  // bodySizeRejected check before an unbounded request.json()) folded
  // INTO the readBoundedJson seam — the content-length fast path plus
  // the stream counter that bounds the chunked-transfer family the
  // header check could never see. The per-site contract evolves from
  // "guard before parse" to "the seam IS the parse"; the behavioral
  // seam pins live in tests/request-surface-s75.test.ts.
  for (const route of GUARDED_ROUTES) {
    it(`${route.file} parses through readBoundedJson (the ${route.handler} seam consumption)`, () => {
      // THE EVOLVED PIN: the handler consumes the seam — no bare
      // request.json() remains behind it.
      const source = src(route.file);
      expect(source).toMatch(/readBoundedJson/);
      const parts = source.split(`export async function ${route.handler}`);
      expect(parts.length).toBeGreaterThan(1);
      const body = parts.slice(1).join(`export async function ${route.handler}`);
      expect(body).toMatch(/readBoundedJson\(request\)/);
      // The bare parse is gone from the handler — the seam is the ONLY
      // body read (the S75-B evolved contract).
      expect(body).not.toMatch(/await request\.json\(\)/);
    });

    it(`${route.file} answers the VALIDATION envelope with the generic 32 MB message`, () => {
      const source = src(route.file);
      expect(source).toMatch(/Request body too large \(max 32 MB\)/);
      expect(source).toMatch(/fail\("VALIDATION"/);
    });
  }

  it("the seam sits AFTER the rate-limit gate on the auth family (no parse work burns a slot)", () => {
    // The S67-C ordering discipline: the rate limiter runs before any
    // body work. The seam must not jump ahead of it.
    for (const route of GUARDED_ROUTES.filter((r) => r.auth === "ratelimited")) {
      const source = src(route.file);
      const parts = source.split("export async function POST");
      const body = parts[1] ?? "";
      const limitCall = body.search(/RateLimit\(/);
      const seam = body.indexOf("readBoundedJson(");
      expect(limitCall).toBeGreaterThan(-1);
      expect(seam).toBeGreaterThan(limitCall);
    }
  });

  it("the two element routes keep their pinned S67-B messages (preservation, re-anchored S75-B)", () => {
    // The session-67 MESSAGE is a PINNED artifact — the family's
    // completion must not rewrite it. The seam consumption replaces
    // the old ordering form (the guard lives inside readBoundedJson).
    const elementsRoute = src("src/app/api/projects/[id]/elements/route.ts");
    expect(elementsRoute).toMatch(/Elements payload too large \(max 32 MB\)/);
    const puts = elementsRoute.split("export async function PUT");
    const putBody = puts[1] ?? "";
    expect(putBody).toMatch(/readBoundedJson\(request\)/);
    const posts = elementsRoute.split("export async function POST");
    const postBody = posts[1] ?? "";
    expect(postBody).toMatch(/readBoundedJson\(request\)/);
  });

  it("no request.json() parse site anywhere in the API bypasses the seam (the family stays closed)", () => {
    // The complete sweep, evolved with S75-B: a bare request.json()
    // (no seam) fails here — the honest closure check for any FUTURE
    // route added without the bound.
    const files = [
      "src/app/api/ai-assistant/route.ts",
      "src/app/api/auth/forgot-password/route.ts",
      "src/app/api/auth/login/route.ts",
      "src/app/api/auth/register/route.ts",
      "src/app/api/auth/resend-otp/route.ts",
      "src/app/api/auth/reset-password/route.ts",
      "src/app/api/auth/verify-otp/route.ts",
      "src/app/api/projects/route.ts",
      "src/app/api/projects/[id]/route.ts",
      "src/app/api/projects/[id]/duplicate/route.ts",
      "src/app/api/projects/[id]/elements/route.ts",
      "src/app/api/stats/route.ts",
      "src/app/api/health/route.ts",
      "src/app/api/teams/route.ts",
      "src/app/api/teams/[id]/route.ts",
      "src/app/api/teams/[id]/members/route.ts",
    ];
    for (const file of files) {
      const source = src(file);
      if (!source.includes("await request.json()")) continue; // seam-only or GET routes
      expect(source, `${file} parses a body but bypasses the seam`).toMatch(/readBoundedJson/);
    }
  });
});
