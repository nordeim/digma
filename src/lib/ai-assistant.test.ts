import { describe, expect, it } from "vitest";
import { parseFallbackCommand, sanitizeLlmOperations } from "@/lib/ai-assistant";

// The assistant's deterministic fallback seam: every advertised example
// command resolves to bounded operations, unknown input degrades to a
// helpful no-op, and LLM output is clamped before it can touch the canvas.

describe("parseFallbackCommand — add shapes", () => {
  it("adds N circles with the requested color", () => {
    const command = parseFallbackCommand("Add 3 red circles", []);
    expect(command.operations).toHaveLength(3);
    for (const op of command.operations) {
      expect(op.op).toBe("add");
      if (op.op === "add") {
        expect(op.element.type).toBe("ellipse");
        expect(op.element.fill).toBe("#EF4444");
      }
    }
  });

  it("defaults to one shape and the default fill when unspecified", () => {
    const command = parseFallbackCommand("add a rectangle", []);
    expect(command.operations).toHaveLength(1);
    const op = command.operations[0]!;
    if (op.op === "add") {
      expect(op.element.type).toBe("rectangle");
      expect(op.element.fill).toBe("#3B82F6");
    }
  });

  it("caps the count at a sane maximum", () => {
    const command = parseFallbackCommand("add 100 circles", []);
    expect(command.operations.length).toBeLessThanOrEqual(50);
  });
});

describe("parseFallbackCommand — modify selection", () => {
  it("recolors the selected elements", () => {
    const command = parseFallbackCommand("Make selected elements blue", ["el-1", "el-2"]);
    const op = command.operations[0]!;
    expect(op.op).toBe("update");
    if (op.op === "update") {
      expect(op.ids).toEqual(["el-1", "el-2"]);
      expect(op.patch.fill).toBe("#3B82F6");
    }
  });

  it("declines recolor with no selection", () => {
    const command = parseFallbackCommand("make everything red", []);
    expect(command.operations).toHaveLength(0);
  });

  it("scales the selection up when asked for bigger", () => {
    const command = parseFallbackCommand("make it bigger", ["el-1"]);
    const op = command.operations[0]!;
    expect(op.op).toBe("update");
    if (op.op === "update") expect(op.patch.scale).toBe(1.25);
  });

  it("deletes the selection", () => {
    const command = parseFallbackCommand("delete selected", ["el-1"]);
    expect(command.operations[0]?.op).toBe("delete");
  });
});

describe("parseFallbackCommand — templates and unknown input", () => {
  it("builds a login form", () => {
    const command = parseFallbackCommand("Create a login form", []);
    expect(command.operations.length).toBeGreaterThanOrEqual(7);
    expect(command.operations.every((op) => op.op === "add")).toBe(true);
  });

  it("answers unknown input with a helpful no-op (never throws)", () => {
    const command = parseFallbackCommand("what is the meaning of life?", []);
    expect(command.operations).toHaveLength(0);
    expect(command.reply.length).toBeGreaterThan(10);
  });
});

describe("sanitizeLlmOperations", () => {
  it("accepts a well-formed add + rejects nothing", () => {
    const parsed = sanitizeLlmOperations(
      {
        reply: "Added a box.",
        operations: [{ op: "add", element: { type: "rectangle", x: 10, y: 20, width: 100, height: 50, fill: "#00FF00" } }],
      },
      [],
    );
    expect(parsed).not.toBeNull();
    expect(parsed!.operations).toHaveLength(1);
  });

  it("drops malformed entries and clamps bounds", () => {
    const parsed = sanitizeLlmOperations(
      {
        reply: "ok",
        operations: [
          { op: "add", element: { type: "hexagon", x: 0, y: 0, width: 10, height: 10 } },
          { op: "add", element: { type: "ellipse", x: -99999999, y: 0, width: 99999999, height: 10 } },
          { op: "update", patch: {} },
        ],
      },
      ["el-1"],
    );
    expect(parsed).not.toBeNull();
    const adds = parsed!.operations.filter((op) => op.op === "add");
    expect(adds).toHaveLength(1);
    if (adds[0]?.op === "add") {
      expect(adds[0].element.x).toBeGreaterThanOrEqual(-50000);
      expect(adds[0].element.width).toBeLessThanOrEqual(20000);
    }
  });

  it("returns null when the reply or operations are missing", () => {
    expect(sanitizeLlmOperations({ operations: [] }, [])).toBeNull();
    expect(sanitizeLlmOperations(null, [])).toBeNull();
    expect(sanitizeLlmOperations({ reply: "hi" }, [])).toBeNull();
  });

  it("keeps valid update patches and validates fill hexes", () => {
    const parsed = sanitizeLlmOperations(
      {
        reply: "done",
        operations: [{ op: "update", ids: ["a", 5], patch: { fill: "not-a-color", opacity: 9 } }],
      },
      [],
    );
    expect(parsed).not.toBeNull();
    const update = parsed!.operations[0]!;
    if (update.op === "update") {
      expect(update.ids).toEqual(["a"]);
      expect(update.patch.fill).toBeUndefined();
      expect(update.patch.opacity).toBe(1);
    }
  });
});
