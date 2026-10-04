import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The ellipsis keyboard stand-down (session 58, S58-B — the sixth Mode C
// audit's A-M-2).
//
// The project card's root was a role="button" div whose onKeyDown fired
// openProject() for any Enter/Space bubbling from descendants. The
// ellipsis-menu wrapper stopped CLICK only — unlike its two sibling seams
// (the rename row and the delete dialog) which stop click AND keydown.
// Radix's DropdownMenuTrigger/MenuItem keydown handlers never
// stopPropagation, so focusing the ellipsis and pressing Enter both
// toggled the menu AND navigated to /Editor?projectId=…, unmounting the
// menu (the portaled menu items bubble through the React tree — the
// documented S31-3 mechanism). Keyboard users could not Rename/Delete
// from any grid card.
//
// The fix: the ellipsis wrapper gains the file's own established
// convention — onKeyDown stopPropagation beside the onClick stop.

const cardSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/project-card.tsx"),
  "utf8",
);

describe("the ellipsis keyboard stand-down (session 58, S58-B / A-M-2)", () => {
  it("THREE interactive wrapper seams stop BOTH click and keydown (the file's convention)", () => {
    const stops = cardSource.match(/onClick=\{\(event\) => event\.stopPropagation\(\)\}/g) ?? [];
    const keyStops = cardSource.match(/onKeyDown=\{\(event\) => event\.stopPropagation\(\)\}/g) ?? [];
    // The rename row, the delete dialog, AND the ellipsis wrapper — every
    // click-stopping seam now stops the keydown too (nothing new may stop
    // click alone).
    expect(stops.length).toBeGreaterThanOrEqual(3);
    expect(keyStops.length).toBe(stops.length);
  });

  it("the ellipsis wrapper pairs its click stop with a keydown stop", () => {
    // The ellipsis wrapper: the div wrapping the DropdownMenu (the
    // aria-label="More options for …" trigger inside).
    // Session 70 (S70-A) contract re-anchor: the stretched-button
    // restructure gave the wrapper a className (pointer-events-auto) —
    // the click+keydown stop PAIRING is pinned unchanged.
    expect(cardSource).toMatch(
      /<div\s+className="pointer-events-auto"\s+onClick=\{\(event\) => event\.stopPropagation\(\)\}\s+onKeyDown=\{\(event\) => event\.stopPropagation\(\)\}\s*>\s*<DropdownMenu>/,
    );
  });

  it("the card still activates on Enter/Space (the keyboard open contract preserved)", () => {
    // Session 70 (S70-A) contract re-anchor: the hand-rolled root
    // onKeyDown is gone — the STRETCHED BUTTON owns the open, and a real
    // <button> activates on Enter/Space natively (the behavioral
    // contract is pinned unchanged; the e2e keyboard-open pin
    // (session70-fixes.spec.ts) exercises it live).
    expect(cardSource).toMatch(/<button\s+type="button"\s+aria-label=\{`Open \$\{project\.name\}`\}\s+onClick=\{\(\) => void openProject\(\)\}/);
    expect(cardSource).toMatch(/onClick=\{\(\) => void openProject\(\)\}/);
    // And the root carries no button ROLE or tabIndex (the violation the
    // restructure closed — the rename input's own Enter-to-commit handler
    // is legitimate and untouched).
    const rootStart = cardSource.indexOf('className="group relative cursor-pointer overflow-hidden rounded-lg');
    const rootSlice = cardSource.slice(rootStart, rootStart + 300);
    expect(rootSlice).not.toMatch(/role="button"/);
    expect(rootSlice).not.toMatch(/tabIndex=/);
  });
});
