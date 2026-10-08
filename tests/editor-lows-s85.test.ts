import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { clampText } from "../src/lib/validation";

// The session-85 editor low batch (S85-A + S85-B — the thirty-third
// audit's A85-M1 + A85-L1).
//
// S85-A — THE DEFECT (A85-M1, the headline): the S61-I adoption guard at
// editor-view.tsx keyed on STORE IDENTITY ALONE — `if (useEditorStore.
// getState().projectId === projectId) { … return; }` — and the zustand
// store is a module singleton with NO reset on unmount, so the most
// common navigation flow (Editor(X) → Back/dashboard → open X again)
// mounted a FRESH EditorView over the stale store, the guard fired, and
// the load GET was skipped entirely: the STALE project name showed (an
// out-of-editor rename never appeared; exportFilename kept the old name
// for the whole session), STALE elements (another tab's edits invisible
// until the next local full-list PUT wrote over them), and cross-session
// undo history (the "load is a lineage break" doctrine violated).
//
// THE FIX: the isMountRun discriminator (captured BEFORE the boundary
// block flips firstRunRef — the S81-B capture already separates the
// mount from the in-instance re-run) joins the guard, so only the
// ADOPTION re-run (the S61-I replaceState case) keeps its skip; plus a
// module-level leave-transport registry — the S62-C at-unmount PUT
// records itself, and a same-project re-entry mount awaits it before
// its GET (the PUT/GET race closure: the GET answering first would load
// pre-transport state and the next local edit would write over the
// final save).
//
// S85-B — THE DEFECT (A85-L1): the TextSection's Content input (the
// shared component both the desktop panel and the mobile Sheet render)
// carried NO maxLength and committed raw — against the server seam
// clampText(raw?.text, 2000) (trim + slice, all-whitespace → null) and
// the store-replacing PUT response: paste >2000 chars rendered locally
// then silently truncated a second later (caret jump), edge whitespace
// visibly lost on the round-trip, whitespace-only content nulled after
// save. THE FIX: the layers-rename sibling's form — maxLength={2000} +
// trim-at-commit on blur with the no-change guard.

const editorViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
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

// ---------------------------------------------------------------------------
// S85-A — the same-project re-entry fresh load (A85-M1, the headline)
// ---------------------------------------------------------------------------

