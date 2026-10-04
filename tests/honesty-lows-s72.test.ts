import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-72 honesty batch (S72-D — the twentieth audit's L-B4 + the
// comment/PAD riders).
//
// THE DEFECTS: (L-B4) the clampText fold's NINTH site — the teams PATCH
// description field still hand-rolls the trim().slice(0, 300) || null
// twin that S71-D deleted everywhere else (the exact twin-hazard the
// fold's rationale names: "a future edit fixing one twin"). The comment
// riders: the canvas hit-test comment still carries the pre-wall
// "unlocked" wording session 23 superseded; the editor shortcuts header
// still enumerates seven keys against the nine-tool TOOL_SHORTCUTS seam
// (the S48-1 drift reproduced in a comment); the elements POST doc
// comment describes a client integration ("spawned by the AI assistant")
// that no longer exists — the client persists exclusively through the
// full-list PUT; the dead minV(n) parameter suggests per-axis minimums
// that don't exist. The PAD riders: §4's index reference still names the
// dropped single-column indexes; the fontSize "32px ceiling" sentence
// contradicts the real clamps; the "keyed to the app user by query"
// sentence contradicts ADR-003's shared pool; :730's "resize math" claim
// overclaims rotation-awareness the code does not have (AGENTS.md's
// outline/handles/marquee scope is the accurate one).

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the clampText ninth site (S72-D / L-B4)", () => {
  it("the teams PATCH description rides the shared clampText seam", () => {
    // THE DEFECT PIN: pre-fix the inline twin
    // `typeof body.description === "string" ? body.description.trim().slice(0, 300) || null : null`
    // survives beside the seam the fold was supposed to complete.
    const route = src("src/app/api/teams/[id]/route.ts");
    expect(route).toMatch(/clampText\(body\.description, 300\)/);
    expect(route).not.toMatch(/body\.description\.trim\(\)\.slice\(0, 300\)/);
  });

  it("the fold's call-site census is complete (no other inline twin repo-wide)", () => {
    // THE SWEEP PIN: the twin's signature (a hand-rolled
    // trim().slice(N) || null on a text field) has no other occurrence.
    const candidates = [
      "src/app/api/teams/route.ts",
      "src/app/api/teams/[id]/route.ts",
      "src/app/api/teams/[id]/members/route.ts",
      "src/app/api/projects/route.ts",
      "src/app/api/projects/[id]/route.ts",
    ];
    for (const rel of candidates) {
      const text = src(rel);
      expect(text).not.toMatch(/\.trim\(\)\.slice\(\d+\) \|\| null/);
    }
  });
});

describe("the comment/code honesty riders (S72-D)", () => {
  it("the canvas hit-test comment states the wall's actual contract (locked included)", () => {
    // THE DEFECT PIN: pre-fix the comment says "topmost visible
    // unlocked element" — the S23 wall's hit-test finds the topmost
    // VISIBLE element (locked included) and walls; the wording
    // describes the pre-wall behavior.
    const canvas = src("src/components/editor/canvas.tsx");
    expect(canvas).not.toMatch(/topmost visible unlocked element/);
    expect(canvas).toMatch(/topmost visible element, locked included/);
  });

  it("the editor shortcuts header points at the TOOL_SHORTCUTS seam (no hand-maintained enumeration)", () => {
    // THE DEFECT PIN: pre-fix the comment enumerates "(V/H/F/R/O/L/T)"
    // — seven keys against the nine-tool seam, the exact S48-1 drift
    // reproduced in a comment.
    const view = src("src/components/editor/editor-view.tsx");
    expect(view).not.toMatch(/tools \(V\/H\/F\/R\/O\/L\/T\)/);
  });

  it("the elements POST doc comment states the honest API-surface status", () => {
    // THE DEFECT PIN: pre-fix the comment describes a client
    // integration ("drawn on the canvas, spawned by the AI assistant")
    // that no longer exists — the client persists through the PUT.
    const route = src("src/app/api/projects/[id]/elements/route.ts");
    const postStart = route.indexOf("export async function POST");
    const postBody = route.slice(Math.max(0, postStart - 900), postStart + 400);
    expect(postBody).toMatch(/API-surface|API surface/);
    expect(postBody).not.toMatch(/spawned by the AI assistant/);
  });

  it("the resize minimum helper carries no dead parameter", () => {
    // THE DEFECT PIN: pre-fix `const minV = (n: number) => (el.type
    // === "line" ? 0 : 1) * s;` — n is never used; the call sites pass
    // the meaningless minV(1).
    const canvas = src("src/components/editor/canvas.tsx");
    expect(canvas).not.toMatch(/minV = \(n: number\)/);
    expect(canvas).toMatch(/minVisual/);
    // The four call sites consume the constant.
    const uses = canvas.match(/minVisual\b/g) ?? [];
    expect(uses.length).toBeGreaterThanOrEqual(5); // the declaration + 4 sites
  });
});

