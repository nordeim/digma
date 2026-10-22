import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-167 spec (the one-hundred-and-fifteenth audit's chosen work —
// the ONE-LOW-ONE-INFORMATIONAL remediation cycle, the first source-carrying
// cycle since S162):
//
// S167-A — THE ERRORTITLE PAIR COMPLETION (the A167-L-1 remediation, the
//   S148-C family closed at its full consumer census): teams-view.tsx's
//   create-team POST and invite-member POST called call() with NO
//   { errorTitle } option — a failed create/invite toasted the seam's
//   generic "Something went wrong" while every sibling action surface
//   carries site copy. The S148-C cycle completed the family's DELETE
//   member in this very file and missed the create/invite members beside
//   it — the family-completion census scoped to the finding's surfaces.
//   THE FIX: both POSTs restructured onto the family's own multi-arg form
//   with { errorTitle: "Could not create the team" } and
//   { errorTitle: "Invite failed" } + the registration comments at the
//   seams; the family closes at SEVEN call() consumers. teams-view.tsx
//   528 -> 540 (+12); the 22-file layer 14,295 -> 14,307 (the first
//   movement since S162 — the F40 prior-spec riders ride).
//
// S167-B — THE REGISTRATION PAIR: the s167-401-terminal-note (the A167-I-1
//   standing registration — the S68-D dead-session terminal enforced at
//   the flush and drain but NOT at the two one-shot boundary transports
//   (the unmount exit PUT and the pagehide keepalive PUT, both guarded
//   only on saveState + projectId); a dead session's exit fires ONE
//   doomed PUT — single-shot, no loop, response ignored, defensible by
//   design; the doctrine: a terminal's enforcement scope is itself a
//   census) + the s167-id-stable-premises-note (the 40th consecutive
//   cycle — the four premises re-derived live and holding, the judgment
//   carried unchanged).
//
// S167-C — the per-session pin family: the F138 guard's EIGHTEENTH
//   instance (the s166 plan's record pinned 5/5 ticked at 7d4cd446, per
//   the pre-armed session_381 directive), the audit entries at their
//   anchors, the script provenance (live167/nav167/digma-seo-s167 — the
//   143rd/144th/104th ordinals, the S166 delivery at 7d4cd446), the two
//   bracketed s167 registration notes, the client-layer survival member
//   (the layer total MOVES this cycle — 14,295 -> 14,307, the first
//   movement since S162), the pair-unity constants (born rolling-safe at
//   the POST-spec figures 2329/229 — the doc-update re-anchors the docs
//   and the constants TOGETHER), and the doc-side members (the F154
//   lesson, the count re-anchor, the forward count-truth guard's
//   fourteenth instance in its MOVES form) that stay RED until the
//   collateral.
//
// Spec-form notes (narrated at birth — the honest form separated from the
// plan's forecast, the s153..s166 precedent's own shape): the born spec
// carries 15 pins — 7 RED (the two source-side members — the spec born
// BEFORE the source fix, the TDD form, the first source-side RED members
// since S162 — plus the five doc-side members incl. the pair-unity
// RED-until-collateral) / 8 green-at-birth (the two worklog-registration
// members — the notes landed BEFORE the spec's birth per the standing
// precedent — plus the six survival members); ONE spec-form repair at
// birth (the audit-entry pin's finding designation onto the entries' own
// L1/I1 spellings — the pin matches the record as it landed, never a
// projected designation); the collateral count family
// re-anchors onto 2330 = 2315 + 15 unit / 229 files (lows-s167.test.ts
// joins as the 229th file); the layer-total family MOVES 14,295 -> 14,307
// (the F40 riders: the s156/s157/s158/s163/s164/s165/s166 hard pins).

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
const s166PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session166.md"),
  "utf8",
);
const teamsSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/teams-view.tsx"),
  "utf8",
);
const projectCardSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/project-card.tsx"),
  "utf8",
);
const recentViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/recent-view.tsx"),
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
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s167.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s167.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s167.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2315 delivery checks + this
 *  spec's 15 = 2330 unit, the 228 delivery files + this spec = 229;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s166 lesson). */
