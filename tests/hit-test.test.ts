import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The render-consistent hit test (session 56, S56-G — the Mode C audit's
// M-7).
//
// The render chain is translate(x,y) · scale(s) · rotate(r) with
// transformOrigin 0px 0px — the visual footprint of a scaled element is
// width*scale × height*scale anchored at (x,y), and rotation turns
// around that same corner anchor. The OLD elementIsPointInside tested the
// UNSCALED rect (an element at scale 2 rendered 4× its hit area — clicks
// on the outer visual region fell through to elements beneath) and its
// rotation branch rotated around the unscaled CENTER (geometrically
// inconsistent with the render's corner anchor).
//
// The fix inverse-maps the point through the render chain:
// local = rotate(-r) · ((p − (x,y)) / s), tested against
// 0 ≤ local ≤ (width, height). The function is EXPORTED for these pure
// geometry pins.

import { elementIsPointInside } from "@/components/editor/canvas";
import type { DesignElementDTO } from "@/lib/editor";

function rect(x: number, y: number, w: number, h: number, opts: Partial<DesignElementDTO> = {}): DesignElementDTO {
  return {
    id: "el",
    projectId: "p1",
    type: "rectangle",
    name: "el",
    sortOrder: 0,
    zIndex: 0,
    x,
    y,
    width: w,
    height: h,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    fill: "#3B82F6",
    stroke: null,
    strokeWidth: 0,
    radius: 0,
    ...opts,
  } as DesignElementDTO;
}

describe("the render-consistent hit test (session 56, S56-G / M-7)", () => {
  it("the unscaled geometry still hits exactly (no regression at scale 1)", () => {
    const el = rect(100, 100, 200, 150);
    expect(elementIsPointInside(el, 150, 150)).toBe(true);
    expect(elementIsPointInside(el, 99, 150)).toBe(false);
    expect(elementIsPointInside(el, 301, 150)).toBe(false);
    expect(elementIsPointInside(el, 150, 251)).toBe(false);
  });

  it("a scale-2 element's OUTER visual region is clickable (the M-7 defect)", () => {
    const el = rect(100, 100, 200, 150, { scale: 2 });
    // Visual footprint: x∈[100,500], y∈[100,400]. A point deep inside the
    // visual box but OUTSIDE the unscaled rect [100,300]×[100,250] used to
    // fall through — the defect.
    expect(elementIsPointInside(el, 400, 300)).toBe(true);
    expect(elementIsPointInside(el, 480, 380)).toBe(true);
    // …and the region beyond the visual footprint still falls through.
    expect(elementIsPointInside(el, 520, 300)).toBe(false);
    expect(elementIsPointInside(el, 400, 420)).toBe(false);
  });

  it("rotation hits the RENDERED quad (corner-anchored, matching the chain)", () => {
    // 90° around the corner anchor (100,100): the 200×150 box maps onto
    // x∈[-50,100], y∈[100,300] (the center-anchored model used to test a
    // DIFFERENT quad around (200,175)).
    const el = rect(100, 100, 200, 150, { rotation: 90 });
    // Inside the rendered quad, outside the old center-anchored model's box.
    expect(elementIsPointInside(el, 60, 280)).toBe(true);
    // Outside the rendered quad (the old model's region below the anchor).
    expect(elementIsPointInside(el, 150, 320)).toBe(false);
  });
});
