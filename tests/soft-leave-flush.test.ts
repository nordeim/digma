import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The soft-leave flush + the stale-saving normalization (session 62,
// S62-C — the tenth audit's A-M1 + A-L2 + I4).
//
// THE DEFECT (A-M1): S61-I claimed "browser Back" coverage, but the
// App Router's Dashboard -> Editor -> browser Back is a SAME-DOCUMENT
// popstate traversal: pagehide never fires, the effect's cleanup
// clears the 800ms timer, and no flush runs — an edit inside the
// debounce window died. The S61-I e2e pin dispatched a SYNTHETIC
// pagehide, not a real Back traversal.
//
// THE DEFECT (A-L2/I4): a disposed flush's terminal "saving" state
// (the response handlers skip markSaved AND setUnsaved when disposed)
// survived re-entry through the adoption guard — the badge read
// "Saving..." indefinitely. And an already-"unsaved" store at re-mount
// never armed the timer (the subscriber fires on CHANGES only).
//
// THE FIX: (1) the cleanup fires the captured-current-state PUT
// BEFORE `disposed = true` — a direct fire-and-forget full-replace (a
// regular fetch survives unmount: the document persists through soft
// navigation; no keepalive and no body cap — those exist for real
// teardown). Untitled skips (mirrors S61-I). (2) The adoption-guard
// skip branch normalizes any non-"saved" state to "unsaved" — arming
// the S56-B retry / re-arming the timer (Zustand notifies on every
// set(), so the subscriber fires).

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

const AUTOSAVE_EFFECT_START = viewSource.indexOf("async function flush()");
const CLEANUP_ANCHOR = "window.removeEventListener(";

describe("the soft-leave flush + the stale-saving normalization (session 62, S62-C / A-M1 + A-L2)", () => {
  it("the cleanup flushes unsaved state BEFORE disposal — a regular fetch survives unmount", () => {
    // THE DEFECT PIN: pre-fix the cleanup only tore down (disposed =
    // true; unsubscribe; clearTimeout; removeEventListener) — no PUT.
    const cleanupStart = viewSource.indexOf("return () => {", AUTOSAVE_EFFECT_START);
    expect(cleanupStart).toBeGreaterThan(-1);
    const cleanupEnd = viewSource.indexOf(CLEANUP_ANCHOR, cleanupStart);
    const cleanup = viewSource.slice(cleanupStart, cleanupEnd);
    // The pre-dispose flush: reads the CURRENT store state, fires the
    // direct PUT, THEN flips disposed.
    expect(cleanup).toMatch(/const state = useEditorStore\.getState\(\);/);
    expect(cleanup).toMatch(/if \(state\.saveState !== "saved" && state\.projectId\)/);
    expect(cleanup).toMatch(/method: "PUT"/);
    // The flush happens BEFORE `disposed = true` (ordering pin).
    const flushIdx = cleanup.indexOf("method: \"PUT\"");
    const disposedIdx = cleanup.indexOf("disposed = true;");
    expect(flushIdx).toBeGreaterThan(-1);
    expect(disposedIdx).toBeGreaterThan(flushIdx);
    // A regular fetch (NOT keepalive — the document persists through
    // soft navigation; keepalive exists for real teardown only).
    const fetchIdx = cleanup.indexOf("void fetch(");
    expect(fetchIdx).toBeGreaterThan(-1);
    expect(cleanup.slice(fetchIdx, cleanup.indexOf(")", cleanup.indexOf("keepalive", fetchIdx) === -1 ? cleanup.length : cleanup.indexOf("keepalive", fetchIdx)) + 1)).not.toContain("keepalive");
  });

  it("the soft-leave flush skips Untitled mode (mirrors the S61-I unload contract)", () => {
    const cleanupStart = viewSource.indexOf("return () => {", AUTOSAVE_EFFECT_START);
    const cleanupEnd = viewSource.indexOf(CLEANUP_ANCHOR, cleanupStart);
    const cleanup = viewSource.slice(cleanupStart, cleanupEnd);
    // The projectId guard doubles as the Untitled skip: no projectId,
    // no PUT target (the creation POST's adoption contract is out of
    // leave scope — the documented S61-I rationale).
    expect(cleanup).toMatch(/state\.projectId/);
  });

  it("the adoption-guard skip branch normalizes a stale non-saved state (arming the retry/timer)", () => {
    // THE DEFECT PIN: pre-fix the skip branch only set setLoading(false)
    // and returned — a stale "saving" (disposed flush terminal state)
    // or "unsaved" (re-mount) never re-armed.
    const guardIdx = viewSource.indexOf("if (useEditorStore.getState().projectId === projectId) {");
    expect(guardIdx).toBeGreaterThan(-1);
    const guardEnd = viewSource.indexOf("try {", guardIdx);
    const guard = viewSource.slice(guardIdx, guardEnd);
    expect(guard).toMatch(/setLoading\(false\);/);
    expect(guard).toMatch(/if \(useEditorStore\.getState\(\)\.saveState !== "saved"\)/);
    expect(guard).toMatch(/useEditorStore\.getState\(\)\.setUnsaved\(\);/);
  });

  it("the S61-I contracts survive (the preservation pins)", () => {
    // PRESERVATION PINS: the pagehide keepalive flush and the
    // adoption-clobber guard themselves are untouched.
    expect(viewSource).toMatch(/addEventListener\("pagehide", onUnload\)/);
    expect(viewSource).toMatch(/if \(useEditorStore\.getState\(\)\.projectId === projectId\) \{/);
    expect(viewSource).toMatch(/keepalive: true/);
  });
});
