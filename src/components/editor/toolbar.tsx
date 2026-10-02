"use client";

import * as React from "react";
import {
  Circle,
  Frame,
  Image as ImageIcon,
  Minus,
  MousePointer,
  Move,
  Pen,
  Square,
  Type,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useEditorStore } from "./editor-store";
import { TOOL_SHORTCUTS, type EditorTool } from "@/lib/editor";

// Icons are presentation; the LABELS + SHORTCUTS come from the single-source
// seam in src/lib/editor.ts (session 48 wired the shortcuts; session 49
// moved the labels there too — the toolbar titles AND the shortcuts dialog
// consume one source, the F35e lesson).
const TOOL_META: Array<{ id: EditorTool; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "select", icon: MousePointer },
  { id: "hand", icon: Move },
  { id: "frame", icon: Frame },
  { id: "rectangle", icon: Square },
  { id: "ellipse", icon: Circle },
  { id: "line", icon: Minus },
  { id: "pen", icon: Pen },
  { id: "text", icon: Type },
  { id: "image", icon: ImageIcon },
];

const LABEL_FOR = new Map(TOOL_SHORTCUTS.map((entry) => [entry.id, entry.label]));
const SHORTCUT_FOR = new Map(TOOL_SHORTCUTS.map((entry) => [entry.id, entry.shortcut]));

// The w-12 icon toolbar — measured from the reference: dark rail, 8px
// buttons with titles (accessible names), active = bg-blue-600 text-white,
// a divider between navigate (select/hand) and shape tools.
export function Toolbar() {
  const tool = useEditorStore((s) => s.tool);
  const setTool = useEditorStore((s) => s.setTool);

  return (
    <div
      className="flex w-12 flex-shrink-0 flex-col items-center border-r border-[#30363d] bg-[#161b22] py-2"
      role="toolbar"
      aria-label="Editor tools"
      aria-orientation="vertical"
    >
      <div className="flex flex-col gap-1 p-2">
        {TOOL_META.map((entry, index) => {
          const Icon = entry.icon;
          const isActive = tool === entry.id;
          const label = LABEL_FOR.get(entry.id) ?? entry.id;
          const shortcut = SHORTCUT_FOR.get(entry.id) ?? "";
          return (
            <React.Fragment key={entry.id}>
              {(entry.id === "frame" || entry.id === "pen") && (
                <div className="my-1 h-px w-full bg-[#30363d]" role="separator" aria-hidden />
              )}
              <button
                type="button"
                title={`${label} (${shortcut})`}
                aria-label={`${label} tool`}
                aria-pressed={isActive}
                onClick={() => setTool(entry.id)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-[#30363d] hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </button>
              {/* Session 57 (S57-F / L-5): the duplicate index === 1 divider
                  is gone — the frame/pen conditions above carry the grouping
                  alone (the old double divider stacked two 1px separators
                  at the hand→frame boundary). */}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