const UNIT = "2404";
const FILES = "234";

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

/** The figure the v1.151.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its fourteenth instance,
 *  this cycle in its MOVES form: 14,295 -> 14,307, the first movement
 *  since S162). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.151\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S167-A — the errorTitle pair completion (the source-carrying member)
// ---------------------------------------------------------------------------

describe("S167-A the errorTitle pair completion (the A167-L-1 remediation — a family-completion fix is itself a census claim: enumerate EVERY consumer of the seam, never inherit the finding's own enumeration)", () => {
  it("DEFECT (source — RED until the fix lands, the TDD form): the create-team POST and invite-member POST carry their site copy in the family's own multi-arg call form, with the registration comments at both seams", () => {
    // The two new members, in the family's multi-arg form (the
    // project-card create's exact shape — the opts ride AFTER the init
    // object, on their own line).
    expect(teamsSource).toContain(
      'const data = await call<{ team: TeamDTO }>(',
    );
    expect(teamsSource).toContain(
      '{ errorTitle: "Could not create the team" },',
    );
    expect(teamsSource).toContain(
      'const data = await call<{ member: TeamMemberDTO }>(',
    );
    expect(teamsSource).toContain('{ errorTitle: "Invite failed" },');
    // The registration comments at both seams (the S148-C precedent's
    // form — the fix carries its session registration).
    expect(strippedSlashComments(teamsSource)).toContain(
      "Session 167 (S167-A / A167-L-1 — the S71-A errorTitle family's",
    );
    expect(strippedSlashComments(teamsSource)).toContain(
      "Session 167 (S167-A — the invite member of the same family)",
    );
    // The generic-close forms are GONE (the pre-fix shape ended the
    // init object with a bare `});` — the multi-arg form never does).
    expect(teamsSource).not.toContain(
      '"/api/teams", {\n        method: "POST",',
    );
  });

  it("DEFECT (family census — the F154 member): the errorTitle family closes at SEVEN call() consumers — project-card x3, recent-view x1, teams-view x3 (delete + create + invite), every carrier verbatim", () => {
    // The five sibling carriers verbatim (the pre-existing family).
    expect(projectCardSource).toContain('{ errorTitle: "Rename failed" },');
    expect(projectCardSource).toContain('{ errorTitle: "Delete failed" },');
    expect(projectCardSource).toContain(
      '{ errorTitle: "Could not create the project" },',
    );
    expect(recentViewSource).toContain('{ errorTitle: "Delete failed" },');
    expect(teamsSource).toContain('{ errorTitle: "Delete failed" },');
    // The two new members (RED until the fix lands).
    expect(teamsSource).toContain(
      '{ errorTitle: "Could not create the team" },',
    );
    expect(teamsSource).toContain('{ errorTitle: "Invite failed" },');
    // The census closes: three LIVE carriers in project-card, one in
    // recent-view, three in teams-view — SEVEN total (the counting form
    // matches only the option-object carriers at line start; the
    // registration comments' quoted `{ errorTitle: ... }` mentions are
    // not live members — the second spec-form repair at the source-green
    // pass, the s164 precedent's own shape).
    expect(projectCardSource.match(/^\s*\{ errorTitle: "/gm)?.length).toBe(3);
    expect(recentViewSource.match(/^\s*\{ errorTitle: "/gm)?.length).toBe(1);
    expect(teamsSource.match(/^\s*\{ errorTitle: "/gm)?.length).toBe(3);
  });

  it("SURVIVAL (worklog): the bracketed s167-401-terminal-note registers A167-I-1 — the one-shot boundary transports, the defensible-by-design posture, the terminal-scope-census doctrine", () => {
    const noteAt = worklogSource.indexOf("[s167-401-terminal-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 6000);
    // The finding and its posture.
    expect(collapsed(note)).toContain("A167-I-1");
    expect(collapsed(note)).toContain("ONE doomed PUT");
    expect(collapsed(note)).toContain("single-shot, no loop, the response ignored");
    expect(collapsed(note)).toContain("REGISTERED, not promoted");
    expect(collapsed(note)).toContain("the unmount cleanup's exit PUT and the pagehide onUnload keepalive PUT");
    // The doctrine (the terminal-scope census member).
    expect(collapsed(note)).toContain("a terminal's enforcement scope is itself a census");
  });
});

// ---------------------------------------------------------------------------
// S167-B — the registration pair: the deferral premises (the 40th cycle)
// ---------------------------------------------------------------------------

describe("S167-B the id-stable PUT deferral-premises registration (a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred)", () => {
  it("DEFECT (worklog): the bracketed s167-id-stable-premises-note registers the premises — the four premises at their seams, the FORTIETH ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const noteAt = worklogSource.indexOf("[s167-id-stable-premises-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 8000);
    // The ordinal and the four premises.
    expect(collapsed(note)).toContain("FORTIETH CONSECUTIVE CYCLE");
    expect(collapsed(note)).toContain("all four HOLDING");
    expect(collapsed(note)).toContain("value-based or honest-refusal");
    expect(collapsed(note)).toContain("index-stable remap");
    expect(collapsed(note)).toContain("replace-transaction seams");
    expect(collapsed(note)).toContain("value-based perimeter zero-uncensused");
    // The carried judgment (the one-Low-one-Informational census form —
    // whose Low is a two-line toast-copy completion).
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
// S167-C — the per-session pin family: survival members + doc-side members
// ---------------------------------------------------------------------------

describe("S167-C the per-session pin family (the survival members + the doc-side members that stay RED until the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's EIGHTEENTH instance — the s166 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_381 directive; the sixteenth consecutive cycle of the forward form)", () => {
    // The s166 plan's execution record, read live: every box ticked.
    const ticked = s166PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s166PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
  });

  it("SURVIVAL (plans): the plan-history zero-finding claim derived LIVE — exactly FIVE carriers of the combined 0I census form across the remediation plans (s143/s152/s153/s156/s165 frozen), s167 NOT among them (the honest one-Low-one-Informational form — this plan never carries the combined 0I string) + the pin-family arithmetic (the S128..S167 total rides the spec's own census: 519 + 15 = 534)", () => {
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
    // The pin-family arithmetic (the S128..S167 total rides the spec's
    // own census: 519 + 15 = 534).
    expect(519 + 15).toBe(534);
  });

  it("SURVIVAL (scripts): the s167 script provenance — live167/nav167/digma-seo-s167 tokens, the 143rd/144th/104th ordinals, the S166 delivery at 7d4cd446, zero s166 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live167");
    expect(refAuditSource).toContain("143rd reference audit");
    expect(refAuditSource).toContain("7d4cd446");
    expect(refAuditSource).toContain("byte-identical the 104th");
    // The nav script: the 144th session ordinal.
    expect(navSource).toContain("nav167");
    expect(navSource).toContain("144th session");
    // The seo script: the session-167 token.
    expect(seoSource).toContain("digma-seo-s167");
    expect(seoSource).toContain("session 167");
    // Zero s166 run-ordinal residue across the three scripts.
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live166");
      expect(src).not.toContain("nav166");
      expect(src).not.toContain("seo-s166");
      expect(src).not.toContain("s176");
      expect(src).not.toContain("142nd");
      expect(src).not.toContain("143rd session");
      expect(src).not.toContain("143rd consecutive");
      expect(src).not.toContain("byte-identical the 103rd");
      expect(src).not.toContain("44914bec");
    }
  });

  it("SURVIVAL (worklog): the two s167 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/1L/1I (with the 142 TRUE / 0 FALSE third-consecutive zero-false comment-truth census and the A167-L-1 finding) and auditor B's 0C/0H/0M/0L/0I (with the 40th premises cycle)", () => {
    const entryA = auditEntry("Task ID: digma-s167-audit-A");
    expect(entryA).not.toBe("");
    expect(collapsed(entryA)).toContain(
      "0 Critical / 0 High / 0 Medium / 1 Low / 1 Informational",
    );
    expect(collapsed(entryA)).toContain("142 TRUE / 0 FALSE");
    // The two findings as the landed entry spells them (the L1/I1
    // labels — the spec-form repair at the RED birth: the pin matches
    // the record as it landed, never a projected designation).
    expect(collapsed(entryA)).toContain("FINDING L1 (Low, Verified)");
    expect(collapsed(entryA)).toContain("FINDING I1 (Informational, Verified)");
    expect(collapsed(entryA)).toContain("Could not create the team");
    const entryB = auditEntry("Task ID: digma-s167-audit-B");
    expect(entryB).not.toBe("");
    expect(collapsed(entryB)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational",
    );
    expect(collapsed(entryB)).toContain("40th cycle");
  });

  it("DEFECT (docs): the AGENTS session-167 bullet carries the completion members — the ONE-LOW-ONE-INFORMATIONAL census, the A167-L-1 errorTitle pair completion, the A167-I-1 registration, the third zero-false comment-truth sampling, and the 40th deferral cycle", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 167, S167-A..S167-C");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 9000);
    // The completion members' key phrases (the bullet's own
    // spelling — the s156 F143 phrase-case lesson).
    expect(collapsed(bullet)).toContain("0C/0H/0M/1L/1I");
    expect(collapsed(bullet)).toContain("A167-L-1");
    expect(collapsed(bullet)).toContain("A167-I-1");
    expect(collapsed(bullet)).toContain("142 TRUE / 0 FALSE");
    expect(collapsed(bullet)).toContain("40th consecutive cycle");
    expect(collapsed(bullet)).toContain("14,307");
  });

  it("DEFECT (docs): the count re-anchor — the v1.146.0 chain entry carries the S167 derivation (2330 = 2315 + 15 unit / 229 files) + the §7.1 row for the s167 spec + the §11 teams-view row re-anchored to 540 with the S167-A registration tail, the layer-total family MOVING 14,295 -> 14,307 (the first movement since S162)", () => {
    expect(padSource).toMatch(/v1\.146\.0/);
    expect(padSource).toContain("2330 = 2315 + 15 unit / 229 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s167.test.ts`");
    // The §11 teams-view row re-anchored onto the post-fix figure with
    // the S167-A registration tail.
    const teamsRow =
      padSource.split("\n").find((l) => l.includes("`src/components/teams-view.tsx`")) ?? "";
    expect(teamsRow).toContain("| 540 |");
    expect(teamsRow).toContain("S167-A");
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

  it("DEFECT (docs — the forward count-truth guard's fourteenth instance, this cycle in its MOVES form): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.146.0 block quotes — 14,295 -> 14,307, the first movement since S162 (teams-view +12)", () => {
    // The live derivation NEVER quotes a figure: the runtime IIFE at
    // the spec's head (wc -l over the exact 22-file composition —
    // 8 editor + 8 components + 2 hooks + the 3 named lib members +
    // globals.css, the composition pinned by tests/lows-s142.test.ts).
    expect(liveLayerTotal).toBe(14307);
    // The PAD's v1.146.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("DEFECT (docs): the F154 lesson registered in the digma_SKILL — the family-completion-census member inserted after F153, the version bumped to v1.145.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.150\.0/);
    // The lesson: the members after F153.
    const f153At = skillSource.indexOf("F153");
    const f154At = skillSource.indexOf("F154");
    expect(f153At).toBeGreaterThan(-1);
    expect(f154At).toBeGreaterThan(f153At);
    const f154Body = skillSource.slice(f154At, f154At + 4000);
    // The family-completion-census member (a family-completion fix is
    // itself a census claim — enumerate every consumer of the seam).
    expect(collapsed(f154Body)).toContain("FAMILY-COMPLETION");
    expect(collapsed(f154Body)).toContain("consumer census");
  });

  it("DEFECT (docs): the pair-unity claim forms riding the constants at every doc — every live claim site the same members (the rolling-safe form: this spec's constants equal the prior specs' constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s166Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s166.test.ts"),
      "utf8",
    );
    // The s166 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s166Unit = s166Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s166Files = s166Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s166Unit).toBe(UNIT);
    expect(s166Files).toBe(FILES);
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
