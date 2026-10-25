import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-162 spec (the one-hundred-and-tenth audit's chosen work —
// the insert-branch honest completion + the text-tool sibling promotion
// + the phantom-freehand correction):
//
// S162-A — THE INSERT BRANCH'S HONEST COMPLETION (L162-A-L1 +
//   L162-A-L3, lead-verified live at the seams): the S161-B Insert
//   branch passes RAW x/y to addElement while the draw commit it
//   mirrors clamps both through clampPositionField (canvas.tsx:492-493,
//   the S87-B/S84-B deep-pan teleport guard: a commit past +/-100000
//   renders locally then visibly teleports to the server's
//   buildElementRow bound on the store-replacing save; panBy is
//   unbounded). The same branch DISCARDS addElement's null return —
//   the only one of the three addElement call sites ignoring the
//   S61-F honest-refusal contract (both canvas siblings toast
//   "Element limit reached"; a silent dead Insert on a 2000-element
//   board is the pre-fix behavior class). The fix: the clamp pair in
//   the draw commit's own one-line form + the siblings' two-line
//   toast-on-null wrap + the import extension.
//
// S162-B — THE TEXT-TOOL SIBLING PROMOTION (L162-A-L1's unregistered
//   member): the text-tool add (canvas.tsx:226) passes the same raw
//   point — the pre-existing UNREGISTERED sibling of the S84-B family,
//   never named by the family's sweeps (the draw commit, the resize
//   write-back, moveElements, the Text Content field, cornerRadius —
//   five members fixed, the text add missed). Promoted alongside in
//   the same one-line form.
//
// S162-C — THE PHANTOM-FREEHAND CORRECTION (L162-A-L2, the S73-A
//   phantom-seam class): the S160-C registration's enumeration named
//   "the pen tool's freehand pointermove stream" as one of the
//   canvas's element-creation gestures, and the S161-B delivery
//   comment propagated the phrase verbatim — but the pen tool CREATES
//   NOTHING: TOOL_TO_TYPE (canvas.tsx:48-54) maps only
//   rectangle/ellipse/line/frame, the draw branch's `if (drawType)`
//   gate never opens for "pen", and zero e2e coverage exercises any
//   pen creation. The registration's CORE claim (the creation
//   gestures pointer-only, no keyboard path, the AI assistant a
//   different mechanism) remains TRUE. The correction: the source
//   comment reworded onto the live census (the draw tools' drag + the
//   text tool's click-to-place); the frozen records (the s160 plan,
//   the worklog's bracketed s160-canvas-pointer-only-note, the
//   lows-s160 header comment) stay frozen per S132-C with the
//   bracketed s162-phantom-freehand-note the standing correction.
//
// S162-D — the per-session pin family: the F138 guard's THIRTEENTH
//   instance (the s161 plan's record pinned 8/8 ticked at 0e0d05fd,
//   per the pre-armed session_351 directive), the audit entries at
//   their anchors (auditor A's 0C/0H/0M/3L/0I with L162-A-L1 +
//   L162-A-L2 + L162-A-L3; auditor B's 0C/0H/0M/0L/0I clean census;
//   the thirty-fifth consecutive deferral cycle), the script
//   provenance (live162/nav162/digma-seo-s162 — the 138th/139th/99th
//   ordinals, the S161 delivery at 0e0d05fd), the two bracketed s162
//   registration notes, the client-layer survival member (the layer
//   total MOVES this cycle — two files: re-anchored everywhere by the
//   collateral), the pair-unity constants (born rolling-safe at the
//   POST-spec figures 2257/224 — the doc-update re-anchors the docs
//   and the constants TOGETHER), and the doc-side members (the F149
//   lesson, the count re-anchor, the forward count-truth guard's
//   ninth instance) that stay RED until the collateral.
//
// Spec-form notes (narrated at birth — the honest form separated
// from the plan's forecast, the s153..s161 precedent's own shape):
// the born spec carries 14 pins — 9 RED (the four source members +
// the five doc-side members incl. the pair-unity
// RED-until-collateral) / 5 survival; the collateral count family
// re-anchors onto 2257 = 2243 + 14 unit / 224 files (lows-s162.test.ts
// joins as the 224th file); the layer-total family re-anchors onto
// the measured post-fix figure with the s156/s157/s158 hard pins
// riding the F140 re-anchor rider (the s160/s161 precedent at the
// layer family).

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
const s161PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session161.md"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
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
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s162.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s162.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s162.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2243 delivery checks + this
 *  spec's 14 = 2257 unit, the 223 delivery files + this spec = 224;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s161 lesson). */
const UNIT = "2613";
const FILES = "250";

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

/** The figure the v1.167.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its ninth instance). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.167\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S162-A — the insert branch's honest completion (the clamp + the toast)
// ---------------------------------------------------------------------------

describe("S162-A the insert branch's honest completion (L162-A-L1 + L162-A-L3 — the clamp pair in the draw commit's form + the toast-on-null in the siblings' form)", () => {
  it("DEFECT (source): the Insert branch clamps both coordinates through clampPositionField — the draw commit's own S87-B/S84-B form (a deep-panned viewport center past the bound would otherwise commit off-bound and teleport on the store-replacing save) — with the imports extended (clampPositionField + ELEMENT_LIMIT join the @/lib/editor import)", () => {
    const insertAt = viewSource.indexOf('event.key === "Insert"');
    expect(insertAt).toBeGreaterThan(-1);
    // The branch region INCLUDING the registration comment block
    // that sits above the if (the s161 pin's own look-back form).
    const branch = viewSource.slice(insertAt - 2000, insertAt + 2800);
    // The clamp pair — the draw commit's one-line form (canvas.tsx's
    // x: clampPositionField(drag.x) sibling).
    expect(branch).toContain("clampPositionField(cx - w / 2)");
    expect(branch).toContain("clampPositionField(cy - h / 2)");
    // The imports extended: both members ride the @/lib/editor import.
    const importStart = viewSource.indexOf("import { ProjectDTO");
    const importEnd = viewSource.indexOf('from "@/lib/editor"', importStart);
    expect(importStart).toBeGreaterThan(-1);
    expect(importEnd).toBeGreaterThan(importStart);
    const editorImport = viewSource.slice(importStart, importEnd);
    expect(editorImport).toContain("clampPositionField");
    expect(editorImport).toContain("ELEMENT_LIMIT");
    // The registration comment member at the seam (the honest
    // completion named with its two contracts).
    const stripped = strippedSlashComments(branch);
    expect(stripped).toContain("honest");
    expect(stripped).toContain("POSITION CLAMP");
    expect(stripped).toContain("CAP-REFUSED TOAST");
  });

  it("DEFECT (source): the cap-refused Insert answers the user — the S61-F contract both canvas siblings already honor (a silent dead Insert on a full board is the pre-fix behavior class): the === null check wrapping the addElement call and the toast carrying ELEMENT_LIMIT", () => {
    const insertAt = viewSource.indexOf('event.key === "Insert"');
    expect(insertAt).toBeGreaterThan(-1);
    const branch = viewSource.slice(insertAt, insertAt + 2800);
    // The null check wraps the call (the siblings' form).
    expect(branch).toContain(") === null");
    // The toast: the exact sibling message family (the multi-line
    // call form — the members checked on their own lines).
    expect(branch).toContain("toast.error(");
    expect(branch).toContain('"Element limit reached"');
    expect(branch).toContain("${ELEMENT_LIMIT} elements.");
  });
});

// ---------------------------------------------------------------------------
// S162-B — the text-tool sibling promotion
// ---------------------------------------------------------------------------

describe("S162-B the text-tool sibling promotion (L162-A-L1's unregistered member — the S84-B family's text-add closure)", () => {
  it("DEFECT (source): the text-tool add clamps its point through clampPositionField — the draw commit's own form, the pre-existing unregistered sibling of the S84-B teleport family promoted alongside the Insert branch (a deep-panned click past the bound would otherwise commit off-bound and teleport on the save)", () => {
    const textAddAt = canvasSource.indexOf('type: "text", x:');
    expect(textAddAt).toBeGreaterThan(-1);
    const textAdd = canvasSource.slice(textAddAt - 500, textAddAt + 600);
    // The clamp pair — the same one-line form.
    expect(textAdd).toContain("clampPositionField(point.x)");
    expect(textAdd).toContain("clampPositionField(point.y)");
    // The registration at the seam (the sibling-promotion member).
    expect(strippedSlashComments(textAdd)).toContain("S162-B");
  });
});

// ---------------------------------------------------------------------------
// S162-C — the phantom-freehand correction
// ---------------------------------------------------------------------------

describe("S162-C the phantom-freehand correction (L162-A-L2 — the S73-A phantom-seam class: the registration's enumeration named a creation gesture that does not exist)", () => {
  it("DEFECT (source): the Insert branch's registration comment carries the LIVE creation census (the draw tools' drag + the text tool's click-to-place) — the phantom pen member corrected at the seam (TOOL_TO_TYPE maps only the four draw types; the pen creates nothing), the phantom phrase gone from the file", () => {
    // The phantom phrase is gone from the whole file (the only
    // carrier was the Insert branch's registration comment).
    expect(viewSource).not.toContain("freehand");
    // The live census named at the seam.
    const insertAt = viewSource.indexOf('event.key === "Insert"');
    expect(insertAt).toBeGreaterThan(-1);
    const region = viewSource.slice(insertAt - 2600, insertAt);
    const stripped = strippedSlashComments(region);
    expect(stripped).toContain("text tool's click-to-place");
    // The correction itself named (the phantom member's reason).
    expect(stripped).toContain("phantom pen member");
    expect(stripped).toContain("TOOL_TO_TYPE");
    // The census is TRUE at the canvas: TOOL_TO_TYPE still maps
    // exactly the four draw types (the correction changes no
    // behavior — the pen was never creating).
    const mapAt = canvasSource.indexOf("const TOOL_TO_TYPE");
    expect(mapAt).toBeGreaterThan(-1);
    const map = canvasSource.slice(mapAt, mapAt + 400);
    expect(map).toContain('rectangle: "rectangle"');
    expect(map).toContain('ellipse: "ellipse"');
    expect(map).toContain('line: "line"');
    expect(map).toContain('frame: "frame"');
    expect(map).not.toContain("pen:");
  });
});

// ---------------------------------------------------------------------------
// S162-D — the per-session pin family: survival members + doc-side members
// ---------------------------------------------------------------------------

describe("S162-D the per-session pin family (the survival members + the doc-side members that stay RED until the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's THIRTEENTH instance — the s161 plan's execution record shipped 8/8 ticked, zero unticked (the pre-armed guard per the session_351 directive; the eleventh consecutive cycle of the forward form)", () => {
    // The s161 plan's execution record, read live: every box ticked.
    const ticked = s161PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s161PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(8);
    expect(unticked).toBe(0);
  });

  it("SURVIVAL (worklog): the two s162 audit entries at their anchors with their live censuses — auditor A's 0C/0H/0M/3L/0I (with L162-A-L1 + L162-A-L2 + L162-A-L3) and auditor B's 0C/0H/0M/0L/0I (the clean server pass), the thirty-fifth consecutive deferral cycle", () => {
    const entryA = auditEntry("Task ID: digma-s162-audit-A");
    expect(entryA).not.toBe("");
    expect(collapsed(entryA)).toContain(
      "0 Critical / 0 High / 0 Medium / 3 Low / 0 Informational",
    );
    expect(entryA).toContain("L162-A-L1");
    expect(entryA).toContain("L162-A-L2");
    expect(entryA).toContain("L162-A-L3");
    const entryB = auditEntry("Task ID: digma-s162-audit-B");
    expect(entryB).not.toBe("");
    expect(collapsed(entryB)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational",
    );
    expect(collapsed(entryB)).toContain("thirty-fifth consecutive cycle");
  });

  it("SURVIVAL (worklog): the two bracketed s162 registration notes at their anchors — the insert honest-completion note (with the clamp + toast contracts and the UNREGISTERED sibling naming) and the phantom-freehand note (with the TOOL_TO_TYPE census and the CREATES NOTHING correction)", () => {
    const completion = worklogSource.indexOf(
      "[s162-insert-honest-completion-note:",
    );
    expect(completion).toBeGreaterThan(-1);
    const note1 = worklogSource.slice(completion, completion + 4000);
    expect(collapsed(note1)).toContain("clampPositionField");
    expect(collapsed(note1)).toContain("UNREGISTERED sibling");
    const phantom = worklogSource.indexOf("[s162-phantom-freehand-note:");
    expect(phantom).toBeGreaterThan(-1);
    const note2 = worklogSource.slice(phantom, phantom + 4000);
    expect(collapsed(note2)).toContain("TOOL_TO_TYPE");
    expect(collapsed(note2)).toContain("CREATES NOTHING");
  });

  it("SURVIVAL (scripts): the s162 script provenance — live162/nav162/digma-seo-s162 tokens, the 138th/139th/99th ordinals, the S161 delivery at 0e0d05fd, zero s161 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live162");
    expect(refAuditSource).toContain("138th reference audit");
    expect(refAuditSource).toContain("0e0d05fd");
    expect(refAuditSource).toContain("byte-identical the 99th");
    // The nav script: the 139th session ordinal.
    expect(navSource).toContain("nav162");
    expect(navSource).toContain("139th session");
    // The seo script: the session-162 token.
    expect(seoSource).toContain("digma-seo-s162");
    expect(seoSource).toContain("session 162");
    // Zero s161 run-ordinal residue across the three scripts.
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live161");
      expect(src).not.toContain("nav161");
      expect(src).not.toContain("seo-s161");
      expect(src).not.toContain("s171");
      expect(src).not.toContain("137th");
      expect(src).not.toContain("138th session");
      expect(src).not.toContain("138th consecutive");
      expect(src).not.toContain("byte-identical the 98th");
      expect(src).not.toContain("78df96ee");
    }
  });

  it("SURVIVAL (behavioral — the client-layer contract): the keep-form family intact and the store arms at their standing contracts (the S162-A/B/C members leave every mutation-arm guard untouched — the layer total MOVES this cycle, two files, re-anchored everywhere by the collateral)", () => {
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
    // The canvas marquee pair still aligned (the S148-B form).
    expect(collapsed(canvasSource)).toContain(
      'drag.kind === "marquee" && drag.w > 2 && drag.h > 2 && (',
    );
    // The layers DnD branch's own reorder convention verbatim.
    expect(layersSource).toContain("store.reorderElements([fromId],");
    // The S160-B keyboard superset still present (the delivered
    // follow-up the Insert branch joined at the handler family).
    expect(layersSource).toContain('event.key === "F2"');
    // The S161-B Insert branch still present (the delivered surface
    // this cycle's honest completion extends).
    expect(viewSource).toContain('event.key === "Insert"');
    // The draw commit's clamp still present (the form the Insert
    // branch and the text add now both mirror).
    expect(canvasSource).toContain("x: clampPositionField(drag.x)");
  });

  it("DEFECT (docs): the AGENTS session-162 bullet carries the chosen-work members — the INSERT BRANCH'S HONEST COMPLETION (the clamp + the toast), the text-tool sibling promotion, the phantom-freehand correction", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 162, S162-A..S162-D");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 7000);
    // The chosen-work members' key phrases (the bullet's own
    // spelling — the s156 F143 phrase-case lesson).
    expect(collapsed(bullet)).toContain("HONEST COMPLETION");
    expect(collapsed(bullet)).toContain("text-tool");
    expect(collapsed(bullet)).toContain("phantom");
  });

  it("DEFECT (docs): the count re-anchor — the v1.141.0 chain entry carries the S162 derivation (2257 = 2243 + 14 unit / 224 files) + the §7.1 row for the s162 spec + the §11 rows re-anchored (editor-view.tsx, canvas.tsx at the measured post-fix figures)", () => {
    expect(padSource).toMatch(/v1\.141\.0/);
    expect(padSource).toContain("2257 = 2243 + 14 unit / 224 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s162.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's ninth instance): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.141.0 block quotes — the count receipt riding the spec instead of prose (the F138 receipt-doctrine shape at the count family)", () => {
    // The live derivation NEVER quotes a figure: the runtime IIFE at
    // the spec's head (wc -l over the exact 22-file composition —
    // 8 editor + 8 components + 2 hooks + the 3 named lib members +
    // globals.css, the composition pinned by tests/lows-s142.test.ts).
    expect(liveLayerTotal).toBeGreaterThan(14268);
    // The PAD's v1.141.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("DEFECT (docs): the F149 lesson registered in the digma_SKILL — the honest-completion + phantom-member members inserted after F148, the version bumped to v1.140.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.166\.0/);
    // The lesson: the members after F148.
    const f148At = skillSource.indexOf("F148");
    const f149At = skillSource.indexOf("F149");
    expect(f148At).toBeGreaterThan(-1);
    expect(f149At).toBeGreaterThan(f148At);
    const f149Body = skillSource.slice(f149At, f149At + 3000);
    // The honest-completion member (a delivered superset inherits
    // the family's own guards — the lesson's own all-caps emphasis
    // form, the s156 F143 phrase-case class).
    expect(collapsed(f149Body)).toContain("HONEST-COMPLETION");
    // The phantom-member member (a registration's enumeration is a
    // census claim — name only gestures that exist).
    expect(collapsed(f149Body)).toContain("PHANTOM-MEMBER");
  });

  it("DEFECT (docs): the pair-unity claim forms riding the constants at every doc — the frozen coincidental literals classified out (the B145-I1 doctrine), every live claim site the same members (the rolling-safe form: this spec's constants equal the s161 spec's constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s161Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s161.test.ts"),
      "utf8",
    );
    // The s161 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s161Unit = s161Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s161Files = s161Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s161Unit).toBe(UNIT);
    expect(s161Files).toBe(FILES);
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
