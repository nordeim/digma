import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-159 spec (the one-hundred-and-seventh audit's chosen work —
// the describeRejection string-honesty + the StrictMode-safe mount
// discriminator + the layers pointer-only registration + the layer's
// Informational pair):
//
// S159-A — THE DESCRIBEREJECTION STRING-HONESTY HARDENING (I159-B-I1,
//   auditor B's finding, lead-verified live at the seam): the S158-A
//   seam's Error arm returns error.message VERBATIM, and an Error
//   instance whose message property has been overridden to a non-string
//   (Object.assign(new Error("x"), { message: null }) — live-probed:
//   returns null; with message: 42 returns 42) violates the function's
//   own : string annotation — a type-unsoundness TypeScript cannot see
//   because Error.message is itself declared string. The never-throws
//   contract is CONFIRMED TOTAL (auditor B's 17-shape live probe: zero
//   escapes); the fix is the typeof-narrowed arm — total AND
//   string-typed, the guarded default answering the non-string message
//   shapes (the F145 totality doctrine extended to the RETURN
//   contract). validation.ts 370 → 380 (the §11 row re-anchored); the
//   route file unchanged except the comment's attribution extended to
//   "(S157-A/S158-A/S159-A)" (the route stays 154 lines, the layer
//   stays outside — the file is not a counted layer member).
//
// S159-B — THE STRICTMODE-SAFE MOUNT DISCRIMINATOR (L159-A-L2, auditor
//   A's finding, lead-traced line-by-line at the seam): the load
//   effect's firstRunRef flipped in the SYNC PREFIX (unconditionally,
//   before the first await), so a run later cancelled still left it
//   flipped — and dev StrictMode's double-invoked effect (mount →
//   cleanup → re-run, the ref persisting across the double-run) made
//   run #2 read isMountRun === false and take the S61-I adoption-skip
//   over the stale singleton on a same-project re-entry mount —
//   precisely the staleness S85-A closed (production unaffected: single
//   run; next.config.ts does not override reactStrictMode). The fix:
//   the flip rides the run's LOAD COMMIT (never the sync prefix) —
//   after loadProject(body.data.project…) and after the Untitled
//   fallback's loadProject(UNTITLED_PROJECT) — so a cancelled
//   pre-commit run leaves the discriminator at MOUNT (the re-run loads
//   fresh, the S85-A contract restored in dev) while a committed run's
//   flip STICKS (the X→Y→X back-navigation adoption preserved — the
//   lost-edit regression of the naive restore-in-cleanup form designed
//   out). editor-view.tsx 2359 → 2371 (the §11 row re-anchored); the
//   s81 pin family compatible by design (the capture verbatim, the
//   flip still after the capture in file order, the skip compound
//   verbatim).
//
// S159-C — THE LAYERS POINTER-ONLY REGISTRATION (L159-A-L1, auditor
//   A's finding, lead-verified live at the seams — the S139-B
//   resize-handle-keyboard-posture precedent at the layers family):
//   the layer RENAME opens exclusively via the row's onDoubleClick
//   (the reference's measured contract, S70-A) and the REORDER rides
//   HTML5 DnD with no keyboard alternative; the HONEST
//   absent-equivalent — no Name field exists in the properties panel,
//   so keyboard-only users cannot rename or reorder layers (WCAG
//   2.1.1 Level A); the reference is pointer-only too (parity), the
//   gap parity-borne but previously unregistered. The registration:
//   the AGENTS session-159 bullet's member + the worklog's bracketed
//   s159-layers-pointer-only-note (landed BEFORE this spec's birth)
//   + these posture pins; the working-superset keyboard surface the
//   CANDIDATE FOLLOW-UP. Zero source change, zero line movement.
//
// S159-D — THE LAYER'S INFORMATIONAL PAIR: (a) the canvas
//   canvas resize-handle pointerdown's live-element lookup rides the SET
//   membership form (I159-A-I1 — the S73-H/S74-B/S77-G/S105-D family
//   convention at its one missed site; canvas.tsx 1075 → 1080); (b)
//   the toolbar provenance comment's divider clause completes the
//   enumeration (I159-A-I2 — "dividers between the navigate group
//   (select/hand), the shape group, and the pen/text/image group", the
//   two rendered separators at line 61; comment-only at one-line
//   movement — the enumeration completing, toolbar.tsx 89 → 90; the
//   s158 px pin and the layers-a11y L-5 code pin both preserved).
//
// S159-E — the per-session pin family: the F138 guard's NINTH
//   instance (the s158 plan's record pinned 7/7 ticked at 48923eb2,
//   per the session_334 directive — the pre-armed guard), the audit
//   entries at their anchors (auditor A's 0C/0H/0M/2L/2I with
//   L159-A-L1 + L159-A-L2; auditor B's 0C/0H/0M/0L/1I with I159-B-I1;
//   the thirty-second consecutive deferral cycle), the script
//   provenance (live159/nav159/digma-seo-s159 — the 135th/136th/96th
//   ordinals, the S158 delivery at 48923eb2), the client-layer
//   survival member (the keep-form family intact — the layer total
//   MOVES this cycle, the first movement since S155's comment-only
//   pass: 14,077 → 14,095, editor-view +12 + canvas +5 + toolbar +1,
//   re-anchored everywhere by the collateral), the pair-unity constants (born
//   rolling-safe at the POST-spec figures 2210/221 — the doc-update
//   re-anchors the docs and the constants TOGETHER), and the doc-side
//   members (the F146 lesson, the count re-anchor, the forward
//   count-truth guard's sixth instance) that stay RED until the
//   collateral.
//
// Spec-form notes (narrated at birth — the honest form separated
// from the plan's ~14-pin forecast, the s153..s158 precedent's own
// shape): the born spec carries 15 pins — 10 RED (the behavioral
// shape member riding the dynamic import + the source member + the
// flip-at-commit member + the registration member + the canvas +
// toolbar members + the four doc-side members incl. the pair-unity
// RED-until-collateral) / 5 survival; ONE spec-form repair at birth —
// the S159-C note pin's phrase-case onto the note's own 'NO keyboard
// rename surface' spelling (the s156 F143 phrase-case precedent's
// class: a pin's phrase must match the record's own spelling); the
// collateral count family re-anchors onto 2210 = 2195 + 15 unit / 221
// files (lows-s159.test.ts joins as the 221st file); the layer-total
// family re-anchors onto the measured post-fix figure with the
// s156/s157/s158 hard pins riding the F140 re-anchor rider (the
// s138/s139 823→840 precedent at the layer family).
//
// A SECOND spec-form repair at birth: the §11 figures onto the
// MEASURED post-fix tree (editor-view 2,371 not the plan's 2,367
// forecast — the registration comments one line longer than
// designed; toolbar 89 → 90 the enumeration completing; the layer
// total 14,095 — every figure derived live at the repaired tree,
// never quoted from the plan).

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
const s158PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session158.md"),
  "utf8",
);
const s159PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session159.md"),
  "utf8",
);
const routeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/ai-assistant/route.ts"),
  "utf8",
);
const validationSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/validation.ts"),
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
const toolbarSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/toolbar.tsx"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s159.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s159.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s159.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2195 delivery checks + this
 *  spec's 15 = 2210 unit, the 220 delivery files + this spec = 221;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s158 lesson). */
