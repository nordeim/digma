import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { textAlignToJustify } from "../src/lib/editor";

// The session-73 text-alignment parity pass (S73-A — the twenty-first
// audit's A-F1/A-F2/A-F3).
//
// THE DEFECT: the canvas maps the text element's textAlign to
// justify-content so the alignment is VISIBLE on a flex row (the measured
// reference contract, canvas.tsx:676-685) — but the PresentOverlay and the
// CanvasThumbnail set display:flex + alignItems:center + textAlign with NO
// justifyContent. A flex item's content-sized text node ignores
// text-align, so a CENTERED text element rendered LEFT-ALIGNED in
// presentation mode and in every 320x200 card thumbnail while the canvas,
// the PNG export, and the SVG export render it centered — one model field,
// three render surfaces, two of them wrong.
//
// THE MASK: the S58-E fix's comment cites a "canvasStyleFor" seam in
// src/lib/editor.ts that DOES NOT EXIST (grep: four comment citations,
// zero exports) — the phantom "EXACT contract" claim hid the divergence
// for 15 sessions.
//
// THE FIX: the pure textAlignToJustify seam (src/lib/editor.ts) consumed
// by ALL THREE render sites; the phantom citation corrected to the real
// seam.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("textAlignToJustify — the pure seam (S73-A)", () => {
  it("maps the three stored alignments onto the flex-row justification", () => {
    expect(textAlignToJustify("left")).toBe("flex-start");
    expect(textAlignToJustify("center")).toBe("center");
    expect(textAlignToJustify("right")).toBe("flex-end");
  });

  it("the unset field falls back to left (the canvas's ?? left contract)", () => {
    expect(textAlignToJustify(undefined)).toBe("flex-start");
    expect(textAlignToJustify(null)).toBe("flex-start");
    expect(textAlignToJustify("")).toBe("flex-start");
  });

  it("an unknown value degrades to flex-start, never throws (the hand-rolled validation doctrine)", () => {
    expect(textAlignToJustify("justified" as unknown as string)).toBe("flex-start");
  });
});

describe("the three consumption sites (the parity contract)", () => {
  const canvas = src("src/components/editor/canvas.tsx");
  const view = src("src/components/editor/editor-view.tsx");
  const card = src("src/components/project-card.tsx");

  it("the canvas consumes the seam (the ternary folded into the one mapping)", () => {
    // THE PRESERVATION PIN: the ground-truth surface migrates onto the
    // seam — behavior identical, ONE mapping left in the codebase.
    expect(canvas).toMatch(/style\.justifyContent = textAlignToJustify\(/);
    expect(canvas).toMatch(/import \{[^}]*textAlignToJustify[^}]*\} from "@\/lib\/editor"/);
    // The hand-rolled ternary is gone (the fold's whole point).
    expect(canvas).not.toMatch(
      /justifyContent = \(\s*align === "center" \? "center" : align === "right"/,
    );
  });

  it("the PresentOverlay maps the alignment (the S58-E half the canvas always had)", () => {
    // THE DEFECT PIN: pre-fix the present text branch carries NO
    // justifyContent — centered text renders left-aligned in Present.
    const presentStyle = view.match(
      /transform: `rotate\(\$\{el\.rotation\}deg\) scale\(\$\{el\.scale \?\? 1\}\)`,[\s\S]*?justifyContent: \(el\.type === "text"\s*\?\s*textAlignToJustify\(el\.textAlign\)\s*: undefined\)/,
    );
    expect(presentStyle).not.toBeNull();
    // The mapping rides the text branch (undefined for every other type).
    expect(presentStyle![0]).toMatch(/justifyContent: \(el\.type === "text"/);
  });

  it("the CanvasThumbnail maps the alignment (every card thumbnail renders it)", () => {
    // THE DEFECT PIN: pre-fix the thumbnail text branch carries NO
    // justifyContent — the Dashboard/Recent cards show left-aligned text.
    const thumbStyle = card.match(
      /display: el\.type === "text" \? "flex" : undefined,[\s\S]*?justifyContent: \(el\.type === "text"\s*\?\s*textAlignToJustify\(el\.textAlign\)\s*: undefined\)/,
    );
    expect(thumbStyle).not.toBeNull();
    // The mapping rides the text branch (undefined for every other type).
    expect(thumbStyle![0]).toMatch(/justifyContent: \(el\.type === "text"/);
    expect(card).toMatch(/import \{[^}]*textAlignToJustify[^}]*\} from "@\/lib\/editor"/);
  });
});

describe("the phantom citation retired (A-F3 — the honesty pin)", () => {
  it("no source or test file cites the nonexistent canvasStyleFor seam anymore", () => {
    for (const rel of [
      "src/components/editor/editor-view.tsx",
      "tests/present-text.test.ts",
      "tests/e2e/session58-fixes.spec.ts",
    ]) {
      expect(src(rel)).not.toContain("canvasStyleFor");
    }
  });

  it("the present-text test header now cites the real seam it preserves", () => {
    const presentText = src("tests/present-text.test.ts");
    expect(presentText).toMatch(/textAlignToJustify/);
  });
});
