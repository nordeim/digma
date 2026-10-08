import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-96 remediation — the FORTY-FOURTH audit's chosen work:
//
// S96-A (the headline, A96-L1): the TSX INLINE-STYLE member of the
// F81/F82 token-value duplication family — the one scope BOTH standing
// sweeps miss. The S94-B closed-set pin covers arbitrary-value CLASSES;
// the S95-A generalized question covers NON-TSX (plain-CSS) sites; TSX
// style={{…}} literals escape both. Two chrome sites painted consumed
// tokens' values as inline-style literals: the editor avatar chip's
// backgroundColor "#3B82F6" (--color-blue-500's exact value, globals.css:72,
// consumed live by 15+ utility sites) and the team-swatch ring's
// borderColor "#111827"/"#E5E7EB" (--color-gray-900's and
// --color-gray-200's exact values, globals.css:115/:108, consumed live by
// 20 text-gray-900 and 30 border-gray-200 sites). A future @theme re-pin
// would edit every utility site and silently miss these two literals.
// Both sites now ride var(--color-blue-500)/var(--color-gray-900)/
// var(--color-gray-200) — identical computed CSS (the parity e2e pins
// read computed styles, which pass through the indirection unchanged).
// The Sarah chip #10B981 (editor-view.tsx) is NOT a fix site — no token
// counterpart (--color-green-500 is #22c55e); it is the reference's
// verbatim bundle-decoded RA-41 datum, staying a literal WITH its
// standing provenance comment (the #484f58 convention). TEAM_COLORS is
// data-layer (identity-compared color === c), not chrome.
//
// S96-B (B96-L1): the s96 scripts' ordinal repairs — the S94-C form
// ("the delivered script tells the truth"). Both derived scripts
// carried a stale session-log ordinal in their baseline description:
// ref-audit-s96.sh said "the session_147 log push" (carried verbatim
// from the s95 form) and verify-nav-s96.sh said "the session_149 log
// push" — while the tree both scripts audited is ef44dc7 = the S95
// delivery 6da294a + the session_150 log push (git-verified: af8a5e0
// pushed session_148.md, 6da294a itself carried session_149.md, and
// ef44dc7 pushed session_150.md).
//
// S96-C (A96-I1): the canvas selection-ring provenance comment — the
// rgba(59, 130, 246, 0.9) boxShadow is blue-500's RGB at 0.9 alpha, the
// clone's working-superset selection paint (the reference's ring
// classes are overridden by its serialized box-shadow: none — PAD:1375);
// a measured literal with no token counterpart, now carrying the
// provenance comment at the site (the #484f58 convention's comment
// half; the VALUE keeps).

const EDITOR_VIEW = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const TEAMS_VIEW = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/teams-view.tsx"),
  "utf8",
);
const CANVAS = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const REF_AUDIT_S96 = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s96.sh"),
  "utf8",
);
const VERIFY_NAV_S96 = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s96.sh"),
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

/** Walk src/ collecting every .tsx source (the app code, not tests/e2e). */
function walkTsx(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkTsx(full));
    else if (/\.tsx$/.test(entry.name)) out.push(full);
  }
  return out;
}

const TSX_FILES = walkTsx(path.resolve(import.meta.dirname, "../src"));

// The inline-style hex literal inventory — the closed set this spec
// pins. Pre-fix count 3 (verified against the tree): the avatar chip's
// #3B82F6, the swatch ring's #111827 + #E5E7EB, and the Sarah datum's
// #10B981. Post-fix: exactly the one documented datum site (no token
// counterpart, provenance-commented). The day a second literal site
// appears, this pin goes RED and the newcomer must either join a token
// or join this spec's documented set (the F78 class-census discipline
// applied at the THIRD scope — classes, plain CSS, now inline styles).
//
// Session 97 (S97-A — A97-M1, the census repair): the original regex
// form (/style=\{\{[^}]*#hex[^}]*\}\}/) was structurally BLIND to two
// forms — a multi-line style object whose template literals carry }
// (rotate(${el.rotation}deg) terminates [^}]* early) and a style object
// built as a local variable (style.<prop> = ... — no style={{ token at
// all) — so the pin passed VACUOUSLY over the text-fill fallback trio
// the S97 seam then consolidated onto FALLBACK_WHITE. The repaired
// census walks BALANCED BRACES from every style={{ token (template-
// literal braces are balanced pairs the walker crosses) and scans the
// variable-form assignment lines beside it — the faithful form, the
// "the delivered pin tells the truth" doctrine (the S94-C form).
function inlineStyleSpans(text: string): string[] {
  const spans: string[] = [];
  let i = 0;
  while (true) {
    const start = text.indexOf("style={{", i);
    if (start === -1) break;
    let depth = 0;
    let j = start + "style=".length; // at the first '{'
    for (; j < text.length; j++) {
      if (text[j] === "{") depth++;
      else if (text[j] === "}") {
        depth--;
        if (depth === 0) break;
      }
    }
    spans.push(text.slice(start, Math.min(j + 1, text.length)));
    i = j + 1;
  }
  return spans;
}

