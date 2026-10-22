import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-170 spec (the one-hundred-and-eighteenth audit's chosen work —
// the FOUR-INFORMATIONAL remediation cycle, the FIRST ALL-REGISTRATION
// cycle since S166, the second consecutive FOUR-INFORMATIONAL census):
//
// S170-A — THE COUNT-TRUTH REGISTRATION PAIR (the A170A-I-2 + B170-I-1
//   remediation, the count-truth family's frozen-record arm): the S169-A
//   frozen entry's live recount of observation (b) stated "15 return-{}
//   sites across 13 arms" while its own parenthetical enumeration totals
//   SIXTEEN sites (2+1+1+2+2+1+1+1+1+1+1+1+1 = 16 across 13 arms) — the
//   stated 15 matching neither the statement unit (13 literal sites) nor
//   the ternary-inclusive unit its own enumeration rides (16); and the
//   S169-B frozen entry split the e2e tree as "(43 files: 36 spec +
//   helpers/setup/backdate)" while the live tree holds 39 .spec.ts + 4
//   non-spec helpers = 43 — the 43 total exact, the "36 spec" member
//   born-drifted against its own s168 predecessor's coherent form. THE
//   REMEDIATION: the bracketed s170-count-truth-note at the worklog —
//   the corrected unit-dependent truth stated in full (thirteen
//   statement sites / sixteen ternary-inclusive / eighteen with converts,
//   each figure naming its unit; thirty-nine spec + four helpers = 43),
//   the frozen records never rewritten (the S140-A registration form —
//   the frozen entry is the audit's own artifact, its drift a recorded
//   fact about the audit, not a live claim about the tree). ZERO source
//   changes (the all-registration form).
//
// S170-B — THE BELOW-THRESHOLD REGISTRATION: the s170-below-threshold-note
//   (the A170A-I-1 + A170A-I-3 standing registration — the five S168
//   below-threshold observations re-verified at their seams with their
//   postures — the (b) member restated in its corrected unit-naming form
//   — plus the components-panel no-op's documented PAD §10 scope cut).
//
// S170-C — THE PREMISES REGISTRATION: the s170-id-stable-premises-note
//   (the 43rd consecutive cycle, the four premises re-derived live and
//   holding, the judgment carried unchanged).
//
// S170-D — the per-session pin family: the F138 guard's TWENTY-FIRST
//   instance (the s169 plan's record pinned 6/6 ticked at d09c8b1b, per
//   the pre-armed session_403 directive), the audit entries at their
//   anchors, the script provenance (live170/nav170/digma-seo-s170 — the
//   146th/147th/107th ordinals, the S169 delivery at d09c8b1b), the three
//   bracketed s170 registration notes, the live-census members (the e2e
//   split re-derived live 39 + 4 = 43; the store's no-op-guard statement
//   census re-derived live at its registered unit), the source-survival
//   members (the S169-A and S169-B deliveries intact through the S170
//   cycle — the layer total STAYS 14,307, the THIRD consecutive STAYS
//   cycle, the all-registration form), the pair-unity constants (born
//   rolling-safe at the POST-spec figures 2377/232 — the doc-update
//   re-anchors the docs and the constants TOGETHER), and the doc-side
//   members (the F157 lesson, the count re-anchor, the forward
//   count-truth guard's seventeenth instance in its STAYS form) that stay
//   RED until the collateral.
//
// Spec-form notes (narrated at birth — the honest form separated from the
//   plan's forecast, the s153..s170 precedent's own shape): the born spec
//   carries 16 pins — 5 RED (the five doc-side members incl. the
//   pair-unity RED-until-collateral) / 11 green-at-birth (the three
//   worklog-registration members — the notes landed BEFORE the spec's
//   birth per the standing precedent — plus the eight survival members);
//   the collateral count family re-anchors onto 2377 = 2361 + 16 unit /
//   232 files (lows-s170.test.ts joins as the 232nd file); the
//   layer-total family STAYS at 14,307 and the route figure STAYS at
//   2,450 (zero F40 riders — the s170 cycle's own all-registration form).

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
const s169PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session169.md"),
  "utf8",
);
const callSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/call.ts"),
  "utf8",
);
const loginSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/login-screen.tsx"),
  "utf8",
);
const resetSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/reset-password-screen.tsx"),
  "utf8",
);
const aiAssistantComponentSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const layersSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/layers-panel.tsx"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const aiRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/ai-assistant/route.ts"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s170.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s170.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s170.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2361 delivery checks + this
 *  spec's 16 = 2377 unit, the 231 delivery files + this spec = 232;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s170 lesson). */
