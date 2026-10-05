import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-78 client low batch (S78-A + S78-C + S78-D + S78-F + the
// client half of S78-G — the twenty-sixth audit's A-M1, A-L1, A-L2,
// A-L3, A-L4, A-L5, A-L6, A-I1, A-I2, A-I3).
//
// S78-A — THE DEFECT (A-M1, the headline): the AI transcript and its
// revert snapshots survived a soft project swap. The messages state and
// every revertSnapshot carrier were initialized once and NEVER
// project-scoped — after a soft /Editor?projectId=A -> /Editor?projectId=B
// swap (the same component instance; the S77-E fix established the path
// and re-armed the loading gate), the transcript kept project A's
// conversation while the user edited B, a surviving Revert button called
// restoreSnapshot with project A's elements into project B's live store
// (flipping saveState to unsaved and triggering the autosave PUT of
// project A's element list INTO project B — persisted cross-project
// clobber), and a mid-await send let an AI batch computed against
// project A's request land into B.
//
// THE FIX — three coordinated layers: (1) every applied-reply message
// carries the store's projectId captured at send time (scopeId on the
// ChatMessage) and revertMessage bails when a NAMED scope no longer
// matches the live store (a snapshot captured under Untitled "" follows
// the canvas through the adoption transition); (2) send() re-reads the
// store's projectId after the await — a NAMED send-scope that no longer
// matches answers the honest refusal and NEVER applies the operations;
// (3) a store subscription resets the transcript to the intro bubble on
// a NAMED-scope transition (either direction, including -> Untitled)
// EXCEPT the Untitled adoption ("" -> id, the attachProject first-save
// flow: the canvas lineage is the same and an in-progress conversation
// must survive its own project's creation).
//
// S78-C — THE DEFECTS (A-L1, A-L2, A-L5): the layers rename blur
// committed an UNCHANGED name (no !== guard — a rename-open-then-blur
// pushed a history snapshot, wiped redo, and fired a redundant PUT for
// a byte-identical value); the rename Escape path could commit the
// draft on browsers that fire blur on focused-node removal (WebKit);
// reorderElements pushed history + unsaved for a no-op reorder (dropping
// a row onto the neighbor's lower half reproduces the identical order).
//
// THE FIX: the blur commits only when the trimmed draft differs; the
// Escape path sets a discarded ref the blur commit honors; the reorder
// early-bails when the computed id sequence is identical.
//
// S78-D — THE DEFECT (A-L3): the multi-selection Fill row committed
// fill WITHOUT clearing fillGradient/fillImage — the paint seam's
// precedence is image > gradient > solid, so the change never painted
// for gradient/image-filled members (the single-selection Solid tab
// clears all three siblings; the multi site drifted).
//
// THE FIX: the multi Fill row mirrors the Solid tab's clearing form.
//
// S78-F — THE DEFECT (A-L4): the editor header's primary touch controls
// sat below the repo's own 44px floor on mobile — the Back button
// (28x28, a phone's primary in-app exit), Undo/Redo (32x32), and the
// icon-only Share/Present (32px tall) — while every other
// mobile-reachable control the repo added carries the floor.
//
// THE FIX: max-sm:min-h-11 (and min-w-11 on the square icon forms) —
// the desktop row stays pixel-identical (the max-sm: scoping).
//
// S78-G (the client honesty set): the S77-C comment's
// exactly-one-live-region claim reworded to the honest two-by-design
// form (the badge's discrete flips + the transcript's atomic arrivals);
// the Dashboard's duplicated onDeleted handlers hoisted to one
// handleDeleted; the teams member avatar's guarded initial; the
// MobileNav trigger's dead sr-only span dropped.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

// ---------------------------------------------------------------------------
// S78-A — the project-scope guard on the AI transcript
// ---------------------------------------------------------------------------
describe("the AI transcript's project-scope guard (S78-A / A-M1 — the headline)", () => {
  const assistant = src("src/components/editor/ai-assistant.tsx");

  it("the ChatMessage carries the send-time scope id", () => {
    // THE DEFECT PIN: pre-fix the message type had NO project scope —
    // a revert carrier outlived its project.
    const m = assistant.match(/type ChatMessage = \{[\s\S]*?\};/);
    expect(m).not.toBeNull();
    expect(m?.[0]).toMatch(/scopeId\??:\s*string/);
  });

  it("the revert carrier captures the store's projectId at send time", () => {
    // THE DEFECT PIN: the applied reply must stamp its scope — the
    // belt reads it back at revert time.
    expect(assistant).toMatch(/scopeId:\s*sendScopeId/);
    expect(assistant).toMatch(/const sendScopeId\s*=\s*state\.projectId/);
  });

  it("revertMessage bails when a NAMED scope no longer matches the live store", () => {
    // THE DEFECT PIN: pre-fix revertMessage restored unconditionally —
    // project A's elements into project B's store (the autosave PUT
    // clobber). A snapshot captured under Untitled ("") follows the
    // canvas through the adoption transition (the same lineage).
    const m = assistant.match(/function revertMessage\(id: string\) \{([\s\S]*?)\n  \}/);
    expect(m).not.toBeNull();
    const body = m?.[1] ?? "";
    const guard = body.indexOf("scopeId");
    const restore = body.indexOf("restoreSnapshot");
    expect(guard).toBeGreaterThanOrEqual(0);
    expect(restore).toBeGreaterThanOrEqual(0);
    expect(guard).toBeLessThan(restore);
    expect(body).toMatch(/message\.scopeId\s*&&\s*message\.scopeId\s*!==/);
  });

  it("send() re-checks the scope AFTER the await and BEFORE the operations apply", () => {
    // THE DEFECT PIN: pre-fix a mid-await swap let an AI batch computed
    // against project A's request land into project B. The honest
    // refusal replaces the apply (a NAMED scope only; an Untitled
    // send-scope applies through the adoption — the same canvas).
    const m = assistant.match(/const preApply = useEditorStore\.getState\(\);([\s\S]*?)const actionCount = applyOperations/);
    expect(m).not.toBeNull();
    const body = m?.[1] ?? "";
    expect(body).toMatch(/sendScopeId\s*!==\s*""/);
    expect(body).toMatch(/preApply\.projectId\s*!==\s*sendScopeId/);
  });

  it("the mid-flight refusal answers the honest message and never applies", () => {
    // The refusal branch must return BEFORE applyOperations runs and
    // before any snapshot is captured for application.
    const m = assistant.match(/const preApply = useEditorStore\.getState\(\);([\s\S]*?)const actionCount = applyOperations/);
    const body = m?.[1] ?? "";
    expect(body).toMatch(/project changed while/);
    expect(body).toMatch(/return;/);
  });

  it("a store subscription resets the transcript on a NAMED-scope transition (the adoption exempted)", () => {
    // THE DEFECT PIN: pre-fix NO projectId subscription existed — the
    // transcript outlived its project. The reset fires on A -> B and
    // A -> Untitled; the Untitled adoption ("" -> id) keeps the
    // conversation (the canvas lineage is the same — the first save of
    // the user's own Untitled board must not wipe the chat that built
    // it). The setState lives in the subscription CALLBACK — the
    // sanctioned event-callback form, never an effect body.
    const m = assistant.match(
      /useEditorStore\.subscribe\(\(state, prevState\) => \{([\s\S]*?)\n    \}\);/,
    );
    expect(m).not.toBeNull();
    const body = m?.[1] ?? "";
    // The early-return form: an UNCHANGED projectId returns before any
    // state is touched (the equivalent of a !== branch, the idiomatic
    // guard-first shape).
    expect(body).toMatch(/state\.projectId === prevState\.projectId\) return;/);
    expect(body).toMatch(/prevState\.projectId\s*===\s*""/);
    expect(body).toMatch(/setMessages/);
  });

  it("the subscription resets to the intro bubble (a fresh conversation, not a silent wipe)", () => {
    // The reset form: the intro message — id "intro", the assistant
    // role — identical to the mount state.
    const m = assistant.match(
      /useEditorStore\.subscribe\(\(state, prevState\) => \{([\s\S]*?)\n    \}\);/,
    );
    const body = m?.[1] ?? "";
    expect(body).toMatch(/id:\s*"intro"/);
    expect(body).toMatch(/role:\s*"assistant"/);
  });

  it("the scope guard's comment names the honest doctrine (no comment-code drift)", () => {
    // The F58 discipline: the comment must describe the code's real
    // contract — a NAMED scope never crosses a project boundary; an
    // Untitled scope follows the adoption.
    const m = assistant.match(/Session 78 \(S78-A[\s\S]*?\*\//);
    expect(m).not.toBeNull();
    expect(m?.[0]).toMatch(/adoption/);
  });
});

// ---------------------------------------------------------------------------
// S78-C — the no-op commit family
// ---------------------------------------------------------------------------
describe("the layers rename no-change guard (S78-C / A-L1)", () => {
  const layers = src("src/components/editor/layers-panel.tsx");

  it("the blur commits only when the trimmed draft differs", () => {
    // THE DEFECT PIN: pre-fix the blur committed any non-empty draft —
    // a rename-open-then-blur pushed history + a redundant PUT for a
    // byte-identical value (the S56-A gesture doctrine violated).
    const m = layers.match(/onBlur=\{\(\) => \{([\s\S]*?)\n\s*\}\}/);
    expect(m).not.toBeNull();
    expect(m?.[1]).toMatch(/renameValue\.trim\(\)\s*!==/);
  });

  it("the Escape path marks the draft discarded before the unmount", () => {
    // THE DEFECT PIN: pre-fix Escape only cleared the renaming state —
    // WebKit fires blur on focused-node removal, committing the draft
    // the user meant to discard. The discarded ref is the guard.
    const m = layers.match(/if \(e\.key === "Escape"\) \{([\s\S]*?)\n\s*\}/);
    expect(m).not.toBeNull();
    expect(m?.[1]).toMatch(/renameDiscarded\.current = true/);
  });

  it("the blur commit honors the discarded ref (the guard, not just the mark)", () => {
    const m = layers.match(/onBlur=\{\(\) => \{([\s\S]*?)\n\s*\}\}/);
    expect(m?.[1]).toMatch(/!renameDiscarded\.current/);
  });
});

describe("the reorderElements no-op bail (S78-C / A-L2)", () => {
  const store = src("src/components/editor/editor-store.ts");

  it("an identical id sequence returns BEFORE the history push", () => {
    // THE DEFECT PIN: pre-fix a drop computing the same order still
    // pushed an inert history entry (the next Ctrl+Z visibly did
    // nothing), destroyed redo, and autosaved a byte-identical list.
    const m = store.match(/reorderElements: \(fromIds, toIndex\) =>\s*set\(\(state\) => \{([\s\S]*?)\n    \}\),/);
    expect(m).not.toBeNull();
    const body = m?.[1] ?? "";
    const identity = body.indexOf("nextIds.join");
    const history = body.indexOf("past:");
    expect(identity).toBeGreaterThanOrEqual(0);
    expect(history).toBeGreaterThanOrEqual(0);
    expect(identity).toBeLessThan(history);
    expect(body).toMatch(/return \{\};/);
  });

  it("the identity check compares the FULL id sequences (both sides derived from the store)", () => {
    const m = store.match(/reorderElements: \(fromIds, toIndex\) =>\s*set\(\(state\) => \{([\s\S]*?)\n    \}\),/);
    const body = m?.[1] ?? "";
    expect(body).toMatch(/nextIds\.join\("\\u0001"\)\s*===\s*state\.elements\.map\(\(el\) => el\.id\)\.join\("\\u0001"\)/);
  });
});

// ---------------------------------------------------------------------------
// S78-D — the multi-selection Fill paint-precedence parity
// ---------------------------------------------------------------------------
describe("the multi-selection Fill precedence parity (S78-D / A-L3)", () => {
  const panel = src("src/components/editor/properties-panel.tsx");

  it("the multi Fill row clears the higher-precedence paint siblings", () => {
    // THE DEFECT PIN: pre-fix the multi Fill row committed fill alone —
    // the paint seam's precedence (image > gradient > solid, the
    // fillPaintFor contract) meant the change never painted for
    // gradient/image-filled members. The single-selection Solid tab
    // (session 33's documented form) clears all three siblings; the
    // multi site now mirrors it. (The nested-brace-aware form: the
    // update object's own braces are part of the match.)
    const m = panel.match(
      /label="Fill Color"\s*\n\s*value=\{first\.fill \?\? null\}[\s\S]*?onChange=\{\(fill\) => (update\(\{[^)]*\}\))\}/,
    );
    expect(m).not.toBeNull();
    expect(m?.[1]).toMatch(/fill,\s*fillGradient: null,\s*fillImage: null,\s*fillImageFit: null/);
  });

  it("the single-selection Solid tab's clearing form is unchanged (the family reference)", () => {
    // PRESERVATION: the single-selection form at the Solid tab stays
    // the documented reference.
    const single = panel.match(
      /label="Fill Color"\s*\n\s*value=\{element\.fill\}[\s\S]*?onChange=\{\(fill\) => ([^}]+)\}/,
    );
    expect(single).not.toBeNull();
    expect(single?.[1]).toMatch(/fillGradient: null,\s*fillImage: null,\s*fillImageFit: null/);
  });
});

