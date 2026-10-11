import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

import { useEditorStore, type EditorSnapshot } from "@/components/editor/editor-store";
import {
  clampFontSizeField,
  clampPositionField,
  clampSizeField,
  type DesignElementDTO,
} from "@/lib/editor";

// The session-116 spec (the sixty-fourth audit's chosen work):
//
// S116-A — the scaleElements value-diff guard (A116-L1, the headline):
//   the store's scale arm carried only the S109-A id-match guard — the
//   map unconditionally spread { ...el, width/height: clampSizeField(...)
//   } for every matched id, so a factor that maps back to identity
//   (factor 1, or a clamp-saturated product: a 0-extent line; a
//   dimension already at the 100000 ceiling) committed new same-value
//   object identities, flipped saveState "unsaved", pushed history,
//   wiped redo, and armed the 800ms byte-identical full-list PUT. The
//   one shipped caller (the AI apply's scale arm) guards upstream
//   through scaleWouldChange — but the S115-A doctrine is layer-scoped,
//   never caller-scoped (the F96 form): scaleElements was the no-op
//   family's LAST mutation arm whose value-diff guard existed solely at
//   a call site. The guard mirrors the S115-A family form — the in-map
//   value compare keeping the unchanged member's REFERENCE (the
//   memoized canvas skips it), the changed flag, the two-line guard.
//
// S116-B — the post-scale projection in the AI apply (A116-L2): the
//   combined scale+patch operation computed patchWouldChange against
//   the PRE-scale rows, so the patch's width/height — fields the scale
//   half owns — compared against values the scale arm was about to
//   overwrite: {scale:2, width:200} on a 200-wide element answered
//   FALSE (200 === 200 pre-scale) and the explicit width was SILENTLY
//   DROPPED (the element ended at 400). The projection (truthRows)
//   applies the same clamped products the scale arm will commit, so
//   the apply's truth and the S115-A store guard's own LIVE truth
//   agree — an explicit field differing from either form lands its
//   instruction.
//
// S116-C — the fine prints (A116-I1 + A116-I2): the client clamp
//   family's NaN pass-through (Math.min(Math.max(NaN, …)) is NaN —
//   unlike the server's clampNumber, which falls back on
//   !Number.isFinite; zero constructible paths today, the hardening
//   guard joins each domain's neutral member); the "reference-measured
//   36px" comments are wrong — the live reference measures the
//   zoom-cluster chrome at ~34px (the session-108 record's own figure
//   and the deferred queue's standing name).
//
// S116-D — the record repair (B116-I1): the workspace worklog's
//   derivation figure corrected (21 -> 42 under the raw-diff
//   convention) — nothing repo-side carries the figure, no pin.
//
// S116-E — the per-session family (the s116 forms + the standing
//   datums): the verify-nav/ref-audit/seo-check s116 derivation pins
//   (the frozen attributions preserved — the s108 birth attribution,
//   the 92nd audit form, the 53rd consecutive clip ordinal), the
//   standing datum constants, the deferred queue re-derivation.

const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const aiSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const editorLibSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const nav116Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s116.sh"),
  "utf8",
);
const refAudit116Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s116.sh"),
  "utf8",
);
const seo116Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s116.sh"),
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

const storeCollapsed = collapsed(storeSource);
const aiCollapsed = collapsed(aiSource);

/** The scaleElements block slice (the s109/s110 boundary form). */
const scaleStart = storeSource.indexOf("scaleElements: (ids, factor, commit = true) =>");
const scaleEnd = storeSource.indexOf("moveElements: (ids, dx, dy) =>", scaleStart);
const scaleBlock = storeSource.slice(scaleStart, scaleEnd);
const scaleBlockCollapsed = collapsed(scaleBlock);

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

