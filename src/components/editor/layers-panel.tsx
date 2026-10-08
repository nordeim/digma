"use client";

import * as React from "react";
import { Circle, Eye, EyeOff, Frame, Image as ImageIcon, Lock, Minus, Pen, Square, Trash2, Type } from "lucide-react";

import { cn } from "@/lib/utils";
import { useEditorStore } from "./editor-store";
import type { DesignElementDTO } from "@/lib/editor";

const TYPE_ICON: Record<DesignElementDTO["type"], React.ComponentType<{ className?: string }>> = {
  rectangle: Square,
  ellipse: Circle,
  line: Minus,
  text: Type,
  frame: Frame,
  image: ImageIcon,
  path: Pen,
};

// The Layers panel — measured from the reference (w-60 dark panel, header
// with "Deselect All", "N layers • N selected" counter, draggable rows with
// eye/lock/trash hover actions, selected row bg-blue-600). The trash is the
// session-17 find: the reference renders THREE hover actions per row and its
// delete is IMMEDIATE (no confirm — verified live: 1 layer → 0); recovery is
// undo, which this store already snapshots (60 deep).
export function LayersPanel() {
  const elements = useEditorStore((s) => s.elements);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const [renaming, setRenaming] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState("");
  // Session 78 (S78-C / A-L5): the WebKit blur-on-removal guard. Escape
  // clears the renaming state, UNMOUNTING the focused input — WebKit
  // dispatches blur on focused-node removal (Chromium does not; the e2e
  // matrix is Chromium-only), so the draft the user meant to DISCARD
  // could commit through the blur handler. The ref marks the discard;
  // the blur commit honors it. Harmless belt in Chromium.
  const renameDiscarded = React.useRef(false);

  const selectedSet = new Set(selectedIds);
  // Session 61 (S61-D / A-L-4): the hidden-family state drives the Select
  // All disable — computed once beside the other derived sets.
  const visible = elements.filter((el) => el.visible);
  // Session 71 (S71-A — the nineteenth audit's A-F8): the header's flip
  // condition, declared ONCE and consumed by BOTH the label and the
  // handler — pre-fix the identical expression was computed twice ~10
  // lines apart (the drift-hazard class).
  // Session 57 (S57-F / L-1 — the fifth Mode C audit): the flip condition
  // is visible-elements-aware. selectAll selects the VISIBLE family only
  // — comparing against elements.length meant the label could never flip
  // while any layer was hidden (every click re-ran selectAll, a no-op).
  // Session 74 (S74-B — A74-L2): the flip consumes the selectedSet the
  // panel already builds above (the row checks' own seam) — the
  // visible.every(selectedIds.includes) form was the O(n·m) scan the
  // canvas's S73-H fix retired, re-running on every elements-committed
  // re-render.
  const allVisibleSelected =
    elements.length === 0 ||
    (visible.length > 0 && visible.every((el) => selectedSet.has(el.id)));

  function onRowClick(id: string, event: { shiftKey: boolean }) {
    const store = useEditorStore.getState();
    if (event.shiftKey) {
      store.select([id], true);
    } else {
      store.select([id]);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-editor-border p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Layers</h3>
          {/* Reference semantics, measured from the live DOM: the label (and
              action) flip when the selection covers the layer list —
              selected.length === layers.length ? Deselect : Select. Note the
              faithfully-kept live quirk: an EMPTY canvas (0/0) renders
              "Deselect All" exactly like the reference app. */}
          <button
            type="button"
            // Session 61 (S61-D — the ninth audit's A-L-4): with elements
            // present but every layer hidden, the click could select
            // nothing (selectAll is visible-only) — a dead control that
            // lied. The honest fix disables it in that state. The 0-element
            // "Deselect All" quirk above is deliberately preserved
            // (reference parity, pinned by the S57-F suite).
            disabled={elements.length > 0 && visible.length === 0}
            onClick={() => {
              const store = useEditorStore.getState();
              if (allVisibleSelected) {
                store.deselectAll();
              } else {
                store.selectAll();
              }
            }}
            className="text-xs text-gray-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {allVisibleSelected ? "Deselect All" : "Select All"}
          </button>
        </div>
        <div className="text-xs text-gray-400">
          {elements.length} {elements.length === 1 ? "layer" : "layers"}
          {selectedIds.length > 0 && <span className="ml-2 text-blue-400">• {selectedIds.length} selected</span>}
        </div>
      </div>

      <div className="editor-scroll flex-1 overflow-y-auto">
        <div className="p-2">
          {elements.length === 0 && (
            <div className="px-3 py-8 text-center">
              <p className="text-xs text-gray-500">No layers yet</p>
              <p className="mt-1 text-[10px] text-gray-600">Start designing to see layers here</p>
            </div>
          )}
          {[...elements].reverse().map((el) => {
            const Icon = TYPE_ICON[el.type] ?? Square;
            const isSelected = selectedSet.has(el.id);
            return (
              <div key={el.id} className="relative">
                <div
                  draggable={renaming !== el.id}
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/layer-id", el.id);
                    event.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(event) => {
                    // Allow the drop (the HTML5 DnD contract). The insertion
                    // index is computed FROM THE EVENT at drop time — no
                    // state, no closure staleness (session-21 fix).
                    event.preventDefault();
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const fromId = event.dataTransfer.getData("text/layer-id");
                    if (!fromId || fromId === el.id) return;
                    const store = useEditorStore.getState();
                    const remaining = store.elements.filter((e) => e.id !== fromId);
                    const targetIndex = remaining.findIndex((e) => e.id === el.id);
                    if (targetIndex === -1) return;
                    const rect = event.currentTarget.getBoundingClientRect();
                    const after = event.clientY > rect.top + rect.height / 2;
                    // Rows render in REVERSE element order, so "below row X
                    // on screen" = insert at X's index in the
                    // elements-minus-dragged array (X keeps its slot and the
                    // dragged row renders after it); "above row X" = one
                    // index later. reorderElements inserts at the given index
                    // in that same array, so the list ends land exactly at
                    // the top/bottom via its clamp.
                    store.reorderElements([fromId], after ? targetIndex : targetIndex + 1);
                  }}
                  onDoubleClick={(event) => {
                    // Session 61 (S61-D / A-L-1 — the ninth audit): the
                    // nested-control guard, applied to dblclick. The
                    // eye/lock buttons stop propagation on CLICK only, so a
                    // rapid double-toggle bubbled a dblclick into this
                    // handler and silently stole focus into rename mode.
                    // Session 70 (S70-A): the guard's selector follows the
                    // restructure — the ACTION trio is scoped by its
                    // data-layer-action wrapper and the rename input by its
                    // tag; the select button (the row's own primary surface)
                    // is deliberately EXEMPT so a double-click on the name
                    // still opens the rename (the reference's measured
                    // contract — double-click on a layer row's name).
                    if ((event.target as HTMLElement).closest("[data-layer-action], input")) return;
                    // Session 78 (S78-C / A-L5): re-arm the discard guard
                    // for the fresh rename session.
                    renameDiscarded.current = false;
                    setRenaming(el.id);
                    setRenameValue(el.name ?? "");
                  }}
                  className={cn(
                    "group flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-all duration-200",
                    isSelected ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-editor-border",
                  )}
                  // Session 70 (S70-A / M-A2 — the eighteenth audit): the
                  // WAI-ARIA button-pattern violation closed — the row was a
                  // div carrying the button ROLE with NESTED interactive
                  // descendants (the rename input + the eye/lock/trash
                  // trio), which AT flattens or misannounces. The select
                  // surface is now a REAL button (below); the row keeps the
                  // drag-reorder handlers + the dblclick rename entry (the
                  // forbidden literal is deliberately not quoted here —
                  // absence pins read comments, the F50(1) lesson).
                  // data-layer-row is the row container's semantic marker
                  // (no AT impact).
                  data-layer-row
                >
                  {renaming === el.id ? (
                    <input
                      autoFocus
                      aria-label={`Rename layer ${el.name ?? el.type}`}
                      // Session 63 (S63-D / B-L3): the server clamps names
                      // at 80 (the row-builder's text clamp — session 71
                      // folded the twin into clampText) — the input cap
                      // keeps the local edit and the persisted row from
                      // diverging past 80 chars.
                      maxLength={80}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => {
                        // Session 78 (S78-C / A-L1): the no-change guard —
                        // the InlineProjectRename sibling's form. A
                        // rename-open-then-blur with an UNCHANGED name
                        // previously pushed a full history snapshot, wiped
                        // redo, flipped the badge to Unsaved, and fired a
                        // redundant PUT for a byte-identical value — the
                        // "a gesture that changed nothing cancels"
                        // doctrine (S56-A) violated. The commit runs only
                        // when the trimmed draft differs (and never when
                        // Escape discarded it — the ref guard below).
                        if (
                          !renameDiscarded.current &&
                          renameValue.trim() &&
                          renameValue.trim() !== (el.name ?? "")
                        ) {
                          useEditorStore.getState().updateElements([el.id], { name: renameValue.trim() });
                        }
                        setRenaming(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                        // Session 78 (S78-C / A-L5): Escape DISCARDS — the
                        // ref arms the blur guard before the unmount (the
                        // WebKit focusout-on-removal path), then clears.
                        if (e.key === "Escape") {
                          renameDiscarded.current = true;
                          setRenaming(null);
                        }
                      }}
                      // Session-19 fix (S19-1) — the reference's measured
                      // chrome (double-click on a layer row name, live DOM):
                      // the input renders the shadcn-Input base plus editor
                      // overrides — rounded-md, a VISIBLE border-editor-border,
                      // bg-editor-bg, text-white, h-6 px-2 py-1, text-sm,
                      // shadow-sm — with the focus ring only on
                      // focus-visible. The previous `rounded px-1 ring-1
                      // ring-blue-500` shipped an always-on blue ring, no
                      // border, and the wrong rounding/padding.
                      // Session 70 (S70-A): the input is now the select
                      // button's SIBLING (the row's direct child, flex-1 —
                      // the nesting that made the row a WAI-ARIA violation
                      // is gone), carrying its own accessible name.
                      className="h-6 min-w-0 flex-1 rounded-md border border-editor-border bg-editor-bg px-2 py-1 text-sm text-white shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={`Layer ${el.name ?? el.type}`}
                      onClick={(event) => onRowClick(el.id, event)}
                      // Session 70 (S70-A / M-A2): the select surface — a
                      // REAL button (native Enter/Space activation replaces
                      // the row's hand-rolled S57-F/S59-A keydown pair; the
                      // S59-A nested-control exemption is structurally
                      // unnecessary now the actions are siblings). The
                      // aria-pressed toggle + the "Layer …" accessible name
                      // ride the button, so every standing locator family
                      // (getByRole button name Layer X, the 40 attribute
                      // selectors, the aria-pressed pins) survives.
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" aria-hidden />
                      <div className="min-w-0 flex-1 truncate text-sm font-medium">{el.name ?? el.type}</div>
                    </button>
                  )}
                  <div className="flex items-center gap-1" data-layer-action>
                    <button
                      type="button"
                      aria-label={el.visible ? "Hide layer" : "Show layer"}
                      onClick={(event) => {
                        event.stopPropagation();
                        useEditorStore.getState().toggleVisibility(el.id);
                      }}
                      className="rounded p-1 opacity-0 transition-colors hover:bg-white/10 group-hover:opacity-100 focus:opacity-100"
                    >
                      {/* Session-19 (S19-4): lucide-react components, not
                          hand-inlined SVGs — the reference's DOM carries
                          `lucide lucide-eye w-3 h-3` (component-generated).
                          The eye swap (eye ↔ eye-off) is the clone's working
                          superset over the reference's no-op eye. */}
                      {el.visible ? (
                        <Eye className="h-3 w-3" aria-hidden strokeWidth={2} />
                      ) : (
                        <EyeOff className="h-3 w-3" aria-hidden strokeWidth={2} />
                      )}
                    </button>
                    <button
                      type="button"
                      aria-label={el.locked ? "Unlock layer" : "Lock layer"}
                      onClick={(event) => {
                        event.stopPropagation();
                        useEditorStore.getState().toggleLock(el.id);
                      }}
                      className="rounded p-1 opacity-0 transition-colors hover:bg-white/10 group-hover:opacity-100 focus:opacity-100"
                    >
                      {/* Session-19 fix (S19-2) — the reference's lock is
                          OPACITY-BASED, not icon-swap-based: the same
                          lucide-lock icon in both states, the svg's opacity
                          class flipping 50 (unlocked) ↔ 100 (locked)
                          (measured live on three rows, one locked via a real
                          click: `lucide lucide-lock w-3 h-3 opacity-50` /
                          `opacity-100`). The lock is FUNCTIONAL in the
                          reference (the canvas element gains
                          cursor-not-allowed + cursor:default); the clone
                          implements the same contract through the canvas's
                          hit-test wall — the locked TOPMOST element eats
                          the pointer (no selection change, no drag,
                          nothing beneath displaced) — plus the same
                          cursor-not-allowed chrome (session 23, S23-1: a
                          CSS pointer-suppression approach turned the lock
                          into a window whose drags fell through and
                          displaced the element beneath — never again). */}
                      <Lock
                        className={cn("h-3 w-3", el.locked ? "opacity-100" : "opacity-50")}
                        aria-hidden
                        strokeWidth={2}
                      />
                    </button>
                    {/* Session-17 parity fix: the reference's THIRD row action —
                        a red trash that deletes the layer immediately (measured:
                        p-1 hover:bg-red-500/20 rounded text-red-400 opacity-0
                        group-hover:opacity-100, lucide-trash2 w-3 h-3; clicking
                        it live-deleted the reference's layer with no confirm).
                        Undo (Ctrl+Z) is the recovery path — deleteElements
                        pushes the history snapshot and the autosave replace
                        contract persists the removal. */}
                    <button
                      type="button"
                      aria-label={`Delete layer ${el.name ?? el.type}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        useEditorStore.getState().deleteElements([el.id]);
                      }}
                      className="rounded p-1 text-red-400 opacity-0 transition-colors hover:bg-red-500/20 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