const UNIT = "2416";
const FILES = "235";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** Collapse a TS source's comment body: strip the leading '// '
 *  markers from every line, then collapse whitespace — so a phrase
 *  spanning comment continuation lines matches as contiguous text
 *  (the s158 spec-form repair's standing form). */
const strippedSlashComments = (s: string) =>
  s.replace(/^[ \t]*\/\/[ \t]?/gm, "").replace(/\s+/g, " ");

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

/** The figure the v1.152.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its seventeenth
 *  instance, this cycle in its STAYS form: 14,307 unchanged, the
 *  all-registration cycle touching zero source files). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.152\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S170-A — the count-truth registration pair (the all-registration member)
// ---------------------------------------------------------------------------

describe("S170-A the count-truth registration pair (the A170A-I-2 + B170-I-1 remediation — a recorded count and its own enumeration must close arithmetically IN THE SAME UNIT; a frozen record's drift is corrected by the next generation's registration, never by a rewrite)", () => {
  it("SURVIVAL (worklog): the bracketed s170-count-truth-note registers A170A-I-2 + B170-I-1 — the two born-drifted frozen-record figures named with their corrected unit-naming forms, the frozen records never rewritten", () => {
    const noteAt = worklogSource.indexOf("[s170-count-truth-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 9000);
    // The two findings and their registrations.
    expect(collapsed(note)).toContain("A170A-I-2 + B170-I-1");
    expect(collapsed(note)).toContain("frozen records");
    // The corrected no-op-guards arithmetic: each figure names its unit.
    expect(collapsed(note)).toContain("SIXTEEN sites");
    expect(collapsed(note)).toContain("THIRTEEN literal return-{} STATEMENT sites");
    expect(collapsed(note)).toContain("EIGHTEEN sites across 15 arms");
    expect(collapsed(note)).toContain("the counting unit is the registered form");
    // The corrected e2e split (the note's own spelling — the F143
    // phrase-case lesson: the pin matches the record as it landed).
    expect(collapsed(note)).toContain("THIRTY-NINE .spec.ts");
    expect(collapsed(note)).toContain("FOUR non-spec helpers");
    expect(collapsed(note)).toContain(
      "(auth.setup.ts, backdate-portfolio.ts, global-setup.ts, helpers.ts) = 43",
    );
    // The doctrine members.
    expect(collapsed(note)).toContain("must close arithmetically IN THE SAME UNIT");
    expect(collapsed(note)).toContain("never by rewriting the frozen record");
  });

  it("SURVIVAL (live census): the corrected figures re-derived LIVE at the tree — the e2e split (39 spec + 4 helpers = 43) and the store's no-op-guard statement census at its registered unit (13 literal return-{} statement sites)", () => {
    const root = path.resolve(import.meta.dirname, "..");
    // The e2e tree split, derived live (never a quoted figure).
    const specCount = Number(
      execSync("ls tests/e2e/*.spec.ts | wc -l", { cwd: root, encoding: "utf8" })
        .toString()
        .trim(),
    );
    const totalCount = Number(
      execSync("ls tests/e2e | wc -l", { cwd: root, encoding: "utf8" })
        .toString()
        .trim(),
    );
    expect(specCount).toBe(39);
    expect(totalCount).toBe(43);
    expect(totalCount - specCount).toBe(4);
    // The store's no-op-guard statement census at the REGISTERED unit:
    // the literal `return {};` statement sites (the S160-D comment's own
    // counting unit — the ternary `{}` arms sit outside the statement
    // census; the registered form).
    expect(storeSource.match(/return \{\};/g)?.length).toBe(13);
    // The ternary-arm forms exist (the unit-dependent family the note
    // names — the enumeration's own members).
    expect(storeSource.match(/\? \{\}/g)?.length).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// S170-B — the below-threshold registration (the standing Informationals)
// ---------------------------------------------------------------------------

describe("S170-B the below-threshold registration (the A170A-I-1 + A170A-I-3 standing registration — the deferral family's re-verification cycle)", () => {
  it("SURVIVAL (worklog): the bracketed s170-below-threshold-note registers A170A-I-1 + A170A-I-3 — the five S168 below-threshold observations re-verified with their postures (the (b) member in its corrected unit-naming form), the components-panel no-op with its PAD §10 scope cut", () => {
    const noteAt = worklogSource.indexOf("[s170-below-threshold-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 7000);
    // The two findings and their postures.
    expect(collapsed(note)).toContain("A170A-I-1");
    expect(collapsed(note)).toContain("A170A-I-3");
    expect(collapsed(note)).toContain("REGISTERED, not promoted");
    expect(collapsed(note)).toContain("all five still accurately described, still below-threshold, correctly located");
    // The five members, named.
    expect(collapsed(note)).toContain("Insert handler's inline four-draw-type membership");
    expect(collapsed(note)).toContain("no-op-guards counting-unit nuance");
    expect(collapsed(note)).toContain("gradient-stop same-reference posture");
    expect(collapsed(note)).toContain("no-op dismiss timers");
    expect(collapsed(note)).toContain("mobile crossing-close family");
    // The (b) member restated in its corrected unit-naming form (the
    // S170-A doctrine applied inside the registration itself).
    expect(collapsed(note)).toContain("thirteen literal return-{} statement sites");
    expect(collapsed(note)).toContain("the number unit-dependent");
    // The components-panel no-op's documented scope cut.
    expect(collapsed(note)).toContain('aria-label="New component"');
    expect(collapsed(note)).toContain("documented scope cut (PAD §10)");
  });
});

// ---------------------------------------------------------------------------
// S170-C — the premises registration + the churn-consuming perimeter (the 43rd cycle)
// ---------------------------------------------------------------------------

describe("S170-C the premises registration (a deferral decision's premises are live claims, re-derived every cycle the item stays deferred)", () => {
  it("SURVIVAL (worklog): the bracketed s170-id-stable-premises-note registers the premises — the four premises at their seams, the FORTY-THIRD ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const noteAt = worklogSource.indexOf("[s170-id-stable-premises-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 8000);
    // The ordinal and the four premises.
    expect(collapsed(note)).toContain("FORTY-THIRD CONSECUTIVE CYCLE");
    expect(collapsed(note)).toContain("all four HOLDING");
    expect(collapsed(note)).toContain("value-based or honest-refusal");
    expect(collapsed(note)).toContain("index-stable remap");
    expect(collapsed(note)).toContain("replace-transaction seams");
    expect(collapsed(note)).toContain("value-based perimeter");
    // The carried judgment (the four-Informational census form).
    expect(collapsed(note)).toContain("regression risk continues to outweigh its churn-optimality benefit");
    // The premises-pinning doctrine (F130, carried).
    expect(collapsed(note)).toContain("re-derive them every cycle the item stays deferred");
  });

  it("SURVIVAL (source): the four churn-consuming perimeter sites live at their forms (found by content, never by stale coordinates) — the fillKey compare-and-adjust, the layers rename registration, the AI targetIds send-time capture, the store's patchDiffers value guard", () => {
    // P1a: the fillKey compare-and-adjust (properties-panel).
    expect(panelSource).toContain("const fillKey = `${element.id}:${derivedFillMode}`;");
    expect(panelSource).toContain("if (prevFillKey !== fillKey) {");
    // P1b: the layers rename registration (the S134-B by-design form —
    // the marker-stripped form, the phrase spanning // continuation
    // lines; the s158 spec-form lesson).
    expect(strippedSlashComments(layersSource)).toContain(
      "the rename session keys on the RENDER-BOUND row id",
    );
    // P1c: the AI targetIds send-time capture.
    expect(aiAssistantComponentSource).toContain("targetIds: state.selectedIds,");
    // P1d: the store's patchDiffers value guard (the updateElements arm).
    expect(storeSource).toContain("if (patchDiffers(el, patch)) {");
  });
});

// ---------------------------------------------------------------------------
// The source-survival members — the S169 deliveries intact through the
// all-registration S170 cycle (zero source changes, the third consecutive
// STAYS cycle)
// ---------------------------------------------------------------------------

describe("The S169 source-survival members (the prior cycle's deliveries intact through the all-registration cycle — the layer total STAYS 14,307, the route figure STAYS 2,450)", () => {
  it("SURVIVAL (source): the S169-A delivery intact — the era-scoped past-tense clause, the provenance, the eleven-site bypass census, and the seam's export signature unchanged (call.ts 80 lines, the file OUTSIDE the 22-file layer)", () => {
    const root = path.resolve(import.meta.dirname, "..");
    // The era-scoped past tense survives the S170 cycle.
    expect(strippedDocblockComments(callSource)).toContain(
      "the long-deleted files view's GET-only call sites were behavior-identical through this form",
    );
    expect(strippedDocblockComments(callSource)).toContain(
      "Session 169 (S169-A / A169-I-2",
    );
    // The present-tense clause stays GONE.
    expect(strippedDocblockComments(callSource)).not.toContain(
      "the files view's GET-only call sites are behavior-identical through this form",
    );
    // The bypass sites themselves REMAIN (the all-registration cycle
    // touches zero source behavior).
    expect(loginSource.match(/await fetch\(/g)?.length).toBe(4);
    expect(resetSource.match(/await fetch\(/g)?.length).toBe(1);
    expect(aiAssistantComponentSource).toContain('await fetch("/api/ai-assistant", {');
    expect(
      viewSource.match(
        /fetch\(`\/api\/projects\/\$\{[^}]+\}\/elements`/g,
      )?.length,
    ).toBe(3);
    // The seam itself still serves its real consumers.
    expect(callSource).toMatch(
      /export async function call<T>\(url: string, init\?: RequestInit, opts\?: CallOptions\)/,
    );
    // The honest line count (the S169-A record: 76 -> 80 comment-only).
    const out = execSync("wc -l src/lib/call.ts", {
      cwd: root,
      encoding: "utf8",
    });
    expect(Number(out.trim().split(/\s+/)[0])).toBe(80);
  });

  it("SURVIVAL (source): the S169-B line-neutral contract intact — modelReply at :139/:140, the outer body-parse binding untouched, the route file staying 154 lines (the 18-file route layer STAYS 2,450)", () => {
    const root = path.resolve(import.meta.dirname, "..");
    // The rename survives the S170 cycle.
    expect(aiRouteSource).toContain(
      "const modelReply = JSON.parse(text.slice(jsonStart, jsonEnd + 1));",
    );
    expect(aiRouteSource).toContain(
      "sanitizeLlmOperations(modelReply, targetIds)",
    );
    // The shadow stays GONE.
    expect(aiRouteSource).not.toContain("const parsed = JSON.parse(");
    // The outer body-parse binding UNTOUCHED.
    expect(aiRouteSource).toContain(
      "const parsed = await readBoundedJson(request);",
    );
    expect(aiRouteSource).toContain("if (parsed.tooLarge) {");
    expect(aiRouteSource).toContain("const body = parsed.value;");
    // The line-neutral contract (wc -l, the honest count).
    const out = execSync("wc -l src/app/api/ai-assistant/route.ts", {
      cwd: root,
      encoding: "utf8",
    });
    expect(Number(out.trim().split(/\s+/)[0])).toBe(154);
    // The 64KB model-reply cap (the S161-B bound — the source's own
    // closing-quote-then-slice spelling).
    expect(aiRouteSource).toContain(").slice(0, 65_536)");
    // The guarded coercion + the 200-either-way fallback contract.
    expect(aiRouteSource).toContain("describeRejection(error)");
    expect(aiRouteSource).toContain(
      "return ok({ reply: command.reply, operations: command.operations });",
    );
  });
});

// ---------------------------------------------------------------------------
// S170-D — the per-session pin family: survival members + doc-side members
// ---------------------------------------------------------------------------

describe("S170-D the per-session pin family (the survival members + the doc-side members that stay RED until the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's TWENTY-FIRST instance — the s169 plan's execution record shipped 6/6 ticked, zero unticked (the pre-armed guard per the session_403 directive; the nineteenth consecutive cycle of the forward form)", () => {
    // The s169 plan's execution record, read live: every box ticked.
    const ticked = s169PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s169PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(6);
    expect(unticked).toBe(0);
  });

  it("SURVIVAL (plans): the plan-history zero-finding claim derived LIVE — exactly FIVE carriers of the combined 0I census form across the remediation plans (s143/s152/s153/s156/s165 frozen), s170 NOT among them (the honest four-Informational form — this plan never carries the combined 0I string) + the pin-family arithmetic (the S128..S170 total rides the spec's own census: 565 + 16 = 581)", () => {
    // The live derivation NEVER quotes a figure: grep the plans dir for
    // the combined 0I census form and count the carriers.
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
    // The pin-family arithmetic (the S128..S170 total rides the spec's
    // own census: 565 + 16 = 581).
    expect(565 + 16).toBe(581);
  });

  it("SURVIVAL (scripts): the s170 script provenance — live170/nav170/digma-seo-s170 tokens, the 146th/147th/107th ordinals, the S169 delivery at d09c8b1b, zero s169 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live170");
    expect(refAuditSource).toContain("146th reference audit");
    expect(refAuditSource).toContain("d09c8b1b");
    expect(refAuditSource).toContain("byte-identical the 107th");
    // The nav script: the 147th session ordinal.
    expect(navSource).toContain("nav170");
    expect(navSource).toContain("147th session");
    // The seo script: the session-170 token.
    expect(seoSource).toContain("digma-seo-s170");
    expect(seoSource).toContain("session 170");
    // Zero s169 run-ordinal residue across the three scripts.
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live169");
      expect(src).not.toContain("nav169");
      expect(src).not.toContain("seo-s169");
      expect(src).not.toContain("s179");
      expect(src).not.toContain("145th");
      expect(src).not.toContain("146th session");
      expect(src).not.toContain("146th consecutive");
      expect(src).not.toContain("byte-identical the 106th");
      expect(src).not.toContain("b39fe71a");
    }
  });

  it("SURVIVAL (worklog): the two s170 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/0L/3I (with the 141 TRUE / 0 FALSE comment-truth census and the A170A-I-1/I-2/I-3 findings) and auditor B's 0C/0H/0M/0L/1I (with the 43rd premises cycle and the B170-I-1 finding)", () => {
    const entryA = auditEntry("Task ID: digma-s170-audit-A");
    expect(entryA).not.toBe("");
    expect(collapsed(entryA)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 3 Informational",
    );
    expect(collapsed(entryA)).toContain("141 sampled / 141 TRUE / 0 FALSE");
    // The findings as the landed entry spells them (the entries' own
    // designations — the pin matches the record as it landed, never a
    // projected designation).
    expect(collapsed(entryA)).toContain("A170A-I-1 (Informational, Verified");
    expect(collapsed(entryA)).toContain("A170A-I-2 (Informational, Verified");
    expect(collapsed(entryA)).toContain("A170A-I-3 (Informational, Verified");
    const entryB = auditEntry("Task ID: digma-s170-audit-B");
    expect(entryB).not.toBe("");
    expect(collapsed(entryB)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 1 Informational",
    );
    expect(collapsed(entryB)).toContain("43rd");
    expect(collapsed(entryB)).toContain("B170-I-1 (Informational, Verified");
  });

  it("DEFECT (docs): the AGENTS session-170 bullet carries the completion members — the FOUR-INFORMATIONAL census (the second consecutive), the S170-A count-truth registration, the S170-B below-threshold registration, the A170A-I-1/A170A-I-3 + B170-I-1 registrations, the 141 TRUE / 0 FALSE comment-truth census, and the 43rd deferral cycle", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 170, S170-A..S170-D");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 12000);
    // The completion members' key phrases (the bullet's own
    // spelling — the s156 F143 phrase-case lesson; the census pin
    // asserts the bullet's own per-auditor spellings + its own
    // combined designation, never a shorthand the bullet does not
    // carry).
    expect(collapsed(bullet)).toContain("A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/1I");
    expect(collapsed(bullet)).toContain("FOUR-INFORMATIONAL cycle");
    expect(collapsed(bullet)).toContain("S170-A");
    expect(collapsed(bullet)).toContain("S170-B");
    expect(collapsed(bullet)).toContain("A170A-I-1");
    expect(collapsed(bullet)).toContain("A170A-I-3");
    expect(collapsed(bullet)).toContain("B170-I-1");
    expect(collapsed(bullet)).toContain("141 TRUE / 0 FALSE");
    expect(collapsed(bullet)).toContain("43rd consecutive cycle");
    expect(collapsed(bullet)).toContain("14,307");
  });

  it("DEFECT (docs): the count re-anchor — the v1.149.0 chain entry carries the S170 derivation (2377 = 2361 + 16 unit / 232 files) + the §7.1 row for the s170 spec, the layer-total family STAYING at 14,307 (the third consecutive STAYS cycle — the all-registration form, zero F40 riders)", () => {
    expect(padSource).toMatch(/v1\.149\.0/);
    expect(padSource).toContain("2377 = 2361 + 16 unit / 232 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s170.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's seventeenth instance, this cycle in its STAYS form): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.149.0 block quotes — 14,307 unchanged (the all-registration cycle touching zero source files; the third consecutive STAYS cycle)", () => {
    // The live derivation NEVER quotes a figure: the runtime IIFE at
    // the spec's head (wc -l over the exact 22-file composition —
    // 8 editor + 8 components + 2 hooks + the 3 named lib members +
    // globals.css, the composition pinned by tests/lows-s142.test.ts).
    expect(liveLayerTotal).toBe(14307);
    // The PAD's v1.149.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("DEFECT (docs): the F157 lesson registered in the digma_SKILL — the count-and-enumeration-closure member inserted after F156, the version bumped to v1.148.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.151\.0/);
    // The lesson: the members after F156.
    const f156At = skillSource.indexOf("F156");
    const f157At = skillSource.indexOf("F157");
    expect(f156At).toBeGreaterThan(-1);
    expect(f157At).toBeGreaterThan(f156At);
    const f157Body = skillSource.slice(f157At, f157At + 4000);
    // The count-and-enumeration-closure member (a recorded count and
    // its own enumeration must close in the same unit; a frozen
    // record's drift is corrected by the next generation's
    // registration, never a rewrite).
    expect(collapsed(f157Body)).toContain("COUNT-AND-ENUMERATION-CLOSURE");
    expect(collapsed(f157Body)).toContain("IN THE SAME UNIT");
  });

  it("DEFECT (docs): the pair-unity claim forms riding the constants at every doc — every live claim site the same members (the rolling-safe form: this spec's constants equal the prior specs' constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s169Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s169.test.ts"),
      "utf8",
    );
    // The s169 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s169Unit = s169Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s169Files = s169Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s169Unit).toBe(UNIT);
    expect(s169Files).toBe(FILES);
    // The AGENTS/CLAUDE/README/SKILL live claim sites carry the same
    // members (found by CONTENT, the F106 live-claim-sites-only
    // doctrine).
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    expect(agents).toContain(`Unit tests (${UNIT} checks)`);
    const claude = readFileSync(
      path.resolve(import.meta.dirname, "../CLAUDE.md"),
      "utf8",
    );
    expect(claude).toContain(`(${UNIT} unit / 73 smoke / 262 e2e)`);
    const readme = readFileSync(
      path.resolve(import.meta.dirname, "../README.md"),
      "utf8",
    );
    expect(readme).toContain(`${UNIT} checks on the pure domain seams`);
    expect(skillSource).toContain(`${UNIT} unit checks green`);
  });
});
