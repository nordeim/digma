import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The tool-shortcut modifier bail (session 60, S60-B — the eighth Mode C
// audit's A-2).
//
// The keydown handler's meta branches intercepted only z/y/=/-/0 and
// returned; every OTHER modifier chord fell through to
// toolForShortcut(event.key). Ctrl+F (browser find), Ctrl+P (print),
// Ctrl+O, Cmd+V etc. reached the page with key "f"/"p"/"o"/"v" — the
// browser performed its native action AND the editor silently switched
// to Frame/Pen/Ellipse/Select behind the user's back.
//
// The fix: the handler bails before the tool dispatch when
// ctrl/meta/alt is held — tool keys are single-key shortcuts by
// contract (the toolbar's "(V)" titles); a modifier chord is either an
// intercepted editor action (z/y/=/-/0, already returned) or a
// browser/OS action the editor must leave alone.

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

/** The tool-dispatch tail of the keydown handler. */
function toolDispatchRegion(): string {
  const start = viewSource.indexOf("const tool = toolForShortcut(event.key);");
  expect(start).toBeGreaterThan(-1);
  // Back up to the head of the handler for the modifier-bail check.
  const handlerStart = viewSource.lastIndexOf("function onKeyDown(event: KeyboardEvent)", start);
  expect(handlerStart).toBeGreaterThan(-1);
  return viewSource.slice(handlerStart, start + 60);
}

describe("the tool-shortcut modifier bail (session 60, S60-B / A-2)", () => {
  it("the handler bails on modifier chords BEFORE the tool dispatch", () => {
    const region = toolDispatchRegion();
    // THE DEFECT PIN: pre-fix no modifier guard sat between the
    // intercepted meta branches and the tool dispatch.
    expect(region).toMatch(/event\.ctrlKey \|\| event\.metaKey \|\| event\.altKey/);
    // The bail returns (the chord is not the editor's business), and it
    // precedes the toolForShortcut call. Anchor on the exact STATEMENT —
    // the S60-B explanatory comment itself mentions
    // "toolForShortcut(event.key)", so a bare indexOf would find the
    // comment first (the anchor must be the code, not the prose).
    const bail = region.indexOf("event.ctrlKey || event.metaKey || event.altKey");
    const dispatch = region.indexOf("const tool = toolForShortcut(event.key);");
    expect(bail).toBeGreaterThan(-1);
    expect(dispatch).toBeGreaterThan(bail);
    const bailBlock = region.slice(bail);
    expect(bailBlock).toMatch(/return;/);
  });

  it("the plain single-key tool dispatch is preserved (the S48-1 seam)", () => {
    expect(viewSource).toContain("const tool = toolForShortcut(event.key);");
    expect(viewSource).toContain("if (tool) store.setTool(tool);");
    // The intercepted meta actions keep their own contracts.
    expect(viewSource).toMatch(/meta && event\.key\.toLowerCase\(\) === "z"/);
    expect(viewSource).toMatch(/meta && event\.key === "0"/);
  });
});
