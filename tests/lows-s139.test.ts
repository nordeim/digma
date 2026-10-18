import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-139 spec (the eighty-seventh audit's chosen work):
//
// S139-A — THE DISPATCH-BRIEF CENSUS-SCOPING REGISTRATION (A139-I1): the
//   s139 dispatch brief's census phrasing pinned scopes it did not name —
//   "patchDiffers in src/ (expect exactly 11)" is true only at the PANEL
//   scope (src/ at large carries 13: the panel's 11 + editor-store.ts:383
//   the S115-A value-diff guard + ai-assistant.tsx:403 the S105-B
//   truth-row compare, both long-documented siblings); and "the flush
//   census: flushIdleBurst call sites (expect exactly 3)" conflated the
//   two flush censuses — flushIdleBurst() carries exactly 2 consumers
//   (ai-assistant.tsx:212, editor-view.tsx:795) while the 3 is the
//   resetSliderGesture() flush census in canvas.tsx (:221/:284/:804).
//   Every figure live-true at its pinned scope; only the SCOPE unnamed
//   (the A138-I1 brief-lineage class at its CENSUS-SCOPING shape). The
//   registration: the worklog's bracketed s139-dispatch-brief-census-note
//   + these census-decomposition pins — the count-truth doctrine's
//   census-scoping member: a census COUNT is live truth only at its
//   named SCOPE, name the scope beside the count.
//
// S139-B — THE RESIZE-HANDLE KEYBOARD-POSTURE REGISTRATION (A139-I2):
//   the canvas resize handles' pointer-only posture — never registered
//   in the prior eighty-six audits' a11y sweeps. canvas.tsx renders the
//   eight 8×8 handles as un-focusable divs with role="presentation"
//   carrying pointer handlers and no keyboard path to the handle drag;
//   the keyboard surface for the same mutations lives entirely in the
//   properties panel (W/H/X/Y, Radius, Rotation, Scale/Opacity — the
//   same clamped values, the S129-A keyboard arm) — the
//   equivalent-but-different-path posture; the reference is pointer-only
//   too (parity). The registration: the worklog's bracketed
//   s139-resize-handle-keyboard-posture-note + these posture pins.
//
// S139-C — THE PAD CLAIM-SITE ENUMERATION REGISTRATION (B139-I1): the
//   count-family claim-site enumeration must name ALL FOUR PAD sites —
//   the revision entry (the live Last-Updated chain head), the §8 Unit
//   total row, the §7.4 Pre-PR/Pre-Deploy Checklist row, and the §9.2
//   command-table row (the s138-era record named only three; every
//   figure was live-true, only the enumeration incomplete — the A138-I1
//   brief-lineage class at its ENUMERATION-COMPLETENESS shape). The
//   registration: the worklog's bracketed s139-pad-claim-site-note +
//   these four-site pins (each site carrying the live count — the
//   enumeration-completeness member: count the claim SITES, not just
//   the figures).
//
// S139-D — THE SMOKE-ARITHMETIC REGISTRATION (B139-I2): the compressed
//   smoke derivation "68 single-execution ok sites + 4 + 3 = 73" does
//   not sum (68+4+3 = 75). Live truth: 68 TOTAL ok-invocation lines, of
//   which 66 are single-execution — the :197 wrong-code site fires ×4
//   inside its `for i in 1 2 3 4` loop, the :363 endpoint site fires ×3
//   inside its `for ENDPOINT in stats projects teams` loop — 66+4+3 =
//   73. The "68" is a true figure for the wrong quantity. The
//   registration: the worklog's bracketed s139-smoke-arithmetic-note +
//   these arithmetic pins — a decomposed derivation must sum.
//
// The script family (the S118-C convention, s139 form): the s139
//   parity scripts ride their OWN tokens (live139 / nav139 /
//   digma-seo-s139.log, the 115th audit / 116th session / 76th clip
//   ordinals, the S138 delivery at HEAD 45db29a), never the frozen
//   s138 forms.

const worklogSource = readFileSync(
  path.resolve(import.meta.dirname, "../worklog.md"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const agentsSource = readFileSync(
  path.resolve(import.meta.dirname, "../AGENTS.md"),
  "utf8",
);
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const editorViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const aiAssistantSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const editorStoreSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const editorSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const schemaSource = readFileSync(
  path.resolve(import.meta.dirname, "../prisma/schema.prisma"),
  "utf8",
);
const smokeSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/smoke-test.sh"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s139.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s139.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s139.sh"),
  "utf8",
);

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The live line count of a repo file (the F101 live-pin doctrine) —
 *  the `wc -l` semantics (newline-char count), so a trailing newline
 *  never adds a phantom row the way split("\n").length does (the
 *  s138 RED-phase spec repair). */
const lineCount = (rel: string) =>
  (readFileSync(path.resolve(import.meta.dirname, rel), "utf8").match(/\n/g) ?? [])
    .length;

/** The src-wide patchDiffers census — a genuine recursive scan of every
 *  non-test src/ file (the census-scoping doctrine: the src-wide count
 *  derived from the tree, never from the panel scope alone). */
const srcWidePatchDiffers = (() => {
  const dir = path.resolve(import.meta.dirname, "../src");
  const files = readdirSync(dir, { recursive: true })
    .filter((f) => typeof f === "string" && /\.(tsx|ts)$/.test(f) && !f.endsWith(".test.ts"))
    .map((f) => path.join(dir, f as string));
  return files.reduce(
    (n, f) => n + ((readFileSync(f, "utf8").match(/patchDiffers\(/g) ?? []).length),
    0,
  );
})();

// ---------------------------------------------------------------------------
// S139-A — the dispatch-brief census-scoping registration (A139-I1)
// ---------------------------------------------------------------------------

describe("S139-A the dispatch-brief census-scoping registration (A139-I1 — the scope named beside the count)", () => {
  it("DEFECT (worklog): the bracketed s139-dispatch-brief-census-note registers the census decomposition — the panel 11 / src-wide 13 with the two siblings, the flush decomposition 2-vs-3", () => {
    const noteAt = worklogSource.indexOf("s139-dispatch-brief-census-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 2400);
    // The decomposition named: patchDiffers 11-at-panel / 13-src-wide.
    expect(collapsed(note)).toMatch(/patchDiffers/);
    expect(collapsed(note)).toMatch(/11/);
    expect(collapsed(note)).toMatch(/13/);
    // The two siblings named at their files.
    expect(collapsed(note)).toMatch(/editor-store\.ts/);
    expect(collapsed(note)).toMatch(/ai-assistant\.tsx/);
    // The flush decomposition: flushIdleBurst 2 consumers vs
    // resetSliderGesture 3 canvas sites.
    expect(collapsed(note)).toMatch(/flushIdleBurst/);
    expect(collapsed(note)).toMatch(/resetSliderGesture/);
    // The finding's shape: every figure live-true at its pinned scope.
    expect(collapsed(note)).toMatch(/A139-I1/);
    expect(collapsed(note)).toMatch(/scope/i);
    expect(collapsed(note)).toMatch(/live-true/i);
    // The doctrine named (the count-truth family extended).
    expect(collapsed(note)).toMatch(/count-truth|F124|F125/i);
  });

  it("SURVIVAL (source): the census decomposition live — the panel 11, the src-wide 13 with the two siblings, flushIdleBurst 2 consumers, resetSliderGesture 3 canvas sites", () => {
    // The panel scope.
    const panel = panelSource.match(/patchDiffers\(/g) ?? [];
    expect(panel.length).toBe(11);
    // The src-wide census (recursive, non-test): 13 = the panel's 11 +
    // the editor-store sibling + the ai-assistant sibling.
    expect(srcWidePatchDiffers).toBe(13);
    expect((editorStoreSource.match(/patchDiffers\(/g) ?? []).length).toBe(1);
    expect((aiAssistantSource.match(/patchDiffers\(/g) ?? []).length).toBe(1);
    // The flush decomposition: flushIdleBurst carries exactly 2
    // consumers (the panel's own export is the definition, not a call).
    expect(panelSource).toContain("export const flushIdleBurst");
    expect((editorViewSource.match(/flushIdleBurst\(\);/g) ?? []).length).toBe(1);
    expect((aiAssistantSource.match(/flushIdleBurst\(\);/g) ?? []).length).toBe(1);
    // The resetSliderGesture flush census in canvas.tsx: exactly 3.
    const flush = canvasSource.match(/resetSliderGesture\(\);/g) ?? [];
    expect(flush.length).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// S139-B — the resize-handle keyboard-posture registration (A139-I2)
// ---------------------------------------------------------------------------

describe("S139-B the resize-handle keyboard-posture registration (A139-I2 — the equivalent-but-different-path posture on the record)", () => {
  it("DEFECT (worklog): the bracketed s139-resize-handle-keyboard-posture-note registers the pointer-only posture — the panel's keyboard surface named as the equivalent path", () => {
    const noteAt = worklogSource.indexOf("s139-resize-handle-keyboard-posture-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 2400);
    // The posture named: pointer-only, role="presentation".
    expect(collapsed(note)).toMatch(/pointer-only/i);
    expect(collapsed(note)).toMatch(/role="presentation"/);
    // The equivalent path named: the properties-panel keyboard surface.
    expect(collapsed(note)).toMatch(/properties[- ]panel/i);
    expect(collapsed(note)).toMatch(/keyboard/i);
    // The tradeoff + the parity posture named.
    expect(collapsed(note)).toMatch(/equivalent-but-different-path/i);
    expect(collapsed(note)).toMatch(/A139-I2/);
    expect(collapsed(note)).toMatch(/parity/i);
  });

  it("SURVIVAL (source): the handle census live — eight HANDLES, the pointer-only presentation form, no keyboard wiring on the handle map, the panel's keyboard surface present", () => {
    // The census: exactly eight handles.
    const handlesBlock = canvasSource.slice(
      canvasSource.indexOf("const HANDLES:"),
      canvasSource.indexOf("];", canvasSource.indexOf("const HANDLES:")),
    );
    const ids = handlesBlock.match(/\{ id: "/g) ?? [];
    expect(ids.length).toBe(8);
    // The handle map: pointer-only — role="presentation", an
    // onPointerDown wiring, and NO tabIndex/onKeyDown/aria-label inside
    // the handle map block.
    const mapStart = canvasSource.indexOf("HANDLES.map((handle) => (");
    expect(mapStart).toBeGreaterThan(-1);
    const mapBlock = canvasSource.slice(mapStart, mapStart + 2400);
    expect(mapBlock).toContain('role="presentation"');
    expect(mapBlock).toContain("onPointerDown");
    expect(mapBlock).not.toMatch(/tabIndex/);
    expect(mapBlock).not.toMatch(/onKeyDown/);
    // The equivalent keyboard surface lives in the properties panel:
    // the guarded number inputs + the S129-A slider keyboard arm.
    expect(panelSource).toContain("function GuardedNumberInput(");
    expect(panelSource).toContain("const SLIDER_KEYS = new Set([");
    expect(panelSource).toMatch(/armText\("field"\)/);
  });
});

// ---------------------------------------------------------------------------
// S139-C — the PAD claim-site enumeration registration (B139-I1)
// ---------------------------------------------------------------------------

describe("S139-C the PAD claim-site enumeration registration (B139-I1 — all four count-family sites enumerated and live)", () => {
  it("DEFECT (worklog): the bracketed s139-pad-claim-site-note registers the FOUR PAD count-family sites — the enumeration-completeness member", () => {
    const noteAt = worklogSource.indexOf("s139-pad-claim-site-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 2000);
    // The four sites named (the revision entry, §8, §7.4, §9.2).
    expect(collapsed(note)).toMatch(/B139-I1/);
    expect(collapsed(note)).toMatch(/revision entry/i);
    expect(collapsed(note)).toMatch(/§8|8\b/);
    expect(collapsed(note)).toMatch(/§7\.4|7\.4/);
    expect(collapsed(note)).toMatch(/§9\.2|9\.2/);
    expect(collapsed(note)).toMatch(/four/i);
    // The doctrine named: count the claim SITES, not just the figures.
    expect(collapsed(note)).toMatch(/enumeration-completeness|claim sites/i);
  });

  it("DEFECT (docs): the count re-anchor — the v1.118.0 chain entry retains the S139 derivation (the FROZEN record) + the §7.1 row for the s139 spec + the AGENTS session-139 bullet carries the LIVE ANCHOR (the s140 rolling-safe repair: the live-sites figures ROLL every cycle — the pin now guards the FROZEN delivery record and the spec row, the live-pair anchoring moving to the latest cycle's rolling-safe pair-unity pins)", () => {
    // Site 1 — the revision entry: the v1.118.0 chain entry (the S139
    // delivery's own record, FROZEN per the F106 live-claim-sites-only
    // doctrine — retained verbatim below whatever head is live).
    expect(padSource).toContain("v1.118.0");
    expect(padSource).toContain("1977 = 1965 + 12 unit / 201 files");
    // The §7.1 row for the s139 spec (never rolls).
    expect(padSource).toContain("| `tests/lows-s139.test.ts` | 12 | tests | Vitest |");
    // The AGENTS session-139 bullet carries the LIVE ANCHOR (frozen).
    expect(agentsSource).toMatch(/session 139, S139-A\.\.S139-E/);
    expect(agentsSource).toMatch(/1977 = 1965 \+ 12 unit \/ 201 files/);
  });
});

// ---------------------------------------------------------------------------
// S139-D — the smoke-arithmetic registration (B139-I2)
// ---------------------------------------------------------------------------

describe("S139-D the smoke-arithmetic registration (B139-I2 — a decomposed derivation must sum)", () => {
  it("DEFECT (worklog): the bracketed s139-smoke-arithmetic-note registers the decomposition — 66 single-execution + 4 + 3 = 73, with 68 named as the TOTAL ok-line count", () => {
    const noteAt = worklogSource.indexOf("s139-smoke-arithmetic-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 2000);
    // The decomposition named: 66+4+3 = 73.
    expect(collapsed(note)).toMatch(/B139-I2/);
    expect(collapsed(note)).toMatch(/66\+4\+3|66 \+ 4 \+ 3/);
    expect(collapsed(note)).toMatch(/68/);
    // The finding's shape: a true figure for the wrong quantity.
    expect(collapsed(note)).toMatch(/sum/i);
  });

  it("SURVIVAL (script): the decomposition live against smoke-test.sh — 68 total ok-lines, the ×4 loop site, the ×3 loop site, 66+4+3 = 73", () => {
    // The total ok-invocation line census.
    const okLines = smokeSource.match(/(^|&& )ok "/gm) ?? [];
    expect(okLines.length).toBe(68);
    // The ×4 loop site: the wrong-code check inside its 4-iteration loop.
    expect(smokeSource).toContain('ok "wrong code $i reads');
    expect(smokeSource).toContain("for i in 1 2 3 4; do");
    // The ×3 loop site: the endpoint check inside its 3-iteration loop.
    expect(smokeSource).toContain('ok "GET /api/$ENDPOINT envelope"');
    expect(smokeSource).toContain("for ENDPOINT in stats projects teams; do");
    // The arithmetic: (68 − 2 loop-parameterized lines) + 4 + 3 = 73.
    const single = okLines.length - 2;
    expect(single).toBe(66);
    expect(single + 4 + 3).toBe(73);
  });
});

// ---------------------------------------------------------------------------
// The standing survival set — the S138/S137 deliveries ride unchanged
// ---------------------------------------------------------------------------

describe("the standing survival set (the S138/S137 deliveries ride unchanged through the S139 registrations)", () => {
  it("SURVIVAL (tree): the S138-A path-truth delivery rides unchanged — the five true paths with the §11 figures exact", () => {
    expect(lineCount("../src/components/editor/editor-store.ts")).toBe(840);
    expect(lineCount("../tests/e2e/parity.spec.ts")).toBe(1013);
    expect(lineCount("../tests/e2e/mobile-navigation.spec.ts")).toBe(159);
    expect(lineCount("../tests/theme.test.ts")).toBe(160);
    expect(lineCount("../tests/brand-mark.test.ts")).toBe(86);
  });

  it("SURVIVAL (docs): the live command tables carry NO bare `playwright --list` form — the S138-B delivery", () => {
    expect(agentsSource).toMatch(/\| Browser E2E \(262 checks; needs a build\) \| `bun run test:e2e` \|/);
    expect(padSource).toMatch(/\| `bun run test:e2e` \| repo root \| Playwright suite/);
    const agentsTableRows = agentsSource.split("\n").filter((l) => l.startsWith("|"));
    for (const row of agentsTableRows) {
      expect(row).not.toMatch(/playwright --list/);
    }
    const s92Start = padSource.indexOf("### 9.2 Common Commands");
    expect(s92Start).toBeGreaterThan(-1);
    const s92End = padSource.indexOf("### 9.3", s92Start);
    expect(s92End).toBeGreaterThan(s92Start);
    const s92 = padSource.slice(s92Start, s92End);
    for (const row of s92.split("\n").filter((l) => l.startsWith("|"))) {
      expect(row).not.toMatch(/playwright --list/);
    }
  });

  it("SURVIVAL (source): the S137-A repaired enumeration + the S137-B 25-field census ride unchanged", () => {
    const fnAt = panelSource.indexOf("function guardedUpdate(");
    expect(fnAt).toBeGreaterThan(-1);
    const w = panelSource.slice(Math.max(0, fnAt - 2000), fnAt);
    expect(w).toMatch(/S137-A/);
    expect(w).toMatch(/PositionSize\/CornerRadius\/Text\/Transform\/Opacity/);
    expect(w).toMatch(/FillStrokeSection/);
    const buildAt = editorSource.indexOf("export function buildElementRow(");
    expect(buildAt).toBeGreaterThan(-1);
    const typeStart = editorSource.indexOf("): {", buildAt);
    const typeEnd = editorSource.indexOf("} {", typeStart);
    const fields = [
      ...editorSource.slice(typeStart, typeEnd).matchAll(/^\s+([a-zA-Z]+)\??:/gm),
    ].map((m) => m[1]);
    expect(fields.length).toBe(25);
    expect(fields).toContain("fillImageThumb");
    const modelStart = schemaSource.indexOf("model DesignElement {");
    const modelEnd = schemaSource.indexOf("\n}", modelStart);
    const model = schemaSource.slice(modelStart, modelEnd);
    const columnLines = model
      .split("\n")
      .filter((l) => /^\s{2}[a-zA-Z]+\s+[A-Za-z]/.test(l) && !l.includes("@relation"));
    const writable = columnLines
      .map((l) => (/^\s{2}([a-zA-Z]+)/.exec(l))![1])
      .filter((c) => !["id", "projectId", "createdAt", "updatedAt"].includes(c));
    expect(writable.length).toBe(25);
    expect(new Set(fields)).toEqual(new Set(writable));
  });

  it("SURVIVAL (scripts): the s139 parity scripts ride their own tokens — live139/nav139/digma-seo-s139, the 115th/116th/76th ordinals, the S138 delivery at HEAD 45db29a, zero s138 residue", () => {
    expect(refAuditSource).toContain("--session live139");
    expect(refAuditSource).toMatch(/115th reference audit/);
    expect(refAuditSource).toContain("45db29a");
    expect(refAuditSource).toContain("'clip=[Share:L385-R458,Present:L466-R551]'");
    expect(refAuditSource).toMatch(/76th/);
    expect(refAuditSource).not.toContain("live138");
    expect(refAuditSource).not.toContain("114th");
    expect(refAuditSource).not.toContain("s148");
    expect(navSource).toContain("nav139");
    expect(navSource).toMatch(/116th session/);
    expect(navSource).not.toContain("nav138");
    expect(navSource).not.toContain("115th session");
    expect(seoSource).toContain("digma-seo-s139");
    expect(seoSource).toMatch(/session 139, S139-cycle/);
    expect(seoSource).not.toContain("seo-s138");
    expect(seoSource).not.toContain("session 138, S138-cycle");
  });
});
