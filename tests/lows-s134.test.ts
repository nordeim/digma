import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-134 spec (the eighty-second audit's chosen work):
//
// S134-A — THE RESIZE ARM'S LIVE-ELEMENT READ (A134-I1(a) — the
//   Informational the eighty-second audit's editor-side auditor found):
//   the A133-I1 read-direction family's last fixable member — the
//   resize handle's pointerdown read the RENDER-CAPTURED selected memo
//   (`const el = selected[0]!`) while markSaved's every-save id remap
//   can land between the render and the pointerdown: a stale el.id
//   arming a dead resize (the S109-A id-guard no-opping every tick,
//   endGesture net-zero). The closure reads the LIVE element at
//   pointerdown time through the handler's own store capture — the
//   getState() form the S132-A/S133-A closures established, with the
//   render-memo derivation's own membership shape.
//
// S134-B — THE LAYERS-RENAME STRAND'S BY-DESIGN REGISTRATION (A134-L1
//   — the Low): the rename session keys on the render-bound row id,
//   and the every-save id churn (the PUT's delete-recreate with fresh
//   cuids) unmounts the focused input mid-edit — Chromium fires no
//   blur on node removal (the S78-C datum), so the typed draft is
//   lost. Registered (the S129-D form): index-matching would trade the
//   cosmetic draft loss for a REAL wrong-row rename commit.
//
// S134-C — THE UPLOAD CHAIN'S BY-DESIGN REGISTRATION (A134-L2 — the
//   Low): commitUpload's async chain holds the file-pick-time element;
//   a save response landing mid-chain rekeys the id, the live-read
//   falls to the stale row, and the commit no-ops through the S109-A
//   guard — a silently dropped upload (the re-pick cost). Registered.
//
// S134-D — THE REGISTRATION FAMILY (the smalls fold): (b) the layers
//   DnD id pair's honest drop-refusal; (c) the fillKey comment-truth
//   repair (the every-save churn fires the compare-and-adjust on any
//   save, not just a different element selected); (d) the S119-B
//   draw-commit registration's active-foreign-slider-drag sibling
//   (the intent-order inversion, no data loss — the A88-I1 posture
//   class); (A134-I2) the AI send's targetIds registration (the
//   honest-count floor); (B134-I2) the projects/[id] PATCH's
//   clampColor stale-fallback registration.
//
// S134-E — THE PAD §10 B84-I3 ROW REPAIR (B134-L1): the known-issues
//   row the S133-D registration cites names only the resend-otp arm —
//   the login sibling (the same interleaving, the same inert residue)
//   joins the row so the family's registry carries its full census.
//
// The script family (the S118-C convention, s134 form): the s134
//   parity scripts ride their OWN tokens (live134 / nav134 /
//   digma-seo-s134.log, the 110th audit / 111th session / 71st clip
//   ordinals, the S133 delivery at HEAD c366767), never the frozen
//   s133 forms.

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
const aiSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const projectRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/route.ts"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s134.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s134.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s134.sh"),
  "utf8",
);

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The resize-arm window (the handle's pointerdown, from the pan gate
 *  through the startBounds hand-off). */
function resizeArmWindow(): string {
  const start = canvasSource.indexOf("if (isPanning()) return;");
  expect(start).toBeGreaterThan(-1);
  const end = canvasSource.indexOf("startBounds: { x: el.x, y: el.y, w: el.width, h: el.height },", start);
  expect(end).toBeGreaterThan(start);
  return canvasSource.slice(start, end + "startBounds: { x: el.x, y: el.y, w: el.width, h: el.height },".length);
}

/** The draw-commit block (the s119 boundary form: anchored INSIDE
 *  onPointerUp — the plain `drag.kind === "draw"` anchor). */
function drawBlockWindow(): string {
  const pointerUpStart = canvasSource.indexOf("function onPointerUp");
  expect(pointerUpStart).toBeGreaterThan(-1);
  const drawStart = canvasSource.indexOf('if (drag.kind === "draw") {', pointerUpStart);
  expect(drawStart).toBeGreaterThan(-1);
  const drawEnd = canvasSource.indexOf('} else if (drag.kind === "marquee") {', drawStart);
  expect(drawEnd).toBeGreaterThan(drawStart);
  return canvasSource.slice(drawStart, drawEnd);
}

