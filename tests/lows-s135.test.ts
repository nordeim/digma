import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-135 spec (the eighty-third audit's chosen work):
//
// S135-A — THE toCanvas VIEWPORT MEMBER'S BY-DESIGN REGISTRATION
//   (A135-I1 — the Informational the eighty-third audit's editor-side
//   auditor found): the read-direction family's uncensused VIEWPORT
//   member — toCanvas maps the pointer through the render-captured
//   zoom/panX/panY trio. Registered (the S129-D form) with the
//   RENDER-CONSISTENCY doctrine: the board's own DOM transform reads
//   the SAME render-pass values, so the mapping is always consistent
//   with the viewport the user SEES — the family's direction INVERTED
//   at this seam, and the live-read vocabulary must NOT be applied.
//
// S135-B — THE wouldCommit MEMBER'S BY-DESIGN REGISTRATION (A135-I2):
//   MultiSelectionSection's render-derived selected rows close into
//   selectionWouldCommit while the commit target rides the S133-B
//   live read. Registered with the VALUE-INSENSITIVITY datum: the
//   helper compares fill/stroke VALUES (patchDiffers), never ids —
//   markSaved's remap preserves values, so the every-save id churn
//   provably cannot fire this member (the churn-immune member).
//
// S135-C — THE LAYER-1 CENSUS CORRECTION (B135-I1 — the frozen-records
//   form, the S132-C/S134-L3 convention): the §3.1 Layer-1 brace
//   names 13 modules (the 14th src/lib module is Layer-0 db.ts); the
//   "14 modules" figure in the v1.109.0 revision entry + the AGENTS
//   session-130 bullet counted all src/lib modules — wrong at birth.
//   The corrected figure registered in the worklog's bracketed
//   s135-layer1-census-note; the frozen records never rewritten.
//
// S135-D — THE WORKLOG LINEAGE NOTE (B135-I2 — the B131-I3 form): the
//   81st/82nd cycles' per-auditor entries never landed; the bracketed
//   s135-lineage-note documents the gap and where the censuses
//   survive; this cycle's auditor entries resume the convention.
//
// The script family (the S118-C convention, s135 form): the s135
//   parity scripts ride their OWN tokens (live135 / nav135 /
//   digma-seo-s135.log, the 111th audit / 112th session / 72nd clip
//   ordinals, the S134 delivery at HEAD a4a68a8), never the frozen
//   s134 forms.

const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const layersSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/layers-panel.tsx"),
  "utf8",
);
const worklogSource = readFileSync(
  path.resolve(import.meta.dirname, "../worklog.md"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s135.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s135.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s135.sh"),
  "utf8",
);

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The toCanvas window (the S135-A seam: from the coordinate-conversion
 *  divider — the registration sits between it and the mapper — to the
 *  isPanning sibling below). */
function toCanvasWindow(): string {
  const start = canvasSource.indexOf("// ---- coordinate conversion");
  expect(start).toBeGreaterThan(-1);
  const end = canvasSource.indexOf("function isPanning(): boolean {", start);
  expect(end).toBeGreaterThan(start);
  return canvasSource.slice(start, end);
}

/** The MultiSelectionSection window (the S135-B seam: from the
 *  component's own anchor to the first HexColorRow's would-commit
 *  closure). */
function multiSelectionWindow(): string {
  const start = panelSource.indexOf("export function MultiSelectionSection({");
  expect(start).toBeGreaterThan(-1);
  const end = panelSource.indexOf('wouldCommit={(fill) => selectionWouldCommit(selected, fill, "fill")}', start);
  expect(end).toBeGreaterThan(start);
  return panelSource.slice(start, end);
}

// ---------------------------------------------------------------------------
// S135-A — the toCanvas viewport member's by-design registration (A135-I1)
// ---------------------------------------------------------------------------

describe("S135-A the toCanvas viewport member's by-design registration (A135-I1)", () => {
  it("DEFECT (source): the registration lands AT THE SEAM — above toCanvas, naming the render-captured viewport and the censused wheel-mid-drag interleaving", () => {
    const w = toCanvasWindow();
    expect(w).toMatch(/S135-A/);
    expect(w).toMatch(/A135-I1/);
    // The render-captured viewport trio consumed at handler time.
    expect(collapsed(w)).toMatch(/render-captured/i);
    expect(collapsed(w)).toMatch(/viewport/i);
    // The censused interleaving: a wheel-pan/zoom between two
    // pointermove ticks of a live drag.
    expect(collapsed(w)).toMatch(/wheel/i);
    expect(collapsed(w)).toMatch(/self-healing/i);
  });

  it("DEFECT (source): the registration names the RENDER-CONSISTENCY doctrine — the family's direction INVERTED at this seam, the live-read form structurally wrong here", () => {
    const w = toCanvasWindow();
    const regIdx = w.indexOf("S135-A");
    const reg = w.slice(regIdx, regIdx + 2400);
    // The DOM transform reads the SAME render-pass values — the
    // mapping consistent with the viewport the user SEES.
    expect(collapsed(reg)).toMatch(/INVERT/i);
    expect(collapsed(reg)).toMatch(/render-consisten/i);
    // A live store read would map through a transform the DOM has
    // not applied yet — the divergence named.
    expect(collapsed(reg)).toMatch(/diverg/i);
    // Zero mutation surface + the census-extension class.
    expect(collapsed(reg)).toMatch(/zero mutation/i);
    expect(collapsed(reg)).toMatch(/F120/);
  });
});

// ---------------------------------------------------------------------------
// S135-B — the wouldCommit member's by-design registration (A135-I2)
// ---------------------------------------------------------------------------

describe("S135-B the wouldCommit member's by-design registration (A135-I2)", () => {
  it("DEFECT (source): the registration lands AT THE SEAM — above the selected derivation, naming the render-derived rows and the S133-B live-read commit sibling", () => {
    const w = multiSelectionWindow();
    expect(w).toMatch(/S135-B/);
    expect(w).toMatch(/A135-I2/);
    // The render-derived rows closed into the would-commit truth.
    expect(collapsed(w)).toMatch(/render/i);
    expect(collapsed(w)).toMatch(/would-commit|wouldCommit/);
    // The commit target rides the S133-B live read.
    expect(collapsed(w)).toMatch(/S133-B/);
    expect(collapsed(w)).toMatch(/live/i);
  });

  it("DEFECT (source): the registration names the VALUE-INSENSITIVITY datum — the churn-immune member, the compare is on values never ids", () => {
    const w = multiSelectionWindow();
    const regIdx = w.indexOf("S135-B");
    const reg = w.slice(regIdx, regIdx + 2400);
    // selectionWouldCommit compares fill/stroke VALUES (patchDiffers),
    // never ids — markSaved's remap preserves values.
    expect(collapsed(reg)).toMatch(/value/i);
    expect(collapsed(reg)).toMatch(/patchDiffers/);
    expect(collapsed(reg)).toMatch(/never ids|not ids/i);
    // The every-save id churn provably cannot fire this member.
    expect(collapsed(reg)).toMatch(/churn/i);
    expect(collapsed(reg)).toMatch(/cannot fire|immune/i);
    // The S133-C rationale extension + the suppressed-pick floor.
    expect(collapsed(reg)).toMatch(/S133-C/);
    expect(collapsed(reg)).toMatch(/suppress/i);
  });
});

// ---------------------------------------------------------------------------
// S135-C — the Layer-1 census correction (B135-I1, the frozen-records form)
// ---------------------------------------------------------------------------

describe("S135-C the Layer-1 census correction (B135-I1 — the frozen-records form)", () => {
  it("DEFECT (worklog): the bracketed s135-layer1-census-note registers the corrected figure — 13 Layer-1 modules, the 14th src/lib module is Layer-0 db.ts", () => {
    const noteAt = worklogSource.indexOf("s135-layer1-census-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 1400);
    // The corrected figure: the brace names 13 modules.
    expect(collapsed(note)).toMatch(/13/);
    expect(collapsed(note)).toMatch(/Layer-0|Layer 0/i);
    expect(collapsed(note)).toMatch(/db\.ts/);
    // The frozen-records convention: the v1.109.0 entry + the AGENTS
    // session-130 bullet never rewritten.
    expect(collapsed(note)).toMatch(/frozen/i);
    expect(collapsed(note)).toMatch(/v1\.109\.0|session-130/i);
  });
});

// ---------------------------------------------------------------------------
// S135-D — the worklog lineage note (B135-I2, the B131-I3 form)
// ---------------------------------------------------------------------------

describe("S135-D the worklog lineage note (B135-I2 — the B131-I3 form)", () => {
  it("DEFECT (worklog): the bracketed s135-lineage-note documents the 81st/82nd cycles' missing auditor entries and where the censuses survive", () => {
    const noteAt = worklogSource.indexOf("s135-lineage-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 1900);
    // The gap: no s133-audit-a/b or s134-audit-a/b entries.
    expect(collapsed(note)).toMatch(/s133-audit/);
    expect(collapsed(note)).toMatch(/s134-audit/);
    // Where the censuses survive.
    expect(collapsed(note)).toMatch(/remediation-plan/i);
    // The B131-I3 convention + this cycle's resumption.
    expect(collapsed(note)).toMatch(/B131-I3/);
    expect(collapsed(note)).toMatch(/resume/i);
  });
});

// ---------------------------------------------------------------------------
// The s135 script provenance anchors
// ---------------------------------------------------------------------------

describe("the s135 script provenance anchors", () => {
  it("SURVIVAL (scripts): ref-audit-s135.sh rides its own tokens — live135, the 111th audit, the S134 delivery at HEAD a4a68a8", () => {
    expect(refAuditSource).toContain("--session live135");
    expect(refAuditSource).toMatch(/111th reference audit/);
    expect(refAuditSource).toContain("a4a68a8");
    // The clip pin datum rides the fail-loud form (the 72nd
    // consecutive session).
    expect(refAuditSource).toContain("'clip=[Share:L385-R458,Present:L466-R551]'");
    expect(refAuditSource).toMatch(/72nd/);
    // Zero frozen-s134 residue.
    expect(refAuditSource).not.toContain("live134");
    expect(refAuditSource).not.toContain("110th");
  });

  it("SURVIVAL (scripts): verify-nav-s135.sh rides its own tokens — nav135, the 112th session", () => {
    expect(navSource).toContain("nav135");
    expect(navSource).toMatch(/112th session/);
    expect(navSource).not.toContain("nav134");
    expect(navSource).not.toContain("111th session");
  });

  it("SURVIVAL (scripts): seo-check-s135.sh rides its own tokens — the s135 cycle", () => {
    expect(seoSource).toContain("digma-seo-s135");
    expect(seoSource).toMatch(/session 135, S135-cycle/);
    expect(seoSource).not.toContain("seo-s134");
    expect(seoSource).not.toContain("session 134, S134-cycle");
  });
});

// ---------------------------------------------------------------------------
// The standing seam survival set (the S134 forms verbatim + the PAD truths)
// ---------------------------------------------------------------------------

describe("the standing seam survival set", () => {
  it("SURVIVAL (source): the S134-A resize arm's live-element read rides unchanged", () => {
    const start = canvasSource.indexOf("if (isPanning()) return;");
    expect(start).toBeGreaterThan(-1);
    const end = canvasSource.indexOf("startBounds: { x: el.x, y: el.y, w: el.width, h: el.height },", start);
    expect(end).toBeGreaterThan(start);
    const w = canvasSource.slice(start, end + "startBounds: { x: el.x, y: el.y, w: el.width, h: el.height },".length);
    expect(w).toMatch(/const store = useEditorStore\.getState\(\);/);
    expect(w).toMatch(
      /const el = store\.elements\.find\(\(e\) => store\.selectedIds\.includes\(e\.id\)\) \?\? selected\[0\]!/,
    );
    expect(w).toMatch(/startBounds: \{ x: el\.x, y: el\.y, w: el\.width, h: el\.height \},/);
  });

  it("SURVIVAL (source): the S134-B rename registration and the S134-C upload registration ride unchanged", () => {
    const stateAt = layersSource.indexOf("const [renaming, setRenaming] = React.useState<string | null>(null);");
    expect(stateAt).toBeGreaterThan(-1);
    const renameWindow = layersSource.slice(Math.max(0, stateAt - 1400), stateAt);
    expect(renameWindow).toMatch(/S134-B/);
    expect(collapsed(renameWindow)).toMatch(/every-save/i);
    expect(collapsed(renameWindow)).toMatch(/S78-C/);
    const commitAt = panelSource.indexOf("s.updateElements([element.id], patch, s.gestureSnapshot === null);");
    expect(commitAt).toBeGreaterThan(-1);
    const uploadWindow = panelSource.slice(Math.max(0, commitAt - 1400), commitAt);
    expect(uploadWindow).toMatch(/S134-C/);
    expect(collapsed(uploadWindow)).toMatch(/A134-L2/);
    expect(collapsed(uploadWindow)).toMatch(/S109-A/);
  });

  it("SURVIVAL (source): the flush census stays 3 and the draw block's S119-B registration rides unchanged (the s118/s119 contracts)", () => {
    const calls = canvasSource.match(/resetSliderGesture\(\);/g) ?? [];
    expect(calls.length).toBe(3);
    const pointerUpStart = canvasSource.indexOf("function onPointerUp");
    expect(pointerUpStart).toBeGreaterThan(-1);
    const drawStart = canvasSource.indexOf('if (drag.kind === "draw") {', pointerUpStart);
    expect(drawStart).toBeGreaterThan(-1);
    const drawEnd = canvasSource.indexOf('} else if (drag.kind === "marquee") {', drawStart);
    expect(drawEnd).toBeGreaterThan(drawStart);
    const draw = canvasSource.slice(drawStart, drawEnd);
    expect(draw).not.toMatch(/resetSliderGesture/);
    const drawCollapsed = draw
      .split("\n")
      .map((l) => l.replace(/^\s*(?:\/\/|#)\s?/, "").trim())
      .filter((l) => l.length > 0)
      .join(" ")
      .replace(/\s+/g, " ");
    expect(drawCollapsed).toMatch(/S119-B \/ A119-I1/);
  });

  it("SURVIVAL (source): the S134-D AI targetIds registration rides unchanged (the honest-count floor)", () => {
    const aiSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
      "utf8",
    );
    const sendAt = aiSource.indexOf("targetIds: state.selectedIds");
    expect(sendAt).toBeGreaterThan(-1);
    const window = aiSource.slice(Math.max(0, sendAt - 1400), sendAt);
    expect(window).toMatch(/A134-I2/);
    expect(collapsed(window)).toMatch(/S129-D/);
    expect(collapsed(window)).toMatch(/S105-B/);
    expect(collapsed(window)).toMatch(/honest/i);
  });

  it("SURVIVAL (docs): the PAD §3.1 Layer-1 brace names 13 modules with db.ts in Layer 0, and the §10 B84-I3 row carries both family members", () => {
    // The B135-I1 live truth pinned so the figure can never silently
    // falsify again: the brace names 13, db.ts belongs to Layer 0.
    const braceAt = padSource.indexOf("Layer 1: Pure domain — src/lib/{editor,ai-assistant,team,greeting,validation,");
    expect(braceAt).toBeGreaterThan(-1);
    const brace = padSource.slice(braceAt, braceAt + 220);
    expect(brace).toContain("rate-limit,db-path,api,auth,call,export-png,password,utils}.ts");
    const layer0At = padSource.indexOf("Layer 0: Persistence — src/lib/db.ts");
    expect(layer0At).toBeGreaterThan(-1);
    // The S134-E repair: the §10 B84-I3 row carries resend-otp AND the
    // S133-D login sibling.
    const rowAt = padSource.indexOf("B84-I3");
    expect(rowAt).toBeGreaterThan(-1);
    const row = padSource.slice(rowAt, rowAt + 700);
    expect(collapsed(row)).toMatch(/resend-otp/);
    expect(collapsed(row)).toMatch(/login/i);
  });
});
