import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-95 remediation — the FORTY-THIRD audit's chosen work:
//
// S95-A (the headline, A95-L1): the .editor-range track-fill token
// indirection — the F81 recurrence outside the editor-* family. The
// -webkit-slider-runnable-track gradient stop and the
// -moz-range-progress background hardcoded #171717 — the exact value
// --color-neutral-900 declares 84 lines above in the same file, and
// which the 4 bg-neutral-900 view-toggle sites consume live — so a
// future re-pin of the token would edit the toggles while the slider
// fill silently kept the old value (the drift class S94-A closed for
// the scrollbar thumb; the s94 sweep enumerated only the editor-*
// family, and this sibling family escaped). Both solid paint sites now
// ride var(--color-neutral-900) — the same indirection the
// .bg-neutral-900 utility itself uses; both forms compile to identical
// CSS, so no computed style can drift. The rgba(23, 23, 23, …) alpha
// literals keep their reference-measured values WITH the provenance
// comment (the #484f58 convention — no token counterpart).
//
// S95-B (A95-L2): the --color-editor-text zero-consumer honesty — the
// token is defined (globals.css:43), documented (README + PAD rows
// claiming "Editor text" usage), and pinned by the palette survival
// specs, but grep finds ZERO consumers (no text-editor-text utility, no
// var() reference); the editor's text chrome paints via the measured
// text-gray-300/text-gray-400/text-white utilities (29/28/52 sites).
// The token STAYS (the palette is real and ready); the doc rows now
// record the state honestly, and the usage claim may return the same
// commit a consumer lands (the S91-B IFF form, adapted: a
// defined-but-unconsumed token is not a defect — a doc row CLAIMING
// usage it doesn't have is).
//
// S95-C (A95-L3): the PAD §5 stale rows — the font row documented the
// pre-v1.5.0 BUG form ("--font-sans: var(--font-inter), …" as "the one
// place var() is legitimate in v4") while the tree ships the
// literal-names fix (pinned by tests/theme.test.ts, told by the PAD's
// own ADR-004a); the destructive row + README's status line carried
// #ef4444/#EF4444 while the tree has carried #dc2626 since S61-A (the
// AA-contrast fix, 4.83:1). Three one-line re-anchors.
//
// S95-D (A95-I2): the canvas onPointerUp none-guard — the handler is
// bound to onPointerUp/onPointerLeave/onPointerCancel, so every plain
// hover-out ran the tail setDrag({kind:"none"}) with a fresh object
// identity: one redundant shell re-render per leave. The guard is the
// exact onPointerMove:215 form, provably safe (with kind === "none"
// every branch skips and the only effect is the same-value write).

const GLOBALS = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/globals.css"),
  "utf8",
);
const CANVAS = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const AGENTS = readFileSync(
  path.resolve(import.meta.dirname, "../AGENTS.md"),
  "utf8",
);
const README = readFileSync(
  path.resolve(import.meta.dirname, "../README.md"),
  "utf8",
);
const PAD = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);

// The S95 delivered counts — this file's 9 pins grow the suite
// 1165 -> 1174 unit / 156 -> 157 files (the F68/F70 discipline: the
// constants ride the count family's live anchor — the PAD §7.1 Unit-total
// row — so the whole family moves together in the same commit).
const UNIT = "1271";
const FILES = "163";

// ---------------------------------------------------------------------------
// S95-A — the .editor-range track-fill token indirection (the F81
// recurrence outside the editor-* family)
// ---------------------------------------------------------------------------

