import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-120 spec (the sixty-eighth audit's chosen work):
//
// S120-A — the KEYBOARD-HISTORY ENTRY FLUSH (A120-L1, the headline):
//   the shortcut handler's history arms (undo/redo, Delete/Backspace)
//   dispatched against history with no flushIdleBurst — and the click
//   family's blur-precedes-commit ordering NEVER fires for a keyboard
//   event (no focus move), while isTypingTarget's S64-G/S83-G carve-out
//   (type="color" is not a typing target) makes the shortcuts REACHABLE
//   exactly where an idle-armed color-swatch burst can sit (the swatch's
//   onChange arms the 150ms text burst, terminated only by onBlur).
//   Without the flush, a Ctrl+Z inside the window pops a past entry
//   older than the pending color change while endGesture's future:[]
//   then destroys the redo the undo just created (and Delete inverts
//   the history intent order). The closure: ONE flushIdleBurst() at the
//   handler's entry — after the stand-down guards, BEFORE the store
//   capture (the flush mutates the history arrays; the captured state
//   reference must postdate it) — the same entry-flush form the AI
//   apply rides (S118-B).
//
// S120-B — the ASSISTANT LOADING GATE (A120-L2): the AiAssistant
//   rendered OUTSIDE the loading gate — fully interactive while the
//   mount GET stalls, capturing the OUTGOING project's scope (the store
//   singleton still holds it), so the reply's apply mutated the WRONG
//   project with no transporter (the mount-run flush pair skips by the
//   S81-B guard; the 800ms timer fires into loadProject's "saved"
//   stamp). The closure: the assistant renders only when !loading, the
//   h-80 wrapper ALWAYS renders (the parity datum — the reference's
//   320px chat column — stays measurable at every instant), and the
//   loading window shows the Canvas's own placeholder form.
//
// S120-C — the CENSUS FIGURE-FREE RE-ANCHOR (B120-L1): the
//   arithmetic-coherence guard's own comment carried "54 rows today"
//   while the live census collected 61 (the S119 delivery's own doc
//   additions grew the table in the same commit) — the F78 count-truth
//   doctrine violated inside the guard that enforces it. The closure:
//   the comment reworded onto the conservative-floor form (never a
//   hand-maintained "N rows today") and the failure messages carry the
//   LIVE count, derived at run time.
//
// S120-D — the per-session script family (the S118-C convention, s120
//   form): the s120 verify-nav script rides its OWN agent-browser
//   session token (nav120) + log token (digma-nav120.log), never the
//   frozen s119 forms — pinned bidirectionally with the frozen s119
//   script keeping its own token, plus the ref-audit/seo-check s120
//   provenance anchors (live120, ref-audit-s130, the 96th audit form,
//   the 57th consecutive clip ordinal, the S119 delivery at HEAD
//   9c7e8b3, digma-seo-s120.log).

const editorViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const editorLibSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const aiAssistantSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const lowsS119Source = readFileSync(
  path.resolve(import.meta.dirname, "../tests/lows-s119.test.ts"),
  "utf8",
);
const nav120Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s120.sh"),
  "utf8",
);
const nav119Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s119.sh"),
  "utf8",
);
const refAudit120Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s120.sh"),
  "utf8",
);
const seo120Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s120.sh"),
  "utf8",
);

/** The shortcut handler's keydown slice — from the handler's opening
 * line to the undo branch's opening (the S120-A boundary: the flush
 * must live between the stand-down guards and the store capture). */
const onKeyDownStart = editorViewSource.indexOf("function onKeyDown(event: KeyboardEvent)");
const undoBranchStart = editorViewSource.indexOf('if (meta && event.key.toLowerCase() === "z")', onKeyDownStart);
const keydownBlock = editorViewSource.slice(onKeyDownStart, undoBranchStart);

/** The assistant column slice — anchored on the column's opening
 * comment (the S120-B boundary: the registration lives in the comment
 * ABOVE the always-rendered h-80 wrapper, the gate INSIDE it). */
const assistantColAnchor = editorViewSource.indexOf(
  "AI assistant — bottom of the canvas column",
);
const assistantCol = editorViewSource.slice(assistantColAnchor, assistantColAnchor + 2000);

/** The comment-stripped collapsed view (the F89/F100 form the s118/s119
 * specs established: line prefixes stripped BEFORE the join so multi-line
 * comment targets stay visible — the S120-B registration's `S120-B /` and
 * `A120-L2` wrap across source lines). */
