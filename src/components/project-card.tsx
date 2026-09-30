"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock,
  FileText,
  Globe,
  Monitor,
  MoreHorizontal,
  Pencil,
  Plus,
  Smartphone,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  CANVAS_BACKGROUND_PRESETS,
  TEMPLATE_META,
  boundsOf,
  type DesignElementDTO,
  type ProjectDTO,
} from "@/lib/editor";
import { memberColorFor } from "@/lib/team";

// The create-dialog's template cards carry the reference's per-template icons
// (session-15 parity fix, SVG-path-verified in the reference's DOM):
// Blank Canvas → file-text, Mobile App → smartphone, Desktop App → monitor,
// Website → globe. (Plus remains only as the unreachable fallback.)
const TEMPLATE_ICONS: Record<string, typeof FileText> = {
  blank: FileText,
  mobile: Smartphone,
  desktop: Monitor,
  website: Globe,
};

// ---------------------------------------------------------------------------
// Canvas thumbnail — a scaled, read-only render of the project's elements
// (the same trick the reference uses: content bbox + margin, fit to 16/10).

export function CanvasThumbnail({
  project,
  elements,
}: {
  project: Pick<ProjectDTO, "backgroundColor" | "id">;
  elements: DesignElementDTO[];
}) {
  const bounds = boundsOf(elements);
  const boxW = 320;
  const boxH = 200; // 16/10
  const margin = 10;
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  if (bounds) {
    const contentW = Math.max(bounds.maxX - bounds.minX, 1);
    const contentH = Math.max(bounds.maxY - bounds.minY, 1);
    scale = Math.min((boxW - margin * 2) / contentW, (boxH - margin * 2) / contentH);
    offsetX = margin - bounds.minX * scale + (boxW - margin * 2 - contentW * scale) / 2;
    offsetY = margin - bounds.minY * scale + (boxH - margin * 2 - contentH * scale) / 2;
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: project.backgroundColor }}
      aria-hidden
    >
      <div
        className="absolute"
        style={{
          width: boxW,
          height: boxH,
          transformOrigin: "left top",
        }}
      >
        <div
          className="relative"
          style={{
            width: boxW,
            height: boxH,
            transform: `scale(${scale}) translate(${offsetX / scale}px, ${offsetY / scale}px)`,
            transformOrigin: "left top",
          }}
        >
          {elements
            .filter((el) => el.visible)
            .map((el) => (
              <div
                key={el.id}
                style={{
                  position: "absolute",
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  transform: `rotate(${el.rotation}deg) scale(${el.scale ?? 1})`,
                  transformOrigin: "0px 0px",
                  opacity: el.opacity,
                  backgroundColor: el.fill ?? undefined,
                  // A line's stroke feeds its SVG diagonal, never the box
                  // border (session 29, RA-8 — the reference's line div
                  // measured border-0).
                  border:
                    el.type !== "line" && el.stroke && el.strokeWidth > 0
                      ? `${el.strokeWidth}px solid ${el.stroke}`
                      : undefined,
                  borderRadius: el.type === "ellipse" ? "50%" : el.radius > 0 ? el.radius : undefined,
                  color: el.type === "text" ? el.fill ?? "#fff" : undefined,
                  fontSize: el.type === "text" ? el.fontSize ?? 16 : undefined,
                  fontWeight: el.type === "text" ? el.fontWeight ?? "500" : undefined,
                  fontFamily: el.type === "text" ? el.fontFamily ?? "Inter" : undefined,
                  display: el.type === "text" ? "flex" : undefined,
                  alignItems: el.type === "text" ? "center" : undefined,
                  textAlign: (el.type === "text" ? el.textAlign ?? "left" : undefined) as React.CSSProperties["textAlign"],
                  whiteSpace: el.type === "text" ? "pre-wrap" : undefined,
                  overflow: "hidden",
                }}
              >
                {el.type === "text" ? el.text : null}
                {el.type === "line" ? (
                  // The reference's line rendering (session 29, RA-8): the
                  // SVG diagonal stroke the canvas shows, in the thumbnail.
                  <svg
                    className="absolute left-0 top-0 overflow-visible"
                    width={Math.max(el.width, 1)}
                    height={Math.max(el.height, 1)}
                    viewBox={`0 0 ${Math.max(el.width, 1)} ${Math.max(el.height, 1)}`}
                    aria-hidden
                  >
                    <line
                      x1={0}
                      y1={0}
                      x2={el.width}
                      y2={el.height}
                      stroke={el.stroke ?? "#FFFFFF"}
                      strokeWidth={el.strokeWidth || 2}
                      strokeLinecap="round"
                    />
                  </svg>
                ) : null}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Project card — measured from the reference: white rounded card, 16/10
// thumbnail with hover overlay, p-3 footer (title, ellipsis menu, opened
// time, avatar stack). Used by both Dashboard sections and the Recent view.

export function ProjectCard({
  project,
  onRenamed,
  onDeleted,
}: {
  project: ProjectDTO;
  onRenamed?: (project: ProjectDTO) => void;
  onDeleted?: (id: string) => void;
}) {
  const router = useRouter();
  const [renameOpen, setRenameOpen] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState(project.name);
  const [renaming, setRenaming] = React.useState(false);

  const elements = project.elements ?? [];
  const opened = new Date(project.lastOpenedAt);
  const openedLabel = `Opened ${
    opened.toLocaleDateString("en-US", { month: "short", day: "numeric" }) ||
    opened.toLocaleDateString()
  }`;

  async function openProject() {
    // Touch lastOpenedAt so "Continue Working" and Recent reorder.
    await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastOpened: true }),
    }).catch(() => null);
    router.push(`/Editor?projectId=${project.id}`);
  }

  async function saveRename() {
    if (renaming) return;
    const name = renameValue.trim();
    if (!name) {
      toast.error("Rename failed", "Project name cannot be empty.");
      return;
    }
    setRenaming(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) {
        toast.error("Rename failed", body?.error?.message ?? "Please try again.");
        return;
      }
      onRenamed?.(body.data.project as ProjectDTO);
      setRenameOpen(false);
      toast.success("Project renamed", name);
    } catch {
      toast.error("Network error", "Could not rename the project.");
    } finally {
      setRenaming(false);
    }
  }

  async function deleteProject() {
    try {
      const response = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) {
        toast.error("Delete failed", body?.error?.message ?? "Please try again.");
        return;
      }
      onDeleted?.(project.id);
      toast.success("Project deleted", project.name);
    } catch {
      toast.error("Network error", "Could not delete the project.");
    }
  }

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-md"
      onClick={() => void openProject()}
      role="button"
      tabIndex={0}
      aria-label={`Open ${project.name}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          void openProject();
        }
      }}
    >
      <div className="block w-full text-left">
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
          <CanvasThumbnail project={project} elements={elements} />
          <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-10" />
        </div>
      </div>
      <div className="p-3">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="flex-1 truncate pr-2 text-sm font-semibold leading-tight text-gray-800">
            {project.name}
          </h3>
          <div onClick={(event) => event.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="iconSm"
                  className="flex-shrink-0 data-[state=open]:bg-gray-100"
                  aria-label={`More options for ${project.name}`}
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onSelect={() => {
                    setRenameValue(project.name);
                    setRenameOpen(true);
                  }}
                >
                  <Pencil />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={deleteProject} className="text-red-600 focus:text-red-600">
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            <span>{openedLabel}</span>
          </div>
          <div className="flex -space-x-2">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white"
              style={{ backgroundColor: "#3B82F6" }}
              title="You"
            >
              <span className="text-[9px] font-medium text-white">Y</span>
            </div>
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white"
              style={{ backgroundColor: memberColorFor(project.id) }}
              title={TEMPLATE_META[project.template]?.label ?? "Collaborator"}
            >
              <span className="text-[9px] font-medium text-white">
                {(TEMPLATE_META[project.template]?.label ?? "D").charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>Give &ldquo;{project.name}&rdquo; a new name.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveRename();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor={`rename-${project.id}`}>Project name</Label>
              <Input
                id={`rename-${project.id}`}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                maxLength={120}
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRenameOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={renaming}>
                {renaming ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The Create New Design dialog — measured from the reference: gradient
// heading, name/description, background-color swatches + custom picker, and
// the 2/4-column template grid with Unsplash previews.

export function CreateProjectDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (project: ProjectDTO) => void;
}) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [background, setBackground] = React.useState(CANVAS_BACKGROUND_PRESETS[0]?.value ?? "#0D1117");
  const [customColor, setCustomColor] = React.useState("#0D1117");
  const [template, setTemplate] = React.useState("blank");
  const [submitting, setSubmitting] = React.useState(false);

  const valid = name.trim().length > 0;

  async function submit() {
    if (!valid || submitting) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          template,
          backgroundColor: background,
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) {
        toast.error("Could not create the project", body?.error?.message ?? "Please try again.");
        return;
      }
      const project = body.data.project as ProjectDTO;
      onCreated(project);
      onOpenChange(false);
      reset();
      toast.success("Project created", project.name);
    } catch {
      toast.error("Network error", "Could not create the project.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setName("");
    setDescription("");
    setBackground(CANVAS_BACKGROUND_PRESETS[0]?.value ?? "#0D1117");
    setTemplate("blank");
  }

  const isPreset = CANVAS_BACKGROUND_PRESETS.some(
    (preset) => preset.value.toLowerCase() === background.toLowerCase(),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="max-h-[90vh] w-[95vw] overflow-y-auto sm:w-full sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-xl text-transparent sm:text-2xl">
            Create New Design File
          </DialogTitle>
          <DialogDescription>Set up a canvas, then pick a starting point.</DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4 sm:space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="new-project-name" className="text-gray-700">
                Project Name *
              </Label>
              <Input
                id="new-project-name"
                placeholder="My Awesome Design"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                required
                className="mt-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="new-project-description" className="text-gray-700">
                Description
              </Label>
              <Textarea
                id="new-project-description"
                placeholder="Describe your project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                className="mt-1 h-16 border-gray-200 focus:border-purple-500 focus:ring-purple-500 sm:h-20"
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-gray-700">Background Color</Label>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {CANVAS_BACKGROUND_PRESETS.map((preset) => {
                const selected = preset.value.toLowerCase() === background.toLowerCase();
                return (
                  <button
                    key={preset.title}
                    type="button"
                    title={preset.title}
                    aria-label={`Background color ${preset.title}`}
                    aria-pressed={selected}
                    onClick={() => setBackground(preset.value)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all sm:h-10 sm:w-10",
                      selected ? "border-purple-500" : "border-gray-200",
                    )}
                    style={{ backgroundColor: preset.value }}
                  >
                    {/* Session-15 parity fix: the reference's selected marker is
                         a lucide Check SVG (w-4 h-4 sm:w-5 sm:h-5, white), not
                         a text glyph. */}
                    {selected && (
                      <Check className="h-4 w-4 text-white sm:h-5 sm:w-5" aria-hidden />
                    )}
                  </button>
                );
              })}
              <label
                className="relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 sm:h-10 sm:w-10"
                title="Custom color"
                aria-label="Custom background color"
              >
                <input
                  type="color"
                  value={isPreset ? customColor : background}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setBackground(e.target.value);
                  }}
                  className="h-full w-full cursor-pointer border-0 bg-transparent p-1"
                />
              </label>
            </div>
          </div>

          <div>
            <Label className="mb-3 block text-gray-700 sm:mb-4">Choose Template</Label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {Object.entries(TEMPLATE_META).map(([key, meta]) => {
                const selected = template === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTemplate(key)}
                    aria-pressed={selected}
                    className={cn(
                      "group rounded-xl border-2 p-3 text-left transition-all hover:scale-105 hover:shadow-xl sm:rounded-2xl sm:p-4",
                      selected
                        ? "border-purple-500 bg-purple-50 shadow-lg"
                        : "border-gray-200 bg-white hover:border-purple-300",
                    )}
                  >
                    <div className="mb-2 aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 sm:mb-3 sm:rounded-xl">
                     
                      <img
                        src={meta.image}
                        alt={`${meta.label} template preview`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="mb-1 flex items-center gap-1 sm:mb-2 sm:gap-2">
                      {/* Session-15 parity fix: the reference renders a distinct
                           lucide icon per template card (file-text / smartphone /
                           monitor / globe — SVG-path-verified), text-purple-600,
                           with NO selected/unselected opacity variation (the old
                           Plus + opacity-40/100 combo was the drift). */}
                      {(() => {
                        const TemplateIcon = TEMPLATE_ICONS[key] ?? Plus;
                        return (
                          <TemplateIcon
                            className="h-3 w-3 flex-shrink-0 text-purple-600 sm:h-4 sm:w-4"
                            aria-hidden
                          />
                        );
                      })()}
                      <span className="truncate text-xs font-semibold text-gray-900 sm:text-sm">
                        {meta.label}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-xs text-gray-600">{meta.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-200 px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!valid || submitting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 font-semibold hover:from-purple-700 hover:to-pink-700"
            >
              {/* Session-15 parity: the reference's submit button is text-only. */}
              {submitting ? "Creating…" : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
