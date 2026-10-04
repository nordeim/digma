import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The elements POST cap (session 60, S60-D — the eighth Mode C audit's
// B-L-2).
//
// The 2000-element ceiling existed only on the PUT (list.length > 2000
// → 400). The POST computed its count query only for the sortOrder
// default and never capped — so scripted POSTs (or patiently drawing
// element #2001) pushed the project past the ceiling, after which EVERY
// subsequent autosave PUT failed with the "Too many elements (max
// 2000)" 400 toast: the design was unsavable until the user deleted
// back below the cap.
//
// The fix: the POST rejects when the project is already at the ceiling
// — the same message and contract the PUT carries, enforced at the only
// other write path.

const routeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
  "utf8",
);

describe("the elements POST cap (session 60, S60-D / B-L-2)", () => {
  it("the POST rejects a project already at the 2000-element ceiling", () => {
    // THE DEFECT PIN: pre-fix the POST's count query fed only the
    // sortOrder default — no ceiling check anywhere in the handler.
    // Session 61 (S61-F) contract update: the literal 2000 became the
    // shared ELEMENT_LIMIT seam (src/lib/editor.ts) — same check, same
    // message, one source of truth with the client clamp.
    const postStart = routeSource.indexOf("export async function POST");
    expect(postStart).toBeGreaterThan(-1);
    const putStart = routeSource.indexOf("export async function PUT");
    expect(putStart).toBeGreaterThan(postStart);
    const postHandler = routeSource.slice(postStart, putStart);
    expect(postHandler).toContain("count >= ELEMENT_LIMIT");
    expect(postHandler).toContain('fail("VALIDATION", "Too many elements (max 2000)", 400)');
    // The cap guards BEFORE the create (the count query already runs).
    // Session 72 (S72-E) contract re-anchor: the count and the create
    // moved INSIDE the TOCTOU transaction (tx.* forms) — the
    // cap-before-create ordering is pinned on the transactional calls.
    const countQuery = postHandler.indexOf("tx.designElement.count");
    const createCall = postHandler.indexOf("tx.designElement.create");
    expect(countQuery).toBeGreaterThan(-1);
    expect(createCall).toBeGreaterThan(countQuery);
    expect(postHandler.indexOf("count >= ELEMENT_LIMIT")).toBeGreaterThan(countQuery);
    expect(postHandler.indexOf("count >= ELEMENT_LIMIT")).toBeLessThan(createCall);
  });

  it("the PUT keeps its own list-length cap (the standing contract)", () => {
    // Session 61 (S61-F) contract update: the literal became ELEMENT_LIMIT.
    const putStart = routeSource.indexOf("export async function PUT");
    const putHandler = routeSource.slice(putStart);
    expect(putHandler).toContain("list.length > ELEMENT_LIMIT");
    expect(putHandler).toContain('fail("VALIDATION", "Too many elements (max 2000)", 400)');
  });
});
