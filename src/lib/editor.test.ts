import { describe, expect, it } from "vitest";
import {
  addGradientStop,
  boundsOf,
  canvasFontFamily,
  clampZoom,
  cornerRadiusMax,
  defaultElementFor,
  defaultGradient,
  elementToStyle,
  fillPaintFor,
  fitToBounds,
  gradientCss,
  normalizeRect,
  parseGradient,
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
    fontFamily: null,
    textAlign: null,
    src: null,
    path: null,
    fillGradient: null,
    fillImage: null,
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

  it("gives text elements the reference's measured content and typography (session 29)", () => {
    const text = defaultElementFor("text", 0, 0, 200, 40, 1);
    // The reference's freshly-drawn text element measured live: the Content
    // INPUT's VALUE is "Type here..." (not a placeholder), Font Size is a
    // fixed 16 (the height-clamp formula is gone), and the Font Family
    // combobox defaults to Inter (RA-10).
    expect(text.text).toBe("Type here...");
    expect(text.fontSize).toBe(16);
    expect(text.fontFamily).toBe("Inter");
    expect(text.fill).toBe("#FFFFFF");
    expect(text.name).toBe("Text 2");
  });

  it("gives lines a stroke instead of a fill", () => {
    const line = defaultElementFor("line", 0, 0, 120, 60, 0);
    expect(line.stroke).toBe("#FFFFFF");
    expect(line.fill).toBeNull();
    expect(line.height).toBe(0);
    // The Stroke Width slider's default for a fresh line measured 2 on the
    // reference (RA-8) — the SVG stroke-width follows it.
    expect(line.strokeWidth).toBe(2);
  });

  it("gives frames the reference's labeled-container defaults (session 31)", () => {
    // The reference's fresh frame (RA-13/RA-18): a TRANSPARENT container
    // whose structural border comes from the STROKE model fields —
    // border 1px solid #555555, radius 0. The pre-fix clone rendered a
    // solid #161B22 panel with radius 8 and no border.
    const frame = defaultElementFor("frame", 0, 0, 240, 160, 0);
    expect(frame.fill).toBeNull();
    expect(frame.stroke).toBe("#555555");
    expect(frame.strokeWidth).toBe(1);
    expect(frame.radius).toBe(0);
    // The border renders through the shared style chain (the standard
    // stroke mechanism — never a special-case).
    const style = elementToStyle({ ...el({}), ...frame, id: "el", projectId: "p" });
    expect(style.border).toBe("1px solid #555555");
    expect(style.backgroundColor).toBeUndefined();
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

  it("never renders a line's stroke as a box border (session 29)", () => {
    // The reference's line div measured border-0 on all four sides despite
    // stroke #FFFFFF + strokeWidth 2 (RA-8): the stroke feeds the SVG
    // diagonal, never the box. Pre-fix: the shared chain painted a 2px white
    // rectangle around every drawn line.
    const style = elementToStyle(el({ type: "line", stroke: "#FFFFFF", strokeWidth: 2, fill: null }));
    expect(style.border).toBeUndefined();

    // The rectangle keeps the stroke-as-border rendering (its measured
    // contract — the border IS how box shapes render strokes).
    const rectStyle = elementToStyle(el({ type: "rectangle", stroke: "#FFFFFF", strokeWidth: 2 }));
    expect(rectStyle.border).toBe("2px solid #FFFFFF");
  });

  it("renders the text's measured font chain (session 29)", () => {
    const style = elementToStyle(el({ type: "text", text: "Type here...", fontSize: 16, fontFamily: "Arial", fill: "#FFFFFF" }));
    expect(style.fontFamily).toBe("Arial");
    expect(style.fontSize).toBe("16px");
  });

  it("renders the DEFAULT text font with the reference's fallback chain (session 33, RA-30)", () => {
    // A fresh reference text measured computed font-family "Inter, sans-serif"
    // (the combobox still displays "Inter"); Roboto/Arial render verbatim.
    // Pre-fix: the chain was "Inter" alone — no fallback when Inter is absent.
    const style = elementToStyle(el({ type: "text", text: "Type here..." }));
    expect(style.fontFamily).toBe("Inter, sans-serif");
  });
});

describe("cornerRadiusMax (session 33, RA-29)", () => {
  it("is half the element's smaller side — the reference's dynamic slider max", () => {
    // Triple-measured on the reference: a 200x150 rectangle read
    // aria-valuemax="75" (= 150/2 — the historical "fixed 75" reading was
    // THIS element's min/2); a 46x23.366 rectangle read 11.68298487339743
    // (= 23.366/2, unrounded); a 156x117 frame read 58.41492436698704.
    expect(cornerRadiusMax({ width: 160, height: 44 })).toBe(22);
    expect(cornerRadiusMax({ width: 200, height: 150 })).toBe(75);
    expect(cornerRadiusMax({ width: 156, height: 117 })).toBe(58.5);
    expect(cornerRadiusMax({ width: 46, height: 23.366 })).toBe(11.683);
  });

  it("keeps the seeded Accent Bar exactly at its max (560x8, radius 4)", () => {
    expect(cornerRadiusMax({ width: 560, height: 8 })).toBe(4);
  });
});

describe("canvasFontFamily (session 33, RA-30)", () => {
  it("maps the default (null/undefined/Inter) to the fallback chain", () => {
    expect(canvasFontFamily(undefined)).toBe("Inter, sans-serif");
    expect(canvasFontFamily(null)).toBe("Inter, sans-serif");
    expect(canvasFontFamily("Inter")).toBe("Inter, sans-serif");
  });

  it("renders chosen families verbatim (measured: Roboto and Arial carry no fallback)", () => {
    expect(canvasFontFamily("Arial")).toBe("Arial");
    expect(canvasFontFamily("Roboto")).toBe("Roboto");
    expect(canvasFontFamily("Times New Roman")).toBe("Times New Roman");
  });
});

describe("clampZoom", () => {
  it("clamps to the reference's [10%, 500%] range (session 39, RA-50)", () => {
    expect(clampZoom(0.01)).toBe(0.1);
    expect(clampZoom(10)).toBe(5);
    expect(clampZoom(1)).toBe(1);
  });
});

// ---------------------------------------------------------------------
// Session 41 (RA-54) — the Fill/Gradient/Image seam. The reference's
// segmented control is a FULLY FUNCTIONAL three-tab editor (reversing the
// session-29 "no-op" decode — live-measured, persisted through reload):
// the Gradient tab paints linear/radial CSS gradients from an angle +
// color-stop list; the Image tab paints an uploaded image; a Solid hex
// edit clears both. These are the pure seams every render site consumes.
// ---------------------------------------------------------------------

describe("defaultGradient (RA-54)", () => {
  it("returns the reference's measured defaults: linear, 0deg, blue -> purple", () => {
    expect(defaultGradient()).toEqual({
      type: "linear",
      angle: 0,
      stops: [
        { color: "#3b82f6", position: 0 },
        { color: "#8b5cf6", position: 100 },
      ],
    });
  });
});

describe("gradientCss (RA-54)", () => {
  it("renders the linear contract: angle in deg + the stop chain", () => {
    expect(
      gradientCss({ type: "linear", angle: 90, stops: [
        { color: "#3b82f6", position: 0 },
        { color: "#8b5cf6", position: 100 },
      ] }),
    ).toBe("linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)");
  });

  it("renders the radial contract: circle + the stop chain (angle ignored)", () => {
    expect(
      gradientCss({ type: "radial", angle: 45, stops: [
        { color: "#3b82f6", position: 0 },
        { color: "#8b5cf6", position: 100 },
      ] }),
    ).toBe("radial-gradient(circle, #3b82f6 0%, #8b5cf6 100%)");
  });

  it("sorts stops by position before rendering (unsorted input)", () => {
    expect(
      gradientCss({ type: "linear", angle: 0, stops: [
        { color: "#8b5cf6", position: 100 },
        { color: "#ffffff", position: 50 },
        { color: "#3b82f6", position: 0 },
      ] }),
    ).toBe("linear-gradient(0deg, #3b82f6 0%, #ffffff 50%, #8b5cf6 100%)");
  });
});

describe("addGradientStop (RA-54)", () => {
  it("appends the reference's measured middle stop: white at 50%", () => {
    const stops = addGradientStop([
      { color: "#3b82f6", position: 0 },
      { color: "#8b5cf6", position: 100 },
    ]);
    expect(stops).toHaveLength(3);
    expect(stops[1]).toEqual({ color: "#ffffff", position: 50 });
  });

  it("returns the list unchanged at the stop cap", () => {
    const stops = Array.from({ length: 8 }, (_, i) => ({ color: "#ffffff", position: i * 10 }));
    expect(addGradientStop(stops)).toHaveLength(8);
  });
});

describe("parseGradient (RA-54 sanitize seam)", () => {
  it("parses a valid stored gradient JSON verbatim", () => {
    const parsed = parseGradient(JSON.stringify({ type: "radial", angle: 12, stops: [{ color: "#22c55e", position: 30 }] }));
    expect(parsed).toEqual({ type: "radial", angle: 12, stops: [{ color: "#22c55e", position: 30 }] });
  });

  it("returns null for null/undefined/malformed input", () => {
    expect(parseGradient(null)).toBeNull();
    expect(parseGradient(undefined)).toBeNull();
    expect(parseGradient("not json")).toBeNull();
    expect(parseGradient("{}")).toBeNull(); // no stops — not a gradient object
  });

  it("clamps the type enum, the angle, and the stop positions; caps the stop count", () => {
    const parsed = parseGradient(
      JSON.stringify({
        type: "diagonal",
        angle: 999,
        stops: [
          { color: "#3b82f6", position: -20 },
          { color: "#8b5cf6", position: 140 },
          { color: "#ffffff", position: 50 },
          ...Array.from({ length: 10 }, (_, i) => ({ color: "#000000", position: i })),
        ],
      }),
    );
    expect(parsed?.type).toBe("linear"); // unknown type falls back to linear
    expect(parsed?.angle).toBe(360);
    expect(parsed?.stops).toHaveLength(8); // the cap
    expect(parsed?.stops[0]?.position).toBe(0);
    expect(parsed?.stops[1]?.position).toBe(100);
  });

  it("sanitizes invalid stop colors to the fallback hex", () => {
    const parsed = parseGradient(
      JSON.stringify({ type: "linear", angle: 0, stops: [{ color: "oops", position: 0 }] }),
    );
    expect(parsed?.stops[0]?.color).toBe("#0D1117");
  });
});

describe("fillPaintFor (RA-54 — the one paint seam)", () => {
  it("paints the solid fill as backgroundColor", () => {
    expect(fillPaintFor(el({ fill: "#3B82F6" }))).toEqual({ backgroundColor: "#3B82F6" });
  });

  it("a gradient WINS over the solid fill (the reference keeps both; the gradient paints)", () => {
    const paint = fillPaintFor(
      el({
        fill: "#3B82F6",
        fillGradient: JSON.stringify({ type: "linear", angle: 3, stops: [
          { color: "#3b82f6", position: 0 },
          { color: "#8b5cf6", position: 100 },
        ] }),
      }),
    );
    expect(paint).toEqual({ backgroundImage: "linear-gradient(3deg, #3b82f6 0%, #8b5cf6 100%)" });
  });

  it("an image WINS over the gradient", () => {
    const paint = fillPaintFor(
      el({
        fill: "#3B82F6",
        fillGradient: JSON.stringify(defaultGradient()),
        fillImage: "data:image/png;base64,AAAA",
      }),
    );
    expect(paint).toEqual({ backgroundImage: 'url("data:image/png;base64,AAAA")' });
  });

  it("returns an empty paint for a fill-less element", () => {
    expect(fillPaintFor(el({ fill: null }))).toEqual({});
  });

  it("ignores a malformed stored gradient (falls back to the solid fill)", () => {
    expect(fillPaintFor(el({ fill: "#22c55e", fillGradient: "garbage" }))).toEqual({
      backgroundColor: "#22c55e",
    });
  });
});
