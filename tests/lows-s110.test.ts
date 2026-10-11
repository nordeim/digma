import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

import { useEditorStore } from "@/components/editor/editor-store";
import type { DesignElementDTO } from "@/lib/editor";

// The session-110 spec (the fifty-eighth audit's chosen work):
//
// S110-A — the no-op commit family's store-level COMPLETION (A-L1 +
//   A-I1 + A-I2, the headline): S109-A closed the family's first two
//   store members (updateElements/scaleElements) while THREE sibling
//   arms carried the identical unguarded shape at the same layer —
//   deleteElements (:404-414 — the filter yields a new same-content
//   array, past pushes, future wipes, saveState flips "unsaved"),
//   toggleVisibility (:454-463), toggleLock (:465-472) — plus the
//   family's empty-batch member (addElements: an empty batch with
//   room>0 commits the full transition AND WIPES THE SELECTION) and
//   its same-value member (setBackgroundColor: a re-commit of the
//   current color flips "unsaved"). The F96 lesson recurring inside
//   its own fix's own layer: the S109-A closure framed the
//   store-level member as singular while the census at the layer
//   that owns the transition had five arms left. After S110-A every
//   element/board mutation arm that commits history carries a no-op
//   bail (the eight-arm census closes: addElements, updateElements,
//   scaleElements, moveElements, deleteElements, reorderElements,
//   toggleVisibility, toggleLock, setBackgroundColor — loadProject/
//   markSaved/restoreSnapshot are by-definition real transitions).
//
// S110-B — the verify-nav boot's fail-loud completion (B-L1 + B-I2):
//   the F89/S99-F port-squat family's last open booting sibling.
//   verify-nav-s110.sh booted :3000 with no pre-kill, no port-squat
//   refusal, and no never-up gate — a lingering server answers the
//   health loop while the fresh boot dies EADDRINUSE silently, and
//   all 9/9 checks certify the WRONG build with exit 0. The closure:
//   the pkill trio + the refusal BEFORE the boot + the UP gate after
//   it (the smoke/seo-check/playwright sibling forms).
//
// S110-C — the load-effect header's path-qualified re-anchor (A-L2):
//   the S109-B re-anchor's own text over-claimed — "the call runs in
//   the async function's SYNC prefix, before the first await" is
//   TRUE on the plain-mount and adoption paths but FALSE on the
//   different-project swap path (the S80-A drain await at :1446 and
//   the S85-A leave-transport await at :1465 precede setLoading(true)
//   at :1535). The honest form path-qualifies the claim. Zero
//   behavior change.
//
// S110-D — the count-truth record repairs (B-I1 + A-I3): the clip
//   ordinal re-derived (84th audit = 45th, 85th = 46th, so the 86th
//   run = the 47th consecutive — the s110-pre worklog's "46th" was
//   the pre-run state); the PAD's S94-B row anchors re-anchored onto
//   the live lines (ai-assistant.tsx:594/:627, properties-panel.tsx:1059).
//
// S110-E — the per-session pin family (the s110 forms' contracts):
//   the verify-nav s110 contract, the ref-audit s110 provenance
//   anchors, the seo-check s110 fail-loud carried-forward forms, and
//   the standing datum survival pins.

const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s110.sh"),
  "utf8",
);
const refSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s110.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s110.sh"),
  "utf8",
);
const s110Plan = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session110.md"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);

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
    opacity: 1,
    visible: true,
    locked: false,
    fill: "#3B82F6",
    stroke: null,
    strokeWidth: 0,
    radius: 0,
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

