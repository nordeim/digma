import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

// The gesture undo direction (session 56, S56-A — the Mode C audit's H-1).
//
// Canvas drags/resizes mutate live WITHOUT history (by design — one history
// entry per gesture), but the old code called store.commit() at pointer-UP,
// which pushes snapshotOf(state) = the POST-gesture state. The FIRST Ctrl+Z
// after a drag restored the state the canvas was already in — a silent
// no-op — and the pre-gesture layout was unreachable. A plain CLICK (a
// "move" gesture with zero movement) also pushed a redundant snapshot and
// wiped the redo stack.
//
// The fix: the store gains a transient gesture seam — beginGesture()
// captures the PRE-gesture snapshot, endGesture() pushes THAT snapshot
// (one history entry per gesture, facing the right direction), and
// cancelGesture() discards it (the zero-movement click).
//
// This suite pins BOTH the store's behavior (driven directly — the store is
// a plain zustand container with no DOM dependency) and the canvas wiring
// as a source contract (the canvas-memo pattern).

import { useEditorStore } from "@/components/editor/editor-store";
import type { DesignElementDTO } from "@/lib/editor";

const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);

/** A minimal rectangle DTO for driving the store directly. */
function rect(id: string, x: number, y: number): DesignElementDTO {
  return {
    id,
    projectId: "p1",
    type: "rectangle",
    name: id,
    sortOrder: 0,
    zIndex: 0,
    x,
    y,
    width: 200,
    height: 150,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    fill: "#3B82F6",
    stroke: null,
    strokeWidth: 0,
    radius: 0,
  } as DesignElementDTO;
}

beforeEach(() => {
  useEditorStore.setState({
    projectId: "p1",
    projectName: "Test",
    projectDescription: null,
    backgroundColor: "#0D1117",
    elements: [rect("a", 60, 80)],
    selectedIds: ["a"],
    tool: "select",
    zoom: 1,
    panX: 0,
    panY: 0,
    saveState: "saved",
    past: [],
    future: [],
  });
});

describe("the gesture undo direction (session 56, S56-A / H-1)", () => {
  it("a SINGLE undo restores the pre-drag position (begin → move → end)", () => {
    const store = useEditorStore.getState();
    expect(typeof store.beginGesture).toBe("function");
    store.beginGesture();
    store.moveElements(["a"], 140, 60);
    expect(useEditorStore.getState().elements[0]!.x).toBe(200);
    useEditorStore.getState().endGesture();
    // ONE undo must reach the pre-drag layout — the old commit() direction
    // made this first undo a silent no-op (it pushed the post-drag state).
    useEditorStore.getState().undo();
    const el = useEditorStore.getState().elements[0]!;
    expect(el.x).toBe(60);
    expect(el.y).toBe(80);
  });

  it("a cancelled gesture pushes NO history (the zero-movement click)", () => {
    const store = useEditorStore.getState();
    store.beginGesture();
    useEditorStore.getState().cancelGesture();
    expect(useEditorStore.getState().past).toHaveLength(0);
  });

  it("a plain click preserves the redo stack (no redundant snapshot)", () => {
    // Establish one real undoable action, undo it (future now holds it).
    useEditorStore.getState().beginGesture();
    useEditorStore.getState().moveElements(["a"], 10, 0);
    useEditorStore.getState().endGesture();
    useEditorStore.getState().undo();
    expect(useEditorStore.getState().future).toHaveLength(1);
    // A zero-movement click: begin + cancel must NOT clear future.
    useEditorStore.getState().beginGesture();
    useEditorStore.getState().cancelGesture();
    expect(useEditorStore.getState().future).toHaveLength(1);
  });

  it("the eye and lock toggles are individually undoable (L-3)", () => {
    useEditorStore.getState().toggleVisibility("a");
    expect(useEditorStore.getState().elements[0]!.visible).toBe(false);
    useEditorStore.getState().undo();
    expect(useEditorStore.getState().elements[0]!.visible).toBe(true);

    useEditorStore.getState().toggleLock("a");
    expect(useEditorStore.getState().elements[0]!.locked).toBe(true);
    useEditorStore.getState().undo();
    expect(useEditorStore.getState().elements[0]!.locked).toBe(false);
  });
});

describe("the canvas gesture wiring (source contract)", () => {
  it("both gesture starts capture the PRE-gesture snapshot", () => {
    // The move branch (the element hit path)… Session 64 (S64-G / A-5
    // — a legitimate contract update): the container pointer-capture
    // call now sits between the gesture start and the drag state (the
    // drag survives the pointer crossing into the chrome); the
    // PRE-gesture ordering itself is unchanged.
    expect(canvasSource).toMatch(
      /beginGesture\(\);[\s\S]*?setDrag\(\{\s*kind: "move",|setDrag\(\{\s*kind: "move",[\s\S]*?\}\);\s*useEditorStore\.getState\(\)\.beginGesture\(\);/,
    );
    // …and the resize-handle branch.
    expect(canvasSource).toMatch(
      /setDrag\(\{\s*kind: "resize",[\s\S]*?\}\);[\s\S]*?beginGesture\(\);|beginGesture\(\);\s*setDrag\(\{\s*kind: "resize",/,
    );
  });

  it("pointer-up pushes the gesture snapshot ONLY when the gesture moved", () => {
    expect(canvasSource).toMatch(
      /if \(drag\.moved\) store\.endGesture\(\);\s*else store\.cancelGesture\(\);/,
    );
  });

  it("the bare pointer-up commit() is GONE (the wrong-direction push)", () => {
    expect(canvasSource).not.toMatch(/onPointerUp[\s\S]*?store\.commit\(\)/);
    expect(storeSource).not.toMatch(/commit:\s*\(\)\s*=>/);
  });
});
