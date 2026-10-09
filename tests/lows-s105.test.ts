import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as editorLib from "../src/lib/editor";

// The session-105 spec (the fifty-third audit's chosen work):
//
// S105-A — the color-swatch family's no-op commits (A-M1, the
//   headline): the S102-E/S103-A/S104-A doctrine closed the
//   click/select surfaces, the text surfaces, and the number surfaces
//   of the no-op commit family — the COLOR PICKER modality (the same
//   control family's third input form) survived all three sweeps.
//   Three branches: the HexColorRow swatch (re-picking the element's
//   CURRENT color armed the burst and committed a structurally
//   identical patch — the inert snapshot, the wiped redo, the phantom
//   Unsaved badge, the byte-identical PUT), the HexColorRow empty
//   draft (clearing a junk draft typed into an already-transparent
//   field re-committed the null), and the gradient stop swatch (the
//   position input beside it carries the S104-A patchDiffers guard;
//   the color input never got it). The closure at the component seam
//   protects all six HexColorRow consumers at once.
//
// S105-B — the AI apply truth (A-M2 + A-L5): the apply path committed
//   element patches unguarded (a scale:1 instruction or a repeated
//   identical instruction re-committed identical values — a pushed
//   snapshot, a wiped redo, an unsaved flip, a byte-identical PUT) and
//   overclaimed the footer count (did = true on commit ATTEMPT — "1
//   action(s) performed" over an unchanged canvas, the F78 count-truth
//   violation at the footer whose own doctrine is the honest count).
//   The send path also cleared the draft BEFORE the await — a network
//   failure degraded to a toast and the typed prompt was gone.
//
// S105-C — the four type-alias unexports (A-L1 + B-L3): the F79
//   dead-export class's N−4 shape — SaveState (editor-store), Toast
//   (use-toast), ParsedSession (auth), BoundedJson (validation), all
//   self-consumed only; the S104-I census stopped at editor.ts +
//   ai-assistant.ts.
//
// S105-D — the smalls fold (A-L2 + A-L3 + A-L4 + B-I4 + A-I4 + B-I5):
//   three stale "single selected element" comments contradicting the
//   S60-H widening; the Untitled adoption's raw replaceState
//   interpolation (the F35e two-spellings form); the keyboard-delete
//   includes() residual; resend-otp's missing format regex; the
//   Continue-Working skeleton's 2-in-a-4-grid; the projects route's
//   unbounded ?search=/?template= reads.
//
// S105-E — the scripts fold (B-L1 + B-I3): the reference-audit script
//   could silently produce hollow evidence (no login assert, no
//   non-empty screenshot assertions, no drift exit) — the S104-H
//   fail-loud reached the capture script only; the capture/verify-nav
//   boot lines lack the seven-knob env -u strip the smoke + playwright
//   forms carry.
//
// S105-F — the three stale smoke-port doc rows (B-L2): AGENTS/CLAUDE/
//   PAD still describe the pre-S99-F posture ("only kills standalone/
//   next start") while the script kills next dev AND refuses on a
//   stolen port — the PAD contradicts its own S99-F revision entry.
//
// S105-G — the two documented postures (B-L4 + B-L5): the W/H floor
//   asymmetry between buildElementRow (floor 0) and clampSizeField
//   (floor 1 non-line) with a comment overclaiming the mirror — the
//   A-I4 two-layer bound posture family; the forgot-password timing
//   residual (the known-email branch's fsync-scale delta vs the
//   unknown branch's immediate return) — the B84-I3 documented-
//   residual posture (a scrypt burn would INVERT the signal).
//
// The S105 delivered counts — this file's 24 pins grow the suite
// 1332 -> 1356 unit / 166 -> 167 files (the F68/F70 discipline: the
// constants ride the count family's live anchor — the PAD §7.1
// Unit-total row — so the whole family moves together in the same
// commit).
const UNIT = "1356";
const FILES = "167";

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

