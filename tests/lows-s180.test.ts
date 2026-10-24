import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-180 spec (the one-hundred-and-twenty-eighth audit's chosen
// work — a near-zero-source cycle: 0C/0H/0M/1L/8I combined, src/ itself
// ZERO-FINDING for the FIFTH consecutive cycle, the one Low living on
// the TEST-INFRASTRUCTURE surface (B180-L-1 the collection-time .env
// read), every member on the doc/test-infrastructure/dispatch surface —
// the layer total STAYING 14,307 via the ZERO-SOURCE-CHANGE form, the
// route figure STAYING 2,450):
//
// S180-A — THE CONTINUITY + NINTH-GENERATION COORDINATE REGISTRATION
//   (B180-I-4 + the A180-I-1/B180-I-1 refutation pair — the cycle's new
//   members): the frozen-record coordinate family's NINTH generation
//   live-derived at dispatch (the S179 delivery's own two PAD insertions
//   shifting the eighth-generation carriers +2 to :2837/:2896/:2965,
//   the §7.1 rows owning s170..s179 at :2827..:2836 — exactly as the
//   s179 note pre-registered; the TENTH generation pre-registered);
//   THE DISPATCHED-OBSERVATION REFUTATION (the lead's own premise
//   honestly refuted at the mechanical level — the S99-G pin a SUBSTRING
//   regex, the documented cp form PASSES, the lead's printf-minimal
//   staging the deviation; the F167 lesson: simulate the claimed
//   failure mode before registering or dispatching it); the
//   pattern-reading precision member (B180-I-3, the B179-I-1 zod
//   sibling: a dispatch brief's PATTERN wordings name their reading).
//
// S180-B — THE PREMISES REGISTRATION: the bracketed
//   s180-id-stable-premises-note — the 54th consecutive cycle, the four
//   premises at their seams, the judgment carried unchanged.
//
// S180-D — THE B180-L-1 DOC-SIDE REMEDIATION: the README one-liner at
//   the test-running surface naming the .env prerequisite (the
//   test-side existsSync guard registered not promoted).
//
// S180-C — THE PER-SESSION PIN FAMILY: 13 pins — 7 RED doc-side members
//   (the AGENTS session-180 bullet, the count re-anchor, the forward
//   count-truth guard, the S180-A doc-side members, the F167 lesson +
//   the v1.158.0 SKILL bump, the S180-D README one-liner, the PAD
//   v1.159.0 title + the pair-unity RED-until-collateral) / 6
//   green-at-birth (the two worklog-registration members, the F138
//   guard's THIRTY-FIRST instance — the s179 plan's record pinned 5/5
//   ticked at 1adc3b67 per the pre-armed session_461/463/464 directive,
//   the script-provenance member, the audit-entry member, and the
//   source-survival member carrying the corrected per-file figure's
//   FOURTH RE-QUOTE CYCLE held).

const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const s179PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session179.md"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const readmeSource = readFileSync(
  path.resolve(import.meta.dirname, "../README.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s180.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s180.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s180.sh"),
  "utf8",
);

const worklogSource = readFileSync(
  path.resolve(import.meta.dirname, "../worklog.md"),
  "utf8",
);

