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

describe("every request.json() parse site carries the body-size guard (S68-A / M-A)", () => {
  for (const route of GUARDED_ROUTES) {
    it(`${route.file} checks bodySizeRejected BEFORE the ${route.handler} parse`, () => {
      // THE DEFECT PIN: pre-fix the route parses first — Node buffers
      // the whole payload before any per-field cap answers.
      const source = src(route.file);
      expect(source).toMatch(/bodySizeRejected/);
      const parts = source.split(`export async function ${route.handler}`);
      expect(parts.length).toBeGreaterThan(1);
      const body = parts[1] ?? "";
      const firstParse = body.indexOf("await request.json()");
      const firstCheck = body.indexOf("bodySizeRejected(");
      expect(firstCheck).toBeGreaterThan(-1);
      expect(firstParse).toBeGreaterThan(firstCheck);
    });

    it(`${route.file} answers the VALIDATION envelope with the generic 32 MB message`, () => {
      const source = src(route.file);
      expect(source).toMatch(/Request body too large \(max 32 MB\)/);
      expect(source).toMatch(/fail\("VALIDATION"/);
    });
  }

  it("the guard sits AFTER the rate-limit gate on the auth family (no parse work burns a slot)", () => {
    // The S67-C ordering discipline: the rate limiter runs before any
    // body work. The guard must not jump ahead of it.
    for (const route of GUARDED_ROUTES.filter((r) => r.auth === "ratelimited")) {
      const source = src(route.file);
      const parts = source.split("export async function POST");
      const body = parts[1] ?? "";
      const limitCall = body.search(/RateLimit\(/);
      const guard = body.indexOf("bodySizeRejected(");
      expect(limitCall).toBeGreaterThan(-1);
      expect(guard).toBeGreaterThan(limitCall);
    }
  });

  it("the two element routes keep their pinned S67-B forms unchanged (preservation)", () => {
    // The session-67 message and ordering are PINNED artifacts — the
    // family's completion must not rewrite them.
    const elementsRoute = src("src/app/api/projects/[id]/elements/route.ts");
    expect(elementsRoute).toMatch(/Elements payload too large \(max 32 MB\)/);
    const puts = elementsRoute.split("export async function PUT");
    const putBody = puts[1] ?? "";
    expect(putBody.indexOf("await request.json()")).toBeGreaterThan(
      putBody.indexOf("bodySizeRejected("),
    );
    const posts = elementsRoute.split("export async function POST");
    const postBody = posts[1] ?? "";
    expect(postBody.indexOf("await request.json()")).toBeGreaterThan(
      postBody.indexOf("bodySizeRejected("),
    );
  });

  it("no request.json() parse site anywhere in the API lacks the guard (the family is closed)", () => {
    // The complete sweep: every route file that parses a body must
    // carry the guard — the honest closure check (a future route
    // added without the guard fails here).
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
      if (!source.includes("await request.json()")) continue; // GET-only routes
      expect(source, `${file} parses a body but carries no guard`).toMatch(/bodySizeRejected/);
    }
  });
});
