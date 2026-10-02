import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The Recent grid rename staleness (session 58, S58-A — the sixth Mode C
// audit's A-M-1).
//
// The Recent page's GRID branch (the DEFAULT view) wired
// `onRenamed={() => setProjects(prev => prev.map(p => p.id === project.id
// ? project : p))}` — ignoring the fresh DTO that ProjectCard passes (the
// PATCH response's updated project) and re-inserting the STALE pre-rename
// closure object. The card title showed the OLD name immediately after a
// successful rename + "Project renamed" toast until a reload. The LIST
// branch does it correctly (it consumes the `updated` arg); the Dashboard
// refetches — only the grid was broken.
//
// The fix: the grid branch adopts the updated DTO — matching the list
// branch exactly.

const recentSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/recent-view.tsx"),
  "utf8",
);

// The grid branch's ProjectCard block: from the grid container to the
// first ProjectCard's closing (the onRenamed/onDeleted props).
const gridBlock = recentSource.match(
  /view === "grid" \? \(\s*<div className="grid[\s\S]{0,900}?\/>/,
);
// The list branch's RecentListCard block for the preservation pin (the
// grid ternary's else arm).
const listBlock = recentSource.match(
  /<div className="space-y-2">[\s\S]{0,1200}?onRenamed=\{\(updated\)[\s\S]{0,300}?\/>/,
);

describe("the Recent grid rename staleness (session 58, S58-A / A-M-1)", () => {
  it("the GRID branch's onRenamed consumes the UPDATED DTO (not the stale closure project)", () => {
    expect(gridBlock).not.toBeNull();
    const onRenamed = gridBlock![0].match(/onRenamed=\{\((.*?)\) =>/);
    expect(onRenamed).not.toBeNull();
    expect(onRenamed![1]).toBe("updated");
    // The map keys off the updated DTO's id and inserts the updated row.
    expect(gridBlock![0]).toMatch(/p\.id === updated\.id \? updated : p/);
    // The stale closure form must NOT drive the grid branch.
    expect(gridBlock![0]).not.toMatch(/p\.id === project\.id \? project : p/);
  });

  it("the LIST branch keeps its correct updated-arg contract (the preservation pin)", () => {
    expect(listBlock).not.toBeNull();
    expect(listBlock![0]).toMatch(/p\.id === updated\.id \? updated : p/);
  });
});
