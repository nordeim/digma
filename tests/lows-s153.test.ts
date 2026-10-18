import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import {
  elementContentIdentical,
  reuseStableElements,
  sameIdSequence,
} from "../src/lib/editor";
import { useEditorStore } from "@/components/editor/editor-store";
import type { DesignElementDTO } from "@/lib/editor";

// The session-153 spec (the one-hundred-and-first audit's chosen work —
// the identity-churn-closure cycle: the THIRD zero-finding census + the
// F138 guard's second verification + the deferred queue's identity-churn
// family taken up):
//
// S153-A — THE IDENTITY-CHURN FAMILY CLOSURE (A117-I1 + A120-I1 — the
//   source-carrying member): the store's selection and save arms commit
//   NEW array identities on content-identical commits, defeating the
//   memoization layer downstream (the canvas's selectedIdSet useMemo
//   keyed on the selectedIds identity; the selectedElements filter memo
//   keyed on [elements, selectedIdSet]; the MemoizedCanvasElement
//   shallow compare keyed on the element object references — at
//   ELEMENT_LIMIT a full 2000-element re-render per save cycle the
//   A120-I1 registration names). The registered census named the two
//   members (A117-I1's selection arms — select/deselectAll/
//   deleteElements; A120-I1's markSaved elements replacement); the
//   FIX's live census found SEVEN members across FIVE arms — the
//   honest class enumeration (the F139 class-census-at-fix doctrine):
//   select non-additive (the caller's array committed by reference — a
//   content-identical re-click churns), select additive (the Set-spread
//   merge array), deselectAll (a new [] even when empty), selectAll (a
//   new mapped array even when content-identical — the faithful 0/0
//   quirk preserved: the no-op keeps both lengths unchanged),
//   deleteElements' matched-branch selectedIds.filter (a new identity
//   when no selected id was deleted), markSaved's elements (the parsed
//   server response replacing all identities per save — post-first-save
//   pure churn, the first-save remap still replacing), and markSaved's
//   own selectedIds (the map+filter). The fix: three pure seams born in
//   src/lib/editor.ts (the clampZoom/patchDiffers precedent home) —
//   sameIdSequence (the ORDER-SENSITIVE string-array compare: the
//   selection's order is semantic state), elementContentIdentical (the
//   keys-union === compare: every DTO field primitive, so === per key
//   IS a complete content compare — future-proof on new fields,
//   conservative on key-set asymmetry), reuseStableElements (the per-id
//   reference-preserving projection, the incoming order winning — the
//   replace contract's array order IS the sortOrder contract).
//   Correctly OUT of the class: loadProject (the lineage break),
//   restoreSnapshot (the history machinery), the eight S109-A/S110-A
//   no-op-guarded mutation arms (a committed transition is content-
//   different by construction), the past/future arrays (never
//   memo-consumed), the callers' own allocations (outside the store's
//   scope). Zero parity exposure: the change fires only on
//   content-identical commits — the visible state byte-identical.
//
// S153-B — THE THIRD ZERO-FINDING CENSUS REGISTRATION: the bracketed
//   s153-clean-census-note in the worklog (landed BEFORE this spec's
//   birth — the S151-B precedent's honest survival classification)
//   registering the one-hundred-and-first audit's 0C/0H/0M/0L/0I — the
//   third in the plan history after S143's and S152's; the F138 guard's
//   second verification PASSED (the s152 plan 6/6 ticked at b916639).
//
// S153-C — the per-session pin family: the F138 guard's THIRD instance
//   (the s152 plan's record pinned ticked at this spec's birth, per
//   the session_301 directive), the audit entries, the script
//   provenance, the pair-unity constants (born rolling-safe at the
//   CURRENT live figures 2120/214 — the doc-update re-anchors the docs
//   and the constants TOGETHER), and the doc-side members (the F140
//   lesson, the count re-anchor) that stay RED until the collateral.
//
// Spec-form notes (narrated at birth — the honest form separated from
// the plan's 8 RED / 6 survival forecast, exactly the s152 precedent's
// own shape): (1) the markSaved REMAP pin rides the SURVIVAL
// classification — the first-save replacement semantics are the
// current live behavior (the regression guard asserting the closure
// never breaks the remap); (2) the audit-entries pin's F138 phrase
// repaired to the entries' actual live form ("THE F138 GUARD'S SECOND
// VERIFICATION: PASSED" — the drafted markdown-bold form was a
// drafting artifact, the entries carry the plain form); (3) the
// pair-unity pin is honestly the doc-side RED-until-collateral member
// (the s152 spec's own precedent: the constants sweep re-anchors the
// prior specs and this spec's pair TOGETHER, so the pin rides GREEN
// only after the collateral) — the honest birth classification
// 9 RED / 5 survival, the count re-anchor and the F140 lesson the
// other doc-side RED members. (4) The consumption-census pin's
// deselectAll regex repaired to the implementation's collapsed form
// (the drafted wrapped-ternary parens were a formatting guess; the
// live form is the bare ternary — the RED run proving it, the same
// discriminating-form lesson as the s152 memberDisplayFor pin).
// (5) The F138-third-instance pin's own-plan assertion repaired onto
// the FORM (the six-box enumeration) — the drafted unticked-state
// assertion was time-dependent (true at the spec's birth, false at
// the delivery commit where the F138 forward form ticks the boxes);
// a pin asserts forms and settled states, never a moving state —
// the ticked-state assertion belongs to the NEXT cycle's guard (its
// fourth instance), exactly the one-cycle-behind construction the
// F138 doctrine itself names.

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
const s152PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session152.md"),
  "utf8",
);
const s153PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session153.md"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const editorLibSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s153.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s153.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s153.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the CURRENT live figures 2120/214; the doc-update script
 *  re-anchors the docs and these constants TOGETHER so the pair-unity
 *  pins stay green through the transition — the rolling-safe form at
 *  birth, the s140–s152 lesson). */
