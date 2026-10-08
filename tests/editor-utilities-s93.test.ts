import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-93 remediation — the FORTY-FIRST audit's chosen work:
//
// S93-A (the headline): the editor-* utility migration — the deferred
// queue's top row since S91, finally executed. Every editor-chrome
// arbitrary-value hex class replaced by its @theme token utility
// (bg-[#0d1117] -> bg-editor-bg; bg-[#161b22] -> bg-editor-panel;
// border-[#30363d] -> border-editor-border; bg-[#30363d] ->
// bg-editor-border — the border color doubling as the raised wash, the
// GitHub-dark semantics), so a future token edit propagates to every
// site. Both forms compile to identical CSS, so no computed style can
// drift. The S91-B IFF pin (doc-lows-s91) flips automatically: the
// ZERO-consumers markers go from the doctrine docs, the unqualified
// prefer-the-utilities claim returns, and the anti-pattern listing
// activates — all in this same commit.
//
// S93-B (A93-L1): the .safe-bottom dead-rule deletion + the honesty
// repair — the rule (zero consumers since the first commit) was recorded
// known-dead in the session-65/89 docs but silently fell out of the
// s90..s92 deferred-queue lists (the F78 honesty-drift class: a
// documented-dead item that neither went nor rides the queue).
//
// S93-C (A93-I1): the .scroll-thin inert-selector cleanup — the four
// never-adopted light-scrollbar selector prefixes go (the .editor-scroll
// sibling stays live).
//
// S93-D (B93-I3): the honest test-name re-anchor — auth.spec's
// "unknown API paths" name actually probes the login route's
// unknown-USER 401 envelope (the API-path 404 probe lives in the smoke
// suite); the name now says what the body does.

const GLOBALS = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/globals.css"),
  "utf8",
);
const AUTH_SPEC = readFileSync(
  path.resolve(import.meta.dirname, "../tests/e2e/auth.spec.ts"),
  "utf8",
);
const PAD = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);

/** Walk src/ collecting every .ts/.tsx source (the app code, not tests/e2e). */
function walkSources(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkSources(full));
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const SRC_SOURCES = walkSources(path.resolve(import.meta.dirname, "../src"));
const SRC_TEXT = SRC_SOURCES.map((f) => readFileSync(f, "utf8")).join("\n");

