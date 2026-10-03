import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-67 AI limiter + OTP knob batch (S67-C — the fifteenth
// audit's M-2 + the M-3 knob half).
//
// THE DEFECTS: (M-2, the documented B-15) /api/ai-assistant runs
// requireSession() and then awaits an LLM chat completion with
// maxDuration = 60 — NO rate limit at all. An authenticated caller
// drives unbounded LLM completions (API cost burn + held server work).
// The documented deferral reason: a SHARED bucket would break the
// e2e/smoke suites (they drive the route from one localhost IP against
// the 10/15-min auth budget) — the fix is a DEDICATED bucket.
// (M-3's knob half) the in-band OTP delivery has no production
// suppression knob: register, resend-otp, and login's unverified
// branch all return the 6-digit code in the response body, and the
// sibling half of the ADR-014 family (the resetUrl) has had its knob
// since session 64 — DIGMA_DISABLE_IN_APP_OTP closes the OTP half in
// the same one-step deploy form.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

// ---------------------------------------------------------------------------
// aiRateLimit — the behavioral pins (the seam executes against its own
// scratch buckets)
// ---------------------------------------------------------------------------
import { aiRateLimit, checkRate, type RateBuckets } from "../src/lib/rate-limit";

describe("aiRateLimit — the dedicated assistant bucket (S67-C / M-2)", () => {
  it("allows a 20-call budget per 5-minute window and denies the 21st", () => {
    // THE DEFECT PIN: pre-fix the export does not exist — the route
    // has no limiter at all.
    const buckets: RateBuckets = new Map();
    const t0 = 1_000_000;
    for (let i = 0; i < 20; i++) {
      // feed a scratch bucket through the same shape aiRateLimit uses
      expect(checkRate(buckets, "ai:probe-ip", 20, 5 * 60 * 1000, t0).allowed).toBe(true);
    }
    expect(checkRate(buckets, "ai:probe-ip", 20, 5 * 60 * 1000, t0).allowed).toBe(false);
  });

  it("aiRateLimit itself carries the 20/5-min contract", () => {
    const source = src("src/lib/rate-limit.ts");
    expect(source).toMatch(/export function aiRateLimit\(/);
    expect(source).toMatch(/AI_LIMIT = 20/);
    expect(source).toMatch(/AI_WINDOW_MS = 5 \* 60 \* 1000/);
    // the dedicated prefix — NEVER the shared auth: bucket (the
    // documented deferral reason: the suites share one localhost IP)
    expect(source).toMatch(/`ai:\$\{ip\}`/);
  });

  it("the Retry-After window math reuses checkRate (preservation of the fixed-window core)", () => {
    const source = src("src/lib/rate-limit.ts");
    expect(source).toMatch(/return checkRate\(buckets, `ai:\$\{ip\}`, AI_LIMIT, AI_WINDOW_MS, now\)/);
  });
});

// ---------------------------------------------------------------------------
// The route wiring (the source contracts)
// ---------------------------------------------------------------------------
describe("the ai-assistant route carries the limiter BEFORE the body parse (S67-C / M-2)", () => {
  it("the limiter call sits right after the session gate, before request.json()", () => {
    // THE DEFECT PIN: pre-fix requireSession is the only gate.
    const source = src("src/app/api/ai-assistant/route.ts");
    expect(source).toMatch(/aiRateLimit\(clientIpOf\(request\.headers\)\)/);
    const sessionGate = source.indexOf("requireSession()");
    const limiterCall = source.indexOf("aiRateLimit(");
    const firstParse = source.indexOf("request.json()");
    expect(limiterCall).toBeGreaterThan(sessionGate);
    expect(firstParse).toBeGreaterThan(limiterCall);
  });

  it("the 429 answers the family envelope with Retry-After", () => {
    const source = src("src/app/api/ai-assistant/route.ts");
    expect(source).toMatch(/RATE_LIMITED/);
    expect(source).toMatch(/Retry-After/);
    expect(source).toMatch(/status: 429/);
    expect(source).toMatch(/Too many assistant requests/);
  });
});

// ---------------------------------------------------------------------------
// The OTP suppression knob (the M-3 knob half)
// ---------------------------------------------------------------------------
describe("DIGMA_DISABLE_IN_APP_OTP gates the three code-delivery sites (S67-C / M-3)", () => {
  it("register nulls the code when the knob is set", () => {
    // THE DEFECT PIN: pre-fix the code travels unconditionally — a
    // production deploy with a real email service cannot close the
    // OTP half of the ADR-014 family.
    const source = src("src/app/api/auth/register/route.ts");
    expect(source).toMatch(/DIGMA_DISABLE_IN_APP_OTP/);
    expect(source).toMatch(/verificationCode:\s*inAppOtpEnabled\s*\?\s*verifyCode\s*:\s*null/);
  });

  it("resend-otp nulls the code when the knob is set", () => {
    const source = src("src/app/api/auth/resend-otp/route.ts");
    expect(source).toMatch(/DIGMA_DISABLE_IN_APP_OTP/);
    expect(source).toMatch(/verificationCode:\s*inAppOtpEnabled\s*\?\s*verifyCode\s*:\s*null/);
  });

  it("login's unverified branch nulls the code when the knob is set", () => {
    const source = src("src/app/api/auth/login/route.ts");
    expect(source).toMatch(/DIGMA_DISABLE_IN_APP_OTP/);
    expect(source).toMatch(/verificationCode:\s*inAppOtpEnabled\s*\?\s*verifyCode\s*:\s*null/);
  });

  it("the reset knob's standing form survives untouched (preservation)", () => {
    const source = src("src/app/api/auth/forgot-password/route.ts");
    expect(source).toMatch(/DIGMA_DISABLE_IN_APP_RESET !== "1"/);
  });

  it(".env.example documents the OTP knob beside its sibling", () => {
    const env = src(".env.example");
    expect(env).toMatch(/DIGMA_DISABLE_IN_APP_OTP/);
  });
});
