import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-160 spec (the one-hundred-and-eighth audit's chosen work —
// the guarded draft restore + the layers keyboard superset + the canvas
// draw-creation pointer-only registration + the Informational quintet):
//
// S160-A — THE GUARDED DRAFT RESTORE (L160-L1, the lead's own finding,
//   lead-verified live at the seam — the L158-L1 precedent of the
//   lead's plan-validation discovery): the send path clears the draft
//   BEFORE the await (:514) and the input itself stays EDITABLE
//   through the whole async window (no disabled attribute on the
//   :810-819 input — only the submit button disables on `sending`),
//   so when the response fails (:601, the response-error branch — a
//   500/429/400) or the fetch rejects/aborts (:685, the catch — a
//   network failure or the 30s abort) the UNCONDITIONAL
//   setInput(message) clobbered a draft typed during the wait — the
//   S105-B/S106-B closures' own unguarded edge (restoring the OLD
//   draft is itself a draft-loss of the NEWER one). The fix: the
//   functional form — setInput((draft) => (draft === "" ? message :
//   draft)) at BOTH sites: an empty input restores (the S105-B/S106-B
//   contract preserved exactly), a draft typed during the wait
//   survives. The four prior-spec pins on the literal setInput(message)
//   phrase (lows-s105/s106/s122/s123) ride the F140 re-anchor rider
//   onto the guarded spelling — the prior claims TRUE at the current
//   tree in the guarded form.
//
// S160-B — THE LAYERS KEYBOARD SUPERSET (the S159-C registered
//   candidate follow-up, DELIVERED — the working-superset doctrine):
//   the row's select button (the row's REAL keyboard surface, the
//   S70-A form — native Enter/Space activation) gains onKeyDown:
//   F2 opens the rename (the dblclick block's own triple — re-arm
//   renameDiscarded, setRenaming, setRenameValue) and
//   Alt+ArrowUp/Alt+ArrowDown reorder the layer by one (the rows
//   render in REVERSE element order, so screen-up = later in the
//   array: up inserts at index + 1, down at index − 1 in the
//   elements-minus-self array — the DnD branch's own reorderElements
//   convention, the store's clamp absorbing the boundary moves as the
//   S78-C identical-order no-op); both arrows preventDefault (the
//   panel scroll); the S131-B gesture stand-down twin at the reorder
//   head (a keyboard reorder interleaved with a live canvas gesture
//   refuses — the drop's own form). The global keydown's Alt bail
//   (editor-view.tsx :912) means no chord conflict; F2 unmapped. The
//   layers-a11y row-slice pin (draggable-to-data-layer-row) ends
//   BEFORE the button's JSX — the row container stays keyboard-free,
//   the pin green by design.
//
// S160-C — THE CANVAS DRAW-CREATION POINTER-ONLY REGISTRATION (the
//   lead's own audit-phase discovery, lead-verified live at the
//   seams — the S139-B resize-handle / S159-C layers precedent at
//   the canvas creation family): the canvas's ELEMENT-CREATION
//   gestures are pointer-only (the rectangle/ellipse/frame draws'
//   pointerdown-to-pointerup drag, the pen tool's freehand
//   pointermove stream) with NO keyboard path to the creation
//   gesture (the global keydown handles Delete/Escape/tool-keys/?/
//   chords only); the HONEST absent-equivalent — the AI assistant's
//   text instructions DO create elements by keyboard but are a
//   DIFFERENT MECHANISM (a natural-language batch operator, not a
//   keyboard equivalent of the draw gesture), honestly named as
//   such; the components panel a documented scope cut (PAD §10). The
//   reference pointer-only too (parity — the gap parity-borne).
//   Registered the 108th cycle; the worklog's bracketed
//   s160-canvas-pointer-only-note landed BEFORE this spec's birth;
//   the insert-shape keyboard surface the candidate follow-up.
//   Zero source change, zero line movement.
//
// S160-D — THE INFORMATIONAL QUINTET: (a) the draw preview gate
//   aligned to the commit's own OR form — I160-A-I1, the F88
//   form-alignment family's draw member (canvas.tsx); (b) the
//   export-png membership unified — I160-L2: the same el.fillImage
//   field checked two ways in one module (the :134 truthiness form
//   vs the :257 explicit null/undefined form, the degenerate empty
//   string classified OPPOSITELY) — both sites on the truthiness
//   family now (export-png.ts); (c) the store's undo/redo
//   empty-stack guards on the family form — I160-L3: return state →
//   return {} at both sites, thirteen-for-thirteen with the store's
//   other eleven no-op guards (editor-store.ts; the lows-s114
//   survival pins ride the F140 re-anchor rider); (d) the OTP
//   autofill distribution — I160-L4: onDigitChange's slice(-1) kept
//   only the LAST digit, so a browser SMS/password-manager autofill
//   delivering the COMPLETE 6-digit code into the one-time-code
//   field discarded five digits — the multi-digit value now
//   distributes across the cells (the paste handler's own contract),
//   the single-digit path unchanged (login-screen.tsx); (e) the AI
//   send seam's transpose retired — I160-A-I2: the locked-target
//   derivation iterated the selection scanning the elements per id
//   (the TRANSPOSE of the S73-H/S74-B/S77-G/S105-D/S159-D form);
//   the locked-ids Set + the has() filter now (ai-assistant.tsx).
//
// S160-E — the per-session pin family: the F138 guard's TENTH
//   instance (the s159 plan's record pinned 8/8 ticked at 60e5fd1c,
//   per the session_340 directive — the pre-armed guard), the audit
//   entries at their anchors (auditor A's 0C/0H/0M/0L/2I with
//   I160-A-I1 + I160-A-I2; auditor B's 0C/0H/0M/0L/1I with
//   I160-B-I1; the thirty-third consecutive deferral cycle), the
//   script provenance (live160/nav160/digma-seo-s160 — the
//   136th/137th/97th ordinals, the S159 delivery at 60e5fd1c), the
//   client-layer survival member (the layer total MOVES this cycle —
//   six files, the second movement since S155: re-anchored
//   everywhere by the collateral), the pair-unity constants (born
//   rolling-safe at the POST-spec figures 2227/222 — the doc-update
//   re-anchors the docs and the constants TOGETHER), and the
//   doc-side members (the F147 lesson, the count re-anchor, the
//   forward count-truth guard's seventh instance) that stay RED
//   until the collateral.
//
// Spec-form notes (narrated at birth — the honest form separated
// from the plan's forecast, the s153..s159 precedent's own shape):
// the born spec carries 17 pins — 12 RED (the seven source members +
// the five doc-side members incl. the pair-unity
// RED-until-collateral) / 5 survival; the collateral count family
// re-anchors onto 2227 = 2210 + 17 unit / 222 files (lows-s160.test.ts
// joins as the 222nd file); the layer-total family re-anchors onto
// the measured post-fix figure with the s156/s157/s158 hard pins
// riding the F140 re-anchor rider (the s138/s139 823→840 and s159's
// own 14,077→14,095 precedents at the layer family).

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
const s159PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session159.md"),
  "utf8",
);
const aiSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const layersSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/layers-panel.tsx"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const exportPngSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/export-png.ts"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const loginSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/login-screen.tsx"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s160.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s160.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s160.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2210 delivery checks + this
 *  spec's 17 = 2227 unit, the 221 delivery files + this spec = 222;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s159 lesson). */
