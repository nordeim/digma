import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The mobile properties helper's gesture-aware commit (session 64,
// S64-A — the twelfth audit's A-1, the HIGH).
//
// THE DEFECT: the mobile properties Sheet's `update` helper called
// updateElements WITHOUT the third argument, so the store defaulted
// the commit to true — every slider tick and every Content keystroke
// INSIDE THE MOBILE SHEET pushed a full history snapshot. The desktop
// panel's helper had carried the gesture-aware form since session 62,
// but the mobile surface renders the SAME shared section stack, so
// the S62-A per-tick flooding defect was re-introduced on the one
// surface the fix missed: a single 0→100 opacity drag on a phone
// flooded the 60-deep past stack and left per-tick undo granularity.
//
// THE FIX: the mobile helper passes the same gesture-aware default
// the desktop helper carries — mid-gesture ticks commit without a
// history entry; the single gesture snapshot lands at endGesture.

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

describe("the mobile update helper's gesture-aware commit (session 64, S64-A / A-1)", () => {
  it("the mobile helper passes the gesture-aware commit argument", () => {
    // THE DEFECT PIN: pre-fix the mobile helper's updateElements call
    // carried only two arguments (ids, patch) — the store defaulted
    // commit to true and every mid-gesture tick pushed history.
    const start = viewSource.indexOf("const update = React.useCallback((patch: Partial<DesignElementDTO>) => {");
    expect(start).toBeGreaterThan(-1);
    const end = viewSource.indexOf("}, []);", start);
    expect(end).toBeGreaterThan(start);
    const body = viewSource.slice(start, end);
    expect(body).toMatch(/updateElements\(/);
    expect(body).toMatch(/selectedIds,/);
    expect(body).toMatch(/patch,/);
    // THE THIRD ARGUMENT — the gesture-aware form (a mid-gesture tick
    // commits history-free; the gesture's own snapshot lands at its
    // end). Pre-fix this line had no such argument at all.
    expect(body).toMatch(/gestureSnapshot === null/);
  });

  it("the mobile helper reads the store at call time (the stale-closure preservation)", () => {
    // PRESERVATION: the helper reads the store through getState() at
    // CALL time — never a stale closure over the subscribed state.
    const start = viewSource.indexOf("const update = React.useCallback((patch: Partial<DesignElementDTO>) => {");
    const end = viewSource.indexOf("}, []);", start);
    const body = viewSource.slice(start, end);
    expect(body).toMatch(/useEditorStore\.getState\(\)/);
    expect(body).toMatch(/if \(s\.selectedIds\.length === 0\) return;/);
  });

  it("the desktop panel helper keeps its own gesture-aware form (the sibling preservation)", () => {
    // PRESERVATION: the desktop helper (properties-panel.tsx) must
    // keep the identical third-argument form — the two surfaces share
    // the doctrine and must not drift apart again.
    const panelSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
      "utf8",
    );
    const start = panelSource.indexOf("const update = (patch: Parameters<");
    expect(start).toBeGreaterThan(-1);
    const end = panelSource.indexOf(");", start);
    const body = panelSource.slice(start, end);
    expect(body).toMatch(/useEditorStore\.getState\(\)\.updateElements\(/);
    expect(body).toMatch(/useEditorStore\.getState\(\)\.gestureSnapshot === null,/);
  });
});
