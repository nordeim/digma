import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isTypingTarget } from "../src/lib/editor";

// The session-83 client low batch (S83-A — the thirty-first audit's
// A83-M1, the headline).
//
// S83-A — THE DEFECT (A83-M1): the isTypingTarget carve-out missed
// input[type="color"]. The S64-G carve-out (a range input accepts no
// text — the keyboard shortcuts, above all Ctrl+Z, must not stand down
// behind a slider) never reached the color swatch: the Fill/Stroke/
// Text/Background pickers in the properties panel render
// <input type="color">, and after the native picker closes, focus
// rests on the swatch — the global keydown's isTypingTarget returns
// TRUE for it, so store.undo() never runs (the most likely next action
// after a color pick), Delete deletes nothing, tool keys and "?" are
// equally dead until the user clicks elsewhere. The byte-for-byte
// S64-G defect class on the one input type the carve-out never
// reached.
//
// THE FIX: the carve-out widens to `type !== "range" && type !==
// "color"` — the same one-line form, extended to the no-text input
// family's missing member.

const editorLibSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);

// A minimal HTMLElement stub for the predicate's runtime shape (the
// function reads tagName + type only — the cast is internal).
const stub = (tagName: string, type?: string): HTMLElement =>
  ({ tagName, ...(type ? { type } : {}) }) as unknown as HTMLElement;

// ---------------------------------------------------------------------------
// S83-A — the carve-out reaches the color swatch (A83-M1)
// ---------------------------------------------------------------------------

describe("the isTypingTarget carve-out reaches the color swatch (S83-A / A83-M1)", () => {
  it("BEHAVIORAL — a focused color input is NOT a typing target (Ctrl+Z must reach the editor, the S64-G rationale verbatim)", () => {
    // THE DEFECT PIN: pre-fix the predicate returns TRUE for a color
    // input — the undo shortcut stands down behind the Fill/Stroke
    // swatch with focus resting on it.
    expect(isTypingTarget(stub("INPUT", "color"))).toBe(false);
  });

  it("BEHAVIORAL — the range sibling keeps its carve-out (the S64-G survivor, unchanged)", () => {
    expect(isTypingTarget(stub("INPUT", "range"))).toBe(false);
  });

  it("BEHAVIORAL — text-family inputs keep the exemption (typing must never trigger shortcuts)", () => {
    expect(isTypingTarget(stub("INPUT", "text"))).toBe(true);
    expect(isTypingTarget(stub("INPUT", "password"))).toBe(true);
    expect(isTypingTarget(stub("INPUT", "email"))).toBe(true);
  });

  it("BEHAVIORAL — the non-input typing surfaces keep the exemption (the standing contract)", () => {
    expect(isTypingTarget(stub("TEXTAREA"))).toBe(true);
    expect(isTypingTarget(stub("SELECT"))).toBe(true);
    expect(
      isTypingTarget({ tagName: "DIV", isContentEditable: true } as unknown as HTMLElement),
    ).toBe(true);
    expect(isTypingTarget(null)).toBe(false);
  });

  it("SOURCE — the predicate line carries both no-text carve-outs", () => {
    // THE DEFECT PIN: pre-fix the line reads `return type !== "range";`
    // — the color member of the no-text family is absent.
    expect(editorLibSource).toMatch(
      /const type = \(el as HTMLInputElement\)\.type;\s*return type !== "range" && type !== "color";/,
    );
  });

  it("SOURCE — the docblock names the color member (the family's rationale comment follows the code)", () => {
    expect(editorLibSource).toMatch(/type="color"/);
    expect(editorLibSource).toMatch(/swatch|color input/i);
  });
});
