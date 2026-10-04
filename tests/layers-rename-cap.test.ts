import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session 63 (S63-D / B-L3 — the eleventh audit's Low): the layers
// rename input had no maxLength — the server clamps names at 80 (the
// row-builder's text clamp in the elements route — session 71 folded
// the twin helpers into the ONE clampText), so a >80-char rename showed locally and silently truncated
// after reload (the known name-cap drift family on a new surface). The
// fix: maxLength={80} on the rename input, matching the server clamp
// exactly.

const layersSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/layers-panel.tsx"),
  "utf8",
);

describe("the layers rename cap (session 63, S63-D / B-L3)", () => {
  it("the rename input caps at 80 characters, matching the server's name clamp", () => {
    // THE DEFECT PIN: pre-fix the input carried no maxLength — the local
    // edit and the persisted row diverged past 80 chars.
    const renamingIndex = layersSource.indexOf("renaming === el.id");
    const inputIndex = layersSource.indexOf("<input", renamingIndex);
    const inputEnd = layersSource.indexOf("/>", inputIndex);
    const inputTag = layersSource.slice(inputIndex, inputEnd);
    expect(inputTag).toContain("maxLength={80}");
  });
});
