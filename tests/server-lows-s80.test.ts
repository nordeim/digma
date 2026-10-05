import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-80 server/config low batch (S80-D + S80-E — the
// twenty-eighth audit's B-L2, B-L1, B-L3, A-L3, and the lead's own
// doc-review findings).
//
// S80-D — THE GAP (B-L2): the S79-D anti-clickjacking headers were
// pinned as SOURCE TEXT ONLY — five regexes over next.config.ts —
// and no runtime gate verified the real response headers. A future
// regression (a next.config refactor, a Next major change) would
// pass all six gates silently. THE FIX: three curl -sI checks in the
// smoke suite assert the standalone build's LIVE response headers.
//
// S80-E — THE DEFECTS (B-L1 + the lead's findings — the honesty
// batch): the session-79 S79-C removed `"noImplicitAny": false`
// from tsconfig.json but the doctrine files still claimed it was
// kept (AGENTS.md:116, CLAUDE.md:46, PAD:1458); the e2e counts
// stalled at the session-78 numbers in three places (CLAUDE.md:93,
// README.md:318, digma_SKILL.md's project_state); the resend-otp
// email-only asymmetry was never called out in the posture doc; and
// /api/health's non-envelope shape was never documented as the
// exemption it is.

const smoke = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/smoke-test.sh"),
  "utf8",
);
const agents = readFileSync(
  path.resolve(import.meta.dirname, "../AGENTS.md"),
  "utf8",
);
const claude = readFileSync(
  path.resolve(import.meta.dirname, "../CLAUDE.md"),
  "utf8",
);
const readme = readFileSync(
  path.resolve(import.meta.dirname, "../README.md"),
  "utf8",
);
const pad = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skill = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const deployment = readFileSync(
  path.resolve(import.meta.dirname, "../docs/DEPLOYMENT.md"),
  "utf8",
);

// ---------------------------------------------------------------------------
// S80-D — the runtime header gate
// ---------------------------------------------------------------------------
describe("the smoke suite asserts the anti-clickjacking headers at runtime (S80-D / B-L2)", () => {
  it("a curl -sI header probe exists in the smoke script", () => {
    // THE DEFECT PIN: pre-fix the smoke suite asserted ZERO response
    // headers — the S79-D trio was source-text-pinned only.
    expect(smoke).toMatch(/curl\s+-sI/);
  });

  it("the X-Frame-Options DENY header is checked against the live server", () => {
    // Session 81 (S81-C / B81-I2 — the pin-precision tightening): the
    // optional `\^?` anchor tightened to the literal `^` — a future edit
    // dropping the shipped grep's line-start anchor would otherwise keep
    // this pin green while weakening the runtime check to an unanchored
    // substring match.
    expect(smoke).toMatch(/grep -qi "\^x-frame-options: DENY"/i);
  });

  it("the X-Content-Type-Options nosniff header is checked against the live server", () => {
    // Session 81 (S81-C / B81-I2 — the pin-precision tightening): same.
    expect(smoke).toMatch(/grep -qi "\^x-content-type-options: nosniff"/i);
  });

  it("the Referrer-Policy header is checked against the live server", () => {
    // Session 81 (S81-C / B81-I2 — the pin-precision tightening): same.
    expect(smoke).toMatch(/grep -qi "\^referrer-policy: strict-origin-when-cross-origin"/i);
  });
});

// ---------------------------------------------------------------------------
// S80-E — the docs honesty batch
// ---------------------------------------------------------------------------
describe("the noImplicitAny claims are gone from the doctrine files (S80-E / B-L1)", () => {
  // The CLAIM form, not the historical mention: the docs may honestly
  // document the S79-C removal, but must not claim the exception is
  // kept — the tsconfig carries only `strict: true`.
  it("AGENTS.md no longer claims the noImplicitAny exception is kept", () => {
    expect(agents).not.toMatch(/strict except/i);
    expect(agents).not.toMatch(/noImplicitAny[^\n]*kept intentionally/i);
  });

  it("CLAUDE.md no longer claims the noImplicitAny exception is kept", () => {
    expect(claude).not.toMatch(/strict except/i);
    expect(claude).not.toMatch(/noImplicitAny[^\n]*kept intentionally/i);
  });

  it("the PAD's tech-stack row no longer carries the exception claim", () => {
    expect(pad).not.toMatch(/strict except `noImplicitAny: false`/);
  });
});

describe("the gate counts are aligned across the docs (S80-E / B-L1)", () => {
  it("CLAUDE.md's command table carries the current e2e count", () => {
    // THE DEFECT PIN: CLAUDE.md:93 said "253 Playwright checks" while
    // its own gate-order line said 256. The session-80 delivery pins
    // the count at 258 (256 + the two session-80 discriminators).
    // Session 81: legitimately re-anchored to 259 — the session-81
    // discriminator (the mount double-PUT guard) grew the suite by
    // one; the pin's intent (the delivery count pinned at the
    // command-table site) is unchanged.
    // Session 82: re-anchored to 260 — the open-Select tool-switch
    // discriminator grew the suite by one; intent unchanged.
    expect(claude).not.toMatch(/253 Playwright/);
    expect(claude).toMatch(/260 Playwright/);
  });

  it("README.md's command table carries the current e2e count", () => {
    // THE DEFECT PIN: README.md:318 said "253 browser checks". The
    // session-80 delivery pins the count at 258. Session 81:
    // legitimately re-anchored to 259 (the mount double-PUT
    // discriminator) — intent unchanged.
    // Session 82: re-anchored to 260 (the open-Select discriminator).
    expect(readme).not.toMatch(/253 browser/);
    expect(readme).toMatch(/260 browser/);
  });

  it("digma_SKILL.md's project_state frontmatter carries the current counts", () => {
    // THE DEFECT PIN: the frontmatter still read the session-78
    // counts (876 unit / 253 Playwright) while the file's own version
    // block claimed the session-79 delivery.
    expect(skill).not.toMatch(/876 unit checks green/);
    expect(skill).not.toMatch(/253 Playwright checks green/);
  });
});

describe("the resend-otp asymmetry is called out in the posture doc (S80-E / B-L3)", () => {
  it("DEPLOYMENT.md documents the email-only delivery asymmetry", () => {
    // THE DEFECT PIN: the public-deploy posture paragraph covered
    // the knob family but never named the asymmetry — login's
    // unverified branch regenerates only after verifyPassword and
    // register delivers only to the registrant, while resend-otp
    // delivers the fresh code to ANY caller knowing the email.
    expect(deployment).toMatch(/resend/i);
    expect(deployment).toMatch(/asymmetry|email-only|any caller knowing the email/i);
  });
});

describe("the health route's envelope exemption is documented (S80-E / B-I5)", () => {
  it("AGENTS.md documents /api/health as the lone non-envelope route", () => {
    // THE DEFECT PIN: the envelope doctrine said "every handler"
    // while /api/health returns a bare status object — never
    // documented as the exemption.
    expect(agents).toMatch(/health[^\n]{0,200}(envelope|exemption)/i);
  });
});
