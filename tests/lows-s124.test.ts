import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-124 spec (the seventy-second audit's chosen work):
//
// S124-A — THE TRANSACTION-ABORT ENVELOPE FAMILY'S COMPLETION (B124-L1,
//   the headline): ten bare-write route sites carried P2025-only
//   catches (or none) — a P2024 (pool-wait) or P2028 (transaction-
//   timeout) abort rethrew past the envelope as an unstructured 500,
//   exactly the no-bare-throw discipline (S56-H) the routes' own
//   comments enforce, on the family's own members the S77-G/S78-B
//   registration claimed closed. The closure: the family arm
//   (P2024/P2028 -> the structured 503 UNAVAILABLE envelope with the
//   human copy) joins every site — login, resend-otp, forgot-password
//   (the else-throw composition), verify-otp (the write window
//   wrapped — both updateManys + the re-select), reset-password (the
//   conditional updateMany), projects/[id] PATCH + DELETE, teams/[id]
//   PATCH + DELETE — each route's standing P2025 arm preserved
//   verbatim (the auth family's 404, the resource family's 404, the
//   forgot-password swallow-to-200).
//
// S124-B — THE HEADER UNDO/REDO POINTER ARMS' GESTURE STAND-DOWN
//   (A124-I1): the S123-A closure reached the keyboard arms only —
//   the pointer twins (the header buttons' onClick) dispatched with
//   no stand-down, so a mid-drag click on the header Undo popped a
//   past entry whose redo the still-live drag's ticks then committed
//   over (history-free, on the UNDONE base), and the terminal
//   endGesture's future:[] destroyed the redo the undo just created —
//   the A120-L1/A123-L1 symptom family through the POINTER modality.
//   The closure: the keyboard form's mirror — capture the store,
//   stand down through a live gesture, then dispatch. The button
//   stays enabled through the window (the honest refusal is the
//   dropped click, never a disabled control that flickers per-drag).
//
// S124-C — THE FULL-ROW REGISTRATION AT THE LIST GET SEAM (B124-I2):
//   the elements list GET's honest API-surface note (S76-F) never
//   registered the projection asymmetry — every sibling list-family
//   route rides the THUMBNAIL_ELEMENT_SELECT projection (S70-D/
//   S113-D), this route alone ships FULL rows by design (the
//   API-consumer contract needs the unsanitized element payload),
//   with the worst-case aggregate ~25 MB at ELEMENT_LIMIT (the
//   S117-A arithmetic) inside the 32 MB body-cap family. A
//   registration, not a behavior change.
//
// S124-D — THE THREE-SITE ADR CITATION RE-ANCHOR (B124-I3): three
//   comments cited an "inherited architecture" ADR registry this repo
//   never carried — api.ts's "ADR-006", rate-limit.ts's and
//   rate-limit.test.ts's "ADR-009" — while the PAD's OWN ADR-006 is
//   the AI-assistant degrade decision and ADR-009 the Untitled
//   editor: a reader following either citation landed on an
//   unrelated decision. The re-anchor: the envelope cites the PAD §3
//   Application Architecture convention; the limiter cites the PAD §6
//   Security Architecture row. The s83/s97 pin phrases survive
//   verbatim.
//
// The script family (the S118-C convention, s124 form): the s124
//   parity scripts ride their OWN tokens (live124 / nav124 /
//   digma-seo-s124.log, the 100th audit / 101st session / 61st clip
//   ordinals, the S123 delivery at HEAD 81a9190), never the frozen
//   s123 forms.

const editorViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const propertiesPanelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const loginSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/login/route.ts"),
  "utf8",
);
const resendOtpSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/resend-otp/route.ts"),
  "utf8",
);
const forgotPasswordSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/forgot-password/route.ts"),
  "utf8",
);
const verifyOtpSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/verify-otp/route.ts"),
  "utf8",
);
const resetPasswordSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/reset-password/route.ts"),
  "utf8",
);
const projectsIdSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/route.ts"),
  "utf8",
);
const teamsIdSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/teams/[id]/route.ts"),
  "utf8",
);
const elementsRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
  "utf8",
);
const apiSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/api.ts"),
  "utf8",
);
const rateLimitSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/rate-limit.ts"),
  "utf8",
);
const rateLimitTestSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/rate-limit.test.ts"),
  "utf8",
);
const nav124Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s124.sh"),
  "utf8",
);
const refAudit124Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s124.sh"),
  "utf8",
);
const seo124Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s124.sh"),
  "utf8",
);

/** The family arm — the S77-G form reaching the singleton-write
 * siblings: P2024 (pool-wait) / P2028 (transaction-timeout) answering
 * the structured 503 UNAVAILABLE envelope. */
