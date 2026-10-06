import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-70 client low batch (S70-D — the eighteenth audit's L-A6 +
// L-A7 + L-A8).
//
// THE DEFECTS: (L-A6) the `?` shortcut handler fires BEFORE the
// ctrl/meta/alt modifier bail — Ctrl+? / Cmd+? / Alt+? open the shortcuts
// dialog and preventDefault the chord, violating the handler's own
// single-key contract (the bail's comment: "Tool keys are single-key
// shortcuts by contract"). (L-A7) the line-width clamp asymmetry across
// four sites — the draw commit is type-aware (line → 0 floor, non-line →
// 1), but the resize write-back floors ALL widths at 1, scaleElements
// floors width at 1 for every type AND height at 0 for every type, and
// the panel W field floors at 1 for every type: a 0-extent line
// dimension silently becomes 1 on any later resize/scale/panel edit.
// (L-A8) the SliderRow fill percentage has no degenerate guard — max ===
// min (a 0-dimension element) renders --range-fill: NaN%; an
// out-of-range persisted radius renders >100%.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the ?-shortcut modifier bail ordering (S70-D / L-A6)", () => {
  const view = src("src/components/editor/editor-view.tsx");

  it("the modifier bail precedes the ? branch (chords never open the dialog)", () => {
    // THE DEFECT PIN: pre-fix the ? branch (line ~450) fires 64 lines
    // before the bail (line ~514) — Ctrl+?/Cmd+?/Alt+? open the dialog
    // and preventDefault the chord.
    const handlerStart = view.indexOf("const store = useEditorStore.getState();");
    const bailIdx = view.indexOf("if (event.ctrlKey || event.metaKey || event.altKey) return;");
    const questionIdx = view.indexOf('if (event.key === "?") {');
    expect(bailIdx).toBeGreaterThan(-1);
    expect(questionIdx).toBeGreaterThan(-1);
    expect(bailIdx).toBeLessThan(questionIdx);
  });

  it("the ? branch keeps the Shift+/ convention + the preventDefault", () => {
    // THE PRESERVATION PIN: plain Shift+/ still opens the dialog from
    // anywhere in the editor (the S49-2 contract).
    const questionIdx = view.indexOf('if (event.key === "?") {');
    const branch = view.slice(questionIdx, questionIdx + 300);
    expect(branch).toMatch(/onOpenShortcuts\(\)/);
    expect(branch).toMatch(/event\.preventDefault\(\)/);
  });
});

describe("the line-width clamp symmetry (S70-D / L-A7)", () => {
  it("the resize write-back floors the line width at 0 (type-aware, both dimensions)", () => {
    // THE DEFECT PIN: pre-fix width floors at 1 for EVERY type
    // (canvas.tsx:284) while the height is type-aware.
    const canvas = src("src/components/editor/canvas.tsx");
    const upIdx = canvas.indexOf("store.updateElements(\n        [el.id],\n        { x, y, width: Math.max(w / s, 1)");
    // Post-fix the write-back carries the type-aware width form.
    expect(canvas).toMatch(/width: Math\.max\(w \/ s, el\.type === "line" \? 0 : 1\)/);
    expect(canvas).not.toMatch(/width: Math\.max\(w \/ s, 1\)/);
  });

  it("the draw commit keeps its type-aware form (the standing contract)", () => {
    // THE PRESERVATION PIN: the draw path already symmetrizes.
    const canvas = src("src/components/editor/canvas.tsx");
    expect(canvas).toMatch(/width: drag\.type === "line" \? drag\.w : Math\.max\(drag\.w, 1\)/);
    expect(canvas).toMatch(/height: drag\.type === "line" \? drag\.h : Math\.max\(drag\.h, 1\)/);
  });

  it("scaleElements floors both dimensions type-aware (line 0 / non-line 1)", () => {
    // THE DEFECT PIN: pre-fix width floors at 1 for every type and height
    // at 0 for every type (editor-store.ts:286).
    // Session 86: legitimately re-anchored from the inline
    // `Math.max(el.width * factor, el.type === "line" ? 0 : 1)` form —
    // S86-B moved the SAME type-aware floor (unchanged) into the shared
    // clampSizeField helper so the multiplicative path could also gain
    // the server's 100000 ceiling (the sanitizer bounds the multiplier,
    // never the product); the intent (line → 0, non-line → 1 — the draw
    // commit's own contract) is byte-identical inside the helper.
    const store = src("src/components/editor/editor-store.ts");
    expect(store).toMatch(/width: clampSizeField\(el\.width \* factor, el\.type\)/);
    expect(store).toMatch(/height: clampSizeField\(el\.height \* factor, el\.type\)/);
    expect(store).not.toMatch(/width: Math\.max\(el\.width \* factor, 1\)/);
    expect(store).not.toMatch(/height: Math\.max\(el\.height \* factor, 0\)/);
  });

  it("the panel W field floors type-aware (matching the H field's form)", () => {
    // THE DEFECT PIN: pre-fix the W field floors at 1 for every type
    // (properties-panel.tsx:980).
    // Session 84: legitimately re-anchored from the inline
    // `element.type === "line" ? Math.max(width, 0) : Math.max(width, 1)`
    // form — S84-B moved the SAME type-aware floor (unchanged) into the
    // shared clampSizeField helper (src/lib/editor.ts) so the field could
    // also gain the server's 100000 ceiling; the intent (a 0-extent line
    // dimension stays 0, every other shape floors at 1 — the draw commit's
    // own contract) is byte-identical inside the helper.
    const panel = src("src/components/editor/properties-panel.tsx");
    expect(panel).toMatch(/label="W"[\s\S]{0,220}clampSizeField\(width, element\.type\)/);
    // The type-aware floor itself lives on in the shared helper (the
    // H field consumes the same form).
    const editorLib = src("src/lib/editor.ts");
    expect(editorLib).toMatch(/const floor = type === "line" \? 0 : 1;/);
    expect(panel).toMatch(/clampSizeField\(height, element\.type\)/);
  });
});

describe("the SliderRow degenerate guard (S70-D / L-A8)", () => {
  it("the fill percentage clamps (no NaN, no out-of-range fills)", () => {
    // THE DEFECT PIN: pre-fix the raw division renders NaN% when
    // max === min and >100%/<0% for out-of-range values.
    const panel = src("src/components/editor/properties-panel.tsx");
    expect(panel).not.toMatch(/const fill = `\$\{\(\(\(value - min\) \/ \(max - min\)\) \* 100\)\.toFixed\(2\)\}%`;?/);
    // Session 71 re-anchor (S71-D / L-A9): the guarded form graduated
    // into the ONE shared rangeFillPercent seam (src/lib/editor.ts) —
    // consumed here at the SliderRow AND at the four inline sliders.
    expect(panel).toMatch(/const pct = rangeFillPercent\(value, min, max\)/);
    expect(panel).not.toMatch(/max > min \? Math\.min\(Math\.max\(/);
  });
});
