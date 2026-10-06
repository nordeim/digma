import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-90 doc-honesty/calendar-independence pass (S90-A + S90-B —
// the thirty-eighth audit's B90-L1 + B90-I1, with S90-C's capture
// witness covering the second email surface live).
//
// B90-L1 — THE DEFECT: the S89 "element-is-an-input correction" was
// itself incomplete (the B87-L1 repair's-own-twin class recurring
// inside the repair's own claim): the execution note asserted "The
// spec comments, the plan, and the AGENTS bullet were corrected to
// 'input' before delivery" — but two spec comments
// (client-lows-s89.test.ts:65/:107) and two plan-prose sites
// (remediation-plan-session89.md:25/:46) survived with the mislabeled
// element vocabulary, so the note's own claim was false. The pinned
// element is a single-line <input> (aria-label="Message the AI design
// assistant" at ai-assistant.tsx:581-588) — never a multi-line element.
// THE FIX: every surviving site re-anchored to "input"/"message input",
// the note amended to the honest record (the B90-L1 finding named, the
// S90-A completion recorded), and this negative vocabulary pin
// installed so the mislabel can never survive a future repair.
//
// B90-I1 — THE DEFECT: the seed's fixed calendar literals had aged out
// of the stats window — prisma/seed.ts:42/:111 wrote lastOpenedAt at
// the fixed 2026-09-26/25 literals, both outside the 7-day window by
// the 2026-10-06 tree, so a fresh seed's "Active this week" read 0
// (designed as 2: both projects inside the window) and the backdate
// helper's comment premise ("The seed's two fixed dates (Sep 26 / Sep
// 25) both sit inside the window on fresh re-seeds") was false — and
// grew falser every week. THE FIX: calendar independence — every seeded
// date becomes RELATIVE to the seed moment (the daysAgo form: the two
// lastOpenedAt dates at 2 and 3 days back, both inside the window on
// every future re-seed), the now-dead d() fixed-literal helper removed,
// and the backdate comment re-anchored to the calendar-independent
// form.

const ROOT = path.resolve(import.meta.dirname, "..");

const clientLowsS89Source = readFileSync(
  path.join(ROOT, "tests/client-lows-s89.test.ts"),
  "utf8",
);

const s89PlanSource = readFileSync(
  path.join(ROOT, "docs/remediation-plan-session89.md"),
  "utf8",
);

const assistantSource = readFileSync(
  path.join(ROOT, "src/components/editor/ai-assistant.tsx"),
  "utf8",
);

const seedSource = readFileSync(path.join(ROOT, "prisma/seed.ts"), "utf8");

const backdateHelperSource = readFileSync(
  path.join(ROOT, "tests/e2e/backdate-portfolio.ts"),
  "utf8",
);

const statsRouteSource = readFileSync(
  path.join(ROOT, "src/app/api/stats/route.ts"),
  "utf8",
);

/** The layers-rename-cap locator form (the client-lows-s89 helper's
 * own shape): slice the element tag out of the component source by its
 * anchor attribute, bounded by the tag's own self-closing bracket. */
function tagAround(source: string, anchor: string): string {
  const anchorIndex = source.indexOf(anchor);
  expect(anchorIndex).toBeGreaterThanOrEqual(0);
  const tagStart = source.lastIndexOf("<", anchorIndex);
  const tagEnd = source.indexOf("/>", anchorIndex);
  return source.slice(tagStart, tagEnd);
}

describe("the S89 correction is actually complete — the mislabeled element vocabulary is gone (S90-A / B90-L1)", () => {
  it("SOURCE — client-lows-s89 carries no mislabeled element vocabulary", () => {
    // THE DEFECT PIN: pre-fix two comments survived the S89 correction
    // ("the aria-label for the bare textarea" at :65, "pre-fix the
    // textarea carried no maxLength" at :107) while the S89 plan's own
    // note claimed the spec comments were corrected. The file has no
    // legitimate use for the multi-line element's vocabulary — every
    // input it pins is an <input> — so the blanket negative pin is the
    // forcing function: the mislabel can never survive a future repair.
    expect(clientLowsS89Source).not.toMatch(/textarea/i);
  });

  it("SOURCE — the S89 remediation plan carries no mislabeled element vocabulary", () => {
    // THE DEFECT PIN: pre-fix two prose sites survived ("the assistant
    // textarea uncapped" at :25, "the assistant's textarea" at :46)
    // while the plan's own execution note #3 claimed "the plan" was
    // corrected. The amended note records the honest history WITHOUT
    // re-introducing the vocabulary, so the blanket negative pin holds
    // over the whole document.
    expect(s89PlanSource).not.toMatch(/textarea/i);
  });

  it("SOURCE — the plan's execution note records the honest history (B90-L1 named, S90-A recorded)", () => {
    // THE AMENDMENT PIN: the note that was false ("corrected before
    // delivery") now carries the honest record — the B90-L1 finding of
    // the thirty-eighth audit and the S90-A completion — so the
    // doc-claim-as-second-copy hazard is closed by documentation that
    // matches the tree, not by a claim that outruns it.
    expect(s89PlanSource).toMatch(/B90-L1/);
    expect(s89PlanSource).toMatch(/S90-A/);
  });

  it("SOURCE — the assistant's message element IS an input (the vocabulary contract, live at the element)", () => {
    // THE SURVIVAL PIN: the element the whole cap-mirror family pins
    // is a single-line <input> — the tagAround slice at the aria-label
    // anchor must START with "<input". If the element ever changes
    // shape, this pin forces the family's vocabulary to be re-examined
    // in the same commit (the pin that keeps the pins honest).
    const tag = tagAround(
      assistantSource,
      'aria-label="Message the AI design assistant"',
    );
    expect(tag.startsWith("<input")).toBe(true);
    expect(tag).toContain("maxLength={1000}");
  });
});

describe("the seed's dates are calendar-independent — the stats window keeps its designed shape (S90-B / B90-I1)", () => {
  it("SOURCE — both seeded lastOpenedAt dates are relative to the seed moment, inside the 7-day window", () => {
    // THE DEFECT PIN: pre-fix the two lastOpenedAt sites carried the
    // fixed 2026-09-26/25 literals (aged out of the window by the
    // 2026-10-06 tree — a fresh seed's "Active this week" read 0). The
    // daysAgo form pins the DESIGNED window shape: both projects 2 and
    // 3 days back, inside the window on every future re-seed, any
    // calendar.
    expect(seedSource).toMatch(/lastOpenedAt: daysAgo\(2\)/);
    expect(seedSource).toMatch(/lastOpenedAt: daysAgo\(3\)/);
  });

  it("SOURCE — the fixed-literal date form is gone from the seed (no lastOpenedAt: d( survives)", () => {
    // THE DEFECT PIN: the fixed-literal helper's lastOpenedAt form is
    // the time bomb's own shape — a calendar date that ages out of the
    // window silently. The negative pin keeps it from ever returning.
    expect(seedSource).not.toMatch(/lastOpenedAt: d\(/);
    expect(seedSource).not.toMatch(/createdAt: d\(/);
  });

  it("SOURCE — the backdate helper's comment premise is the calendar-independent form", () => {
    // THE AMENDMENT PIN: pre-fix the comment claimed "The seed's two
    // fixed dates (Sep 26 / Sep 25) both sit inside the window on
    // fresh re-seeds" — false since the literals aged out. The
    // re-anchored premise: the two lastOpenedAt dates are relative to
    // the seed moment, so both sit inside the window on EVERY fresh
    // re-seed, calendar-independent.
    expect(backdateHelperSource).toMatch(/calendar-independent/);
    expect(backdateHelperSource).not.toMatch(/Sep 26/);
  });

  it("SOURCE — the stats route's 7-day window stays canonical (the seam the seed's shape serves)", () => {
    // THE SURVIVAL PIN: the window the seed's relative dates serve is
    // the stats route's own 7 * 24 * 60 * 60 * 1000 constant — the
    // single source of the window the calendar independence must keep
    // satisfying.
    expect(statsRouteSource).toMatch(/7 \* 24 \* 60 \* 60 \* 1000/);
  });
});
