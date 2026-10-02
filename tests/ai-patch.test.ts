import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The AI patch scale siblings (session 57, S57-E — the fifth Mode C
// audit's M-6).
//
// An update op carrying `scale` hit a dedicated branch that ended in
// `continue` — skipping the updateElements call, so any fill/opacity/
// width/height/text built into the SAME patch was silently discarded.
// The LLM sanitizer CAN produce combined patches (all six fields copied
// into one patch), so "make the button red and 25% bigger" applied only
// the scale while the reply footer reported the action as performed —
// violating the file's own honest-count doctrine.
//
// The fix: the scale branch loses its early exit — scaleElements applies,
// then the remaining sibling fields flow through updateElements as usual;
// `applied` counts the operation once (a did-flag).

const aiSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);

/** The update branch of applyOperations. */
function updateBranch(): string {
  const start = aiSource.indexOf('operation.op === "update"');
  const end = aiSource.indexOf('operation.op === "delete"', start);
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return aiSource.slice(start, end);
}

describe("the AI patch scale siblings (session 57, S57-E / M-6)", () => {
  it("the scale branch no longer CONTINUES past its sibling fields", () => {
    const branch = updateBranch();
    const scaleIdx = branch.indexOf("scaleElements(targets");
    const updateIdx = branch.indexOf("store.updateElements(targets");
    expect(scaleIdx).toBeGreaterThan(-1);
    expect(updateIdx).toBeGreaterThan(scaleIdx);
    // No early exit between the scale application and the sibling
    // updateElements — the old `continue` discarded the patch.
    const between = branch.slice(scaleIdx, updateIdx);
    expect(between).not.toMatch(/\bcontinue\b/);
  });

  it("one operation increments applied at most once (the did-flag)", () => {
    const branch = updateBranch();
    // The did-flag pattern: both halves set a flag; ONE conditional
    // increment at the end.
    expect(branch).toMatch(/let did = false/);
    expect(branch).toMatch(/if \(did\) applied \+= 1/);
    // Exactly ONE applied increment in the whole update branch.
    const increments = branch.match(/applied \+= 1/g) ?? [];
    expect(increments.length).toBe(1);
  });
});
