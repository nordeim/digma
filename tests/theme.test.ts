import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The @theme contract (pinned after the v1.5.0 font bug):
//
// Tailwind v4 is CSS-first — tokens are declared in a plain `@theme` block in
// src/app/globals.css. Two hard rules, both born from observed bugs:
//
// 1. FONT TOKENS MUST BE LITERAL FONT NAMES. The first six sessions shipped
//    `--font-sans: var(--font-inter), …` — the var() chain SURVIVES the build
//    (it lands in `:root { … }`) but BREAKS at runtime: next/font defines
//    --font-inter via a class on <body>, and CSS custom properties resolve
//    their var() references at computed-value time PER ELEMENT. At :root the
//    reference is undefined, so --font-sans computed to guaranteed-invalid,
//    `font-family: var(--font-sans)` fell back to the UA serif default
//    ("Times New Roman"), and every descendant INHERITED the broken value.
//    Symptom: the whole app rendered serif and Inter never loaded — in dev
//    AND in the production standalone build. The fix (and this pin): the
//    literal chain `"Inter", "Inter Fallback", ui-sans-serif, …` — @font-face
//    families are document-global, so literals resolve at :root.
// 2. COLOR TOKENS MUST BE LITERAL HEX. var() chains inside a plain @theme are
//    dropped by the current v4 build (the Scandi Haven lesson).
//
// 3. There must never be a legacy tailwind.config.js (the #1 "flat/minimal
//    look" bug — v4 ignores it for @theme).

const repoRoot = path.resolve(import.meta.dirname, "..");
const cssPath = path.join(repoRoot, "src", "app", "globals.css");
const css = readFileSync(cssPath, "utf8");

/** Extracts the body of the first plain `@theme { … }` block. */
function themeBlock(source: string): string {
  const start = source.indexOf("@theme");
  if (start === -1) throw new Error("no @theme block found in globals.css");
  const open = source.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth++;
    if (source[i] === "}") {
      depth--;
      if (depth === 0) return source.slice(open + 1, i);
    }
  }
  throw new Error("unterminated @theme block");
}

/** Returns the declared value of `--<name>` inside the theme block. */
function tokenValue(name: string): string {
  const match = css.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!match) throw new Error(`--${name} not found in globals.css`);
  return match[1].trim();
}

describe("the @theme contract (Tailwind v4 CSS-first)", () => {
  it("declares --font-sans as LITERAL font names — no var(--font-inter) chain", () => {
    const value = tokenValue("font-sans");
    // The runtime-breaking pattern: a var() reference resolved at :root where
    // the referenced variable does not exist (next/font scopes it to <body>).
    expect(value).not.toMatch(/var\(--font-inter\)/);
    // The literal Inter family (registered globally by next/font's @font-face)
    // must lead the chain so :root resolves it without any indirection.
    expect(value).toMatch(/^"Inter"/);
  });

  it("keeps every font in the chain resolvable at :root (no element-scoped var() references)", () => {
    const value = tokenValue("font-sans");
    expect(value).not.toMatch(/var\(/);
  });

  it("declares color tokens as LITERAL hex values (var() chains are dropped by the v4 build)", () => {
    const theme = themeBlock(css);
    const declarations = theme.match(/--[\w-]+:\s*[^;]+;/g) ?? [];
    const offenders = declarations.filter(
      (line) => !line.startsWith("--font-") && line.includes("var("),
    );
    expect(offenders, `color/space tokens using var(): ${offenders.join(" | ")}`).toEqual([]);
  });

  it("ships no legacy tailwind.config.js (CSS-first only)", () => {
    for (const name of [
      "tailwind.config.js",
      "tailwind.config.ts",
      "tailwind.config.mjs",
      "tailwind.config.cjs",
    ]) {
      expect(existsSync(path.join(repoRoot, name)), name).toBe(false);
    }
  });
});

describe("the editor slider contract (session 15 — the reference's Radix look)", () => {
  // The reference's properties-panel sliders are Radix sliders measured at
  // DOM level: a 6px rounded-full track of rgba(23,23,23,0.2) with a solid
  // rgb(23,23,23) fill span, and a 16px white thumb with a 1px
  // rgba(23,23,23,0.5) border (shadow measured transparent at rest). The
  // clone ships the same LOOK on native range inputs via the .editor-range
  // class in globals.css (zero-dependency, keyboard-accessible), with the
  // fill length driven by the --range-fill custom property each input sets.
  // Before session 15 the panel sliders were bare accent-blue-600 inputs
  // (blue platform thumbs — a VLM-confirmed visible difference on zoom crops
  // of both apps).

  const panelPath = path.join(repoRoot, "src", "components", "editor", "properties-panel.tsx");
  const panelSource = readFileSync(panelPath, "utf8");

  it("defines the .editor-range track/thumb rules with the measured reference values", () => {
    expect(css, ".editor-range rules missing from globals.css").toMatch(
      /\.editor-range\s*\{/,
    );
    // The webkit thumb: 16px white circle with the measured border.
    expect(css).toMatch(/\.editor-range::-webkit-slider-thumb\s*\{/);
    expect(css).toMatch(/height:\s*16px/);
    expect(css).toMatch(/width:\s*16px/);
    expect(css).toMatch(/background:\s*#fff/);
    expect(css).toMatch(/border:\s*1px solid rgba\(23,\s*23,\s*23,\s*0\.5\)/);
    // The webkit track: 6px rounded with the two-tone fill gradient.
    expect(css).toMatch(/\.editor-range::-webkit-slider-runnable-track\s*\{/);
    expect(css).toMatch(/border-radius:\s*9999px/);
    expect(css).toMatch(/rgba\(23,\s*23,\s*23,\s*0\.2\)/);
    expect(css).toMatch(/#171717/);
    // Firefox equivalents (the progress pseudo carries the fill).
    expect(css).toMatch(/\.editor-range::-moz-range-track\s*\{/);
    expect(css).toMatch(/\.editor-range::-moz-range-thumb\s*\{/);
  });

  it("the panel's range inputs use editor-range, not the old accent-blue-600", () => {
    // Every range input in the panel carries the class. (A plain
    // /<input[^>]*>/ regex stops at the `>` inside the JSX arrow functions,
    // so we window the 400 chars that FOLLOW each type="range" marker —
    // the className/style always land inside that window.)
    const afterMarkers = panelSource.split('type="range"').slice(1);
    expect(afterMarkers.length).toBeGreaterThanOrEqual(4);
    for (const after of afterMarkers) {
      // Session 62 (S62-A — a legitimate contract update): the window
      // widens 400 -> 600 — the slider gesture seam added four pointer
      // handlers between type and className on every range input; the
      // className is still on the SAME input element.
      const chunk = after.slice(0, 600);
      expect(chunk, `unstyled range input near: ${chunk.slice(0, 60)}`).toMatch(
        /editor-range/,
      );
      expect(chunk).not.toMatch(/accent-blue-600/);
    }
  });
});
