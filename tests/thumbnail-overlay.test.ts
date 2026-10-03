import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session 63 (S63-A / A-H1 — the eleventh audit's HIGH): every grid
// project-card thumbnail rendered as a SOLID BLACK RECTANGLE. The overlay
// div carried the v3 opacity utilities `bg-black bg-opacity-0 …
// group-hover:bg-opacity-10` — Tailwind v4 REMOVED the `*-opacity-*`
// utilities (the nextjs16-tailwind4 skill's own migration table:
// `bg-opacity-50` → `bg-color/50`), so `.bg-black` painted OPAQUE BLACK
// with no transparency at all, covering the CanvasThumbnail on every
// Dashboard "Continue Working"/"All Projects" and Recent grid card since
// the first commit (verified against the production build: the class
// string ships in the JS chunk, the built CSS has ZERO bg-opacity
// selectors, and a pixel probe of the shipped dashboard screenshot shows
// the thumbnail regions solid (0,0,0)). The fix is the v4 modifier form:
// `bg-black/0 … group-hover:bg-black/10`.

const cardSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/project-card.tsx"),
  "utf8",
);

// The whole src tree — the sweep pin guards EVERY component, not just
// the card (a future v3-style opacity utility anywhere ships dead).
const SRC_ROOT = path.resolve(import.meta.dirname, "../src");

function collectFiles(dir: string): string[] {
  const out: string[] = [];
  const entries = readdirSyncSafe(dir);
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if (statSyncSafe(full)?.isDirectory()) out.push(...collectFiles(full));
    else if (/\.(tsx?|css)$/.test(entry)) out.push(full);
  }
  return out;
}

import { readdirSync, statSync } from "node:fs";
function readdirSyncSafe(dir: string): string[] {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}
function statSyncSafe(full: string) {
  try {
    return statSync(full);
  } catch {
    return undefined;
  }
}

describe("the v4 thumbnail-overlay fix (session 63, S63-A / A-H1)", () => {
  it("no v3 opacity utility ships anywhere in src/ (they are dead classes in the v4 build)", () => {
    // THE DEFECT PIN: pre-fix, project-card.tsx carried `bg-opacity-0`
    // and `group-hover:bg-opacity-10` — v4 emits ZERO `bg-opacity`
    // selectors, so the utilities were silently dead.
    const offenders: string[] = [];
    for (const file of collectFiles(SRC_ROOT)) {
      const text = readFileSync(file, "utf8");
      if (/bg-opacity-|text-opacity-|border-opacity-|divide-opacity-|placeholder-opacity-/.test(text)) {
        offenders.push(path.relative(SRC_ROOT, file));
      }
    }
    expect(offenders).toEqual([]);
  });

  it("the card overlay uses the v4 opacity-modifier form (transparent at rest, 10% on hover)", () => {
    // The fix form: bg-black/0 + group-hover:bg-black/10 — the modifier
    // syntax v4 actually generates.
    expect(cardSource).toContain("bg-black/0");
    expect(cardSource).toContain("group-hover:bg-black/10");
  });

  it("the overlay still covers the thumbnail area (the group-hover affordance is preserved)", () => {
    // Preservation: the fix swaps the opacity syntax only — the overlay
    // div keeps its absolute positioning over the CanvasThumbnail.
    expect(cardSource).toContain("absolute inset-0");
  });
});
