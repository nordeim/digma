import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { sanitizeLlmOperations } from "@/lib/ai-assistant";

// The zero-op LLM reply passthrough (session 60, S60-E — the eighth
// Mode C audit's B-L-3).
//
// sanitizeLlmOperations rejected with `if (!reply ||
// operations.length === 0) return null;` — a well-formed NON-EMPTY
// reply carrying zero operations returned null, so the route kept the
// deterministic fallback. With the LLM enabled (the production default
// — only e2e forces DIGMA_DISABLE_AI_LLM=1), any conversational model
// answer with no operations was thrown away and the user always saw
// the canned "I can add shapes…" reply instead of the model's answer.
// The client already handles empty operations[] safely (applied = 0).
//
// The fix: the guard splits — only an empty/missing reply rejects; a
// valid reply with zero operations flows through.

const libSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/ai-assistant.ts"),
  "utf8",
);

describe("the zero-op LLM reply passthrough (session 60, S60-E / B-L-3)", () => {
  it("the sanitizer no longer folds a zero-op reply into the reject", () => {
    // THE DEFECT PIN: pre-fix the combined guard rejected the zero-op
    // reply outright.
    expect(libSource).not.toMatch(/!reply \|\| operations\.length === 0\) return null/);
    // The split form: only the empty reply rejects.
    expect(libSource).toMatch(/if \(!reply\) return null;/);
  });

  it("a well-formed reply with ZERO operations passes through (the conversational answer reaches the user)", () => {
    const sanitized = sanitizeLlmOperations(
      { reply: "Your canvas is looking clean — nothing to change right now.", operations: [] },
      [],
    );
    // THE DEFECT PIN: pre-fix this returned null (the fallback won).
    expect(sanitized).not.toBeNull();
    expect(sanitized!.reply).toBe("Your canvas is looking clean — nothing to change right now.");
    expect(sanitized!.operations).toEqual([]);
  });

  it("an empty reply still rejects to the fallback (the degrade contract)", () => {
    expect(sanitizeLlmOperations({ reply: "", operations: [] }, [])).toBeNull();
    expect(sanitizeLlmOperations({ operations: [] }, [])).toBeNull();
    // And a reply WITH operations keeps the full passthrough contract.
    const withOps = sanitizeLlmOperations(
      {
        reply: "Adding a red circle.",
        operations: [{ op: "add", element: { type: "ellipse", fill: "#EF4444" } }],
      },
      [],
    );
    expect(withOps).not.toBeNull();
    expect(withOps!.operations).toHaveLength(1);
  });
});