describe("S116-A the scaleElements value-diff guard (A116-L1 — the headline)", () => {
  it("DEFECT (behavioral): an identity-factor scale on matched ids never flips saveState, never pushes history, never wipes redo, keeps the elements identity", () => {
    const elementsBefore = useEditorStore.getState().elements;
    // A seeded redo entry — the family's "never wipes redo" member is
    // only honest against a NON-empty future stack.
    const redoSeed: EditorSnapshot = {
      elements: elementsBefore.map((el) => ({ ...el })),
      backgroundColor: "#0D1117",
    };
    useEditorStore.setState({ saveState: "saved", past: [], future: [redoSeed] });
    // The identity factor — the products equal the live fields.
    useEditorStore.getState().scaleElements(["a"], 1);
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("saved");
    expect(s.past).toHaveLength(0);
    expect(s.future).toHaveLength(1);
    expect(s.elements).toBe(elementsBefore);
  });

  it("DEFECT (behavioral): the clamp-saturated member of a MIXED batch keeps its reference while the unsaturated member still commits", () => {
    const elementsBefore = useEditorStore.getState().elements;
    // "a" already at the 100000 ceiling — the product saturates; "b"
    // at 200 still scales to 400.
    useEditorStore.setState({
      elements: [
        { ...elementsBefore[0], width: 100000, height: 100000 },
        elementsBefore[1],
      ],
      saveState: "saved",
      past: [],
      future: [],
    });
    const saturatedBefore = useEditorStore.getState().elements[0];
    useEditorStore.getState().scaleElements(["a", "b"], 2);
    const s = useEditorStore.getState();
    // The batch COMMITS (the unsaturated member changed).
    expect(s.saveState).toBe("unsaved");
    expect(s.past).toHaveLength(1);
    expect(s.elements.find((el) => el.id === "b")?.width).toBe(400);
    // The saturated member keeps its REFERENCE (the memoized canvas
    // skips it) — pre-fix it carried a new same-value identity.
    expect(s.elements.find((el) => el.id === "a")).toBe(saturatedBefore);
    expect(s.elements.find((el) => el.id === "a")?.width).toBe(100000);
  });

  it("DEFECT (source): the in-map value compare keeps the unchanged member's reference and arms the changed flag", () => {
    expect(scaleBlockCollapsed).toMatch(
      /const width = clampSizeField\(el\.width \* factor, el\.type\); const height = clampSizeField\(el\.height \* factor, el\.type\); if \(width === el\.width && height === el\.height\) return el; changed = true; return \{ \.\.\.el, width, height \};/,
    );
  });

  it("DEFECT (source): the two-line guard form — the changed flag joins the S109-A id-match pair", () => {
    expect(scaleBlockCollapsed).toMatch(/let matched = false; let changed = false;/);
    expect(scaleBlock).toMatch(/if \(!matched\) return \{\};/);
    expect(scaleBlock).toMatch(/if \(!changed\) return \{\};/);
  });

  it("DEFECT (source): the doctrine comment names the identity factor, the clamp-saturated product, and the family completion", () => {
    expect(scaleBlockCollapsed).toMatch(/S116-A/);
    expect(scaleBlockCollapsed).toMatch(/identity factor/);
    expect(scaleBlockCollapsed).toMatch(/clamp-saturated/);
    expect(scaleBlockCollapsed).toMatch(/LAST unguarded mutation arm|last unguarded mutation arm/);
  });

  it("SURVIVAL (behavioral): a different-value factor keeps the full contract (the S86-B clamped products)", () => {
    useEditorStore.getState().scaleElements(["a"], 2);
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("unsaved");
    expect(s.past).toHaveLength(1);
    const el = s.elements.find((e) => e.id === "a");
    expect(el?.width).toBe(400);
    expect(el?.height).toBe(300);

    // The coalescing arm (commit=false — the gesture seam's form).
    useEditorStore.setState({ saveState: "saved", past: [], future: [] });
    useEditorStore.getState().scaleElements(["a"], 2, false);
    const s2 = useEditorStore.getState();
    expect(s2.saveState).toBe("unsaved");
    expect(s2.past).toHaveLength(0);
    expect(s2.elements.find((e) => e.id === "a")?.width).toBe(800);
  });

  it("SURVIVAL (source): the S109-A id-match guard form stays (the two-line form's first member)", () => {
    expect(scaleBlock).toMatch(/if \(!matched\) return \{\};/);
  });
});

describe("S116-B the post-scale projection in the AI apply (A116-L2)", () => {
  it("DEFECT (source): the truthRows projection applies the scale arm's own clamped products", () => {
    expect(aiCollapsed).toMatch(
      /const truthRows = operation\.patch\.scale !== undefined \? liveElements\.map\(\(el\) => targetSet\.has\(el\.id\) \? \{ \.\.\.el, width: clampSizeField\(el\.width \* scaleFactor, el\.type\), height: clampSizeField\(el\.height \* scaleFactor, el\.type\), \} : el, \) : liveElements;/,
    );
  });

  it("DEFECT (source): patchWouldChange consumes the projection — the bare pre-scale compare is GONE", () => {
    expect(aiCollapsed).toMatch(
      /truthRows\.some\(\(el\) => targetSet\.has\(el\.id\) && patchDiffers\(el, patch\)\)/,
    );
    // The pre-fix form — the truth against the PRE-scale rows.
    expect(aiCollapsed).not.toMatch(
      /liveElements\.some\(\(el\) => targetSet\.has\(el\.id\) && patchDiffers\(el, patch\)\)/,
    );
  });

  it("DEFECT (source): the comment truth — the projection rationale names the dropped-width case, and the S105-B LIVE-phrase is re-anchored", () => {
    expect(aiCollapsed).toMatch(/S116-B/);
    expect(aiCollapsed).toMatch(/POST-SCALE projection/);
    expect(aiCollapsed).toMatch(/SILENTLY DROPPED|silently dropped/);
    // The half-true phrase is GONE from the truth computation's own
    // doctrine comment (the S105-B re-anchor).
    expect(aiCollapsed).not.toMatch(/Both halves report their truth against the LIVE elements/);
  });

  it("SURVIVAL (source): the scaleWouldChange form stays + patchDiffers stays the ONE seam", () => {
    expect(aiCollapsed).toMatch(
      /el\.width !== clampSizeField\(el\.width \* \(operation\.patch\.scale \?\? 1\), el\.type\)/,
    );
    expect(aiCollapsed).toMatch(/patchDiffers\(el, patch\)/);
  });
});

