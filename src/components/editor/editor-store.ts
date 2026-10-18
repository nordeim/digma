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
  patchDiffers,
  reuseStableElements,
  sameIdSequence,
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

// Session 111 (S111-A / A-L1 — the fifty-ninth audit's gesture-seam
// completion): the snapshot-identity compare for endGesture's net-zero
// guard. Value-based per element: the gesture seam's own writes spread
// ({ ...el, x, y }) and every DesignElementDTO field is an
// all-primitive value or a JSON string field (fillGradient serializes
// as a string — Session 115 / S115-C / A115-I3: the pre-fix comment
// claimed nested-object reference sharing the DTO never carries), so
// a strict per-key === compare is exact for the unchanged case and
// flips the moment any edit lands. Object.keys order is stable within
// one lineage (every write path spreads), so the key-set compare is
// order-safe.
function snapshotsEqual(a: Snapshot, b: Snapshot): boolean {
  if (a.backgroundColor !== b.backgroundColor) return false;
  if (a.elements.length !== b.elements.length) return false;
  for (let i = 0; i < a.elements.length; i += 1) {
    const x = a.elements[i] as unknown as Record<string, unknown>;
    const y = b.elements[i] as unknown as Record<string, unknown>;
    const xk = Object.keys(x);
    const yk = Object.keys(y);
    if (xk.length !== yk.length) return false;
    for (const k of xk) {
      if (x[k] !== y[k]) return false;
    }
  }
  return true;
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
    set((state) => {
      // Session 153 (S153-A / A120-I1 — the identity-churn family
      // closure): the save round-trip is a REAL transition (a save
      // happened) but its committed VALUES may be content-identical —
      // post-first-save the ids are stable and the wholesale replace
      // was pure churn (a fresh identity for every element on every
      // save, defeating the MemoizedCanvasElement shallow compare — at
      // ELEMENT_LIMIT a 2000-element re-render per save cycle). The
      // closure: reuseStableElements keeps the CURRENT references for
      // content-identical ids (the incoming order still wins — the
      // replace contract's array order IS the sortOrder contract);
      // the first-save remap still replaces (new ids never match);
      // the selectedIds map+filter keeps its reference when the remap
      // is identity and the filter removes nothing. The honest
      // exclusions (the F139 class-census-at-fix doctrine, narrowed by
      // S154-A): loadProject stays a by-definition real transition
      // (the boardEpoch lineage break), while
      // restoreSnapshot's ELEMENTS commit stays a real transition (the
      // history machinery's own arrays — the S114-B value-compare
      // guard already covers its identical-restore window) and its
      // selectedIds member is identity-bounded since S154-A, the
      // eight S109-A/S110-A no-op-guarded mutation arms commit
      // content-different values by construction — their identity
      // churn is legitimate — and addElements' selectedIds commit
      // (named since S155-A, the F139 enumeration-completeness
      // corollary) is a real transition by construction the same
      // way: its created ids are fresh local ids no prior selection
      // can carry, so the keep-form's premise (a content-identical
      // commit) is unconstructible there.
      const nextSelected = state.selectedIds
        .map((id) => remap.get(id) ?? id)
        .filter((id) => elements.some((el) => el.id === id));
      return {
        elements: reuseStableElements(state.elements, elements),
        selectedIds: sameIdSequence(nextSelected, state.selectedIds)
          ? state.selectedIds
          : nextSelected,
        saveState: "saved",
      };
    }),

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

  // Session 118 (S118-D5 / A118-I5 — the sixty-sixth audit's fifth
  // Informational): the additive member's registration. The union
  // form's consumers: the layers-panel's shift-click
  // (select([id], true)) and the canvas marquee's shift commit
  // (S118-A — drag.shift rides the captured flag); the plain form
  // replaces (every other consumer). A117-I1's documented residual
  // rode here until Session 153 (S153-A — the identity-churn family
  // closure): the content-identical commits now keep the current
  // reference, the registration CLOSED.
  // Session 153 (S153-A / A117-I1 — the identity-churn family closure,
  // the selection arms): a content-identical selection commit keeps
  // the CURRENT array reference (the no-op `{}` — the S109-A/S110-A
  // family's own form), so the canvas's selectedIdSet memo and the
  // useEditorStore selector bailouts skip the rebuild (a layers-row
  // click on the singly-selected row rebuilt them for nothing — the
  // A117-I1 registration's own example).
  select: (ids, additive) =>
    set((state) => {
      if (additive) {
        const merged = [...new Set([...state.selectedIds, ...ids])];
        return sameIdSequence(merged, state.selectedIds)
          ? {}
          : { selectedIds: merged };
      }
      return sameIdSequence(ids, state.selectedIds) ? {} : { selectedIds: ids };
    }),

  deselectAll: () =>
    set((state) =>
      state.selectedIds.length === 0 ? {} : { selectedIds: [] },
    ),
  selectAll: () =>
    set((state) => {
      const next = state.elements
        .filter((el) => el.visible)
        .map((el) => el.id);
      // The faithful 0/0 quirk survives: the no-op keeps both lengths
      // unchanged, so the header's Deselect-All text still renders on
      // an empty canvas with nothing selected.
      return sameIdSequence(next, state.selectedIds)
        ? {}
        : { selectedIds: next };
    }),

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
    // Session 110 (S110-A / A-I1 — the fifty-eighth audit's empty-batch
    // member): the no-op commit family's store-level completion. An
    // EMPTY batch with room>0 fell through to the set() below — pushing
    // an inert history snapshot, wiping redo, flipping saveState
    // "unsaved", AND CLEARING THE SELECTION (selectedIds: created.map
    // on an empty array). The S61-F honest-return form: nothing
    // created, nothing committed, the ids answer [].
    if (accepted.length === 0) return [];
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
    // Session 155 (S155-A / A155-I1 — the census-enumeration
    // completion): this arm's selectedIds commit (created.map below)
    // is a real transition BY CONSTRUCTION — the created ids are fresh
    // nextLocalId() values (local-<timestamp36>-<counter>) whose
    // module-lifetime monotonic counter no id already in selectedIds
    // can ever match (server ids are Prisma cuids, never local-
    // prefixed; prior local ids carry smaller counters), so the
    // keep-form's premise — a content-identical commit — is
    // unconstructible here. Named in the markSaved family exclusion
    // census since S155-A (the F139 doctrine's enumeration-
    // completeness corollary: the provably-safe arm named AS safe,
    // never left unnamed).
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
      // Session 109 (S109-A — the fifty-seventh audit's A-L1): the
      // no-op commit family's STORE-LEVEL member. moveElements carried
      // the id-match guard (`moved ? {…} : {}`); this pair unconditionally
      // flipped saveState and pushed an inert snapshot + wiped redo when
      // NO id matched — the delete-mid-window reachability through the
      // panel's commitUpload `?? element` floor (the S107-A guard's own
      // comment claimed this seam already no-oped; the membership scan
      // blocked the PATCH, never the commit's state transition). A
      // zero-match commit never flips saveState, never pushes history,
      // never wipes redo — never arms the PUT.
      //
      // Session 115 (S115-A / A115-L1 — the sixty-third audit's
      // headline): the value-diff guard joins the id-match. The
      // canvas resize write-back (canvas.tsx, commit=false) was the
      // family's last unguarded caller — a clamp-saturated drag (an
      // element already at the width floor dragged against it, a
      // bound-pinned element dragged outward) committed a
      // same-value patch on EVERY pointermove: new identities,
      // saveState "unsaved", the 800ms subscriber arming a
      // byte-identical full-list PUT. The guard compares the LIVE
      // element through the ONE patchDiffers seam — the arm
      // recomputes absolutely from startBounds, so a call-site guard
      // comparing the gesture's captured el would strand an
      // out-and-back gesture's intermediate value (the return tick
      // differs from the live row, not from the start). A same-value
      // commit never flips saveState, never pushes history, never
      // wipes redo — never arms the PUT (the S109-A doctrine, its
      // PUT-arm member).
      let matched = false;
      let changed = false;
      const next = state.elements.map((el) => {
        if (!idSet.has(el.id)) return el;
        matched = true;
        if (patchDiffers(el, patch)) {
          changed = true;
          return { ...el, ...patch };
        }
        return el;
      });
      if (!matched) return {};
      if (!changed) return {};
      const base: Partial<EditorStore> = { elements: next, saveState: "unsaved" };
      if (commit) {
        return { ...base, past: [...state.past, snapshotOf(state)].slice(-60), future: [] };
      }
      return base;
    }),

  scaleElements: (ids, factor, commit = true) =>
    set((state) => {
      const idSet = new Set(ids);
      // Session 116 (S116-A / A116-L1 — the sixty-fourth audit's Low
      // lead): the value-diff guard joins the S109-A id-match guard —
      // the S115-A sibling completion, the no-op family's LAST
      // unguarded mutation arm. A factor that maps back to identity
      // (the identity factor 1, or a clamp-saturated product — a
      // 0-extent line, a dimension already at the 100000 ceiling)
      // committed new same-value object identities, flipped saveState
      // "unsaved", pushed history, wiped redo, and armed the 800ms
      // byte-identical full-list PUT. The one shipped caller (the AI
      // apply's scale arm) guards upstream through scaleWouldChange —
      // but the S115-A doctrine is layer-scoped, never caller-scoped
      // (the F96 form); a future programmatic caller re-opens the
      // no-op commit without this guard. The unchanged member keeps
      // its reference (the memoized canvas skips it).
      let matched = false;
      let changed = false;
      const next = state.elements.map((el) => {
        if (!idSet.has(el.id)) return el;
        matched = true;
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
        const width = clampSizeField(el.width * factor, el.type);
        const height = clampSizeField(el.height * factor, el.type);
        if (width === el.width && height === el.height) return el;
        changed = true;
        return { ...el, width, height };
      });
      // Session 109 (S109-A — the fifty-seventh audit's A-L1): the same
      // id-match guard as updateElements — a zero-match scale never
      // flips saveState, never pushes history, never wipes redo (the
      // AI apply's scale arm passes the LLM's id list; a stale id in
      // the batch must not arm a phantom PUT for the surviving members'
      // sake, and an ALL-stale batch must arm nothing at all).
      if (!matched) return {};
      if (!changed) return {};
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
      // Session 111 (S111-A / A-L1 — the zero-delta member): "moved" is
      // VALUE-based, not membership-based — the pre-fix flag flipped on
      // idSet.has(el.id) && !el.locked, so a zero-delta call (a
      // duplicate/zero-delta pointermove, dx=dy=0) committed new
      // same-value identities and flipped "unsaved" while nothing
      // moved, and a move whose delta the position bound absorbed
      // (already at ±100000) did the same. The clamp-aware compare
      // also keeps the UNCHANGED member's identity (the map returns
      // el itself), so the memoized canvas skips it entirely.
      const idSet = new Set(ids);
      let moved = false;
      const elements = state.elements.map((el) => {
        if (idSet.has(el.id) && !el.locked) {
          // Session 87 (S87-B / A87-L1): the accumulated position joins the
          // bounded set — the server's buildElementRow clamps x/y to
          // ±100000, and the store-replacing PUT response would otherwise
          // visibly teleport an element dragged past the bound (~5-10
          // max-zoom-out drags reach it: 2000 screen px at zoom 0.1 =
          // 20000 units each). The S84-B helper at the accumulation's
          // consumer, mirroring the panel fields and scaleElements.
          const nx = clampPositionField(el.x + dx);
          const ny = clampPositionField(el.y + dy);
          if (nx !== el.x || ny !== el.y) {
            moved = true;
            return { ...el, x: nx, y: ny };
          }
          return el;
        }
        return el;
      });
      return moved ? { elements, saveState: "unsaved" as const } : {};
    }),

  deleteElements: (ids) =>
    set((state) => {
      const idSet = new Set(ids);
      // Session 110 (S110-A / A-L1 — the fifty-eighth audit's headline):
      // the no-op commit family's store-level completion. S109-A closed
      // updateElements/scaleElements while this arm — their sibling —
      // still committed the full transition on a ZERO-match delete (the
      // filter yields a new same-content array; past pushes, redo wipes,
      // saveState flips "unsaved", the PUT arms). The S109-A id-match
      // form: a zero-match commit never flips saveState, never pushes
      // history, never wipes redo — never arms the PUT.
      let matched = false;
      const next = state.elements.filter((el) => {
        if (idSet.has(el.id)) {
          matched = true;
          return false;
        }
        return true;
      });
      if (!matched) return {};
      // Session 153 (S153-A / A117-I1 — the identity-churn family
      // closure, the matched-branch member): the elements change (the
      // real transition) but the selectedIds filter is
      // content-identical when no selected id was among the deleted —
      // the reference survives that churn too.
      const nextSelected = state.selectedIds.filter((id) => !idSet.has(id));
      return {
        past: [...state.past, snapshotOf(state)].slice(-60),
        future: [],
        elements: next,
        selectedIds: sameIdSequence(nextSelected, state.selectedIds)
          ? state.selectedIds
          : nextSelected,
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
      // Session 117 (S117-B / A117-L1 — the sixty-fifth audit's first
      // Low): the renumber keeps the REFERENCE when the value
      // survives — the members outside the moved span (their index
      // unchanged) keep both value AND identity, so the memoized
      // canvas skips them (the S49-1 contract the pre-fix
      // unconditional spread broke: ONE layers drag re-rendered every
      // element on the board — at ELEMENT_LIMIT a full-board
      // re-render per reorder, the React.memo shallow compare on
      // element defeated for members whose value never moved). A
      // gapped server sortOrder still renumbers wherever values
      // differ — the compare is per-member, never a sequence
      // assumption.
      const next = [...rest.slice(0, clamped), ...moving, ...rest.slice(clamped)].map((el, i) =>
        el.sortOrder === i ? el : { ...el, sortOrder: i },
      );
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
    set((state) => {
      // Session 110 (S110-A / A-L1): the id-match guard — the no-op
      // commit family's store-level completion (the S109-A form on the
      // toggle pair; an unknown id never flips saveState, never pushes
      // history, never wipes redo).
      let matched = false;
      const next = state.elements.map((el) => {
        if (el.id !== id) return el;
        matched = true;
        return { ...el, visible: !el.visible };
      });
      if (!matched) return {};
      return {
        elements: next,
        saveState: "unsaved",
        // Session 56 (S56-A / L-3): an eye toggle is a real mutation — it
        // joins the history-committed family (individually undoable;
        // Ctrl+Z no longer jumps past it to an older action).
        past: [...state.past, snapshotOf(state)].slice(-60),
        future: [],
      };
    }),

  toggleLock: (id) =>
    set((state) => {
      // Session 110 (S110-A / A-L1): the id-match guard — the toggle
      // pair's other member (the S109-A form; an unknown id commits
      // nothing).
      let matched = false;
      const next = state.elements.map((el) => {
        if (el.id !== id) return el;
        matched = true;
        return { ...el, locked: !el.locked };
      });
      if (!matched) return {};
      return {
        elements: next,
        saveState: "unsaved",
        // Session 56 (S56-A / L-3): the lock toggle too.
        past: [...state.past, snapshotOf(state)].slice(-60),
        future: [],
      };
    }),

  setBackgroundColor: (color) =>
    set((state) => {
      // Session 110 (S110-A / A-I2): the same-value guard — the no-op
      // commit family's store-level completion, its last member. Both
      // surfaces ride the guarded HexColorRow (the S103-A text-surface
      // census), so a same-value call is unreachable today — but the
      // family doctrine is layer-scoped, not caller-scoped (F96): a
      // re-commit of the CURRENT color never flips saveState, never
      // pushes history, never arms the PUT.
      if (state.backgroundColor === color) return {};
      return {
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
      };
    }),

  // Session 56 (S56-A): the gesture seam — see the type comment above.
  beginGesture: () => set((state) => ({ gestureSnapshot: snapshotOf(state) })),
  // Session 111 (S111-A / A-L1 — the no-op commit family's gesture-seam
  // completion, the ninth arm the S110-A census missed): the NET-ZERO
  // gesture guard. The pre-fix arm's only bail was the null-snapshot
  // one — every terminal discriminates on "an event happened" (the
  // canvas sets moved on ANY pointermove; the panel's markText sets
  // changed on any real commit), never "the net state differs" — so
  // drag right 50px, drag back, release pushed an INERT history entry
  // (the next Ctrl+Z visibly did nothing), wiped the redo stack, and
  // the per-move moveElements calls had already armed a byte-identical
  // PUT: verbatim the S78-C pre-fix symptom list, one seam over. The
  // guard compares the armed snapshot to the live state AT THE LAYER
  // THAT OWNS THE TRANSITION (the F96/F97 doctrine — not in the
  // terminals); identity behaves as cancelGesture: no past push, no
  // future wipe, the snapshot simply clears.
  endGesture: () =>
    set((state) => {
      if (!state.gestureSnapshot) return {};
      if (snapshotsEqual(state.gestureSnapshot, snapshotOf(state))) {
        return { gestureSnapshot: null };
      }
      return {
        past: [...state.past, state.gestureSnapshot].slice(-60),
        future: [],
        gestureSnapshot: null,
      };
    }),
  cancelGesture: () => set({ gestureSnapshot: null }),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1]!;
      // Session 154 (S154-A / A154-I2 — the identity-churn completion,
      // the history-arm member): the elements commit is the real
      // transition; the selectedIds filter is content-identical when
      // the selection fully survives the restore (the common case:
      // undoing a change with the selection retained) — the reference
      // survives that churn too.
      const nextSelected = state.selectedIds.filter((id) =>
        previous.elements.some((el) => el.id === id),
      );
      return {
        past: state.past.slice(0, -1),
        future: [snapshotOf(state), ...state.future].slice(0, 60),
        elements: previous.elements,
        backgroundColor: previous.backgroundColor,
        selectedIds: sameIdSequence(nextSelected, state.selectedIds)
          ? state.selectedIds
          : nextSelected,
        saveState: "unsaved",
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const next = state.future[0]!;
      // Session 154 (S154-A / A154-I2): the redo arm's own filter — the
      // same keep-form as undo (a selection fully surviving the
      // traversal keeps its reference; the elements commit stays the
      // real transition).
      const nextSelected = state.selectedIds.filter((id) =>
        next.elements.some((el) => el.id === id),
      );
      return {
        past: [...state.past, snapshotOf(state)].slice(-60),
        future: state.future.slice(1),
        elements: next.elements,
        backgroundColor: next.backgroundColor,
        selectedIds: sameIdSequence(nextSelected, state.selectedIds)
          ? state.selectedIds
          : nextSelected,
        saveState: "unsaved",
      };
    }),

  restoreSnapshot: (snapshot) =>
    set((state) => {
      // Session 114 (S114-B / A114-L1 — the sixty-second audit's
      // no-op-commit family completion, the eleventh arm): the AI
      // Revert is reachable with the CURRENT state already equal to
      // the stored pre-apply snapshot (undo the apply's commits, then
      // click Revert) — the arm pushed an IDENTICAL-value snapshot
      // into history (the next Ctrl+Z visibly did nothing), wiped
      // redo, flipped the badge, and armed a byte-identical PUT. The
      // S110-A census had classified this arm "by-definition real" —
      // falsified by that constructible window (the F97 class). The
      // guard rides the S111-A value-compare seam: an identical
      // restore behaves as a no-op, never a phantom change.
      if (snapshotsEqual(snapshotOf(state), snapshot)) return {};
      // Session 154 (S154-A / A154-I2 — the identity-churn completion):
      // the ELEMENTS commit stays a real transition (the history
      // machinery's own arrays; the S114-B value-compare guard above
      // covers the identical-restore window) while the selectedIds
      // member joins the identity-bounded class — a selection fully
      // surviving the restore keeps its reference.
      const nextSelected = state.selectedIds.filter((id) =>
        snapshot.elements.some((el) => el.id === id),
      );
      return {
        // A revert is a mutation like any other: the CURRENT state goes onto
        // `past` first, so Ctrl+Z undoes the revert itself (session 27).
        past: [...state.past, snapshotOf(state)].slice(-60),
        future: [],
        elements: snapshot.elements.map((el) => ({ ...el })),
        backgroundColor: snapshot.backgroundColor,
        selectedIds: sameIdSequence(nextSelected, state.selectedIds)
          ? state.selectedIds
          : nextSelected,
        saveState: "unsaved",
      };
    }),
}));
