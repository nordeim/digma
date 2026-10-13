import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-125 spec (the seventy-third audit's chosen work):
//
// S125-A — THE AI REVERT'S GESTURE STAND-DOWN (A125-L1, the headline):
//   the S124-B pointer closure guarded the header Undo/Redo pair — but
//   the Revert button on an applied AI reply dispatches the OTHER
//   base-swapping store action (restoreSnapshot replaces the elements
//   array, pushes the current state onto past, and wipes future: [])
//   with no gesture stand-down: a mid-drag revert swaps the base under
//   the live gesture (the drag's ticks then commit history-free over
//   the RESTORED base — the ids match the restored copies), and the
//   terminal endGesture pushes the pre-drag snapshot on top, so one
//   undo silently un-reverts the Revert — the A120-L1/A123-L1/A124-I1
//   symptom family's last pointer dispatcher. The closure: the S124-B
//   form at the revertMessage dispatcher — after the scope/epoch
//   belts, capture the store, stand down through a live gesture, then
//   dispatch. The armed-burst window rides the same guard (the
//   safe-direction form — the dropped click the honest refusal).
//
// S125-B — THE SLIDER BEGIN'S SAME-SURFACE FLUSH (A125-L2): the S64-B
//   flush doctrine ("a superseded gesture that CHANGED is flushed
//   FIRST") never reached the same-surface interleave — all panel
//   sliders share the one "slider" token, so a second pointer's press
//   on a second slider mid-drag took the same-surface path: no flush,
//   no fresh arm, and the unconditional changed = false wiped the
//   first slider's tick record — the terminal finish ran cancelGesture
//   and the armed pre-gesture snapshot was DISCARDED (the first
//   slider's history-free ticks with no undo entry, and any post-
//   cancel ticks committing per-tick — the S62-A flooding). The
//   closure: the flush branch and the arm branch both lose their
//   surface-difference conditions — a same-surface re-begin flushes
//   the CHANGED gesture first and arms a FRESH gesture for the second
//   pointer; the foreign-ride and ride-under forms unchanged.
//
// S125-C — THE FOURTH-SITE CITATION RE-ANCHOR (B125-L1): auth.ts's
//   "Hand-rolled cookie sessions (ADR-003 in the inherited
//   architecture)" survived the S124-D three-site sweep — the live
//   parenthetical form, in the very file the sweep's own registration
//   comments assert never carried that registry. The PAD's own
//   ADR-003 IS the hand-rolled-sessions decision (the number was
//   honest; only the registry framing was false). The re-anchor cites
//   the PAD's registry directly, and the census widens src-wide: no
//   LIVE citation parenthetical anywhere under src/.
//
// S125-D — THE REGISTRATION PAIR (A125-I2 + B125-I2): the S124-B
//   registration gains the armed-burst clause (the pointer form's
//   non-discriminating guard covers the armed-burst window too — the
//   keyboard twin flushes first per S120-A; the drop is the safe
//   direction); the PAD §6.1 S5 row and the AGENTS auth bullet gain
//   the "credential-asserting" tightening (logout and me ride no
//   limiter by design).
//
// The script family (the S118-C convention, s125 form): the s125
//   parity scripts ride their OWN tokens (live125 / nav125 /
//   digma-seo-s125.log, the 101st audit / 102nd session / 62nd clip
//   ordinals, the S124 delivery at HEAD 345eba9), never the frozen
//   s124 forms.

const aiAssistantSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const propertiesPanelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const editorViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const authSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/auth.ts"),
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
const agentsSource = readFileSync(
  path.resolve(import.meta.dirname, "../AGENTS.md"),
  "utf8",
);
const nav125Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s125.sh"),
  "utf8",
);
const refAudit125Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s125.sh"),
  "utf8",
);
const seo125Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s125.sh"),
  "utf8",
);

/** The live citation parenthetical — the form the S124-D/S125-C
 * re-anchors retire. The registration comments may NAME the
 * historical form (quoted, never parenthesized — the repo's honesty
 * convention). */
const LIVE_CITATION = /\(ADR-\d+ in the inherited architecture\)/;

/** The comment-stripped collapsed view (the F89/F100 form the s118/
 * s119/s120/s121/s122/s123/s124 specs established: line prefixes
 * stripped BEFORE the join so multi-line comment targets stay
 * visible). */
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

