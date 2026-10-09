"use client";

// The editor's single client-state container (the Zustand doctrine): all
// canvas state — elements, selection, tool, zoom/pan, save flag, history —
// lives here. Views read the store and call actions; nothing else fetches.

import { create } from "zustand";
import {
  clampPositionField,
  clampSizeField,
  clampZoom,
  defaultElementFor,
  DEFAULT_CANVAS_BACKGROUND,
  ELEMENT_LIMIT,
  type DesignElementDTO,
  type EditorTool,
  type ElementType,
  type ProjectDTO,
} from "@/lib/editor";

type Snapshot = {
  elements: DesignElementDTO[];
  backgroundColor: string;
};

// Exported for the AI assistant's per-message Revert (session 27): each
// assistant reply that applied operations captures a pre-apply snapshot and
// restoreSnapshot() puts it back (an undoable restore, not a raw overwrite).
export type EditorSnapshot = Snapshot;

// Session 105 (S105-C / A-L1 — the F79 dead-export class's N−4
// shape): the export keyword drops — zero external importers (the
// store's own EditorStore.saveState member is the only consumer).
type SaveState = "saved" | "saving" | "unsaved";

let localCounter = 0;
function nextLocalId(): string {
  localCounter += 1;
  return `local-${Date.now().toString(36)}-${localCounter}`;
}

type EditorStore = {
  projectId: string;
  projectName: string;
  projectDescription: string | null;
  backgroundColor: string;
  elements: DesignElementDTO[];
  selectedIds: string[];
  tool: EditorTool;
  zoom: number;
  panX: number;
  panY: number;
  saveState: SaveState;
  past: Snapshot[];
  future: Snapshot[];
  // Session 79 (S79-A / A-M1 — the twenty-seventh audit's headline):
  // the BOARD LINEAGE discriminator. loadProject and attachProject both
  // transition the store's projectId "" -> id, but they are OPPOSITE
  // lineage events: a load REPLACES the canvas (a different board's
  // elements), an adoption binds the id of the board the canvas already
  // IS (the Untitled first-save flow). The S78-A scope guards keyed off
  // the projectId shape alone, so an Untitled editor soft-swapping to a
  // named project passed every guard at the "" boundary — the Untitled
  // transcript (and its revert carriers) rode into the loaded project.
  // boardEpoch increments ONLY on loadProject; attachProject deliberately
  // leaves it alone. Consumers: the AI transcript's reset subscription
  // (the load-aware adoption exemption), the revert belt (scopeEpoch),
  // and the mid-flight send guard (sendEpoch).
  boardEpoch: number;
  // Session 56 (S56-A — the Mode C audit's H-1): the transient
  // PRE-gesture snapshot. beginGesture() captures it at pointer-down;
  // endGesture() pushes it into `past` at pointer-up (one history entry
  // per gesture, facing the RIGHT direction); cancelGesture() discards
  // it (the zero-movement click pushes no history and wipes no redo).
  gestureSnapshot: Snapshot | null;

  // lifecycle
  loadProject: (project: ProjectDTO) => void;
  // Untitled mode (ADR-009): the editor can start with NO backing project
  // (unknown/missing projectId — reference parity). The first save creates
  // one; attachProject binds the freshly created id to the store WITHOUT
  // touching elements/selection so the in-flight save can continue.
  // Session 62 (S62-F / A-L5): setName is DELETED — it had zero callers
  // and the PUT body never carries the name, so any future caller would
  // have flipped unsaved, saved, and silently never persisted the name
  // (the S60-A bug shape). Name changes flow through the project PATCH
  // route; a store action needs that seam wired first.
  attachProject: (id: string) => void;
  setSaving: () => void;
  // Session 56 (S56-B — M-1): the failure-path reset — the subscriber
  // re-arms the 800ms timer on the transition back to "unsaved" (an
  // automatic retry instead of a stuck "saving" badge and a skipped
  // exit flush).
  setUnsaved: () => void;
  markSaved: (elements: DesignElementDTO[], remap: Map<string, string>) => void;

  // viewport
  setTool: (tool: EditorTool) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  panBy: (dx: number, dy: number) => void;

  // selection
  select: (ids: string[], additive?: boolean) => void;
  selectAll: () => void;
  deselectAll: () => void;

  // element mutations
  addElement: (partial: Partial<DesignElementDTO> & { type: ElementType }) => string | null;
  addElements: (partials: Array<Partial<DesignElementDTO> & { type: ElementType }>) => string[];
  updateElements: (ids: string[], patch: Partial<DesignElementDTO>, commit?: boolean) => void;
  scaleElements: (ids: string[], factor: number, commit?: boolean) => void;
  moveElements: (ids: string[], dx: number, dy: number) => void;
  deleteElements: (ids: string[]) => void;
  reorderElements: (fromIds: string[], toIndex: number) => void;
  toggleVisibility: (id: string) => void;
  toggleLock: (id: string) => void;

  // canvas
  setBackgroundColor: (color: string) => void;

  // history
  // Session 56 (S56-A): the gesture seam replaces the old commit().
  // commit() pushed the POST-gesture state, so the first Ctrl+Z after a
  // drag was a silent no-op — the pre-gesture layout was unreachable.
  // The gesture snapshot is captured BEFORE the live mutations begin
  // (pointer-down) and pushed when the gesture ends (pointer-up, only
  // if it moved).
  beginGesture: () => void;
  endGesture: () => void;
  cancelGesture: () => void;
  undo: () => void;
  redo: () => void;
  // The AI reply's Revert (session 27): restores a captured pre-message
  // snapshot. The restore pushes the CURRENT state onto `past` first — a
  // revert is itself undoable (Ctrl+Z undoes the revert), exactly like
  // every other mutation.
  restoreSnapshot: (snapshot: EditorSnapshot) => void;
};