function collapsed(source: string): string {
  return source
    .split("\n")
    .map((l) => l.replace(/^\s*(?:\/\/|#)\s?/, "").trim())
    .filter((l) => l.length > 0)
    .join(" ")
    .replace(/\s+/g, " ");
}
const keydownBlockCollapsed = collapsed(keydownBlock);
const assistantColCollapsed = collapsed(assistantCol);

// ---------------------------------------------------------------------------
// S120-A — the keyboard-history entry flush (A120-L1 — the headline)
// ---------------------------------------------------------------------------

describe("S120-A the keyboard-history entry flush (A120-L1 — the headline)", () => {
  it("DEFECT (source): editor-view imports the flushIdleBurst primitive from the properties panel", () => {
    // THE IMPORT PIN: the primitive is exported by properties-panel
    // (S118-B); the shortcut seam rides the same import the AI apply
    // rides (ai-assistant.tsx:7).
    expect(editorViewSource).toMatch(
      /import \{[^}]*flushIdleBurst[^}]*\} from "\.\/properties-panel";/,
    );
  });

  it("DEFECT (source): the keydown handler flushes the idle burst at ENTRY — after the stand-down guards, BEFORE the store capture", () => {
    // THE PLACEMENT PIN (the entry-flush form): the flush must precede
    // the getState() capture — the flush pushes the burst's history
    // entry, and the captured state reference must postdate it.
    expect(keydownBlock).toMatch(/flushIdleBurst\(\);/);
    const flushAt = keydownBlock.indexOf("flushIdleBurst();");
    const captureAt = keydownBlock.indexOf("const store = useEditorStore.getState();");
    expect(flushAt).toBeGreaterThan(-1);
    expect(captureAt).toBeGreaterThan(flushAt);
  });

  it("DEFECT (source): the registration names the keyboard member — no focus move, the carve-out interplay, the primitive's discrimination", () => {
    // THE REGISTRATION PIN (the F106 ordering-registration member): the
    // argument is invisible at the call site — a keyboard event moves
    // no focus (the click family's blur ordering never fires), and the
    // S64-G/S83-G carve-out makes the shortcuts reachable exactly
    // where an idle-armed color-swatch burst can sit.
    expect(keydownBlockCollapsed).toMatch(/S120-A \/ A120-L1/);
    expect(keydownBlockCollapsed).toMatch(/moves no focus/);
    expect(keydownBlockCollapsed).toMatch(/color-swatch/);
    expect(keydownBlockCollapsed).toMatch(/future:\[\]/);
  });

  it("SURVIVAL (source): the isTypingTarget carve-out survives — the fix flushes, it never narrows the S64-G/S83-G form", () => {
    // The carve-out is the FEATURE (Ctrl+Z must stay live on the color
    // pickers); the fix closes the ordering hazard at the flush, not by
    // standing the shortcuts down behind the pickers.
    const fnStart = editorLibSource.indexOf("export function isTypingTarget");
    const fnEnd = editorLibSource.indexOf("}", editorLibSource.indexOf("return tag ==="));
    const fn = editorLibSource.slice(fnStart, fnEnd);
    expect(fn).toMatch(/type !== "range" && type !== "color"/);
  });

  it("SURVIVAL (source): the AI apply's entry flush survives (the S118-B form the keyboard flush mirrors)", () => {
    expect(aiAssistantSource).toMatch(/import \{ flushIdleBurst \} from "\.\/properties-panel";/);
    expect(aiAssistantSource).toMatch(/flushIdleBurst\(\);/);
  });
});

// ---------------------------------------------------------------------------
// S120-B — the assistant loading gate (A120-L2)
// ---------------------------------------------------------------------------

describe("S120-B the assistant loading gate (A120-L2)", () => {
  it("DEFECT (source): the AiAssistant renders only OUTSIDE the loading gate, inside the always-rendered h-80 wrapper", () => {
    // THE GATE PIN: the ternary mirrors the Canvas gate's own form;
    // the wrapper class stays OUTSIDE the ternary (the parity datum —
    // the reference's 320px chat column — measurable at every instant).
    expect(assistantCol).toMatch(/\{loading \? \(/);
    expect(assistantCol).toMatch(/Loading assistant…/);
    expect(assistantCol).toMatch(/<AiAssistant \/>/);
    const ternaryAt = assistantCol.indexOf("{loading ? (");
    const assistantAt = assistantCol.indexOf("<AiAssistant />");
    expect(ternaryAt).toBeGreaterThan(-1);
    expect(assistantAt).toBeGreaterThan(ternaryAt);
  });

  it("DEFECT (source): the registration names the stale-scope argument and the mount-run skip it closes around", () => {
    expect(assistantColCollapsed).toMatch(/S120-B \/ A120-L2/);
    expect(assistantColCollapsed).toMatch(/loading gate/);
    expect(assistantColCollapsed).toMatch(/S81-B/);
  });

  it("SURVIVAL (source): the Canvas's own loading gate and placeholder survive unchanged", () => {
    expect(editorViewSource).toMatch(/Loading canvas…/);
    expect(editorViewSource).toMatch(/\{loading \? \(/);
  });

  it("SURVIVAL (source): the parity wrapper keeps the reference's measured chat-column form (h-80 border-t)", () => {
    expect(editorViewSource).toMatch(
      /className="h-80 flex-shrink-0 border-t border-editor-border bg-editor-panel"/,
    );
  });
});

// ---------------------------------------------------------------------------
// S120-C — the census figure-free re-anchor (B120-L1)
// ---------------------------------------------------------------------------

describe("S120-C the census figure-free re-anchor (B120-L1)", () => {
  it("DEFECT (source): the guard's comment never carries a hand-maintained live count — the figure lives in the failure message", () => {
    // THE FIGURE-FREE PIN (the F78 doctrine inside the guard that
    // enforces it): "54 rows today" was outdated by the same commit's
    // own doc additions (61 live). The failure message derives the
    // count at run time.
    expect(lowsS119Source).not.toMatch(/rows today/);
    expect(lowsS119Source).toMatch(/censused only \$\{rows\.length\} rows/);
    expect(lowsS119Source).toMatch(/\$\{impossible\.length\} impossible of \$\{rows\.length\} censused rows/);
  });

  it("SURVIVAL (source): the census floor and the impossible-[] assertion survive the re-anchor", () => {
    // The S119-A guard's own teeth stay: the conservative floor (45)
    // and the zero-impossible invariant.
    expect(lowsS119Source).toMatch(/toBeGreaterThanOrEqual\(45\)/);
    expect(lowsS119Source).toMatch(/expect\(impossible[^)]*\)\.toEqual\(\[\]\)/);
  });
});

// ---------------------------------------------------------------------------
// S120-D — the script token isolation (the s120 form of the S118-C convention)
// ---------------------------------------------------------------------------

describe("S120-D the script token isolation (the s120 form of the S118-C convention)", () => {
  it("SURVIVAL (source): the s120 script rides its OWN token — nav120 + the isolated log, never the frozen s119 form", () => {
    expect(nav120Source).toMatch(/--session nav120/);
    expect(nav120Source).toMatch(/digma-nav120\.log/);
    expect(nav120Source).not.toMatch(/nav119/);
    // The run's own descriptors: the 97th consecutive session, the
    // FINAL S120 build, the S119 delivery + the S120 remediation.
    expect(nav120Source).toMatch(/97th consecutive session/);
    expect(nav120Source).toMatch(/FINAL S120 build/);
    expect(nav120Source).toMatch(/the S119 delivery 9c7e8b3 \+ the S120 remediation/);
  });

  it("SURVIVAL (source): the frozen s119 script keeps its own token (the evidence form)", () => {
    expect(nav119Source).toMatch(/--session nav119/);
    expect(nav119Source).toMatch(/digma-nav119\.log/);
  });

  it("SURVIVAL (source): the ref-audit s120 provenance anchors — live120, the s130 evidence dir, the 96th form, the 57th clip ordinal, the S119 delivery", () => {
    expect(refAudit120Source).toMatch(/--session live120/);
    expect(refAudit120Source).toMatch(/ref-audit-s130/);
    expect(refAudit120Source).toMatch(/96th reference audit/);
    expect(refAudit120Source).toMatch(/byte-identical the 57th/);
    expect(refAudit120Source).toMatch(/the S119 delivery at HEAD 9c7e8b3/);
    expect(refAudit120Source).not.toMatch(/live119/);
  });

  it("SURVIVAL (source): the seo-check s120 tokens — the isolated log, the session-120 cycle descriptor", () => {
    expect(seo120Source).toMatch(/digma-seo-s120\.log/);
    expect(seo120Source).toMatch(/session 120, S120-cycle/);
    expect(seo120Source).not.toMatch(/digma-seo-s119\.log/);
  });
});
