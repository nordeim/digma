import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The server Low batch (session 62, S62-G — the tenth audit's B-L1 +
// B-L3 + B-L5 + B-L7).
//
// B-L1: the verify-code generator used Math.random() while its own
// comment claimed "crypto-random" — triplicated across register,
// login, and resend-otp. THE FIX: one `generateVerifyCode()` helper
// in src/lib/auth.ts built on node:crypto's randomInt (the comment
// becomes true); the three routes import it.
//
// B-L3: the public register route stored unbounded name/email/password
// lengths. THE FIX: name <= 80, email <= 200, password <= 200 (400
// VALIDATION on overflow).
//
// B-L5: the duplicate route's "(Copy)" name could exceed the 120 cap
// and the create+createMany pair was non-transactional. THE FIX: the
// name clamps to 120; the pair wraps in one db.$transaction.
//
// B-L7: a concurrent DELETE made the long-running elements PUT (and
// the PATCH routes) throw Prisma P2025/P2003 OUTSIDE the envelope —
// an unstructured 500 violating the S56-H no-bare-throw discipline.
// THE FIX: the known-request errors answer fail("NOT_FOUND", ..., 404).

const authSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/auth.ts"),
  "utf8",
);
const registerSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/register/route.ts"),
  "utf8",
);
const loginSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/login/route.ts"),
  "utf8",
);
const resendSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/resend-otp/route.ts"),
  "utf8",
);
const duplicateSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/duplicate/route.ts"),
  "utf8",
);
const elementsSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
  "utf8",
);

describe("the server Low batch (session 62, S62-G)", () => {
  it("B-L1: one crypto-random generateVerifyCode helper in auth.ts", () => {
    // THE DEFECT PIN: pre-fix auth.ts had no such helper and the three
    // routes carried Math.random copies.
    // Session 70 (S70-D) contract re-anchor: the crypto trio moved to
    // src/lib/password.ts (the node:crypto-only seam the seed script can
    // import) — auth.ts RE-EXPORTS it, so the routes' import surface is
    // pinned unchanged and the generator lives in exactly ONE place.
    const passwordSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/lib/password.ts"),
      "utf8",
    );
    expect(passwordSource).toMatch(
      /export function generateVerifyCode\(\): string \{\s*return String\(randomInt\(100000, 1000000\)\);\s*\}/,
    );
    expect(passwordSource).toMatch(/from "node:crypto"/);
    // Session 72 (S72-C) contract re-anchor: the re-export list grew —
    // timingEqualizerHash joined the trio (the login route's constant-
    // work envelope); the single-generator contract is unchanged.
    expect(authSource).toMatch(
      /export \{ generateVerifyCode, hashPassword, timingEqualizerHash, verifyPassword \}/,
    );
  });

  it("B-L1: the three routes import the helper — no Math.random generators remain", () => {
    expect(registerSource).toMatch(/import \{[^}]*generateVerifyCode[^}]*\} from "@\/lib\/auth";/);
    expect(loginSource).toMatch(/import \{[^}]*generateVerifyCode[^}]*\} from "@\/lib\/auth";/);
    expect(resendSource).toMatch(/import \{[^}]*generateVerifyCode[^}]*\} from "@\/lib\/auth";/);
    expect(registerSource).not.toMatch(/Math\.random/);
    expect(loginSource).not.toMatch(/Math\.random/);
    expect(resendSource).not.toMatch(/Math\.random/);
  });

  it("B-L3: the register route caps name/email/password lengths", () => {
    // THE DEFECT PIN: pre-fix no length cap existed on any of the
    // three public inputs.
    expect(registerSource).toMatch(/name\.length > 80/);
    expect(registerSource).toMatch(/email\.length > 200/);
    expect(registerSource).toMatch(/password\.length > 200/);
  });

  it("B-L5: the duplicate route clamps the copy name and runs transactionally", () => {
    // THE DEFECT PIN: pre-fix the name was `${source.name} (Copy)`
    // (127 chars from a 120-char source) and create+createMany were
    // separate awaits.
    expect(duplicateSource).toMatch(/name: `\$\{source\.name\} \(Copy\)`\.slice\(0, 120\)/);
    expect(duplicateSource).toMatch(/db\.\$transaction\(async \(tx\) => \{/);
  });

  it("B-L7: the elements PUT answers known Prisma races through the envelope (404, not a bare 500)", () => {
    // THE DEFECT PIN: pre-fix a DELETE racing the PUT's transaction
    // threw P2025 outside the envelope.
    expect(elementsSource).toMatch(/PrismaClientKnownRequestError/);
    expect(elementsSource).toMatch(/P2025/);
    const idx = elementsSource.indexOf("PrismaClientKnownRequestError");
    const block = elementsSource.slice(idx, elementsSource.indexOf("}", elementsSource.indexOf("NOT_FOUND", idx)));
    expect(block).toContain("404");
    expect(elementsSource).toMatch(/import.*Prisma.*from.*@prisma\/client|import \{ Prisma \} from "@prisma\/client";/);
  });
});
