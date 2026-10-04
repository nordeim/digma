import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The layers-row keyboard exemption (session 59, S59-A — the seventh Mode C
// audit's B-M-1).
//
// The layer row (a div carrying the button role) activated on Enter/Space
// for ANY keydown bubbling from inside it — unconditionally
// preventDefault()ing first. Its descendants included the rename input
// (whose own handler never stopped propagation) and the eye/lock/trash
// buttons:
//
//   (a) a Space typed in the rename input was canceled before character
//       insertion — multi-word layer names were impossible to type by
//       keyboard (the e2e rename pin uses Playwright's fill(), which sets
//       the value without per-key keydowns, so the pin masked the defect);
//   (b) Enter/Space on the eye/lock/trash buttons had their native
//       activations canceled — the buttons made keyboard-REACHABLE by
//       S57-F's focus:opacity-100 were keyboard-INOPERABLE; both keys
//       merely re-selected the row.
//
// The original fix: the row's onKeyDown guarded nested interactive targets
// FIRST — an event whose target resolved inside a button or input returned
// untouched.
//
// Session 70 (S70-A / M-A2) contract re-anchor: the a11y restructure made
// the guard STRUCTURALLY unnecessary — the select surface is a real
// <button> (native Enter/Space activation), and the rename input + the
// eye/lock/trash trio render as its SIBLINGS inside the row container, so
// no interactive control nests inside another. The behavioral contracts
// the guard protected are pinned below on the new structure; the e2e
// rename (Space-types-multi-word-names) and Space-activation pins exercise
// them live.

const layersSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/layers-panel.tsx"),
  "utf8",
);

/** The select button's opening tag region. (The slice is width-based —
 * an indexOf(">") probe would land inside the onClick arrow function's
 * `=>` before the tag's real closing bracket.) */
function selectButton(): string {
  const labelIdx = layersSource.indexOf("aria-label={`Layer ${el.name ?? el.type}`}");
  expect(labelIdx).toBeGreaterThan(-1);
  const start = layersSource.lastIndexOf("<button", labelIdx);
  return layersSource.slice(start, start + 700);
}

describe("the layers-row keyboard exemption (session 59, S59-A / B-M-1)", () => {
  it("the interactive controls are SIBLINGS — nothing nests inside the select button (the hazard is structural now)", () => {
    // The select button's tag: a real button carrying the selection.
    const button = selectButton();
    expect(button).toContain('type="button"');
    expect(button).toContain("aria-pressed={isSelected}");
    // The row container carries NO keydown of its own (the hand-rolled
    // S57-F/S59-A pair is gone — the native activation owns it).
    const rowStart = layersSource.indexOf("draggable={renaming !== el.id}");
    const rowEnd = layersSource.indexOf("data-layer-row", rowStart);
    expect(layersSource.slice(rowStart, rowEnd)).not.toMatch(/onKeyDown/);
    // And the rename input renders OUTSIDE the select button (the
    // sibling structure): the button block contains no input.
    const buttonBlock = layersSource.slice(
      layersSource.lastIndexOf("<button", layersSource.indexOf("aria-label={`Layer ${el.name ?? el.type}`}")),
      layersSource.indexOf("</button>", layersSource.indexOf("aria-label={`Layer ${el.name ?? el.type}`}")),
    );
    expect(buttonBlock).not.toContain("<input");
  });

  it("the remaining nested-control hazard (dblclick into rename) keeps its refined guard", () => {
    // The S61-D dblclick guard — the one nesting hazard that remains (the
    // eye/lock buttons stop CLICK only) — carries the REFINED selector:
    // the action trio scoped by data-layer-action, the rename input by
    // its tag, the select button exempt (dblclick on the name renames).
    const dblIdx = layersSource.indexOf("onDoubleClick={(event) => {");
    const guard = layersSource.slice(dblIdx, dblIdx + 1600);
    expect(guard).toContain('closest("[data-layer-action], input")');
    // The action trio's wrapper carries the marker the guard scopes on.
    expect(layersSource).toContain('<div className="flex items-center gap-1" data-layer-action>');
  });

  it("the row's OWN activation contract is preserved (the select button fires onRowClick)", () => {
    // The S57-F behavioral contract, native now: the real button's click
    // (Enter/Space activate a button natively) routes through
    // onRowClick — the shiftKey-aware select.
    const button = selectButton();
    expect(button).toContain("onClick={(event) => onRowClick(el.id, event)}");
  });
});
