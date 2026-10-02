import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The SheetDescription completeness pass (session 54, S54-B — the
// session-53 audit's deferred finding F-5).
//
// The three mobile Sheets (the navigation drawer in app-header.tsx,
// the MobilePropertiesEditor bottom Sheet, and the MobileCanvasProperties
// bottom Sheet in editor-view.tsx) rendered a SheetTitle but NO
// SheetDescription — Radix's dialog contract wants a description (its
// dev build warns "Missing Description or aria-describedby"), and the
// vendored sheet primitive already exports SheetDescription that no
// consumer used. Screen readers got the Sheet's NAME on open but never
// its PURPOSE.
//
// The fix: each Sheet renders a SheetDescription (visually sr-only —
// the dialog's chrome is unchanged, pixel-identical) whose text states
// the Sheet's purpose. Radix wires the aria-describedby on the dialog
// automatically, so the announcement is structural, not hand-rolled.
//
// This suite pins the seam as a SOURCE contract (the
// canvas-memo/guarded-number-input pattern); the runtime
// aria-describedby wiring (the attribute resolving to a real,
// non-empty element) is pinned by the mobile-navigation and
// mobile-properties e2e specs.

const headerSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/app-header.tsx"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

describe("SheetDescription — the three mobile Sheets announce their purpose (session 54, S54-B)", () => {
  it("the mobile navigation drawer carries a description", () => {
    expect(headerSource).toMatch(/SheetDescription/);
    // The description's text states the drawer's purpose — non-empty,
    // sr-only (the drawer's chrome is unchanged).
    expect(headerSource).toMatch(/<SheetDescription[^>]*>\s*[^<]*\S/);
    expect(headerSource).toMatch(/sr-only/);
  });

  it("the element-properties and canvas-properties Sheets carry descriptions", () => {
    // Exactly TWO SheetDescription sites in the editor view — the
    // MobilePropertiesEditor Sheet and the MobileCanvasProperties
    // Sheet (the ShortcutsDialog is a Dialog, not a Sheet; the count
    // pins that no Sheet is left out and none is double-described).
    expect(viewSource.match(/<SheetDescription/g)?.length ?? 0).toBe(2);
    expect(viewSource).toMatch(/SheetDescription/);
    // The purpose text is honest per surface (F39): the element Sheet
    // edits the SELECTED ELEMENT's properties; the canvas Sheet edits
    // the CANVAS background.
    expect(viewSource).toMatch(/Edit the selected element's properties\./);
    expect(viewSource).toMatch(/Edit the canvas background color\./);
  });
});
