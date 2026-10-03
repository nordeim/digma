import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { boundsOf, type DesignElementDTO } from "../src/lib/editor";

// The session-68 rotation-aware marquee containment (S68-B — the
// sixteenth audit's M-1, drift from the documented S64-C contract).
//
// THE DEFECT: the marquee's containment filter (canvas.tsx) tests the
// UNROTATED footprint — `el.x >= drag.x && el.x + el.width * s <= …` —
// while AGENTS.md documents "the selection outline, resize handles,
// and marquee now run on the VISUAL footprint" (S64-C). The outline
// and handles consume the rotation-aware boundsOf; the marquee
// disagreed with them exactly for rotated elements.
//
// THE FIX: the filter consumes boundsOf([el]) — the four-corner
// corner-anchored rotated AABB. The rotation-0 fast path returns the
// historical math exactly, so every standing unrotated marquee pin is
// behavior-identical.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

// The pin geometry (the e2e fixture's own element): a 200x100
// rectangle at (400,200) rotated 45° about its top-left corner.
function rect(rotation: number): DesignElementDTO {
  return {
    id: "el1",
    projectId: "p1",
    type: "rectangle",
    name: "Rotated",
    x: 400,
    y: 200,
    width: 200,
    height: 100,
    rotation,
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
    src: null,
    path: null,
    fillGradient: null,
    fillImage: null,
    fillImageFit: null,
    zIndex: 0,
    visible: true,
    locked: false,
    sortOrder: 0,
  };
}

describe("the marquee containment runs on the visual footprint (S68-B / M-1)", () => {
  it("the canvas's marquee filter consumes boundsOf (the source contract)", () => {
    // THE DEFECT PIN: pre-fix the filter inlines the unrotated
    // footprint test — `el.x >= drag.x` — and never calls boundsOf.
    // Anchor on the COMMIT block (the `drag.w > 2` containment
    // filter), never the live-draw branch that shares the kind label.
    const source = src("src/components/editor/canvas.tsx");
    const commitIdx = source.indexOf('drag.kind === "marquee"');
    const drawIdx = source.indexOf('drag.kind === "marquee"', commitIdx + 1);
    const marqueeIdx = drawIdx === -1 ? commitIdx : drawIdx;
    expect(marqueeIdx).toBeGreaterThan(-1);
    const marqueeBody = source.slice(marqueeIdx, marqueeIdx + 1400);
    expect(marqueeBody).toMatch(/boundsOf\(/);
    // The old inline unrotated-footprint comparison is GONE from the
    // containment filter (the outline/handles keep their own uses).
    expect(marqueeBody).not.toMatch(/el\.x >= drag\.x/);
  });

  it("the rotated AABB for the pin geometry matches the derived corners", () => {
    // Corner-anchored rotation of (0,0),(200,0),(0,100),(200,100) by
    // 45° about (400,200):
    //   (0,0)->(400,200)   (200,0)->(541.42,341.42)
    //   (0,100)->(329.29,270.71)   (200,100)->(470.71,412.13)
    // AABB: x in [329.29, 541.42], y in [200, 412.13].
    const b = boundsOf([rect(45)]);
    expect(b).not.toBeNull();
    expect(b!.minX).toBeCloseTo(329.29, 1);
    expect(b!.maxX).toBeCloseTo(541.42, 1);
    expect(b!.minY).toBeCloseTo(200, 1);
    expect(b!.maxY).toBeCloseTo(412.13, 1);
  });

  it("the discriminating bands: one contains the visual but not the unrotated footprint, one the reverse", () => {
    const b = boundsOf([rect(45)]);
    // Band A (325,195)->(560,415): contains the visual AABB, NOT the
    // unrotated [400,600]x[200,300] (its right edge 560 < 600).
    const bandAContainsVisual =
      b!.minX >= 325 && b!.maxX <= 560 && b!.minY >= 195 && b!.maxY <= 415;
    const bandAContainsUnrotated = 400 >= 325 && 600 <= 560 && 200 >= 195 && 300 <= 415;
    expect(bandAContainsVisual).toBe(true);
    expect(bandAContainsUnrotated).toBe(false);
    // Band B (395,195)->(605,305): contains the unrotated footprint,
    // NOT the visual (its left edge 329.29 < 395).
    const bandBContainsUnrotated = 400 >= 395 && 600 <= 605 && 200 >= 195 && 300 <= 305;
    const bandBContainsVisual =
      b!.minX >= 395 && b!.maxX <= 605 && b!.minY >= 195 && b!.maxY <= 305;
    expect(bandBContainsUnrotated).toBe(true);
    expect(bandBContainsVisual).toBe(false);
  });

  it("the rotation-0 fast path returns the historical containment math exactly (preservation)", () => {
    // Every standing unrotated marquee pin rides this identity: the
    // boundsOf-based containment equals the old inline math at
    // rotation 0 (including the scale-aware width fold).
    for (const scale of [1, 2]) {
      const el = { ...rect(0), scale };
      const s = scale;
      const b = boundsOf([el])!;
      expect(b.minX).toBe(el.x);
      expect(b.maxX).toBe(el.x + el.width * s);
      expect(b.minY).toBe(el.y);
      expect(b.maxY).toBe(el.y + el.height * s);
    }
    // The undefined-scale fallback (the store's `el.scale ?? 1`)
    // folds to 1 — the historical math's own default.
    const el = { ...rect(0), scale: undefined as unknown as number };
    const b = boundsOf([el])!;
    expect(b.maxX).toBe(el.x + el.width);
  });
});
