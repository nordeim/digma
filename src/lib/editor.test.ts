import { describe, expect, it } from "vitest";
import {
  boundsOf,
  clampZoom,
  defaultElementFor,
  elementToStyle,
  fitToBounds,
  normalizeRect,
  type DesignElementDTO,
} from "@/lib/editor";

// The editor's pure geometry seams: default element specs, drag
// normalization, bounds, fit-to-view math, and zoom clamping.

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
    fontWeight: null,
    textAlign: null,
    src: null,
    path: null,
    zIndex: 0,
    visible: true,
    locked: false,
    sortOrder: 0,
    ...partial,
  };
}

describe("defaultElementFor", () => {
  it("gives rectangles the default fill", () => {
    const rect = defaultElementFor("rectangle", 10, 20, 30, 40, 0);
    expect(rect.fill).toBe("#3B82F6");
    expect(rect.x).toBe(10);
    expect(rect.name).toBe("Rectangle 1");
  });

  it("gives text elements content and typography", () => {
    const text = defaultElementFor("text", 0, 0, 200, 40, 1);
    expect(text.text).toBe("Text");
    expect(text.fontSize).toBe(32); // clamped to the 16–32 band
    expect(text.fill).toBe("#FFFFFF");
    expect(text.name).toBe("Text 2");
  });

  it("gives lines a stroke instead of a fill", () => {
    const line = defaultElementFor("line", 0, 0, 120, 60, 0);
    expect(line.stroke).toBe("#FFFFFF");
    expect(line.fill).toBeNull();
    expect(line.height).toBe(0);
  });

  it("defaults scale to 1 (the reference's per-element scale unit)", () => {
    for (const type of ["rectangle", "ellipse", "text", "frame", "line"] as const) {
      const out = defaultElementFor(type, 0, 0, 10, 10, 0);
      expect(out.scale).toBe(1);
    }
  });
});

describe("normalizeRect", () => {
  it("normalizes any drag direction", () => {
    expect(normalizeRect(100, 100, 40, 60)).toEqual({ x: 40, y: 60, width: 60, height: 40 });
    expect(normalizeRect(40, 60, 100, 100)).toEqual({ x: 40, y: 60, width: 60, height: 40 });
  });
});

describe("boundsOf", () => {
  it("returns null for an empty canvas", () => {
    expect(boundsOf([])).toBeNull();
  });

  it("computes the content bounding box", () => {
    const bounds = boundsOf([el({ x: 100, y: 200, width: 50, height: 25 }), el({ x: 10, y: 500, width: 5, height: 5 })]);
    expect(bounds).toEqual({ minX: 10, minY: 200, maxX: 150, maxY: 505 });
  });

  it("measures VISUAL bounds: element scale grows the box", () => {
    // A 100x50 element at scale 2 visually occupies 200x100 (the reference
    // renders translate(x,y) scale(s) rotate(r) — scale grows right/down
    // from the unshifted origin, so x/y stay put).
    const bounds = boundsOf([el({ x: 10, y: 20, width: 100, height: 50, scale: 2 })]);
    expect(bounds).toEqual({ minX: 10, minY: 20, maxX: 210, maxY: 120 });
  });
});

describe("fitToBounds", () => {
  it("returns identity for no content", () => {
    expect(fitToBounds(null, 320, 200)).toEqual({ scale: 1, offsetX: 0, offsetY: 0 });
  });

  it("scales content into the box with margin", () => {
    const { scale, offsetX, offsetY } = fitToBounds(
      { minX: 0, minY: 0, maxX: 300, maxY: 180 },
      320,
      200,
      10,
    );
    expect(scale).toBe(1); // content already fits
    expect(offsetX).toBeGreaterThanOrEqual(10);
    expect(offsetY).toBeGreaterThanOrEqual(10);
  });

  it("shrinks oversized content", () => {
    const { scale } = fitToBounds({ minX: 0, minY: 0, maxX: 3000, maxY: 1800 }, 320, 200, 10);
    expect(scale).toBeCloseTo(0.1, 1);
  });
});

describe("elementToStyle", () => {
  it("chains translate, scale, then rotate — the reference transform order", () => {
    const style = elementToStyle(el({ x: 12, y: 34, rotation: 45, scale: 1.5 }));
    expect(style.transform).toBe("translate(12px, 34px) scale(1.5) rotate(45deg)");
  });

  it("keeps the identity chain legible at defaults", () => {
    const style = elementToStyle(el({}));
    expect(style.transform).toBe("translate(0px, 0px) scale(1) rotate(0deg)");
  });
});

describe("clampZoom", () => {
  it("clamps to the 5%—800% range", () => {
    expect(clampZoom(0.01)).toBe(0.05);
    expect(clampZoom(10)).toBe(8);
    expect(clampZoom(1)).toBe(1);
  });
});
