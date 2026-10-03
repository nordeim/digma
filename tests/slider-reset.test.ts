import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The sliderGesture reset seam (session 65, S65-B — the thirteenth
// audit's B-1, the HIGH).
//
// THE DEFECT: the module-level gesture helper's terminals were all
// element-scoped pointer events. When the host surface (the mobile
// Sheet or the desktop panel) unmounted mid-drag — the lg-crossing
// close, the overlay tap, Escape, the X, the chip toggle, navigation —
// the pointerup/cancel/lostcapture never reached the DETACHED slider:
// the closure kept its open-gesture state and the store kept the
// armed snapshot. Three traced consequences: (a) the autosave's saved
// marking deferred forever behind the armed snapshot while the
// subscriber kept re-arming the debounced flush — the endless PUT
// loop with the badge never converging; (b) the gesture-aware commit
// argument read false — every subsequent panel edit silently stopped
// pushing undo history; (c) after a navigation the project load
// reset the STORE's snapshot but not the CLOSURE — the next
// same-surface begin skipped arming entirely, regressing the pinned
// one-entry-per-gesture contract to per-tick flooding.
//
// THE FIX: the closure gains a reset() — the idle timer cleared, a
// CHANGED leaked gesture ends (its partial drag keeps the one undo
// entry), an unchanged one cancels, and the owner state returns to
// clean. Every host surface consumes it on unmount (the sheet
// primitives unmount their content on every close path), and the
// project-load wiring heals a closure leaked across a same-session
// project swap.

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

describe("the reset seam on the closure (session 65, S65-B / B-1)", () => {
  it("the closure exposes a reset that flushes a changed leaked gesture and cancels an unchanged one", () => {
    // THE DEFECT PIN: pre-fix no such terminal existed — the only
    // ends were the four element-scoped pointer events.
    expect(panelSource).toMatch(/reset: \(\) => \{/);
    const start = panelSource.indexOf("reset: () => {");
    expect(start).toBeGreaterThan(-1);
    const end = panelSource.indexOf("},", start);
    const body = panelSource.slice(start, end);
    expect(body).toMatch(/clearIdle\(\)/);
    expect(body).toMatch(/endGesture\(\)/);
    expect(body).toMatch(/cancelGesture\(\)/);
  });

  it("the reset distinguishes changed from unchanged through the same convention as finish", () => {
    // The flush semantics mirror the finish terminal: a changed
    // gesture ENDS (history keeps the entry), an unchanged one
    // CANCELS (nothing happened). A reset that always ended would
    // push empty no-op snapshots; one that always cancelled would
    // drop a partial drag's edit history.
    const start = panelSource.indexOf("reset: () => {");
    const end = panelSource.indexOf("},", start);
    const body = panelSource.slice(start, end);
    expect(body).toMatch(/if \(changed\)/);
    expect(body).toMatch(/activeSurface = null/);
  });

  it("the module exports the reset for the host surfaces to consume", () => {
    expect(panelSource).toMatch(/export (?:const|function) resetSliderGesture/);
  });
});

describe("the unmount consumption (session 65, S65-B / B-1)", () => {
  it("the desktop panel unmounts through the reset cleanup", () => {
    // THE DEFECT PIN: pre-fix the panel component had no teardown of
    // the module-level closure state — unmounting mid-drag leaked it.
    expect(panelSource).toMatch(/resetSliderGesture\(\)/);
  });

  it("the two mobile sheet hosts in the editor shell unmount through the reset cleanup", () => {
    // THE DEFECT PIN: pre-fix the shell carried no cleanup import or
    // effect for the closure. The two mobile surfaces are the exact
    // leak window the audit traced (the mid-drag close paths).
    expect(viewSource).toMatch(/resetSliderGesture/);
    const hits = viewSource.match(/resetSliderGesture/g) ?? [];
    // The loadProject heal + the two sheet-host unmount cleanups.
    expect(hits.length).toBeGreaterThanOrEqual(3);
  });

  it("the project-load wiring heals a closure leaked across a same-session project swap", () => {
    // THE DEFECT PIN: pre-fix the store's load reset the SNAPSHOT but
    // nothing reset the CLOSURE — the stale owner made the next
    // same-surface begin skip arming (the per-tick regression).
    // Anchored on the LOAD CALL itself (the prose mentions of the
    // action in comments are not call sites).
    const idx = viewSource.indexOf("loadProject(");
    expect(idx).toBeGreaterThan(-1);
    const window = viewSource.slice(Math.max(0, idx - 900), idx + 300);
    expect(window).toMatch(/resetSliderGesture\(\)/);
  });
});
