import { describe, expect, it } from "vitest";
import { clampFontFamily, normalizeResetToken, resetTokenAlive } from "@/lib/validation";

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
