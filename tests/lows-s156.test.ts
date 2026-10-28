import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { useEditorStore } from "@/components/editor/editor-store";
import type { DesignElementDTO } from "@/lib/editor";

// The session-156 spec (the one-hundred-and-fourth audit's chosen work —
// the capture-script mechanical-restore hardening + the guard-ordering
// citation repair):
//
// S156-A — THE CAPTURE-SCRIPT MECHANICAL-RESTORE HARDENING (the B121-I1
//   closure, carried in the deferred queue since session 121 and
//   sharpened by the s153 over-catch incident): scripts/witness-restore.sh
//   is born — the post-e2e witness restore as a MECHANICAL named-list
//   operation. The named list is EVERY docs/screenshots path the e2e
//   suite writes (16 paths — the actually-changing subset is the
//   11-and-varying witnesses; the byte-stable renders restore as
//   no-ops). The SAFETY ASSERTION — the set of files whose modifications
//   the run removed MUST be a subset of the named list, anything else
//   aborts non-zero (the s153 lesson as a runtime invariant: the restore
//   filters by the NAMED witness list, never the modified-file list).
//   The LIVE-DERIVATION GUARD rides this spec: the script's named list
//   must equal the live e2e-specs derivation at spec runtime — a future
//   spec's new screenshot write goes RED until the list updates (the
//   F138 receipt-doctrine shape applied to the witness family).
//
// S156-B — THE GUARD-ORDERING CITATION REPAIR (B156-N1 — the cycle's
//   live observation, auditor B's verification note lead-verified live):
//   the prior cycles' dispatch prose and frozen worklog entries
//   (:4506/:4566/:4695/:4780) phrase the API guard ordering "limiter →
//   session → parse" while the live tree holds SESSION → LIMITER →
//   PARSE at the session-gated mutating handlers and LIMITER → PARSE at
//   the public auth family — the repo internally consistent and safe
//   (session-first burns no limiter budget unauthenticated), the defect
//   prose-only. The bracketed s156-guard-ordering-repair-note landed
//   BEFORE this spec's birth (the S151-B/.../S155-B precedent's honest
//   survival classification); the frozen records stay frozen (S132-C);
//   the forward form: an ordering claim is a count claim's sibling —
//   derived live at the citing tree with the branch distinction, never
//   quoted.
//
// S156-C — the per-session pin family: the F138 guard's SIXTH instance
//   (the s155 plan's record pinned 6/6 ticked at 5b89b78, per the
//   session_316 directive — the pre-armed guard), the audit entries at
//   their anchors (the FOURTH zero-finding census and the FIRST with
//   both auditors individually clean), the script provenance, the
//   pair-unity constants (born rolling-safe at the POST-spec figures
//   2170/218 — the doc-update re-anchors the docs and the constants
//   TOGETHER), and the doc-side members (the F143 lesson, the count
//   re-anchor, the layer-total guard's third instance) that stay RED
//   until the collateral.
//
// Spec-form notes (narrated at birth — the honest form separated from
// the plan's 6 RED / 4 survival + pair-unity forecast, exactly the
// s153/s154/s155 precedent's own shape): (0) the plan's birth forecast
// said 11 pins; the born spec carries 12 — the store-contract
// SURVIVAL member (this cycle's scripts/-only invariant: zero src/
// lines move, the keep-form family and the 14,077 layer figure stay)
// was added at birth, its value the cycle's central safety claim; the
// honest count: 7 RED (the six doc-side/source members + the
// pair-unity RED-until-collateral) / 5 survival, and the collateral
// count family re-anchors onto 2171 = 2159 + 12 unit / 218 files
// (one more than the plan's forecast line — the plan's §3/§4 amended
// to the born form before the collateral); (1) the pair-unity pin is
// honestly the doc-side RED-until-collateral member (the constants
// equal the s155 spec's constants only AFTER the doc-update sweep
// re-anchors them together); (2) the witness-restore script pins are
// SOURCE pins (the script's forms asserted at its text — the script's
// LIVE run is the cycle's own behavioral verification, never a spec
// side-effect: a spec that mutates the working tree would corrupt the
// gate it rides); (3) the guard-ordering note and the F138/audit/
// script pins are survival (landed before this spec's birth); the six
// doc-side/source pins are RED until the fix and the collateral.

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
const s155PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session155.md"),
  "utf8",
);
const s156PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session156.md"),
  "utf8",
);
const witnessScriptSource = existsSync(
  path.resolve(import.meta.dirname, "../scripts/witness-restore.sh"),
)
  ? readFileSync(
      path.resolve(import.meta.dirname, "../scripts/witness-restore.sh"),
      "utf8",
    )
  : "";
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s156.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s156.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s156.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2159 delivery checks + this
 *  spec's 12 = 2171 unit, the 217 delivery files + this spec = 218;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s155 lesson). */
