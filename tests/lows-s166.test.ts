import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-166 spec (the one-hundred-and-fourteenth audit's chosen work —
// the ONE-INFORMATIONAL remediation cycle, the B166-I-1 arithmetic-closure
// correction):
//
// S166-A — THE WRITE-SET ARITHMETIC-CLOSURE CORRECTION REGISTRATION (the
//   B166-I-1 remediation, the S132-C standing-note form — the B164-L1
//   precedent's echo): the s165-B worklog entry's e2e write-set phrase was
//   over-membered by one under any single counting convention (20 exercised
//   + 1 never-exercised + 5 zero-e2e = 26 member-slots for 25 handlers)
//   while every underlying fact stayed true — the s163/s164 form had been
//   coherent ("20 exercised, all asserted except health"), the s165 reword
//   broke the closure. THE STANDING CORRECTION (auditor B's live
//   member-by-member derivation): 19 of the 25 exercised by the specs' own
//   calls, every one asserted; health exercised and readiness-asserted only
//   by the Playwright webServer probe (playwright.config.ts:97) — the
//   20-figure under the PROBE-INCLUSIVE convention; the five zero-e2e
//   handlers exact. THE ARITHMETIC CLOSURE: 19 + 1 + 5 = 25. The s165-B
//   entry stays FROZEN per S132-C; the bracketed note is the standing
//   correction. The comment-truth census 142 TRUE / 0 FALSE — the SECOND
//   consecutive zero-false sampling.
//
// S166-B — THE ID-STABLE PUT DEFERRAL-PREMISES REGISTRATION (the 39th
//   consecutive cycle — the S143-B doctrine's echo: a deferral decision's
//   premises are live claims, re-derived every cycle the item stays
//   deferred): all four premises re-derived live by auditor B and holding —
//   P1 the churn-consuming registrations value-based or honest-refusal at
//   all their sites; P2 the index-stable remap behind the five-guard stack;
//   P3 the replace-transaction seams intact; P4 the value-based perimeter
//   zero-uncensused. The judgment carried unchanged (the one-Informational
//   census this cycle's cleanest form of the statement that nothing grows
//   a mutation-surface member that would promote the rewrite).
//
// S166-C — the per-session pin family: the F138 guard's SEVENTEENTH
//   instance (the s165 plan's record pinned 5/5 ticked at 44914bec, per
//   the pre-armed session_375 directive), the audit entries at their
//   anchors, the script provenance (live166/nav166/digma-seo-s166 — the
//   142nd/143rd/103rd ordinals, the S165 delivery at 44914bec), the two
//   bracketed s166 registration notes, the client-layer survival member
//   (the layer total STAYS this cycle — the FOURTH consecutive STAYS
//   cycle, zero source changes this cycle), the pair-unity constants
//   (born rolling-safe at the POST-spec figures 2315/228 — the doc-update
//   re-anchors the docs and the constants TOGETHER), and the doc-side
//   members (the F153 lesson, the count re-anchor, the forward count-truth
//   guard's thirteenth instance) that stay RED until the collateral.
//
// Spec-form notes (narrated at birth — the honest form separated from the
// plan's forecast, the s153..s165 precedent's own shape): the born spec
// carries 14 pins — 5 RED (the five doc-side members incl. the pair-unity
// RED-until-collateral) / 9 green-at-birth (the two worklog-registration
// members — the notes landed BEFORE the spec's birth per the standing
// precedent — plus the seven survival members); the collateral count family
// re-anchors onto 2315 = 2301 + 14 unit / 228 files (lows-s166.test.ts
// joins as the 228th file); the layer-total family STAYS at 14,295 (zero
// source changes this cycle — the fourth consecutive STAYS cycle, NO
// s156/s157/s158 rider, NO F140 prior-spec rider).

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
const s165PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session165.md"),
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
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s166.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s166.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s166.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2301 delivery checks + this
 *  spec's 14 = 2315 unit, the 227 delivery files + this spec = 228;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s165 lesson). */
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
 *  the F138 receipt shape at the count family, its thirteenth instance). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.159\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S166-A — the write-set arithmetic-closure correction registration
// ---------------------------------------------------------------------------

