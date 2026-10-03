import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The color-picker coalescing (session 66, S66-B — the fourteenth
// audit's A-3, the MEDIUM).
//
// THE DEFECT: the native color-picker surfaces committed a full
// history snapshot PER picker change event. Chrome's picker fires
// continuous input events while dragging in the popup; React's
// onChange maps to them; no gesture was armed on those surfaces, so
// the update helper's gesture-aware commit argument read TRUE and
// every intermediate color pushed a full 60-deep snapshot — one
// picker drag flooded the history stack and evicted earlier work,
// with per-intermediate-color undo granularity. The affected
// surfaces: HexColorRow's swatch (Fill, Stroke, Text Color,
// Background Color), the gradient stop colors, and the
// setBackgroundColor store action (which pushed past unconditionally).
//
// THE FIX: the swatch family rides the idle-coalesced burst — the
// onChange feeds textTick BEFORE the value commit (the first event
// arms on demand, each subsequent event re-arms the 150ms idle, the
// idle or the popup-close blur ends the burst with its ONE entry),
// and setBackgroundColor's history push becomes gesture-aware,
// matching updateElements' commit form.

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);

function componentWindow(source: string, name: string): string {
  const start = source.indexOf(`function ${name}(`);
  expect(start).toBeGreaterThan(-1);
  const end = source.indexOf("\n}\n", start);
  return source.slice(start, end);
}

describe("HexColorRow's swatch (session 66, S66-B / A-3)", () => {
  it("the swatch commits through the idle-coalesced tick BEFORE the value commit", () => {
    // THE DEFECT PIN: pre-fix the swatch's onChange handed the value
    // straight to the row's onChange — a continuous popup drag pushed
    // a snapshot per intermediate color.
    const w = componentWindow(panelSource, "HexColorRow");
    const swatch = w.match(/type="color"[\s\S]*?\/>/);
    expect(swatch).not.toBeNull();
    expect(swatch![0]).toMatch(/sliderGesture\.textTick\(\)/);
    expect(swatch![0]).toMatch(/onChange\(event\.target\.value\)/);
    const tickIdx = swatch![0].indexOf("sliderGesture.textTick()");
    const commitIdx = swatch![0].indexOf("onChange(event.target.value)");
    expect(tickIdx).toBeGreaterThan(-1);
    expect(commitIdx).toBeGreaterThan(tickIdx);
  });

  it("the swatch finishes the burst on blur — the popup close ends it immediately", () => {
    // THE DEFECT PIN: pre-fix the swatch had no blur terminal — the
    // burst ended only via the 150ms idle after the popup closed.
    const w = componentWindow(panelSource, "HexColorRow");
    const swatch = w.match(/type="color"[\s\S]*?\/>/);
    expect(swatch).not.toBeNull();
    expect(swatch![0]).toMatch(/onBlur=\{\(\) => sliderGesture\.finish\("text"\)\}/);
  });

  it("the hex TEXT input stays a discrete keyboard commit (no gesture wiring)", () => {
    // PRESERVATION: the S62-A doctrine — keyboard-only changes are
    // discrete intent. A full #rrggbb entry commits exactly once; the
    // empty clear commits once. Wiring the text input into the burst
    // seam would COALESCE two separate typed entries into one undo
    // step — the wrong contract for a field whose commits are already
    // discrete.
    const w = componentWindow(panelSource, "HexColorRow");
    const text = w.match(/type="text"[\s\S]*?\/>/);
    expect(text).not.toBeNull();
    expect(text![0]).not.toMatch(/sliderGesture\./);
  });
});

describe("the gradient stop colors (session 66, S66-B / A-3)", () => {
  it("the stop swatch rides the same burst wiring", () => {
    // THE DEFECT PIN: pre-fix the stop color swatch committed per
    // change event — a stop-color picker drag flooded the stack the
    // same way.
    const stop = panelSource.match(/aria-label=\{`Stop \$\{index \+ 1\} color`\}[\s\S]*?\/>/);
    expect(stop).not.toBeNull();
    expect(stop![0]).toMatch(/sliderGesture\.textTick\(\)/);
    expect(stop![0]).toMatch(/onBlur=\{\(\) => sliderGesture\.finish\("text"\)\}/);
    const tickIdx = stop![0].indexOf("sliderGesture.textTick()");
    const commitIdx = stop![0].indexOf("setStop(index");
    expect(tickIdx).toBeGreaterThan(-1);
    expect(commitIdx).toBeGreaterThan(tickIdx);
  });
});

describe("setBackgroundColor's gesture-aware history (session 66, S66-B / A-3)", () => {
  // the action's full body — the double-closing-paren terminator is
  // the action's own (the single-}),  form would run past it into the
  // store's following gesture members and match THEIR snapshot reads)
  function backgroundColorAction(): string {
    const start = storeSource.indexOf("setBackgroundColor: (color) =>");
    expect(start).toBeGreaterThan(-1);
    const end = storeSource.indexOf("})),", start);
    expect(end).toBeGreaterThan(start);
    return storeSource.slice(start, end);
  }

  it("the history push is conditional on the live gesture — mid-burst commits are history-free", () => {
    // THE DEFECT PIN: pre-fix the action pushed past UNCONDITIONALLY
    // — the swatch's burst arming did not reach the background row's
    // history at all. The conditional matches updateElements' commit
    // form: the armed gesture's terminal endGesture pushes the ONE
    // pre-picker snapshot.
    const body = backgroundColorAction();
    expect(body).toMatch(/state\.gestureSnapshot/);
    expect(body).toMatch(/past: \[\.\.\.state\.past, snapshotOf\(state\)\]\.slice\(-60\)/);
    // the conditional form: a truthy gesture skips the push
    const conditional = body.match(/state\.gestureSnapshot\s*\?[\s\S]*?:/);
    expect(conditional).not.toBeNull();
  });

  it("the action still flips saveState and writes the color (the S60-A response-guard inputs)", () => {
    // PRESERVATION: the autosave's response-time guard compares the
    // captured backgroundColor BESIDE the elements (S60-A) — the
    // action's observable writes stay exactly.
    const body = backgroundColorAction();
    expect(body).toMatch(/backgroundColor: color/);
    expect(body).toMatch(/saveState: "unsaved"/);
  });
});