describe("the .editor-range track-fill token indirection (S95-A — the sibling family the s94 sweep missed)", () => {
  it("the two solid .editor-range paint sites reference the neutral-900 token (no raw literal)", () => {
    // Pre-fix: the webkit gradient stop (:219) and the -moz-range-progress
    // background (:242) hardcoded #171717 — the exact value
    // --color-neutral-900 declares at :135, consumed live by the 4
    // bg-neutral-900 view-toggle sites. The fix rides
    // var(--color-neutral-900) at both sites, the same indirection the
    // utility itself uses; both forms compile to identical CSS (the token
    // is consumed, hence emitted at :root).
    expect(GLOBALS).toMatch(
      /to right,\s*var\(--color-neutral-900\) var\(--range-fill, 0%\)/,
    );
    expect(GLOBALS).toMatch(
      /-moz-range-progress\s*\{[^}]*background:\s*var\(--color-neutral-900\)/,
    );
  });

  it("globals.css carries #171717 exactly once — the @theme definition (the single source)", () => {
    // Pre-fix: FOUR — the @theme token definition (:135) + the section
    // comment's hex mention (:203) + the two paint sites (:219/:242).
    // After the indirection AND the comment's token-vocabulary reword,
    // the theme file holds the value in exactly one place: the token.
    // (The TSX chrome carries zero raw forms for this value; the docs'
    // reference-measurement records are parity DATA, not chrome.)
    const occurrences = GLOBALS.match(/#171717/g) ?? [];
    expect(occurrences.length).toBe(1);
    expect(GLOBALS).toMatch(/--color-neutral-900:\s*#171717/);
  });

  it("SURVIVAL: the rgba(23, 23, 23, …) measured literals stay, with the provenance comment", () => {
    // Green both sides — the alpha variants have NO token counterpart
    // (the reference's own track/tick rgba forms, measured), so they stay
    // literals; the section comment documents the provenance (the
    // #484f58 convention: measured literals carry their record inline —
    // the word "measured" within the section is the provenance witness).
    expect(GLOBALS).toMatch(/rgba\(23, 23, 23, 0\.2\)/);
    expect(GLOBALS).toMatch(/rgba\(23, 23, 23, 0\.5\)/);
    const section = GLOBALS.slice(
      GLOBALS.indexOf("Editor range inputs"),
      GLOBALS.indexOf("Editor scroll") >= 0
        ? GLOBALS.indexOf("Editor scroll")
        : undefined,
    );
    expect(section).toMatch(/measured/i);
    expect(section).toMatch(/neutral-900/);
  });
});

// ---------------------------------------------------------------------------
// S95-B — the --color-editor-text zero-consumer honesty (the doc rows
// record the state; the token stays)
// ---------------------------------------------------------------------------

describe("the editor-text token's honest record (S95-B — defined, currently unconsumed)", () => {
  it("the README + PAD usage rows record the unconsumed state (no bare usage claim)", () => {
    // Pre-fix: README's design-system row read "| `--color-editor-text` |
    // `#e6edf3` | Editor text |" and the PAD's §5.1/§5.2 rows carried the
    // same usage claim — while grep finds ZERO consumers (the text chrome
    // paints via the measured text-gray-300/400/white utilities). The
    // F78 doc-claim-as-second-copy class: a maintainer following the row
    // adopts a utility nothing pins, and the doc claims usage the tree
    // doesn't have. The honest record names the state + the measured
    // actual + the IFF return clause.
    const readmeRow = README.split("\n").find((l) =>
      l.includes("`--color-editor-text`"),
    );
    expect(readmeRow).toBeTruthy();
    expect(readmeRow).toMatch(/unconsumed/i);
    expect(readmeRow).toMatch(/text-gray/);

    const padUsageRows = PAD.split("\n").filter(
      (l) =>
        l.includes("`--color-editor-text`") &&
        l.includes("|") &&
        !l.includes("destructive-foreground"),
    );
    expect(padUsageRows.length).toBeGreaterThanOrEqual(2);
    for (const row of padUsageRows) {
      expect(row).toMatch(/unconsumed/i);
    }

    // The AGENTS conventions bullet carries the S95 record (the fourth
    // member's state, named with the IFF return clause).
    expect(AGENTS).toMatch(/--color-editor-text/);
    expect(AGENTS).toMatch(/currently unconsumed/);
  });

  it("SURVIVAL: the editor-text token stays defined in the palette (the token is real and ready)", () => {
    // Green both sides — the fix never deletes the token: the palette's
    // survival pins (doc-lows-s91, editor-utilities-s93) require the four
    // members defined, and a defined-but-unconsumed token is not a defect
    // (it is ready the day a consumer arrives). This scoped mirror keeps
    // the S95-B doc repair from ever sliding into a token deletion.
    expect(GLOBALS).toMatch(/--color-editor-text:\s*#e6edf3/);
  });
});

// ---------------------------------------------------------------------------
// S95-C — the PAD §5 stale rows re-anchor (the font row + the destructive
// rows; the F77 stale-row class)
// ---------------------------------------------------------------------------

describe("the PAD §5 stale rows re-anchor (S95-C — the tree is the truth)", () => {
  it("the destructive rows carry #dc2626 — the S61-A AA-contrast fix (no stale #ef4444)", () => {
    // Pre-fix: PAD's §5.2 row read "| `--color-destructive` | `#ef4444` |
    // destructive actions |" and README's status line "red `#EF4444`
    // (destructive)" — while the tree has carried #dc2626 since S61-A
    // (the 3.76:1 → 4.83:1 AA fix, documented at globals.css:31 and in
    // the PAD's own S61-A record). 33 sessions of staleness; the rows now
    // match the tree.
    const padDestructiveRow = PAD.split("\n").find(
      (l) => l.includes("| `--color-destructive` |"),
    );
    expect(padDestructiveRow).toBeTruthy();
    expect(padDestructiveRow).toMatch(/#dc2626/);
    expect(padDestructiveRow).not.toMatch(/#ef4444/i);

    const readmeStatus = README.split("\n").find((l) =>
      l.startsWith("Status colors:"),
    );
    expect(readmeStatus).toBeTruthy();
    expect(readmeStatus).toMatch(/#dc2626/);
    expect(readmeStatus).not.toMatch(/#EF4444/);
  });

  it("the PAD §5.1 font row carries the literal-names record (not the pre-v1.5.0 bug form)", () => {
    // Pre-fix: the row claimed "`@theme --font-sans: var(--font-inter),
    // ui-sans-serif, system-ui, …` — the one place `var()` is legitimate
    // in v4" — the exact form the v1.5.0 fix removed (a var() chain
    // inside @theme breaks at runtime when next/font scopes the variable
    // to <body>; tests/theme.test.ts pins the literal-names contract; the
    // PAD's own ADR-004a tells the story). The row now records the fix.
    const fontRow = PAD.split("\n").find((l) =>
      l.includes("| Everything | Inter"),
    );
    expect(fontRow).toBeTruthy();
    expect(fontRow).not.toMatch(/var\(--font-inter\)/);
    expect(fontRow).toMatch(/literal/i);
  });
});

// ---------------------------------------------------------------------------
// S95-D — the canvas onPointerUp none-guard (the micro-perf row)
// ---------------------------------------------------------------------------

describe("the canvas onPointerUp none-guard (S95-D — the onPointerMove sibling form)", () => {
  it("onPointerUp starts with the kind === \"none\" early return (no redundant shell re-render per hover-out)", () => {
    // Pre-fix: the handler ran its full tail setDrag({kind:"none"}) on
    // every plain pointerleave — a fresh object identity, so the shell
    // re-rendered for nothing (memoized children bail; the shell is the
    // cost). The guard is provably safe: with kind === "none" every
    // branch (draw/marquee/move/resize) skips and the only effect is the
    // same-value write. The exact onPointerMove:215 form.
    const idx = CANVAS.indexOf("function onPointerUp()");
    expect(idx).toBeGreaterThanOrEqual(0);
    const head = CANVAS.slice(idx, idx + 400);
    expect(head).toMatch(/if \(drag\.kind === "none"\) return;/);
  });
});

// ---------------------------------------------------------------------------
// The count family's S95 delivered totals (the live-anchor discipline —
// the F78(a) closure: any future count change must move every shape in
// the same commit or this file goes RED).
// ---------------------------------------------------------------------------

describe("the S95 delivered count totals (this file's 9 pins grow the suite)", () => {
  it("the delivered constants equal the PAD §7.1 Unit-total row (the live anchor — the family moves together)", () => {
    // RED pre-fix by construction: the §7.1 row still reads the S94
    // delivery's 1165 / 156 files until the S95-E docs pass re-anchors
    // it to this file's grown totals (1174 / 157).
    const padFiles = PAD.match(/\| \*\*Unit total\*\* \| \*\*(\d+) files\*\*/)?.[1];
    const padTests = PAD.match(
      /\| \*\*Unit total\*\* \| \*\*\d+ files\*\* \| \*\*(\d+)\*\*/,
    )?.[1];
    expect(FILES).toBe(padFiles);
    expect(UNIT).toBe(padTests);
  });
});
