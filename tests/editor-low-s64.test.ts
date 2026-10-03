import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The editor Low batch (session 64, S64-G — the twelfth audit's
// A-4 + A-5 + A-6 + A-8).
//
// A-4 THE DEFECT: the "is this a typing target" predicate existed as
// TWO hand-maintained copies — the editor shell's copy carried the
// range carve-out (a slider accepts no text, so shortcuts must not
// stand down behind it) while the canvas copy predated it. Two copies
// of one domain predicate, already drifted.
//
// A-5 THE DEFECT: the canvas's draw/move/marquee drags captured no
// pointer — only the pan branch and the resize handles did — so a
// drag whose pointer crossed into the chrome terminated instantly
// (the leave handler ends the drag) and the element committed
// mid-flight.
//
// A-6 THE DEFECT: the selected element carried BOTH an inline
// box-shadow selection paint AND utility ring classes — the inline
// style wins the cascade, so the utility classes never painted (dead
// chrome that misleads the next reader).
//
// A-8 THE DEFECT: the TEXT section's color row swallowed the cleared
// value (a falsy guard dropped the null) while its sibling fill and
// stroke rows commit the clear — the canvas renders a null text color
// as the default white, so the guard made the clear a silent no-op.

const editorLibSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);

describe("the typing-target predicate is single-sourced (session 64, S64-G / A-4)", () => {
  it("the pure lib exports the predicate WITH the range carve-out", () => {
    // THE DEFECT PIN: pre-fix no shared export existed — two local
    // copies with drifted semantics.
    expect(editorLibSource).toMatch(/export function isTypingTarget\(/);
    const fnIdx = editorLibSource.indexOf("export function isTypingTarget(");
    const fnBody = editorLibSource.slice(fnIdx, editorLibSource.indexOf("}", fnIdx + 400) + 1);
    // The range carve-out — the S62-A contract the shell copy carried.
    expect(fnBody).toMatch(/range/);
  });

  it("the editor shell consumes the seam (no local copy)", () => {
    expect(viewSource).toMatch(/import \{[^}]*isTypingTarget[^}]*\} from "@\/lib\/editor"/);
    // THE DEFECT PIN: the local function definition is gone.
    expect(viewSource).not.toMatch(/function isTypingTarget\(/);
  });

  it("the canvas consumes the seam (no local copy)", () => {
    expect(canvasSource).toMatch(/import \{[^}]*isTypingTarget[^}]*\} from "@\/lib\/editor"/);
    expect(canvasSource).not.toMatch(/function isTypingTarget\(/);
  });
});

describe("the canvas drags capture the pointer (session 64, S64-G / A-5)", () => {
  it("the draw/move/marquee branches capture on the container", () => {
    // THE DEFECT PIN: pre-fix only the pan branch and the resize
    // handles captured — a drag crossing into the chrome died.
    const fnStart = canvasSource.indexOf("function onPointerDown(");
    expect(fnStart).toBeGreaterThan(-1);
    const fnEnd = canvasSource.indexOf("function onPointerMove(", fnStart);
    const body = canvasSource.slice(fnStart, fnEnd);
    // The capture call on the CONTAINER (currentTarget — the handler's
    // own element, not a child that the next re-render may replace).
    expect(body).toMatch(/event\.currentTarget as HTMLElement\)\.setPointerCapture/);
    // At least two drag branches carry it (draw + move/marquee).
    const captures = body.match(/setPointerCapture/g) ?? [];
    expect(captures.length).toBeGreaterThanOrEqual(3);
  });
});

describe("the dead selection ring classes are gone (session 64, S64-G / A-6)", () => {
  it("the inline box-shadow is the ONE selection paint seam", () => {
    // THE DEFECT PIN: the utility ring family on the selected element
    // never painted — the inline shadow owns the cascade. Pre-fix both
    // existed side by side.
    expect(canvasSource).not.toMatch(/ring-2 ring-blue-500/);
    // The inline seam survives.
    expect(canvasSource).toMatch(/boxShadow: selected \? "0 0 0 2px rgba\(59, 130, 246, 0\.9\)"/);
  });
});

describe("the TEXT color row commits the clear (session 64, S64-G / A-8)", () => {
  it("the color row's onChange commits the nullable value like its sibling rows", () => {
    // THE DEFECT PIN: pre-fix a falsy guard dropped the cleared value
    // — the row advertised a clear that silently no-opped. The fix
    // commits the nullable color exactly as the stroke and fill rows
    // do (the canvas renders a null text color as the default white).
    const idx = panelSource.indexOf('<HexColorRow label="Color"');
    expect(idx).toBeGreaterThan(-1);
    const row = panelSource.slice(idx, idx + 200);
    expect(row).toMatch(/value=\{element\.fill\}/);
    expect(row).toMatch(/onChange=\{\(fill\) => update\(\{ fill \}\)\}/);
    // The falsy-guard form is gone from THIS row (the background-color
    // row's guard is a different, legitimate contract — background
    // color is non-nullable).
    expect(row).not.toMatch(/fill && update/);
  });
});
