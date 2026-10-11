import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

import { useEditorStore } from "@/components/editor/editor-store";
import type { DesignElementDTO } from "@/lib/editor";

// The session-113 spec (the sixty-first audit's chosen work):
//
// S113-A — the soft-leave payloadDeadRef exemption (A-L1, the
//   headline): the S112-C terminal's own declaration claims "the same
//   unsaved state never re-uploads" — but the unmount cleanup
//   (editor-view.tsx) fired its own PUT guarded only on save-state and
//   the in-flight descriptor: on a payload-dead board (saveState
//   parked at "unsaved", no live flight) the cleanup PUT the EXACT
//   body the terminal just refused — a doomed >=32 MB upload per
//   soft-leave, the very churn the terminal exists to stop, one
//   boundary short of complete. The pagehide path was safe (its 60 KB
//   Blob guard skips); the same-instance swap path was safe (flushNow
//   early-returns; the drain's exemption resolves immediately) — only
//   the soft-leave/exit boundary leaked. The fix: the cleanup consults
//   the terminal BEFORE the leave-transport branch, registers the
//   RESOLVED transport (the S87-A doctrine: never leave the registry
//   in a state the re-entry path doesn't expect), and skips.
//
// S113-B — the upload/selection seam pair (A-L3 + A-I1): (a) the
//   mobile Sheet's shared `update` reads selectedIds at CALL time, and
//   commitUpload is the one async-window caller — a selection that
//   went multi inside the FileReader window received the image patch
//   on EVERY member (the S107-A class at TARGET scope; the desktop
//   closure was safe). The fix: the commit is id-scoped
//   (updateElements([element.id], ...) — the S109-A id-match guard
//   makes a deleted-element commit a no-op). (b) The two color-guard
//   scopes DISAGREED on a short-hex re-pick: the single-scope fallback
//   compares through expandShortHex (the S105-A doctrine: a stored
//   3-digit hex's expanded pick is the SAME color), the selection
//   scope compared raw — a "#f00" member's "#ff0000" re-pick was a
//   no-op at single scope and a commit at selection scope. The fix:
//   selectionWouldCommit's color key joins through the expanded
//   identity; the clearing siblings keep the RAW patchDiffers compare
//   (the seam's census stays ELEVEN).
//
// S113-C — the pin-layer repair (A-L2, the F89 lesson at the slice
//   bounds): two of the three single-scope survival pin slices in
//   tests/lows-s112.test.ts were HOLLOW — indexOf('"Solid"') and
//   indexOf('"Gradient"') both answered -1 (the file's literals are
//   value="solid" — lowercase) so slice(-1, -1) was the empty string,
//   and indexOf("Transform") (a header-comment mention at char 1333)
//   preceded indexOf("TEXT section") (char 57120) so start > end —
//   both assertions passed vacuously; the Fill-row wiring regex's
//   right-hand alternation matched any text containing "fill"). The
//   SOURCE contract itself held (all four single-scope consumers
//   carry no wouldCommit — lead-verified). The repair re-anchors the
//   slices onto stable code literals with LENGTH FLOORS (the
//   anti-hollow guard) and tightens the regex onto the concrete form.
//
// S113-D — the fillImageThumb codec + the unicode filename (B92-I1
//   leg (b) + the carried \w finding): the schema gains
//   DesignElement.fillImageThumb; clampFillImageThumb (the same
//   five-family data-URL whitelist at a TIGHTER cap — a scripted
//   consumer cannot store a second full image in the thumb field)
//   rides the ONE buildElementRow seam; the client's thumbnailFor (a
//   best-effort <=320px re-encode on the already-decoded upload, any
//   failure nulls the thumb and never blocks the upload) lands beside
//   downscaleDataUrl; commitUpload's patch carries the thumb;
//   THUMBNAIL_ELEMENT_SELECT gains the column and the four
//   list-family routes map through the ONE withThumbFills helper —
//   fillImage: fillImageThumb ?? fillImage, the GRACEFUL legacy
//   fallback (a pre-S113 row keeps shipping its full image, exactly
//   the current behavior; a thumb-bearing row ships ~10-50 KB instead
//   of ~500 KB); the detail GET and the editor canvas keep the full
//   image; the counter deliberately EXCLUDES the thumb (fillImageBytes
//   measures the full-fill payload — the 32 MB body cap subsumes the
//   rest). exportFilename's \w class stripped every non-ASCII letter
//   ("café" -> "caf") — the unicode property class
//   [^\p{L}\p{N}\s_-] preserves Unicode letters and numbers while
//   still stripping path-hostile punctuation.
//
// S113-E — the fine prints + the operator script + the per-session
//   pin family (B-I4 + B-I5 + B-I1 + the s113 forms): the schema note
//   names the legacy zero-counter x POST intersection (a pre-S112-C
//   database upgraded in place reads every counter 0, so a legacy
//   image-heavy board accepts up to the full 24 MB of NEW POST bytes
//   before its first PUT recomputes the truth); the smoke probe's
//   "35th" label names the 36th POST's body (the relabel);
//   scripts/normalize-member-emails.ts — the ONE-SHOT operator script
//   for pre-S111-D member rows (the dedup-first policy: keep the
//   earliest createdAt survivor per (teamId, normalized email), delete
//   the later duplicates — the blind UPDATE aborts on the unique
//   constraint otherwise; NULL and empty-string emails stay untouched;
//   --dry-run; idempotent; the shared normalizeEmail seam).

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const editorLibSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const exportPngSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/export-png.ts"),
  "utf8",
);
const schemaSource = readFileSync(
  path.resolve(import.meta.dirname, "../prisma/schema.prisma"),
  "utf8",
);
const projectsRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/route.ts"),
  "utf8",
);
const projectRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/route.ts"),
  "utf8",
);
const duplicateRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/duplicate/route.ts"),
  "utf8",
);
const smokeSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/smoke-test.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s113.sh"),
  "utf8",
);
const refSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s113.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s113.sh"),
  "utf8",
);
const lows112Source = readFileSync(
  path.resolve(import.meta.dirname, "./lows-s112.test.ts"),
  "utf8",
);
/** The S113-E operator script — read defensively: a MISSING file must
 * fail ITS pin (RED), not break the module load for every other pin. */
