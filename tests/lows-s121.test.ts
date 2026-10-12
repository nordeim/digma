import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-121 spec (the sixty-ninth audit's chosen work):
//
// S121-A — THE LOADING GATE'S PANEL COMPLETION (A121-L1, the headline):
//   the S77-E census named only "the header, the canvas" and the
//   S120-B closure gated the assistant — but the side panels
//   (LayersPanel/ComponentsPanel on panels.layers/components && isMd,
//   PropertiesPanel on panels.properties && isLg), the below-lg
//   mobile chips ({!isLg && …}), the Present trigger, the Download
//   format menu, and the header's undo/redo pair all rendered fully
//   live through the mount/swap loading window while the store
//   singleton still held the OUTGOING project — the Layers column
//   listed its rows, the Properties column edited its selection, and
//   a click on Present/Download/undo presented, exported, or
//   history-mutated the WRONG board (undo is the sharpest: it flips
//   saveState to "unsaved" and the new instance's already-attached
//   subscriber arms the 800ms timer — the mutation PERSISTS to the
//   outgoing project after the user navigated away). The closure: the
//   S120-B wrapper pattern extended to every ungated surface — the
//   panel WRAPPERS always render (the parity datum), the CONTENT
//   gates on !loading with the Canvas's own placeholder form, the
//   header actions carry disabled={loading} (undo/redo compose with
//   their canUndo/canRedo forms), the mobile chips compose the
//   S102-F mount gate with the load gate, and the KEYBOARD modality
//   stands down through an effect-synced loadingRef (the window
//   listener's closure is mount-stale for component state — the
//   effect deps are [onOpenShortcuts]) placed AFTER the S120-A entry
//   flush (the outgoing project's armed burst still commits where it
//   belongs) and BEFORE the store capture.
//
// S121-B — THE AI SEND LIVENESS GUARD (A121-L2): the send's await can
//   OUTLIVE the editor's unmount — a plain exit changes neither the
//   store's projectId nor its boardEpoch, so the mid-flight
//   scope/epoch belts PASS on the departed singleton and the reply's
//   applyOperations mutates a store no surface ever PUTs (the unmount
//   cleanup registered nothing — saveState was "saved" at exit; the
//   subscriber is gone) — the next mount's loadProject silently wipes
//   the edit, falsifying the S120-B closure's own claim ("an edit
//   that didn't exist at unmount time must never be created"). The
//   closure: the AiAssistant's own cleanup sets an aliveRef false and
//   a dead surface refuses SILENTLY (the transcript died with the
//   unmount) — the guard COMPOSES with the belts, never replaces
//   them.
//
// S121-C — THE E2E-TOUCHED EVIDENCE RESTORE (B121-I1): the 10
//   outside-window witness PNGs the cycle's own e2e gate run
//   re-rendered are restored before the commit (the standing
//   discipline the s118/s120 cycles recorded — the F106
//   frozen-universe doctrine's evidence layer). A process step, not a
//   source seam: pinned here only through the script-token family.
//
// S121-D — the per-session script family (the S118-C convention, s121
//   form): the s121 verify-nav script rides its OWN agent-browser
//   session token (nav121) + log token (digma-nav121.log), never the
//   frozen s120 forms — pinned bidirectionally with the frozen s120
//   script keeping its own token, plus the ref-audit/seo-check s121
//   provenance anchors (live121, ref-audit-s131, the 97th audit form,
//   the 58th consecutive clip ordinal, the S120 delivery at HEAD
//   bf1a1f4, digma-seo-s121.log).

const editorViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const aiAssistantSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const nav121Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s121.sh"),
  "utf8",
);
const nav120Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s120.sh"),
  "utf8",
);
const refAudit121Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s121.sh"),
  "utf8",
);
const seo121Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s121.sh"),
  "utf8",
);

/** The shortcut handler's keydown slice — from the handler's opening
 * line to the undo branch's opening (the S120-A/S121-A boundary: the
 * flush, the loading stand-down, and the store capture all live in
 * this window). */
const onKeyDownStart = editorViewSource.indexOf("function onKeyDown(event: KeyboardEvent)");
const undoBranchStart = editorViewSource.indexOf(
  'if (meta && event.key.toLowerCase() === "z")',
  onKeyDownStart,
);
const keydownBlock = editorViewSource.slice(onKeyDownStart, undoBranchStart);

