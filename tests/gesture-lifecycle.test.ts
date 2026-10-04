import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

// The gesture lifecycle hardening (session 57, S57-A — the fifth Mode C
// audit's H-1 + M-4).
//
// H-1: loadProject reset everything EXCEPT gestureSnapshot — a gesture
// whose pointerdown never got its pointerup/pointerleave pair (an unmount
// mid-drag, or a pointercancel) leaked the snapshot into the module-
// singleton store across an editor session boundary, where the autosave
// machine's gesture-deferral (setUnsaved + return on gestureSnapshot !==
// null) looped FOREVER: PUT → setUnsaved → 800ms → PUT → … — saveState
// never reaching "saved", one full-elements PUT per cycle.
//
// M-4: the canvas wired no onPointerCancel (a canceled pointer stream —
// touch gesture takeover, device loss — left the drag stuck at kind
// move/resize with the gesture leaked), and onPointerMove checked only
// drag.kind — no buttons-pressed check — so the next HOVER pointermove
// (buttons === 0) dragged or resized elements: ghost movement.
//
// The fix: loadProject resets gestureSnapshot; the container wires
// onPointerCancel to the same end path as pointer-up; onPointerMove
// routes any gesture with buttons === 0 to that end path before mutating.

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

const PROJECT = {
  id: "p2",
  name: "Next Project",
  description: null,
  backgroundColor: "#0D1117",
  elements: [rect("b", 10, 20)],
};

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
    gestureSnapshot: null,
  });
});

describe("the gesture lifecycle (session 57, S57-A / H-1 + M-4)", () => {
  it("loadProject resets gestureSnapshot — a leaked gesture cannot cross the session boundary", () => {
    // The leak: a gesture begun (pointerdown) but never ended (no
    // pointerup/pointerleave — unmount or pointercancel).
    useEditorStore.getState().beginGesture();
    expect(useEditorStore.getState().gestureSnapshot).not.toBeNull();

    // The next editor session loads its project.
    useEditorStore.getState().loadProject(PROJECT as never);

    // The stale gesture is gone: the autosave deferral can no longer
    // loop on it (the H-1 livelock's root).
    expect(useEditorStore.getState().gestureSnapshot).toBeNull();
  });

  it("the store source: loadProject's reset object carries gestureSnapshot: null", () => {
    const start = storeSource.indexOf("loadProject: (project)");
    const end = storeSource.indexOf("attachProject:", start);
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    const segment = storeSource.slice(start, end);
    expect(segment).toContain("gestureSnapshot: null");
  });

  it("the canvas source: the container wires onPointerCancel to the pointer-up end path", () => {
    // The canceled pointer stream must end the gesture through the same
    // path as pointer-up (endGesture when moved, cancelGesture when not,
    // the drag state reset) — per the Pointer Events spec a
    // pointercancel is NOT followed by pointerup.
    expect(canvasSource).toMatch(/onPointerCancel=\{onPointerUp\}/);
  });

  it("the canvas source: onPointerMove guards on buttons before mutating (the ghost-movement guard)", () => {
    // A hover pointermove (buttons === 0 — the button was released or
    // the pointer canceled elsewhere) must NOT drag/resize/pan: the
    // guard routes it to the end path instead of mutating.
    const fn = canvasSource.match(
      /function onPointerMove\(event: React\.PointerEvent[^)]*\)\s*\{([\s\S]*?)\n  \}/,
    );
    expect(fn).not.toBeNull();
    const body = fn![1];
    expect(body).toContain("event.buttons === 0");
    // The guard must precede every mutation branch (pan/move/resize).
    const guardIdx = body.indexOf("event.buttons === 0");
    const panIdx = body.indexOf('drag.kind === "pan"');
    const moveIdx = body.indexOf('drag.kind === "move"');
    expect(panIdx).toBeGreaterThan(-1);
    expect(moveIdx).toBeGreaterThan(-1);
    expect(guardIdx).toBeGreaterThan(-1);
    expect(guardIdx).toBeLessThan(panIdx);
    expect(guardIdx).toBeLessThan(moveIdx);
  });
});
