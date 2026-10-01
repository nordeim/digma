import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The CanvasElement memoization contract (session 49, S49-1).
//
// The production-build performance profile (120 elements through the
// public API onto the standalone server) measured 60fps with zero long
// tasks — but the profile's code audit found the memoization the
// canvas.tsx COMMENTS describe ("non-frame elements keep their
// memoized renders across zoom changes") was never implemented:
// CanvasElement was a PLAIN function component, so every parent Canvas
// re-render re-executed ALL element render functions (the DOM diff
// no-ops, which is why the frame pacing still held — but the cost
// compounds with element count and element complexity).
//
// The store already does the immutable half (unchanged elements keep
// their object identity across updates), so React.memo's default
// shallow compare gives exactly the documented behavior: a drag
// re-renders only the dragged element, a selection change only the
// flipped members, a zoom change only frames (the `undefined` zoom
// discrimination for every other type).
//
// This suite pins the contract the way tests/theme.test.ts and
// tests/brand-mark.test.ts pin theirs — as a SOURCE contract (the
// runtime behavior stays pinned by the e2e drag/selection/zoom suites
// against the real DOM). A refactor that silently drops the memo (or
// disconnects the render site from the memoized component) fails here.

const source = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);

describe("CanvasElement memoization (session 49, S49-1 — the production performance contract)", () => {
  it("wraps CanvasElement in React.memo", () => {
    // The wrapper must exist — the exact form: a memoized binding of the
    // CanvasElement function.
    expect(source).toMatch(
      /const MemoizedCanvasElement = React\.memo\(CanvasElement\);/,
    );
  });

  it("the canvas render site consumes the memoized component", () => {
    // The elements map must render THROUGH the memo — wrapping the
    // function but rendering the unwrapped name would be a silent no-op.
    expect(source).toMatch(/<MemoizedCanvasElement/);
    expect(source).not.toMatch(/<CanvasElement[\s/>]/);
  });

  it("keeps the frame-only zoom discrimination (the memo's zoom lever)", () => {
    // Only frames consume the zoom (their label's counter-scale);
    // undefined for every other type is what keeps non-frame renders
    // memoized across zoom changes. Dropping the discrimination would
    // re-render ALL elements on every zoom step even with the memo.
    expect(source).toMatch(/el\.type === "frame" \? zoom : undefined/);
  });
});
