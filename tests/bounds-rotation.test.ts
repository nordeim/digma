import { describe, expect, it } from "vitest";
import { boundsOf, fitToBounds, type DesignElementDTO } from "../src/lib/editor";

function el(partial: Partial<DesignElementDTO>): DesignElementDTO {
  return {
    id: "el",
    projectId: "p",
    type: "rectangle",
    name: null,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rotation: 0,
    scale: 1,
    opacity: 1,
    fill: null,
    stroke: null,
    strokeWidth: 0,
    radius: 0,
    text: null,
    fontSize: null,
    fontFamily: null,
    fontWeight: null,
    textAlign: null,
    fillGradient: null,
    fillImage: null,
    fillImageFit: null,
    visible: true,
    locked: false,
    sortOrder: 0,
    ...partial,
  };
}

// The rotation-aware boundsOf (session 64, S64-C — the twelfth
// audit's A-3).
//
// THE DEFECT: boundsOf computed the footprint from x/y/width×scale
// only — rotation never entered the math — while the canvas hit-test
// inverse-maps through the corner-anchored rotation. A rotated
// element was SELECTED where it rendered but its selection outline,
// resize handles, and marquee containment all ran on the
// unrotated footprint: a 90°-rotated element's outline and handles
// landed completely off its visual bounds. The clone's per-element
// rotation is a superset feature — a superset must be internally
// coherent (the F22 doctrine). (Session 72, S72-D: the resize DRAG
// MATH itself stays axis-aligned by scope — the handles are
// positioned on this rotation-aware footprint, but their drag deltas
// apply world-axis deltas to the local width/height; rotated resize
// is the documented deferral.)
//
// THE FIX: fold the four corner-anchored rotated corners into the
// min/max. The rotation=0 path returns the historical math EXACTLY
// (pixel-identical for the unrotated case).

describe("the rotation-aware boundsOf (session 64, S64-C / A-3)", () => {
  it("an unrotated element keeps the historical footprint exactly (the fast-path preservation)", () => {
    const b = boundsOf([el({ x: 10, y: 20, width: 100, height: 50, rotation: 0 })]);
    expect(b).toEqual({ minX: 10, minY: 20, maxX: 110, maxY: 70 });
    // No rotation property at all — the same contract.
    const b2 = boundsOf([el({ x: 0, y: 0, width: 40, height: 30 })]);
    expect(b2).toEqual({ minX: 0, minY: 0, maxX: 40, maxY: 30 });
  });

  it("a 90-degree rotation swaps the visual axes around the corner anchor", () => {
    // The render chain is translate(x,y) scale(s) rotate(r) with
    // transform-origin 0 0: at 90° the corner (w,0) maps to (0,w) and
    // (0,h) maps to (-h,0). A 100×50 element at (10,20) rotated 90°
    // occupies x ∈ [10−50, 10], y ∈ [20, 20+100] → minX −40, maxX 10,
    // minY 20, maxY 120.
    const b = boundsOf([el({ x: 10, y: 20, width: 100, height: 50, rotation: 90 })]);
    expect(b!.minX).toBeCloseTo(-40, 5);
    expect(b!.minY).toBeCloseTo(20, 5);
    expect(b!.maxX).toBeCloseTo(10, 5);
    expect(b!.maxY).toBeCloseTo(120, 5);
  });

  it("a 45-degree rotation enlarges the footprint to the rotated AABB", () => {
    // A square of side s rotated 45° around its corner occupies an
    // AABB of side s·√2 anchored so the far corner reaches (s·√2,
    // s·√2) from the anchor... precisely: the corners (s,0)→(s·√2/2,
    // s·√2/2), (0,s)→(−s·√2/2, s·√2/2), (s,s)→(0, s·√2).
    const s = 100;
    const b = boundsOf([el({ x: 0, y: 0, width: s, height: s, rotation: 45 })]);
    const d = s * Math.SQRT1_2;
    expect(b!.minX).toBeCloseTo(-d, 5);
    expect(b!.minY).toBeCloseTo(0, 5);
    expect(b!.maxX).toBeCloseTo(d, 5);
    expect(b!.maxY).toBeCloseTo(s * Math.SQRT2, 5);
  });

  it("rotation composes with scale (the visual footprint of a scaled, rotated element)", () => {
    // Scale first in the render chain (uniform), then rotate: the
    // effective rect is (w·s × h·s) at the anchor, then rotated.
    const b = boundsOf([
      el({ x: 0, y: 0, width: 100, height: 50, scale: 2, rotation: 90 }),
    ]);
    expect(b!.minX).toBeCloseTo(-100, 5);
    expect(b!.maxX).toBeCloseTo(0, 5);
    expect(b!.minY).toBeCloseTo(0, 5);
    expect(b!.maxY).toBeCloseTo(200, 5);
  });

  it("multi-element bounds fold rotated and unrotated members together", () => {
    const b = boundsOf([
      el({ x: 0, y: 0, width: 40, height: 40, rotation: 0 }),
      el({ x: 100, y: 0, width: 40, height: 40, rotation: 90 }),
    ]);
    // The rotated member at (100,0) is a SQUARE — 90° leaves its 40×40
    // footprint intact (x ∈ [60, 100], y ∈ [0, 40]); the fold takes the
    // union with the unrotated member's [0, 40] × [0, 40].
    expect(b!.minX).toBeCloseTo(0, 5);
    expect(b!.maxX).toBeCloseTo(100, 5);
    expect(b!.minY).toBeCloseTo(0, 5);
    expect(b!.maxY).toBeCloseTo(40, 5);
  });

  it("fitToBounds consumes the rotated bounds (the zoom-to-fit contract composes)", () => {
    const b = boundsOf([el({ x: 0, y: 0, width: 100, height: 100, rotation: 45 })]);
    const fit = fitToBounds(b, 200, 200, 20);
    // The AABB's larger extent (s·√2 ≈ 141.42) must fit inside the
    // 200−2·20 = 160px box: the scale lands at ~1.13 — NOT the
    // unrotated 100/160 = 0.625 reading.
    expect(fit.scale).toBeGreaterThan(1.0);
    expect(fit.scale).toBeLessThan(1.2);
  });
});
