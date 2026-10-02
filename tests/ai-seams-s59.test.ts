import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { parseFallbackCommand, sanitizeLlmOperations } from "@/lib/ai-assistant";

// The AI seams batch (session 59, S59-B/S59-C/S59-D/S59-H — the seventh
// Mode C audit's B-L-1, B-L-2, B-L-3 and B-L-4).
//
// B-L-1: colorFor matched color words as plain substrings — "colored"
// contains "red" (its last three letters), so the panel's first advertised
// suggestion "Add 3 colored circles" deterministically created three RED
// circles. The fix: the \b word boundary, the SHAPES convention two
// branches below in the same file.
//
// B-L-2: the LLM sanitizer's inline hex regexes accepted 4- and 5-digit
// hex ({3,6}) — invalid CSS the browser drops locally, then the elements
// PUT's clampColor silently rewrites to the #3B82F6 fallback after save.
// The fix: the shared HEX_COLOR contract — exactly 3 or 6 digits.
//
// B-L-3: the client's add partial carried always-present keys with
// explicit undefined values (fill ?? undefined, text ?? undefined) which
// OVERWRITE defaultElementFor's type defaults in the {...draft,
// ...partial} spread — an LLM text-add without text lost "Type here..."
// and rendered invisible. The fix: include a key only when its value is
// defined.
//
// B-L-4: the AI fetch had no abort path — a hung SDK call wedged the
// panel ("Working on it…" forever, the sending guard dead-early-returns
// every later submit). The fix: AbortSignal.timeout(30_000) — the hang
// degrades through the existing catch to the toast family.

const libSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/ai-assistant.ts"),
  "utf8",
);
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);

describe("the colorFor word boundary (session 59, S59-B / B-L-1)", () => {
  it("the color matcher uses word boundaries (the SHAPES convention), not substrings", () => {
    // The plain substring matcher is gone…
    expect(libSource).not.toMatch(/if \(lowered\.includes\(word\)\) return hex;/);
    // …replaced by the \b boundary form used by the SHAPES matcher.
    expect(libSource).toMatch(
      /new RegExp\(`\\\\b\$\{word\}\\\\b`\)\.test\(lowered\)|new RegExp\(`\\\\b\$\{word\}\\\\b`\)\.test\(lowered\)/,
    );
  });

  it('"Add 3 colored circles" no longer resolves to red (the substring accident)', () => {
    const command = parseFallbackCommand("Add 3 colored circles", []);
    expect(command).not.toBeNull();
    // "colored" no longer matches "red" — the deterministic default.
    expect(command!.operations[0]).toMatchObject({
      op: "add",
      element: expect.objectContaining({ fill: "#3B82F6" }),
    });
  });

  it('"Add 3 red circles" keeps the explicit red (the measured contract)', () => {
    const command = parseFallbackCommand("Add 3 red circles", []);
    expect(command).not.toBeNull();
    expect(command!.operations[0]).toMatchObject({
      op: "add",
      element: expect.objectContaining({ fill: "#EF4444" }),
    });
  });
});

describe("the sanitizer hex seam (session 59, S59-C / B-L-2)", () => {
  it("the inline hex regexes use the exactly-3-or-6 contract (no {3,6})", () => {
    // The lax {3,6} quantifier is gone from BOTH fill checks…
    expect(libSource).not.toContain("#{3,6}");
    // …and each check carries the 3-or-6 alternation (the HEX_COLOR
    // shape: exactly three digits or exactly six).
    const strict = libSource.match(
      /\/\^#\[0-9a-fA-F\]\{3\}\$\|\^#\[0-9a-fA-F\]\{6\}\$\//g,
    ) ?? [];
    expect(strict.length).toBeGreaterThanOrEqual(2);
  });

  it("a 4-digit LLM hex fill degrades to null (the deterministic answer, not the post-save blue)", () => {
    const ops = sanitizeLlmOperations(
      {
        reply: "Added a box.",
        operations: [
          {
            op: "add",
            element: { type: "rectangle", x: 10, y: 10, width: 100, height: 80, fill: "#12345" },
          },
        ],
      },
      [],
    );
    expect(ops).not.toBeNull();
    expect(ops!.operations).toHaveLength(1);
    expect(ops!.operations[0]).toMatchObject({
      op: "add",
      element: expect.objectContaining({ fill: null }),
    });
  });

  it("a 6-digit LLM hex fill survives sanitization (the preserved family)", () => {
    const ops = sanitizeLlmOperations(
      {
        reply: "Added a box.",
        operations: [
          {
            op: "add",
            element: { type: "rectangle", x: 10, y: 10, width: 100, height: 80, fill: "#10B981" },
          },
        ],
      },
      [],
    );
    expect(ops).not.toBeNull();
    expect(ops!.operations).toHaveLength(1);
    expect(ops!.operations[0]).toMatchObject({
      op: "add",
      element: expect.objectContaining({ fill: "#10B981" }),
    });
  });
});

describe("the add-branch undefined-key omission (session 59, S59-D / B-L-3)", () => {
  it("the add partial never carries explicit-undefined keys (the defaults survive the spread)", () => {
    // The always-present ?? undefined / || undefined keys are gone…
    expect(panelSource).not.toContain("fill: operation.element.fill ?? undefined");
    expect(panelSource).not.toContain("text: operation.element.text ?? undefined");
    expect(panelSource).not.toContain("fontSize: operation.element.fontSize ?? undefined");
    expect(panelSource).not.toContain("radius: operation.element.radius || undefined");
    // …and the partial is built conditionally (defined values only).
    expect(panelSource).toMatch(
      /const partial|const draft\b/,
    );
    const addBranch = panelSource.slice(
      panelSource.indexOf('operation.op === "add"'),
      panelSource.indexOf('operation.op === "update"'),
    );
    expect(addBranch).toMatch(/if \(.*!== (?:null|undefined)\)/);
  });
});

describe("the AI fetch abort timeout (session 59, S59-H / B-L-4)", () => {
  it("the assistant fetch carries an abort signal (a hang degrades instead of wedging)", () => {
    const fetchStart = panelSource.indexOf('fetch("/api/ai-assistant"');
    expect(fetchStart).toBeGreaterThan(-1);
    const fetchEnd = panelSource.indexOf("});", fetchStart);
    const fetchCall = panelSource.slice(fetchStart, fetchEnd);
    expect(fetchCall).toMatch(/signal:\s*AbortSignal\.timeout\(/);
    // The timeout is 30 seconds — above the route's own budget, below
    // human patience for a chat reply.
    expect(fetchCall).toMatch(/AbortSignal\.timeout\(30_000\)/);
  });
});
