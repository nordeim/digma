import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { rangeFillPercent } from "../src/lib/editor";

// The session-71 pins + guards batch (S71-D — the nineteenth audit's
// L-A8 + L-A9 + L-A10 + L-A11).
//
// THE DEFECTS: (L-A8) the lint gate's cheapest-first re-enable rung —
// no-unreachable/no-debugger/no-redeclare still "off" (eslint.config.mjs)
// while the auditor's full-file read observed zero violations. (L-A9)
// the SliderRow guard covers 1 of 5 --range-fill sites — the rotation and
// scale inline sliders compute raw percentages (a persisted 900 renders a
// 300% fill; a persisted 0.05 renders −1.7%). (L-A10)
// clampText/clampOptionalText are behaviorally identical twins — the
// names imply semantics that don't exist. (L-A11) the prompt-injection
// elementSummary surface is clean but UNPINNED — future "enrichment"
// would let a user's own element text inject instructions into the SYSTEM
// position.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the lint re-enable ladder (S71-D / L-A8)", () => {
  const config = src("eslint.config.mjs");

  it("no-unreachable / no-debugger / no-redeclare run as errors", () => {
    // THE DEFECT PIN: pre-fix all three sit at "off" (the cheapest-first
    // ladder's first rung).
    expect(config).toMatch(/"no-unreachable":\s*"error"/);
    expect(config).toMatch(/"no-debugger":\s*"error"/);
    expect(config).toMatch(/"no-redeclare":\s*"error"/);
    expect(config).not.toMatch(/"no-unreachable":\s*"off"/);
    expect(config).not.toMatch(/"no-debugger":\s*"off"/);
    expect(config).not.toMatch(/"no-redeclare":\s*"off"/);
  });

  it("the deeper ladder rungs stay off (the documented order — cheapest first)", () => {
    // THE PRESERVATION PIN: the expensive rungs (unused-vars and friends)
    // stay off until their debt is paid; only the three finding-free
    // rules flip this session.
    expect(config).toMatch(/"no-unused-vars":\s*"off"/);
    expect(config).toMatch(/"no-console":\s*"off"/);
  });
});

