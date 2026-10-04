import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-74 client low batch (S74-B + S74-C — the twenty-second
// audit's A74-L2 + A74-L3).
//
// S74-B / A74-L2 — THE DEFECT: the S73-H Set-membership fix closed only
// the canvas. The properties panel's selected filter
// (properties-panel.tsx:1462 — `elements.filter((el) =>
// selectedIds.includes(el.id))`) and the layers panel's Select-All flip
// (layers-panel.tsx:45-46 — `visible.every((el) =>
// selectedIds.includes(el.id))`) still run the O(n·m) array scans on
// EVERY drag tick — both panels subscribe to `elements`, so every
// moveElements commit re-renders them through the full includes() scan
// (the same ~4M-membership worst case at ELEMENT_LIMIT that A-F5 cited
// when it converted the canvas).
//
// S74-C / A74-L3 — THE DEFECT: the S73-H corrupt-date guard landed on 1
// of 3 date-formatting sites. project-card.tsx carries the NaN guard;
// recent-view.tsx's openedLabel ("Sep 30, 2026" — RA-48) and
// dashboard-view.tsx's list-row date (toLocaleDateString()) still render
// "Invalid Date" on a corrupt lastOpenedAt.
//
// THE FIX: the two panel siblings join the canvas's Set form; the two
// date sites join the card's Number.isNaN guard (each keeping its own
// measured format — the GUARD is the shared part, the formats are
// pinned per-site by RA-48).

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the Set membership at the two panel siblings (S74-B)", () => {
  it("the properties panel's selected filter runs through a Set (no includes() scan)", () => {
    // THE DEFECT PIN: pre-fix the filter is
    // elements.filter((el) => selectedIds.includes(el.id)) — the
    // O(n·m) form on every elements-subscribed re-render.
    const panel = src("src/components/editor/properties-panel.tsx");
    expect(panel).toMatch(
      /const selected = elements\.filter\(\(el\) => selectedIdSet\.has\(el\.id\)\);/,
    );
    expect(panel).not.toMatch(
      /const selected = elements\.filter\(\(el\) => selectedIds\.includes\(el\.id\)\);/,
    );
  });

  it("the properties panel builds the Set it consumes", () => {
    const panel = src("src/components/editor/properties-panel.tsx");
    expect(panel).toMatch(/new Set\(selectedIds\)/);
  });

  it("the layers panel's Select-All flip runs through the Set (the visible.every form)", () => {
    // THE DEFECT PIN: pre-fix the flip is
    // visible.every((el) => selectedIds.includes(el.id)) — the layers
    // panel ALREADY builds selectedSet at its top (the row checks'
    // own seam); the flip just never consumed it.
    const layers = src("src/components/editor/layers-panel.tsx");
    expect(layers).toMatch(
      /visible\.every\(\(el\) => selectedSet\.has\(el\.id\)\)/,
    );
    expect(layers).not.toMatch(
      /visible\.every\(\(el\) => selectedIds\.includes\(el\.id\)\)/,
    );
  });

  it("the canvas keeps its S73-H Set form (the preservation pin)", () => {
    expect(src("src/components/editor/canvas.tsx")).toMatch(
      /const selectedIdSet = React\.useMemo\(\(\) => new Set\(selectedIds\), \[selectedIds\]\);/,
    );
  });
});

describe("the corrupt-date guard at the two remaining sites (S74-C)", () => {
  it("recent-view's openedLabel guards the NaN timestamp (the card's own form)", () => {
    // THE DEFECT PIN: pre-fix the label formats unconditionally — a
    // corrupt lastOpenedAt renders "Invalid Date" in the list card.
    const recent = src("src/components/recent-view.tsx");
    expect(recent).toMatch(/Number\.isNaN\(opened\.getTime\(\)\)/);
    expect(recent).toMatch(
      /const opened = new Date\(project\.lastOpenedAt\);/,
    );
  });

  it("dashboard-view's list-row date guards the NaN timestamp", () => {
    const dash = src("src/components/dashboard-view.tsx");
    expect(dash).toMatch(/Number\.isNaN\(.*\.getTime\(\)\)/);
  });

  it("the three sites keep their DISTINCT measured formats (the RA-48 preservation pin)", () => {
    // The card: "Opened Sep 30" (month short, day). The list: "Sep 30,
    // 2026" (month short, day, YEAR). The Dashboard row: the locale
    // default. The GUARD is shared; the formats stay per-site.
    expect(src("src/components/project-card.tsx")).toMatch(
      /month: "short", day: "numeric"\s*\}\)/,
    );
    expect(src("src/components/recent-view.tsx")).toMatch(
      /month: "short",\s*day: "numeric",\s*year: "numeric",/,
    );
  });
});
