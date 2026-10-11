import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

import { useEditorStore } from "@/components/editor/editor-store";
import { type DesignElementDTO } from "@/lib/editor";

// The session-117 spec (the sixty-fifth audit's chosen work):
//
// S117-A — the non-fill serialized channel joins the bound (B117-M1,
//   the headline): buildElementRow admits text (2000, slice-only —
//   the S99-B doctrine, control chars included), name (80), and the
//   re-serialized fillGradient (~320), but the counter and all four
//   bound sites (the elements POST addBytes gate, the PUT recompute,
//   the duplicate seed, the client upload pre-emption) summed ONLY
//   fillImage + fillImageThumb — the non-fill payload escaped the
//   arithmetic twice (volume: 2000 rows x ~2.4 KB plain; JSON-escape
//   expansion: a backslash doubles, a control char expands 1 -> 6),
//   so a scripted client stacked ~9.8 MB of max-text rows through
//   PUTs the counter scored 0, then drove the fill gate to its 24 MB
//   ceiling — the stored board's next full-list PUT serialized past
//   the 32 MB body cap (the sticky wedge, constructible from scratch;
//   the S112-C "always fits the autosave PUT" invariant falsified
//   through the channel the census missed). The closure: the ONE
//   shared rowStoredBytes seam (the FILL_IMAGE_PROJECT_LIMIT_BYTES
//   "one source of truth" pattern) counting BOTH fill families raw
//   (data URLs carry no JSON-escapable characters) PLUS the three
//   free-text fields at their JSON-ESCAPED lengths — the exact wire
//   form — consumed at all four sites; the fixed per-row
//   serialization (~380 chars measured) stays outside the count
//   (~0.76 MB at ELEMENT_LIMIT, inside the 8 MB headroom).
//
// S117-B — the reorderElements reference-keeping (A117-L1): the
//   renumber's unconditional spread rebuilt EVERY element identity on
//   a real reorder — members outside the moved span carried fresh
//   same-value objects, so one layers drag re-rendered the whole
//   memoized canvas (React.memo's shallow compare on element). The
//   fix keeps the reference when the value survives:
//   el.sortOrder === i ? el : { ...el, sortOrder: i }. The
//   canvas.tsx S49-1 comment's layer-wide identity claim gains the
//   reorder member (the exception S117-B itself closes).
//
// S117-C — the text-tool flush + the S81-A note (A117-L2 +
//   A117-I2's registration): the canvas TEXT branch was the one
//   store-mutating arm without the S66-A resetSliderGesture() flush —
//   addElement pushed its snapshot synchronously while a panel typing
//   burst sat armed inside its 150ms idle window, and the burst's
//   blur terminal then pushed the PRE-burst snapshot AFTER the add's
//   (the history intent-order inversion). The flush lands the burst's
//   entry FIRST — the hit branch and the resize arm carry the same
//   doctrine. The AI apply's S81-A commit=true fallback shares the
//   inverted-order form (A117-I2): the fix ceiling at this layer is
//   the slider-gesture module's inability to discriminate the
//   idle-armed TEXT burst (flushable) from the ACTIVE drag the
//   fallback protects — the comment note + the deferred queue.
//
// S117-D — the withThumbFills thumb-only arm (B117-L1):
//   buildElementRow admits fillImage and fillImageThumb
//   independently, so a scripted POST carrying only a thumb stored a
//   row whose list-family projection shipped fillImage = thumb — an
//   image the canvas/detail/export never render. The thumb ships only
//   when the row is image-bearing.
//
// S117-E — the fine prints + the per-session family (B117-I1 +
//   B117-I2 + the s117 forms): the parseSessionToken NaN-expiry
//   guard (Number("abc") is NaN, NaN < Date.now() is false — the
//   liveness check let a non-numeric expiry segment through; the
//   expiry rides the HMAC payload so unreachable, the hardening
//   joins the tokenVersion integer check); the .env.example REF pair
//   rows (the tracked audit scripts' env contract, discoverable from
//   the template — never a literal credential, the S92-B form); the
//   verify-nav/ref-audit/seo-check s117 derivation pins (the frozen
//   attributions preserved — the s108 birth attribution, the 93rd
//   audit form, the 54th consecutive clip ordinal); the standing
//   datum constants; the deferred queue re-derivation (F80).

