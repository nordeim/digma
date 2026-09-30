import { describe, expect, it } from "vitest";
import { clampFontFamily } from "@/lib/validation";

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
