import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-76 client low batch (S76-B + S76-C + S76-D + S76-E — the
// twenty-fourth audit's A-M1, A-L1, A-L2, A-L3).
//
// S76-B — THE DEFECT: the AI assistant's intro message renders
// nowLabel() (the wall-clock timestamp) from the useState initializer —
// evaluated once on the server during SSR and again at hydration. The
// panel is outside the loading gate, so it IS in the SSR output; when
// the server and client clocks or timezones disagree (the production
// UTC-server case), React logs a text-content hydration mismatch on
// every editor visit — the exact class the repo fixed for the
// Dashboard greeting in S65-D.
//
// THE FIX: the S65-D family form reaches the assistant's timestamp row
// — the client value wins after hydration and React stops logging.
//
// S76-C — THE DEFECT: every applied assistant reply stored a full
// shallow copy of the element list as its revert snapshot, with no cap
// — the store's own history is 60 snapshots deep, but the chat's
// snapshot family accumulated unboundedly for the tab's lifetime.
//
// THE FIX: a retention cap — older snapshot carriers beyond the last
// nine lose their stale copy when a new one appends (the store's undo
// covers older states), and the Revert control couples its render to
// the snapshot's presence (a control that cannot work must not
// render — the honest-control doctrine).
//
// S76-D — THE DEFECT: the zoom percentage chip and three slider
// readout spans carried polite live-region semantics — the chip
// re-renders per wheel tick and the readouts per drag tick (the
// native range input already announces its own value changes), so
// screen readers heard a stream of near-duplicate announcements
// during continuous interactions.
//
// THE FIX: the four per-tick sites drop the live region; the DISCRETE
// save-state badge keeps its (state flips are what polite regions are
// for).
//
// S76-E — THE DEFECT: the toast dismiss control hit ~24x24px — below
// the repo's own 44px touch floor every other mobile close target
// meets.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the assistant intro timestamp hydration fix (S76-B / A-M1)", () => {
  const assistant = src("src/components/editor/ai-assistant.tsx");

  it("the assistant timestamp row carries the suppression attribute (the S65-D family form)", () => {
    // THE DEFECT PIN: pre-fix the row rendered the server-computed
    // clock string with no suppression — divergent clocks logged a
    // text-content mismatch at hydration.
    const m = assistant.match(/<div className="mt-1 text-left text-xs text-gray-500"[^>]*>\s*\{message\.time\}/);
    expect(m).not.toBeNull();
    expect(m?.[0]).toMatch(/suppressHydrationWarning/);
  });

  it("the user timestamp row is untouched (user rows only exist post-interaction — never SSR'd)", () => {
    // PRESERVATION: the user-side row never server-renders, so it
    // needs nothing; pin its form stays the plain row.
    const m = assistant.match(/<div className="mt-1 text-right text-xs text-gray-500"[^>]*>\s*\{message\.time\}/);
    expect(m).not.toBeNull();
  });
});

describe("the chat revert-snapshot cap (S76-C / A-L1)", () => {
  const assistant = src("src/components/editor/ai-assistant.tsx");

  it("the retention cap constant exists", () => {
    // THE DEFECT PIN: pre-fix no cap existed — snapshots accumulated
    // unboundedly.
    expect(assistant).toMatch(/const MAX_RETAINED_REVERT_SNAPSHOTS = 10/);
  });

  it("the append path strips aged snapshots (the cap is wired into setMessages)", () => {
    // THE DEFECT PIN: pre-fix the append spread prev verbatim.
    expect(assistant).toMatch(/function stripAgedSnapshots\(prev: ChatMessage\[\]\): ChatMessage\[\] \{/);
    expect(assistant).toMatch(/\.\.\.stripAgedSnapshots\(prev\),/);
  });

  it("the Revert control couples its render to the snapshot's presence", () => {
    // THE DEFECT PIN: pre-fix the button rendered on the action count
    // alone — a stripped message would render a control whose handler
    // cannot work.
    const idx = assistant.lastIndexOf("Revert");
    const slice = assistant.slice(Math.max(0, idx - 600), idx);
    expect(slice).toMatch(/message\.revertSnapshot && \(/);
  });

  it("revertMessage's guard is unchanged (the handler already refuses a snapshotless message)", () => {
    // PRESERVATION: the runtime guard predates the cap.
    expect(assistant).toMatch(/if \(!message\?\.revertSnapshot \|\| message\.reverted\) return;/);
  });
});

describe("the per-tick live-region cleanup (S76-D / A-L2)", () => {
  const view = src("src/components/editor/editor-view.tsx");
  const panel = src("src/components/editor/properties-panel.tsx");

  it("the zoom percentage chip carries no live region (it re-renders per wheel tick)", () => {
    // THE DEFECT PIN: pre-fix the chip announced every intermediate
    // zoom value.
    const idx = view.indexOf("Math.round(zoom * 100)");
    expect(idx).toBeGreaterThan(-1);
    const slice = view.slice(Math.max(0, idx - 250), idx + 60);
    expect(slice).not.toMatch(/aria-live/);
  });

  it("the generic slider readout span carries no live region (the range input announces its own value)", () => {
    // THE DEFECT PIN: the readout span announced per drag tick — a
    // double announcement beside the native input's own.
    const m = panel.match(/<span className="w-8 text-right text-xs text-gray-300"[^>]*>\s*\{format \? format\(value\) : Math\.round\(value\)\}/);
    expect(m).not.toBeNull();
    expect(m?.[0]).not.toMatch(/aria-live/);
  });

  it("the gradient angle readout span carries no live region", () => {
    const m = panel.match(/<span className="w-10 text-right text-xs text-gray-300"[^>]*>\s*\{gradient\.angle\}/);
    expect(m).not.toBeNull();
    expect(m?.[0]).not.toMatch(/aria-live/);
  });

  it("the scale readout span carries no live region", () => {
    const idx = panel.indexOf('data-testid="scale-value"');
    expect(idx).toBeGreaterThan(-1);
    const slice = panel.slice(Math.max(0, idx - 300), idx + 80);
    expect(slice).not.toMatch(/aria-live/);
  });

  it("the DISCRETE save-state badge keeps its live region (state flips are the legitimate use)", () => {
    // PRESERVATION: the badge's value flips between Saved/Saving/Unsaved
    // — exactly the discrete change a polite region exists for.
    const idx = view.indexOf('saveState === "saved" ? "Saved"');
    expect(idx).toBeGreaterThan(-1);
    const slice = view.slice(Math.max(0, idx - 500), idx);
    expect(slice).toMatch(/aria-live/);
  });
});

describe("the toast dismiss 44px floor (S76-E / A-L3)", () => {
  const toaster = src("src/components/ui/toaster.tsx");

  it("the dismiss control meets the 44px touch floor", () => {
    // THE DEFECT PIN: pre-fix the button padded a 16px glyph to ~24px.
    const idx = toaster.indexOf('aria-label="Dismiss notification"');
    expect(idx).toBeGreaterThan(-1);
    const slice = toaster.slice(Math.max(0, idx - 200), idx + 400);
    expect(slice).toMatch(/h-11 w-11/);
    // The glyph itself stays small (the floor is the hit area, not the
    // icon).
    expect(slice).toMatch(/<X className="h-4 w-4" \/>/);
  });
});
