import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The mobile-surface batch (session 60, S60-F + S60-G + S60-H — the
// eighth Mode C audit's A-4, A-5 and A-7).
//
// S60-F (A-4): the vendored SheetContent's built-in Close X is ~20px
// (an h-5 w-5 icon, no padding) — below the project's own 44px touch
// floor. MobileNav fixes exactly this on the SAME vendored component
// with [&>button]:h-11 [&>button]:w-11; the two editor Sheets
// (MobilePropertiesEditor, MobileCanvasProperties) didn't carry it.
//
// S60-G (A-5): navigator.clipboard?.writeText(url).then(…).catch(…)
// short-circuits the ENTIRE expression when clipboard is absent
// (insecure contexts) — neither the success toast nor the fallback
// toast ever fired: Share silently no-oped.
//
// S60-H (A-7): MobilePropertiesEditor rendered only at
// selectedIds.length === 1 — with a marquee multi-selection on mobile
// NEITHER bottom-right chip rendered (the canvas chip needs === 0),
// while the desktop panel carries the S59-E multi-selection
// Fill/Stroke branch. The chip family's completeness rationale
// demanded the shared-section fix.

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);

/** The SheetContent block of the named mobile Sheet. */
function sheetContent(label: string): string {
  // Find the SheetTitle near the label, then the enclosing SheetContent.
  const titleIndex = viewSource.indexOf(label);
  expect(titleIndex).toBeGreaterThan(-1);
  const start = viewSource.lastIndexOf("<SheetContent", titleIndex);
  expect(start).toBeGreaterThan(-1);
  const end = viewSource.indexOf("</SheetContent>", titleIndex);
  expect(end).toBeGreaterThan(start);
  return viewSource.slice(start, end);
}

describe("the mobile Sheet close-X 44px targets (session 60, S60-F / A-4)", () => {
  it("the Edit-properties Sheet sizes its built-in Close X to the 44px floor", () => {
    const sheet = sheetContent('text-left text-sm font-medium text-white">Edit properties');
    // THE DEFECT PIN: pre-fix the SheetContent had no [&>button] sizing —
    // the vendored X rendered at ~20px.
    expect(sheet).toContain("[&>button]:h-11");
    expect(sheet).toContain("[&>button]:w-11");
  });

  it("the Edit-canvas-properties Sheet carries the same 44px Close X", () => {
    const sheet = sheetContent("Canvas properties");
    expect(sheet).toContain("[&>button]:h-11");
    expect(sheet).toContain("[&>button]:w-11");
    // The MobileNav's own fix stays (the three Sheets agree).
    const headerSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/app-header.tsx"),
      "utf8",
    );
    expect(headerSource).toContain("[&>button]:h-11");
  });
});

describe("the Share clipboard fallback branch (session 60, S60-G / A-5)", () => {
  it("onShare branches on clipboard presence — the silent short-circuit is gone", () => {
    // Comments are stripped first — the S60-G seam's own explanatory
    // comment quotes the pre-fix optional chain, and a raw source match
    // would hit the comment, not the code.
    const codeOnly = viewSource.replace(/\/\/[^\n]*/g, "");
    // THE DEFECT PIN: pre-fix the whole expression was one optional
    // chain — clipboard absent short-circuited to undefined, no toast.
    expect(codeOnly).not.toMatch(/navigator\.clipboard\s*\?\.\s*writeText/);
    // The branch: present → writeText; absent → the fallback toast DIRECT.
    expect(codeOnly).toMatch(/if \(navigator\.clipboard\) \{/);
    expect(codeOnly).toContain('toast.show({ title: "Share this project"');
    // The success toast and the Untitled-mode guard stay.
    expect(viewSource).toContain('toast.success("Share link copied", url)');
    expect(viewSource).toContain('"Share unavailable"');
  });
});

describe("the mobile multi-selection properties surface (session 60, S60-H / A-7)", () => {
  it("the desktop panel's multi-selection section exports as a shared component", () => {
    // THE DEFECT PIN: pre-fix the section was inline-only in the panel
    // — no export, no mobile consumption.
    expect(panelSource).toMatch(/export function MultiSelectionSection/);
    // The export carries the Fill/Stroke pair the desktop branch renders
    // (the section spans to its closing </section>).
    const start = panelSource.indexOf("export function MultiSelectionSection");
    const end = panelSource.indexOf("</section>", start);
    expect(end).toBeGreaterThan(start);
    const section = panelSource.slice(start, end);
    expect(section).toContain('label="Fill Color"');
    expect(section).toContain('label="Stroke"');
    // The desktop panel's own branch consumes the export.
    expect(panelSource).toMatch(/<MultiSelectionSection first=\{selected\[0\]\} update=\{update\} \/>/);
  });

  it("the mobile editor consumes the shared MultiSelectionSection", () => {
    expect(viewSource).toMatch(/MultiSelectionSection/);
    // The consumption sits inside the mobile properties Sheet's body.
    const sheet = sheetContent('text-left text-sm font-medium text-white">Edit properties');
    expect(sheet).toContain("MultiSelectionSection");
  });

  it("the mobile chip surfaces for ANY non-empty selection (not just single)", () => {
    // THE DEFECT PIN: pre-fix the selector returned null unless
    // selectedIds.length === 1 — a multi-selection rendered NO chip.
    const editorStart = viewSource.indexOf("function MobilePropertiesEditor");
    const editorEnd = viewSource.indexOf("function MobileCanvasProperties");
    const editor = viewSource.slice(editorStart, editorEnd);
    expect(editor).not.toMatch(/if \(s\.selectedIds\.length !== 1\) return null;/);
    // The single/multi discrimination drives the Sheet body's branch:
    // a count-based guard (single only when exactly one member).
    expect(editor).toMatch(/selectedCount === 1 \? firstSelected : null/);
    // And the chip mounts while ANY selection exists (firstSelected is
    // the first member of a non-empty selection).
    expect(editor).toContain("const hasSelection = firstSelected !== null;");
  });
});
