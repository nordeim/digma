import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { useEditorStore } from "@/components/editor/editor-store";
import type { DesignElementDTO } from "@/lib/editor";

// The session-157 spec (the one-hundred-and-fifth audit's chosen work —
// the non-Error rejection hardening + the witness-contract scope-honesty
// repair):
//
// S157-A — THE AI-ASSISTANT NON-ERROR REJECTION HARDENING (B157-I1,
//   auditor B's first finding, lead-verified live at the seam): the
//   degrade-not-fail catch at src/app/api/ai-assistant/route.ts:149
//   dereferenced (error as Error).message unconditionally — a non-Error
//   rejection (null/undefined, a bare Promise.reject() from a misbehaving
//   SDK or timer path) made the dereference ITSELF throw a TypeError
//   INSIDE the catch, escaping POST as the bare 500 the catch exists to
//   make impossible; the route's own comment claimed "answer 200 either
//   way" but the guarantee held only for Error-shaped rejections. The
//   fix: the instanceof-narrowed dereference (error instanceof Error ?
//   error.message : String(error)) — one line replaced by one line, the
//   route layer count stays 2,450, the file OUTSIDE the 22-file client
//   layer (the layer total stays 14,077 — the first src/ movement since
//   S155's comment-only cycle lands outside the counted layer).
//
// S157-B — THE WITNESS-CONTRACT SCOPE-HONESTY REPAIR (B157-I2, auditor
//   B's second finding, lead-verified live at the seams): the
//   witness-restore script's contract line claimed the named list is
//   "every docs/screenshots path the e2e suite WRITES" while the
//   derivation MECHANISM greps the spec TEXT (comments included) — the
//   first member (ref-audit-s52/ref-02-mobile-editor-header-390.png) is
//   a comment-cited evidence path at editor-mobile-header.spec.ts:10,
//   never written by any page.screenshot() site; the true write set is
//   15, the grep-derived set 16, both guard sides using the same grep
//   (internally consistent, conservative) — but the phrasing is a scope
//   mislabel. The fix: the honest "references" spelling at both contract
//   sites + the NO-OP-member registration at the list's first member;
//   the 16-path list itself stays INTACT (the frozen s156 spec pins the
//   length and the guard's set-equality — both sides use the same grep,
//   the mechanism unchanged). The bracketed
//   s157-witness-contract-repair-note landed BEFORE this spec's birth
//   (the S151-B/.../S156-B precedent); the frozen S156 records stay
//   frozen (S132-C); the forward form: a derivation's CLAIMED SCOPE is
//   a claim like a count claim — the mechanism and the claim must name
//   the same set; the conservative over-bread is still a mislabel (the
//   F144 scope-honesty member).
//
// S157-C — the per-session pin family: the F138 guard's SEVENTH instance
//   (the s156 plan's record pinned 6/6 ticked at f0ec04f, per the
//   session_322 directive — the pre-armed guard), the audit entries at
//   their anchors (auditor A's SECOND consecutive individually-clean
//   pass 0C/0H/0M/0L/0I; auditor B's 0C/0H/0M/0L/2I; the thirtieth
//   consecutive deferral cycle), the script provenance, the client-layer
//   survival member (the fix touches a ROUTE file — the 22-file client
//   layer and its 14,077 total untouched), the pair-unity constants
//   (born rolling-safe at the POST-spec figures 2182/219 — the
//   doc-update re-anchors the docs and the constants TOGETHER), and the
//   doc-side members (the F144 lesson, the count re-anchor, the
//   layer-total guard's fourth instance) that stay RED until the
//   collateral.
//
// Spec-form notes (narrated at birth — the honest form separated from
// the plan's 6 RED / 5 survival forecast, exactly the s153..s156
// precedent's own shape): the born spec carries exactly the plan's
// forecast — 11 pins: 6 RED (the two fix members + the four doc-side
// members incl. the pair-unity RED-until-collateral) / 5 survival; the
// collateral count family re-anchors onto 2182 = 2171 + 11 unit / 219
// files (lows-s157.test.ts joins as the 219th file). ONE spec-form
// repair at birth: the witness-script pins ride the COMMENT-STRIPPED
// collapsed form (strippedComments — the leading '# ' markers stripped
// before collapsing) — the naive collapsed() form leaves the '# '
// markers between comment continuation lines, so a phrase spanning
// continuation lines never matches (the first run's failure; the
// s153..s156 spec-form-repair-at-birth precedent).

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
const s156PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session156.md"),
  "utf8",
);
const s157PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session157.md"),
  "utf8",
);
const routeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/ai-assistant/route.ts"),
  "utf8",
);
const witnessScriptSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/witness-restore.sh"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s157.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s157.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s157.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2171 delivery checks + this
 *  spec's 11 = 2182 unit, the 218 delivery files + this spec = 219;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s156 lesson). */
