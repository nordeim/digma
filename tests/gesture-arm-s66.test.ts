import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The gesture-arm interleaving family (session 66, S66-A — the
// fourteenth audit's A-1 + A-2 + A-4, the MEDIUM set).
//
// THE DEFECTS: three interleaving holes in the one gesture seam the
// S64-B/S65-C ownership doctrine built. (A-1) a canvas pointerdown
// inside a typing burst's 150ms idle window OVERWROTE the armed
// pre-typing snapshot — the burst's undo entry silently vanished (the
// canvas's beginGesture is an unconditional store overwrite; the
// field's blur finish no-ops on the ownership check). (A-2) the
// closure's begin() armed through the store with no foreign-ride
// guard — a second finger focusing a panel field mid-canvas-drag
// clobbered the live canvas gesture (its history entry corrupted or
// deleted). (A-4) a BARE focus of a number field armed a store
// gesture with no idle escape — the autosave's markSaved deferral
// looped (~1 PUT/s badge oscillation) until a blur that might never
// come.
//
// THE FIX: the canvas flushes the closure's changed burst BEFORE its
// own arm (resetSliderGesture before beginGesture at both sites);
// begin() rides under a live foreign gesture instead of clobbering it
// (textTick's doctrine reaching the arm path); the redundant
// focus-begins are GONE from all three text/field surfaces — textTick
// arms on demand at the first committing event, so a read-only focus
// arms nothing.

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);

function componentWindow(source: string, name: string): string {
  const start = source.indexOf(`function ${name}(`);
  expect(start).toBeGreaterThan(-1);
  const end = source.indexOf("\n}\n", start);
  return source.slice(start, end);
}

describe("the canvas flush-foreign-first (session 66, S66-A / A-1)", () => {
  it("both canvas arm sites reset the panel closure BEFORE their own beginGesture", () => {
    // THE DEFECT PIN: pre-fix the canvas armed through the store
    // directly with no regard for the closure's live burst — the
    // store's beginGesture is an unconditional overwrite, so a burst
    // alive inside its 150ms idle window lost its armed pre-burst
    // snapshot and with it its undo entry.
    const hits = [...canvasSource.matchAll(/beginGesture\(\)/g)];
    expect(hits.length).toBe(2);
    for (const hit of hits) {
      const before = canvasSource.slice(Math.max(0, hit.index! - 400), hit.index!);
      expect(before.lastIndexOf("resetSliderGesture()")).toBeGreaterThan(
        before.lastIndexOf("beginGesture()") >= 0 ? before.lastIndexOf("beginGesture()") : -1,
      );
      // the reset must be CLOSE — within the same handler block, not
      // an accidental distant occurrence
      expect(before.lastIndexOf("resetSliderGesture()")).toBeGreaterThan(before.length - 400);
    }
  });

  it("the reset import is present in the canvas module", () => {
    expect(canvasSource).toMatch(
      /import \{[^}]*resetSliderGesture[^}]*\} from "\.\/properties-panel"/,
    );
  });
});

describe("the begin foreign-ride guard (session 66, S66-A / A-2)", () => {
  it("begin arms ONLY when the live store carries no gesture, and rides under a foreign one", () => {
    // THE DEFECT PIN: pre-fix begin() called store.beginGesture()
    // unconditionally whenever no panel gesture was active — a live
    // CANVAS gesture (armed through the store directly, never this
    // closure) was clobbered mid-drag by a second finger's focus.
    const start = panelSource.indexOf("begin: (surface: string) => {");
    expect(start).toBeGreaterThan(-1);
    const end = panelSource.indexOf("tick: () =>", start);
    const beginBody = panelSource.slice(start, end);
    // the guard: the arm call is gated on the LIVE store's snapshot
    // being null (re-read AFTER any flush — the captured getState()
    // predates the flush branch's own endGesture)
    expect(beginBody).toMatch(/const live = useEditorStore\.getState\(\)/);
    expect(beginBody).toMatch(/live\.gestureSnapshot === null/);
    expect(beginBody).toMatch(/armed = null/);
    // the arm branch and the ride-under branch are the two arms of
    // one decision — an if/else-if pair
    const ifIdx = beginBody.indexOf("live.gestureSnapshot === null");
    const elseIdx = beginBody.indexOf("} else if (");
    expect(ifIdx).toBeGreaterThan(-1);
    expect(elseIdx).toBeGreaterThan(ifIdx);
  });
});

