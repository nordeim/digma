import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The space-to-pan exemption (session 57, S57-D — the fifth Mode C audit's
// M-5).
//
// The canvas's window-level space keydown called preventDefault() for
// every non-typing target — including BUTTONS. Space is a standard button
// activation key: with focus on ANY editor control (Back, Undo/Redo,
// Share, Present, toolbar tools, panel chips) the keydown's
// preventDefault() canceled the control's Space activation (Enter still
// worked). A keyboard user could not activate any editor control with
// Space while the canvas was mounted.
//
// The fix: the keydown exempts space-ACTIVATION targets (button, a,
// [role="button"], [role="slider"], [role="tab"], input, select,
// textarea — the interactive family) alongside the typing targets: Space
// activates the focused control instead of engaging the pan.

const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);

describe("the space-to-pan exemption (session 57, S57-D / M-5)", () => {
  it("an isSpaceActivationTarget helper exists beside isTypingTarget", () => {
    expect(canvasSource).toMatch(/function isSpaceActivationTarget\(target: EventTarget \| null\): boolean \{/);
    const fn = canvasSource.match(
      /function isSpaceActivationTarget\(target: EventTarget \| null\): boolean \{([\s\S]*?)\n\}/,
    );
    expect(fn).not.toBeNull();
    const body = fn![1];
    // The interactive family: buttons, links, and ARIA widgets.
    expect(body).toContain('"button"');
    expect(body).toContain('"a"');
    expect(body).toContain('role="button"');
    expect(body).toContain("closest");
  });

  it("the space keydown consults the exemption before preventDefault", () => {
    // Anchor at the space-to-pan comment — the wheel effect earlier in
    // the file would otherwise bleed into the capture.
    const eff = canvasSource.match(
      /---- space-to-pan[\s\S]*?function down\(event: KeyboardEvent\) \{([\s\S]*?)setSpaceDown\(true\);/,
    );
    expect(eff).not.toBeNull();
    const body = eff![1];
    expect(body).toContain("event.code === \"Space\"");
    expect(body).toContain("!isTypingTarget(event.target)");
    // The NEW exemption is consulted in the same condition…
    expect(body).toContain("!isSpaceActivationTarget(event.target)");
    // …and the preventDefault fires only inside it.
    const condIdx = body.indexOf("isSpaceActivationTarget");
    const pdIdx = body.indexOf("event.preventDefault()");
    expect(pdIdx).toBeGreaterThan(condIdx);
  });
});