describe("S110-A the no-op commit family's store-level completion (A-L1 + A-I1 + A-I2 — the headline)", () => {
  it("DEFECT (behavioral): deleteElements with ZERO matching ids never flips saveState, never pushes history, never wipes redo, keeps the elements identity", () => {
    const elementsBefore = useEditorStore.getState().elements;
    const selectionBefore = useEditorStore.getState().selectedIds;
    useEditorStore.getState().deleteElements(["deleted-mid-window", "also-gone"]);
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("saved");
    expect(s.past).toHaveLength(0);
    expect(s.future).toHaveLength(0);
    expect(s.elements).toBe(elementsBefore);
    expect(s.selectedIds).toBe(selectionBefore);
  });

  it("DEFECT (behavioral): toggleVisibility with an unknown id never flips saveState, never pushes history, keeps the elements identity", () => {
    const elementsBefore = useEditorStore.getState().elements;
    useEditorStore.getState().toggleVisibility("no-such-element");
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("saved");
    expect(s.past).toHaveLength(0);
    expect(s.future).toHaveLength(0);
    expect(s.elements).toBe(elementsBefore);
    expect(s.elements[0].visible).toBe(true);
  });

  it("DEFECT (behavioral): toggleLock with an unknown id never flips saveState, never pushes history, keeps the elements identity", () => {
    const elementsBefore = useEditorStore.getState().elements;
    useEditorStore.getState().toggleLock("no-such-element");
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("saved");
    expect(s.past).toHaveLength(0);
    expect(s.future).toHaveLength(0);
    expect(s.elements).toBe(elementsBefore);
    expect(s.elements[0].locked).toBe(false);
  });

  it("DEFECT (behavioral): addElements with an EMPTY batch never flips saveState, never pushes history, never wipes the selection, keeps the elements identity", () => {
    const elementsBefore = useEditorStore.getState().elements;
    const selectionBefore = useEditorStore.getState().selectedIds;
    const ids = useEditorStore.getState().addElements([]);
    const s = useEditorStore.getState();
    expect(ids).toEqual([]);
    expect(s.saveState).toBe("saved");
    expect(s.past).toHaveLength(0);
    expect(s.future).toHaveLength(0);
    expect(s.elements).toBe(elementsBefore);
    expect(s.selectedIds).toBe(selectionBefore);
  });

  it("DEFECT (behavioral): setBackgroundColor with the CURRENT value never flips saveState, never pushes history, keeps the identity", () => {
    const elementsBefore = useEditorStore.getState().elements;
    useEditorStore.getState().setBackgroundColor("#0D1117");
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("saved");
    expect(s.past).toHaveLength(0);
    expect(s.future).toHaveLength(0);
    expect(s.elements).toBe(elementsBefore);
  });

  it("DEFECT (source): the id-match guard rides deleteElements/toggleVisibility/toggleLock (the S109-A if (!matched) return {} form)", () => {
    const delStart = storeSource.indexOf("deleteElements: (ids) =>");
    expect(delStart).toBeGreaterThan(-1);
    const delEnd = storeSource.indexOf("reorderElements: (fromIds, toIndex) =>", delStart);
    const delBlock = storeSource.slice(delStart, delEnd);
    expect(delBlock).toMatch(/if \(!matched\) return \{\};/);

    const visStart = storeSource.indexOf("toggleVisibility: (id) =>");
    expect(visStart).toBeGreaterThan(-1);
    const visEnd = storeSource.indexOf("toggleLock: (id) =>", visStart);
    const visBlock = storeSource.slice(visStart, visEnd);
    expect(visBlock).toMatch(/if \(!matched\) return \{\};/);

    const lockStart = storeSource.indexOf("toggleLock: (id) =>");
    expect(lockStart).toBeGreaterThan(-1);
    const lockEnd = storeSource.indexOf("setBackgroundColor: (color) =>", lockStart);
    const lockBlock = storeSource.slice(lockStart, lockEnd);
    expect(lockBlock).toMatch(/if \(!matched\) return \{\};/);
  });

  it("DEFECT (source): the empty-batch floor rides addElements and the same-value guard rides setBackgroundColor", () => {
    const addStart = storeSource.indexOf("addElements: (partials) =>");
    expect(addStart).toBeGreaterThan(-1);
    const addEnd = storeSource.indexOf("updateElements: (ids, patch, commit = true) =>", addStart);
    const addBlock = storeSource.slice(addStart, addEnd);
    expect(addBlock).toMatch(/if \(accepted\.length === 0\) return \[\];/);

    const bgStart = storeSource.indexOf("setBackgroundColor: (color) =>");
    expect(bgStart).toBeGreaterThan(-1);
    const bgEnd = storeSource.indexOf("beginGesture: () =>", bgStart);
    const bgBlock = storeSource.slice(bgStart, bgEnd);
    expect(bgBlock).toMatch(/if \(state\.backgroundColor === color\) return \{\};/);
  });

  it("SURVIVAL (behavioral): deleteElements with MATCHING ids keeps the full contract (removes, prunes selection, pushes history, flips unsaved)", () => {
    useEditorStore.getState().deleteElements(["a"]);
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("unsaved");
    expect(s.past).toHaveLength(1);
    expect(s.elements.map((el) => el.id)).toEqual(["b"]);
    expect(s.selectedIds).toEqual(["b"]);
  });

  it("SURVIVAL (behavioral): the toggles on a LIVE id flip the field and push history", () => {
    useEditorStore.getState().toggleVisibility("a");
    let s = useEditorStore.getState();
    expect(s.saveState).toBe("unsaved");
    expect(s.past).toHaveLength(1);
    expect(s.elements.find((el) => el.id === "a")?.visible).toBe(false);

    useEditorStore.setState({ saveState: "saved", past: [], future: [] });
    useEditorStore.getState().toggleLock("b");
    s = useEditorStore.getState();
    expect(s.saveState).toBe("unsaved");
    expect(s.past).toHaveLength(1);
    expect(s.elements.find((el) => el.id === "b")?.locked).toBe(true);
  });

  it("SURVIVAL (behavioral): addElements with a NON-EMPTY batch adds, selects, returns the ids", () => {
    const ids = useEditorStore.getState().addElements([
      { type: "ellipse", x: 10, y: 10, width: 80, height: 80 },
    ]);
    const s = useEditorStore.getState();
    expect(ids).toHaveLength(1);
    expect(s.saveState).toBe("unsaved");
    expect(s.past).toHaveLength(1);
    expect(s.elements).toHaveLength(3);
    expect(s.selectedIds).toEqual(ids);
  });

  it("SURVIVAL (behavioral): setBackgroundColor with a NEW value commits it and flips unsaved", () => {
    useEditorStore.getState().setBackgroundColor("#10192C");
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("unsaved");
    expect(s.backgroundColor).toBe("#10192C");
  });

  it("SURVIVAL (source): the S109-A guards on updateElements/scaleElements survive untouched", () => {
    const updateStart = storeSource.indexOf("updateElements: (ids, patch, commit = true) =>");
    expect(updateStart).toBeGreaterThan(-1);
    const updateEnd = storeSource.indexOf("scaleElements: (ids, factor, commit = true) =>", updateStart);
    const updateBlock = storeSource.slice(updateStart, updateEnd);
    expect(updateBlock).toMatch(/if \(!matched\) return \{\};/);

    const scaleStart = storeSource.indexOf("scaleElements: (ids, factor, commit = true) =>");
    const scaleEnd = storeSource.indexOf("moveElements: (ids, dx, dy) =>", scaleStart);
    const scaleBlock = storeSource.slice(scaleStart, scaleEnd);
    expect(scaleBlock).toMatch(/if \(!matched\) return \{\};/);
  });
});

