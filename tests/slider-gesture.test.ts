import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The slider/text gesture seam (session 62, S62-A — the tenth audit's
// A-M2).
//
// THE DEFECT: every properties-panel range input's onChange routed
// through `update` → `updateElements` with the default commit=true —
// one FULL snapshotOf(state) per intermediate drag tick. A single
// 0→100 opacity drag emitted up to 100 committed mutations: the
// 60-deep `past` stack flooded (earlier work became unreachable) and
// Ctrl+Z stepped back ONE TICK per press. The S56-A one-history-entry-
// per-gesture doctrine was applied to canvas drags but never to the
// panel controls. The TextSection Content input carried the same
// shape per keystroke.
//
// THE FIX: the S56-A doctrine reaches the panel. A module-level
// sliderGesture helper wires beginGesture() on pointerdown and
// endGesture()/cancelGesture() on the terminal signals (a gesture
// that changed nothing cancels — the canvas moved/cancel
// convention). The `update` helper's default commit becomes
// gesture-aware: mid-gesture ticks commit WITHOUT history; the single
// gesture snapshot lands at endGesture. The Content input gains the
// same seam on focus/blur.

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

const SLIDER_SITES = [
  "Opacity", // inline
  "Rotation", // inline
  "Scale", // inline
  "Gradient angle", // inline (the gradient section's own input)
];

describe("the slider gesture seam (session 62, S62-A / A-M2)", () => {
  it("a module-level sliderGesture helper drives the seam with the moved/cancel convention", () => {
    // THE DEFECT PIN: pre-fix no gesture wiring existed anywhere in the
    // properties panel.
    expect(panelSource).toMatch(/const sliderGesture = \(\(\) => \{/);
    expect(panelSource).toMatch(/beginGesture\(\)/);
    expect(panelSource).toMatch(/endGesture\(\)/);
    expect(panelSource).toMatch(/cancelGesture\(\)/);
    // The moved/cancel convention: a gesture that changed nothing
    // cancels (no no-op history entry) — the canvas doctrine.
    expect(panelSource).toMatch(/if \(changed\) store\.endGesture\(\);\s*else store\.cancelGesture\(\);/);
  });

  it("the shared SliderRow wires the gesture handlers onto its range input", () => {
    // THE DEFECT PIN: pre-fix the SliderRow input carried only
    // onChange — no pointer handlers.
    const start = panelSource.indexOf("function SliderRow(");
    expect(start).toBeGreaterThan(-1);
    const end = panelSource.indexOf("function ", start + 10);
    const body = panelSource.slice(start, end);
    // Session 64 (S64-B — a legitimate contract update): the handlers
    // became arrow wrappers carrying surface tokens (the begin/blur
    // interleaving fix) — the gesture wiring itself is unchanged.
    expect(body).toMatch(/onPointerDown=\{\(\) => sliderGesture\.begin\("slider"\)\}/);
    expect(body).toMatch(/onPointerUp=\{\(\) => sliderGesture\.finish\("slider"\)\}/);
    expect(body).toMatch(/onPointerCancel=\{\(\) => sliderGesture\.finish\("slider"\)\}/);
    expect(body).toMatch(/onLostPointerCapture=\{\(\) => sliderGesture\.finish\("slider"\)\}/);
  });

  it("every inline range slider carries the same gesture handler bundle", () => {
    // THE DEFECT PIN: pre-fix the four inline sliders (Rotation, Scale,
    // Opacity, Gradient angle) had no gesture wiring.
    for (const label of SLIDER_SITES) {
      const idx = panelSource.indexOf(`aria-label="${label}"`);
      expect(idx).toBeGreaterThan(-1);
      // The handler bundle sits on the SAME input element as the label.
      const inputStart = panelSource.lastIndexOf("<input", idx);
      const inputEnd = panelSource.indexOf("/>", idx);
      const input = panelSource.slice(inputStart, inputEnd);
      // Session 64 (S64-B — the same legitimate update as the SliderRow
      // pin: surface-token arrow wrappers, same gesture wiring).
      expect(input).toMatch(/onPointerDown=\{\(\) => sliderGesture\.begin\("slider"\)\}/);
      expect(input).toMatch(/onPointerUp=\{\(\) => sliderGesture\.finish\("slider"\)\}/);
      expect(input).toMatch(/onPointerCancel=\{\(\) => sliderGesture\.finish\("slider"\)\}/);
      expect(input).toMatch(/onLostPointerCapture=\{\(\) => sliderGesture\.finish\("slider"\)\}/);
    }
  });

  it("the update helper's default commit is gesture-aware (mid-gesture ticks commit without history)", () => {
    // THE DEFECT PIN: pre-fix `update` unconditionally committed:
    //   const update = (patch) =>
    //     useEditorStore.getState().updateElements(selectedIds, patch);
    // The fix: the default commit reads the store's gestureSnapshot —
    // mid-gesture commits land without a history entry; the single
    // gesture snapshot lands at endGesture.
    const updateStart = panelSource.indexOf("const update = (patch: Parameters");
    expect(updateStart).toBeGreaterThan(-1);
    const updateEnd = panelSource.indexOf(");", updateStart);
    expect(updateEnd).toBeGreaterThan(updateStart);
    const updateBody = panelSource.slice(updateStart, updateEnd);
    expect(updateBody).toMatch(/=>/);
    expect(updateBody).toMatch(/useEditorStore\.getState\(\)\.updateElements\(/);
    expect(updateBody).toMatch(/selectedIds,/);
    expect(updateBody).toMatch(/patch,/);
    expect(updateBody).toMatch(/useEditorStore\.getState\(\)\.gestureSnapshot === null,/);
  });

  it("the Content input carries the idle-coalesced text gesture seam (one history entry per typing burst)", () => {
    // THE DEFECT PIN: pre-fix every keystroke in the Content input
    // committed a full snapshot (the same flooding shape). The en-route
    // lesson: a pure focus/blur session leaves the gesture open when
    // focus is held (fill(), the mobile Sheet) — the machine's gesture
    // deferral kept the badge unsaved. The delivered form coalesces on
    // a 150ms idle: each keystroke re-arms the timer, the idle (or
    // blur) ends the gesture.
    const idx = panelSource.indexOf('aria-label="Text content"');
    expect(idx).toBeGreaterThan(-1);
    const inputStart = panelSource.lastIndexOf("<input", idx);
    const inputEnd = panelSource.indexOf("/>", idx);
    const input = panelSource.slice(inputStart, inputEnd);
    // Session 64 (S64-B — a legitimate contract update): the focus/blur
    // pair became surface-token arrow wrappers (the interleaving fix);
    // the idle-coalesced seam itself is unchanged.
    expect(input).toMatch(/onFocus=\{\(\) => sliderGesture\.begin\("text"\)\}/);
    expect(input).toMatch(/onBlur=\{\(\) => sliderGesture\.finish\("text"\)\}/);
    expect(input).toMatch(/sliderGesture\.textTick\(\)/);
    // The idle-coalescing machinery: the timer, the re-arm, the
    // begin-on-demand for a fresh burst. Session 64 (S64-B): the timer
    // fires the surface-aware finish; the begin-on-demand also records
    // the owning surface. Session 65 (S65-C — a legitimate contract
    // update): the idle now ends WHICHEVER surface owns the gesture —
    // the number fields feed the same tick under their own "field"
    // token, and a hardcoded text label made the idle a NO-OP for them
    // (the gesture never ended; the autosave deferral looped forever).
    // The surface is captured at ARM time; the ownership guard inside
    // finish keeps a canvas-superseded burst from touching the store.
    expect(panelSource).toMatch(/idleTimer = setTimeout\(\(\) => finish\(surface\), 150\);/);
    expect(panelSource).toMatch(/const surface = activeSurface \?\? "text";/);
    expect(panelSource).toMatch(/armed = useEditorStore\.getState\(\)\.gestureSnapshot;/);
    expect(panelSource).toMatch(/const ownsCurrentGesture = \(\) =>/);
  });

  it("the en-route isTypingTarget carve-out — a range input is not a typing target (the undo shortcut must not stand down behind a slider)", () => {
    // THE EN-ROUTE DEFECT PIN (found while proving the e2e pin): the
    // blanket input exemption left Ctrl+Z dead with focus resting on a
    // slider — the drag's own undo entry existed but was unreachable
    // from the keyboard (observed live: 20 Ctrl+Z presses, the value
    // never moved). A range input accepts no text; the carve-out lets
    // the shortcuts through while text inputs keep the exemption.
    // Session 64 (S64-G / A-4 — a legitimate contract update): the
    // predicate moved to its single source (src/lib/editor.ts) — the
    // shell and the canvas consume the SAME export; the carve-out
    // contract itself is unchanged.
    const editorLibSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
      "utf8",
    );
    expect(editorLibSource).toMatch(/export function isTypingTarget\(/);
    expect(editorLibSource).toMatch(/const type = \(el as HTMLInputElement\)\.type;\s*return type !== "range";/);
    expect(viewSource).toMatch(/import \{[^}]*isTypingTarget[^}]*\} from "@\/lib\/editor"/);
  });

  it("the store's gesture seam is untouched doctrine (the preservation pin)", () => {
    // PRESERVATION PIN: the store's existing gesture contract — the
    // snapshot captures the PRE-gesture state, endGesture pushes THAT
    // snapshot as the ONE history entry.
    expect(storeSource).toMatch(/beginGesture: \(\) => set\(\(state\) => \(\{ gestureSnapshot: snapshotOf\(state\) \}\)\)/);
    expect(storeSource).toMatch(
      /endGesture: \(\)\s*=>\s*set\(\(state\)\s*=>\s*state\.gestureSnapshot\s*\?\s*\{\s*past: \[\.\.\.state\.past, state\.gestureSnapshot\]\.slice\(-60\),/,
    );
  });
});
