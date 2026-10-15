import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-133 spec (the eighty-first audit's chosen work):
//
// S133-A — THE CANVAS HIT BRANCH'S LIVE-LIST READ (A133-I1(a) — the
//   Informational the eighty-first audit's editor-side auditor found):
//   the A132-I1 read-direction family's census extension — the hit
//   branch's hit test, shift-toggle, and select commit all read the
//   RENDER-CAPTURED subscription while markSaved's id remap can land
//   between the render and the pointerdown: a stale hit.id strands a
//   dangling selection and arms a dead move-drag (the S109-A id-guard
//   no-ops every tick). The closure reads the LIVE list at pointerdown
//   time through the handler's own store capture — the getState()
//   form the S132-A marquee closure established.
//
// S133-B — THE DESKTOP PANEL UPDATE'S LIVE-SELECTION READ (A133-I1(b)):
//   the desktop panel's `update` passed the render-captured
//   selectedIds closure to updateElements while the MOBILE host's twin
//   already read the live `s.selectedIds` — the two hosts drifted.
//   The fix rides the live read at commit time (the pin-compatible
//   literal forms preserved by construction).
//
// S133-C — THE LAYERS ROW-CLICK'S BY-DESIGN REGISTRATION (A133-I1(c) —
//   the S129-D documented-absence form): the row click's id is BOUND
//   AT RENDER — no live-read form exists (index-matching would trade
//   the cosmetic self-healing dangling selection for a REAL
//   wrong-element selection); the window is the family's theoretical
//   sub-frame.
//
// S133-D — THE LOGIN ROUTE'S B84-I3 SIBLING REGISTRATION (B133-I2):
//   the unverified-branch update can strand an inert stale verifyCode
//   when a verify-otp commits mid-request; the S70-D conditional form
//   is the closure if the family is ever promoted. Registered, not
//   promoted — the family's standing disposition.
//
// S133-E — THE PAD §9.2 db:reset ROW REPAIR (B133-I1): the command
//   table listed the script S63-G deleted 70 sessions ago; the honest
//   reset path (db:push + db:seed) is what the row now names.
//
// The script family (the S118-C convention, s133 form): the s133
//   parity scripts ride their OWN tokens (live133 / nav133 /
//   digma-seo-s133.log, the 109th audit / 110th session / 70th clip
//   ordinals, the S132 delivery at HEAD 9e34254), never the frozen
//   s132 forms.

const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
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
const layersSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/layers-panel.tsx"),
  "utf8",
);
const loginSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/login/route.ts"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s133.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s133.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s133.sh"),
  "utf8",
);

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The hit-branch window (the pointerdown select-tool arm, through the
 *  move-drag's id hand-off). */
function hitBranchWindow(): string {
  const start = canvasSource.indexOf("// select tool: hit-test the TOPMOST VISIBLE element");
  expect(start).toBeGreaterThan(-1);
  const end = canvasSource.indexOf("ids: nextIds });", start);
  expect(end).toBeGreaterThan(start);
  return canvasSource.slice(start, end + "ids: nextIds });".length);
}

/** The desktop update helper window (the slider-gesture slice form). */
function desktopUpdateWindow(): string {
  const start = panelSource.indexOf("const update = (patch: Parameters");
  expect(start).toBeGreaterThan(-1);
  const end = panelSource.indexOf(");", start);
  return panelSource.slice(start, end);
}

// ---------------------------------------------------------------------------
// S133-A — the canvas hit branch's live-list read (A133-I1(a))
// ---------------------------------------------------------------------------

describe("S133-A the canvas hit branch's live-list read (A133-I1(a))", () => {
  it("DEFECT (source): the hit branch captures the LIVE store — the hit test, the toggle, and the commit never read the render-captured subscription", () => {
    const w = hitBranchWindow();
    // THE DEFECT PIN: pre-fix the hit test read `[...elements]`, the
    // toggle read `selectedIds`, and the commit rode
    // `useEditorStore.getState().select(...)` over ids derived from the
    // render closure — a markSaved remap landing between the render and
    // the pointerdown stranded a dangling selection.
    expect(w).toMatch(/const store = useEditorStore\.getState\(\);/);
    expect(w).toMatch(/const hit = \[\.\.\.store\.elements\]/);
    expect(w).toMatch(/store\.selectedIds\.includes\(hit\.id\)/);
    expect(w).toMatch(/store\.select\(nextIds\);/);
    // The move-drag's ids inherit the live-derived nextIds.
    expect(w).toMatch(/ids: nextIds/);
  });

  it("DEFECT (source): the hit branch reads the LIVE selection for every arm of the shift-toggle", () => {
    const w = hitBranchWindow();
    // All four toggle arms (the filter, the spread, the passthrough,
    // the fresh) read the live store's selection.
    expect(w).toMatch(/store\.selectedIds\.filter\(\(id\) => id !== hit\.id\)/);
    expect(w).toMatch(/\[\.\.\.store\.selectedIds, hit\.id\]/);
    expect(w).not.toMatch(/[^.]\bselectedIds\.filter/);
    expect(w).not.toMatch(/[^.]\bselectedIds\.includes/);
  });

  it("DEFECT (source): the S133-A registration names the A133-I1 family boundary at the seam", () => {
    const hitAt = canvasSource.indexOf("const hit = [...store.elements]");
    expect(hitAt).toBeGreaterThan(-1);
    // 900-char back-window (the S102-B class): the registration
    // comment sits above the store capture, inside the hit arm.
    const window = canvasSource.slice(Math.max(0, hitAt - 900), hitAt);
    expect(window).toMatch(/S133-A/);
    expect(window).toMatch(/A133-I1/);
    // The registration must name BOTH halves: the family form it rides
    // (the S132-A marquee closure) and the markSaved remap it defends
    // against.
    expect(window).toMatch(/S132-A/);
    expect(window).toMatch(/markSaved/);
  });
});

// ---------------------------------------------------------------------------
// S133-B — the desktop panel update's live-selection read (A133-I1(b))
// ---------------------------------------------------------------------------

describe("S133-B the desktop panel update's live-selection read (A133-I1(b))", () => {
  it("DEFECT (source): the desktop update passes the LIVE selection — the mobile host's read direction, never the render-captured closure", () => {
    const w = desktopUpdateWindow();
    // THE DEFECT PIN: pre-fix the first argument was the render-captured
    // `selectedIds` closure — the mobile host's twin already read the
    // live `s.selectedIds`; the two hosts drifted.
    expect(w).toMatch(/useEditorStore\.getState\(\)\.selectedIds,/);
    expect(w).not.toMatch(/\n\s+selectedIds,/);
  });

  it("DEFECT (source): the S133-B registration names the host-drift repair at the seam", () => {
    const w = desktopUpdateWindow();
    const regIdx = w.indexOf("S133-B");
    expect(regIdx).toBeGreaterThan(-1);
    const reg = w.slice(regIdx, regIdx + 1200);
    expect(reg).toMatch(/A133-I1/);
    // The registration names the mobile twin (the read direction the
    // fix adopts) and the remap hazard (the stale-id drop it closes).
    expect(collapsed(reg)).toMatch(/mobile host/i);
    expect(reg).toMatch(/markSaved/);
  });

  it("SURVIVAL (source): the pin-compatible literals ride verbatim — the slider-gesture and mobile-update-gesture contracts", () => {
    const w = desktopUpdateWindow();
    // The two standing pin families' literal forms (the fix preserves
    // them by construction — this pin holds the construction).
    expect(w).toMatch(/useEditorStore\.getState\(\)\.updateElements\(/);
    expect(w).toMatch(/patch,/);
    expect(w).toMatch(/useEditorStore\.getState\(\)\.gestureSnapshot === null,/);
    expect(w).toMatch(/=>/);
  });
});

// ---------------------------------------------------------------------------
// S133-C — the layers row-click's by-design registration (A133-I1(c))
// ---------------------------------------------------------------------------

describe("S133-C the layers row-click's by-design registration (A133-I1(c))", () => {
  it("DEFECT (source): the by-design registration lands AT THE SEAM — above onRowClick, naming the bound-at-render truth", () => {
    const fnAt = layersSource.indexOf("function onRowClick(id: string, event: { shiftKey: boolean })");
    expect(fnAt).toBeGreaterThan(-1);
    // 1200-char back-window: the registration comment sits above the
    // function signature.
    const window = layersSource.slice(Math.max(0, fnAt - 1200), fnAt);
    expect(window).toMatch(/S133-C/);
    expect(window).toMatch(/A133-I1/);
    expect(collapsed(window)).toMatch(/bound at render/i);
  });

  it("DEFECT (source): the registration names the wrong-element trade and the theoretical sub-frame — why no live-read form exists", () => {
    const fnAt = layersSource.indexOf("function onRowClick(id: string, event: { shiftKey: boolean })");
    const window = layersSource.slice(Math.max(0, fnAt - 1200), fnAt);
    const regIdx = window.indexOf("S133-C");
    const reg = window.slice(regIdx, regIdx + 1600);
    // The honest disposition: index-matching trades the cosmetic
    // self-healing dangling selection for a REAL wrong-element
    // selection; the window is the family's theoretical sub-frame.
    expect(collapsed(reg)).toMatch(/wrong-element selection/i);
    expect(collapsed(reg)).toMatch(/sub-frame/i);
  });

  it("SURVIVAL (source): the onRowClick signature and the row's activation contract ride unchanged", () => {
    // The doc-lows-s69 structural-typing pin + the layers-keyboard
    // activation pin — the registration never touches either form.
    expect(layersSource).toMatch(/function onRowClick\(id: string, event: \{ shiftKey: boolean \}\)/);
    expect(layersSource).toContain("onClick={(event) => onRowClick(el.id, event)}");
    // The dispatch still rides the live store (the standing form).
    const fnAt = layersSource.indexOf("function onRowClick(id: string, event: { shiftKey: boolean })");
    const body = layersSource.slice(fnAt, fnAt + 300);
    expect(body).toMatch(/const store = useEditorStore\.getState\(\);/);
    expect(body).toMatch(/store\.select\(\[id\]/);
  });
});

// ---------------------------------------------------------------------------
// S133-D — the login route's B84-I3 sibling registration (B133-I2)
// ---------------------------------------------------------------------------

describe("S133-D the login route's B84-I3 sibling registration (B133-I2)", () => {
  it("DEFECT (source): the registration lands AT THE SEAM — above the unverified-branch update, naming the family and the interleaving", () => {
    const updateAt = loginSource.indexOf("await db.user.update({ where: { id: user.id }, data: { verifyCode, verifyAttempts: 0 } });");
    expect(updateAt).toBeGreaterThan(-1);
    // 1400-char back-window: the registration sits above the update
    // statement, inside the unverified branch.
    const window = loginSource.slice(Math.max(0, updateAt - 1400), updateAt);
    expect(window).toMatch(/S133-D/);
    expect(window).toMatch(/B133-I2/);
    expect(window).toMatch(/B84-I3/);
  });

  it("DEFECT (source): the registration names the S70-D conditional form and the registered-not-promoted disposition", () => {
    const updateAt = loginSource.indexOf("await db.user.update({ where: { id: user.id }, data: { verifyCode, verifyAttempts: 0 } });");
    const window = loginSource.slice(Math.max(0, updateAt - 1400), updateAt);
    const regIdx = window.indexOf("S133-D");
    const reg = window.slice(regIdx, regIdx + 1800);
    // The closure form if ever promoted + why it stays registered.
    expect(reg).toMatch(/S70-D/);
    expect(collapsed(reg)).toMatch(/updateMany/i);
    expect(collapsed(reg)).toMatch(/registered/i);
  });

  it("SURVIVAL (source): the catch-arm forms ride unchanged (the s102/s124/s125 contracts)", () => {
    expect(loginSource).toMatch(/error\.code === "P2025"/);
    expect(loginSource).toMatch(/fail\("NOT_FOUND", "User not found", 404\)/);
    expect(loginSource).toMatch(/\(error\.code === "P2024" \|\| error\.code === "P2028"\)/);
  });
});

// ---------------------------------------------------------------------------
// S133-E — the PAD §9.2 db:reset row repair (B133-I1)
// ---------------------------------------------------------------------------

describe("S133-E the PAD §9.2 db:reset row repair (B133-I1)", () => {
  it("DEFECT (doc): the §9.2 command table no longer lists the retired db:reset script — the honest reset path named", () => {
    const start = padSource.indexOf("### 9.2 Common Commands");
    expect(start).toBeGreaterThan(-1);
    const end = padSource.indexOf("### 9.3", start);
    const sec92 = padSource.slice(start, end);
    // THE DEFECT PIN: pre-fix the command row carried the backticked
    // `db:reset` — a script S63-G deleted from package.json 70
    // sessions ago (tests/dead-code-s63.test.ts pins its absence).
    expect(sec92).not.toMatch(/`db:reset`/);
    // The honest reset path: push + seed, the retirement named.
    expect(sec92).toMatch(/reset = db:push \+ db:seed/);
    expect(sec92).toMatch(/S63-G/);
  });
});

// ---------------------------------------------------------------------------
// The script family (the s133 provenance anchors — the S118-C convention)
// ---------------------------------------------------------------------------

describe("the s133 script provenance anchors", () => {
  it("SURVIVAL (scripts): ref-audit-s133.sh rides its own tokens — live133, the 109th audit, the S132 delivery at HEAD 9e34254", () => {
    expect(refAuditSource).toContain("--session live133");
    expect(refAuditSource).toMatch(/109th reference audit/);
    expect(refAuditSource).toContain("9e34254");
    // The clip pin datum rides the fail-loud form (the 70th
    // consecutive session).
    expect(refAuditSource).toContain("'clip=[Share:L385-R458,Present:L466-R551]'");
    expect(refAuditSource).toMatch(/70th/);
    // Zero frozen-s132 residue.
    expect(refAuditSource).not.toContain("live132");
    expect(refAuditSource).not.toContain("108th");
  });

  it("SURVIVAL (scripts): verify-nav-s133.sh rides its own tokens — nav133, the 110th session", () => {
    expect(navSource).toContain("nav133");
    expect(navSource).toMatch(/110th session/);
    expect(navSource).not.toContain("nav132");
    expect(navSource).not.toContain("109th session");
  });

  it("SURVIVAL (scripts): seo-check-s133.sh rides its own tokens — the s133 cycle", () => {
    expect(seoSource).toContain("digma-seo-s133");
    expect(seoSource).toMatch(/session 133, S133-cycle/);
    expect(seoSource).not.toContain("seo-s132");
    expect(seoSource).not.toContain("session 132, S132-cycle");
  });
});

// ---------------------------------------------------------------------------
// The standing seam survival set (the S132/S131/S130 forms verbatim)
// ---------------------------------------------------------------------------

describe("the standing seam survival set", () => {
  it("SURVIVAL (source): the S132-A marquee live-list read rides unchanged", () => {
    const marqueeStart = canvasSource.indexOf('} else if (drag.kind === "marquee") {');
    expect(marqueeStart).toBeGreaterThan(-1);
    const marqueeEnd = canvasSource.indexOf('} else if (drag.kind === "move"', marqueeStart);
    const marqueeBlock = canvasSource.slice(marqueeStart, marqueeEnd);
    expect(marqueeBlock).toMatch(/const inside = store\.elements\.filter\(\(el\) => \{/);
    expect(marqueeBlock).toMatch(/store\.select\(inside\.map\(\(el\) => el\.id\), drag\.shift\);/);
  });

  it("SURVIVAL (source): the S132-B by-design registration and the s66 preservation contract ride unchanged", () => {
    const hexStart = panelSource.indexOf("function HexColorRow(");
    expect(hexStart).toBeGreaterThan(-1);
    const hexEnd = panelSource.indexOf("\n}\n", hexStart);
    const w = panelSource.slice(hexStart, hexEnd);
    const regIdx = w.indexOf("S132-B");
    expect(regIdx).toBeGreaterThan(-1);
    expect(regIdx).toBeLessThan(w.indexOf('if (next === "") {'));
    const text = w.match(/type="text"[\s\S]*?\/>/);
    expect(text).not.toBeNull();
    expect(text![0]).not.toMatch(/sliderGesture\./);
  });

  it("SURVIVAL (source): the S131 seams — the Present mount composition and the four layers-panel stand-downs", () => {
    expect(viewSource).toMatch(
      /\{presenting && !loading && <MemoizedPresentOverlay onExit=\{exitPresent\} \/>\}/,
    );
    const guards = layersSource.match(/if \(store\.gestureSnapshot\) return;/g) ?? [];
    expect(guards.length).toBe(4);
  });

  it("SURVIVAL (source): the S130 arms — the SLIDER_KEYS keyTick head and one onWheel twin", () => {
    expect(panelSource).toMatch(/if \(SLIDER_KEYS\.has\(event\.key\)\) sliderGesture\.keyTick\(`slider:\$\{label\}`\)/);
    expect(panelSource).toMatch(/onWheel=\{\(\) => sliderGesture\.keyTick\("slider:Rotation"\)\}/);
  });

  it("SURVIVAL (source): the mobile host's live-update form rides unchanged (the read direction S133-B adopts)", () => {
    const mobileStart = viewSource.indexOf("function MobilePropertiesEditor()");
    expect(mobileStart).toBeGreaterThan(-1);
    const mobileEnd = viewSource.indexOf("function MobileCanvasProperties()", mobileStart);
    const mobile = viewSource.slice(mobileStart, mobileEnd);
    expect(mobile).toMatch(/const s = useEditorStore\.getState\(\);/);
    expect(mobile).toMatch(/s\.updateElements\(s\.selectedIds, patch, s\.gestureSnapshot === null\);/);
  });
});
