import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-172 spec (the one-hundred-and-twentieth audit's chosen work —
// the ZERO-SOURCE-FINDING all-Informational cycle: every actionable member
// of the auditors' census A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/2I lives on the
// DOC/DIRECTIVE surface, the FIFTH consecutive STAYS cycle — the layer
// total STAYING 14,307, the route figure STAYING 2,450):
//
// S172-A — THE README NOUN-UNIT REPAIR (the B172-I-1 remediation, the FIX
//   form — live claim sites, never frozen records): README:133's "7 page
//   routes + 18 API route handlers" and README:184's "# 18 route handlers"
//   name the FILE count with the HANDLER noun — the live enumeration
//   yields 18 route FILES carrying 25 exported handlers (24 async +
//   health's sync GET); the number is true for files, the noun lies about
//   the unit. Re-worded onto "18 API route files (25 exported handlers)"
//   and "# 18 route files / 25 handlers". ZERO source changes.
//
// S172-B — THE BELOW-THRESHOLD + DIRECTIVE-SIDE REGISTRATION (the B172-I-2
//   remediation, the registration form): the bracketed
//   s172-below-threshold-note at the worklog — B172-I-2 (the s172
//   directive's "19 spec-exercised write-carrying handlers" conflating two
//   censuses; the coherent form "19 spec-exercised (13 write-carrying)")
//   + the A172-I-1..I-3 trio + the pre-existing families carried.
//
// S172-C — THE PREMISES REGISTRATION: the bracketed
//   s172-id-stable-premises-note — the 46th consecutive cycle, the four
//   premises at their seams, the judgment carried unchanged.
//
// S172-D — THE PER-SESSION PIN FAMILY: 12 pins — 6 RED doc-side members
//   (the README noun-unit re-word, the AGENTS session-172 bullet, the
//   count re-anchor, the forward count-truth guard, the F159 lesson, the
//   pair-unity RED-until-collateral) / 6 green-at-birth (the two
//   worklog-registration members, the F138
//   guard's TWENTY-THIRD instance — the s171 plan's record pinned 6/6
//   ticked at 85965bc6 per the pre-armed session_415/416 directive, the
//   script provenance, the audit entries, the source-survival member;
//   RED 6/6 EXACT after ONE spec-form repair — the repair-seam phrase
//   onto the record's own spelling, the F143 phrase-case lesson's own
//   instance).
//
// The collateral family: the count re-anchor 2404 = 2392 + 12 / 234 files;
// the layer-total family STAYING at 14,307 (the FIFTH consecutive STAYS
// cycle, the zero-source-change form); the route figure STAYING at 2,450;
// PAD v1.151.0; digma_SKILL v1.150.0 + F159 (the noun-unit closure
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
const s171PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session171.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s172.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s172.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s172.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2392 delivery checks + this
 *  spec's 12 = 2404 unit, the 233 delivery files + this spec = 234;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s172 lesson). */
const UNIT = "2697";
const FILES = "257";

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

/** The figure the v1.174.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its NINETEENTH
 *  instance, this cycle in its STAYS form: 14,307 unchanged, the
 *  zero-source-change cycle touching zero source files). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.174\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S172-A — the README noun-unit repair (the FIX form)
// ---------------------------------------------------------------------------

describe("S172-A the README noun-unit repair (the B172-I-1 remediation — a count and its noun must close in the same unit; the file count 18 was wearing the handler noun while the live enumeration carries 25 exported handlers)", () => {
  it("DEFECT (docs): README's two noun-unit sites re-worded onto the file unit with the handler figure carried in parentheses — the tech-table cell and the tree comment (the handler noun gone from both)", () => {
    const readme = readFileSync(
      path.resolve(import.meta.dirname, "../README.md"),
      "utf8",
    );
    // The re-worded cell (the file unit + the handler figure in
    // parentheses — the record's own spelling).
    expect(readme).toContain(
      "18 API route files (25 exported handlers), standalone output",
    );
    // The re-worded tree comment.
    expect(readme).toContain("# 18 route files / 25 handlers (auth,");
    // The noun-drifted forms are GONE.
    expect(readme).not.toContain("18 API route handlers");
    expect(readme).not.toContain("# 18 route handlers");
  });
});

// ---------------------------------------------------------------------------
// S172-B + S172-C — the registrations (the below-threshold + premises notes)
// ---------------------------------------------------------------------------

describe("S172-B/C the below-threshold + premises registrations (a deferral decision's premises are live claims, re-derived every cycle the item stays deferred; the directive's own phrasings are count-truth surfaces one generation up)", () => {
  it("SURVIVAL (worklog): the bracketed s172-below-threshold-note registers B172-I-2 + the A172-I-1..I-3 trio — the directive-phrasing conflation with its next-generation correction, the five below-threshold observations re-verified, the components-panel posture, the A171-I-1 correction landed and verified", () => {
    const noteAt = worklogSource.indexOf("[s172-below-threshold-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 9000);
    // The directive-side member and its correction.
    expect(collapsed(note)).toContain("B172-I-2");
    expect(collapsed(note)).toContain("19 spec-exercised (13 write-carrying)");
    // The A-trio.
    expect(collapsed(note)).toContain("A172-I-1");
    expect(collapsed(note)).toContain("A172-I-3");
    expect(collapsed(note)).toContain("LANDED AND VERIFIED");
  });

  it("SURVIVAL (worklog): the bracketed s172-id-stable-premises-note registers the premises — the four premises at their seams, the FORTY-SIXTH ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const noteAt = worklogSource.indexOf("[s172-id-stable-premises-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 6000);
    expect(collapsed(note)).toContain("FORTY-SIXTH CONSECUTIVE CYCLE");
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

describe("The prior-cycle source-survival members (the S169/S170/S171 deliveries intact through the zero-source-change cycle — the layer total STAYS 14,307, the route figure STAYS 2,450)", () => {
  it("SURVIVAL (source): the S169/S170/S171 deliveries intact — call.ts's era-scoped past-tense clause + the seam at 80 lines, the ai-assistant route's modelReply rename, the layer STAYING 14,307 and the route layer STAYING 2,450 (both derived live, never quoted)", () => {
    const callSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/lib/call.ts"),
      "utf8",
    );
    // The S169-A delivery: the era-scoped past-tense clause + the file at 80
    // (the docblock matcher strips the ' * ' continuation markers first —
    // the s168 standing form; the RED-birth spec-form repair).
    expect(strippedDocblockComments(callSource)).toContain(
      "the long-deleted files view's GET-only call sites were behavior-identical through this form",
    );
    // The file at 80 lines, counted by the wc -l convention (the
    // standing form — a trailing newline is not a line).
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
// S172-D — the per-session pin family
// ---------------------------------------------------------------------------

describe("S172-D the per-session pin family (the survival members + the doc-side members that stay RED until the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's TWENTY-THIRD instance — the s171 plan's execution record shipped 6/6 ticked, zero unticked (the pre-armed guard per the session_415/416 directive; the twenty-first consecutive cycle of the forward form) + the plan-history zero-finding carriers still exactly FIVE (s172 not among them — the honest 0C/0H/0M/0L/5I census) + the pin-family arithmetic (the S128..S172 total rides the spec's own census: 596 + 12 = 608)", () => {
    // The s171 plan's execution record, read live: every box ticked.
    const ticked = s171PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s171PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(6);
    expect(unticked).toBe(0);
    // The plan-history zero-finding claim derived LIVE: exactly five
    // carriers of the combined 0I census form, s172 NOT among them.
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
    // The pin-family arithmetic (the S128..S172 total rides the spec's
    // own census: 596 + 12 = 608).
    expect(596 + 12).toBe(608);
  });

  it("SURVIVAL (scripts): the s172 script provenance — live172/nav172/digma-seo-s172 tokens, the 148th/149th/109th ordinals, the S171 delivery at 85965bc6, zero s171 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live172");
    expect(refAuditSource).toContain("148th reference audit");
    expect(refAuditSource).toContain("the S171 delivery at HEAD 85965bc6");
    expect(refAuditSource).toContain("byte-identical the 109th");
    expect(refAuditSource).toContain("ref-audit-s182");
    // The nav script: its own tokens + the never-up gate's session.
    expect(navSource).toContain("nav172");
    expect(navSource).toContain("149th session, S172-cycle");
    expect(navSource).toContain("the S171 delivery 85965bc6 + the S172 remediation");
    expect(navSource).toContain("Session 172 (S172): the never-up gate");
    // The seo script: its own tokens.
    expect(seoSource).toContain("digma-seo-s172");
    expect(seoSource).toContain("session 172, S172-cycle");
    // ZERO s171 run-ordinal residue in the derived scripts (the F89
    // evidence-truth family — fixed-history phrases name their own
    // event, never this run's ordinal).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live171");
      expect(src).not.toContain("nav171");
      expect(src).not.toContain("seo-s171");
      expect(src).not.toContain("147th");
      expect(src).not.toContain("148th session");
      expect(src).not.toContain("148th consecutive");
      expect(src).not.toContain("byte-identical the 108th");
      expect(src).not.toContain("916f3160");
    }
  });

  it("SURVIVAL (worklog): the two s172 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/0L/3I (with the 141 TRUE / 0 FALSE comment-truth census, the SEVENTH consecutive zero-false) and auditor B's 0C/0H/0M/0L/2I (with the 46th premises cycle and the S171 repair-seam verification)", () => {
    const aEntry = auditEntry("Task ID: digma-s172-audit-A");
    expect(aEntry).not.toBe("");
    expect(collapsed(aEntry)).toContain("THE CENSUS: 0 Critical / 0 High / 0 Medium / 0 Low / 3 Informational");
    expect(collapsed(aEntry)).toContain("141 sampled / 141 TRUE / 0 FALSE");
    expect(collapsed(aEntry)).toContain("SEVENTH CONSECUTIVE ZERO-FALSE census");
    expect(collapsed(aEntry)).toContain("A172-I-1");
    expect(collapsed(aEntry)).toContain("A172-I-2");
    expect(collapsed(aEntry)).toContain("A172-I-3");
    const bEntry = auditEntry("Task ID: digma-s172-audit-B");
    expect(bEntry).not.toBe("");
    expect(collapsed(bEntry)).toContain("THE CENSUS: 0 Critical / 0 High / 0 Medium / 0 Low / 2 Informational");
    expect(collapsed(bEntry)).toContain("B172-I-1");
    expect(collapsed(bEntry)).toContain("B172-I-2");
    expect(collapsed(bEntry)).toContain("FORTY-SIXTH CONSECUTIVE CYCLE");
    // The repair-seam focus, in the record's own spelling (the PASS 3
    // header form — the F143 phrase-case lesson).
    expect(collapsed(bEntry)).toContain("every S171 repair seam verified TRUE live");
  });

  it("DEFECT (docs): the AGENTS session-172 bullet carries the completion members — the per-auditor census lines, the S172-A README noun-unit repair, the S172-B/C registrations, the 141 TRUE / 0 FALSE comment-truth census, and the 46th deferral cycle", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 172, S172-A..S172-D");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 12000);
    // The completion members' key phrases (the bullet's own spelling —
    // the s156 F143 phrase-case lesson).
    expect(collapsed(bullet)).toContain("A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/2I");
    expect(collapsed(bullet)).toContain("S172-A");
    expect(collapsed(bullet)).toContain("noun-unit");
    expect(collapsed(bullet)).toContain("141 TRUE / 0 FALSE");
    expect(collapsed(bullet)).toContain("46th consecutive cycle");
    expect(collapsed(bullet)).toContain("14,307");
  });

  it("DEFECT (docs): the count re-anchor — the v1.151.0 chain entry carries the S172 derivation (2404 = 2392 + 12 unit / 234 files) + the §7.1 row for the s172 spec, the layer-total family STAYING at 14,307 (the fifth consecutive STAYS cycle — the zero-source-change form, zero F40 riders)", () => {
    expect(padSource).toMatch(/v1\.151\.0/);
    expect(padSource).toContain("2404 = 2392 + 12 unit / 234 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s172.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's nineteenth instance, this cycle in its STAYS form): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.151.0 block quotes — 14,307 unchanged (the zero-source-change cycle touching zero source files; the fifth consecutive STAYS cycle)", () => {
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
    expect(liveLayerTotal).toBe(14373);
  });

  it("DEFECT (docs): the F159 lesson registered in the digma_SKILL — the noun-unit closure member inserted after F158, the version bumped to v1.150.0", () => {
    expect(skillSource).toMatch(/version: 1\.173\.0/);
    expect(skillSource).toContain("F159");
    expect(collapsed(skillSource)).toContain("NOUN-UNIT CLOSURE member");
    // F158 still present (the insertion is additive).
    expect(skillSource).toContain("F158");
  });

  it("DEFECT (docs): the pair-unity claim forms riding the constants at every doc — every live claim site the same members (the rolling-safe form: this spec's constants equal the prior specs' constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    // The s171 spec's constants, re-anchored onto this cycle's figures.
    const s171Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s171.test.ts"),
      "utf8",
    );
    const s171Unit = s171Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s171Files = s171Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s171Unit).toBe(UNIT);
    expect(s171Files).toBe(FILES);
    // And the s170 spec's constants ride the same figures.
    const s170Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s170.test.ts"),
      "utf8",
    );
    const s170Unit = s170Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s170Files = s170Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s170Unit).toBe(UNIT);
    expect(s170Files).toBe(FILES);
  });
});
