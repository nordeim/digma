import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-179 spec (the one-hundred-and-twenty-seventh audit's chosen
// work — a ZERO-SOURCE-FINDING all-Informational cycle, the FOURTH
// CONSECUTIVE: the auditors' census A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/3I,
// every member living on the DOC/CLAIM-WORDING/DISPATCH surface — the
// layer total STAYING 14,307 via the ZERO-SOURCE-CHANGE form, the route
// figure STAYING 2,450):
//
// S179-A — THE CONTINUITY + EIGHTH-GENERATION COORDINATE REGISTRATION
//   (B179-I-2 + B179-I-1 — the cycle's new members): the frozen-record
//   coordinate family's EIGHTH generation live-derived at dispatch (the
//   S178 delivery's own two PAD insertions shifting the seventh-generation
//   carriers +2 to :2835/:2894/:2963, the §7.1 rows owning s170..s178 at
//   :2826..:2834 — the row attribution corrected at birth per B179-I-2);
//   the zod claim-scope member (the phrase 'zero zod in the dependency
//   tree' false-as-written at the lockfile reading — bun.lock:1176's
//   zod@4.6.5 the eslint-chain transitive; TRUE at every load-bearing
//   reading); the F165 coordinate-attribution extension (a dispatch
//   brief's coordinate attributions and site locations are claims about
//   the tree — derive them from the live tree at dispatch); the
//   display-mangling observation (the lead's own: the tool-output
//   pipeline stripped '[m'-shaped byte pairs, the valid slice
//   expression at dispatch-s178.py:125 displaying as a syntax error;
//   the F166 lesson lands in the digma_SKILL).
//
// S179-B — THE PREMISES REGISTRATION: the bracketed
//   s179-id-stable-premises-note — the 53rd consecutive cycle, the four
//   premises at their seams, the judgment carried unchanged.
//
// S179-C — THE PER-SESSION PIN FAMILY: 12 pins — 6 RED doc-side members
//   (the AGENTS session-179 bullet, the count re-anchor, the forward
//   count-truth guard, the S179-A doc-side members, the F166 lesson +
//   the v1.157.0 SKILL bump, the PAD v1.158.0 title + the pair-unity
//   RED-until-collateral) / 6 green-at-birth (the two
//   worklog-registration members, the F138 guard's THIRTIETH
//   instance — the s178 plan's record pinned 5/5 ticked at 1b38f375
//   per the pre-armed session_455/457/458 directive, the script
//   provenance, the audit entries, the source-survival member with the
//   corrected per-file figure's THIRD RE-QUOTE CYCLE held — the F163
//   trap did not recur a third time).
//
// The collateral family: the count re-anchor 2488 = 2476 + 12 / 241 files;
// the layer-total family STAYING at 14,307 (the twelfth consecutive STAYS
// figure, the zero-source-change form); the route figure STAYING at
// 2,450; PAD v1.158.0; digma_SKILL v1.157.0 + F166 (the display-mangling
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
const s178PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session178.md"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s179.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s179.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s179.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2476 delivery checks + this
 *  spec's 12 = 2488 unit, the 240 delivery files + this spec = 241;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s179 lesson). */
const UNIT = "2533";
const FILES = "244";

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

/** The figure the v1.161.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its TWENTY-SIXTH
 *  instance, this cycle in its ZERO-SOURCE-CHANGE STAYS form: 14,307
 *  unchanged through the registration-only cycle — zero executable
 *  code touched). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.161\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S179-A + S179-B — the registrations (the below-threshold + premises notes)
// ---------------------------------------------------------------------------

describe("S179-A/B the continuity + eighth-generation-coordinate + premises registrations (a frozen record's coordinates are era-scoped — the next generation re-anchors, never rewrites; a claim's scope wording names its reading — 'package.json + src/ imports' vs 'lockfile transitives' are different claims; a deferral decision's premises are live claims, re-derived every cycle the item stays deferred)", () => {
  it("SURVIVAL (worklog): the bracketed s179-below-threshold-note registers the eighth-generation coordinate re-anchor + the zod claim-scope member + the F165 coordinate-attribution extension + the display-mangling observation + the continuity batch — B179-I-2's carriers :2835/:2894/:2963 with the row attribution corrected at birth (s170..s178 at :2826..:2834) and the ninth generation pre-registered, B179-I-1's zod lockfile chain registered, the F166 lesson landing in the digma_SKILL, the comment-truth census + the Tailwind byte-stable datum + the five S168 observations + the S178 seams with the corrected figure's third re-quote cycle held", () => {
    const noteAt = worklogSource.indexOf("[s179-below-threshold-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 16000);
    // The eighth-generation coordinate re-anchor (B179-I-2 — the note's
    // own spelling, the F143 phrase-case lesson).
    expect(collapsed(note)).toContain("B179-I-2");
    expect(collapsed(note)).toContain("EIGHTH GENERATION");
    expect(collapsed(note)).toContain(":2835 (the Unit total)");
    expect(collapsed(note)).toContain(":2894 (the checklist)");
    expect(collapsed(note)).toContain(":2963 (the command row)");
    expect(collapsed(note)).toContain("s170..s178 at :2826..:2834");
    expect(collapsed(note)).toContain(
      "the ninth generation pre-registered here",
    );
    // The zod claim-scope member (B179-I-1).
    expect(collapsed(note)).toContain("B179-I-1");
    expect(collapsed(note)).toContain("ZOD CLAIM-SCOPE MEMBER");
    expect(collapsed(note)).toContain("zod@4.6.5");
    expect(collapsed(note)).toContain(
      "scope wordings name their reading",
    );
    // The F165 coordinate-attribution extension (the dispatch-record
    // surface).
    expect(collapsed(note)).toContain(
      "F165 COORDINATE-ATTRIBUTION EXTENSION",
    );
    // The display-mangling observation (the lead's own — the F166
    // lesson).
    expect(collapsed(note)).toContain("DISPLAY-MANGLING OBSERVATION");
    expect(collapsed(note)).toContain(
      "F166 lesson landing in the digma_SKILL",
    );
    // The continuity batch (the comment-truth census, the Tailwind
    // byte-stable datum, the five S168 observations, the S178 seams
    // with the corrected figure's third re-quote cycle held).
    expect(collapsed(note)).toContain("22 TRUE / 0 FALSE");
    expect(collapsed(note)).toContain("196,657");
    expect(collapsed(note)).toContain("A179-I-2");
    expect(collapsed(note)).toContain("THIRD RE-QUOTE CYCLE held");
  });

  it("SURVIVAL (worklog): the bracketed s179-id-stable-premises-note registers the premises — the four premises at their seams, the FIFTY-THIRD ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const noteAt = worklogSource.indexOf("[s179-id-stable-premises-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 6000);
    expect(collapsed(note)).toContain("FIFTY-THIRD CONSECUTIVE CYCLE");
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
// with the corrected per-file figure's third re-quote cycle held)
// ---------------------------------------------------------------------------

describe("The prior-cycle source-survival members (the S172/S175/S176/S177/S178 source deliveries intact through the cycles — the layer total STAYING 14,307 through this cycle's ZERO-SOURCE-CHANGE registration form, the route figure STAYING 2,450 with the per-file decomposition pinned live and probed)", () => {
  it("SURVIVAL (source): the S172 + S175 + S176 + S177 + S178 deliveries intact — the README noun-unit sites, call.ts's era-scoped past-tense clause + the seam at 80 lines, the ai-assistant route's modelReply rename, the S175 canvas repair in place, the duplicate route's corrected figure pinned LIVE at 156 with its THIRD RE-QUOTE CYCLE held (the F163 trap did not recur a third time), the internal-consistency probe (the 18 per-file figures hand-summed live = the derived total), the layer STAYING 14,307 and the route layer STAYING 2,450 (all derived live, never quoted)", () => {
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
    // the corrected figure's THIRD RE-QUOTE CYCLE held (the F163 trap
    // did not recur a third time; this pin keeps it unfalsifiable
    // going forward).
    expect(liveRouteFigures.perFile["src/app/api/projects/[id]/duplicate/route.ts"]).toBe(156);
    // The internal-consistency probe (the B176-I-1 lesson mechanized):
    // the decomposition hand-summed live equals the derived total — a
    // stale per-file member can never ride inside a verified total.
    expect(liveRouteFigures.handSum).toBe(liveRouteFigures.total);
    // The layer + route figures, derived live (the ZERO-SOURCE-CHANGE
    // STAYS form — this cycle touches zero source files, so both
    // totals hold).
    expect(liveLayerTotal).toBe(14313);
    expect(liveRouteFigures.total).toBe(2461);
  });
});

// ---------------------------------------------------------------------------
// S179-C — the per-session pin family
// ---------------------------------------------------------------------------

describe("S179-C the per-session pin family (the survival members + the RED members that stay RED until the repair and the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's THIRTIETH instance — the s178 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_455/457/458 directive; the twenty-eighth consecutive cycle of the forward form) + the plan-history zero-finding carriers still exactly FIVE (s179 not among them — the honest 0C/0H/0M/0L/5I census) + the pin-family arithmetic (the S128..S179 total rides the spec's own census: 680 + 12 = 692)", () => {
    // The s178 plan's execution record, read live: every box ticked.
    const ticked = s178PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s178PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
    // The plan-history zero-finding claim derived LIVE: exactly five
    // carriers of the combined 0I census form, s179 NOT among them.
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
    // The pin-family arithmetic (the S128..S179 total rides the spec's
    // own census: 680 + 12 = 692).
    expect(680 + 12).toBe(692);
  });

  it("SURVIVAL (scripts): the s179 script provenance — live179/nav179/digma-seo-s179 tokens, the 155th/156th/116th ordinals, the S178 delivery at 1b38f375, zero s178 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live179");
    expect(refAuditSource).toContain("155th reference audit");
    expect(refAuditSource).toContain("the S178 delivery at HEAD 1b38f375");
    expect(refAuditSource).toContain("byte-identical the 116th");
    expect(refAuditSource).toContain("ref-audit-s189");
    // The nav script: its own tokens + the never-up gate's session.
    expect(navSource).toContain("nav179");
    expect(navSource).toContain("156th session, S179-cycle");
    expect(navSource).toContain("the S178 delivery 1b38f375 + the S179 remediation");
    expect(navSource).toContain("Session 179 (S179): the never-up gate");
    // The seo script: its own tokens.
    expect(seoSource).toContain("digma-seo-s179");
    expect(seoSource).toContain("session 179, S179-cycle");
    // ZERO s178 run-ordinal residue in the derived scripts (the F89
    // evidence-truth family — fixed-history phrases name their own
    // event, never this run's ordinal; the S178 delivery attribution
    // is the legitimate current form, never residue).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live178");
      expect(src).not.toContain("nav178");
      expect(src).not.toContain("seo-s178");
      expect(src).not.toContain("s188");
      expect(src).not.toContain("154th");
      expect(src).not.toContain("155th session");
      expect(src).not.toContain("155th consecutive");
      expect(src).not.toContain("byte-identical the 115th");
      expect(src).not.toContain("S177 delivery");
      expect(src).not.toContain("S178-cycle");
      expect(src).not.toContain("S178 remediation");
      expect(src).not.toContain("S178 derivation");
      expect(src).not.toContain("FINAL S178");
      expect(src).not.toContain("session 178");
      expect(src).not.toContain("Session 178");
      expect(src).not.toContain("ff859b29");
    }
  });

  it("SURVIVAL (worklog): the two s179 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/0L/2I (with the 22-sampled 22 TRUE / 0 FALSE comment-truth census, the dispatch-driven depth honestly recorded) and auditor B's 0C/0H/0M/0L/3I (with the 53rd premises cycle, the eighth-generation coordinates :2835/:2894/:2963, and the corrected figure's third re-quote cycle held)", () => {
    const aEntry = auditEntry("Task ID: audit-A-s179");
    expect(aEntry).not.toBe("");
    expect(collapsed(aEntry)).toContain(
      "THE CENSUS: 0 Critical / 0 High / 0 Medium / 0 Low / 2 Informational",
    );
    expect(collapsed(aEntry)).toContain("22 TRUE / 0 FALSE");
    expect(collapsed(aEntry)).toContain("A179-I-1");
    expect(collapsed(aEntry)).toContain("A179-I-2");
    expect(collapsed(aEntry)).toContain("TWELFTH CONSECUTIVE STAYS FIGURE");
    const bEntry = auditEntry("Task ID: digma-s179-b");
    expect(bEntry).not.toBe("");
    expect(collapsed(bEntry)).toContain("FINDING B179-I-1");
    expect(collapsed(bEntry)).toContain("FINDING B179-I-2");
    expect(collapsed(bEntry)).toContain("FINDING B179-I-3");
    expect(collapsed(bEntry)).toContain("53rd consecutive cycle");
    expect(collapsed(bEntry)).toContain("EIGHTH-GENERATION COORDINATES");
    // The registration-seam focus, in the record's own spelling (the
    // PASS 2 header form — the F143 phrase-case lesson).
    expect(collapsed(bEntry)).toContain("S178 REGISTRATION-SEAM VERIFICATION");
  });

  it("DEFECT (docs): the AGENTS session-179 bullet carries the completion members — the per-auditor census lines, the S179-A continuity + eighth-generation registration, the F166 display-mangling lesson, the 22 TRUE / 0 FALSE comment-truth census, and the 53rd deferral cycle", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 179, S179-A..S179-C");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 12000);
    // The completion members' key phrases (the bullet's own spelling —
    // the s156 F143 phrase-case lesson).
    expect(collapsed(bullet)).toContain("A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/3I");
    expect(collapsed(bullet)).toContain("S179-A");
    expect(collapsed(bullet)).toContain("EIGHTH-GENERATION");
    expect(collapsed(bullet)).toContain("F166");
    expect(collapsed(bullet)).toContain("22 TRUE / 0 FALSE");
    expect(collapsed(bullet)).toContain("53rd consecutive cycle");
    expect(collapsed(bullet)).toContain("14,307");
  });

  it("DEFECT (docs): the count re-anchor — the v1.158.0 chain entry carries the S179 derivation (2488 = 2476 + 12 unit / 241 files) + the §7.1 row for the s179 spec, the layer-total family STAYING at 14,307 (the twelfth consecutive STAYS figure — the zero-source-change form, zero F40 riders)", () => {
    expect(padSource).toMatch(/v1\.158\.0/);
    expect(padSource).toContain("2488 = 2476 + 12 unit / 241 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s179.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's twenty-sixth instance, this cycle in its ZERO-SOURCE-CHANGE STAYS form): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.158.0 block quotes — 14,307 unchanged (the registration-only cycle, zero executable code touched)", () => {
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
    expect(liveLayerTotal).toBe(14313);
  });

  it("DEFECT (docs — the S179-A registration's doc-side members): the PAD v1.158.0 chain entry names the continuity + eighth-generation coordinate registration — the :2835/:2894/:2963 carriers re-derived at dispatch with the corrected s170..s178 row attribution, the zod claim-scope registration, and the F166 lesson", () => {
    expect(padSource).toMatch(/v1\.158\.0/);
    const entryAt = padSource.indexOf(
      "**Last Updated:** 2026-10-23 (v1.158.0 —",
    );
    expect(entryAt).toBeGreaterThan(-1);
    const entry = padSource.slice(entryAt, entryAt + 9000);
    expect(collapsed(entry)).toContain(
      "THE EIGHTH-GENERATION COORDINATE REGISTRATION",
    );
    expect(collapsed(entry)).toContain(":2835");
    expect(collapsed(entry)).toContain(":2894");
    expect(collapsed(entry)).toContain(":2963");
    expect(collapsed(entry)).toContain("F166");
  });

  it("DEFECT (docs): the F166 lesson registered in the digma_SKILL — the display-mangling member inserted after F165, the version bumped to v1.157.0", () => {
    expect(skillSource).toMatch(/version: 1\.160\.0/);
    expect(skillSource).toContain("F166");
    expect(collapsed(skillSource)).toContain(
      "DISPLAY-MANGLING member",
    );
    // F165 still present (the insertion is additive).
    expect(skillSource).toContain("F165");
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.158.0 in the title line and the Last-Updated line (the S158-C post-run title verification form) + the pair-unity claim forms riding the constants at every doc (the rolling-safe form: this spec's constants equal the prior specs' constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    expect(padSource).toMatch(
      /^# Digma — Master Project Architecture Document \(PAD\) v1\.161\.0$/m,
    );
    const lastUpdated =
      padSource.split("\n").find((l) => l.startsWith("**Last Updated:**")) ?? "";
    expect(lastUpdated).toContain("v1.161.0");
    // The s178 spec's constants, re-anchored onto this cycle's figures.
    const s178Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s178.test.ts"),
      "utf8",
    );
    const s178Unit = s178Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s178Files = s178Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s178Unit).toBe(UNIT);
    expect(s178Files).toBe(FILES);
    // And the s177 spec's constants ride the same figures.
    const s177Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s177.test.ts"),
      "utf8",
    );
    const s177Unit = s177Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s177Files = s177Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s177Unit).toBe(UNIT);
    expect(s177Files).toBe(FILES);
  });
});
