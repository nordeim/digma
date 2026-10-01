import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The shared TEXT-section seam (session 50, S50-1).
//
// The desktop properties panel renders the TEXT section (Content, Font
// Size, Color, Font Family, Text Align) only inside its `lg:flex`
// column — below lg a phone has NO properties surface of any kind, so a
// freshly drawn text element is stuck at its "Type here..." default
// forever (live-measured at 390×844: zero text-content inputs in the
// whole editor). Session 50 closes the gap with a mobile bottom Sheet
// that renders the SAME controls.
//
// The F35e lesson: two hand-maintained copies of the same domain WILL
// diverge — so the section lives in ONE exported component
// (`TextSection`) consumed by BOTH the desktop panel and the mobile
// surface (the `InlineProjectRename` pattern: exported from
// project-card.tsx, consumed by the grid card AND the list card). This
// suite pins the contract the way tests/canvas-memo.test.ts pins the
// memo wrapper — as a SOURCE contract. The runtime behavior (the five
// controls' chrome and function) stays pinned by the editor-panels e2e
// suite (desktop) and the mobile-text-editing e2e suite (mobile).

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

describe("TextSection — the single-source TEXT controls (session 50, S50-1)", () => {
  it("exports the shared TextSection component from the properties panel module", () => {
    // The seam must exist as an exported component taking the element +
    // the update patcher — the two surfaces' only contract.
    expect(panelSource).toMatch(
      /export function TextSection\(\s*\{\s*element,\s*update,\s*\}: \{\s*element: DesignElementDTO;\s*update: \(patch: Partial<DesignElementDTO>\) => void;\s*\}/,
    );
  });

  it("the desktop panel consumes the shared section (no inline duplication)", () => {
    // The panel renders THROUGH the seam. The five controls' markup —
    // the Content input above all — must exist exactly ONCE in the
    // file (inside the shared component); a re-inlined copy in the
    // panel body is the divergence this seam exists to prevent.
    expect(panelSource).toMatch(/<TextSection element=\{single\} update=\{update\} \/>/);
    const contentInputs = panelSource.match(/aria-label="Text content"/g) ?? [];
    expect(contentInputs.length).toBe(1);
  });

  it("the mobile surface consumes the SAME shared section (editor-view)", () => {
    // The mobile bottom Sheet renders the shared component — never a
    // second hand-typed copy of the TEXT controls.
    expect(viewSource).toMatch(/import \{[^}]*TextSection[^}]*\} from "\.\/properties-panel";/);
    expect(viewSource).toMatch(/<TextSection element=\{[^}]*\} update=\{[^}]*\} \/>/);
    // And the mobile surface carries no TEXT-control duplication of
    // its own (the Content input exists in exactly one editor file).
    expect(viewSource).not.toMatch(/aria-label="Text content"/);
  });
});