const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
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
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const elementsRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
  "utf8",
);
const duplicateRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/duplicate/route.ts"),
  "utf8",
);
const validationSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/validation.ts"),
  "utf8",
);
const schemaSource = readFileSync(
  path.resolve(import.meta.dirname, "../prisma/schema.prisma"),
  "utf8",
);
const authSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/auth.ts"),
  "utf8",
);
const envExampleSource = readFileSync(
  path.resolve(import.meta.dirname, "../.env.example"),
  "utf8",
);
const nav117Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s117.sh"),
  "utf8",
);
const refAudit117Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s117.sh"),
  "utf8",
);
const seo117Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s117.sh"),
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
const panelCollapsed = collapsed(panelSource);
const elementsRouteCollapsed = collapsed(elementsRouteSource);
const duplicateRouteCollapsed = collapsed(duplicateRouteSource);
const validationCollapsed = collapsed(validationSource);
const schemaCollapsed = collapsed(schemaSource);
const authCollapsed = collapsed(authSource);

/** The reorderElements block slice (the s78 boundary form). */
const reorderStart = storeSource.indexOf("reorderElements: (fromIds, toIndex) =>");
const reorderEnd = storeSource.indexOf("setBackgroundColor:", reorderStart);
const reorderBlock = storeSource.slice(reorderStart, reorderEnd);
const reorderBlockCollapsed = collapsed(reorderBlock);

/** The canvas text-tool branch slice (between the draw arm's early
 * return and the select-tool hit-test comment). */
const textBranchStart = canvasSource.indexOf('if (tool === "text") {');
const textBranchEnd = canvasSource.indexOf("// select tool:", textBranchStart);
const textBranch = canvasSource.slice(textBranchStart, textBranchEnd);
const textBranchCollapsed = collapsed(textBranch);

/** A minimal rectangle DTO for driving the store (the F89 fixture
 * lesson: the fill-family fields carried EXPLICITLY null — the real
 * model never carries undefined). */