describe("the PAD §4 honesty riders (S72-D)", () => {
  const pad = src("Project_Architecture_Document.md");

  it("the data-model reference names the composite index (the dropped single-column forms are gone)", () => {
    // THE DEFECT PIN: pre-fix the §4 table-level notes still reference
    // the dropped @@index([projectId]) and @@index([sortOrder]).
    const notes = pad.slice(pad.indexOf("Table-level notes:"), pad.indexOf("Table-level notes:") + 600);
    expect(notes).toMatch(/@@index\(\[projectId, sortOrder\]\)/);
    expect(notes).not.toMatch(/@@index\(\[projectId\]\)/);
    expect(notes).not.toMatch(/@@index\(\[sortOrder\]\)/);
  });

  it("the fontSize sentence states the real clamp range (the stale ceiling claim is gone)", () => {
    // THE DEFECT PIN: the real clamps are 1-500 (the shared row-builder)
    // and 1-200 (the AI sanitizer) — the sentence must state the ranges
    // without quoting the removed claim's literal (the F58 lesson: a
    // replacement comment that quotes the dead phrase trips its own
    // absence pin).
    const shape = pad.slice(pad.indexOf("The runtime element shape"), pad.indexOf("The runtime element shape") + 800);
    expect(shape).toMatch(/1–500/);
    expect(shape).toMatch(/1–200/);
    expect(shape).not.toMatch(/ceiling \(pinned by unit tests\)/);
  });

  it("the user-keying sentence states the ADR-003 shared pool (the query-keying claim is gone)", () => {
    // THE DEFECT PIN: pre-fix "projects are keyed to the app user by
    // query" — no route keys by user; ADR-003 documents the shared
    // pool.
    const notes = pad.slice(pad.indexOf("Table-level notes:"), pad.indexOf("Table-level notes:") + 600);
    expect(notes).not.toMatch(/keyed to the app user by query/);
  });

  it("the rotation-awareness scope is accurate (outline/handles/marquee — the drag-math claim is scoped)", () => {
    // THE DEFECT PIN (M-A1's doc half): the S64-C bullet must state the
    // accurate scope (outline/handles/marquee) with the rotated-resize
    // deferral note — never the unqualified drag-math claim. Anchored on
    // the S64-C bullet itself (the first "rotation-aware" occurrence is
    // the session-68 revision block, not this bullet).
    const bulletIdx = pad.indexOf("**S64-C (A-3): `boundsOf` is rotation-aware.**");
    expect(bulletIdx).toBeGreaterThan(-1);
    const bullet = pad.slice(bulletIdx, bulletIdx + 1200);
    expect(bullet).toMatch(/selection outline, resize handles, and marquee containment run/);
    expect(bullet).toMatch(/out of scope/);
    // The unqualified claim form (the four-consumer list naming the drag
    // math as rotation-aware) is gone — the deferral note is the only
    // surviving drag-math mention, and it is scoped.
    const dragMathMentions = bullet.match(/resize (drag math|math)/g) ?? [];
    for (const _ of dragMathMentions) {
      expect(bullet).toMatch(/axis-aligned/);
    }
    expect(bullet).toMatch(/axis-aligned/);
  });
});
