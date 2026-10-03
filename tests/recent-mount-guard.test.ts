import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session 63 (S63-F / A-L3 partial — the eleventh audit's Low): the
// Recent mount effect had no unmount guard — `call(...).then((data) =>
// { if (data) setProjects(...) })` commits state after an unmount when
// the fetch resolves mid-teardown (the sibling views carry the
// documented `ignore` pattern). The fix: the effect adopts the
// docs-approved pattern (async function inside the effect; setState
// only in the awaited continuation behind the ignore flag).

const recentSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/recent-view.tsx"),
  "utf8",
);

describe("the Recent mount guard (session 63, S63-F / A-L3)", () => {
  it("the mount effect carries the ignore pattern (no setState after unmount)", () => {
    // THE DEFECT PIN: pre-fix the effect was a bare
    // call().then((data) => { if (data) setProjects(...) }) — no guard.
    expect(recentSource).toContain("let ignore = false");
    expect(recentSource).toContain("if (ignore) return");
    expect(recentSource).toContain("ignore = true");
  });
});