function rect(id: string, sortOrder: number): DesignElementDTO {
  return {
    id,
    projectId: "p1",
    type: "rectangle",
    name: id,
    sortOrder,
    x: 60 + sortOrder * 40,
    y: 80,
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
    // Five members a..e at sortOrder 0..4 — the reorder fixture with
    // members both inside and outside the moved span.
    elements: [rect("a", 0), rect("b", 1), rect("c", 2), rect("d", 3), rect("e", 4)],
    selectedIds: [],
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

describe("S117-A the non-fill serialized channel joins the bound (B117-M1 — the headline)", () => {
  it("DEFECT (behavioral): rowStoredBytes counts both fill families raw + the three free-text fields at their JSON-escaped wire lengths", async () => {
    const { rowStoredBytes } = await import("@/lib/editor");
    expect(typeof rowStoredBytes).toBe("function");
    if (typeof rowStoredBytes !== "function") return;
    // The fills at their raw lengths (data URLs carry no JSON-escapable
    // characters — the wire form equals the stored form).
    expect(rowStoredBytes({ fillImage: "a".repeat(100), fillImageThumb: "b".repeat(40) })).toBe(140);
    // The text at its ESCAPED length: 2000 backslashes double on the
    // wire (4000) + the two JSON quotes.
    expect(rowStoredBytes({ text: "\\".repeat(2000) })).toBe(4002);
    // The control-char amplifier: one \u0000 expands 1 -> 6 on the wire
    // + the two JSON quotes (the slice-only S99-B clamp admits it).
    expect(rowStoredBytes({ text: "\u0000" })).toBe(8);
    // The name and the gradient at their escaped lengths.
    expect(rowStoredBytes({ name: 'x"y', fillGradient: "g" })).toBe(
      JSON.stringify('x"y').length + JSON.stringify("g").length,
    );
    // Absent members count zero.
    expect(rowStoredBytes({})).toBe(0);
  });

  it("DEFECT (source): the ONE shared rowStoredBytes seam at the editor.ts constant's side (the FILL_IMAGE pattern)", () => {
    expect(editorLibSource).toMatch(/export function rowStoredBytes/);
    const helperStart = editorLibSource.indexOf("export function rowStoredBytes");
    const helperRegion = editorLibSource.slice(helperStart, helperStart + 900);
    const helperCollapsed = collapsed(helperRegion);
    expect(helperCollapsed).toMatch(/row\.fillImage != null \? row\.fillImage\.length : 0/);
    expect(helperCollapsed).toMatch(/row\.fillImageThumb != null \? row\.fillImageThumb\.length : 0/);
    expect(helperCollapsed).toMatch(/row\.text != null \? JSON\.stringify\(row\.text\)\.length : 0/);
    expect(helperCollapsed).toMatch(/row\.name != null \? JSON\.stringify\(row\.name\)\.length : 0/);
    expect(helperCollapsed).toMatch(
      /row\.fillGradient != null \? JSON\.stringify\(row\.fillGradient\)\.length : 0/,
    );
    // The doctrine comment names the non-fill channel + the escaped
    // wire form (the F101 census member).
    const commentStart = editorLibSource.indexOf("Session 117 (S117-A");
    expect(commentStart).toBeGreaterThan(-1);
    const doctrineRegion = editorLibSource.slice(commentStart, commentStart + 2400);
    const doctrineCollapsed = collapsed(doctrineRegion);
    expect(doctrineCollapsed).toMatch(/B117-M1/);
    expect(doctrineCollapsed).toMatch(/non-fill|NON-FILL/);
    expect(doctrineCollapsed).toMatch(/JSON-escaped|escaped/);
  });

  it("DEFECT (source): the elements POST's addBytes rides the helper — the fills-only two-term form is GONE", () => {
    expect(elementsRouteCollapsed).toMatch(/const addBytes = rowStoredBytes\(row\);/);
    expect(elementsRouteSource).not.toMatch(
      /typeof row\.fillImage === "string" \? row\.fillImage\.length : 0/,
    );
  });

  it("DEFECT (source): the PUT recompute's total rides the helper — the fills-only reduce is GONE", () => {
    expect(elementsRouteCollapsed).toMatch(/const total = rows\.reduce\(\(sum, r\) => sum \+ rowStoredBytes\(r\), 0\);/);
    expect(elementsRouteSource).not.toMatch(
      /typeof r\.fillImage === "string" \? r\.fillImage\.length : 0/,
    );
  });

  it("DEFECT (source): the duplicate seed rides the helper — the fills-only form is GONE", () => {
    expect(duplicateRouteCollapsed).toMatch(
      /fillImageBytes: source\.elements\.reduce\(\(sum, el\) => sum \+ rowStoredBytes\(el\), 0\),/,
    );
    expect(duplicateRouteSource).not.toMatch(
      /typeof el\.fillImage === "string" \? el\.fillImage\.length : 0/,
    );
  });

  it("DEFECT (source): the client pre-emption rides the helper — the projected post-upload row answers its own term", () => {
    expect(panelCollapsed).toMatch(
      /const othersBytes = useEditorStore\.getState\(\)\.elements\.reduce\( \(sum, el\) => sum \+ \(el\.id === element\.id \? 0 : rowStoredBytes\(el\)\), 0, \);/,
    );
    expect(panelCollapsed).toMatch(
      /const incomingBytes = rowStoredBytes\(\{ \.\.\.selfRow, fillImage, fillImageThumb, fillGradient: null \}\);/,
    );
    expect(panelCollapsed).toMatch(
      /if \(othersBytes \+ incomingBytes > FILL_IMAGE_PROJECT_LIMIT_BYTES\) \{/,
    );
    // The pre-fix fills-only mirror is GONE.
    expect(panelSource).not.toMatch(/\(el\.fillImage\?\.length \?\? 0\) \+ \(el\.fillImageThumb\?\.length \?\? 0\)/);
  });

  it("DEFECT (source): the three comment repairs — the counted arithmetic in, the ~600 KB claim out", () => {
    // editor.ts: the constant's own comment carries the honest
    // counted form (the fixed-slack figure), never the falsified
    // "~600 KB" headroom story.
    expect(editorLibSource).not.toMatch(/~600 KB/);
    const constIdx = editorLibSource.indexOf("export const FILL_IMAGE_PROJECT_LIMIT_BYTES");
    expect(constIdx).toBeGreaterThan(-1);
    const constRegion = editorLibSource.slice(constIdx - 2600, constIdx);
    const constRegionCollapsed = collapsed(constRegion);
    expect(constRegionCollapsed).toMatch(/S117-A/);
    expect(constRegionCollapsed).toMatch(/0\.76 MB|fixed slack/);

    // validation.ts: the sticky-wedge comment's construction-route
    // claim names the non-fill census.
    const wedgeIdx = validationSource.indexOf("REQUEST_BODY_LIMIT_BYTES");
    const wedgeRegion = validationSource.slice(Math.max(0, wedgeIdx - 3200), wedgeIdx);
    const wedgeRegionCollapsed = collapsed(wedgeRegion);
    expect(wedgeRegionCollapsed).toMatch(/S117-A/);
    expect(wedgeRegionCollapsed).toMatch(/non-fill|NON-FILL/);

    // schema.prisma: the counter's column note names the free-text
    // members + the honest ceiling.
    const counterIdx = schemaSource.indexOf("fillImageBytes   Int");
    expect(counterIdx).toBeGreaterThan(-1);
    const counterRegion = schemaSource.slice(Math.max(0, counterIdx - 2800), counterIdx);
    const counterRegionCollapsed = collapsed(counterRegion);
    expect(counterRegionCollapsed).toMatch(/S117-A/);
    expect(counterRegionCollapsed).toMatch(/free-text|text\/name\/fillGradient/);
    expect(counterRegionCollapsed).toMatch(/~31/);
  });

  it("SURVIVAL (source): the zero-add gate form, the 24 MB constant, and the fill raw-length terms inside the helper", () => {
    expect(elementsRouteSource).toMatch(
      /if \(addBytes > 0 && \(liveBytes\?\.fillImageBytes \?\? 0\) \+ addBytes > FILL_IMAGE_PROJECT_LIMIT_BYTES\) \{/,
    );
    expect(editorLibSource).toMatch(/FILL_IMAGE_PROJECT_LIMIT_BYTES = 24_000_000/);
    expect(editorLibSource).toMatch(/FILL_IMAGE_THUMB_MAX_CHARS = 200_000/);
  });
});

describe("S117-B the reorderElements reference-keeping (A117-L1)", () => {
  it("DEFECT (behavioral): a real reorder keeps the un-moved members' REFERENCES while the moved members commit", () => {
    const before = useEditorStore.getState().elements;
    // Drag "c" after "a": [a,b,c,d,e] -> [a,c,b,d,e]. The members
    // outside the moved span (a at 0, d at 3, e at 4) keep both value
    // AND reference; b (1 -> 2) and c (2 -> 1) commit new identities.
    useEditorStore.getState().reorderElements(["c"], 1);
    const s = useEditorStore.getState();
    // The reorder COMMITS (a real order change).
    expect(s.saveState).toBe("unsaved");
    expect(s.past).toHaveLength(1);
    const byId = (id: string) => s.elements.find((e) => e.id === id);
    expect(byId("a")?.sortOrder).toBe(0);
    expect(byId("c")?.sortOrder).toBe(1);
    expect(byId("b")?.sortOrder).toBe(2);
    expect(byId("d")?.sortOrder).toBe(3);
    expect(byId("e")?.sortOrder).toBe(4);
    // The moved members carry NEW identities.
    expect(byId("c")).not.toBe(before[2]);
    expect(byId("b")).not.toBe(before[1]);
    // The un-moved members keep their REFERENCES (the memoized canvas
    // skips them) — pre-fix the unconditional spread rebuilt every
    // identity on the board.
    expect(byId("a")).toBe(before[0]);
    expect(byId("d")).toBe(before[3]);
    expect(byId("e")).toBe(before[4]);
  });

  it("DEFECT (source): the renumber keeps the reference when the value survives", () => {
    expect(reorderBlockCollapsed).toMatch(
      /el\.sortOrder === i \? el : \{ \.\.\.el, sortOrder: i \}/,
    );
    expect(reorderBlockCollapsed).toMatch(/S117-B/);
  });

  it("DEFECT (source): the canvas S49-1 memoization comment names the reorder member S117-B closes", () => {
    const memoIdx = canvasSource.indexOf("const MemoizedCanvasElement = React.memo(CanvasElement);");
    expect(memoIdx).toBeGreaterThan(-1);
    const memoRegion = canvasSource.slice(Math.max(0, memoIdx - 1400), memoIdx);
    const memoRegionCollapsed = collapsed(memoRegion);
    expect(memoRegionCollapsed).toMatch(/unchanged elements keep their object identity/);
    expect(memoRegionCollapsed).toMatch(/S117-B/);
    expect(memoRegionCollapsed).toMatch(/reorder/);
  });

  it("SURVIVAL (behavioral): the S78-C sequence-identical bail — an identical order returns the state untouched", () => {
    const before = useEditorStore.getState().elements;
    // Dropping "a" onto its own position reproduces the identical
    // sequence: moving=[a], rest=[b,c,d,e], clamped 0 -> [a,b,c,d,e].
    useEditorStore.getState().reorderElements(["a"], 0);
    const s = useEditorStore.getState();
    expect(s.elements).toBe(before);
    expect(s.saveState).toBe("saved");
    expect(s.past).toHaveLength(0);
  });

  it("SURVIVAL (source): the id-sequence compare form stays (the S78-C anchor)", () => {
    expect(reorderBlock).toMatch(
      /nextIds\.join\("\\u0001"\)\s*===\s*state\.elements\.map\(\(el\) => el\.id\)\.join\("\\u0001"\)/,
    );
  });
});

describe("S117-C the text-tool flush + the S81-A note (A117-L2 + A117-I2's registration)", () => {
  it("DEFECT (source): the text branch flushes the panel burst FIRST — before addElement's synchronous history push", () => {
    // The order-verified RAW form (the F89 in-commit repair: the
    // doctrine comment sits between the branch open and the flush, so
    // the collapsed view carries the comment text — the raw slice
    // discriminates the ORDER: branch open -> flush -> addElement).
    expect(textBranch).toMatch(
      /if \(tool === "text"\) \{[\s\S]*?resetSliderGesture\(\);[\s\S]*?const \{ addElement \} = useEditorStore\.getState\(\);/,
    );
    expect(textBranchCollapsed).toMatch(/S117-C/);
    // Three call sites now: the hit branch, the text branch, the
    // resize arm — every store-mutating canvas arm carries the flush.
    const calls = canvasSource.match(/resetSliderGesture\(\);/g) ?? [];
    expect(calls.length).toBe(3);
  });

  it("DEFECT (source): the S81-A comment carries the A117-I2 ordering note (the deferred registration + the fix ceiling)", () => {
    expect(aiCollapsed).toMatch(/S117-C/);
    expect(aiCollapsed).toMatch(/A117-I2/);
    expect(aiCollapsed).toMatch(/intent-order inversion|inverted-order/);
    expect(aiCollapsed).toMatch(/fix ceiling|fix-ceiling|deferred/);
  });

  it("SURVIVAL (source): the hit-branch and resize-branch flushes stay (the S66-A doctrine at every store-mutating canvas arm)", () => {
    // The s66 form: every beginGesture in the canvas is preceded by
    // the flush within the same handler block.
    const hits = [...canvasSource.matchAll(/beginGesture\(\)/g)];
    expect(hits.length).toBe(2);
    for (const hit of hits) {
      const before = canvasSource.slice(Math.max(0, hit.index! - 400), hit.index!);
      expect(before.lastIndexOf("resetSliderGesture()")).toBeGreaterThan(
        before.lastIndexOf("beginGesture()") >= 0 ? before.lastIndexOf("beginGesture()") : -1,
      );
    }
  });
});

describe("S117-D the withThumbFills thumb-only arm (B117-L1)", () => {
  it("DEFECT (behavioral): a thumb-only row projects fillImage null — the thumb never paints an image the canvas does not render", async () => {
    const { withThumbFills } = await import("@/lib/editor");
    const thumb = `data:image/png;base64,${"A".repeat(120)}`;
    const projected = withThumbFills({
      id: "p1",
      elements: [{ id: "e1", fillImage: null, fillImageThumb: thumb }],
    });
    const row = projected.elements[0] as { fillImage: string | null; fillImageThumb: string | null };
    // Pre-fix: the fallback arm shipped the thumb in the fillImage
    // slot (thumb ?? row.fillImage ?? null with a null fillImage).
    expect(row.fillImage).toBe(null);
    expect(row.fillImageThumb).toBe(null);
  });

  it("DEFECT (source): the thumb ships only when the row is image-bearing", () => {
    expect(editorLibSource).toMatch(
      /fillImage: row\.fillImage != null \? \(thumb \?\? row\.fillImage\) : null,/,
    );
    expect(editorLibSource).toMatch(/S117-D/);
  });

  it("SURVIVAL (behavioral): the two intended arms — the thumb replaces, the legacy full image survives", async () => {
    const { withThumbFills } = await import("@/lib/editor");
    const full = `data:image/png;base64,${"B".repeat(500)}`;
    const other = `data:image/png;base64,${"C".repeat(400)}`;
    const thumb = `data:image/png;base64,${"A".repeat(120)}`;
    const projected = withThumbFills({
      id: "p1",
      elements: [
        { id: "e1", fillImage: full, fillImageThumb: thumb },
        { id: "e2", fillImage: other, fillImageThumb: null },
      ],
    });
    const rows = projected.elements as Array<{ fillImage: string | null; fillImageThumb: string | null }>;
    expect(rows[0].fillImage).toBe(thumb);
    expect(rows[0].fillImageThumb).toBe(null);
    expect(rows[1].fillImage).toBe(other);
    expect(rows[1].fillImageThumb).toBe(null);
  });
});

describe("S117-E the fine prints + the per-session family (B117-I1 + B117-I2 + the s117 forms)", () => {
  it("DEFECT (source): the parseSessionToken NaN-expiry guard joins the tokenVersion integer check", () => {
    expect(authCollapsed).toMatch(
      /const expiryMs = Number\(expiry\); if \(!Number\.isFinite\(expiryMs\) \|\| expiryMs < Date\.now\(\)\) return null;/,
    );
    expect(authSource).toMatch(/S117-E/);
  });

  it("DEFECT (source): the .env.example carries the reference-audit credential pair (commented, empty — the S92-B form)", () => {
    expect(envExampleSource).toMatch(/REF_LOGIN_EMAIL=/);
    expect(envExampleSource).toMatch(/REF_LOGIN_PASSWORD=/);
    // Never a literal credential in tracked source.
    expect(envExampleSource).not.toMatch(/REF_LOGIN_EMAIL=\S/);
    expect(envExampleSource).not.toMatch(/REF_LOGIN_PASSWORD=\S/);
  });

  it("SURVIVAL (source): the token contract forms stay — the 4-part split, the HMAC compare, the version integer check", () => {
    expect(authCollapsed).toMatch(/if \(parts\.length !== 4\) return null;/);
    expect(authCollapsed).toMatch(
      /const tokenVersion = Number\(version\); if \(!Number\.isInteger\(tokenVersion\) \|\| tokenVersion < 0\) return null;/,
    );
    expect(authCollapsed).toMatch(/timingSafeEqual/);
  });

  it("SURVIVAL (source): the verify-nav s117 contract — the 94th ordinal, the S116-delivery descriptor, the nav117 session", () => {
    expect(nav117Source).toMatch(/94th consecutive session/);
    expect(nav117Source).toMatch(/the S116 delivery 2ab20f6 \+ the S117 remediation/);
    expect(nav117Source).toMatch(/--session nav117/);
    expect(nav117Source).toMatch(/digma-nav117\.log/);
    // The birth attribution stays frozen at session 108 (the S111-C
    // B-L1 lesson — a historical attribution is not a bumpable).
    expect(nav117Source).toMatch(/born at\s+s108|born at session 108|enumeration was born at/i);
  });

  it("SURVIVAL (source): the ref-audit s117 provenance anchors — the 93rd form, the 54th consecutive clip ordinal", () => {
    expect(refAudit117Source).toMatch(/93rd reference audit/);
    expect(refAudit117Source).toMatch(/the S116 delivery at HEAD 2ab20f6 \+ the session_199\/200 log pushes/);
    expect(refAudit117Source).toMatch(/byte-identical the 54th/);
    expect(refAudit117Source).toMatch(/consecutive session at the 93rd audit/);
    expect(refAudit117Source).toMatch(/--session live117/);
    expect(refAudit117Source).toMatch(/ref-audit-s127/);
  });

  it("SURVIVAL (source): the seo-check s117 fail-loud form carried", () => {
    expect(seo117Source).toMatch(/session 117, S117-cycle/);
    expect(seo117Source).toMatch(/digma-seo-s117\.log/);
  });
});
