import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-71 client low batch (S71-A — the nineteenth audit's
// informational riders + the teams-view load seam, deferred #3a/3c/3d).
//
// THE DEFECTS: (A-F7) the teams-view load is DUPLICATED — refresh
// (teams-view.tsx:49-53) and the initial effect (:57-69) paste the same
// fetch body verbatim, the exact pre-S67-D shape the Dashboard closed
// with its ONE load(ignore?) seam. (A-F1) the dead ProjectDTO import
// left by the S70-C type migration (recent-view.tsx:38). (A-F9) the
// dead index param in the toolbar map (toolbar.tsx:54 — unused since
// S57-F removed the duplicate divider). (A-F12) the CanvasThumbnail
// Pick's dead id (project-card.tsx:74 — only backgroundColor is read).
// (A-F8) the Layers-header select/deselect flip condition computed
// TWICE ~10 lines apart (layers-panel.tsx:72-74 and :84-85).

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the teams-view load seam (S71-A / deferred #3a)", () => {
  const teams = src("src/components/teams-view.tsx");

  it("ONE load seam feeds both the initial effect and refresh", () => {
    // THE DEFECT PIN: pre-fix refresh and the effect each carry their own
    // call<{ teams: TeamDTO[] }>("/api/teams") body.
    const loads = teams.match(/call<\{\s*teams:\s*TeamDTO\[\]\s*\}>\("\/api\/teams"\)/g) ?? [];
    expect(loads.length).toBe(1);
    // The Dashboard's exact S67-D form: the useCallback load seam.
    expect(teams).toMatch(/const load = React\.useCallback\(async \(ignore\?: \(\) => boolean\) => \{/);
  });

  it("refresh delegates to load (no duplicated fetch body)", () => {
    // THE DEFECT PIN: pre-fix refresh re-pastes the fetch body.
    expect(teams).toMatch(/refresh\s*=\s*React\.useCallback\(\(\)\s*=>\s*(?:void\s*)?load\(\)/);
  });

  it("the initial effect consumes load with the ignore flag (the docs-approved pattern)", () => {
    // THE PRESERVATION PIN: the ignore-guard discipline survives the
    // dedup (the Dashboard's exact form).
    expect(teams).toMatch(/let ignore = false/);
    expect(teams).toMatch(/load\(/);
  });
});

describe("the S70-C residue + the dead-param riders (S71-A)", () => {
  it("recent-view.tsx carries no dead ProjectDTO import (the S70-C residue)", () => {
    // THE DEFECT PIN: pre-fix the import type { ProjectDTO,
    // ProjectSummaryDTO } specifier is dead in the file.
    const recent = src("src/components/recent-view.tsx");
    expect(recent).not.toMatch(/import type \{[^}]*\bProjectDTO\b[^}]*\}\s*from\s*"@\/lib\/editor"/);
    expect(recent).toMatch(/ProjectSummaryDTO/);
  });

  it("the toolbar map declares no unused index param", () => {
    // THE DEFECT PIN: pre-fix TOOL_META.map((entry, index) => with index
    // unused (dead since S57-F).
    const toolbar = src("src/components/editor/toolbar.tsx");
    expect(toolbar).not.toMatch(/TOOL_META\.map\(\(entry,\s*\w+\)\s*=>/);
    expect(toolbar).toMatch(/TOOL_META\.map\(\(entry\)\s*=>/);
  });

  it("the CanvasThumbnail Pick carries only the read field (no dead id)", () => {
    // THE DEFECT PIN: pre-fix Pick<ProjectDTO, "backgroundColor" | "id">
    // — the id is never read by the thumbnail.
    const card = src("src/components/project-card.tsx");
    expect(card).not.toMatch(/Pick<ProjectDTO,\s*"backgroundColor"\s*\|\s*"id"\s*>/);
    expect(card).toMatch(/Pick<ProjectDTO,\s*"backgroundColor"\s*>/);
  });

  it("the Layers-header flip is declared ONCE and consumed twice (the dedup)", () => {
    // THE DEFECT PIN: pre-fix the allVisibleSelected expression is
    // computed in the onClick (:72-74) AND the label IIFE (:84-85) — the
    // drift hazard class.
    const panel = src("src/components/editor/layers-panel.tsx");
    const declarations = panel.match(/allVisibleSelected\s*=/g) ?? [];
    expect(declarations.length).toBe(1);
    // Both consumers read the hoisted constant (label + handler).
    const consumers = panel.match(/\ballVisibleSelected\b/g) ?? [];
    expect(consumers.length).toBeGreaterThanOrEqual(3);
  });
});
