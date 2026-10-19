import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-122 spec (the seventieth audit's chosen work):
//
// S122-A — THE CATCH-PATH LIVENESS GUARD (A122-L1, the headline):
//   the S121-B guard `if (!aliveRef.current) return;` sits after the
//   response decode and covers only the RESOLVED continuation — but
//   the send's `catch` branch is a different flow the guard never
//   reaches: when the fetch itself REJECTS (a network failure, or
//   deterministically at the 30s AbortSignal.timeout abort), the
//   exception skips the try tail and lands in the catch's
//   `setInput(message)` + `toast.error("Network error", …)` — both
//   observables firing AFTER the editor unmounted (the Toaster is
//   root-layout-global; the toast pops on the Dashboard). The S121-B
//   registration comment claimed the refusal covers "no draft restore
//   into a dead input, no toast onto the next page" — falsified one
//   branch short. The closure: the SAME aliveRef check at the catch's
//   HEAD (a departed surface restores NOTHING and toasts NOWHERE);
//   the finally's setSending(false) stays (an unmount-safe no-op).
//
// S122-B — THE SHARE GUARD'S URL-TRUTH COMPOSITION (A122-L2): the
//   S58-F honest-unavailable guard reads `!store.projectId` — but the
//   zustand singleton's projectId is STALE through a plain mount's
//   loading window (the unmount flush never clears it), so a Share
//   click over an UNKNOWN ?projectId (the 404 → Untitled fallback)
//   passed the guard on the PREVIOUS project's id and copied the dead
//   URL with a false "Share link copied" — where the identical click
//   after the window correctly answers "Share unavailable". The
//   closure: derive urlId from window.location.search and refuse
//   whenever the URL's project hasn't been ADOPTED by the store yet
//   (still loading, or dead) — the BUTTON stays ungated (the S121-D
//   honest-exclusion pin: the URL already points at the incoming
//   project; the fix composes the GUARD, never the button).
//
// S122-C — THE VIEWPORT-CLASS EXCLUSION REGISTRATION (A122-I1): the
//   S121-A surface census's pointer-modality residuals — the Toolbar,
//   the zoom cluster, and the save-state badge render live through
//   the loading window BY DESIGN (viewport-class members never flip
//   saveState, never push history, never arm the PUT — the S61-C load
//   reset wipes them; a dropped click, never a persisted mutation).
//   The honest EXCLUSION registration at the loading-stand-down seam
//   (the same registration form the Share exclusion took in S121-D).
//
// S122-D — THE EQUALIZER FINE PRINT (B122-I2): the login timing
//   equalizer's LAZY form pays its scrypt ON TOP of the verify on the
//   process's FIRST unknown-email miss (a one-shot 2x sample vs the
//   constant-work envelope) — the unrecorded fine print of the S72-C
//   tradeoff, registered at the password.ts seam.
//
// The script family (the S118-C convention, s122 form): the s122
//   parity scripts ride their OWN tokens (live122 / nav122 /
//   digma-seo-s122.log, the 98th audit / 99th session / 59th clip
//   ordinals, the S121 delivery at HEAD 6abc0b7), never the frozen
//   s121 forms.

const editorViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const aiAssistantSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const passwordSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/password.ts"),
  "utf8",
);
const nav122Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s122.sh"),
  "utf8",
);
const nav121Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s121.sh"),
  "utf8",
);
const refAudit122Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s122.sh"),
  "utf8",
);
const seo122Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s122.sh"),
  "utf8",
);

/** The send() catch slice — from the catch's opening to the finally
 * (the S105-B/S106-B restore contract's own window; the S122-A guard
 * lands at its head). */
const sendAt = aiAssistantSource.indexOf("async function send(text: string) {");
const catchAt = aiAssistantSource.indexOf("} catch {", sendAt);
const finallyAt = aiAssistantSource.indexOf("} finally {", sendAt);
const catchBlock = aiAssistantSource.slice(catchAt, finallyAt);

/** The onShare slice — the function's own body (the s58 pin's anchor
 * form, extended for the composed guard). */
const onShareMatch = editorViewSource.match(/function onShare\(\) \{[\s\S]*?\n  \}/);
const onShareBlock = onShareMatch?.[0] ?? "";

/** The shortcut handler's keydown slice — from the handler's opening
 * line to the undo branch (the S120-A/S121-A/S122-C boundary: the
 * flush, the loading stand-down + its registration, and the store
 * capture all live in this window). */
