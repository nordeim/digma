import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The dashboard phantom-scroll fix (session 61, S61-G — the ninth Mode
// C audit's B-L-1).
//
// <main className="min-h-[calc(100vh-4rem)]"> wrapped <div
// className="min-h-screen bg-gradient-to-br …"> — the inner min-h-screen
// (100vh) defeated the outer calc, so with the in-flow sticky 4rem
// header the page was always >= 104vh tall: a permanent ~64px phantom
// scroll even with an empty dashboard. Recent/Teams correctly use only
// the calc with no inner min-h-screen.
//
// The fix moves the gradient onto the main element and drops the inner
// min-h-screen: the page is exactly 100vh with the header, and the
// gradient still paints the full viewport.

const dashSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/dashboard-view.tsx"),
  "utf8",
);

describe("the dashboard phantom-scroll fix (session 61, S61-G / B-L-1)", () => {
  it("the main element carries the gradient AND the viewport calc", () => {
    // THE DEFECT PIN: pre-fix the main carried only the calc — the
    // gradient lived on an inner min-h-screen div that overrode it.
    expect(dashSource).toContain(
      '<main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-white to-purple-50">',
    );
  });

  it("no inner min-h-screen div defeats the calc (the ~64px phantom scroll is gone)", () => {
    // THE DEFECT PIN: pre-fix the first inner div was
    // "min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50".
    expect(dashSource).not.toContain('className="min-h-screen bg-gradient-to-br');
    // The reset-password page keeps its own min-h-screen (a different
    // surface, pinned by reset-password.spec.ts:38) — nothing here
    // touches it.
  });
});
