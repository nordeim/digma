import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-123 spec (the seventy-first audit's chosen work):
//
// S123-A — THE KEYBOARD HISTORY ARMS' GESTURE STAND-DOWN (A123-L1,
//   the headline): the shortcut handler's history arms (undo/redo,
//   Delete/Backspace) dispatched during an ACTIVE pointer gesture —
//   the S120-A entry flush deliberately passes active drags through
//   (it flushes only idle-armed bursts; an active drag carries no
//   idle timer), and isTypingTarget's range carve-out makes the
//   chords REACHABLE with a slider focused, mid-drag included. A
//   mid-drag Ctrl+Z popped a past entry and pushed a redo the
//   still-live drag's ticks then committed over (history-free, on
//   the UNDONE base), and the terminal endGesture's future:[]
//   destroyed the redo the undo just created — the A120-L1 symptom
//   family on the one window its closure passed through. The
//   closure: ONE stand-down after the store capture — a live
//   gesture makes the keyboard member refuse (the drag's terminal
//   stays the sole committer; the zoom/tool arms ride the same
//   window as the safe-direction form — the S122-C exemption is
//   the LOADING window's registration, a different window).
//
// S123-B — THE IMAGE UPLOAD LIVENESS GUARD (A123-I1): the upload
//   chain (FileReader onload → downscaleDataUrl → thumbnailFor →
//   commitUpload) is the client layer's last unguarded
//   store-mutating async continuation — the S121-B/S122-A liveness
//   family's remaining member. The unmount cleanup ran while
//   saveState was still "saved" (the patch hadn't committed), so NO
//   leave transport was registered; the continuation's
//   updateElements flipped the departed singleton "unsaved" with no
//   subscriber, timer, or pagehide listener left to flush it — the
//   upload silently dropped at the next mount's loadProject. The
//   closure: the S121-B aliveRef form (useRef(true) + the
//   StrictMode-safe effect) + THREE guarded heads (commitUpload —
//   the store-mutating seam; onload/onerror — the toast
//   observables). A departed surface commits NOTHING and toasts
//   NOWHERE.
//
// S123-C — THE ARMTEXT MATCHING-ARMED IDLE SKIP (A123-I2): when a
//   DIFFERENT surface's arm lands under the closure's OWN live
//   gesture (finger-2 committing a number field mid-slider-drag —
//   the touch interleaving the S66-A foreign-ride guard never
//   enumerated; it covers the store carrying a gesture this closure
//   did NOT arm, and the matching arm rode with no branch at all),
//   the idle re-arm must not carry the LIVE gesture's surface
//   token: the 150ms terminal would pass the ownership check and
//   endGesture MID-DRAG (the per-tick history flooding the S62-A
//   seam exists to prevent, plus the slider's own pointerup
//   terminal no-oping on the already-null activeSurface). The
//   gesture's OWN terminals (pointerup/cancel) stay the sole
//   enders; the riding commit coalesces into the gesture's single
//   history entry.
//
// The script family (the S118-C convention, s123 form): the s123
//   parity scripts ride their OWN tokens (live123 / nav123 /
//   digma-seo-s123.log, the 99th audit / 100th session / 60th clip
//   ordinals, the S122 delivery at HEAD 1eeb357), never the frozen
//   s122 forms.

const editorViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const propertiesPanelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const aiAssistantSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const nav123Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s123.sh"),
  "utf8",
);
const nav122Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s122.sh"),
  "utf8",
);
const refAudit123Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s123.sh"),
  "utf8",
);
const seo123Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s123.sh"),
  "utf8",
);

/** The shortcut handler's keydown slice — from the handler's opening
 * line to the undo branch (the S120-A/S121-A/S122-C/S123-A boundary:
 * the flush, the loading stand-down + its registration, the store
 * capture, and the gesture stand-down all live in this window). */
const onKeyDownStart = editorViewSource.indexOf("function onKeyDown(event: KeyboardEvent)");
const undoBranchStart = editorViewSource.indexOf(
  'if (meta && event.key.toLowerCase() === "z")',
  onKeyDownStart,
);
const keydownBlock = editorViewSource.slice(onKeyDownStart, undoBranchStart);

