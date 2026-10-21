import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-158 spec (the one-hundred-and-sixth audit's chosen work —
// the total rejection-description hardening + the toolbar px-honesty
// repair + the PAD title-lag repair):
//
// S158-A — THE TOTAL REJECTION-DESCRIPTION HARDENING (B158-I1, auditor
//   B's finding, lead-verified live at the seam): the S157-A hardening's
//   String(error) arm is NOT total over rejection shapes — a
//   null-prototype object (Object.create(null)) makes String() itself
//   throw TypeError: Cannot convert object to primitive value (live-
//   probed by the lead); a hostile toString/Symbol.toPrimitive rethrows
//   through the coercion; an Error subclass with a throwing message
//   getter defeats the instanceof arm. In any of those shapes the
//   catch's own log line threw INSIDE the catch, escaping POST as the
//   bare 500 the catch exists to make impossible — while the comment
//   claimed "every rejection shape". The fix: the pure
//   describeRejection(error: unknown): string seam born in
//   src/lib/validation.ts (the truncateUtf16Safe family's canonical
//   home) — the guarded form wrapping BOTH arms inside ONE try, the
//   catch answering "[unloggable rejection]"; the route's catch line
//   consumes it (the import extended IN PLACE on the existing
//   @/lib/validation import line) — the route file stays 154 lines,
//   the route layer stays 2,450, the file OUTSIDE the 22-file client
//   layer (the layer total stays 14,077); validation.ts 355 → 370.
//
// S158-B — THE TOOLBAR COMMENT PX-HONESTY REPAIR (A158-I1, auditor A's
//   finding, lead-verified live at the seam): the toolbar provenance
//   comment read "dark rail, 8px buttons with titles" while the live
//   buttons render h-8 w-8 = 32×32px — every sibling pixel claim in
//   the layer converts Tailwind units to CSS px exactly, so under the
//   codebase's own convention the literal reading was false by 4× (an
//   original-commit shorthand predating the comment-truth eras). The
//   fix: the layer's own conversion form — "h-8 w-8 (32px) buttons" —
//   comment-only at zero line movement (toolbar.tsx stays 89 lines,
//   the layer total stays 14,077).
//
// S158-C — THE PAD TITLE-LAG REPAIR (L158-L1, the lead's own
//   plan-validation discovery — the F125 doctrine working as
//   intended): the PAD title read v1.135.0 while the Last-Updated
//   chain head read v1.136.0 — the S157 delivery's title bump never
//   applied (forensically verified: the title's last movement was the
//   S156 delivery f0ec04f; the title at bafca7fb still v1.135.0), so
//   the S157 claim "docs aligned (PAD v1.136.0 …)" was FALSE at the
//   title seam. The fix: the S158 version bump raises the title onto
//   v1.137.0 (the new chain head — the live-claim form, never a
//   history replay); the bracketed s158-title-lag-repair-note landed
//   BEFORE this spec's birth (the S151-B/.../S157-B precedent); the
//   forward form: a bump script's application is verified AT THE TREE
//   after the run — the title diffed against the chain head, never
//   trusted from the patch list.
//
// S158-D — the per-session pin family: the F138 guard's EIGHTH
//   instance (the s157 plan's record pinned 6/6 ticked at bafca7fb,
//   per the session_328 directive — the pre-armed guard), the audit
//   entries at their anchors (auditor A's 0C/0H/0M/0L/1I with A158-I1;
//   auditor B's 0C/0H/0M/0L/1I with B158-I1; the thirty-first
//   consecutive deferral cycle), the script provenance, the
//   client-layer survival member (the route fix touches a ROUTE file,
//   the helper a lib file OUTSIDE the counted layer, the toolbar fix
//   comment-only — the 22-file layer and its 14,077 total untouched),
//   the pair-unity constants (born rolling-safe at the POST-spec
//   figures 2195/220 — the doc-update re-anchors the docs and the
//   constants TOGETHER), and the doc-side members (the F145 lesson,
//   the count re-anchor, the layer-total guard's fifth instance) that
//   stay RED until the collateral.
//
// Spec-form notes (narrated at birth — the honest form separated from
// the plan's 8 RED / 5 survival forecast, exactly the s153..s157
// precedent's own shape): the born spec carries exactly the plan's
// forecast — 13 pins: 8 RED (the behavioral shape member + the route
// source member + the toolbar member + the title member + the four
// doc-side members incl. the pair-unity RED-until-collateral) / 5
// survival; the behavioral member rides the DYNAMIC import (a static
// import of the not-yet-born export would fail the whole file at
// collection time, taking the survival pins down with it — the
// dynamic form isolates the RED to the one member); ONE spec-form
// repair at birth — the toolbar pin rides the SLASH-COMMENT-STRIPPED
// collapsed form (strippedSlashComments — the s157 shell-form repair's
// TS sibling: the naive collapsed() leaves the '// ' markers between
// TSX comment continuation lines, so the phrase "h-8 w-8 (32px)
// buttons" spanning continuation lines never matches on the first
// run); the collateral count family re-anchors onto 2195 = 2182 + 13
// unit / 220 files (lows-s158.test.ts joins as the 220th file).

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
const s157PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session157.md"),
  "utf8",
);
const s158PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session158.md"),
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
const toolbarSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/toolbar.tsx"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s158.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s158.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s158.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2182 delivery checks + this
 *  spec's 13 = 2195 unit, the 219 delivery files + this spec = 220;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s157 lesson). */
