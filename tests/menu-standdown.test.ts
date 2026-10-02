import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The menu stand-down (session 57, S57-C — the fifth Mode C audit's M-3).
//
// The editor's global shortcut guard matched only
// [role="dialog"][data-state="open"] — the Download format menu renders
// role="menu" with data-state="open" (live-DOM verified: the menu present,
// the guard matching nothing), so while the menu was open the shortcuts
// stayed FULLY live: tool keys switched tools behind the menu, Delete
// deleted the invisible selection, ? stacked the shortcuts dialog over
// the menu, and Escape double-actioned (closed the menu AND deselected).
// The session-56 M-3 fix class, one role short.
//
// The fix: the guard's selector extends to open MENUS as well as open
// dialogs — the format menu joins the Radix dialogs and the PresentOverlay
// under the stand-down contract.

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

describe("the menu stand-down (session 57, S57-C / M-3)", () => {
  it("the shortcuts guard stands down behind an open MENU as well as an open dialog", () => {
    // The one selector covering both roles — the guard query.
    expect(viewSource).toMatch(
      /\[role="dialog"\]\[data-state="open"\],\s*\[role="menu"\]\[data-state="open"\]/,
    );
  });

  it("the guard still runs BEFORE any shortcut handling (the early return)", () => {
    const fn = viewSource.match(
      /function onKeyDown\(event: KeyboardEvent\) \{([\s\S]*?)\n    \}/,
    );
    expect(fn).not.toBeNull();
    const body = fn![1];
    const guardIdx = body.indexOf('document.querySelector');
    const typingIdx = body.indexOf("isTypingTarget(event.target)");
    const toolIdx = body.indexOf("TOOL_SHORTCUTS");
    expect(guardIdx).toBeGreaterThan(-1);
    expect(toolIdx).toBeGreaterThan(-1);
    // The guard precedes every tool/shortcut branch.
    expect(guardIdx).toBeLessThan(toolIdx);
    expect(typingIdx).toBeGreaterThan(-1);
  });
});
