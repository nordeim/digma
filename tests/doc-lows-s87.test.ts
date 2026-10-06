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

/** The LIVE count of AI-assistant sends across the e2e specs: every
 * interaction that actually posts to the assistant (a fill + Enter/press
 * or a Send click on the assistant textbox). The askAssistant helper's
 * call sites and the five direct forms — enumerated from the spec
 * sources the way the runtime enumerates the bucket. A file that
 * DEFINES the helper contributes exactly one body-fill its invocations
 * already count, so each definition subtracts its body's fill back out. */
function liveAssistantSendCount(): number {
  const files = readdirSync(specDir).filter((f) => f.endsWith(".spec.ts"));
  let count = 0;
  let helperDefinitions = 0;
  for (const file of files) {
    const src = readFileSync(path.join(specDir, file), "utf8");
    // The helper-invocation form (editor-panels): askAssistant(page, "…")
    count += (src.match(/askAssistant\(page, /g) ?? []).length;
    // The helper definition itself: its body's fill is the invocation
    // sites' send, not an extra one.
    if (/async function askAssistant\(/.test(src)) helperDefinitions += 1;
    // The direct form: a fill on the assistant textbox followed within
    // the same statement block by Enter or the Send click. The textbox
    // locator line is the marker; count each fill, not the locator alone.
    const lines = src.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/getByRole\("textbox", \{ name: "Message the AI design assistant" \}\)\.fill\(/.test(line)) {
        count += 1;
      } else if (/getByLabel\("Message the AI design assistant"\);/.test(line)) {
        // The const-input form (session78/79/80): the fill follows on the
        // next 1-3 lines as `await input.fill(…)`.
        for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
          if (/await input\.fill\(/.test(lines[j])) {
            count += 1;
            break;
          }
        }
      }
    }
  }
  return count - helperDefinitions;
}

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
    // live-dynamic form).
    const live = liveAssistantSendCount();
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
