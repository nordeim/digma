import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

import { useEditorStore, type EditorSnapshot } from "@/components/editor/editor-store";
import type { DesignElementDTO } from "@/lib/editor";

// The session-115 spec (the sixty-third audit's chosen work):
//
// S115-A — the store-level value-diff guard on updateElements (A115-L1,
//   the headline): the resize write-back (canvas.tsx:301-310) was the
//   no-op commit family's last unguarded caller — the per-pointermove
//   updateElements([el.id], {x/y/width/height clamped}, false) carried
//   only the S109-A id-match guard, so a clamp-saturated drag (an
//   element already at width 1 dragged against the floor; a
//   bound-pinned element dragged outward) committed a same-value patch
//   on EVERY move: new identities, saveState "unsaved", the 800ms
//   subscriber arming a byte-identical full-list PUT (a row-heavy
//   delete+recreate transaction for zero changes). The S111-A
//   endGesture net-zero guard cancels only the HISTORY half. The
//   guard lands at the layer that owns the transition (the F96/F97
//   doctrine) and compares the LIVE element — the arm recomputes
//   absolutely from startBounds, so a call-site guard comparing the
//   gesture's captured el would strand an out-and-back gesture's
//   intermediate value. Three of the six callers already guard
//   upstream through the ONE patchDiffers seam (the AI apply's patch
//   + scale arms, commitUpload, the layers-panel rename) — no
//   behavior change; the two shared update helpers gain the guard.
//
// S115-B — the schema field note's honest amendment (B115-L1): the
//   fillImageThumb note still ended "NOT counted by fillImageBytes
//   (see the counter's comment above)" while that very counter
//   comment (the S114-A amendment 40 lines up) states the opposite —
//   the code sums both families at all four sites. A maintainer
//   following the field note's pointer lands on the opposite
//   doctrine — the exact doc-drift direction that produced B114-M1
//   (reverting addBytes as a "double-count"). The includes-form
//   replaces the contradiction, with a negative pin.
//
// S115-C — the fine prints (A115-I1 + A115-I2 + A115-I3): the dead
//   ternary false-arm after the S114-C guard (longest >
//   THUMB_MAX_DIM is always true at :1011 — the honest k =
//   THUMB_MAX_DIM / longest); the lows-s113 absent pin's missing
//   length floor (the F100 hollow-slice class — an anchor rename
//   would empty the slice and pass it hollow); the snapshotsEqual
//   comment's nested-object rationale on an all-primitive DTO
//   (fillGradient is a JSON string — the compare is exact trivially,
//   more exact than claimed, never less).
//
// S115-D — the zero-addBytes gate (B115-I1): a board whose counter
//   already exceeds 24 MB (legacy pre-S112, or the documented
//   adversarial ~31 MB single-PUT posture) rejected EVERY POST
//   including image-less ones, while the S112-C comment promises
//   "the write that would push the board past the bound" — a
//   zero-byte add pushes nothing. An operator adding a text box to a
//   legacy over-cap board mid-recovery got the image-cap 400. The
//   gate: addBytes > 0 && — an image-less row stores no fill-family
//   bytes; the counter only grows through gated paths; no channel
//   opens.
//
// S115-E — the per-session family (B115-I3 + the s115 forms): the
//   verify-nav/ref-audit/seo-check s115 derivation pins (the frozen
//   attributions preserved — the s108 birth attribution, the 91st
//   audit form, the 52nd consecutive clip ordinal), the standing
//   datum constants, the deferred queue re-derivation.

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
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
const elementsRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
  "utf8",
);
const schemaSource = readFileSync(
  path.resolve(import.meta.dirname, "../prisma/schema.prisma"),
  "utf8",
);
const s113Source = readFileSync(
  path.resolve(import.meta.dirname, "./lows-s113.test.ts"),
  "utf8",
);
const nav115Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s115.sh"),
  "utf8",
);
const refAudit115Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s115.sh"),
  "utf8",
);
const seo115Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s115.sh"),
  "utf8",
);

/** The comment-stripped collapsed view (the F89/F100 form: line
 * prefixes stripped BEFORE the join so multi-line targets stay
 * visible; the receiver-prefixed code forms discriminate code from
 * the repair's own prose). */
