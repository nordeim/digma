import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The multi-selection fill clear (session 59, S59-E — the seventh Mode C
// audit's A-L-3).
//
// The multi-selection Fill row committed with a truthiness guard —
// onChange={(fill) => fill && update({ fill })} — which silently DISCARDED
// the null commit HexColorRow emits when the hex field is emptied. The
// sibling Stroke row commits null directly (update({ stroke })), and the
// single-selection Solid tab also commits null (the transparent state).
// Clearing a multi-selection fill was a silent no-op: the field showed the
// "transparent" placeholder, then visibly snapped back on the next
// resync.
//
// The fix: the Fill row commits the value as-is — null clears the fill
// across the selection, exactly the Stroke row's contract.

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);

/** The multi-selection section of the properties panel. */
function multiSelectSection(): string {
  const start = panelSource.indexOf('aria-label="Multiple selection"');
  expect(start).toBeGreaterThan(-1);
  const end = panelSource.indexOf("</section>", start);
  expect(end).toBeGreaterThan(start);
  return panelSource.slice(start, end);
}

describe("the multi-selection fill clear (session 59, S59-E / A-L-3)", () => {
  it("the Fill row commits the null clear (no truthiness guard)", () => {
    const section = multiSelectSection();
    const fillRow = section.slice(0, section.indexOf('label="Stroke"'));
    expect(fillRow).toContain('label="Fill Color"');
    // The truthiness guard is GONE…
    expect(fillRow).not.toMatch(/fill && update\(\{ fill \}\)/);
    // …the row commits the value as-is (null clears, a hex paints).
    expect(fillRow).toMatch(/onChange=\{\(fill\) => update\(\{ fill \}\)\}/);
  });

  it("the Stroke row's contract is unchanged (the sibling seam preserved)", () => {
    const section = multiSelectSection();
    expect(section).toMatch(
      /onChange=\{\(stroke\) => update\(\{ stroke \}\)\}/,
    );
  });
});
