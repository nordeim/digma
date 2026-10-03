import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-67 revocation family (S67-A — the fifteenth audit's M-1,
// the documented B-5 deferred since session 66).
//
// THE DEFECT: the session token is stateless `userId.expiry.HMAC` —
// `parseSessionToken` checks signature + TTL only and
// `getSessionUser` checks only that the user exists. The password
// reset writes a new passwordHash and nulls the reset token — NOTHING
// else — so every cookie minted before the reset stays valid for the
// full 7-day TTL. A stolen/observed cookie outlives the password
// reset performed specifically to kill it (the canonical OWASP
// session-revocation failure). The repo's own smoke suite proved it:
// the pre-reset jar minted at smoke-test.sh:42 still authorized the
// CRUD sections that run after the reset round-trip.
//
// THE FIX: a `tokenVersion Int @default(0)` column on User, embedded
// in the token payload (`userId.version.expiry`), compared at the
// getSessionUser database seam, and incremented by the reset route —
// the eviction the stateless format needed.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

function route(name: string): string {
  return src(`src/app/api/auth/${name}/route.ts`);
}

// ---------------------------------------------------------------------------
// The schema contract
// ---------------------------------------------------------------------------
describe("the tokenVersion schema column (S67-A / M-1)", () => {
  it("User carries tokenVersion Int @default(0)", () => {
    // THE DEFECT PIN: pre-fix the User model has no version column —
    // there is nothing for a reset to increment.
    const schema = src("prisma/schema.prisma");
    expect(schema).toMatch(/tokenVersion\s+Int\s+@default\(0\)/);
    // the column lives on the User model (not on Project/Team)
    const userBlock = schema.slice(schema.indexOf("model User {"), schema.indexOf("model Project {"));
    expect(userBlock).toMatch(/tokenVersion\s+Int\s+@default\(0\)/);
  });
});

// ---------------------------------------------------------------------------
// The token format
// ---------------------------------------------------------------------------
describe("the versioned session token (S67-A / M-1)", () => {
  it("createSessionToken embeds the version — the payload is userId.version.expiry", () => {
    // THE DEFECT PIN: pre-fix the payload is `${userId}.${expiry}` — a
    // 3-part token with no revocation dimension.
    const source = src("src/lib/auth.ts");
    expect(source).toMatch(
      /function createSessionToken\(\s*userId: string,\s*tokenVersion: number,?\s*\)/,
    );
    expect(source).toMatch(/`\$\{userId\}\.\$\{tokenVersion\}\.\$\{expiry\}`/);
  });

  it("parseSessionToken validates the 4-part form and returns { userId, tokenVersion }", () => {
    // THE DEFECT PIN: pre-fix the parser splits into exactly 3 parts
    // and returns a bare userId string — no version survives the parse.
    const source = src("src/lib/auth.ts");
    expect(source).toMatch(/parts\.length !== 4/);
    expect(source).toMatch(/Number\.isInteger\(tokenVersion\)/);
    expect(source).toMatch(/return \{ userId, tokenVersion \};/);
  });

  it("the signature covers the version — sign(`${userId}.${tokenVersion}.${expiry}`)", () => {
    // The HMAC must cover the WHOLE payload; a version outside the
    // signature would be attacker-mutable.
    const source = src("src/lib/auth.ts");
    expect(source).toMatch(
      /sign\(`\$\{userId\}\.\$\{tokenVersion\}\.\$\{expiry\}`\)/,
    );
  });

  it("the standing signature + TTL semantics survive (preservation)", () => {
    const source = src("src/lib/auth.ts");
    expect(source).toMatch(/timingSafeEqual\(a, b\)/);
    expect(source).toMatch(/Number\(expiry\) < Date\.now\(\)/);
  });
});

// ---------------------------------------------------------------------------
// The database-seam comparison
// ---------------------------------------------------------------------------
describe("getSessionUser rejects a stale version (S67-A / M-1)", () => {
  it("the select includes tokenVersion and the comparison rejects mismatches", () => {
    // THE DEFECT PIN: pre-fix getSessionUser selects id/email/name/
    // avatarColor only and returns the user unconditionally — a
    // pre-revocation cookie authorizes forever.
    const source = src("src/lib/auth.ts");
    expect(source).toMatch(/tokenVersion:\s*true/);
    expect(source).toMatch(
      /user\.tokenVersion !== |tokenVersion !== user\.tokenVersion|parsed\.tokenVersion !== user\.tokenVersion/,
    );
  });
});

// ---------------------------------------------------------------------------
// The eviction + the mint sites
// ---------------------------------------------------------------------------
describe("the reset evicts + the mint sites pass the live version (S67-A / M-1)", () => {
  it("the reset route increments tokenVersion", () => {
    // THE DEFECT PIN: pre-fix the reset writes passwordHash + the
    // token nulls only — every previously minted cookie survives.
    const source = route("reset-password");
    expect(source).toMatch(/tokenVersion:\s*\{\s*increment:\s*1\s*\}/);
  });

  it("login mints with the live version (preservation of the envelope + the cookie)", () => {
    const source = route("login");
    expect(source).toMatch(/setSessionCookie\(user\.id,\s*user\.tokenVersion,/);
  });

  it("verify-otp mints with the live version (the select carries it)", () => {
    const source = route("verify-otp");
    expect(source).toMatch(/tokenVersion:\s*true/);
    // the destructure keeps the response shape unchanged (the version
    // rides the cookie, not the body) while the mint embeds it
    expect(source).toMatch(/tokenVersion: mintVersion, \.\.\.verifiedUser/);
    expect(source).toMatch(/setSessionCookie\(verified\.id,\s*mintVersion,/);
  });
});
