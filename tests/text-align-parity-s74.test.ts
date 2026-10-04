import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-74 text-alignment parity completion (S74-A — the
// twenty-second audit's A74-L1).
//
// THE DEFECT: the S73-A fix healed the THREE DOM render surfaces (the
// canvas, the PresentOverlay, the CanvasThumbnail) — but the codebase
// carries a FOURTH surface that renders the text element's geometry:
// elementToStyle, the TEST-ONLY style seam in src/lib/editor.ts whose
// doc comment says it "exists so the unit suite pins the geometry the
// canvas must reproduce". Its text branch pins display:flex +
// alignItems:center + textAlign with NO justifyContent — the exact
// half-mapped form the S73-A fix retired from the present/thumbnail
// branches, surviving 23 lines below textAlignToJustify itself in the
// same file. The session-73 headline defect class (one model field, N
// render surfaces, the fix reaches N-1) living INSIDE the parity fix.
//
// THE FIX: the seam's text branch consumes the SAME
// textAlignToJustify mapping — the TEST-ONLY seam reproduces the
// canvas's full text geometry and the doc comment's claim becomes true
// again.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("elementToStyle — the fourth surface joins the seam (S74-A)", () => {
  const editor = src("src/lib/editor.ts");

  it("the text branch maps textAlign onto justifyContent through the seam", () => {
    // THE DEFECT PIN: pre-fix the seam's text branch carries
    // display:flex + alignItems + textAlign with NO justification —
    // the geometry the unit suite pins is NOT the geometry the canvas
    // paints (the doc comment's own claim, false since S73-A).
    expect(editor).toMatch(
      /style\.justifyContent = textAlignToJustify\(el\.textAlign\);/,
    );
  });

  it("the seam's text branch keeps the S58-E present-contract keys (the preservation pin)", () => {
    // The existing keys stay exactly (whiteSpace + overflow + the
    // defaults) — the fix is ADDITIVE, no contract restructured.
    expect(editor).toMatch(/style\.whiteSpace = "pre-wrap";/);
    expect(editor).toMatch(/style\.overflow = "hidden";/);
    expect(editor).toMatch(/style\.textAlign = el\.textAlign \?\? "left";/);
  });

  it("the mapping is consumed at ALL FOUR text-geometry surfaces (the family-complete pin)", () => {
    // One model field, four surfaces, one seam: the canvas, the
    // PresentOverlay, the CanvasThumbnail, and elementToStyle.
    expect(src("src/components/editor/canvas.tsx")).toMatch(
      /style\.justifyContent = textAlignToJustify\(/,
    );
    expect(src("src/components/editor/editor-view.tsx")).toMatch(
      /textAlignToJustify\(/,
    );
    expect(src("src/components/project-card.tsx")).toMatch(
      /textAlignToJustify\(/,
    );
    expect(editor).toMatch(/style\.justifyContent = textAlignToJustify\(/);
  });
});

describe("the seam family's sibling-count discipline (the F61 lesson pin)", () => {
  it("every textAlign render site in the repo consumes the one seam (no hand-rolled twin)", () => {
    // The F61 incomplete-family lesson: grep the whole family before
    // declaring a fix complete. No render site hand-rolls the
    // alignment→justification mapping beside the seam.
    const surfaces = [
      "src/components/editor/canvas.tsx",
      "src/components/editor/editor-view.tsx",
      "src/components/project-card.tsx",
      "src/lib/editor.ts",
    ];
    for (const rel of surfaces) {
      const text = src(rel);
      expect(text).not.toMatch(
        /justifyContent = \(?\s*align === "center"/,
      );
    }
  });
});
