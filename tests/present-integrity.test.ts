import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Present-mode integrity (session 56, S56-D — the Mode C audit's M-3 + L-4).
//
// M-3: the editor's global shortcut guard matches only
// `[role="dialog"][data-state="open"]` (Radix), and the hand-rolled
// PresentOverlay carried `role="dialog"` with NO data-state — so while
// presenting, Delete deleted the (invisible) selection, tool keys
// switched tools, and `?` opened the shortcuts dialog over the
// presentation. The fix: the overlay's dialog div carries
// data-state="open" — the EXISTING guard then covers it (the minimal
// one-attribute fix; no second guard path).
//
// L-4: the overlay declares aria-modal="true" but Tab could escape into
// the background content (one focusable inside, no trap). The fix: a Tab
// keydown loop that keeps focus on the exit affordance — honoring the
// aria-modal contract.

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

describe("present-mode integrity (session 56, S56-D / M-3 + L-4)", () => {
  it("the overlay's dialog carries data-state=open — the stand-down guard covers it", () => {
    const overlay = functionSource("PresentOverlay");
    // The dialog element carries BOTH the role and the Radix-style state
    // attribute the global guard matches.
    expect(overlay).toMatch(/role="dialog"/);
    expect(overlay).toMatch(/data-state="open"/);
  });

  it("Tab stays trapped on the exit affordance (the aria-modal contract)", () => {
    const overlay = functionSource("PresentOverlay");
    // The keydown effect handles Tab and routes focus to the exit button
    // (the single focusable) — a minimal loop honoring aria-modal.
    expect(overlay).toMatch(/event\.key === "Tab"/);
    expect(overlay).toMatch(/event\.preventDefault\(\);[\s\S]{0,120}exitRef\.current\?\.focus\(\)/);
  });

  it("the overlay's own Escape exit survives (the dialog state does not double-route)", () => {
    const overlay = functionSource("PresentOverlay");
    expect(overlay).toMatch(/event\.key === "Escape"/);
    expect(overlay).toMatch(/onExit\(\)/);
  });
});