const UNIT = "2147";
const FILES = "216";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The PAD's live count-family rows, found by CONTENT (the S140-C
 *  doctrine: never by stale coordinates). */
const padUnitTotalRow = () =>
  padSource.split("\n").find((l) => l.includes("**Unit total**")) ?? "";
const padChecklistRow = () =>
  padSource.split("\n").find((l) => l.startsWith("- [ ] `bun run test` →")) ?? "";
const padCommandRow = () =>
  padSource
    .split("\n")
    .find((l) => l.includes("| `bun run test` / `bun run test:watch` |")) ?? "";

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

/** The live test-file count, derived at runtime (the files member is a
 *  LIVE derivation, never a quoted figure): every *.test.ts under
 *  tests/ + src/ (skills/ excluded). At this spec's own runtime the
 *  count is 215 — the 214 delivery files + this spec itself joining as
 *  the 215th; the doc-update re-anchors the doc claim sites onto
 *  exactly this figure. */
const liveTestFileCount = (() => {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory()
        ? walk(path.join(dir, e.name))
        : [path.join(dir, e.name)],
    );
  const root = path.resolve(import.meta.dirname, "..");
  return [
    ...walk(path.join(root, "tests")),
    ...walk(path.join(root, "src")),
  ].filter((f) => f.endsWith(".test.ts")).length;
})();

// ---------------------------------------------------------------------------
// S153-A — the identity-churn family closure (the one-hundred-and-first
// audit's chosen work — A117-I1 + A120-I1 closed at the seven censused
// members across five arms)
// ---------------------------------------------------------------------------

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

