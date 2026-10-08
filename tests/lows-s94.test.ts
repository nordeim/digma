import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-94 remediation — the FORTY-SECOND audit's chosen work:
//
// S94-A (the headline, A94-L1): the scrollbar-thumb token indirection —
// the S93-A migration's own completion at the one site it could not
// reach through a utility class. The .editor-scroll scrollbar-thumb rule
// hardcoded #30363d — the exact value --color-editor-border declares
// 146 lines above in the same file — so a future @theme token edit
// would leave the thumb painting the old color (the drift class the
// migration existed to close, surviving inside the migration's own
// theme file). The thumb now rides var(--color-editor-border) — the
// same indirection the .bg-editor-border utility itself uses; both
// forms compile to identical CSS, so no computed style can drift. The
// sibling hover keeps its reference-measured #484f58 (no token
// counterpart; the GitHub-dark hover state) WITH the provenance
// comment the .editor-range family already carries.
//
// S94-B (A94-I1): the arbitrary-hex closed-set inventory pin — the
// complete inventory of arbitrary-value hex classes in src/**/*.tsx is
// EXACTLY the three documented measured literals (bg-[#21262d] x2,
// the reference's assistant bubbles; hover:border-[#404040] x1, the
// image-dropzone hover border). One-off reference-measured values with
// no token counterpart — parity data, not chrome. The pin trips the
// day a fourth site appears; the AGENTS conventions bullet carries the
// exception record.
//
// S94-C (B94-I2): the ref-audit script's ordinal repair — the s94
// derivation left the s93 closing echo ("69th reference audit
// complete") while the header, the opening echo, and the evidence dir
// all carry the 70th; the delivered script must tell the truth about
// which audit it ran.

