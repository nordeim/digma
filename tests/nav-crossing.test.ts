import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The nav drawer's md-crossing close + the bell Escape (session 56,
// S56-I — this session's own audit finding N-1 + the audit's L-5).
//
// N-1: the two editor Sheets got the lg-crossing close in session 55
// (S55-B), but the mobile NAV drawer has the SAME structural defect at
// the md boundary — its trigger is md:hidden (vanishes at 768) while the
// Sheet's portal renders at document.body, so an OPEN drawer survived
// the crossing floating over the desktop layout where the desktop nav is
// the sanctioned surface. The fix is the S55-B pattern at 768: a
// matchMedia("(min-width: 768px)") change listener, registered only
// while open, setOpen(false) only in the event callback.
//
// L-5: the bell popover carries role="dialog" with no Escape-close — a
// keyboard user could not dismiss it (pointerdown-outside works only for
// pointers). The fix: an Escape keydown listener while open, the same
// guarded-effect pattern as the outside-pointerdown handler.

const headerSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/app-header.tsx"),
  "utf8",
);

/** Extract one top-level function's source block by name. */
function functionSource(name: string): string {
  const start = headerSource.indexOf(`function ${name}(`);
  expect(start, `the ${name} component must exist in the app header`).toBeGreaterThan(-1);
  const rest = headerSource.slice(start + 1);
  const next = rest.indexOf("\nfunction ");
  return next === -1 ? headerSource.slice(start) : headerSource.slice(start, start + 1 + next);
}

describe("the nav drawer's md-crossing close (session 56, S56-I / N-1)", () => {
  it("the MobileNav drawer closes on the 768 crossing (the S55-B pattern at md)", () => {
    const nav = functionSource("MobileNav");
    // The md boundary listener — the exact media query the trigger's
    // md:hidden respects (768px, Tailwind's md).
    expect(nav).toMatch(/matchMedia\("\(min-width: 768px\)"\)/);
    // The guarded-effect pattern: registered only while open, setOpen
    // only in the event callback.
    expect(nav).toMatch(/if \(!open\) return;[\s\S]*?matchMedia/);
    expect(nav).toMatch(/function toDesktop\(\) \{\s*if \(mq\.matches\) setOpen\(false\);\s*\}/);
  });
});

describe("the bell popover's Escape close (session 56, S56-I / L-5)", () => {
  it("an Escape keydown listener closes the popover while it is open", () => {
    const header = functionSource("AppHeader");
    expect(header).toMatch(/if \(!bellOpen\) return;[\s\S]*?addEventListener\("keydown", onBellKey\)/);
    expect(header).toMatch(/event\.key === "Escape"[\s\S]{0,80}setBellOpen\(false\)/);
  });
});
