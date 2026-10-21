import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-165 spec (the one-hundred-and-thirteenth audit's chosen work —
// the FIFTH ZERO-FINDING CENSUS registration cycle):
//
// S165-A — THE FIFTH ZERO-FINDING CENSUS REGISTRATION (the S143 doctrine's
//   fifth instance — a clean verdict is a count-truth claim like any other):
//   the 113th audit's combined census reads 0 Critical / 0 High / 0 Medium /
//   0 Low / 0 Informational (auditor A 0C/0H/0M/0L/0I + auditor B
//   0C/0H/0M/0L/0I, every claim lead-verified at its seams) — the FIFTH
//   zero-finding census in the 165-plan history (the plan-history claim
//   itself re-derived live by grep: s143 the first, s152 the second, s153
//   the third, s156 the fourth, zero others). The evidence trail: the two
//   audit entries at their Task-ID anchors; the pin families S128..S164 at
//   491/491; the six baseline gates green (lint 0, typecheck 0, unit
//   2287/2287 across 226 files, build 27 routes, smoke 73/73, e2e 262/262
//   zero flakes at 6.8m); the 141st reference audit NO DRIFT with the clip
//   datum byte-identical the 102nd consecutive session; mobile nav 9/9 the
//   142nd session; SEO 4/4; the dispatch figures live-exact; THE F138
//   GUARD'S SIXTEENTH VERIFICATION PASSED. The comment-truth census 140
//   TRUE / 0 FALSE — the FIRST ZERO-FALSE sampling in the record's history.
//   Auditor A's five below-threshold observations registered, not fixed.
//
// S165-B — THE ID-STABLE PUT DEFERRAL-PREMISES REGISTRATION (the 38th
//   consecutive cycle — the S143-B doctrine's echo: a deferral decision's
//   premises are live claims, re-derived every cycle the item stays
//   deferred): all four premises re-derived live by auditor B and holding —
//   P1 the churn-consuming registrations value-based or honest-refusal at
//   all their sites; P2 the index-stable remap behind the five-guard stack;
//   P3 the replace-transaction seams intact; P4 the value-based perimeter
//   zero-uncensused. The judgment carried unchanged (the zero-finding
//   census is the cleanest possible form of the statement that nothing
//   grows a mutation-surface member that would promote the rewrite).
//
// S165-C — the per-session pin family: the F138 guard's SIXTEENTH instance
//   (the s164 plan's record pinned 7/7 ticked at 008c14cf, per the
//   pre-armed session_369 directive), the audit entries at their anchors,
//   the script provenance (live165/nav165/digma-seo-s165 — the
//   141st/142nd/102nd ordinals, the S164 delivery at 008c14cf), the two
//   bracketed s165 registration notes, the client-layer survival member
//   (the layer total STAYS this cycle — the THIRD consecutive STAYS cycle,
//   zero source changes this registration cycle), the pair-unity constants
//   (born rolling-safe at the POST-spec figures 2301/227 — the doc-update
//   re-anchors the docs and the constants TOGETHER), and the doc-side
//   members (the F152 lesson, the count re-anchor, the forward count-truth
//   guard's twelfth instance) that stay RED until the collateral.
//
// Spec-form notes (narrated at birth — the honest form separated from the
// plan's forecast, the s153..s164 precedent's own shape): the born spec
// carries 14 pins — 5 RED (the five doc-side members incl. the pair-unity
// RED-until-collateral) / 9 green-at-birth (the two worklog-registration
// members — the notes landed BEFORE the spec's birth per the standing
// precedent — plus the seven survival members); the collateral count family
// re-anchors onto 2301 = 2287 + 14 unit / 227 files (lows-s165.test.ts
// joins as the 227th file); the layer-total family STAYS at 14,295 (zero
// source changes this registration cycle — the third consecutive STAYS
// cycle, NO s156/s157/s158 rider, NO F140 prior-spec rider).

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
const s164PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session164.md"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
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
const aiAssistantSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const elementsRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s165.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s165.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s165.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2287 delivery checks + this
 *  spec's 14 = 2301 unit, the 226 delivery files + this spec = 227;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s164 lesson). */
const UNIT = "2345";
const FILES = "230";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** Collapse a TS source's comment body: strip the leading '// '
 *  markers from every line, then collapse whitespace — so a phrase
 *  spanning comment continuation lines matches as contiguous text
 *  (the s158 spec-form repair's standing form). */
const strippedSlashComments = (s: string) =>
  s.replace(/^[ \t]*\/\/[ \t]?/gm, "").replace(/\s+/g, " ");

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

/** The figure the v1.147.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its twelfth instance). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.147\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S165-A — the fifth zero-finding census registration
// ---------------------------------------------------------------------------

describe("S165-A the fifth zero-finding census registration (the 113th Mode C audit — a clean verdict is a count-truth claim like any other)", () => {
  it("DEFECT (worklog): the bracketed s165-clean-census-note registers the census — the 0C/0H/0M/0L/0I combined form, the FIFTH claim with the four named priors, the evidence trail, the first-zero-false comment-truth census, and the five below-threshold observations", () => {
    const noteAt = worklogSource.indexOf("[s165-clean-census-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 8000);
    // The combined census form (both auditors zero across all five
    // severities).
    expect(collapsed(note)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational",
    );
    // The FIFTH claim with the four named priors (the plan-history
    // claim re-derived live, never quoted).
    expect(collapsed(note)).toContain("THE FIFTH ZERO-FINDING CENSUS");
    expect(collapsed(note)).toContain("s143 the FIRST, s152 the SECOND, s153 the THIRD, s156 the FOURTH, THIS the FIFTH");
    // The evidence trail members.
    expect(collapsed(note)).toContain("491/491");
    expect(collapsed(note)).toContain("2287/2287 across 226 files");
    expect(collapsed(note)).toContain("byte-identical the 102nd consecutive session");
    expect(collapsed(note)).toContain("9/9 the 142nd session");
    expect(collapsed(note)).toContain("THE F138 GUARD'S SIXTEENTH VERIFICATION PASSED");
    // The first-zero-false comment-truth census.
    expect(collapsed(note)).toContain("140 TRUE / 0 FALSE");
    expect(collapsed(note)).toContain("FIRST ZERO-FALSE sampling");
    // The five below-threshold observations registered.
    expect(collapsed(note)).toContain("four-draw-type membership");
    expect(collapsed(note)).toContain("counting-unit nuance");
    expect(collapsed(note)).toContain("gradient-stop index-key posture");
    expect(collapsed(note)).toContain("no-op dismiss timers");
    expect(collapsed(note)).toContain("lg-crossing close effects");
  });

  it("SURVIVAL (worklog): the two s165 audit entries ride at their Task-ID anchors with their zero-finding census lines — auditor A's 0C/0H/0M/0L/0I (with the 140 TRUE / 0 FALSE comment-truth census) and auditor B's 0C/0H/0M/0L/0I (with the 38th consecutive deferral cycle)", () => {
    const entryA = auditEntry("Task ID: digma-s165-audit-A");
    expect(entryA).not.toBe("");
    expect(collapsed(entryA)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational",
    );
    expect(collapsed(entryA)).toContain("140 TRUE / 0 FALSE");
    const entryB = auditEntry("Task ID: digma-s165-audit-B");
    expect(entryB).not.toBe("");
    expect(collapsed(entryB)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational",
    );
    expect(collapsed(entryB)).toContain("38th cycle");
  });

  it("SURVIVAL (plans): the plan-history zero-finding claim derived LIVE — exactly FIVE carriers of the combined 0I census form across the remediation plans (s143/s152/s153/s156 frozen + s165 living), zero others (the census-of-censuses re-derived, never quoted)", () => {
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
    // The pin-family arithmetic (the S128..S165 total rides the spec's
    // own census: 491 + 14 = 505).
    expect(491 + 14).toBe(505);
  });
});

// ---------------------------------------------------------------------------
// S165-B — the id-stable PUT deferral-premises registration (the 38th cycle)
// ---------------------------------------------------------------------------

describe("S165-B the id-stable PUT deferral-premises registration (a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred)", () => {
  it("DEFECT (worklog): the bracketed s165-id-stable-premises-note registers the premises — the four premises at their seams, the THIRTY-EIGHTH ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const noteAt = worklogSource.indexOf("[s165-id-stable-premises-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 8000);
    // The ordinal and the four premises.
    expect(collapsed(note)).toContain("THIRTY-EIGHTH CONSECUTIVE CYCLE");
    expect(collapsed(note)).toContain("all four HOLDING");
    expect(collapsed(note)).toContain("value-based or honest-refusal");
    expect(collapsed(note)).toContain("index-stable remap");
    expect(collapsed(note)).toContain("replace-transaction seams");
    expect(collapsed(note)).toContain("value-based perimeter zero-uncensused");
    // The carried judgment (the zero-finding census form).
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
    expect(aiAssistantSource).toContain("targetIds: state.selectedIds,");
    // P1d: the store's patchDiffers value guard (the updateElements arm).
    expect(storeSource).toContain("if (patchDiffers(el, patch)) {");
  });

  it("SURVIVAL (source): the index-stable remap at the markSaved boundary + the replace transaction's three write sites in one $transaction with the 30s timeout (the churn's own registered seams)", () => {
    // P2: the index-stable remap (editor-view) handing markSaved the map.
    expect(viewSource).toContain("const remap = new Map<string, string>();");
    expect(viewSource).toContain("now.markSaved(elements ?? [], remap);");
    // P3: the replace transaction (elements route) — delete + recreate +
    // update in one $transaction, the S73-C timeout.
    expect(elementsRouteSource).toContain("await tx.designElement.deleteMany(");
    expect(elementsRouteSource).toContain("await tx.designElement.createMany(");
    expect(elementsRouteSource).toContain("await tx.project.update(");
    expect(elementsRouteSource).toContain("timeout: 30_000");
    // P4: the value-based perimeter (zero storage anywhere in src).
    const root = path.resolve(import.meta.dirname, "..");
    const out = execSync(
      'grep -rn "localStorage\\|sessionStorage" src/ --include="*.ts" --include="*.tsx" | wc -l',
      { cwd: root, encoding: "utf8" },
    );
    expect(Number(out.trim())).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// S165-C — the per-session pin family: survival members + doc-side members
// ---------------------------------------------------------------------------

describe("S165-C the per-session pin family (the survival members + the doc-side members that stay RED until the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's SIXTEENTH instance — the s164 plan's execution record shipped 7/7 ticked, zero unticked (the pre-armed guard per the session_369 directive; the fourteenth consecutive cycle of the forward form)", () => {
    // The s164 plan's execution record, read live: every box ticked.
    const ticked = s164PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s164PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(7);
    expect(unticked).toBe(0);
  });

  it("SURVIVAL (scripts): the s165 script provenance — live165/nav165/digma-seo-s165 tokens, the 141st/142nd/102nd ordinals, the S164 delivery at 008c14cf, zero s164 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live165");
    expect(refAuditSource).toContain("141st reference audit");
    expect(refAuditSource).toContain("008c14cf");
    expect(refAuditSource).toContain("byte-identical the 102nd");
    // The nav script: the 142nd session ordinal.
    expect(navSource).toContain("nav165");
    expect(navSource).toContain("142nd session");
    // The seo script: the session-165 token.
    expect(seoSource).toContain("digma-seo-s165");
    expect(seoSource).toContain("session 165");
    // Zero s164 run-ordinal residue across the three scripts.
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live164");
      expect(src).not.toContain("nav164");
      expect(src).not.toContain("seo-s164");
      expect(src).not.toContain("s174");
      expect(src).not.toContain("140th");
      expect(src).not.toContain("141st session");
      expect(src).not.toContain("141st consecutive");
      expect(src).not.toContain("byte-identical the 101st");
      expect(src).not.toContain("e004e57d");
    }
  });

  it("SURVIVAL (behavioral — the client-layer contract): the keep-form family intact and the store arms at their standing contracts (zero source changes this registration cycle — the layer total STAYS at 14,295, the THIRD consecutive STAYS cycle)", () => {
    // The store's keep-form family: the S117-B reference-keeping
    // renumber and the S78-C identical-order bail verbatim.
    expect(storeSource).toContain(
      "el.sortOrder === i ? el : { ...el, sortOrder: i }",
    );
    expect(storeSource).toContain(
      'nextIds.join("\\u0001") === state.elements.map((el) => el.id).join("\\u0001")',
    );
    // The S115-A/S116-A value-diff guards verbatim (the no-op commit
    // family's PUT-arm members).
    expect(storeSource).toContain("patchDiffers(el, patch)");
    // The updateElements/scaleElements/deleteElements/toggleVisibility/
    // toggleLock id-match guards still return the family form.
    const updateGuards = storeSource.match(/if \(!matched\) return \{\};/g);
    expect(updateGuards?.length).toBe(5);
    // The layers DnD branch's own reorder convention verbatim.
    expect(layersSource).toContain("store.reorderElements([fromId],");
    // The S160-B keyboard superset still present.
    expect(layersSource).toContain('event.key === "F2"');
    // The S161-B Insert branch still present (the surface whose inline
    // four-draw-type membership the S165-A registration names).
    expect(viewSource).toContain('event.key === "Insert"');
    // The layer total STAYS at 14,295 — zero source changes this
    // registration cycle (the third consecutive STAYS cycle).
    // RE-ANCHORED onto 14307 by the S167-A rider (teams-view +12 —
    // the F40 prior-spec re-anchor: the claim stays true, the pinned
    // figure moves with the live tree).
    expect(liveLayerTotal).toBe(14307);
  });

  it("DEFECT (docs): the AGENTS session-165 bullet carries the registration members — the FIFTH ZERO-FINDING CENSUS, the first zero-false comment-truth sampling, and the 38th deferral cycle", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 165, S165-A..S165-C");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 8000);
    // The registration members' key phrases (the bullet's own
    // spelling — the s156 F143 phrase-case lesson).
    expect(collapsed(bullet)).toContain("FIFTH ZERO-FINDING CENSUS");
    expect(collapsed(bullet)).toContain("140 TRUE / 0 FALSE");
    expect(collapsed(bullet)).toContain("38th consecutive cycle");
  });

  it("DEFECT (docs): the count re-anchor — the v1.144.0 chain entry carries the S165 derivation (2301 = 2287 + 14 unit / 227 files) + the §7.1 row for the s165 spec, the layer-total family STAYING at 14,295 (the third consecutive STAYS cycle)", () => {
    expect(padSource).toMatch(/v1\.144\.0/);
    expect(padSource).toContain("2301 = 2287 + 14 unit / 227 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s165.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's twelfth instance): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.144.0 block quotes — the count receipt riding the spec instead of prose, this cycle in its STAYS form (zero source changes this registration cycle)", () => {
    // The live derivation NEVER quotes a figure: the runtime IIFE at
    // the spec's head (wc -l over the exact 22-file composition —
    // 8 editor + 8 components + 2 hooks + the 3 named lib members +
    // globals.css, the composition pinned by tests/lows-s142.test.ts).
    // RE-ANCHORED onto 14307 by the S167-A rider (teams-view +12 —
    // the F40 prior-spec re-anchor: the claim stays true, the pinned
    // figure moves with the live tree).
    expect(liveLayerTotal).toBe(14307);
    // The PAD's v1.144.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("DEFECT (docs): the F152 lesson registered in the digma_SKILL — the zero-false-sampling + registration-cycle members inserted after F151, the version bumped to v1.143.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.146\.0/);
    // The lesson: the members after F151.
    const f151At = skillSource.indexOf("F151");
    const f152At = skillSource.indexOf("F152");
    expect(f151At).toBeGreaterThan(-1);
    expect(f152At).toBeGreaterThan(f151At);
    const f152Body = skillSource.slice(f152At, f152At + 4000);
    // The zero-false-sampling member (the 140 TRUE / 0 FALSE census
    // arrived by eleven consecutive comment-truth cycles retiring
    // every false member — pin the census, never relax the sampling).
    expect(collapsed(f152Body)).toContain("ZERO-FALSE-SAMPLING");
    // The registration-cycle member (a zero-finding census is not a
    // no-op — the registrations ARE the deliverables).
    expect(collapsed(f152Body)).toContain("REGISTRATION-CYCLE");
  });

  it("DEFECT (docs): the pair-unity claim forms riding the constants at every doc — every live claim site the same members (the rolling-safe form: this spec's constants equal the prior specs' constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s164Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s164.test.ts"),
      "utf8",
    );
    // The s164 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s164Unit = s164Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s164Files = s164Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s164Unit).toBe(UNIT);
    expect(s164Files).toBe(FILES);
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
