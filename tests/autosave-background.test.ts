import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The autosave background-color mid-flight guard (session 60, S60-A —
// the eighth Mode C audit's A-1, the Medium).
//
// The S56-B edit-during-flight guard compared ONLY the elements array
// reference before markSaved. setBackgroundColor flips saveState to
// "unsaved" WITHOUT touching the elements reference, so a Background
// Color change landing while the PUT was in flight passed the guard,
// markSaved stamped "saved", and the armed retry timer early-returned
// on "saved" — the new color was silently never PUT and reverted on
// reload while the badge read "Saved". The PUT body already carried
// backgroundColor: capturedBackgroundColor (S57-B); the response-time
// compare was simply missing.
//
// The fix: the background compare beside the elements compare — the
// same keep-the-newer-state doctrine, closing the body's other half.

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

/** The response-time guard block of the autosave machine. */
function guardBlock(): string {
  const start = viewSource.indexOf("if (now.elements !== capturedElements)");
  expect(start).toBeGreaterThan(-1);
  const end = viewSource.indexOf("now.markSaved(", start);
  expect(end).toBeGreaterThan(start);
  return viewSource.slice(start, end);
}

describe("the autosave background-color mid-flight guard (session 60, S60-A / A-1)", () => {
  it("the response-time guard compares the captured background beside the elements", () => {
    const block = guardBlock();
    // THE DEFECT PIN: pre-fix the guard had ONLY the elements compare —
    // a setBackgroundColor landing mid-flight passed it untouched.
    expect(block).toContain("now.backgroundColor !== capturedBackgroundColor");
    // The compare keeps the newer state (setUnsaved + return), exactly
    // the elements guard's own doctrine.
    const bgGuard = block.slice(
      block.indexOf("now.backgroundColor !== capturedBackgroundColor"),
    );
    expect(bgGuard).toMatch(/setUnsaved\(\);\s*return;/);
  });

  it("the guard runs BEFORE markSaved stamps saved (the ordering contract)", () => {
    const block = guardBlock();
    const bgIndex = block.indexOf("now.backgroundColor !== capturedBackgroundColor");
    const elementsIndex = block.indexOf("now.elements !== capturedElements");
    const markSavedIndex = viewSource.indexOf("now.markSaved(", viewSource.indexOf("if (now.elements !== capturedElements)"));
    // Both compares live in the same pre-markSaved block…
    expect(bgIndex).toBeGreaterThan(-1);
    expect(elementsIndex).toBeGreaterThan(-1);
    expect(markSavedIndex).toBeGreaterThan(Math.max(bgIndex, elementsIndex));
  });

  it("the elements reference guard itself is preserved (the S56-B contract)", () => {
    const block = guardBlock();
    expect(block).toContain("if (now.elements !== capturedElements)");
    expect(block).toMatch(/setUnsaved\(\);\s*return;/);
    // The PUT body still carries the captured background (the S57-B
    // captured-state contract — untouched by this fix).
    expect(viewSource).toContain("backgroundColor: capturedBackgroundColor,");
  });
});