const PANEL = src("src/components/editor/properties-panel.tsx");
const EDITOR_VIEW = src("src/components/editor/editor-view.tsx");
const EDITOR_STORE = src("src/components/editor/editor-store.ts");
const USE_TOAST = src("src/hooks/use-toast.ts");
const AUTH_LIB = src("src/lib/auth.ts");
const VALIDATION = src("src/lib/validation.ts");
const AI_PANEL = src("src/components/editor/ai-assistant.tsx");
const DASHBOARD_VIEW = src("src/components/dashboard-view.tsx");
const RECENT_VIEW = src("src/components/recent-view.tsx");
const PROJECTS_ROUTE = src("src/app/api/projects/route.ts");
const RESEND_ROUTE = src("src/app/api/auth/resend-otp/route.ts");
const FORGOT_ROUTE = src("src/app/api/auth/forgot-password/route.ts");
const EDITOR_LIB = src("src/lib/editor.ts");
const AGENTS = src("AGENTS.md");
const CLAUDE = src("CLAUDE.md");
const PAD = src("Project_Architecture_Document.md");

/** The rendered window of a named function component in the panel source. */
function componentWindow(name: string): string {
  const start = PANEL.indexOf(`function ${name}(`);
  expect(start).toBeGreaterThan(-1);
  const next = PANEL.indexOf("\nfunction ", start + 1);
  return PANEL.slice(start, next === -1 ? undefined : next);
}