describe("the S125 defect set", () => {
  it("DEFECT (source): the AI Revert stands down through a live gesture — the capture, the guard, the dispatch, after the epoch belt", () => {
    const fnStart = aiAssistantSource.indexOf("function revertMessage(id: string)");
    expect(fnStart).toBeGreaterThan(-1);
    const epochAt = aiAssistantSource.indexOf(
      "message.scopeEpoch !== useEditorStore.getState().boardEpoch",
    );
    expect(epochAt).toBeGreaterThan(fnStart);
    const captureAt = aiAssistantSource.indexOf(
      "const store = useEditorStore.getState();",
      fnStart,
    );
    const guardAt = aiAssistantSource.indexOf(
      "if (store.gestureSnapshot) return;",
      fnStart,
    );
    const dispatchAt = aiAssistantSource.indexOf(
      "store.restoreSnapshot(message.revertSnapshot);",
    );
    // The belts keep their standing order AHEAD of the guard (a
    // wrong-scope or wrong-epoch revert refuses before the gesture
    // window is even consulted).
    expect(captureAt).toBeGreaterThan(epochAt);
    expect(guardAt).toBeGreaterThan(captureAt);
    expect(dispatchAt).toBeGreaterThan(guardAt);
  });

  it("DEFECT (source): the S125-A registration names the family — the S124-B sibling, the RESTORED base, the destroyed redo, the dropped click", () => {
    const fnStart = aiAssistantSource.indexOf("function revertMessage(id: string)");
    const fnEnd = aiAssistantSource.indexOf("async function send(", fnStart);
    const region = aiAssistantSource.slice(fnStart, fnEnd);
    const collapsedRegion = collapsed(region);
    expect(collapsedRegion).toMatch(/S125-A \/ A125-L1/);
    expect(collapsedRegion).toMatch(/S124-B/);
    expect(collapsedRegion).toMatch(/RESTORED base/);
    expect(collapsedRegion).toMatch(/future:\[\]/);
    expect(collapsedRegion).toMatch(/dropped click/);
  });

  it("DEFECT (source): the begin flush branch drops the surface-difference condition — the same-surface re-begin flushes a CHANGED gesture", () => {
    const beginAt = propertiesPanelSource.indexOf("begin: (surface: string) => {");
    expect(beginAt).toBeGreaterThan(-1);
    const bodyEnd = propertiesPanelSource.indexOf("tick: () => {", beginAt);
    const body = propertiesPanelSource.slice(beginAt, bodyEnd);
    // The widened S64-B form: whatever token the second pointer
    // carries, a CHANGED owned gesture flushes FIRST.
    expect(body).toMatch(
      /if \(activeSurface !== null && changed && ownsCurrentGesture\(\)\) \{\s*store\.endGesture\(\);/,
    );
    expect(body).not.toMatch(/activeSurface !== surface && changed/);
  });

  it("DEFECT (source): the begin arm branch drops the surface-difference condition — a free store arms fresh, a foreign gesture still rides under", () => {
    const beginAt = propertiesPanelSource.indexOf("begin: (surface: string) => {");
    const bodyEnd = propertiesPanelSource.indexOf("tick: () => {", beginAt);
    const body = propertiesPanelSource.slice(beginAt, bodyEnd);
    // The widened S66-A form: after the same-surface flush the store
    // is free and the second pointer arms its OWN gesture.
    expect(body).toMatch(
      /const live = useEditorStore\.getState\(\);\s*if \(live\.gestureSnapshot === null\) \{\s*live\.beginGesture\(\);/,
    );
    expect(body).not.toMatch(/activeSurface === null \|\| activeSurface !== surface/);
  });

  it("DEFECT (source): the S125-B registration names the interleave — the same-surface re-begin, the discarded snapshot, the S62-A flooding", () => {
    const beginAt = propertiesPanelSource.indexOf("begin: (surface: string) => {");
    const bodyEnd = propertiesPanelSource.indexOf("tick: () => {", beginAt);
    const region = propertiesPanelSource.slice(beginAt, bodyEnd);
    const collapsedRegion = collapsed(region);
    expect(collapsedRegion).toMatch(/S125-B \/ A125-L2/);
    expect(collapsedRegion).toMatch(/[Ss]ame-[Ss]urface/);
    expect(collapsedRegion).toMatch(/cancelGesture/);
    expect(collapsedRegion).toMatch(/S62-A/);
  });

  it("DEFECT (source): auth.ts cites the PAD's own registry — the inherited-architecture parenthetical gone, the PAD ADR-003 anchor present", () => {
    expect(authSource).not.toMatch(LIVE_CITATION);
    expect(authSource).toMatch(/PAD ADR-003/);
  });

  it("DEFECT (census): no LIVE inherited-architecture citation parenthetical anywhere under src/ — the citation-form census the S124-D sweep lacked", () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (/\.(ts|tsx)$/.test(entry.name)) {
          const text = readFileSync(full, "utf8");
          if (LIVE_CITATION.test(text)) offenders.push(full);
        }
      }
    };
    walk(path.resolve(import.meta.dirname, "../src"));
    expect(offenders).toEqual([]);
  });

  it("DEFECT (source): the S124-B registration gains the armed-burst clause — the non-discriminating guard registered as the safe direction", () => {
    const undoAt = editorViewSource.indexOf('aria-label="Undo"');
    const redoAt = editorViewSource.indexOf('aria-label="Redo"');
    expect(undoAt).toBeGreaterThan(-1);
    const region = editorViewSource.slice(
      Math.max(0, undoAt - 1800),
      redoAt + 400,
    );
    const collapsedRegion = collapsed(region);
    expect(collapsedRegion).toMatch(/armed-burst/);
    expect(collapsedRegion).toMatch(/S120-A/);
    expect(collapsedRegion).toMatch(/safe direction/);
  });

  it("DEFECT (docs): the PAD §6.1 S5 row tightens onto the credential-asserting form", () => {
    const rowAt = padSource.indexOf("| S5 |");
    expect(rowAt).toBeGreaterThan(-1);
    const row = padSource.slice(rowAt, padSource.indexOf("\n", rowAt));
    expect(row).toMatch(/The credential-asserting auth routes are rate-limited/);
  });

  it("DEFECT (docs): the AGENTS auth bullet tightens the same form — logout and me named as the limiter-free exceptions", () => {
    const bulletAt = agentsSource.indexOf("**Auth is hand-rolled**");
    expect(bulletAt).toBeGreaterThan(-1);
    const bullet = agentsSource.slice(
      bulletAt,
      agentsSource.indexOf("\n- ", bulletAt),
    );
    expect(bullet).toMatch(/credential-asserting auth routes are rate-limited/);
    expect(bullet).toMatch(/logout/);
  });
});

