import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-80 client low batch (S80-A + S80-B + S80-C — the
// twenty-eighth audit's A-M1, A-L1, A-L2).
//
// S80-A — THE DEFECT (A-M1, the headline): the S79-B swap-boundary
// flush does not WAIT. flush() sets pending and returns when a flush
// is already in flight, so the boundary's fire-and-forget flushNow()
// captured NOTHING when the 800ms timer's flush was mid-PUT. The loss
// chain: edit A1 goes in flight; edit A2 lands mid-flight (the
// documented edit-during-flight case); the user soft-swaps to B; the
// boundary flushNow() early-returns on `flushing`; B's GET resolves
// BEFORE the outgoing PUT's response; loadProject(B) stamps
// saveState "saved" and wipes past/future; the outgoing PUT's
// response is dropped by the machine's swap guard BEFORE the
// elements-reference guard could setUnsaved; the pending re-run
// early-returns on the loaded "saved". A2 is gone — from the store,
// from history, and never PUT.
//
// THE FIX: the machine's useAutosave handle gains a drain() — the
// load effect AWAITS the machine's full idle (the in-flight PUT
// answered AND the pending re-run answered) before fetching the
// incoming project, and re-flushes + drains a second time after the
// GET, BEFORE loadProject wipes the store (an edit that landed during
// the GET window). The drain polls the machine's busy state at 25ms
// with a 5s deadline (a hung PUT cannot block navigation forever —
// on timeout the load proceeds into exactly the pre-fix race, the
// documented no-worse residual). The cancelled flag is re-checked
// after each drain.
//
// S80-B — THE DEFECT (A-L1): the transcript-reset subscription
// keyed on projectId alone. An Untitled->Untitled LOAD (a soft swap
// between two unknown projectIds — both fall to the Untitled
// fallback's loadProject(UNTITLED_PROJECT)) is projectId-shaped like
// a no-op ("" === "") but the epoch moves — a lineage break. The
// stale conversation survived the load and a belt-defused Revert
// kept rendering (a control that lies about its state).
//
// THE FIX: the early return widens to require BOTH an unchanged
// projectId AND an unchanged epoch.
//
// S80-C — THE DEFECT (A-L2): one AI update operation carrying both
// scale and a patch pushed TWO undo history entries (scaleElements
// and updateElements each push a past snapshot) — "make it red and
// 25% bigger" cost two Ctrl+Z presses with a visible intermediate
// state, violating the one-entry-per-intent gesture doctrine.
//
// THE FIX: scaleElements gains the optional commit parameter
// (mirroring updateElements' own form), and the apply wraps a
// combined operation in beginGesture()/endGesture() with both halves
// committing false — ONE past entry facing the right direction.

const view = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const assistant = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);

// Behavioral store pins import the real store (the gesture-undo
// suite's own pattern — a plain zustand container with no DOM
// dependency).
import { useEditorStore } from "@/components/editor/editor-store";

// ---------------------------------------------------------------------------
// S80-A — the boundary drain
// ---------------------------------------------------------------------------
describe("the autosave handle exposes a drain (S80-A / A-M1)", () => {
  it("useAutosave's return carries the drain property", () => {
    // THE DEFECT PIN: pre-fix the handle was a bare () => void — no
    // way to await the machine's idle at a boundary.
    expect(view).toMatch(/drain(?:Ref)?\s*=/);
    expect(view).toMatch(/AutosaveHandle|drain:\s*\(\)\s*=>\s*Promise\.<void>/);
  });

  it("the machine exposes its busy state to the drain (flushing OR pending)", () => {
    // The busy closure the drain polls: both the in-flight PUT AND
    // the queued re-run keep the machine busy.
    expect(view).toMatch(/flushing\s*\|\|\s*pending/);
  });

  it("the drain polls with a bounded deadline (a hung PUT cannot block navigation)", () => {
    // The 5-second deadline race — the honest timeout guard.
    expect(view).toMatch(/5_000|5000/);
  });
});

describe("the load effect awaits the drain at the swap boundary (S80-A / A-M1)", () => {
  it("the boundary flushNow() is followed by an AWAITED drain before the loading re-arm", () => {
    // THE DEFECT PIN: pre-fix the boundary call was fire-and-forget —
    // an edit landing while a flush was in flight was silently lost.
    const rearm = view.indexOf("setLoading(true)");
    const effectStart = view.lastIndexOf("React.useEffect(() => {", rearm);
    const effect = view.slice(effectStart, rearm + 600);
    const flushSite = effect.indexOf("flushNow();");
    expect(flushSite).toBeGreaterThanOrEqual(0);
    // The drain await sits between the flush and the re-arm.
    const drainSite = effect.indexOf("flushNow.drain();", flushSite);
    expect(drainSite).toBeGreaterThan(flushSite);
    expect(drainSite).toBeLessThan(effect.indexOf("setLoading(true)", flushSite));
  });

  it("a SECOND flush+drain pair runs after the GET, BEFORE loadProject wipes the store", () => {
    // The post-GET pre-load flush captures an edit that landed during
    // the GET window (the timer may not have fired yet).
    const loadSite = view.indexOf("loadProject(body.data.project", view.indexOf("const flushNow = useAutosave();"));
    expect(loadSite).toBeGreaterThanOrEqual(0);
    const window_ = view.slice(Math.max(0, loadSite - 1200), loadSite);
    expect(window_).toMatch(/flushNow\(\);/);
    expect(window_).toMatch(/flushNow\.drain\(\);/);
  });

  it("the cancelled flag is re-checked after each drain (a swap/unmount during the drain hands off the boundary)", () => {
    // The FULL load effect (from its head to the [projectId] dep close).
    const effectStart = view.indexOf("React.useEffect(() => {", view.indexOf("const flushNow = useAutosave();"));
    const effectEnd = view.indexOf("}, [projectId]);", effectStart);
    const effect = view.slice(effectStart, effectEnd);
    // Each drain await is followed by a cancelled guard BEFORE the
    // load: the boundary's early-return form and the post-GET pair's.
    const drains = [...effect.matchAll(/await flushNow\.drain\(\);/g)].map((m) => m.index ?? 0);
    expect(drains.length).toBeGreaterThanOrEqual(2);
    for (const d of drains) {
      const after = effect.slice(d, d + 200);
      expect(after).toMatch(/if \(cancelled\) return;/);
    }
  });
});

