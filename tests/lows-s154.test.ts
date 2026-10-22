import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { useEditorStore } from "@/components/editor/editor-store";
import type { DesignElementDTO } from "@/lib/editor";

// The session-154 spec (the one-hundred-and-second audit's chosen work —
// the selectedIds identity-churn completion + the count-truth repair):
//
// S154-A — THE SELECTEDIDS IDENTITY-CHURN COMPLETION (A154-I2 — the
//   source-carrying member): the S153-A fix's own census missed THREE
//   selectedIds-committing arms — undo, redo, and restoreSnapshot —
//   each committing `selectedIds: state.selectedIds.filter(...)`, a
//   fresh array identity even when the selection fully survives the
//   restore (the common case: undoing a move with the selection
//   retained). The exclusion census named restoreSnapshot wholesale
//   ("by-definition real transitions") — true of its ELEMENTS commit
//   (the S114-B value-compare guard covers the identical-restore
//   window) but not of its selectedIds member; undo/redo are history
//   arms outside both the seven-member census and the eight-member
//   mutation-arm exclusion. The F139 class-census-at-fix doctrine's
//   own recurrence one layer deeper (the F140 lesson's class-census
//   member recurring at the fix's own exclusion enumeration). The fix:
//   the sameIdSequence keep-form (the exact form already shipped at
//   deleteElements/markSaved since S153-A) at the three arms; the
//   markSaved family comment narrows (restoreSnapshot's selectedIds
//   member joins the identity-bounded class — the comment-truth
//   discipline); the s153 spec's consumption-census pin and the s114
//   spec's restoreSnapshot form pin re-anchor onto the new live forms
//   (the F140 prior-spec re-anchor rider — the CLAIM stays true, the
//   pinned spelling moves with the code, narrated in the s154 plan).
//
// S154-B — THE COUNT-TRUTH REPAIR (B154-L1/A154-I1, dual-observed):
//   the s153 collateral's 22-file layer aggregate claimed
//   "13,899 → 13,967" while its own decomposition names BOTH growths
//   (editor.ts +68, editor-store.ts +60) — the sum omitted the +60;
//   the live tree holds 14,027 at the S153 delivery. The bracketed
//   s154-count-repair-note landed BEFORE this spec's birth (the
//   S151-B/S153-B precedent's honest survival classification); the
//   frozen records stay frozen (S132-C); the v1.133.0 PAD block
//   carries the corrected post-fix figure; and THE FORWARD GUARD —
//   this spec's layer-total pin derives the LIVE 22-file total at
//   runtime (wc -l over the exact composition) and asserts it equals
//   the figure the v1.133.0 block quotes (the F138 receipt-doctrine
//   shape applied to the count family: a count claim riding only
//   prose can ship violated — this is its first count-family
//   instance).
//
// S154-C — the per-session pin family: the F138 guard's FOURTH
//   instance (the s153 plan's record pinned 6/6 ticked at this spec's
//   birth, per the session_305 directive — the pre-armed guard), the
//   audit entries at their anchors, the script provenance, the
//   pair-unity constants (born rolling-safe at the POST-spec figures
//   2147/216 — the doc-update re-anchors the docs and the constants
//   TOGETHER), and the doc-side members (the F141 lesson, the count
//   re-anchor, the layer-total guard) that stay RED until the
//   collateral.
//
// Spec-form notes (narrated at birth — the honest form separated from
// the plan's 7 RED / 6 survival forecast, exactly the s153 precedent's
// own shape): (1) the pair-unity pin is honestly the doc-side
// RED-until-collateral member (the plan drafted it survival, but the
// constants equal the s153 spec's constants only AFTER the doc-update
// sweep re-anchors them together — the s153 spec's own classification
// of this member); (2) the selection-shrinks control is SURVIVAL (the
// filter's prune path is the current live behavior — the regression
// guard asserting the closure never breaks it); (3) the count-repair
// note and the F138/audit/script pins are survival (landed before this
// spec's birth); the three behavior pins, the source-census pin, and
// the three doc-side pins are RED until the fix and the collateral.

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
const s153PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session153.md"),
  "utf8",
);
const s154PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session154.md"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s154.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s154.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s154.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2134 delivery checks + this
 *  spec's 13 = 2147 unit, the 215 delivery files + this spec = 216;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s153 lesson). */
