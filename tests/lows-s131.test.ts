import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-131 spec (the seventy-ninth audit's chosen work):
//
// S131-A — THE PRESENT OVERLAY'S SWAP-WINDOW UNMOUNT (A131-I1 — the
//   Informational the seventy-ninth audit's editor-side auditor
//   found): the S121-A trigger gate (disabled={loading}) closed the
//   ENTRY side — presenting cannot be ENTERED during a mount/swap
//   GET window — but an ALREADY-OPEN overlay survived the window
//   ({presenting && <MemoizedPresentOverlay />} composed no loading
//   term), painting the OUTGOING project's board (the store
//   singleton still holds it) until loadProject landed. The closure:
//   the mount composed with the load gate — the overlay unmounts
//   through the window and remounts on the incoming board; the
//   failure path settles on the Untitled fallback with loading
//   false, so presenting follows the route, never the outgoing
//   board. The S121-A family's last arm.
//
// S131-B — THE LAYERS-PANEL POINTER ARMS' GESTURE STAND-DOWN
//   (A125-I1 — the deferred queue's head, taken up this cycle):
//   the eye/lock/trash buttons and the DnD drop dispatched
//   history-mutating actions (toggleVisibility, toggleLock,
//   deleteElements, reorderElements) with no gestureSnapshot
//   check, while the keyboard Delete arm's own registration names
//   this exact interleaving as the reason IT stands down. The
//   closure: the S124-B pointer stand-down form at all four sites
//   (capture the store, stand down through a live gesture, then
//   dispatch). The layers drag itself is HTML5 DnD — no gesture
//   armed — so the drop's guard is never self-blocking.
//
// S131-C — THE §7.1 COMBINED-ROW RETIREMENT (B131-I1): session 85
//   added per-file retroactive rows for four files whose checks the
//   two combined summary rows already carried — and kept BOTH. The
//   mechanical row-sum read 1847 vs the table's own 1839 (the live
//   row-sum pin is regex-scoped to single-file rows, so the totals
//   stayed exact — but the latent trap stood for the next
//   arithmetic census). The closure: the two combined rows retired,
//   the per-file rows carry the enumeration.
//
// S131-D — THE §4.1 MERMAID ERA-LABEL REPAIR (B131-I2): "the
//   S70-B-era column set" was imprecise — the drawn set is the
//   pre-S41 illustrative snapshot (fillGradient/fillImage/
//   fillImageFit, scale, fillImageBytes, and the S72-D six-value
//   fontWeight enum all absent). The label now names the accurate
//   era; the canonical-form declaration unchanged.
//
// S131-E — THE WORKLOG AUDIT-LINEAGE RECONSTRUCTION NOTE (B131-I3):
//   the 78th cycle's two fresh-eyes auditor entries never landed in
//   worklog.md (every cycle s106..s129 carries both). The bracketed
//   reconstruction note records the gap and where the census
//   survives.
//
// The script family (the S118-C convention, s131 form): the s131
//   parity scripts ride their OWN tokens (live131 / nav131 /
//   digma-seo-s131.log, the 107th audit / 108th session / 68th clip
//   ordinals, the S130 delivery at HEAD c36cdf3), never the frozen
//   s130 forms.

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const layersSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/layers-panel.tsx"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const worklogSource = readFileSync(
  path.resolve(import.meta.dirname, "../worklog.md"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s131.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s131.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s131.sh"),
  "utf8",
);

// ---------------------------------------------------------------------------
// S131-A — the Present overlay's swap-window unmount (A131-I1)
// ---------------------------------------------------------------------------

describe("S131-A the Present overlay's swap-window unmount (A131-I1)", () => {
  it("DEFECT (source): the mount composes the load gate — presenting never paints the outgoing board through a swap window", () => {
    expect(viewSource).toMatch(
      /\{presenting && !loading && <MemoizedPresentOverlay onExit=\{exitPresent\} \/>\}/,
    );
  });

  it("DEFECT (source): the S131-A registration names the S121-A family's last arm at the mount seam", () => {
    const mountAt = viewSource.indexOf("{presenting && !loading && <MemoizedPresentOverlay");
    expect(mountAt).toBeGreaterThan(-1);
    // 1000-char window (the S102-B class): the S131-A registration
    // comment runs ~920 chars.
    const window = viewSource.slice(Math.max(0, mountAt - 1000), mountAt);
    expect(window).toMatch(/S131-A/);
    expect(window).toMatch(/A131-I1/);
    expect(window).toMatch(/S121-A/);
  });

  it("DEFECT (source): the registration names the failure path's settle truth — the Untitled fallback, loading settling false", () => {
    const mountAt = viewSource.indexOf("{presenting && !loading && <MemoizedPresentOverlay");
    expect(mountAt).toBeGreaterThan(-1);
    const window = viewSource.slice(Math.max(0, mountAt - 1000), mountAt);
    const regAt = window.indexOf("S131-A");
    expect(regAt).toBeGreaterThan(-1);
    // The settle truth lives INSIDE the registration comment (the
    // F100 hollow-slice class: a wide window alone catches "Untitled"
    // from unrelated code above the seam).
    const reg = window.slice(regAt);
    expect(reg).toMatch(/Untitled/);
    expect(reg).toMatch(/loading/);
  });
});

// ---------------------------------------------------------------------------
// S131-B — the layers-panel pointer arms' gesture stand-down (A125-I1)
// ---------------------------------------------------------------------------

describe("S131-B the layers-panel pointer arms' gesture stand-down (A125-I1 — the deferred queue's head)", () => {
  it("DEFECT (source): the eye button — capture, stand down, dispatch (the S124-B form)", () => {
    const idx = layersSource.indexOf("store.toggleVisibility(el.id)");
    expect(idx).toBeGreaterThan(-1);
    // 1300-char back-window (the S102-B class): the S131-B
    // registration comment runs ~1100 chars.
    const block = layersSource.slice(Math.max(0, idx - 1300), idx + 80);
    expect(block).toMatch(/const store = useEditorStore\.getState\(\);/);
    expect(block).toMatch(/if \(store\.gestureSnapshot\) return;/);
    expect(block).toMatch(/S131-B/);
    expect(block).toMatch(/A125-I1/);
  });

  it("DEFECT (source): the lock button — the twin's same stand-down", () => {
    const idx = layersSource.indexOf("store.toggleLock(el.id)");
    expect(idx).toBeGreaterThan(-1);
    const block = layersSource.slice(Math.max(0, idx - 400), idx + 60);
    expect(block).toMatch(/const store = useEditorStore\.getState\(\);/);
    expect(block).toMatch(/if \(store\.gestureSnapshot\) return;/);
    expect(block).toMatch(/S131-B/);
  });

  it("DEFECT (source): the trash button — the twin's same stand-down (deleteElements pushes history)", () => {
    const idx = layersSource.indexOf("store.deleteElements([el.id])");
    expect(idx).toBeGreaterThan(-1);
    const block = layersSource.slice(Math.max(0, idx - 500), idx + 60);
    expect(block).toMatch(/const store = useEditorStore\.getState\(\);/);
    expect(block).toMatch(/if \(store\.gestureSnapshot\) return;/);
    expect(block).toMatch(/S131-B/);
  });

  it("DEFECT (source): the DnD drop — the guard rides the existing store capture, before the index computation (never self-blocking)", () => {
    const dropAt = layersSource.indexOf('onDrop={(event) => {');
    expect(dropAt).toBeGreaterThan(-1);
    const reorderAt = layersSource.indexOf("store.reorderElements([fromId]", dropAt);
    expect(reorderAt).toBeGreaterThan(dropAt);
    const drop = layersSource.slice(dropAt, reorderAt + 60);
    expect(drop).toMatch(/const store = useEditorStore\.getState\(\);/);
    const guardAt = drop.indexOf("if (store.gestureSnapshot) return;");
    const computeAt = drop.indexOf("const remaining =");
    expect(guardAt).toBeGreaterThan(-1);
    expect(computeAt).toBeGreaterThan(-1);
    expect(guardAt).toBeLessThan(computeAt);
    expect(drop).toMatch(/S131-B/);
    // The self-blocking truth: the HTML5 layers drag arms no gesture.
    expect(drop).toMatch(/onDragStart|dataTransfer/);
  });

  it("DEFECT (source): the four-guard census — every layers-panel history-mutating pointer arm stands down", () => {
    const guards = layersSource.match(/if \(store\.gestureSnapshot\) return;/g) ?? [];
    expect(guards.length).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// S131-C — the §7.1 combined-row retirement (B131-I1)
// ---------------------------------------------------------------------------

describe("S131-C the §7.1 combined-row retirement (B131-I1)", () => {
  it("DEFECT (docs): the two combined summary rows are GONE (the per-file rows carry the enumeration)", () => {
    expect(padSource).not.toContain("present overlay + Sheet lifecycle");
    expect(padSource).not.toContain("reset-link guard + Recent mount guard");
  });

  it("DEFECT (docs): the four per-file retroactive rows survive — the enumeration they carry", () => {
    for (const file of [
      "tests/present-overlay.test.ts",
      "tests/sheet-lifecycle.test.ts",
      "tests/recent-mount-guard.test.ts",
      "tests/reset-url-guard.test.ts",
    ]) {
      expect(padSource).toContain(`\`${file}\``);
    }
  });

  it("DEFECT (docs): the retirement clause names session 131 at the retroactive-row seam", () => {
    const rowAt = padSource.indexOf("tests/present-overlay.test.ts");
    expect(rowAt).toBeGreaterThan(-1);
    // The clause sits in the row's NOTE COLUMN, ~450 chars ahead of
    // the file path — the back-window must cover it (the S102-B class).
    const row = padSource.slice(rowAt - 600, rowAt + 400);
    expect(row).toMatch(/S131-C/);
    expect(row).toMatch(/session 131/);
  });
});

// ---------------------------------------------------------------------------
// S131-D — the §4.1 mermaid era-label repair (B131-I2)
// ---------------------------------------------------------------------------

describe("S131-D the §4.1 mermaid era-label repair (B131-I2)", () => {
  it("DEFECT (docs): the imprecise S70-B-era label is gone", () => {
    expect(padSource).not.toContain("S70-B-era column set");
  });

  it("DEFECT (docs): the accurate early-session snapshot label — the absent family named", () => {
    const noteAt = padSource.indexOf("EARLY-SESSION illustrative snapshot");
    expect(noteAt).toBeGreaterThan(-1);
    const note = padSource.slice(noteAt - 100, noteAt + 500);
    expect(note).toMatch(/pre-S41/);
    for (const member of ["fillGradient", "fillImageFit", "fillImageBytes", "fontWeight"]) {
      expect(note, `${member} must be named absent`).toContain(member);
    }
  });
});

// ---------------------------------------------------------------------------
// S131-E — the worklog audit-lineage reconstruction note (B131-I3)
// ---------------------------------------------------------------------------

describe("S131-E the worklog audit-lineage reconstruction note (B131-I3)", () => {
  it("DEFECT (worklog): the bracketed note records the 78th cycle's missing auditor entries", () => {
    expect(worklogSource).toContain("s130-audit-lineage-note");
    const noteAt = worklogSource.indexOf("s130-audit-lineage-note");
    const note = worklogSource.slice(noteAt, noteAt + 1200);
    expect(note).toMatch(/s130-audit-a/);
    expect(note).toMatch(/s130-audit-b/);
  });
});

// ---------------------------------------------------------------------------
// The survival set — the prior closures stay verbatim (GREEN pre-fix)
// ---------------------------------------------------------------------------

describe("the prior closures survive (the S121-A/S124-B/S130 forms)", () => {
  it("SURVIVAL (source): the S121-A trigger gate stays — the Present button's disabled={loading}", () => {
    const presentAt = viewSource.indexOf('aria-label="Present"');
    expect(presentAt).toBeGreaterThan(-1);
    const block = viewSource.slice(presentAt - 500, presentAt + 200);
    expect(block).toMatch(/disabled=\{loading\}/);
    expect(block).toMatch(/S121-A/);
  });

  it("SURVIVAL (source): the S124-B Undo/Redo stand-downs stay verbatim", () => {
    const undoAt = viewSource.indexOf("store.undo();");
    expect(undoAt).toBeGreaterThan(-1);
    const undoBlock = viewSource.slice(undoAt - 400, undoAt);
    expect(undoBlock).toMatch(/if \(store\.gestureSnapshot\) return;/);
    const redoAt = viewSource.indexOf("store.redo();");
    expect(redoAt).toBeGreaterThan(-1);
    const redoBlock = viewSource.slice(redoAt - 200, redoAt);
    expect(redoBlock).toMatch(/if \(store\.gestureSnapshot\) return;/);
  });

  it("SURVIVAL (source): the S130 seams stay — one wheel arm, the finally guard, the pan capture", () => {
    const aiAssistantSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
      "utf8",
    );
    expect(aiAssistantSource).toMatch(/if \(aliveRef\.current\) setSending\(false\);/);
    const panelSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
      "utf8",
    );
    expect(panelSource).toMatch(
      /onWheel=\{\(\) => sliderGesture\.keyTick\("slider:Rotation"\)\}/,
    );
    const canvasSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
      "utf8",
    );
    expect(canvasSource).toMatch(
      /\(event\.currentTarget as HTMLElement\)\.setPointerCapture/,
    );
  });

  it("SURVIVAL (source): the s131 parity scripts ride their OWN tokens — the 107th audit / 108th session / 68th clip ordinals, the S130 delivery at HEAD c36cdf3", () => {
    expect(refAuditSource).toContain("live131");
    expect(refAuditSource).not.toContain("live130");
    expect(refAuditSource).toContain("107th reference audit");
    expect(refAuditSource).toContain("c36cdf3");
    expect(refAuditSource).toContain("68th");
    expect(navSource).toContain("nav131");
    expect(navSource).not.toContain("nav130");
    expect(navSource).toContain("108th session");
    expect(seoSource).toContain("digma-seo-s131");
    expect(seoSource).toContain("session 131");
  });
});
