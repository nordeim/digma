import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The number-input gesture coalescing (session 65, S65-C — the
// thirteenth audit's B-2, the MEDIUM).
//
// THE DEFECT: the two number-input components committed every finite
// keystroke live, and the update helper's gesture-aware commit
// argument is TRUE outside a gesture — so every DIGIT of a typed
// number pushed a full history snapshot. Typing a three-digit value
// into one position field produced three undo entries with per-digit
// undo granularity; a focused session across the position/size/font/
// stop fields flooded the 60-deep stack and evicted earlier work.
// The sliders and the Content textarea got the burst-coalescing
// treatment in earlier sessions; the number inputs got nothing.
//
// THE FIX: both components get the Content input's exact wiring —
// focus arms a fresh field gesture, the committing change branch
// feeds the idle-coalesced tick (one history entry per typing
// burst), and blur finishes. The live value contract and the
// empty-draft guard are untouched.

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);

function componentWindow(name: string): string {
  const start = panelSource.indexOf(`function ${name}(`);
  expect(start).toBeGreaterThan(-1);
  const end = panelSource.indexOf("\n}\n", start);
  return panelSource.slice(start, end);
}

describe("NumberField — the field-surface wiring (session 65, S65-C / B-2)", () => {
  it("the input arms a field gesture on focus and finishes it on blur", () => {
    // THE DEFECT PIN: pre-fix the component wired no gesture
    // lifecycle at all — every keystroke was a keyboard-only commit
    // (the default-true history push).
    const w = componentWindow("NumberField");
    expect(w).toMatch(/onFocus=\{\(\) => sliderGesture\.begin\("field"\)\}/);
    expect(w).toMatch(/sliderGesture\.finish\("field"\)/);
  });

  it("the committing change branch feeds the idle-coalesced tick BEFORE the value commit", () => {
    // THE DEFECT PIN: pre-fix the finite branch called the onChange
    // alone. The ordering matters: the tick arms the burst gesture on
    // demand FIRST, then the value commit lands WITH the gesture
    // aware (no per-digit snapshot); the 150ms idle or the blur ends
    // the burst with its single entry.
    const w = componentWindow("NumberField");
    const m = w.match(/if \(Number\.isFinite\(parsed\)\) \{([\s\S]*?)\n\s*\}/);
    expect(m).not.toBeNull();
    expect(m![1]).toMatch(/sliderGesture\.textTick\(\)/);
    expect(m![1]).toMatch(/onChange\(parsed\)/);
    const tickIdx = m![1].indexOf("sliderGesture.textTick()");
    const commitIdx = m![1].indexOf("onChange(parsed)");
    expect(tickIdx).toBeGreaterThan(-1);
    expect(commitIdx).toBeGreaterThan(tickIdx);
  });

  it("the empty-draft guard survives (the never-commit-an-empty-prefix contract)", () => {
    // PRESERVATION: the S21-2 guard must stay exactly — an empty
    // prefix is the user mid-edit, never a request for zero.
    const w = componentWindow("NumberField");
    expect(w).toMatch(/event\.target\.value\.trim\(\) === ""/);
    expect(w).toMatch(/return;/);
  });
});

describe("GuardedNumberInput — the same wiring on the inline form (session 65, S65-C / B-2)", () => {
  it("the inline input arms a field gesture on focus and finishes it on blur", () => {
    const w = componentWindow("GuardedNumberInput");
    expect(w).toMatch(/onFocus=\{\(\) => sliderGesture\.begin\("field"\)\}/);
    expect(w).toMatch(/sliderGesture\.finish\("field"\)/);
  });

  it("the committing change branch feeds the idle-coalesced tick before the value commit", () => {
    const w = componentWindow("GuardedNumberInput");
    const m = w.match(/if \(Number\.isFinite\(parsed\)\) \{([\s\S]*?)\n\s*\}/);
    expect(m).not.toBeNull();
    expect(m![1]).toMatch(/sliderGesture\.textTick\(\)/);
    expect(m![1]).toMatch(/onChange\(parsed\)/);
  });

  it("the abandoned-draft blur restore survives (the input never dead-ends empty)", () => {
    // PRESERVATION: the blur restores an empty or unparseable draft
    // to the current value.
    const w = componentWindow("GuardedNumberInput");
    expect(w).toMatch(/setDraft\(display\)/);
  });
});