/** The three panel-column slices — the first anchored on the column
 * family's own comment (the registration lives ABOVE the first mount
 * condition — the F89 comment-anchor form), the others on their own
 * mount conditions (the wrapper form the client-lows-s75 pin reads). */
const leftPanelsAnchor = editorViewSource.indexOf(
  "Left panels — each column is an INDEPENDENT chip toggle",
);
const layersBlock = editorViewSource.slice(leftPanelsAnchor, leftPanelsAnchor + 2200);
const componentsMountAt = editorViewSource.indexOf("panels.components && isMd && (");
const componentsBlock = editorViewSource.slice(componentsMountAt, componentsMountAt + 700);
const propertiesMountAt = editorViewSource.indexOf("panels.properties && isLg && (");
const propertiesBlock = editorViewSource.slice(propertiesMountAt, propertiesMountAt + 700);

/** The header-action slices — anchored on the aria-labels (the
 * export-menu pin's own anchor form). */
const presentAt = editorViewSource.indexOf('aria-label="Present"');
const presentBlock = editorViewSource.slice(presentAt - 500, presentAt + 200);
const downloadAt = editorViewSource.indexOf('aria-label="Download"');
const downloadBlock = editorViewSource.slice(downloadAt - 500, downloadAt + 200);
const shareAt = editorViewSource.indexOf('aria-label="Share"');
const shareBlock = editorViewSource.slice(shareAt - 500, shareAt + 200);

/** The comment-stripped collapsed view (the F89/F100 form the s118/
 * s119/s120 specs established: line prefixes stripped BEFORE the join
 * so multi-line comment targets stay visible). */
