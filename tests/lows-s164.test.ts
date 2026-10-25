import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-164 spec (the one-hundred-and-twelfth audit's chosen work —
// the cross-file-citation + census-scoping + honest-census comment-truth
// pass):
//
// S164-A — THE CROSS-FILE CITATION + TEST-NAME CITATION REWORD (A164-L-1
//   + A164-I-2, lead-verified live at the seams — the F150 family's
//   cross-file members): editor-view.tsx:978 cited "the canvas's own
//   pointer transform (canvas.tsx :141-142)" — a NUMERIC CROSS-FILE line
//   citation, accurate today but falsified by any insertion above
//   canvas.tsx:141, with neither file's maintainer seeing the break; and
//   app-header.tsx:257 cited "(workspace.spec.ts:94)" — accurate today
//   but the same fragile numeric form across files. The fix: name the
//   SEAM and the TEST — "canvas.tsx's toCanvas" / "the workspace.spec
//   bell-Escape test" — referents stable under insertion, ZERO
//   line-count drift (editor-view.tsx stays 2,453; app-header.tsx stays
//   304; the 22-file layer total STAYS 14,295 — the second consecutive
//   STAYS cycle).
//
// S164-B — THE CENSUS-SCOPING + ROUNDED-DISPLAY REWORD (A164-L-2 +
//   A164-I-3): properties-panel.tsx:2198 claimed "the seam's own census
//   stays ELEVEN" — but patchDiffers has THIRTEEN app-wide production
//   call sites (11 panel + editor-store :454 + ai-assistant.tsx :403);
//   the fix scopes the census ("the panel's own census stays ELEVEN" —
//   the A139-I1 form). And lib/editor.ts:613-615's cornerRadiusMax doc
//   arithmetic was false AS WRITTEN ("11.68298487339743 = 23.366/2" —
//   23.366/2 is 11.683; the displayed values are halves of the UNROUNDED
//   dimensions); the fix names the unrounded halves (the prose dims are
//   rounded displays), zero line-count drift (editor.ts stays 1,263).
//
// S164-C — THE NON-CREATION CENSUS REWORD (B164-L-1, the B163-L1 echo —
//   the phantom-census class recurring INSIDE ITS OWN FIX): the S163-B
//   delivered phrase at rate-limit.ts:124-126 claimed the page.route
//   pass-through/delay sites are "NON-creation" — but
//   editor-integrity.spec.ts:118 delays the project-CREATE POST by 400ms
//   and continues it to the real server (one of the five crud-bucket
//   creation routes, burning one bucket token per run; the s163 record
//   misread the site as a projects-GET interception — the URL glob looks
//   like the collection route, but the handler branches on POST). The
//   ~31 arithmetic survives numerically; the fix rewords the
//   parenthetical onto the accurate census (the elements-PUTs
//   bucket-excluded; one delayed projects-POST creation DOES burn a crud
//   token per run), rate-limit.ts 190 -> 191 (the ONLY line-count
//   movement; rate-limit.ts is NOT a member of the 22-file client layer).
//   THE F140 RIDER: tests/lows-s163.test.ts actively pinned
//   "NON-creation pass-throughs/delays" (the S163-B delivered form) —
//   the rider re-anchors that pin onto the delivered census form.
//
// S164-D — THE HISTORICAL-COORDINATE DROP + THE KEY-STABILITY POSTURE
//   (A164-I-1 + A164-I-4): editor-view.tsx:1995 carried "pre-fix Share
//   (L413) and Present (L493)" — session-48-era coordinates unverifiable
//   at the live tree (the buttons sit at ~2141/~2155 today); the numbers
//   dropped (the measurements stay frozen in the e2e spec header and the
//   s48 records). The A164-I-4 gradient-stop index-key posture REGISTERED
//   in the bracketed s164 note (bounded impact; a composite key would
//   collide on duplicate stops — worse than index keys).
//
// S164-E — the per-session pin family: the F138 guard's FIFTEENTH
//   instance (the s163 plan's record pinned 5/5 ticked at e004e57d, per
//   the pre-armed session_363 directive), the audit entries at their
//   anchors (auditor A's 0C/0H/0M/2L/4I; auditor B's 0C/0H/0M/1L/0I;
//   the thirty-seventh consecutive deferral cycle), the script
//   provenance (live164/nav164/digma-seo-s164 — the 140th/141st/101st
//   ordinals, the S163 delivery at e004e57d), the two bracketed s164
//   registration notes, the client-layer survival member (the layer
//   total STAYS this cycle — the second consecutive STAYS cycle), the
//   A164-I-4 posture-registration member (riding the S164-D block),
//   the pair-unity constants (born rolling-safe at the POST-spec
//   figures 2287/226 — the doc-update re-anchors the docs and the
//   constants TOGETHER), and the doc-side members (the F151 lesson,
//   the count re-anchor, the forward count-truth guard's eleventh
//   instance) that stay RED until the collateral.
//
// Spec-form notes (narrated at birth — the honest form separated
// from the plan's forecast, the s153..s163 precedent's own shape):
// the born spec carries 17 pins — 11 RED (the six source members +
// the five doc-side members incl. the pair-unity
// RED-until-collateral) / 6 survival (the posture-registration member
// rides the S164-D block); the collateral count family re-anchors
// onto 2287 = 2270 + 17 unit / 226 files (lows-s164.test.ts joins as
// the 226th file); the layer-total family STAYS at 14,295 (all five
// client-layer rewords keep zero line-count drift — the s156/s157/s158
// hard pins need NO rider, the second consecutive such cycle).

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
const s163PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session163.md"),
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
const headerSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/app-header.tsx"),
  "utf8",
);
const editorLibSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const rateLimitSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/rate-limit.ts"),
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
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s164.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s164.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s164.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2270 delivery checks + this
 *  spec's 17 = 2287 unit, the 225 delivery files + this spec = 226;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s163 lesson). */
