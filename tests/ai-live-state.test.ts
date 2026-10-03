import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The AI apply live-state re-read (session 61, S61-E — the ninth Mode
// C audit's A-L-3).
//
// applyOperations captured useEditorStore.getState() ONCE before the
// operation loop (ai-assistant.tsx:66); the update/delete branches
// filtered ids against that stale `store.elements` AFTER earlier
// operations in the same batch had already mutated the live store. A
// multi-op LLM reply that deletes id X and then updates/deletes X
// again passed the stale membership check, ran a no-op over the
// missing id, pushed a junk undo entry, flipped saveState to "unsaved"
// (a spurious PUT), and inflated the honest `applied` count.
//
// The fix re-reads the LIVE state per operation branch.

const aiSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);

describe("the AI apply live-state re-read (session 61, S61-E / A-L-3)", () => {
  it("the update branch filters ids against the LIVE elements, not the pre-loop snapshot", () => {
    // THE DEFECT PIN: pre-fix the branch read the captured
    // `store.elements` — stale after the batch's own mutations.
    const branchStart = aiSource.indexOf('} else if (operation.op === "update") {');
    expect(branchStart).toBeGreaterThan(-1);
    const branchEnd = aiSource.indexOf('} else if (operation.op === "delete") {', branchStart);
    const branch = aiSource.slice(branchStart, branchEnd);
    expect(branch).toContain("useEditorStore.getState().elements");
    expect(branch).not.toMatch(/store\.elements\.some/);
  });

  it("the delete branch filters ids and locks against the LIVE elements", () => {
    const branchStart = aiSource.indexOf('} else if (operation.op === "delete") {');
    expect(branchStart).toBeGreaterThan(-1);
    const branchEnd = aiSource.indexOf("applied += 1;", branchStart);
    const branch = aiSource.slice(branchStart, branchEnd);
    expect(branch).toContain("useEditorStore.getState().elements");
    expect(branch).not.toMatch(/store\.elements\.some/);
  });
});