// The four arbitrary-value class forms the migration retires (the exact
// shapes grep counted at 89 sites pre-fix across the 8 chrome files).
const RAW_HEX_CLASS =
  /(?:bg|border|text|divide|ring|fill|stroke|outline|decoration|shadow)-\[#(?:0d1117|161b22|30363d|e6edf3)\]/g;
const rawHexSites = (SRC_TEXT.match(RAW_HEX_CLASS) ?? []).length;

// The S93 delivered counts — this file's 8 pins grow the suite
// 1150 -> 1158 unit / 154 -> 155 files (the F68/F70 discipline: the
// constants ride the count family's live anchor — the PAD §7.1 Unit-total
// row — so the whole family moves together in the same commit).
const UNIT = "1196";
const FILES = "159";

// ---------------------------------------------------------------------------
// S93-A — the editor-* utility migration (the deferred queue's top row)
// ---------------------------------------------------------------------------

describe("the editor-* utility migration (S93-A — the chrome rides the @theme tokens)", () => {
  it("zero raw arbitrary-value editor hexes remain in the src/ sources (the 89-site sweep)", () => {
    // Pre-fix: 89 matches across toolbar/canvas/components-panel/
    // ai-assistant/layers-panel/properties-panel/editor-view/ui-select
    // (43 border + 23 panel-bg + 15 bg + 8 wash). The token utilities
    // compile to identical CSS, so the painted chrome cannot drift —
    // but the raw hexes would silently miss every future @theme edit
    // (the S91-B rationale: the doctrine and the tree cannot drift
    // apart silently).
    expect(rawHexSites).toBe(0);
  });

  it("the token utilities have consumers (every migrated form present in src/)", () => {
    // Pre-fix: ZERO consumers — the S91 honest record. The migration
    // lands bg-editor-bg, bg-editor-panel, border-editor-border, and
    // bg-editor-border (the raised-wash role the border color doubles
    // as — separators, hover/focus washes, the tablist track).
    expect(SRC_TEXT).toMatch(/bg-editor-bg\b/);
    expect(SRC_TEXT).toMatch(/bg-editor-panel\b/);
    expect(SRC_TEXT).toMatch(/border-editor-border\b/);
    expect(SRC_TEXT).toMatch(/bg-editor-border\b/);
  });

  it("SURVIVAL: the @theme editor palette stays defined with the exact reference hexes (the tokens are real)", () => {
    // Green both sides — the migration changes the CONSUMERS, never the
    // palette. The hexes are the reference-measured GitHub-dark values
    // (the byte-measured datums' single source).
    expect(GLOBALS).toMatch(/--color-editor-bg:\s*#0d1117/);
    expect(GLOBALS).toMatch(/--color-editor-panel:\s*#161b22/);
    expect(GLOBALS).toMatch(/--color-editor-border:\s*#30363d/);
    expect(GLOBALS).toMatch(/--color-editor-text:\s*#e6edf3/);
  });

  it("SURVIVAL: the reference-measurement hex records stay documented (the parity data is not the chrome)", () => {
    // Green both sides — the PAD's parity records keep the reference's
    // own measured chrome (the hex values the tokens carry), so a
    // future re-audit can still compare the measured datums. The
    // migration changes the clone's class vocabulary, never the
    // measurement data.
    expect(PAD).toMatch(/#0d1117/);
    expect(PAD).toMatch(/#30363d/);
  });
});

// ---------------------------------------------------------------------------
// S93-B — the .safe-bottom dead-rule deletion (A93-L1)
// ---------------------------------------------------------------------------

describe("the .safe-bottom dead-rule deletion (S93-B — no consumerless safe-area rule)", () => {
  it("no .safe-bottom rule exists anywhere in src/ (the rule never matched since the first commit)", () => {
    // The rule sat at globals.css:202-205 with zero consumers across 41
    // audits; the session-65/89 docs recorded it known-dead, but the
    // s90..s92 deferred queues silently dropped it — a documented-dead
    // item that neither went nor rode the queue (the F78 honesty-drift
    // class; remediation-plan-session93.md carries the repair record).
    expect(GLOBALS).not.toContain(".safe-bottom");
    expect(SRC_TEXT).not.toContain("safe-bottom");
  });
});

// ---------------------------------------------------------------------------
// S93-C — the .scroll-thin inert-selector cleanup (A93-I1)
// ---------------------------------------------------------------------------

describe("the .scroll-thin inert-selector cleanup (S93-C — the never-adopted light-scrollbar half goes)", () => {
  it("globals.css carries no .scroll-thin selector (the .editor-scroll sibling stays live)", () => {
    // Four selector prefixes (:182/:186/:190/:198) shared rule blocks
    // with the live .editor-scroll family; the light-thumb variant had
    // zero consumers since the first commit and was never named in any
    // session doc across 41 audits. The .editor-scroll consumer family
    // is pinned separately (client-lows-s77's transcript contract).
    expect(GLOBALS).not.toContain(".scroll-thin");
    expect(GLOBALS).toContain(".editor-scroll::-webkit-scrollbar");
  });
});

// ---------------------------------------------------------------------------
// S93-D — the honest test-name re-anchor (B93-I3)
// ---------------------------------------------------------------------------

describe("the honest test-name re-anchor (S93-D — the name says what the probe does)", () => {
  it("auth.spec carries no \"unknown API paths\" misnomer (the probe is the unknown-USER 401)", () => {
    // The test at auth.spec.ts:69 was named for the API-path envelope
    // family while its body probes the login route's unknown-user 401
    // (the 404-shape probe lives in the smoke suite). The name now
    // reads the honest form; the probe body is unchanged.
    expect(AUTH_SPEC).not.toMatch(/unknown API paths/);
    expect(AUTH_SPEC).toMatch(/unknown user/i);
  });
});

// ---------------------------------------------------------------------------
// The count family's S93 delivered totals (the live-anchor discipline —
// the F78(a) closure: any future count change must move every shape in
// the same commit or this file goes RED).
// ---------------------------------------------------------------------------

describe("the S93 delivered count totals (this file's 8 pins grow the suite)", () => {
  it("the delivered constants equal the PAD §7.1 Unit-total row (the live anchor — the family moves together)", () => {
    // RED pre-fix by construction: the §7.1 row still reads the S92
    // delivery's 1150 / 154 files until the S93-E docs pass re-anchors
    // it to this file's grown totals (1158 / 155).
    const padFiles = PAD.match(/\| \*\*Unit total\*\* \| \*\*(\d+) files\*\*/)?.[1];
    const padTests = PAD.match(
      /\| \*\*Unit total\*\* \| \*\*\d+ files\*\* \| \*\*(\d+)\*\*/,
    )?.[1];
    expect(FILES).toBe(padFiles);
    expect(UNIT).toBe(padTests);
  });
});