// ---------------------------------------------------------------------------
// S134-A — the resize arm's live-element read (A134-I1(a))
// ---------------------------------------------------------------------------

describe("S134-A the resize arm's live-element read (A134-I1(a))", () => {
  it("DEFECT (source): the resize arm captures the LIVE store — the element is found in the live list by the live selection, never the render-captured memo alone", () => {
    const w = resizeArmWindow();
    // THE DEFECT PIN: pre-fix the arm read `const el = selected[0]!` —
    // the RENDER-CAPTURED memo — so a markSaved remap landing between
    // the render and the handle pointerdown armed a dead resize (the
    // S109-A id-guard no-opping every tick, endGesture net-zero).
    expect(w).toMatch(/const store = useEditorStore\.getState\(\);/);
    expect(w).toMatch(
      /const selectedIdSet = new Set\(store\.selectedIds\);\s*const el = store\.elements\.find\(\(e\) => selectedIdSet\.has\(e\.id\)\) \?\? selected\[0\]!/,
    );
    // The live row feeds the drag's geometry AND identity — the
    // startBounds and the per-tick commit inherit the fresh id.
    expect(w).toMatch(/startBounds: \{ x: el\.x, y: el\.y, w: el\.width, h: el\.height \},/);
  });

  it("DEFECT (source): the registration names the A134-I1 doctrine — the dead resize the remap armed, the live read at pointerdown time", () => {
    const w = resizeArmWindow();
    const regIdx = w.indexOf("S134-A");
    expect(regIdx).toBeGreaterThan(-1);
    const reg = w.slice(regIdx, regIdx + 1600);
    expect(reg).toMatch(/A134-I1/);
    // The dead-resize mechanism + the S133-A family form.
    expect(collapsed(reg)).toMatch(/dead resize/i);
    expect(collapsed(reg)).toMatch(/S109-A/);
    expect(collapsed(reg)).toMatch(/live/i);
  });
});

// ---------------------------------------------------------------------------
// S134-B — the layers-rename strand's by-design registration (A134-L1)
// ---------------------------------------------------------------------------

describe("S134-B the layers-rename strand's by-design registration (A134-L1)", () => {
  it("DEFECT (source): the registration lands AT THE SEAM — above the rename-session state, naming the every-save churn and the unmount strand", () => {
    const stateAt = layersSource.indexOf("const [renaming, setRenaming] = React.useState<string | null>(null);");
    expect(stateAt).toBeGreaterThan(-1);
    // 1400-char back-window: the registration sits above the state
    // declarations (OUTSIDE the S133-C onRowClick window).
    const window = layersSource.slice(Math.max(0, stateAt - 1400), stateAt);
    expect(window).toMatch(/S134-B/);
    expect(window).toMatch(/A134-L1/);
    // The mechanism: the every-save churn rekeys the row the session
    // keys on; the unmount loses the draft (no blur on removal).
    expect(collapsed(window)).toMatch(/every-save/i);
    expect(collapsed(window)).toMatch(/S78-C/);
    expect(collapsed(window)).toMatch(/draft/i);
  });

  it("DEFECT (source): the registration names the wrong-row trade and the remap-handoff closure form — why index-matching is refused", () => {
    const stateAt = layersSource.indexOf("const [renaming, setRenaming] = React.useState<string | null>(null);");
    const window = layersSource.slice(Math.max(0, stateAt - 1400), stateAt);
    const regIdx = window.indexOf("S134-B");
    const reg = window.slice(regIdx, regIdx + 2200);
    // The S133-C rationale verbatim: a cosmetic self-healing loss is
    // never traded for a REAL wrong-row commit.
    expect(collapsed(reg)).toMatch(/wrong-row/i);
    expect(collapsed(reg)).toMatch(/index-matching|index matching/i);
    // The closure form if ever promoted: the store-level remap handoff.
    expect(collapsed(reg)).toMatch(/remap/i);
    expect(collapsed(reg)).toMatch(/handoff/i);
  });
});

// ---------------------------------------------------------------------------
// S134-C — the upload chain's by-design registration (A134-L2)
// ---------------------------------------------------------------------------