const UNIT = "2287";
const FILES = "226";

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

/** The figure the v1.143.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its sixth instance). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.143\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S159-A — the describeRejection string-honesty hardening
// ---------------------------------------------------------------------------

describe("S159-A the describeRejection string-honesty hardening (I159-B-I1 — the : string annotation is a totality claim about the RETURN: the arm must narrow or the claim narrows, the F145 (b) form extended to the return contract)", () => {
  it("DEFECT (behavioral — the shape table): describeRejection answers a STRING for every rejection shape — the standing shapes preserved (an Error logs its .message, primitives log their String() form, the hostile coercions answer the guarded default) and the non-string message overrides (the I159-B-I1 residual: null, a number) answer the guarded default too — a source pin proves the spelling, a shape pin proves the contract (the F145 (c) form)", async () => {
    // The dynamic import isolates the RED to this member at the spec's
    // birth (a static import of a changed export's behavior would
    // still collect — but the form keeps the s158 precedent's
    // isolation discipline for the behavioral member).
    const { describeRejection } = await import("@/lib/validation");
    // The standing shapes (the S158-A closure's own guarantee,
    // preserved through the narrowing).
    expect(describeRejection(new Error("boom"))).toBe("boom");
    expect(describeRejection(null)).toBe("null");
    expect(describeRejection(undefined)).toBe("undefined");
    expect(describeRejection("raw string")).toBe("raw string");
    expect(describeRejection(42)).toBe("42");
    expect(describeRejection(Object.create(null))).toBe(
      "[unloggable rejection]",
    );
    expect(
      describeRejection({
        toString() {
          throw new Error("hostile");
        },
      }),
    ).toBe("[unloggable rejection]");
    const hostileGetter = new Error("outer");
    Object.defineProperty(hostileGetter, "message", {
      get() {
        throw new Error("getter");
      },
    });
    expect(describeRejection(hostileGetter)).toBe("[unloggable rejection]");
    // THE S159-A MEMBERS (the I159-B-I1 residual, live-probed by the
    // lead at the seam): a non-string message override must answer
    // the guarded default, never null/42 — the : string annotation a
    // claim the mechanism keeps for every shape.
    expect(
      describeRejection(Object.assign(new Error("x"), { message: null })),
    ).toBe("[unloggable rejection]");
    expect(
      describeRejection(Object.assign(new Error("x"), { message: 42 })),
    ).toBe("[unloggable rejection]");
  });

  it("DEFECT (source): the Error arm narrows the message to a string — the typeof guard present, the bare s157-era arm (error instanceof Error ? error.message : String(error)) GONE from validation.ts, the guarded default answering the non-string shapes; the route consumes the seam unchanged with the attribution extended to name all three sessions' work", () => {
    // The narrowed arm (the I159-B-I1 closure's own spelling).
    expect(validationSource).toContain(
      'typeof error.message === "string"',
    );
    // The bare arm is GONE (the S157-A/S158-A spelling superseded by
    // the narrowed form — the prior spec's pin re-anchored onto the
    // new spelling by the collateral, the F140 rider).
    expect(validationSource).not.toContain(
      "error instanceof Error ? error.message : String(error)",
    );
    expect(validationSource).toContain('"[unloggable rejection]"');
    // The route's consumption form unchanged (the seam's consumer —
    // the route file stays 154 lines).
    expect(routeSource).toContain("describeRejection(error)");
    // The comment's attribution extended to name the third session's
    // work at the same seam (the S158 precedent's own form).
    expect(routeSource).toContain(
      "every rejection shape (S157-A/S158-A/S159-A)",
    );
  });
});

// ---------------------------------------------------------------------------
// S159-B — the StrictMode-safe mount discriminator
// ---------------------------------------------------------------------------

describe("S159-B the StrictMode-safe mount discriminator (L159-A-L2 — an effect-run discriminator flipped in the sync prefix is misread by the dev double-invoke: the flip rides the COMMIT, never the prefix)", () => {
  it("DEFECT (source — the flip-at-commit form): firstRunRef.current = false sits at the run's LOAD COMMITS (after the project loadProject and at the Untitled fallback's loadProject), NEVER in the sync prefix — exactly two flip sites, the s81 capture and the skip compound verbatim", () => {
    // The capture form (the S81-B pin, preserved verbatim).
    expect(viewSource).toContain("const isMountRun = firstRunRef.current;");
    // The skip compound (the S61-I/S85-A form, preserved verbatim).
    expect(viewSource).toContain(
      "if (!isMountRun && useEditorStore.getState().projectId === projectId) {",
    );
    // THE FLIP-AT-COMMIT FORM: exactly two flip sites.
    const flips = viewSource.match(/firstRunRef\.current = false;/g) ?? [];
    expect(flips.length).toBe(2);
    // The FIRST flip sits AFTER the project-load commit (a flip in
    // the sync prefix — the L159-A-L2 defect's own position — fails
    // this: the prefix precedes the load).
    const flipIdx = viewSource.indexOf("firstRunRef.current = false;");
    const commitIdx = viewSource.indexOf(
      "loadProject(body.data.project as ProjectDTO);",
    );
    expect(flipIdx).toBeGreaterThan(commitIdx);
    // The SECOND flip sits after the Untitled fallback's commit.
    const untitledIdx = viewSource.indexOf("loadProject(UNTITLED_PROJECT);");
    const flip2Idx = viewSource.indexOf(
      "firstRunRef.current = false;",
      untitledIdx,
    );
    expect(flip2Idx).toBeGreaterThan(untitledIdx);
    // The declaration comment names the commit-riding form (the
    // honest registration at the seam).
    expect(strippedSlashComments(viewSource)).toContain(
      "the flip rides the run's LOAD COMMIT",
    );
  });
});

// ---------------------------------------------------------------------------
// S159-C — the layers pointer-only registration
// ---------------------------------------------------------------------------

describe("S159-C the layers pointer-only registration (L159-A-L1 — the S139-B resize-handle-keyboard-posture precedent at the layers family: the parity-borne scope cut registered the session it is found, the absent-equivalent named honestly)", () => {
  it("DEFECT (docs): the AGENTS session-159 bullet carries the registration member — the rename's dblclick-only entry and the reorder's DnD-only form named, the absent keyboard-equivalent named honestly, the working-superset surface the candidate follow-up", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    // The registration member rides the session-159 bullet.
    expect(collapsed(agents)).toContain("L159-A-L1");
    expect(collapsed(agents)).toContain("pointer-only");
    expect(collapsed(agents)).toContain("CANDIDATE FOLLOW-UP");
  });

  it("SURVIVAL (worklog): the bracketed s159-layers-pointer-only-note at its anchor — landed BEFORE this spec's birth (the S139-B precedent's honest survival classification), the absent-equivalent and the candidate follow-up named", () => {
    const note = auditEntry("[s159-layers-pointer-only-note:");
    expect(note).not.toBe("");
    expect(collapsed(note)).toContain("L159-A-L1");
    expect(collapsed(note)).toContain("NO keyboard rename surface");
    expect(collapsed(note)).toContain("CANDIDATE FOLLOW-UP");
  });
});

// ---------------------------------------------------------------------------
// S159-D — the layer's Informational pair
// ---------------------------------------------------------------------------

describe("S159-D the layer's Informational pair (I159-A-I1 the Set-family form at the one missed site + I159-A-I2 the comment enumeration-completion)", () => {
  it("DEFECT (canvas source): the resize-handle pointerdown's live-element lookup rides the SET membership form — the S74-B family's own convention at its one missed site, the O(n·m) includes form absent from the handle window", () => {
    // The handle's pointerdown window (the S134-A live-read seam — the
    // HANDLE branch's capture is the event.target form, unique against
    // the container branches' event.currentTarget spellings).
    const handleIdx = canvasSource.indexOf(
      "(event.target as HTMLElement).setPointerCapture?.(event.pointerId);",
    );
    expect(handleIdx).toBeGreaterThan(-1);
    const window = canvasSource.slice(Math.max(0, handleIdx - 900), handleIdx);
    expect(window).toContain("new Set(store.selectedIds)");
    expect(window).not.toContain("store.selectedIds.includes");
  });

  it("DEFECT (toolbar source): the provenance comment's divider clause completes the enumeration — the plural form naming all three groups (navigate, shape, pen/text/image), the singular under-enumerated form gone (the s158 spec-form precedent: the slash-comment-stripped collapsed form)", () => {
    expect(strippedSlashComments(toolbarSource)).toContain(
      "dividers between the navigate group",
    );
    expect(strippedSlashComments(toolbarSource)).not.toContain(
      "a divider between navigate",
    );
    // The s158 px pin's phrase preserved through the rewording (the
    // sibling claim untouched).
    expect(strippedSlashComments(toolbarSource)).toContain(
      "h-8 w-8 (32px) buttons",
    );
  });
});

// ---------------------------------------------------------------------------
// S159-E — the per-session pin family
// ---------------------------------------------------------------------------

describe("S159-E the per-session pin family (the one-hundred-and-seventh audit's 0C/0H/0M/2L/3I — auditor A's 0C/0H/0M/2L/2I and auditor B's 0C/0H/0M/0L/1I; the F138 guard's ninth verification PASSED and its ninth instance rides this spec)", () => {
  it("SURVIVAL (plan): the F138 guard's NINTH instance — the s158 plan's execution record shipped 7/7 ticked, zero unticked (the pre-armed guard per the session_334 directive; the eighth consecutive cycle of the forward form)", () => {
    // The s158 plan's record section AT ITS ANCHOR: seven boxes, all [x].
    const record = s158PlanSource.slice(
      s158PlanSource.indexOf("## Execution record"),
    );
    const ticked = (record.match(/- \[x\]/g) ?? []).length;
    const unticked = (record.match(/- \[ \]/g) ?? []).length;
    expect(ticked).toBe(7);
    expect(unticked).toBe(0);
    // The s159 plan's own record section exists with the eight-box
    // enumeration (the form; the TICK state is time-dependent —
    // unticked at this spec's birth, ticked at the delivery commit by
    // the F138 forward form, and pinned TICKED by the NEXT cycle's
    // spec at its birth — the guard's tenth instance).
    const s159Record = s159PlanSource.slice(
      s159PlanSource.indexOf("## Execution record"),
    );
    expect((s159Record.match(/- \[[ x]\]/g) ?? []).length).toBe(8);
  });

  it("SURVIVAL (worklog): the two s159 audit entries at their anchors with their live censuses — auditor A's 0C/0H/0M/2L/2I (with L159-A-L1 + L159-A-L2) and auditor B's 0C/0H/0M/0L/1I (with I159-B-I1), the thirty-second consecutive deferral cycle", () => {
    const a = auditEntry("Task ID: s159-auditor-A");
    const b = auditEntry("Task ID: s159-auditor-B");
    expect(a).not.toBe("");
    expect(b).not.toBe("");
    // The entries' own live census spellings.
    expect(collapsed(a)).toContain(
      "0 Critical / 0 High / 0 Medium / 2 Low / 2 Informational",
    );
    expect(collapsed(b)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 1 Informational",
    );
    // Auditor A's findings.
    expect(collapsed(a)).toContain("L159-A-L1");
    expect(collapsed(a)).toContain("L159-A-L2");
    // Auditor B's finding + the deferral verdict.
    expect(collapsed(b)).toContain("I159-B-I1");
    expect(collapsed(b)).toContain("thirty-second consecutive cycle");
  });

  it("SURVIVAL (scripts): the s159 script provenance — live159/nav159/digma-seo-s159 tokens, the 135th/136th/96th ordinals, the S158 delivery at 48923eb2, zero s158 residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live159");
    expect(refAuditSource).toContain("the 135th reference audit");
    expect(refAuditSource).toContain("the S158 delivery at HEAD 48923eb2");
    expect(refAuditSource).toContain("byte-identical the 96th");
    expect(refAuditSource).toContain("ref-audit-s169");
    expect(navSource).toContain("nav159");
    expect(navSource).toContain("the 136th consecutive session");
    expect(navSource).toContain("the FINAL S159 build");
    expect(seoSource).toContain("digma-seo-s159");
    expect(seoSource).toContain("session 159, S159-cycle");
    // Zero s158 run-ordinal residue in the new scripts (the F89 family).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live158");
      expect(src).not.toContain("nav158");
      expect(src).not.toContain("seo-s158");
      expect(src).not.toContain("s168");
      expect(src).not.toContain("134th");
      expect(src).not.toContain("135th session");
      expect(src).not.toContain("135th consecutive");
      expect(src).not.toContain("byte-identical the 95th");
      expect(src).not.toContain("bafca7fb");
    }
  });

  it("SURVIVAL (behavioral — the client-layer contract): the keep-form family intact and the selection arms at their standing contracts (the S159-B flip re-riding and the S159-D Set form leave every store arm untouched — the layer total's movement re-anchored by the collateral, the first movement since S155's comment-only pass)", () => {
    // The five identity-bounded arms: markSaved, deleteElements, undo,
    // redo, restoreSnapshot (the S153-A + S154-A closures, unchanged
    // by this cycle — verified live by the layer-total derivation
    // below).
    const storeSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
      "utf8",
    );
    expect(storeSource).toMatch(/markSaved: \(elements, remap\) =>[\s\S]{0,2600}sameIdSequence/);
    expect(storeSource).toMatch(/deleteElements: \(ids\) =>[\s\S]{0,2200}sameIdSequence/);
    expect(storeSource).toMatch(/undo: \(\) =>[\s\S]{0,1400}sameIdSequence/);
    expect(storeSource).toMatch(/redo: \(\) =>[\s\S]{0,1400}sameIdSequence/);
    expect(storeSource).toMatch(/restoreSnapshot: \(snapshot\) =>[\s\S]{0,2600}sameIdSequence/);
  });

  it("DEFECT (docs): the count re-anchor — the v1.138.0 chain entry carries the S159 derivation (2210 = 2195 + 15 unit / 221 files) + the §7.1 row for the s159 spec + the §11 rows re-anchored (validation.ts 370 → 380, editor-view.tsx 2359 → 2371, canvas.tsx 1075 → 1080)", () => {
    expect(padSource).toMatch(/v1\.138\.0/);
    expect(padSource).toContain("2210 = 2195 + 15 unit / 221 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s159.test.ts`");
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
    // The §11 rows re-anchored (found by CONTENT — the moved figures).
    const validationRow =
      padSource.split("\n").find((l) => l.includes("| `src/lib/validation.ts` |")) ?? "";
    expect(validationRow).toContain("| 380 |");
    const viewRow =
      padSource.split("\n").find((l) => l.includes("| `src/components/editor/editor-view.tsx` |")) ?? "";
    expect(viewRow).toContain("| 2453 |");
    const canvasRow =
      padSource.split("\n").find((l) => l.includes("| `src/components/editor/canvas.tsx` |")) ?? "";
    expect(canvasRow).toContain("| 1092 |");
  });

  it("DEFECT (docs — the forward count-truth guard's sixth instance): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.138.0 block quotes — the count receipt riding the spec instead of prose (the F138 receipt-doctrine shape at the count family)", () => {
    // The live derivation NEVER quotes a figure: wc -l over the exact
    // 22-file composition at spec runtime.
    expect(liveLayerTotal).toBeGreaterThan(14000);
    // The PAD's v1.138.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("SURVIVAL (docs): the pair-unity claim forms riding the constants at every doc — the frozen coincidental literals classified out (the B145-I1 doctrine), every live claim site the same members (the rolling-safe form: this spec's constants equal the s158 spec's constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s158Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s158.test.ts"),
      "utf8",
    );
    // The s158 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s158Unit = s158Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s158Files = s158Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s158Unit).toBe(UNIT);
    expect(s158Files).toBe(FILES);
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

  it("DEFECT (docs): the F146 lesson registered in the digma_SKILL — the string-honesty + StrictMode-flip + registration members inserted after F145, the version bumped to v1.137.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.142\.0/);
    // The lesson: the members after F145.
    const f145At = skillSource.indexOf("F145");
    const f146At = skillSource.indexOf("F146");
    expect(f145At).toBeGreaterThan(-1);
    expect(f146At).toBeGreaterThan(f145At);
    const f146Body = skillSource.slice(f146At, f146At + 3000);
    // The string-honesty member (the : string annotation as a
    // totality claim about the RETURN).
    expect(collapsed(f146Body)).toContain("string");
    // The StrictMode member (the flip rides the commit).
    expect(collapsed(f146Body)).toContain("commit");
  });
});
