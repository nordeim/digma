import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-75 client low batch (S75-E + the client half of S75-G —
// the twenty-third audit's deferred-queue #1 + A75-F2 + A75-F5).
//
// S75-E — THE DEFECT: editor-view.tsx mounts LayersPanel,
// ComponentsPanel, and PropertiesPanel whenever the store says open —
// the wrappers are CSS-hidden below md/lg (`hidden … md:flex` /
// `hidden … lg:flex`) but the trees are FULLY MOUNTED and subscribed
// to `elements`, so every drag tick re-renders two invisible trees
// (LayersPanel maps all N rows; PropertiesPanel rebuilds its section
// stack). The chips that toggle them are themselves hidden below
// md/lg, so a media-gated mount changes ZERO UI — the cheapest real
// perf win on the mobile surface.
//
// THE FIX: the useMediaQuery(query) hook (useSyncExternalStore with a
// desktop-first getServerSnapshot — the SSR output is unchanged and
// below-md hydration unmounts the CSS-invisible panels without a
// mismatch) + the three gated mounts.
//
// A75-F2 — the dead memberColorFor import in project-card.tsx (zero
// usages in the file — the S63-G/S71-A dead-code family residue).
//
// A75-F5 — the date-guard family's sort sibling: sortProjects'
// comparators produce NaN on a corrupt timestamp (sort treats NaN as
// 0 → implementation-defined placement); the guard pins corrupt rows
// deterministically.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the useMediaQuery hook (S75-E)", () => {
  it("the hook exists as the useSyncExternalStore form (never useState/useEffect)", () => {
    // THE DEFECT PIN: pre-fix no hook exists — the panels mount
    // unconditionally below the breakpoints.
    expect(existsSync(path.join(ROOT, "src", "hooks", "use-media-query.ts"))).toBe(true);
    const hook = src("src/hooks/use-media-query.ts");
    expect(hook).toMatch(/useSyncExternalStore/);
    // The CLAUDE.md external-store rule: never useState/useEffect for
    // external stores.
    expect(hook).not.toMatch(/useState/);
    expect(hook).not.toMatch(/useEffect/);
    // The desktop-first server snapshot: getServerSnapshot returns true
    // (the SSR output keeps the panels — they are CSS-hidden below md
    // anyway, so there is no visual change and no hydration mismatch:
    // useSyncExternalStore owns the server/client difference).
    expect(hook).toMatch(/getServerSnapshot|=>[\s\S]{0,12}true/);
  });

  it("the hook registers the matchMedia change listener and unsubscribes on teardown", () => {
    const hook = src("src/hooks/use-media-query.ts");
    expect(hook).toMatch(/addEventListener\(\s*"change"/);
    expect(hook).toMatch(/removeEventListener\(\s*"change"/);
  });
});

describe("the three panel mounts gate on the media queries (S75-E)", () => {
  it("LayersPanel and ComponentsPanel mount only at md+ (panels.X && isMd)", () => {
    const view = src("src/components/editor/editor-view.tsx");
    // THE DEFECT PIN: pre-fix the mounts read `panels.layers &&`
    // alone — the invisible trees re-rendered on every drag tick below
    // md.
    expect(view).toMatch(/panels\.layers && isMd/);
    expect(view).toMatch(/panels\.components && isMd/);
    // The wrapper classes survive as the SSR belt (hidden md:flex).
    expect(view).toMatch(/hidden w-60[\s\S]{0,120}md:flex/);
  });

  it("PropertiesPanel mounts only at lg+ (panels.properties && isLg)", () => {
    const view = src("src/components/editor/editor-view.tsx");
    expect(view).toMatch(/panels\.properties && isLg/);
    expect(view).toMatch(/hidden w-72[\s\S]{0,80}lg:flex/);
  });

  it("the editor consumes the hook for both breakpoints", () => {
    const view = src("src/components/editor/editor-view.tsx");
    expect(view).toMatch(/useMediaQuery\(\s*"\(min-width: 768px\)"/);
    expect(view).toMatch(/useMediaQuery\(\s*"\(min-width: 1024px\)"/);
  });
});

describe("the dead memberColorFor import is gone (S75-G / A75-F2)", () => {
  it("project-card.tsx no longer imports memberColorFor (zero usages)", () => {
    // THE DEFECT PIN: pre-fix the import rides the file with zero
    // in-file usages (the real consumers are teams-view + the team
    // routes).
    const card = src("src/components/project-card.tsx");
    expect(card).not.toMatch(/memberColorFor/);
    // The real consumers keep it (the preservation pin).
    const teams = src("src/components/teams-view.tsx");
    expect(teams).toMatch(/memberColorFor/);
  });
});

describe("the sortProjects corrupt-date guard (S75-G / A75-F5)", () => {
  it("the date comparators guard NaN (the date-guard family's sort sibling)", () => {
    // THE DEFECT PIN: pre-fix the comparators produce NaN on a corrupt
    // timestamp — sort treats it as 0 and the row lands in
    // implementation-defined positions.
    const recent = src("src/components/recent-view.tsx");
    expect(recent).toMatch(/function sortProjects[\s\S]{0,2000}(Number\.isNaN|corrupt)/i);
    // The three render-site guards survive (the S74-C preservation
    // pin).
    expect(recent).toMatch(/Number\.isNaN/);
    const card = src("src/components/project-card.tsx");
    expect(card).toMatch(/Number\.isNaN/);
    const dash = src("src/components/dashboard-view.tsx");
    expect(dash).toMatch(/Number\.isNaN/);
  });
});