// ---------------------------------------------------------------------------
// S78-F — the mobile editor-header touch floor
// ---------------------------------------------------------------------------
describe("the mobile editor-header touch floor (S78-F / A-L4)", () => {
  const view = src("src/components/editor/editor-view.tsx");

  it("the Back button carries the 44px floor below sm (28x28 pre-fix)", () => {
    // THE DEFECT PIN: pre-fix the phone's primary in-app exit was the
    // smallest touch target in the whole client layer (p-1 + h-5 w-5).
    // (The [\s\S]*? span: the session comment sits between the
    // aria-label and the className. The floor is PHONE-BAND scoped —
    // max-[480px]: — so the session-55 tablet pins (the 600px single
    // 48px row / the 77px wrapped header) stay byte-identical.)
    const m = view.match(
      /aria-label="Back to dashboard"[\s\S]*?className="([^"]+)"/,
    );
    expect(m).not.toBeNull();
    expect(m?.[1]).toMatch(/max-\[480px\]:min-h-11/);
    expect(m?.[1]).toMatch(/max-\[480px\]:min-w-11/);
  });

  it("Undo and Redo carry the 44px floor below sm (32x32 pre-fix)", () => {
    for (const label of ["Undo", "Redo"]) {
      const m = view.match(
        new RegExp(`aria-label="${label}"[\\s\\S]*?className="([^"]+)"`),
      );
      expect(m, `${label} button`).not.toBeNull();
      expect(m?.[1]).toMatch(/max-\[480px\]:min-h-11/);
      expect(m?.[1]).toMatch(/max-\[480px\]:min-w-11/);
    }
  });

  it("the icon-only Share and Present carry the 44px height floor below sm (32px pre-fix)", () => {
    for (const label of ["Share", "Present"]) {
      const m = view.match(
        new RegExp(`aria-label="${label}"[\\s\\S]*?className="([^"]+)"`),
      );
      expect(m, `${label} button`).not.toBeNull();
      expect(m?.[1]).toMatch(/max-\[480px\]:min-h-11/);
    }
  });

  it("the desktop row stays pixel-identical (the phone-band scoping — no un-scoped min-h-11 on these controls)", () => {
    // PRESERVATION: the floor is PHONE-BAND only (<=480px) — the tablet
    // band (the session-55 sweep's 600px pins) and the desktop single-row
    // geometry stay byte-identical (sm:h-12 sm:py-0 owns desktop).
    for (const label of ["Back to dashboard", "Undo", "Redo", "Share", "Present"]) {
      const m = view.match(
        new RegExp(`aria-label="${label}"[\\s\\S]*?className="([^"]+)"`),
      );
      const cls = m?.[1] ?? "";
      expect(cls, `${label} carries an un-scoped floor`).not.toMatch(/(?<!max-\[480px\]:)min-h-11/);
    }
  });
});

