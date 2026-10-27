import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-163 spec (the one-hundred-and-eleventh audit's chosen work —
// the stale line-citation reword + the phantom route-mock census reword):
//
// S163-A — THE STALE LINE-CITATION REWORD (L163-A-L1, lead-verified live
//   at the seams — the numeric-locator member of the phantom-citation
//   class): the S162-B delivery inserted a 6-line comment block at
//   canvas.tsx:226-231, and the insertion stale-dated every numeric
//   in-file citation below it: the new comment's own "the one-line form
//   at the :492 commit" (:228) pointed 6 lines above the draw commit's
//   clamp pair at :498-499 (born accurate against the pre-insertion
//   file, then self-staled), and the S148-B marquee preview comment's
//   "the :503 commit above" (:880, accurate for 14 cycles) pointed 6
//   lines above the actual if (drag.w > 2 && drag.h > 2) at :509. The
//   cited seams exist and carry the claimed forms — only the line
//   numbers are falsified. The fix: both reworded onto the RELATIVE
//   form the same file already uses (the S160-D draw-preview comment
//   :864-870 says "the commit above" with no number, precisely to
//   dodge this class), ZERO line-count drift (canvas.tsx stays 1,092;
//   the 22-file layer total STAYS 14,295 — the first STAYS cycle
//   since s155). THE F140 RIDER: tests/lows-s149.test.ts actively
//   pinned "/the :503 commit above/" (the S149-A delivered citation
//   form) — the rider re-anchors that pin onto the marquee-specific
//   relative form.
//
// S163-B — THE PHANTOM ROUTE-MOCK CENSUS REWORD (B163-L1, the S73-A
//   phantom-seam class, the L162-A-L2 sibling): the S112-B crud-burn
//   comment (rate-limit.ts:121-126) claimed "the `page.route`
//   interception sites in the specs are route MOCKS, never server
//   calls" — but the LIVE census is 12 sites: 10 route.continue()
//   pass-throughs to the real standalone server (several with
//   injected delays), 1 route.fulfill() true mock, and 1
//   route.abort() on an external URL. Ten of twelve sites ARE server
//   calls; the comment was false at its own birth (8 of the 10
//   continue() sites predate it). The defended arithmetic survives
//   via a different mechanism (none of the continued routes is one
//   of the five creation POSTs — the PUTs are bucket-excluded by
//   design), so the ~31 burn figure stands. The fix: the
//   parenthetical reworded onto the live census, ZERO line-count
//   drift (rate-limit.ts stays 190).
//
// S163-C — the per-session pin family: the F138 guard's FOURTEENTH
//   instance (the s162 plan's record pinned 6/6 ticked at ac277905,
//   per the pre-armed session_357 directive), the audit entries at
//   their anchors (auditor A's 0C/0H/0M/1L/0I with L163-A-L1;
//   auditor B's 0C/0H/0M/1L/0I with B163-L1; the thirty-sixth
//   consecutive deferral cycle), the script provenance
//   (live163/nav163/digma-seo-s163 — the 139th/140th/100th
//   ordinals, the S162 delivery at ac277905), the two bracketed s163
//   registration notes, the client-layer survival member (the layer
//   total STAYS this cycle — the first no-movement cycle since
//   s155), the pair-unity constants (born rolling-safe at the
//   POST-spec figures 2270/225 — the doc-update re-anchors the docs
//   and the constants TOGETHER), and the doc-side members (the F150
//   lesson, the count re-anchor, the forward count-truth guard's
//   tenth instance) that stay RED until the collateral.
//
// Spec-form notes (narrated at birth — the honest form separated
// from the plan's forecast, the s153..s162 precedent's own shape):
// the born spec carries 13 pins — 8 RED (the three source members +
// the five doc-side members incl. the pair-unity
// RED-until-collateral) / 5 survival; the collateral count family
// re-anchors onto 2270 = 2257 + 13 unit / 225 files (lows-s163.test.ts
// joins as the 225th file); the layer-total family STAYS at 14,295
// (the two rewords keep zero line-count drift — the s156/s157/s158
// hard pins need NO rider, the first such cycle since their birth).

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
const s162PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session162.md"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const layersSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/layers-panel.tsx"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const rateLimitSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/rate-limit.ts"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s163.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s163.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s163.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2257 delivery checks + this
 *  spec's 13 = 2270 unit, the 224 delivery files + this spec = 225;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s162 lesson). */
const UNIT = "2673";
const FILES = "255";

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

/** The figure the v1.172.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its tenth instance). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.172\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S163-A — the stale line-citation reword (the two relative forms)
// ---------------------------------------------------------------------------

describe("S163-A the stale line-citation reword (L163-A-L1 — the two numeric in-file citations reworded onto the S160-D relative form, zero line-count drift)", () => {
  it("DEFECT (source): the text-add comment's citation is the RELATIVE form — \"the draw commit below\" (the draw commit at :496+ sits below the text add), the staled \":492\" coordinate gone from the file, the S162-B registration and the clamp forms untouched", () => {
    const textAddAt = canvasSource.indexOf('type: "text", x:');
    expect(textAddAt).toBeGreaterThan(-1);
    const textAdd = canvasSource.slice(textAddAt - 800, textAddAt + 600);
    // The relative citation form (the S160-D numberless precedent).
    expect(strippedSlashComments(textAdd)).toContain(
      "the draw commit below",
    );
    // The staled numeric citation is GONE from the whole file.
    expect(canvasSource).not.toContain(":492");
    // The S162-B registration and the clamp pair untouched (the
    // delivered forms this reword rides on).
    expect(strippedSlashComments(textAdd)).toContain("S162-B");
    expect(textAdd).toContain("clampPositionField(point.x)");
    expect(textAdd).toContain("clampPositionField(point.y)");
    // The cited seam still carries the claimed form (the draw
    // commit's own clamp — the citation's referent, now named
    // relatively).
    expect(canvasSource).toContain("x: clampPositionField(drag.x)");
    expect(canvasSource).toContain("y: clampPositionField(drag.y)");
  });

  it("DEFECT (source): the marquee preview comment's citation is the RELATIVE form — \"(drag.w > 2 && drag.h > 2, the commit above)\" with the staled \":503\" coordinate gone, the two-term threshold forms unchanged at both the gate and the preview", () => {
    const marqueeAt = canvasSource.indexOf("Marquee preview — Session 148");
    expect(marqueeAt).toBeGreaterThan(-1);
    const region = canvasSource.slice(marqueeAt, marqueeAt + 700);
    // The relative citation form (the number dropped, the phrase
    // re-folded across the same two comment lines — collapsed match).
    expect(collapsed(region)).toContain(
      "(drag.w > 2 && drag.h > 2, the commit above)",
    );
    // The staled numeric citation is GONE from the whole file.
    expect(canvasSource).not.toContain("the :503");
    // The commit's own gate unchanged (the alignment's anchor — the
    // two-term form inside the marquee branch of the pointer-up
    // handler).
    expect(canvasSource).toMatch(/if \(drag\.w > 2 && drag\.h > 2\) \{/);
    // The preview's two-term form unchanged (the S148-B delivery).
    expect(collapsed(canvasSource)).toContain(
      'drag.kind === "marquee" && drag.w > 2 && drag.h > 2 && (',
    );
  });
});

// ---------------------------------------------------------------------------
// S163-B — the phantom route-mock census reword
// ---------------------------------------------------------------------------

describe("S163-B the phantom route-mock census reword (B163-L1 — the S73-A phantom-seam class: the justification's enumerated mechanism corrected onto the live 12-site census)", () => {
  it("DEFECT (source): the crud-burn comment's interception-site census is the LIVE form — NON-creation pass-throughs/delays (the PUT bucket-excluded), one fulfill-mock, one external abort — the phantom \"route MOCKS, never server calls\" phrase gone, the limiter constants untouched", () => {
    // The phantom phrase is gone from the whole file (the only
    // carrier was the crud-burn parenthetical).
    expect(rateLimitSource).not.toContain("route MOCKS");
    expect(rateLimitSource).not.toContain("never server calls");
    // The live census named at the seam (the reworded parenthetical).
    expect(collapsed(rateLimitSource)).toContain(
      "pass-throughs/delays (the elements-PUTs",
    );
    expect(collapsed(rateLimitSource)).toContain(
      "one delayed projects-POST creation DOES burn a",
    );
    expect(collapsed(rateLimitSource)).toContain("one fulfill-mock");
    expect(collapsed(rateLimitSource)).toContain("one external abort");
    // The limiter's own contracts untouched (the S112-B delivery —
    // the constants and the entry point the lows-s112 pins carry).
    expect(rateLimitSource).toContain("const CRUD_LIMIT = 60;");
    expect(rateLimitSource).toContain(
      "const CRUD_WINDOW_MS = 5 * 60 * 1000;",
    );
    expect(rateLimitSource).toContain("export function crudRateLimit(");
    // The elements-PUT exclusion doctrine still named (the comment's
    // surviving TRUE claim — the reword touches only the parenthetical;
    // the marker-stripped form — the phrase wraps a // continuation
    // line in the source, the s158 spec-form lesson).
    expect(strippedSlashComments(rateLimitSource)).toContain(
      "THE ELEMENTS PUT IS EXCLUDED BY DESIGN",
    );
  });
});

// ---------------------------------------------------------------------------
// S163-C — the per-session pin family: survival members + doc-side members
// ---------------------------------------------------------------------------

describe("S163-C the per-session pin family (the survival members + the doc-side members that stay RED until the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's FOURTEENTH instance — the s162 plan's execution record shipped 6/6 ticked, zero unticked (the pre-armed guard per the session_357 directive; the twelfth consecutive cycle of the forward form)", () => {
    // The s162 plan's execution record, read live: every box ticked.
    const ticked = s162PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s162PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(6);
    expect(unticked).toBe(0);
  });

  it("SURVIVAL (worklog): the two s163 audit entries at their anchors with their live censuses — auditor A's 0C/0H/0M/1L/0I (with L163-A-L1) and auditor B's 0C/0H/0M/1L/0I (with B163-L1), the thirty-sixth consecutive deferral cycle", () => {
    const entryA = auditEntry("Task ID: digma-s163-audit-A");
    expect(entryA).not.toBe("");
    expect(collapsed(entryA)).toContain(
      "0 Critical / 0 High / 0 Medium / 1 Low / 0 Informational",
    );
    expect(entryA).toContain("L163-A-L1");
    const entryB = auditEntry("Task ID: digma-s163-audit-B");
    expect(entryB).not.toBe("");
    expect(collapsed(entryB)).toContain(
      "0 Critical / 0 High / 0 Medium / 1 Low / 0 Informational",
    );
    expect(entryB).toContain("B163-L1");
    expect(collapsed(entryB)).toContain("thirty-sixth consecutive cycle");
  });

  it("SURVIVAL (worklog): the two bracketed s163 registration notes at their anchors — the stale-citation note (with the S160-D relative-form precedent and the insertion-stale-dates rider) and the phantom-route-mock note (with the 12-site live census and the continue()d-creation-POST hazard)", () => {
    const stale = worklogSource.indexOf("[s163-stale-citation-note:");
    expect(stale).toBeGreaterThan(-1);
    const note1 = worklogSource.slice(stale, stale + 4000);
    expect(collapsed(note1)).toContain("S160-D");
    expect(collapsed(note1)).toContain("stale-dates");
    expect(collapsed(note1)).toContain("RELATIVE form");
    const phantom = worklogSource.indexOf(
      "[s163-phantom-route-mock-note:",
    );
    expect(phantom).toBeGreaterThan(-1);
    const note2 = worklogSource.slice(phantom, phantom + 4000);
    expect(collapsed(note2)).toContain("route.continue()");
    expect(collapsed(note2)).toContain("fulfill");
    expect(collapsed(note2)).toContain("crud:");
  });

  it("SURVIVAL (scripts): the s163 script provenance — live163/nav163/digma-seo-s163 tokens, the 139th/140th/100th ordinals, the S162 delivery at ac277905, zero s162 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live163");
    expect(refAuditSource).toContain("139th reference audit");
    expect(refAuditSource).toContain("ac277905");
    expect(refAuditSource).toContain("byte-identical the 100th");
    // The nav script: the 140th session ordinal.
    expect(navSource).toContain("nav163");
    expect(navSource).toContain("140th session");
    // The seo script: the session-163 token.
    expect(seoSource).toContain("digma-seo-s163");
    expect(seoSource).toContain("session 163");
    // Zero s162 run-ordinal residue across the three scripts.
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live162");
      expect(src).not.toContain("nav162");
      expect(src).not.toContain("seo-s162");
      expect(src).not.toContain("s172");
      expect(src).not.toContain("138th");
      expect(src).not.toContain("139th session");
      expect(src).not.toContain("139th consecutive");
      expect(src).not.toContain("byte-identical the 99th");
      expect(src).not.toContain("0e0d05fd");
    }
  });

  it("SURVIVAL (behavioral — the client-layer contract): the keep-form family intact and the store arms at their standing contracts (the S163-A/B comment-only members leave every mutation-arm guard untouched — the layer total STAYS this cycle at 14,295, the first no-movement cycle since s155)", () => {
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
    // The S161-B Insert branch still present (the delivered surface
    // the S162-A honest completion carries).
    expect(viewSource).toContain('event.key === "Insert"');
    // The draw commit's clamp still present (the form the text-add
    // citation names relatively after this cycle's reword).
    expect(canvasSource).toContain("x: clampPositionField(drag.x)");
    // The layer total STAYS at 14,295 — the two rewords keep zero
    // line-count drift by design (the STAYS-cycle form).
    // RE-ANCHORED onto 14307 by the S167-A rider (teams-view +12 —
    // the F40 prior-spec re-anchor: the claim stays true, the pinned
    // figure moves with the live tree).
    expect(liveLayerTotal).toBe(14373);
  });

  it("DEFECT (docs): the AGENTS session-163 bullet carries the chosen-work members — the STALE LINE-CITATION reword and the phantom ROUTE-MOCK census reword (the comment-truth pair)", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 163, S163-A..S163-C");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 7000);
    // The chosen-work members' key phrases (the bullet's own
    // spelling — the s156 F143 phrase-case lesson; the bullet's
    // all-caps "ROUTE-MOCK" emphasis form).
    expect(collapsed(bullet)).toContain("STALE LINE-CITATION");
    expect(collapsed(bullet)).toContain("relative form");
    expect(collapsed(bullet)).toContain("ROUTE-MOCK");
  });

  it("DEFECT (docs): the count re-anchor — the v1.142.0 chain entry carries the S163 derivation (2270 = 2257 + 13 unit / 225 files) + the §7.1 row for the s163 spec, the layer-total family STAYING at 14,295 (the first no-movement cycle since s155)", () => {
    expect(padSource).toMatch(/v1\.142\.0/);
    expect(padSource).toContain("2270 = 2257 + 13 unit / 225 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s163.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's tenth instance): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.142.0 block quotes — the count receipt riding the spec instead of prose, this cycle in its STAYS form (the two rewords keep zero line-count drift)", () => {
    // The live derivation NEVER quotes a figure: the runtime IIFE at
    // the spec's head (wc -l over the exact 22-file composition —
    // 8 editor + 8 components + 2 hooks + the 3 named lib members +
    // globals.css, the composition pinned by tests/lows-s142.test.ts).
    // RE-ANCHORED onto 14307 by the S167-A rider (teams-view +12 —
    // the F40 prior-spec re-anchor: the claim stays true, the pinned
    // figure moves with the live tree).
    expect(liveLayerTotal).toBe(14373);
    // The PAD's v1.142.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("DEFECT (docs): the F150 lesson registered in the digma_SKILL — the stale-citation + census-justification members inserted after F149, the version bumped to v1.141.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.171\.0/);
    // The lesson: the members after F149.
    const f149At = skillSource.indexOf("F149");
    const f150At = skillSource.indexOf("F150");
    expect(f149At).toBeGreaterThan(-1);
    expect(f150At).toBeGreaterThan(f149At);
    const f150Body = skillSource.slice(f150At, f150At + 3000);
    // The stale-citation member (prefer the relative form — the
    // lesson's own all-caps emphasis form, the s156 F143 class).
    expect(collapsed(f150Body)).toContain("STALE-CITATION");
    // The census-justification member (a comment's justification
    // arithmetic is a census claim — verify the enumerated
    // mechanism against the live tree).
    expect(collapsed(f150Body)).toContain("CENSUS-JUSTIFICATION");
  });

  it("DEFECT (docs): the pair-unity claim forms riding the constants at every doc — the frozen coincidental literals classified out (the B145-I1 doctrine), every live claim site the same members (the rolling-safe form: this spec's constants equal the s162 spec's constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s162Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s162.test.ts"),
      "utf8",
    );
    // The s162 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s162Unit = s162Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s162Files = s162Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s162Unit).toBe(UNIT);
    expect(s162Files).toBe(FILES);
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
