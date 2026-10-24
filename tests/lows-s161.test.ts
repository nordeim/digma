import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-161 spec (the one-hundred-and-ninth audit's chosen work —
// the pagehide honest-limits registration + the insert-shape keyboard
// surface + the line-height/vitest registrations + the picker gesture
// tokens):
//
// S161-A — THE PAGEHIDE OUT-OF-ORDER REGISTRATION (L161-A-L1, the
//   S86-A out-of-order class's real-unload member, lead-verified live
//   at the seam with the auditor's suggested fix CORRECTED): the
//   pagehide keepalive PUT (editor-view.tsx) fires whenever
//   saveState !== "saved" — including "saving" with the machine's
//   PUT1 in flight — and no ordering primitive exists across two
//   independent fetches at teardown (the soft-leave boundary's
//   S86-A flightDone chain is unavailable at a synchronous listener).
//   The auditor's one-line S71-B-style same-reference skip is UNSOUND
//   here — S61-I's own observed-live teardown cancellation (a regular
//   in-flight fetch does NOT survive page teardown) means the
//   "byte-identical duplicate" IS the safety net carrying the state
//   through the unload; skipping it when "saving" regresses the
//   S61-I edit-loss the guard removal itself fixed. The honest
//   remediation is the registration: the S61-I honest-limits comment's
//   list gains the out-of-order member (the narrow triple conjunction
//   — an edit landing inside PUT1's round-trip window + an instant
//   close + server-side reordering), with the skip alternative named
//   as unsound. Zero PUT-logic change; the pinned forms
//   (keepalive: true, the Blob guard, the Untitled skip) untouched.
//
// S161-B — THE INSERT-SHAPE KEYBOARD SURFACE (the S160-C registered
//   candidate follow-up, DELIVERED — the working-superset doctrine):
//   the global keydown gains the Insert branch — a default-sized
//   element of the ACTIVE DRAW TOOL's type (rectangle/ellipse/frame/
//   line; rectangle when a non-draw tool is active) inserted at the
//   canvas viewport CENTER, through the store's own addElements seam
//   (the ELEMENT_LIMIT honest refusal + the selection commit by
//   construction), the viewport center derived through the INVERSE of
//   the canvas's own pointer transform. The S123-A gesture stand-down
//   covers the branch by placement (below the :847 bail); Insert is
//   single-key (passes the modifier bail) and unmapped by the handler
//   or the browser in the canvas context. The EDITOR_SHORTCUTS
//   Editing group gains the entry so the dialog's inventory advertises
//   what the handler wires.
//
// S161-C — THE CANVAS LINE-HEIGHT FLOOR REGISTRATION (I161-A-I1, with
//   the lead's correction of the family framing): canvas.tsx:950's
//   Math.max(element.height, 0) is provably dead through every write
//   path — but the "three bare siblings" framing conflated three
//   DIFFERENT surfaces (the PresentOverlay/CanvasThumbnail
//   Math.max(el.height, 1) SVG-VIEWPORT minimums; export-png's bare
//   y2 endpoint; the canvas's DOM-STYLE 0-floor — the client mirror
//   of the server's own 0-floor, retained as defense-in-depth).
//   Registered (the worklog's bracketed s161-line-height-form-note),
//   zero source change.
//
// S161-D — THE COLOR-PICKER GESTURE TOKENS (I161-A-I2 — the cycle's
//   chosen closure): every color-picker swatch surface (the
//   HexColorRow consumers — Text Color, Fill Color, Stroke, Canvas
//   Background — plus the gradient stop color) terminated its burst
//   through the ONE default "text" gesture token while the sliders
//   carry per-input S126-B tokens (slider:${label}); safe today only
//   by the native picker's modality. The fix: each picker surface
//   gains its own token — the HexColorRow's label-derived
//   picker:${label ?? "Background"} (one JSX site covering its four
//   consumers) and the gradient stop's picker:Stop ${index + 1} color
//   — the S126-B per-input form reaching the picker family, so a
//   future non-modal/custom picker no longer re-opens the
//   stale-release class at five sites at once.
//
// S161-E — THE VITEST ISOLATE REGISTRATION (I161-B-I1): the unit
//   gate's wall time is dominated by per-file worker isolation (222
//   workers at ~86ms each, ~18.97s of the 28.5s total — the runner's
//   own reporter output); the hermetic per-file module registry is
//   the SAFE default for a suite dominated by source-contract pins.
//   Registered (the worklog's bracketed s161-vitest-isolate-note),
//   zero config change.
//
// S161-F — the per-session pin family: the F138 guard's ELEVENTH
//   instance (the s160 plan's record pinned 8/8 ticked at 78df96ee,
//   per the pre-armed session_345 directive), the audit entries at
//   their anchors (auditor A's 0C/0H/0M/1L/2I with L161-A-L1 +
//   I161-A-I1 + I161-A-I2; auditor B's 0C/0H/0M/0L/1I with I161-B-I1;
//   the thirty-fourth consecutive deferral cycle), the script
//   provenance (live161/nav161/digma-seo-s161 — the 137th/138th/98th
//   ordinals, the S160 delivery at 78df96ee), the four bracketed
//   registration notes, the client-layer survival member (the layer
//   total MOVES this cycle — three files: re-anchored everywhere by
//   the collateral), the pair-unity constants (born rolling-safe at
//   the POST-spec figures 2243/223 — the doc-update re-anchors the
//   docs and the constants TOGETHER), and the doc-side members (the
//   F148 lesson, the count re-anchor, the forward count-truth guard's
//   eighth instance) that stay RED until the collateral.
//
// Spec-form notes (narrated at birth — the honest form separated
// from the plan's forecast, the s153..s160 precedent's own shape):
// the born spec carries 16 pins — 11 RED (the six source members +
// the five doc-side members incl. the pair-unity
// RED-until-collateral) / 5 survival; the collateral count family
// re-anchors onto 2243 = 2227 + 16 unit / 223 files (lows-s161.test.ts
// joins as the 223rd file); the layer-total family re-anchors onto
// the measured post-fix figure with the s156/s157/s158 hard pins
// riding the F140 re-anchor rider (the s160 14,095→14,190 precedent
// at the layer family).

const worklogSource = readFileSync(
  path.resolve(import.meta.dirname, "../worklog.md"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const s160PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session160.md"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const editorLibSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const layersSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/layers-panel.tsx"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s161.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s161.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s161.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2227 delivery checks + this
 *  spec's 16 = 2243 unit, the 222 delivery files + this spec = 223;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s160 lesson). */
const UNIT = "2574";
const FILES = "247";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** Collapse a TS source's comment body: strip the leading '// '
 *  markers from every line, then collapse whitespace — so a phrase
 *  spanning comment continuation lines matches as contiguous text
 *  (the s158 spec-form repair's standing form). */
const strippedSlashComments = (s: string) =>
  s.replace(/^[ \t]*\/\/[ \t]?/gm, "").replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:" prefix
 *  rides the slice; the census lines ride kilobytes past the anchor). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const end = worklogSource.indexOf("\n---\n", at);
  return worklogSource.slice(lineStart, end === -1 ? at + 16000 : end);
};

/** The live 22-file layer total, derived at runtime (the S154-B
 *  forward count-truth guard — NEVER a quoted figure): the exact
 *  composition pinned by tests/lows-s142.test.ts — 8 files at
 *  src/components/editor/ + 8 at src/components/ + 2 at src/hooks/ +
 *  the 3 named lib members + src/app/globals.css. */
const liveLayerTotal = (() => {
  const root = path.resolve(import.meta.dirname, "..");
  const groups = [
    "src/components/editor/*.tsx",
    "src/components/editor/*.ts",
    "src/components/*.tsx",
    "src/hooks/*.ts",
    "src/lib/editor.ts",
    "src/lib/ai-assistant.ts",
    "src/lib/export-png.ts",
    "src/app/globals.css",
  ];
  let total = 0;
  for (const glob of groups) {
    const out = execSync(`wc -l ${glob}`, { cwd: root, encoding: "utf8" });
    const line = out.trim().split("\n").pop()!;
    total += Number(line.trim().split(/\s+/)[0]);
  }
  return total;
})();

/** The figure the v1.164.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its eighth instance). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.164\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S161-A — the pagehide out-of-order registration
// ---------------------------------------------------------------------------

describe("S161-A the pagehide out-of-order registration (L161-A-L1 — the honest-limits completion: the residual named, the unsound skip alternative corrected)", () => {
  it("DEFECT (source): the S61-I honest-limits list carries the OUT-OF-ORDER member — the narrow triple conjunction named, the same-reference skip named as UNSOUND (S61-I's observed-live teardown cancellation — the duplicate IS the safety net), the flightDone chain's unavailability at a synchronous listener named; the pinned transport forms untouched", () => {
    // The registration comment, read in its stripped form (the phrase
    // spans comment continuation lines).
    const stripped = strippedSlashComments(viewSource);
    expect(stripped).toContain("the out-of-order residual");
    expect(stripped).toContain("triple conjunction");
    expect(stripped).toContain("unsound");
    // The pinned transport forms still present (the S71-B
    // preservation pins' own contract — the registration changes no
    // transport logic).
    expect(viewSource).toMatch(/keepalive:\s*true/);
    expect(viewSource).toMatch(/new Blob\(\[payload\]\)\.size > 60_000/);
    expect(viewSource).toMatch(/if\s*\(!projectId\)\s*return;/);
  });
});

// ---------------------------------------------------------------------------
// S161-B — the insert-shape keyboard surface
// ---------------------------------------------------------------------------

describe("S161-B the insert-shape keyboard surface (the S160-C registered candidate follow-up, DELIVERED — the working superset on the global keydown's own tail)", () => {
  it("DEFECT (source): the global keydown carries the INSERT branch — single-key (below the modifier bail, above the tool dispatch), preventDefaulted, the S123-A gesture stand-down covering it by placement, the store's addElement consumed with the active-draw-tool type (rectangle when a non-draw tool is active), the registration comment at the seam", () => {
    // The branch exists in the handler tail.
    const insertAt = viewSource.indexOf('event.key === "Insert"');
    expect(insertAt).toBeGreaterThan(-1);
    const branch = viewSource.slice(insertAt - 2400, insertAt + 1600);
    expect(branch).toContain("event.preventDefault();");
    // The type resolution: the active draw tool or rectangle.
    expect(branch).toContain('store.tool === "rectangle"');
    expect(branch).toContain('store.tool === "ellipse"');
    expect(branch).toContain('store.tool === "frame"');
    expect(branch).toContain('store.tool === "line"');
    // The creation rides the store's own seam.
    expect(branch).toContain("store.addElement(");
    // The placement: AFTER the modifier bail, BEFORE the tool
    // dispatch (the tool-modifiers pin's own ordering contract).
    const bailAt = viewSource.indexOf(
      "if (event.ctrlKey || event.metaKey || event.altKey) return;",
    );
    const dispatchAt = viewSource.indexOf(
      "const tool = toolForShortcut(event.key);",
    );
    expect(bailAt).toBeGreaterThan(-1);
    expect(dispatchAt).toBeGreaterThan(-1);
    expect(insertAt).toBeGreaterThan(bailAt);
    expect(dispatchAt).toBeGreaterThan(insertAt);
    // The gesture stand-down sits ABOVE the branch (the S123-A
    // tail-coverage contract — the branch is covered by placement).
    const standDownAt = viewSource.indexOf("if (store.gestureSnapshot) return;");
    expect(standDownAt).toBeGreaterThan(-1);
    expect(standDownAt).toBeLessThan(insertAt);
    // The registration comment at the seam.
    expect(strippedSlashComments(viewSource)).toContain(
      "the insert-shape keyboard surface",
    );
  });

  it("DEFECT (source): the insertion lands at the CANVAS VIEWPORT CENTER — the canvas node resolved through its own stable contract (the role/aria-label pair), the center derived through the INVERSE of the canvas's own pointer transform, the element centered on it", () => {
    const insertAt = viewSource.indexOf('event.key === "Insert"');
    expect(insertAt).toBeGreaterThan(-1);
    const branch = viewSource.slice(insertAt, insertAt + 2000);
    // The canvas node, resolved through the stable contract.
    expect(branch).toContain(
      '[role="application"][aria-label="Design canvas"]',
    );
    // The inverse transform (the canvas's own :141-142 form inverted).
    expect(collapsed(branch)).toContain(
      "(rect.width / 2 - store.panX) / store.zoom",
    );
    expect(collapsed(branch)).toContain(
      "(rect.height / 2 - store.panY) / store.zoom",
    );
    // The element centered on the computed point (the S162-A clamp
    // wrap — the centered form now rides clampPositionField, the
    // F140 re-anchor rider's spelling).
    expect(branch).toContain("clampPositionField(cx - w / 2)");
    expect(branch).toContain("clampPositionField(cy - h / 2)");
  });

  it("DEFECT (lib source): the EDITOR_SHORTCUTS Editing group carries the insert-shape entry — the dialog's inventory advertises what the handler wires (the single-source doctrine)", () => {
    const at = editorLibSource.indexOf('label: "Insert shape"');
    expect(at).toBeGreaterThan(-1);
    const entry = editorLibSource.slice(at - 200, at + 200);
    expect(entry).toContain('keys: ["Ins"]');
    // The entry rides the Editing group (after "Deselect" — the
    // group's own member order).
    const editingAt = editorLibSource.indexOf('group: "Editing"');
    expect(editingAt).toBeGreaterThan(-1);
    expect(at).toBeGreaterThan(editingAt);
  });
});

// ---------------------------------------------------------------------------
// S161-D — the color-picker gesture tokens
// ---------------------------------------------------------------------------

describe("S161-D the color-picker gesture tokens (I161-A-I2 — the S126-B per-input form reaching the picker family)", () => {
  it("DEFECT (panel source): the HexColorRow swatch carries the LABEL-DERIVED per-surface token — picker:${label ?? \"Background\"} at BOTH the tick and the blur finish (one JSX site covering the four consumers: Color / Fill Color / Stroke / Background), the shared default \"text\" token gone from the swatch", () => {
    // The swatch region, found by its type anchor inside HexColorRow.
    const hexAt = panelSource.indexOf("function HexColorRow(");
    expect(hexAt).toBeGreaterThan(-1);
    const hexEnd = panelSource.indexOf("\nfunction ", hexAt + 1);
    const hexRow = panelSource.slice(hexAt, hexEnd === -1 ? undefined : hexEnd);
    const swatch = hexRow.match(/type="color"[\s\S]*?\/>/);
    expect(swatch).not.toBeNull();
    expect(swatch![0]).toContain(
      'sliderGesture.textTick(`picker:${label ?? "Background"}`)',
    );
    expect(swatch![0]).toContain(
      'onBlur={() => sliderGesture.finish(`picker:${label ?? "Background"}`)}',
    );
    // The registration comment at the seam.
    expect(strippedSlashComments(panelSource)).toContain(
      "the color-picker gesture tokens",
    );
  });

  it("DEFECT (panel source): the gradient stop color carries its OWN per-stop token — picker:Stop ${index + 1} color at BOTH the tick and the blur finish (the aria-label's own form), the shared default gone from the stop swatch", () => {
    // The stop swatch region, found by its aria-label anchor.
    const stopAt = panelSource.indexOf('aria-label={`Stop ${index + 1} color`}');
    expect(stopAt).toBeGreaterThan(-1);
    const stopBlock = panelSource.slice(stopAt, stopAt + 2200);
    expect(stopBlock).toContain(
      "sliderGesture.textTick(`picker:Stop ${index + 1} color`)",
    );
    expect(stopBlock).toContain(
      "sliderGesture.finish(`picker:Stop ${index + 1} color`)",
    );
  });
});

// ---------------------------------------------------------------------------
// S161-F — the per-session pin family: survival members + doc-side members
// ---------------------------------------------------------------------------

describe("S161-F the per-session pin family (the survival members + the doc-side members that stay RED until the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's ELEVENTH instance — the s160 plan's execution record shipped 8/8 ticked, zero unticked (the pre-armed guard per the session_345 directive; the tenth consecutive cycle of the forward form)", () => {
    // The s160 plan's execution record, read live: every box ticked.
    const ticked = s160PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s160PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(8);
    expect(unticked).toBe(0);
  });

  it("SURVIVAL (worklog): the two s161 audit entries at their anchors with their live censuses — auditor A's 0C/0H/0M/1L/2I (with L161-A-L1 + I161-A-I1 + I161-A-I2) and auditor B's 0C/0H/0M/0L/1I (with I161-B-I1), the thirty-fourth consecutive deferral cycle", () => {
    const entryA = auditEntry("Task ID: digma-s161-audit-A");
    expect(entryA).not.toBe("");
    expect(collapsed(entryA)).toContain(
      "0 Critical / 0 High / 0 Medium / 1 Low / 2 Informational",
    );
    expect(entryA).toContain("L161-A-L1");
    expect(entryA).toContain("I161-A-I1");
    expect(entryA).toContain("I161-A-I2");
    const entryB = auditEntry("Task ID: digma-s161-audit-B");
    expect(entryB).not.toBe("");
    expect(collapsed(entryB)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 1 Informational",
    );
    expect(entryB).toContain("I161-B-I1");
    expect(collapsed(entryB)).toContain("thirty-fourth consecutive cycle");
  });

  it("SURVIVAL (worklog): the four bracketed s161 registration notes at their anchors — the pagehide out-of-order note (with the unsound-skip correction), the line-height form note (with the three-surface map), the picker-tokens note, the vitest-isolate note", () => {
    const pagehide = worklogSource.indexOf("[s161-pagehide-ordering-note:");
    expect(pagehide).toBeGreaterThan(-1);
    const note1 = worklogSource.slice(pagehide, pagehide + 4000);
    expect(collapsed(note1)).toContain("UNSOUND");
    expect(collapsed(note1)).toContain("SAFETY NET");
    const lineHeight = worklogSource.indexOf("[s161-line-height-form-note:");
    expect(lineHeight).toBeGreaterThan(-1);
    const note2 = worklogSource.slice(lineHeight, lineHeight + 4000);
    expect(collapsed(note2)).toContain("SVG-VIEWPORT");
    const pickers = worklogSource.indexOf("[s161-picker-tokens-note:");
    expect(pickers).toBeGreaterThan(-1);
    const isolate = worklogSource.indexOf("[s161-vitest-isolate-note:");
    expect(isolate).toBeGreaterThan(-1);
    const note4 = worklogSource.slice(isolate, isolate + 4000);
    expect(collapsed(note4)).toContain("hermetic");
  });

  it("SURVIVAL (scripts): the s161 script provenance — live161/nav161/digma-seo-s161 tokens, the 137th/138th/98th ordinals, the S160 delivery at 78df96ee, zero s160 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live161");
    expect(refAuditSource).toContain("137th reference audit");
    expect(refAuditSource).toContain("78df96ee");
    expect(refAuditSource).toContain("byte-identical the 98th");
    // The nav script: the 138th session ordinal.
    expect(navSource).toContain("nav161");
    expect(navSource).toContain("138th session");
    // The seo script: the session-161 token.
    expect(seoSource).toContain("digma-seo-s161");
    expect(seoSource).toContain("session 161");
    // Zero s160 run-ordinal residue across the three scripts.
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live160");
      expect(src).not.toContain("nav160");
      expect(src).not.toContain("seo-s160");
      expect(src).not.toContain("s170");
      expect(src).not.toContain("136th");
      expect(src).not.toContain("137th session");
      expect(src).not.toContain("137th consecutive");
      expect(src).not.toContain("byte-identical the 97th");
      expect(src).not.toContain("60e5fd1c");
    }
  });

  it("SURVIVAL (behavioral — the client-layer contract): the keep-form family intact and the store arms at their standing contracts (the S161-B/S161-D members leave every mutation-arm guard untouched — the layer total MOVES this cycle, three files, re-anchored everywhere by the collateral)", () => {
    // The store's keep-form family: the S117-B reference-keeping
    // renumber and the S78-C identical-order bail verbatim.
    expect(storeSource).toContain(
      "el.sortOrder === i ? el : { ...el, sortOrder: i }",
    );
    expect(storeSource).toContain(
      'nextIds.join("\\u0001") === state.elements.map((el) => el.id).join("\\u0001")',
    );
    // The S115-A/S116-A value-diff guards verbatim (the no-op commit
    // family's PUT-arm members).
    expect(storeSource).toContain("patchDiffers(el, patch)");
    // The updateElements/scaleElements/deleteElements/toggleVisibility/
    // toggleLock id-match guards still return the family form.
    const updateGuards = storeSource.match(/if \(!matched\) return \{\};/g);
    expect(updateGuards?.length).toBe(5);
    // The canvas marquee pair still aligned (the S148-B form).
    expect(collapsed(canvasSource)).toContain(
      'drag.kind === "marquee" && drag.w > 2 && drag.h > 2 && (',
    );
    // The layers DnD branch's own reorder convention verbatim.
    expect(layersSource).toContain("store.reorderElements([fromId],");
    // The S160-B keyboard superset still present (the delivered
    // follow-up this cycle's Insert branch joins at the handler family).
    expect(layersSource).toContain('event.key === "F2"');
  });

  it("DEFECT (docs): the AGENTS session-161 bullet carries the registration members — the pagehide out-of-order registration (with the unsound-skip correction), the insert-shape keyboard surface DELIVERED (the S160-C candidate follow-up), the per-surface picker tokens", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 161, S161-A..S161-F");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 7000);
    // The registration members' key phrases (the bullet's own
    // spelling — the s156 F143 phrase-case lesson).
    expect(collapsed(bullet)).toContain("PAGEHIDE");
    expect(collapsed(bullet)).toContain("OUT-OF-ORDER");
    expect(collapsed(bullet)).toContain("INSERT-SHAPE");
    expect(collapsed(bullet)).toContain("picker");
  });

  it("DEFECT (docs): the count re-anchor — the v1.140.0 chain entry carries the S161 derivation (2243 = 2227 + 16 unit / 223 files) + the §7.1 row for the s161 spec + the §11 rows re-anchored (editor-view.tsx, properties-panel.tsx, editor.ts at the measured post-fix figures)", () => {
    expect(padSource).toMatch(/v1\.140\.0/);
    expect(padSource).toContain("2243 = 2227 + 16 unit / 223 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s161.test.ts`");
    // The count-family live rows re-anchored (found by CONTENT).
    const unitTotalRow =
      padSource.split("\n").find((l) => l.includes("**Unit total**")) ?? "";
    expect(unitTotalRow).toContain(UNIT);
    const checklistRow =
      padSource.split("\n").find((l) => l.startsWith("- [ ] `bun run test` →")) ?? "";
    expect(checklistRow).toContain(UNIT);
    const commandRow =
      padSource
        .split("\n")
        .find((l) => l.includes("| `bun run test` / `bun run test:watch` |")) ?? "";
    expect(commandRow).toContain(`${UNIT} checks`);
  });

  it("DEFECT (docs — the forward count-truth guard's eighth instance): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.140.0 block quotes — the count receipt riding the spec instead of prose (the F138 receipt-doctrine shape at the count family)", () => {
    // The live derivation NEVER quotes a figure: wc -l over the exact
    // 22-file composition at spec runtime.
    expect(liveLayerTotal).toBeGreaterThan(14200);
    // The PAD's v1.140.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("DEFECT (docs): the F148 lesson registered in the digma_SKILL — the registration-over-unsound-fix + per-surface-token + keyboard-superset-delivery members inserted after F147, the version bumped to v1.139.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.163\.0/);
    // The lesson: the members after F147.
    const f147At = skillSource.indexOf("F147");
    const f148At = skillSource.indexOf("F148");
    expect(f147At).toBeGreaterThan(-1);
    expect(f148At).toBeGreaterThan(f147At);
    const f148Body = skillSource.slice(f148At, f148At + 3000);
    // The registration-over-unsound-fix member (the corrected skip —
    // the lesson's own all-caps emphasis form).
    expect(collapsed(f148Body)).toContain("UNSOUND");
    // The per-surface-token member (the picker family).
    expect(collapsed(f148Body)).toContain("token");
    // The keyboard-superset-delivery member (the insert surface).
    expect(collapsed(f148Body)).toContain("Insert");
  });

  it("SURVIVAL (docs): the pair-unity claim forms riding the constants at every doc — the frozen coincidental literals classified out (the B145-I1 doctrine), every live claim site the same members (the rolling-safe form: this spec's constants equal the s160 spec's constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s160Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s160.test.ts"),
      "utf8",
    );
    // The s160 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s160Unit = s160Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s160Files = s160Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s160Unit).toBe(UNIT);
    expect(s160Files).toBe(FILES);
    // The AGENTS/CLAUDE/README/SKILL live claim sites carry the same
    // members (found by CONTENT, the F106 live-claim-sites-only
    // doctrine).
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    expect(agents).toContain(`Unit tests (${UNIT} checks)`);
    const claude = readFileSync(
      path.resolve(import.meta.dirname, "../CLAUDE.md"),
      "utf8",
    );
    expect(claude).toContain(`(${UNIT} unit / 73 smoke / 262 e2e)`);
    const readme = readFileSync(
      path.resolve(import.meta.dirname, "../README.md"),
      "utf8",
    );
    expect(readme).toContain(`${UNIT} checks on the pure domain seams`);
    expect(skillSource).toContain(`${UNIT} unit checks green`);
  });
});
