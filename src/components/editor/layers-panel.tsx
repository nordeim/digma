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

  const selectedSet = new Set(selectedIds);

  function onRowClick(id: string, event: React.MouseEvent) {
    const store = useEditorStore.getState();
    if (event.shiftKey) {
      store.select([id], true);
    } else {
      store.select([id]);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-[#30363d] p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Layers</h3>
          {/* Reference semantics, measured from the live DOM: the label (and
              action) flip when the selection covers the layer list —
              selected.length === layers.length ? Deselect : Select. Note the
              faithfully-kept live quirk: an EMPTY canvas (0/0) renders
              "Deselect All" exactly like the reference app. */}
          <button
            type="button"
            onClick={() => {
              const store = useEditorStore.getState();
              if (selectedIds.length === elements.length) {
                store.deselectAll();
              } else {
                store.selectAll();
              }
            }}
            className="text-xs text-gray-400 transition-colors hover:text-white"
          >
            {selectedIds.length === elements.length ? "Deselect All" : "Select All"}
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
                  onDoubleClick={() => {
                    setRenaming(el.id);
                    setRenameValue(el.name ?? "");
                  }}
                  onClick={(event) => onRowClick(el.id, event)}
                  className={cn(
                    "group flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-all duration-200",
                    isSelected ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-[#30363d]",
                  )}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`Layer ${el.name ?? el.type}`}
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") onRowClick(el.id, event as unknown as React.MouseEvent);
                  }}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" aria-hidden />
                  <div className="min-w-0 flex-1">
                    {renaming === el.id ? (
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => {
                          if (renameValue.trim()) {
                            useEditorStore.getState().updateElements([el.id], { name: renameValue.trim() });
                          }
                          setRenaming(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                          if (e.key === "Escape") setRenaming(null);
                        }}
                        // Session-19 fix (S19-1) — the reference's measured
                        // chrome (double-click on a layer row name, live DOM):
                        // the input renders the shadcn-Input base plus editor
                        // overrides — rounded-md, a VISIBLE border-[#30363d],
                        // bg-[#0d1117], text-white, h-6 px-2 py-1, text-sm,
                        // shadow-sm — with the focus ring only on
                        // focus-visible. The previous `rounded px-1 ring-1
                        // ring-blue-500` shipped an always-on blue ring, no
                        // border, and the wrong rounding/padding.
                        className="h-6 w-full rounded-md border border-[#30363d] bg-[#0d1117] px-2 py-1 text-sm text-white shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="truncate text-sm font-medium">{el.name ?? el.type}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={el.visible ? "Hide layer" : "Show layer"}
                      onClick={(event) => {
                        event.stopPropagation();
                        useEditorStore.getState().toggleVisibility(el.id);
                      }}
                      className="rounded p-1 opacity-0 transition-colors hover:bg-white/10 group-hover:opacity-100 aria-hidden:focus:opacity-100"
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
                          cursor-not-allowed + cursor:default); the clone's
                          pointer-events:none approach is the observably
                          equivalent working implementation. */}
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