describe("the focus-begin retirement (session 66, S66-A / A-4)", () => {
  it("the number fields no longer arm a gesture on bare focus", () => {
    // THE DEFECT PIN: pre-fix a read-only focus (clicking into a
    // field to look, no typing) armed a store gesture with NO idle
    // escape — the autosave's saved-marking deferred forever behind
    // the armed snapshot while the field stayed focused (~1 PUT/s,
    // the badge oscillating). The arm belongs to the first COMMITTING
    // event (textTick's begin-on-demand), never to the focus.
    for (const name of ["NumberField", "GuardedNumberInput"]) {
      const w = componentWindow(panelSource, name);
      expect(w).not.toMatch(/onFocus=\{\(\) => sliderGesture\.begin\("field"\)\}/);
    }
  });

  it("the Content input no longer arms a gesture on bare focus", () => {
    // The same retirement for the text surface — the S62-A
    // focus/blur wiring predates the idle coalescing; with the idle
    // in place the focus arm serves no purpose a first keystroke
    // does not, and a held focus (the mobile Sheet) looped the
    // autosave deferral with nothing typed.
    const start = panelSource.indexOf('aria-label="Text content"');
    expect(start).toBeGreaterThan(-1);
    // Session 85 (S85-B): the window anchors on the <input open tag —
    // the clamp comment block widened the element past the old fixed
    // 400-char window; the no-focus-arm intent unchanged.
    const inputStart = panelSource.lastIndexOf("<input", start);
    const w = panelSource.slice(inputStart, start + 200);
    expect(w).not.toMatch(/onFocus=\{\(\) => sliderGesture\.begin\("text"\)\}/);
    // PRESERVATION: the blur terminal stays — it ends a live burst
    // immediately instead of waiting out the 150ms idle, and no-ops
    // when nothing is armed.
    // Session 85 (S85-B / A85-L1): re-anchored onto the block form — the
    // gesture finish still runs FIRST (the idle-coalesced burst ends at
    // blur); the S85-B clamped commit follows it in the same block. The
    // intent (the blur terminal) unchanged.
    expect(w).toMatch(/onBlur=\{\(\) => \{\s*sliderGesture\.finish\("text"\);/);
  });

  it("the number fields keep their blur terminal and their committing tick", () => {
    // PRESERVATION: the S65-C burst contract survives the retirement
    // — the committing branch feeds the idle-coalesced tick (one
    // history entry per typing burst) and the blur finishes the
    // gesture early when the surface loses focus mid-burst. Session
    // 66 (S66-A, en-route): the tick carries the FIELD token so the
    // blur terminal actually ends the burst (the arm's surface must
    // match the blur's).
    for (const name of ["NumberField", "GuardedNumberInput"]) {
      const w = componentWindow(panelSource, name);
      expect(w).toMatch(/sliderGesture\.finish\("field"\)/);
      expect(w).toMatch(/sliderGesture\.textTick\("field"\)/);
      const tickIdx = w.indexOf('sliderGesture.textTick("field")');
      const commitIdx = w.indexOf("onChange(parsed)");
      expect(tickIdx).toBeGreaterThan(-1);
      expect(commitIdx).toBeGreaterThan(tickIdx);
    }
  });

  it("the slider's pointerdown-begin is untouched (a real gesture start, ticks follow)", () => {
    // PRESERVATION: the slider surface arms on POINTERDOWN — the drag
    // begins immediately and its terminal is the pointerup family
    // (plus the S65-B unmount reset). The bare-focus defect never
    // applied here.
    expect(panelSource).toMatch(/onPointerDown=\{\(\) => sliderGesture\.begin\("slider"\)\}/);
    expect(panelSource).toMatch(/onPointerUp=\{\(\) => sliderGesture\.finish\("slider"\)\}/);
  });
});
