import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The shared canvas-properties seam (session 53, S53-C).
//
// The desktop panel's no-selection branch has carried the Background
// Color section (the uppercase heading + the HexColorRow) since the
// early sessions — panel-inline, like every section was before session
// 50. Below lg the properties panel does not exist, so a phone with
// NOTHING selected had no background-color surface at all (the
// reference's own mobile editor carries its pair only inside a clipped
// ~126px Canvas-Properties sliver — the 29th-audit datum). Session 53
// completes the mobile surface family the way sessions 50/52 completed
// the element surfaces: the section extracts into ONE exported
// component (`CanvasBackgroundSection` — the TextSection pattern)
// consumed by BOTH the desktop panel and a new mobile bottom Sheet
// (the Edit-canvas-properties chip, the Edit-properties chip's
// bottom-right counterpart, rendering exactly when NO element is
// selected so the two chips are mutually exclusive).
//
// This suite pins the seam as a SOURCE contract (the
// properties-sections pattern): the export signature, both consumers,
// the honest chip label (F39 — the label must describe what the Sheet
// actually carries), and the no-duplication markers.

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

describe("CanvasBackgroundSection — the shared canvas-properties seam (session 53, S53-C)", () => {
  it("exports the shared section with the backgroundColor+onChange contract", () => {
    expect(panelSource).toMatch(
      /export function CanvasBackgroundSection\(\s*\{\s*backgroundColor,\s*onChange,\s*\}: \{\s*backgroundColor: string;\s*onChange: \(color: string\) => void;\s*\}/,
    );
  });

  it("the desktop panel's no-selection branch consumes the shared section (a pure refactor)", () => {
    expect(panelSource).toMatch(
      /<CanvasBackgroundSection backgroundColor=\{backgroundColor\} onChange=\{setBackgroundColor\} \/>/,
    );
    // The no-duplication marker: the section's unique chrome exists
    // exactly ONCE in the panel file (inside the shared component).
    const count = panelSource.match(/aria-label="Background color"/g)?.length ?? 0;
    expect(count, 'the "Background color" section marker must exist exactly once').toBe(1);
  });

  it("the mobile surface consumes the SAME section (editor-view)", () => {
    expect(viewSource).toMatch(
      /import \{[^}]*CanvasBackgroundSection[^}]*\} from "\.\/properties-panel";/,
    );
    expect(viewSource).toMatch(/<CanvasBackgroundSection\s*\n?\s*backgroundColor=\{[^}]*\}\s*\n?\s*onChange=\{[^}]*\}\s*\/>/);
    // And the mobile surface carries no section duplication of its own.
    expect(viewSource).not.toMatch(/aria-label="Background color"/);
  });

  it("the mobile canvas chip is honest about its surface (Edit canvas properties)", () => {
    // The F39 honest-label rule: the chip opens a Sheet carrying the
    // Background Color section — the label and the Sheet title must say
    // so, parallel to the element-properties pair.
    expect(viewSource).toMatch(/aria-label="Edit canvas properties"/);
    expect(viewSource).toMatch(/>Canvas properties<\/SheetTitle>/);
  });

  it("the canvas chip renders only when NOTHING is selected (the mutual-exclusion guard)", () => {
    // The selector subscribes to the empty-selection state — the chip
    // and the element-properties chip are mutually exclusive (each
    // renders exactly when its desktop panel branch is the content).
    expect(viewSource).toMatch(/selectedIds\.length === 0/);
    // And the sheet closes when a selection appears (the sanctioned
    // render-time compare-and-adjust — never setState-in-effect).
    expect(viewSource).toMatch(/setOpen\(false\)/);
  });
});
