import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The ellipsis keyboard stand-down (session 58, S58-B — the sixth Mode C
// audit's A-M-2).
//
// The project card's root is a role="button" div whose onKeyDown fires
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
    const ellipsis = cardSource.match(
      /<div\s+onClick=\{\(event\) => event\.stopPropagation\(\)\}[\s\S]{0,200}?<DropdownMenu>/,
    );
    expect(ellipsis).not.toBeNull();
    expect(cardSource).toMatch(
      /<div\s+onClick=\{\(event\) => event\.stopPropagation\(\)\}\s+onKeyDown=\{\(event\) => event\.stopPropagation\(\)\}\s*>\s*<DropdownMenu>/,
    );
  });

  it("the card root still activates on Enter/Space (the keyboard open contract preserved)", () => {
    expect(cardSource).toMatch(
      /onKeyDown=\{\(event\) => \{\s*if \(event\.key === "Enter" \|\| event\.key === " "\) \{\s*event\.preventDefault\(\);\s*void openProject\(\);/,
    );
  });
});
