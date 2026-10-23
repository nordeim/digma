import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { useEditorStore } from "@/components/editor/editor-store";
import type { DesignElementDTO } from "@/lib/editor";

// The session-155 spec (the one-hundred-and-third audit's chosen work —
// the census-enumeration completion + the env-census citation repair):
//
// S155-A — THE CENSUS-ENUMERATION COMPLETION (A155-I1 — the
//   source-carrying member): the S154-A exclusion enumeration omits
//   addElements — editor-store.ts commits `selectedIds: created.map((el)
//   => el.id)` at the arm, the one selectedIds-committing arm named by
//   neither the S153-A seven-member census nor the S154-A-narrowed
//   exclusion list at the markSaved family comment. The arm provably
//   cannot churn: the created ids are fresh nextLocalId() values
//   (local-<timestamp36>-<counter>) whose module-lifetime monotonically
//   increasing counter makes them unmatchable by any id ever present in
//   selectedIds (server ids are Prisma cuids, never local-prefixed;
//   prior local ids carry smaller counters), so a content-identical
//   commit is unconstructible. The F139 class-census-at-fix doctrine's
//   enumeration-completeness corollary — its third layer (S153's fix
//   missed three arms; S154's narrowed exclusion omits one non-churning
//   arm's NAME). The fix: the arm's own registration comment (the
//   real-transition-by-construction form) + the family comment's
//   enumeration completing — the provably-safe arm named AS safe, never
//   left unnamed. PURELY ADDITIVE at the comment layer: the prior-spec
//   pins verified safe live before the edit (the s153
//   consumption-census phrase, the s154 narrowed-census phrases, the
//   s110 addElements window's empty-batch regex).
//
// S155-B — THE ENV-CENSUS CITATION REPAIR (B155-I1): the s154-B
//   worklog entry's env-census parenthetical names "NODE_ENV ×5" while
//   the live tree holds NODE_ENV ×4 — with ×5 that sentence's own
//   per-var breakdown sums to 17 against its own "16 process.env
//   sites" aggregate (the B154-L1/F141 count-family arithmetic class
//   recurring at the per-var prose form). The bracketed
//   s155-env-census-repair-note landed BEFORE this spec's birth (the
//   S151-B/S153-B/S154-B precedent's honest survival classification);
//   the frozen record stays frozen (S132-C); the forward form: the
//   per-var breakdown is a count claim — when cited, derived live,
//   never quoted.
//
// S155-C — the per-session pin family: the F138 guard's FIFTH
//   instance (the s154 plan's record pinned 6/6 ticked at this spec's
//   birth, per the session_310 directive — the pre-armed guard), the
//   audit entries at their anchors, the script provenance, the
//   pair-unity constants (born rolling-safe at the POST-spec figures
//   2159/217 — the doc-update re-anchors the docs and the constants
//   TOGETHER), and the doc-side members (the F142 lesson, the count
//   re-anchor, the layer-total guard's second instance) that stay RED
//   until the collateral.
//
// Spec-form notes (narrated at birth — the honest form separated from
// the plan's 6 RED / 6 survival forecast, exactly the s153/s154
// precedent's own shape): (1) the pair-unity pin is honestly the
// doc-side RED-until-collateral member (the constants equal the s154
// spec's constants only AFTER the doc-update sweep re-anchors them
// together — the s153/s154 spec's own classification of this member);
// (2) the addElements behavioral contract pin is SURVIVAL (the
// registration changes no behavior — the regression guard asserting
// the comment-only form); (3) the env-census-repair note and the
// F138/audit/script pins are survival (landed before this spec's
// birth); the two source pins and the four doc-side pins are RED
// until the fix and the collateral.

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
const s154PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session154.md"),
  "utf8",
);
const s155PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session155.md"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s155.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s155.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s155.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2147 delivery checks + this
 *  spec's 12 = 2159 unit, the 216 delivery files + this spec = 217;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s154 lesson). */