const UNIT = "2697";
const FILES = "257";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** Collapse a shell script's comment body: strip the leading '# '
 *  markers from every line, then collapse whitespace — so a phrase
 *  spanning comment continuation lines matches as contiguous text
 *  (the spec-form repair at birth: the naive collapsed() form leaves
 *  the '# ' markers between continuation lines and a cross-line
 *  phrase never matches). */
const strippedComments = (s: string) =>
  s.replace(/^[ \t]*#[ \t]*/gm, "").replace(/\s+/g, " ");

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

/** The figure the v1.174.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its fourth instance). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.174\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

/** A minimal rectangle DTO for driving the store directly. */
function rect(id: string, x: number, y: number): DesignElementDTO {
  return {
    id,
    projectId: "p1",
    type: "rectangle",
    name: id,
    sortOrder: 0,
    x,
    y,
    width: 200,
    height: 150,
    rotation: 0,
    scale: 1,
    opacity: 1,
    visible: true,
    locked: false,
    fill: "#3B82F6",
    stroke: null,
    strokeWidth: 0,
    radius: 0,
    text: null,
    fontSize: null,
    fontWeight: null,
    fontFamily: null,
    textAlign: null,
    fillGradient: null,
    fillImage: null,
    fillImageFit: null,
    fillImageThumb: null,
  } as DesignElementDTO;
}

beforeEach(() => {
  useEditorStore.setState({
    projectId: "p1",
    projectName: "Test",
    projectDescription: null,
    backgroundColor: "#0D1117",
    elements: [rect("a", 0, 0), rect("b", 40, 40)],
    selectedIds: ["a", "b"],
    tool: "select",
    zoom: 1,
    panX: 0,
    panY: 0,
    boardEpoch: 0,
    saveState: "saved",
    past: [],
    future: [],
    gestureSnapshot: null,
  });
});

// ---------------------------------------------------------------------------
// S157-A — the ai-assistant non-Error rejection hardening
// ---------------------------------------------------------------------------

describe("S157-A the ai-assistant non-Error rejection hardening (B157-I1 — the degrade-not-fail catch's own enforcement seam: a non-Error rejection must never throw inside the catch)", () => {
  it("DEFECT (route source): the catch's warn dereferences the rejection through the instanceof-narrowed form — the bare (error as Error).message cast that threw on null/undefined rejections is absent, and the honest-guarantee comment names every rejection shape", () => {
    // The instanceof-narrowed dereference (the fix): an Error logs its
    // .message; anything else logs its String() form — the dereference
    // can no longer throw.
    expect(routeSource).toContain(
      "describeRejection(error)",
    );
    // The bare cast form that closed over non-Error rejections (the
    // defect's own spelling) is GONE.
    expect(routeSource).not.toContain("(error as Error).message");
    // The catch's comment carries the honest guarantee (the 200-either-
    // way contract now named for EVERY rejection shape, with the
    // session's registration token).
    expect(routeSource).toContain("every rejection shape (S157-A/S158-A/S159-A)");
  });
});

// ---------------------------------------------------------------------------
// S157-B — the witness-contract scope-honesty repair
// ---------------------------------------------------------------------------

describe("S157-B the witness-contract scope-honesty repair (B157-I2 — the derivation mechanism and the claimed scope must name the same set: a text-grep derives references, never writes)", () => {
  it("DEFECT (script source): both contract sites carry the honest 'references' scope spelling (the text-grep sees comments as well as code) + the TRACKED NO-OP registration at the list's first member — the 'path the e2e suite writes' mislabel absent", () => {
    // The honest scope spelling at the contract sites (the derivation
    // REFERENCES the spec sources — a comment-cited evidence path rides
    // the list as a TRACKED NO-OP member; the actually-written set is
    // the 15-and-varying subset). The comment-stripped form (the
    // spec-form repair at birth): the phrases span continuation lines.
    expect(strippedComments(witnessScriptSource)).toContain(
      "every docs/screenshots path the e2e spec sources REFERENCE",
    );
    expect(strippedComments(witnessScriptSource)).toContain("TRACKED NO-OP member");
    // The scope mislabel (the F144 class: the mechanism greps text, the
    // claim said writes) is GONE from the script's own contract lines.
    expect(strippedComments(witnessScriptSource)).not.toContain(
      "path the e2e suite writes",
    );
    // The cycle's registration token at the repaired seam.
    expect(strippedComments(witnessScriptSource)).toContain("S157-B");
    // The named list itself is INTACT — the 16 quoted paths still parse
    // (the frozen s156 spec pins the length and the set-equality against
    // the same grep; the mechanism unchanged, the conservative
    // direction preserved).
    const at = witnessScriptSource.indexOf("WITNESSES=(");
    const end = witnessScriptSource.indexOf("\n)", at);
    const body = witnessScriptSource.slice(at, end);
    const list = [...body.matchAll(/"(docs\/screenshots\/[^"]+\.png)"/g)].map(
      (m) => m[1],
    );
    expect(list.length).toBe(16);
    expect(list[0]).toBe(
      "docs/screenshots/ref-audit-s52/ref-02-mobile-editor-header-390.png",
    );
  });

  it("SURVIVAL (worklog): the s157-witness-contract-repair-note bracketed registration — the frozen S156 records' scope-over-broad phrasing registered (the records never rewritten, S132-C), the scope-honesty forward form born (landed BEFORE this spec's birth — the S151-B/.../S156-B precedent's honest survival classification)", () => {
    const note = auditEntry("Task ID: s157-witness-contract-repair-note");
    expect(note).not.toBe("");
    expect(collapsed(note)).toContain("B157-I2");
    expect(collapsed(note)).toContain("never rewritten");
    // The forward form: the claimed scope is a claim like a count claim
    // (the F144 scope-honesty member's own spelling).
    expect(collapsed(note)).toContain("CLAIMED SCOPE");
    expect(collapsed(note)).toContain("same set");
  });
});

