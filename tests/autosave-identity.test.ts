import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The autosave identity guards (session 57, S57-B — the fifth Mode C
// audit's M-1 + M-2).
//
// M-1: the stale-response swap guard `if (capturedProjectId && …)` was
// bypassed exactly in Untitled mode (capturedProjectId "" is falsy) — a
// stale Untitled flush response landing after the user exited and opened
// project X called now.setUnsaved() over X's just-loaded state: a
// spurious full PUT of unchanged data plus an "Unsaved" badge flash on a
// pristine project.
//
// M-2 (the escalation): ensureProject re-checked nothing after its
// await — a stale continuation ran attachProject(createdId) over
// project X's id in the module-singleton store and rewrote the CURRENT
// history entry via replaceState; the subsequent PUT then wrote X's
// elements (read at call time) into the created project: cross-project
// content duplication plus a store/URL mismatch.
//
// The fix (source contract, the autosave-machine pattern — the live
// interleaving is pinned by the extended tests/e2e/autosave-race.spec):
// 1. A disposed (unmounted) instance performs NO store mutation on any
//    response path — the three failure-path setUnsaved calls gain
//    `if (!disposed)` guards, and the success path returns before the
//    reference/gesture/markSaved handling once disposed. The toasts stay
//    honest (the toast system is global); only the store mutations are
//    gated. The pending re-run in the finally block stays deliberately
//    NOT disposed-gated — it IS the exit save.
// 2. ensureProject adopts the created id (attachProject + the URL
//    replaceState) ONLY when the instance is still live AND the store is
//    still in Untitled mode (projectId "") — the created id is still
//    returned so the exit PUT persists the untitled content server-side.

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

/** The useAutosave effect body (from `function useAutosave` to its return). */
function autosaveSegment(): string {
  const start = viewSource.indexOf("function useAutosave");
  const end = viewSource.indexOf("// A stable flush handle for exit()", start);
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return viewSource.slice(start, end);
}

describe("the autosave identity guards (session 57, S57-B / M-1 + M-2)", () => {
  it("the three failure-path setUnsaved calls are disposed-gated (no spurious unsaved after unmount)", () => {
    const seg = autosaveSegment();
    // The ensureProject-null path, the !response.ok path, and the network
    // catch — each retries via setUnsaved ONLY while the instance lives.
    const guarded = seg.match(/if \(!disposed\) useEditorStore\.getState\(\)\.setUnsaved\(\);/g);
    expect(guarded?.length ?? 0).toBeGreaterThanOrEqual(3);
    // …and no UNGUARDED setUnsaved remains on a failure path (the
    // reference-guard and gesture-deferral setUnsaved calls sit behind
    // `now.` on live state and are covered by the success-path gate
    // below).
    const bare = seg.match(/(?<!\(!disposed\) useEditorStore\.getState\(\)\.)(?<!now\.)setUnsaved\(\);/g);
    expect(bare ?? []).toEqual([]);
  });

  it("the success path returns once disposed — before any stale-response handling", () => {
    const seg = autosaveSegment();
    // Between the failure bookkeeping reset and the first stale-response
    // guard, a disposed instance bails: no setUnsaved, no markSaved over
    // the NEXT editor's just-loaded state.
    const resetIdx = seg.indexOf("consecutiveFailures = 0;");
    const swapIdx = seg.indexOf("capturedProjectId && now.projectId !== capturedProjectId");
    expect(resetIdx).toBeGreaterThan(-1);
    expect(swapIdx).toBeGreaterThan(resetIdx);
    const between = seg.slice(resetIdx, swapIdx);
    expect(between).toContain("if (disposed) return;");
  });

  it("ensureProject adopts the created id ONLY while live and still Untitled (the M-2 clobber guard)", () => {
    const seg = autosaveSegment();
    const idIdx = seg.indexOf("const id = body.data.project.id as string;");
    const retIdx = seg.indexOf("return id;", idIdx);
    expect(idIdx).toBeGreaterThan(-1);
    expect(retIdx).toBeGreaterThan(idIdx);
    const adoption = seg.slice(idIdx, retIdx);
    // The guard exists…
    expect(adoption).toMatch(/if \(!disposed\)/);
    // …checks the store is STILL in Untitled mode…
    expect(adoption).toMatch(/projectId\s*===?\s*""/);
    // …and BOTH the store adoption and the URL rewrite sit inside it.
    const guardIdx = adoption.search(/if \(!disposed\)/);
    const attachIdx = adoption.indexOf("attachProject(id)");
    // The CALL form — the explanatory comment legitimately mentions
    // "(replaceState)" in prose.
    const replaceIdx = adoption.indexOf("replaceState(null");
    expect(guardIdx).toBeGreaterThan(-1);
    expect(attachIdx).toBeGreaterThan(guardIdx);
    expect(replaceIdx).toBeGreaterThan(guardIdx);
    // The created id is still RETURNED (the exit PUT persists the
    // untitled content server-side even when the adoption is skipped).
    expect(retIdx).toBeGreaterThan(-1);
  });

  it("the PUT body is built from the CAPTURED state — never a live re-read across the ensureProject await", () => {
    const seg = autosaveSegment();
    // The full body captures at flush START…
    expect(seg).toMatch(/const capturedBackgroundColor = store\.backgroundColor;/);
    // …and the PUT body uses BOTH captured values (the live re-read after
    // the ensureProject await could carry ANOTHER project's elements into
    // the freshly created project — the untitled content silently lost).
    // Anchor AFTER the elements PUT fetch — ensureProject's own POST body
    // matches the same JSON.stringify prefix.
    const putIdx = seg.indexOf("fetch(`/api/projects/${projectId}/elements`");
    expect(putIdx).toBeGreaterThan(-1);
    const afterPut = seg.slice(putIdx);
    const bodyMatch = afterPut.match(/body: JSON\.stringify\(\{([\s\S]*?)\}\),/);
    expect(bodyMatch).not.toBeNull();
    expect(bodyMatch![1]).toContain("elements: capturedElements");
    expect(bodyMatch![1]).toContain("backgroundColor: capturedBackgroundColor");
    expect(bodyMatch![1]).not.toContain("getState()");
  });

  it("the pending re-run in the finally block stays deliberately NOT disposed-gated (it is the exit save)", () => {
    const seg = autosaveSegment();
    const fin = seg.match(/finally \{([\s\S]*?)\n    \}/);
    expect(fin).not.toBeNull();
    expect(fin![1]).toContain("if (pending)");
    // No disposed CONDITION in the finally block's code (the explanatory
    // comment legitimately mentions the word — the CODE must not gate).
    expect(fin![1]).not.toMatch(/if \(\s*!?\s*disposed\s*\)/);
  });
});
