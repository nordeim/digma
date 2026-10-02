import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The autosave state machine (session 56, S56-B — the Mode C audit's
// H-2 + M-1).
//
// The OLD flush was unserialized and markSaved unconditional: an edit
// landing between the PUT body build and its response was silently
// reverted locally (markSaved replaced `elements` with the server list),
// marked "saved", and never re-flushed — the timer's early return on
// non-"unsaved" swallowed the retry. The failure paths returned after a
// toast WITHOUT resetting saveState, leaving it stuck at "saving" (no
// retry, a lying badge, and exit() — which flushed only on "unsaved" —
// skipping the flush).
//
// The fix (source contract, the sheet-lifecycle pattern — the live
// interleaving is pinned by tests/e2e/autosave-race.spec.ts):
// 1. flush() serializes — an in-flight guard plus a pending flag; a
//    flush requested while one runs re-runs after it completes.
// 2. The flush captures the elements ARRAY REFERENCE when it builds the
//    PUT body; on the response, a changed reference (any mutation — the
//    store's immutable updates guarantee it) skips markSaved and sets
//    saveState back to "unsaved" so the follow-up flush persists the
//    newer state; a swapped projectId drops the stale response entirely.
// 3. Every failure path resets saveState to "unsaved" (the subscriber
//    re-arms the timer — an automatic retry), with the toast on the
//    FIRST consecutive failure only.

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);

describe("the autosave state machine (session 56, S56-B / H-2 + M-1)", () => {
  it("flush() is SERIALIZED — an in-flight guard plus a pending re-run", () => {
    // The guard + pending flag exist…
    expect(viewSource).toMatch(/let\s+flushing\s*=\s*false;/);
    expect(viewSource).toMatch(/let\s+pending\s*=\s*false;/);
    // …the entry point short-circuits while one runs and marks the
    // follow-up…
    expect(viewSource).toMatch(/if \(flushing\) \{[\s\S]*?pending = true;[\s\S]*?return;\s*\}/);
    // …and the finally block re-runs the pending flush after completion.
    expect(viewSource).toMatch(
      /finally \{[\s\S]*?flushing = false;[\s\S]*?if \(pending\) \{[\s\S]*?flush\(\);[\s\S]*?\}[\s\S]*?\}/,
    );
  });

  it("the edit-during-flight guard — the captured elements reference", () => {
    // The reference is captured at body-build time…
    expect(viewSource).toMatch(/const\s+capturedElements\s*=\s*[\s\S]{0,80}elements;/);
    // …and the response path checks BOTH the project identity and the
    // reference before adopting the server list.
    expect(viewSource).toMatch(/now\.projectId[^\n]*capturedProjectId/);
    expect(viewSource).toMatch(/now\.elements[^\n]*capturedElements/);
  });

  it("an ACTIVE gesture defers the server-list adoption (the id-remap trap)", () => {
    // A canvas gesture freezes element ids in its drag state; adopting
    // the server list mid-gesture remaps the ids out from under it and
    // the gesture silently stops moving anything. The response path
    // checks the store's gestureSnapshot and defers.
    expect(viewSource).toMatch(/if \(now\.gestureSnapshot !== null\) \{\s*now\.setUnsaved\(\);\s*return;\s*\}/);
  });

  it("every failure path resets saveState to unsaved (no stuck saving)", () => {
    // The three failure branches each reset via the store action…
    const matches = viewSource.match(/setUnsaved\(\)/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(3);
    // …the store exposes the action…
    expect(storeSource).toMatch(/setUnsaved:\s*\(\)\s*=>\s*set\(\{ saveState: "unsaved" \}\)/);
  });

  it("the toast fires on the FIRST consecutive failure only", () => {
    expect(viewSource).toMatch(/let\s+consecutiveFailures\s*=\s*0;/);
    expect(viewSource).toMatch(/consecutiveFailures\s*(?:===\s*1|<=\s*1|<\s*2)/);
  });
});