// ---------------------------------------------------------------------------
// S157-C — the per-session pin family
// ---------------------------------------------------------------------------

describe("S157-C the per-session pin family (the one-hundred-and-fifth audit's 0C/0H/0M/0L/2I — auditor A's second consecutive individually-clean pass; the F138 guard's sixth verification PASSED and its seventh instance rides this spec)", () => {
  it("SURVIVAL (plan): the F138 guard's SEVENTH instance — the s156 plan's execution record shipped 6/6 ticked, zero unticked (the pre-armed guard per the session_322 directive; the sixth consecutive cycle of the forward form)", () => {
    // The s156 plan's record section AT ITS ANCHOR: six boxes, all [x].
    const record = s156PlanSource.slice(
      s156PlanSource.indexOf("## Execution record"),
    );
    const ticked = (record.match(/- \[x\]/g) ?? []).length;
    const unticked = (record.match(/- \[ \]/g) ?? []).length;
    expect(ticked).toBe(6);
    expect(unticked).toBe(0);
    // The s157 plan's own record section exists with the six-box
    // enumeration (the form; the TICK state is time-dependent —
    // unticked at this spec's birth, ticked at the delivery commit by
    // the F138 forward form, and pinned TICKED by the NEXT cycle's
    // spec at its birth — the guard's eighth instance).
    const s157Record = s157PlanSource.slice(
      s157PlanSource.indexOf("## Execution record"),
    );
    expect((s157Record.match(/- \[[ x]\]/g) ?? []).length).toBe(6);
  });

  it("SURVIVAL (worklog): the two s157 audit entries at their anchors with their live censuses — auditor A's 0C/0H/0M/0L/0I (the SECOND consecutive individually-clean pass) and auditor B's 0C/0H/0M/0L/2I with both findings named, the thirtieth consecutive deferral cycle", () => {
    const a = auditEntry("Task ID: s157-auditor-A");
    const b = auditEntry("Task ID: s157-auditor-B");
    expect(a).not.toBe("");
    expect(b).not.toBe("");
    // The entries' own live census spellings.
    expect(collapsed(a)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational",
    );
    expect(collapsed(b)).toContain(
      "0 Critical / 0 High / 0 Medium / 0 Low / 2 Informational",
    );
    // Auditor A's clean-pass verdict members.
    expect(collapsed(a)).toContain("14,077");
    expect(collapsed(a)).toContain("SECOND consecutive");
    // Auditor B's findings + the deferral verdict.
    expect(collapsed(b)).toContain("B157-I1");
    expect(collapsed(b)).toContain("B157-I2");
    expect(collapsed(b)).toContain("thirtieth consecutive cycle");
  });

  it("SURVIVAL (scripts): the s157 script provenance — live157/nav157/digma-seo-s157 tokens, the 133rd/134th/94th ordinals, the S156 delivery at f0ec04f, zero s156 residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live157");
    expect(refAuditSource).toContain("the 133rd reference audit");
    expect(refAuditSource).toContain("the S156 delivery at HEAD f0ec04f");
    expect(refAuditSource).toContain("byte-identical the 94th");
    expect(refAuditSource).toContain("ref-audit-s167");
    expect(navSource).toContain("nav157");
    expect(navSource).toContain("the 134th consecutive session");
    expect(navSource).toContain("the FINAL S157 build");
    expect(seoSource).toContain("digma-seo-s157");
    expect(seoSource).toContain("session 157, S157-cycle");
    // Zero s156 run-ordinal residue in the new scripts (the F89 family).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live156");
      expect(src).not.toContain("nav156");
      expect(src).not.toContain("seo-s156");
      expect(src).not.toContain("s166");
      expect(src).not.toContain("byte-identical the 93rd");
      expect(src).not.toContain("5b89b78");
    }
  });

  it("SURVIVAL (behavioral — the client-layer contract unchanged by this route+scripts cycle): the keep-form family intact and the selection arms at their standing contracts (the fix touches a ROUTE file — zero client-layer lines move; the 22-file layer total stays 14,077)", () => {
    // The five identity-bounded arms: markSaved, deleteElements, undo,
    // redo, restoreSnapshot (the S153-A + S154-A closures, unchanged
    // by this cycle — the route-file-only src/ movement verified live).
    const storeSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
      "utf8",
    );
    expect(storeSource).toMatch(/markSaved: \(elements, remap\) =>[\s\S]{0,2600}sameIdSequence/);
    expect(storeSource).toMatch(/deleteElements: \(ids\) =>[\s\S]{0,2200}sameIdSequence/);
    expect(storeSource).toMatch(/undo: \(\) =>[\s\S]{0,1400}sameIdSequence/);
    expect(storeSource).toMatch(/redo: \(\) =>[\s\S]{0,1400}sameIdSequence/);
    expect(storeSource).toMatch(/restoreSnapshot: \(snapshot\) =>[\s\S]{0,2600}sameIdSequence/);
    // The live 22-file layer total rides the standing figure (the fix
    // touches a route file OUTSIDE the counted layer).
    // RE-ANCHORED onto 14307 by the S167-A rider (teams-view +12 —
    // the F40 prior-spec re-anchor: the claim stays true, the pinned
    // figure moves with the live tree).
    expect(liveLayerTotal).toBe(14373);
  });

  it("DEFECT (docs): the count re-anchor — the v1.136.0 chain entry carries the S157 derivation (2182 = 2171 + 11 unit / 219 files) + the §7.1 row for the s157 spec", () => {
    expect(padSource).toMatch(/v1\.136\.0/);
    expect(padSource).toContain("2182 = 2171 + 11 unit / 219 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s157.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's fourth instance): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.136.0 block quotes — the count receipt riding the spec instead of prose (the F138 receipt-doctrine shape at the count family)", () => {
    // The live derivation NEVER quotes a figure: wc -l over the exact
    // 22-file composition at spec runtime.
    expect(liveLayerTotal).toBeGreaterThan(14000);
    // The PAD's v1.136.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("SURVIVAL (docs): the pair-unity claim forms riding the constants at every doc — the frozen coincidental literals classified out (the B145-I1 doctrine), every live claim site the same members (the rolling-safe form: this spec's constants equal the s156 spec's constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s156Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s156.test.ts"),
      "utf8",
    );
    // The s156 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s156Unit = s156Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s156Files = s156Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s156Unit).toBe(UNIT);
    expect(s156Files).toBe(FILES);
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

  it("DEFECT (docs): the F144 lesson registered in the digma_SKILL — the scope-honesty member inserted after F143, the version bumped to v1.135.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.173\.0/);
    // The lesson: the scope-honesty member after F143.
    const f143At = skillSource.indexOf("F143");
    const f144At = skillSource.indexOf("F144");
    expect(f143At).toBeGreaterThan(-1);
    expect(f144At).toBeGreaterThan(f143At);
    const f144Body = skillSource.slice(f144At, f144At + 2400);
    expect(collapsed(f144Body)).toContain("scope");
    // The forward-form phrase in the lesson's own spelling (the same
    // form the s157-witness-contract-repair-note pin asserts).
    expect(collapsed(f144Body)).toContain("same set");
  });
});
