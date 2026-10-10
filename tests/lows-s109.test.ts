import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

import { useEditorStore } from "@/components/editor/editor-store";
import type { DesignElementDTO } from "@/lib/editor";

// The session-109 spec (the fifty-seventh audit's chosen work):
//
// S109-A — the store-level no-op guard (A-L1, the headline): the no-op
//   commit family's STORE-LEVEL member. updateElements (editor-store.ts)
//   and scaleElements commit a FULL state transition even when NO id
//   matches: the map yields a new same-content array, saveState
//   unconditionally flips "unsaved", and the default commit=true pushes
//   an INERT history snapshot and WIPES redo — while their sibling
//   moveElements carries the `moved ? {…} : {}` guard this pair lacks.
//   Reachable window: an element deleted during the FileReader+
//   downscale window hits commitUpload's `?? element` floor
//   (properties-panel.tsx:995), the guard evaluates true against the
//   stale prop, and the panel's render-time selectedIds match nothing
//   post-delete → inert snapshot / wiped redo / phantom Unsaved badge /
//   byte-identical full-list PUT. Crucially the S107-A fix's own
//   comment claimed "update() no-ops on the missing id through the
//   store's own membership scan" — FALSIFIED by the store: the scan
//   blocks the patch, never the commit's state transition. Every prior
//   no-op sweep (S102-E click, S103-A text, S104-A number, S105-A
//   picker, S106-A file, S107-A temporal) enumerated the PANEL's
//   commit channels, never the STORE's own transition arms.
//
// S109-B — the load-effect header re-anchor (A-L2): editor-view.tsx's
//   load-effect header claimed "setState lands in the async
//   continuation only" — falsified by setLoading(true) at :1532
//   executing synchronously in the effect's sync prefix (an async
//   function's body runs synchronously until the first await, and no
//   await precedes the call on the Untitled->named same-instance swap
//   path). The S77-E site documents its own placement honestly; the
//   header predates it — the S101-B class inside the very effect
//   S77-E extended.
//
// S109-C — the count-truth record repairs (B-L1 + B-L2): the s108
//   records claimed "139 exports across the 14 libs" while the live
//   tree carries 125 named exports (re-derived parse-level; no
//   alternative derivation reaches 139), and the s108 plan's
//   execution-status row said "168 files" while its own line 9 and
//   the git-derived count say 169.
//
// S109-D — the vendored carve-out doctrine (A-I1): the F79 dead-export
//   census scopes to src/lib; the src/components/ui/ primitives are
//   the vendored shadcn public surface kept whole (DropdownMenuLabel/
//   Group/Portal, SelectGroup carry zero consumers BY the vendored
//   convention) — the carve-out becomes explicit AGENTS doctrine.
//
// S109-E — the per-session pin family (the s109 forms' contracts):
//   the verify-nav s109 contract, the ref-audit s109 provenance
//   anchors, the standing datum survival pins, and the seo-check s109
//   fail-loud carried-forward forms.

