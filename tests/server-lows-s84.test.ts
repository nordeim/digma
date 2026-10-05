import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { memberDisplayFor } from "../src/lib/team";

// The session-84 server low batch (S84-A + S84-C + S84-D(b) — the
// thirty-second audit's B84-L1, B84-L2, B84-I2).
//
// S84-A — THE DEFECT (B84-L1): the e2e auth-call budget sat at 10 of
// 10 — zero headroom — while four claim sites documented "9 of 10".
// The RA-59 forgot round-trip (auth.spec.ts:228-251) fires a real
// POST /api/auth/forgot-password — a rate-limited route — inside the
// default context (no X-Forwarded-For bucket), and the budget comment
// at :158-163 enumerated only 9 calls, missing it. The limiter admits
// exactly 10 per window, so the suite passed AT the ceiling: the next
// auth call added anywhere in a default-context spec trips 429
// mid-suite. The F68/F70 count family's recurrence — inside the
// BUDGET's own arithmetic.
//
// THE FIX: the RA-59 test moves into its own describe with its own
// X-Forwarded-For bucket (the session-45/46 siblings' form) — the
// shared bucket honestly returns to 9 of 10 with real headroom.
//
// S84-C — THE DEFECT (B84-L2, REVISED EN-ROUTE — the F71 runtime
// discovery): the S83-C hermetic env delete-list covered the app's
// seven documented env reads but leaked the standalone RUNTIME's own
// knobs (.next/standalone/server.js:9 binds process.env.HOSTNAME —
// Docker exports it as the container id; a resolvable value binds a
// non-loopback address so the webServer's localhost:3100 health URL
// never answers). The FIRST fix attempt (delete hermetic.HOSTNAME in
// the env object) was falsified by the session's own runtime witness:
// Playwright MERGES the webServer env object OVER process.env, so
// deleted keys simply re-inherit the parent's value — the S83-C
// deletes never worked at runtime either (the source-only pins hid
// it). THE EFFECTIVE FIX: the command-level `env -u` prefix strips
// all six knobs at the spawn — the form that reaches the child.
//
// S84-D(b) — THE DEFECT (B84-I2): the register route's DERIVED name
// bypassed the 80-char cap (register/route.ts:95 stored
// `name || email.split("@")[0] || "Designer"` uncapped — an email
// with a ~190-char local part passes the 200-char email cap and
// stores a ~190-char User.name), and the same family lived in the
// member-creation fallbacks (teams/route.ts:94 and
// teams/[id]/members/route.ts:58 — both consume the uncapped
// memberDisplayFor). S62-G's own rationale ("every stored string in
// the app was already capped") missed the derivation paths.
//
// THE FIX: memberDisplayFor caps its output at 80 (the shared pure
// seam covers both member sites) and the register derivation caps
// inline.

const playwrightSource = readFileSync(
  path.resolve(import.meta.dirname, "../playwright.config.ts"),
  "utf8",
);

const authSpecSource = readFileSync(
  path.resolve(import.meta.dirname, "e2e/auth.spec.ts"),
  "utf8",
);

const registerSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/register/route.ts"),
  "utf8",
);

// ---------------------------------------------------------------------------
// S84-A — the e2e auth-budget repair (B84-L1)
// ---------------------------------------------------------------------------

describe("the RA-59 forgot round-trip lives under its own rate-limit bucket (S84-A / B84-L1)", () => {
  it("SOURCE — the RA-59 describe declares its own X-Forwarded-For header (the siblings' form)", () => {
    // THE DEFECT PIN: pre-fix the RA-59 test sits inside the default
    // context — its forgot-password POST burns the SHARED bucket's
    // 10th call at zero headroom.
    expect(authSpecSource).toMatch(
      /test\.describe\([^)]*forgot[^)]*RA-59[^)]*\)[\s\S]{0,400}test\.use\(\{ extraHTTPHeaders: \{ "X-Forwarded-For": "198\.51\.100\.84" \} \}\);/,
    );
  });

  it("SOURCE — the budget comment names the RA-59 carve-out (the honest enumeration)", () => {
    // THE DEFECT PIN: pre-fix the comment enumerates 9 calls and
    // misses the RA-59 forgot POST — the miscount this session repairs.
    expect(authSpecSource).toMatch(
      /session 84's RA-59 forgot round-trip\s*\/\/\s*declares its own/,
    );
    expect(authSpecSource).toMatch(/9 of 10/);
  });

  it("SURVIVAL — the sibling XFF buckets keep their forms (the session-45/46 carve-outs unchanged)", () => {
    expect(authSpecSource).toMatch(/"X-Forwarded-For": "198\.51\.100\.45"/);
    expect(authSpecSource).toMatch(/"X-Forwarded-For": "198\.51\.100\.58"/);
  });
});

