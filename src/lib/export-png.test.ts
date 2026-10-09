import { describe, expect, it } from "vitest";

import {
  elementsToSvg,
  exportFilename,
  type ExportOptions,
} from "@/lib/export-png";
import type { DesignElementDTO } from "@/lib/editor";

// The session-51 export seams (the canvas PNG export — a pure clone
// superset; the reference has no export anywhere). The pure layer maps
// the element tree to a standalone SVG document of the fixed 1000×700
// board (the Present overlay's own canvas area — "the export is the
// presentation, as a file"), mirroring the DOM render sites' contracts:
// the transform chain, the one paint chain (image > gradient > solid),
// the border-box stroke inset, the SVG line diagonal, the flex-centered
// text geometry, and the thumbnail's frame-without-label convention.

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
    fill: "#3B82F6",
    stroke: null,
    strokeWidth: 0,
    radius: 0,
    text: null,
    fontSize: null,
    fontWeight: null,
    fontFamily: null,
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

describe("elementsToSvg — the document scaffold", () => {
  it("renders the 1000×700 board with the background rect", () => {
    const svg = elementsToSvg([], { backgroundColor: "#0D1117" });
    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700">');
    expect(svg).toContain('<rect x="0" y="0" width="1000" height="700" fill="#0D1117"/>');
    expect(svg).toContain("</svg>");
  });

  it("defaults the background to the editor's dark canvas", () => {
    const svg = elementsToSvg([]);
    expect(svg).toContain('fill="#0D1117"');
  });
});

describe("elementsToSvg — the rectangle mapping", () => {
  it("maps fill, radius, the transform chain, and the opacity attribute", () => {
    const svg = elementsToSvg([
      el({ x: 40, y: 60, width: 120, height: 80, radius: 8, rotation: 15, scale: 2, opacity: 0.5, fill: "#10B981" }),
    ]);
    expect(svg).toContain("<rect");
    expect(svg).toContain('fill="#10B981"');
    expect(svg).toContain('rx="8"');
    // CSS `translate(x,y) scale(s) rotate(r)` with transform-origin 0 0 is
    // EXACTLY the SVG transform attribute (the same matrix product).
    expect(svg).toContain('transform="translate(40 60) scale(2) rotate(15)"');
    expect(svg).toContain('opacity="0.5"');
  });

  it("insets a stroked rect by strokeWidth/2 (the border-box parity)", () => {
    // Tailwind's preflight sets box-sizing: border-box — the DOM border
    // paints INSIDE the width/height while the SVG stroke paints centered
    // on the path. Parity: x/y inset and both dimensions reduced by the
    // full strokeWidth.
    const svg = elementsToSvg([
      el({ width: 100, height: 80, stroke: "#FFFFFF", strokeWidth: 4 }),
    ]);
    expect(svg).toContain('x="2"');
    expect(svg).toContain('y="2"');
    expect(svg).toContain('width="96"');
    expect(svg).toContain('height="76"');
    expect(svg).toContain('stroke="#FFFFFF"');
    expect(svg).toContain('stroke-width="4"');
  });

  it("renders a frame with fill none + its stroke and NO label chip", () => {
    // The thumbnail convention (RA-19): the frame's name label is editor
    // chrome and stays out of the rendered artifact.
    const svg = elementsToSvg([
      el({ type: "frame", name: "Frame 1", width: 200, height: 150, fill: null, stroke: "#555555", strokeWidth: 1 }),
    ]);
    expect(svg).toContain("<rect");
    expect(svg).toContain('fill="none"');
    expect(svg).toContain('stroke="#555555"');
    expect(svg).not.toContain("Frame 1");
  });
});

describe("elementsToSvg — the ellipse + line mappings", () => {
  it("maps an ellipse to the centered ellipse form", () => {
    const svg = elementsToSvg([
      el({ type: "ellipse", width: 120, height: 80, fill: "#8B5CF6" }),
    ]);
    expect(svg).toContain("<ellipse");
    expect(svg).toContain('cx="60"');
    expect(svg).toContain('cy="40"');
    expect(svg).toContain('rx="60"');
    expect(svg).toContain('ry="40"');
  });

  it("maps a line to the SVG diagonal with the round cap and NO box border", () => {
    // The reference's line contract (RA-8): a transparent box whose stroke
    // feeds the diagonal, never a border.
    const svg = elementsToSvg([
      el({ type: "line", width: 200, height: 100, fill: null, stroke: "#FFFFFF", strokeWidth: 2 }),
    ]);
    expect(svg).toContain("<line");
    expect(svg).toContain('x1="0"');
    expect(svg).toContain('y1="0"');
    expect(svg).toContain('x2="200"');
    expect(svg).toContain('y2="100"');
    expect(svg).toContain('stroke-linecap="round"');
    expect(svg).not.toContain('stroke-width="4"');
  });

  it("defaults the line stroke COLOR to white and renders the STORED width (S103-B — the stored-vs-rendered agreement)", () => {
    // Session 103 (S103-B / A-L4): the render-site `|| 2` fallback is
    // RETIRED — a stored strokeWidth of 0 (the slider's own min) renders
    // stroke-width="0" (SVG paints no stroke; the border-0 semantics
    // lines share with rectangles) while the COLOR default (stroke null
    // → the RA-8 white) stays. The pre-fix pin expected width 2 for a
    // stored 0 — the stored-vs-rendered disagreement this session
    // closed; the honest form is pinned by tests/lows-s103.test.ts.
    const svg = elementsToSvg([el({ type: "line", width: 90, height: 40, fill: null, stroke: null, strokeWidth: 0 })]);
    expect(svg).toContain('stroke="#FFFFFF"');
    expect(svg).toContain('stroke-width="0"');
  });
});

