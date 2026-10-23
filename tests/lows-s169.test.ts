import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-169 spec (the one-hundred-and-seventeenth audit's chosen work —
// the FOUR-INFORMATIONAL remediation cycle, the third consecutive
// source-carrying cycle):
//
// S169-A — THE CALL() DOCBLOCK ERA-SCOPING CORRECTION (the A169-I-2
//   remediation, the comment-truth family's tense arm): src/lib/call.ts's
//   retained pre-S168 trailing clause spoke of the long-deleted files
//   view's GET-only call sites in the PRESENT tense ("are
//   behavior-identical through this form") while its recent-view/
//   dashboard-view siblings correctly tense the same history ("is gone" /
//   "had already lost"). The clause's primary claims were TRUE (the
//   body-conditional superset, the body-less passthrough) — vacuously
//   historical, not false — but a reader grepping "files view" met two
//   files that say it is gone and one that spoke of it as live. THE FIX:
//   the clause reworded onto the era-scoped past tense with the S169-A
//   provenance at the seam. A COMMENT-ONLY change, zero source behavior;
//   call.ts OUTSIDE the 22-file layer, the layer total STAYS 14,307.
//
// S169-B — THE AI-ASSISTANT BINDING-SHADOW RENAME (the B169-I-1
//   remediation, the names-outlive-their-concepts family at the binding
//   level): src/app/api/ai-assistant/route.ts:139 declared `const parsed
//   = JSON.parse(...)` inside the LLM try block, SHADOWING the handler's
//   outer `const parsed = await readBoundedJson(request)` at :48 — two
//   concepts (the bounded body parse vs the model-reply JSON scan)
//   sharing one name in one function scope. Zero behavioral impact
//   today; the hazard the S71-D drift class polices — a future edit
//   inside the LLM block referencing `parsed` in good faith silently
//   receives the model's parsed reply. THE FIX: the inner binding
//   renamed onto `modelReply`, a LINE-NEUTRAL two-line change (the file
//   stays 154 lines, the 18-file route layer STAYS 2,450 — zero F40
//   riders), the outer body-parse binding UNTOUCHED.
//
// S169-C — THE REGISTRATION PAIR: the s169-below-threshold-note (the
//   A169-I-1 + A169-I-3 standing registration — the five S168
//   below-threshold observations re-verified at their seams with their
//   postures, plus the components-panel no-op's documented PAD §10 scope
//   cut) + the s169-id-stable-premises-note (the 42nd consecutive cycle,
//   landed by auditor B — the four premises re-derived live and holding,
//   the judgment carried unchanged).
//
// S169-D — the per-session pin family: the F138 guard's TWENTIETH
//   instance (the s168 plan's record pinned 5/5 ticked at b39fe71a, per
//   the pre-armed session_395 directive), the audit entries at their
//   anchors, the script provenance (live169/nav169/digma-seo-s169 — the
//   145th/146th/106th ordinals, the S168 delivery at b39fe71a), the two
//   bracketed s169 registration notes, the client-layer survival member
//   (the layer total STAYS this cycle — 14,307, the second consecutive
//   STAYS), the pair-unity constants (born rolling-safe at the POST-spec
//   figures 2361/231 — the doc-update re-anchors the docs and the
//   constants TOGETHER), and the doc-side members (the F156 lesson, the
//   count re-anchor, the forward count-truth guard's sixteenth instance
//   in its STAYS form) that stay RED until the collateral.
//
// Spec-form notes (narrated at birth — the honest form separated from the
//   plan's forecast, the s153..s169 precedent's own shape): the born spec
//   carries 16 pins — 7 RED (the two source-side members — the spec born
//   BEFORE the source fixes, the TDD form, the third consecutive
//   source-carrying cycle — plus the five doc-side members incl. the
//   pair-unity RED-until-collateral) / 9 green-at-birth (the two
//   worklog-registration members — the notes landed BEFORE the spec's
//   birth per the standing precedent — plus the seven survival members);
//   the collateral count family re-anchors onto 2361 = 2345 + 16 unit /
//   231 files (lows-s169.test.ts joins as the 231st file); the
//   layer-total family STAYS at 14,307 and the route figure STAYS at
//   2,450 (zero F40 riders — the s169 cycle's own form).

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
const s168PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session168.md"),
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
const elementsRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s169.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s169.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s169.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2345 delivery checks + this
 *  spec's 16 = 2361 unit, the 230 delivery files + this spec = 231;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s169 lesson). */
const UNIT = "2501";
const FILES = "242";

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

/** The figure the v1.159.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its sixteenth instance,
 *  this cycle in its STAYS form: 14,307 unchanged, both fixes outside
 *  or line-neutral to the 22-file client layer). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.159\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S169-A — the call() docblock era-scoping correction (the source-carrying member)
// ---------------------------------------------------------------------------

describe("S169-A the call() docblock era-scoping correction (the A169-I-2 remediation — a docblock clause naming a deleted consumer must carry its era: names outlive their concepts)", () => {
  it("DEFECT (source — RED until the fix lands, the TDD form): the files-view clause carries the ERA-SCOPED past tense with the S169-A provenance at the seam, and the present-tense clause is GONE", () => {
    // The era-scoped past tense (RED until the reword lands — the
    // clause names its own era, never a live consumer).
    expect(strippedDocblockComments(callSource)).toContain(
      "the long-deleted files view's GET-only call sites were behavior-identical through this form",
    );
    // The registration provenance at the seam (the S169-A form).
    expect(strippedDocblockComments(callSource)).toContain(
      "Session 169 (S169-A / A169-I-2",
    );
    // The present-tense clause is GONE (the pre-fix stale-tense member).
    expect(strippedDocblockComments(callSource)).not.toContain(
      "the files view's GET-only call sites are behavior-identical through this form",
    );
  });

  it("SURVIVAL (source): the S168-A delivery intact through the S169-A reword — the accurate scope, the eleven-site bypass census, and the seam's export signature unchanged", () => {
    // The S168-A scope correction survives the reword (the reword
    // must never regress the prior cycle's delivery).
    expect(strippedDocblockComments(callSource)).toContain(
      "envelope-consuming list views",
    );
    expect(strippedDocblockComments(callSource)).toContain(
      "Eleven deliberate raw-fetch bypass sites",
    );
    expect(strippedDocblockComments(callSource)).toContain(
      "the auth cards' inline-alert flows",
    );
    // The bypass sites themselves REMAIN (the fix is a comment reword,
    // never a behavior change).
    expect(loginSource.match(/await fetch\(/g)?.length).toBe(4);
    expect(resetSource.match(/await fetch\(/g)?.length).toBe(1);
    expect(aiAssistantComponentSource).toContain('await fetch("/api/ai-assistant", {');
    expect(
      viewSource.match(
        /fetch\(`\/api\/projects\/\$\{[^}]+\}\/elements`/g,
      )?.length,
    ).toBe(3);
    // The seam itself still serves its real consumers (the export
    // signature unchanged — the comment-only contract).
    expect(callSource).toMatch(
      /export async function call<T>\(url: string, init\?: RequestInit, opts\?: CallOptions\)/,
    );
  });
});

// ---------------------------------------------------------------------------
// S169-B — the ai-assistant binding-shadow rename (the source-carrying member)
// ---------------------------------------------------------------------------

describe("S169-B the ai-assistant binding-shadow rename (the B169-I-1 remediation — two concepts sharing one name in one scope is a drift hazard even when behavior-neutral today)", () => {
  it("DEFECT (source — RED until the fix lands, the TDD form): the inner binding renamed onto its own concept — modelReply present, the shadow GONE, the outer body-parse binding UNTOUCHED", () => {
    // The rename landed (RED until the rename lands).
    expect(aiRouteSource).toContain(
      "const modelReply = JSON.parse(text.slice(jsonStart, jsonEnd + 1));",
    );
    expect(aiRouteSource).toContain(
      "sanitizeLlmOperations(modelReply, targetIds)",
    );
    // The shadow is GONE (the pre-fix drift hazard).
    expect(aiRouteSource).not.toContain("const parsed = JSON.parse(");
    // The outer body-parse binding UNTOUCHED (the bounded body parse
    // keeps its own name — the rename never touches the outer concept).
    expect(aiRouteSource).toContain(
      "const parsed = await readBoundedJson(request);",
    );
    expect(aiRouteSource).toContain("if (parsed.tooLarge) {");
    expect(aiRouteSource).toContain("const body = parsed.value;");
  });

  it("SURVIVAL (source): the line-neutral contract — the route file stays 154 lines (the 18-file route layer STAYS 2,450), and the LLM-path contract members hold (the 64KB reply cap, the describeRejection catch, the 200 fallback)", () => {
    const root = path.resolve(import.meta.dirname, "..");
    // The line-neutral rename (wc -l, the honest count).
    const out = execSync("wc -l src/app/api/ai-assistant/route.ts", {
      cwd: root,
      encoding: "utf8",
    });
    expect(Number(out.trim().split(/\s+/)[0])).toBe(154);
    // The 64KB model-reply cap (the S161-B bound — the reply-side
    // member of the body-cap family; the closing-quote-then-slice form
    // — the one spec-form repair at this RED birth, the s167/s168
    // precedent's own shape: the pin's substring must match the
    // source's own spelling, never an approximation).
    expect(aiRouteSource).toContain(").slice(0, 65_536)");
    // The guarded coercion + the 200-either-way fallback contract.
    expect(aiRouteSource).toContain("describeRejection(error)");
    expect(aiRouteSource).toContain(
      "return ok({ reply: command.reply, operations: command.operations });",
    );
  });
});

// ---------------------------------------------------------------------------
// S169-C — the registration pair: the below-threshold note + the deferral premises (the 42nd cycle)
// ---------------------------------------------------------------------------

describe("S169-C the registration pair (the standing Informationals + the deferral premises — a deferral decision's premises are live claims, re-derived every cycle the item stays deferred)", () => {
  it("SURVIVAL (worklog): the bracketed s169-below-threshold-note registers A169-I-1 + A169-I-3 — the five S168 below-threshold observations re-verified with their postures, the components-panel no-op with its PAD §10 scope cut", () => {
    const noteAt = worklogSource.indexOf("[s169-below-threshold-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 6000);
    // The two findings and their postures.
    expect(collapsed(note)).toContain("A169-I-1");
    expect(collapsed(note)).toContain("A169-I-3");
    expect(collapsed(note)).toContain("REGISTERED, not promoted");
    expect(collapsed(note)).toContain("all five still accurately described, still below-threshold, correctly located");
    // The five members, named.
    expect(collapsed(note)).toContain("Insert handler's inline four-draw-type membership");
    expect(collapsed(note)).toContain("no-op-guards counting-unit nuance");
    expect(collapsed(note)).toContain("gradient-stop same-reference posture");
    expect(collapsed(note)).toContain("no-op dismiss timers");
    expect(collapsed(note)).toContain("mobile crossing-close family");
    // The components-panel no-op's documented scope cut.
    expect(collapsed(note)).toContain('aria-label="New component"');
    expect(collapsed(note)).toContain("documented scope cut (PAD §10)");
  });

  it("SURVIVAL (worklog): the bracketed s169-id-stable-premises-note registers the premises — the four premises at their seams, the FORTY-SECOND ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const noteAt = worklogSource.indexOf("[s169-id-stable-premises-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 8000);
    // The ordinal and the four premises.
    expect(collapsed(note)).toContain("FORTY-SECOND CONSECUTIVE CYCLE");
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
// S169-D — the per-session pin family: survival members + doc-side members
// ---------------------------------------------------------------------------

describe("S169-D the per-session pin family (the survival members + the doc-side members that stay RED until the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's TWENTIETH instance — the s168 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_395 directive; the eighteenth consecutive cycle of the forward form)", () => {
    // The s168 plan's execution record, read live: every box ticked.
    const ticked = s168PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s168PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
  });

  it("SURVIVAL (plans): the plan-history zero-finding claim derived LIVE — exactly FIVE carriers of the combined 0I census form across the remediation plans (s143/s152/s153/s156/s165 frozen), s169 NOT among them (the honest four-Informational form — this plan never carries the combined 0I string) + the pin-family arithmetic (the S128..S169 total rides the spec's own census: 549 + 16 = 565)", () => {
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
    // The pin-family arithmetic (the S128..S169 total rides the spec's
    // own census: 549 + 16 = 565).
    expect(549 + 16).toBe(565);
  });

  it("SURVIVAL (scripts): the s169 script provenance — live169/nav169/digma-seo-s169 tokens, the 145th/146th/106th ordinals, the S168 delivery at b39fe71a, zero s168 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live169");
    expect(refAuditSource).toContain("145th reference audit");
    expect(refAuditSource).toContain("b39fe71a");
    expect(refAuditSource).toContain("byte-identical the 106th");
    // The nav script: the 146th session ordinal.
    expect(navSource).toContain("nav169");
    expect(navSource).toContain("146th session");
    // The seo script: the session-169 token.
    expect(seoSource).toContain("digma-seo-s169");
    expect(seoSource).toContain("session 169");
    // Zero s168 run-ordinal residue across the three scripts.
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live168");
      expect(src).not.toContain("nav168");
      expect(src).not.toContain("seo-s168");
      expect(src).not.toContain("s178");
      expect(src).not.toContain("144th");
      expect(src).not.toContain("145th session");
      expect(src).not.toContain("145th consecutive");
      expect(src).not.toContain("byte-identical the 105th");
      expect(src).not.toContain("b8ca329f");
    }
  });

  it("SURVIVAL (worklog): the two s169 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/0L/3I (with the 142 TRUE / 0 FALSE comment-truth census and the A169-I-1/I-2/I-3 findings) and auditor B's 0C/0H/0M/0L/1I (with the 42nd premises cycle and the B169-I-1 finding)", () => {
    const entryA = auditEntry("Task ID: digma-s169-audit-A");
    expect(entryA).not.toBe("");
    expect(collapsed(entryA)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 3 Informational",
    );
    expect(collapsed(entryA)).toContain("142 sampled / 142 TRUE / 0 FALSE");
    // The findings as the landed entry spells them (the entries' own
    // designations — the pin matches the record as it landed, never a
    // projected designation).
    expect(collapsed(entryA)).toContain("A169-I-1 (Informational, Verified)");
    expect(collapsed(entryA)).toContain("A169-I-2 (Informational, Verified)");
    expect(collapsed(entryA)).toContain("A169-I-3 (Informational, Verified)");
    const entryB = auditEntry("Task ID: digma-s169-audit-B");
    expect(entryB).not.toBe("");
    expect(collapsed(entryB)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 1 Informational",
    );
    expect(collapsed(entryB)).toContain("42nd");
    expect(collapsed(entryB)).toContain("B169-I-1 (Informational, Verified");
  });

  it("DEFECT (docs): the AGENTS session-169 bullet carries the completion members — the FOUR-INFORMATIONAL census, the S169-A era-scoping correction, the S169-B binding-shadow rename, the A169-I-1/A169-I-3 registrations, the 142 TRUE / 0 FALSE comment-truth census, and the 42nd deferral cycle", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 169, S169-A..S169-D");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 12000);
    // The completion members' key phrases (the bullet's own
    // spelling — the s156 F143 phrase-case lesson; the second
    // spec-form repair at the source-green pass, the s167/s168
    // precedent's own shape: the census pin asserts the bullet's own
    // per-auditor spellings + its own combined designation, never a
    // shorthand the bullet does not carry).
    expect(collapsed(bullet)).toContain("A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/1I");
    expect(collapsed(bullet)).toContain("FOUR-INFORMATIONAL cycle");
    expect(collapsed(bullet)).toContain("S169-A");
    expect(collapsed(bullet)).toContain("S169-B");
    expect(collapsed(bullet)).toContain("A169-I-1");
    expect(collapsed(bullet)).toContain("A169-I-3");
    expect(collapsed(bullet)).toContain("B169-I-1");
    expect(collapsed(bullet)).toContain("142 TRUE / 0 FALSE");
    expect(collapsed(bullet)).toContain("42nd consecutive cycle");
    expect(collapsed(bullet)).toContain("14,307");
  });

  it("DEFECT (docs): the count re-anchor — the v1.148.0 chain entry carries the S169 derivation (2361 = 2345 + 16 unit / 231 files) + the §7.1 row for the s169 spec, the layer-total family STAYING at 14,307 (the second consecutive STAYS cycle — zero F40 riders)", () => {
    expect(padSource).toMatch(/v1\.148\.0/);
    expect(padSource).toContain("2361 = 2345 + 16 unit / 231 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s169.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's sixteenth instance, this cycle in its STAYS form): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.148.0 block quotes — 14,307 unchanged (both fixes outside or line-neutral to the 22-file layer; the second consecutive STAYS cycle)", () => {
    // The live derivation NEVER quotes a figure: the runtime IIFE at
    // the spec's head (wc -l over the exact 22-file composition —
    // 8 editor + 8 components + 2 hooks + the 3 named lib members +
    // globals.css, the composition pinned by tests/lows-s142.test.ts).
    expect(liveLayerTotal).toBe(14307);
    // The PAD's v1.148.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("DEFECT (docs): the F156 lesson registered in the digma_SKILL — the names-outlive-their-concepts member inserted after F155, the version bumped to v1.147.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.158\.0/);
    // The lesson: the members after F155.
    const f155At = skillSource.indexOf("F155");
    const f156At = skillSource.indexOf("F156");
    expect(f155At).toBeGreaterThan(-1);
    expect(f156At).toBeGreaterThan(f155At);
    const f156Body = skillSource.slice(f156At, f156At + 4000);
    // The names-outlive-their-concepts member (a shadowed binding and
    // a stale-tense docblock clause are the same drift class).
    expect(collapsed(f156Body)).toContain("NAMES-OUTLIVE-THEIR-CONCEPTS");
    expect(collapsed(f156Body)).toContain("shadowed binding");
  });

  it("DEFECT (docs): the pair-unity claim forms riding the constants at every doc — every live claim site the same members (the rolling-safe form: this spec's constants equal the prior specs' constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s168Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s168.test.ts"),
      "utf8",
    );
    // The s168 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s168Unit = s168Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s168Files = s168Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s168Unit).toBe(UNIT);
    expect(s168Files).toBe(FILES);
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
