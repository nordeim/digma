import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-58 Low batch (S58-F — the sixth Mode C audit's
// A-L-1 + A-L-3 + B-L-2 + B-L-6 + B-L-7).
//
// A-L-1: the team card's "Yes, Delete" had no in-flight guard (unlike
//   both project delete dialogs' disabled={deleting} convention) — a
//   double-click fired two DELETEs, the loser 404ing into a spurious
//   destructive toast after a successful delete.
// A-L-3: the Dashboard's onDeleted only filtered the project list —
//   /api/stats was never refetched, so the hero's counts kept the
//   pre-delete values (the create path DOES refresh).
// B-L-2: the reset-password 429 lacked the documented Retry-After header
//   (all five sibling auth routes build the raw envelope with it).
// B-L-6: a dead ternary in the fallback add-shapes reply
//   (`fill… ? "" : ""` — both branches empty). The honest fix REMOVES it
//   (the reply string is the PINNED contract across three test sites).
// B-L-7: Share in Untitled mode copied a projectId-less URL
//   (window.location.href before the first autosave adopts the id) —
//   the recipient opens a fresh empty Untitled editor.

const teamsSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/teams-view.tsx"),
  "utf8",
);
const dashboardSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/dashboard-view.tsx"),
  "utf8",
);
const resetRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/reset-password/route.ts"),
  "utf8",
);
const assistantSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/ai-assistant.ts"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

describe("the session-58 Low batch (S58-F)", () => {
  it("A-L-1: the team delete confirm carries the in-flight disabled guard", () => {
    // The deleting state exists in the TeamCard component…
    expect(teamsSource).toMatch(/const \[deleting, setDeleting\] = React\.useState\(false\);/);
    // …set around the flight (the async deleteTeam)…
    expect(teamsSource).toMatch(/setDeleting\(true\);[\s\S]{0,600}?setDeleting\(false\);/);
    // …and the Yes-Delete button is disabled while in flight.
    expect(teamsSource).toMatch(
      /<Button variant="destructive" size="sm" disabled=\{deleting\} onClick=\{deleteTeam\}>/,
    );
  });

  it("A-L-3: the Dashboard's in-page delete refreshes the stats (not just the list)", () => {
    // Session 78 (S78-G / A-I1) RE-ANCHOR: the two inline onDeleted
    // twins were hoisted into ONE handleDeleted useCallback seam (the
    // drift-hazard fold) — the CONTRACT is unchanged (the delete
    // filters the local list AND refreshes the hero's stats), only the
    // pin's form moved from the inline twin to the seam.
    expect(dashboardSource).toMatch(
      /const handleDeleted = React\.useCallback\(\s*\(id: string\) => \{[\s\S]{0,200}?setProjects\(\(prev\) => prev\.filter\(\(p\) => p\.id !== id\)\);[\s\S]{0,120}?void refresh\(\);/,
    );
    // Both card surfaces consume the seam:
    const consumers = dashboardSource.match(/onDeleted=\{handleDeleted\}/g);
    expect(consumers?.length ?? 0).toBe(2);
  });

  it("B-L-2: the reset-password 429 carries Retry-After (the sibling convention)", () => {
    expect(resetRouteSource).toMatch(/"Retry-After": String\(limit\.retryAfterSeconds\)/);
  });

  it("B-L-6: the dead color ternary is gone from the fallback reply", () => {
    // The constant-foldable dead branch (both sides "") must not return.
    expect(assistantSource).not.toMatch(/\? "" : ""/);
    // …and the pinned reply itself is unchanged (the honest contract).
    expect(assistantSource).toMatch(
      /reply: `Added \$\{count\} \$\{word\}\$\{count > 1 && !word\.endsWith\("s"\) \? "s" : ""\}\.`/,
    );
  });

  it("B-L-7: Share guards the Untitled mode with an honest toast", () => {
    const onShare = viewSource.match(/function onShare\(\) \{[\s\S]*?\n  \}/);
    expect(onShare).not.toBeNull();
    // The empty-store-projectId guard precedes the clipboard write…
    expect(onShare![0]).toMatch(/const store = useEditorStore\.getState\(\);/);
    expect(onShare![0]).toMatch(/if \(!store\.projectId\) \{/);
    // …with the honest unavailable toast (never a copied empty link).
    expect(onShare![0]).toMatch(/Share unavailable/);
    // The clipboard write stays guarded AFTER the early return.
    const guardIdx = onShare![0].indexOf("if (!store.projectId)");
    const clipIdx = onShare![0].indexOf("navigator.clipboard");
    expect(clipIdx).toBeGreaterThan(guardIdx);
  });
});
