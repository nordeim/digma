import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The server Low batch (session 64, S64-E — the twelfth audit's
// B-4 + B-12).
//
// B-4 THE DEFECT: the register route's findUnique→create pair raced —
// a concurrent same-email register surfaced the Prisma unique
// constraint as an UNSTRUCTURED 500 (the bare-throw family the
// S56-H/S62-G passes closed on the elements and PATCH routes; the
// register's own create was missed).
//
// B-12 THE DEFECT: the reset-password route accepted unbounded
// password lengths while the register route caps at 200 — a contract
// asymmetry between the two password-setting surfaces.
//
// THE FIX: the create is wrapped for the unique-constraint code and
// answers the SAME 409 CONFLICT envelope the findUnique path answers;
// the reset route gains the register cap (the same VALIDATION 400
// family).

const registerSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/register/route.ts"),
  "utf8",
);
const resetSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/reset-password/route.ts"),
  "utf8",
);

describe("the register race + the reset cap (session 64, S64-E / B-4 + B-12)", () => {
  it("the register create is guarded for the unique-constraint code and answers the conflict envelope", () => {
    // THE DEFECT PIN: pre-fix the create carried no guard — a racing
    // duplicate escaped as a raw 500.
    // Session 82 re-anchor: the create moved INSIDE the S82-C
    // count-guarded transaction (the USER_LIMIT ceiling) — the
    // `db.user.create(` form became `tx.user.create(`; the intent
    // (the P2002 guard + the CONFLICT envelope) is unchanged.
    const createIdx = registerSource.indexOf("tx.user.create(");
    expect(createIdx).toBeGreaterThan(-1);
    // The guard wraps the create (try/catch) and maps the unique
    // constraint code onto the same CONFLICT envelope the pre-check
    // path answers.
    expect(registerSource).toMatch(/catch \(error/);
    expect(registerSource).toMatch(/P2002/);
    expect(registerSource).toMatch(/"CONFLICT", "An account with this email already exists", 409/);
  });

  it("the pre-check CONFLICT path survives (the preservation)", () => {
    // PRESERVATION: the sequential duplicate still answers 409 through
    // the findUnique branch — the race guard is ADDITIVE, not a
    // replacement.
    expect(registerSource).toMatch(/const existing = await db\.user\.findUnique/);
    expect(registerSource).toMatch(/if \(existing\)/);
  });

  it("the reset route caps the password length at the register contract's bound", () => {
    // THE DEFECT PIN: pre-fix the reset route checked only the MINIMUM
    // length — an unbounded password was accepted here while the
    // register surface rejected it.
    const weakIdx = resetSource.indexOf("newPassword.length < 8");
    expect(weakIdx).toBeGreaterThan(-1);
    // The upper bound check sits in the same validation family.
    expect(resetSource).toMatch(/newPassword\.length > 200/);
    const capIdx = resetSource.indexOf("newPassword.length > 200");
    expect(capIdx).toBeGreaterThan(-1);
    const capBody = resetSource.slice(capIdx, capIdx + 300);
    expect(capBody).toMatch(/fail\("VALIDATION"/);
  });
});
