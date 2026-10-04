import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-70 a11y restructure batch (S70-A — the eighteenth audit's
// M-A1 + M-A2, the documented deferred #5).
//
// THE DEFECTS: both the ProjectCard root (project-card.tsx:387-399) and the
// layers row (layers-panel.tsx:157-177) are divs carrying role="button" +
// tabIndex + keyboard handlers with NESTED interactive descendants — the
// rename Input, the Check/X Buttons, the ellipsis Button (card), and the
// eye/lock/trash buttons + the rename input (row). WAI-ARIA prohibits
// interactive descendants inside a button role: AT flattens the inner
// controls into the button's label or misannounces them entirely. The
// reference's own card is a plain div — the clone added the roles
// unilaterally, and the S31-3/S58-B/S59-A stopPropagation/exemption
// wrappers exist BECAUSE of the nesting.
//
// THE FIX: the canonical restructures — the card becomes the
// stretched-button form (a real absolute inset-0 button carrying the open
// action; the content layer pointer-events-none with the interactive
// children opting back in), and the row becomes the button-region form
// (the icon+name area is a real button carrying select + aria-pressed;
// the rename input and the action trio render as siblings).

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the ProjectCard stretched-button restructure (S70-A / M-A1)", () => {
  const card = src("src/components/project-card.tsx");

  it("the card ROOT no longer carries the button role or tabIndex (the WAI-ARIA violation)", () => {
    // THE DEFECT PIN: pre-fix the root div carries role="button" +
    // tabIndex={0} while containing interactive descendants.
    const rootStart = card.indexOf('className="group relative cursor-pointer overflow-hidden rounded-lg');
    expect(rootStart).toBeGreaterThan(-1);
    // The root's own attribute region: up to the first child (the
    // stretched button) — the slice covers exactly the root div's tag.
    const stretchedIdx = card.indexOf('aria-label={`Open ${project.name}`}');
    const rootSlice = card.slice(rootStart, stretchedIdx);
    expect(rootSlice).not.toMatch(/role="button"/);
    expect(rootSlice).not.toMatch(/tabIndex=\{0\}/);
  });

  it("the stretched open button exists with the Open aria-label (the locator family survives)", () => {
    // THE FIX PIN: a real <button> carrying the whole-card open — the
    // [aria-label^='Open '] locator family (4 spec files) survives.
    expect(card).toMatch(/aria-label=\{`Open \$\{project\.name\}`\}/);
    // The stretched layer form: absolute inset-0 inside the relative root.
    expect(card).toMatch(/absolute inset-0/);
    // And it is a real button (type=button), not a div with a role.
    const openIdx = card.indexOf('aria-label={`Open ${project.name}`}');
    const buttonOpen = card.lastIndexOf("<button", openIdx);
    const divOpen = card.lastIndexOf("<div", openIdx);
    expect(buttonOpen).toBeGreaterThan(divOpen);
  });

  it("the content layer is pointer-events-none with the interactive children opting back in", () => {
    // THE FIX PIN: the canonical stretched-button pattern — the content
    // wrapper above the stretched button suppresses pointer events so
    // clicks on non-interactive content fall THROUGH to the open button;
    // the interactive children (rename row, ellipsis) opt back in.
    expect(card).toMatch(/pointer-events-none/);
    expect(card).toMatch(/pointer-events-auto/);
  });

  it("the root no longer carries the hand-rolled Enter/Space onKeyDown (the native button owns it)", () => {
    // THE DEFECT PIN: pre-fix the root's onKeyDown implements the
    // button pattern by hand alongside role="button".
    const rootStart = card.indexOf('className="group relative cursor-pointer overflow-hidden rounded-lg');
    const stretchedIdx = card.indexOf('aria-label={`Open ${project.name}`}');
    const rootSlice = card.slice(rootStart, stretchedIdx);
    expect(rootSlice).not.toMatch(/onKeyDown=\{/);
  });
});

