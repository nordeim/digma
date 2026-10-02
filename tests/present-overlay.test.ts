import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The PresentOverlay measure-before-paint seam (session 55, S55-A —
// the session-53 audit's deferred finding F-3).
//
// The overlay's viewport fit (`setScale(min(w/1000, h/700))`) used to
// run its mount-time `compute()` inside a PASSIVE effect body — a
// synchronous setState in the effect body that commits a SECOND render
// after mount, and the first painted frame could flash at `scale(1)`
// before the fit lands (the overlay is a fullscreen takeover, so the
// flash is one full-screen repaint at the wrong geometry).
//
// The fix: the mount-time measurement + its resize subscription run
// in `React.useLayoutEffect` — React's sanctioned measure-before-paint
// hook. The layout-phase setState re-renders synchronously BEFORE the
// browser paints, so the first painted frame already carries the
// fitted scale; the "redundant mount render" never becomes a visible
// artifact. (The listener registration inside a layout effect is
// inert timing-wise — the setState-before-paint is the contract.)
//
// This suite pins the seam as a SOURCE contract (the
// canvas-memo/guarded-number-input/sheet-descriptions pattern); the
// overlay's user-facing behavior (exit affordance, focus contract,
// scroll lock, Escape) is pinned by tests/e2e/present-mode.spec.ts.

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

/** Extract one top-level function's source block by name. */
function functionSource(name: string): string {
  const start = viewSource.indexOf(`function ${name}(`);
  expect(start, `the ${name} component must exist in the editor view`).toBeGreaterThan(-1);
  // The next top-level `function ` after the start bounds the block.
  const rest = viewSource.slice(start + 1);
  const next = rest.indexOf("\nfunction ");
  return next === -1 ? viewSource.slice(start) : viewSource.slice(start, start + 1 + next);
}

describe("PresentOverlay — the viewport fit measures BEFORE paint (session 55, S55-A / F-3)", () => {
  it("the mount-time compute runs inside useLayoutEffect (the measure-before-paint hook)", () => {
    const overlay = functionSource("PresentOverlay");
    // THE seam: a layout effect whose body calls compute() — the
    // synchronous setScale commits before the browser paints. (The
    // non-greedy [\s\S]*? spans the nested compute() declaration —
    // the pin targets the CALL, `compute();`, which the declaration
    // itself never produces.)
    expect(overlay).toMatch(
      /React\.useLayoutEffect\(\(\)\s*=>\s*\{[\s\S]*?compute\(\);/,
    );
  });

  it("no passive mount-time compute remains (the flash-at-scale-1 path is gone)", () => {
    const overlay = functionSource("PresentOverlay");
    // The overlay's OWN effects that reference compute() must all be
    // layout effects: strip every useLayoutEffect block, then assert
    // no passive useEffect body still calls compute().
    const withoutLayout = overlay.replace(
      /React\.useLayoutEffect\(\(\)\s*=>\s*\{[\s\S]*?\n\s*\},\s*\[\]\);?/g,
      "",
    );
    expect(
      withoutLayout.match(/useEffect\([^)]*\)\s*=>\s*\{[^}]*compute\(\)/),
      "compute() must not run in a passive effect body (F-3: one redundant mount render + a scale(1) first paint)",
    ).toBeNull();
    // The resize subscription follows the measurement (one effect
    // block owns the fit: measure + subscribe together).
    expect(overlay).toMatch(/window\.addEventListener\("resize", compute\)/);
    expect(overlay).toMatch(/return \(\)\s*=>\s*window\.removeEventListener\("resize", compute\)/);
  });
});
