import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The contrast batch (session 61, S61-A + S61-B — the ninth Mode C
// audit's M-1 and M-2).
//
// M-1: --color-destructive #ef4444 with the white foreground computes
// to 3.76:1 — below the 4.5:1 WCAG AA minimum for normal-size text.
// Every "Yes, Delete" confirm and every destructive toast description
// renders sub-AA. The fix (#dc2626 = red-600, 4.83:1) is the a11y
// working-superset doctrine (the MobileNav family): red-600 is already
// a pinned @theme token, so no palette drift. No e2e pin touches the
// destructive background — the rgb(239, 68, 68) pin at
// mobile-properties.spec.ts:219 is ELEMENT FILL data typed into the hex
// input, not the token.
//
// M-2: text-gray-400 (#9ca3af on white = 2.54:1) at 12px on three
// micro-labels — the project-card opened-date row, the MobileNav
// drawer footer, the Dashboard list-row dates. The fix flips them to
// text-gray-500 (#6b7280, 4.83:1) — the codebase is already internally
// inconsistent (the "Pro Plan" label and Recent's dates use gray-500).
// The parity-pinned gray-400 sites (the editor avatar counter at
// parity.spec.ts:495/543) are NOT touched — the preservation pin
// guards them.

const cssSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/globals.css"),
  "utf8",
);
const cardSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/project-card.tsx"),
  "utf8",
);
const headerSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/app-header.tsx"),
  "utf8",
);
const dashSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/dashboard-view.tsx"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

describe("the destructive-token AA contrast (session 61, S61-A / M-1)", () => {
  it("the @theme destructive token is the AA-passing red-600, not the 3.76:1 red-500", () => {
    // THE DEFECT PIN: pre-fix the token was #ef4444 — white text on it
    // computes to 3.76:1, below the 4.5:1 AA floor.
    expect(cssSource).toMatch(/--color-destructive:\s*#dc2626;/);
  });

  it("the destructive foreground stays white (the 4.83:1 pairing)", () => {
    // Preservation: the fix darkens the background only.
    expect(cssSource).toMatch(/--color-destructive-foreground:\s*#ffffff;/);
  });
});

describe("the gray-400 micro-label contrast (session 61, S61-B / M-2)", () => {
  it("the project-card opened-date row reads at AA (gray-500, not the 2.54:1 gray-400)", () => {
    // THE DEFECT PIN: pre-fix the card footer row was
    // "text-xs text-gray-400" — 2.54:1 at 12px.
    expect(cardSource).toContain(
      '<div className="flex items-center justify-between text-xs text-gray-500">',
    );
  });

  it("the MobileNav drawer footer reads at AA", () => {
    // THE DEFECT PIN: pre-fix the drawer footer was text-gray-400.
    expect(headerSource).toContain(
      '<p className="text-xs text-gray-500">Digma · Design workspace</p>',
    );
  });

  it("the Dashboard list-row dates read at AA", () => {
    // THE DEFECT PIN: pre-fix the list-row date was text-gray-400.
    expect(dashSource).toContain(
      '<span className="hidden text-xs text-gray-500 sm:block">',
    );
  });

  it("preservation: the parity-pinned editor avatar counter keeps its gray-400", () => {
    // The reference's ungated member counter is parity-pinned
    // (parity.spec.ts:495/543 — flex items-center gap-1 text-gray-400
    // text-sm + lucide-users w-4 h-4). The contrast fix must not
    // reach it.
    expect(viewSource).toContain(
      '<div className="flex items-center gap-1 text-sm text-gray-400">',
    );
  });
});
