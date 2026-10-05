import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-69 docs/comment/typing low batch (S69-D — the
// seventeenth audit's L-D + L-E + L-F + L-G + the x/y rider).
//
// THE DEFECTS: (L-D) the AGENTS.md session-68 seam bullet is
// TRIPLECTATED (three byte-identical lines — the session-68
// doc-update script appended it three times). (L-E) the layers-panel
// lock comment describes the FORBIDDEN pointer-suppression
// implementation (the S23-1 window bug AGENTS.md explicitly forbids)
// instead of the real mechanism (the hit-test wall + the
// cursor-not-allowed chrome). (L-F) the layers row's keyboard
// activation carries the editor core's only double-cast (a
// KeyboardEvent forced through `as unknown as React.MouseEvent`).
// (L-G) DEPLOYMENT.md counts are three sessions stale and §5 never
// documents the one-time-cookie eviction a tokenVersion deploy
// performs. The rider: AssistantUpdatePatch still declares dead x/y
// fields the sanitizer never builds and the client never applies.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the AGENTS.md triplication fix (S69-D / L-D)", () => {
  it("the session-68 seam bullet appears EXACTLY ONCE", () => {
    // THE DEFECT PIN: pre-fix the header line appears three times
    // (md5-identical lines 94/95/96).
    const agents = src("AGENTS.md");
    const header = "The parse-guard/marquee/sanitizer/terminal seams (session 68";
    const count = agents.split(header).length - 1;
    expect(count).toBe(1);
  });

  it("the session-66 bullet still appears exactly once (the dedup is scoped, not collateral)", () => {
    const agents = src("AGENTS.md");
    const header = "The gesture-arm/color-coalescing seams (session 66";
    expect(agents.split(header).length - 1).toBe(1);
  });
});

describe("the layers-panel lock comment rewrite (S69-D / L-E)", () => {
  it("the file carries NO pointer-suppression claim (the forbidden approach is described nowhere)", () => {
    // THE DEFECT PIN: pre-fix the comment carries the forbidden
    // mechanism claim. The rewritten comment describes the REAL
    // mechanism in prose. (The F50(1) discipline: the pin and the
    // comment must not quote each other's literals.)
    const panel = src("src/components/editor/layers-panel.tsx");
    expect(panel.includes("pointer-events")).toBe(false);
  });

  it("the comment carries the REAL mechanism (the hit-test wall + the cursor chrome)", () => {
    const panel = src("src/components/editor/layers-panel.tsx");
    // Anchor on the LOCK comment (S19-2) — the file carries an earlier
    // S19-1 rename-chrome comment that would otherwise steal the slice.
    const comment = panel.slice(panel.indexOf("Session-19 fix (S19-2)"), panel.indexOf("Session-19 fix (S19-2)") + 1600);
    expect(comment).toMatch(/hit-test wall/i);
    expect(comment).toMatch(/cursor-not-allowed/);
  });
});

describe("the layers-row double-cast removal (S69-D / L-F)", () => {
  it("layers-panel.tsx carries zero double-casts (the S68-C zero-cast sweep completed)", () => {
    // THE DEFECT PIN: pre-fix line 175 forces the KeyboardEvent
    // through a double cast to reach onRowClick.
    const panel = src("src/components/editor/layers-panel.tsx");
    expect(panel.includes("as unknown as")).toBe(false);
  });

  it("onRowClick's parameter is structurally typed (both event families satisfy it)", () => {
    const panel = src("src/components/editor/layers-panel.tsx");
    expect(panel).toMatch(/function onRowClick\(id: string, event: \{ shiftKey: boolean \}\)/);
  });
});

describe("the DEPLOYMENT.md refresh (S69-D / L-G)", () => {
  const doc = src("docs/DEPLOYMENT.md");

  it("the route counts match the shipped build (18 route files / 23 routes)", () => {
    expect(doc).toMatch(/18 API route/);
    expect(doc).toMatch(/23\s+routes/);
    expect(doc.includes("14 API route")).toBe(false);
    expect(doc.includes("(20 routes")).toBe(false);
  });

  it("the verification checklist carries the real counts (61 smoke / 259 e2e)", () => {
    // Session 81: legitimately re-anchored from 58/230 (the s69-era
    // counts) — the smoke suite grew 58 -> 61 (the S80-D runtime
    // header trio) and the e2e suite 230 -> 259 (the session-80/81
    // discriminators); the pin's intent (DEPLOYMENT.md carries the
    // DELIVERY counts) is unchanged.
    expect(doc).toMatch(/61 .*smoke|smoke.*61|61 checks/);
    expect(doc).toMatch(/259 .*Playwright|Playwright.*259|259 checks/);
    expect(doc.includes("28 E2E checks")).toBe(false);
    expect(doc.includes("51 Playwright checks")).toBe(false);
  });

  it("§5 documents the one-time cookie eviction a tokenVersion deploy performs", () => {
    expect(doc).toMatch(/tokenVersion|evict/i);
    expect(doc).toMatch(/one-time|once/i);
  });

  it("the env table documents the DIGMA_* knob family", () => {
    expect(doc).toMatch(/DIGMA_PROXY_HOPS/);
    expect(doc).toMatch(/DIGMA_DISABLE_IN_APP_RESET/);
    expect(doc).toMatch(/DIGMA_DISABLE_IN_APP_OTP/);
    expect(doc).toMatch(/DIGMA_DISABLE_AI_LLM/);
  });
});

describe("the AssistantUpdatePatch dead-field rider (S69-D)", () => {
  it("the patch type declares NO dead x/y fields (the type describes exactly what flows)", () => {
    // THE DEFECT PIN: pre-fix `x?: number; y?: number;` ride the
    // type while the sanitizer never builds them and the client
    // never applies them. (Word-boundary anchored — the y in
    // `opacity?:` is a substring trap.)
    const lib = src("src/lib/ai-assistant.ts");
    const type = lib.slice(lib.indexOf("export type AssistantUpdatePatch"), lib.indexOf("export type AssistantUpdatePatch") + 700);
    expect(/\bx\?: number/.test(type)).toBe(false);
    expect(/\by\?: number/.test(type)).toBe(false);
  });

  it("the sanitizer's built fields are all still described (fill/opacity/width/height/scale/text)", () => {
    const lib = src("src/lib/ai-assistant.ts");
    const type = lib.slice(lib.indexOf("export type AssistantUpdatePatch"), lib.indexOf("export type AssistantUpdatePatch") + 700);
    for (const field of ["fill", "opacity", "width", "height", "scale", "text"]) {
      expect(type).toMatch(new RegExp(`${field}\\??:`));
    }
  });
});