const UNIT = "2243";
const FILES = "223";

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

/** The figure the v1.140.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its seventh instance). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.140\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S160-A — the guarded draft restore
// ---------------------------------------------------------------------------

describe("S160-A the guarded draft restore (L160-L1 — the restores written to fix input loss must not clobber NEWER input: the functional form at both failure branches)", () => {
  it("DEFECT (source): the two draft restores are GUARDED — the functional form (an empty input restores the old prompt, a draft typed during the wait survives) at BOTH branches, the bare setInput(message) form GONE from ai-assistant.tsx, the restores still after the aliveRef guards and beside the toasts (the S105-B/S106-B/S122-A contracts preserved)", () => {
    // The functional form lands at BOTH failure branches.
    const guarded =
      aiSource.match(
        /setInput\(\(draft\) => \(draft === "" \? message : draft\)\)/g,
      )?.length ?? 0;
    expect(guarded).toBe(2);
    // The bare unconditional form is gone (the whole file — the
    // scope-refusal branch never restored, the guarded form is the
    // only restore spelling left).
    expect(aiSource).not.toContain("setInput(message)");
    // The S122-A ordering preserved in the catch: the aliveRef guard
    // FIRST, then the guarded restore, then the network-error toast.
    const catchAt = aiSource.indexOf('toast.error("Network error"');
    expect(catchAt).toBeGreaterThan(-1);
    const catchBlock = aiSource.slice(Math.max(0, catchAt - 2200), catchAt + 400);
    const guardIdx = catchBlock.indexOf("if (!aliveRef.current) return;");
    const restoreIdx = catchBlock.indexOf(
      'setInput((draft) => (draft === "" ? message : draft))',
    );
    expect(guardIdx).toBeGreaterThan(-1);
    expect(restoreIdx).toBeGreaterThan(guardIdx);
    // The S106-B ordering preserved at the response-error branch: the
    // guarded restore beside the "Assistant unavailable" toast.
    const errAt = aiSource.indexOf('toast.error("Assistant unavailable"');
    expect(errAt).toBeGreaterThan(-1);
    const errBlock = aiSource.slice(Math.max(0, errAt - 2200), errAt + 400);
    expect(errBlock).toContain(
      'setInput((draft) => (draft === "" ? message : draft))',
    );
    // The registration comment at the seam.
    expect(strippedSlashComments(aiSource)).toContain(
      "the guarded draft restore",
    );
  });
});

// ---------------------------------------------------------------------------
// S160-B — the layers keyboard superset
// ---------------------------------------------------------------------------

describe("S160-B the layers keyboard superset (the S159-C registered candidate follow-up, DELIVERED — F2 rename + Alt+Arrow reorder on the row's real keyboard surface)", () => {
  it("DEFECT (source): the select button's onKeyDown carries the keyboard superset — F2 opens the rename (the dblclick block's own triple), Alt+ArrowUp/Alt+ArrowDown reorder by one (the DnD branch's own reorderElements convention), the S131-B gesture stand-down twin at the reorder head, both arrows preventDefault; the row container itself stays keyboard-free (the layers-a11y pin's own contract)", () => {
    // The keyboard surface: the select button's onKeyDown (the button
    // found by its unique aria-pressed attribute form).
    const btnAt = layersSource.indexOf("aria-pressed={isSelected}");
    expect(btnAt).toBeGreaterThan(-1);
    const btnWindow = layersSource.slice(btnAt, btnAt + 4200);
    expect(btnWindow).toContain("onKeyDown={(event) => {");
    // F2 opens the rename — the dblclick block's own triple.
    expect(btnWindow).toContain('event.key === "F2"');
    expect(btnWindow).toContain("renameDiscarded.current = false;");
    expect(btnWindow).toContain("setRenaming(el.id);");
    // The Alt+Arrow reorder pair, preventDefaulted.
    expect(btnWindow).toContain(
      'event.altKey && (event.key === "ArrowUp" || event.key === "ArrowDown")',
    );
    expect(btnWindow).toContain("event.preventDefault();");
    // The S131-B gesture stand-down twin.
    expect(btnWindow).toContain("if (store.gestureSnapshot) return;");
    // The reorder call — the DnD branch's own convention (the
    // one-line call form).
    expect(btnWindow).toContain("store.reorderElements([el.id],");
    // The registration comment at the seam.
    expect(strippedSlashComments(layersSource)).toContain(
      "the layers keyboard superset",
    );
    // The row container stays keyboard-free (the layers-a11y pin's
    // own slice — the S159-C registration's deliberate row posture
    // preserved; the BUTTON is the keyboard surface, not the row).
    const rowStart = layersSource.indexOf("draggable={renaming !== el.id}");
    const rowEnd = layersSource.indexOf("data-layer-row", rowStart);
    expect(rowStart).toBeGreaterThan(-1);
    expect(layersSource.slice(rowStart, rowEnd)).not.toMatch(/onKeyDown/);
  });
});

// ---------------------------------------------------------------------------
// S160-C — the canvas draw-creation pointer-only registration
// ---------------------------------------------------------------------------

describe("S160-C the canvas draw-creation pointer-only registration (the lead's own audit-phase discovery — the S139-B/S159-C precedent at the canvas creation family)", () => {
  it("DEFECT (docs): the AGENTS session-160 bullet carries the registration member — the draw-creation pointer-only posture named (the creation gestures pointer-only, the AI assistant a DIFFERENT-MECHANISM alternative named honestly, the reference pointer-only too), the S160-B keyboard superset delivery named, the insert-shape keyboard surface the candidate follow-up", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 160, S160-A..S160-E");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 7000);
    // The registration member's key phrases (the bullet's own
    // spelling — the s156 F143 phrase-case lesson: the registration's
    // own uppercase forms).
    expect(collapsed(bullet)).toContain("DRAW-CREATION");
    expect(collapsed(bullet)).toContain("DIFFERENT MECHANISM");
    expect(collapsed(bullet)).toContain("insert-shape");
  });

  it("SURVIVAL (worklog): the bracketed s160-canvas-pointer-only-note at its anchor — landed BEFORE this spec's birth (the S139-B/S159-C precedent's honest survival classification), the absent-equivalent named honestly and the candidate follow-up named", () => {
    const at = worklogSource.indexOf("[s160-canvas-pointer-only-note:");
    expect(at).toBeGreaterThan(-1);
    const note = worklogSource.slice(at, at + 5000);
    expect(collapsed(note)).toContain("ELEMENT-CREATION");
    expect(collapsed(note)).toContain("DIFFERENT MECHANISM");
    expect(collapsed(note)).toContain("insert-shape");
  });
});

// ---------------------------------------------------------------------------
// S160-D — the Informational quintet
// ---------------------------------------------------------------------------

describe("S160-D the Informational quintet (the draw-preview gate + the export-png membership unification + the store no-op family form + the OTP autofill distribution + the transpose retirement)", () => {
  it("DEFECT (canvas source): the draw preview gate rides the commit's OWN OR-form threshold — the F88 form-alignment family's draw member (the marquee pair aligned by S148-B, the draw pair now too), the ungated preview form gone", () => {
    // The preview region, found by its own comment anchor.
    const previewAt = canvasSource.indexOf("{/* Draw preview");
    expect(previewAt).toBeGreaterThan(-1);
    const previewBlock = canvasSource.slice(previewAt, previewAt + 1200);
    expect(collapsed(previewBlock)).toContain(
      'drag.kind === "draw" && (drag.w > 3 || drag.h > 3) && (',
    );
    // The registration comment at the seam.
    expect(collapsed(previewBlock)).toContain("form-alignment");
    // The commit gate itself unchanged (the OR form at the commit —
    // the two-line adjacency IS the anchor: the draw COMMIT branch is
    // the file's SECOND "draw" branch, the spec-form repair at birth;
    // the gate rides immediately inside it).
    expect(canvasSource).toContain(
      'if (drag.kind === "draw") {\n      if (drag.w > 3 || drag.h > 3) {',
    );
  });

  it("DEFECT (export-png source): the fillImage membership UNIFIED — the truthiness family at both sites (the paint chain's :134 form and the gradient-def branch's !el.fillImage), the explicit null/undefined dialect gone, the degenerate empty string uniformly no-image", () => {
    expect(exportPngSource).not.toContain(
      "el.fillImage === null || el.fillImage === undefined",
    );
    // The unified form at the gradient-def branch.
    const gradAt = exportPngSource.indexOf("if (!el.fillImage) {");
    expect(gradAt).toBeGreaterThan(-1);
    // The paint chain's truthiness form still present (the :134
    // sibling — both sites the same family now).
    expect(exportPngSource).toContain("if (el.fillImage) {");
    // The registration comment at the seam.
    expect(strippedSlashComments(exportPngSource)).toContain(
      "membership unification",
    );
  });

  it("DEFECT (store source): the undo/redo empty-stack guards on the family form — return {}; at BOTH sites, the bare return state; dialect GONE from the store, thirteen-for-thirteen with the other eleven no-op guards", () => {
    // The bare full-state dialect is gone from the whole store.
    expect(storeSource).not.toContain("return state;");
    // The family form at both guards.
    expect(storeSource).toContain("if (state.past.length === 0) return {};");
    expect(storeSource).toContain("if (state.future.length === 0) return {};");
    // The registration comment at the seam.
    expect(strippedSlashComments(storeSource)).toContain("no-op family form");
  });

  it("DEFECT (login source): the OTP autofill distribution — the multi-digit cleaned value distributes across the six cells with the focus advance (the paste handler's own contract), the single-digit path unchanged, the discard form gone", () => {
    // The distribution branch present in the change handler.
    const changeAt = loginSource.indexOf("function onDigitChange(");
    expect(changeAt).toBeGreaterThan(-1);
    const changeBlock = loginSource.slice(changeAt, changeAt + 2600);
    expect(changeBlock).toContain("cleaned.length > 1");
    expect(changeBlock).toContain("const code = cleaned.slice(0, 6);");
    expect(changeBlock).toContain("Math.min(code.length, 5)");
    // The single-digit path unchanged.
    expect(changeBlock).toContain("const digit = cleaned.slice(-1);");
    // The registration comment at the seam.
    expect(strippedSlashComments(loginSource)).toContain(
      "OTP autofill-distribution",
    );
  });

  it("DEFECT (ai-assistant source): the AI send seam's TRANSPOSE retired — the locked-ids Set built once with the selection filtered by has() (the S73-H/S74-B/S77-G/S105-D/S159-D family's own form), the transpose scan form gone", () => {
    // The family form at the send seam (the collapsed form — the
    // landed filter call wraps its arrow body across continuation
    // lines, the spec-form repair at birth).
    const sendAt = aiSource.indexOf("const lockedIds = new Set(");
    expect(sendAt).toBeGreaterThan(-1);
    const window = aiSource.slice(sendAt, sendAt + 700);
    expect(window).toContain("state.elements.filter((el) => el.locked).map((el) => el.id)");
    expect(collapsed(window)).toContain("state.selectedIds.filter((id) => lockedIds.has(id)");
    // The transpose scan form is gone (the collapsed whole-file
    // check — the old form spanned continuation lines).
    expect(collapsed(aiSource)).not.toContain(
      "state.selectedIds.filter((id) => state.elements.some((el) => el.id === id && el.locked))",
    );
    // The registration comment at the seam.
    expect(strippedSlashComments(aiSource)).toContain(
      "transpose-direction member",
    );
  });
});

// ---------------------------------------------------------------------------
// S160-E — the per-session pin family: survival members + doc-side members
// ---------------------------------------------------------------------------

describe("S160-E the per-session pin family (the survival members + the doc-side members that stay RED until the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's TENTH instance — the s159 plan's execution record shipped 8/8 ticked, zero unticked (the pre-armed guard per the session_340 directive; the ninth consecutive cycle of the forward form)", () => {
    // The s159 plan's execution record, read live: every box ticked.
    const ticked = s159PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s159PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(8);
    expect(unticked).toBe(0);
  });

  it("SURVIVAL (worklog): the two s160 audit entries at their anchors with their live censuses — auditor A's 0C/0H/0M/0L/2I (with I160-A-I1 + I160-A-I2) and auditor B's 0C/0H/0M/0L/1I (with I160-B-I1), the thirty-third consecutive deferral cycle", () => {
    const entryA = auditEntry("Task ID: digma-s160-audit-A");
    expect(entryA).not.toBe("");
    expect(collapsed(entryA)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 2 Informational",
    );
    expect(entryA).toContain("I160-A-I1");
    expect(entryA).toContain("I160-A-I2");
    const entryB = auditEntry("Task ID: digma-s160-audit-B");
    expect(entryB).not.toBe("");
    expect(collapsed(entryB)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 1 Informational",
    );
    expect(entryB).toContain("I160-B-I1");
    expect(collapsed(entryB)).toContain("thirty-third consecutive cycle");
  });

  it("SURVIVAL (scripts): the s160 script provenance — live160/nav160/digma-seo-s160 tokens, the 136th/137th/97th ordinals, the S159 delivery at 60e5fd1c, zero s159 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live160");
    expect(refAuditSource).toContain("136th reference audit");
    expect(refAuditSource).toContain("60e5fd1c");
    expect(refAuditSource).toContain("byte-identical the 97th");
    // The nav script: the 137th session ordinal.
    expect(navSource).toContain("nav160");
    expect(navSource).toContain("137th session");
    // The seo script: the session-160 token.
    expect(seoSource).toContain("digma-seo-s160");
    expect(seoSource).toContain("session 160");
    // Zero s159 run-ordinal residue across the three scripts.
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live159");
      expect(src).not.toContain("nav159");
      expect(src).not.toContain("seo-s159");
      expect(src).not.toContain("s169");
      expect(src).not.toContain("135th");
      expect(src).not.toContain("136th session");
      expect(src).not.toContain("136th consecutive");
      expect(src).not.toContain("byte-identical the 96th");
      expect(src).not.toContain("48923eb2");
    }
  });

  it("SURVIVAL (behavioral — the client-layer contract): the keep-form family intact and the store arms at their standing contracts (the S160-A/S160-B/S160-D members leave every mutation-arm guard untouched — the layer total MOVES this cycle, six files, the second movement since S155's comment-only pass: re-anchored everywhere by the collateral)", () => {
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
    // toggleLock id-match guards still return the family form (the
    // S160-D(c) unification leaves the eleven siblings untouched).
    const updateGuards = storeSource.match(/if \(!matched\) return \{\};/g);
    expect(updateGuards?.length).toBe(5);
    // The canvas marquee pair still aligned (the S148-B form the draw
    // member joins).
    expect(collapsed(canvasSource)).toContain(
      'drag.kind === "marquee" && drag.w > 2 && drag.h > 2 && (',
    );
    // The layers DnD branch's own reorder convention verbatim (the
    // S160-B keyboard form rides the same store arm).
    expect(layersSource).toContain("store.reorderElements([fromId],");
  });

  it("DEFECT (docs): the count re-anchor — the v1.139.0 chain entry carries the S160 derivation (2227 = 2210 + 17 unit / 222 files) + the §7.1 row for the s160 spec + the §11 rows re-anchored (ai-assistant.tsx, layers-panel.tsx, canvas.tsx, editor-store.ts, login-screen.tsx at the measured post-fix figures)", () => {
    expect(padSource).toMatch(/v1\.139\.0/);
    expect(padSource).toContain("2227 = 2210 + 17 unit / 222 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s160.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's seventh instance): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.139.0 block quotes — the count receipt riding the spec instead of prose (the F138 receipt-doctrine shape at the count family)", () => {
    // The live derivation NEVER quotes a figure: wc -l over the exact
    // 22-file composition at spec runtime.
    expect(liveLayerTotal).toBeGreaterThan(14100);
    // The PAD's v1.139.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("SURVIVAL (docs): the pair-unity claim forms riding the constants at every doc — the frozen coincidental literals classified out (the B145-I1 doctrine), every live claim site the same members (the rolling-safe form: this spec's constants equal the s159 spec's constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s159Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s159.test.ts"),
      "utf8",
    );
    // The s159 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s159Unit = s159Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s159Files = s159Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s159Unit).toBe(UNIT);
    expect(s159Files).toBe(FILES);
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

  it("DEFECT (docs): the F147 lesson registered in the digma_SKILL — the draft-guard + keyboard-superset + probe-construction members inserted after F146, the version bumped to v1.138.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.139\.0/);
    // The lesson: the members after F146.
    const f146At = skillSource.indexOf("F146");
    const f147At = skillSource.indexOf("F147");
    expect(f146At).toBeGreaterThan(-1);
    expect(f147At).toBeGreaterThan(f146At);
    const f147Body = skillSource.slice(f147At, f147At + 3000);
    // The draft-guard member (the functional-setState form).
    expect(collapsed(f147Body)).toContain("draft");
    // The keyboard-superset member (the working superset delivered).
    expect(collapsed(f147Body)).toContain("keyboard");
    // The probe-construction member (the own-property shadowing).
    expect(collapsed(f147Body)).toContain("probe");
  });
});