// ---------------------------------------------------------------------------
// The survival set — GREEN pre-fix AND post-fix (the standing forms
// the remediation must not disturb)
// ---------------------------------------------------------------------------

describe("the S125 survival set", () => {
  it("SURVIVAL (source): the S124-B pointer stand-down keeps its form — both buttons' capture, guard, dispatch, in order", () => {
    const undoAt = editorViewSource.indexOf('aria-label="Undo"');
    const redoAt = editorViewSource.indexOf('aria-label="Redo"');
    const undoRegion = editorViewSource.slice(Math.max(0, undoAt - 700), undoAt);
    const redoRegion = editorViewSource.slice(Math.max(0, redoAt - 700), redoAt);
    for (const [region, dispatch] of [
      [undoRegion, "store.undo();"],
      [redoRegion, "store.redo();"],
    ] as const) {
      const captureAt = region.indexOf("const store = useEditorStore.getState();");
      const guardAt = region.indexOf("if (store.gestureSnapshot) return;");
      const dispatchAt = region.indexOf(dispatch);
      expect(captureAt).toBeGreaterThan(-1);
      expect(guardAt).toBeGreaterThan(captureAt);
      expect(dispatchAt).toBeGreaterThan(guardAt);
    }
    // The loading-gate composition survives.
    expect(editorViewSource).toMatch(/disabled=\{!canUndo \|\| loading\}/);
    expect(editorViewSource).toMatch(/disabled=\{!canRedo \|\| loading\}/);
  });

  it("SURVIVAL (source): the S124-A family arm keeps its form at the login seam — the 503 envelope beside the standing P2025 404", () => {
    expect(loginSource).toMatch(/\(error\.code === "P2024" \|\| error\.code === "P2028"\)/);
    expect(loginSource).toMatch(/fail\("UNAVAILABLE", "[^"]*database timed out[^"]*", 503\)/);
    const p2025At = loginSource.indexOf('error.code === "P2025"');
    const abortAt = loginSource.search(/\(error\.code === "P2024"/);
    expect(p2025At).toBeGreaterThan(-1);
    expect(abortAt).toBeGreaterThan(p2025At);
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

  it("SURVIVAL (scripts): the s125 ref-audit provenance — live125, the 101st audit, the 62nd clip ordinal, the S124 delivery at HEAD 345eba9", () => {
    expect(refAudit125Source).toMatch(/--session live125/);
    expect(refAudit125Source).toMatch(/101st reference audit/);
    expect(refAudit125Source).toMatch(/byte-identical the 62nd/);
    expect(refAudit125Source).toMatch(/the S124 delivery at HEAD 345eba9/);
    expect(refAudit125Source).toMatch(/ref-audit-s135/);
  });

  it("SURVIVAL (scripts): the s125 verify-nav provenance — nav125, the 102nd session, the S125-cycle, the FINAL S125 build", () => {
    expect(nav125Source).toMatch(/--session nav125/);
    expect(nav125Source).toMatch(/102nd consecutive session/);
    expect(nav125Source).toMatch(/102nd session, S125-cycle/);
    expect(nav125Source).toMatch(/the FINAL S125 build/);
    expect(nav125Source).toMatch(/digma-nav125\.log/);
  });

  it("SURVIVAL (scripts): the s125 seo-check provenance — the s125 log token, the S125-cycle summary", () => {
    expect(seo125Source).toMatch(/digma-seo-s125\.log/);
    expect(seo125Source).toMatch(/session 125, S125-cycle/);
  });
});
