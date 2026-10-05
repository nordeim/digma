import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { sanitizeLlmOperations } from "../src/lib/ai-assistant";

// The session-68 sanitizer hardening batch (S68-C — the sixteenth
// audit's L-A + L-3, the latter carrying the documented 9d "inert
// sanitizer type cast").
//
// THE DEFECTS: (L-A, NEW) `sanitizeLlmOperations` accepts an
// unbounded LLM-chosen `ids` array — `rawIds.filter(typeof string)`
// with no length cap (the route caps the CLIENT's own targetIds at
// 100, but the model's reply is uncapped; a hallucinating model
// returning a huge ids array drives O(ids x elements) membership
// filters at the client seam). (L-3) two `as never`-family casts
// punch through the store's typing at the AI apply boundary — the
// sanitizer's conditional type resolves to `never` (the cast never
// happens; a Record<string, unknown> flows into the operations array
// with zero checking) and the client passes its patch to
// store.updateElements through the same loophole.
//
// THE FIX: the ids gain the route's own 100 cap; the update variant's
// patch type becomes the exported `AssistantUpdatePatch`; both casts
// are deleted — the sanitizer builds a typed patch and the client
// builds a Partial<DesignElementDTO>.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the sanitizer caps the LLM-chosen ids (S68-C / L-A)", () => {
  it("a 150-id LLM reply survives as exactly 100 (the route's own targetIds cap mirrored)", () => {
    const ids = Array.from({ length: 150 }, (_, i) => `el-${i}`);
    const result = sanitizeLlmOperations(
      { reply: "done", operations: [{ op: "delete", ids }] },
      [],
    );
    expect(result).not.toBeNull();
    expect(result!.operations).toHaveLength(1);
    expect(result!.operations[0]).toMatchObject({ op: "delete" });
    expect((result!.operations[0] as { ids: string[] }).ids).toHaveLength(100);
    expect((result!.operations[0] as { ids: string[] }).ids[0]).toBe("el-0");
    expect((result!.operations[0] as { ids: string[] }).ids[99]).toBe("el-99");
  });

  it("a small ids array passes verbatim (preservation)", () => {
    const result = sanitizeLlmOperations(
      { reply: "done", operations: [{ op: "delete", ids: ["a", "b"] }] },
      [],
    );
    expect(result!.operations[0]).toMatchObject({ op: "delete", ids: ["a", "b"] });
  });

  it("the update branch's ids obey the same cap", () => {
    const ids = Array.from({ length: 120 }, (_, i) => `el-${i}`);
    const result = sanitizeLlmOperations(
      { reply: "done", operations: [{ op: "update", ids, patch: { opacity: 0.5 } }] },
      [],
    );
    const op = result!.operations[0] as { op: string; ids: string[] };
    expect(op.ids).toHaveLength(100);
  });

  it("the source carries the slice form on the ids filter", () => {
    const source = src("src/lib/ai-assistant.ts");
    // Session 78 (S78-E / B-L2) RE-ANCHOR: the filter gained the S77-F
    // per-string clamp (i.length <= 64 — the route-side mirror re-run);
    // the S68-C CONTRACT (the count cap via .slice(0, 100) beside the
    // string filter) is unchanged — the pin's form now matches the
    // clamped filter.
    expect(source).toMatch(
      /rawIds\.filter\(\(i\): i is string => typeof i === "string" && i\.length <= 64\)\n?\s*\.slice\(0, 100\)/,
    );
  });
});

describe("the AI apply boundary carries no never-cast (S68-C / L-3)", () => {
  it("the sanitizer builds a typed patch — the broken conditional cast is gone", () => {
    const source = src("src/lib/ai-assistant.ts");
    expect(source).not.toMatch(/as AiOperation extends/);
    expect(source).not.toMatch(/patch as never/);
    // The named, exported patch type the variant consumes.
    expect(source).toMatch(/export type AssistantUpdatePatch = \{/);
  });

  it("the client applies the patch through the store's own type — no never loophole", () => {
    const source = src("src/components/editor/ai-assistant.tsx");
    expect(source).not.toMatch(/as never/);
    expect(source).toMatch(/store\.updateElements\(targets, patch\)/);
  });

  it("the sanitized patch VALUES are unchanged (the typing is not a behavior change)", () => {
    // The clamped field set survives exactly: fill hex-validated,
    // opacity clamped 0..1, width 1..20000, height 0..20000, scale
    // 0.05..20, text sliced to 500 — the pre-fix behavior, re-pinned.
    const result = sanitizeLlmOperations(
      {
        reply: "done",
        operations: [
          {
            op: "update",
            ids: ["a"],
            patch: {
              fill: "#00ff00",
              opacity: 7,
              width: 999999,
              height: -5,
              scale: 100,
              text: "x".repeat(600),
            },
          },
        ],
      },
      [],
    );
    const patch = (result!.operations[0] as { patch: Record<string, unknown> }).patch;
    expect(patch.fill).toBe("#00ff00");
    expect(patch.opacity).toBe(1);
    expect(patch.width).toBe(20000);
    expect(patch.height).toBe(0);
    expect(patch.scale).toBe(20);
    expect((patch.text as string).length).toBe(500);
    // An invalid hex still degrades to absence (the S59-C contract) —
    // an invalid-hex-ONLY patch leaves the op empty, and the empty
    // patch drops the operation (the pre-fix `continue`, preserved).
    const bad = sanitizeLlmOperations(
      { reply: "done", operations: [{ op: "update", ids: ["a"], patch: { fill: "#00ff0" } }] },
      [],
    );
    expect(bad!.operations).toHaveLength(0);
    // ...and a VALID sibling field keeps the op with the fill absent.
    const mixed = sanitizeLlmOperations(
      { reply: "done", operations: [{ op: "update", ids: ["a"], patch: { fill: "#00ff0", opacity: 0.5 } }] },
      [],
    );
    const mixedPatch = (mixed!.operations[0] as { patch: Record<string, unknown> }).patch;
    expect(mixedPatch.fill).toBeUndefined();
    expect(mixedPatch.opacity).toBe(0.5);
  });
});
