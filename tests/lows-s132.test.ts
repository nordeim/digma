import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-132 spec (the eightieth audit's chosen work):
//
// S132-A — THE MARQUEE COMMIT'S LIVE-LIST READ (A132-I1 — the
//   Informational the eightieth audit's editor-side auditor found):
//   the marquee is the ONE id-consuming canvas drag that arms no
//   gesture (selection is no history/saveState mutation — correct),
//   so the autosave's gesture-deferral never covers it — a markSaved
//   response landing mid-marquee remaps local-xxx ids to server
//   cuids, and a pointerup firing in the sub-frame window before
//   React's re-render selected the STALE local ids (a dangling
//   selection: the badge over unhighlighted rows, Delete no-opping
//   through the unlockedIds filter). The closure: the commit reads
//   the LIVE list at commit time — the handler's own store capture,
//   the same getState() form every sibling branch rides.
//
// S132-B — THE A130-I1 BY-DESIGN REGISTRATION (the deferred queue's
//   head, taken up this cycle and RESOLVED by-design): the hex TEXT
//   input's per-field arm, carried since session 130 — but the
//   take-up evaluation found the collision the s130 registration
//   missed: the S66-B preservation pin (color-coalesce-s66.test.ts)
//   holds the text input OUT of the burst seam as the DELIBERATE
//   contract (discrete intent — one entry per complete entry;
//   coalescing two typed entries is the wrong contract). The arm
//   would violate a standing prior-spec pin. The resolution is the
//   S129-D documented-absence form: the registration comment lands
//   AT THE SEAM (the comment the s130 record claimed but never
//   landed), A130-I1 RETIRES from the deferred queue, and the s66
//   preservation pin survives verbatim.
//
// S132-C — THE B132-I1 NARRATIVE REGISTRATION (the env-census
//   off-by-one): the live truth is 9 distinct app-read env vars /
//   16 read sites; the stale "8" lives in frozen records only. The
//   corrected figure registered in the worklog's bracketed
//   s132-env-census-note (the S131-E form) + this cycle's plan.
//
// The script family (the S118-C convention, s132 form): the s132
//   parity scripts ride their OWN tokens (live132 / nav132 /
//   digma-seo-s132.log, the 108th audit / 109th session / 69th clip
//   ordinals, the S131 delivery at HEAD 7513c09), never the frozen
//   s131 forms.

const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const assistantSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const layersSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/layers-panel.tsx"),
  "utf8",
);
const worklogSource = readFileSync(
  path.resolve(import.meta.dirname, "../worklog.md"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s132.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s132.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s132.sh"),
  "utf8",
);

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The HexColorRow component window (the s66/s105 slice form). */
function hexColorRowWindow(): string {
  const start = panelSource.indexOf("function HexColorRow(");
  expect(start).toBeGreaterThan(-1);
  const end = panelSource.indexOf("\n}\n", start);
  return panelSource.slice(start, end);
}

// ---------------------------------------------------------------------------
// S132-A — the marquee commit's live-list read (A132-I1)
// ---------------------------------------------------------------------------

describe("S132-A the marquee commit's live-list read (A132-I1)", () => {
  it("DEFECT (source): the marquee commit reads the LIVE list — the handler's own store capture, never the render-captured subscription", () => {
    const marqueeStart = canvasSource.indexOf('} else if (drag.kind === "marquee") {');
    expect(marqueeStart).toBeGreaterThan(-1);
    const marqueeEnd = canvasSource.indexOf('} else if (drag.kind === "move"', marqueeStart);
    const marqueeBlock = canvasSource.slice(marqueeStart, marqueeEnd);
    // THE DEFECT PIN: pre-fix the filter read the render-captured
    // `elements` subscription — a markSaved remap landing mid-marquee
    // stranded the stale local ids in the commit's selection.
    expect(marqueeBlock).toMatch(/const inside = store\.elements\.filter\(\(el\) => \{/);
    // The commit form itself rides unchanged (the S118-A union).
    expect(marqueeBlock).toMatch(/store\.select\(inside\.map\(\(el\) => el\.id\), drag\.shift\);/);
  });

  it("DEFECT (source): the S132-A registration names the A132-I1 boundary at the seam", () => {
    const insideAt = canvasSource.indexOf("const inside = store.elements.filter");
    expect(insideAt).toBeGreaterThan(-1);
    // 900-char back-window (the S102-B class): the registration
    // comment sits above the filter line, inside the marquee arm.
    const window = canvasSource.slice(Math.max(0, insideAt - 900), insideAt);
    expect(window).toMatch(/S132-A/);
    expect(window).toMatch(/A132-I1/);
  });

  it("DEFECT (source): the registration names the arms-no-gesture truth and the markSaved remap it defends against", () => {
    const insideAt = canvasSource.indexOf("const inside = store.elements.filter");
    expect(insideAt).toBeGreaterThan(-1);
    const window = canvasSource.slice(Math.max(0, insideAt - 900), insideAt);
    // The registration must name BOTH halves of the boundary: the
    // marquee arms no gesture (so the autosave deferral never covers
    // it) and markSaved remaps the ids (the stale-list source).
    const regAt = window.indexOf("S132-A");
    expect(regAt).toBeGreaterThan(-1);
    const reg = window.slice(regAt);
    expect(reg).toMatch(/markSaved/);
    expect(collapsed(reg)).toMatch(/arms no gesture/i);
  });
});

// ---------------------------------------------------------------------------
// S132-B — the A130-I1 by-design registration (the deferred queue's head, resolved)
// ---------------------------------------------------------------------------

describe("S132-B the A130-I1 by-design registration (the hex text arm resolved as the S66-B contract)", () => {
  it("DEFECT (source): the by-design registration lands AT THE SEAM — above the empty-draft branch, inside HexColorRow", () => {
    const w = hexColorRowWindow();
    const emptyIdx = w.indexOf('if (next === "") {');
    expect(emptyIdx).toBeGreaterThan(-1);
    // The registration sits ABOVE the empty-draft line (outside the
    // s105 950-char pin window — measured 860 live, the placement is
    // the load-bearing constraint).
    const regIdx = w.indexOf("S132-B");
    expect(regIdx).toBeGreaterThan(-1);
    expect(regIdx).toBeLessThan(emptyIdx);
    // 1400-char window from the registration: the doctrine tokens.
    const reg = w.slice(regIdx, regIdx + 1400);
    expect(reg).toMatch(/A130-I1/);
    expect(reg).toMatch(/S66-B/);
    expect(collapsed(reg)).toMatch(/discrete intent/i);
  });

  it("DEFECT (source): the registration names the collision — the prior-spec pin the s130 follow-up missed — and the retirement", () => {
    const w = hexColorRowWindow();
    const regIdx = w.indexOf("S132-B");
    expect(regIdx).toBeGreaterThan(-1);
    const reg = w.slice(regIdx, regIdx + 1400);
    // The collision: the standing preservation pin holds the text
    // input out of the burst seam; the arm would violate it.
    expect(collapsed(reg)).toMatch(/prior-spec pin|standing pin/i);
    expect(collapsed(reg)).toMatch(/retire/i);
  });

  it("SURVIVAL (source): the S66-B preservation contract rides UNCHANGED — the hex text input carries no gesture wiring", () => {
    // THE BY-DESIGN CONTRACT PIN (the s66 form verbatim): the text
    // input stays a discrete keyboard commit — the arm-less posture
    // IS the contract S132-B registers, never a gap.
    const w = hexColorRowWindow();
    const text = w.match(/type="text"[\s\S]*?\/>/);
    expect(text).not.toBeNull();
    expect(text![0]).not.toMatch(/sliderGesture\./);
  });

  it("SURVIVAL (source): the s105 empty-draft pin window stays exact — the registration placement never enters it", () => {
    const w = hexColorRowWindow();
    const emptyIdx = w.indexOf('if (next === "") {');
    expect(emptyIdx).toBeGreaterThan(-1);
    const branch = w.slice(emptyIdx, emptyIdx + 950);
    expect(branch).toMatch(/wouldCommit\(null\)\s*:\s*value !== null\)/);
    expect(branch).toMatch(/onChange\(null\)/);
  });
});

// ---------------------------------------------------------------------------
// S132-C — the B132-I1 narrative registration (the env-census off-by-one)
// ---------------------------------------------------------------------------

describe("S132-C the B132-I1 narrative registration (the corrected env-census figure)", () => {
  it("DEFECT (worklog): the bracketed s132-env-census-note carries the corrected figure — 9 distinct app-read vars / 16 read sites", () => {
    // The S131-E form: the corrected figure registered where the
    // record lives (the worklog's bracketed note), the frozen
    // records' off-by-one named, never rewritten.
    const noteAt = worklogSource.indexOf("s132-env-census-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 1600);
    expect(collapsed(note)).toMatch(/9 distinct app-read env vars/i);
    expect(note).toMatch(/16 read sites/);
    expect(collapsed(note)).toMatch(/frozen/i);
  });
});

// ---------------------------------------------------------------------------
// The script family (the s132 provenance anchors — the S118-C convention)
// ---------------------------------------------------------------------------

describe("the s132 script provenance anchors", () => {
  it("SURVIVAL (scripts): ref-audit-s132.sh rides its own tokens — live132, the 108th audit, the S131 delivery at HEAD 7513c09", () => {
    expect(refAuditSource).toContain("--session live132");
    expect(refAuditSource).toMatch(/108th reference audit/);
    expect(refAuditSource).toContain("7513c09");
    // The clip pin datum rides the fail-loud form (the 69th
    // consecutive session).
    expect(refAuditSource).toContain("'clip=[Share:L385-R458,Present:L466-R551]'");
    expect(refAuditSource).toMatch(/69th/);
    // Zero frozen-s131 residue.
    expect(refAuditSource).not.toContain("live131");
    expect(refAuditSource).not.toContain("107th");
  });

  it("SURVIVAL (scripts): verify-nav-s132.sh rides its own tokens — nav132, the 109th session", () => {
    expect(navSource).toContain("nav132");
    expect(navSource).toMatch(/109th session/);
    expect(navSource).not.toContain("nav131");
    expect(navSource).not.toContain("108th session");
  });

  it("SURVIVAL (scripts): seo-check-s132.sh rides its own tokens — the s132 cycle", () => {
    expect(seoSource).toContain("digma-seo-s132");
    expect(seoSource).toMatch(/session 132, S132-cycle/);
    expect(seoSource).not.toContain("seo-s131");
    expect(seoSource).not.toContain("session 131, S131-cycle");
  });
});

// ---------------------------------------------------------------------------
// The S131/S130/S124-B seam survival set (the standing forms verbatim)
// ---------------------------------------------------------------------------

describe("the standing seam survival set", () => {
  it("SURVIVAL (source): the S131-A mount composition — presenting gated on !loading", () => {
    expect(viewSource).toMatch(
      /\{presenting && !loading && <MemoizedPresentOverlay onExit=\{exitPresent\} \/>\}/,
    );
  });

  it("SURVIVAL (source): the S131-B four-guard census — every layers-panel history-mutating pointer arm stands down", () => {
    const guards = layersSource.match(/if \(store\.gestureSnapshot\) return;/g) ?? [];
    expect(guards.length).toBe(5);
  });

  it("SURVIVAL (source): the S129-A/S130-A arms — the SLIDER_KEYS keyTick head and one onWheel twin", () => {
    expect(panelSource).toMatch(/if \(SLIDER_KEYS\.has\(event\.key\)\) sliderGesture\.keyTick\(`slider:\$\{label\}`\)/);
    expect(panelSource).toMatch(/onWheel=\{\(\) => sliderGesture\.keyTick\("slider:Rotation"\)\}/);
  });

  it("SURVIVAL (source): the S130-D/S130-E pair — the finally liveness guard and the pan capture on currentTarget", () => {
    expect(assistantSource).toMatch(/if \(aliveRef\.current\) setSending\(false\);/);
    // The pan branch's capture-on-container (canvas.tsx — the pan
    // ARM's own branch line, not the isPanning() definition).
    const panArmAt = canvasSource.indexOf("if (event.button === 1 || isPanning()) {");
    expect(panArmAt).toBeGreaterThan(-1);
    const panWindow = canvasSource.slice(panArmAt, panArmAt + 600);
    expect(panWindow).toMatch(/\(event\.currentTarget as HTMLElement\)\.setPointerCapture/);
  });

  it("SURVIVAL (source): the S124-B undo/redo pointer stand-downs", () => {
    // Anchored on the BUTTONS (the pointer arms), never the keyboard
    // twin at :852 — the first store.undo() occurrence is the
    // shortcut handler's.
    const undoBtnAt = viewSource.indexOf('aria-label="Undo"');
    expect(undoBtnAt).toBeGreaterThan(-1);
    const undoBlock = viewSource.slice(Math.max(0, undoBtnAt - 800), undoBtnAt);
    expect(undoBlock).toMatch(/const store = useEditorStore\.getState\(\);/);
    expect(undoBlock).toMatch(/if \(store\.gestureSnapshot\) return;/);
    expect(undoBlock).toMatch(/store\.undo\(\);/);
    const redoBtnAt = viewSource.indexOf('aria-label="Redo"');
    expect(redoBtnAt).toBeGreaterThan(-1);
    const redoBlock = viewSource.slice(Math.max(0, redoBtnAt - 800), redoBtnAt);
    expect(redoBlock).toMatch(/const store = useEditorStore\.getState\(\);/);
    expect(redoBlock).toMatch(/if \(store\.gestureSnapshot\) return;/);
    expect(redoBlock).toMatch(/store\.redo\(\);/);
  });
});
