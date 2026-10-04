import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The PresentOverlay text fidelity (session 58, S58-E — the sixth Mode C
// audit's B-M-1).
//
// The present-mode element style carried NO whiteSpace and NO overflow
// (and fontSize ?? undefined instead of the canvas's ?? 16), while the
// canvas text chain (the inline CanvasElement style block + the shared
// textAlignToJustify seam, src/lib/editor.ts) renders text with
// whiteSpace: "pre-wrap" + overflow: "hidden" + fontSize ?? 16 +
// fontWeight ?? "500". Multi-line text collapsed to one overflowing line
// in Present mode — the seeded project's own Headline
// ("Design faster,\ntogether.") is the live datum.
//
// The fix: the present overlay's text branch adopts the canvas seam's
// exact contract.

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const editorSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);

// The PresentOverlay's element style block (the presentation branch —
// the style object carrying transformOrigin "0px 0px" + fillPaintFor).
const presentStyle = viewSource.match(
  /transform: `rotate\(\$\{el\.rotation\}deg\) scale\(\$\{el\.scale \?\? 1\}\)`,[\s\S]*?textAlign:[^,]+,/,
);

describe("the PresentOverlay text fidelity (session 58, S58-E / B-M-1)", () => {
  it("the present text renders pre-wrap whitespace (newlines preserved)", () => {
    expect(presentStyle).not.toBeNull();
    expect(presentStyle![0]).toMatch(
      /whiteSpace: el\.type === "text" \? "pre-wrap" : undefined/,
    );
  });

  it("the present text clips its overflow (the canvas contract)", () => {
    expect(presentStyle![0]).toMatch(
      /overflow: el\.type === "text" \? "hidden" : undefined/,
    );
  });

  it("the present text defaults fontSize 16 and fontWeight 500 (the canvas text chain contract)", () => {
    expect(presentStyle![0]).toMatch(
      /fontSize: el\.type === "text" \? el\.fontSize \?\? 16 : undefined/,
    );
    expect(presentStyle![0]).toMatch(
      /fontWeight: el\.type === "text" \? el\.fontWeight \?\? "500" : undefined/,
    );
    // The canvas seam these must match (the preservation reference).
    expect(editorSource).toMatch(/style\.fontSize = `\$\{el\.fontSize \?\? 16\}px`;/);
    expect(editorSource).toMatch(/style\.fontWeight = el\.fontWeight \?\? "500";/);
    expect(editorSource).toMatch(/style\.whiteSpace = "pre-wrap";/);
    expect(editorSource).toMatch(/style\.overflow = "hidden";/);
  });
});
