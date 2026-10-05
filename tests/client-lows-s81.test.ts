import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-81 client low batch (S81-A + S81-B — the twenty-ninth
// audit's A81-M1, A81-L1, A81-L2).
//
// S81-A — THE DEFECT (A81-M1, the headline): the S80-C coalescing
// pair is an UNGUARDED gesture arm site. `if (coalesce)
// store.beginGesture();` ran with no foreign-gesture check while
// editor-store's beginGesture overwrites gestureSnapshot
// unconditionally — an AI reply landing mid-slider-drag CLOBBERED
// the drag's pre-drag snapshot (the AI's endGesture pushed a
// MID-DRAG state and nulled the snapshot; the drag's own terminal
// no-op'd; every subsequent slider tick committed per-entry — the
// S62-A flooding class). The two existing arm sites carry the
// interleave discipline (the canvas flushes the panel burst first;
// the panel closure's begin carries the S66-B foreign-ride guard).
//
// THE FIX: the coalesce arms ONLY when the store has NO live
// gesture (useEditorStore.getState().gestureSnapshot === null).
// Under a foreign gesture the pair falls back to the explicit
// commit=true paths (the pre-S80-C two-entry form — the documented
// programmatic-caller contract at properties-panel.tsx:1504-1506);
// the drag's snapshot stays INTACT.
//
// S81-B — THE DEFECTS (A81-L1 + A81-L2): (1) the drain's busy
// predicate `flushing || pending` missed the debounce-armed state —
// an edit landing during the SECOND boundary's PUT flight kept
// saveState "unsaved" with the 800ms timer armed, the drain saw an
// idle machine, resolved, and loadProject wiped the edit before its
// timer ever fired. THE FIX: the busy predicate gains the
// saveState === "unsaved" disjunct. (2) The post-GET pair lacked
// the first-run guard — a MOUNT into a different project re-PUT the
// outgoing body the unmount cleanup had already transported (the
// S71-B double-PUT class). THE FIX: an isMountRun capture gates the
// post-GET pair.

const view = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const assistant = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);

// Behavioral store pins import the real store (the gesture-undo
// suite's own pattern — a plain zustand container with no DOM
// dependency).
import { useEditorStore } from "@/components/editor/editor-store";

// ---------------------------------------------------------------------------
// S81-A — the foreign-gesture guard on the coalescing pair (A81-M1)
// ---------------------------------------------------------------------------

describe("the AI apply's coalescing pair guards against a live foreign gesture (S81-A / A81-M1)", () => {
  it("the coalesce condition requires the store to have NO live gesture", () => {
    // THE DEFECT PIN: pre-fix the condition armed unconditionally —
    // beginGesture clobbered whatever gesture the user had live.
    const site = assistant.indexOf("const coalesce =");
    expect(site).toBeGreaterThanOrEqual(0);
    const condition = assistant.slice(site, site + 400);
    expect(condition).toMatch(/gestureSnapshot\s*===\s*null/);
  });

  it("the guard reads the LIVE store state (getState), not a stale closure snapshot", () => {
    // The interleave decision must be made at apply time against the
    // store's current gesture state.
    const site = assistant.indexOf("const coalesce =");
    const condition = assistant.slice(site, site + 400);
    expect(condition).toMatch(/useEditorStore\.getState\(\)\.gestureSnapshot/);
  });
});

