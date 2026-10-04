import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The layers-panel honesty batch (session 61, S61-D — the ninth Mode C
// audit's A-L-1 + A-L-4).
//
// A-L-1: the row's onDoubleClick fires rename activation; the nested
// eye/lock buttons stop propagation on CLICK only, so a rapid
// double-toggle (a natural gesture) silently steals focus into the
// rename input. The S59-A nested-control guard pattern applies to the
// dblclick handler too.
//
// A-L-4: with elements present and every layer hidden, the Select All
// label reads "Select All" but the click selects visible-only =
// nothing — a dead control that lies. The honest fix disables it in
// that state. The 0-element "Deselect All" quirk is deliberately
// preserved (reference parity, pinned by the S57-F suite).

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/layers-panel.tsx"),
  "utf8",
);

describe("the layers-row dblclick nested-control guard (session 61, S61-D / A-L-1)", () => {
  it("the rename activation exempts nested controls — a double-toggle on eye/lock never opens rename", () => {
    // THE DEFECT PIN: pre-fix the row's onDoubleClick had no
    // nested-control guard — the dblclick bubbled from the eye/lock
    // buttons straight into setRenaming. The window stops at the next
    // attribute (onClick) so the S59-A onKeyDown guard below cannot
    // satisfy the pin (the F47 code-not-prose anchor rule).
    const start = panelSource.indexOf("onDoubleClick={(event) => {");
    expect(start).toBeGreaterThan(-1);
    const end = panelSource.indexOf("onClick={(event)", start);
    expect(end).toBeGreaterThan(start);
    const handler = panelSource.slice(start, end);
    // Session 70 (S70-A) contract re-anchor: the guard's selector
    // REFINED with the a11y restructure — the action trio is scoped by
    // its data-layer-action wrapper and the rename input by its tag; the
    // select button (the row's primary surface) is exempt so a
    // double-click on the name still opens the rename. The BEHAVIORAL
    // contract (a rapid eye/lock double-toggle never steals into rename)
    // is pinned unchanged.
    expect(handler).toContain('closest("[data-layer-action], input")');
  });
});

describe("the Select All dead-state disable (session 61, S61-D / A-L-4)", () => {
  it("the control disables when elements exist but every layer is hidden", () => {
    // THE DEFECT PIN: pre-fix the button had no disabled gating — the
    // label read "Select All" over a click that could select nothing.
    const start = panelSource.indexOf('onClick={() => {');
    expect(start).toBeGreaterThan(-1);
    // The Select All button: find the button element carrying the
    // flip logic by anchoring on its className after the handler.
    const buttonStart = panelSource.lastIndexOf("<button", start);
    const buttonEnd = panelSource.indexOf("</button>", start);
    const button = panelSource.slice(buttonStart, buttonEnd);
    expect(button).toContain("disabled={");
    expect(button).toMatch(/elements\.length\s*>\s*0\s*&&\s*visible\.length\s*===\s*0/);
  });

  it("preservation: the 0-element Deselect-All quirk stays (the pinned parity behavior)", () => {
    // The label logic keeps the elements.length === 0 branch first —
    // the empty canvas still shows "Deselect All" (reference parity,
    // the S57-F pin).
    // Session 71 re-anchor (S71-A / A-F8): the label's IIFE collapsed
    // into the plain ternary over the ONE hoisted allVisibleSelected
    // constant — the quirk lives in the declaration (elements.length
    // === 0 || …).
    const labelStart = panelSource.indexOf('{allVisibleSelected ? "Deselect All" : "Select All"}');
    expect(labelStart).toBeGreaterThan(-1);
    const flipDecl = panelSource.indexOf("const allVisibleSelected =");
    expect(flipDecl).toBeGreaterThan(-1);
    const declBody = panelSource.slice(flipDecl, flipDecl + 260);
    expect(declBody).toContain("elements.length === 0 ||");
  });
});
