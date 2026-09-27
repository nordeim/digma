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