// ---------------------------------------------------------------------------
// S80-B — the epoch-aware transcript reset
// ---------------------------------------------------------------------------
describe("the transcript reset fires on an epoch move with a same-empty projectId (S80-B / A-L1)", () => {
  it("the subscription's early return requires BOTH an unchanged projectId AND an unchanged epoch", () => {
    // THE DEFECT PIN: pre-fix the guard read projectId alone — an
    // Untitled->Untitled load (epoch moved, "" === "") kept the stale
    // transcript + a belt-defused dead Revert.
    expect(assistant).toMatch(
      /if\s*\(\s*state\.projectId === prevState\.projectId\s*&&\s*state\.boardEpoch === prevState\.boardEpoch\s*\)\s*return;/
    );
  });

  it("the Untitled adoption exemption is untouched (the epoch-unchanged guard survives)", () => {
    // The preserved S79-A contract: the genuine adoption keeps its
    // exemption — adoption AND epoch unchanged.
    expect(assistant).toMatch(
      /adoption && state\.boardEpoch === prevState\.boardEpoch/
    );
  });
});

// ---------------------------------------------------------------------------
// S80-C — the scale+patch one-entry coalescing
// ---------------------------------------------------------------------------
describe("scaleElements gains the commit parameter (S80-C / A-L2)", () => {
  it("the store type declares the optional commit argument", () => {
    // THE DEFECT PIN: pre-fix scaleElements ALWAYS pushed a past
    // snapshot — no way to coalesce with a sibling patch.
    expect(storeSource).toMatch(
      /scaleElements:\s*\(ids:\s*string\[\],\s*factor:\s*number,\s*commit\?:\s*boolean\)\s*=>\s*void/
    );
  });

  it("the implementation honors the commit flag (the updateElements form)", () => {
    const start = storeSource.indexOf("scaleElements: (ids, factor");
    expect(start).toBeGreaterThanOrEqual(0);
    const body = storeSource.slice(start, start + 1400);
    expect(body).toMatch(/commit(?:\s*=\s*true)?\s*,?/);
    // The uncommitted branch skips the past push.
    expect(body).toMatch(/if\s*\(commit\)/);
  });
});

describe("the AI apply coalesces a scale+patch operation into ONE history entry (S80-C / A-L2)", () => {
  it("the apply wraps the combined pair in the gesture seam", () => {
    // THE DEFECT PIN: pre-fix both halves committed independently —
    // two Ctrl+Z presses for one intent.
    const start = assistant.indexOf("operation.patch.scale !== undefined");
    expect(start).toBeGreaterThanOrEqual(0);
    const body = assistant.slice(start, start + 1600);
    expect(body).toMatch(/beginGesture\(\)/);
    expect(body).toMatch(/endGesture\(\)/);
  });

  it("the combined halves commit false (the gesture's endGesture owns the single push)", () => {
    const start = assistant.indexOf("operation.patch.scale !== undefined");
    const body = assistant.slice(start, start + 1600);
    expect(body).toMatch(/scaleElements\(\s*targets,\s*operation\.patch\.scale,\s*(?:coalesce|combined)\s*\?\s*false\s*:\s*(?:true|undefined)/);
    expect(body).toMatch(/updateElements\(\s*targets,\s*patch,\s*(?:coalesce|combined)\s*\?\s*false\s*:\s*(?:true|undefined)/);
  });
});

describe("the store behavior: one gesture, one undo entry (S80-C behavioral)", () => {
  it("beginGesture + scaleElements(false) + updateElements(false) + endGesture pushes exactly ONE entry that undoes BOTH halves", () => {
    // Driven directly through the real store (the gesture-undo
    // suite's pattern). The interleaving the AI apply now produces.
    const store = useEditorStore.getState();
    // A deterministic test element.
    const id = useEditorStore.getState().addElement({ type: "rectangle", name: "S80 Probe", x: 10, y: 10, width: 100, height: 50, fill: "#3B82F6" });
    expect(id).toBeTruthy();
    useEditorStore.getState().deselectAll();

    const pastBefore = useEditorStore.getState().past.length;

    useEditorStore.getState().beginGesture();
    useEditorStore.getState().scaleElements([id!], 1.5, false);
    useEditorStore.getState().updateElements([id!], { fill: "#FF0000" }, false);
    useEditorStore.getState().endGesture();

    // ONE entry for the whole gesture.
    expect(useEditorStore.getState().past.length).toBe(pastBefore + 1);

    // The intermediate state carried BOTH halves.
    const el = useEditorStore.getState().elements.find((e) => e.id === id);
    expect(el?.width).toBe(150);
    expect(el?.fill).toBe("#FF0000");

    // ONE undo restores BOTH halves (the pre-gesture snapshot).
    useEditorStore.getState().undo();
    const restored = useEditorStore.getState().elements.find((e) => e.id === id);
    expect(restored?.width).toBe(100);
    expect(restored?.fill).toBe("#3B82F6");
  });
});
