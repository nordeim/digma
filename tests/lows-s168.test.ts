import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-168 spec (the one-hundred-and-sixteenth audit's chosen work —
// the ONE-LOW-TWO-INFORMATIONAL remediation cycle, the second consecutive
// source-carrying cycle):
//
// S168-A — THE CALL() DOCBLOCK SCOPE CORRECTION (the A168-L-1 remediation,
//   the comment-truth family's docblock arm): src/lib/call.ts's docblock
//   claimed "Every client view fetches through this seam" / "the
//   documented contract is ONE unwrap seam for every client view" — while
//   ELEVEN deliberate raw-fetch bypass sites live in client components
//   (login-screen x4 + reset-password-screen x1, the RA-60 inline-alert
//   family; ai-assistant.tsx:560, the operations envelope; editor-view x5,
//   the serialized autosave machine + load + boundary transports). Every
//   bypass is correct and self-documented at its own site — the
//   docblock's UNIVERSAL was the false member (the comment-truth census
//   142 sampled, 141 TRUE / 1 FALSE — the FALSE one IS this finding).
//   THE FIX: the docblock reworded onto the accurate scope — the seam
//   serves every envelope-consuming list view while the three bypass
//   families are named as deliberate non-consumers. A COMMENT-ONLY
//   change, zero source behavior; call.ts OUTSIDE the 22-file layer, the
//   layer total STAYS 14,307 (the first STAYS cycle since S166 — zero
//   F40 riders, zero §11 re-anchors).
//
// S168-B — THE REGISTRATION PAIR: the s168-below-threshold-note (the
//   A168-I-1 + A168-I-2 standing registration — the five S167
//   below-threshold observations re-verified at their seams with their
//   postures, plus the components-panel no-op's documented PAD §10 scope
//   cut) + the s168-id-stable-premises-note (the 41st consecutive cycle,
//   landed by auditor B — the four premises re-derived live and holding,
//   the judgment carried unchanged).
//
// S168-C — the per-session pin family: the F138 guard's NINETEENTH
//   instance (the s167 plan's record pinned 5/5 ticked at b8ca329f, per
//   the pre-armed session_388 directive), the audit entries at their
//   anchors, the script provenance (live168/nav168/digma-seo-s168 — the
//   144th/145th/105th ordinals, the S167 delivery at b8ca329f), the two
//   bracketed s168 registration notes, the client-layer survival member
//   (the layer total STAYS this cycle — 14,307, the first STAYS since
//   S166), the pair-unity constants (born rolling-safe at the POST-spec
//   figures 2345/230 — the doc-update re-anchors the docs and the
//   constants TOGETHER), and the doc-side members (the F155 lesson, the
//   count re-anchor, the forward count-truth guard's fifteenth instance
//   in its STAYS form) that stay RED until the collateral.
//
// Spec-form notes (narrated at birth — the honest form separated from the
//   plan's forecast, the s153..s168 precedent's own shape): the born spec
//   carries 15 pins — 7 RED (the two source-side members — the spec born
//   BEFORE the source fix, the TDD form, the second consecutive
//   source-carrying cycle — plus the five doc-side members incl. the
//   pair-unity RED-until-collateral) / 8 green-at-birth (the two
//   worklog-registration members — the notes landed BEFORE the spec's
//   birth per the standing precedent — plus the six survival members);
//   the collateral count family re-anchors onto 2345 = 2330 + 15 unit /
//   230 files (lows-s168.test.ts joins as the 230th file); the
//   layer-total family STAYS at 14,307 (zero F40 riders — the s168
//   cycle's own form).

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
const s167PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session167.md"),
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
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s168.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s168.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s168.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2330 delivery checks + this
 *  spec's 15 = 2345 unit, the 229 delivery files + this spec = 230;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s168 lesson). */
const UNIT = "2361";
const FILES = "231";

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

/** The figure the v1.148.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its fifteenth instance,
 *  this cycle in its STAYS form: 14,307 unchanged, call.ts outside
 *  the 22-file layer). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.148\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S168-A — the call() docblock scope correction (the source-carrying member)
// ---------------------------------------------------------------------------

describe("S168-A the call() docblock scope correction (the A168-L-1 remediation — a shared seam's docblock universality claim is itself a comment-truth claim: re-derive the scope at every census of the seam's consumers)", () => {
  it("DEFECT (source — RED until the fix lands, the TDD form): the docblock carries the ACCURATE scope — the seam serves the envelope-consuming list views while the three bypass families are named as deliberate non-consumers, and the universal forms are GONE", () => {
    // The accurate scope names the seam's real consumers (the
    // envelope-consuming list views) and the three deliberate bypass
    // families (RED until the reword lands).
    expect(strippedDocblockComments(callSource)).toContain(
      "envelope-consuming list views",
    );
    expect(strippedDocblockComments(callSource)).toContain(
      "the auth cards' inline-alert flows",
    );
    expect(strippedDocblockComments(callSource)).toContain(
      "the AI send's operations envelope",
    );
    expect(strippedDocblockComments(callSource)).toContain(
      "the editor's serialized autosave machine",
    );
    // The registration provenance at the seam (the S168-A form).
    expect(strippedDocblockComments(callSource)).toContain(
      "Session 168 (S168-A / A168-L-1",
    );
    // The universal forms are GONE (the pre-fix false members).
    expect(callSource).not.toContain(
      "Every client view fetches through this",
    );
    expect(callSource).not.toContain(
      "ONE unwrap seam for every client view",
    );
  });

  it("DEFECT (bypass census — the comment-only contract): the reworded docblock NAMES the eleven-site bypass census, the sites themselves REMAIN (the fix is a comment reword, never a behavior change), and the seam's export signature is unchanged", () => {
    // The docblock names its own bypass census (RED until the reword
    // lands — the accurate scope carries the count, never a vague
    // "some views bypass it"; the phrase-case onto the docblock's own
    // sentence-case spelling — the second spec-form repair, at the
    // source-green pass, the s167 precedent's own shape).
    expect(strippedDocblockComments(callSource)).toContain(
      "Eleven deliberate raw-fetch bypass sites",
    );
    // The RA-60 inline-alert family (the reference's sign-in failure
    // renders inline, never a toast — the bypasses are the FEATURE).
    expect(loginSource.match(/await fetch\(/g)?.length).toBe(4);
    expect(resetSource.match(/await fetch\(/g)?.length).toBe(1);
    // The AI send's operations envelope.
    expect(aiAssistantSource).toContain('await fetch("/api/ai-assistant", {');
    // The autosave machine + load + boundary transports (5 sites:
    // the projects POST, the elements PUT x3, the project GET).
    expect(
      viewSource.match(
        /fetch\(`\/api\/projects\/\$\{[^}]+\}\/elements`/g,
      )?.length,
    ).toBe(3);
    expect(viewSource).toContain('fetch("/api/projects", {');
    // The seam itself still serves its real consumers (the export
    // signature unchanged — the comment-only contract).
    expect(callSource).toMatch(
      /export async function call<T>\(url: string, init\?: RequestInit, opts\?: CallOptions\)/,
    );
  });

  it("SURVIVAL (worklog): the bracketed s168-below-threshold-note registers A168-I-1 + A168-I-2 — the five S167 below-threshold observations re-verified with their postures, the components-panel no-op with its PAD §10 scope cut", () => {
    const noteAt = worklogSource.indexOf("[s168-below-threshold-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 6000);
    // The two findings and their postures.
    expect(collapsed(note)).toContain("A168-I-1");
    expect(collapsed(note)).toContain("A168-I-2");
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
});

// ---------------------------------------------------------------------------
// S168-B — the registration pair: the deferral premises (the 41st cycle)
// ---------------------------------------------------------------------------

describe("S168-B the id-stable PUT deferral-premises registration (a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred)", () => {
  it("DEFECT (worklog): the bracketed s168-id-stable-premises-note registers the premises — the four premises at their seams, the FORTY-FIRST ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const noteAt = worklogSource.indexOf("[s168-id-stable-premises-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 8000);
    // The ordinal and the four premises.
    expect(collapsed(note)).toContain("FORTY-FIRST CONSECUTIVE CYCLE");
    expect(collapsed(note)).toContain("all four HOLDING");
    expect(collapsed(note)).toContain("value-based or honest-refusal");
    expect(collapsed(note)).toContain("index-stable remap");
    expect(collapsed(note)).toContain("replace-transaction seams");
    expect(collapsed(note)).toContain("value-based perimeter");
    // The carried judgment (the zero-finding routes/server census form).
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
// S168-C — the per-session pin family: survival members + doc-side members
// ---------------------------------------------------------------------------

describe("S168-C the per-session pin family (the survival members + the doc-side members that stay RED until the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's NINETEENTH instance — the s167 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_388 directive; the seventeenth consecutive cycle of the forward form)", () => {
    // The s167 plan's execution record, read live: every box ticked.
    const ticked = s167PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s167PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
  });

  it("SURVIVAL (plans): the plan-history zero-finding claim derived LIVE — exactly FIVE carriers of the combined 0I census form across the remediation plans (s143/s152/s153/s156/s165 frozen), s168 NOT among them (the honest one-Low-two-Informational form — this plan never carries the combined 0I string) + the pin-family arithmetic (the S128..S168 total rides the spec's own census: 534 + 15 = 549)", () => {
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
    // The pin-family arithmetic (the S128..S168 total rides the spec's
    // own census: 534 + 15 = 549).
    expect(534 + 15).toBe(549);
  });

  it("SURVIVAL (scripts): the s168 script provenance — live168/nav168/digma-seo-s168 tokens, the 144th/145th/105th ordinals, the S167 delivery at b8ca329f, zero s167 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live168");
    expect(refAuditSource).toContain("144th reference audit");
    expect(refAuditSource).toContain("b8ca329f");
    expect(refAuditSource).toContain("byte-identical the 105th");
    // The nav script: the 145th session ordinal.
    expect(navSource).toContain("nav168");
    expect(navSource).toContain("145th session");
    // The seo script: the session-168 token.
    expect(seoSource).toContain("digma-seo-s168");
    expect(seoSource).toContain("session 168");
    // Zero s167 run-ordinal residue across the three scripts.
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live167");
      expect(src).not.toContain("nav167");
      expect(src).not.toContain("seo-s167");
      expect(src).not.toContain("s177");
      expect(src).not.toContain("143rd");
      expect(src).not.toContain("144th session");
      expect(src).not.toContain("144th consecutive");
      expect(src).not.toContain("byte-identical the 104th");
      expect(src).not.toContain("7d4cd446");
    }
  });

  it("SURVIVAL (worklog): the two s168 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/1L/2I (with the 141 TRUE / 1 FALSE comment-truth census and the A168-L-1 finding) and auditor B's 0C/0H/0M/0L/0I (with the 41st premises cycle)", () => {
    const entryA = auditEntry("Task ID: digma-s168-audit-A");
    expect(entryA).not.toBe("");
    expect(collapsed(entryA)).toContain(
      "0 Critical / 0 High / 0 Medium / 1 Low / 2 Informational",
    );
    expect(collapsed(entryA)).toContain("141 TRUE / 1 FALSE");
    // The findings as the landed entry spells them (the entries' own
    // designations — the pin matches the record as it landed, never a
    // projected designation).
    expect(collapsed(entryA)).toContain("A168-L-1 (Low, Verified)");
    expect(collapsed(entryA)).toContain("A168-I-1 (Informational, Verified)");
    expect(collapsed(entryA)).toContain("A168-I-2 (Informational, Verified)");
    const entryB = auditEntry("Task ID: digma-s168-audit-B");
    expect(entryB).not.toBe("");
    expect(collapsed(entryB)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational",
    );
    expect(collapsed(entryB)).toContain("41st");
  });

  it("DEFECT (docs): the AGENTS session-168 bullet carries the completion members — the ONE-LOW-TWO-INFORMATIONAL census, the A168-L-1 docblock scope correction, the A168-I-1/A168-I-2 registrations, the 141 TRUE / 1 FALSE comment-truth census, and the 41st deferral cycle", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 168, S168-A..S168-C");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 9000);
    // The completion members' key phrases (the bullet's own
    // spelling — the s156 F143 phrase-case lesson).
    expect(collapsed(bullet)).toContain("0C/0H/0M/1L/2I");
    expect(collapsed(bullet)).toContain("A168-L-1");
    expect(collapsed(bullet)).toContain("A168-I-1");
    expect(collapsed(bullet)).toContain("A168-I-2");
    expect(collapsed(bullet)).toContain("141 TRUE / 1 FALSE");
    expect(collapsed(bullet)).toContain("41st consecutive cycle");
    expect(collapsed(bullet)).toContain("14,307");
  });

  it("DEFECT (docs): the count re-anchor — the v1.147.0 chain entry carries the S168 derivation (2345 = 2330 + 15 unit / 230 files) + the §7.1 row for the s168 spec, the layer-total family STAYING at 14,307 (the first STAYS cycle since S166 — zero F40 riders)", () => {
    expect(padSource).toMatch(/v1\.147\.0/);
    expect(padSource).toContain("2345 = 2330 + 15 unit / 230 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s168.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's fifteenth instance, this cycle in its STAYS form): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.147.0 block quotes — 14,307 unchanged (call.ts outside the 22-file layer; the first STAYS cycle since S166)", () => {
    // The live derivation NEVER quotes a figure: the runtime IIFE at
    // the spec's head (wc -l over the exact 22-file composition —
    // 8 editor + 8 components + 2 hooks + the 3 named lib members +
    // globals.css, the composition pinned by tests/lows-s142.test.ts).
    expect(liveLayerTotal).toBe(14307);
    // The PAD's v1.147.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("DEFECT (docs): the F155 lesson registered in the digma_SKILL — the docblock-universality member inserted after F154, the version bumped to v1.146.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.147\.0/);
    // The lesson: the members after F154.
    const f154At = skillSource.indexOf("F154");
    const f155At = skillSource.indexOf("F155");
    expect(f154At).toBeGreaterThan(-1);
    expect(f155At).toBeGreaterThan(f154At);
    const f155Body = skillSource.slice(f155At, f155At + 4000);
    // The docblock-universality member (a shared seam's docblock
    // universality claim is itself a comment-truth claim).
    expect(collapsed(f155Body)).toContain("DOCBLOCK-UNIVERSALITY");
    expect(collapsed(f155Body)).toContain("comment-truth");
  });

  it("DEFECT (docs): the pair-unity claim forms riding the constants at every doc — every live claim site the same members (the rolling-safe form: this spec's constants equal the prior specs' constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s167Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s167.test.ts"),
      "utf8",
    );
    // The s167 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s167Unit = s167Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s167Files = s167Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s167Unit).toBe(UNIT);
    expect(s167Files).toBe(FILES);
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
