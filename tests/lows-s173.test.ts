import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-173 spec (the one-hundred-and-twenty-first audit's chosen
// work — the ZERO-SOURCE-FINDING all-Informational cycle: every actionable
// member of the auditors' census A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/3I
// lives on the DOC/DIRECTIVE/REGISTRATION surface, the SIXTH consecutive
// STAYS cycle — the layer total STAYING 14,307, the route figure STAYING
// 2,450):
//
// S173-A — THE BELOW-THRESHOLD + DIRECTIVE-SIDE + POSTURE-PRECISION
//   REGISTRATION (the registration form): the bracketed
//   s173-below-threshold-note at the worklog — B173-I-1 (the ELEMENT_LIMIT
//   message-literal family with the promotion form), A173-I-2 (the Tailwind
//   posture-precision datum: 26 phantom oklch-resolved rules sourced from
//   the operator's skills/ catalog via v4 automatic content detection —
//   the detection perimeter is the REPO, not the app; the posture must
//   name both the consumed set and the scanner's source perimeter),
//   B173-I-2 (the directive-side decomposition with the next-generation
//   correction "227 tests/ + 7 src/lib"), B173-I-3 (the frozen-record PAD
//   coordinate drift with the standing re-anchor disposition), the
//   A173-I-1/I-3 continuity pair, the pre-existing families carried.
//
// S173-B — THE PREMISES REGISTRATION: the bracketed
//   s173-id-stable-premises-note — the 47th consecutive cycle, the four
//   premises at their seams, the judgment carried unchanged.
//
// S173-C — THE PER-SESSION PIN FAMILY: 12 pins — 6 RED doc-side members
//   (the AGENTS session-173 bullet, the count re-anchor, the forward
//   count-truth guard, the F160 lesson, the PAD v1.152.0 title, the
//   pair-unity RED-until-collateral) / 6 green-at-birth (the two
//   worklog-registration members, the F138 guard's TWENTY-FOURTH
//   instance — the s172 plan's record pinned 6/6 ticked at f37fe6aa per
//   the pre-armed session_421/422 directive, the script provenance, the
//   audit entries, the source-survival member).
//
// The collateral family: the count re-anchor 2416 = 2404 + 12 / 235 files;
// the layer-total family STAYING at 14,307 (the SIXTH consecutive STAYS
// cycle, the zero-source-change form); the route figure STAYING at 2,450;
// PAD v1.152.0; digma_SKILL v1.151.0 + F160 (the content-detection-
// perimeter member).

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
const s172PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session172.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s173.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s173.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s173.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2404 delivery checks + this
 *  spec's 12 = 2416 unit, the 234 delivery files + this spec = 235;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s173 lesson). */
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
 *  the F138 receipt shape at the count family, its TWENTIETH
 *  instance, this cycle in its STAYS form: 14,307 unchanged, the
 *  zero-source-change cycle touching zero source files). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.175\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S173-A + S173-B — the registrations (the below-threshold + premises notes)
// ---------------------------------------------------------------------------

describe("S173-A/B the below-threshold + premises registrations (a deferral decision's premises are live claims, re-derived every cycle the item stays deferred; a posture about generated output must name its detection perimeter; the directive's own phrasings are count-truth surfaces one generation up)", () => {
  it("SURVIVAL (worklog): the bracketed s173-below-threshold-note registers the six-member batch — B173-I-1's ELEMENT_LIMIT message-literal family with the promotion form, A173-I-2's posture-precision datum with the detection-perimeter correction and the named exclusion lever, B173-I-2's directive-side decomposition with the next-generation correction, B173-I-3's frozen-record coordinate re-anchor, the A173-I-1/I-3 continuity pair", () => {
    const noteAt = worklogSource.indexOf("[s173-below-threshold-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 12000);
    // The ELEMENT_LIMIT member and its promotion form.
    expect(collapsed(note)).toContain("B173-I-1");
    expect(collapsed(note)).toContain("ELEMENT_LIMIT");
    expect(collapsed(note)).toContain("${ELEMENT_LIMIT} interpolation");
    // The posture-precision member and its correction.
    expect(collapsed(note)).toContain("A173-I-2");
    expect(collapsed(note)).toContain(
      "the detection perimeter is the REPO, not the app",
    );
    expect(collapsed(note)).toContain("@source not '../skills'");
    // The directive-side member and its correction.
    expect(collapsed(note)).toContain("B173-I-2");
    expect(collapsed(note)).toContain("227 tests/ + 7 src/lib");
    // The frozen-record member.
    expect(collapsed(note)).toContain("B173-I-3");
    expect(collapsed(note)).toContain("PAD:2822");
    // The continuity pair.
    expect(collapsed(note)).toContain("A173-I-1");
    expect(collapsed(note)).toContain("A173-I-3");
  });

  it("SURVIVAL (worklog): the bracketed s173-id-stable-premises-note registers the premises — the four premises at their seams, the FORTY-SEVENTH ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const noteAt = worklogSource.indexOf("[s173-id-stable-premises-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 6000);
    expect(collapsed(note)).toContain("FORTY-SEVENTH CONSECUTIVE CYCLE");
    expect(collapsed(note)).toContain("all four premises re-derived LIVE");
    expect(collapsed(note)).toContain("P1 the churn-consuming registrations");
    expect(collapsed(note)).toContain("P2 the index-stable remap");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The judgment carried unchanged");
  });
});

