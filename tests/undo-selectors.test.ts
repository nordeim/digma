import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The shell's boolean undo selectors (session 62, S62-B — the tenth
// audit's A-M3).
//
// THE DEFECT: the editor shell subscribed to the `past` and `future`
// ARRAYS — every committed mutation (each keystroke in the Content
// input, each slider tick pre-S62-A, each toggle) creates a new array
// identity, so EditorView re-rendered its whole subtree (Toolbar,
// LayersPanel, ComponentsPanel, PropertiesPanel, Canvas, AiAssistant —
// none memoized) per event. The undo/redo buttons only ever read
// `past.length === 0` / `future.length === 0`.
//
// THE FIX: the shell subscribes to the booleans the buttons depend
// on — `canUndo`/`canRedo` via `s.past.length > 0` selector — and
// re-renders only on the empty<->non-empty flip.

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

describe("the shell's boolean undo selectors (session 62, S62-B / A-M3)", () => {
  it("the shell subscribes to the undo/redo booleans, not the arrays", () => {
    // THE DEFECT PIN: pre-fix the shell held the array subscriptions:
    //   const past = useEditorStore((s) => s.past);
    //   const future = useEditorStore((s) => s.future);
    expect(viewSource).toMatch(/const canUndo = useEditorStore\(\(s\) => s\.past\.length > 0\);/);
    expect(viewSource).toMatch(/const canRedo = useEditorStore\(\(s\) => s\.future\.length > 0\);/);
  });

  it("the array subscriptions are gone and the buttons read the booleans", () => {
    // THE DEFECT PIN: the array subscriptions re-rendered the shell on
    // every committed mutation.
    expect(viewSource).not.toMatch(/const past = useEditorStore\(\(s\) => s\.past\);/);
    expect(viewSource).not.toMatch(/const future = useEditorStore\(\(s\) => s\.future\);/);
    // The buttons' disabled props read the booleans.
    expect(viewSource).toMatch(/disabled=\{!canUndo\}/);
    expect(viewSource).toMatch(/disabled=\{!canRedo\}/);
  });
});
