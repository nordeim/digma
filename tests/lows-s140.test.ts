import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-140 spec (the eighty-eighth audit's chosen work):
//
// S140-A — THE FROZEN-RECORD CENSUS-SCOPING REGISTRATION (A140-I1): the
//   census-scoping class recurring at its FROZEN-RECORD shape — two prior
//   audit-record counts live-true only at scopes the phrases do not name.
//   (a) "commitUpload's aliveRef chain at all four heads" (the frozen
//   s136/s138/s139 audit-A records): the live chain carries FOUR links in
//   the enum sense the S123-B comment itself names (FileReader onload →
//   downscaleDataUrl → thumbnailFor → commitUpload) but exactly THREE
//   explicit guards — the two pure transforms (downscaleDataUrl,
//   thumbnailFor) land at the guarded terminal commitUpload. (b) the
//   "compare-and-adjust setState-in-render at all six sites" (the frozen
//   s138/s139 records): six is true at those audits' 19-file list scope;
//   at the 22-file list (recent-view.tsx promoted in) the layer count is
//   SEVEN (the S58-D sibling at recent-view.tsx:301-304). Blast radius
//   zero. The registration: the worklog's bracketed
//   s140-frozen-record-census-note + these decomposition pins — the
//   count-truth doctrine's frozen-record member: a frozen record's count
//   is live truth only at its named LIST; when the list grows, re-derive
//   the count.
//
// S140-B — THE COUNT-PAIR UNITY REGISTRATION (B140-I1): the s140 dispatch
//   brief's figure "the 1977/200 count-family" carried a STALE file-count
//   member — no live claim site carries 1977/200; all 15 sites carry 1977
//   checks / 201 files. Mechanism: the frozen s139-audit-B record carried
//   "1965/200" (live-true then); the brief updated the unit member without
//   the file member. The B139-I2 arithmetic shape's sibling: a count PAIR
//   is one claim, not two independently-editable figures. The
//   registration: the worklog's bracketed s140-count-pair-note + these
//   pair-unity pins (both members together at every live site, the
//   same-generation invariant on the co-occurring row).
//
// S140-C — THE COORDINATE-LIVENESS REGISTRATION (B140-I2): the brief's PAD
//   claim-site coordinates were the frozen pre-delivery snapshot —
//   ":7/:2755/:2814/:2883" vs the live ":6/:2757/:2816/:2885" (the S139
//   delivery's own +2 PAD growth moved every coordinate below the header
//   prepend). The A138-I1 brief-lineage class at its COORDINATE-STALENESS
//   shape. The registration: the worklog's bracketed
//   s140-coordinate-staleness-note + these content-derived PAD-site pins —
//   the doctrine: doc-site COORDINATES are live claims about doc layout;
//   derive them live at dispatch or name doc+section anchors only, never
//   quote stale line numbers.
//
// The script family (the S118-C convention, s140 form): the s140 parity
//   scripts ride their OWN tokens (live140 / nav140 / digma-seo-s140.log,
//   the 116th audit / 117th session / 77th clip ordinals, the S139
//   delivery at HEAD 6407d66), never the frozen s139 forms.

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
const claudeSource = readFileSync(
  path.resolve(import.meta.dirname, "../CLAUDE.md"),
  "utf8",
);
const readmeSource = readFileSync(
  path.resolve(import.meta.dirname, "../README.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const recentViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/recent-view.tsx"),
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
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s140.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s140.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s140.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  re-anchored onto the delivery counts by the doc-update script; the
 *  S140-B pair-unity pins read them so the pair stays ONE claim). */
const UNIT = "2709";
const FILES = "258";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The src-wide patchDiffers census — a genuine recursive scan of every
 *  non-test src/ file (the census-scoping doctrine, carried from s139). */
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

/** The SKILL's §11 Pre-Ship Checklist region (the live cheat-sheet —
 *  scoped so the frozen F78 lesson's historical form never matches). */
const skillChecklistRegion = (() => {
  const start = skillSource.indexOf("## §11 Pre-Ship Checklist");
  const end = skillSource.indexOf("## §12", start);
  return start === -1 || end === -1 ? "" : skillSource.slice(start, end);
})();

/** The PAD's live count-family rows, found by CONTENT (the S140-C
 *  doctrine: never by stale coordinates). */
const padUnitTotalRow = () =>
  padSource.split("\n").find((l) => l.includes("**Unit total**")) ?? "";
const padChecklistRow = () =>
  padSource.split("\n").find((l) => l.startsWith("- [ ] `bun run test` →")) ?? "";
const padCommandRow = () =>
  padSource
    .split("\n")
    .find((l) => l.includes("| `bun run test` / `bun run test:watch` |")) ?? "";

// ---------------------------------------------------------------------------
// S140-A — the frozen-record census-scoping registration (A140-I1)
// ---------------------------------------------------------------------------

describe("S140-A the frozen-record census-scoping registration (A140-I1 — the list named beside the frozen count)", () => {
  it("DEFECT (worklog): the bracketed s140-frozen-record-census-note registers BOTH decompositions — the aliveRef 4-links/3-guards and the setState-in-render 6-at-19/7-at-22 list-scoping", () => {
    const noteAt = worklogSource.indexOf("s140-frozen-record-census-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 2600);
    // The finding's shape: the census-scoping class at its frozen-record form.
    expect(collapsed(note)).toMatch(/A140-I1/);
    expect(collapsed(note)).toMatch(/frozen/i);
    // The aliveRef decomposition: 4 chain links vs 3 explicit guards.
    expect(collapsed(note)).toMatch(/aliveRef/);
    expect(collapsed(note)).toMatch(/S123-B/);
    expect(collapsed(note)).toMatch(/3 explicit guards|three explicit guards/i);
    // The two pure transforms named.
    expect(collapsed(note)).toMatch(/downscaleDataUrl/);
    expect(collapsed(note)).toMatch(/thumbnailFor/);
    // The setState-in-render list-scoping: 6 at the 19-file list, 7 at the
    // 22-file list, the recent-view sibling named.
    expect(collapsed(note)).toMatch(/setState-in-render/);
    expect(collapsed(note)).toMatch(/19-file/);
    expect(collapsed(note)).toMatch(/22-file/);
    expect(collapsed(note)).toMatch(/recent-view\.tsx/);
    // The doctrine named (the count-truth family extended).
    expect(collapsed(note)).toMatch(/count-truth|F124|F125/i);
    expect(collapsed(note)).toMatch(/list/i);
  });

  it("SURVIVAL (source): the aliveRef decomposition live — exactly 3 explicit guards, the S123-B comment's 4-link chain enum, the two pure transforms named in the comment", () => {
    // Exactly 3 explicit `if (!aliveRef.current) return;` guards.
    const guards = panelSource.match(/if \(!aliveRef\.current\) return;/g) ?? [];
    expect(guards.length).toBe(3);
    // The S123-B comment enumerates the FOUR-link chain by name.
    const commentAt = panelSource.indexOf("S123-B");
    expect(commentAt).toBeGreaterThan(-1);
    const comment = panelSource.slice(commentAt, commentAt + 900);
    expect(comment).toContain("FileReader onload");
    expect(comment).toContain("downscaleDataUrl");
    expect(comment).toContain("thumbnailFor");
    expect(comment).toContain("commitUpload");
    // The ref declaration + the reset/clear effect (the liveness pair).
    expect(panelSource).toContain("const aliveRef = React.useRef(true);");
    expect(panelSource).toMatch(/aliveRef\.current = true;/);
    expect(panelSource).toMatch(/aliveRef\.current = false;/);
  });

  it("SURVIVAL (source): the recent-view compare-and-adjust sibling live — the paramsKey/search sync (the S58-D form, the seventh site at the 22-file list scope)", () => {
    // The sanctioned compare-and-adjust form: a tracked-state compare
    // guarded setState-in-render (NOT inside an effect).
    expect(recentViewSource).toContain(
      'const [paramsKey, setParamsKey] = React.useState(params.toString());',
    );
    expect(recentViewSource).toContain("if (params.toString() !== paramsKey) {");
    expect(recentViewSource).toContain("setParamsKey(params.toString());");
    expect(recentViewSource).toContain('setSearch(params.get("search") ?? "");');
    // The S58-D attribution rides at the site.
    expect(recentViewSource).toContain("S58-D");
    // The render-time pattern named (the comment's own doctrine form).
    expect(recentViewSource).toMatch(/render-time compare-and-adjust/);
  });
});

// ---------------------------------------------------------------------------
// S140-B — the count-pair unity registration (B140-I1)
// ---------------------------------------------------------------------------

describe("S140-B the count-pair unity registration (B140-I1 — both members of a count pair move together)", () => {
  it("DEFECT (worklog): the bracketed s140-count-pair-note registers the pair unity — the stale 1977/200 split named, the live 1977/201 pair at every site, the one-claim doctrine", () => {
    const noteAt = worklogSource.indexOf("s140-count-pair-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 2200);
    // The finding's shape: the stale file-count member.
    expect(collapsed(note)).toMatch(/B140-I1/);
    expect(collapsed(note)).toMatch(/1977/);
    expect(collapsed(note)).toMatch(/200/);
    expect(collapsed(note)).toMatch(/201/);
    // The doctrine: a count PAIR is one claim.
    expect(collapsed(note)).toMatch(/pair/i);
    expect(collapsed(note)).toMatch(/one claim/i);
    // The mechanism named: the unit member updated without the file member.
    expect(collapsed(note)).toMatch(/without the file member|unit member/i);
  });

  it("SURVIVAL (docs): the count-pair unity live — every LIVE claim site carries the same checks member, every files-member site the same files member, the co-occurring PAD row same-generation (UNIT/FILES together)", () => {
    // The live checks-member forms across the five core docs (the exact
    // forms the doc-update script re-anchors every cycle — the frozen
    // derivation records ("N = N + N unit / N files") never match these).
    const checks = new Set<string>();
    const liveForms: Array<[string, RegExp]> = [
      [agentsSource, /Unit tests \((\d{4}) checks\)/g],
      [agentsSource, /`bun run test` \((\d{4})\)/g],
      [claudeSource, /Unit tests \((\d{4}) checks, Vitest\)/g],
      [claudeSource, /\((\d{4}) unit \/ 73 smoke \/ 262 e2e\)/g],
      [claudeSource, /\*\*Unit Tests\*\* \(Vitest, (\d{4}) checks\)/g],
      [readmeSource, /\| Unit tests \| Vitest \| 5 \| (\d{4}) checks/g],
      [readmeSource, /# unit tests — (\d{4}) checks/g],
      [skillSource, /project_state: "(\d{4}) unit checks green/g],
      [skillSource, /\| Unit tests \| Vitest \| ≥5\.0\.5 \| (\d{4}) checks/g],
      [skillChecklistRegion, /bun run test {2,}# (\d{4})\/\d{4}/g],
      [padSource, /- \[ \] `bun run test` → (\d{4})\/\d{4}/g],
      [padCommandRow(), /unit tests \((\d{4}) checks/g],
    ];
    let matched = 0;
    for (const [src, re] of liveForms) {
      for (const m of src.matchAll(re)) {
        checks.add(m[1]);
        matched += 1;
      }
    }
    // At least one live form per doc family matched, all agreeing.
    expect(matched).toBeGreaterThanOrEqual(12);
    expect(checks.size).toBe(1);
    expect([...checks][0]).toBe(UNIT);
    // The files member at the live sites carrying it (§8 + §9.2).
    const files = new Set<string>();
    for (const m of padUnitTotalRow().matchAll(/\*\*(\d{3}) files\*\*/g)) files.add(m[1]);
    for (const m of padCommandRow().matchAll(/(\d{3}) files/g)) files.add(m[1]);
    expect(files.size).toBe(1);
    expect([...files][0]).toBe(FILES);
    // The co-occurring pair form (the §9.2 command row): both members
    // from the SAME generation — the pair is ONE claim.
    const pair = /(\d{4}) checks \/ (\d{3}) files/.exec(padCommandRow());
    expect(pair).toBeTruthy();
    expect(pair![1]).toBe(UNIT);
    expect(pair![2]).toBe(FILES);
  });
});

// ---------------------------------------------------------------------------
// S140-C — the coordinate-liveness registration (B140-I2)
// ---------------------------------------------------------------------------

describe("S140-C the coordinate-liveness registration (B140-I2 — doc-site coordinates are live claims; derive them or name anchors only)", () => {
  it("DEFECT (worklog): the bracketed s140-coordinate-staleness-note registers the live PAD coordinates and the doctrine — never quote stale line numbers", () => {
    const noteAt = worklogSource.indexOf("s140-coordinate-staleness-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 2200);
    // The finding's shape: the frozen-snapshot coordinates vs the live ones.
    expect(collapsed(note)).toMatch(/B140-I2/);
    expect(collapsed(note)).toMatch(/2755/);
    expect(collapsed(note)).toMatch(/2757/);
    // The doctrine: coordinates are live claims; derive live or name anchors.
    expect(collapsed(note)).toMatch(/coordinate/i);
    expect(collapsed(note)).toMatch(/derive.*live|live.*derive|anchors only/i);
    // The S139 delivery's own growth named as the mechanism.
    expect(collapsed(note)).toMatch(/\+2|header prepend|growth/i);
  });

  it("SURVIVAL (docs): the four PAD count-family sites found by CONTENT (never by stale coordinates) — the Last-Updated chain head, the §8 Unit total row, the §7.4 checklist row, the §9.2 command row, each carrying the same pair", () => {
    // Site 1: the Last-Updated chain head (the FIRST Last-Updated line —
    // the v-chain's live head, found by content not coordinates).
    const luAt = padSource.indexOf("**Last Updated:**");
    expect(luAt).toBeGreaterThan(-1);
    const luLine = padSource.slice(luAt, padSource.indexOf("\n", luAt));
    expect(luLine).toMatch(/unit/);
    // The head's derivation form "N = N + N unit / N files" — the live
    // pair (version-agnostic; the head line legitimately QUOTES the prior
    // pair inside its registration narrative, so anchor on the
    // derivation, never the first bare "N files" occurrence).
    const luFiles = /(\d{4}) = \d{4} \+ \d+ unit \/ (\d{3}) files/.exec(luLine);
    expect(luFiles).toBeTruthy();
    expect(luFiles![1]).toBe(UNIT);
    expect(luFiles![2]).toBe(FILES);
    // Site 2: the §8 Unit total row.
    const totalRow = padUnitTotalRow();
    expect(totalRow).toBeTruthy();
    expect(totalRow).toMatch(/\*\*\d{3} files\*\*/);
    expect(totalRow).toMatch(/\*\*\d{4}\*\*/);
    // Site 3: the §7.4 Pre-PR/Pre-Deploy checklist row.
    const checklist = padChecklistRow();
    expect(checklist).toBeTruthy();
    expect(checklist).toMatch(/\d{4}\/\d{4}/);
    // Site 4: the §9.2 command-table row.
    const cmdRow = padCommandRow();
    expect(cmdRow).toBeTruthy();
    expect(cmdRow).toMatch(/unit tests \(\d{4} checks \/ \d{3} files\)/);
    // Pair unity across the content-derived sites: the same checks figure
    // at every site, the same files figure at every site.
    const checksFigures = new Set<string>();
    for (const m of totalRow.matchAll(/\*\*(\d{4})\*\*/g)) checksFigures.add(m[1]);
    for (const m of checklist.matchAll(/(\d{4})\/\d{4}/g)) checksFigures.add(m[1]);
    for (const m of cmdRow.matchAll(/(\d{4}) checks/g)) checksFigures.add(m[1]);
    expect(checksFigures.size).toBe(1);
    expect([...checksFigures][0]).toBe(UNIT);
    const fileFigures = new Set<string>();
    for (const m of totalRow.matchAll(/\*\*(\d{3}) files\*\*/g)) fileFigures.add(m[1]);
    for (const m of cmdRow.matchAll(/(\d{3}) files/g)) fileFigures.add(m[1]);
    expect(fileFigures.size).toBe(1);
    expect([...fileFigures][0]).toBe(FILES);
  });
});

// ---------------------------------------------------------------------------
// The count re-anchor (RED until the doc-update lands)
// ---------------------------------------------------------------------------

describe("the count re-anchor (the S140-D collateral — 1989 = 1977 + 12 unit / 202 files)", () => {
  it("DEFECT (docs): the v1.119.0 chain entry carries the S140 derivation (1989 = 1977 + 12 unit / 202 files, the frozen record once landed) + the §7.1 row for the s140 spec (the rolling-safe form — the live-sites figures roll every cycle; this pin guards the FROZEN delivery record, the live-pair unity carried by the S140-B pins)", () => {
    expect(padSource).toContain("1989 = 1977 + 12 unit / 202 files");
    expect(padSource).toContain("| `tests/lows-s140.test.ts` | 12 | tests | Vitest |");
  });
});

// ---------------------------------------------------------------------------
// The standing survival set — the S139 delivery rides unchanged
// ---------------------------------------------------------------------------

describe("the standing survival set (the S139 delivery rides unchanged through the S140 registrations)", () => {
  it("SURVIVAL (worklog): the four s139 bracketed registrations ride unchanged — the census-scoping, posture, enumeration, and arithmetic notes with their decompositions", () => {
    // The census-scoping note (S139-A).
    let noteAt = worklogSource.indexOf("s139-dispatch-brief-census-note");
    expect(noteAt).toBeGreaterThan(-1);
    let note = worklogSource.slice(noteAt, noteAt + 2400);
    expect(collapsed(note)).toMatch(/A139-I1/);
    expect(collapsed(note)).toMatch(/11/);
    expect(collapsed(note)).toMatch(/13/);
    // The posture note (S139-B).
    noteAt = worklogSource.indexOf("s139-resize-handle-keyboard-posture-note");
    expect(noteAt).toBeGreaterThan(-1);
    note = worklogSource.slice(noteAt, noteAt + 2000);
    expect(collapsed(note)).toMatch(/A139-I2/);
    expect(collapsed(note)).toMatch(/presentation/);
    // The enumeration note (S139-C).
    noteAt = worklogSource.indexOf("s139-pad-claim-site-note");
    expect(noteAt).toBeGreaterThan(-1);
    note = worklogSource.slice(noteAt, noteAt + 2000);
    expect(collapsed(note)).toMatch(/B139-I1/);
    expect(collapsed(note)).toMatch(/FOUR/);
    // The arithmetic note (S139-D).
    noteAt = worklogSource.indexOf("s139-smoke-arithmetic-note");
    expect(noteAt).toBeGreaterThan(-1);
    note = worklogSource.slice(noteAt, noteAt + 2000);
    expect(collapsed(note)).toMatch(/B139-I2/);
    expect(collapsed(note)).toMatch(/66\+4\+3|66 \+ 4 \+ 3/);
  });

  it("SURVIVAL (source): the S139-A census decomposition live — the panel 11, the src-wide 13 with the two siblings, flushIdleBurst 2 consumers, resetSliderGesture 3 canvas sites; the S139-B posture census — eight HANDLES, pointer-only", () => {
    const panel = panelSource.match(/patchDiffers\(/g) ?? [];
    expect(panel.length).toBe(11);
    expect(srcWidePatchDiffers).toBe(13);
    expect((editorStoreSource.match(/patchDiffers\(/g) ?? []).length).toBe(1);
    expect((aiAssistantSource.match(/patchDiffers\(/g) ?? []).length).toBe(1);
    expect(panelSource).toContain("export const flushIdleBurst");
    expect((editorViewSource.match(/flushIdleBurst\(\);/g) ?? []).length).toBe(1);
    expect((aiAssistantSource.match(/flushIdleBurst\(\);/g) ?? []).length).toBe(1);
    const flush = canvasSource.match(/resetSliderGesture\(\);/g) ?? [];
    expect(flush.length).toBe(3);
    // The S139-B posture: the eight-handle census + the presentation form.
    const handlesBlock = canvasSource.slice(
      canvasSource.indexOf("const HANDLES:"),
      canvasSource.indexOf("];", canvasSource.indexOf("const HANDLES:")),
    );
    const ids = handlesBlock.match(/\{ id: "/g) ?? [];
    expect(ids.length).toBe(8);
    const mapStart = canvasSource.indexOf("HANDLES.map((handle) => (");
    expect(mapStart).toBeGreaterThan(-1);
    const mapBlock = canvasSource.slice(mapStart, mapStart + 2400);
    expect(mapBlock).toContain('role="presentation"');
    expect(mapBlock).toContain("onPointerDown");
    expect(mapBlock).not.toMatch(/tabIndex/);
    expect(mapBlock).not.toMatch(/onKeyDown/);
  });

  it("SURVIVAL (scripts): the s140 parity scripts ride their own tokens — live140/nav140/digma-seo-s140, the 116th/117th/77th ordinals, the S139 delivery at HEAD 6407d66, zero s139 residue", () => {
    expect(refAuditSource).toContain("--session live140");
    expect(refAuditSource).toMatch(/116th reference audit/);
    expect(refAuditSource).toContain("6407d66");
    expect(refAuditSource).toContain("'clip=[Share:L385-R458,Present:L466-R551]'");
    expect(refAuditSource).toMatch(/77th/);
    expect(refAuditSource).not.toContain("live139");
    expect(refAuditSource).not.toContain("115th");
    expect(refAuditSource).not.toContain("s149");
    expect(navSource).toContain("nav140");
    expect(navSource).toMatch(/117th session/);
    expect(navSource).not.toContain("nav139");
    expect(navSource).not.toContain("116th session");
    expect(seoSource).toContain("digma-seo-s140");
    expect(seoSource).toMatch(/session 140, S140-cycle/);
    expect(seoSource).not.toContain("seo-s139");
    expect(seoSource).not.toContain("session 139, S139-cycle");
  });

  it("SURVIVAL (AGENTS): the session-139 bullet rides unchanged — the frozen record of the eighty-seventh audit's delivery", () => {
    const bulletAt = agentsSource.indexOf(
      "The census-scoping/posture/enumeration/arithmetic registration seams (session 139",
    );
    expect(bulletAt).toBeGreaterThan(-1);
    const bullet = agentsSource.slice(bulletAt, bulletAt + 6000);
    expect(collapsed(bullet)).toMatch(/S139-A \.\. S139-E|S139-A\.\.S139-E/);
    expect(collapsed(bullet)).toMatch(/12 pins: 5 RED \/ 7 survival/);
    expect(collapsed(bullet)).toMatch(/1977 = 1965 \+ 12 unit \/ 201 files/);
    expect(collapsed(bullet)).toMatch(/22\/66\/6/);
  });
});