const UNIT = "2361";
const FILES = "231";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** Collapse a TS source's comment body: strip the leading '// '
 *  markers from every line, then collapse whitespace — so a phrase
 *  spanning comment continuation lines matches as contiguous text
 *  (the spec-form repair at birth: the s157 shell-form repair's TS
 *  sibling — the naive collapsed() leaves the '// ' markers between
 *  TSX comment continuation lines, so a phrase spanning continuation
 *  lines never matches; the first run's failure, narrated at the
 *  spec's comment). */
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

/** The figure the v1.148.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its fifth instance). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.148\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S158-A — the total rejection-description hardening
// ---------------------------------------------------------------------------

describe("S158-A the total rejection-description hardening (B158-I1 — the degrade-not-fail catch's own enforcement seam: the description itself must never throw, for ANY rejection shape)", () => {
  it("DEFECT (behavioral — the shape table): describeRejection is total over every rejection shape — an Error logs its .message, primitives log their String() form, and the hostile shapes (a null-prototype object, a hostile toString, a throwing message getter) answer the guarded default (a source pin proves the spelling, a shape pin proves the totality — the F145 form)", async () => {
    // The dynamic import isolates the RED to this member at the spec's
    // birth (a static import of the not-yet-born export would fail the
    // whole file at collection time).
    const { describeRejection } = await import("@/lib/validation");
    // The Error arm.
    expect(describeRejection(new Error("boom"))).toBe("boom");
    // The primitive arms (the S157-A closure's own guarantee, preserved).
    expect(describeRejection(null)).toBe("null");
    expect(describeRejection(undefined)).toBe("undefined");
    expect(describeRejection("raw string")).toBe("raw string");
    expect(describeRejection(42)).toBe("42");
    // The hostile shapes (the B158-I1 residual: String() itself throws
    // on a null-prototype object; a hostile toString rethrows; a
    // throwing message getter defeats the instanceof arm).
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
  });

  it("DEFECT (route source): the catch's warn describes the rejection through the total guarded form — the route consumes describeRejection with the comment naming S157-A/S158-A, the inline unguarded String arm is gone from the route (it lives INSIDE the guarded helper), and validation.ts carries both arms inside ONE try", () => {
    // The route's consumption form (the import extended in place on
    // the existing @/lib/validation line — no new import line, the
    // route file stays 154 lines).
    expect(routeSource).toContain("describeRejection(error)");
    // The comment's attribution extended to name both sessions' work.
    expect(routeSource).toContain("every rejection shape (S157-A/S158-A/S159-A)");
    // The inline unguarded arm is GONE from the route (the B158-I1
    // defect's own spelling — the coercion moved inside the guard).
    expect(routeSource).not.toContain(": String(error)");
    // The guarded form's home: validation.ts wraps BOTH arms in ONE
    // try, the catch answering the guarded default.
    expect(validationSource).toContain(
      'typeof error.message === "string"',
    );
    expect(validationSource).toContain('"[unloggable rejection]"');
  });
});

// ---------------------------------------------------------------------------
// S158-B — the toolbar comment px-honesty repair
// ---------------------------------------------------------------------------

describe("S158-B the toolbar comment px-honesty repair (A158-I1 — a pixel claim follows the layer's own conversion convention: the class AND the converted px, never a bare step index)", () => {
  it("DEFECT (toolbar source): the provenance comment's button-size claim names the class and the converted px together — the bare '8px buttons' shorthand (false by 4x under the layer's own exact-conversion convention) is gone", () => {
    // The honest conversion form (the sibling claims' own spelling:
    // "min-h-11/min-w-11 = 44px", "p-2 + h-4 w-4 = 32x32") — the
    // comment-stripped form (the spec-form repair at birth): the
    // phrase spans continuation lines.
    expect(strippedSlashComments(toolbarSource)).toContain(
      "h-8 w-8 (32px) buttons",
    );
    // The original-commit shorthand is GONE.
    expect(strippedSlashComments(toolbarSource)).not.toContain("8px buttons");
  });
});

// ---------------------------------------------------------------------------
// S158-C — the PAD title-lag repair
// ---------------------------------------------------------------------------

describe("S158-C the PAD title-lag repair (L158-L1 — a live claim site carrying a stale figure: the title never again lags the chain head)", () => {
  it("DEFECT (docs): the PAD title names the current chain head — v1.137.0 (the S157 gap closed at the live seam; the title diffed against the chain head after every bump run, never trusted from the patch list)", () => {
    expect(padSource.split("\n")[0]).toBe(
      "# Digma — Master Project Architecture Document (PAD) v1.148.0",
    );
  });

  it("SURVIVAL (worklog): the s158-title-lag-repair-note bracketed registration — the S157 records' false-at-the-title-seam claim registered (the records never rewritten, S132-C), the bump-verification forward form born (landed BEFORE this spec's birth — the S151-B/.../S157-B precedent's honest survival classification)", () => {
    const note = auditEntry("[s158-title-lag-repair-note:");
    expect(note).not.toBe("");
    expect(collapsed(note)).toContain("never rewritten");
    expect(collapsed(note)).toContain("chain head");
    expect(collapsed(note)).toContain("L158-L1");
  });
});

// ---------------------------------------------------------------------------
// S158-D — the per-session pin family
// ---------------------------------------------------------------------------

describe("S158-D the per-session pin family (the one-hundred-and-sixth audit's 0C/0H/0M/1L/2I — auditor A's 0C/0H/0M/0L/1I and auditor B's 0C/0H/0M/0L/1I plus the lead's L158-L1; the F138 guard's eighth verification PASSED and its eighth instance rides this spec)", () => {
  it("SURVIVAL (plan): the F138 guard's EIGHTH instance — the s157 plan's execution record shipped 6/6 ticked, zero unticked (the pre-armed guard per the session_328 directive; the seventh consecutive cycle of the forward form)", () => {
    // The s157 plan's record section AT ITS ANCHOR: six boxes, all [x].
    const record = s157PlanSource.slice(
      s157PlanSource.indexOf("## Execution record"),
    );
    const ticked = (record.match(/- \[x\]/g) ?? []).length;
    const unticked = (record.match(/- \[ \]/g) ?? []).length;
    expect(ticked).toBe(6);
    expect(unticked).toBe(0);
    // The s158 plan's own record section exists with the seven-box
    // enumeration (the form; the TICK state is time-dependent —
    // unticked at this spec's birth, ticked at the delivery commit by
    // the F138 forward form, and pinned TICKED by the NEXT cycle's
    // spec at its birth — the guard's ninth instance).
    const s158Record = s158PlanSource.slice(
      s158PlanSource.indexOf("## Execution record"),
    );
    expect((s158Record.match(/- \[[ x]\]/g) ?? []).length).toBe(7);
  });

  it("SURVIVAL (worklog): the two s158 audit entries at their anchors with their live censuses — auditor A's 0C/0H/0M/0L/1I (with A158-I1, the layer figure live-true) and auditor B's 0C/0H/0M/0L/1I (with B158-I1), the thirty-first consecutive deferral cycle", () => {
    const a = auditEntry("Task ID: s158-auditor-A");
    const b = auditEntry("Task ID: s158-auditor-B");
    expect(a).not.toBe("");
    expect(b).not.toBe("");
    // The entries' own live census spellings.
    expect(collapsed(a)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 1 Informational",
    );
    expect(collapsed(b)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 1 Informational",
    );
    // Auditor A's finding + the layer figure.
    expect(collapsed(a)).toContain("A158-I1");
    expect(collapsed(a)).toContain("14,077");
    // Auditor B's finding + the deferral verdict.
    expect(collapsed(b)).toContain("B158-I1");
    expect(collapsed(b)).toContain("thirty-first consecutive cycle");
  });

  it("SURVIVAL (scripts): the s158 script provenance — live158/nav158/digma-seo-s158 tokens, the 134th/135th/95th ordinals, the S157 delivery at bafca7fb, zero s157 residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live158");
    expect(refAuditSource).toContain("the 134th reference audit");
    expect(refAuditSource).toContain("the S157 delivery at HEAD bafca7fb");
    expect(refAuditSource).toContain("byte-identical the 95th");
    expect(refAuditSource).toContain("ref-audit-s168");
    expect(navSource).toContain("nav158");
    expect(navSource).toContain("the 135th consecutive session");
    expect(navSource).toContain("the FINAL S158 build");
    expect(seoSource).toContain("digma-seo-s158");
    expect(seoSource).toContain("session 158, S158-cycle");
    // Zero s157 run-ordinal residue in the new scripts (the F89 family).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live157");
      expect(src).not.toContain("nav157");
      expect(src).not.toContain("seo-s157");
      expect(src).not.toContain("s167");
      expect(src).not.toContain("133rd");
      expect(src).not.toContain("134th session");
      expect(src).not.toContain("134th consecutive");
      expect(src).not.toContain("byte-identical the 94th");
      expect(src).not.toContain("f0ec04f");
    }
  });

  it("SURVIVAL (behavioral — the client-layer contract unchanged by this route+validation+comment cycle): the keep-form family intact and the selection arms at their standing contracts (the route fix touches a ROUTE file, the helper a lib file OUTSIDE the counted layer, the toolbar fix comment-only at zero line movement — the 22-file layer total stays 14,077)", () => {
    // The five identity-bounded arms: markSaved, deleteElements, undo,
    // redo, restoreSnapshot (the S153-A + S154-A closures, unchanged
    // by this cycle — the zero client-layer line movement verified
    // live by the layer-total derivation below).
    const storeSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
      "utf8",
    );
    expect(storeSource).toMatch(/markSaved: \(elements, remap\) =>[\s\S]{0,2600}sameIdSequence/);
    expect(storeSource).toMatch(/deleteElements: \(ids\) =>[\s\S]{0,2200}sameIdSequence/);
    expect(storeSource).toMatch(/undo: \(\) =>[\s\S]{0,1400}sameIdSequence/);
    expect(storeSource).toMatch(/redo: \(\) =>[\s\S]{0,1400}sameIdSequence/);
    expect(storeSource).toMatch(/restoreSnapshot: \(snapshot\) =>[\s\S]{0,2600}sameIdSequence/);
    // The live 22-file layer total rides the standing figure (both
    // fixes leave the counted layer untouched).
    // RE-ANCHORED onto 14307 by the S167-A rider (teams-view +12 —
    // the F40 prior-spec re-anchor: the claim stays true, the pinned
    // figure moves with the live tree).
    expect(liveLayerTotal).toBe(14307);
  });

  it("DEFECT (docs): the count re-anchor — the v1.137.0 chain entry carries the S158 derivation (2195 = 2182 + 13 unit / 220 files) + the §7.1 row for the s158 spec + the §11 validation.ts row re-anchored (355 → 370)", () => {
    expect(padSource).toMatch(/v1\.137\.0/);
    expect(padSource).toContain("2195 = 2182 + 13 unit / 220 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s158.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's fifth instance): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.137.0 block quotes — the count receipt riding the spec instead of prose (the F138 receipt-doctrine shape at the count family)", () => {
    // The live derivation NEVER quotes a figure: wc -l over the exact
    // 22-file composition at spec runtime.
    expect(liveLayerTotal).toBeGreaterThan(14000);
    // The PAD's v1.137.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("SURVIVAL (docs): the pair-unity claim forms riding the constants at every doc — the frozen coincidental literals classified out (the B145-I1 doctrine), every live claim site the same members (the rolling-safe form: this spec's constants equal the s157 spec's constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s157Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s157.test.ts"),
      "utf8",
    );
    // The s157 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s157Unit = s157Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s157Files = s157Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s157Unit).toBe(UNIT);
    expect(s157Files).toBe(FILES);
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

  it("DEFECT (docs): the F145 lesson registered in the digma_SKILL — the total-coercion member inserted after F144, the version bumped to v1.136.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.147\.0/);
    // The lesson: the total-coercion member after F144.
    const f144At = skillSource.indexOf("F144");
    const f145At = skillSource.indexOf("F145");
    expect(f144At).toBeGreaterThan(-1);
    expect(f145At).toBeGreaterThan(f144At);
    const f145Body = skillSource.slice(f145At, f145At + 2400);
    expect(collapsed(f145Body)).toContain("coercion");
    // The standing form's own default-answer spelling (the guarded
    // catch's answer — the lesson's own mechanism).
    expect(collapsed(f145Body)).toContain("[unloggable rejection]");
  });
});