describe("S134-C the upload chain's by-design registration (A134-L2)", () => {
  it("DEFECT (source): the registration lands INSIDE commitUpload — above the commit, naming the remap strand the S107-A registration missed", () => {
    const commitAt = panelSource.indexOf("s.updateElements([element.id], patch, s.gestureSnapshot === null);");
    expect(commitAt).toBeGreaterThan(-1);
    // 1400-char back-window inside the helper: the registration sits
    // above the commit, after the S113-D thumb note.
    const window = panelSource.slice(Math.max(0, commitAt - 1400), commitAt);
    expect(window).toMatch(/S134-C/);
    expect(window).toMatch(/A134-L2/);
    // The mechanism: the async chain's frozen id + the mid-chain remap
    // + the live-read fallthrough + the S109-A no-op floor.
    expect(collapsed(window)).toMatch(/remap/i);
    expect(collapsed(window)).toMatch(/S109-A/);
    expect(collapsed(window)).toMatch(/re-pick|repick/i);
  });
});

// ---------------------------------------------------------------------------
// S134-D — the registration family (the smalls fold)
// ---------------------------------------------------------------------------

describe("S134-D the registration family (the smalls fold)", () => {
  it("DEFECT (source): (b) the layers DnD pair's honest drop-refusal — the early returns keep the reorder surface clean through a mid-drag remap", () => {
    const dropAt = layersSource.indexOf('const remaining = store.elements.filter((e) => e.id !== fromId);');
    expect(dropAt).toBeGreaterThan(-1);
    const window = layersSource.slice(Math.max(0, dropAt - 1200), dropAt);
    expect(window).toMatch(/S134-D/);
    expect(collapsed(window)).toMatch(/A134-I1/);
    // The honest refusal + the S133-C index-matching rationale.
    expect(collapsed(window)).toMatch(/drop-refusal|drop refusal/i);
    expect(collapsed(window)).toMatch(/wrong-element/i);
  });

  it("DEFECT (source): (c) the fillKey comment-truth repair — the compare-and-adjust fires on ANY save (the id member rekeys every markSaved), not just a different element selected", () => {
    const keyAt = panelSource.indexOf("const fillKey = `${element.id}:${derivedFillMode}`;");
    expect(keyAt).toBeGreaterThan(-1);
    const window = panelSource.slice(Math.max(0, keyAt - 900), keyAt);
    expect(window).toMatch(/S134-D/);
    expect(collapsed(window)).toMatch(/every-save|every save/i);
    expect(collapsed(window)).toMatch(/churn/i);
    // The cosmetic snap-back named (a non-derived tab snapping to the
    // derived mode on the next autosave response).
    expect(collapsed(window)).toMatch(/snap/i);
  });

  it("DEFECT (source): (d) the draw-commit sibling — the active foreign slider drag's intent-order inversion registered beside the S119-B census", () => {
    const draw = drawBlockWindow();
    const regIdx = draw.indexOf("S134-D");
    expect(regIdx).toBeGreaterThan(-1);
    const reg = draw.slice(regIdx, regIdx + 1800);
    // The multi-touch interleaving + the inversion + the no-data-loss
    // posture (the A88-I1 class) — registered, never flushed.
    expect(collapsed(reg)).toMatch(/A134-I1/);
    expect(collapsed(reg)).toMatch(/inversion/i);
    expect(collapsed(reg)).toMatch(/A88-I1/);
    expect(collapsed(reg)).toMatch(/registered/i);
  });

  it("DEFECT (source): (A134-I2) the AI send's targetIds registration — the send-time capture is inherent; the honest-count floor is the designed boundary", () => {
    const sendAt = aiSource.indexOf("targetIds: state.selectedIds,");
    expect(sendAt).toBeGreaterThan(-1);
    const window = aiSource.slice(Math.max(0, sendAt - 1200), sendAt);
    expect(window).toMatch(/A134-I2/);
    // The mechanism + the floor: the multi-second await vs the
    // every-save churn; the apply's live membership filters dropping
    // stale ids; the S105-B honest count.
    expect(collapsed(window)).toMatch(/churn/i);
    expect(collapsed(window)).toMatch(/S105-B/);
    expect(collapsed(window)).toMatch(/honest/i);
  });

  it("DEFECT (source): (B134-I2) the PATCH clampColor registration — the pre-read fallback's stale-write window named at the seam", () => {
    const commitAt = projectRouteSource.indexOf("data.backgroundColor = clampColor(String(body.backgroundColor), existing.backgroundColor);");
    expect(commitAt).toBeGreaterThan(-1);
    const window = projectRouteSource.slice(Math.max(0, commitAt - 1000), commitAt);
    expect(window).toMatch(/B134-I2/);
    // The window: a concurrent PATCH + an INVALID color in the racing
    // request (API-consumer-only); cosmetic-only, self-healing; the
    // elements-PUT ""-fallback sibling named.
    expect(collapsed(window)).toMatch(/concurrent/i);
    expect(collapsed(window)).toMatch(/cosmetic/i);
    expect(collapsed(window)).toMatch(/elements PUT|elements-PUT/i);
  });
});