let normalizeScriptSource = "";
try {
  normalizeScriptSource = readFileSync(
    path.resolve(import.meta.dirname, "../scripts/normalize-member-emails.ts"),
    "utf8",
  );
} catch {
  normalizeScriptSource = "";
}

/** Whitespace-collapsed view — an ABSENT pin on the raw text is hollow
 * when the target is line-broken or comment-prefixed (the F89 lesson,
 * applied at the pin layer since S110: strip the // and # comment
 * prefixes BEFORE the join so multi-line targets stay visible). */
function collapsed(source: string): string {
  return source
    .split("\n")
    .map((l) => l.replace(/^\s*(?:\/\/|#)\s?/, "").trim())
    .filter((l) => l.length > 0)
    .join(" ")
    .replace(/\s+/g, " ");
}

const viewCollapsed = collapsed(viewSource);
const panelCollapsed = collapsed(panelSource);
const lows112Collapsed = collapsed(lows112Source);

/** A minimal rectangle DTO for driving the store and the pure helpers.
 * The fill-family fields are carried EXPLICITLY null — the real model
 * (the server rows, the store's elements) always carries them as null,
 * never undefined, and patchDiffers' !== compare treats undefined vs
 * null as a difference (the pin-layer F89 lesson: the fixture must
 * match the model's real shape or the no-op pins lie). Session 113
 * (S113-D): the fixture carries fillImageThumb null — the DTO's newest
 * fill-family member. */
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

describe("S113-A the soft-leave payloadDeadRef exemption (A-L1 — the headline)", () => {
  it("DEFECT (source): the unmount cleanup consults the payload terminal BEFORE the leave-transport branch and registers the RESOLVED transport", () => {
    // The guard sits inside the saveState !== "saved" block, ahead of
    // the machineCarriesThisState branch — a payload-dead state (no
    // live flight, saveState parked at "unsaved") must never reach the
    // cleanup's own PUT.
    expect(viewCollapsed).toMatch(
      /if \(state\.saveState !== "saved" && state\.projectId\) \{[\s\S]*?if \(payloadDeadRef !== null && payloadDeadRef === state\.elements\) \{[\s\S]*?registerLeaveTransport\(state\.projectId, Promise\.resolve\(\)\);[\s\S]*?\} else if \(!machineCarriesThisState\) \{/,
    );
  });

  it("DEFECT (source): the exemption's own doctrine comment names the boundary (the sixty-first audit's A-L1)", () => {
    expect(viewCollapsed).toMatch(/S113-A \/ A-L1/);
    expect(viewCollapsed).toMatch(/payload-dead exemption reaches the SOFT-LEAVE boundary/);
  });

  it("SURVIVAL (source): the S71-B/S85-A/S86-A/S87-A leave machinery intact — the teardown tail stays unconditional", () => {
    // The PUT₂ ordering chain (S86-A) survives…
    expect(viewCollapsed).toMatch(/machineFlight[\s\S]*?\.then\(\(\) =>[\s\S]*?fetch\(`/);
    // …the skip branch still registers the machine's own flight (S87-A)…
    expect(viewCollapsed).toMatch(/registerLeaveTransport\(state\.projectId, softLeaveDescriptor\.flightDone\)/);
    // …and disposed = true still runs after the block (the guard must
    // not early-return the cleanup's teardown).
    expect(viewCollapsed).toMatch(/disposed = true;[\s\S]*?unsubscribe\(\);[\s\S]*?clearTimeout\(timer\);[\s\S]*?removeEventListener\("pagehide", onUnload\)/);
  });

  it("SURVIVAL (source): the terminal's own three sites intact (the flush entry, the machineBusy exemption, the pagehide Blob guard)", () => {
    expect(viewCollapsed).toMatch(/if \(payloadDeadRef !== null && payloadDeadRef === store\.elements\) return;/);
    expect(viewCollapsed).toMatch(
      /!\(payloadDeadRef !== null && payloadDeadRef === useEditorStore\.getState\(\)\.elements\)/,
    );
    expect(viewCollapsed).toMatch(/new Blob\(\[payload\]\)\.size > 60_000/);
  });
});

describe("S113-B the upload/selection seam pair (A-L3 + A-I1)", () => {
  it("DEFECT (behavioral): the SHORT-HEX identity at selection scope — a \"#f00\" member's \"#ff0000\" re-pick with clean siblings commits NOTHING (the single-scope stance, aligned)", async () => {
    const { selectionWouldCommit } = await import("@/components/editor/properties-panel");
    const a = { ...rect("a", 0, 0), fill: "#f00" };
    const b = { ...rect("b", 10, 10), fill: "#f00" };
    // Pre-fix: the raw patchDiffers compare answers TRUE (a commit)
    // while the single-scope fallback answers false — the two scopes
    // disagreed on the same user action.
    expect(selectionWouldCommit([a, b], "#ff0000", "fill")).toBe(false);
  });

  it("SURVIVAL (behavioral): the CLEARING SIBLINGS keep the raw compare — a gradient-painting member still COMMITS on the expanded re-pick", async () => {
    const { selectionWouldCommit } = await import("@/components/editor/properties-panel");
    const a = { ...rect("a", 0, 0), fill: "#f00", fillGradient: '{"type":"linear"}' };
    const b = { ...rect("b", 10, 10), fill: "#f00" };
    expect(selectionWouldCommit([a, b], "#ff0000", "fill")).toBe(true);
  });

  it("DEFECT (behavioral): the STROKE kind aligned — the same expanded identity, no clearing siblings", async () => {
    const { selectionWouldCommit } = await import("@/components/editor/properties-panel");
    const a = { ...rect("a", 0, 0), stroke: "#f00" };
    const b = { ...rect("b", 10, 10), stroke: "#f00" };
    expect(selectionWouldCommit([a, b], "#ff0000", "stroke")).toBe(false);
    expect(selectionWouldCommit([a, b], "#00ff00", "stroke")).toBe(true);
  });

  it("SURVIVAL (behavioral): the S112-A truths hold — the unify case, the all-same no-op, the null clear", async () => {
    const { selectionWouldCommit } = await import("@/components/editor/properties-panel");
    const white = { ...rect("a", 0, 0), fill: "#FFFFFF" };
    const black = { ...rect("b", 10, 10), fill: "#000000" };
    expect(selectionWouldCommit([white, black], "#FFFFFF", "fill")).toBe(true);
    expect(selectionWouldCommit([white, { ...rect("c", 20, 20), fill: "#FFFFFF" }], "#FFFFFF", "fill")).toBe(false);
    expect(selectionWouldCommit([white, { ...rect("c", 20, 20), fill: null }], null, "fill")).toBe(true);
  });

  it("DEFECT (source): commitUpload commits ID-SCOPED — never the shared selection-scoped update (the post-window target freeze)", () => {
    // The commit's targets are the element's own id, frozen at arm
    // time — a selection that went multi inside the FileReader window
    // must not receive the image patch on every member.
    expect(panelCollapsed).toMatch(
      /updateElements\(\[element\.id\], patch, s\.gestureSnapshot === null\)/,
    );
    // The id-scoped form REPLACES the bare update(patch) call inside
    // commitUpload (the S107-A live-read guard itself stays).
    const commitSlice = panelSource.slice(
      panelSource.indexOf("const commitUpload ="),
      panelSource.indexOf("const readFile ="),
    );
    // Session 115 (S115-C / A115-I2 — the F100 hollow-slice class):
    // the absent pin's own length floor — an anchor rename would
    // empty the slice and pass this pin hollow (the S113-D present
    // pin on the same boundaries backstops it today; the floor makes
    // this pin self-sufficient).
    expect(commitSlice.length).toBeGreaterThan(2000);
    expect(commitSlice).not.toMatch(/\bupdate\(patch\)/);
  });

  it("SURVIVAL (source): the S107-A live-read guard + the S112-C aggregate pre-emption intact", () => {
    expect(panelCollapsed).toMatch(
      /useEditorStore\.getState\(\)\.elements\.find\(\(el\) => el\.id === element\.id\) \?\? element/,
    );
    // Session 114 (S114-A / B114-M1): the pre-emption's compare gained
    // the thumb term (the both-family arithmetic — the server's 24 MB
    // bound counts fillImage + fillImageThumb since the sixty-second
    // audit); the pin re-anchors onto the widened form, the floor of
    // the compare and the shared constant unchanged.
    expect(panelCollapsed).toMatch(
      /othersBytes \+ fillImage\.length \+ \(fillImageThumb\?\.length \?\? 0\) > FILL_IMAGE_PROJECT_LIMIT_BYTES/,
    );
  });
});

describe("S113-C the pin-layer repair (A-L2 — the F89 lesson at the slice bounds)", () => {
  it("DEFECT (meta): the lows-s112 single-scope survival slices are re-anchored onto REAL bounds with length floors (the anti-hollow guard)", () => {
    // The TextSection slice rides the stable export boundary…
    expect(lows112Source).toMatch(/export function TextSection\(/);
    // …and the Solid-tab pair rides the FillStrokeSection body (the
    // file's real single-scope Fill/Stroke rows), never the hollow
    // '"Solid"' / "Transform" literals that sliced empty strings.
    expect(lows112Source).toMatch(/export function FillStrokeSection\(/);
    // The ABSENT pins target the RECEIVER-PREFIXED code forms — the
    // repair's own provenance comment in lows-s112 names the bare
    // indexOf(...) forms (comment text is not code), so pinning the
    // code form's own shape (panelSource.indexOf(...)) avoids both the
    // false trip on the comment and a hollow pass — the F89 lesson at
    // the meta layer: the pin must match the model's real shape.
    expect(lows112Source).not.toMatch(/panelSource\.indexOf\('"Solid"'\)/);
    expect(lows112Source).not.toMatch(/panelSource\.indexOf\('"Gradient"'\)/);
    expect(lows112Source).not.toMatch(/panelSource\.indexOf\("TEXT section"\)/);
    expect(lows112Source).not.toMatch(/panelSource\.indexOf\("Transform"\),/);
    // Every slice pin carries a length floor (the F89 lesson
    // generalized: an empty slice makes an ABSENT pin pass trivially).
    expect(lows112Source).toMatch(/toBeGreaterThan\(200\)/);
  });

  it("DEFECT (meta): the Fill-row wiring regex tightened onto the concrete selectionWouldCommit form", () => {
    // The vacuous right-hand alternation (…"fill"\)|"fill"\) — matching
    // any text containing "fill")) is gone; the pin names the wiring's
    // own shape. The repaired lows-s112 pin carries that shape as a
    // REGEX LITERAL — backslash-escaped braces/parens in the source
    // text — so the meta pin matches the escaped form (a raw-form
    // regex would match nothing and the pin would sit hollow, the very
    // F89 lesson this repair exists to close).
    expect(lows112Collapsed).toMatch(
      /wouldCommit=\\\{\\\(fill\\\) => selectionWouldCommit\\\(selected, fill, "fill"\\\)/,
    );
  });

  it("SURVIVAL (source): the corrected bounds GENUINELY cover the sections (the source contract holds)", () => {
    // The TextSection body carries no wouldCommit…
    const textSection = panelSource.slice(
      panelSource.indexOf("export function TextSection("),
      panelSource.indexOf("function guardedUpdate("),
    );
    expect(textSection.length).toBeGreaterThan(200);
    expect(textSection).not.toMatch(/wouldCommit=/);
    // …and the FillStrokeSection body (the single-scope Fill row + the
    // Stroke row) carries none either.
    const fillStrokeSection = panelSource.slice(
      panelSource.indexOf("export function FillStrokeSection("),
      panelSource.indexOf("export function TransformSection("),
    );
    expect(fillStrokeSection.length).toBeGreaterThan(200);
    expect(fillStrokeSection).not.toMatch(/wouldCommit=/);
  });
});

describe("S113-D the fillImageThumb codec + the unicode filename (B92-I1 leg (b))", () => {
  it("DEFECT (source): the schema column — DesignElement.fillImageThumb, nullable, with the codec doctrine comment", () => {
    expect(schemaSource).toMatch(/fillImageThumb\s+String\?/);
    expect(schemaSource).toMatch(/S113-D/);
  });

  it("DEFECT (source): the tighter thumb cap + clampFillImageThumb riding the ONE clampFillImage whitelist", () => {
    expect(editorLibSource).toMatch(/FILL_IMAGE_THUMB_MAX_CHARS = 200_000/);
    expect(editorLibSource).toMatch(/export function clampFillImageThumb\(value: unknown\): string \| null \{/);
    // The delegating form: the family whitelist + the 700K ceiling run
    // through clampFillImage itself (the ONE seam), the tighter cap on
    // top — a scripted consumer cannot store a second full image in
    // the thumb field.
    expect(editorLibSource).toMatch(
      /const passed = clampFillImage\(value\);[\s\S]*?passed\.length > FILL_IMAGE_THUMB_MAX_CHARS[\s\S]*?return null;/,
    );
  });

  it("DEFECT (behavioral): clampFillImageThumb — the family passes under the cap, the oversized nulls, the non-data-URL nulls", async () => {
    const { clampFillImageThumb } = await import("@/lib/editor");
    const thumb = `data:image/png;base64,${"A".repeat(300)}`;
    expect(clampFillImageThumb(thumb)).toBe(thumb);
    expect(clampFillImageThumb(`data:image/png;base64,${"A".repeat(200_001)}`)).toBeNull();
    expect(clampFillImageThumb("https://example.com/x.png")).toBeNull();
    expect(clampFillImageThumb(null)).toBeNull();
    expect(clampFillImageThumb(undefined)).toBeNull();
    expect(clampFillImageThumb(42)).toBeNull();
  });

  it("DEFECT (source): buildElementRow carries fillImageThumb in BOTH modes (the ONE row-builder seam)", () => {
    expect(editorLibSource).toMatch(/fillImageThumb: clampFillImageThumb\(raw\?\.fillImageThumb\),/);
  });

  it("DEFECT (behavioral): buildElementRow — a valid thumb passes, an oversized thumb nulls, replace-mode omission nulls", async () => {
    const { buildElementRow } = await import("@/lib/editor");
    const thumb = `data:image/png;base64,${"A".repeat(300)}`;
    const created = buildElementRow(
      { type: "rectangle", fillImage: `data:image/png;base64,${"B".repeat(500)}`, fillImageThumb: thumb },
      0,
      "create",
    );
    expect(created.fillImageThumb).toBe(thumb);
    const oversized = buildElementRow(
      { type: "rectangle", fillImageThumb: `data:image/png;base64,${"A".repeat(200_001)}` },
      0,
      "create",
    );
    expect(oversized.fillImageThumb).toBeNull();
    const replaced = buildElementRow({ type: "rectangle" }, 0, "replace");
    expect(replaced.fillImageThumb).toBeNull();
  });

  it("DEFECT (source): the DTO + the projection select carry the new member", () => {
    expect(editorLibSource).toMatch(/fillImageThumb: string \| null;/);
    const selectSlice = editorLibSource.slice(
      editorLibSource.indexOf("THUMBNAIL_ELEMENT_SELECT = {"),
      editorLibSource.indexOf("};", editorLibSource.indexOf("THUMBNAIL_ELEMENT_SELECT = {")),
    );
    expect(selectSlice).toMatch(/fillImageThumb: true/);
  });

  it("DEFECT (source): withThumbFills — the ONE list-family projection helper (the graceful legacy fallback)", () => {
    expect(editorLibSource).toMatch(/export function withThumbFills/);
    // The fallback form: a thumb-bearing row ships the THUMB in the
    // fillImage slot; a legacy row keeps its full image.
    expect(editorLibSource).toMatch(/thumb \?\? row\.fillImage/);
    expect(editorLibSource).toMatch(/fillImageThumb: null/);
  });

  it("DEFECT (behavioral): withThumbFills — the thumb replaces, the legacy full image survives, the response's thumb field is nulled", async () => {
    const { withThumbFills } = await import("@/lib/editor");
    const full = `data:image/png;base64,${"B".repeat(500)}`;
    const other = `data:image/png;base64,${"C".repeat(400)}`;
    const thumb = `data:image/png;base64,${"A".repeat(120)}`;
    const project = {
      id: "p1",
      name: "Probe",
      elements: [
        { id: "e1", fillImage: full, fillImageThumb: thumb },
        { id: "e2", fillImage: other, fillImageThumb: null },
      ],
    };
    const projected = withThumbFills(project) as typeof project;
    expect((projected.elements[0] as Record<string, unknown>).fillImage).toBe(thumb);
    expect((projected.elements[1] as Record<string, unknown>).fillImage).toBe(other);
    expect((projected.elements[0] as Record<string, unknown>).fillImageThumb).toBeNull();
  });

  it("DEFECT (source): the FOUR list-family routes consume withThumbFills", () => {
    // The list GET + the projects POST response…
    const projectsHits = projectsRouteSource.match(/withThumbFills\(/g) ?? [];
    expect(projectsHits.length).toBe(2);
    // …the PATCH response…
    expect(projectRouteSource).toMatch(/withThumbFills\(/);
    // …and the duplicate response.
    expect(duplicateRouteSource).toMatch(/withThumbFills\(/);
  });

  it("DEFECT (source): the client thumbnailFor — the <=320px best-effort re-encode beside downscaleDataUrl", () => {
    expect(panelSource).toMatch(/THUMB_MAX_DIM = 320/);
    expect(panelSource).toMatch(/async function thumbnailFor\(dataUrl: string\): Promise<string \| null>/);
    // Best-effort: any failure nulls the thumb and never blocks the
    // upload (the try/catch return-null form).
    expect(panelCollapsed).toMatch(/thumbnailFor[\s\S]*?catch \{[\s\S]*?return null;/);
  });

  it("DEFECT (source): commitUpload's patch carries the thumb", () => {
    const commitSlice = panelSource.slice(
      panelSource.indexOf("const commitUpload ="),
      panelSource.indexOf("const readFile ="),
    );
    expect(commitSlice).toMatch(/fillImageThumb/);
  });

  it("DEFECT (source): exportFilename's unicode property class (the \\w class stripped every non-ASCII letter)", () => {
    expect(exportPngSource).toMatch(/\\p\{L\}\\p\{N\}/);
    expect(exportPngSource).not.toMatch(/\[\\\^\\w\\s-\]/);
  });

  it("SURVIVAL (source): the S112-C bound family intact — the constant, the POST's transactional bound, the PUT recompute", () => {
    expect(editorLibSource).toMatch(/FILL_IMAGE_PROJECT_LIMIT_BYTES = 24_000_000/);
    const elementsRouteSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
      "utf8",
    );
    expect(elementsRouteSource).toMatch(/fillImageBytes/);
    expect(elementsRouteSource).toMatch(/FILL_IMAGE_PROJECT_LIMIT_BYTES/);
  });
});

describe("S113-E the fine prints + the operator script + the per-session family", () => {
  it("DEFECT (source): the schema note names the legacy zero-counter x POST intersection (B-I4)", () => {
    // The schema's emphasis headline is the uppercase form and the
    // phrase is LINE-BROKEN across comment lines — the pin rides the
    // collapsed view (the F89 pattern: a line-broken target is
    // invisible to a raw-text match) with the case-insensitive match
    // so the phrase stays pinned without coupling to the comment's
    // typographic casing.
    expect(collapsed(schemaSource)).toMatch(/legacy zero-counter x POST intersection/i);
    expect(collapsed(schemaSource)).toMatch(/24 MB of NEW image bytes/);
  });

  it("DEFECT (source): the smoke probe relabel — an over-bound POST, not a mislabeled 35th (B-I5)", () => {
    expect(smokeSource).toMatch(/an over-bound image element answers the recovery-naming 400/);
    expect(smokeSource).not.toMatch(/the 35th image element answers the recovery-naming 400/);
  });

  it("DEFECT (source): scripts/normalize-member-emails.ts — the dedup-first policy, the NULL/empty guard, the dry-run knob, the shared seam, the one transaction (B-I1)", () => {
    // The script exists…
    expect(normalizeScriptSource.length).toBeGreaterThan(200);
    // …imports the shared normalizeEmail seam (never a private
    // re-implementation)…
    expect(normalizeScriptSource).toMatch(/normalizeEmail/);
    // …guards NULL and empty-string emails (SQLite unique treats NULLs
    // as distinct — collapsing them would wrongly delete rows)…
    expect(normalizeScriptSource).toMatch(/=== null \|\| .*\.trim\(\) === ""/);
    // …keeps the EARLIEST createdAt survivor per (teamId, normalized
    // email) and deletes the later duplicates (the blind UPDATE aborts
    // on the unique constraint otherwise)…
    expect(normalizeScriptSource).toMatch(/createdAt: "asc"/);
    expect(normalizeScriptSource).toMatch(/deleteMany/);
    // …carries the dry-run knob and the single transaction…
    expect(normalizeScriptSource).toMatch(/--dry-run/);
    expect(normalizeScriptSource).toMatch(/\$transaction/);
  });

  it("SURVIVAL (source): the verify-nav s113 contract (the 90th ordinal, the S112-delivery descriptor, the immutable birth attribution — the derivation landed at baseline, its contract pinned here)", () => {
    expect(navSource).toMatch(/90th consecutive session/);
    expect(navSource).toMatch(/the S112 delivery 3dc18a9 \+ the S113 remediation/);
    expect(navSource).toMatch(/--session nav113/);
    expect(navSource).toMatch(/digma-nav113\.log/);
    // The ninth-check BIRTH attribution stays session 108 (the s112
    // restoration — a birth attribution is not a bumpable).
    expect(navSource).toMatch(/session 108's standing form/);
    expect(navSource).not.toMatch(/session 109's standing form/);
  });

  it("SURVIVAL (source): the ref-audit s113 provenance anchors + the seo-check s113 forms (the derivations landed at baseline)", () => {
    expect(refSource).toMatch(/89th reference audit/);
    expect(refSource).toMatch(/the S112 delivery at HEAD 3dc18a9/);
    expect(refSource).toMatch(/byte-identical the 50th/);
    expect(refSource).toMatch(/consecutive session at the 89th audit/);
    expect(refSource).toMatch(/--session live113/);
    expect(refSource).toMatch(/ref-audit-s123/);
    expect(seoSource).toMatch(/session 113, S113-cycle/);
    expect(seoSource).toMatch(/digma-seo-s113\.log/);
  });

  it("DEFECT (source): the smoke fillImageThumb pair present (the projection pinned at runtime)", () => {
    expect(smokeSource).toMatch(/fillImageThumb/);
    expect(smokeSource).toMatch(/the THUMB re-encode in the fillImage slot/);
  });

  it("SURVIVAL (source): the standing datums — the s112 pin file, the smoke trio + fillImage pair, the e2e constant", () => {
    expect(lows112Source).toMatch(/S112-A the multi-selection color-guard scope/);
    expect(smokeSource).toMatch(/crud rate limit engages on the 61st creation/);
    expect(smokeSource).toMatch(/remove some image fills before adding more/);
    const e2eConfig = readFileSync(
      path.resolve(import.meta.dirname, "../playwright.config.ts"),
      "utf8",
    );
    expect(e2eConfig).toMatch(/file:\.\.\/db\/e2e\.db/);
  });
});