describe("S105-A the color-swatch no-op commits (A-M1 — the headline, the family's remaining member)", () => {
  it("DEFECT: the HexColorRow swatch carries the color-identity guard around the tick + commit", () => {
    // RED pre-fix: the swatch's onChange read
    // `sliderGesture.textTick(); onChange(event.target.value);` with NO
    // compare — re-picking the SAME color from the native picker (the
    // palette's current swatch, the eyedropper landing on the current
    // color) armed the burst and landed a structurally identical patch.
    // The guard is the COLOR identity the S103-A text branch
    // established, widened to the short-hex-expanded form (a stored
    // 3-digit hex's expanded pick is the same color — the model
    // already carries it): value === null passes (a null→color pick is
    // ALWAYS a real commit), otherwise the case-insensitive expanded
    // compare gates the tick + the commit.
    const w = componentWindow("HexColorRow");
    const swatch = w.match(/type="color"[\s\S]*?\/>/);
    expect(swatch).not.toBeNull();
    expect(swatch![0]).toMatch(/value === null \|\|/);
    expect(swatch![0]).toMatch(/expandShortHex\(value\)/);
    expect(swatch![0]).toMatch(/toUpperCase\(\)/);
    // the guard WRAPS both the tick and the commit (a same-color pick
    // never arms, never commits).
    const guardIdx = swatch![0].indexOf("value === null ||");
    const tickIdx = swatch![0].indexOf("sliderGesture.textTick()");
    const commitIdx = swatch![0].indexOf("onChange(event.target.value)");
    expect(guardIdx).toBeGreaterThan(-1);
    expect(tickIdx).toBeGreaterThan(guardIdx);
    expect(commitIdx).toBeGreaterThan(tickIdx);
  });

  it("DEFECT: the empty-draft clear commits only when the field actually holds a value", () => {
    // RED pre-fix: `if (next === "") { onChange(null); }` — clearing a
    // junk draft typed into an already-TRANSPARENT field (fill/stroke/
    // text-color null) re-committed the null: a pushed snapshot for a
    // structurally identical patch. The value !== null guard makes the
    // clear a real commit only when there is something to clear.
    const w = componentWindow("HexColorRow");
    const emptyIdx = w.indexOf('if (next === "") {');
    expect(emptyIdx).toBeGreaterThan(-1);
    const branch = w.slice(emptyIdx, emptyIdx + 800);
    expect(branch).toMatch(/if \(value !== null\)/);
    expect(branch).toMatch(/onChange\(null\)/);
  });

  it("DEFECT: the gradient stop swatch rides the ONE patchDiffers seam at its own sub-object granularity", () => {
    // RED pre-fix: `sliderGesture.textTick(); setStop(index, { color:
    // event.target.value });` — the position input beside it carries
    // the S104-A patchDiffers guard; the color input never got it.
    const stop = PANEL.match(/aria-label=\{`Stop \$\{index \+ 1\} color`\}[\s\S]*?\/>/);
    expect(stop).not.toBeNull();
    expect(stop![0]).toMatch(/patchDiffers\(stop, \{ color: event\.target\.value \}\)/);
    const guardIdx = stop![0].indexOf("patchDiffers(stop, { color: event.target.value })");
    const tickIdx = stop![0].indexOf("sliderGesture.textTick()");
    const commitIdx = stop![0].indexOf("setStop(index");
    expect(guardIdx).toBeGreaterThan(-1);
    expect(tickIdx).toBeGreaterThan(guardIdx);
    expect(commitIdx).toBeGreaterThan(tickIdx);
  });

  it("SURVIVAL: the S66-B coalescing wiring and the S103-A complete-hex guard stay", () => {
    // GREEN by design post-fix: the guard wraps the tick+commit pair —
    // the burst coalescing (one history entry per picker drag) and
    // the text branch's case-insensitive complete-hex compare are the
    // standing contracts the fix rides ON, not the ones it replaces.
    const w = componentWindow("HexColorRow");
    expect(w).toMatch(/sliderGesture\.textTick\(\)/);
    expect(w).toMatch(/onBlur=\{\(\) => sliderGesture\.finish\("text"\)\}/);
    expect(w).toMatch(/next\.toUpperCase\(\) !== \(value \?\? ""\)\.toUpperCase\(\)/);
    const text = w.match(/type="text"[\s\S]*?\/>/);
    expect(text).not.toBeNull();
    expect(text![0]).not.toMatch(/sliderGesture\./);
  });

  it("SURVIVAL: the S104-A arm/mark split and the number-field guards stay", () => {
    // GREEN by design post-fix: the split (armText + markText, the
    // composition in textTick) and both number-input components'
    // `Number.isFinite(parsed) && parsed !== value` guards are the
    // family's prior members — the swatch closure must not regress
    // them.
    const guards = PANEL.match(/Number\.isFinite\(parsed\) && parsed !== value/g);
    expect(guards?.length).toBe(2);
    expect(PANEL).toMatch(/const armText = \(surface: string = "text"\) => \{/);
    expect(PANEL).toMatch(/const markText = \(\) => \{/);
    expect(PANEL).toMatch(/function guardedUpdate\(/);
  });

  it("DEFECT: the panel's patchDiffers census grows to NINE (the stop swatch joins)", () => {
    // RED pre-fix: the census reads EIGHT (the S102-E five + the S103-A
    // gradient-stop button + the guardedUpdate helper + the stop
    // position) — the stop COLOR input is the ninth consumer.
    const guarded = PANEL.match(/patchDiffers\(/g);
    expect(guarded?.length).toBe(9);
  });
});

// ---------------------------------------------------------------------------

describe("S105-B the AI apply truth + the draft restore (A-M2 + A-L5)", () => {
  function updateBranch(): string {
    const start = AI_PANEL.indexOf('operation.op === "update"');
    expect(start).toBeGreaterThan(-1);
    const end = AI_PANEL.indexOf('operation.op === "delete"');
    return AI_PANEL.slice(start, end);
  }

  it("DEFECT: the update half computes the per-target patchDiffers truth over the LIVE elements before committing", () => {
    // RED pre-fix: `store.updateElements(targets, patch, …)` ran
    // unconditionally and `did = true` was set on COMMIT ATTEMPT — a
    // repeated identical instruction re-committed identical values and
    // the reply footer overclaimed ("1 action(s) performed" over an
    // unchanged canvas — the F78 violation at the footer whose own
    // doctrine is the honest count).
    const branch = updateBranch();
    expect(branch).toMatch(/patchDiffers\(/);
    const truthIdx = branch.indexOf("patchDiffers(");
    const commitIdx = branch.indexOf("store.updateElements(targets");
    expect(truthIdx).toBeGreaterThan(-1);
    expect(commitIdx).toBeGreaterThan(truthIdx);
    // the truth reads the LIVE store (the per-operation re-read
    // doctrine, S61-E)
    expect(branch).toMatch(/useEditorStore\.getState\(\)\.elements/);
  });

  it("DEFECT: the scale half computes the product compare through the shared clampSizeField seam", () => {
    // RED pre-fix: `store.scaleElements(targets, operation.patch.scale,
    // …)` ran unconditionally — a scale:1 instruction (the identity
    // factor) re-committed byte-identical widths/heights with a pushed
    // snapshot and an unsaved flip. The products compare through the
    // S86-B seam the store itself rides.
    const branch = updateBranch();
    expect(branch).toMatch(/clampSizeField\(/);
    const compareIdx = branch.indexOf("clampSizeField(");
    const commitIdx = branch.indexOf("store.scaleElements(targets");
    expect(compareIdx).toBeGreaterThan(-1);
    expect(commitIdx).toBeGreaterThan(compareIdx);
  });

  it("SURVIVAL: the S57-E did-flag shape and the scale-before-update order stay", () => {
    // GREEN by design post-fix: the truth-report sets the same
    // did-flag the S57-E pins hold — both halves guarded, ONE
    // conditional increment, scale before update, no early exit
    // between them.
    const branch = updateBranch();
    expect(branch).toMatch(/let did = false/);
    expect(branch).toMatch(/if \(did\) applied \+= 1/);
    const increments = branch.match(/applied \+= 1/g) ?? [];
    expect(increments.length).toBe(1);
    const scaleIdx = branch.indexOf("scaleElements(targets");
    const updateIdx = branch.indexOf("store.updateElements(targets");
    expect(scaleIdx).toBeGreaterThan(-1);
    expect(updateIdx).toBeGreaterThan(scaleIdx);
    const between = branch.slice(scaleIdx, updateIdx);
    expect(between).not.toMatch(/\bcontinue\b/);
  });

  it("DEFECT: the send path restores the draft on failure (the network-error edge keeps the operator's words)", () => {
    // RED pre-fix: `setInput("")` fired BEFORE the await; the catch
    // degraded to a toast and the typed prompt was gone — a
    // draft-loss on a main-flow failure edge in a panel whose own
    // doctrine is "a dead control that lies is a documented bug
    // class".
    const sendIdx = AI_PANEL.indexOf("async function send(text: string) {");
    expect(sendIdx).toBeGreaterThan(-1);
    const catchIdx = AI_PANEL.indexOf("} catch {", sendIdx);
    expect(catchIdx).toBeGreaterThan(-1);
    const finallyIdx = AI_PANEL.indexOf("} finally {", sendIdx);
    expect(finallyIdx).toBeGreaterThan(catchIdx);
    const catchBody = AI_PANEL.slice(catchIdx, finallyIdx);
    expect(catchBody).toMatch(/setInput\(message\)/);
  });
});

// ---------------------------------------------------------------------------

describe("S105-C the four type-alias unexports (A-L1 + B-L3 — the F79 N−4 shape)", () => {
  it("DEFECT: the two client type aliases are no longer exported", () => {
    // RED pre-fix: `export type SaveState = …` (editor-store.ts:31)
    // and `export type Toast = { … }` (use-toast.ts:12) — zero
    // external importers (the store's own EditorStore.saveState member
    // and the module's value exports are the only consumers).
    expect(EDITOR_STORE).not.toMatch(/export type SaveState/);
    expect(EDITOR_STORE).toMatch(/type SaveState = /);
    expect(USE_TOAST).not.toMatch(/export type Toast/);
    expect(USE_TOAST).toMatch(/type Toast = \{/);
  });

  it("DEFECT: the two server type aliases are no longer exported", () => {
    // RED pre-fix: `export type ParsedSession = { … }` (auth.ts:58)
    // and `export type BoundedJson = …` (validation.ts:184) — both
    // self-consumed solely as return annotations of parseSessionToken
    // and readBoundedJson; the S104-I census stopped at three members.
    expect(AUTH_LIB).not.toMatch(/export type ParsedSession/);
    expect(AUTH_LIB).toMatch(/type ParsedSession = \{/);
    expect(VALIDATION).not.toMatch(/export type BoundedJson/);
    expect(VALIDATION).toMatch(/type BoundedJson/);
  });
});

// ---------------------------------------------------------------------------

describe("S105-D the smalls fold (A-L2 + A-L3 + A-L4 + B-I4 + A-I4 + B-I5)", () => {
  it("DEFECT: the three chip comments re-anchor onto the S60-H widening (any non-empty selection)", () => {
    // RED pre-fix: editor-view.tsx:1072-1074, :1217-1219, and :1949
    // still said "single selected element" while the S60-H record at
    // :1093-1100 documents the widening — the 1072 block contradicted
    // its own later note.
    const first = EDITOR_VIEW.indexOf("the chip renders for ANY NON-EMPTY selection");
    expect(first).toBeGreaterThan(-1);
    const w1 = EDITOR_VIEW.slice(first, first + 260);
    expect(w1).not.toMatch(/single selected\s*element/);
    expect(w1).toMatch(/non-empty selection/i);
    const second = EDITOR_VIEW.indexOf("Edit-properties chip renders exactly when");
    expect(second).toBeGreaterThan(-1);
    const w2 = EDITOR_VIEW.slice(second, second + 300);
    expect(w2).toMatch(/NON-EMPTY selection/);
    expect(w2).not.toMatch(/exactly when a SINGLE element/);
    const third = EDITOR_VIEW.indexOf("for any single selected element. See");
    expect(third).toBe(-1);
    const thirdAnchor = EDITOR_VIEW.indexOf("MobilePropertiesEditor.", second);
    const w3 = EDITOR_VIEW.slice(Math.max(0, thirdAnchor - 400), thirdAnchor);
    expect(w3).not.toMatch(/any single selected element/);
  });

  it("DEFECT: the Untitled adoption's replaceState encodes the id (the S99-E uniformity)", () => {
    // RED pre-fix: `/Editor?projectId=${id}` interpolated raw while
    // both sibling id-consuming sites encode — the F35e two-spellings
    // form the S99-E fix claimed to close.
    expect(EDITOR_VIEW).toMatch(/projectId=\$\{encodeURIComponent\(id\)\}/);
    expect(EDITOR_VIEW).not.toMatch(/projectId=\$\{id\}/);
  });

  it("DEFECT: the keyboard-delete membership scan rides the Set form (the S74-B family)", () => {
    // RED pre-fix: `store.selectedIds.includes(el.id)` inside the
    // filter — the O(n·m) scan the canvas/panel/reorder sweeps
    // retired, at Delete/Backspace frequency.
    const setIdx = EDITOR_VIEW.indexOf("const selectedIdSet = new Set(store.selectedIds)");
    expect(setIdx).toBeGreaterThan(-1);
    const w = EDITOR_VIEW.slice(setIdx, setIdx + 400);
    expect(w).toMatch(/new Set\(store\.selectedIds\)/);
    expect(w).toMatch(/selectedIdSet\.has\(el\.id\)/);
    expect(w).toMatch(/const unlockedIds = store\.elements/);
    const delIdx = EDITOR_VIEW.indexOf("const unlockedIds = store.elements");
    const narrow = EDITOR_VIEW.slice(delIdx, delIdx + 300);
    expect(narrow).not.toMatch(/selectedIds\.includes/);
  });

  it("DEFECT: resend-otp carries the format regex its siblings run, AFTER the length cap (the family order)", () => {
    // RED pre-fix: presence-only (`if (!email)`) after the 200-length
    // cap; every sibling (register, forgot-password, members) runs
    // length-first then the regex — behaviorally identical (a
    // malformed email misses findUnique and answers the same
    // byte-identical 400), a pure short-circuit form fold.
    const capIdx = RESEND_ROUTE.indexOf("email.length > 200");
    expect(capIdx).toBeGreaterThan(-1);
    const regexIdx = RESEND_ROUTE.indexOf("@[^\\s@]+\\.[^\\s@]+$");
    expect(regexIdx).toBeGreaterThan(capIdx);
    const branch = RESEND_ROUTE.slice(regexIdx, regexIdx + 200);
    expect(branch).toMatch(/Enter a valid email address/);
  });

  it("DEFECT: the Continue-Working skeleton renders four placeholders (Recent's form)", () => {
    // RED pre-fix: `Array.from({ length: 2 })` in the lg:grid-cols-4 —
    // Recent's own loading skeleton renders 4; the dashboard's
    // Continue section renders 4 real cards.
    const contIdx = DASHBOARD_VIEW.indexOf('id="continue-working"');
    expect(contIdx).toBeGreaterThan(-1);
    const w = DASHBOARD_VIEW.slice(contIdx, contIdx + 2000);
    const skeleton = w.match(/Array\.from\(\{ length: (\d+) \}\)/);
    expect(skeleton).not.toBeNull();
    expect(skeleton![1]).toBe("4");
    // Recent's skeleton stays four.
    const recSkeleton = RECENT_VIEW.match(/Array\.from\(\{ length: (\d+) \}\)/);
    expect(recSkeleton).not.toBeNull();
    expect(recSkeleton![1]).toBe("4");
  });

  it("DEFECT: the projects route's query reads are bounded (the S62-G body-field family's query-string sibling)", () => {
    // RED pre-fix: `searchParams.get("search")?.trim()` fed the
    // `contains` filter with no cap — a megabyte-scale pattern rides
    // the SQLite LIKE; names cap at 80, so 200 bounds every legitimate
    // search. The reads ride the ONE clampText seam (the S71-D fold —
    // never a bare trim().slice() twin, the S99-D doctrine); the
    // template sibling rides the same form (the pair).
    const reads = PROJECTS_ROUTE.match(
      /clampText\(request\.nextUrl\.searchParams\.get\("(?:search|template)"\), 200\)/g,
    );
    expect(reads?.length).toBe(2);
    expect(PROJECTS_ROUTE).not.toMatch(
      /searchParams\.get\("(?:search|template)"\)\?\.trim\(\)/,
    );
  });
});

// ---------------------------------------------------------------------------

describe("S105-E the scripts fold (B-L1 + B-I3)", () => {
  it("DEFECT: the reference-audit script is fail-loud — the login assert + the shot() non-empty discipline", () => {
    // RED pre-fix: the script echoed every datum and wrote 5
    // screenshots but asserted nothing and could not fail — a failed
    // login (the timing form the 81st audit demonstrated live) yields
    // datums measured on the login page; the S104-H shot() reached
    // the capture script only.
    const script = path.join(ROOT, "scripts", "ref-audit-s105.sh");
    expect(existsSync(script)).toBe(true);
    const text = readFileSync(script, "utf8");
    // the login assertion: the post-login URL must not sit on the
    // login path (the failed-login form the first 81st-audit run hit).
    expect(text).toMatch(/case "\$URL0" in/);
    expect(text).toMatch(/\*"\/login"\*\)/);
    expect(text).toMatch(/exit 1/);
    // the shot() discipline: every capture write asserts non-empty.
    const shotStart = text.indexOf("shot() {");
    expect(shotStart).toBeGreaterThan(-1);
    const shotEnd = text.indexOf("\n}", shotStart);
    const shotBody = text.slice(shotStart, shotEnd);
    expect(shotBody).toMatch(/\[ -s /);
    expect(shotBody).toMatch(/exit 1/);
  });

  it("DEFECT: the standing datum pins exit non-zero on drift + the verify-nav boot line joins the env -u family", () => {
    // RED pre-fix: the nav/clip datums were echo-only — the operator
    // eyeballed them; the byte-identical-42-sessions forms are pinned
    // fail-loud now (the greeting/stats stay echoes: the time bucket
    // and board state are computed datums, not drift).
    const refScript = readFileSync(path.join(ROOT, "scripts", "ref-audit-s105.sh"), "utf8");
    expect(refScript).toMatch(/DRIFT/);
    expect(refScript).toMatch(/124x36/);
    expect(refScript).toMatch(/Share:L385-R458/);
    // the verify-nav boot line: the seven-knob strip the smoke +
    // playwright forms carry.
    const navScript = readFileSync(path.join(ROOT, "scripts", "verify-nav-s105.sh"), "utf8");
    expect(navScript).toMatch(/env -u DIGMA_PROXY_HOPS/);
    expect(navScript).toMatch(/-u DIGMA_SITE_URL -u HOSTNAME -u KEEP_ALIVE_TIMEOUT/);
  });
});

// ---------------------------------------------------------------------------

describe("S105-F the three stale smoke-port rows (B-L2)", () => {
  it("DEFECT: AGENTS + CLAUDE + PAD describe the post-S99-F mechanism (the kill trio + the REFUSED refusal)", () => {
    // RED pre-fix: all three sites claimed "only kills
    // standalone/server.js / next start — a lingering next dev steals
    // :3000" while the script kills next dev AND refuses when anything
    // still answers the port; the PAD row contradicted its own S99-F
    // revision entry.
    const agentsGate = AGENTS.slice(
      AGENTS.indexOf("Gate order before every push"),
      AGENTS.indexOf("Gate order before every push") + 4200,
    );
    expect(agentsGate).not.toMatch(/only kills `standalone\/server\.js`\/`next start`/);
    const claudeSmoke = CLAUDE.slice(
      CLAUDE.indexOf("Smoke Tests"),
      CLAUDE.indexOf("Smoke Tests") + 2000,
    );
    expect(claudeSmoke).not.toMatch(/only kills standalone\/`next start`/);
    const padIdx = PAD.indexOf("The smoke suite boots its own standalone server");
    expect(padIdx).toBeGreaterThan(-1);
    const padRow = PAD.slice(padIdx, padIdx + 600);
    expect(padRow).toMatch(/kill trio|kills? `?next dev`?/i);
  });
});

// ---------------------------------------------------------------------------

describe("S105-G the two documented postures (B-L4 + B-L5)", () => {
  it("DEFECT: the clampSizeField doc block names the deliberate floor split (the two-layer bound posture)", () => {
    // RED pre-fix: the S84-B block claimed the helpers "mirror the
    // server's bounds at the consumer" while buildElementRow floors
    // W/H at 0 for every type and clampSizeField floors at 1 for every
    // non-line — the mirror claim overstates; the A-I4 two-layer
    // posture family documents the deliberate split instead.
    const mirrorIdx = EDITOR_LIB.indexOf("mirror the server's bounds");
    expect(mirrorIdx).toBe(-1);
    const fnIdx = EDITOR_LIB.indexOf("export function clampSizeField");
    expect(fnIdx).toBeGreaterThan(-1);
    const docWindow = EDITOR_LIB.slice(Math.max(0, fnIdx - 1200), fnIdx);
    expect(docWindow).toMatch(/two-layer/i);
    expect(docWindow).toMatch(/storage/i);
  });

  it("DEFECT: the forgot-password route documents the timing residual beside the S72-C precedent", () => {
    // RED pre-fix: the known-email branch performs randomBytes + a
    // SQLite update (fsync) before answering while the unknown-email
    // branch returns immediately — the body is byte-identical, the
    // latency is not. A naive scrypt burn would INVERT the signal
    // (scryptSync ~100ms dwarfs the fsync-scale delta); register's 409
    // enumerates by design; the route is rate-limited — the B84-I3
    // documented-residual posture.
    const head = FORGOT_ROUTE.slice(0, 5500);
    expect(head).toMatch(/timing/i);
    expect(head).toMatch(/S72-C|equalizer/i);
  });
});

// ---------------------------------------------------------------------------

describe("the S105 delivered counts (the count family's live anchor)", () => {
  it("LIVE ANCHOR: the delivered constants equal the PAD §7.1 Unit-total row (the family moves together)", () => {
    // RED pre-fix by construction: the §7.1 row still reads the S104
    // delivery's 1332 / 166 files until the S105-H docs pass re-anchors
    // it to this file's grown totals (1356 / 167). The count family's
    // forcing function: the spec's constants and the PAD row must agree
    // in the same commit (the F68/F70 discipline).
    const padFiles = PAD.match(/\| \*\*Unit total\*\* \| \*\*(\d+) files\*\*/)?.[1];
    const padTests = PAD.match(
      /\| \*\*Unit total\*\* \| \*\*\d+ files\*\* \| \*\*(\d+)\*\*/,
    )?.[1];
    expect(FILES).toBe(padFiles);
    expect(UNIT).toBe(padTests);
    expect(AGENTS).toContain(`(${UNIT} checks)`);
    expect(AGENTS).toContain(`${FILES} files`);
  });
});
