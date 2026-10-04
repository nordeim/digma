import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-76 reset-password atomicity slice (S76-A — the
// twenty-fourth audit's B-L1, the headline).
//
// THE DEFECT: the single-use token consumption was check-then-act —
// the route read the token (findFirst), checked expiry in JS, then
// wrote the reset with ONLY the row id in the where-clause. A racing
// replay whose read interleaved before the legitimate reset's commit
// could land its own write on the same row — the single-use invariant
// the route's own comment claims ("a replay answers the invalid-token
// 400") was not enforced atomically. The verify-otp sibling received
// the conditional form in S70-D; this is that fix reaching the
// reset-password sibling (the incomplete-family lesson, F61).
//
// THE FIX: the success-path write becomes the conditional updateMany —
// the where-clause carries the token AND the live expiry, so a stale
// or racing token answers count 0, which returns the SAME
// invalid-token 400 the pre-checks answer. The pre-read stays (the
// measured token-before-password 400 ordering is preserved), and the
// tokenVersion eviction increment rides the same data block.

const route = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/reset-password/route.ts"),
  "utf8",
);

describe("the reset-password single-use atomicity (S76-A / B-L1)", () => {
  it("the success-path write is the conditional form (the where-clause carries the token + the live expiry)", () => {
    // THE DEFECT PIN: pre-fix the write keyed on the row id alone —
    // the interleaving replay could overwrite a just-reset password.
    expect(route).toMatch(
      /const result = await db\.user\.updateMany\(\{\s*where: \{ id: user\.id, resetToken, resetTokenExpiresAt: \{ gt: new Date\(\) \} \},/,
    );
  });

  it("a zero-count write answers the invalid-token 400 (the stale/racing token resolves through the where-clause)", () => {
    // THE DEFECT PIN: pre-fix no count check existed on the success
    // path — the write was unconditional on the id.
    expect(route).toMatch(/if \(result\.count === 0\) \{\s*return fail\("VALIDATION", INVALID_TOKEN_MESSAGE, 400\);/);
  });

  it("the single-use clearing and the eviction increment ride the atomic write's data block", () => {
    // THE DEFECT PIN (the family shape): the nulls + the version bump
    // must live INSIDE the conditional write — a separate unconditional
    // write would reintroduce the race on its own fields.
    const idx = route.indexOf("const result = await db.user.updateMany");
    const block = route.slice(idx, route.indexOf("if (result.count === 0)"));
    expect(block).toMatch(/resetToken: null/);
    expect(block).toMatch(/resetTokenExpiresAt: null/);
    expect(block).toMatch(/tokenVersion: \{ increment: 1 \}/);
  });
});

describe("the preserved reset contract (S76-A — the pre-read + the measured ordering)", () => {
  it("the pre-read stays (the token lookup precedes the write)", () => {
    // PRESERVATION: the findFirst pre-read carries the measured
    // token-first 400 ordering and the token-before-password checks.
    const readIdx = route.indexOf("findFirst({ where: { resetToken } })");
    const writeIdx = route.indexOf("updateMany");
    expect(readIdx).toBeGreaterThan(-1);
    expect(writeIdx).toBeGreaterThan(readIdx);
  });

  it("the token check precedes the weak-password check (the measured ordering)", () => {
    // PRESERVATION: the reference's measured ordering — the invalid
    // token 400 comes before the password-length 400s.
    const tokenIdx = route.indexOf("INVALID_TOKEN_MESSAGE");
    const weakIdx = route.indexOf("at least 8 characters");
    expect(tokenIdx).toBeGreaterThan(-1);
    expect(weakIdx).toBeGreaterThan(tokenIdx);
  });
});
