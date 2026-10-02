import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The mobile Sheets' lg-crossing close (session 55, S55-B — the
// session-53 audit's deferred finding F-4, edge 2).
//
// Both mobile editor Sheets render their portals at document.body —
// the `lg:hidden` CHIP vanishes at the 1024px boundary, but an OPEN
// Sheet would survive the crossing: the bottom Sheet (with its scrim)
// keeps floating over the desktop editor where the desktop properties
// panel / canvas panel branch is the sanctioned surface (ADR: the
// panel is the surface at lg — the Sheets exist exactly because below
// lg there is no panel).
//
// The fix: each Sheet component gains a matchMedia("(min-width:
// 1024px)") change listener that closes the Sheet when the viewport
// reaches the desktop surface — the app-header bell's
// outside-pointerdown pattern (setState ONLY in the event callback,
// never the effect body; the listener registered only while `open`).
//
// This suite pins the seam as a SOURCE contract (the
// sheet-descriptions pattern); the live crossing behavior (an open
// Sheet actually closing on a 390→1280 viewport change) is pinned by
// tests/e2e/mobile-properties.spec.ts.

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

/** Extract one top-level function's source block by name. */
function functionSource(name: string): string {
  const start = viewSource.indexOf(`function ${name}(`);
  expect(start, `the ${name} component must exist in the editor view`).toBeGreaterThan(-1);
  const rest = viewSource.slice(start + 1);
  const next = rest.indexOf("\nfunction ");
  return next === -1 ? viewSource.slice(start) : viewSource.slice(start, start + 1 + next);
}

describe("the mobile Sheets close on the lg crossing (session 55, S55-B / F-4 edge 2)", () => {
  it("the ELEMENT Sheet closes when the viewport reaches the desktop surface", () => {
    const component = functionSource("MobilePropertiesEditor");
    // The lg boundary listener — the exact media query the chip's
    // lg:hidden respects (1024px, Tailwind's lg).
    expect(component).toMatch(/matchMedia\("\(min-width: 1024px\)"\)/);
    // The app-header bell pattern: the listener is registered in an
    // effect GUARDED BY open (no idle listener while closed) and
    // setOpen(false) fires ONLY in the event callback.
    expect(component).toMatch(/if \(!open\) return;[\s\S]*?matchMedia/);
    expect(component).toMatch(/mq\.matches[\s\S]*?setOpen\(false\)/);
    // Registered/cleaned up as the app-header bell's listener is.
    expect(component).toMatch(/mq\.addEventListener\("change", /);
    expect(component).toMatch(/mq\.removeEventListener\("change", /);
  });

  it("the CANVAS Sheet closes when the viewport reaches the desktop surface", () => {
    const component = functionSource("MobileCanvasProperties");
    expect(component).toMatch(/matchMedia\("\(min-width: 1024px\)"\)/);
    expect(component).toMatch(/if \(!open\) return;[\s\S]*?matchMedia/);
    expect(component).toMatch(/mq\.matches[\s\S]*?setOpen\(false\)/);
    expect(component).toMatch(/mq\.addEventListener\("change", /);
    expect(component).toMatch(/mq\.removeEventListener\("change", /);
  });

  it("exactly two lg-crossing listeners exist (one per Sheet — none smuggled elsewhere)", () => {
    // The count pins that no other editor surface grew a crossing
    // listener and neither Sheet double-registers.
    const count = viewSource.match(/matchMedia\("\(min-width: 1024px\)"\)/g)?.length ?? 0;
    expect(count).toBe(2);
  });
});