function snapshotOf(state: {
  elements: DesignElementDTO[];
  backgroundColor: string;
}): Snapshot {
  return { elements: state.elements.map((el) => ({ ...el })), backgroundColor: state.backgroundColor };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  projectId: "",
  projectName: "",
  projectDescription: null,
  backgroundColor: DEFAULT_CANVAS_BACKGROUND,
  elements: [],
  selectedIds: [],
  tool: "select",
  zoom: 1,
  panX: 0,
  panY: 0,
  boardEpoch: 0,
  saveState: "saved",
  past: [],
  future: [],
  gestureSnapshot: null,

  loadProject: (project) =>
    set((state) => ({
      projectId: project.id,
      projectName: project.name,
      projectDescription: project.description,
      backgroundColor: project.backgroundColor,
      elements: (project.elements ?? []).map((el) => ({ ...el })),
      selectedIds: [],
      past: [],
      future: [],
      saveState: "saved",
      // Session 79 (S79-A / A-M1): a load is a LINEAGE BREAK — the
      // epoch moves (attachProject's adoption deliberately does not —
      // the same canvas, freshly bound). The AI transcript's scope
      // guards read this to tell the two "" -> id transitions apart.
      boardEpoch: state.boardEpoch + 1,
      // Session 61 (S61-C — the ninth audit's A-L-2): the load boundary
      // resets the VIEWPORT and the armed tool too. The store is a module
      // singleton surviving App Router soft navigation, so the previous
      // project's zoom/pan and its armed draw tool otherwise leaked into
      // the next one (a left-armed Line tool DREW on the first click
      // instead of selecting; a 500% zoom rendered the new board
      // offscreen).
      zoom: 1,
      panX: 0,
      panY: 0,
      tool: "select",
      // Session 57 (S57-A — the fifth Mode C audit's H-1): a gesture whose
      // pointerdown never got its pointerup/leave pair (an unmount
      // mid-drag, a pointercancel) must NOT leak into the next editor
      // session — the autosave machine's gesture-deferral would otherwise
      // loop forever on the stale snapshot (PUT → setUnsaved → 800ms → …).
      gestureSnapshot: null,
    })),

  attachProject: (id) => set({ projectId: id }),

  setSaving: () => set({ saveState: "saving" }),
  setUnsaved: () => set({ saveState: "unsaved" }),

  markSaved: (elements, remap) =>
    set((state) => ({
      elements,
      selectedIds: state.selectedIds
        .map((id) => remap.get(id) ?? id)
        .filter((id) => elements.some((el) => el.id === id)),
      saveState: "saved",
    })),

  setTool: (tool) => set({ tool }),

  // RA-50 (session 39): the reference's zoom cluster is functional via its
  // BUTTONS with multiplicative steps — x1.2 zoom-in, ÷1.2 zoom-out — hard-
  // clamped to [10%, 500%] (live-measured both ends: the pill stops at 500
  // after repeated zoom-in and holds 10 after repeated zoom-out). The
  // pre-fix clone clamped [0.05, 8]. The clone's Ctrl+wheel superset flows
  // through setZoom and inherits the same coherent range.
  // Session 101 (S101-C / A102-L2 — the F35e two-maps-of-one-domain class):
  // the three actions now ride the ONE exported clampZoom seam (its only
  // other consumer the Ctrl+wheel path in canvas.tsx) — the [0.1, 5]
  // range was hand-maintained in both files before; a future range
  // change now touches exactly one.
  setZoom: (zoom) => set({ zoom: clampZoom(zoom) }),
  zoomIn: () => set((state) => ({ zoom: clampZoom(state.zoom * 1.2) })),
  zoomOut: () => set((state) => ({ zoom: clampZoom(state.zoom / 1.2) })),
  resetView: () => set({ zoom: 1, panX: 0, panY: 0 }),

  panBy: (dx, dy) => set((state) => ({ panX: state.panX + dx, panY: state.panY + dy })),

  select: (ids, additive) =>
    set((state) => ({
      selectedIds: additive
        ? [...new Set([...state.selectedIds, ...ids])]
        : ids,
    })),

  deselectAll: () => set({ selectedIds: [] }),
  selectAll: () => set({ selectedIds: get().elements.filter((el) => el.visible).map((el) => el.id) }),

  addElement: (partial) => {
    // Session 61 (S61-F / A-L-5): the honest return — null when the cap
    // refused the add (both canvas call sites toast on it).
    const ids = get().addElements([partial]);
    return ids[0] ?? null;
  },

  addElements: (partials) => {
    const state = get();
    // Session 61 (S61-F / A-L-5): the client-side half of the ceiling.
    // The server PUT rejects lists over ELEMENT_LIMIT; pre-fix the only
    // way to reach an over-limit board was the server (scripted POSTs),
    // but every CLIENT add path (draw commit, text tool, AI batch-add)
    // fed the store directly — element #2001 rendered, flipped unsaved,
    // and wedged every subsequent autosave PUT in a 400-retry loop. The
    // clamp refuses honestly: the batch is sliced to the room left and
    // only the actually-created ids return (the AI seam counts `applied`
    // on exactly that).
    const room = ELEMENT_LIMIT - state.elements.length;
    if (room <= 0) return [];
    const accepted = partials.slice(0, room);
    const baseIndex = state.elements.length;
    const created = accepted.map((partial, i) => {
      const order = partial.sortOrder ?? baseIndex + i;
      const draft = defaultElementFor(
        partial.type,
        partial.x ?? 100,
        partial.y ?? 100,
        partial.width ?? 120,
        partial.height ?? 120,
        order,
      );
      const el: DesignElementDTO = {
        ...draft,
        ...partial,
        id: nextLocalId(),
        projectId: state.projectId,
        sortOrder: order,
      };
      return el;
    });
    set({
      past: [...state.past, snapshotOf(state)].slice(-60),
      future: [],
      elements: [...state.elements, ...created],
      selectedIds: created.map((el) => el.id),
      saveState: "unsaved",
    });
    return created.map((el) => el.id);
  },

  updateElements: (ids, patch, commit = true) =>
    set((state) => {
      const idSet = new Set(ids);
      const next = state.elements.map((el) => (idSet.has(el.id) ? { ...el, ...patch } : el));
      const base: Partial<EditorStore> = { elements: next, saveState: "unsaved" };
      if (commit) {
        return { ...base, past: [...state.past, snapshotOf(state)].slice(-60), future: [] };
      }
      return base;
    }),

  scaleElements: (ids, factor, commit = true) =>
    set((state) => {
      const idSet = new Set(ids);
      const next = state.elements.map((el) =>
        idSet.has(el.id)
          // Session 70 (S70-D / L-A7): both floors are type-aware
          // (line → 0, non-line → 1) — the pre-fix width floored at 1
          // for every type and the height at 0 for every type,
          // disagreeing with each other AND the resize/panel forms.
          // Session 86 (S86-B / A86-L2): the products ride the shared
          // clampSizeField (the S84-B helper mirroring the server's
          // clampNumber(raw?.width, 0, 100000, …) bound) — the floor
          // survives unchanged and the 100000 CEILING joins it. The
          // sanitizer bounds the MULTIPLIER (0.05..20) but never the
          // PRODUCT: an ×20 scale on a >5000-wide element reached
          // 100000..400000, rendered locally, then visibly teleported
          // to the server's bound when the store-replacing PUT landed
          // (the S84-B teleport family's multiplicative member — every
          // sibling path was already bounded).
          ? {
              ...el,
              width: clampSizeField(el.width * factor, el.type),
              height: clampSizeField(el.height * factor, el.type),
            }
          : el,
      );
      // Session 80 (S80-C / A-L2): the optional commit mirrors
      // updateElements' own form — the AI apply's combined scale+patch
      // operation coalesces into ONE history entry through the gesture
      // seam (beginGesture captures the pre-op snapshot; endGesture
      // pushes it), instead of pushing TWO entries for one intent.
      const base: Partial<EditorStore> = { elements: next, saveState: "unsaved" };
      if (commit) {
        return { ...base, past: [...state.past, snapshotOf(state)].slice(-60), future: [] };
      }
      return base;
    }),

  moveElements: (ids, dx, dy) =>
    set((state) => {
      // Locked elements never move via canvas drags (the pointer wall,
      // S23-3): a multi-selection that includes locked elements (e.g. via
      // Select All, which selects every VISIBLE element) drags only its
      // unlocked members. saveState flips only when something moved.
      const idSet = new Set(ids);
      let moved = false;
      const elements = state.elements.map((el) => {
        if (idSet.has(el.id) && !el.locked) {
          moved = true;
          // Session 87 (S87-B / A87-L1): the accumulated position joins the
          // bounded set — the server's buildElementRow clamps x/y to
          // ±100000, and the store-replacing PUT response would otherwise
          // visibly teleport an element dragged past the bound (~5-10
          // max-zoom-out drags reach it: 2000 screen px at zoom 0.1 =
          // 20000 units each). The S84-B helper at the accumulation's
          // consumer, mirroring the panel fields and scaleElements.
          return {
            ...el,
            x: clampPositionField(el.x + dx),
            y: clampPositionField(el.y + dy),
          };
        }
        return el;
      });
      return moved ? { elements, saveState: "unsaved" as const } : {};
    }),

  deleteElements: (ids) =>
    set((state) => {
      const idSet = new Set(ids);
      return {
        past: [...state.past, snapshotOf(state)].slice(-60),
        future: [],
        elements: state.elements.filter((el) => !idSet.has(el.id)),
        selectedIds: state.selectedIds.filter((id) => !idSet.has(id)),
        saveState: "unsaved",
      };
    }),

  reorderElements: (fromIds, toIndex) =>
    set((state) => {
      // Session 77 (S77-G / A-I2): the S74-B Set-membership family's
      // last member — the pre-fix includes() scans were the O(n*k)
      // form the canvas/panels retired in S73-H/S74-B (once per
      // drag-drop, so the cost was negligible at ELEMENT_LIMIT; the
      // family form is the Set).
      const fromIdSet = new Set(fromIds);
      const moving = state.elements.filter((el) => fromIdSet.has(el.id));
      const rest = state.elements.filter((el) => !fromIdSet.has(el.id));
      const clamped = clamp(toIndex, 0, rest.length);
      const next = [...rest.slice(0, clamped), ...moving, ...rest.slice(clamped)].map((el, i) => ({
        ...el,
        sortOrder: i,
      }));
      // Session 78 (S78-C / A-L2): the no-op bail. A drop onto the
      // neighbor's own lower half computes an insertion index that
      // reproduces the IDENTICAL order (verified by index math: elements
      // [A,B,C], dragging A onto B-lower-half -> reorderElements([A], 0)
      // -> [A,B,C]). Pre-fix the store still pushed an inert history
      // entry (the next Ctrl+Z visibly did nothing), destroyed the redo
      // stack, flipped the badge to Unsaved, and autosaved a
      // byte-identical list — the no-op class the gesture seam exists to
      // prevent. The identity check compares the FULL id sequences
      // (\u0001 joins — a separator no element id carries); an identical
      // sequence returns the state untouched.
      const nextIds = next.map((el) => el.id);
      if (nextIds.join("\u0001") === state.elements.map((el) => el.id).join("\u0001")) {
        return {};
      }
      return {
        past: [...state.past, snapshotOf(state)].slice(-60),
        future: [],
        elements: next,
        saveState: "unsaved",
      };
    }),

  toggleVisibility: (id) =>
    set((state) => ({
      elements: state.elements.map((el) => (el.id === id ? { ...el, visible: !el.visible } : el)),
      saveState: "unsaved",
      // Session 56 (S56-A / L-3): an eye toggle is a real mutation — it
      // joins the history-committed family (individually undoable;
      // Ctrl+Z no longer jumps past it to an older action).
      past: [...state.past, snapshotOf(state)].slice(-60),
      future: [],
    })),

  toggleLock: (id) =>
    set((state) => ({
      elements: state.elements.map((el) => (el.id === id ? { ...el, locked: !el.locked } : el)),
      saveState: "unsaved",
      // Session 56 (S56-A / L-3): the lock toggle too.
      past: [...state.past, snapshotOf(state)].slice(-60),
      future: [],
    })),

  setBackgroundColor: (color) =>
    set((state) => ({
      backgroundColor: color,
      saveState: "unsaved",
      // Session 66 (S66-B — the fourteenth audit's A-3): the
      // gesture-aware commit, updateElements' form. The swatch's
      // textTick-armed burst commits history-free here — the armed
      // gesture's terminal endGesture pushes the ONE pre-picker
      // snapshot. The pre-fix unconditional push meant every
      // intermediate popup color landed a full history entry.
      ...(state.gestureSnapshot
        ? {}
        : { past: [...state.past, snapshotOf(state)].slice(-60), future: [] }),
    })),

  // Session 56 (S56-A): the gesture seam — see the type comment above.
  beginGesture: () => set((state) => ({ gestureSnapshot: snapshotOf(state) })),
  endGesture: () =>
    set((state) =>
      state.gestureSnapshot
        ? {
            past: [...state.past, state.gestureSnapshot].slice(-60),
            future: [],
            gestureSnapshot: null,
          }
        : {}),
  cancelGesture: () => set({ gestureSnapshot: null }),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1]!;
      return {
        past: state.past.slice(0, -1),
        future: [snapshotOf(state), ...state.future].slice(0, 60),
        elements: previous.elements,
        backgroundColor: previous.backgroundColor,
        selectedIds: state.selectedIds.filter((id) => previous.elements.some((el) => el.id === id)),
        saveState: "unsaved",
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const next = state.future[0]!;
      return {
        past: [...state.past, snapshotOf(state)].slice(-60),
        future: state.future.slice(1),
        elements: next.elements,
        backgroundColor: next.backgroundColor,
        selectedIds: state.selectedIds.filter((id) => next.elements.some((el) => el.id === id)),
        saveState: "unsaved",
      };
    }),

  restoreSnapshot: (snapshot) =>
    set((state) => ({
      // A revert is a mutation like any other: the CURRENT state goes onto
      // `past` first, so Ctrl+Z undoes the revert itself (session 27).
      past: [...state.past, snapshotOf(state)].slice(-60),
      future: [],
      elements: snapshot.elements.map((el) => ({ ...el })),
      backgroundColor: snapshot.backgroundColor,
      selectedIds: state.selectedIds.filter((id) => snapshot.elements.some((el) => el.id === id)),
      saveState: "unsaved",
    })),
}));
