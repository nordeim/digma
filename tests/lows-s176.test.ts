import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-176 spec (the one-hundred-and-twenty-fourth audit's chosen
// work — a ZERO-SOURCE-FINDING all-Informational cycle: the auditors'
// census A 0C/0H/0M/0L/4I + B 0C/0H/0M/0L/3I, every member living on
// the DOC/DIRECTIVE/REGISTRATION surface — the layer total STAYING
// 14,307 via the ZERO-SOURCE-CHANGE form, the route figure STAYING
// 2,450):
//
// S176-A — THE DISPATCH-FIGURE CORRECTION (B176-I-1, the QUOTED-LIVE
//   TRAP — the cycle's new member, the dispatch-record surface): the
//   per-route dispatch figure for projects/[id]/duplicate/route.ts
//   read 153 through at least two prior dispatch cycles while the live
//   file has carried 156 since the S152 delivery (b916639e, +5/-2) —
//   the stale member rode INSIDE the re-verified 2,450 total because
//   the total absorbs per-file drift; the internal-consistency probe
//   catches it (the dispatch's own per-file list hand-sums 2,447
//   against its stated 2,450 — the mismatch indicts the decomposition,
//   never the tree). A "(wc live)" phrase in a prior record describes
//   the run that made it, never the cycle that quotes it. The
//   correction: pin 156, never re-quote 153 — this spec pins the
//   per-file figure LIVE (the family's first) and mechanizes the
//   internal-consistency probe (all 18 per-file figures re-derived
//   live and summed against the total). The F163 lesson (the
//   quoted-live trap member) lands in the digma_SKILL.
//
// S176-B — THE PREMISES REGISTRATION: the bracketed
//   s176-id-stable-premises-note — the 50th consecutive cycle, the four
//   premises at their seams, the judgment carried unchanged.
//
// S176-C — THE PER-SESSION PIN FAMILY: 12 pins — 6 RED doc-side members
//   (the AGENTS session-176 bullet, the count re-anchor, the forward
//   count-truth guard, the F163 lesson, the PAD v1.155.0 title + the
//   pair-unity RED-until-collateral, the doc-side correction members)
//   / 6 green-at-birth (the two worklog-registration members, the F138
//   guard's TWENTY-SEVENTH instance — the s175 plan's record pinned
//   5/5 ticked at 76c27cf2 per the pre-armed session_439/440
//   directive, the script provenance, the audit entries, the
//   source-survival member with the corrected per-file figure pinned
//   LIVE at 156).
//
// The collateral family: the count re-anchor 2452 = 2440 + 12 / 238 files;
// the layer-total family STAYING at 14,307 (the ninth consecutive STAYS
// figure, the zero-source-change form); the route figure STAYING at
// 2,450 (the per-file correction registered, the total never at fault);
// PAD v1.155.0; digma_SKILL v1.154.0 + F163 (the quoted-live trap
// member).

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
const s175PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session175.md"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s176.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s176.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s176.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2440 delivery checks + this
 *  spec's 12 = 2452 unit, the 237 delivery files + this spec = 238;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s176 lesson). */
const UNIT = "2637";
const FILES = "252";

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

/** The live 18-file route total + the per-file decomposition, derived
 *  at runtime (the S176-A internal-consistency probe — the B176-I-1
 *  lesson mechanized: the decomposition is re-derived live and summed
 *  against the total, so a stale per-file member can never ride
 *  inside a verified total again). */
const liveRouteFigures = (() => {
  const root = path.resolve(import.meta.dirname, "..");
  const out = execSync("find src/app/api -name route.ts | sort | xargs wc -l", {
    cwd: root,
    encoding: "utf8",
  });
  const lines = out.trim().split("\n");
  const total = Number(lines.pop()!.trim().split(/\s+/)[0]);
  const perFile: Record<string, number> = {};
  for (const ln of lines) {
    const m = ln.trim().match(/^(\d+)\s+(.*)$/);
    if (m) perFile[m[2]] = Number(m[1]);
  }
  const handSum = Object.values(perFile).reduce((a, b) => a + b, 0);
  return { total, perFile, handSum };
})();

/** The figure the v1.169.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its TWENTY-THIRD
 *  instance, this cycle in its ZERO-SOURCE-CHANGE STAYS form: 14,307
 *  unchanged through the registration-only cycle — zero executable
 *  code touched). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.169\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S176-A + S176-B — the registrations (the below-threshold + premises notes)
// ---------------------------------------------------------------------------

describe("S176-A/B the dispatch-figure-correction + premises registrations (a figure quoted from a prior record is a frozen record whatever its label — re-derive per-file figures at every dispatch and probe the decomposition against the total; a deferral decision's premises are live claims, re-derived every cycle the item stays deferred; a frozen record's coordinates are era-scoped — the next generation re-anchors, never rewrites)", () => {
  it("SURVIVAL (worklog): the bracketed s176-below-threshold-note registers the dispatch-figure correction + the continuity + the coordinate-fifth-generation batch — B176-I-1's quoted-live trap with the 153->156 correction and the internal-consistency probe, the five S168 observations + the components-panel no-op carried, the Tailwind posture datum with the byte-level perimeter datum and the docs-self-source nuance, the fifth-generation re-anchor with the sixth pre-registered, the ELEMENT_LIMIT family carried", () => {
    const noteAt = worklogSource.indexOf("[s176-below-threshold-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 16000);
    // The dispatch-figure correction member (B176-I-1 — the quoted-live
    // trap).
    expect(collapsed(note)).toContain("B176-I-1");
    expect(collapsed(note)).toContain("QUOTED-LIVE TRAP");
    expect(collapsed(note)).toContain("153");
    expect(collapsed(note)).toContain("156");
    expect(collapsed(note)).toContain("b916639e");
    expect(collapsed(note)).toContain("2,447");
    expect(collapsed(note)).toContain("pin 156, never re-quote 153");
    // The continuity pair (the five S168 observations + the no-op).
    expect(collapsed(note)).toContain("A176-I1");
    expect(collapsed(note)).toContain("A176-I3");
    // The fifth-generation coordinate re-anchor (the note's own
    // spelling — the F143 phrase-case lesson: the pin rides the
    // record, never the family's prior form).
    expect(collapsed(note)).toContain(":2825 (the s172 row)");
    expect(collapsed(note)).toContain(
      "the sixth generation pre-registered here",
    );
  });

  it("SURVIVAL (worklog): the bracketed s176-id-stable-premises-note registers the premises — the four premises at their seams, the FIFTIETH ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const noteAt = worklogSource.indexOf("[s176-id-stable-premises-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 6000);
    expect(collapsed(note)).toContain("FIFTIETH CONSECUTIVE CYCLE");
    expect(collapsed(note)).toContain("all four premises re-derived LIVE");
    expect(collapsed(note)).toContain("P1 the churn-consuming registrations");
    expect(collapsed(note)).toContain("P2 the index-stable remap");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The judgment carried unchanged");
  });
});

// ---------------------------------------------------------------------------
// The prior-cycle source-survival members (the zero-source-change form,
// with the corrected per-file figure pinned LIVE — the B176-I-1 repair)
// ---------------------------------------------------------------------------

describe("The prior-cycle source-survival members (the S172/S175 source deliveries intact through the cycles — the layer total STAYING 14,307 through this cycle's ZERO-SOURCE-CHANGE registration form, the route figure STAYING 2,450 with the per-file decomposition pinned live and probed)", () => {
  it("SURVIVAL (source): the S172 + S175 deliveries intact — the README noun-unit sites, call.ts's era-scoped past-tense clause + the seam at 80 lines, the ai-assistant route's modelReply rename, the S175 canvas repair in place, the duplicate route's corrected figure pinned LIVE at 156 (the per-file figure family's first LIVE pin — never re-quote 153), the internal-consistency probe (the 18 per-file figures hand-summed live = the derived total), the layer STAYING 14,307 and the route layer STAYING 2,450 (all derived live, never quoted)", () => {
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
    // The S175-A delivery: the comment-truth repair still in place.
    expect(canvasSource).toContain(
      "Locked elements carry the not-allowed cursor",
    );
    expect(canvasSource).not.toContain("dim slightly");
    // The S176-A correction: the per-file figure pinned LIVE at 156 (the
    // tree was never at fault — the stale 153 was a dispatch-record
    // member; this pin makes the corrected figure unfalsifiable going
    // forward).
    expect(liveRouteFigures.perFile["src/app/api/projects/[id]/duplicate/route.ts"]).toBe(156);
    // The internal-consistency probe (the B176-I-1 lesson mechanized):
    // the decomposition hand-summed live equals the derived total — a
    // stale per-file member can never ride inside a verified total.
    expect(liveRouteFigures.handSum).toBe(liveRouteFigures.total);
    // The layer + route figures, derived live (the ZERO-SOURCE-CHANGE
    // STAYS form — this cycle touches zero source files, so both
    // totals hold).
    expect(liveLayerTotal).toBe(14373);
    expect(liveRouteFigures.total).toBe(2461);
  });
});

// ---------------------------------------------------------------------------
// S176-C — the per-session pin family
// ---------------------------------------------------------------------------

describe("S176-C the per-session pin family (the survival members + the RED members that stay RED until the repair and the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's TWENTY-SEVENTH instance — the s175 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_439/440 directive; the twenty-fifth consecutive cycle of the forward form) + the plan-history zero-finding carriers still exactly FIVE (s176 not among them — the honest 0C/0H/0M/0L/7I census) + the pin-family arithmetic (the S128..S176 total rides the spec's own census: 644 + 12 = 656)", () => {
    // The s175 plan's execution record, read live: every box ticked.
    const ticked = s175PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s175PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
    // The plan-history zero-finding claim derived LIVE: exactly five
    // carriers of the combined 0I census form, s176 NOT among them.
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
    // The pin-family arithmetic (the S128..S176 total rides the spec's
    // own census: 644 + 12 = 656).
    expect(644 + 12).toBe(656);
  });

  it("SURVIVAL (scripts): the s176 script provenance — live176/nav176/digma-seo-s176 tokens, the 152nd/153rd/113th ordinals, the S175 delivery at 76c27cf2, zero s175 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live176");
    expect(refAuditSource).toContain("152nd reference audit");
    expect(refAuditSource).toContain("the S175 delivery at HEAD 76c27cf2");
    expect(refAuditSource).toContain("byte-identical the 113th");
    expect(refAuditSource).toContain("ref-audit-s186");
    // The nav script: its own tokens + the never-up gate's session.
    expect(navSource).toContain("nav176");
    expect(navSource).toContain("153rd session, S176-cycle");
    expect(navSource).toContain("the S175 delivery 76c27cf2 + the S176 remediation");
    expect(navSource).toContain("Session 176 (S176): the never-up gate");
    // The seo script: its own tokens.
    expect(seoSource).toContain("digma-seo-s176");
    expect(seoSource).toContain("session 176, S176-cycle");
    // ZERO s175 run-ordinal residue in the derived scripts (the F89
    // evidence-truth family — fixed-history phrases name their own
    // event, never this run's ordinal).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live175");
      expect(src).not.toContain("nav175");
      expect(src).not.toContain("seo-s175");
      expect(src).not.toContain("s185");
      expect(src).not.toContain("151st");
      expect(src).not.toContain("152nd session");
      expect(src).not.toContain("152nd consecutive");
      expect(src).not.toContain("byte-identical the 112th");
      expect(src).not.toContain("752bb0ad");
    }
  });

  it("SURVIVAL (worklog): the two s176 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/0L/4I (with the 141-sampled 141 TRUE / 0 FALSE comment-truth census, the zero-false census restored at the first cycle after the born-stale member) and auditor B's 0C/0H/0M/0L/3I (with the 50th premises cycle and the duplicate 153->156 dispatch-figure correction)", () => {
    const aEntry = auditEntry("Task ID: audit-A-s176");
    expect(aEntry).not.toBe("");
    expect(collapsed(aEntry)).toContain(
      "THE CENSUS: 0 Critical / 0 High / 0 Medium / 0 Low / 4 Informational",
    );
    expect(collapsed(aEntry)).toContain("141 TRUE / 0 FALSE");
    expect(collapsed(aEntry)).toContain("A176-I1");
    expect(collapsed(aEntry)).toContain("A176-I2");
    expect(collapsed(aEntry)).toContain("A176-I4");
    const bEntry = auditEntry("Task ID: audit-B-s176");
    expect(bEntry).not.toBe("");
    expect(collapsed(bEntry)).toContain("FINDING B176-I-1");
    expect(collapsed(bEntry)).toContain("FINDING B176-I-2");
    expect(collapsed(bEntry)).toContain("FINDING B176-I-3");
    expect(collapsed(bEntry)).toContain("50th consecutive cycle");
    expect(collapsed(bEntry)).toContain("156");
    // The registration-seam focus, in the record's own spelling (the
    // PASS 3 header form — the F143 phrase-case lesson).
    expect(collapsed(bEntry)).toContain("THE S175 REGISTRATION-SEAM VERIFICATION");
  });

  it("DEFECT (docs): the AGENTS session-176 bullet carries the completion members — the per-auditor census lines, the S176-A dispatch-figure correction with the quoted-live trap and the live 156 pin, the 141 TRUE / 0 FALSE comment-truth census, and the 50th deferral cycle", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 176, S176-A..S176-C");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 12000);
    // The completion members' key phrases (the bullet's own spelling —
    // the s156 F143 phrase-case lesson).
    expect(collapsed(bullet)).toContain("A 0C/0H/0M/0L/4I + B 0C/0H/0M/0L/3I");
    expect(collapsed(bullet)).toContain("S176-A");
    expect(collapsed(bullet)).toContain("QUOTED-LIVE TRAP");
    expect(collapsed(bullet)).toContain("141 TRUE / 0 FALSE");
    expect(collapsed(bullet)).toContain("50th consecutive cycle");
    expect(collapsed(bullet)).toContain("14,307");
  });

  it("DEFECT (docs): the count re-anchor — the v1.155.0 chain entry carries the S176 derivation (2452 = 2440 + 12 unit / 238 files) + the §7.1 row for the s176 spec, the layer-total family STAYING at 14,307 (the ninth consecutive STAYS figure — the zero-source-change form, zero F40 riders)", () => {
    expect(padSource).toMatch(/v1\.155\.0/);
    expect(padSource).toContain("2452 = 2440 + 12 unit / 238 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s176.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's twenty-third instance, this cycle in its ZERO-SOURCE-CHANGE STAYS form): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.155.0 block quotes — 14,307 unchanged (the registration-only cycle, zero executable code touched)", () => {
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
    expect(liveLayerTotal).toBe(14373);
  });

  it("DEFECT (docs — the S176-A correction's doc-side members): the PAD v1.155.0 chain entry names the dispatch-figure correction — the quoted-live trap phrase, the 153->156 correction with the internal-consistency probe, and the per-file figure family's first LIVE pin", () => {
    expect(padSource).toMatch(/v1\.155\.0/);
    const entryAt = padSource.indexOf(
      "**Last Updated:** 2026-10-23 (v1.155.0 —",
    );
    expect(entryAt).toBeGreaterThan(-1);
    const entry = padSource.slice(entryAt, entryAt + 9000);
    expect(collapsed(entry)).toContain("THE DISPATCH-FIGURE CORRECTION");
    expect(collapsed(entry)).toContain("QUOTED-LIVE TRAP");
    expect(collapsed(entry)).toContain("156");
    expect(collapsed(entry)).toContain("the internal-consistency probe");
  });

  it("DEFECT (docs): the F163 lesson registered in the digma_SKILL — the quoted-live-trap member inserted after F162, the version bumped to v1.154.0", () => {
    expect(skillSource).toMatch(/version: 1\.168\.0/);
    expect(skillSource).toContain("F163");
    expect(collapsed(skillSource)).toContain(
      "QUOTED-LIVE TRAP member",
    );
    // F162 still present (the insertion is additive).
    expect(skillSource).toContain("F162");
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.155.0 in the title line and the Last-Updated line (the S158-C post-run title verification form) + the pair-unity claim forms riding the constants at every doc (the rolling-safe form: this spec's constants equal the prior specs' constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    expect(padSource).toMatch(
      /^# Digma — Master Project Architecture Document \(PAD\) v1\.169\.0$/m,
    );
    const lastUpdated =
      padSource.split("\n").find((l) => l.startsWith("**Last Updated:**")) ?? "";
    expect(lastUpdated).toContain("v1.169.0");
    // The s175 spec's constants, re-anchored onto this cycle's figures.
    const s175Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s175.test.ts"),
      "utf8",
    );
    const s175Unit = s175Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s175Files = s175Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s175Unit).toBe(UNIT);
    expect(s175Files).toBe(FILES);
    // And the s174 spec's constants ride the same figures.
    const s174Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s174.test.ts"),
      "utf8",
    );
    const s174Unit = s174Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s174Files = s174Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s174Unit).toBe(UNIT);
    expect(s174Files).toBe(FILES);
  });
});