describe("the re-entry guard discriminates the adoption re-run from the fresh mount (S85-A / A85-M1)", () => {
  it("SOURCE — the S61-I guard carries the isMountRun discriminator (a fresh mount re-entering the same project LOADS)", () => {
    // THE DEFECT PIN: pre-fix the guard is `if (useEditorStore.getState()
    // .projectId === projectId)` — store identity alone. The zustand store
    // is a module singleton that never resets projectId on unmount, so the
    // re-entry mount (a FRESH EditorView over the stale store) skipped the
    // load GET. The discriminator: isMountRun is captured BEFORE the
    // boundary block flips firstRunRef (editor-view.tsx's S81-B capture),
    // so only the in-instance adoption re-run (isMountRun=false) keeps the
    // skip.
    expect(editorViewSource).toMatch(
      /if \(!isMountRun && useEditorStore\.getState\(\)\.projectId === projectId\) \{/
    );
  });

  it("SOURCE — the S61-I comment block names the third case (soft re-entry to the SAME project now loads)", () => {
    // The doc's own enumeration previously claimed only two cases ("a
    // refresh (fresh store) and a soft navigation to ANOTHER project both
    // still load") — omitting the re-entry case the guard actually broke.
    // The honest enumeration names all three.
    expect(editorViewSource).toMatch(
      /re-entry to the SAME project|same-project re-entr/i
    );
  });

  it("SOURCE — the module-level leave-transport registry exists (the at-unmount PUT becomes awaitable)", () => {
    // THE DEFECT PIN: pre-fix the S62-C cleanup's PUT is fire-and-forget —
    // a same-project re-entry mount's GET can answer first and load
    // pre-transport state. The registry records the at-unmount transport
    // so the mount boundary can await it.
    // Session 99 (S99-C / A99-L3): the registry is a per-project MAP
    // (the re-anchor is the S93-A precedent — the one-shot slot became
    // a keyed drain: an intermediate project's mount can no longer
    // discard a transport it never awaited — the X→Y→X interleaving).
    expect(editorViewSource).toMatch(
      /const leaveTransports = new Map<string, Promise<unknown>>\(\)/
    );
  });

  it("SOURCE — the S62-C cleanup records its at-unmount PUT into the registry", () => {
    // The record site: the cleanup's raw fetch (the !machineCarriesThisState
    // branch) registers through the ONE seam (registerLeaveTransport —
    // S99-C) with the promise of the transport itself, settled through
    // the existing .catch(() => null).
    expect(editorViewSource).toMatch(
      /registerLeaveTransport\(\s*state\.projectId,/m
    );
  });

  it("SOURCE — the mount's load awaits the same-project leave transport before the GET (the PUT/GET race closure)", () => {
    // The await site: a mount run drains the registry's entry for THE
    // PROJECT BEING LOADED (S99-C's keyed drain — an intermediate
    // project's mount leaves other projects' entries alone) and awaits
    // it — the at-unmount PUT and the mount's GET can otherwise
    // interleave with the GET answering first (loading pre-transport
    // state; the next local edit would then full-list-PUT over the
    // final save).
    expect(editorViewSource).toMatch(
      /const transport = leaveTransports\.get\(projectId\);\s*if \(transport\) \{\s*leaveTransports\.delete\(projectId\);\s*await transport;/
    );
  });
});

// ---------------------------------------------------------------------------
// S85-B — the Text Content clamp family's missed member (A85-L1)
// ---------------------------------------------------------------------------

describe("the Text Content input mirrors the server's clampText at the consumer (S85-B / A85-L1)", () => {
  it("BEHAVIORAL — clampText's length boundary: 2000 passes, 2001 slices to 2000 (the teleport-on-length contract)", () => {
    // THE DEFECT PIN: pre-fix the Content input commits raw — a paste of
    // >2000 chars renders locally, then the PUT response (the store list
    // REPLACED by the server's clamped rows) silently truncates it a
    // second later. The server's own helper holds the boundary.
    expect(clampText("a".repeat(2000), 2000)).toBe("a".repeat(2000));
    expect(clampText("a".repeat(2001), 2000)).toBe("a".repeat(2000));
    expect(clampText("a".repeat(5000), 2000)).toBe("a".repeat(2000));
  });

  it("BEHAVIORAL — clampText's whitespace contract: edge whitespace trims, all-whitespace nulls (the teleport-on-whitespace contract)", () => {
    // THE DEFECT PIN: pre-fix edge whitespace rendered locally (the canvas
    // renders whiteSpace: pre-wrap — edge whitespace is real content) then
    // visibly lost on the round-trip; a whitespace-only content nulled to
    // empty after the save.
    expect(clampText("  edge whitespace  ", 2000)).toBe("edge whitespace");
    expect(clampText("   ", 2000)).toBeNull();
    expect(clampText("", 2000)).toBeNull();
    expect(clampText("kept  inner  spaces", 2000)).toBe("kept  inner  spaces");
  });

  it("SOURCE — the Content input carries maxLength={2000} (the length teleport closed at typing time)", () => {
    // THE DEFECT PIN: pre-fix the input has NO maxLength — every sibling
    // text surface carries its cap (layers rename maxLength={80}, project
    // rename maxLength={120}); the Content input was the one unclamped
    // editable surface whose value round-trips through the store-replacing
    // PUT.
    expect(panelSource).toMatch(
      /maxLength=\{2000\}[\s\S]{0,1200}?aria-label="Text content"/
    );
  });

  it("SOURCE — the blur commits the clamped form through the no-change guard (the whitespace teleport closed at commit time)", () => {
    // The layers-rename sibling's form (S78-C's no-change guard): the
    // commit runs only when the clamped draft DIFFERS — a blur with an
    // unchanged value must not push a history snapshot, wipe redo, flip
    // the badge, and fire a redundant PUT for a byte-identical value.
    expect(panelSource).toMatch(
      /onBlur=\{\(\) => \{\s*sliderGesture\.finish\("text"\);[\s\S]{0,900}?clampText\(element\.text, 2000\)[\s\S]{0,300}?if \(clamped !== \(element\.text \?\? ""\)\) \{\s*update\(\{ text: clamped \}\);/
    );
  });

  it("SOURCE — the trim happens at COMMIT only, never per keystroke (typing mid-text spaces must survive)", () => {
    // The onChange keeps its raw form: a per-keystroke trim would delete a
    // trailing space AS IT IS TYPED (the controlled value re-rendering
    // from the trimmed store). The sibling layers-rename keeps the same
    // split: raw onChange, trimmed onBlur commit.
    expect(panelSource).toMatch(
      /onChange=\{\(event\) => \{\s*sliderGesture\.textTick\(\);\s*update\(\{ text: event\.target\.value \}\);/
    );
  });
});

// ---------------------------------------------------------------------------
// The survival family — the sibling contracts must ride through unchanged
// ---------------------------------------------------------------------------

describe("the S85-B survival family (the sibling clamps unchanged)", () => {
  it("SURVIVAL — the layers-rename sibling keeps its maxLength={80} + trim-at-commit form", () => {
    expect(layersSource).toMatch(/maxLength=\{80\}/);
    expect(layersSource).toMatch(/updateElements\(\[el\.id\], \{ name: renameValue\.trim\(\) \}\)/);
  });

  it("SURVIVAL — the panel's number-field clamps (the S84-B family) ride through unchanged", () => {
    expect(panelSource).toMatch(/update\(\{ fontSize: clampFontSizeField\(fontSize\) \}\)/);
    expect(panelSource).toMatch(/update\(\{ width: clampSizeField\(width, element\.type\) \}\)/);
    expect(panelSource).toMatch(/update\(\{ height: clampSizeField\(height, element\.type\) \}\)/);
  });

  it("SURVIVAL — the adoption re-run's S62-C stale-state normalization survives inside the guarded branch", () => {
    // The stuck-"saving" heal (a disposed flush's terminal "saving"
    // surviving re-entry through the skip) must stay for the adoption
    // re-run path that still reaches the guard.
    expect(editorViewSource).toMatch(
      /if \(useEditorStore\.getState\(\)\.saveState !== "saved"\) \{\s*useEditorStore\.getState\(\)\.setUnsaved\(\);/
    );
  });
});