/** The ImagePanel slice — from the component's opening to the read
 * kick (the upload chain's whole window: the aliveRef, the three
 * guarded heads, and the continuation all live inside). */
const imagePanelStart = propertiesPanelSource.indexOf("function ImagePanel({");
const imagePanelEnd = propertiesPanelSource.indexOf("reader.readAsDataURL(file);", imagePanelStart);
const imagePanelBlock = propertiesPanelSource.slice(imagePanelStart, imagePanelEnd);

/** The armText slice — the primitive's own body (the slider-surface
 * spec's own anchor form; the S123-C skip lands inside). */
const armStart = propertiesPanelSource.indexOf('const armText = (surface: string = "text") => {');
const armEnd = propertiesPanelSource.indexOf("};", armStart);
const armBody = propertiesPanelSource.slice(armStart, armEnd);

/** The comment-stripped collapsed view (the F89/F100 form the s118/
 * s119/s120/s121/s122 specs established: line prefixes stripped
 * BEFORE the join so multi-line comment targets stay visible). */
function collapsed(source: string): string {
  return source
    .split("\n")
    .map((l) => l.replace(/^\s*(?:\/\/|#)\s?/, "").trim())
    .filter((l) => l.length > 0)
    .join(" ");
}

// ---------------------------------------------------------------------------
// The defect set — RED pre-fix, GREEN post-fix
// ---------------------------------------------------------------------------

describe("the S123 defect set", () => {
  it("DEFECT (source): the keyboard history arms stand down through a live gesture — the guard after the store capture, inside the keydown window", () => {
    // THE GESTURE STAND-DOWN PIN: the S120-A flush passes active
    // drags through by design (idle bursts only); the dispatch's own
    // window needed its own guard — a live gesture makes the
    // keyboard member refuse, the drag's terminal stays the sole
    // committer.
    expect(keydownBlock).toMatch(/if \(store\.gestureSnapshot\) return;/);
    const gestureGuardAt = keydownBlock.indexOf("if (store.gestureSnapshot) return;");
    const captureAt = keydownBlock.indexOf("const store = useEditorStore.getState();");
    expect(captureAt).toBeGreaterThan(-1);
    expect(gestureGuardAt).toBeGreaterThan(captureAt);
  });

  it("DEFECT (source): the gesture stand-down's registration names the family — the flush's pass-through scope, the mid-drag reachability, the destroyed redo", () => {
    const collapsedKeydown = collapsed(keydownBlock);
    expect(collapsedKeydown).toMatch(/S123-A \/ A123-L1/);
    expect(collapsedKeydown).toMatch(/gesture stand-down/);
    expect(collapsedKeydown).toMatch(/mid-drag/);
    expect(collapsedKeydown).toMatch(/future:\[\]/);
  });

  it("DEFECT (source): the ImagePanel carries the S121-B aliveRef form — the ref, the StrictMode-safe effect, the family registration", () => {
    // THE LIVENESS REF PIN: the upload chain is the family's last
    // client member — the ref + the effect body resetting true on
    // mount (the StrictMode remount form), the cleanup setting
    // false.
    expect(imagePanelBlock).toMatch(/const aliveRef = React\.useRef\(true\);/);
    const refAt = imagePanelBlock.indexOf("const aliveRef = React.useRef(true);");
    const resetAt = imagePanelBlock.indexOf("aliveRef.current = true;", refAt);
    const clearAt = imagePanelBlock.indexOf("aliveRef.current = false;", refAt);
    expect(resetAt).toBeGreaterThan(refAt);
    expect(clearAt).toBeGreaterThan(resetAt);
    const collapsedImage = collapsed(imagePanelBlock);
    expect(collapsedImage).toMatch(/S123-B \/ A123-I1/);
    expect(collapsedImage).toMatch(/upload liveness guard/);
    expect(collapsedImage).toMatch(/silently dropped/);
  });

  it("DEFECT (source): commitUpload refuses FIRST when departed — the guard at the head, before the busy clear", () => {
    // THE STORE-MUTATING SEAM: the continuation's updateElements is
    // the observable that flips the departed singleton "unsaved"
    // with no flush left — the guard is the function's first
    // statement.
    const commitAt = imagePanelBlock.indexOf(
      "const commitUpload = (fillImage: string, fillImageThumb: string | null) => {",
    );
    expect(commitAt).toBeGreaterThan(-1);
    const commitGuardAt = imagePanelBlock.indexOf("if (!aliveRef.current) return;", commitAt);
    const commitBusyAt = imagePanelBlock.indexOf("setBusy(false);", commitAt);
    expect(commitGuardAt).toBeGreaterThan(commitAt);
    expect(commitBusyAt).toBeGreaterThan(commitGuardAt);
  });

  it("DEFECT (source): the reader's onload and onerror heads carry the same refusal — no toast onto the departed page, no chain start", () => {
    const onloadAt = imagePanelBlock.indexOf("reader.onload = () => {");
    const onerrorAt = imagePanelBlock.indexOf("reader.onerror = () => {");
    expect(onloadAt).toBeGreaterThan(-1);
    expect(onerrorAt).toBeGreaterThan(onloadAt);
    const onloadGuardAt = imagePanelBlock.indexOf("if (!aliveRef.current) return;", onloadAt);
    const dataUrlAt = imagePanelBlock.indexOf('const dataUrl = String(reader.result ?? "");', onloadAt);
    expect(onloadGuardAt).toBeGreaterThan(onloadAt);
    expect(onloadGuardAt).toBeLessThan(dataUrlAt);
    const onerrorGuardAt = imagePanelBlock.indexOf("if (!aliveRef.current) return;", onerrorAt);
    expect(onerrorGuardAt).toBeGreaterThan(onerrorAt);
  });

  it("DEFECT (source): armText skips the idle re-arm when a different surface rides the closure's OWN live gesture", () => {
    // THE MATCHING-ARMED SKIP PIN: the ridingOwnLiveGesture
    // condition — armed (not a foreign ride), a live activeSurface,
    // a DIFFERENT calling surface, and the store's gesture still the
    // closure's own — guards the idle re-arm; the gesture's own
    // terminals stay the sole enders.
    expect(armBody).toMatch(/ridingOwnLiveGesture/);
    expect(armBody).toMatch(/armed !== null/);
    expect(armBody).toMatch(/activeSurface !== surface/);
    expect(armBody).toMatch(/store\.gestureSnapshot === armed/);
    expect(armBody).toMatch(/if \(!ridingOwnLiveGesture\) \{/);
    const ridingAt = armBody.indexOf("const ridingOwnLiveGesture");
    const idleAt = armBody.indexOf("idleTimer = setTimeout");
    expect(ridingAt).toBeGreaterThan(-1);
    expect(idleAt).toBeGreaterThan(ridingAt);
  });

  it("DEFECT (source): the skip's registration names the S66-A family's uncovered member and the sole-ender contract", () => {
    const collapsedArm = collapsed(armBody);
    expect(collapsedArm).toMatch(/S123-C \/ A123-I2/);
    expect(collapsedArm).toMatch(/matching-armed/);
    expect(collapsedArm).toMatch(/sole enders/);
  });

  it("DEFECT (source): the skipped re-arm keeps the standing forms verbatim inside the guard — the same-surface coalescing survives", () => {
    // The surviving armText contract (the slider-surface spec's own
    // pins, now inside the skip's else-path): the begin branch, the
    // idleSurface derivation, the finish terminal.
    expect(armBody).toMatch(/activeSurface = surface/);
    expect(armBody).toMatch(/const idleSurface = activeSurface \?\? surface/);
    expect(armBody).toMatch(/finish\(idleSurface\)/);
  });
});

// ---------------------------------------------------------------------------
// The survival set — the forms the S123 fixes must never disturb
// ---------------------------------------------------------------------------

describe("the S123 survival set", () => {
  it("SURVIVAL (source): the S120-A/S121-A ordering holds — the flush, then the loading guard, then the store capture, all before the new stand-down", () => {
    const flushAt = keydownBlock.indexOf("flushIdleBurst();");
    const loadingGuardAt = keydownBlock.indexOf("if (loadingRef.current) return;");
    const captureAt = keydownBlock.indexOf("const store = useEditorStore.getState();");
    const gestureGuardAt = keydownBlock.indexOf("if (store.gestureSnapshot) return;");
    expect(flushAt).toBeGreaterThan(-1);
    expect(loadingGuardAt).toBeGreaterThan(flushAt);
    expect(captureAt).toBeGreaterThan(loadingGuardAt);
    expect(gestureGuardAt).toBeGreaterThan(captureAt);
  });

  it("SURVIVAL (source): the S122 delivery survives verbatim — the catch-head liveness guard and the Share guard's URL-truth composition", () => {
    expect(aiAssistantSource).toMatch(/if \(!aliveRef\.current\) return;/);
    expect(aiAssistantSource).toMatch(/setInput\(message\)/);
    expect(aiAssistantSource).toMatch(/toast\.error\("Network error"/);
    expect(editorViewSource).toMatch(/if \(!store\.projectId \|\| urlId !== store\.projectId\) \{/);
    const collapsedKeydown = collapsed(keydownBlock);
    expect(collapsedKeydown).toMatch(/S122-C \/ A122-I1/);
    expect(collapsedKeydown).toMatch(/viewport-class/);
  });

  it("SURVIVAL (source): the upload's standing floors survive — the id-match comment family and the no-op commit guard", () => {
    // The S123-B guard COMPOSES with the S109-A/S113-B floors, never
    // replaces them: the patchDiffers guard and the id-scoped commit
    // stay inside commitUpload's body.
    const commitAt = imagePanelBlock.indexOf(
      "const commitUpload = (fillImage: string, fillImageThumb: string | null) => {",
    );
    const body = imagePanelBlock.slice(commitAt, imagePanelEnd);
    expect(body).toMatch(/patchDiffers/);
    expect(body).toMatch(/updateElements\(\[element\.id\], patch/);
  });

  it("SURVIVAL (source): the s123 nav script rides its OWN token — nav123 + the isolated log, never the frozen s122 form", () => {
    expect(nav123Source).toMatch(/--session nav123/);
    expect(nav123Source).toMatch(/digma-nav123\.log/);
    expect(nav123Source).not.toMatch(/nav122/);
    // The run's own descriptors: the 100th consecutive session, the
    // FINAL S123 build, the S122 delivery + the S123 remediation.
    expect(nav123Source).toMatch(/100th consecutive session/);
    expect(nav123Source).toMatch(/FINAL S123 build/);
    expect(nav123Source).toMatch(/the S122 delivery 1eeb357 \+ the S123 remediation/);
    // The frozen s122 script keeps its own token (bidirectional).
    expect(nav122Source).toMatch(/--session nav122/);
    expect(nav122Source).not.toMatch(/nav123/);
  });

  it("SURVIVAL (source): the ref-audit s123 provenance anchors — live123, the s133 evidence dir, the 99th form, the 60th clip ordinal, the S122 delivery", () => {
    expect(refAudit123Source).toMatch(/--session live123/);
    expect(refAudit123Source).toMatch(/ref-audit-s133/);
    expect(refAudit123Source).toMatch(/99th reference audit/);
    expect(refAudit123Source).toMatch(/byte-identical the 60th/);
    expect(refAudit123Source).toMatch(/the S122 delivery at HEAD 1eeb357/);
    expect(refAudit123Source).not.toMatch(/live122/);
  });

  it("SURVIVAL (source): the seo-check s123 tokens — the isolated log, the session-123 cycle descriptor", () => {
    expect(seo123Source).toMatch(/digma-seo-s123\.log/);
    expect(seo123Source).toMatch(/session 123, S123-cycle/);
    expect(seo123Source).not.toMatch(/digma-seo-s122\.log/);
  });

  it("SURVIVAL (source): the armText branches keep their standing census — the begin branch and the foreign-ride branch verbatim", () => {
    expect(armBody).toMatch(/if \(store\.gestureSnapshot === null\) \{/);
    expect(armBody).toMatch(/store\.beginGesture\(\)/);
    expect(armBody).toMatch(/armed = useEditorStore\.getState\(\)\.gestureSnapshot/);
    expect(armBody).toMatch(/A foreign gesture owns the store/);
    expect(armBody).toMatch(/armed = null/);
  });
});