describe("the layers-row button-region restructure (S70-A / M-A2)", () => {
  const panel = src("src/components/editor/layers-panel.tsx");

  it("the layers ROW no longer carries the button role, aria-pressed, or tabIndex", () => {
    // THE DEFECT PIN: pre-fix the row div carries role="button" +
    // aria-pressed + tabIndex={0} while containing the rename input and
    // the eye/lock/trash buttons.
    const rowStart = panel.indexOf("draggable={renaming !== el.id}");
    expect(rowStart).toBeGreaterThan(-1);
    // The row's OWN attribute block: from the drag handlers to the
    // data-layer-row marker (the row's closing tag) — the select button
    // below carries its own aria-pressed, which must NOT be caught here.
    const rowEnd = panel.indexOf("data-layer-row", rowStart);
    expect(rowEnd).toBeGreaterThan(rowStart);
    const rowBlock = panel.slice(rowStart, rowEnd);
    expect(rowBlock).not.toMatch(/role="button"/);
    expect(rowBlock).not.toMatch(/aria-pressed=\{isSelected\}/);
    expect(rowBlock).not.toMatch(/tabIndex=\{0\}/);
  });

  it("the select BUTTON carries aria-pressed + the Layer accessible name (the 23-locator family survives)", () => {
    // THE FIX PIN: a real <button> on the icon+name region carries
    // selection — getByRole("button", { name: "Layer …" }) resolves to it.
    expect(panel).toMatch(/aria-pressed=\{isSelected\}/);
    expect(panel).toMatch(/aria-label=\{`Layer \$\{el\.name \?\? el\.type\}`\}/);
    const labelIdx = panel.indexOf("aria-label={`Layer ${el.name ?? el.type}`}");
    expect(labelIdx).toBeGreaterThan(-1);
    const buttonOpen = panel.lastIndexOf("<button", labelIdx);
    expect(buttonOpen).toBeGreaterThan(-1);
    // The select button's markup sits INSIDE the button tag (the
    // attributes are the button's own, not the row div's).
    const rowStart = panel.indexOf("draggable={renaming !== el.id}");
    expect(labelIdx).toBeGreaterThan(rowStart);
  });

  it("the rename input renders OUTSIDE the select button (the nesting is gone)", () => {
    // THE FIX PIN: pre-fix the rename input renders INSIDE the
    // role="button" row's name slot — the violation. Post-fix it is a
    // sibling of the select button within the row container.
    const renameIdx = panel.indexOf("autoFocus");
    expect(renameIdx).toBeGreaterThan(-1);
    // The select button must CLOSE before the rename input opens (or the
    // rename branch replaces the button entirely as a sibling).
    const labelIdx = panel.indexOf("aria-label={`Layer ${el.name ?? el.type}`}");
    // The rename input appears in the row's conditional branch; assert the
    // input is not nested inside the button by checking the button's
    // closing tag precedes the input's opening tag in the same row region.
    const rowStart = panel.indexOf("draggable={renaming !== el.id}");
    const rowEnd = panel.indexOf('aria-label={`Delete layer', rowStart);
    const rowBlock = panel.slice(rowStart, rowEnd);
    const buttonMatch = rowBlock.match(/<button[^>]*aria-pressed=\{isSelected\}[\s\S]*?<\/button>/);
    expect(buttonMatch).not.toBeNull();
    // The rename input must NOT appear inside the matched select button.
    expect(buttonMatch![0]).not.toMatch(/autoFocus/);
  });

  it("the S59-A nested-exemption keydown is gone (structurally unnecessary post-fix)", () => {
    // THE FIX PIN: pre-fix the row's onKeyDown carries the S59-A
    // closest("button, input") exemption — a compensating workaround that
    // exists BECAUSE interactive children nest inside the role="button"
    // row. Post-fix the row has no keyboard handler at all (the native
    // button + the native action buttons own their activation).
    const rowStart = panel.indexOf("draggable={renaming !== el.id}");
    const rowEnd = panel.indexOf("data-layer-row", rowStart);
    const rowBlock = panel.slice(rowStart, rowEnd);
    expect(rowBlock).not.toMatch(/onKeyDown=\{/);
    // The exemption helper itself no longer guards a row keydown (the
    // refined dblclick guard below carries its own selector).
    expect(rowBlock).not.toMatch(/closest\("button, input"\)/);
  });

  it("the S61-D dblclick rename guard survives in its refined form (the rapid-toggle steal stays closed)", () => {
    // THE MIGRATED PIN: the dblclick rename entry keeps the S61-D
    // nested-control guard, REFINED for the restructure — the action trio
    // is scoped by its data-layer-action wrapper, the rename input by its
    // tag, and the select button (the row's primary surface) is EXEMPT so
    // a double-click on the name still opens the rename (the reference's
    // measured contract). Pre-fix the guard read closest("button, input")
    // — the blanket form that the structure made wrong.
    expect(panel).toMatch(/onDoubleClick=\{/);
    const dblIdx = panel.indexOf("onDoubleClick={(event) => {");
    const guardSlice = panel.slice(dblIdx, dblIdx + 1600);
    expect(guardSlice).toMatch(/closest\("\[data-layer-action\], input"\)/);
    // The action wrapper carries the marker the guard scopes on.
    expect(panel).toMatch(/<div className="flex items-center gap-1" data-layer-action>/);
  });

  it("the row's drag-reorder handlers stay on the container (the session-21 stateless contract)", () => {
    // THE PRESERVATION PIN: the drop-time insertion index computation —
    // onDragStart/onDragOver/onDrop remain on the row container.
    expect(panel).toMatch(/draggable=\{renaming !== el\.id\}/);
    expect(panel).toMatch(/onDrop=\{\(event\) => \{/);
    expect(panel).toMatch(/reorderElements/);
  });
});