const INLINE_HEX = /#[0-9a-fA-F]{3,8}\b/g;
const inlineHexSites: string[] = [];
for (const f of TSX_FILES) {
  const text = readFileSync(f, "utf8");
  for (const span of inlineStyleSpans(text)) {
    const hexes = span.match(INLINE_HEX) ?? [];
    if (hexes.length > 0) inlineHexSites.push(`${hexes.join(",")}`);
  }
  for (const ln of text.split("\n")) {
    if (/style\.\w+\s*=/.test(ln)) {
      const hexes = ln.match(INLINE_HEX) ?? [];
      if (hexes.length > 0) inlineHexSites.push(`${hexes.join(",")} (variable form)`);
    }
  }
}

// The S96 delivered counts — this file's 9 pins grow the suite
// 1174 -> 1183 unit / 157 -> 158 files (the F68/F70 discipline: the
// constants ride the count family's live anchor — the PAD §7.1 Unit-total
// row — so the whole family moves together in the same commit).
const UNIT = "1196";
const FILES = "159";

// ---------------------------------------------------------------------------
// S96-A — the TSX inline-style token indirection (the F81/F82 class at
// the scope both standing sweeps miss)
// ---------------------------------------------------------------------------

describe("the TSX inline-style token indirection (S96-A — the third scope of the token census)", () => {
  it("the editor avatar chip rides var(--color-blue-500) (no raw literal)", () => {
    // Pre-fix: editor-view.tsx:1716 painted backgroundColor: "#3B82F6" —
    // the exact value --color-blue-500 declares at globals.css:72 while
    // 15+ utility sites consume the token live. The fix rides the same
    // indirection the .from-blue-500/.border-blue-500 utilities use;
    // identical computed CSS (rgb(59, 130, 246) — the parity.spec.ts:520
    // pin passes through the indirection unchanged).
    expect(EDITOR_VIEW).toMatch(
      /backgroundColor:\s*"var\(--color-blue-500\)"/,
    );
    expect(EDITOR_VIEW).not.toMatch(
      /backgroundColor:\s*"#3B82F6"/,
    );
  });

  it("the team-swatch ring rides var(--color-gray-900)/var(--color-gray-200) (no raw literals)", () => {
    // Pre-fix: teams-view.tsx:395 painted borderColor:
    // color === c ? "#111827" : "#E5E7EB" — the exact values of the
    // consumed --color-gray-900 (globals.css:115; 20 text-gray-900
    // sites) and --color-gray-200 (globals.css:108; 30 border-gray-200
    // sites). No e2e pin reads the ring; identical computed CSS.
    expect(TEAMS_VIEW).toMatch(
      /borderColor:\s*color === c \? "var\(--color-gray-900\)" : "var\(--color-gray-200\)"/,
    );
    expect(TEAMS_VIEW).not.toMatch(/borderColor:[^}]*#111827/);
    expect(TEAMS_VIEW).not.toMatch(/borderColor:[^}]*#E5E7EB/);
  });

  it("the inline-style hex inventory in src/ TSX is exactly the one documented datum site (the closed set)", () => {
    // The tripwire form (the S94-B precedent applied at the inline-style
    // scope): the ONLY literal hex in a TSX inline style is the Sarah
    // datum #10B981 — the reference's verbatim bundle-decoded identity
    // (RA-41), no token counterpart (--color-green-500 is #22c55e),
    // provenance-commented above its site. TEAM_COLORS and the
    // member-avatar styles are data-layer (dynamic values, identity-
    // compared), not chrome literals; the text-fill fallback family
    // rides the FALLBACK_WHITE constant (S97-A — identifiers, not
    // literals — so the census stays blind to nothing).
    expect(inlineHexSites.length).toBe(1);
    expect(inlineHexSites[0]).toContain("#10B981");
  });

  it("SURVIVAL + the datum record: the Sarah chip keeps its verbatim color and its provenance", () => {
    // Green both sides — the reference's verbatim identity datum
    // survives the token migration (the parity data stays; only the
    // chrome literals moved to the tokens), and the standing
    // provenance comment stays above the site.
    expect(EDITOR_VIEW).toMatch(/backgroundColor:\s*"#10B981"/);
    expect(EDITOR_VIEW).toMatch(/Sarah UI/);
    expect(EDITOR_VIEW).toMatch(/RA-41|bundle-decoded/);
  });
});