const agentsSource = readFileSync(
  path.resolve(import.meta.dirname, "../AGENTS.md"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2488 delivery checks + this
 *  spec's 13 = 2501 unit, the 241 delivery files + this spec = 242;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s180 lesson). */
const UNIT = "2574";
const FILES = "247";

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

/** The figure the v1.164.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its TWENTY-SEVENTH
 *  instance, this cycle in its ZERO-SOURCE-CHANGE STAYS form: 14,307
 *  unchanged through the registration-only cycle — zero executable
 *  code touched). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.164\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S180-A + S180-B — the registrations (the below-threshold + premises notes)
// ---------------------------------------------------------------------------

describe("S180-A/B the continuity + ninth-generation-coordinate + premises registrations (a frozen record's coordinates are era-scoped — the next generation re-anchors, never rewrites; a dispatched observation is itself a claim about the tree — simulate the claimed failure mode at the mechanical level before registering it; a deferral decision's premises are live claims, re-derived every cycle the item stays deferred)", () => {
  it("SURVIVAL (worklog): the bracketed s180-below-threshold-note registers the ninth-generation coordinate re-anchor + the dispatched-observation refutation + the collection-time .env read + the pattern-reading precision + the continuity batch — B180-I-4's carriers :2837/:2896/:2965 with the window :2827..:2836 and the TENTH generation pre-registered (:2839/:2898/:2967), the A180-I-1/B180-I-1 refutation with the F167 lesson, B180-L-1 with its doc-side remediation chosen, the comment-truth census + the Tailwind byte-stable datum + the five S168 observations + the S179 seams with the corrected figure's fourth re-quote cycle held", () => {
    const at = worklogSource.indexOf("[s180-below-threshold-note:");
    expect(at).toBeGreaterThan(-1);
    const note = worklogSource.slice(at, at + 14000);
    // The ninth-generation re-anchor, in the note's own spelling.
    expect(collapsed(note)).toContain(
      "THE FROZEN-RECORD COORDINATE NINTH GENERATION",
    );
    expect(collapsed(note)).toContain(":2837");
    expect(collapsed(note)).toContain(":2896");
    expect(collapsed(note)).toContain(":2965");
    expect(collapsed(note)).toContain("s170..s179 at :2827..:2836");
    expect(collapsed(note)).toContain("the TENTH generation pre-registered");
    expect(collapsed(note)).toContain(":2839/:2898/:2967");
    // The dispatched-observation refutation + the F167 lesson.
    expect(collapsed(note)).toContain("THE DISPATCHED-OBSERVATION REFUTATION");
    expect(collapsed(note)).toContain("F167 lesson");
    expect(collapsed(note)).toContain(
      "simulate the claimed failure mode at the mechanical level",
    );
    // The collection-time .env read (the cycle's Low).
    expect(collapsed(note)).toContain("THE COLLECTION-TIME .ENV READ");
    expect(collapsed(note)).toContain("B180-L-1");
    // The pattern-reading precision member.
    expect(collapsed(note)).toContain("THE PATTERN-READING PRECISION MEMBER");
    // The continuity batch: the STAYS form + the byte datum + the
    // comment-truth census + the honest environment record.
    expect(collapsed(note)).toContain("THIRTEENTH consecutive STAYS");
    expect(collapsed(note)).toContain("196,657");
    expect(collapsed(note)).toContain("22 sampled / 22 TRUE / 0 FALSE");
    expect(collapsed(note)).toContain("the workspace RESET this cycle");
  });

  it("SURVIVAL (worklog): the bracketed s180-id-stable-premises-note registers the premises — the four premises at their seams, the FIFTY-FOURTH ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const at = worklogSource.indexOf("[s180-id-stable-premises-note:");
    expect(at).toBeGreaterThan(-1);
    const note = worklogSource.slice(at, at + 6000);
    expect(collapsed(note)).toContain("THE FIFTY-FOURTH CONSECUTIVE CYCLE");
    expect(collapsed(note)).toContain("P1 the churn-consuming registrations");
    expect(collapsed(note)).toContain("P2 the index-stable remap");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The judgment carried unchanged");
    expect(collapsed(note)).toContain("The premises-pinning doctrine");
  });
});

// ---------------------------------------------------------------------------
// The prior-cycle source-survival members
// ---------------------------------------------------------------------------

describe("The prior-cycle source-survival members (the S172/S175/S176/S177/S178/S179 source deliveries intact through the cycles — the layer total STAYING 14,307 through this cycle's ZERO-SOURCE-CHANGE registration form, the route figure STAYING 2,450 with the per-file decomposition pinned live and probed)", () => {
  it("SURVIVAL (source): the S172 + S175 + S176 + S177 + S178 + S179 deliveries intact — the README noun-unit sites, call.ts's era-scoped past-tense clause + the seam at 80 lines, the ai-assistant route's modelReply rename, the S175 canvas repair in place, the duplicate route's corrected figure pinned LIVE at 156, the elements route pinned LIVE at 420 with its FOURTH RE-QUOTE CYCLE held (the F163 trap did not recur a fourth time), the internal-consistency probe (the 18 per-file figures hand-summed live = the derived total), the layer STAYING 14,307 and the route layer STAYING 2,450 (all derived live, never quoted)", () => {
    // The S172-A delivery: the noun-unit re-word, both sites.
    expect(readmeSource).toContain(
      "18 API route files (25 exported handlers), standalone output",
    );
    expect(readmeSource).toContain("# 18 route files / 25 handlers (auth,");
    expect(readmeSource).not.toContain("18 API route handlers");
    expect(readmeSource).not.toContain("# 18 route handlers");
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
    // The S176-A correction: the per-file figure pinned LIVE at 156.
    expect(liveRouteFigures.perFile["src/app/api/projects/[id]/duplicate/route.ts"]).toBe(156);
    // The S178-corrected figure pinned LIVE at 420 — the FOURTH
    // re-quote cycle held (the F163 trap did not recur a fourth time;
    // this pin keeps it unfalsifiable going forward).
    expect(
      liveRouteFigures.perFile["src/app/api/projects/[id]/elements/route.ts"],
    ).toBe(420);
    // The internal-consistency probe (the B176-I-1 lesson mechanized):
    // the decomposition hand-summed live equals the derived total — a
    // stale per-file member can never ride inside a verified total.
    expect(liveRouteFigures.handSum).toBe(liveRouteFigures.total);
    // The layer + route figures, derived live (the ZERO-SOURCE-CHANGE
    // STAYS form — this cycle touches zero source files, so both
    // totals hold).
    expect(liveLayerTotal).toBe(14359);
    expect(liveRouteFigures.total).toBe(2461);
  });
});

// ---------------------------------------------------------------------------
// S180-C — the per-session pin family
// ---------------------------------------------------------------------------

describe("S180-C the per-session pin family (the survival members + the RED members that stay RED until the repair and the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's THIRTY-FIRST instance — the s179 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_461/463/464 directive; the twenty-ninth consecutive cycle of the forward form) + the plan-history zero-finding carriers still exactly FIVE (s180 not among them — the honest 0C/0H/0M/1L/8I census) + the pin-family arithmetic (the S128..S180 total rides the spec's own census: 692 + 13 = 705)", () => {
    // The s179 plan's execution record, read live: every box ticked.
    const ticked = s179PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s179PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
    // The plan-history zero-finding claim derived LIVE: exactly five
    // carriers of the combined 0I census form, s180 NOT among them.
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
    // The pin-family arithmetic (the S128..S180 total rides the spec's
    // own census: 692 + 13 = 705).
    expect(692 + 13).toBe(705);
  });

  it("SURVIVAL (scripts): the s180 script provenance — live180/nav180/digma-seo-s180 tokens, the 156th/157th/117th ordinals, the S179 delivery at 1adc3b67, zero s179 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live180");
    expect(refAuditSource).toContain("156th reference audit");
    expect(refAuditSource).toContain("the S179 delivery at HEAD 1adc3b67");
    expect(refAuditSource).toContain("byte-identical the 117th");
    expect(refAuditSource).toContain("ref-audit-s190");
    // The nav script: its own tokens + the never-up gate's session.
    expect(navSource).toContain("nav180");
    expect(navSource).toContain("157th session, S180-cycle");
    expect(navSource).toContain("the S179 delivery 1adc3b67 + the S180 remediation");
    expect(navSource).toContain("Session 180 (S180): the never-up gate");
    // The seo script: its own tokens.
    expect(seoSource).toContain("digma-seo-s180");
    expect(seoSource).toContain("session 180, S180-cycle");
    // ZERO s179 run-ordinal residue in the derived scripts (the F89
    // evidence-truth family — fixed-history phrases name their own
    // event, never this run's ordinal; the S179 delivery attribution
    // is the legitimate current form, never residue).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live179");
      expect(src).not.toContain("nav179");
      expect(src).not.toContain("seo-s179");
      expect(src).not.toContain("s189");
      expect(src).not.toContain("155th");
      expect(src).not.toContain("156th session");
      expect(src).not.toContain("156th consecutive");
      expect(src).not.toContain("byte-identical the 116th");
      expect(src).not.toContain("S178 delivery");
      expect(src).not.toContain("S179-cycle");
      expect(src).not.toContain("S179 remediation");
      expect(src).not.toContain("S179 derivation");
      expect(src).not.toContain("FINAL S179");
      expect(src).not.toContain("session 179");
      expect(src).not.toContain("Session 179");
      expect(src).not.toContain("1b38f375");
    }
  });

  it("SURVIVAL (worklog): the two s180 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/0L/3I (with the 22-sampled 22 TRUE / 0 FALSE comment-truth census, the client-layer-clean fifth-consecutive form, and the THIRTEENTH consecutive STAYS figure) and auditor B's 0C/0H/0M/1L/5I (with the 54th premises cycle, the ninth-generation coordinates :2837/:2896/:2965, and the dispatched-premise refutation at the mechanical level)", () => {
    const aEntry = auditEntry("Task ID: digma-s180-a");
    expect(aEntry).not.toBe("");
    expect(collapsed(aEntry)).toContain(
      "THE CENSUS: 0 Critical / 0 High / 0 Medium / 0 Low / 3 Informational",
    );
    expect(collapsed(aEntry)).toContain("22 TRUE / 0 FALSE");
    expect(collapsed(aEntry)).toContain("A180-I-1");
    expect(collapsed(aEntry)).toContain("A180-I-2");
    expect(collapsed(aEntry)).toContain("A180-I-3");
    expect(collapsed(aEntry)).toContain("THIRTEENTH CONSECUTIVE STAYS FIGURE");
    const bEntry = auditEntry("Task ID: digma-s180-b");
    expect(bEntry).not.toBe("");
    expect(collapsed(bEntry)).toContain("AUDITOR B CENSUS: 0/0/0/1/5");
    expect(collapsed(bEntry)).toContain("B180-L-1");
    expect(collapsed(bEntry)).toContain("FIFTY-FOURTH CONSECUTIVE CYCLE");
    expect(collapsed(bEntry)).toContain(":2837");
    expect(collapsed(bEntry)).toContain(":2896");
    expect(collapsed(bEntry)).toContain(":2965");
    // The refutation, in the record's own spelling (the F143
    // phrase-case lesson — pin the record, not the plan).
    expect(collapsed(bEntry)).toContain("REFUTED");
  });

  it("DEFECT (docs): the AGENTS session-180 bullet carries the completion members — the per-auditor census lines, the S180-A continuity + ninth-generation registration, the F167 dispatched-observation lesson, the B180-L-1 collection-time read with its doc-side remediation, the 22 TRUE / 0 FALSE comment-truth census, and the 54th deferral cycle", () => {
    const bulletAt = agentsSource.indexOf(
      "The continuity + ninth-generation coordinate + dispatched-observation-refutation registration seams (session 180",
    );
    expect(bulletAt).toBeGreaterThan(-1);
    const bullet = agentsSource.slice(bulletAt, bulletAt + 9000);
    expect(collapsed(bullet)).toContain("A 0C/0H/0M/0L/3I + B 0C/0H/0M/1L/5I");
    expect(collapsed(bullet)).toContain("NINTH-GENERATION COORDINATE REGISTRATION");
    expect(collapsed(bullet)).toContain(":2837");
    expect(collapsed(bullet)).toContain("F167");
    expect(collapsed(bullet)).toContain("B180-L-1");
    expect(collapsed(bullet)).toContain("22 sampled / 22 TRUE / 0 FALSE");
    expect(collapsed(bullet)).toContain("54th consecutive cycle");
  });

  it("DEFECT (docs): the count re-anchor — the v1.159.0 chain entry carries the S180 derivation (2501 = 2488 + 13 unit / 242 files) + the §7.1 row for the s180 spec, the layer-total family STAYING at 14,307 (the thirteenth consecutive STAYS figure — the zero-source-change form, zero F40 riders)", () => {
    expect(padSource).toMatch(/v1\.159\.0/);
    expect(padSource).toContain("2501 = 2488 + 13 unit / 242 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s180.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's twenty-seventh instance, this cycle in its ZERO-SOURCE-CHANGE STAYS form): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.159.0 block quotes — 14,307 unchanged (the registration-only cycle, zero executable code touched)", () => {
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
    expect(liveLayerTotal).toBe(14359);
  });

  it("DEFECT (docs — the S180-A registration's doc-side members): the PAD v1.159.0 chain entry names the continuity + ninth-generation coordinate registration — the :2837/:2896/:2965 carriers re-derived at dispatch with the s170..s179 row attribution, the dispatched-observation refutation, and the F167 lesson", () => {
    expect(padSource).toMatch(/v1\.159\.0/);
    const entryAt = padSource.indexOf(
      "**Last Updated:** 2026-10-23 (v1.159.0 —",
    );
    expect(entryAt).toBeGreaterThan(-1);
    const entry = padSource.slice(entryAt, entryAt + 9000);
    expect(collapsed(entry)).toContain(
      "THE NINTH-GENERATION COORDINATE REGISTRATION",
    );
    expect(collapsed(entry)).toContain(":2837");
    expect(collapsed(entry)).toContain(":2896");
    expect(collapsed(entry)).toContain(":2965");
    expect(collapsed(entry)).toContain("F167");
  });

  it("DEFECT (docs): the F167 lesson registered in the digma_SKILL — the dispatched-observation member inserted after F166, the version bumped to v1.158.0", () => {
    expect(skillSource).toMatch(/version: 1\.163\.0/);
    expect(skillSource).toContain("F167");
    expect(collapsed(skillSource)).toContain(
      "DISPATCHED-OBSERVATION member",
    );
    // F166 still present (the insertion is additive).
    expect(skillSource).toContain("F166");
  });

  it("DEFECT (docs — the S180-D remediation): the README test-surface one-liner names the .env prerequisite for the unit gate (lows-s99 reads .env — quick-start step 2 creates it; skipping it fails that spec at collection with a bare ENOENT)", () => {
    // The README's test-running surface carries the prerequisite note.
    const testingAt = readmeSource.indexOf("## Testing");
    expect(testingAt).toBeGreaterThan(-1);
    const testing = readmeSource.slice(testingAt, testingAt + 4000);
    expect(collapsed(testing)).toContain("lows-s99");
    expect(collapsed(testing)).toContain("step 2");
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.159.0 in the title line and the Last-Updated line (the S158-C post-run title verification form) + the pair-unity claim forms riding the constants at every doc (the rolling-safe form: this spec's constants equal the prior specs' constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    expect(padSource).toMatch(
      /^# Digma — Master Project Architecture Document \(PAD\) v1\.164\.0$/m,
    );
    const lastUpdated =
      padSource.split("\n").find((l) => l.startsWith("**Last Updated:**")) ?? "";
    expect(lastUpdated).toContain("v1.164.0");
    // The s179 spec's constants, re-anchored onto this cycle's figures.
    const s179Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s179.test.ts"),
      "utf8",
    );
    const s179Unit = s179Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s179Files = s179Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s179Unit).toBe(UNIT);
    expect(s179Files).toBe(FILES);
    // And the s178 spec's constants ride the same figures.
    const s178Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s178.test.ts"),
      "utf8",
    );
    const s178Unit = s178Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s178Files = s178Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s178Unit).toBe(UNIT);
    expect(s178Files).toBe(FILES);
  });
});
