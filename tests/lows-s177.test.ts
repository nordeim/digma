import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-177 spec (the one-hundred-and-twenty-fifth audit's chosen
// work — a ZERO-SOURCE-FINDING all-Informational cycle, the SECOND
// CONSECUTIVE: the auditors' census A 0C/0H/0M/0L/5I + B 0C/0H/0M/0L/5I,
// every member living on the DOC/DIRECTIVE/REGISTRATION/ENVIRONMENT
// surface — the layer total STAYING 14,307 via the ZERO-SOURCE-CHANGE
// form, the route figure STAYING 2,450):
//
// S177-A — THE CONTINUITY + SIXTH-GENERATION COORDINATE REGISTRATION
//   (B177-I-2 + B177-I-3 + B177-I-4 — the cycle's new members): the
//   frozen-record coordinate family's SIXTH generation live-derived at
//   dispatch (the S176 delivery's own two PAD insertions shifting the
//   fifth-generation carriers +2 to :2831/:2890/:2959, the §7.1 rows
//   owning s171..s176 at :2825..:2830 — exactly as the s176 note
//   pre-registered); the config-forward-compat lever (Vite's
//   configLoader:'native' deprecation on vitest.config.ts:1 — the
//   named promotion lever registered, not promoted); the commit-message
//   event-naming member (the 4dbd2423 "update skills" commit naming an
//   event its own diff does not contain — git history append-only, the
//   misnomer frozen; the F164 lesson lands in the digma_SKILL).
//
// S177-B — THE PREMISES REGISTRATION: the bracketed
//   s177-id-stable-premises-note — the 51st consecutive cycle, the four
//   premises at their seams, the judgment carried unchanged.
//
// S177-C — THE PER-SESSION PIN FAMILY: 12 pins — 6 RED doc-side members
//   (the AGENTS session-177 bullet, the count re-anchor, the forward
//   count-truth guard, the S177-A doc-side members, the F164 lesson +
//   the v1.155.0 SKILL bump, the PAD v1.156.0 title + the pair-unity
//   RED-until-collateral) / 6 green-at-birth (the two
//   worklog-registration members, the F138 guard's TWENTY-EIGHTH
//   instance — the s176 plan's record pinned 5/5 ticked at 563b1ea9
//   per the pre-armed session_443/445/446 directive, the script
//   provenance, the audit entries, the source-survival member with the
//   corrected per-file figure's FIRST RE-QUOTE CYCLE held — the F163
//   trap did not recur).
//
// The collateral family: the count re-anchor 2464 = 2452 + 12 / 239 files;
// the layer-total family STAYING at 14,307 (the tenth consecutive STAYS
// figure, the zero-source-change form); the route figure STAYING at
// 2,450; PAD v1.156.0; digma_SKILL v1.155.0 + F164 (the commit-message
// event-naming member).

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
const s176PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session176.md"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s177.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s177.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s177.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2452 delivery checks + this
 *  spec's 12 = 2464 unit, the 238 delivery files + this spec = 239;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s177 lesson). */
const UNIT = "2613";
const FILES = "250";

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

/** The figure the v1.167.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its TWENTY-FOURTH
 *  instance, this cycle in its ZERO-SOURCE-CHANGE STAYS form: 14,307
 *  unchanged through the registration-only cycle — zero executable
 *  code touched). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.167\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S177-A + S177-B — the registrations (the below-threshold + premises notes)
// ---------------------------------------------------------------------------

describe("S177-A/B the continuity + sixth-generation-coordinate + premises registrations (a frozen record's coordinates are era-scoped — the next generation re-anchors, never rewrites; an infrastructure deprecation is registered debt with a named promotion lever, never silently promoted; a record names its own event — a commit message describing an action its own diff does not contain misdirects future archaeology; a deferral decision's premises are live claims, re-derived every cycle the item stays deferred)", () => {
  it("SURVIVAL (worklog): the bracketed s177-below-threshold-note registers the sixth-generation coordinate re-anchor + the config-forward-compat lever + the commit-message event-naming member + the continuity batch — B177-I-2's carriers :2831/:2890/:2959 with the seventh generation pre-registered, B177-I-3's configLoader lever registered not promoted, B177-I-4's F164 lesson landing in the digma_SKILL, the comment-truth census + the Tailwind byte-stable datum + the five S168 observations + the S176 seams with the corrected figure's first re-quote cycle held", () => {
    const noteAt = worklogSource.indexOf("[s177-below-threshold-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 16000);
    // The sixth-generation coordinate re-anchor (B177-I-2 — the note's
    // own spelling, the F143 phrase-case lesson).
    expect(collapsed(note)).toContain("B177-I-2");
    expect(collapsed(note)).toContain("SIXTH GENERATION");
    expect(collapsed(note)).toContain(":2831 (the Unit total)");
    expect(collapsed(note)).toContain(":2890 (the checklist)");
    expect(collapsed(note)).toContain(":2959 (the command row)");
    expect(collapsed(note)).toContain(
      "the seventh generation pre-registered here",
    );
    // The config-forward-compat lever (B177-I-3).
    expect(collapsed(note)).toContain("B177-I-3");
    expect(collapsed(note)).toContain("configLoader");
    expect(collapsed(note)).toContain("REGISTERED, not promoted");
    // The commit-message event-naming member (B177-I-4 — the F164
    // lesson).
    expect(collapsed(note)).toContain("B177-I-4");
    expect(collapsed(note)).toContain("COMMIT-MESSAGE");
    expect(collapsed(note)).toContain(
      "F164 lesson landing in the digma_SKILL",
    );
    // The continuity batch (the comment-truth census, the Tailwind
    // byte-stable datum, the five S168 observations, the S176 seams
    // with the corrected figure's first re-quote cycle held).
    expect(collapsed(note)).toContain("141 TRUE / 0 FALSE");
    expect(collapsed(note)).toContain("196,657");
    expect(collapsed(note)).toContain("A177-I3");
    expect(collapsed(note)).toContain("FIRST RE-QUOTE CYCLE held");
  });

  it("SURVIVAL (worklog): the bracketed s177-id-stable-premises-note registers the premises — the four premises at their seams, the FIFTY-FIRST ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const noteAt = worklogSource.indexOf("[s177-id-stable-premises-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 6000);
    expect(collapsed(note)).toContain("FIFTY-FIRST CONSECUTIVE CYCLE");
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
// with the corrected per-file figure's first re-quote cycle held)
// ---------------------------------------------------------------------------

describe("The prior-cycle source-survival members (the S172/S175/S176 source deliveries intact through the cycles — the layer total STAYING 14,307 through this cycle's ZERO-SOURCE-CHANGE registration form, the route figure STAYING 2,450 with the per-file decomposition pinned live and probed)", () => {
  it("SURVIVAL (source): the S172 + S175 + S176 deliveries intact — the README noun-unit sites, call.ts's era-scoped past-tense clause + the seam at 80 lines, the ai-assistant route's modelReply rename, the S175 canvas repair in place, the duplicate route's corrected figure pinned LIVE at 156 with its FIRST RE-QUOTE CYCLE held (the F163 trap did not recur), the internal-consistency probe (the 18 per-file figures hand-summed live = the derived total), the layer STAYING 14,307 and the route layer STAYING 2,450 (all derived live, never quoted)", () => {
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
    // The S176-A correction: the per-file figure pinned LIVE at 156 —
    // the corrected figure's FIRST RE-QUOTE CYCLE held (the F163 trap
    // did not recur; this pin keeps it unfalsifiable going forward).
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
// S177-C — the per-session pin family
// ---------------------------------------------------------------------------

describe("S177-C the per-session pin family (the survival members + the RED members that stay RED until the repair and the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's TWENTY-EIGHTH instance — the s176 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_443/445/446 directive; the twenty-sixth consecutive cycle of the forward form) + the plan-history zero-finding carriers still exactly FIVE (s177 not among them — the honest 0C/0H/0M/0L/10I census) + the pin-family arithmetic (the S128..S177 total rides the spec's own census: 656 + 12 = 668)", () => {
    // The s176 plan's execution record, read live: every box ticked.
    const ticked = s176PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s176PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
    // The plan-history zero-finding claim derived LIVE: exactly five
    // carriers of the combined 0I census form, s177 NOT among them.
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
    // The pin-family arithmetic (the S128..S177 total rides the spec's
    // own census: 656 + 12 = 668).
    expect(656 + 12).toBe(668);
  });

  it("SURVIVAL (scripts): the s177 script provenance — live177/nav177/digma-seo-s177 tokens, the 153rd/154th/114th ordinals, the S176 delivery at 563b1ea9, zero s176 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live177");
    expect(refAuditSource).toContain("153rd reference audit");
    expect(refAuditSource).toContain("the S176 delivery at HEAD 563b1ea9");
    expect(refAuditSource).toContain("byte-identical the 114th");
    expect(refAuditSource).toContain("ref-audit-s187");
    // The nav script: its own tokens + the never-up gate's session.
    expect(navSource).toContain("nav177");
    expect(navSource).toContain("154th session, S177-cycle");
    expect(navSource).toContain("the S176 delivery 563b1ea9 + the S177 remediation");
    expect(navSource).toContain("Session 177 (S177): the never-up gate");
    // The seo script: its own tokens.
    expect(seoSource).toContain("digma-seo-s177");
    expect(seoSource).toContain("session 177, S177-cycle");
    // ZERO s176 run-ordinal residue in the derived scripts (the F89
    // evidence-truth family — fixed-history phrases name their own
    // event, never this run's ordinal; the S176 delivery attribution
    // is the legitimate current form, never residue).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live176");
      expect(src).not.toContain("nav176");
      expect(src).not.toContain("seo-s176");
      expect(src).not.toContain("s186");
      expect(src).not.toContain("152nd");
      expect(src).not.toContain("153rd session");
      expect(src).not.toContain("153rd consecutive");
      expect(src).not.toContain("byte-identical the 113th");
      expect(src).not.toContain("S175 delivery");
      expect(src).not.toContain("S176-cycle");
      expect(src).not.toContain("S176 remediation");
      expect(src).not.toContain("S176 derivation");
      expect(src).not.toContain("FINAL S176");
      expect(src).not.toContain("session 176");
      expect(src).not.toContain("Session 176");
      expect(src).not.toContain("76c27cf2");
    }
  });

  it("SURVIVAL (worklog): the two s177 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/0L/5I (with the 141-sampled 141 TRUE / 0 FALSE comment-truth census, the second consecutive zero-false cycle) and auditor B's 0C/0H/0M/0L/5I (with the 51st premises cycle, the sixth-generation coordinates :2831/:2890/:2959, and the corrected figure's first re-quote cycle held)", () => {
    const aEntry = auditEntry("Task ID: audit-A-s177");
    expect(aEntry).not.toBe("");
    expect(collapsed(aEntry)).toContain(
      "THE CENSUS: 0 Critical / 0 High / 0 Medium / 0 Low / 5 Informational",
    );
    expect(collapsed(aEntry)).toContain("141 TRUE / 0 FALSE");
    expect(collapsed(aEntry)).toContain("A177-I1");
    expect(collapsed(aEntry)).toContain("A177-I2");
    expect(collapsed(aEntry)).toContain("A177-I4");
    const bEntry = auditEntry("Task ID: audit-B-s177");
    expect(bEntry).not.toBe("");
    expect(collapsed(bEntry)).toContain("FINDING B177-I-1");
    expect(collapsed(bEntry)).toContain("FINDING B177-I-2");
    expect(collapsed(bEntry)).toContain("FINDING B177-I-3");
    expect(collapsed(bEntry)).toContain("FINDING B177-I-4");
    expect(collapsed(bEntry)).toContain("51st consecutive cycle");
    expect(collapsed(bEntry)).toContain("SIXTH generation");
    // The registration-seam focus, in the record's own spelling (the
    // PASS 3 header form — the F143 phrase-case lesson).
    expect(collapsed(bEntry)).toContain("THE S176 REGISTRATION-SEAM VERIFICATION");
  });

  it("DEFECT (docs): the AGENTS session-177 bullet carries the completion members — the per-auditor census lines, the S177-A continuity + sixth-generation registration, the F164 commit-message event-naming lesson, the 141 TRUE / 0 FALSE comment-truth census, and the 51st deferral cycle", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 177, S177-A..S177-C");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 12000);
    // The completion members' key phrases (the bullet's own spelling —
    // the s156 F143 phrase-case lesson).
    expect(collapsed(bullet)).toContain("A 0C/0H/0M/0L/5I + B 0C/0H/0M/0L/5I");
    expect(collapsed(bullet)).toContain("S177-A");
    expect(collapsed(bullet)).toContain("SIXTH-GENERATION");
    expect(collapsed(bullet)).toContain("F164");
    expect(collapsed(bullet)).toContain("141 TRUE / 0 FALSE");
    expect(collapsed(bullet)).toContain("51st consecutive cycle");
    expect(collapsed(bullet)).toContain("14,307");
  });

  it("DEFECT (docs): the count re-anchor — the v1.156.0 chain entry carries the S177 derivation (2464 = 2452 + 12 unit / 239 files) + the §7.1 row for the s177 spec, the layer-total family STAYING at 14,307 (the tenth consecutive STAYS figure — the zero-source-change form, zero F40 riders)", () => {
    expect(padSource).toMatch(/v1\.156\.0/);
    expect(padSource).toContain("2464 = 2452 + 12 unit / 239 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s177.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's twenty-fourth instance, this cycle in its ZERO-SOURCE-CHANGE STAYS form): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.156.0 block quotes — 14,307 unchanged (the registration-only cycle, zero executable code touched)", () => {
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
    expect(liveLayerTotal).toBe(14373);
  });

  it("DEFECT (docs — the S177-A registration's doc-side members): the PAD v1.156.0 chain entry names the continuity + sixth-generation coordinate registration — the :2831/:2890/:2959 carriers re-derived at dispatch, the config-forward-compat lever, and the F164 commit-message event-naming lesson", () => {
    expect(padSource).toMatch(/v1\.156\.0/);
    const entryAt = padSource.indexOf(
      "**Last Updated:** 2026-10-23 (v1.156.0 —",
    );
    expect(entryAt).toBeGreaterThan(-1);
    const entry = padSource.slice(entryAt, entryAt + 9000);
    expect(collapsed(entry)).toContain(
      "THE SIXTH-GENERATION COORDINATE REGISTRATION",
    );
    expect(collapsed(entry)).toContain(":2831");
    expect(collapsed(entry)).toContain(":2890");
    expect(collapsed(entry)).toContain(":2959");
    expect(collapsed(entry)).toContain("F164");
  });

  it("DEFECT (docs): the F164 lesson registered in the digma_SKILL — the commit-message event-naming member inserted after F163, the version bumped to v1.155.0", () => {
    expect(skillSource).toMatch(/version: 1\.166\.0/);
    expect(skillSource).toContain("F164");
    expect(collapsed(skillSource)).toContain(
      "COMMIT-MESSAGE EVENT-NAMING member",
    );
    // F163 still present (the insertion is additive).
    expect(skillSource).toContain("F163");
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.156.0 in the title line and the Last-Updated line (the S158-C post-run title verification form) + the pair-unity claim forms riding the constants at every doc (the rolling-safe form: this spec's constants equal the prior specs' constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    expect(padSource).toMatch(
      /^# Digma — Master Project Architecture Document \(PAD\) v1\.167\.0$/m,
    );
    const lastUpdated =
      padSource.split("\n").find((l) => l.startsWith("**Last Updated:**")) ?? "";
    expect(lastUpdated).toContain("v1.167.0");
    // The s176 spec's constants, re-anchored onto this cycle's figures.
    const s176Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s176.test.ts"),
      "utf8",
    );
    const s176Unit = s176Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s176Files = s176Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s176Unit).toBe(UNIT);
    expect(s176Files).toBe(FILES);
    // And the s175 spec's constants ride the same figures.
    const s175Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s175.test.ts"),
      "utf8",
    );
    const s175Unit = s175Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s175Files = s175Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s175Unit).toBe(UNIT);
    expect(s175Files).toBe(FILES);
  });
});
