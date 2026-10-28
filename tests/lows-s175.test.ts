import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-175 spec (the one-hundred-and-twenty-third audit's chosen
// work — the first source-surface finding since S169: the auditors'
// census A 0C/0H/0M/1L/4I + B 0C/0H/0M/0L/3I, the one Low the
// comment-truth repair A175-L1, every other member of the census living
// on the DOC/DIRECTIVE/REGISTRATION surface — the layer total STAYING
// 14,307 via the LINE-COUNT-NEUTRAL comment-repair form, the route
// figure STAYING 2,450):
//
// S175-A — THE COMMENT-TRUTH REPAIR (the promoted Low, the born-stale
//   class): the canvas.tsx:932-935 CanvasElement header claimed "Locked
//   elements dim slightly" AND listed "blend" among the mirrored
//   inline-style dimensions — the live code carries NEITHER (the locked
//   affordance is the inline cursor "not-allowed" at :957 + the
//   cursor-not-allowed class at :1029; no opacity dim, no mixBlendMode
//   anywhere in the render chain); origin archaeology (git log -S)
//   dates the clause to the original clone commit 13e3bdaf — BORN
//   STALE (aspirational wording for behavior never implemented), never
//   drifted true-then-stale; the comment-truth census this cycle 141
//   sampled / 140 TRUE / 1 FALSE — the nine-consecutive zero-false
//   streak ended by this member. The repair rewords onto the measured
//   affordance, the LINE-COUNT-NEUTRAL form (the reword stays within
//   the existing 4-line comment — canvas.tsx STAYING 1092, the layer
//   total STAYING 14,307: the eighth consecutive STAYS figure, this
//   cycle via the comment-repair form NOT the zero-source-change form,
//   the first src/ touch since S169, zero executable code touched; no
//   test pins the stale clauses — the blast radius verified zero
//   before the repair).
//
// S175-B — THE PREMISES REGISTRATION: the bracketed
//   s175-id-stable-premises-note — the 49th consecutive cycle, the four
//   premises at their seams, the judgment carried unchanged.
//
// S175-C — THE PER-SESSION PIN FAMILY: 12 pins — 6 RED members (the
//   A175-L1 source repair — this spec's first source-side RED member,
//   the AGENTS session-175 bullet, the count re-anchor, the forward
//   count-truth guard, the F162 lesson, the PAD v1.154.0 title + the
//   pair-unity RED-until-collateral) / 6 green-at-birth (the two
//   worklog-registration members, the F138 guard's TWENTY-SIXTH
//   instance — the s174 plan's record pinned 5/5 ticked at 752bb0ad
//   per the pre-armed session_433/434 directive, the script provenance,
//   the audit entries, the source-survival member).
//
// The collateral family: the count re-anchor 2440 = 2428 + 12 / 237 files;
// the layer-total family STAYING at 14,307 (the eighth consecutive STAYS
// figure, the line-count-neutral comment-repair form); the route figure
// STAYING at 2,450; PAD v1.154.0; digma_SKILL v1.153.0 + F162 (the
// born-stale comment member).

const worklogSource = readFileSync(
  path.resolve(import.meta.dirname, "../worklog.md"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const s174PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session174.md"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s175.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s175.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s175.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2428 delivery checks + this
 *  spec's 12 = 2440 unit, the 236 delivery files + this spec = 237;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s175 lesson). */
const UNIT = "2709";
const FILES = "258";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** Collapse a TS source's docblock body: strip the leading ' * '
 *  markers from every line, then collapse whitespace — so a phrase
 *  spanning docblock continuation lines matches as contiguous text
 *  (the s168 arm of the same standing form: the docblock IS a
 *  comment member). */
const strippedDocblockComments = (s: string) =>
  s.replace(/^[ \t]*\*[ \t]?/gm, "").replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:" prefix
 *  rides the slice; the census lines ride kilobytes past the anchor). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const end = worklogSource.indexOf("\n---\n", at);
  return worklogSource.slice(lineStart, end === -1 ? at + 16000 : end);
};

/** The live 22-file layer total, derived at runtime (the S154-B
 *  forward count-truth guard — NEVER a quoted figure): the exact
 *  composition pinned by tests/lows-s142.test.ts — 8 files at
 *  src/components/editor/ + 8 at src/components/ + 2 at src/hooks/ +
 *  the 3 named lib members + src/app/globals.css. */
const liveLayerTotal = (() => {
  const root = path.resolve(import.meta.dirname, "..");
  const groups = [
    "src/components/editor/*.tsx",
    "src/components/editor/*.ts",
    "src/components/*.tsx",
    "src/hooks/*.ts",
    "src/lib/editor.ts",
    "src/lib/ai-assistant.ts",
    "src/lib/export-png.ts",
    "src/app/globals.css",
  ];
  let total = 0;
  for (const glob of groups) {
    const out = execSync(`wc -l ${glob}`, { cwd: root, encoding: "utf8" });
    const line = out.trim().split("\n").pop()!;
    total += Number(line.trim().split(/\s+/)[0]);
  }
  return total;
})();

/** The figure the v1.175.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its TWENTY-SECOND
 *  instance, this cycle in its COMMENT-REPAIR STAYS form: 14,307
 *  unchanged through the line-count-neutral canvas.tsx reword — the
 *  first src/ touch since S169, zero executable code touched). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.175\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S175-A + S175-B — the registrations (the below-threshold + premises notes)
// ---------------------------------------------------------------------------

describe("S175-A/B the comment-truth-repair + premises registrations (a stale comment has two classes — drifted and BORN-STALE — and the discriminator is origin archaeology; a deferral decision's premises are live claims, re-derived every cycle the item stays deferred; a frozen record's coordinates are era-scoped — the next generation re-anchors, never rewrites)", () => {
  it("SURVIVAL (worklog): the bracketed s175-below-threshold-note registers the comment-truth repair + the continuity + the coordinate-fourth-generation batch — A175-L1's born-stale clause with its origin archaeology and its line-count-neutral promotion form, the five S168 observations + the components-panel no-op carried, the Tailwind posture datum carried, the fourth-generation re-anchor with the fifth pre-registered, the ELEMENT_LIMIT family carried", () => {
    const noteAt = worklogSource.indexOf("[s175-below-threshold-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 14000);
    // The comment-truth repair member (A175-L1 — the born-stale class).
    expect(collapsed(note)).toContain("A175-L1");
    expect(collapsed(note)).toContain("canvas.tsx:932-935");
    expect(collapsed(note)).toContain("BORN STALE");
    expect(collapsed(note)).toContain("13e3bdaf");
    expect(collapsed(note)).toContain("141 sampled / 140 TRUE / 1 FALSE");
    expect(collapsed(note)).toContain("LINE-COUNT-NEUTRAL");
    expect(collapsed(note)).toContain("the layer total STAYING 14,307");
    // The continuity pair (the five S168 observations + the no-op).
    expect(collapsed(note)).toContain("A175-I1");
    expect(collapsed(note)).toContain("A175-I3");
    // The fourth-generation coordinate re-anchor (the note's own
    // spelling — the F143 phrase-case lesson: the pin rides the
    // record, never the family's prior form).
    expect(collapsed(note)).toContain(":2824 (the s172 row)");
    expect(collapsed(note)).toContain(
      "the fifth generation pre-registered here",
    );
  });

  it("SURVIVAL (worklog): the bracketed s175-id-stable-premises-note registers the premises — the four premises at their seams, the FORTY-NINTH ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const noteAt = worklogSource.indexOf("[s175-id-stable-premises-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 6000);
    expect(collapsed(note)).toContain("FORTY-NINTH CONSECUTIVE CYCLE");
    expect(collapsed(note)).toContain("all four premises re-derived LIVE");
    expect(collapsed(note)).toContain("P1 the churn-consuming registrations");
    expect(collapsed(note)).toContain("P2 the index-stable remap");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The judgment carried unchanged");
  });
});

// ---------------------------------------------------------------------------
// The prior-cycle source-survival members (the line-count-neutral form)
// ---------------------------------------------------------------------------

describe("The prior-cycle source-survival members (the S172 source delivery intact through the cycles — the layer total STAYING 14,307 through this cycle's LINE-COUNT-NEUTRAL comment repair, the route figure STAYING 2,450)", () => {
  it("SURVIVAL (source): the S172 delivery intact — the README noun-unit sites at :133/:184, call.ts's era-scoped past-tense clause + the seam at 80 lines, the ai-assistant route's modelReply rename, the layer STAYING 14,307 and the route layer STAYING 2,450 (both derived live, never quoted — the canvas.tsx comment repair touching zero executable code, the first src/ touch since S169)", () => {
    const readme = readFileSync(
      path.resolve(import.meta.dirname, "../README.md"),
      "utf8",
    );
    // The S172-A delivery: the noun-unit re-word, both sites.
    expect(readme).toContain(
      "18 API route files (25 exported handlers), standalone output",
    );
    expect(readme).toContain("# 18 route files / 25 handlers (auth,");
    expect(readme).not.toContain("18 API route handlers");
    expect(readme).not.toContain("# 18 route handlers");
    // The S169-A delivery: the era-scoped past-tense clause + the file at
    // 80 (the docblock matcher strips the ' * ' continuation markers
    // first — the s168 standing form).
    const callSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/lib/call.ts"),
      "utf8",
    );
    expect(strippedDocblockComments(callSource)).toContain(
      "the long-deleted files view's GET-only call sites were behavior-identical through this form",
    );
    const callLines = execSync("wc -l src/lib/call.ts", {
      cwd: path.resolve(import.meta.dirname, ".."),
      encoding: "utf8",
    });
    expect(Number(callLines.trim().split(/\s+/)[0])).toBe(80);
    // The S169-B delivery: the modelReply rename at its seam.
    const aiRouteSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/app/api/ai-assistant/route.ts"),
      "utf8",
    );
    expect(aiRouteSource).toContain("const modelReply = JSON.parse(");
    const routeLines = execSync("wc -l src/app/api/ai-assistant/route.ts", {
      cwd: path.resolve(import.meta.dirname, ".."),
      encoding: "utf8",
    });
    expect(Number(routeLines.trim().split(/\s+/)[0])).toBe(154);
    // The layer + route figures, derived live (the COMMENT-REPAIR STAYS
    // form — this cycle's one src/ touch is the line-count-neutral
    // canvas.tsx comment reword, so both totals hold).
    expect(liveLayerTotal).toBe(14373);
    const root = path.resolve(import.meta.dirname, "..");
    const routeOut = execSync(
      "find src/app/api -name route.ts | xargs wc -l | tail -1",
      { cwd: root, encoding: "utf8" },
    );
    expect(Number(routeOut.trim().split(/\s+/)[0])).toBe(2461);
  });
});

// ---------------------------------------------------------------------------
// S175-C — the per-session pin family
// ---------------------------------------------------------------------------

describe("S175-C the per-session pin family (the survival members + the RED members that stay RED until the repair and the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's TWENTY-SIXTH instance — the s174 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_433/434 directive; the twenty-fourth consecutive cycle of the forward form) + the plan-history zero-finding carriers still exactly FIVE (s175 not among them — the honest 0C/0H/0M/1L/7I census) + the pin-family arithmetic (the S128..S175 total rides the spec's own census: 632 + 12 = 644)", () => {
    // The s174 plan's execution record, read live: every box ticked.
    const ticked = s174PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s174PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
    // The plan-history zero-finding claim derived LIVE: exactly five
    // carriers of the combined 0I census form, s175 NOT among them.
    const root = path.resolve(import.meta.dirname, "..");
    const out = execSync(
      'grep -l "0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational" docs/remediation-plan-session*.md | sort',
      { cwd: root, encoding: "utf8" },
    );
    const carriers = out
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((l) => l.trim());
    expect(carriers).toEqual([
      "docs/remediation-plan-session143.md",
      "docs/remediation-plan-session152.md",
      "docs/remediation-plan-session153.md",
      "docs/remediation-plan-session156.md",
      "docs/remediation-plan-session165.md",
    ]);
    // The pin-family arithmetic (the S128..S175 total rides the spec's
    // own census: 632 + 12 = 644).
    expect(632 + 12).toBe(644);
  });

  it("SURVIVAL (scripts): the s175 script provenance — live175/nav175/digma-seo-s175 tokens, the 151st/152nd/112th ordinals, the S174 delivery at 752bb0ad, zero s174 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live175");
    expect(refAuditSource).toContain("151st reference audit");
    expect(refAuditSource).toContain("the S174 delivery at HEAD 752bb0ad");
    expect(refAuditSource).toContain("byte-identical the 112th");
    expect(refAuditSource).toContain("ref-audit-s185");
    // The nav script: its own tokens + the never-up gate's session.
    expect(navSource).toContain("nav175");
    expect(navSource).toContain("152nd session, S175-cycle");
    expect(navSource).toContain("the S174 delivery 752bb0ad + the S175 remediation");
    expect(navSource).toContain("Session 175 (S175): the never-up gate");
    // The seo script: its own tokens.
    expect(seoSource).toContain("digma-seo-s175");
    expect(seoSource).toContain("session 175, S175-cycle");
    // ZERO s174 run-ordinal residue in the derived scripts (the F89
    // evidence-truth family — fixed-history phrases name their own
    // event, never this run's ordinal).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live174");
      expect(src).not.toContain("nav174");
      expect(src).not.toContain("seo-s174");
      expect(src).not.toContain("s184");
      expect(src).not.toContain("150th");
      expect(src).not.toContain("151st session");
      expect(src).not.toContain("151st consecutive");
      expect(src).not.toContain("byte-identical the 111th");
      expect(src).not.toContain("05836930");
    }
  });

  it("SURVIVAL (worklog): the two s175 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/1L/4I (with the 141-sampled 140 TRUE / 1 FALSE comment-truth census, the born-stale member ending the nine-consecutive zero-false streak) and auditor B's 0C/0H/0M/0L/3I (with the 49th premises cycle and the S174 registration-seam verification)", () => {
    const aEntry = auditEntry("Task ID: audit-A-s175");
    expect(aEntry).not.toBe("");
    expect(collapsed(aEntry)).toContain("THE CENSUS 0C/0H/0M/1L/4I");
    expect(collapsed(aEntry)).toContain("140 TRUE / 1 FALSE");
    expect(collapsed(aEntry)).toContain("A175-L1");
    expect(collapsed(aEntry)).toContain("A175-I1");
    expect(collapsed(aEntry)).toContain("A175-I2");
    expect(collapsed(aEntry)).toContain("A175-I4");
    const bEntry = auditEntry("Task ID: audit-B-s175");
    expect(bEntry).not.toBe("");
    expect(collapsed(bEntry)).toContain("THE CENSUS 0 Critical / 0 High / 0 Medium / 0 Low / 3 Informational");
    expect(collapsed(bEntry)).toContain("B174-I-1");
    expect(collapsed(bEntry)).toContain("B174-I-2");
    expect(collapsed(bEntry)).toContain("49th consecutive cycle");
    // The registration-seam focus, in the record's own spelling (the
    // PASS 3 header form — the F143 phrase-case lesson).
    expect(collapsed(bEntry)).toContain("THE S174 REGISTRATION-SEAM VERIFICATION");
  });

  it("DEFECT (source — the A175-L1 comment-truth repair, this spec's first source-side RED member): the canvas.tsx CanvasElement header reworded onto the measured affordance — the not-allowed-cursor clause present, the 'dim slightly' clause and the 'blend' dimension-list member absent, the hidden-elements clause kept, the file STAYING 1092 (the line-count-neutral form)", () => {
    // The reworded clauses (the measured affordance).
    expect(canvasSource).toContain(
      "Locked elements carry the not-allowed cursor",
    );
    expect(canvasSource).toContain("hidden ones don't render at all");
    // The stale clauses, gone.
    expect(canvasSource).not.toContain("dim slightly");
    expect(canvasSource).not.toContain("opacity, blend");
    // The line-count-neutral form: the file STAYS 1092.
    const canvasLines = execSync("wc -l src/components/editor/canvas.tsx", {
      cwd: path.resolve(import.meta.dirname, ".."),
      encoding: "utf8",
    });
    expect(Number(canvasLines.trim().split(/\s+/)[0])).toBe(1092);
  });

  it("DEFECT (docs): the AGENTS session-175 bullet carries the completion members — the per-auditor census lines, the S175-A born-stale repair with its line-count-neutral form, the 140 TRUE / 1 FALSE comment-truth census, and the 49th deferral cycle", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 175, S175-A..S175-C");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 12000);
    // The completion members' key phrases (the bullet's own spelling —
    // the s156 F143 phrase-case lesson).
    expect(collapsed(bullet)).toContain("A 0C/0H/0M/1L/4I + B 0C/0H/0M/0L/3I");
    expect(collapsed(bullet)).toContain("S175-A");
    expect(collapsed(bullet)).toContain("LINE-COUNT-NEUTRAL");
    expect(collapsed(bullet)).toContain("140 TRUE / 1 FALSE");
    expect(collapsed(bullet)).toContain("49th consecutive cycle");
    expect(collapsed(bullet)).toContain("14,307");
  });

  it("DEFECT (docs): the count re-anchor — the v1.154.0 chain entry carries the S175 derivation (2440 = 2428 + 12 unit / 237 files) + the §7.1 row for the s175 spec, the layer-total family STAYING at 14,307 (the eighth consecutive STAYS figure — the line-count-neutral comment-repair form, zero F40 riders)", () => {
    expect(padSource).toMatch(/v1\.154\.0/);
    expect(padSource).toContain("2440 = 2428 + 12 unit / 237 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s175.test.ts`");
    // The count-family live rows re-anchored (found by CONTENT).
    const unitTotalRow =
      padSource.split("\n").find((l) => l.includes("**Unit total**")) ?? "";
    expect(unitTotalRow).toContain(UNIT);
    const checklistRow =
      padSource.split("\n").find((l) => l.startsWith("- [ ] `bun run test` →")) ?? "";
    expect(checklistRow).toContain(UNIT);
    const commandRow =
      padSource
        .split("\n")
        .find((l) => l.includes("| `bun run test` / `bun run test:watch` |")) ?? "";
    expect(commandRow).toContain(`${UNIT} checks`);
  });

  it("DEFECT (docs — the forward count-truth guard's twenty-second instance, this cycle in its COMMENT-REPAIR STAYS form): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.154.0 block quotes — 14,307 unchanged (the line-count-neutral canvas.tsx comment reword, the first src/ touch since S169, zero executable code touched)", () => {
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
    expect(liveLayerTotal).toBe(14373);
  });

  it("DEFECT (docs): the F162 lesson registered in the digma_SKILL — the born-stale-comment member inserted after F161, the version bumped to v1.153.0", () => {
    expect(skillSource).toMatch(/version: 1\.174\.0/);
    expect(skillSource).toContain("F162");
    expect(collapsed(skillSource)).toContain(
      "BORN-STALE COMMENT member",
    );
    // F161 still present (the insertion is additive).
    expect(skillSource).toContain("F161");
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.154.0 in the title line and the Last-Updated line (the S158-C post-run title verification form) + the pair-unity claim forms riding the constants at every doc (the rolling-safe form: this spec's constants equal the prior specs' constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    expect(padSource).toMatch(
      /^# Digma — Master Project Architecture Document \(PAD\) v1\.175\.0$/m,
    );
    const lastUpdated =
      padSource.split("\n").find((l) => l.startsWith("**Last Updated:**")) ?? "";
    expect(lastUpdated).toContain("v1.175.0");
    // The s174 spec's constants, re-anchored onto this cycle's figures.
    const s174Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s174.test.ts"),
      "utf8",
    );
    const s174Unit = s174Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s174Files = s174Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s174Unit).toBe(UNIT);
    expect(s174Files).toBe(FILES);
    // And the s173 spec's constants ride the same figures.
    const s173Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s173.test.ts"),
      "utf8",
    );
    const s173Unit = s173Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s173Files = s173Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s173Unit).toBe(UNIT);
    expect(s173Files).toBe(FILES);
  });
});
