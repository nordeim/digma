import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-79 client low batch (S79-A + S79-B + S79-E — the
// twenty-seventh audit's A-M1, A-M2, A-L1, A-I2).
//
// S79-A — THE DEFECT (A-M1, the headline): the S78-A scope guards'
// "" boundary conflated the Untitled ADOPTION with an Untitled->named
// LOAD. loadProject and attachProject produce the IDENTICAL store
// transition ("" -> id), so every guard keyed off that shape passed at
// the boundary: the transcript-reset subscription's exemption skipped
// the reset for a genuine load (the Untitled conversation + its revert
// carriers rode into project B), the revert belt passed an ""-scoped
// carrier as falsy (a surviving Revert restored the UNTITLED board's
// elements into B's store -> unsaved -> the autosave PUT into B — the
// persisted cross-project clobber S78-A was built to stop), and the
// mid-flight send guard passed an Untitled send (an AI batch computed
// against the Untitled canvas applied into B).
//
// THE FIX: the store gains a boardEpoch that loadProject increments
// and attachProject deliberately does NOT (the adoption is the same
// canvas lineage — the documented exemption). The epoch is the lineage
// discriminator the guards were missing: the subscription's exemption
// is load-aware (adoption AND epoch unchanged), every applied message
// carries scopeEpoch stamped at send time and revertMessage bails when
// the epoch moved, and the mid-flight refusal extends to an epoch
// mismatch (an Untitled send whose board was swapped mid-await answers
// the honest refusal; the adoption mid-await still applies — the
// lineage-correct behavior).
//
// S79-B — THE DEFECT (A-M2): the same-route soft swap never flushed
// the outgoing project's pending edits — every flush transport was
// wired to a different boundary (exit()'s flushNow, the unmount
// cleanup's captured-state PUT, pagehide), and the 800ms timer's flush
// early-returns once loadProject(B) stamps saveState "saved". An edit
// inside the debounce window before the swap was dropped from the
// store and never PUT — silently lost (unrecoverable: loadProject also
// clears past/future).
//
// THE FIX: the load effect flushes THROUGH THE MACHINE at the boundary
// — a first-run ref distinguishes the mount (the unmount cleanup owns
// that boundary; no double-PUT, the S71-B discipline) from the
// same-instance re-run (the soft swap). On a re-run where the store
// holds a NAMED project the incoming load is about to replace, the
// effect calls flushNow() BEFORE setLoading(true) — the machine
// captures the outgoing state synchronously, ensureProject returns the
// named id with no network call, and the machine's own swap guard
// drops the stale response after loadProject(B).
//
// S79-E — THE DEFECTS (A-L1, A-I2): the Canvas Background hex row's
// swallowed null clear left the draft lying (the row deliberately
// ignores a null clear — a canvas cannot be transparent — but the hex
// input had no blur-restore, so the row sat showing an empty input
// while the canvas kept painting the old color); and a
// hidden-but-selected element still rendered its selection outline +
// 8 draggable resize handles over blank canvas (the element render
// filters by visible; the selection chrome did not — the eye/canvas
// incoherence the repo's own filter comment documents as the contract).
//
// THE FIX: HexColorRow's hex input gains the abandoned-draft
// blur-restore (the GuardedNumberInput doctrine); the canvas selection
// chrome gates on visibility (the single-selection outline + handles
// require selected[0].visible; the multi-selection dashed box requires
// some visible member).

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

// ---------------------------------------------------------------------------
// S79-A — the board-load lineage discriminator
// ---------------------------------------------------------------------------
describe("the boardEpoch lineage discriminator in the store (S79-A / A-M1)", () => {
  const store = src("src/components/editor/editor-store.ts");

  it("the store carries a boardEpoch field initialized at 0", () => {
    // THE DEFECT PIN: pre-fix the store had no lineage discriminator —
    // loadProject and attachProject were indistinguishable at the
    // "" -> id boundary.
    expect(store).toMatch(/boardEpoch:\s*number/);
    expect(store).toMatch(/boardEpoch:\s*0/);
  });

  it("loadProject increments the boardEpoch (a load is a lineage break)", () => {
    // THE DEFECT PIN: pre-fix loadProject assigned projectId without
    // marking the transition — the adoption-shaped exemption caught it.
    const start = store.indexOf("loadProject: (project)");
    expect(start).toBeGreaterThanOrEqual(0);
    const body = store.slice(start, start + 2200);
    expect(body).toMatch(/boardEpoch:\s*state\.boardEpoch\s*\+\s*1/);
    // The signature form the gesture-lifecycle pin reads stays intact.
    expect(store).toMatch(/loadProject: \(project\)/);
  });

  it("attachProject does NOT move the epoch (the adoption is the same lineage)", () => {
    // The IMPLEMENTATION form (the type declaration line carries the
    // same key — anchor on the arrow body).
    const start = store.indexOf("attachProject: (id) =>");
    expect(start).toBeGreaterThanOrEqual(0);
    const body = store.slice(start, start + 120);
    expect(body).not.toMatch(/boardEpoch/);
    expect(body).toMatch(/attachProject:\s*\(id\)\s*=>\s*set\(\{\s*projectId:\s*id\s*\}\)/);
  });

  it("BEHAVIORAL: loadProject bumps the epoch; attachProject does not", async () => {
    // The store import form gesture-lifecycle.test.ts established.
    const mod = await import("../src/components/editor/editor-store");
    const useEditorStore = (mod as { useEditorStore: { getState: () => { boardEpoch?: number; loadProject: (p: unknown) => void; attachProject: (id: string) => void } } }).useEditorStore;
    const before = useEditorStore.getState().boardEpoch ?? -1;
    useEditorStore.getState().loadProject({
      id: "probe-79",
      name: "probe",
      description: null,
      backgroundColor: "#0d1117",
      elements: [],
    });
    const afterLoad = useEditorStore.getState().boardEpoch ?? -2;
    useEditorStore.getState().attachProject("probe-79-b");
    const afterAdopt = useEditorStore.getState().boardEpoch ?? -3;
    expect(afterLoad, "loadProject must increment the epoch").toBe(before + 1);
    expect(afterAdopt, "attachProject must leave the epoch unchanged").toBe(afterLoad);
  });
});

describe("the load-aware transcript reset in the subscription (S79-A / A-M1)", () => {
  const assistant = src("src/components/editor/ai-assistant.tsx");

  it("the ChatMessage carries the send-time scope epoch", () => {
    const m = assistant.match(/type ChatMessage = \{[\s\S]*?\};/);
    expect(m).not.toBeNull();
    expect(m?.[0]).toMatch(/scopeEpoch\??:\s*number/);
  });

  it("the adoption exemption is load-aware — an epoch move is NOT an adoption", () => {
    // THE DEFECT PIN: pre-fix the exemption was purely projectId-shaped
    // ("" -> id) — a loadProject through the same shape skipped the
    // reset and the Untitled transcript rode into the loaded project.
    const start = assistant.indexOf("React.useEffect(() => {");
    const subStart = assistant.indexOf("useEditorStore.subscribe", start);
    expect(subStart).toBeGreaterThanOrEqual(0);
    const body = assistant.slice(subStart, subStart + 1600);
    expect(body).toMatch(/adoption\s*&&\s*state\.boardEpoch\s*===\s*prevState\.boardEpoch/);
    // The pinned S78-A forms survive (the named-scope reset + the
    // adoption line + the intro reset).
    expect(body).toMatch(/prevState\.projectId\s*===\s*""/);
    expect(body).toMatch(/setMessages/);
  });

  it("the revert belt bails when the carrier's epoch no longer matches the board", () => {
    // THE DEFECT PIN: pre-fix the belt keyed ONLY on the (falsy) ""
    // scopeId — an Untitled carrier reverted into ANY later board.
    const start = assistant.indexOf("async function revertMessage") >= 0
      ? assistant.indexOf("async function revertMessage")
      : assistant.indexOf("function revertMessage");
    expect(start).toBeGreaterThanOrEqual(0);
    const body = assistant.slice(start, start + 2100);
    expect(body).toMatch(/message\.scopeEpoch\s*!==\s*useEditorStore\.getState\(\)\.boardEpoch/);
    // The named-scope belt stays (belt-and-suspenders).
    expect(body).toMatch(/message\.scopeId\s*&&\s*message\.scopeId\s*!==/);
  });

  it("the mid-flight refusal extends to the epoch mismatch", () => {
    // THE DEFECT PIN: pre-fix an Untitled send (sendScopeId "") passed
    // the guard unconditionally — a swap mid-await applied the batch
    // into the new board.
    const start = assistant.indexOf("async function send");
    expect(start).toBeGreaterThanOrEqual(0);
    const body = assistant.slice(start, start + 6000);
    expect(body).toMatch(/sendEpoch\s*!==\s*preApply\.boardEpoch/);
    expect(body).toMatch(/const sendScopeId\s*=\s*state\.projectId/);
    // The pinned S78-A refusal forms survive.
    expect(body).toMatch(/sendScopeId\s*!==\s*""/);
    expect(body).toMatch(/preApply\.projectId\s*!==\s*sendScopeId/);
  });
});

// ---------------------------------------------------------------------------
// S79-B — the swap-boundary flush of the outgoing project's edits
// ---------------------------------------------------------------------------
describe("the swap-boundary flush at the load seam (S79-B / A-M2)", () => {
  const view = src("src/components/editor/editor-view.tsx");

  it("the load effect owns a first-run ref (the mount boundary belongs to the unmount cleanup)", () => {
    // The double-PUT guard: a fresh mount's previous instance already
    // flushed through its own unmount-cleanup PUT — the load effect
    // must NOT flush again on the first run.
    expect(view).toMatch(/firstRun(?:Ref)?\.(?:current)\s*=\s*false/);
  });

  it("the same-instance re-run flushes the outgoing NAMED project through the machine", () => {
    // THE DEFECT PIN: pre-fix the load effect never called flushNow —
    // the outgoing project's pending edits died at loadProject.
    const start = view.indexOf("}, [projectId]);", view.indexOf("React.useEffect(() => {", view.indexOf("const flushNow = useAutosave();")));
    // Walk back to the effect head: find the load effect by its
    // different-project branch marker (S77-E).
    const rearm = view.indexOf("setLoading(true)");
    const effectStart = view.lastIndexOf("React.useEffect(() => {", rearm);
    const effect = view.slice(effectStart, start + 18);
    // The outgoing flush: first-run guarded, named-project guarded,
    // BEFORE the loading re-arm.
    const flushSite = effect.indexOf("flushNow();");
    expect(flushSite).toBeGreaterThanOrEqual(0);
    expect(flushSite).toBeLessThan(rearm - effectStart);
    const guardWindow = effect.slice(0, flushSite);
    expect(guardWindow).toMatch(/firstRun/);
    expect(guardWindow).toMatch(/useEditorStore\.getState\(\)/);
    expect(guardWindow).toMatch(/outgoing\.projectId/);
  });

  it("the Untitled outgoing store skips the flush (the documented leave-scope contract)", () => {
    const rearm = view.indexOf("setLoading(true)");
    const effectStart = view.lastIndexOf("React.useEffect(() => {", rearm);
    const effect = view.slice(effectStart, rearm + 400);
    const flushSite = effect.indexOf("flushNow();");
    const guard = effect.slice(Math.max(0, flushSite - 600), flushSite);
    // The named-project guard: the flush fires only for a NON-EMPTY
    // outgoing projectId (Untitled "" skips — the ADR-009/S61-I/S62-C
    // contract the unmount cleanup's own skip mirrors).
    expect(guard).toMatch(/projectId\s*&&/);
  });
});

// ---------------------------------------------------------------------------
// S79-E — the client honesty pair
// ---------------------------------------------------------------------------
describe("the hex row's abandoned-draft blur-restore (S79-E / A-L1)", () => {
  const panel = src("src/components/editor/properties-panel.tsx");

  it("the hex text input restores the abandoned draft on blur", () => {
    // THE DEFECT PIN: pre-fix the hex input had no blur-restore — the
    // Canvas Background row's swallowed null clear left the input
    // lying about the model's value.
    const start = panel.indexOf("function HexColorRow");
    expect(start).toBeGreaterThanOrEqual(0);
    const body = panel.slice(start, start + 3000);
    expect(body).toMatch(/onBlur=\{\(\)\s*=>\s*setDraft\(value\s*\?\?\s*""\)\}/);
  });

  it("the Canvas Background row still swallows the null clear (a canvas cannot be transparent)", () => {
    // The preserved deliberate behavior — the fix restores the DRAFT,
    // not the null commit.
    expect(panel).toMatch(/onChange=\{\(color\)\s*=>\s*color\s*&&\s*onChange\(color\)\}/);
  });
});

describe("the hidden-selection chrome gates (S79-E / A-I2)", () => {
  const canvas = src("src/components/editor/canvas.tsx");

  it("the single-selection outline + handles require a VISIBLE selected element", () => {
    // THE DEFECT PIN: pre-fix the outline derived from `selected`
    // (not visible-filtered) — an eye-hidden selected element kept a
    // floating outline with 8 live handles.
    expect(canvas).toMatch(/selected\.length === 1 && selectionBounds && selected\[0\](?:!)?\.visible/);
  });

  it("the multi-selection dashed box requires at least one visible member", () => {
    expect(canvas).toMatch(/selected\.length > 1 && selectionBounds && selected\.some\(\(el\) => el\.visible\)/);
  });
});