function collapsed(source: string): string {
  return source
    .split("\n")
    .map((l) => l.replace(/^\s*(?:\/\/|#)\s?/, "").trim())
    .filter((l) => l.length > 0)
    .join(" ")
    .replace(/\s+/g, " ");
}
/** The whitespace-only collapsed view (the JSX-comment form: the panel
 * registration lives in a braces-wrapped star-comment block whose
 * markers the //-stripper never touches — whitespace collapse alone
 * keeps the single-line tokens visible). */
function collapsedWs(source: string): string {
  return source.replace(/\s+/g, " ");
}
const keydownBlockCollapsed = collapsed(keydownBlock);
const layersBlockCollapsed = collapsedWs(layersBlock);
const aiAssistantCollapsed = collapsed(aiAssistantSource);

// ---------------------------------------------------------------------------
// S121-A — the loading gate's panel completion (A121-L1 — the headline)
// ---------------------------------------------------------------------------

describe("S121-A the loading gate's panel completion (A121-L1 — the headline)", () => {
  it("DEFECT (source): the three panel columns gate their CONTENT on !loading with the Canvas's own placeholder form", () => {
    // THE CONTENT-GATE PIN: the wrappers stay (the parity datum — the
    // reference's measured w-60/w-72 columns render at every
    // instant); the panels never paint the outgoing project through
    // the GET window.
    expect(layersBlock).toMatch(/\{loading \? \(/);
    expect(layersBlock).toMatch(/Loading layers…/);
    const layersTernaryAt = layersBlock.indexOf("{loading ? (");
    const layersPanelAt = layersBlock.indexOf("<LayersPanel />");
    expect(layersTernaryAt).toBeGreaterThan(-1);
    expect(layersPanelAt).toBeGreaterThan(layersTernaryAt);

    expect(componentsBlock).toMatch(/\{loading \? \(/);
    expect(componentsBlock).toMatch(/Loading components…/);
    const componentsTernaryAt = componentsBlock.indexOf("{loading ? (");
    const componentsPanelAt = componentsBlock.indexOf("<ComponentsPanel />");
    expect(componentsTernaryAt).toBeGreaterThan(-1);
    expect(componentsPanelAt).toBeGreaterThan(componentsTernaryAt);

    expect(propertiesBlock).toMatch(/\{loading \? \(/);
    expect(propertiesBlock).toMatch(/Loading properties…/);
    const propertiesTernaryAt = propertiesBlock.indexOf("{loading ? (");
    const propertiesPanelAt = propertiesBlock.indexOf("<PropertiesPanel />");
    expect(propertiesTernaryAt).toBeGreaterThan(-1);
    expect(propertiesPanelAt).toBeGreaterThan(propertiesTernaryAt);
  });

  it("DEFECT (source): the registration names the S77-E census gap and the wrapper/content split", () => {
    // THE REGISTRATION PIN (the F106/F107 form): the argument lives in
    // the comment above the first gated column — the census that
    // never enumerated the panel surfaces, and the parity datum the
    // wrappers preserve.
    expect(layersBlockCollapsed).toMatch(/S121-A \/ A121-L1/);
    expect(layersBlockCollapsed).toMatch(/S77-E census/);
    expect(layersBlockCollapsed).toMatch(/OUTGOING project/);
    expect(layersBlockCollapsed).toMatch(/S102-F/);
  });

  it("DEFECT (source): the below-lg mobile chips compose the S102-F mount gate with the load gate", () => {
    // THE COMPOSED-MOUNT PIN: the chips unmount for the window (the
    // Sheets can never open against the outgoing store below lg) and
    // remount on completion.
    expect(editorViewSource).toMatch(/\{!isLg && !loading && <MobilePropertiesEditor \/>/);
    expect(editorViewSource).toMatch(/\{!isLg && !loading && <MobileCanvasProperties \/>/);
  });

  it("DEFECT (source): Present and the Download trigger refuse the outgoing store — disabled={loading}", () => {
    // THE ACTION-GATE PIN: the header chrome stays rendered and
    // measurable (the clip pins) while the actions stand down for the
    // window.
    expect(presentBlock).toMatch(/disabled=\{loading\}/);
    expect(downloadBlock).toMatch(/disabled=\{loading\}/);
  });

  it("DEFECT (source): undo/redo compose their canUndo/canRedo disabled forms with the loading gate", () => {
    // THE COMPOSED-DISABLED PIN: the history pair is the sharpest
    // member — an undo during the window flips saveState on the
    // outgoing store and the already-attached subscriber arms the
    // 800ms timer (the mutation persists after navigation).
    expect(editorViewSource).toMatch(/disabled=\{!canUndo \|\| loading\}/);
    expect(editorViewSource).toMatch(/disabled=\{!canRedo \|\| loading\}/);
  });

  it("DEFECT (source): the keyboard modality stands down through the effect-synced loadingRef — after the flush, before the capture", () => {
    // THE KEYBOARD-GATE PIN (the F107 event-modality member): the
    // window listener's closure is mount-stale for component state
    // (the effect deps are [onOpenShortcuts]), so the gate reads the
    // effect-synced ref. The placement keeps the S120-A form true:
    // flush (the outgoing burst commits where it belongs) → guard (no
    // NEW mutations) → store capture.
    expect(editorViewSource).toMatch(/const loadingRef = React\.useRef\(true\);/);
    expect(editorViewSource).toMatch(/loadingRef\.current = loading;/);
    expect(keydownBlock).toMatch(/if \(loadingRef\.current\) return;/);
    const flushAt = keydownBlock.indexOf("flushIdleBurst();");
    const guardAt = keydownBlock.indexOf("if (loadingRef.current) return;");
    const captureAt = keydownBlock.indexOf("const store = useEditorStore.getState();");
    expect(flushAt).toBeGreaterThan(-1);
    expect(guardAt).toBeGreaterThan(flushAt);
    expect(captureAt).toBeGreaterThan(guardAt);
  });

  it("DEFECT (source): the keydown registration names the mount-stale closure and the loading-gate member", () => {
    expect(keydownBlockCollapsed).toMatch(/S121-A \/ A121-L1/);
    expect(keydownBlockCollapsed).toMatch(/mount-stale/);
    expect(keydownBlockCollapsed).toMatch(/loadingRef/);
  });
});

// ---------------------------------------------------------------------------
// S121-B — the AI send liveness guard (A121-L2)
// ---------------------------------------------------------------------------

describe("S121-B the AI send liveness guard (A121-L2)", () => {
  it("DEFECT (source): the AiAssistant carries an aliveRef set false by its own cleanup — the StrictMode-safe form", () => {
    // THE REF PIN: the effect body resets true (the StrictMode
    // remount); the cleanup sets false (the unmount — the plain exit
    // AND the S120-B gate's own swap unmount). The registration names
    // the falsified S120-B claim and the silent-refusal form.
    expect(aiAssistantSource).toMatch(/const aliveRef = React\.useRef\(true\);/);
    expect(aiAssistantSource).toMatch(/aliveRef\.current = true;/);
    expect(aiAssistantSource).toMatch(/aliveRef\.current = false;/);
    expect(aiAssistantCollapsed).toMatch(/S121-B \/ A121-L2/);
    expect(aiAssistantCollapsed).toMatch(/SILENTLY/);
  });

  it("DEFECT (source): the send continuation refuses SILENTLY when departed — before the preApply capture, before any apply", () => {
    // THE GUARD PIN: a dead surface never mutates the departed store
    // (the apply would create the very edit the S120-B closure claims
    // "must never be created") and never renders into a departed
    // tree (the honest refusal message would go nowhere).
    expect(aiAssistantSource).toMatch(/if \(!aliveRef\.current\) return;/);
    const guardAt = aiAssistantSource.indexOf("if (!aliveRef.current) return;");
    const preApplyAt = aiAssistantSource.indexOf("const preApply = useEditorStore.getState();");
    expect(guardAt).toBeGreaterThan(-1);
    expect(preApplyAt).toBeGreaterThan(guardAt);
  });
});

// ---------------------------------------------------------------------------
// The survival set — the forms the S121 fixes must never disturb
// ---------------------------------------------------------------------------

describe("the S121 survival set", () => {
  it("SURVIVAL (source): the S120-B assistant gate and the Canvas gate survive unchanged", () => {
    expect(editorViewSource).toMatch(/Loading canvas…/);
    expect(editorViewSource).toMatch(/Loading assistant…/);
    expect(editorViewSource).toMatch(
      /className="h-80 flex-shrink-0 border-t border-editor-border bg-editor-panel"/,
    );
  });

  it("SURVIVAL (source): the S120-A flush placement and registration survive the loading-guard insertion", () => {
    // flushAt < captureAt still holds with the guard between them
    // (asserted in the DEFECT pin); here the S120-A registration's
    // own tokens must survive the extension verbatim.
    expect(keydownBlockCollapsed).toMatch(/S120-A \/ A120-L1/);
    expect(keydownBlockCollapsed).toMatch(/moves no focus/);
    expect(keydownBlockCollapsed).toMatch(/color-swatch/);
    expect(keydownBlockCollapsed).toMatch(/future:\[\]/);
  });

  it("SURVIVAL (source): the Share button stays URL-scoped and ungated — the URL already points at the incoming project", () => {
    // THE HONEST-EXCLUSION PIN: onShare reads window.location.href
    // (the navigation already happened), so gating Share would refuse
    // a CORRECT link — the exclusion is the fix's own scope
    // discipline, not an omission.
    expect(shareBlock).not.toMatch(/disabled=\{loading\}/);
    expect(editorViewSource).toMatch(/window\.location\.href/);
  });

  it("SURVIVAL (source): the send's scope/epoch belts survive — the liveness guard composes, never replaces", () => {
    expect(aiAssistantSource).toMatch(/sendScopeId !== "" && preApply\.projectId !== sendScopeId/);
    expect(aiAssistantSource).toMatch(/sendEpoch !== preApply\.boardEpoch/);
  });

  it("SURVIVAL (source): the s121 script rides its OWN token — nav121 + the isolated log, never the frozen s120 form", () => {
    expect(nav121Source).toMatch(/--session nav121/);
    expect(nav121Source).toMatch(/digma-nav121\.log/);
    expect(nav121Source).not.toMatch(/nav120/);
    // The run's own descriptors: the 98th consecutive session, the
    // FINAL S121 build, the S120 delivery + the S121 remediation.
    expect(nav121Source).toMatch(/98th consecutive session/);
    expect(nav121Source).toMatch(/FINAL S121 build/);
    expect(nav121Source).toMatch(/the S120 delivery bf1a1f4 \+ the S121 remediation/);
  });

  it("SURVIVAL (source): the ref-audit s121 provenance anchors — live121, the s131 evidence dir, the 97th form, the 58th clip ordinal, the S120 delivery", () => {
    expect(refAudit121Source).toMatch(/--session live121/);
    expect(refAudit121Source).toMatch(/ref-audit-s131/);
    expect(refAudit121Source).toMatch(/97th reference audit/);
    expect(refAudit121Source).toMatch(/byte-identical the 58th/);
    expect(refAudit121Source).toMatch(/the S120 delivery at HEAD bf1a1f4/);
    expect(refAudit121Source).not.toMatch(/live120/);
  });

  it("SURVIVAL (source): the seo-check s121 tokens — the isolated log, the session-121 cycle descriptor", () => {
    expect(seo121Source).toMatch(/digma-seo-s121\.log/);
    expect(seo121Source).toMatch(/session 121, S121-cycle/);
    expect(seo121Source).not.toMatch(/digma-seo-s120\.log/);
  });
});