describe("S116-C the fine prints (A116-I1 + A116-I2)", () => {
  it("DEFECT (source): the finite guards join the three client clamp helpers (the server's clampNumber posture)", () => {
    const posIdx = editorLibSource.indexOf("export function clampPositionField");
    expect(posIdx).toBeGreaterThan(-1);
    const posBlock = editorLibSource.slice(posIdx, posIdx + 1100);
    expect(posBlock).toMatch(/!Number\.isFinite\(value\)/);

    const sizeIdx = editorLibSource.indexOf("export function clampSizeField");
    expect(sizeIdx).toBeGreaterThan(-1);
    const sizeBlock = editorLibSource.slice(sizeIdx, sizeIdx + 700);
    expect(sizeBlock).toMatch(/!Number\.isFinite\(value\)/);

    const fontIdx = editorLibSource.indexOf("export function clampFontSizeField");
    expect(fontIdx).toBeGreaterThan(-1);
    const fontBlock = editorLibSource.slice(fontIdx, fontIdx + 700);
    expect(fontBlock).toMatch(/!Number\.isFinite\(value\)/);
  });

  it("DEFECT (source): the reference-measured chip datum is the honest ~34px — the 36px phrases are GONE", () => {
    expect(viewSource).not.toMatch(/reference-measured 36px/);
    expect(viewSource).toMatch(/reference-measured ~34px/);
  });

  it("SURVIVAL (behavioral): the finite-value contracts are unchanged (the s84 family)", () => {
    expect(clampPositionField(500000)).toBe(100000);
    expect(clampPositionField(-500000)).toBe(-100000);
    expect(clampPositionField(1234)).toBe(1234);
    expect(clampSizeField(500000, "rectangle")).toBe(100000);
    expect(clampSizeField(-50, "rectangle")).toBe(1);
    expect(clampSizeField(-50, "line")).toBe(0);
    expect(clampSizeField(123, "ellipse")).toBe(123);
    expect(clampFontSizeField(1000)).toBe(500);
    expect(clampFontSizeField(0)).toBe(1);
    expect(clampFontSizeField(16)).toBe(16);
  });

  it("SURVIVAL (source): the S105-G two-layer-split doctrine comment stays", () => {
    expect(editorLibSource).toMatch(/ONE deliberate two-layer split/);
  });
});

describe("S116-E the per-session family (the s116 forms + the standing datums)", () => {
  it("SURVIVAL (source): the verify-nav s116 contract — the 93rd ordinal, the S115-delivery descriptor, the nav116 session", () => {
    expect(nav116Source).toMatch(/93rd consecutive session/);
    expect(nav116Source).toMatch(/the S115 delivery d5b5508 \+ the S116 remediation/);
    expect(nav116Source).toMatch(/--session nav116/);
    expect(nav116Source).toMatch(/digma-nav116\.log/);
    // The birth attribution stays frozen at session 108 (the S111-C
    // B-L1 lesson — a historical attribution is not a bumpable).
    expect(nav116Source).toMatch(/born at\s+s108|born at session 108|enumeration was born at/i);
  });

  it("SURVIVAL (source): the ref-audit s116 provenance anchors — the 92nd form, the 53rd consecutive clip ordinal", () => {
    expect(refAudit116Source).toMatch(/92nd reference audit/);
    expect(refAudit116Source).toMatch(/the S115 delivery at HEAD d5b5508 \+ the session_197\/198 log pushes/);
    expect(refAudit116Source).toMatch(/byte-identical the 53rd/);
    expect(refAudit116Source).toMatch(/consecutive session at the 92nd audit/);
    expect(refAudit116Source).toMatch(/--session live116/);
    expect(refAudit116Source).toMatch(/ref-audit-s126/);
  });

  it("SURVIVAL (source): the seo-check s116 fail-loud form carried", () => {
    expect(seo116Source).toMatch(/session 116, S116-cycle/);
    expect(seo116Source).toMatch(/digma-seo-s116\.log/);
  });

  it("SURVIVAL (source): the standing datums — the fill-family constants at the claim sites", () => {
    expect(editorLibSource).toMatch(/FILL_IMAGE_PROJECT_LIMIT_BYTES = 24_000_000/);
    expect(editorLibSource).toMatch(/FILL_IMAGE_THUMB_MAX_CHARS = 200_000/);
  });
});
