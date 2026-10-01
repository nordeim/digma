import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The S21-2 empty-draft guard completion (session 53, S53-A).
//
// NumberField has carried the guard since session 21: an EMPTY (or
// partial, unparseable) draft is the user mid-edit, never a request for
// 0 — Number("") === 0 is the trap that teleported elements to x=0 the
// instant a field was cleared. But THREE raw <input type="number">
// controls kept commit-on-keystroke handlers of the form
// `Number(event.target.value) || 0`: the Rotation value input, the
// Opacity value input, and the gradient stop positions. Clearing the
// Opacity field committed opacity: 0 — the element VANISHED mid-edit,
// the autosave persisted it, and the controlled input snapped to the
// committed "0", destroying the in-progress edit. The session-52
// shared-section migration carried the same inputs onto the MOBILE
// Sheet, so a thumb clearing a field on a phone hits the trap on the
// widest surface.
//
// The fix: a GuardedNumberInput — the NumberField contract (a draft
// state, the render-time compare-and-adjust on external value changes,
// the never-commit-an-empty-draft onChange, the
// blur-restores-an-abandoned-draft) in the INLINE chrome the reference
// measured for the value inputs (no label wrapper; the className
// arrives per site — the Rotation/Opacity w-16 suffix rows, the h-6
// stop rows). This suite pins the seam as a SOURCE contract (the
// canvas-memo/text-section pattern); the runtime no-commit behavior is
// pinned by the mobile-properties e2e spec's empty-draft regression
// test. Range sliders are exempt (browsers clamp range values — an
// empty draft state cannot exist on them).

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);

describe("GuardedNumberInput — the S21-2 guard on the inline value inputs (session 53, S53-A)", () => {
  it("defines the guarded inline input with the never-commit-an-empty-draft contract", () => {
    expect(panelSource).toMatch(/function GuardedNumberInput\(/);
    const start = panelSource.indexOf("function GuardedNumberInput(");
    const end = panelSource.indexOf("\nfunction ", start + 10);
    expect(end, "the component definition must be findable").toBeGreaterThan(start);
    const body = panelSource.slice(start, end);
    // The three guard clauses, verbatim from the NumberField contract:
    // (a) an empty draft is mid-edit — the commit is skipped, not zeroed.
    expect(body).toMatch(/event\.target\.value\.trim\(\) === ""/);
    // (b) only a finite parse commits (partial prefixes like "-" are NaN).
    expect(body).toMatch(/Number\.isFinite\(parsed\)/);
    // (c) an abandoned (empty/unparseable) draft restores the current
    // value on blur — the input never dead-ends empty.
    expect(body).toMatch(/onBlur/);
    // (d) the draft follows external value changes (the sanctioned
    // render-time compare-and-adjust, NOT setState-in-effect).
    expect(body).toMatch(/prevValue !== value/);
  });

  it("the three raw value inputs route through the guard (Rotation value, Opacity value, gradient stop positions)", () => {
    // Each consumption site keeps the aria-label the existing e2e
    // locators already resolve — the accessible names are the stable
    // contract (lesson F39's exact:true pins keep working).
    expect(panelSource).toMatch(/<GuardedNumberInput\s*\n?\s*label="Rotation value"/);
    expect(panelSource).toMatch(/<GuardedNumberInput\s*\n?\s*label="Opacity value"/);
    expect(panelSource).toMatch(/<GuardedNumberInput\s*\n?\s*label=\{`Stop \$\{index \+ 1\} position`\}/);
    // The per-site clamps moved to the CALL site (the component commits
    // the parsed number; the consumer clamps its domain).
    expect(panelSource).toMatch(/update\(\{ rotation: [^}]*-180[^}]*180[^}]*\}\)/);
    expect(panelSource).toMatch(/update\(\{ opacity: [^}]*100[^}]*\/ 100 \}\)/);
    // And the unguarded commit pattern is gone from the file entirely —
    // `Number(x) || 0` coerces every empty draft to a committed 0.
    expect(panelSource).not.toMatch(/Number\(event\.target\.value\) \|\| 0/);
  });
});
