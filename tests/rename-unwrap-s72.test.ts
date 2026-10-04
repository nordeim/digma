import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-72 rename-unwrap regression (S72-A — the twentieth audit's
// headline finding, surfaced by the baseline e2e gate).
//
// THE DEFECT: the S71-A migration moved InlineProjectRename.commit() onto
// the ONE call() seam but LOST the `.project` unwrap — the pre-migration
// hand-rolled form read `body.data.project as ProjectSummaryDTO`, while
// `call()` returns `body.data` itself, and the PATCH route answers
// `ok({ project })`. So `renamed` is the WRAPPER `{ project: {...} }`
// typed as the project; `onRenamed(renamed)` hands it to every
// consumer's `prev.map((p) => (p.id === updated.id ? updated : p))` —
// `updated.id` is undefined, nothing matches, and the card title NEVER
// updates after a successful rename (the S58-A stale-name defect
// reintroduced in a new form; the server-side rename persists, so a
// reload shows the new name — the immediate UI update is what died).
// Empirically: tests/e2e/session58-fixes.spec.ts's rename pin fails
// DETERMINISTICALLY on the pre-fix build (PATCH 200 + the correct DTO in
// the trace; the h3 keeps the old name; the grouped-run cascade — the
// rename-back cleanup never runs, so later specs read the mutated seeded
// name — accounts for 7 more failures that all pass in isolation).

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the rename unwrap contract (S72-A / the headline regression)", () => {
  const card = src("src/components/project-card.tsx");

  it("InlineProjectRename types the PATCH call as the route's actual envelope payload", () => {
    // THE DEFECT PIN: pre-fix the call site declares
    // call<ProjectSummaryDTO>(...) — but the route answers ok({ project }),
    // so body.data is the { project } wrapper, not the project.
    const renameStart = card.indexOf("async function commit()");
    const callIdx = card.indexOf("call<", renameStart);
    expect(callIdx).toBeGreaterThan(-1);
    const callSite = card.slice(callIdx, callIdx + 120);
    expect(callSite.startsWith("call<{ project: ProjectSummaryDTO }>")).toBe(true);
  });

  it("the unwrap happens BEFORE onRenamed (the wrapper never crosses the callback boundary)", () => {
    // THE DEFECT PIN: pre-fix `onRenamed(renamed)` passes the wrapper —
    // the consumer's p.id === updated.id compare never matches.
    const renameStart = card.indexOf("async function commit()");
    const renameEnd = card.indexOf("export function InlineProjectRename", renameStart) === -1
      ? card.indexOf("return (", renameStart)
      : card.indexOf("export function InlineProjectRename", renameStart);
    const commitBody = card.slice(renameStart, renameEnd);
    expect(commitBody).toMatch(/onRenamed\(\s*renamed\.project\s*\)/);
    // The wrapper itself is never handed over.
    expect(commitBody).not.toMatch(/onRenamed\(\s*renamed\s*\)/);
  });

  it("the guard reads the unwrapped member (renamed?.project — a null wrapper degrades to no-op, never a crash)", () => {
    // THE PRESERVATION PIN: the seam's null contract — a failed PATCH
    // (null) skips the success path; the unwrap keeps the same shape.
    const renameStart = card.indexOf("async function commit()");
    const commitBody = card.slice(renameStart, renameStart + 1600);
    expect(commitBody).toMatch(/if\s*\(\s*renamed\?\.project\s*\)/);
  });

  it("the three consumers keep the id-matched replace (the healed contract)", () => {
    // THE PRESERVATION PIN: the consumers' setProjects(prev.map(...))
    // form is correct — the defect lived entirely in the unwrap.
    const recent = src("src/components/recent-view.tsx");
    const dashboard = src("src/components/dashboard-view.tsx");
    const replaceForm = /onRenamed=\{\(updated\) =>\s*\n?\s*setProjects\(\(prev\) => prev\.map\(\(p\) => \(p\.id === updated\.id \? updated : p\)\)\)/g;
    expect(recent.match(replaceForm)?.length).toBe(2); // the grid + the list card
    // The Dashboard's cards refresh the whole list (the S67-D load seam
    // re-derives everything — a different, equally-healed consumer).
    expect(dashboard.match(/onRenamed=\{\(\) => refresh\(\)\}/g)?.length).toBe(2);
  });

  it("the DELETE call sites annotate the route's actual payload (honest by type)", () => {
    // THE DEFECT PIN (the rider): pre-fix both DELETE sites annotate
    // call<{ project: { id: string } }> — the route answers ok({ deleted:
    // true }) — works by truthiness, lies by type (a future edit reading
    // data.project.id would crash at runtime past the type gate).
    const recent = src("src/components/recent-view.tsx");
    const cardDeleteIdx = card.indexOf('call<', card.indexOf("async function deleteProject"));
    expect(card.slice(cardDeleteIdx, cardDeleteIdx + 60)).toContain("call<{ deleted: boolean }>");
    const recentDeleteIdx = recent.indexOf("call<", recent.indexOf("async function deleteProject"));
    expect(recent.slice(recentDeleteIdx, recentDeleteIdx + 60)).toContain("call<{ deleted: boolean }>");
    // The dishonest annotations are gone.
    expect(card).not.toMatch(/call<\{ project: \{ id: string \} \}>/);
    expect(recent).not.toMatch(/call<\{ project: \{ id: string \} \}>/);
  });
});
