import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-82 client low batch (S82-A + S82-B — the thirtieth
// audit's A82-M1, A82-L1).
//
// S82-A — THE DEFECT (A82-M1, the headline): the shortcuts stand-down
// guard missed the open Radix Select. The guard stood down behind
// `[role="dialog"][data-state="open"], [role="menu"][data-state="open"]`
// (the S57-C/S56-D family) — but the Radix Select renders its open
// content as role="listbox" with data-state="open" and its trigger as
// role="combobox" (aria-expanded="true"); the vendored dist source
// carries ZERO stopPropagation calls and its typeahead handler does NOT
// preventDefault plain letter keys, so every keydown over an open
// Select propagated to the editor's window listener: with the Font
// Family list open, pressing I/R/A/H/T/V ALSO armed the
// Image/Rectangle/Frame/Hand/Text/Select tool behind the list, and
// Delete/Backspace deleted the canvas selection behind the listbox —
// the exact S57-C defect class for the one remaining portal family.
//
// THE FIX: the guard's selector gains the listbox family —
// `[role="listbox"][data-state="open"]` and
// `[role="combobox"][aria-expanded="true"]` (the belt: either alone
// covers the open state; both pin the family).
//
// S82-B — THE DEFECT (A82-L1): the S81-B widened busy predicate
// `flushing || pending || saveState === "unsaved"` assumed unsaved
// state is always TRANSIENT (the 800ms timer will flush it). The
// S68-D 401 terminal breaks the assumption: on 401 the machine calls
// markSessionDead() + setUnsaved(), then every later flush
// early-returns on `if (sessionDead) return` — saveState stays
// "unsaved" for the instance's lifetime, machineBusy() is permanently
// true, and both boundary drains burn the full 5-second deadline
// before their timeout on any later same-instance swap.
//
// THE FIX: the predicate exempts the terminal — `!sessionDead && (...)`.
// A dead session's "unsaved" is honest-idle (the work is unsavable by
// definition); the badge keeps its honest terminal contract.

const view = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

// ---------------------------------------------------------------------------
// S82-A — the stand-down guard reaches the open Radix Select (A82-M1)
// ---------------------------------------------------------------------------

describe("the shortcuts stand-down guard covers the open Radix Select (S82-A / A82-M1)", () => {
  it("the guard's selector includes the open LISTBOX (the Radix Select's open content role)", () => {
    // THE DEFECT PIN: pre-fix the selector matched only dialog + menu —
    // the open Select's listbox let letter keys switch tools behind it.
    const site = view.indexOf("document.querySelector(");
    expect(site).toBeGreaterThanOrEqual(0);
    // The guard block (the shortest window that contains the selector).
    const block = view.slice(site, site + 400);
    expect(block).toMatch(/\[role="listbox"\]\[data-state="open"\]/);
  });

  it("the guard's selector includes the expanded COMBOBOX (the Radix Select's trigger)", () => {
    // The belt: the trigger carries role="combobox" + aria-expanded
    // while open — the pair of selectors pins the family either way.
    const site = view.indexOf("document.querySelector(");
    const block = view.slice(site, site + 400);
    expect(block).toMatch(/\[role="combobox"\]\[aria-expanded="true"\]/);
  });

  it("the guard KEEPS the standing dialog + menu families (the S57-C/S56-D contracts unchanged)", () => {
    // The widening must not regress the two original families.
    const site = view.indexOf("document.querySelector(");
    const block = view.slice(site, site + 400);
    expect(block).toMatch(/\[role="dialog"\]\[data-state="open"\]/);
    expect(block).toMatch(/\[role="menu"\]\[data-state="open"\]/);
  });

  it("the widened selector is the GUARD's (the return-immediately site), not another querySelector call site", () => {
    // editor-view.tsx carries other querySelector calls; the pin must
    // anchor on the guard's own block — the one followed by the return
    // that stands the shortcuts down.
    const site = view.indexOf("document.querySelector(");
    expect(site).toBeGreaterThanOrEqual(0);
    const after = view.slice(site, site + 600);
    expect(after).toMatch(/\);\s*\n\s*return;/);
  });
});

// ---------------------------------------------------------------------------
// S82-B — the drain exempts the 401 terminal (A82-L1)
// ---------------------------------------------------------------------------

describe("the drain's busy predicate exempts the 401 terminal (S82-B / A82-L1)", () => {
  it("the machineBusy predicate prefixes the sessionDead exemption", () => {
    // THE DEFECT PIN: pre-fix the predicate read
    // `flushing || pending || saveState === "unsaved"` with no terminal
    // exemption — a dead session parked the drain at the 5s deadline.
    const site = view.indexOf("const machineBusy = () =>");
    expect(site).toBeGreaterThanOrEqual(0);
    const predicate = view.slice(site, site + 300);
    expect(predicate).toMatch(/!sessionDead\s*&&\s*\(/);
  });

  it("the exemption keeps the S81-B armed-debounce disjunct (the widened predicate's own contract)", () => {
    // The S81-B widening must survive the S82-B exemption — the
    // predicate still sees the debounce-armed state on a LIVE session.
    const site = view.indexOf("const machineBusy = () =>");
    const predicate = view.slice(site, site + 300);
    expect(predicate).toMatch(/flushing\s*\|\|\s*pending/);
    expect(predicate).toMatch(/saveState\s*===\s*"unsaved"/);
  });

  it("the 401 terminal still marks the store unsaved (the honest badge contract unchanged)", () => {
    // The exemption must not change the terminal's honest badge — the
    // S68-D contract: the work is NOT saved and CANNOT be until the
    // user signs in again. (Anchored on the FLUSH's 401 arm — the
    // block form `if (response.status === 401) { markSessionDead();
    // ... setUnsaved(); }` — not the ensureProject POST's one-line
    // arm, which never carried the setUnsaved.)
    let site = -1;
    let terminal = "";
    let cursor = 0;
    while (cursor < view.length) {
      const next = view.indexOf("markSessionDead();", cursor);
      if (next < 0) break;
      const window = view.slice(next, next + 200);
      if (window.includes("setUnsaved()")) {
        site = next;
        terminal = window;
        break;
      }
      cursor = next + 1;
    }
    expect(site).toBeGreaterThanOrEqual(0);
    expect(terminal).toMatch(/setUnsaved\(\)/);
  });
});