describe("S110-B the verify-nav boot's fail-loud completion (B-L1 + B-I2 — the port-squat family's last open booting sibling)", () => {
  it("DEFECT (source): the pkill trio runs BEFORE the boot", () => {
    const bootLine = navSource.indexOf("bun .next/standalone/server.js");
    expect(bootLine).toBeGreaterThan(-1);
    const preBoot = navSource.slice(0, bootLine);
    expect(preBoot).toMatch(/pkill -f "standalone\/server\.js"/);
    expect(preBoot).toMatch(/pkill -f "next start"/);
    expect(preBoot).toMatch(/pkill -f "next dev"/);
  });

  it("DEFECT (source): the port-squat refusal runs BEFORE the boot (the exit 1 form)", () => {
    const bootLine = navSource.indexOf("bun .next/standalone/server.js");
    const preBoot = navSource.slice(0, bootLine);
    expect(preBoot).toMatch(/curl -sf -m 2 "http:\/\/localhost:3000\/api\/health"/);
    expect(preBoot).toMatch(/exit 1/);
    expect(preBoot).toMatch(/already answers/);
  });

  it("DEFECT (source): the never-up gate follows the health loop (the UP != 1 exit form)", () => {
    const bootLine = navSource.indexOf("bun .next/standalone/server.js");
    const postBoot = navSource.slice(bootLine);
    expect(postBoot).toMatch(/UP=1/);
    expect(postBoot).toMatch(/"\$UP" != "1"/);
    expect(postBoot).toMatch(/exit 1/);
    expect(postBoot).toMatch(/never came up/);
  });

  it("SURVIVAL (source): the 9-check enumeration, the hermetic strip, and the ordinal contract all survive", () => {
    expect(navSource).toContain("the 87th consecutive session");
    expect(navSource).toContain("the S109 delivery 4273b36");
    expect(navSource).toContain("--session nav110");
    expect(navSource).toContain("/tmp/digma-nav110.log");
    expect(navSource).toMatch(/env -u DIGMA_PROXY_HOPS -u DIGMA_DISABLE_IN_APP_RESET/);
    expect(navSource).toMatch(/Tailwind v4 failure class A/);
    expect(navSource).toContain('echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed');
    expect(navSource).toMatch(/\[ "\$FAIL" = "0" \] \|\| exit 1/);
  });
});