// ---------------------------------------------------------------------------
// S134-E — the PAD §10 B84-I3 row repair (B134-L1)
// ---------------------------------------------------------------------------

describe("S134-E the PAD §10 B84-I3 row repair (B134-L1)", () => {
  it("DEFECT (doc): the §10 known-issues row carries the family's FULL census — the login sibling joins the resend-otp arm", () => {
    const start = padSource.indexOf("## 10.");
    expect(start).toBeGreaterThan(-1);
    const end = padSource.indexOf("## 11.", start);
    const sec10 = padSource.slice(start, end);
    // THE DEFECT PIN: pre-fix the B84-I3 row named only the resend-otp
    // arm — the row the S133-D registration comment cites as the
    // family's disposition record was one member short. The row is
    // anchored by its distinctive opening (the B84-I3 tag itself sits
    // at the first cell's END, after the sibling text).
    const rowIdx = sec10.indexOf("resend-otp's unconditional update");
    expect(rowIdx).toBeGreaterThan(-1);
    const row = sec10.slice(rowIdx, rowIdx + 1200);
    expect(row).toMatch(/resend-otp/);
    expect(collapsed(row)).toMatch(/login/i);
    expect(row).toMatch(/S133-D/);
    expect(row).toMatch(/B84-I3/);
  });
});

// ---------------------------------------------------------------------------
// The script family (the s134 provenance anchors — the S118-C convention)
// ---------------------------------------------------------------------------

describe("the s134 script provenance anchors", () => {
  it("SURVIVAL (scripts): ref-audit-s134.sh rides its own tokens — live134, the 110th audit, the S133 delivery at HEAD c366767", () => {
    expect(refAuditSource).toContain("--session live134");
    expect(refAuditSource).toMatch(/110th reference audit/);
    expect(refAuditSource).toContain("c366767");
    // The clip pin datum rides the fail-loud form (the 71st
    // consecutive session).
    expect(refAuditSource).toContain("'clip=[Share:L385-R458,Present:L466-R551]'");
    expect(refAuditSource).toMatch(/71st/);
    // Zero frozen-s133 residue.
    expect(refAuditSource).not.toContain("live133");
    expect(refAuditSource).not.toContain("109th");
  });

  it("SURVIVAL (scripts): verify-nav-s134.sh rides its own tokens — nav134, the 111th session", () => {
    expect(navSource).toContain("nav134");
    expect(navSource).toMatch(/111th session/);
    expect(navSource).not.toContain("nav133");
    expect(navSource).not.toContain("110th session");
  });

  it("SURVIVAL (scripts): seo-check-s134.sh rides its own tokens — the s134 cycle", () => {
    expect(seoSource).toContain("digma-seo-s134");
    expect(seoSource).toMatch(/session 134, S134-cycle/);
    expect(seoSource).not.toContain("seo-s133");
    expect(seoSource).not.toContain("session 133, S133-cycle");
  });
});

// ---------------------------------------------------------------------------
// The standing seam survival set (the S133 forms verbatim)
// ---------------------------------------------------------------------------

