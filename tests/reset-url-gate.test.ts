import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The in-app reset link's production gate (session 64, S64-D — the
// twelfth audit's B-1).
//
// THE DEFECT: the forgot-password route returned the live single-use
// reset token inside the 200's payload for any KNOWN email —
// unauthenticated, with no environment gate (the LLM seam already had
// one; the reset seam did not). The ADR-014 self-hosted deviation was
// documented as an intention ("production with an email service should
// switch the delivery") — but an intention is not a mechanism, and the
// payload itself (null vs token) contradicted the route's own
// no-enumeration comment.
//
// THE FIX: an env knob (the DIGMA_DISABLE_AI_LLM naming family) —
// when set to "1" the route suppresses the in-app link (resetUrl
// stays null for existing accounts too); the no-enumeration 200 and
// its message are unchanged either way; the client's sent card
// renders the link only when the field is a string, so the gated mode
// degrades gracefully to the reference's email-only shape.

const routeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/forgot-password/route.ts"),
  "utf8",
);
const screenSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/login-screen.tsx"),
  "utf8",
);

describe("the in-app reset link's production gate (session 64, S64-D / B-1)", () => {
  it("the route reads the suppression knob (the env-read precondition)", () => {
    // THE DEFECT PIN: pre-fix the route carried no env read at all —
    // the token rode every response unconditionally.
    expect(routeSource).toMatch(/process\.env\.DIGMA_DISABLE_IN_APP_RESET/);
  });

  it("the gate suppresses the link payload when the knob is set", () => {
    // THE DEFECT PIN: pre-fix `resetUrl` was assigned whenever the
    // account existed. The fix routes the assignment through the gate
    // so the production posture can drop the link without touching
    // the no-enumeration contract.
    const idx = routeSource.indexOf("resetUrl = `/reset-password?token=${token}`");
    expect(idx).toBeGreaterThan(-1);
    // The gate precedes the assignment (or wraps it) — the token
    // assignment is conditional on the knob NOT being set. Session 102
    // (S102-B): the window widened 900 -> 1700 — the P2025 guard's
    // try/catch + the stored flag sit between the knob read and the
    // assignment now; the gate's ORDER is unchanged.
    const before = routeSource.slice(Math.max(0, idx - 1700), idx);
    expect(before).toMatch(/DIGMA_DISABLE_IN_APP_RESET/);
    expect(before).toMatch(/!== "1"/);
  });

  it("the client's sent card degrades gracefully when the link is absent (the precondition preservation)", () => {
    // PRESERVATION: the client already guards on the field's type —
    // the gated mode renders the reference's email-only card.
    expect(screenSource).toMatch(/typeof body\?\.data\?\.resetUrl === "string"/);
  });
});
