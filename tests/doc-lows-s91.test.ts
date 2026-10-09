import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-91 doc-honesty batch — the THIRTY-NINTH audit's chosen work:
//
// S91-A (B91-L1 + B91-L2, the headline): the F77 delivery's own twin —
// the S90-D "across every live claim site" count update missed TWO live
// claim sites in shapes the count-family grep had never reached: the
// digma_SKILL §12 verification cheat-sheet's INLINE COMMENT-COUNT form
// ("bun run test          # 1123/1123") and the PAD appendix
// COMMAND-TABLE row form ("unit tests (1123 checks / 151 files)") —
// while the delivered reality was 1131/152 and both auditors' own runs
// reproduced it. Plus the session-90 DIMENSION count's internal
// inconsistency (B91-L2): AGENTS' session-90 seam bullet and
// docs/session_139.md both claimed "488/488" while the live checker,
// the worklog, and the session-90 commit message all said 491/491 —
// the doc sites were drafted before the s100 glob + the clone-48 entry
// landed in the checker's mapping.
//
// S91-B (A91-L1): the editor-* doctrine's zero-consumer honesty — three
// doctrine sites (AGENTS' conventions bullet, CLAUDE's editor-chrome
// line, digma_SKILL's palette line + its anti-pattern listing) prescribed
// the `editor-*` Tailwind utilities ("use them … instead of re-typing
// #0d1117 hex" / "not raw hex" / "never re-type the hex") while grep
// finds ZERO consumers in src/ (the shipped chrome carries the raw
// arbitrary-value hexes — both forms compile to identical CSS, so the
// byte-measured reference datums cannot drift, but the doctrine is a
// claim falsified by grep). The fix: the honest ZERO-consumers record at
// every site + the IFF pin below — the marker may only stand while it is
// TRUE, and the unqualified claim may only return the day the first
// consumer lands in the same commit.

const AGENTS = readFileSync(path.resolve(import.meta.dirname, "../AGENTS.md"), "utf8");
const CLAUDE = readFileSync(path.resolve(import.meta.dirname, "../CLAUDE.md"), "utf8");
const PAD = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const SKILL = readFileSync(path.resolve(import.meta.dirname, "../digma_SKILL.md"), "utf8");
const SESSION139 = readFileSync(
  path.resolve(import.meta.dirname, "../docs/session_139.md"),
  "utf8",
);
const GLOBALS = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/globals.css"),
  "utf8",
);

// The S91 delivered counts — this file's 10 pins grow the suite
// 1131 -> 1141 unit / 152 -> 153 files (the F68/F70 discipline: the
// constants are pinned against the PAD §7.1 total row below, so the
// whole count family moves together in the same commit).
// Session 93 (S93-E): re-anchored — 1158 unit / 155 files (the s93
// delivery's editor-utilities-s93 +8).
// Session 92 (S92-E): re-anchored — 1150 unit / 154 files (the s92
// delivery's lows-s92 +9); the intents (the docs carry the DELIVERED
// counts, the family moves together) unchanged.
const UNIT = "1292";
const FILES = "164";

// ---------------------------------------------------------------------------
// The consumer probe (A91-L1's evidence base): a recursive walk of src/
// counting the files that actually USE an editor-* utility. The token
// DEFINITIONS in globals.css (--color-editor-*) are custom properties,
// not utility usages — the regex below matches only the class-name forms
// (bg-editor-bg, border-editor-border, …) and cannot match them.
// ---------------------------------------------------------------------------

function walkSources(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) {
      out.push(...walkSources(p));
    } else if (/\.(tsx|ts)$/.test(name)) {
      out.push(readFileSync(p, "utf8"));
    }
  }
  return out;
}

const SRC_SOURCES = walkSources(path.resolve(import.meta.dirname, "../src"));
const EDITOR_UTILITY =
  /(?:bg|border|text|divide|ring|fill|stroke|outline|decoration|from|to|via|shadow|accent|caret)-editor-(?:bg|panel|border|text)\b/;
const consumerFiles = SRC_SOURCES.filter((s) => EDITOR_UTILITY.test(s));
const consumerCount = consumerFiles.length;

// ---------------------------------------------------------------------------
// S91-A — the count-family honesty batch (the two shapes the S90-D grep
// missed + the dimension count's internal consistency)
// ---------------------------------------------------------------------------