describe("the rangeFillPercent seam (S71-D / L-A9)", () => {
  it("clamps the out-of-range family (rotation 900 → 100; scale 0.05 → 0)", () => {
    // THE DEFECT PIN (behavioral): pre-fix no shared helper exists and
    // the inline sites compute raw percentages.
    expect(rangeFillPercent(900, -180, 180)).toBe(100);
    expect(rangeFillPercent(-900, -180, 180)).toBe(0);
    expect(rangeFillPercent(0.05, 0.1, 3)).toBe(0);
    expect(rangeFillPercent(20, 0.1, 3)).toBe(100);
  });

  it("passes the in-range family through and answers 0 for the degenerate max === min", () => {
    expect(rangeFillPercent(16, 0, 100)).toBe(16);
    expect(rangeFillPercent(180, -180, 180)).toBe(100);
    expect(rangeFillPercent(-180, -180, 180)).toBe(0);
    expect(rangeFillPercent(0, 0, 0)).toBe(0);
    expect(rangeFillPercent(5, 3, 3)).toBe(0);
  });

  it("ALL FIVE --range-fill sites consume the seam (SliderRow + angle + rotation + scale + opacity)", () => {
    // THE DEFECT PIN (source): pre-fix only SliderRow carries the guard.
    const panel = src("src/components/editor/properties-panel.tsx");
    expect(panel).toMatch(/const pct = rangeFillPercent\(value,\s*min,\s*max\)/);
    expect(panel).toMatch(/rangeFillPercent\(gradient\.angle,\s*0,\s*360\)/);
    expect(panel).toMatch(/rangeFillPercent\(element\.rotation,\s*-180,\s*180\)/);
    expect(panel).toMatch(/rangeFillPercent\(element\.scale \?\? 1,\s*0\.1,\s*3\)/);
    expect(panel).toMatch(/rangeFillPercent\(element\.opacity,\s*0,\s*1\)/);
  });

  it("the raw inline percentage forms are gone (the rotation/scale drift family)", () => {
    // THE DEFECT PIN (source absence): the unguarded inline math.
    const panel = src("src/components/editor/properties-panel.tsx");
    expect(panel).not.toMatch(/\(\(element\.rotation \+ 180\) \/ 360\) \* 100/);
    expect(panel).not.toMatch(/\(\(element\.scale \?\? 1\) - 0\.1\) \/ 2\.9\) \* 100/);
    expect(panel).not.toMatch(/const pct = max > min \? Math\.min\(Math\.max\(/);
  });
});

describe("the clampText fold (S71-D / L-A10)", () => {
  it("clampOptionalText is deleted (the behaviorally-identical twin)", () => {
    // THE DEFECT PIN: pre-fix validation.ts carries both twins.
    const validation = src("src/lib/validation.ts");
    expect(validation).not.toMatch(/clampOptionalText/);
    expect(validation).toMatch(/export function clampText\(/);
  });

  it("every former clampOptionalText call site consumes clampText", () => {
    // THE DEFECT PIN: pre-fix editor.ts (x2), members/route.ts (x3), and
    // teams/route.ts (x3) import + call the twin.
    const editor = src("src/lib/editor.ts");
    const members = src("src/app/api/teams/[id]/members/route.ts");
    const teams = src("src/app/api/teams/route.ts");
    expect(editor).not.toMatch(/clampOptionalText/);
    expect(members).not.toMatch(/clampOptionalText/);
    expect(teams).not.toMatch(/clampOptionalText/);
    expect(editor).toMatch(/clampText\(raw\?\.name,\s*80\)/);
    expect(editor).toMatch(/clampText\(raw\?\.text,\s*2000\)/);
    expect(members).toMatch(/clampText\(body\?\.role,\s*80\)/);
    expect(teams).toMatch(/clampText\(body\?\.description,\s*300\)/);
    expect(teams).toMatch(/clampText\(body\?\.memberRole,\s*80\)/);
    // Session 97 (S97-C — B97-L1): the teams POST's name site moved to
    // the S73-E explicit rejection (names are identity — reject; the
    // project family's doctrine reaching its sibling). The description/
    // role sites above stay clampText (prose — truncate).
    expect(teams).toContain('fail("VALIDATION", "Team name is too long (max 80)", 400)');
    expect(teams).not.toMatch(/clampText\(body\?\.name,\s*80\)/);
    // Session 98 (S98-A — B98-L1 + B98-L2, the member-family completion):
    // the members POST's name + email sites and the teams POST's
    // memberEmail site joined the explicit rejection (the member name is
    // identity; the email rejects over-length BEFORE the format check —
    // the auth family's contract; the derived memberDisplayFor fallback
    // covers the absent name). The role/memberRole sites above stay
    // clampText (fixed-option labels — the doctrine's carve-out).
    expect(members).toContain('fail("VALIDATION", "Member name is too long (max 80)", 400)');
    expect(members).toContain('fail("VALIDATION", "Email is too long (max 200)", 400)');
    expect(teams).toContain('fail("VALIDATION", "Email is too long (max 200)", 400)');
    expect(members).not.toMatch(/clampText\(body\?\.name,\s*80\)/);
    expect(members).not.toMatch(/clampText\(body\?\.email,\s*200\)/);
    expect(teams).not.toMatch(/clampText\(body\?\.memberEmail,\s*200\)/);
  });

  it("the stale comments quoting the removed twin are updated (the comment-literal discipline)", () => {
    // THE DISCIPLINE PIN: layers-panel.tsx's rename-input comment quotes
    // the clamp form — it must not quote the deleted twin's name.
    const panel = src("src/components/editor/layers-panel.tsx");
    expect(panel).not.toMatch(/clampOptionalText/);
  });
});

describe("the elementSummary injection-surface posture (S71-D / L-A11)", () => {
  it("the builder's summary is enum/geometry-ONLY (no el.name, no el.text reaches the system prompt)", () => {
    // THE POSTURE PIN (a pure guard — GREEN today, pinning the surface
    // against future "enrichment"): the builder emits type, locked, and
    // Math.round'd geometry. A user-authored el.name/el.text interpolated
    // here would inject instructions into the SYSTEM position and steer
    // operations against other elements.
    const panel = src("src/components/editor/ai-assistant.tsx");
    const builderStart = panel.indexOf("state.elements.length > 0");
    const builderEnd = panel.indexOf('"Canvas is empty."');
    expect(builderStart).toBeGreaterThan(-1);
    expect(builderEnd).toBeGreaterThan(builderStart);
    const builder = panel.slice(builderStart, builderEnd);
    expect(builder).toMatch(/el\.type/);
    expect(builder).toMatch(/el\.locked/);
    expect(builder).toMatch(/Math\.round\(el\.x\)/);
    expect(builder).toMatch(/Math\.round\(el\.y\)/);
    expect(builder).toMatch(/Math\.round\(el\.width\)/);
    expect(builder).toMatch(/Math\.round\(el\.height\)/);
    // THE INJECTION-SURFACE ABSENCE: the two user-authored string fields.
    expect(builder).not.toMatch(/el\.name\b/);
    expect(builder).not.toMatch(/el\.text\b/);
  });
});