const GLOBALS = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/globals.css"),
  "utf8",
);
const REF_AUDIT_S94 = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s94.sh"),
  "utf8",
);
const AGENTS = readFileSync(
  path.resolve(import.meta.dirname, "../AGENTS.md"),
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

// Session 98 (S98-C — A98-L3, the in-commit repair): the arbitrary-value
// hex-class census rides the SYNTAX catch-all instead of a utility-prefix
// enumeration. The prefix list was blind to side-suffixed
// (border-b-[#hex]) and nested (shadow-[0_0_2px_#fff]) forms — the F84
// lesson's continuation: a census scoped by enumeration enumerates only
// the forms it knows. The dash-bracket form IS the arbitrary-value
// syntax (a utility's `-` before a bracket carrying a hex anywhere
// inside), so the catch-all is strictly more faithful at the same cost —
// the delivered count stays exactly the three documented measured
// literals (verified against the tree).
const HEX_CLASS = /-\[[^\]]*#[0-9a-fA-F]{3,8}[^\]]*\]/g;
const hexClassSites = SRC_TEXT.match(HEX_CLASS) ?? [];
const hexClassHexes = hexClassSites.map((m) => m.match(/#[0-9a-fA-F]{3,8}/)?.[0]);

// The S94 delivered counts — this file's 7 pins grow the suite
// 1158 -> 1165 unit / 155 -> 156 files (the F68/F70 discipline: the
// constants ride the count family's live anchor — the PAD §7.1 Unit-total
// row — so the whole family moves together in the same commit).
const UNIT = "1212";
const FILES = "160";

// ---------------------------------------------------------------------------
// S94-A — the scrollbar-thumb token indirection (the migration's own
// completion inside its theme file)
// ---------------------------------------------------------------------------

describe("the scrollbar-thumb token indirection (S94-A — the theme file rides its own token)", () => {
  it("the .editor-scroll scrollbar thumb references the editor-border token (no raw literal)", () => {
    // Pre-fix: the rule hardcoded #30363d — the exact value
    // --color-editor-border declares in the same file — so a future
    // token edit would leave the thumb painting the old color (the
    // S93-A rationale broken at its own theme file). The fix rides
    // var(--color-editor-border), the same indirection the
    // .bg-editor-border utility uses; both forms compile to identical
    // CSS (the built chunk emits --color-editor-border:#30363d at
    // :root — verified live).
    expect(GLOBALS).toMatch(
      /scrollbar-thumb\s*\{[^}]*background:\s*var\(--color-editor-border\)/,
    );
  });

  it("globals.css carries #30363d exactly once — the @theme definition (the single source)", () => {
    // Pre-fix: TWICE — the @theme token definition (:42) + the
    // scrollbar thumb's raw literal (:189). After the indirection the
    // theme file holds the value in exactly one place: the token. (The
    // TSX chrome carries zero raw forms since S93-A; the PAD's
    // reference-measurement records are parity DATA, not chrome, and
    // live in the docs.)
    const occurrences = GLOBALS.match(/#30363d/g) ?? [];
    expect(occurrences.length).toBe(1);
    expect(GLOBALS).toMatch(/--color-editor-border:\s*#30363d/);
  });

  it("SURVIVAL: the hover's reference-measured #484f58 stays, with its provenance comment", () => {
    // Green both sides — the hover value has NO token counterpart (the
    // GitHub-dark hover state, reference-measured), so it stays a
    // literal; the section comment documents the provenance (the
    // .editor-range convention: measured literals carry their record
    // inline). The word "measured" within the scrollbar section's
    // comment is the provenance witness.
    expect(GLOBALS).toMatch(
      /scrollbar-thumb:hover\s*\{[^}]*background:\s*#484f58/,
    );
    const section = GLOBALS.slice(
      GLOBALS.indexOf("Custom scrollbar"),
      GLOBALS.indexOf("Editor range inputs"),
    );
    expect(section).toMatch(/measured/i);
  });
});

// ---------------------------------------------------------------------------
// S94-B — the arbitrary-hex closed-set inventory pin (A94-I1)
// ---------------------------------------------------------------------------

describe("the arbitrary-hex closed-set inventory (S94-B — the three documented measured literals)", () => {
  it("the COMPLETE arbitrary-value hex class inventory in src/ is exactly the three documented sites", () => {
    // Green by design — a tripwire, not a defect pin: the inventory is
    // the closed set of reference-measured one-off values (no token
    // counterparts): bg-[#21262d] x2 (the assistant bubble + the
    // "Working on it..." bubble, ai-assistant.tsx:523/:556) and
    // hover:border-[#404040] x1 (the image-dropzone hover border,
    // properties-panel.tsx:874, recorded verbatim in the PAD). The
    // day a FOURTH site appears, this pin goes RED and the newcomer
    // must either join a token or join this spec's documented set
    // (the F78 class-census discipline applied to the class
    // vocabulary — the family cannot silently grow).
    // Session 98 (S98-C): the census now rides the dash-bracket
    // catch-all — the matched span is the `-[...]` tail, so the hex
    // members are asserted through the extracted-hex array.
    expect(hexClassSites.length).toBe(3);
    expect(hexClassHexes.filter((h) => h === "#21262d").length).toBe(2);
    expect(hexClassHexes.filter((h) => h === "#404040").length).toBe(1);
    expect(hexClassSites.every((s) => s.startsWith("-["))).toBe(true);
  });

  it("SURVIVAL + the doc record: the measured literals stay in source and AGENTS names the exception set", () => {
    // Green both sides — the parity data survives (the bubbles keep
    // their measured background; the dropzone keeps its measured
    // hover border), and the AGENTS conventions bullet records the
    // exception set with its provenance (the doc half of the closed
    // set: the tree and the record cannot drift apart silently).
    expect(SRC_TEXT).toContain("bg-[#21262d]");
    expect(SRC_TEXT).toContain("hover:border-[#404040]");
    expect(AGENTS).toMatch(/#21262d/);
    expect(AGENTS).toMatch(/#404040/);
  });
});

// ---------------------------------------------------------------------------
// S94-C — the ref-audit script's ordinal repair (B94-I2)
// ---------------------------------------------------------------------------

describe("the ref-audit script's ordinal repair (S94-C — the delivered script tells the truth)", () => {
  it("ref-audit-s94.sh carries the 70th ordinal everywhere (no 69th survives)", () => {
    // Pre-fix: the closing echo (:112) still read "69th reference audit
    // complete" — the s93->s94 derivation missed the one ordinal site
    // while the header, the opening echo, and the evidence dir
    // (ref-audit-s104/) all carried the 70th. The F78 honesty class at
    // the tooling layer: the script's own output must not misattribute
    // the audit it ran.
    expect(REF_AUDIT_S94).toContain("70th reference audit complete");
    expect(REF_AUDIT_S94).not.toMatch(/69th/);
  });
});

// ---------------------------------------------------------------------------
// The count family's S94 delivered totals (the live-anchor discipline —
// the F78(a) closure: any future count change must move every shape in
// the same commit or this file goes RED).
// ---------------------------------------------------------------------------

describe("the S94 delivered count totals (this file's 7 pins grow the suite)", () => {
  it("the delivered constants equal the PAD §7.1 Unit-total row (the live anchor — the family moves together)", () => {
    // RED pre-fix by construction: the §7.1 row still reads the S93
    // delivery's 1158 / 155 files until the S94-D docs pass re-anchors
    // it to this file's grown totals (1165 / 156).
    const padFiles = PAD.match(/\| \*\*Unit total\*\* \| \*\*(\d+) files\*\*/)?.[1];
    const padTests = PAD.match(
      /\| \*\*Unit total\*\* \| \*\*\d+ files\*\* \| \*\*(\d+)\*\*/,
    )?.[1];
    expect(FILES).toBe(padFiles);
    expect(UNIT).toBe(padTests);
  });
});
