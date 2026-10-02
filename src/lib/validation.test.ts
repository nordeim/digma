import { describe, expect, it } from "vitest";
import { clampFontFamily, normalizeResetToken, resetTokenAlive, safeFromUrl } from "@/lib/validation";

// Session 29 (RA-10): the reference's Font Family combobox carries exactly
// seven options (Inter, Roboto, Arial, Helvetica, Times New Roman, Georgia,
// Verdana) — measured live on its Radix Select. Writes clamp to that enum
// the same way templates and element types clamp.

describe("clampFontFamily", () => {
  it("accepts every measured reference option", () => {
    for (const family of [
      "Inter",
      "Roboto",
      "Arial",
      "Helvetica",
      "Times New Roman",
      "Georgia",
      "Verdana",
    ]) {
      expect(clampFontFamily(family)).toBe(family);
    }
  });

  it("falls back to null for values outside the measured set", () => {
    // Same null-drop contract as clampFontWeight: an invalid family is
    // dropped on write and the RENDERER's `?? "Inter"` owns the fallback
    // (defaultElementFor pins the Inter default separately).
    expect(clampFontFamily("Comic Sans")).toBeNull();
    expect(clampFontFamily("")).toBeNull();
    expect(clampFontFamily(undefined)).toBeNull();
    expect(clampFontFamily(null)).toBeNull();
  });
});

// Session 46 (RA-65/RA-66): the reference's /reset-password landing page
// keys its two states on the ?token= query param — only a NON-EMPTY token
// opens the "Set new password" form; a missing, empty, or differently-
// named param renders the "Invalid Reset Link" card (measured live on both
// ?code=abc123 and ?token=). The token's server-side validity is a separate
// concern (checked at submit, 400 "Invalid or expired reset token").

describe("normalizeResetToken", () => {
  it("passes a non-empty token through unchanged", () => {
    expect(normalizeResetToken("abc123")).toBe("abc123");
    expect(normalizeResetToken("x")).toBe("x");
  });

  it("normalizes missing/empty/whitespace-only params to null (the invalid-link state)", () => {
    expect(normalizeResetToken("")).toBeNull();
    expect(normalizeResetToken("   ")).toBeNull();
    expect(normalizeResetToken(undefined)).toBeNull();
    expect(normalizeResetToken(null)).toBeNull();
  });
});

// Session 46 (RA-65): the reference's reset message reads "invalid or has
// expired" — the token carries an expiry. The coherent reading under the
// in-app delivery (ADR-014 family): a 60-minute window, checked pure here.

describe("resetTokenAlive", () => {
  const now = new Date("2026-10-01T12:00:00Z").getTime();

  it("accepts a future expiry", () => {
    expect(resetTokenAlive(new Date(now + 60 * 60 * 1000), now)).toBe(true);
    expect(resetTokenAlive(new Date(now + 1), now)).toBe(true);
  });

  it("rejects a past expiry and a missing expiry", () => {
    expect(resetTokenAlive(new Date(now - 1), now)).toBe(false);
    expect(resetTokenAlive(new Date(now - 60 * 60 * 1000), now)).toBe(false);
    expect(resetTokenAlive(null, now)).toBe(false);
    expect(resetTokenAlive(undefined, now)).toBe(false);
  });
});


// Session 58 (S58-C — the sixth Mode C audit's A-M-3): the login's
// from_url target must be site-local. The raw param was pushed verbatim
// into router.push after sign-in/verify — Next 16's router hard-navigates
// external URLs (location.assign), so a crafted
// /login?from_url=https://attacker.example sent the victim off-site
// immediately after authentication (CWE-601). The guard: a leading "/"
// that is NOT protocol-relative "//"; anything else falls back to "/".

describe("safeFromUrl (session 58, S58-C / A-M-3)", () => {
  it("passes site-local paths verbatim (incl. query strings and hashes)", () => {
    expect(safeFromUrl("/Dashboard")).toBe("/Dashboard");
    expect(safeFromUrl("/Editor?projectId=abc123")).toBe("/Editor?projectId=abc123");
    expect(safeFromUrl("/Recent?search=hero")).toBe("/Recent?search=hero");
    expect(safeFromUrl("/")).toBe("/");
  });

  it("rejects absolute URLs — the open-redirect class falls back to /", () => {
    expect(safeFromUrl("https://attacker.example")).toBe("/");
    expect(safeFromUrl("http://attacker.example/phish")).toBe("/");
    expect(safeFromUrl("https://digma-371dfd0d.base44.app")).toBe("/");
  });

  it("rejects protocol-relative and backslash forms", () => {
    // "//evil.com" is parsed as a scheme-relative origin by the browser.
    expect(safeFromUrl("//evil.com")).toBe("/");
    expect(safeFromUrl("/\\evil.com")).toBe("/");
    expect(safeFromUrl("\\evil.com")).toBe("/");
  });

  it("falls back to / for empty, whitespace, and missing values", () => {
    expect(safeFromUrl("")).toBe("/");
    expect(safeFromUrl("   ")).toBe("/");
    expect(safeFromUrl(null)).toBe("/");
    expect(safeFromUrl(undefined)).toBe("/");
  });
});
