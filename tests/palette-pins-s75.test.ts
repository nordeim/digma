import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-75 palette-pins family completion (S75-A — A75-F1, the
// twenty-third audit's headline).
//
// THE DEFECT: the S74-G fix pinned exactly ONE member of the
// consumed-but-unpinned family (--color-neutral-900) and declared the
// family closed ("the one consumed-but-unpinned scale" — the
// remediation plan's own words). The lead's mechanical enumeration
// (every utility-prefixed scale member in src/ against the @theme pins
// block) finds ELEVEN more consumed-but-unpinned members — and unlike
// the achromatic neutral-900 (whose v4 oklch round-trips to the same
// #171717), the CHROMATIC members take the v4 oklch default TODAY: the
// pins block's own rule ("every palette scale the app consumes is
// pinned to the v3 hex") is falsified by the grep, and the
// reference-measured alert chrome (the login/reset cards' red/green
// borders, the RA-48 list-thumbnail gradient, the Revert orange) ships
// in v4's visibly-different palette. The F61 incomplete-family lesson
// recurring INSIDE the family-completion fix itself.
//
// THE FIX: the eleven members join the pins block with their v3 hex
// values — AND the enumeration itself becomes a MECHANISM (this
// spec): the consumed-vs-pinned difference must be EMPTY, so the
// block's own rule can never silently falsify again. The family count
// is a first-class fact of the plan (the F61 discipline), and now it
// is a first-class fact of the gate.

const ROOT = path.resolve(import.meta.dirname, "..");
const CSS_PATH = path.join(ROOT, "src", "app", "globals.css");
const css = readFileSync(CSS_PATH, "utf8");

/** The eleven S75-A members with their Tailwind v3 hex values. */
const PINS: Array<[string, string]> = [
  ["red-50", "#fef2f2"],
  ["red-200", "#fecaca"],
  ["red-300", "#fca5a5"],
  ["red-400", "#f87171"],
  ["green-50", "#f0fdf4"],
  ["green-200", "#bbf7d0"],
  ["blue-100", "#dbeafe"],
  ["blue-200", "#bfdbfe"],
  ["blue-800", "#1e40af"],
  ["orange-300", "#fdba74"],
  ["orange-400", "#fb923c"],
];

describe("the eleven consumed-but-unpinned scales join the pins block (S75-A)", () => {
  for (const [scale, hex] of PINS) {
    it(`--color-${scale} is pinned to the v3 hex ${hex}`, () => {
      // THE DEFECT PIN: pre-fix the member is absent from the pins
      // block while src/ consumes it — the v4 oklch default answers
      // instead (visibly different for every chromatic member).
      expect(css).toMatch(new RegExp(`--color-${scale}:\\s*${hex}`, "m"));
    });
  }

  it("the S74-G neutral-900 pin survives (the preservation pin)", () => {
    expect(css).toMatch(/--color-neutral-900:\s*#171717/);
  });

  it("the pins block documents the eleven-member family and the enumeration pin", () => {
    // The block's own comment must carry the family count honestly —
    // the S74-G comment's "the one consumed-but-unpinned scale" claim
    // was the family undercount this slice repairs.
    const marker = css.search(/reference-palette pins/i);
    expect(marker).toBeGreaterThan(-1);
    const block = css.slice(marker, css.indexOf("--color-neutral-900"));
    expect(block.length).toBeGreaterThan(0);
    expect(css).toMatch(/eleven/i);
  });
});

describe("the consumed-vs-pinned enumeration (the F61 family count as a mechanism)", () => {
  it("every utility-consumed scale member in src/ is pinned (the difference is empty)", () => {
    // THE DEFECT PIN: pre-fix the difference is the eleven-member set
    // (plus neutral-900 pre-S74-G). Post-fix it must be EMPTY — any
    // future consumed-but-unpinned member fails this check at the
    // gate, not at a visual audit twenty sessions later.
    const UTILITY_SCALE =
      /\b(?:bg|text|border|from|to|via|ring|placeholder|divide|accent|fill|stroke|outline|decoration|shadow)-(?:red|green|blue|orange|purple|pink|teal|cyan|amber|lime|indigo|violet|fuchsia|rose|yellow|neutral|gray|slate|zinc|stone)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/g;

    const consumed = new Set<string>();
    const srcDir = path.join(ROOT, "src");
    const walk = (dir: string): void => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\.ts$/.test(entry.name)) {
          const text = readFileSync(full, "utf8");
          for (const match of text.matchAll(UTILITY_SCALE)) {
            // Strip the utility prefix: "hover:bg-red-500/20" → "red-500"
            // (the opacity modifier and variant prefixes are not part of
            // the scale member).
            const member = match[0].replace(/^.*?:?([a-z]+)-/, "");
            consumed.add(member);
          }
        }
      }
    };
    walk(srcDir);

    const pinned = new Set<string>();
    for (const match of css.matchAll(/--color-([a-z]+-[0-9]+):/g)) {
      pinned.add(match[1]);
    }

    expect(consumed.size).toBeGreaterThan(20); // the sweep actually swept
    const unpinned = [...consumed].filter((member) => !pinned.has(member));
    expect(unpinned).toEqual([]);
  });
});
