import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The layers-row keyboard exemption (session 59, S59-A — the seventh Mode C
// audit's B-M-1).
//
// The layer row (role="button") activated on Enter/Space for ANY keydown
// bubbling from inside it — unconditionally preventDefault()ing first. Its
// descendants include the rename input (whose own handler never stopped
// propagation) and the eye/lock/trash buttons:
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
// The fix: the row's onKeyDown guards nested interactive targets FIRST —
// an event whose target resolves inside a button or input returns
// untouched. Space types, buttons activate natively, and the row's own
// activation contract (Enter/Space on the row proper) is preserved.

const layersSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/layers-panel.tsx"),
  "utf8",
);

/** The row's onKeyDown handler block. */
function rowKeyDown(): string {
  const start = layersSource.indexOf("onKeyDown={(event) => {");
  // The row handler is the one containing the S57-F comment.
  const anchor = layersSource.indexOf("WAI-ARIA button pattern");
  expect(anchor).toBeGreaterThan(-1);
  const start2 = layersSource.lastIndexOf("onKeyDown={(event) => {", anchor);
  const end = layersSource.indexOf("})}", start2);
  expect(start2).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start2);
  return layersSource.slice(start2, end);
}

describe("the layers-row keyboard exemption (session 59, S59-A / B-M-1)", () => {
  it("the row's keydown guards nested interactive targets BEFORE the activation branch", () => {
    const handler = rowKeyDown();
    // The nested-control guard exists…
    expect(handler).toMatch(/closest\("button, input"\)|closest\('button, input'\)/);
    // …and it runs BEFORE the Enter/Space activation branch (the
    // unconditional preventDefault that canceled nested controls).
    const guardIdx = handler.search(/closest\("button, input"\)|closest\('button, input'\)/);
    const keyIdx = handler.indexOf('event.key === "Enter"');
    expect(keyIdx).toBeGreaterThan(-1);
    expect(guardIdx).toBeGreaterThan(-1);
    expect(guardIdx).toBeLessThan(keyIdx);
  });

  it("the guard RETURNS untouched for nested controls (no preventDefault, no onRowClick)", () => {
    const handler = rowKeyDown();
    // The guard is an early return — the nested event flows to the native
    // handler untouched.
    expect(handler).toMatch(
      /if\(\s*\(event\.target as HTMLElement\)\.closest\("button, input"\)\s*\)\s*return;|if \(\(event\.target as HTMLElement\)\.closest\("button, input"\)\) return;/,
    );
  });

  it("the row's OWN activation contract is preserved (Enter/Space still fire onRowClick)", () => {
    const handler = rowKeyDown();
    // The S57-F contract on the row proper: Enter OR Space activates the
    // row selection.
    expect(handler).toContain('event.key === "Enter"');
    expect(handler).toContain('event.key === " "');
    expect(handler).toContain("onRowClick(el.id");
    expect(handler).toContain("event.preventDefault()");
  });
});
