import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The ctrl+wheel native listener (session 56, S56-F — the Mode C audit's
// M-6).
//
// The React onWheel handler zoomed the canvas but never called
// preventDefault — in a real browser ctrl+wheel (and trackpad pinch,
// delivered as ctrl+wheel) is NATIVE page zoom, so the whole app zoomed
// AND the canvas zoomed simultaneously. React 17+ registers root wheel
// listeners as PASSIVE (a preventDefault inside a JSX handler would not
// work either) — the fix must be a native non-passive listener on the
// canvas container.

const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);

describe("the ctrl+wheel native listener (session 56, S56-F / M-6)", () => {
  it("a native wheel listener is registered NON-PASSIVE on the container", () => {
    expect(canvasSource).toMatch(/addEventListener\("wheel", onWheelNative, \{ passive: false \}\)/);
  });

  it("the ctrl/meta branch PREVENTS the browser's page zoom", () => {
    expect(canvasSource).toMatch(
      /if \(event\.ctrlKey \|\| event\.metaKey\) \{\s*event\.preventDefault\(\);/,
    );
  });

  it("the passive React onWheel prop is GONE (one wheel path, not two)", () => {
    expect(canvasSource).not.toMatch(/onWheel=\{onWheel\}/);
  });
});