// ---------------------------------------------------------------------------
// S78-G — the client honesty set
// ---------------------------------------------------------------------------
describe("the S77-C comment's honest two-live-regions form (S78-G / A-L6)", () => {
  const assistant = src("src/components/editor/ai-assistant.tsx");

  it("the comment names TWO live regions by design (not the one-region claim)", () => {
    // THE DEFECT PIN (F58): the S77-C comment claimed "the
    // exactly-one-live-region-in-the-editor-DOM contract holds" — false
    // as written: the editor DOM carries the badge's aria-live (the
    // discrete save-state flips) AND the transcript's role="log" (the
    // implicit polite arrival region). Two live-region semantics BY
    // DESIGN; no per-tick streams (the S76-D retirement stands).
    const m = assistant.match(/Session 77 \(S77-C[\s\S]*?\*\//);
    expect(m).not.toBeNull();
    expect(m?.[0]).toMatch(/two live regions by design|badge.*transcript|transcript.*badge/i);
    // The retired false claim is gone:
    expect(m?.[0]).not.toMatch(/exactly-one-live-region/);
  });
});

describe("the Dashboard's onDeleted hoist (S78-G / A-I1)", () => {
  const dashboard = src("src/components/dashboard-view.tsx");

  it("the duplicated twin handlers fold into ONE handleDeleted seam", () => {
    // THE DEFECT PIN: pre-fix two byte-identical 9-line inline bodies
    // (grid + list branches) — the drift-hazard twin the one-seam
    // discipline retires elsewhere. The hoisted form: one useCallback
    // seam, consumed by both card surfaces.
    const count = (dashboard.match(/onDeleted=\{handleDeleted\}/g) ?? []).length;
    expect(count).toBe(2);
    expect(dashboard).toMatch(/const handleDeleted = React\.useCallback\(/);
    expect(dashboard).toMatch(/\(id: string\) => \{/);
    // The twin inline bodies are gone:
    expect(dashboard).not.toMatch(/onDeleted=\{\(id\) => \{/);
  });
});

describe("the teams member avatar's guarded initial (S78-G / A-I2)", () => {
  const teams = src("src/components/teams-view.tsx");

  it("the member chip renders the family's guarded form", () => {
    // THE DEFECT PIN: pre-fix the bare member.name.charAt(0) — safe
    // today (memberDisplayFor normalizes), but the guarded form is the
    // family convention at every other initial site.
    expect(teams).toMatch(/member\.name\.trim\(\)\.charAt\(0\)\.toUpperCase\(\) \|\| "M"/);
    expect(teams).not.toMatch(/\{member\.name\.charAt\(0\)\}/);
  });
});

describe("the MobileNav trigger's dead sr-only span (S78-G / A-I3)", () => {
  const header = src("src/components/app-header.tsx");

  it("the trigger's accessible name is the stable aria-label alone (no dead dynamic span)", () => {
    // THE DEFECT PIN: aria-label wins the accessible-name computation,
    // so the dynamic sr-only "Open menu"/"Close menu" span never reached
    // AT — dead duplication beside the documented stable-label +
    // aria-expanded contract.
    const m = header.match(/<SheetTrigger[\s\S]*?<\/SheetTrigger>/);
    expect(m).not.toBeNull();
    expect(m?.[0]).toMatch(/aria-label="Navigation menu"/);
    expect(m?.[0]).not.toMatch(/sr-only/);
  });
});