describe("elementsToSvg — the text mapping", () => {
  it("carries the font chain, size, weight, and the text color contract", () => {
    const svg = elementsToSvg([
      el({ type: "text", width: 320, height: 48, text: "Hello", fill: "#F9FAFB", fontSize: 32, fontWeight: "700", fontFamily: null }),
    ]);
    expect(svg).toContain("<text");
    // The default's fallback chain (RA-30) — only the default carries it.
    expect(svg).toContain('font-family="Inter, sans-serif"');
    expect(svg).toContain('font-size="32"');
    expect(svg).toContain('font-weight="700"');
    expect(svg).toContain('fill="#F9FAFB"');
    expect(svg).toContain(">Hello</tspan>");
  });

  it("renders a chosen family verbatim (no fallback chain)", () => {
    const svg = elementsToSvg([
      el({ type: "text", width: 100, height: 20, text: "Hi", fontFamily: "Roboto" }),
    ]);
    expect(svg).toContain('font-family="Roboto"');
  });

  it("maps the alignment to text-anchor + x (the justifyContent geometry)", () => {
    const left = elementsToSvg([el({ type: "text", width: 200, height: 40, text: "A", textAlign: "left" })]);
    expect(left).toContain('text-anchor="start"');
    expect(left).toContain('x="0"');

    const center = elementsToSvg([el({ type: "text", width: 200, height: 40, text: "A", textAlign: "center" })]);
    expect(center).toContain('text-anchor="middle"');
    expect(center).toContain('x="100"');

    const right = elementsToSvg([el({ type: "text", width: 200, height: 40, text: "A", textAlign: "right" })]);
    expect(right).toContain('text-anchor="end"');
    expect(right).toContain('x="200"');
  });

  it("centers a single line vertically at H/2 with the central baseline", () => {
    const svg = elementsToSvg([
      el({ type: "text", width: 200, height: 48, text: "One line", fontSize: 32 }),
    ]);
    expect(svg).toContain('y="24"');
    expect(svg).toContain('dominant-baseline="central"');
  });

  it("splits explicit newlines into tspans centered as a block", () => {
    // whiteSpace: pre-wrap honors explicit breaks; the flex alignItems
    // centering maps to the block's first line sitting at
    // H/2 - (n-1)·lineHeight/2 with lineHeight = fontSize·1.2.
    const svg = elementsToSvg([
      el({ type: "text", width: 300, height: 96, text: "one\ntwo\nthree", fontSize: 20 }),
    ]);
    expect(svg).toContain("<tspan");
    // n=3, lineHeight=24, H/2=48: first line y = 48 - 24 = 24
    expect(svg).toContain('<tspan x="0" y="24">');
    expect(svg).toContain('dy="24"');
    expect(svg).toContain(">one</tspan>");
    expect(svg).toContain(">two</tspan>");
    expect(svg).toContain(">three</tspan>");
  });

  it("XML-escapes the text content", () => {
    const svg = elementsToSvg([
      el({ type: "text", width: 200, height: 40, text: 'a < b & "c"' }),
    ]);
    expect(svg).toContain("a &lt; b &amp; &quot;c&quot;");
    expect(svg).not.toContain("a < b");
  });
});