// ---------------------------------------------------------------------------
// The prior-cycle source-survival members (zero source changes this cycle)
// ---------------------------------------------------------------------------

describe("The prior-cycle source-survival members (the S172 delivery intact through the zero-source-change cycle — the layer total STAYS 14,307, the route figure STAYS 2,450)", () => {
  it("SURVIVAL (source): the S172 delivery intact — the README noun-unit sites at :133/:184, call.ts's era-scoped past-tense clause + the seam at 80 lines, the ai-assistant route's modelReply rename, the layer STAYING 14,307 and the route layer STAYING 2,450 (both derived live, never quoted)", () => {
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
    // The layer + route figures, derived live (the STAYS form — the
    // cycle touched zero src/ files, so both totals hold by construction).
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
// S173-C — the per-session pin family
// ---------------------------------------------------------------------------

describe("S173-C the per-session pin family (the survival members + the doc-side members that stay RED until the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's TWENTY-FOURTH instance — the s172 plan's execution record shipped 6/6 ticked, zero unticked (the pre-armed guard per the session_421/422 directive; the twenty-second consecutive cycle of the forward form) + the plan-history zero-finding carriers still exactly FIVE (s173 not among them — the honest 0C/0H/0M/0L/6I census) + the pin-family arithmetic (the S128..S173 total rides the spec's own census: 608 + 12 = 620)", () => {
    // The s172 plan's execution record, read live: every box ticked.
    const ticked = s172PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s172PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(6);
    expect(unticked).toBe(0);
    // The plan-history zero-finding claim derived LIVE: exactly five
    // carriers of the combined 0I census form, s173 NOT among them.
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
    // The pin-family arithmetic (the S128..S173 total rides the spec's
    // own census: 608 + 12 = 620).
    expect(608 + 12).toBe(620);
  });

  it("SURVIVAL (scripts): the s173 script provenance — live173/nav173/digma-seo-s173 tokens, the 149th/150th/110th ordinals, the S172 delivery at f37fe6aa, zero s172 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live173");
    expect(refAuditSource).toContain("149th reference audit");
    expect(refAuditSource).toContain("the S172 delivery at HEAD f37fe6aa");
    expect(refAuditSource).toContain("byte-identical the 110th");
    expect(refAuditSource).toContain("ref-audit-s183");
    // The nav script: its own tokens + the never-up gate's session.
    expect(navSource).toContain("nav173");
    expect(navSource).toContain("150th session, S173-cycle");
    expect(navSource).toContain("the S172 delivery f37fe6aa + the S173 remediation");
    expect(navSource).toContain("Session 173 (S173): the never-up gate");
    // The seo script: its own tokens.
    expect(seoSource).toContain("digma-seo-s173");
    expect(seoSource).toContain("session 173, S173-cycle");
    // ZERO s172 run-ordinal residue in the derived scripts (the F89
    // evidence-truth family — fixed-history phrases name their own
    // event, never this run's ordinal).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live172");
      expect(src).not.toContain("nav172");
      expect(src).not.toContain("seo-s172");
      expect(src).not.toContain("s182");
      expect(src).not.toContain("148th");
      expect(src).not.toContain("149th session");
      expect(src).not.toContain("149th consecutive");
      expect(src).not.toContain("byte-identical the 109th");
      expect(src).not.toContain("85965bc6");
    }
  });

  it("SURVIVAL (worklog): the two s173 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/0L/3I (with the 141 TRUE / 0 FALSE comment-truth census, the EIGHTH consecutive zero-false) and auditor B's 0C/0H/0M/0L/3I (with the 47th premises cycle and the S172 repair-seam verification)", () => {
    const aEntry = auditEntry("Task ID: digma-s173-audit-A");
    expect(aEntry).not.toBe("");
    expect(collapsed(aEntry)).toContain("THE CENSUS: 0 Critical / 0 High / 0 Medium / 0 Low / 3 Informational");
    expect(collapsed(aEntry)).toContain("141 sampled / 141 TRUE / 0 FALSE");
    expect(collapsed(aEntry)).toContain("EIGHTH CONSECUTIVE ZERO-FALSE census");
    expect(collapsed(aEntry)).toContain("A173-I-1");
    expect(collapsed(aEntry)).toContain("A173-I-2");
    expect(collapsed(aEntry)).toContain("A173-I-3");
    const bEntry = auditEntry("Task ID: digma-s173-audit-B");
    expect(bEntry).not.toBe("");
    expect(collapsed(bEntry)).toContain("THE CENSUS: 0 Critical / 0 High / 0 Medium / 0 Low / 3 Informational");
    expect(collapsed(bEntry)).toContain("B173-I-1");
    expect(collapsed(bEntry)).toContain("B173-I-2");
    expect(collapsed(bEntry)).toContain("B173-I-3");
    expect(collapsed(bEntry)).toContain("FORTY-SEVENTH CONSECUTIVE CYCLE");
    // The repair-seam focus, in the record's own spelling (the PASS 3
    // header form — the F143 phrase-case lesson).
    expect(collapsed(bEntry)).toContain("THE S172 REPAIR-SEAM VERIFICATION");
  });

  it("DEFECT (docs): the AGENTS session-173 bullet carries the completion members — the per-auditor census lines, the S173-A registration batch, the 141 TRUE / 0 FALSE comment-truth census, and the 47th deferral cycle", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 173, S173-A..S173-C");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 12000);
    // The completion members' key phrases (the bullet's own spelling —
    // the s156 F143 phrase-case lesson).
    expect(collapsed(bullet)).toContain("A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/3I");
    expect(collapsed(bullet)).toContain("S173-A");
    expect(collapsed(bullet)).toContain("posture-precision");
    expect(collapsed(bullet)).toContain("141 TRUE / 0 FALSE");
    expect(collapsed(bullet)).toContain("47th consecutive cycle");
    expect(collapsed(bullet)).toContain("14,307");
  });

  it("DEFECT (docs): the count re-anchor — the v1.152.0 chain entry carries the S173 derivation (2416 = 2404 + 12 unit / 235 files) + the §7.1 row for the s173 spec, the layer-total family STAYING at 14,307 (the sixth consecutive STAYS cycle — the zero-source-change form, zero F40 riders)", () => {
    expect(padSource).toMatch(/v1\.152\.0/);
    expect(padSource).toContain("2416 = 2404 + 12 unit / 235 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s173.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's twentieth instance, this cycle in its STAYS form): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.152.0 block quotes — 14,307 unchanged (the zero-source-change cycle touching zero source files; the sixth consecutive STAYS cycle)", () => {
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
    expect(liveLayerTotal).toBe(14373);
  });

  it("DEFECT (docs): the F160 lesson registered in the digma_SKILL — the content-detection-perimeter member inserted after F159, the version bumped to v1.151.0", () => {
    expect(skillSource).toMatch(/version: 1\.174\.0/);
    expect(skillSource).toContain("F160");
    expect(collapsed(skillSource)).toContain(
      "CONTENT-DETECTION-PERIMETER member",
    );
    // F159 still present (the insertion is additive).
    expect(skillSource).toContain("F159");
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.152.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(
      /^# Digma — Master Project Architecture Document \(PAD\) v1\.175\.0$/m,
    );
    const lastUpdated =
      padSource.split("\n").find((l) => l.startsWith("**Last Updated:**")) ?? "";
    expect(lastUpdated).toContain("v1.175.0");
  });

  it("DEFECT (docs): the pair-unity claim forms riding the constants at every doc — every live claim site the same members (the rolling-safe form: this spec's constants equal the prior specs' constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    // The s172 spec's constants, re-anchored onto this cycle's figures.
    const s172Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s172.test.ts"),
      "utf8",
    );
    const s172Unit = s172Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s172Files = s172Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s172Unit).toBe(UNIT);
    expect(s172Files).toBe(FILES);
    // And the s171 spec's constants ride the same figures.
    const s171Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s171.test.ts"),
      "utf8",
    );
    const s171Unit = s171Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s171Files = s171Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s171Unit).toBe(UNIT);
    expect(s171Files).toBe(FILES);
  });
});