function collapsed(source: string): string {
  return source
    .split("\n")
    .map((l) => l.replace(/^\s*(?:\/\/|#)\s?/, "").trim())
    .filter((l) => l.length > 0)
    .join(" ")
    .replace(/\s+/g, " ");
}

const panelCollapsed = collapsed(panelSource);
const storeCollapsed = collapsed(storeSource);
const elementsCollapsed = collapsed(elementsRouteSource);
const schemaCollapsed = collapsed(schemaSource);

/** A minimal rectangle DTO for driving the store (the F89 fixture
 * lesson: the fill-family fields carried EXPLICITLY null — the real
 * model never carries undefined). */
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
    fillGradient: null,
    fillImage: null,
    fillImageFit: null,
    fillImageThumb: null,
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

describe("S115-A the store-level value-diff guard on updateElements (A115-L1 — the headline)", () => {
  it("DEFECT (behavioral): a same-value patch on a matched id never flips saveState, never pushes history, never wipes redo, keeps the elements identity", () => {
    const elementsBefore = useEditorStore.getState().elements;
    // A seeded redo entry — the family's "never wipes redo" member is
    // only honest against a NON-empty future stack.
    const redoSeed: EditorSnapshot = {
      elements: elementsBefore.map((el) => ({ ...el })),
      backgroundColor: "#0D1117",
    };
    useEditorStore.setState({ saveState: "saved", past: [], future: [redoSeed] });
    // rect("a")'s seed fill — the clamp-saturated resize's same-value
    // patch in its exact form.
    useEditorStore.getState().updateElements(["a"], { fill: "#3B82F6" });
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("saved");
    expect(s.past).toHaveLength(0);
    expect(s.future).toHaveLength(1);
    expect(s.elements).toBe(elementsBefore);
  });

  it("DEFECT (behavioral): the resize write-back's form — a same-value patch at commit=false never flips saveState", () => {
    const elementsBefore = useEditorStore.getState().elements;
    useEditorStore.setState({ saveState: "saved" });
    // The canvas write-back's exact shape: the seed geometry, the
    // gesture-coalesced commit=false (canvas.tsx:301-310).
    useEditorStore.getState().updateElements(["a"], { width: 200, height: 150 }, false);
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("saved");
    expect(s.elements).toBe(elementsBefore);
  });

  it("DEFECT (source): the map consults the ONE patchDiffers seam against the LIVE element and returns the same reference when false", () => {
    expect(storeCollapsed).toMatch(
      /if \(patchDiffers\(el, patch\)\) \{ changed = true; return \{ \.\.\.el, \.\.\.patch \}; \} return el;/,
    );
  });

  it("DEFECT (source): the changed flag + the value-diff guard join the S109-A id-match pair", () => {
    expect(storeCollapsed).toMatch(/let matched = false; let changed = false;/);
    expect(storeCollapsed).toMatch(/if \(!changed\) return \{\};/);
    // The ONE seam joins the store's import list.
    expect(storeSource).toMatch(/^  patchDiffers,$/m);
  });

  it("DEFECT (source): the doctrine comment names the resize seam + the LIVE-element rationale (the out-and-back gesture)", () => {
    expect(storeCollapsed).toMatch(/S115-A/);
    expect(storeCollapsed).toMatch(/clamp-saturated/);
    expect(storeCollapsed).toMatch(/out-and-back/);
    expect(storeCollapsed).toMatch(/LIVE element/);
  });

  it("SURVIVAL (source): the S109-A id-match guard form stays (the two-line form)", () => {
    const updateStart = storeSource.indexOf("updateElements: (ids, patch, commit = true) =>");
    expect(updateStart).toBeGreaterThan(-1);
    const updateEnd = storeSource.indexOf("scaleElements: (ids, factor, commit = true) =>", updateStart);
    const updateBlock = storeSource.slice(updateStart, updateEnd);
    expect(updateBlock).toMatch(/if \(!matched\) return \{\};/);
  });

  it("SURVIVAL (behavioral): a different-value patch keeps the full contract (saveState flips, history pushes at commit=true, coalesces at commit=false)", () => {
    useEditorStore.getState().updateElements(["a"], { fill: "#FF0000" });
    let s = useEditorStore.getState();
    expect(s.saveState).toBe("unsaved");
    expect(s.past).toHaveLength(1);
    expect(s.elements.find((el) => el.id === "a")?.fill).toBe("#FF0000");

    // The coalescing arm (commit=false — the gesture seam's form).
    useEditorStore.setState({ saveState: "saved", past: [], future: [] });
    useEditorStore.getState().updateElements(["a"], { fill: "#0000FF" }, false);
    s = useEditorStore.getState();
    expect(s.saveState).toBe("unsaved");
    expect(s.past).toHaveLength(0);
    expect(s.elements.find((el) => el.id === "a")?.fill).toBe("#0000FF");
  });

  it("SURVIVAL (behavioral): the out-and-back gesture — the return values LAND (the guard must compare the LIVE element, never the gesture's captured start)", () => {
    // The arm recomputes absolutely from startBounds; a call-site
    // guard comparing the gesture's captured el would strand the
    // intermediate value on the drag back to the start geometry.
    useEditorStore.getState().beginGesture();
    useEditorStore.getState().updateElements(["a"], { x: 500 }, false);
    expect(useEditorStore.getState().elements.find((el) => el.id === "a")?.x).toBe(500);
    useEditorStore.getState().updateElements(["a"], { x: 60 }, false);
    expect(useEditorStore.getState().elements.find((el) => el.id === "a")?.x).toBe(60);
    useEditorStore.getState().endGesture();
    const s = useEditorStore.getState();
    // The net-zero gesture (the S111-A doctrine): NO history entry —
    // but the RETURN values must LAND on the live element (a
    // call-site guard comparing the gesture's captured el would
    // strand the 500).
    expect(s.past).toHaveLength(0);
    expect(s.elements.find((el) => el.id === "a")?.x).toBe(60);
  });
});

describe("S115-B the schema field note's honest amendment (B115-L1)", () => {
  it("DEFECT (source): the field note carries the includes-form — the contradictory cross-reference is GONE", () => {
    // The field-note slice (the fillImageThumb column's own comment,
    // NOT the counter comment 40 lines up).
    const idx = schemaSource.indexOf("fillImageThumb String?");
    expect(idx).toBeGreaterThan(-1);
    const note = schemaSource.slice(Math.max(0, idx - 1400), idx);
    expect(note.length).toBeGreaterThan(400);
    // The collapsed view — the phrase line-breaks across the note's
    // comment lines (the F89 multi-line form).
    const noteCollapsed = collapsed(note);
    expect(noteCollapsed).toMatch(/Counted by fillImageBytes alongside fillImage/);
    expect(noteCollapsed).toMatch(/both families summed at every bound site/);
    // The false cross-reference is GONE (repo-wide unique phrase).
    expect(schemaSource).not.toMatch(/NOT counted by\s+fillImageBytes/);
  });

  it("SURVIVAL (source): the counter comment's S114-A includes-form stays", () => {
    expect(schemaCollapsed).toMatch(/fillImage \+ fillImageThumb/);
    expect(schemaCollapsed).toMatch(/S114-A/);
  });

  it("SURVIVAL (source): the legacy zero-counter x POST intersection phrase stays (the B-I4 pin family)", () => {
    expect(schemaCollapsed).toMatch(/legacy zero-counter x POST intersection/i);
  });
});

describe("S115-C the fine prints (A115-I1 + A115-I2 + A115-I3)", () => {
  it("DEFECT (source): the k-form simplified — the dead ternary false-arm gone (A115-I1)", () => {
    expect(panelSource).toMatch(/const k = THUMB_MAX_DIM \/ longest;/);
    // The unreachable arm (dead after the S114-C guard) is GONE.
    expect(panelSource).not.toMatch(/longest > THUMB_MAX_DIM \? THUMB_MAX_DIM \/ longest : 1/);
  });

  it("DEFECT (source): the lows-s113 absent pin carries its own length floor (A115-I2 — the F100 hollow-slice class)", () => {
    const idx = s113Source.indexOf("const commitSlice = panelSource.slice(");
    expect(idx).toBeGreaterThan(-1);
    // The F100 closeIdx-greater floor family: the block containing the
    // absent assertion must ALSO carry the slice's length floor.
    const block = s113Source.slice(idx, idx + 900);
    expect(block).toMatch(/commitSlice\.length\)\.toBeGreaterThan\(/);
  });

  it("DEFECT (source): the snapshotsEqual comment's honest all-primitive rationale (A115-I3)", () => {
    const idx = storeSource.indexOf("function snapshotsEqual");
    expect(idx).toBeGreaterThan(-1);
    const doctrine = storeSource.slice(Math.max(0, idx - 1100), idx);
    expect(doctrine.length).toBeGreaterThan(200);
    expect(doctrine).toMatch(/all-primitive|JSON string field/i);
    // The nested-object rationale the all-primitive DTO falsifies is
    // GONE.
    expect(doctrine).not.toMatch(/NESTED object reference/i);
  });

  it("SURVIVAL (source): the S114-C small-source guard stays", () => {
    expect(panelSource).toMatch(/if \(longest <= THUMB_MAX_DIM\) return null;/);
  });
});

describe("S115-D the zero-addBytes gate (B115-I1)", () => {
  it("DEFECT (source): an image-less row never trips the image-cap 400 — the gate form", () => {
    expect(elementsCollapsed).toMatch(
      /if \(addBytes > 0 && \(liveBytes\?\.fillImageBytes \?\? 0\) \+ addBytes > FILL_IMAGE_PROJECT_LIMIT_BYTES\) \{/,
    );
  });

  it("SURVIVAL (source): the addBytes both-family declaration stays (the S114-A anchor)", () => {
    expect(elementsCollapsed).toMatch(
      /const addBytes = \(typeof row\.fillImage === "string" \? row\.fillImage\.length : 0\) \+ \(typeof row\.fillImageThumb === "string" \? row\.fillImageThumb\.length : 0\);/,
    );
  });

  it("SURVIVAL (source): the recovery-naming envelope + the counter forms stay", () => {
    expect(elementsCollapsed).toMatch(/fillImageBytes: \{ increment:/);
    expect(elementsCollapsed).toMatch(/fillImageBytes: total/);
    expect(elementsCollapsed).toMatch(/This board's images are too large — remove some image fills before adding more/);
  });
});

describe("S115-E the per-session family (B115-I3 + the s115 forms)", () => {
  it("SURVIVAL (source): the verify-nav s115 contract — the 92nd ordinal, the S114-delivery descriptor, the nav115 session", () => {
    expect(nav115Source).toMatch(/92nd consecutive session/);
    expect(nav115Source).toMatch(/the S114 delivery 8b003d7 \+ the S115 remediation/);
    expect(nav115Source).toMatch(/--session nav115/);
    expect(nav115Source).toMatch(/digma-nav115\.log/);
    // The birth attribution stays frozen at session 108 (the S111-C
    // B-L1 lesson — a historical attribution is not a bumpable).
    expect(nav115Source).toMatch(/born at\s+s108|born at session 108|enumeration was born at/i);
  });

  it("SURVIVAL (source): the ref-audit s115 provenance anchors — the 91st form, the 52nd consecutive clip ordinal", () => {
    expect(refAudit115Source).toMatch(/91st reference audit/);
    expect(refAudit115Source).toMatch(/the S114 delivery at HEAD 8b003d7 \+ the session_195\/196 log pushes/);
    expect(refAudit115Source).toMatch(/byte-identical the 52nd/);
    expect(refAudit115Source).toMatch(/consecutive session at the 91st audit/);
    expect(refAudit115Source).toMatch(/--session live115/);
    expect(refAudit115Source).toMatch(/ref-audit-s125/);
  });

  it("SURVIVAL (source): the seo-check s115 fail-loud form carried", () => {
    expect(seo115Source).toMatch(/session 115, S115-cycle/);
    expect(seo115Source).toMatch(/digma-seo-s115\.log/);
  });

  it("SURVIVAL (source): the standing datums — the fill-family constants at the claim sites", () => {
    expect(editorLibSource).toMatch(/FILL_IMAGE_PROJECT_LIMIT_BYTES = 24_000_000/);
    expect(editorLibSource).toMatch(/FILL_IMAGE_THUMB_MAX_CHARS = 200_000/);
    expect(schemaSource).toMatch(/fillImageThumb\s+String\?/);
  });
});