const UNIT = "2625";
const FILES = "251";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** Collapse a TS source's comment body: strip the leading '// '
 *  markers from every line, then collapse whitespace — so a phrase
 *  spanning comment continuation lines matches as contiguous text
 *  (the s158 spec-form repair's standing form). */
const strippedSlashComments = (s: string) =>
  s.replace(/^[ \t]*\/\/[ \t]?/gm, "").replace(/\s+/g, " ");

/** Collapse a doc-comment body: strip the leading ' * ' markers from
 *  every line, then collapse whitespace (the /**-block cousin of
 *  strippedSlashComments — the s164 spec's own form for the
 *  cornerRadiusMax doc). */
const strippedStarComments = (s: string) =>
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

/** The figure the v1.168.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its eleventh instance). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.168\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S164-A — the cross-file citation + test-name citation reword
// ---------------------------------------------------------------------------

describe("S164-A the cross-file citation + test-name citation reword (A164-L-1 + A164-I-2 — the seam-named and test-named referents, zero line-count drift)", () => {
  it("DEFECT (source): the Insert center math's citation names the SEAM — \"canvas.tsx's toCanvas\" with the numeric \":141-142\" cross-file coordinate gone, the insert math's code forms untouched", () => {
    const insertAt = viewSource.indexOf('event.key === "Insert"');
    expect(insertAt).toBeGreaterThan(-1);
    const region = viewSource.slice(insertAt - 1200, insertAt + 1200);
    // The seam-named citation (the function-stable referent — immune
    // to insertions in either file; the F150 doctrine's cross-file
    // extension).
    expect(collapsed(region)).toContain(
      "the canvas's own pointer transform (canvas.tsx's toCanvas)",
    );
    // The numeric cross-file coordinate is GONE from the whole file.
    expect(viewSource).not.toContain(":141-142");
    // The insert math's own code forms untouched (the citation's
    // referent — the inverse transform the S161-F pins carry).
    expect(viewSource).toContain("(rect.width / 2 - store.panX) / store.zoom");
    expect(viewSource).toContain("(rect.height / 2 - store.panY) / store.zoom");
    // The cited seam still exists by name (the referent is real).
    expect(canvasSource).toContain("function toCanvas(");
  });

  it("DEFECT (source): the bell popover's citation names the TEST — \"the workspace.spec bell-Escape test\" with the numeric \"workspace.spec.ts:94\" coordinate gone, the popover's aria/code contracts untouched", () => {
    const bellAt = headerSource.indexOf('aria-label="Notifications"');
    expect(bellAt).toBeGreaterThan(-1);
    const region = headerSource.slice(bellAt - 1500, bellAt + 1200);
    // The test-named citation (the referent stable under spec-file
    // insertions).
    expect(collapsed(region)).toContain(
      "role/Escape contract (the workspace.spec bell-Escape test)",
    );
    // The numeric test-file coordinate is GONE from the whole file.
    expect(headerSource).not.toContain("workspace.spec.ts:94");
    // The popover's own contracts untouched (the open-nav pins'
    // forms).
    expect(region).toContain('aria-haspopup="dialog"');
    expect(headerSource.slice(bellAt)).toContain('role="dialog"');
  });
});

// ---------------------------------------------------------------------------
// S164-B — the census-scoping + rounded-display reword
// ---------------------------------------------------------------------------

describe("S164-B the census-scoping + rounded-display reword (A164-L-2 + A164-I-3 — the panel-scoped census and the unrounded-halves arithmetic, zero line-count drift)", () => {
  it("DEFECT (source): the S113-B registration's census is SCOPED — \"the panel's own census stays ELEVEN\" (the file-local reading made explicit; patchDiffers has thirteen app-wide call sites), the raw-compare doctrine untouched", () => {
    const fillAt = panelSource.indexOf("S113-B / A-I1");
    expect(fillAt).toBeGreaterThan(-1);
    const region = panelSource.slice(fillAt - 200, fillAt + 1400);
    // The scoped census (the A139-I1 form — the unstated file-local
    // reading made explicit).
    expect(collapsed(region)).toContain(
      "the panel's own census stays ELEVEN",
    );
    // The unscoped form is GONE (it read app-wide and was false —
    // 13 production call sites, not 11).
    expect(panelSource).not.toContain("the seam's own census stays ELEVEN");
    // The raw-compare doctrine untouched (the clearing siblings'
    // delivered form).
    expect(region).toContain("if (!patchDiffers(el, patch)) return false;");
    // The seam itself untouched (the entry compare the census names;
    // the delivered source's own generic-bearing export form — the
    // s164 spec-form repair at the source-green pass).
    expect(editorLibSource).toContain(
      "export function patchDiffers<T extends object>(",
    );
  });

  it("DEFECT (source): the cornerRadiusMax doc's arithmetic names the UNROUNDED halves — \"= the unrounded 23.36596.../2 (the prose dims are rounded displays)\" — with the false \"= 23.366/2\" and \"= 117/2\" forms gone, the implemented formula untouched", () => {
    const docAt = editorLibSource.indexOf("The Corner Radius slider's DYNAMIC max");
    expect(docAt).toBeGreaterThan(-1);
    const region = editorLibSource.slice(docAt, docAt + 900);
    // The unrounded-halves form (the prose dims are rounded displays —
    // the displayed aria values are halves of the UNROUNDED
    // dimensions; 23.36596.../2 = 11.68298487339743 and
    // 116.82984.../2 = 58.41492436698704).
    expect(strippedStarComments(region)).toContain(
      "= the unrounded 23.36596.../2 (the prose dims are rounded displays)",
    );
    expect(strippedStarComments(region)).toContain(
      "the unrounded 116.82984.../2)",
    );
    // The false-as-written forms are GONE (23.366/2 is 11.683, not
    // 11.68298487339743; 117/2 is 58.5, not 58.41492436698704).
    expect(editorLibSource).not.toContain("= 23.366/2");
    expect(editorLibSource).not.toContain("= 117/2)");
    // The exact first measurement stays (75 = 150/2 — the only
    // exactly-divisible member of the triple).
    expect(strippedStarComments(region)).toContain('="75" = 150/2');
    // The implemented formula untouched (the S103-C ceiling form).
    expect(editorLibSource).toContain(
      "return Math.min(Math.min(el.width, el.height) / 2, RADIUS_MAX);",
    );
  });
});

// ---------------------------------------------------------------------------
// S164-C — the NON-creation census reword (the honest 12-site census)
// ---------------------------------------------------------------------------

describe("S164-C the NON-creation census reword (B164-L-1 — the B163-L1 echo corrected: the delayed projects-POST creation named as burning one crud token per run)", () => {
  it("DEFECT (source): the crud-burn comment's interception-site census is the HONEST form — pass-throughs/delays with the elements-PUTs bucket-excluded and ONE delayed projects-POST creation that DOES burn a crud token per run — the \"NON-creation\" phrase gone, the limiter contracts and the exclusion doctrine untouched", () => {
    // The honest census named at the seam (the reworded parenthetical,
    // marker-stripped across the // continuation lines).
    expect(strippedSlashComments(rateLimitSource)).toContain(
      "pass-throughs/delays (the elements-PUTs bucket-excluded; one delayed projects-POST creation DOES burn a crud token per run), one fulfill-mock, one external abort",
    );
    // The false NON-creation phrase is GONE from the whole file (one
    // of the ten pass-through sites IS a creation call —
    // editor-integrity.spec.ts:118 delays the project-CREATE POST and
    // continues it to the server).
    expect(rateLimitSource).not.toContain("NON-creation");
    // The surviving members of the S163-B delivery untouched (the
    // fulfill-mock / external-abort / constants / entry point).
    expect(collapsed(rateLimitSource)).toContain("one fulfill-mock");
    expect(collapsed(rateLimitSource)).toContain("one external abort");
    expect(rateLimitSource).toContain("const CRUD_LIMIT = 60;");
    expect(rateLimitSource).toContain(
      "const CRUD_WINDOW_MS = 5 * 60 * 1000;",
    );
    expect(rateLimitSource).toContain("export function crudRateLimit(");
    // The elements-PUT exclusion doctrine still named (the comment's
    // standing TRUE claim — the marker-stripped form, the s158
    // spec-form lesson).
    expect(strippedSlashComments(rateLimitSource)).toContain(
      "THE ELEMENTS PUT IS EXCLUDED BY DESIGN",
    );
    // The ~31 figure still defended (the arithmetic survived via the
    // server-side execution count that already includes the
    // projects-POST burn).
    expect(collapsed(rateLimitSource)).toContain("~31");
  });
});

// ---------------------------------------------------------------------------
// S164-D — the historical-coordinate drop + the key-stability posture
// ---------------------------------------------------------------------------

describe("S164-D the historical-coordinate drop + the key-stability posture (A164-I-1 + A164-I-4 — the session-48-era numbers gone, the posture registered)", () => {
  it("DEFECT (source): the S48-2 mobile-wrap comment drops the session-48-era coordinates — \"pre-fix Share and Present rendered OFF-SCREEN\" with the \"(L413)\" and \"(L493)\" numerics gone, the wrap contract's own forms untouched", () => {
    const wrapAt = viewSource.indexOf("Mobile wrap (session 48, S48-2)");
    expect(wrapAt).toBeGreaterThan(-1);
    const region = viewSource.slice(wrapAt, wrapAt + 700);
    // The coordinate-free historical form (the measurements stay
    // frozen in the e2e spec header and the s48 records — the live
    // comment carries no unverifiable numerics).
    expect(collapsed(region)).toContain(
      "pre-fix Share and Present rendered OFF-SCREEN",
    );
    // The session-48-era coordinates are GONE from the whole file
    // (the buttons sit at ~2141/~2155 today — the numerics were
    // unverifiable against the live tree).
    expect(viewSource).not.toContain("(L413)");
    expect(viewSource).not.toContain("(L493)");
    // The wrap contract's own forms untouched (the S48-2 delivery).
    expect(viewSource).toContain("sm:h-12 sm:py-0");
  });

  it("SURVIVAL (posture): the A164-I-4 gradient-stop index-key posture registered in the bracketed s164 note — bounded impact named, the composite-key collision hazard named, no code change", () => {
    // The registration note (the standing posture — the S148-D
    // family's newest member).
    const noteAt = worklogSource.indexOf("[s164-citation-scoping-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 6000);
    expect(collapsed(note)).toContain("A164-I-4");
    expect(collapsed(note)).toContain("COLLIDE on duplicate stops");
    // The code form unchanged (the fully-controlled color input and
    // the resyncing GuardedNumberInput close the realistic windows —
    // the posture's own assessment; the anchor disambiguated onto the
    // RENDER map — the update helper at :946 shares the
    // gradient.stops.map prefix, the s164 spec-form repair).
    const stopsAt = panelSource.indexOf(
      "gradient.stops.map((stop, index)",
    );
    expect(stopsAt).toBeGreaterThan(-1);
    const stops = panelSource.slice(stopsAt, stopsAt + 400);
    expect(stops).toContain('key={index}');
    expect(stops).toContain('type="color"');
  });
});

// ---------------------------------------------------------------------------
// S164-E — the per-session pin family: survival members + doc-side members
// ---------------------------------------------------------------------------

describe("S164-E the per-session pin family (the survival members + the doc-side members that stay RED until the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's FIFTEENTH instance — the s163 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_363 directive; the thirteenth consecutive cycle of the forward form)", () => {
    // The s163 plan's execution record, read live: every box ticked.
    const ticked = s163PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s163PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
  });

  it("SURVIVAL (worklog): the two s164 audit entries at their anchors with their live censuses — auditor A's 0C/0H/0M/2L/4I (with A164-L-1 and A164-L-2) and auditor B's 0C/0H/0M/1L/0I (with B164-L-1), the thirty-seventh consecutive deferral cycle", () => {
    const entryA = auditEntry("Task ID: digma-s164-audit-A");
    expect(entryA).not.toBe("");
    expect(collapsed(entryA)).toContain(
      "0 Critical / 0 High / 0 Medium / 2 Low / 4 Informational",
    );
    expect(entryA).toContain("A164-L-1");
    expect(entryA).toContain("A164-L-2");
    const entryB = auditEntry("Task ID: digma-s164-audit-B");
    expect(entryB).not.toBe("");
    expect(collapsed(entryB)).toContain(
      "0 Critical / 0 High / 0 Medium / 1 Low / 0 Informational",
    );
    expect(entryB).toContain("B164-L-1");
    expect(collapsed(entryB)).toContain("thirty-seventh consecutive cycle");
  });

  it("SURVIVAL (worklog): the two bracketed s164 registration notes at their anchors — the citation-scoping note (with the cross-file member, the census-scope member, and the F150 cross-file rider lesson) and the non-creation-census note (with the delayed projects-POST and the B163-L1 echo)", () => {
    const scoping = worklogSource.indexOf("[s164-citation-scoping-note:");
    expect(scoping).toBeGreaterThan(-1);
    const note1 = worklogSource.slice(scoping, scoping + 6000);
    expect(collapsed(note1)).toContain("CROSS-FILE");
    expect(collapsed(note1)).toContain("panel's own census");
    expect(collapsed(note1)).toContain("rounded displays");
    const census = worklogSource.indexOf("[s164-non-creation-census-note:");
    expect(census).toBeGreaterThan(-1);
    const note2 = worklogSource.slice(census, census + 5000);
    expect(collapsed(note2)).toContain("project-CREATE POST");
    expect(collapsed(note2)).toContain("B163-L1");
    expect(collapsed(note2)).toContain("crud token");
  });

  it("SURVIVAL (scripts): the s164 script provenance — live164/nav164/digma-seo-s164 tokens, the 140th/141st/101st ordinals, the S163 delivery at e004e57d, zero s163 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live164");
    expect(refAuditSource).toContain("140th reference audit");
    expect(refAuditSource).toContain("e004e57d");
    expect(refAuditSource).toContain("byte-identical the 101st");
    // The nav script: the 141st session ordinal.
    expect(navSource).toContain("nav164");
    expect(navSource).toContain("141st session");
    // The seo script: the session-164 token.
    expect(seoSource).toContain("digma-seo-s164");
    expect(seoSource).toContain("session 164");
    // Zero s163 run-ordinal residue across the three scripts.
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live163");
      expect(src).not.toContain("nav163");
      expect(src).not.toContain("seo-s163");
      expect(src).not.toContain("s173");
      expect(src).not.toContain("139th");
      expect(src).not.toContain("140th session");
      expect(src).not.toContain("140th consecutive");
      expect(src).not.toContain("byte-identical the 100th");
      expect(src).not.toContain("ac277905");
    }
  });

  it("SURVIVAL (behavioral — the client-layer contract): the keep-form family intact and the store arms at their standing contracts (the S164-A/B/D comment-only members leave every mutation-arm guard untouched — the layer total STAYS this cycle at 14,295, the second consecutive STAYS cycle)", () => {
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
    // The S161-B Insert branch still present (the surface whose
    // citation this cycle's S164-A reword carries).
    expect(viewSource).toContain('event.key === "Insert"');
    // The draw commit's clamp still present (the S163-A relative
    // citation's referent).
    expect(canvasSource).toContain("x: clampPositionField(drag.x)");
    // The layer total STAYS at 14,295 — all five client-layer rewords
    // keep zero line-count drift by design (the second consecutive
    // STAYS cycle).
    // RE-ANCHORED onto 14307 by the S167-A rider (teams-view +12 —
    // the F40 prior-spec re-anchor: the claim stays true, the pinned
    // figure moves with the live tree).
    expect(liveLayerTotal).toBe(14373);
  });

  it("DEFECT (docs): the AGENTS session-164 bullet carries the chosen-work members — the CROSS-FILE citation reword, the panel-scoped census, and the honest projects-POST census (the comment-truth family's cross-file completion)", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 164, S164-A..S164-E");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 8000);
    // The chosen-work members' key phrases (the bullet's own
    // spelling — the s156 F143 phrase-case lesson).
    expect(collapsed(bullet)).toContain("CROSS-FILE CITATION");
    expect(collapsed(bullet)).toContain("toCanvas");
    expect(collapsed(bullet)).toContain("panel's own census");
    expect(collapsed(bullet)).toContain("delayed projects-POST");
  });

  it("DEFECT (docs): the count re-anchor — the v1.143.0 chain entry carries the S164 derivation (2287 = 2270 + 17 unit / 226 files) + the §7.1 row for the s164 spec, the layer-total family STAYING at 14,295 (the second consecutive STAYS cycle)", () => {
    expect(padSource).toMatch(/v1\.143\.0/);
    expect(padSource).toContain("2287 = 2270 + 17 unit / 226 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s164.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's eleventh instance): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.143.0 block quotes — the count receipt riding the spec instead of prose, this cycle in its STAYS form (all five client-layer rewords keep zero line-count drift)", () => {
    // The live derivation NEVER quotes a figure: the runtime IIFE at
    // the spec's head (wc -l over the exact 22-file composition —
    // 8 editor + 8 components + 2 hooks + the 3 named lib members +
    // globals.css, the composition pinned by tests/lows-s142.test.ts).
    // RE-ANCHORED onto 14307 by the S167-A rider (teams-view +12 —
    // the F40 prior-spec re-anchor: the claim stays true, the pinned
    // figure moves with the live tree).
    expect(liveLayerTotal).toBe(14373);
    // The PAD's v1.143.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("DEFECT (docs): the F151 lesson registered in the digma_SKILL — the cross-file-citation + census-scope + correction-echo members inserted after F150, the version bumped to v1.142.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.167\.0/);
    // The lesson: the members after F150.
    const f150At = skillSource.indexOf("F150");
    const f151At = skillSource.indexOf("F151");
    expect(f150At).toBeGreaterThan(-1);
    expect(f151At).toBeGreaterThan(f150At);
    const f151Body = skillSource.slice(f151At, f151At + 4000);
    // The cross-file-citation member (a numeric citation into
    // another file is falsified by that file's own insertions —
    // prefer the seam name or the test name).
    expect(collapsed(f151Body)).toContain("CROSS-FILE-CITATION");
    // The census-scope member (an unscoped "the seam's census" reads
    // app-wide — scope it or update it).
    expect(collapsed(f151Body)).toContain("CENSUS-SCOPE");
    // The correction-echo member (a corrected census is itself a
    // census claim — verify the corrected enumeration member-by-
    // member, reading each site's METHOD branch, not its URL glob).
    expect(collapsed(f151Body)).toContain("CORRECTION-ECHO");
  });

  it("DEFECT (docs): the pair-unity claim forms riding the constants at every doc — the frozen coincidental literals classified out (the B145-I1 doctrine), every live claim site the same members (the rolling-safe form: this spec's constants equal the s163 spec's constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s163Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s163.test.ts"),
      "utf8",
    );
    // The s163 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s163Unit = s163Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s163Files = s163Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s163Unit).toBe(UNIT);
    expect(s163Files).toBe(FILES);
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
