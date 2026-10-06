import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-87 docs-honesty batch (S87-D — the thirty-fifth audit's
// B87-L1 + B87-L2).
//
// B87-L1 — THE DEFECT: the S86-C seven-calls repair corrected
// reset-password.spec.ts's HEADER (:15, "seven auth calls") but missed
// its own inline twin at :137 ("the same six-call budget in this file's
// own XFF bucket") — and doc-lows-s86's negative pin
// (`not.toMatch(/six auth calls/)`) is blind to the hyphenated
// "six-call" form. The doc-claim-as-second-copy hazard recurring inside
// the very file the repair fixed.
//
// B87-L2 — THE DEFECT: session67-fixes.spec.ts:148 claims "the other
// specs' three sends" live in the shared ai:unknown rate-limit bucket —
// the call-level enumeration finds NINE (editor-panels ×4, workspace ×1,
// session78 ×1, session79 ×2, session80 ×1). Sessions 78/79/80 added six
// sends the session-67 comment never counted. 11 headroom remains under
// the 20/5min ceiling (no failure today), but the comment is the only
// documentation of that budget — a spec author trusting "three sends"
// believes 17 headroom where 11 exist; when a 5-minute window crosses
// 20, the failure mode is the nastiest class: a mid-suite 429 envelope
// with no reply, so every deterministic-fallback assertion times out at
// 15s and cascades.
//
// THE FIX: (a) the inline twin re-anchored to the seven-call form and
// the doc-lows-s86 negative pin widened to /six.call/i (both twins
// covered forever); (b) the session-67 comment re-anchored to NINE with
// the enumeration in the comment — and pinned LIVE-DERIVED (this spec
// enumerates the send interactions across the e2e specs and asserts the
// comment's number equals the enumeration — the F72 dead-constant
// lesson's live-dynamic form, the way doc-lows-s86 closed the
// .env.example reader count).
//
// Session 88 (S88-B / B88-L1 — the thirty-sixth audit's forward-looking
// member): the enumerator widened to the LOCATOR-FAMILY CO-LOCATION form.
// The S87 form counted only three LITERAL shapes (the askAssistant
// invocations, the inline getByRole-textbox fill, the getByLabel const
// with the fill within 3 lines) — a future spec sending in any other
// shape (a fill further below the const, a different locator for the
// same textbox, a Send-click without a fill, a direct API fetch)
// consumed the real shared ai: bucket while the enumeration missed it.
// The widened form keys on the locator FAMILY (any locator call naming
// the assistant's INPUT surface — the textbox/input/Message/Ask
// discriminator telling the textbox apart from the assistant PANEL's
// heading checks) co-located with a send interaction within the 8-line
// statement window, PLUS the coverage-completeness companion below:
// every spec file touching the family's markers must be counted or
// explicitly EXEMPTED — the count pin alone could stay green at a stale
// number while reality drifted.

const specDir = path.resolve(import.meta.dirname, "e2e");

const resetPasswordSpec = readFileSync(
  path.resolve(specDir, "reset-password.spec.ts"),
  "utf8",
);

const session67Spec = readFileSync(
  path.resolve(specDir, "session67-fixes.spec.ts"),
  "utf8",
);

const docLowsS86Spec = readFileSync(
  path.resolve(import.meta.dirname, "doc-lows-s86.test.ts"),
  "utf8",
);

/** The assistant-TEXTBOX locator family: any locator call whose
 * arguments name the assistant's INPUT surface — "assistant"
 * co-occurring with the input discriminator (the accessible name is
 * "Message the AI design assistant", so every locator for the textbox
 * carries both; the assistant PANEL's heading checks carry "assistant"
 * WITHOUT the discriminator and never match — untitled-editor's and
 * editor-panels' own `getByRole("heading", { name: "AI Assistant" })`
 * visibility checks are not send targets). */
const TEXTBOX_LOCATOR_FAMILY =
  /(?:getByRole|getByLabel|locator|getByPlaceholder)\([^)]*?(?:(?:textbox|input|textarea|Message|Ask|placeholder|aria-label)[^)]*?[Aa]ssistant|[Aa]ssistant[^)]*?(?:textbox|input|textarea|Message|Ask|placeholder|aria-label))/;

