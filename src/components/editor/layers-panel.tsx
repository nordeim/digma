"use client";

import * as React from "react";
import { Circle, Frame, Image as ImageIcon, Minus, Pen, Square, Type } from "lucide-react";

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
// eye/lock hover actions, selected row bg-blue-600).
export function LayersPanel() {
  const elements = useEditorStore((s) => s.elements);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const [renaming, setRenaming] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState("");
  const [dragOver, setDragOver] = React.useState<number | null>(null);

  const selectedSet = new Set(selectedIds);

  function onRowClick(id: string, event: React.MouseEvent) {
    const store = useEditorStore.getState();
    if (event.shiftKey) {
      store.select([id], true);
    } else {
      store.select([id]);
    }
  }

  function onDrop(index: number) {
    setDragOver(null);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-[#30363d] p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Layers</h3>
          <button
            type="button"
            onClick={() => useEditorStore.getState().deselectAll()}
            className="text-xs text-gray-400 transition-colors hover:text-white"
          >
            Deselect All
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
              <div
                key={el.id}
                className="relative"
                onDragOver={(event) => {
                  event.preventDefault();
                  const rect = event.currentTarget.getBoundingClientRect();
                  const after = event.clientY > rect.top + rect.height / 2;
                  setDragOver(after ? elements.length - 0 : 0);
                }}
                onDrop={() => onDrop(0)}
              >
                <div
                  draggable={renaming !== el.id}
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/layer-id", el.id);
                    event.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    const rows = Array.from(
                      event.currentTarget.parentElement?.parentElement?.children ?? [],
                    );
                    const rect = event.currentTarget.getBoundingClientRect();
                    const after = event.clientY > rect.top + rect.height / 2;
                    const ownIndex =
                      elements.length - 1 - rows.indexOf(event.currentTarget.parentElement as Element);
                    setDragOver(Math.min(Math.max(after ? ownIndex + 1 : ownIndex, 0), elements.length));
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const fromId = event.dataTransfer.getData("text/layer-id");
                    if (fromId && dragOver !== null) {
                      // Reverse-mapped display order -> element order.
                      useEditorStore.getState().reorderElements([fromId], elements.length - dragOver);
                    }
                    setDragOver(null);
                  }}
                  onDoubleClick={() => {
                    setRenaming(el.id);
                    setRenameValue(el.name ?? "");
                  }}
                  onClick={(event) => onRowClick(el.id, event)}
                  className={cn(
                    "group flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-all duration-200",
                    isSelected ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-[#21262d]",
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
                        className="w-full rounded bg-[#0d1117] px-1 text-sm text-white outline-none ring-1 ring-blue-500"
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
                      {el.visible ? (
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                          <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                          <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                          <path d="m2 2 20 20" />
                        </svg>
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
                      {el.locked ? (
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <rect width="18" height="11" x="3" y="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <rect width="18" height="11" x="3" y="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                          <path d="m2 2 20 20" opacity="0" />
                        </svg>
                      )}
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