// ---------------------------------------------------------------------------
// S96-B — the s96 scripts' ordinal repairs (the delivered scripts tell
// the truth — the S94-C form)
// ---------------------------------------------------------------------------

describe("the s96 scripts' ordinal repairs (S96-B — the baseline tree is the session_150 log push)", () => {
  it("ref-audit-s96.sh names the session_150 log push (no stale session_147)", () => {
    // Pre-fix: the derivation carried "the session_147 log push"
    // verbatim from the s95 form. Git truth: the audited tree ef44dc7
    // = the S95 delivery 6da294a + the session_150 log push (af8a5e0
    // pushed session_148.md; 6da294a itself carried session_149.md).
    expect(REF_AUDIT_S96).toMatch(
      /S95 delivery at HEAD 6da294a \+ the session_150 log push/,
    );
    expect(REF_AUDIT_S96).not.toMatch(/session_147/);
  });

  it("verify-nav-s96.sh names the session_150 log push (no stale session_149)", () => {
    // Pre-fix: "the session_149 log push" — off by one the same way
    // (session_149.md rode the delivery commit itself; the log push
    // ef44dc7 carried session_150.md).
    expect(VERIFY_NAV_S96).toMatch(
      /the S95 delivery \+ the session_150 log push/,
    );
    expect(VERIFY_NAV_S96).not.toMatch(/session_149 log push/);
  });
});

// ---------------------------------------------------------------------------
// S96-C — the canvas selection-ring provenance comment (the #484f58
// convention's comment half)
// ---------------------------------------------------------------------------

describe("the canvas selection-ring provenance comment (S96-C — the measured literal names its source)", () => {
  it("the rgba(59, 130, 246, 0.9) boxShadow carries the provenance comment at the site", () => {
    // Pre-fix: the value painted without any comment naming its
    // relationship — blue-500's RGB at 0.9 alpha, the clone's working-
    // superset selection paint (the reference's ring classes are
    // overridden by its serialized box-shadow: none — PAD:1375). The
    // VALUE keeps; the comment records the measured-literal provenance
    // (the S95-A convention for rgba literals).
    const idx = CANVAS.indexOf(
      'boxShadow: selected ? "0 0 0 2px rgba(59, 130, 246, 0.9)"',
    );
    expect(idx).toBeGreaterThan(-1);
    const before = CANVAS.slice(Math.max(0, idx - 400), idx);
    expect(before).toMatch(/blue-500/i);
    expect(before).toMatch(/measured|superset|provenance/i);
  });

  it("SURVIVAL + the value keeps: the selection ring still paints the measured rgba (no token rewrite)", () => {
    // Green both sides — the fix is comment-only; the measured
    // literal survives untouched (no token counterpart exists for the
    // alpha form).
    expect(CANVAS).toMatch(/rgba\(59, 130, 246, 0\.9\)/);
  });
});

// ---------------------------------------------------------------------------
// The count family's S96 delivered totals (the live-anchor discipline —
// the F78(a) closure: any future count change must move every shape in
// the same commit or this file goes RED).
// ---------------------------------------------------------------------------

describe("the S96 delivered count totals (this file's 9 pins grow the suite)", () => {
  it("the delivered constants equal the PAD §7.1 Unit-total row (the live anchor — the family moves together)", () => {
    // RED pre-fix by construction: the §7.1 row still reads the S95
    // delivery's 1174 / 157 files until the S96-D docs pass re-anchors
    // it to this file's grown totals (1183 / 158).
    const padFiles = PAD.match(/\| \*\*Unit total\*\* \| \*\*(\d+) files\*\*/)?.[1];
    const padTests = PAD.match(
      /\| \*\*Unit total\*\* \| \*\*\d+ files\*\* \| \*\*(\d+)\*\*/,
    )?.[1];
    expect(FILES).toBe(padFiles);
    expect(UNIT).toBe(padTests);
  });
});
