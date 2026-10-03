import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-67 client Low batch (S67-D — the fifteenth audit's
// auditor-A findings A-L-1 + A-L-2 + the Info-1 coverage gap).
//
// THE DEFECTS: (A-L-1) the Dashboard's list view renders its bordered
// list container UNCONDITIONALLY while the empty-state message is a
// separately gated block below — with an empty filtered list the page
// shows a 2px rounded gray hairline above "No projects match". The
// Recent view gates correctly (both view branches inside
// `visible.length > 0`) — a local inconsistency. (A-L-2) the
// DashboardView duplicates its Promise.all([projects, stats]) fetch
// body verbatim in `refresh` and the initial effect. (Info-1) no e2e
// drives the Dashboard's list toggle or its empty states at all —
// A-L-1 survived three audits inside that gap.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

// ---------------------------------------------------------------------------
// The list-view empty-state gating (A-L-1)
// ---------------------------------------------------------------------------
describe("the Dashboard's list container gates on a non-empty list (S67-D / A-L-1)", () => {
  it("the bordered list container renders only when filtered.length > 0", () => {
    // THE DEFECT PIN: pre-fix the container is an unconditional
    // branch (`) : (` — the grid/list ternary closes on the container
    // with no emptiness guard), rendering with zero children above
    // the separately-gated empty state.
    const source = src("src/components/dashboard-view.tsx");
    expect(source).toMatch(
      /filtered\.length > 0\s*\?\s*\(\s*<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">/,
    );
  });

  it("the empty-state message still renders for BOTH the empty grid and the empty list (preservation)", () => {
    const source = src("src/components/dashboard-view.tsx");
    expect(source).toMatch(/!loading && filtered\.length === 0/);
    expect(source).toMatch(/No projects match/);
    expect(source).toMatch(/No projects yet/);
  });

  it("the Recent view's standing gating survives (preservation)", () => {
    const source = src("src/components/recent-view.tsx");
    expect(source).toMatch(/visible\.length > 0/);
  });
});

// ---------------------------------------------------------------------------
// The shared load seam (A-L-2)
// ---------------------------------------------------------------------------
describe("the DashboardView fetch body is shared (S67-D / A-L-2)", () => {
  it("ONE load() seam feeds both refresh and the initial effect — no duplicated Promise.all", () => {
    // THE DEFECT PIN: pre-fix the Promise.all([call("/api/projects"),
    // call("/api/stats")]) fetch appears verbatim TWICE.
    const source = src("src/components/dashboard-view.tsx");
    const occurrences = source.match(/Promise\.all\(\[\s*call<\{ projects: ProjectDTO\[\] }>\("\/api\/projects"\),/g) ?? [];
    expect(occurrences.length).toBe(1);
    expect(source).toMatch(/const load = React\.useCallback/);
    // the effect consumes the seam (the ignore-guard stays — the
    // docs-approved effect pattern)
    expect(source).toMatch(/ignore = false/);
  });
});
