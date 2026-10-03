import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session 63 (S63-E / A-L4 — the eleventh audit's Low): the in-app
// reset link rendered the API's resetUrl verbatim — `<a href={resetUrl}>`
// in the forgot-password "sent" state. The route builds a relative
// /reset-password?token=… URL (same-origin trust), but unlike the
// from_url target it bypassed safeFromUrl entirely — the S58-C
// defense-in-depth family. The fix: the href routes through
// safeFromUrl(resetUrl) (falls back to "/" on any non-site-local
// target).

const loginSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/login-screen.tsx"),
  "utf8",
);

describe("the reset-link guard (session 63, S63-E / A-L4)", () => {
  it("login-screen imports safeFromUrl from the validation seam", () => {
    // THE DEFECT PIN: pre-fix the component never imported the guard.
    expect(loginSource).toContain("safeFromUrl");
    expect(loginSource).toContain('from "@/lib/validation"');
  });

  it("the in-app reset anchor routes the href through the guard", () => {
    // The pre-fix form: href={resetUrl} — the raw API string. The
    // post-fix form: href={safeFromUrl(resetUrl)}.
    expect(loginSource).not.toContain("href={resetUrl}");
    expect(loginSource).toContain("href={safeFromUrl(resetUrl)}");
  });
});