describe("the standing seam survival set", () => {
  it("SURVIVAL (source): the S133-A hit-branch live read rides unchanged", () => {
    const start = canvasSource.indexOf("// select tool: hit-test the TOPMOST VISIBLE element");
    expect(start).toBeGreaterThan(-1);
    const end = canvasSource.indexOf("ids: nextIds });", start);
    const w = canvasSource.slice(start, end);
    expect(w).toMatch(/const store = useEditorStore\.getState\(\);/);
    expect(w).toMatch(/const hit = \[\.\.\.store\.elements\]/);
    expect(w).toMatch(/store\.select\(nextIds\)/);
  });

  it("SURVIVAL (source): the S133-B desktop update's live-selection read rides unchanged (the pin-compatible literals)", () => {
    const start = panelSource.indexOf("const update = (patch: Parameters");
    expect(start).toBeGreaterThan(-1);
    const end = panelSource.indexOf(");", start);
    const w = panelSource.slice(start, end);
    expect(w).toMatch(/useEditorStore\.getState\(\)\.selectedIds,/);
    expect(w).toMatch(/useEditorStore\.getState\(\)\.updateElements\(/);
    expect(w).toMatch(/useEditorStore\.getState\(\)\.gestureSnapshot === null,/);
  });

  it("SURVIVAL (source): the S133-C registration and the S133-D login registration ride unchanged", () => {
    const fnAt = layersSource.indexOf("function onRowClick(id: string, event: { shiftKey: boolean })");
    expect(fnAt).toBeGreaterThan(-1);
    const window = layersSource.slice(Math.max(0, fnAt - 1200), fnAt);
    expect(window).toMatch(/S133-C/);
    expect(collapsed(window)).toMatch(/bound at render/i);
    const loginSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/app/api/auth/login/route.ts"),
      "utf8",
    );
    const updateAt = loginSource.indexOf("await db.user.update({ where: { id: user.id }, data: { verifyCode, verifyAttempts: 0 } });");
    const loginWindow = loginSource.slice(Math.max(0, updateAt - 1400), updateAt);
    expect(loginWindow).toMatch(/S133-D/);
    expect(loginWindow).toMatch(/B84-I3/);
  });

  it("SURVIVAL (source): the S133-E §9.2 row and the render-side visibility gate ride unchanged", () => {
    const start = padSource.indexOf("### 9.2 Common Commands");
    const end = padSource.indexOf("### 9.3", start);
    const sec92 = padSource.slice(start, end);
    expect(sec92).not.toMatch(/`db:reset`/);
    expect(sec92).toMatch(/reset = db:push \+ db:seed/);
    // The client-lows-s79 form: the render gate targets the render
    // expression — the S134-A handler edit must never touch it.
    expect(canvasSource).toMatch(
      /selected\.length === 1 && selectionBounds && selected\[0\](?:!)?\.visible/,
    );
  });

  it("SURVIVAL (source): the flush census stays 3 and the draw block's S119-B registration rides unchanged (the s118/s119 contracts)", () => {
    const calls = canvasSource.match(/resetSliderGesture\(\);/g) ?? [];
    expect(calls.length).toBe(3);
    const draw = drawBlockWindow();
    expect(draw).not.toMatch(/resetSliderGesture/);
    const drawCollapsed = draw
      .split("\n")
      .map((l) => l.replace(/^\s*(?:\/\/|#)\s?/, "").trim())
      .filter((l) => l.length > 0)
      .join(" ")
      .replace(/\s+/g, " ");
    expect(drawCollapsed).toMatch(/S119-B \/ A119-I1/);
    expect(drawCollapsed).toMatch(/the EVENT ORDERING, not a flush/);
    expect(drawCollapsed).toMatch(/focus change precedes pointerup/);
    expect(drawCollapsed).toMatch(/S117-C\/A118-L2 inversion/);
  });

  it("SURVIVAL (source): the commitUpload helper structure and the S113-B target-scope tokens ride unchanged (the lows-s107/lows-s113 contracts)", () => {
    const helper = panelSource.match(
      /const commitUpload = \(fillImage: string, fillImageThumb: string \| null\) => \{[\s\S]*?\n  \};/,
    );
    expect(helper).not.toBeNull();
    expect(helper![0]).toMatch(/const live = useEditorStore\.getState\(\)\.elements\.find\(\(el\) => el\.id === element\.id\) \?\? element;/);
    expect(helper![0]).toMatch(/if \(patchDiffers\(live, patch\)\) \{/);
    expect(helper![0]).toMatch(/s\.updateElements\(\[element\.id\], patch, s\.gestureSnapshot === null\);/);
    expect(helper![0]).toMatch(/S113-B/);
  });
});