describe("S166-A the write-set arithmetic-closure correction registration (the B166-I-1 remediation — a census claim is its facts PLUS the counting convention that closes the arithmetic)", () => {
  it("DEFECT (worklog): the bracketed s166-write-set-closure-note registers the standing correction — the coherent member-by-member census (19 spec-exercised + health probe-owned + 5 zero-e2e), the arithmetic closure, the two counting conventions, the frozen-record doctrine, the F153 doctrine", () => {
    const noteAt = worklogSource.indexOf("[s166-write-set-closure-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 9000);
    // The coherent census form (the member-by-member derivation).
    expect(collapsed(note)).toContain("19 of the 25 exported handlers exercised by the specs' own calls");
    expect(collapsed(note)).toContain("health exercised and readiness-asserted ONLY by the Playwright webServer probe");
    expect(collapsed(note)).toContain("playwright.config.ts:97");
    expect(collapsed(note)).toContain("the 20-figure under the PROBE-INCLUSIVE convention");
    // The arithmetic closure (the F153 member — the member-slots sum to
    // the named total under ONE stated convention).
    expect(collapsed(note)).toContain("19 + 1 + 5 = 25");
    expect(collapsed(note)).toContain("19 + 5 = 24 by the specs' own calls");
    // The five zero-e2e handlers named.
    expect(collapsed(note)).toContain("POST projects/[id]/duplicate");
    expect(collapsed(note)).toContain("PATCH teams/[id]");
    // The frozen-record doctrine (the s165-B entry retained as history).
    expect(collapsed(note)).toContain("stay frozen per S132-C with THIS note the standing correction");
    // The F153 doctrine named.
    expect(collapsed(note)).toContain("the facts PLUS the counting convention that closes the arithmetic");
  });

  it("SURVIVAL (worklog): the two s166 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/0L/0I (with the 142 TRUE / 0 FALSE second-consecutive zero-false comment-truth census) and auditor B's 0C/0H/0M/0L/1I (with the B166-I-1 finding and the corrected census)", () => {
    const entryA = auditEntry("Task ID: digma-s166-audit-A");
    expect(entryA).not.toBe("");
    expect(collapsed(entryA)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational",
    );
    expect(collapsed(entryA)).toContain("142 TRUE / 0 FALSE");
    const entryB = auditEntry("Task ID: digma-s166-audit-B");
    expect(entryB).not.toBe("");
    expect(collapsed(entryB)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 1 Informational",
    );
    expect(collapsed(entryB)).toContain("B166-I-1");
    expect(collapsed(entryB)).toContain("39th cycle");
  });

  it("SURVIVAL (plans): the plan-history zero-finding claim derived LIVE — exactly FIVE carriers of the combined 0I census form across the remediation plans (s143/s152/s153/s156/s165 frozen), s166 NOT among them (the honest one-Informational form — this plan never carries the combined 0I string) + the pin-family arithmetic (the S128..S166 total rides the spec's own census: 505 + 14 = 519)", () => {
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
    // The pin-family arithmetic (the S128..S166 total rides the spec's
    // own census: 505 + 14 = 519).
    expect(505 + 14).toBe(519);
  });
});

// ---------------------------------------------------------------------------
// S166-B — the id-stable PUT deferral-premises registration (the 39th cycle)
// ---------------------------------------------------------------------------

describe("S166-B the id-stable PUT deferral-premises registration (a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred)", () => {
  it("DEFECT (worklog): the bracketed s166-id-stable-premises-note registers the premises — the four premises at their seams, the THIRTY-NINTH ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const noteAt = worklogSource.indexOf("[s166-id-stable-premises-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 8000);
    // The ordinal and the four premises.
    expect(collapsed(note)).toContain("THIRTY-NINTH CONSECUTIVE CYCLE");
    expect(collapsed(note)).toContain("all four HOLDING");
    expect(collapsed(note)).toContain("value-based or honest-refusal");
    expect(collapsed(note)).toContain("index-stable remap");
    expect(collapsed(note)).toContain("replace-transaction seams");
    expect(collapsed(note)).toContain("value-based perimeter zero-uncensused");
    // The carried judgment (the one-Informational census form).
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
// S166-C — the per-session pin family: survival members + doc-side members
// ---------------------------------------------------------------------------

describe("S166-C the per-session pin family (the survival members + the doc-side members that stay RED until the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's SEVENTEENTH instance — the s165 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_375 directive; the fifteenth consecutive cycle of the forward form)", () => {
    // The s165 plan's execution record, read live: every box ticked.
    const ticked = s165PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s165PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
  });

  it("SURVIVAL (scripts): the s166 script provenance — live166/nav166/digma-seo-s166 tokens, the 142nd/143rd/103rd ordinals, the S165 delivery at 44914bec, zero s165 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live166");
    expect(refAuditSource).toContain("142nd reference audit");
    expect(refAuditSource).toContain("44914bec");
    expect(refAuditSource).toContain("byte-identical the 103rd");
    // The nav script: the 143rd session ordinal.
    expect(navSource).toContain("nav166");
    expect(navSource).toContain("143rd session");
    // The seo script: the session-166 token.
    expect(seoSource).toContain("digma-seo-s166");
    expect(seoSource).toContain("session 166");
    // Zero s165 run-ordinal residue across the three scripts.
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live165");
      expect(src).not.toContain("nav165");
      expect(src).not.toContain("seo-s165");
      expect(src).not.toContain("s175");
      expect(src).not.toContain("141st");
      expect(src).not.toContain("142nd session");
      expect(src).not.toContain("142nd consecutive");
      expect(src).not.toContain("byte-identical the 102nd");
      expect(src).not.toContain("008c14cf");
    }
  });

  it("SURVIVAL (behavioral — the client-layer contract): the keep-form family intact and the store arms at their standing contracts (zero source changes this cycle — the layer total STAYS at 14,295, the FOURTH consecutive STAYS cycle)", () => {
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
    // cycle (the fourth consecutive STAYS cycle).
    // RE-ANCHORED onto 14307 by the S167-A rider (teams-view +12 —
    // the F40 prior-spec re-anchor: the claim stays true, the pinned
    // figure moves with the live tree).
    expect(liveLayerTotal).toBe(14307);
  });

  it("DEFECT (docs): the AGENTS session-166 bullet carries the correction members — the ONE-INFORMATIONAL census, the B166-I-1 arithmetic-closure correction, the second zero-false comment-truth sampling, and the 39th deferral cycle", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 166, S166-A..S166-C");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 8000);
    // The correction members' key phrases (the bullet's own
    // spelling — the s156 F143 phrase-case lesson).
    expect(collapsed(bullet)).toContain("0C/0H/0M/0L/1I");
    expect(collapsed(bullet)).toContain("B166-I-1");
    expect(collapsed(bullet)).toContain("19 + 1 + 5 = 25");
    expect(collapsed(bullet)).toContain("142 TRUE / 0 FALSE");
    expect(collapsed(bullet)).toContain("39th consecutive cycle");
  });

  it("DEFECT (docs): the count re-anchor — the v1.145.0 chain entry carries the S166 derivation (2315 = 2301 + 14 unit / 228 files) + the §7.1 row for the s166 spec, the layer-total family STAYING at 14,295 (the fourth consecutive STAYS cycle)", () => {
    expect(padSource).toMatch(/v1\.145\.0/);
    expect(padSource).toContain("2315 = 2301 + 14 unit / 228 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s166.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's thirteenth instance): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.145.0 block quotes — the count receipt riding the spec instead of prose, this cycle in its STAYS form (zero source changes this cycle)", () => {
    // The live derivation NEVER quotes a figure: the runtime IIFE at
    // the spec's head (wc -l over the exact 22-file composition —
    // 8 editor + 8 components + 2 hooks + the 3 named lib members +
    // globals.css, the composition pinned by tests/lows-s142.test.ts).
    // RE-ANCHORED onto 14307 by the S167-A rider (teams-view +12 —
    // the F40 prior-spec re-anchor: the claim stays true, the pinned
    // figure moves with the live tree).
    expect(liveLayerTotal).toBe(14307);
    // The PAD's v1.145.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("DEFECT (docs): the F153 lesson registered in the digma_SKILL — the arithmetic-closure member inserted after F152, the version bumped to v1.144.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.158\.0/);
    // The lesson: the members after F152.
    const f152At = skillSource.indexOf("F152");
    const f153At = skillSource.indexOf("F153");
    expect(f152At).toBeGreaterThan(-1);
    expect(f153At).toBeGreaterThan(f152At);
    const f153Body = skillSource.slice(f153At, f153At + 4000);
    // The arithmetic-closure member (a census claim is its facts PLUS
    // the counting convention that closes the arithmetic).
    expect(collapsed(f153Body)).toContain("ARITHMETIC-CLOSURE");
    expect(collapsed(f153Body)).toContain("counting convention");
  });

  it("DEFECT (docs): the pair-unity claim forms riding the constants at every doc — every live claim site the same members (the rolling-safe form: this spec's constants equal the prior specs' constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s165Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s165.test.ts"),
      "utf8",
    );
    // The s165 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s165Unit = s165Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s165Files = s165Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s165Unit).toBe(UNIT);
    expect(s165Files).toBe(FILES);
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