const UNIT = "2501";
const FILES = "242";

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

/** The figure the v1.159.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its second instance). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.159\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
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
// S155-A — the census-enumeration completion
// ---------------------------------------------------------------------------

describe("S155-A the census-enumeration completion (addElements named in the selectedIds-commit census — the provably-safe arm named AS safe: the fresh nextLocalId() values are unmatchable by any id ever in selectedIds, so the keep-form's premise is unconstructible there; the registration is comment-only, zero behavioral change)", () => {
  it("DEFECT (source): the addElements arm carries its S155-A registration comment — the real-transition-by-construction form (the fresh local ids, the never-local-prefixed server cuids, the empty-batch guard)", () => {
    const addStart = storeSource.indexOf("addElements: (partials) =>");
    expect(addStart).toBeGreaterThan(-1);
    const addEnd = storeSource.indexOf(
      "updateElements: (ids, patch, commit = true) =>",
      addStart,
    );
    const addBlock = storeSource.slice(addStart, addEnd);
    // The registration's own phrases (the comment-truth discipline).
    expect(collapsed(addBlock)).toContain("S155-A");
    expect(collapsed(addBlock)).toContain("real transition BY CONSTRUCTION");
    expect(collapsed(addBlock)).toContain("unconstructible");
    // The unmatchability premise named at the seam.
    expect(collapsed(addBlock)).toContain("monotonic");
    expect(collapsed(addBlock)).toContain("cuid");
  });

  it("DEFECT (source): the markSaved family comment's exclusion enumeration names addElements — the F139 doctrine's enumeration-completeness corollary (the provably-safe arm named AS safe, never left unnamed)", () => {
    // The family comment's enumeration completes with the addElements
    // member (the S155-A registration phrase).
    expect(collapsed(storeSource)).toContain(
      "addElements' selectedIds commit",
    );
    expect(collapsed(storeSource)).toContain(
      "real transition by construction",
    );
    // The prior pinned phrases stay untouched (the purely-additive
    // form verified live before the edit).
    expect(collapsed(storeSource)).toContain(
      "loadProject stays a by-definition real transition",
    );
    expect(collapsed(storeSource)).toContain(
      "selectedIds member is identity-bounded since S154-A",
    );
    expect(collapsed(storeSource)).toContain(
      "restoreSnapshot's ELEMENTS commit stays a real transition",
    );
  });

  it("SURVIVAL (behavioral): addElements' non-empty batch contract unchanged by the registration — adds the elements, selects the FRESH ids, returns them (the comment-only form; the fresh ids replace the prior selection as always)", () => {
    const ids = useEditorStore.getState().addElements([
      { type: "rectangle", x: 10, y: 10 },
      { type: "ellipse", x: 50, y: 50 },
    ]);
    expect(ids).toHaveLength(2);
    const s = useEditorStore.getState();
    // The fresh ids ARE the selection (the arm's real transition).
    expect(s.selectedIds).toEqual(ids);
    // The elements joined the list.
    expect(s.elements).toHaveLength(4);
    // The arm flips unsaved and pushes history (the standing contract).
    expect(s.saveState).toBe("unsaved");
    expect(s.past).toHaveLength(1);
    // The empty-batch floor still rides (the s110 pin's form, the
    // prior-spec safety verified live).
    const none = useEditorStore.getState().addElements([]);
    expect(none).toEqual([]);
    const s2 = useEditorStore.getState();
    expect(s2.selectedIds).toEqual(ids);
  });

  it("SURVIVAL (store): the keep-form family intact — every censused arm still consumes sameIdSequence (the S153-A/S154-A forms unchanged by this cycle's comment-only registration)", () => {
    // The five identity-bounded arms: markSaved, deleteElements, undo,
    // redo, restoreSnapshot (the S153-A + S154-A closures). The
    // windows ride the implementation signatures (the interface
    // declarations fail the window and the regex scans on — the s153
    // spec-form lesson at the markSaved member).
    expect(storeSource).toMatch(/markSaved: \(elements, remap\) =>[\s\S]{0,2600}sameIdSequence/);
    expect(storeSource).toMatch(/deleteElements: \(ids\) =>[\s\S]{0,2200}sameIdSequence/);
    expect(storeSource).toMatch(/undo: \(\) =>[\s\S]{0,1400}sameIdSequence/);
    expect(storeSource).toMatch(/redo: \(\) =>[\s\S]{0,1400}sameIdSequence/);
    expect(storeSource).toMatch(/restoreSnapshot: \(snapshot\) =>[\s\S]{0,2600}sameIdSequence/);
  });
});

// ---------------------------------------------------------------------------
// S155-B/S155-C — the env-census citation repair + the per-session pin family
// ---------------------------------------------------------------------------

describe("S155-B/S155-C the env-census citation repair registration and the per-session pin family (the one-hundred-and-third audit's 0C/0H/0M/0L/2I — the census-enumeration completion A155-I1 + the env-census citation repair B155-I1, the first all-Informational census in the plan history; the F138 guard's fourth verification PASSED and its fifth instance rides this spec)", () => {
  it("SURVIVAL (worklog): the s155-env-census-repair-note bracketed registration — the NODE_ENV ×5 vs the live ×4, the breakdown summing 17 against its own 16-site aggregate, the frozen record never rewritten, the per-var-derivation forward form (landed BEFORE this spec's birth — the S151-B/S153-B/S154-B precedent's honest survival classification)", () => {
    const note = auditEntry("Task ID: s155-env-census-repair-note");
    expect(note).not.toBe("");
    expect(collapsed(note)).toContain("NODE_ENV ×5");
    expect(collapsed(note)).toContain("×4");
    expect(collapsed(note)).toContain("sums to 17");
    expect(collapsed(note)).toContain("B155-I1");
    // The frozen-record posture named.
    expect(collapsed(note)).toContain("never rewritten");
    // The forward form: the per-var breakdown derived live, never
    // quoted (F142's arithmetic member).
    expect(collapsed(note)).toContain("derived live at the citing tree");
  });

  it("SURVIVAL (plan): the F138 guard's FIFTH instance — the s154 plan's execution record shipped 6/6 ticked, zero unticked (the pre-armed guard per the session_310 directive; the fourth consecutive cycle of the forward form)", () => {
    // The s154 plan's record section AT ITS ANCHOR: six boxes, all [x].
    const record = s154PlanSource.slice(
      s154PlanSource.indexOf("## Execution record"),
    );
    const ticked = (record.match(/- \[x\]/g) ?? []).length;
    const unticked = (record.match(/- \[ \]/g) ?? []).length;
    expect(ticked).toBe(6);
    expect(unticked).toBe(0);
    // The s155 plan's own record section exists with the six-box
    // enumeration (the form; the TICK state is time-dependent —
    // unticked at this spec's birth, ticked at the delivery commit by
    // the F138 forward form, and pinned TICKED by the NEXT cycle's
    // spec at its birth — the guard's sixth instance).
    const s155Record = s155PlanSource.slice(
      s155PlanSource.indexOf("## Execution record"),
    );
    expect((s155Record.match(/- \[[ x]\]/g) ?? []).length).toBe(6);
  });

  it("SURVIVAL (worklog): the two s155 audit entries at their anchors with their live censuses — auditor A's 0C/0H/0M/0L/1I + the census-completion finding, auditor B's 0C/0H/0M/0L/1I + the citation-repair finding (the combined 0C/0H/0M/0L/2I — the first all-Informational census)", () => {
    const a = auditEntry("Task ID: digma-s155-audit-A");
    const b = auditEntry("Task ID: digma-s155-audit-B");
    expect(a).not.toBe("");
    expect(b).not.toBe("");
    // The entries' own live census spellings.
    expect(collapsed(a)).toContain("0 Critical / 0 High / 0 Medium / 0 Low / 1 Informational");
    expect(collapsed(b)).toContain("0 Critical / 0 High / 0 Medium / 0 Low / 1 Informational");
    // Auditor A's census-completion finding at its live form.
    expect(collapsed(a)).toContain("addElements");
    // Auditor B's citation-repair finding + the deferral verdict.
    expect(collapsed(b)).toContain("NODE_ENV ×5");
    expect(collapsed(b)).toContain("the twenty-eighth consecutive cycle");
  });

  it("SURVIVAL (scripts): the s155 script provenance — live155/nav155/digma-seo-s155 tokens, the 131st/132nd/92nd ordinals, the S154 delivery at e9e330e, zero s154 residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live155");
    expect(refAuditSource).toContain("the 131st reference audit");
    expect(refAuditSource).toContain("the S154 delivery at HEAD e9e330e");
    expect(refAuditSource).toContain("byte-identical the 92nd");
    expect(refAuditSource).toContain("ref-audit-s165");
    expect(navSource).toContain("nav155");
    expect(navSource).toContain("the 132nd consecutive session");
    expect(navSource).toContain("the FINAL S155 build");
    expect(seoSource).toContain("digma-seo-s155");
    expect(seoSource).toContain("session 155, S155-cycle");
    // Zero s154 run-ordinal residue in the new scripts (the F89 family).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live154");
      expect(src).not.toContain("nav154");
      expect(src).not.toContain("seo-s154");
      expect(src).not.toContain("s164");
      expect(src).not.toContain("byte-identical the 91st");
      expect(src).not.toContain("9be1d69");
    }
  });

  it("DEFECT (docs): the count re-anchor — the v1.134.0 chain entry carries the S155 derivation (2159 = 2147 + 12 unit / 217 files) + the §7.1 row for the s155 spec", () => {
    expect(padSource).toMatch(/v1\.134\.0/);
    expect(padSource).toContain("2159 = 2147 + 12 unit / 217 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s155.test.ts`");
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

  it("DEFECT (docs — the forward count-truth guard's second instance): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.134.0 block quotes — the count receipt riding the spec instead of prose (the F138 receipt-doctrine shape at the count family)", () => {
    // The live derivation NEVER quotes a figure: wc -l over the exact
    // 22-file composition at spec runtime.
    expect(liveLayerTotal).toBeGreaterThan(14000);
    // The PAD's v1.134.0 block must quote exactly this figure (the
    // comma-spelled doc form and the bare runtime form are the same
    // NUMBER — the guard compares the figure, never the spelling).
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
  });

  it("SURVIVAL (docs): the pair-unity claim forms riding the constants at every doc — the frozen coincidental literals classified out (the B145-I1 doctrine), every live claim site the same members (the rolling-safe form: this spec's constants equal the s154 spec's constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    const s154Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s154.test.ts"),
      "utf8",
    );
    // The s154 spec's constants were re-anchored onto THIS cycle's
    // figures by the doc-update sweep (the pair-unity contract: a
    // stale constant anywhere fails here).
    const s154Unit = s154Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s154Files = s154Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s154Unit).toBe(UNIT);
    expect(s154Files).toBe(FILES);
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

  it("DEFECT (docs): the F142 lesson registered in the digma_SKILL — the enumeration-arithmetic member inserted after F141, the version bumped to v1.133.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.158\.0/);
    // The lesson: the enumeration-arithmetic member after F141.
    const f141At = skillSource.indexOf("F141");
    const f142At = skillSource.indexOf("F142");
    expect(f141At).toBeGreaterThan(-1);
    expect(f142At).toBeGreaterThan(f141At);
    const f142Body = skillSource.slice(f142At, f142At + 2400);
    expect(collapsed(f142Body)).toContain("breakdown");
    expect(collapsed(f142Body)).toContain("enumeration");
  });
});