const FAMILY_ARM = /\(error\.code === "P2024" \|\| error\.code === "P2028"\)/;
const UNAVAILABLE_503 =
  /fail\("UNAVAILABLE", "[^"]*database timed out[^"]*", 503\)/;

/** The header button region — the slice around each aria-label,
 * carrying the onClick arm the stand-down composes into. */
function buttonRegion(source: string, label: string): string {
  const at = source.indexOf(`aria-label="${label}"`);
  expect(at).toBeGreaterThan(-1);
  return source.slice(Math.max(0, at - 700), at);
}

/** The comment-stripped collapsed view (the F89/F100 form the s118/
 * s119/s120/s121/s122/s123 specs established: line prefixes stripped
 * BEFORE the join so multi-line comment targets stay visible). */
function collapsed(source: string): string {
  return source
    .split("\n")
    .map((l) => l.replace(/^\s*(?:\/\/|#|\*)\s?/, "").trim())
    .filter((l) => l.length > 0)
    .join(" ");
}

// ---------------------------------------------------------------------------
// The defect set — RED pre-fix, GREEN post-fix
// ---------------------------------------------------------------------------

describe("the S124 defect set", () => {
  it("DEFECT (source): login's user.update catch carries the transaction-abort family arm — the 503 envelope beside the standing P2025 404", () => {
    expect(loginSource).toMatch(FAMILY_ARM);
    expect(loginSource).toMatch(UNAVAILABLE_503);
    const p2025At = loginSource.indexOf('error.code === "P2025"');
    const abortAt = loginSource.search(FAMILY_ARM);
    expect(p2025At).toBeGreaterThan(-1);
    expect(abortAt).toBeGreaterThan(p2025At);
    // The Prisma import is already present (the S102-B form) — the arm
    // must not have arrived via a duck-typed catch.
    expect(loginSource).toMatch(/import \{ Prisma \} from "@prisma\/client";/);
  });

  it("DEFECT (source): resend-otp's user.update catch carries the same family arm", () => {
    expect(resendOtpSource).toMatch(FAMILY_ARM);
    expect(resendOtpSource).toMatch(UNAVAILABLE_503);
    const p2025At = resendOtpSource.indexOf('error.code === "P2025"');
    const abortAt = resendOtpSource.search(FAMILY_ARM);
    expect(p2025At).toBeGreaterThan(-1);
    expect(abortAt).toBeGreaterThan(p2025At);
  });

  it("DEFECT (source): forgot-password composes the arm before the else-throw — the transient abort answers 503, never an enumeration leak", () => {
    expect(forgotPasswordSource).toMatch(FAMILY_ARM);
    expect(forgotPasswordSource).toMatch(UNAVAILABLE_503);
    // The P2025 swallow-to-200 survives verbatim (the route's own
    // no-enumeration doctrine).
    expect(forgotPasswordSource).toMatch(/error\.code === "P2025"\) \{\s*stored = false;/);
    const swallowAt = forgotPasswordSource.indexOf("stored = false;");
    const abortAt = forgotPasswordSource.search(FAMILY_ARM);
    expect(abortAt).toBeGreaterThan(swallowAt);
  });

  it("DEFECT (source): verify-otp's write window is wrapped — the try before the first updateMany, the family arm in the catch, the Prisma import", () => {
    const updateManyAt = verifyOtpSource.indexOf(
      "const verifiedResult = await db.user.updateMany({",
    );
    expect(updateManyAt).toBeGreaterThan(-1);
    const tryAt = verifyOtpSource.lastIndexOf("try {", updateManyAt);
    expect(tryAt).toBeGreaterThan(-1);
    expect(tryAt).toBeLessThan(updateManyAt);
    // The window covers the second updateMany too (the wrong-code
    // increment) — the try block's closing brace sits after it.
    const incrementAt = verifyOtpSource.indexOf(
      "data: { verifyAttempts: { increment: 1 } }",
    );
    expect(incrementAt).toBeGreaterThan(tryAt);
    expect(verifyOtpSource).toMatch(FAMILY_ARM);
    expect(verifyOtpSource).toMatch(UNAVAILABLE_503);
    expect(verifyOtpSource).toMatch(/import \{ Prisma \} from "@prisma\/client";/);
  });

  it("DEFECT (source): reset-password's conditional updateMany is wrapped — the try, the family arm, the Prisma import", () => {
    const updateManyAt = resetPasswordSource.indexOf(
      "const result = await db.user.updateMany({",
    );
    expect(updateManyAt).toBeGreaterThan(-1);
    const tryAt = resetPasswordSource.lastIndexOf("try {", updateManyAt);
    expect(tryAt).toBeGreaterThan(-1);
    expect(tryAt).toBeLessThan(updateManyAt);
    expect(resetPasswordSource).toMatch(FAMILY_ARM);
    expect(resetPasswordSource).toMatch(UNAVAILABLE_503);
    expect(resetPasswordSource).toMatch(/import \{ Prisma \} from "@prisma\/client";/);
  });

  it("DEFECT (source): projects/[id] carries the family arm at BOTH the PATCH update and the DELETE", () => {
    const arms = projectsIdSource.match(
      /\(error\.code === "P2024" \|\| error\.code === "P2028"\)/g,
    );
    expect(arms?.length).toBe(2);
    expect(projectsIdSource).toMatch(UNAVAILABLE_503);
    // The standing S62-G/S69-C P2025 404s survive.
    const p2025Count = projectsIdSource.match(/error\.code === "P2025"/g);
    expect(p2025Count?.length).toBe(2);
  });

  it("DEFECT (source): teams/[id] carries the family arm at BOTH the PATCH update and the DELETE", () => {
    const arms = teamsIdSource.match(
      /\(error\.code === "P2024" \|\| error\.code === "P2028"\)/g,
    );
    expect(arms?.length).toBe(2);
    expect(teamsIdSource).toMatch(UNAVAILABLE_503);
    const p2025Count = teamsIdSource.match(/error\.code === "P2025"/g);
    expect(p2025Count?.length).toBe(2);
  });

  it("DEFECT (source): the header Undo onClick stands down through a live gesture — the capture, the guard, the dispatch, in order", () => {
    const region = buttonRegion(editorViewSource, "Undo");
    const captureAt = region.indexOf("const store = useEditorStore.getState();");
    const guardAt = region.indexOf("if (store.gestureSnapshot) return;");
    const dispatchAt = region.indexOf("store.undo();");
    expect(captureAt).toBeGreaterThan(-1);
    expect(guardAt).toBeGreaterThan(captureAt);
    expect(dispatchAt).toBeGreaterThan(guardAt);
  });

  it("DEFECT (source): the header Redo onClick carries the same stand-down", () => {
    const region = buttonRegion(editorViewSource, "Redo");
    const captureAt = region.indexOf("const store = useEditorStore.getState();");
    const guardAt = region.indexOf("if (store.gestureSnapshot) return;");
    const dispatchAt = region.indexOf("store.redo();");
    expect(captureAt).toBeGreaterThan(-1);
    expect(guardAt).toBeGreaterThan(captureAt);
    expect(dispatchAt).toBeGreaterThan(guardAt);
  });

  it("DEFECT (source): the pointer stand-down's registration names the family — the keyboard twin, the destroyed redo, the dropped-click honesty", () => {
    const undoAt = editorViewSource.indexOf('aria-label="Undo"');
    const redoAt = editorViewSource.indexOf('aria-label="Redo"');
    const region = editorViewSource.slice(
      Math.max(0, undoAt - 1400),
      Math.min(editorViewSource.length, redoAt + 400),
    );
    const collapsedRegion = collapsed(region);
    expect(collapsedRegion).toMatch(/S124-B \/ A124-I1/);
    expect(collapsedRegion).toMatch(/pointer twin/);
    expect(collapsedRegion).toMatch(/future:\[\]/);
    expect(collapsedRegion).toMatch(/dropped click/);
  });

  it("DEFECT (source): the elements list GET registers the full-row ship — the projection asymmetry, the API-consumer contract, the worst-case aggregate", () => {
    const getAt = elementsRouteSource.indexOf(
      "export async function GET(_request: NextRequest",
    );
    expect(getAt).toBeGreaterThan(-1);
    const docstringEnd = elementsRouteSource.indexOf("*/", getAt - 800);
    const region = elementsRouteSource.slice(Math.max(0, getAt - 900), getAt);
    const collapsedRegion = collapsed(region);
    expect(collapsedRegion).toMatch(/S124-C \/ B124-I2/);
    expect(collapsedRegion).toMatch(/THUMBNAIL_ELEMENT_SELECT/);
    expect(collapsedRegion).toMatch(/full rows/);
    expect(collapsedRegion).toMatch(/25 MB/);
  });

  it("DEFECT (source): api.ts cites the PAD's real registry — the inherited-architecture CITATION form is gone, the §3 anchor present, the s97 phrase contiguous", () => {
    // The operative citation form (the parenthetical) must be gone;
    // the registration comment may NAME the historical form it
    // replaced (the repo's own honesty convention — quoted, never
    // cited).
    expect(apiSource).not.toMatch(/\(ADR-006 in the inherited architecture\)/);
    expect(apiSource).toMatch(/PAD §3/);
    // The s97 pin's contiguous phrase survives the reflow verbatim.
    expect(apiSource).toMatch(/every handler except \/api\/health returns/);
  });

  it("DEFECT (source): the limiter's two citations re-anchor onto the PAD §6 Security Architecture row", () => {
    // The operative citation forms must be gone; the registration
    // comments may NAME the historical forms (quoted, never cited).
    expect(rateLimitSource).not.toMatch(/\(ADR-009 in the inherited architecture\)/);
    expect(rateLimitSource).toMatch(/PAD §6/);
    expect(rateLimitTestSource).not.toMatch(/\(ADR-009 in the inherited architecture\)/);
    expect(rateLimitTestSource).toMatch(/PAD §6/);
  });
});

// ---------------------------------------------------------------------------
// The survival set — GREEN pre-fix AND post-fix (the standing forms
// the remediation must not disturb)
// ---------------------------------------------------------------------------

describe("the S124 survival set", () => {
  it("SURVIVAL (source): the S123-A keyboard gesture stand-down keeps its form — the guard after the store capture, inside the keydown window", () => {
    const onKeyDownStart = editorViewSource.indexOf("function onKeyDown(event: KeyboardEvent)");
    const undoBranchStart = editorViewSource.indexOf(
      'if (meta && event.key.toLowerCase() === "z")',
      onKeyDownStart,
    );
    expect(onKeyDownStart).toBeGreaterThan(-1);
    expect(undoBranchStart).toBeGreaterThan(onKeyDownStart);
    const keydownBlock = editorViewSource.slice(onKeyDownStart, undoBranchStart);
    expect(keydownBlock).toMatch(/if \(store\.gestureSnapshot\) return;/);
    const captureAt = keydownBlock.indexOf("const store = useEditorStore.getState();");
    const guardAt = keydownBlock.indexOf("if (store.gestureSnapshot) return;");
    expect(captureAt).toBeGreaterThan(-1);
    expect(guardAt).toBeGreaterThan(captureAt);
  });

  it("SURVIVAL (source): the S123-B upload liveness family keeps its form — the aliveRef + the three guarded heads", () => {
    const imagePanelStart = propertiesPanelSource.indexOf("function ImagePanel({");
    const imagePanelEnd = propertiesPanelSource.indexOf("reader.readAsDataURL(file);", imagePanelStart);
    const imagePanelBlock = propertiesPanelSource.slice(imagePanelStart, imagePanelEnd);
    expect(imagePanelBlock).toMatch(/const aliveRef = React\.useRef\(true\);/);
    const guards = imagePanelBlock.match(/if \(!aliveRef\.current\) return;/g);
    expect(guards?.length).toBeGreaterThanOrEqual(3);
  });

  it("SURVIVAL (source): the S123-C armText matching-armed skip keeps its form — the ridingOwnLiveGesture condition guarding the idle re-arm", () => {
    const armStart = propertiesPanelSource.indexOf('const armText = (surface: string = "text") => {');
    const armEnd = propertiesPanelSource.indexOf("};", armStart);
    const armBody = propertiesPanelSource.slice(armStart, armEnd);
    expect(armBody).toMatch(/const ridingOwnLiveGesture =/);
    expect(armBody).toMatch(/activeSurface !== surface/);
    expect(armBody).toMatch(/store\.gestureSnapshot === armed/);
    expect(armBody).toMatch(/if \(!ridingOwnLiveGesture\) \{/);
  });

  it("SURVIVAL (scripts): the s124 ref-audit provenance — live124, the 100th audit, the 61st clip ordinal, the S123 delivery at HEAD 81a9190", () => {
    expect(refAudit124Source).toMatch(/--session live124/);
    expect(refAudit124Source).toMatch(/100th reference audit/);
    expect(refAudit124Source).toMatch(/byte-identical the 61st/);
    expect(refAudit124Source).toMatch(/the S123 delivery at HEAD 81a9190/);
    expect(refAudit124Source).toMatch(/ref-audit-s134/);
  });

  it("SURVIVAL (scripts): the s124 verify-nav provenance — nav124, the 101st session, the S124-cycle, the FINAL S124 build", () => {
    expect(nav124Source).toMatch(/--session nav124/);
    expect(nav124Source).toMatch(/101st consecutive session/);
    expect(nav124Source).toMatch(/101st session, S124-cycle/);
    expect(nav124Source).toMatch(/the FINAL S124 build/);
    expect(nav124Source).toMatch(/digma-nav124\.log/);
  });

  it("SURVIVAL (scripts): the s124 seo-check provenance — the s124 log token, the S124-cycle summary", () => {
    expect(seo124Source).toMatch(/digma-seo-s124\.log/);
    expect(seo124Source).toMatch(/session 124, S124-cycle/);
  });
});