const UNIT = "2428";
const FILES = "236";

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

/** The figure the v1.153.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.153\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
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
    elements: [rect("a", 60, 80), rect("b", 220, 140)],
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
// S154-A — the selectedIds identity-churn completion (the three history
// arms — A154-I2 closed)
// ---------------------------------------------------------------------------

describe("S154-A the selectedIds identity-churn completion (the three history arms — undo, redo, restoreSnapshot — keep the current selectedIds reference when the selection fully survives the restore; the elements commit stays the real transition)", () => {
  it("DEFECT (store): undo keeps the selectedIds reference when the selection fully survives the restore — the A154-I2 member (the common case: undoing a change with the selection retained no longer rebuilds the selection memos for nothing)", () => {
    // A past snapshot whose elements carry BOTH selected ids (the
    // selection fully survives) — undo restores it.
    const restored = [rect("a", 10, 20), rect("b", 30, 40)];
    useEditorStore.setState({
      past: [{ elements: restored, backgroundColor: "#0D1117" }],
      selectedIds: ["a", "b"],
    });
    const selRef = useEditorStore.getState().selectedIds;
    useEditorStore.getState().undo();
    // The elements ARE the restored snapshot's rows (the real
    // transition) but the selectedIds reference survives the filter.
    expect(useEditorStore.getState().elements.map((el) => el.x)).toEqual([10, 30]);
    expect(useEditorStore.getState().selectedIds).toBe(selRef);
    expect(useEditorStore.getState().saveState).toBe("unsaved");
  });

  it("DEFECT (store): redo keeps the selectedIds reference when the selection fully survives the traversal", () => {
    const nextSnapshot = {
      elements: [rect("a", 11, 21), rect("b", 31, 41)],
      backgroundColor: "#0D1117",
    };
    useEditorStore.setState({
      future: [nextSnapshot],
      selectedIds: ["a", "b"],
    });
    const selRef = useEditorStore.getState().selectedIds;
    useEditorStore.getState().redo();
    expect(useEditorStore.getState().elements.map((el) => el.x)).toEqual([11, 31]);
    expect(useEditorStore.getState().selectedIds).toBe(selRef);
  });

  it("DEFECT (store): restoreSnapshot keeps the selectedIds reference when the selection fully survives the restore (the AI Revert's own path — the pre-apply snapshot carries the same element ids)", () => {
    const snapshot = {
      elements: [rect("a", 12, 22), rect("b", 32, 42)],
      backgroundColor: "#FFFFFF",
    };
    useEditorStore.setState({ selectedIds: ["a", "b"] });
    const selRef = useEditorStore.getState().selectedIds;
    useEditorStore.getState().restoreSnapshot(snapshot);
    // The elements commit is the real transition (fresh spread rows +
    // the changed backgroundColor) but the selectedIds reference
    // survives the filter.
    expect(useEditorStore.getState().backgroundColor).toBe("#FFFFFF");
    expect(useEditorStore.getState().elements.map((el) => el.x)).toEqual([12, 32]);
    expect(useEditorStore.getState().selectedIds).toBe(selRef);
    expect(useEditorStore.getState().saveState).toBe("unsaved");
  });

  it("SURVIVAL (store): the selection-shrinks control — a selected id NOT in the restored elements still prunes at every history arm (the closure never breaks the filter's change path)", () => {
    // undo with a selected id absent from the restored snapshot.
    useEditorStore.setState({
      past: [{ elements: [rect("a", 1, 2)], backgroundColor: "#0D1117" }],
      selectedIds: ["a", "gone"],
    });
    useEditorStore.getState().undo();
    expect(useEditorStore.getState().selectedIds).toEqual(["a"]);
    // redo with a selected id absent from the traversed snapshot.
    useEditorStore.setState({
      elements: [rect("a", 60, 80)],
      future: [{ elements: [rect("b", 1, 2)], backgroundColor: "#0D1117" }],
      selectedIds: ["a", "gone"],
      past: [],
    });
    useEditorStore.getState().redo();
    expect(useEditorStore.getState().selectedIds).toEqual([]);
    // restoreSnapshot with a selected id absent from the snapshot.
    useEditorStore.setState({
      elements: [rect("a", 60, 80)],
      selectedIds: ["a", "gone"],
      past: [],
      future: [],
    });
    useEditorStore.getState().restoreSnapshot({
      elements: [rect("a", 5, 6)],
      backgroundColor: "#0D1117",
    });
    expect(useEditorStore.getState().selectedIds).toEqual(["a"]);
  });

  it("DEFECT (source): the three history arms consume the sameIdSequence seam + the narrowed exclusion census at the markSaved family comment (the comment-truth discipline — restoreSnapshot's selectedIds member named identity-bounded since S154-A)", () => {
    // undo's window carries the seam.
    expect(storeSource).toMatch(/undo: \(\) =>[\s\S]{0,1400}sameIdSequence/);
    // redo's window carries the seam.
    expect(storeSource).toMatch(/redo: \(\) =>[\s\S]{0,1400}sameIdSequence/);
    // restoreSnapshot's window carries the seam.
    expect(storeSource).toMatch(
      /restoreSnapshot: \(snapshot\) =>[\s\S]{0,2600}sameIdSequence/,
    );
    // The narrowed exclusion census at the markSaved family comment:
    // loadProject keeps the wholesale exclusion while
    // restoreSnapshot's selectedIds member is named identity-bounded.
    expect(collapsed(storeSource)).toContain(
      "restoreSnapshot's ELEMENTS commit stays a real transition",
    );
    expect(collapsed(storeSource)).toContain(
      "selectedIds member is identity-bounded since S154-A",
    );
    // The s154 plan's census section carries the three-member
    // enumeration.
    expect(collapsed(s154PlanSource)).toContain(
      "THREE selectedIds-committing arms",
    );
  });
});

// ---------------------------------------------------------------------------
// S154-B/S154-C — the count-truth repair + the per-session pin family
// ---------------------------------------------------------------------------

describe("S154-B/S154-C the count-truth repair registration and the per-session pin family (the one-hundred-and-second audit's 0C/0H/0M/1L/1I — the layer-total defect dual-observed B154-L1/A154-I1 + the three-arm residual A154-I2; the F138 guard's third verification PASSED and its fourth instance rides this spec)", () => {
  it("SURVIVAL (worklog): the s154-count-repair-note bracketed registration — the layer-total defect (13,967 understates the live 14,027 by exactly the editor-store.ts +60), dual-observed, the frozen records staying frozen, the forward guard pre-armed (landed BEFORE this spec's birth — the S151-B/S153-B precedent's honest survival classification)", () => {
    const note = auditEntry("Task ID: s154-count-repair-note");
    expect(note).not.toBe("");
    expect(collapsed(note)).toContain("14,027");
    expect(collapsed(note)).toContain("13,967");
    expect(collapsed(note)).toContain("the editor-store.ts +60");
    expect(collapsed(note)).toContain("B154-L1/A154-I1");
    // The frozen-record posture named.
    expect(collapsed(note)).toContain("NEVER rewritten");
  });

  it("SURVIVAL (plan): the F138 guard's FOURTH instance — the s153 plan's execution record shipped 6/6 ticked, zero unticked (the pre-armed guard per the session_305 directive; the third consecutive cycle of the forward form)", () => {
    // The s153 plan's record section AT ITS ANCHOR: six boxes, all [x].
    const record = s153PlanSource.slice(
      s153PlanSource.indexOf("## Execution record"),
    );
    const ticked = (record.match(/- \[x\]/g) ?? []).length;
    const unticked = (record.match(/- \[ \]/g) ?? []).length;
    expect(ticked).toBe(6);
    expect(unticked).toBe(0);
    // The s154 plan's own record section exists with the six-box
    // enumeration (the form; the TICK state is time-dependent —
    // unticked at this spec's birth, ticked at the delivery commit by
    // the F138 forward form, and pinned TICKED by the NEXT cycle's
    // spec at its birth — the guard's fifth instance).
    const s154Record = s154PlanSource.slice(
      s154PlanSource.indexOf("## Execution record"),
    );
    expect((s154Record.match(/- \[[ x]\]/g) ?? []).length).toBe(6);
  });

  it("SURVIVAL (worklog): the two s154 audit entries at their anchors with their live censuses — auditor A's 0C/0H/0M/0L/2I + the three-arm finding, auditor B's 0C/0H/0M/1L/0I + the dual observation (the combined 0C/0H/0M/1L/1I)", () => {
    const a = auditEntry("Task ID: digma-s154-audit-A");
    const b = auditEntry("Task ID: digma-s154-audit-B");
    expect(a).not.toBe("");
    expect(b).not.toBe("");
    // The entries' own live census spellings.
    expect(collapsed(a)).toContain("0 Critical / 0 High / 0 Medium / 0 Low / 2 Informational");
    expect(collapsed(b)).toContain("0 Critical / 0 High / 0 Medium / 1 Low / 0 Informational");
    // Auditor A's three-arm finding at its live form.
    expect(collapsed(a)).toContain("undo (:746), redo (:760), and restoreSnapshot (:786)");
    // Auditor B's dual observation + the live-derivation verdict.
    expect(collapsed(b)).toContain("14,027");
    expect(collapsed(b)).toContain("the twenty-seventh consecutive cycle");
  });

  it("SURVIVAL (scripts): the s154 script provenance — live154/nav154/digma-seo-s154 tokens, the 130th/131st/91st ordinals, the S153 delivery at 9be1d69, zero s153 residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live154");
    expect(refAuditSource).toContain("the 130th reference audit");
    expect(refAuditSource).toContain("the S153 delivery at HEAD 9be1d69");
    expect(refAuditSource).toContain("byte-identical the 91st");
    expect(refAuditSource).toContain("ref-audit-s164");
    expect(navSource).toContain("nav154");
    expect(navSource).toContain("the 131st consecutive session");
    expect(navSource).toContain("the FINAL S154 build");
    expect(seoSource).toContain("digma-seo-s154");
    expect(seoSource).toContain("session 154, S154-cycle");
    // Zero s153 run-ordinal residue in the new scripts (the F89 family).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live153");
      expect(src).not.toContain("nav153");
      expect(src).not.toContain("seo-s153");
      expect(src).not.toContain("s163");
      expect(src).not.toContain("byte-identical the 90th");
      expect(src).not.toContain("b916639");
    }
  });

  it("DEFECT (docs): the count re-anchor — the v1.133.0 chain entry carries the S154 derivation (2147 = 2134 + 13 unit / 216 files) + the §7.1 row for the s154 spec + the corrected layer figure with the repair named", () => {
    expect(padSource).toMatch(/v1\.133\.0/);
    expect(padSource).toContain("2147 = 2134 + 13 unit / 216 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s154.test.ts`");
    // The corrected layer figure — the count-truth repair's own claim
    // (the v1.132.0 block's 13,967 superseded by the live-true figure
    // with the repair named).
    expect(padQuotedLayerTotal).not.toBe("");
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

  it("DEFECT (docs — the forward count-truth guard): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.134.0 block quotes — the count receipt riding the spec instead of prose (the F138 receipt-doctrine shape at the count family, its first instance; the version literal re-anchored onto the rolling current block by S155)", () => {
    // The live derivation NEVER quotes a figure: wc -l over the exact
    // 22-file composition at spec runtime.
    expect(liveLayerTotal).toBeGreaterThan(14000);
    // The PAD's v1.134.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("SURVIVAL (docs): the pair-unity claim forms riding the constants at every doc — the frozen coincidental literals classified out (the B145-I1 doctrine), every live claim site the same members (the rolling-safe form: this spec's constants equal the s153 spec's constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s153Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s153.test.ts"),
      "utf8",
    );
    // The s153 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s153Unit = s153Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s153Files = s153Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s153Unit).toBe(UNIT);
    expect(s153Files).toBe(FILES);
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

  it("DEFECT (docs): the F141 lesson registered in the digma_SKILL — the count-family arithmetic + fix-census recurrence member inserted after F140, the version bumped to v1.132.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.152\.0/);
    // The lesson: the count-family arithmetic member after F140.
    const f140At = skillSource.indexOf("F140");
    const f141At = skillSource.indexOf("F141");
    expect(f140At).toBeGreaterThan(-1);
    expect(f141At).toBeGreaterThan(f140At);
    const f141Body = skillSource.slice(f141At, f141At + 2400);
    expect(collapsed(f141Body)).toContain("decomposition");
    expect(collapsed(f141Body)).toContain("exclusion");
  });
});
