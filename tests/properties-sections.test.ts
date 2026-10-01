import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The shared properties-section seams (session 52, S52-1).
//
// Session 50 extracted the TEXT section into ONE exported component
// (`TextSection`) consumed by both the desktop panel and the mobile
// bottom Sheet — the F35e lesson: two hand-maintained copies of the
// same domain WILL diverge. But the OTHER five sections stayed
// panel-inline, so below lg a phone could edit a selected text's
// CONTENT but not its position, size, fill, stroke, radius, transform,
// or opacity — and a selected rectangle had NO properties surface at
// all (the chip was text-only).
//
// Session 52 completes the architecture: every section is an exported
// shared component, and the TYPE-CONDITIONAL COMPOSITION itself (the
// section order + the per-type gates) lives in ONE component —
// `PropertiesSections` — consumed by BOTH surfaces. This suite pins
// the contract the way tests/canvas-memo.test.ts and
// tests/text-section.test.ts pin theirs: as a SOURCE contract. The
// runtime chrome stays pinned by the editor-panels e2e suite (desktop)
// and the mobile-properties e2e suite (mobile).

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

// The signature every shared section shares with TextSection: the
// element + an update patcher bound to the consumer's selection scope.
const sectionSignature = (name: string) =>
  new RegExp(
    `export function ${name}\\(\\s*\\{\\s*element,\\s*update,\\s*\\}: \\{\\s*element: DesignElementDTO;\\s*update: \\(patch: Partial<DesignElementDTO>\\) => void;\\s*\\}`,
  );

describe("PropertiesSections — the single-source section architecture (session 52, S52-1)", () => {
  it("exports the five section components with the element+update contract", () => {
    expect(panelSource).toMatch(sectionSignature("PositionSizeSection"));
    expect(panelSource).toMatch(sectionSignature("CornerRadiusSection"));
    expect(panelSource).toMatch(sectionSignature("FillStrokeSection"));
    expect(panelSource).toMatch(sectionSignature("TransformSection"));
    expect(panelSource).toMatch(sectionSignature("OpacitySection"));
  });

  it("exports the PropertiesSections composer with the same contract", () => {
    expect(panelSource).toMatch(sectionSignature("PropertiesSections"));
  });

  it("the composer renders the sections in the reference's measured order", () => {
    // Position & Size -> (Corner Radius) -> (Fill & Stroke) -> (TEXT)
    // -> Transform -> Opacity — the desktop panel's measured layout,
    // now the ONE ordering both surfaces share.
    const positions = [
      panelSource.indexOf("<PositionSizeSection"),
      panelSource.indexOf("<CornerRadiusSection"),
      panelSource.indexOf("<FillStrokeSection"),
      panelSource.indexOf("<TextSection"),
      panelSource.indexOf("<TransformSection"),
      panelSource.indexOf("<OpacitySection"),
    ];
    expect(positions.every((i) => i >= 0), "every section renders inside the composer").toBe(true);
    // The composition sites appear AFTER the component definitions (the
    // definitions precede the composer in the file), and in order.
    const composerStart = panelSource.indexOf("export function PropertiesSections");
    const composition = positions.map((p, i) => ({ p, i })).filter(({ p }) => p > composerStart);
    expect(composition.length, "all six composition sites live inside the composer").toBe(6);
    const ordered = composition.map(({ p }) => p);
    expect([...ordered].sort((a, b) => a - b)).toEqual(ordered);
  });

  it("the composer carries the TYPE-CONDITIONAL gates (the F35e layout rule)", () => {
    // Corner Radius hidden for line/ellipse/text (RA-9); Fill & Stroke
    // hidden for text (RA-10 — the text's color lives in the TEXT
    // section); the TEXT section only for text. The gates live ONCE —
    // in the composer — never hand-copied into a consumer.
    expect(panelSource).toMatch(
      /\{\!\["line",\s*"ellipse",\s*"text"\]\.includes\(element\.type\) && \(\s*<CornerRadiusSection/,
    );
    expect(panelSource).toMatch(/\{element\.type !== "text" && \(\s*<FillStrokeSection/);
    expect(panelSource).toMatch(/\{element\.type === "text" && <TextSection/);
  });

  it("the desktop panel consumes the composer (no inline section bodies)", () => {
    expect(panelSource).toMatch(/<PropertiesSections element=\{single\} update=\{update\} \/>/);
    // The no-duplication markers: each section's unique control exists
    // exactly ONCE in the panel file (inside its shared component).
    const markers: Array<[string, RegExp]> = [
      ['aria-label="Position and size"', /aria-label="Position and size"/g],
      ["Stroke Width", /label="Stroke Width"/g],
      ['aria-label="Rotation"', /aria-label="Rotation"/g],
      ['aria-label="Opacity value"', /aria-label="Opacity value"/g],
      ["All Corners", /label="All Corners"/g],
    ];
    for (const [name, re] of markers) {
      const count = panelSource.match(re)?.length ?? 0;
      expect(count, `${name} must exist exactly once (inside the shared section)`).toBe(1);
    }
  });

  it("the fill-tab derivation lives INSIDE FillStrokeSection (the RA-54 superset)", () => {
    // The active tab derives from the element's fill state (image >
    // gradient > solid) — session 41's superset over the reference's
    // reset-to-Solid quirk. Moving the section into a shared component
    // must carry the derivation with it (a panel-level tab state would
    // not exist for the mobile consumer).
    const sectionStart = panelSource.indexOf("export function FillStrokeSection");
    const sectionEnd = panelSource.indexOf("export function", sectionStart + 10);
    const sectionBody = panelSource.slice(sectionStart, sectionEnd);
    expect(sectionBody).toMatch(/derivedFillMode/);
    expect(sectionBody).toMatch(/setFillTab\(derivedFillMode\)/);
    expect(sectionBody).toMatch(/<Tabs\s+value=\{fillTab\}/);
  });

  it("the mobile surface consumes the SAME composer (editor-view)", () => {
    expect(viewSource).toMatch(
      /import \{[^}]*PropertiesSections[^}]*\} from "\.\/properties-panel";/,
    );
    expect(viewSource).toMatch(/<PropertiesSections element=\{[^}]*\} update=\{[^}]*\} \/>/);
    // And the mobile surface carries no section duplication of its own:
    // the unique control markers must NOT appear in editor-view.tsx.
    expect(viewSource).not.toMatch(/aria-label="Rotation"/);
    expect(viewSource).not.toMatch(/label="Stroke Width"/);
    expect(viewSource).not.toMatch(/aria-label="Position and size"/);
  });

  it("the mobile surface's chip is honest about the wider surface (Edit properties)", () => {
    // The session-50 chip was text-only ("Edit text"); the extended
    // surface opens for ANY single selection, so the label and the
    // Sheet title describe what it actually carries.
    expect(viewSource).toMatch(/aria-label="Edit properties"/);
    expect(viewSource).toMatch(/>Edit properties<\/SheetTitle>/);
    // The old text-only guard is gone from the selector + the patcher:
    // the mobile surface selects/updates ANY single element.
    const selector = viewSource.match(/const selected\w* = useEditorStore\(\(s\) => \{[\s\S]*?\}\);/);
    expect(selector, "the mobile selector exists").toBeTruthy();
    expect(selector![0]).not.toMatch(/=== "text"/);
  });
});
