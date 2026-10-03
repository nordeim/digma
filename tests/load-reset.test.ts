import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The loadProject viewport/tool reset (session 61, S61-C — the ninth
// Mode C audit's A-L-2).
//
// loadProject resets elements, selection, history, saveState and
// gestureSnapshot (the S57-A session boundary) — but NOT zoom, panX,
// panY or tool. The store is a module singleton that survives App
// Router soft navigation, so project B opens with project A's viewport
// (zoomed, panned — content possibly offscreen) and project A's armed
// tool (a left-armed Line tool DRAWS on the first click instead of
// selecting).

const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);

/** The loadProject action body (from the action name to attachProject). */
function loadProjectBody(): string {
  const start = storeSource.indexOf("loadProject: (project) =>");
  expect(start).toBeGreaterThan(-1);
  const end = storeSource.indexOf("attachProject:", start);
  expect(end).toBeGreaterThan(start);
  return storeSource.slice(start, end);
}

describe("the loadProject viewport/tool reset (session 61, S61-C / A-L-2)", () => {
  it("the load boundary resets the zoom to 100%", () => {
    // THE DEFECT PIN: pre-fix the set object carried no zoom — the
    // previous editor's zoom leaked into the next project.
    expect(loadProjectBody()).toMatch(/zoom:\s*1,/);
  });

  it("the load boundary resets the pan to the origin", () => {
    expect(loadProjectBody()).toMatch(/panX:\s*0,/);
    expect(loadProjectBody()).toMatch(/panY:\s*0,/);
  });

  it("the load boundary re-arms the Select tool (an armed draw tool must not survive navigation)", () => {
    expect(loadProjectBody()).toMatch(/tool:\s*"select",/);
  });
});