/** The LIVE count of AI-assistant sends across the e2e specs: every
 * interaction that actually posts to the assistant — any
 * assistant-textbox LOCATOR line (inline or const-declared, any locator
 * family) co-located with a send interaction (a .fill( / .press( on the
 * same line, or any of .fill( / .press( / a Send .click( within the
 * 8-line statement window below a const declaration — the fill may sit
 * below intermediate awaits), plus the askAssistant helper's invocation
 * sites. A file that DEFINES the helper contributes exactly one
 * body-fill its invocations already count, so each definition subtracts
 * its body's fill back out. (The S88-B widened form: the enumeration
 * keys on the LOCATOR FAMILY, not the literal call shapes — see the
 * header.) */
function liveAssistantSendCount(): { total: number; perFile: Record<string, number> } {
  const files = readdirSync(specDir).filter((f) => f.endsWith(".spec.ts"));
  let count = 0;
  let helperDefinitions = 0;
  const perFile: Record<string, number> = {};
  for (const file of files) {
    const src = readFileSync(path.join(specDir, file), "utf8");
    let fileCount = 0;
    // The helper-invocation form (editor-panels): askAssistant(page, "…")
    fileCount += (src.match(/askAssistant\(page, /g) ?? []).length;
    // The helper definition itself: its body's fill is the invocation
    // sites' send, not an extra one.
    if (/async function askAssistant\(/.test(src)) helperDefinitions += 1;
    // The locator-family co-location form: a line that locates the
    // assistant textbox counts a send when the send interaction sits on
    // the same line (the inline form) or within the next 8 lines (the
    // const-declaration form — the fill may sit below intermediate
    // awaits and expectations).
    const lines = src.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (TEXTBOX_LOCATOR_FAMILY.test(lines[i])) {
        if (/\.fill\(|\.press\(/.test(lines[i])) {
          fileCount += 1;
          continue;
        }
        for (let j = i + 1; j <= Math.min(i + 8, lines.length - 1); j++) {
          if (/\.fill\(|\.press\(|\.click\(/.test(lines[j])) {
            fileCount += 1;
            break;
          }
        }
      }
    }
    perFile[file] = fileCount;
    count += fileCount;
  }
  return { total: count - helperDefinitions, perFile };
}

/** The assistant-consumption family's marker: any spec file that could
 * consume the shared ai: bucket — a textbox locator, the askAssistant
 * helper, or any string literal naming the assistant route path.
 * (S88-B: the coverage-completeness forcing function's sweep — see the
 * pin below. S89-B: the direct-API alternative widened from the
 * pattern-shaped fetch( form to the ROUTE-PATH family — complete by
 * construction over every transport: fetch(, request.post(,
 * page.request.post(, whatever comes — the forcing function given the
 * same family-widening its enumerator received.) */
const ASSISTANT_MARKER =
  /(?:getByRole|getByLabel|locator|getByPlaceholder)\([^)]*?(?:(?:textbox|input|textarea|Message|Ask|placeholder|aria-label)[^)]*?[Aa]ssistant|[Aa]ssistant[^)]*?(?:textbox|input|textarea|Message|Ask|placeholder|aria-label))|askAssistant\(|["']\/api\/ai-assistant/;

/** The documented exemptions — files that touch the family's markers but
 * legitimately consume no budget headroom the comment's arithmetic
 * documents:
 * - parity.spec.ts — the locate-only height check: it locates the
 *   textbox to measure the input's geometry and NEVER sends.
 * - session67-fixes.spec.ts — the limiter-trip test itself: its 21
 *   direct fetches ARE the budget's own verifier (the 429 pin), not a
 *   consumer of the headroom. */
const EXEMPTED: Record<string, string> = {
  "parity.spec.ts": "locate-only height check — never sends",
  "session67-fixes.spec.ts": "the limiter-trip test — its fetches are the budget's own verifier",
};

// ---------------------------------------------------------------------------
// B87-L1 — the seven-calls repair's own inline twin
// ---------------------------------------------------------------------------

describe("the reset-password spec's own-bucket count (S87-D / B87-L1)", () => {
  it("DOC — the INLINE twin matches the header's seven-call count (the S86-C repair completed)", () => {
    // THE DEFECT PIN: pre-fix :137 says "the same six-call budget" while
    // the header (:15, repaired in S86-C) says "seven auth calls" — the
    // repair's own delivery undercounted itself.
    expect(resetPasswordSpec).toMatch(/seven auth calls/);
    // The inline twin's distinctive contiguous phrase (the comment's
    // line-wrapping may split "the same" from "seven-call budget").
    expect(resetPasswordSpec).toMatch(/seven-call budget/);
    // Neither twin form survives anywhere in the file.
    expect(resetPasswordSpec).not.toMatch(/six[- ]call|six auth calls/i);
  });

  it("DOC — the doc-lows-s86 negative pin is WIDENED to the hyphenated form (both twins covered)", () => {
    // THE DEFECT PIN: pre-fix the pin says `not.toMatch(/six auth
    // calls/)` — blind to "six-call". The widened form /six.call/i
    // covers both the hyphenated and the spaced twin.
    expect(docLowsS86Spec).toMatch(/not\.toMatch\(\/six\.call\/i\)/);
  });
});

// ---------------------------------------------------------------------------
// B87-L2 — the shared ai:unknown bucket's documented send count
// ---------------------------------------------------------------------------

describe("the shared ai bucket's send count is live-derived (S87-D / B87-L2)", () => {
  it("LIVE — the session-67 comment's send count equals the spec-source enumeration", () => {
    // THE DEFECT PIN: pre-fix the comment claims "three sends" while the
    // call-level enumeration finds NINE. The LIVE-DERIVED form: this pin
    // enumerates the send interactions across the e2e specs and asserts
    // the comment's number equals the enumeration — the count can never
    // again rot while the specs drift (the F72 dead-constant lesson's
    // live-dynamic form). (S88-B: the enumeration is the widened
    // locator-family co-location form — the count itself is unchanged.)
    const live = liveAssistantSendCount().total;
    const claimed = session67Spec.match(/the other specs' (\w+) sends/);
    expect(claimed).not.toBeNull();
    const wordToNum: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
      eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
    };
    const claimedNum = wordToNum[(claimed![1] ?? "").toLowerCase()];
    expect(claimedNum).toBe(live);
  });

  it("DOC — the comment carries the enumeration (the spec sites named)", () => {
    // The comment must name where the sends live so a future author can
    // audit the budget without re-deriving it: editor-panels ×4,
    // workspace, session78, session79 ×2, session80.
    expect(session67Spec).toMatch(/editor-panels/);
    expect(session67Spec).toMatch(/nine sends|9 sends/);
  });
});

// ---------------------------------------------------------------------------
// S88-B — the coverage-completeness companion (the forcing function)
// ---------------------------------------------------------------------------

describe("the assistant-marker sweep is coverage-complete (S88-B / B88-L1)", () => {
  it("LIVE — every assistant-marker spec file is counted or explicitly exempted (the coverage-completeness forcing function)", () => {
    // THE FORWARD-LOOKING PIN: a live-derived count whose enumeration is
    // pattern-shaped certifies only the patterns it knows — a future spec
    // that touches the assistant in an unenumerated shape consumed the
    // real bucket while the count pin stayed green at a stale number
    // (exactly the B87-L2 drift one layer over). The companion sweeps
    // the family's MARKERS (the textbox locator family, askAssistant,
    // any route-path literal naming the assistant API) and demands
    // every matching file either
    // contributes at least one enumerated send or carries its exemption
    // here — an unaccounted file fails THIS pin even when the count pin
    // is green.
    const { perFile } = liveAssistantSendCount();
    const unaccounted: string[] = [];
    for (const file of readdirSync(specDir).filter((f) => f.endsWith(".spec.ts"))) {
      const src = readFileSync(path.join(specDir, file), "utf8");
      if (!ASSISTANT_MARKER.test(src)) continue;
      if ((perFile[file] ?? 0) >= 1) continue;
      if (EXEMPTED[file]) continue;
      unaccounted.push(file);
    }
    expect(unaccounted).toEqual([]);
  });

  it("DOC — the exemption list is explicit (parity: locate-only; session67: the limiter trip)", () => {
    // The exemptions are the pin's own documentation: adding one is a
    // conscious act (the file must justify consuming zero budget), never
    // an accident of an enumerator's blind spot.
    expect(Object.keys(EXEMPTED).sort()).toEqual([
      "parity.spec.ts",
      "session67-fixes.spec.ts",
    ]);
    expect(EXEMPTED["parity.spec.ts"]).toMatch(/locate-only/);
    expect(EXEMPTED["session67-fixes.spec.ts"]).toMatch(/limiter-trip/);
  });
});

// ---------------------------------------------------------------------------
// The survival family — the S86-C live pins ride through unchanged
// ---------------------------------------------------------------------------

describe("the S87 survival family (the S86-C pins unchanged)", () => {
  it("SURVIVAL — the .env.example reader count pin survives (the six-readers reality form)", () => {
    expect(docLowsS86Spec).toMatch(/E2E_BASE_URL/);
  });

  it("SURVIVAL — the reset-password header's seven-call pin survives", () => {
    expect(docLowsS86Spec).toMatch(/seven auth calls/);
  });
});