describe("S110-C the load-effect header's path-qualified re-anchor (A-L2 — the S109-B form's own over-claim)", () => {
  // The header's claims wrap across comment lines and carry "//"
  // prefixes — strip both before matching (the F89 lesson: a
  // line-broken or marker-broken target makes an ABSENT pin pass
  // trivially — hollow evidence).
  const viewNormalized = viewSource.replace(/\/\/+/g, " ").replace(/\s+/g, " ");

  it("DEFECT (source): the falsified universal sync-prefix claim is ABSENT from editor-view.tsx", () => {
    // The pre-fix header claimed the setState "runs in the async
    // function's SYNC prefix, before the first await, never in the
    // effect's sync body directly" — as a UNIVERSAL claim. The swap
    // path falsifies it: the S80-A drain await and the S85-A
    // leave-transport await precede setLoading(true).
    expect(viewNormalized).not.toContain(
      "the call runs in the async function's SYNC prefix, before the first await, never in the effect's sync body directly",
    );
  });

  it("DEFECT (source): the honest path-qualified form is PRESENT (the S110-C marker + the swap-path acknowledgment)", () => {
    // Session 111 (S111-B) re-anchor: the header gained the four-family
    // taxonomy — the S110-C marker now rides the S111-B block's own
    // back-reference ("the S110-C form's own path census missed two
    // families"), and the swap-path acknowledgment survives inside it.
    expect(viewSource).toMatch(/S110-C/);
    expect(viewSource).toMatch(/swap path/);
    expect(viewSource).toMatch(/drain/);
    expect(viewSource).toMatch(/re-entry mount/);
  });

  it("SURVIVAL (source): the universally-true core survives (never in the effect's sync body directly)", () => {
    const loadStart = viewNormalized.indexOf("Load the project once");
    expect(loadStart).toBeGreaterThan(-1);
    const header = viewNormalized.slice(loadStart, loadStart + 1200);
    expect(header).toMatch(/never in the effect's sync body directly/);
    // Session 111 (S111-B): the two-family form ("plain-mount and
    // adoption paths") became the four-family taxonomy — the survival
    // pin re-anchors onto its honest current form.
    expect(header).toMatch(/adoption path/ );
    expect(header).toMatch(/plain mount/);
  });
});

describe("S110-D the count-truth record repairs (B-I1 + A-I3)", () => {
  it("DEFECT (record): this plan carries the honest 47th-at-the-86th clip ordinal", () => {
    expect(s110Plan).toContain("the 47th consecutive session at the 86th audit");
    expect(s110Plan).toContain("the s111 derivation instruction: bump to \"47th at the 86th\"");
  });

  it("DEFECT (record): the PAD's S94-B row carries the LIVE anchors (594/627/1059), not the stale ones", () => {
    const rowStart = padSource.indexOf("S94-B (A94-I1): the arbitrary-hex closed-set inventory pin");
    expect(rowStart).toBeGreaterThan(-1);
    const row = padSource.slice(rowStart, rowStart + 1200);
    expect(row).toContain("ai-assistant.tsx:594/:627");
    expect(row).toContain("properties-panel.tsx:1059");
    expect(row).not.toContain("ai-assistant.tsx:523/:556");
    expect(row).not.toContain("properties-panel.tsx:874,");
  });
});

describe("S110-E the per-session pin family (the s110 forms' contracts)", () => {
  it("the ref-audit s110 provenance anchors: Session 110 on all four, zero Session-109 leftovers in the provenance set", () => {
    const provenance = refSource.match(/Session 110 \(S110 derivation of the s109 standing form/g) ?? [];
    expect(provenance).toHaveLength(4);
    expect(refSource).not.toMatch(/Session 109 \(S109 derivation of the s108 standing form/);
    expect(refSource).toContain("the 86th reference audit");
    expect(refSource).toContain("the S109 delivery at HEAD 4273b36");
    expect(refSource).toContain("ref-audit-s120");
    expect(refSource).toContain("--session live110");
  });

  it("the ref-audit standing datum survival pins (the nav + clip DRIFT pins survive)", () => {
    expect(refSource).toContain("'nav=[124x36,96x36,92x36]'");
    expect(refSource).toContain("'clip=[Share:L385-R458,Present:L466-R551]'");
    expect(refSource).toMatch(/DRIFT: nav links changed/);
    expect(refSource).toMatch(/DRIFT: the mobile editor header clipping changed/);
    // The fail-loud login gate survives.
    expect(refSource).toMatch(/F89 CHECK FAILED: the login did not take/);
    // The shot() discipline survives.
    expect(refSource).toMatch(/F89 CHECK FAILED: \$1 is empty/);
  });

  it("the seo-check s110 fail-loud carried forms", () => {
    expect(seoSource).toMatch(/F89 CHECK FAILED: port \$SEO_PORT already answers/);
    expect(seoSource).toMatch(/F89 CHECK FAILED: the SEO server never came up/);
    expect(seoSource).toContain("session 110, S110-cycle");
    expect(seoSource).toMatch(/\[ "\$FAIL" = "0" \] \|\| exit 1/);
    // The knob is never stripped (the knob-under-test rule).
    const stripLine = seoSource.match(/env -u [^\n]+\\/);
    expect(stripLine).not.toBeNull();
    expect(stripLine![0]).not.toContain("DIGMA_SITE_URL");
  });

  it("the s110 plan's deferred queue carries the sharpened B-I3 + the recorded A-I4/A-I5 (no silent drops)", () => {
    expect(s110Plan).toContain("sequentially reproducible");
    expect(s110Plan).toContain("TEAM_COLORS");
    expect(s110Plan).toContain("A-I5");
  });
});
