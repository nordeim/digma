import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-70 server low batch (S70-D — the eighteenth audit's L-A4 +
// L-A5 + the doc riders).
//
// THE DEFECTS: (L-A4) the verify-otp exhaustion lock reads a STALE
// verifyAttempts — the lock check at :65 and the display derivation use
// the pre-read findUnique value while the success path's db.user.update
// is non-conditional, so a request that read 4 can open a session past a
// ceiling a concurrent request tripped (the S62-E atomicity fixed the
// wrong-code increment; the success path never received it). (L-A5) the
// duplicated hashPassword seam — prisma/seed.ts re-implements the scrypt
// parameter set from src/lib/auth.ts (the direct import is wrong: auth.ts
// transitively imports next/headers — the bare-PrismaClient seed must
// stay Next-free). Plus the ADR-014 enumeration-tradeoff sentence and the
// PAD's /api/auth/me sentence drift.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the verify-otp atomic success path (S70-D / L-A4)", () => {
  const route = src("src/app/api/auth/verify-otp/route.ts");

  it("the success update is the conditional updateMany (the ceiling is enforced atomically)", () => {
    // THE DEFECT PIN: pre-fix the verified path runs a non-conditional
    // db.user.update — the stale-read race opens a session past the
    // ceiling. Post-fix the where-clause carries BOTH the code match AND
    // the attempts bound.
    expect(route).not.toMatch(/db\.user\.update\(\{/);
    expect(route).toMatch(/updateMany\(\{\s*where: \{\s*id: user\.id,\s*verifyCode: code,\s*verifyAttempts: \{ lt: MAX_VERIFY_ATTEMPTS \}/);
    // The success data clears the code and resets the counter.
    const success = route.indexOf("verifiedResult = await db.user.updateMany");
    expect(success).toBeGreaterThan(-1);
    const successBlock = route.slice(success, success + 400);
    expect(successBlock).toMatch(/verified: true/);
    expect(successBlock).toMatch(/verifyCode: null/);
    expect(successBlock).toMatch(/verifyAttempts: 0/);
    // The mint re-reads the verified row for the tokenVersion (the
    // updateMany returns a count, not the row).
    expect(route).toMatch(/const verified = await db\.user\.findUnique/);
  });

  it("the count===0 branch discriminates locked from wrong (the re-read)", () => {
    // THE FIX PIN: count === 0 means the code is wrong OR the ceiling
    // tripped concurrently — the re-read discriminates for the honest
    // answer (429 vs the wrong-code family).
    const successIdx = route.indexOf("verifiedResult.count === 1");
    expect(successIdx).toBeGreaterThan(-1);
    const after = route.slice(successIdx, successIdx + 2600);
    expect(after).toMatch(/result\.count === 0/);
    expect(after).toMatch(/VERIFY_LOCKED/);
  });

  it("the wrong-code display counter derives from a post-increment read (the stale display rider)", () => {
    // THE FIX PIN: the "N attempts remaining" message derives from the
    // post-increment attempts, not the pre-read value (a concurrent
    // attempt made the pre-read display lie).
    // Session 73 (S73-H / B-F6) contract change: the half-dead
    // `user.verifyCode !== code ||` disjunct died (reaching the branch
    // implies the atomic update matched zero rows) — the locator
    // re-anchors onto the live condition (the window widened for the
    // S73-H comment block that now sits inside it).
    const wrongIdx = route.indexOf("if (verifiedResult.count === 0)");
    const wrong = route.slice(wrongIdx, wrongIdx + 3000);
    expect(wrong).toMatch(/const fresh = await db\.user\.findUnique/);
    expect(wrong).toMatch(/verifyAttempts: true/);
    expect(wrong).toMatch(/fresh\?\.verifyAttempts/);
    // And the message interpolates that fresh value.
    expect(wrong).toMatch(/MAX_VERIFY_ATTEMPTS - attempts/);
  });

  it("the S62-E atomic increment itself is preserved", () => {
    // THE PRESERVATION PIN: the wrong-code increment stays the
    // conditional updateMany (the count-then-429 form).
    expect(route).toMatch(/verifyAttempts: \{ increment: 1 \}/);
    expect(route).toMatch(/verifyAttempts: \{ lt: MAX_VERIFY_ATTEMPTS \}/);
  });
});

describe("the pure password seam (S70-D / L-A5)", () => {
  it("src/lib/password.ts exists carrying the pure crypto trio", () => {
    // THE FIX PIN: the node:crypto-only module (no next/* imports — the
    // bare-PrismaClient seed script can import it).
    const pw = src("src/lib/password.ts");
    expect(pw).toMatch(/export function hashPassword/);
    expect(pw).toMatch(/export function verifyPassword/);
    expect(pw).toMatch(/export function generateVerifyCode/);
    expect(pw).toMatch(/from "node:crypto"/);
    expect(pw).not.toMatch(/next\//);
    expect(pw).not.toMatch(/@\/lib\/db/);
  });

  it("auth.ts consumes + re-exports the seam (the register route's imports survive)", () => {
    const auth = src("src/lib/auth.ts");
    expect(auth).toMatch(/from "@\/lib\/password"/);
    // Session 72 (S72-C) contract re-anchor: the re-export list grew —
    // timingEqualizerHash joined the trio (the login route's constant-
    // work envelope); the seam's single-source contract is unchanged.
    expect(auth).toMatch(
      /export \{ generateVerifyCode, hashPassword, timingEqualizerHash, verifyPassword \}/,
    );
    // The duplicated scrypt implementation is deleted from auth.ts (the
    // single seam owns it).
    const implCount = (auth.match(/scryptSync\(/g) || []).length;
    expect(implCount).toBe(0);
  });

  it("seed.ts imports the seam (the duplicated scrypt parameters are gone)", () => {
    // THE DEFECT PIN: pre-fix seed.ts re-implements hashPassword with the
    // salt/key parameter set inline.
    const seed = src("prisma/seed.ts");
    // The relative form (the bare-PrismaClient script runs outside the
    // bundler's alias resolution).
    expect(seed).toMatch(/from "..\/src\/lib\/password"/);
    expect(seed).not.toMatch(/function hashPassword/);
    expect((seed.match(/scryptSync\(/g) || []).length).toBe(0);
  });

  it("the register route's existing import surface survives unchanged", () => {
    // THE PRESERVATION PIN: the routes import hashPassword from @/lib/auth
    // (the re-export keeps them byte-identical).
    const register = src("src/app/api/auth/register/route.ts");
    expect(register).toMatch(/hashPassword/);
  });
});

describe("the PAD doc riders (S70-D)", () => {
  it("ADR-014 carries the enumeration-tradeoff sentence", () => {
    // THE DEFECT PIN: the ADR documents the in-band delivery and its
    // visibility tradeoff but never names the consequence — the
    // field-level nullness of resetUrl/verificationCode re-introduces
    // account enumeration (the no-enumeration 200 covers the message
    // body, not the payload shape).
    const pad = src("Project_Architecture_Document.md");
    // Anchor on the ADR's DECISION BLOCK heading (the header summary and
    // the revision blocks mention ADR-014 earlier in the file).
    const adrStart = pad.indexOf("**ADR-014:");
    expect(adrStart).toBeGreaterThan(-1);
    const adr = pad.slice(adrStart, adrStart + 8000);
    expect(adr).toMatch(/enumeration tradeoff/i);
    expect(adr).toMatch(/resetUrl/);
    expect(adr).toMatch(/null-for-everyone/);
  });

  it("the /api/auth/me sentence matches the route (200 with user: null, not 401)", () => {
    // THE DEFECT PIN: the PAD's API row claims me answers 401 signed out;
    // the route answers 200 { user: null }.
    const pad = src("Project_Architecture_Document.md");
    expect(pad).not.toMatch(/`me`: returns the current user or 401/);
    expect(pad).toMatch(/user: null/);
  });
});