describe("elementsToSvg — the paint chain (gradient + image)", () => {
  it("maps a linear gradient to defs with the CSS-angle vector (0deg = bottom to top)", () => {
    const gradient = JSON.stringify({ type: "linear", angle: 0, stops: [
      { color: "#3b82f6", position: 0 },
      { color: "#8b5cf6", position: 100 },
    ] });
    const svg = elementsToSvg([el({ fill: null, fillGradient: gradient })]);
    expect(svg).toContain("<linearGradient");
    expect(svg).toContain('id="grad-0"');
    // CSS 0deg points UP: the vector runs bottom (y1=1) to top (y2=0).
    expect(svg).toContain('x1="0.5"');
    expect(svg).toContain('y1="1"');
    expect(svg).toContain('y2="0"');
    expect(svg).toContain('fill="url(#grad-0)"');
    expect(svg).toContain('stop-color="#3b82f6"');
    expect(svg).toContain('offset="0%"');
    expect(svg).toContain('stop-color="#8b5cf6"');
    expect(svg).toContain('offset="100%"');
  });

  it("computes the 90deg vector left to right", () => {
    const gradient = JSON.stringify({ type: "linear", angle: 90, stops: [
      { color: "#3b82f6", position: 0 },
      { color: "#8b5cf6", position: 100 },
    ] });
    const svg = elementsToSvg([el({ fill: null, fillGradient: gradient })]);
    expect(svg).toContain('x1="0"');
    expect(svg).toContain('x2="1"');
    expect(svg).toContain('y1="0.5"');
    expect(svg).toContain('y2="0.5"');
  });

  it("maps a radial gradient to the circle form", () => {
    const gradient = JSON.stringify({ type: "radial", angle: 0, stops: [
      { color: "#3b82f6", position: 0 },
      { color: "#8b5cf6", position: 100 },
    ] });
    const svg = elementsToSvg([el({ fill: null, fillGradient: gradient })]);
    expect(svg).toContain("<radialGradient");
    expect(svg).toContain('cx="0.5"');
    expect(svg).toContain('cy="0.5"');
    expect(svg).toContain('r="0.5"');
  });

  it("maps an image fill to the preserveAspectRatio table (cover/contain/stretch)", () => {
    const dataUrl = "data:image/png;base64,AAAA";
    const cover = elementsToSvg([el({ fill: null, fillImage: dataUrl, fillImageFit: "cover" })]);
    expect(cover).toContain("<image");
    expect(cover).toContain(`href="${dataUrl}"`);
    expect(cover).toContain('preserveAspectRatio="xMidYMid slice"');

    const contain = elementsToSvg([el({ fill: null, fillImage: dataUrl, fillImageFit: "contain" })]);
    expect(contain).toContain('preserveAspectRatio="xMidYMid meet"');

    const stretch = elementsToSvg([el({ fill: null, fillImage: dataUrl, fillImageFit: "stretch" })]);
    expect(stretch).toContain('preserveAspectRatio="none"');
  });

  it("an image fill paints NO backing fill on the parent shape (session 53, S53-B)", () => {
    // The DOM paint chain (fillPaintFor) returns only backgroundImage
    // for image fills — the unfilled area stays TRANSPARENT. The SVG
    // serializer must not let the shape's initial fill (black) back a
    // letterboxed (contain/auto) or transparent image: the parent rect
    // carries fill="none" and the <image> child renders on top.
    const dataUrl = "data:image/png;base64,AAAA";
    const svg = elementsToSvg([el({ fill: null, fillImage: dataUrl, fillImageFit: "contain" })]);
    // The shape rect (not the background rect, which carries the
    // backgroundColor fill) opens with fill="none" before the child.
    const shape = svg.slice(svg.indexOf("<image"));
    const shapeOpen = svg.slice(0, svg.indexOf("<image"));
    expect(shapeOpen).toContain('fill="none"');
    expect(shape).toContain("<image");
  });
});

describe("elementsToSvg — the visibility + lock contracts", () => {
  it("skips hidden elements (the thumbnail/present filter)", () => {
    const svg = elementsToSvg([
      el({ id: "gone", visible: false, fill: "#FF0000" }),
      el({ id: "kept", visible: true, fill: "#00FF00" }),
    ]);
    expect(svg).toContain("#00FF00");
    expect(svg).not.toContain('fill="#FF0000"');
  });

  it("renders locked elements (the lock is an interaction wall, not a visual state)", () => {
    const svg = elementsToSvg([el({ locked: true, fill: "#123456" })]);
    expect(svg).toContain('fill="#123456"');
  });
});

describe("exportFilename", () => {
  it("strips path-hostile characters and collapses whitespace", () => {
    expect(exportFilename("My Design/v2: Final*?")).toBe("My Designv2 Final");
  });

  it("trims and falls back to design when empty", () => {
    expect(exportFilename("   ")).toBe("design");
    expect(exportFilename(null)).toBe("design");
    expect(exportFilename("///")).toBe("design");
  });

  it("keeps alphanumerics, dashes, underscores, and single spaces", () => {
    expect(exportFilename("Portfolio_2026 - v3")).toBe("Portfolio_2026 - v3");
  });
});