describe("S153-A the identity-churn family closure (a content-identical commit keeps the current array/object references so the memoization layer downstream bails instead of rebuilding — the A117-I1 selection churn + the A120-I1 markSaved churn, closed at the seven censused members)", () => {
  it("DEFECT (pure seam): sameIdSequence is the ORDER-SENSITIVE string-array content compare — same content+order true, different order/length/prefix false, empty forms safe", () => {
    expect(sameIdSequence(["a", "b"], ["a", "b"])).toBe(true);
    // The order is semantic state: a permutation is NOT content-identical.
    expect(sameIdSequence(["a", "b"], ["b", "a"])).toBe(false);
    expect(sameIdSequence(["a"], ["a", "a"])).toBe(false);
    expect(sameIdSequence([], [])).toBe(true);
    expect(sameIdSequence(["a"], [])).toBe(false);
    // A prefix is not the same sequence.
    expect(sameIdSequence(["a", "b"], ["a", "b", "c"])).toBe(false);
    expect(sameIdSequence(["a", "b", "c"], ["a", "b"])).toBe(false);
  });

  it("DEFECT (pure seam): elementContentIdentical is the keys-union complete content compare — identical true, one-field-different false, key-set asymmetry conservative-false (never wrongly preserving identity)", () => {
    const a = rect("a", 60, 80);
    const echo = { ...a };
    expect(elementContentIdentical(a, echo)).toBe(true);
    // One field different (the server normalized a value): NOT identical.
    expect(elementContentIdentical(a, { ...echo, x: 61 })).toBe(false);
    expect(elementContentIdentical(a, { ...echo, name: "renamed" })).toBe(false);
    expect(elementContentIdentical(a, { ...echo, visible: false })).toBe(false);
    // A key present on one side only: conservative-false (undefined !==
    // value) — the asymmetry never preserves identity.
    expect(
      elementContentIdentical(a, { ...echo, extra: "field" } as DesignElementDTO),
    ).toBe(false);
    const { name: _dropped, ...withoutName } = echo;
    expect(elementContentIdentical(a, withoutName as DesignElementDTO)).toBe(false);
  });

  it("DEFECT (pure seam): reuseStableElements preserves the CURRENT references for content-identical ids, gives changed rows/new ids the incoming reference, and the incoming ORDER wins (the replace contract's array order IS the sortOrder contract)", () => {
    const a = rect("a", 60, 80);
    const b = rect("b", 220, 140);
    const echoA = { ...a };
    const echoB = { ...b };
    // Content-identical round-trip: the OLD references survive.
    const out = reuseStableElements([a, b], [echoA, echoB]);
    expect(out[0]).toBe(a);
    expect(out[1]).toBe(b);
    // A changed row takes the incoming reference; an unchanged sibling
    // keeps its own (the surgical re-render: one element, not 2000).
    const changedB = { ...b, x: 999 };
    const out2 = reuseStableElements([a, b], [echoA, changedB]);
    expect(out2[0]).toBe(a);
    expect(out2[1]).toBe(changedB);
    expect(out2[1]).not.toBe(b);
    // A new id (the first-save remap form): the incoming reference.
    const fresh = rect("srv-1", 0, 0);
    const out3 = reuseStableElements([a], [echoA, fresh]);
    expect(out3[0]).toBe(a);
    expect(out3[1]).toBe(fresh);
    // The incoming order wins even when references are preserved.
    const out4 = reuseStableElements([a, b], [echoB, echoA]);
    expect(out4[0]).toBe(b);
    expect(out4[1]).toBe(a);
    // Empty current short-circuits to the incoming array.
    const out5 = reuseStableElements([], [echoA]);
    expect(out5[0]).toBe(echoA);
  });

  it("DEFECT (store arms): the selection arms keep the current selectedIds reference on content-identical commits — deselectAll on empty, select re-click, selectAll twice, additive no-new-ids, deleteElements with no selected id deleted", () => {
    // deselectAll on an already-empty selection: the reference survives.
    useEditorStore.setState({ selectedIds: [] });
    const emptyRef = useEditorStore.getState().selectedIds;
    useEditorStore.getState().deselectAll();
    expect(useEditorStore.getState().selectedIds).toBe(emptyRef);
    // A content-identical re-click (the A117-I1 registration's own
    // example: the layers-row click on the singly-selected row).
    useEditorStore.setState({ selectedIds: ["a"] });
    const singleRef = useEditorStore.getState().selectedIds;
    useEditorStore.getState().select(["a"]);
    expect(useEditorStore.getState().selectedIds).toBe(singleRef);
    // A DIFFERENT selection still commits (the change path unbroken).
    useEditorStore.getState().select(["b"]);
    expect(useEditorStore.getState().selectedIds).toEqual(["b"]);
    // selectAll twice: the second commit is content-identical.
    useEditorStore.getState().selectAll();
    const allRef = useEditorStore.getState().selectedIds;
    expect(useEditorStore.getState().selectedIds).toEqual(["a", "b"]);
    useEditorStore.getState().selectAll();
    expect(useEditorStore.getState().selectedIds).toBe(allRef);
    // Additive with no new ids: the merged array is content-identical.
    useEditorStore.getState().select(["a"], true);
    expect(useEditorStore.getState().selectedIds).toBe(allRef);
    // Additive WITH a new id still commits the union.
    useEditorStore.setState({ selectedIds: ["a"] });
    useEditorStore.getState().select(["b"], true);
    expect(useEditorStore.getState().selectedIds).toEqual(["a", "b"]);
    // deleteElements deleting a NON-selected element: the elements
    // change (the real transition) but the selectedIds reference
    // survives the matched-branch filter.
    useEditorStore.setState({ selectedIds: ["a"] });
    const keptRef = useEditorStore.getState().selectedIds;
    useEditorStore.getState().deleteElements(["b"]);
    expect(useEditorStore.getState().elements.map((el) => el.id)).toEqual(["a"]);
    expect(useEditorStore.getState().selectedIds).toBe(keptRef);
    // deleteElements deleting a SELECTED element still prunes.
    useEditorStore.getState().deleteElements(["a"]);
    expect(useEditorStore.getState().selectedIds).toEqual([]);
  });

  it("DEFECT (store): markSaved's content-identical round-trip preserves the element references AND the selectedIds reference — the post-first-save pure churn closed, the changed rows still taking fresh references", () => {
    const a = rect("a", 60, 80);
    const b = rect("b", 220, 140);
    useEditorStore.setState({ elements: [a, b], selectedIds: ["a"] });
    const selRef = useEditorStore.getState().selectedIds;
    // The server echo: fresh objects, identical content, identity remap.
    useEditorStore.getState().markSaved([{ ...a }, { ...b }], new Map());
    const after = useEditorStore.getState().elements;
    expect(after[0]).toBe(a);
    expect(after[1]).toBe(b);
    expect(useEditorStore.getState().selectedIds).toBe(selRef);
    expect(useEditorStore.getState().saveState).toBe("saved");
    // A CHANGED row (the server normalized a field): fresh reference —
    // the surgical re-render, the memo sees the change.
    useEditorStore.setState({ elements: [a, b], selectedIds: ["a"] });
    const normalizedB = { ...b, name: "clamped" };
    useEditorStore.getState().markSaved([{ ...a }, normalizedB], new Map());
    const after2 = useEditorStore.getState().elements;
    expect(after2[0]).toBe(a);
    expect(after2[1]).toBe(normalizedB);
    expect(after2[1]).not.toBe(b);
  });

  it("SURVIVAL (store): markSaved's FIRST-SAVE id remap still replaces — the documented store-replacing design's load-bearing half (the local-… → server id swap) is the regression guard the closure must never break", () => {
    const local = rect("local-1", 60, 80);
    useEditorStore.setState({ elements: [local], selectedIds: ["local-1"] });
    const serverRow = { ...local, id: "srv-1" };
    useEditorStore.getState().markSaved(
      [serverRow],
      new Map([["local-1", "srv-1"]]),
    );
    expect(useEditorStore.getState().elements[0].id).toBe("srv-1");
    // The remapped selection follows the server id.
    expect(useEditorStore.getState().selectedIds).toEqual(["srv-1"]);
    // A selection whose id vanished from the round-trip is pruned.
    useEditorStore.setState({ elements: [local], selectedIds: ["gone"] });
    useEditorStore.getState().markSaved([serverRow], new Map([["local-1", "srv-1"]]));
    expect(useEditorStore.getState().selectedIds).toEqual([]);
  });

  it("DEFECT (consumption census): the five arms consume the three seams — the seven-member live census at the store source (the F139 class-census-at-fix form: the fix's census is the live derivation)", () => {
    // The seams are born in the pure domain (the clampZoom/patchDiffers
    // precedent home) and exported.
    expect(editorLibSource).toContain("export function sameIdSequence");
    expect(editorLibSource).toContain("export function elementContentIdentical");
    expect(editorLibSource).toContain("export function reuseStableElements");
    // The store imports the selection seam and the reuse projection.
    expect(collapsed(storeSource)).toContain("sameIdSequence,");
    expect(collapsed(storeSource)).toContain("reuseStableElements,");
    // select consumes the seam in BOTH branches (the non-additive
    // re-click + the additive merge — members (a) and (b)).
    const selectMatch = storeSource.match(
      /select: \(ids, additive\) =>[\s\S]{0,700}?sameIdSequence/,
    );
    expect(selectMatch).not.toBeNull();
    // deselectAll (member (c)) and selectAll (member (d)) carry the
    // content-identical bound (the collapsed live form — the bare
    // ternary, the spec-form repair narrated at the spec's comment).
    expect(collapsed(storeSource)).toMatch(
      /deselectAll: \(\) => set\(\(state\) => state\.selectedIds\.length === 0 \? \{\} : \{ selectedIds: \[\] \}/,
    );
    expect(storeSource).toMatch(/selectAll[\s\S]{0,400}sameIdSequence/);
    // deleteElements' matched-branch filter carries the bound (member
    // (e)) — the selectedIds assignment rides the stable form.
    expect(storeSource).toMatch(
      /deleteElements[\s\S]{0,2200}sameIdSequence/,
    );
    // markSaved carries the reuse projection AND the selectedIds bound
    // (members (f) and (g)) — the window rides the family comment the
    // arm carries (the honest exclusion census lives at the seam).
    expect(storeSource).toMatch(/markSaved: \(elements, remap\) =>[\s\S]{0,2200}reuseStableElements/);
    expect(storeSource).toMatch(/markSaved: \(elements, remap\) =>[\s\S]{0,2600}sameIdSequence/);
    // The honest exclusions named at the census: loadProject and
    // restoreSnapshot stay reference-replacing (the lineage break and
    // the history machinery), the S110-A census comment updated in
    // place (the comment-truth discipline). RE-ANCHORED by S154-A (the
    // F140 prior-spec re-anchor rider: the claim stays true — the
    // exclusions still live at the seam — while the pinned spelling
    // moves with the narrowed live form restoreSnapshot's selectedIds
    // member joined the identity-bounded class at S154-A).
    expect(collapsed(storeSource)).toContain(
      "loadProject stays a by-definition real transition",
    );
    expect(collapsed(storeSource)).toContain(
      "selectedIds member is identity-bounded since S154-A",
    );
    // The plan's census section carries the seven-member enumeration.
    expect(collapsed(s153PlanSource)).toContain("SEVEN members across FIVE arms");
  });
});

// ---------------------------------------------------------------------------
// S153-B — the third zero-finding census registration + S153-C the
// per-session pin family (the survival forms + the doc-side RED members)
// ---------------------------------------------------------------------------

describe("S153-B/S153-C the third zero-finding census registration and the per-session pin family (the one-hundred-and-first audit's 0C/0H/0M/0L/0I — the third in the plan history; the F138 guard's second verification PASSED and its third instance rides this spec)", () => {
  it("SURVIVAL (worklog): the s153-clean-census-note bracketed registration — the one-hundred-and-first audit's 0C/0H/0M/0L/0I, the THIRD zero-finding census after S143's and S152's, the F138 guard's second verification PASSED (landed BEFORE this spec's birth — the S151-B precedent's honest survival classification)", () => {
    const note = auditEntry("Task ID: s153-clean-census-note");
    expect(note).not.toBe("");
    expect(collapsed(note)).toContain(
      "THE THIRD ZERO-FINDING CENSUS in the plan history",
    );
    expect(collapsed(note)).toContain(
      "the first: S143's ninety-first audit; the second: S152's one-hundredth",
    );
    expect(collapsed(note)).toContain("THE F138 GUARD'S SECOND VERIFICATION — PASSED");
    expect(collapsed(note)).toContain("the s152 plan's execution record section shipped 6/6 ticked");
    expect(collapsed(note)).toContain("b916639");
    // The plan-history claim was RE-DERIVED live at the note's birth
    // (the S143-A doctrine: the census does not quote its priors).
    expect(collapsed(note)).toContain(
      "finds exactly the two prior carriers, s143 and s152",
    );
  });

  it("SURVIVAL (docs): THE F138 GUARD'S THIRD INSTANCE — the s152 plan's execution record 6/6 ticked, zero unticked in the record section (the guard pins the PRIOR plan's record at this spec's birth, per the session_301 directive; the convention table s140..s152 every plan fully ticked)", () => {
    const record = s152PlanSource.slice(
      s152PlanSource.indexOf("## Execution record"),
    );
    const ticked = (record.match(/- \[x\]/g) ?? []).length;
    const unticked = (record.match(/- \[ \]/g) ?? []).length;
    expect(ticked).toBe(6);
    expect(unticked).toBe(0);
    // The s153 plan's own record section exists with the six-box
    // enumeration (the form; the TICK state is time-dependent —
    // unticked at this spec's birth, ticked at the delivery commit by
    // the F138 forward form, and pinned TICKED by the NEXT cycle's
    // spec at its birth — the guard's fourth instance; a pin can never
    // assert a time-dependent state, only the form and the prior
    // cycles' settled states).
    const s153Record = s153PlanSource.slice(
      s153PlanSource.indexOf("## Execution record"),
    );
    expect((s153Record.match(/- \[[ x]\]/g) ?? []).length).toBe(6);
  });

  it("SURVIVAL (worklog): the two s153 audit entries at their anchors with their ZERO censuses — both auditors' clean verdicts pinned at their own live forms (the honest zero form; the entries landed live during the audit phase, before this spec's birth)", () => {
    const a = auditEntry("Task ID: digma-s153-audit-A");
    const b = auditEntry("Task ID: digma-s153-audit-B");
    expect(a).not.toBe("");
    expect(b).not.toBe("");
    expect(collapsed(a)).toContain("Census: 0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational");
    expect(collapsed(b)).toContain("Census: 0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational");
    // The client-layer auditor's headline verdicts (the entries' own
    // live forms — the plain phrase, never a drafted markdown form).
    expect(collapsed(a)).toContain("CORRECT AND COMPLETE");
    expect(collapsed(a)).toContain(
      "THE F138 GUARD'S SECOND VERIFICATION: PASSED",
    );
    // The server-layer auditor's census sweep (the entries' own live
    // forms — the spelled-out ordinals and the long-form census
    // phrases, never a drafted shorthand).
    expect(collapsed(b)).toContain("21 Prisma write statements across 16 handler surfaces");
    expect(collapsed(b)).toContain("the twenty-sixth consecutive cycle");
  });

  it("SURVIVAL (scripts + live derivation): the s153 script provenance — live153/nav153/digma-seo-s153 tokens, the 129th/130th/90th ordinals, the S152 delivery at b916639, zero s152 residue — and the files member derived at runtime riding the growth-floor form", () => {
    expect(refAuditSource).toContain("live153");
    expect(refAuditSource).toContain("the 129th reference audit");
    expect(refAuditSource).toContain("the S152 delivery at HEAD b916639");
    expect(refAuditSource).toContain("byte-identical the 90th");
    expect(refAuditSource).toContain("ref-audit-s163");
    expect(navSource).toContain("nav153");
    expect(navSource).toContain("the 130th consecutive session");
    expect(navSource).toContain("the FINAL S153 build");
    expect(seoSource).toContain("digma-seo-s153");
    expect(seoSource).toContain("session 153, S153-cycle");
    // Zero s152 run-ordinal residue in the new scripts (the F89 family).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live152");
      expect(src).not.toContain("nav152");
      expect(src).not.toContain("seo-s152");
      expect(src).not.toContain("s162");
      expect(src).not.toContain("byte-identical the 89th");
      expect(src).not.toContain("eabe08c");
    }
    // The growth-floor live derivation: the spec's own file joins the
    // count at runtime (215 = the 214 delivery files + this spec).
    expect(liveTestFileCount).toBeGreaterThanOrEqual(215);
  });

  it("DEFECT (docs): the F140 lesson registered in the digma_SKILL — the identity-stability member inserted after F139, the version bumped to v1.131.0", () => {
    // The version chain: the frontmatter bumped.
    expect(skillSource).toMatch(/version: 1\.132\.0/);
    // The lesson: the identity-stability member after F139.
    const f139At = skillSource.indexOf("F139");
    const f140At = skillSource.indexOf("F140");
    expect(f139At).toBeGreaterThan(-1);
    expect(f140At).toBeGreaterThan(f139At);
    const f140Body = skillSource.slice(f140At, f140At + 2400);
    expect(collapsed(f140Body)).toContain("identity");
    expect(collapsed(f140Body)).toContain("content-identical");
  });

  it("DEFECT (docs): the count re-anchor — the v1.132.0 chain entry carries the S153 derivation (2134 = 2120 + 14 unit / 215 files) + the §7.1 row for the s153 spec", () => {
    expect(padSource).toMatch(/v1\.132\.0/);
    expect(padSource).toContain("2134 = 2120 + 14 unit / 215 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s153.test.ts`");
    // The live count-family rows re-anchored (found by CONTENT).
    expect(padUnitTotalRow()).toContain(UNIT);
    expect(padChecklistRow()).toContain(UNIT);
    expect(padCommandRow()).toContain(`${UNIT} checks`);
    // The live-derivation floor: the runtime count meets the figure.
    expect(String(liveTestFileCount)).toBe(FILES);
  });

  it("SURVIVAL (docs): the pair-unity claim forms riding the constants at every doc — the frozen coincidental literals classified out (the B145-I1 doctrine), every live claim site the same members", () => {
    // The rolling-safe form: this spec's constants equal the s152
    // spec's constants after the doc-update sweep re-anchors them
    // TOGETHER (the pair-unity is the count-honesty family's own
    // contract — a stale constant anywhere fails here).
    const s152Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s152.test.ts"),
      "utf8",
    );
    expect(s152Spec).toContain(`const UNIT = "${UNIT}";`);
    expect(s152Spec).toContain(`const FILES = "${FILES}";`);
    // Every spec carrying the constants carries the SAME pair (the
    // sweep is all-or-nothing; the scope matches the doc-update
    // sweep's own glob — every tests/*.test.ts, never only the
    // lows-sNNN family — the spec-form repair the RED run proved).
    const specs = readdirSync(path.resolve(import.meta.dirname, "."))
      .filter((f) => f.endsWith(".test.ts"));
    let unitCount = 0;
    let filesCount = 0;
    for (const spec of specs) {
      const text = readFileSync(path.resolve(import.meta.dirname, spec), "utf8");
      // The DECLARATION form at line start — never the comment-quoted
      // historical literals (the B145-I1 coincidental-literal class:
      // doc-lows-s85's comment carries `const FILES = "140"` inside
      // backticks, the frozen s85 history, never a live claim).
      if (/^const UNIT = /m.test(text)) {
        expect(text).toContain(`const UNIT = "${UNIT}";`);
        unitCount += 1;
      }
      if (/^const FILES = /m.test(text)) {
        expect(text).toContain(`const FILES = "${FILES}";`);
        filesCount += 1;
      }
    }
    // The growth floor: the count family grows monotonically.
    expect(unitCount).toBeGreaterThanOrEqual(33);
    expect(filesCount).toBeGreaterThanOrEqual(32);
  });
});
