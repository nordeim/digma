import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The canvas seams batch (session 59, S59-F + S59-G — the seventh Mode C
// audit's A-L-2 and A-L-1).
//
// A-L-2: the space-to-pan effect registered only keydown/keyup on window
// — if the window lost focus while Space was held (alt-tab, OS dialog),
// the keyup never arrived, spaceDown stayed true, and the canvas silently
// locked into pan mode (left-clicks panned instead of selecting, cursor
// "grab") until the user happened to tap Space again. The fix: a blur
// listener that resets spaceDown — the keyup that never arrives can no
// longer strand the mode.
//
// A-L-1: the resize handles carried onPointerMove/onPointerUp pointing at
// the SAME shared handlers the container carries, and only the handle's
// pointerDown stopped propagation — every pointermove/up during a handle
// drag dispatched TWICE (the handle's handler + the bubbled container
// copy). Benign today (the resize patch is idempotent, endGesture no-ops
// the second call) but a latent trap for future non-idempotent drag
// logic. The fix: the handle's move/up wrappers stop propagation —
// mirroring the handle's own pointerDown seam.

const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);

describe("the spaceDown blur reset (session 59, S59-F / A-L-2)", () => {
  it("the space-to-pan effect registers a window blur listener", () => {
    const effectStart = canvasSource.indexOf("React.useEffect(() => {");
    // The space-pan effect is the one registering the Space keydown.
    const anchor = canvasSource.indexOf('event.code === "Space"');
    expect(anchor).toBeGreaterThan(-1);
    const effectStart2 = canvasSource.lastIndexOf("React.useEffect(() => {", anchor);
    const effectEnd = canvasSource.indexOf("}, []);", effectStart2);
    const effect = canvasSource.slice(effectStart2, effectEnd);
    expect(effect).toContain('window.addEventListener("blur"');
  });

  it("the blur handler resets spaceDown (the stranded pan mode clears)", () => {
    const anchor = canvasSource.indexOf('window.addEventListener("blur"');
    expect(anchor).toBeGreaterThan(-1);
    // The blur listener sits beside the keyup listener; its callback (or
    // the shared reset) sets spaceDown false.
    const windowEnd = canvasSource.indexOf("window.addEventListener", anchor + 10);
    const region = canvasSource.slice(
      canvasSource.lastIndexOf("function up", anchor),
      windowEnd === -1 ? anchor + 400 : windowEnd,
    );
    expect(region).toMatch(/setSpaceDown\(false\)/);
    // And the teardown releases it (no listener leak).
    const teardown = canvasSource.slice(
      canvasSource.indexOf("return () => {", anchor - 2000),
      canvasSource.indexOf("}, []);", anchor),
    );
    expect(teardown).toContain('window.removeEventListener("blur"');
  });
});

describe("the handle move/up stopPropagation (session 59, S59-G / A-L-1)", () => {
  it("the resize handles stop pointermove/up propagation (one dispatch per event)", () => {
    // The handle's pointerDown seam is the anchor: the handles are the
    // elements whose pointerDown calls stopPropagation.
    const handleAnchor = canvasSource.indexOf("onPointerDown");
    // Find the resize-handle render block (the one carrying
    // event.stopPropagation() in its pointerDown).
    const stopIdx = canvasSource.indexOf("event.stopPropagation()");
    expect(stopIdx).toBeGreaterThan(-1);
    // The handle render block around the first stopPropagation.
    const blockStart = canvasSource.lastIndexOf("<div", stopIdx);
    const blockEnd = canvasSource.indexOf("/>", stopIdx);
    const handleBlock = canvasSource.slice(blockStart, blockEnd);
    // The move/up handlers no longer point BARE at the shared handlers —
    // they wrap with stopPropagation.
    expect(handleBlock).not.toMatch(/onPointerMove=\{onPointerMove\}/);
    expect(handleBlock).not.toMatch(/onPointerUp=\{onPointerUp\}/);
    expect(handleBlock).toMatch(
      /onPointerMove=\{\(event\) => \{[^}]*stopPropagation[^}]*\}\}/,
    );
    expect(handleBlock).toMatch(
      /onPointerUp=\{\(event\) => \{[^}]*stopPropagation[^}]*\}\}/,
    );
  });
});