describe("the store behavior: the foreign-ride fallback keeps the drag's history intact (S81-A behavioral)", () => {
  it("under a LIVE gesture, the fallback halves commit true, the gesture's snapshot survives, and ONE undo restores the pre-drag state", () => {
    // Driven directly through the real store (the gesture-undo
    // suite's pattern). This pins the SEMANTICS the post-fix
    // fallback form produces: the AI halves (commit=true) push their
    // own discrete entries WITHOUT disturbing the live gesture's
    // snapshot; the gesture's endGesture then pushes the pre-drag
    // snapshot LAST, so one undo() restores the pre-drag state.
    const id = useEditorStore.getState().addElement({
      type: "rectangle",
      name: "S81 Foreign-Ride Probe",
      x: 10,
      y: 10,
      width: 100,
      height: 50,
      fill: "#3B82F6",
    });
    expect(id).toBeTruthy();
    useEditorStore.getState().deselectAll();

    // The user's drag is LIVE (gestureSnapshot = the pre-drag state).
    useEditorStore.getState().beginGesture();
    const dragSnapshot = useEditorStore.getState().gestureSnapshot;
    expect(dragSnapshot).not.toBeNull();

    // The drag moves the element (a canvas-drag tick — no history
    // entry; the gesture owns the deferral).
    useEditorStore.getState().moveElements([id!], 30, 20);
    const pastBeforeFallback = useEditorStore.getState().past.length;

    // The AI reply lands MID-DRAG: the fallback form — both halves
    // commit true (the programmatic-caller contract).
    useEditorStore.getState().scaleElements([id!], 1.5, true);
    useEditorStore.getState().updateElements([id!], { fill: "#FF0000" }, true);

    // The two discrete entries landed; the gesture's snapshot is
    // INTACT (the clobber would have replaced it with a mid-drag
    // state).
    expect(useEditorStore.getState().past.length).toBe(pastBeforeFallback + 2);
    expect(useEditorStore.getState().gestureSnapshot).toBe(dragSnapshot);

    // The drag ends: ONE more entry (the pre-drag snapshot).
    useEditorStore.getState().endGesture();
    expect(useEditorStore.getState().past.length).toBe(pastBeforeFallback + 3);
    expect(useEditorStore.getState().gestureSnapshot).toBeNull();

    // ONE undo restores the pre-drag state — position, scale, and
    // fill ALL reverted (the pre-drag snapshot predates every
    // interleaved change).
    useEditorStore.getState().undo();
    const restored = useEditorStore.getState().elements.find((e) => e.id === id);
    expect(restored?.x).toBe(10);
    expect(restored?.y).toBe(10);
    expect(restored?.width).toBe(100);
    expect(restored?.fill).toBe("#3B82F6");
  });
});

// ---------------------------------------------------------------------------
// S81-B — the drain sees the armed-debounce state + the post-GET mount guard
// ---------------------------------------------------------------------------

describe("the drain's busy predicate includes the debounce-armed state (S81-B / A81-L1)", () => {
  it("machineBusy sees flushing OR pending OR the store's unsaved state", () => {
    // THE DEFECT PIN: pre-fix the predicate saw only the machine's
    // own flags — an edit landing during the second boundary's PUT
    // flight (unsaved + the 800ms timer armed) was invisible to the
    // drain, and loadProject wiped it.
    // Session 82 re-anchor: the predicate now carries the S82-B
    // !sessionDead exemption prefix (the 401-terminal drain fix) and
    // the S82-B comment block above it grew — the anchor moves from
    // the first comment mention onto the `const machineBusy = () =>`
    // declaration itself; the intent (the disjuncts) is unchanged.
    const site = view.indexOf("const machineBusy = () =>");
    expect(site).toBeGreaterThanOrEqual(0);
    const predicate = view.slice(site, site + 300);
    expect(predicate).toMatch(/flushing\s*\|\|\s*pending/);
    expect(predicate).toMatch(/saveState\s*===\s*"unsaved"/);
  });
});

describe("the post-GET pair carries the mount guard (S81-B / A81-L2)", () => {
  it("an isMountRun capture discriminates the mount run from the swap run", () => {
    // THE DEFECT PIN: pre-fix the post-GET pair fired on every
    // qualifying load — including MOUNTS, where the previous
    // instance's unmount cleanup had already transported the
    // outgoing state (the S71-B double-PUT class).
    expect(view).toMatch(/const isMountRun\s*=\s*firstRunRef\.current/);
  });

  it("the post-GET pair gates on NOT-mount before flushing the outgoing body", () => {
    // The pair's guard compound: !isMountRun AND the named-outgoing
    // contract (the existing projectId discrimination preserved).
    const pairSite = view.indexOf("outgoingPost.projectId");
    expect(pairSite).toBeGreaterThanOrEqual(0);
    const guard = view.slice(Math.max(0, pairSite - 200), pairSite + 200);
    expect(guard).toMatch(/!isMountRun/);
    expect(guard).toMatch(/outgoingPost\.projectId\s*&&\s*outgoingPost\.projectId\s*!==\s*projectId/);
  });

  it("the isMountRun capture sits BEFORE the first boundary's firstRunRef flip", () => {
    // The capture must read the ref BEFORE the boundary block sets
    // it false (line ~1281) — otherwise every run looks like a swap.
    const capture = view.indexOf("const isMountRun = firstRunRef.current;");
    const flip = view.indexOf("firstRunRef.current = false;");
    expect(capture).toBeGreaterThanOrEqual(0);
    expect(flip).toBeGreaterThan(capture);
  });
});
