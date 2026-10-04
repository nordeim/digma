import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The Low a11y batch (session 57, S57-F — the fifth Mode C audit's
// L-1 + L-2 + L-3 + L-5).
//
// L-2: the layers panel's eye button carried the broken Tailwind variant
// string `aria-hidden:focus:opacity-100` — it compiles to
// [aria-hidden="true"]:focus:…, but the BUTTON never carries aria-hidden
// (only the inner Eye icon does), so the variant never matched: a
// keyboard-focused eye button stayed invisible. The lock/trash buttons
// correctly use `focus:opacity-100`.
//
// L-1: the Select All / Deselect All toggle compared
// selectedIds.length === elements.length, but selectAll selects
// VISIBLE-only — with ≥1 hidden layer the count never reached equality,
// the label stayed "Select All", and every click re-ran selectAll().
//
// L-3: the layers row (role="button") activated on Enter only — the
// WAI-ARIA button pattern requires Space activation too.
//
// L-5: the toolbar rendered a DOUBLE separator between Hand and Frame
// (the entry.id === "frame" divider AND the index === 1 divider at the
// same boundary).

const layersSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/layers-panel.tsx"),
  "utf8",
);
const toolbarSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/toolbar.tsx"),
  "utf8",
);

describe("the Low a11y batch (session 57, S57-F)", () => {
  it("L-2: the eye button's focus reveal uses the working focus variant", () => {
    // The broken aria-hidden:focus variant is gone…
    expect(layersSource).not.toContain("aria-hidden:focus:opacity-100");
    // …and the eye button carries the lock/trash convention. The eye
    // toggle is the first of the three opacity-0 row buttons (the one
    // whose handler calls toggleVisibility).
    const eyeIdx = layersSource.indexOf("toggleVisibility(el.id)");
    expect(eyeIdx).toBeGreaterThan(-1);
    const buttonStart = layersSource.lastIndexOf("<button", eyeIdx);
    const buttonEnd = layersSource.indexOf(">", eyeIdx);
    const eyeButton = layersSource.slice(buttonStart, buttonEnd);
    expect(eyeButton).toContain("focus:opacity-100");
  });

  it("L-1: the select-all flip condition is visible-elements-aware", () => {
    const m = layersSource.match(/onClick=\{\(\) => \{([\s\S]*?)store\.selectAll\(\);/);
    expect(m).not.toBeNull();
    const handler = m![1];
    // The label/deselect decision considers ONLY the visible family…
    // Session 61 (S61-D) contract update: the visible family is computed
    // ONCE at the component top (const visible = elements.filter((el) =>
    // el.visible)) instead of inline in the handler — the flip still
    // reads exactly that family.
    // Session 71 re-anchor (S71-A / A-F8): the flip condition itself
    // hoisted into the ONE allVisibleSelected declaration (the
    // computed-twice drift closed) — the handler consumes the hoisted
    // constant; the visible-aware logic lives in the declaration.
    expect(handler).toContain("allVisibleSelected");
    const hoisted = layersSource.indexOf("const visible = elements.filter((el) => el.visible);");
    expect(hoisted).toBeGreaterThan(-1);
    const flipDecl = layersSource.indexOf("const allVisibleSelected =", hoisted);
    expect(flipDecl).toBeGreaterThan(hoisted);
    const declBody = layersSource.slice(flipDecl, flipDecl + 260);
    expect(declBody).toContain("visible.length > 0");
    expect(declBody).toContain("visible.every(");
    // …and the empty-canvas reference quirk (0 layers → "Deselect All")
    // is preserved.
    expect(declBody).toContain("elements.length === 0");
    // The rendered label computes from the same visible-aware condition
    // (not the old elements.length comparison) — anchor AFTER the
    // handler so header comments don't shadow the label expression.
    // Session 71 re-anchor (S71-A / A-F8): the label is the plain
    // ternary over the hoisted constant.
    const handlerIdx = layersSource.indexOf("store.selectAll();");
    const labelStart = layersSource.indexOf('"Deselect All"', handlerIdx);
    expect(labelStart).toBeGreaterThan(-1);
    const before = layersSource.slice(Math.max(0, labelStart - 400), labelStart);
    expect(before).toContain("allVisibleSelected ?");
  });

  it("L-3: the layers row activates on Space as well as Enter", () => {
    // Session 70 (S70-A) contract re-anchor: the hand-rolled row keydown
    // is gone — the select surface is a REAL <button>, and a button
    // activates on Enter AND Space natively (the behavioral contract is
    // pinned unchanged; the e2e Space-activation pin in
    // session70-fixes.spec.ts exercises it live).
    const buttonIdx = layersSource.indexOf('aria-label={`Layer ${el.name ?? el.type}`}');
    expect(buttonIdx).toBeGreaterThan(-1);
    const buttonStart = layersSource.lastIndexOf("<button", buttonIdx);
    expect(layersSource.slice(buttonStart, buttonIdx)).toContain("type=\"button\"");
    // And the row container carries no hand-rolled key handler at all.
    const rowStart = layersSource.indexOf("draggable={renaming !== el.id}");
    const rowEnd = layersSource.indexOf("data-layer-row", rowStart);
    expect(layersSource.slice(rowStart, rowEnd)).not.toMatch(/onKeyDown/);
  });

  it("L-5: exactly ONE separator renders at the hand-frame boundary", () => {
    // The duplicate index === 1 divider is gone…
    expect(toolbarSource).not.toMatch(/index === 1 &&/);
    // …while the grouping separators (before frame, before pen) remain.
    expect(toolbarSource).toMatch(/entry\.id === "frame" \|\| entry\.id === "pen"/);
  });
});
