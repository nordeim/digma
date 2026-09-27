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
import type { EditorTool } from "@/lib/editor";

const TOOLS: Array<{ id: EditorTool; label: string; icon: React.ComponentType<{ className?: string }>; shortcut: string }> = [
  { id: "select", label: "Select", icon: MousePointer, shortcut: "V" },
  { id: "hand", label: "Hand", icon: Move, shortcut: "H" },
  { id: "frame", label: "Frame", icon: Frame, shortcut: "F" },
  { id: "rectangle", label: "Rectangle", icon: Square, shortcut: "R" },
  { id: "ellipse", label: "Ellipse", icon: Circle, shortcut: "O" },
  { id: "line", label: "Line", icon: Minus, shortcut: "L" },
  { id: "pen", label: "Pen Tool", icon: Pen, shortcut: "P" },
  { id: "text", label: "Text", icon: Type, shortcut: "T" },
  { id: "image", label: "Image", icon: ImageIcon, shortcut: "I" },
];

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
        {TOOLS.map((entry, index) => {
          const Icon = entry.icon;
          const isActive = tool === entry.id;
          return (
            <React.Fragment key={entry.id}>
              {(entry.id === "frame" || entry.id === "pen") && (
                <div className="my-1 h-px w-full bg-[#30363d]" role="separator" aria-hidden />
              )}
              <button
                type="button"
                title={`${entry.label} (${entry.shortcut})`}
                aria-label={`${entry.label} tool`}
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
              {index === 1 && <div className="my-1 h-px w-full bg-[#30363d]" role="separator" aria-hidden />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
