import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-79 server/config low batch (S79-C + S79-D — the
// twenty-seventh audit's B-L1, B-I2, B-I3, B-L2).
//
// S79-C — the precision/hygiene set: (1) the S78-B transaction-abort
// family pin counted the P2024/P2028 arm per FILE — the elements route
// carries TWO $transaction sites (POST + PUT) each with its own catch,
// so single-site drift was invisible (the F61 enumeration mechanism
// tightened to the site-precise form the s75 parse-surface pin
// established); (2) get-seed-ids.ts printed the resolved DATABASE_URL
// raw — the third sibling of the redaction family (db.ts and
// check-db-contract.ts both route through redactDatabaseUrl); (3)
// tsconfig declared strict: true AND noImplicitAny: false — the
// contradiction silently weakened the explicit typecheck gate
// AGENTS.md documents as the compensating control for
// ignoreBuildErrors (verified live: removing the line keeps tsc green).
//
// S79-D — THE DEFECT (B-L2): zero anti-clickjacking response headers
// anywhere (no headers() key in next.config.ts; proxy.ts only
// redirects legacy paths). sameSite: "lax" does not protect a
// same-origin page framed by an attacker — the framed app sends the
// session cookie on every in-frame request, so a clickjacked
// logged-in victim can be driven into destructive UI (project/team
// delete). THE FIX: the headers() export with X-Frame-Options: DENY,
// X-Content-Type-Options: nosniff, and Referrer-Policy on /:path* (a
// full CSP deliberately NOT chosen — the inline-style surface would
// force style-src 'unsafe-inline', weakening the policy to theater).

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

// The seven transaction-carrying route files (the F61 enumeration — the
// family is the unit, not the member).
const TX_ROUTES = [
  "src/app/api/projects/route.ts",
  "src/app/api/teams/route.ts",
  "src/app/api/projects/[id]/elements/route.ts",
  "src/app/api/projects/[id]/duplicate/route.ts",
  "src/app/api/teams/[id]/members/route.ts",
  // Session 82 (S82-C / B82-L4): the register route's create moved
  // into the count-guarded transaction (the USER_LIMIT ceiling) — the
  // route JOINS the family list (the F61 discipline: the enumeration
  // itself is the pin; the family grows, the intent unchanged — every
  // $transaction site carries its own abort arm).
  "src/app/api/auth/register/route.ts",
];

// ---------------------------------------------------------------------------
// S79-C — the site-precise transaction family pin (B79-L1)
// ---------------------------------------------------------------------------
describe("the transaction-abort family pin at site precision (S79-C / B-L1)", () => {
  it("every $transaction SITE carries its own P2024/P2028 arm (the tightened family pin)", () => {
    // THE PIN TIGHTENING: the s78 pin required arms >= 1 per FILE —
    // the elements file's two sites (POST + PUT) could drift to one
    // arm invisibly. The site-precise form: the arm count must cover
    // the $transaction count in every family file. (Today's code is
    // complete — this pin is the drift mechanism, not a defect fix:
    // GREEN-immediately by design, documented in the plan.)
    for (const rel of TX_ROUTES) {
      const route = src(rel);
      const arms = (route.match(/error\.code === "P2024" \|\| error\.code === "P2028"/g) ?? []).length;
      const sites = (route.match(/\$transaction/g) ?? []).length;
      expect(sites, `${rel} must be in the transaction family`).toBeGreaterThanOrEqual(1);
      expect(arms, `${rel}: every $transaction site needs its own P2024/P2028 arm (found ${arms} arms for ${sites} sites)`).toBeGreaterThanOrEqual(sites);
    }
  });
});

// ---------------------------------------------------------------------------
// S79-C — the redaction fold + the tsconfig strictness fold
// ---------------------------------------------------------------------------
describe("the get-seed-ids redaction fold (S79-C / B-I2)", () => {
  it("the URL print routes through redactDatabaseUrl", () => {
    const script = src("scripts/get-seed-ids.ts");
    // THE DEFECT PIN: pre-fix the raw `console.log("[db] URL ->", url)`
    // — the third sibling bypassing the seam.
    expect(script).toMatch(/redactDatabaseUrl/);
    expect(script).toMatch(/console\.log\("\[db\] URL ->",\s*redactDatabaseUrl\(url\)\)/);
    expect(script).not.toMatch(/console\.log\("\[db\] URL ->",\s*url\)/);
  });
});

describe("the tsconfig strictness fold (S79-C / B-I3)", () => {
  it("strict: true with no noImplicitAny contradiction", () => {
    const tsconfig = src("tsconfig.json");
    // THE DEFECT PIN: pre-fix `"noImplicitAny": false` sat beside
    // `"strict": true` — the most valuable strict member silently off.
    expect(tsconfig).toMatch(/"strict":\s*true/);
    expect(tsconfig).not.toMatch(/noImplicitAny/);
  });
});

// ---------------------------------------------------------------------------
// S79-D — the anti-clickjacking header block (B79-L2)
// ---------------------------------------------------------------------------
describe("the anti-clickjacking response headers (S79-D / B-L2)", () => {
  const config = src("next.config.ts");

  it("the config exports the headers() block", () => {
    // THE DEFECT PIN: pre-fix the whole config carried no headers key.
    expect(config).toMatch(/async headers\(\)/);
  });

  it("X-Frame-Options: DENY is set on every route", () => {
    expect(config).toMatch(/X-Frame-Options/);
    expect(config).toMatch(/DENY/);
  });

  it("X-Content-Type-Options: nosniff is set", () => {
    expect(config).toMatch(/X-Content-Type-Options/);
    expect(config).toMatch(/nosniff/);
  });

  it("Referrer-Policy is set", () => {
    expect(config).toMatch(/Referrer-Policy/);
  });

  it("the header block applies to the catch-all source", () => {
    expect(config).toMatch(/source:\s*"\/:path\*"/);
  });
});