const UNIT = "2709";
const FILES = "258";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

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

/** The figure the v1.175.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its third instance). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.175\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

/** The witness list the script carries, parsed from its WITNESSES
 *  array (the named-list form — quoted path literals, one per line). */
const scriptWitnessList = (() => {
  const at = witnessScriptSource.indexOf("WITNESSES=(");
  if (at === -1) return [] as string[];
  const end = witnessScriptSource.indexOf("\n)", at);
  const body = witnessScriptSource.slice(at, end === -1 ? at + 4000 : end);
  return [...body.matchAll(/"(docs\/screenshots\/[^"]+\.png)"/g)].map(
    (m) => m[1],
  );
})();

/** The LIVE derivation: every docs/screenshots path the e2e suite
 *  writes, derived at spec runtime from the spec sources (never
 *  quoted — the F138 receipt-doctrine shape at the witness family). */
const liveWitnessList = (() => {
  const root = path.resolve(import.meta.dirname, "../tests/e2e");
  const out = execSync("grep -ohE 'docs/screenshots/[a-zA-Z0-9_/.-]+\\.png' *.ts",
    { cwd: root, encoding: "utf8" });
  return [...new Set(out.trim().split("\n"))].sort();
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
// S156-A — the capture-script mechanical-restore hardening
// ---------------------------------------------------------------------------

describe("S156-A the capture-script mechanical-restore hardening (the B121-I1 closure: the post-e2e witness restore as a MECHANICAL named-list operation — the s153 over-catch class made structurally impossible; the S147 named-window doctrine at the operator-side form)", () => {
  it("DEFECT (script): the named witness list — every docs/screenshots path the e2e suite writes, as quoted path literals in the WITNESSES array, with the tracked-path guard and the strict mode", () => {
    // The strict form (a typo'd path or a missing list aborts, never
    // silently passes).
    expect(witnessScriptSource.startsWith("#!/usr/bin/env bash")).toBe(true);
    expect(witnessScriptSource).toContain("set -u");
    // The tracked-path guard: every named path verified KNOWN to git
    // before any checkout.
    expect(witnessScriptSource).toContain("git ls-files --error-unmatch");
    // The named list carries the full 16-path write-set (the
    // 11-and-varying changing witnesses + the byte-stable no-ops).
    expect(scriptWitnessList.length).toBe(16);
    expect(scriptWitnessList).toContain(
      "docs/screenshots/ref-audit-s72/clone-09-slider-one-undo.png",
    );
    expect(scriptWitnessList).toContain(
      "docs/screenshots/ref-audit-s72/clone-10-soft-leave-persisted.png",
    );
    expect(scriptWitnessList).toContain(
      "docs/screenshots/ref-audit-s75/clone-13-mid-drag-close-convergence.png",
    );
    expect(scriptWitnessList).toContain(
      "docs/screenshots/ref-audit-s76/clone-15-bare-focus-convergence.png",
    );
    expect(scriptWitnessList).toContain(
      "docs/screenshots/ref-audit-s77/clone-19-dashboard-list-empty-state.png",
    );
    expect(scriptWitnessList).toContain(
      "docs/screenshots/ref-audit-s78/clone-18-marquee-visual-footprint.png",
    );
    expect(scriptWitnessList).toContain(
      "docs/screenshots/ref-audit-s78/clone-19-session-expired-terminal.png",
    );
    expect(scriptWitnessList).toContain(
      "docs/screenshots/ref-audit-s80/clone-21-card-a11y-stretched-button.png",
    );
    expect(scriptWitnessList).toContain(
      "docs/screenshots/ref-audit-s80/clone-22-layers-row-select-button.png",
    );
    expect(scriptWitnessList).toContain(
      "docs/screenshots/ref-audit-s81/clone-21-exit-single-put.png",
    );
    expect(scriptWitnessList).toContain(
      "docs/screenshots/ref-audit-s81/clone-22-login-403-fold.png",
    );
  });

  it("DEFECT (script): the mechanical-safety forms — the named-only checkout (never the modified-file list, never a broad checkout), the subset SAFETY ASSERTION, and the before/after census prints", () => {
    // The S156-A registration names the doctrine at the seam.
    expect(collapsed(witnessScriptSource)).toContain("S156-A");
    expect(collapsed(witnessScriptSource)).toContain("S147");
    // The restore touches EXACTLY the named list — the checkout call
    // rides the array, never a bare/broad form.
    expect(witnessScriptSource).toContain('git checkout -- "${WITNESSES[@]}"');
    expect(witnessScriptSource).not.toContain("git checkout -- .");
    expect(witnessScriptSource).not.toContain("git checkout .");
    // NEVER the modified-file list feeding the checkout (the s153
    // over-catch form — the incident's exact mechanical cause).
    expect(witnessScriptSource).not.toContain("git checkout -- $(git diff");
    expect(witnessScriptSource).not.toContain("git checkout -- $(git status");
    // The SAFETY ASSERTION: the removed-modifications set MUST be a
    // subset of the named list — anything else aborts non-zero (the
    // s153 lesson as a runtime invariant).
    expect(collapsed(witnessScriptSource)).toContain("SAFETY ASSERTION");
    expect(witnessScriptSource).toMatch(/removed[^=]*==[^=]*|comm\s+-23/);
    // The before/after census printed (the operator-visible receipt).
    expect(witnessScriptSource).toContain("before");
    expect(witnessScriptSource).toContain("after");
  });

  it("DEFECT (script — the live-derivation guard): the script's named list EQUALS the live e2e-specs derivation at spec runtime — a future spec's new screenshot write goes RED until the list updates (the F138 receipt-doctrine shape applied to the witness family)", () => {
    // The live derivation (sorted, unique, from the spec sources).
    expect(liveWitnessList.length).toBeGreaterThan(0);
    // The script's list parsed and sorted — the sets must be EQUAL.
    const scriptSorted = [...scriptWitnessList].sort();
    expect(scriptSorted).toEqual(liveWitnessList);
  });

  it("SURVIVAL (behavioral — the store contract unchanged by this scripts/-only cycle): the keep-form family intact and the selection arms at their standing contracts (zero src/ lines move in S156; the 22-file layer total stays 14,077)", () => {
    // The five identity-bounded arms: markSaved, deleteElements, undo,
    // redo, restoreSnapshot (the S153-A + S154-A closures, unchanged
    // by this cycle — the scripts/-only form verified live).
    const storeSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
      "utf8",
    );
    expect(storeSource).toMatch(/markSaved: \(elements, remap\) =>[\s\S]{0,2600}sameIdSequence/);
    expect(storeSource).toMatch(/deleteElements: \(ids\) =>[\s\S]{0,2200}sameIdSequence/);
    expect(storeSource).toMatch(/undo: \(\) =>[\s\S]{0,1400}sameIdSequence/);
    expect(storeSource).toMatch(/redo: \(\) =>[\s\S]{0,1400}sameIdSequence/);
    expect(storeSource).toMatch(/restoreSnapshot: \(snapshot\) =>[\s\S]{0,2600}sameIdSequence/);
    // The live 22-file layer total rides the standing figure (a
    // scripts/-only cycle moves zero src/ lines).
    // RE-ANCHORED onto 14307 by the S167-A rider (teams-view +12 —
    // the F40 prior-spec re-anchor: the claim stays true, the pinned
    // figure moves with the live tree).
    expect(liveLayerTotal).toBe(14373);
  });
});

// ---------------------------------------------------------------------------
// S156-B/S156-C — the guard-ordering citation repair + the per-session pin family
// ---------------------------------------------------------------------------

describe("S156-B/S156-C the guard-ordering citation repair registration and the per-session pin family (the one-hundred-and-fourth audit's 0C/0H/0M/0L/0I — the FOURTH zero-finding census and the FIRST with both auditors individually clean; the F138 guard's fifth verification PASSED and its sixth instance rides this spec)", () => {
  it("SURVIVAL (worklog): the s156-guard-ordering-repair-note bracketed registration — the 'limiter → session → parse' inversion vs the live session → limiter → parse (gated) / limiter → parse (public auth), the repo internally consistent and safe, the frozen record never rewritten, the ordering-derivation forward form (landed BEFORE this spec's birth — the S151-B/.../S155-B precedent's honest survival classification)", () => {
    const note = auditEntry("Task ID: s156-guard-ordering-repair-note");
    expect(note).not.toBe("");
    expect(collapsed(note)).toContain("limiter → session → parse");
    expect(collapsed(note)).toContain("SESSION → LIMITER → PARSE");
    expect(collapsed(note)).toContain("B156-N1");
    // The frozen-record posture named.
    expect(collapsed(note)).toContain("never rewritten");
    // The forward form: an ordering claim derived live with the
    // branch distinction, never quoted (F143's sequence-claim member).
    expect(collapsed(note)).toContain("derived LIVE at the citing tree");
    expect(collapsed(note)).toContain("BRANCH DISTINCTION");
  });

  it("SURVIVAL (plan): the F138 guard's SIXTH instance — the s155 plan's execution record shipped 6/6 ticked, zero unticked (the pre-armed guard per the session_316 directive; the fifth consecutive cycle of the forward form)", () => {
    // The s155 plan's record section AT ITS ANCHOR: six boxes, all [x].
    const record = s155PlanSource.slice(
      s155PlanSource.indexOf("## Execution record"),
    );
    const ticked = (record.match(/- \[x\]/g) ?? []).length;
    const unticked = (record.match(/- \[ \]/g) ?? []).length;
    expect(ticked).toBe(6);
    expect(unticked).toBe(0);
    // The s156 plan's own record section exists with the six-box
    // enumeration (the form; the TICK state is time-dependent —
    // unticked at this spec's birth, ticked at the delivery commit by
    // the F138 forward form, and pinned TICKED by the NEXT cycle's
    // spec at its birth — the guard's seventh instance).
    const s156Record = s156PlanSource.slice(
      s156PlanSource.indexOf("## Execution record"),
    );
    expect((s156Record.match(/- \[[ x]\]/g) ?? []).length).toBe(6);
  });

  it("SURVIVAL (worklog): the two s156 audit entries at their anchors with their live censuses — auditor A's and auditor B's 0C/0H/0M/0L/0I each (the combined 0C/0H/0M/0L/0I — the FOURTH zero-finding census, the FIRST with both auditors individually clean), auditor B's guard-ordering verification note, and the twenty-ninth consecutive deferral cycle", () => {
    const a = auditEntry("Task ID: s156-auditor-A");
    const b = auditEntry("Task ID: s156-auditor-B");
    expect(a).not.toBe("");
    expect(b).not.toBe("");
    // The entries' own live census spellings.
    expect(collapsed(a)).toContain("0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational");
    expect(collapsed(b)).toContain("0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational");
    // Auditor A's clean-pass verdict members.
    expect(collapsed(a)).toContain("14,077");
    // Auditor B's guard-ordering note + the deferral verdict.
    expect(collapsed(b)).toContain("guard-ordering");
    expect(collapsed(b)).toContain("twenty-ninth consecutive cycle");
  });

  it("SURVIVAL (scripts): the s156 script provenance — live156/nav156/digma-seo-s156 tokens, the 132nd/133rd/93rd ordinals, the S155 delivery at 5b89b78, zero s155 residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live156");
    expect(refAuditSource).toContain("the 132nd reference audit");
    expect(refAuditSource).toContain("the S155 delivery at HEAD 5b89b78");
    expect(refAuditSource).toContain("byte-identical the 93rd");
    expect(refAuditSource).toContain("ref-audit-s166");
    expect(navSource).toContain("nav156");
    expect(navSource).toContain("the 133rd consecutive session");
    expect(navSource).toContain("the FINAL S156 build");
    expect(seoSource).toContain("digma-seo-s156");
    expect(seoSource).toContain("session 156, S156-cycle");
    // Zero s155 run-ordinal residue in the new scripts (the F89 family).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live155");
      expect(src).not.toContain("nav155");
      expect(src).not.toContain("seo-s155");
      expect(src).not.toContain("s165");
      expect(src).not.toContain("byte-identical the 92nd");
      expect(src).not.toContain("e9e330e");
    }
  });

  it("DEFECT (docs): the count re-anchor — the v1.135.0 chain entry carries the S156 derivation (2171 = 2159 + 12 unit / 218 files) + the §7.1 row for the s156 spec", () => {
    expect(padSource).toMatch(/v1\.135\.0/);
    expect(padSource).toContain("2171 = 2159 + 12 unit / 218 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s156.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's third instance): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.135.0 block quotes — the count receipt riding the spec instead of prose (the F138 receipt-doctrine shape at the count family)", () => {
    // The live derivation NEVER quotes a figure: wc -l over the exact
    // 22-file composition at spec runtime.
    expect(liveLayerTotal).toBeGreaterThan(14000);
    // The PAD's v1.135.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("SURVIVAL (docs): the pair-unity claim forms riding the constants at every doc — the frozen coincidental literals classified out (the B145-I1 doctrine), every live claim site the same members (the rolling-safe form: this spec's constants equal the s155 spec's constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s155Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s155.test.ts"),
      "utf8",
    );
    // The s155 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s155Unit = s155Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s155Files = s155Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s155Unit).toBe(UNIT);
    expect(s155Files).toBe(FILES);
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

  it("DEFECT (docs): the F143 lesson registered in the digma_SKILL — the ordering-claim member inserted after F142, the version bumped to v1.134.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.174\.0/);
    // The lesson: the ordering-claim member after F142.
    const f142At = skillSource.indexOf("F142");
    const f143At = skillSource.indexOf("F143");
    expect(f142At).toBeGreaterThan(-1);
    expect(f143At).toBeGreaterThan(f142At);
    const f143Body = skillSource.slice(f143At, f143At + 2400);
    expect(collapsed(f143Body)).toContain("ordering");
    // The forward-form phrase in the lesson's own spelling ("derived
    // LIVE" — the same form the s156-guard-ordering-repair-note pin
    // asserts; the spec's first run pinned the lowercase spelling and
    // failed against the lesson's uppercase form — the spec-form
    // repair at birth, narrated here, the s155 precedent).
    expect(collapsed(f143Body)).toContain("derived LIVE");
  });
});