const onKeyDownStart = editorViewSource.indexOf("function onKeyDown(event: KeyboardEvent)");
const undoBranchStart = editorViewSource.indexOf(
  'if (meta && event.key.toLowerCase() === "z")',
  onKeyDownStart,
);
const keydownBlock = editorViewSource.slice(onKeyDownStart, undoBranchStart);

/** The Share button slice — anchored on the aria-label (the s121
 * honest-exclusion pin's own anchor form). */
const shareAt = editorViewSource.indexOf('aria-label="Share"');
const shareBlock = editorViewSource.slice(shareAt - 500, shareAt + 200);

/** The comment-stripped collapsed view (the F89/F100 form the s118/
 * s119/s120/s121 specs established: line prefixes stripped BEFORE
 * the join so multi-line comment targets stay visible). */
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

describe("the S122 defect set", () => {
  it("DEFECT (source): the send's catch refuses FIRST when departed — the guard at the catch head, before the restore and the toast", () => {
    // THE CATCH-GUARD PIN: the rejection path (a network failure or
    // the 30s abort) is a continuation the S121-B decode guard never
    // reaches — a departed surface restores NOTHING and toasts
    // NOWHERE.
    expect(catchBlock).toMatch(/if \(!aliveRef\.current\) return;/);
    const guardIdx = catchBlock.indexOf("if (!aliveRef.current) return;");
    const restoreIdx = catchBlock.indexOf('setInput((draft) => (draft === "" ? message : draft))');
    const toastIdx = catchBlock.indexOf('toast.error("Network error"');
    expect(restoreIdx).toBeGreaterThan(guardIdx);
    expect(toastIdx).toBeGreaterThan(guardIdx);
  });

  it("DEFECT (source): the catch's registration names the falsified S121-B claim and the REJECTION path", () => {
    const collapsedCatch = collapsed(catchBlock);
    expect(collapsedCatch).toMatch(/S122-A \/ A122-L1/);
    expect(collapsedCatch).toMatch(/REJECTION path/);
  });

  it("DEFECT (source): onShare derives the URL's own projectId — the truth source the copy will carry", () => {
    expect(onShareBlock).toMatch(
      /new URLSearchParams\(window\.location\.search\)\.get\("projectId"\)/,
    );
  });

  it("DEFECT (source): the guard composes the store truth with the URL truth — !projectId || urlId mismatch", () => {
    // THE URL-TRUTH PIN: the singleton's projectId is stale through a
    // plain mount's loading window; the composed guard refuses
    // whenever the URL's project hasn't been ADOPTED by the store
    // (still loading, or dead) — the original S58-F contract
    // (!projectId) survives as the first arm.
    expect(onShareBlock).toMatch(/if \(!store\.projectId \|\| urlId !== store\.projectId\) \{/);
  });

  it("DEFECT (source): the composed guard still precedes the clipboard write — the s58 ordering contract survives the composition", () => {
    const guardIdx = onShareBlock.indexOf("if (!store.projectId || urlId !== store.projectId)");
    const clipIdx = onShareBlock.indexOf("navigator.clipboard");
    expect(guardIdx).toBeGreaterThan(-1);
    expect(clipIdx).toBeGreaterThan(guardIdx);
  });

  it("DEFECT (source): the unavailable toast's description is the honest two-case form", () => {
    // "still loading or hasn't been saved yet" — true for the swap
    // window's busy-refusal AND the untitled/dead cases alike.
    expect(onShareBlock).toMatch(/still loading or hasn't been saved yet/);
    expect(onShareBlock).toMatch(/Share unavailable/);
  });

  it("DEFECT (source): the loading-stand-down registration carries the viewport-class EXCLUSION — the Toolbar, the zoom cluster, the save badge", () => {
    const collapsedKeydown = collapsed(keydownBlock);
    expect(collapsedKeydown).toMatch(/S122-C \/ A122-I1/);
    expect(collapsedKeydown).toMatch(/viewport-class/);
    expect(collapsedKeydown).toMatch(/Toolbar/);
    expect(collapsedKeydown).toMatch(/zoom/);
  });

  it("DEFECT (source): the password equalizer's LAZY fine print is registered at the seam — the one-shot first-miss", () => {
    const collapsedPassword = collapsed(passwordSource);
    expect(collapsedPassword).toMatch(/S122-D \/ B122-I2/);
    expect(collapsedPassword).toMatch(/one-shot/);
  });
});

// ---------------------------------------------------------------------------
// The survival set — the forms the S122 fixes must never disturb
// ---------------------------------------------------------------------------

describe("the S122 survival set", () => {
  it("SURVIVAL (source): the S121-B decode guard stays FIRST — before the preApply capture (the catch's guard is the SECOND occurrence)", () => {
    expect(aiAssistantSource).toMatch(/if \(!aliveRef\.current\) return;/);
    const guardAt = aiAssistantSource.indexOf("if (!aliveRef.current) return;");
    const preApplyAt = aiAssistantSource.indexOf("const preApply = useEditorStore.getState();");
    expect(guardAt).toBeGreaterThan(-1);
    expect(preApplyAt).toBeGreaterThan(guardAt);
  });

  it("SURVIVAL (source): the s106 catch-restore contract survives the guard's insertion — the restore stays inside the catch body", () => {
    expect(catchAt).toBeGreaterThan(-1);
    expect(finallyAt).toBeGreaterThan(catchAt);
    expect(catchBlock).toMatch(/setInput\(\(draft\) => \(draft === "" \? message : draft\)\)/);
    // Session 130 (S130-D — a legitimate widening, the S102-B
    // convention): the finally's own registration comment sits between
    // the block's opening and the guarded setSending — 120 -> 400.
    const finallySlice = aiAssistantSource.slice(finallyAt, finallyAt + 400);
    expect(finallySlice).toMatch(/setSending\(false\)/);
  });

  it("SURVIVAL (source): the Share button stays URL-scoped and ungated — the S121-D honest-exclusion pin holds byte-identically", () => {
    // The BUTTON is never gated (the URL already points at the
    // incoming project); the S122-B fix composes the GUARD, never the
    // button — the exclusion is the fix's own scope discipline.
    expect(shareBlock).not.toMatch(/disabled=\{loading\}/);
    expect(editorViewSource).toMatch(/window\.location\.href/);
  });

  it("SURVIVAL (source): the send's scope/epoch belts survive — the liveness guards compose, never replace", () => {
    expect(aiAssistantSource).toMatch(/sendScopeId !== "" && preApply\.projectId !== sendScopeId/);
    expect(aiAssistantSource).toMatch(/sendEpoch !== preApply\.boardEpoch/);
  });

  it("SURVIVAL (source): the s122 nav script rides its OWN token — nav122 + the isolated log, never the frozen s121 form", () => {
    expect(nav122Source).toMatch(/--session nav122/);
    expect(nav122Source).toMatch(/digma-nav122\.log/);
    expect(nav122Source).not.toMatch(/nav121/);
    // The run's own descriptors: the 99th consecutive session, the
    // FINAL S122 build, the S121 delivery + the S122 remediation.
    expect(nav122Source).toMatch(/99th consecutive session/);
    expect(nav122Source).toMatch(/FINAL S122 build/);
    expect(nav122Source).toMatch(/the S121 delivery 6abc0b7 \+ the S122 remediation/);
    // The frozen s121 script keeps its own token (bidirectional).
    expect(nav121Source).toMatch(/--session nav121/);
    expect(nav121Source).not.toMatch(/nav122/);
  });

  it("SURVIVAL (source): the ref-audit s122 provenance anchors — live122, the s132 evidence dir, the 98th form, the 59th clip ordinal, the S121 delivery", () => {
    expect(refAudit122Source).toMatch(/--session live122/);
    expect(refAudit122Source).toMatch(/ref-audit-s132/);
    expect(refAudit122Source).toMatch(/98th reference audit/);
    expect(refAudit122Source).toMatch(/byte-identical the 59th/);
    expect(refAudit122Source).toMatch(/the S121 delivery at HEAD 6abc0b7/);
    expect(refAudit122Source).not.toMatch(/live121/);
  });

  it("SURVIVAL (source): the seo-check s122 tokens — the isolated log, the session-122 cycle descriptor", () => {
    expect(seo122Source).toMatch(/digma-seo-s122\.log/);
    expect(seo122Source).toMatch(/session 122, S122-cycle/);
    expect(seo122Source).not.toMatch(/digma-seo-s121\.log/);
  });
});