describe("the count-family honesty batch (S91-A — the two shapes the S90-D grep missed)", () => {
  it("digma_SKILL's §12 verification cheat-sheet carries the delivered unit count (the inline comment-count form, B91-L1)", () => {
    // The line S90-D's "every live claim site" grep never reached: an
    // inline comment-count inside the cheat-sheet code block, not a
    // table row and not prose. Pre-fix it read "# 1123/1123".
    const line = SKILL.split("\n").find((l) => /^bun run test\s+#/.test(l));
    expect(line).toBeDefined();
    expect(line).toMatch(new RegExp(`#\\s*${UNIT}/${UNIT}`));
  });

  it("PAD's appendix command table carries the delivered unit count (the command-table row form, B91-L1)", () => {
    // The second missed shape: an appendix table ROW whose count rides a
    // parenthetical. Pre-fix it read "(1123 checks / 151 files)".
    const row = PAD.split("\n").find((l) =>
      l.includes("`bun run test` / `bun run test:watch`"),
    );
    expect(row).toBeDefined();
    expect(row).toMatch(new RegExp(`unit tests \\(${UNIT} checks / ${FILES} files\\)`));
  });

  it("AGENTS' session-90 seam bullet carries the live dimension count (491/491 — the checker's own number, B91-L2)", () => {
    // The live checker at the session-90 tree printed "checked 491
    // shots / ALL DIMENSIONS OK"; the worklog and the session-90 commit
    // message both record 491. The bullet's 488 was drafted before the
    // s100 glob + the clone-48 entry landed in the checker's mapping.
    expect(AGENTS).toMatch(/dimensions 491\/491/);
  });

  it("session_139's capture record carries the live dimension count (dimension-checked 491/491, B91-L2)", () => {
    expect(SESSION139).toMatch(/dimension-checked \*\*491\/491\*\*/);
  });

  it("the delivered constants equal the PAD §7.1 Unit-total row (the live anchor — the family moves together)", () => {
    const padFiles = PAD.match(/\| \*\*Unit total\*\* \| \*\*(\d+) files\*\*/)?.[1];
    const padTests = PAD.match(
      /\| \*\*Unit total\*\* \| \*\*\d+ files\*\* \| \*\*(\d+)\*\*/,
    )?.[1];
    expect(FILES).toBe(padFiles);
    expect(UNIT).toBe(padTests);
  });
});

// ---------------------------------------------------------------------------
// S91-B — the editor-* doctrine honesty (A91-L1, the zero-consumer
// conditional: the marker may only stand while it is true)
// ---------------------------------------------------------------------------

describe("the editor-* doctrine honesty (S91-B — A91-L1)", () => {
  it("AGENTS' conventions bullet: the ZERO-consumers record stands iff it is true, and the unqualified claim cannot ride a zero-consumer tree", () => {
    expect(/ZERO consumers/.test(AGENTS)).toBe(consumerCount === 0);
    if (consumerCount === 0) {
      expect(AGENTS).not.toMatch(/instead of re-typing/);
    }
  });

  it("CLAUDE's editor-chrome line: the same iff contract", () => {
    expect(/ZERO consumers/.test(CLAUDE)).toBe(consumerCount === 0);
    if (consumerCount === 0) {
      expect(CLAUDE).not.toMatch(/, not raw hex\./);
    }
  });

  it("digma_SKILL's editor-palette line: the same iff contract (the 'never re-type' form)", () => {
    expect(/ZERO consumers/.test(SKILL)).toBe(consumerCount === 0);
    if (consumerCount === 0) {
      expect(SKILL).not.toMatch(/never re-type the hex/);
    }
  });

  it("digma_SKILL's anti-pattern listing matches the adoption state (S93: the migration landed — the ACTIVATED form)", () => {
    // The anti-pattern "Hardcoded hex in editor chrome when `editor-*`
    // utilities exist" was itself a zero-consumer claim at S91 — an
    // anti-pattern nothing could violate — so the conditioned
    // ("once … have consumers") form stood while consumerCount === 0.
    // The S93-A migration landed the consumers: the IFF contract now
    // requires the ACTIVATED, unconditioned form (the arbitrary-value
    // hex is the anti-pattern; the utilities carry the chrome).
    if (consumerCount === 0) {
      expect(SKILL).toMatch(/once `editor-\*` utilities have consumers/);
    } else {
      expect(SKILL).toMatch(
        /Hardcoded hex in editor chrome when `editor-\*` utilities exist/,
      );
    }
  });

  it("SURVIVAL: the @theme editor palette stays defined (the four tokens — the palette is real)", () => {
    expect(GLOBALS).toMatch(/--color-editor-bg:\s*#0d1117/);
    expect(GLOBALS).toMatch(/--color-editor-panel:\s*#161b22/);
    expect(GLOBALS).toMatch(/--color-editor-border:\s*#30363d/);
    expect(GLOBALS).toMatch(/--color-editor-text:\s*#e6edf3/);
  });
});
