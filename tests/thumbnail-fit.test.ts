import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { thumbnailFit } from "../src/lib/editor";

// The thumbnail parent-fit scaling (session 65, S65-A — the
// thirteenth audit's A-1, the HIGH).
//
// THE DEFECT: the card thumbnail component computed the content fit
// into a hard-coded 16/10 coordinate space and anchored that FIXED
// painted box at the parent's top-left with no scale-to-parent
// transform — the parent's overflow crop did the "sizing". In the
// files list's square slot only a corner sliver of the fitted
// content was visible (the seeded demo elements measured zero
// visible area); in the grid's ratio-locked slot at laptop widths
// up to ~28% of the fitted content cropped off. The PAD's own
// session-39 decode of the reference documents the list slot as
// carrying the mini-canvas SCALED INSIDE — the implementation
// drifted from the documented contract the day it was ported.
//
// THE FIX: a pure fit seam (the min-fit scale + the centering
// translate) consumed by a measured wrapper transform — the painted
// structure is unchanged, one wrapper transform adapts it to any
// parent box.

const editorSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const cardSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/project-card.tsx"),
  "utf8",
);

describe("thumbnailFit — the pure seam (session 65, S65-A / A-1)", () => {
  it("a 16/10 parent over a 320x200 box scales to the EXACT fill with zero centering", () => {
    // The wide grid path: the ratio-locked parent is the box's own
    // aspect ratio — the fit fills it exactly and the translate is 0
    // (the >=1280 rendering is pixel-identical to the historical
    // full-box paint once the card is wider than the painted space).
    expect(thumbnailFit(460, 287.5, 320, 200)).toEqual({ scale: 460 / 320, tx: 0, ty: 0 });
  });

  it("a square 40x40 parent min-fits the box and centers it vertically", () => {
    // The files-list slot: the min-fit picks the height constraint
    // (40/200 < 40/320), rendering a 40x25 mini-canvas centered in
    // the square — the documented scaled-inside contract.
    const r = thumbnailFit(40, 40, 320, 200);
    expect(r.scale).toBeCloseTo(40 / 320, 10);
    expect(r.tx).toBeCloseTo(0, 10);
    expect(r.ty).toBeCloseTo((40 - 200 * (40 / 320)) / 2, 10);
  });

  it("a landscape parent wider than the box but shorter centers horizontally too", () => {
    // The min-fit can pick the width constraint: a 320x120 parent
    // fits to 320x200 -> scale 0.6, centered vertically with zero
    // horizontal translate.
    const r = thumbnailFit(320, 120, 320, 200);
    expect(r.scale).toBeCloseTo(120 / 200, 10);
    expect(r.tx).toBeCloseTo((320 - 320 * 0.6) / 2, 10);
    expect(r.ty).toBeCloseTo(0, 10);
  });

  it("degenerate non-positive parent dimensions return the identity", () => {
    // Unmeasured / hidden containers (clientWidth 0) must not render
    // a degenerate zero-scale paint — the identity keeps the painted
    // structure until a real measurement lands.
    expect(thumbnailFit(0, 40, 320, 200)).toEqual({ scale: 1, tx: 0, ty: 0 });
    expect(thumbnailFit(40, 0, 320, 200)).toEqual({ scale: 1, tx: 0, ty: 0 });
  });

  it("the pure seam is exported from the single editor lib module", () => {
    expect(editorSource).toMatch(/export function thumbnailFit\(/);
  });
});

describe("the measured wrapper wiring (session 65, S65-A / A-1)", () => {
  it("the thumbnail root carries a ref and a measured-fit layout effect with a resize observer", () => {
    // THE DEFECT PIN: pre-fix the painted wrapper carried only a
    // static origin anchor — no measurement, no observer, no
    // adaptation to the parent's rendered size.
    expect(cardSource).toMatch(/useRef</);
    expect(cardSource).toMatch(/ResizeObserver/);
    expect(cardSource).toMatch(/thumbnailFit\(/);
  });

  it("the painted wrapper's transform composes the centering translate with the fit scale", () => {
    // THE DEFECT PIN: pre-fix the wrapper's style carried only the
    // width/height/origin — the transform must now place the scaled
    // box (translate FIRST in the outer space, then the scale).
    const start = cardSource.indexOf('className="absolute"');
    expect(start).toBeGreaterThan(-1);
    const window = cardSource.slice(start, start + 400);
    expect(window).toMatch(/transform: `translate\(\$\{fit\.tx\}px, \$\{fit\.ty\}px\) scale\(\$\{fit\.scale\}\)`/);
    expect(window).toMatch(/transformOrigin: "left top"/);
  });
});