const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s109.sh"),
  "utf8",
);
const refSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s109.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s109.sh"),
  "utf8",
);
const s108Plan = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session108.md"),
  "utf8",
);
const s109Plan = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session109.md"),
  "utf8",
);
const agentsDoc = readFileSync(
  path.resolve(import.meta.dirname, "../AGENTS.md"),
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
    elements: [rect("a", 60, 80)],
    selectedIds: ["a"],
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

describe("S109-A the store-level no-op guard (A-L1 — the headline, the no-op commit family's store-level member)", () => {
  it("DEFECT (behavioral): updateElements with ZERO matching ids never flips saveState, never pushes history, never wipes redo, keeps the elements identity", () => {
    // The delete-mid-window form: the panel's commitUpload fires
    // update() with the stale element's id after the element was
    // deleted — pre-fix the store answered an inert snapshot + a
    // phantom Unsaved badge + a wiped redo stack.
    const elementsBefore = useEditorStore.getState().elements;
    useEditorStore.getState().updateElements(["deleted-mid-window"], { fill: "#FF0000" });
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("saved");
    expect(s.past).toHaveLength(0);
    expect(s.future).toHaveLength(0);
    expect(s.elements).toBe(elementsBefore);
  });

  it("DEFECT (behavioral): scaleElements with ZERO matching ids never flips saveState, never pushes history, keeps the elements identity", () => {
    const elementsBefore = useEditorStore.getState().elements;
    useEditorStore.getState().scaleElements(["deleted-mid-window"], 2);
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("saved");
    expect(s.past).toHaveLength(0);
    expect(s.future).toHaveLength(0);
    expect(s.elements).toBe(elementsBefore);
  });

  it("DEFECT (source): the matched guard rides BOTH store arms (the moveElements id-match form)", () => {
    const updateStart = storeSource.indexOf("updateElements: (ids, patch, commit = true) =>");
    expect(updateStart).toBeGreaterThan(-1);
    const updateEnd = storeSource.indexOf("scaleElements: (ids, factor, commit = true) =>", updateStart);
    const updateBlock = storeSource.slice(updateStart, updateEnd);
    expect(updateBlock).toMatch(/if \(!matched\) return \{\};/);

    const scaleStart = storeSource.indexOf("scaleElements: (ids, factor, commit = true) =>");
    expect(scaleStart).toBeGreaterThan(-1);
    const scaleEnd = storeSource.indexOf("moveElements: (ids, dx, dy) =>", scaleStart);
    const scaleBlock = storeSource.slice(scaleStart, scaleEnd);
    expect(scaleBlock).toMatch(/if \(!matched\) return \{\};/);
  });

  it("DEFECT (source): the falsified S107-A comment is re-anchored onto the S109-A store-level no-op", () => {
    // THE DEFECT PIN: the pre-fix comment claimed "update() no-ops on
    // the missing id through the store's own membership scan" — the
    // scan blocked the PATCH, never the commit's state transition.
    expect(panelSource).not.toContain("through the store's own membership scan");
    // The honest form: the S109-A id-match guard makes the no-op claim
    // true at the STORE level, and the comment says so.
    expect(panelSource).toMatch(/S109-A/);
    expect(panelSource).toMatch(/id-match guard/);
    expect(panelSource).toMatch(/never flips saveState/);
  });

  it("SURVIVAL (behavioral): updateElements with MATCHING ids keeps the full contract (saveState flips, history pushes at commit=true, coalesces at commit=false)", () => {
    useEditorStore.getState().updateElements(["a"], { fill: "#00FF00" });
    let s = useEditorStore.getState();
    expect(s.saveState).toBe("unsaved");
    expect(s.past).toHaveLength(1);
    expect(s.elements.find((el) => el.id === "a")?.fill).toBe("#00FF00");

    // The coalescing arm (commit=false — the gesture seam's form).
    useEditorStore.setState({ saveState: "saved", past: [], future: [] });
    useEditorStore.getState().updateElements(["a"], { fill: "#0000FF" }, false);
    s = useEditorStore.getState();
    expect(s.saveState).toBe("unsaved");
    expect(s.past).toHaveLength(0);
    expect(s.elements.find((el) => el.id === "a")?.fill).toBe("#0000FF");
  });

  it("SURVIVAL (behavioral): a PARTIAL-match batch (one live + one dead id) still commits for the live member", () => {
    useEditorStore.getState().updateElements(["a", "deleted-mid-window"], { fill: "#123456" });
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("unsaved");
    expect(s.past).toHaveLength(1);
    expect(s.elements.find((el) => el.id === "a")?.fill).toBe("#123456");
  });

  it("SURVIVAL (behavioral): scaleElements with MATCHING ids keeps the full contract (the S86-B clamped products)", () => {
    useEditorStore.getState().scaleElements(["a"], 2);
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("unsaved");
    expect(s.past).toHaveLength(1);
    const el = s.elements.find((e) => e.id === "a");
    expect(el?.width).toBe(400);
    expect(el?.height).toBe(300);
  });
});

describe("S109-B the load-effect header re-anchor (A-L2 — the F78 comment-truth family)", () => {
  it("DEFECT: the false \"async continuation only\" header is re-anchored onto the honest S77-E placement form", () => {
    // THE DEFECT PIN: pre-fix the header claimed
    // "setState lands in the async continuation only" while
    // setLoading(true) at :1532 runs in the async function's SYNC
    // prefix (no await precedes it on the swap path).
    expect(viewSource).not.toContain("setState lands in the async continuation only");
    // The honest form names the async prefix and the same-project skip.
    expect(viewSource).toMatch(/async prefix[\s\S]{0,200}same-project skip/);
  });
});

describe("S109-C the count-truth record repairs (B-L1 + B-L2 — the S101-B class in the s108 records)", () => {
  it("DEFECT: the falsified \"139 exports\" claim is re-anchored onto the derived 125", () => {
    expect(s108Plan).not.toContain("139 exports");
    expect(s108Plan).toMatch(/125 named exports/);
  });

  it("DEFECT: the \"168 files\" typo in the s108 execution-status row is re-anchored onto 169", () => {
    expect(s108Plan).not.toContain("/ 168 files");
    expect(s108Plan).toContain("1382 / 169 files");
  });

  it("The fresh s109 record carries the honest export census", () => {
    expect(s109Plan).toContain("125 named exports");
  });
});

describe("S109-D the vendored carve-out doctrine (A-I1 — the F79 census's scope boundary)", () => {
  it("DEFECT: the AGENTS convention names the vendored ui/ public-surface scope for the dead-export census", () => {
    expect(agentsDoc).toMatch(/src\/components\/ui\/[\s\S]{0,300}vendored/);
    expect(agentsDoc).toMatch(/dead-export census scopes to[\s\S]{0,80}src\/lib/);
  });
});

describe("S109-E the per-session pin family (the s109 forms' contracts)", () => {
  it("PIN: the verify-nav s109 contract (the ordinal/descriptor/session/log-file/9-check family)", () => {
    expect(navSource).toContain("the 86th consecutive session");
    expect(navSource).toContain("the S108 delivery b6a56a4 + the S109 remediation");
    expect(navSource).toContain("digma-nav109.log");
    expect(navSource).toContain("--session nav109");
    // The 9-check enumeration with the class-A guard.
    expect(navSource).toMatch(/9 checks: the 44x44 hamburger/);
    expect(navSource).toMatch(/class-A guard/);
    // The hermetic seven-knob boot strip.
    expect(navSource).toMatch(/env -u DIGMA_PROXY_HOPS -u DIGMA_DISABLE_IN_APP_RESET -u DIGMA_DISABLE_IN_APP_OTP -u DIGMA_REPO_ROOT -u DIGMA_SITE_URL -u HOSTNAME -u KEEP_ALIVE_TIMEOUT/);
    // Zero nav108 residue.
    expect(navSource).not.toContain("nav108");
    expect(navSource).not.toContain("digma-nav108.log");
    expect(navSource).not.toContain("85th consecutive");
  });

  it("PIN: the ref-audit s109 provenance comments carry the S109 anchor (all four), zero Session-108 leftovers", () => {
    const anchors = refSource.match(/Session 109 \(S109 derivation/g) ?? [];
    expect(anchors).toHaveLength(4);
    expect(refSource).not.toMatch(/Session 108 \(S108 derivation/);
    expect(refSource).toContain("the 85th reference audit");
    expect(refSource).toContain("the S108 delivery at HEAD b6a56a4");
    expect(refSource).toContain("ref-audit-s119");
  });

  it("SURVIVAL: the ref-audit s109 keeps the fail-loud datum pins the derivation must not disturb", () => {
    expect(refSource).toContain("F89 CHECK FAILED");
    expect(refSource).toMatch(/shot\(\)[\s\S]{0,200}is empty/);
    expect(refSource).toContain("nav=[124x36,96x36,92x36]");
    expect(refSource).toContain("clip=[Share:L385-R458,Present:L466-R551]");
    // The S92-B env-var login form — never a literal credential.
    expect(refSource).toContain('REF_EMAIL="${REF_LOGIN_EMAIL:-}"');
    expect(refSource).not.toContain("sepnetflix2023");
    expect(refSource).not.toContain("$Abcd1234");
  });

  it("PIN: the seo-check s109 keeps the fail-loud forms (the F95 doctrine carried forward)", () => {
    expect(seoSource).toContain("session 109, S109-cycle");
    expect(seoSource).toMatch(/port \$SEO_PORT already answers/);
    expect(seoSource).toContain("Sitemap: https://digma.example.com/sitemap.xml");
    expect(seoSource).toMatch(/<loc>https:\/\/digma\.example\.com\//);
    expect(seoSource).toMatch(/carries localhost under the knob/);
    expect(seoSource).toMatch(/\[ "\$FAIL" = "0" \] \|\| exit 1/);
    expect(seoSource).not.toContain("seo-s108.log");
  });
});
