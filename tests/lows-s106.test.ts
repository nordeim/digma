import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-106 spec (the fifty-fourth audit's chosen work):
//
// S106-A — the image-upload no-op commits (A-M1, the headline): the
//   F90/F92 doctrine closed the no-op commit family across the
//   click/select, text, number, and color-picker modalities — but the
//   FILE-INPUT channel lived outside the control census entirely, and
//   its re-fire affordance is deliberate (the hidden input's
//   value reset allows the SAME file to re-fire onChange; the
//   dropzone feeds the same reader). Re-uploading the element's
//   CURRENT image re-committed a structurally identical patch — the
//   inert snapshot, the wiped redo, the phantom Unsaved badge, and a
//   ~500 KB full-list PUT re-run for nothing (the family's heaviest
//   payload). Both branches (the downscale success AND the
//   decode-failure fallback) now ride ONE guard through a shared
//   commit helper, the patch compared WHOLE (the fill-paint
//   precedence doctrine makes { fillImage, fillGradient: null,
//   fillImageFit: null } a unit, not three fields).
//
// S106-B — the AI HTTP-error draft restore (A-L1): the S105-B
//   closure restored the draft on the NETWORK failure only; the
//   !response.ok early return (a 500, a 429 rate-limit, a 400)
//   toasted "Please try again" and lost the typed prompt — the same
//   draft-loss class, one branch over. The branch now restores the
//   draft beside the toast (the scope-refusal branch stays exempt:
//   the prompt may not apply to a changed canvas).
//
// S106-C — the id-encoding fold (A-L2): the S99-E/S105-D "uniformity"
//   comments claimed every sibling id-consuming site encodes — while
//   17 raw ${...} interpolations survived (4 navigation + 13 fetch,
//   three inside editor-view.tsx itself). Zero functional risk on
//   URL-safe cuids, but the F35e two-spellings drift hazard lived
//   precisely where the doctrine claimed closure. All 17 sites fold
//   onto the encodeURIComponent form (the honest uniformity).
//
// S106-D — the smalls fold: the gradient apply clears fillImageFit
//   (the S78-D sibling-clearing completion — the Solid tab clears
//   four fill fields, the upload three, the gradient path cleared
//   only one); verify-otp gains the email-format regex its five
//   siblings carry (the S98-A/S105-D order family's missed sibling —
//   behaviorally identical, the pure short-circuit form); the
//   session-105 record's two count rows re-anchor (1332/166 not
//   1332/165; twelve number-field consumers + the Content text
//   guard, not "thirteen number-field consumers" — the tree carries
//   12 NumberField/GuardedNumberInput JSX sites); the verify-nav s106
//   header enumerates the class-A guard as the ninth check (the
//   N−1 enumeration a future editor could silently break).
//
// The S106 delivered counts — this file's 13 pins grow the suite
// 1356 -> 1369 unit / 167 -> 168 files (the F68/F70 discipline: the
// constants ride the count family's live anchor — the PAD §7.1
// Unit-total row — so the whole family moves together in the same
// commit).
const UNIT = "1392";
const FILES = "170";

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

const PANEL = src("src/components/editor/properties-panel.tsx");
const EDITOR_VIEW = src("src/components/editor/editor-view.tsx");
const AI_PANEL = src("src/components/editor/ai-assistant.tsx");
const PROJECT_CARD = src("src/components/project-card.tsx");
const RECENT_VIEW = src("src/components/recent-view.tsx");
const DASHBOARD_VIEW = src("src/components/dashboard-view.tsx");
const TEAMS_VIEW = src("src/components/teams-view.tsx");
const VERIFY_ROUTE = src("src/app/api/auth/verify-otp/route.ts");
const SESSION_174 = src("docs/session_174.md");
const PLAN_105 = src("docs/remediation-plan-session105.md");
const NAV_SCRIPT = src("scripts/verify-nav-s106.sh");

/** The rendered window of a named function component in the panel source. */
function componentWindow(name: string): string {
  const start = PANEL.indexOf(`function ${name}(`);
  expect(start).toBeGreaterThan(-1);
  const next = PANEL.indexOf("\nfunction ", start + 1);
  return PANEL.slice(start, next === -1 ? undefined : next);
}

describe("S106-A the image-upload no-op commits (A-M1 — the headline, the family's file-input member)", () => {
  it("DEFECT: both upload branches ride ONE guarded commit helper (the patch compared whole)", () => {
    // RED pre-fix: the downscale continuation read
    // `.then((stored) => { setBusy(false); update({ fillImage: stored,
    // fillGradient: null, fillImageFit: null }); })` with a raw-update
    // `.catch(() => { ... update({ fillImage: dataUrl, ... }); })` —
    // NO compare on either branch. The shared commitUpload helper
    // carries the ONE guard: the patch is built as a unit and compared
    // against the element through the same patchDiffers seam the
    // S102-E/S103-A/S104-A/S105-A closures ride.
    const w = componentWindow("ImagePanel");
    const helper = w.match(/const commitUpload = \(fillImage: string\) => \{[\s\S]*?\n  \};/);
    expect(helper).not.toBeNull();
    expect(helper![0]).toMatch(/setBusy\(false\)/);
    // Session 107 (S107-A — a legitimate contract update): the guard's
    // compare target moved from the render-time `element` prop to the
    // LIVE store-derived element (`const live = useEditorStore
    // .getState().elements.find(…) ?? element` — the fifty-fifth
    // audit's A-I1: the async FileReader window made the stale-prop
    // compare evaluate its truth against the past). The guard still
    // precedes the update; the seam call itself is unchanged.
    const guardIdx = helper![0].indexOf("patchDiffers(live, patch)");
    const updateIdx = helper![0].indexOf("update(patch)");
    expect(guardIdx).toBeGreaterThan(-1);
    expect(updateIdx).toBeGreaterThan(guardIdx);
    // the patch is the WHOLE sibling-clearing unit (the fill-paint
    // precedence doctrine — not three independent fields).
    expect(helper![0]).toMatch(/const patch = \{ fillImage, fillGradient: null, fillImageFit: null \};/);
  });

  it("DEFECT: the downscale success AND the decode-failure fallback both route through the helper", () => {
    // RED pre-fix: neither branch routed through a guarded path. Both
    // must call commitUpload — the success with the (possibly shrunk)
    // stored bytes, the fallback with the original data URL (the
    // upload's own degrade contract: a failed decode never breaks the
    // fill).
    const w = componentWindow("ImagePanel");
    expect(w).toMatch(/\.then\(\(stored\) => commitUpload\(stored\)\)/);
    expect(w).toMatch(/\.catch\(\(\) => commitUpload\(dataUrl\)\)/);
    // no surviving raw update() inside the continuation itself.
    const cont = w.match(/downscaleDataUrl\(dataUrl\)[\s\S]*?\}\);/);
    expect(cont).not.toBeNull();
    expect(cont![0]).not.toMatch(/update\(\{/);
  });

  it("DEFECT: the panel's patchDiffers census grows to TEN (the upload seam joins)", () => {
    // RED pre-fix: the census reads NINE (the S102-E five + the S103-A
    // gradient-stop button + the guardedUpdate helper + the stop
    // position + the S105-A stop color) — the upload commit is the
    // tenth consumer.
    const guarded = PANEL.match(/patchDiffers\(/g);
    expect(guarded?.length).toBe(10);
  });

  it("SURVIVAL: the upload's own contracts stay (the cap, the whitelist, the busy gate)", () => {
    // GREEN by design post-fix: the guard wraps the commit only — the
    // upload's size cap (500 KB), the format whitelist, and the
    // busy-flag re-entry gate are the standing contracts the fix
    // rides ON, not the ones it replaces.
    const w = componentWindow("ImagePanel");
    expect(w).toMatch(/500 \* 1024/);
    // the whitelist is itself a regex literal in the source — the pin
    // matches its written form (the escaped slash and plus).
    expect(w).toMatch(/data:image\\\/\(png\|jpe\?g\|gif\|svg\\\+xml\|webp\);base64,/);
    expect(w).toMatch(/if \(!file \|\| busy\) return;/);
    expect(w).toMatch(/reader\.onerror/);
  });
});

describe("S106-B the AI HTTP-error draft restore (A-L1 — the S105-B closure's missed branch)", () => {
  it("DEFECT: the !response.ok branch restores the draft beside the toast", () => {
    // RED pre-fix: the branch read
    // `if (!response.ok || !body?.ok) { toast.error(...); return; }` —
    // the network catch restored the draft (S105-B) but a 500/429/400
    // lost it: the toast said "Please try again" and the operator
    // retyped from memory. The restore lands BEFORE the return.
    const idx = AI_PANEL.indexOf("if (!response.ok || !body?.ok) {");
    expect(idx).toBeGreaterThan(-1);
    // the comment block documents the S105-B/S106-B lineage — the
    // window must span it to reach the restore + the return.
    const branch = AI_PANEL.slice(idx, idx + 800);
    expect(branch).toMatch(/toast\.error\("Assistant unavailable"/);
    const restoreIdx = branch.indexOf("setInput(message)");
    const returnIdx = branch.indexOf("return;");
    expect(restoreIdx).toBeGreaterThan(-1);
    expect(returnIdx).toBeGreaterThan(restoreIdx);
  });

  it("SURVIVAL: the network catch restore + the sending-flag finally stay", () => {
    // GREEN by design post-fix: the S105-B catch contract and the
    // S59-H finally are the standing forms the branch restore joins.
    const sendIdx = AI_PANEL.indexOf("async function send(text: string) {");
    expect(sendIdx).toBeGreaterThan(-1);
    const catchIdx = AI_PANEL.indexOf("} catch {", sendIdx);
    const finallyIdx = AI_PANEL.indexOf("} finally {", sendIdx);
    expect(catchIdx).toBeGreaterThan(-1);
    expect(finallyIdx).toBeGreaterThan(catchIdx);
    const catchBody = AI_PANEL.slice(catchIdx, finallyIdx);
    expect(catchBody).toMatch(/setInput\(message\)/);
    expect(AI_PANEL.slice(finallyIdx, finallyIdx + 120)).toMatch(/setSending\(false\)/);
  });
});

describe("S106-C the id-encoding fold (A-L2 — the honest uniformity)", () => {
  it("DEFECT: every /Editor?projectId= interpolation encodes (the four navigation sites)", () => {
    // RED pre-fix: project-card:399, recent-view:125/:184, and
    // dashboard-view:106 interpolated the id raw while the S99-E/
    // S105-D comments claimed "every sibling id-consuming site"
    // encodes. Zero behavior change on URL-safe cuids; the fold makes
    // the uniformity claim TRUE.
    const views = [
      ["project-card", PROJECT_CARD],
      ["recent-view", RECENT_VIEW],
      ["dashboard-view", DASHBOARD_VIEW],
      ["teams-view", TEAMS_VIEW],
      ["editor-view", EDITOR_VIEW],
    ] as const;
    for (const [name, body] of views) {
      const raw = body.match(/\/Editor\?projectId=\$\{(?!encodeURIComponent)/g);
      expect(raw, `${name} carries raw /Editor?projectId=$\{ interpolations`).toBeNull();
    }
  });

  it("DEFECT: every API-path id interpolation encodes (the fetch sites)", () => {
    // RED pre-fix: 11 fetch paths across the five files interpolated
    // the id raw (`/api/projects/${project.id}`, `/api/teams/${team.id}`,
    // `/api/projects/${projectId}/elements` ×3) while editor-view's
    // own S99-E site encoded. All fold onto the one form.
    const views = [
      ["project-card", PROJECT_CARD],
      ["recent-view", RECENT_VIEW],
      ["dashboard-view", DASHBOARD_VIEW],
      ["teams-view", TEAMS_VIEW],
      ["editor-view", EDITOR_VIEW],
    ] as const;
    for (const [name, body] of views) {
      const raw = body.match(/\/api\/(?:projects|teams)\/\$\{(?!encodeURIComponent)/g);
      expect(raw, `${name} carries raw /api/{projects,teams}/$\{ interpolations`).toBeNull();
    }
  });
});

describe("S106-D the smalls fold (A-I1 + B-I1 + A-L3 + B-L1 + B-I2)", () => {
  it("DEFECT: the gradient apply clears fillImageFit (the sibling-clearing completion)", () => {
    // RED pre-fix: `update({ fillGradient: JSON.stringify(next),
    // fillImage: null })` — the Solid tab clears four fill fields, the
    // upload path three, the gradient path cleared only one. Zero
    // paint-time impact (the fit renders only under a live fillImage)
    // — the stored-data hygiene the S78-D doctrine owns.
    expect(PANEL).toMatch(
      /update\(\{ fillGradient: JSON\.stringify\(next\), fillImage: null, fillImageFit: null \}\)/,
    );
  });

  it("DEFECT: verify-otp runs the email-format regex its five siblings carry", () => {
    // RED pre-fix: presence-only `if (!email || !/^\d{6}$/.test(code))`
    // before findUnique — register, forgot-password, resend-otp, teams
    // POST, and members POST all run length-first then the format
    // regex. Behaviorally identical (the miss answers the byte-
    // identical 400); the pure short-circuit form fold.
    expect(VERIFY_ROUTE).toContain("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    // the order stays: the length cap BEFORE the format regex (the
    // family's contract since S104-E).
    const capIdx = VERIFY_ROUTE.indexOf("email.length > 200");
    const regexIdx = VERIFY_ROUTE.indexOf("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    expect(capIdx).toBeGreaterThan(-1);
    expect(regexIdx).toBeGreaterThan(capIdx);
  });

  it("DEFECT: the session-105 log's baseline row says 1332/166 (not 165)", () => {
    // RED pre-fix: docs/session_174.md:7 read "1332/165 单测" — every
    // sibling record of the same baseline (the same file's line 9,
    // session_173, the worklog, the remediation plan) says 166 files.
    // The F78 doc-truth family's one-digit typo.
    expect(SESSION_174).toContain("1332/166");
    expect(SESSION_174).not.toContain("1332/165");
  });

  it("DEFECT: the session-105 record says twelve number-field consumers + the Content text guard", () => {
    // RED pre-fix: remediation-plan-session105.md claimed "the thirteen
    // number-field consumers" — the live tree carries TWELVE
    // NumberField/GuardedNumberInput JSX sites (X, Y, W, H, Font Size,
    // the four corner radii, Rotation, Opacity, the gradient stop
    // position); the thirteenth guard is the Content input's TYPING
    // guard — a text input, not a number field. The S101-B
    // count-falsified-by-grep class.
    expect(PLAN_105).not.toContain("thirteen number-field consumers");
    expect(PLAN_105).toContain("twelve number-field consumers");
  });

  it("DEFECT: the verify-nav s106 header enumerates the class-A guard (the ninth check named)", () => {
    // RED pre-fix: the header said "The 9 checks:" then enumerated
    // only 8 — the class-A guard (the ninth ok() site) was described
    // in a separate sentence ("boundary. The Tailwind v4 failure
    // class A ... must NOT be present") but never joined the counted
    // list. The fix's form: the list CONTINUES through "boundary, and"
    // onto the guard itself (a comma-continued enumeration, not a new
    // sentence). A future editor deleting the un-enumerated check
    // would leave the "9" wrong with nothing catching it.
    expect(NAV_SCRIPT).toMatch(/The 9 checks:/);
    expect(NAV_SCRIPT).toMatch(/boundary, and[\s\S]{0,120}Tailwind v4 class-A guard/);
  });
});