// ---------------------------------------------------------------------------
// S84-C — the hermetic env covers the standalone runtime's reads (B84-L2)
// ---------------------------------------------------------------------------

describe("the hermetic webServer command strips the standalone runtime's own knobs (S84-C / B84-L2 — the env -u form)", () => {
  it("SOURCE — the command's env -u list includes HOSTNAME (the Docker-exported bind address)", () => {
    // THE DEFECT PIN: pre-fix the S83-C delete-list covered only the
    // app's knobs — and the deletes themselves were INEFFECTIVE
    // (Playwright merges the env object OVER process.env; a deleted
    // key re-inherits the parent value — the F71 runtime discovery).
    // .next/standalone/server.js:9 binds process.env.HOSTNAME; the
    // command-level env -u form is the removal that reaches the child.
    expect(playwrightSource).toMatch(/env -u [^']* -u HOSTNAME -u KEEP_ALIVE_TIMEOUT bun/);
  });

  it("SOURCE — the env -u list also strips the four app knobs (the S83-C family, effective now)", () => {
    expect(playwrightSource).toMatch(/env -u DIGMA_PROXY_HOPS -u DIGMA_DISABLE_IN_APP_RESET/);
    expect(playwrightSource).toMatch(/-u DIGMA_DISABLE_IN_APP_OTP -u DIGMA_REPO_ROOT/);
  });

  it("SOURCE — the ineffective env-object deletes are gone (the merge-semantics honesty)", () => {
    // A delete in the webServer env object is a NO-OP under Playwright's
    // merge semantics — its presence would be misleading theater.
    expect(playwrightSource).not.toMatch(/delete hermetic\./);
  });

  it("SURVIVAL — the five pinned overrides are unchanged (the standing hermeticity contract)", () => {
    expect(playwrightSource).toMatch(/DATABASE_URL: E2E_DATABASE_URL/);
    expect(playwrightSource).toMatch(/AUTH_SECRET: "playwright-e2e-session-secret"/);
    expect(playwrightSource).toMatch(/DIGMA_DISABLE_AI_LLM: "1"/);
  });
});

// ---------------------------------------------------------------------------
// S84-D(b) — the derived-name family caps at 80 (B84-I2)
// ---------------------------------------------------------------------------

describe("the derived display names respect the 80-char cap (S84-D / B84-I2)", () => {
  it("BEHAVIORAL — memberDisplayFor caps a long email local part at 80 (the stored-name bound)", () => {
    // THE DEFECT PIN: pre-fix a ~190-char local part derives a
    // ~190-char display name — stored uncapped by the member routes.
    const longLocal = "a".repeat(190);
    expect(memberDisplayFor(`${longLocal}@example.com`).length).toBeLessThanOrEqual(80);
    // The derivation title-cases the first character (the standing
    // contract), so the capped form is "A" + 79 lowercase.
    expect(memberDisplayFor(`${longLocal}@example.com`)).toBe("A" + "a".repeat(79));
  });

  it("BEHAVIORAL — the memberDisplayFor survivors are unchanged (the standing derivation contract)", () => {
    expect(memberDisplayFor("jane.doe@example.com")).toBe("Jane Doe");
    expect(memberDisplayFor("alex-ui@example.com")).toBe("Alex Ui");
    expect(memberDisplayFor("sarah_ui@example.com")).toBe("Sarah Ui");
    expect(memberDisplayFor("@example.com")).toBe("Member");
  });

  it("SOURCE — the register route caps its derived name at 80 (the email local-part fallback)", () => {
    // THE DEFECT PIN: pre-fix the create reads
    // `name: name || email.split("@")[0] || "Designer"` — uncapped.
    expect(registerSource).toMatch(
      /name: \(name \|\| email\.split\("@"\)\[0\] \|\| "Designer"\)\.slice\(0, 80\)/,
    );
  });

  it("SURVIVAL — the register validation keeps the explicit-name cap and the hash-before-tx form (the S62-G/S83-D seams)", () => {
    expect(registerSource).toMatch(/name\.length > 80 \|\| email\.length > 200/);
    const hashIdx = registerSource.indexOf("const passwordHash = hashPassword(");
    const txIdx = registerSource.indexOf("db.$transaction(");
    expect(hashIdx).toBeGreaterThan(-1);
    expect(txIdx).toBeGreaterThan(-1);
    expect(hashIdx).toBeLessThan(txIdx);
  });
});
