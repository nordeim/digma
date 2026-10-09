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
  X,
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
import { call } from "@/lib/call";
import {
  CANVAS_BACKGROUND_PRESETS,
  TEMPLATE_META,
  boundsOf,
  canvasFontFamily,
  FALLBACK_WHITE,
  fillPaintFor,
  textAlignToJustify,
  thumbnailFit,
  type DesignElementDTO,
  type ProjectDTO,
  type ProjectSummaryDTO,
  type ThumbnailElementDTO,
} from "@/lib/editor";

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
  project: Pick<ProjectDTO, "backgroundColor">;
  // Session 70 (S70-C): the thumbnail consumes the PROJECTED rows (the
  // list-family routes ship the bounded projection; the detail/editor
  // rows are a structural superset and fit the same param).
  // Session 71 (S71-A): the Pick drops the dead id — only the
  // backgroundColor is read (the nineteenth audit's A-F12).
  elements: ThumbnailElementDTO[];
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

  // Session 65 (S65-A — the thirteenth audit's A-1): the painted space
  // is fixed at 320x200, but the PARENT box is not — the grid's
  // ratio-locked slot narrows with the viewport and the files-list's
  // square slot is 40x40. The pre-fix wrapper anchored the full-size
  // painted box at the parent's top-left and let the overflow crop do
  // the "sizing": the square slot showed a corner sliver (the seeded
  // demo elements measured ZERO visible area) and the grid slot at
  // laptop widths cropped ~28% of the fitted content. The reference's
  // decoded contract scales the mini-canvas INSIDE the slot (the
  // session-39 RA-48 measurement) — the wrapper now carries the
  // measured min-fit scale + centering translate (a layout effect + a
  // resize observer: the card grids mount client-side after their
  // fetch, so the measurement lands before the first paint).
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [fit, setFit] = React.useState({ scale: 1, tx: 0, ty: 0 });
  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      setFit(thumbnailFit(el.clientWidth, el.clientHeight, boxW, boxH));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
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
          transform: `translate(${fit.tx}px, ${fit.ty}px) scale(${fit.scale})`,
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
                  // The one fill paint seam (session 41, RA-54): image >
                  // gradient > solid; text keeps its own color contract.
                  ...(el.type !== "text" ? fillPaintFor(el) : {}),
                  // A line's stroke feeds its SVG diagonal, never the box
                  // border (session 29, RA-8 — the reference's line div
                  // measured border-0).
                  border:
                    el.type !== "line" && el.stroke && el.strokeWidth > 0
                      ? `${el.strokeWidth}px solid ${el.stroke}`
                      : undefined,
                  borderRadius: el.type === "ellipse" ? "50%" : el.radius > 0 ? el.radius : undefined,
                  color: el.type === "text" ? el.fill ?? FALLBACK_WHITE : undefined,
                  fontSize: el.type === "text" ? el.fontSize ?? 16 : undefined,
                  fontWeight: el.type === "text" ? el.fontWeight ?? "500" : undefined,
                  fontFamily: el.type === "text" ? canvasFontFamily(el.fontFamily) : undefined,
                  display: el.type === "text" ? "flex" : undefined,
                  alignItems: el.type === "text" ? "center" : undefined,
                  textAlign: (el.type === "text" ? el.textAlign ?? "left" : undefined) as React.CSSProperties["textAlign"],
                  // Session 73 (S73-A — A-F2): the canvas maps the
                  // alignment onto justify-content so it is VISIBLE — the
                  // thumbnail renders the same mapping through the shared
                  // seam (pre-fix every Dashboard/Recent card showed
                  // centered text LEFT-ALIGNED while the canvas and both
                  // export formats rendered it centered).
                  justifyContent: (el.type === "text"
                    ? textAlignToJustify(el.textAlign)
                    : undefined) as React.CSSProperties["justifyContent"],
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
                    {/* Session 103 (S103-B / A-L4): the stored stroke width
                        renders — 0 paints no stroke (the canvas sibling's
                        doctrine; defaultGeometry owns the fresh-line 2). */}
                    <line
                      x1={0}
                      y1={0}
                      x2={el.width}
                      y2={el.height}
                      stroke={el.stroke ?? FALLBACK_WHITE}
                      strokeWidth={el.strokeWidth}
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
// The inline rename row (session 41, RA-52) — the reference's GRID-card
// ellipsis Rename is an INLINE header-row editor, NOT a dialog: the card's
// h3 area swaps to a div.flex.items-center.gap-1.w-full carrying the input
// (the shadcn Input base + h-7 text-sm, AUTO-FOCUSED, its value initialized
// from the project's CURRENT name on every open — the coherent superset
// over the reference's stale-draft quirk: its X-cancel leaves the last
// uncommitted draft in state, so reopening shows the draft, not the name),
// a Check button (the default variant + h-7 w-7 p-0 rounded-md text-xs +
// lucide-check w-4 h-4) committing the PATCH, and an X button (the ghost
// variant, same size, lucide-x w-4 h-4) discarding. Enter submits,
// Escape discards. The S31-3 seam applies doubly here: the row renders
// INSIDE the card's onClick-wrapped root, so it stops click AND keydown
// propagation (Enter/Escape drive the rename, never the card's open).

export function InlineProjectRename({
  project,
  onRenamed,
  onCancel,
}: {
  project: ProjectSummaryDTO;
  onRenamed: (project: ProjectSummaryDTO) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = React.useState(project.name);
  const [saving, setSaving] = React.useState(false);

  async function commit() {
    if (saving) return;
    const name = value.trim();
    if (!name) {
      toast.error("Rename failed", "Project name cannot be empty.");
      return;
    }
    if (name === project.name) {
      onCancel();
      return;
    }
    setSaving(true);
    // Session 71 (S71-A / L-A1): the rename rides the ONE call() seam —
    // the errorTitle option carries the card's own toast copy (the
    // per-site hand-rolled unwrap + catch branches died with the
    // migration; the unified fallback description is the seam's).
    // Session 72 (S72-A): the call is typed as the route's ACTUAL
    // envelope payload and the member is unwrapped BEFORE the callback —
    // the S71-A migration lost the hand-rolled form's `.project` read
    // (call() returns body.data itself, so the wrapper crossed the
    // callback boundary and every consumer's id compare never matched:
    // the card title kept the stale name after a successful rename).
    const renamed = await call<{ project: ProjectSummaryDTO }>(
      `/api/projects/${project.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ name }),
      },
      { errorTitle: "Rename failed" },
    );
    if (renamed?.project) {
      toast.success("Project renamed", name);
      // Session 70 (S70-C): the PATCH response ships the summary shape.
      onRenamed(renamed.project);
    }
    setSaving(false);
  }

  return (
    <div
      className="pointer-events-auto flex w-full items-center gap-1"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <Input
        autoFocus
        aria-label={`Rename ${project.name}`}
        value={value}
        maxLength={120}
        disabled={saving}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            void commit();
          } else if (event.key === "Escape") {
            event.preventDefault();
            onCancel();
          }
        }}
        className="h-7 text-sm"
      />
      <Button
        type="button"
        size="iconSm"
        className="flex-shrink-0"
        disabled={saving}
        aria-label="Save rename"
        onClick={() => void commit()}
      >
        <Check className="h-4 w-4" aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="iconSm"
        className="flex-shrink-0"
        disabled={saving}
        aria-label="Cancel rename"
        onClick={onCancel}
      >
        <X className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Project card — measured from the reference: white rounded card, 16/10
// thumbnail with hover overlay, p-3 footer (title, ellipsis menu, opened
// time, avatar stack). Used by both Dashboard sections and the Recent view.

export function ProjectCard({
  project,
  userInitial,
  onRenamed,
  onDeleted,
}: {
  project: ProjectSummaryDTO;
  // Session 63 (S63-C / A-L2): the RA-53 documented contract — the first
  // avatar chip carries the REAL-USER initial (title "You", the RA-40
  // working-superset family), not a hardcoded constant. Both call sites
  // derive it from the signed-in user's name.
  userInitial: string;
  onRenamed?: (project: ProjectSummaryDTO) => void;
  onDeleted?: (id: string) => void;
}) {
  const router = useRouter();
  const [renameOpen, setRenameOpen] = React.useState(false);
  // The delete confirm (session 31, S31-2): a destructive, undo-less action
  // requires an explicit second interaction — the reference's own guard is a
  // native window.confirm (RA-16); the clone's convention is a dialog local
  // to the card (never a global AlertDialog).
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const elements = project.elements ?? [];
  const opened = new Date(project.lastOpenedAt);
  // Session 73 (S73-H — A-F4): the dead `|| toLocaleDateString()` twin
  // died — a Date formatted through toLocaleDateString NEVER returns ""
  // (an invalid date yields the truthy "Invalid Date"), so the fallback
  // was unreachable while a corrupt lastOpenedAt still rendered
  // "Opened Invalid Date". The honest guard: a NaN timestamp renders the
  // bare label, never the garbage form.
  const openedLabel = Number.isNaN(opened.getTime())
    ? "Opened —"
    : `Opened ${opened.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  function openProject() {
    // Touch lastOpenedAt so "Continue Working" and Recent reorder.
    // Session 61 (S61-H / B-L-5 — the ninth audit's B-L-5): the PATCH is
    // fire-and-forget — pre-fix this await blocked the navigation on the
    // round-trip, and a slow network made the click look dead. The
    // failure path already degraded to navigate; the reorder is
    // server-side and unaffected by the unmount (the request is sent).
    // Session 71 (S71-A / L-A1): the PATCH rides the ONE call() seam's
    // SILENT variant — the fire-and-forget family never toasts (the
    // S61-H contract, now declared instead of hand-rolled .catch).
    void call(`/api/projects/${project.id}`, {
      method: "PATCH",
      body: JSON.stringify({ lastOpened: true }),
    }, { silent: true });
    router.push(`/Editor?projectId=${project.id}`);
  }

  async function deleteProject() {
    setDeleting(true);
    // Session 71 (S71-A / L-A1): the DELETE rides the ONE call() seam
    // with the card's own error copy as the errorTitle.
    // Session 72 (S72-A): the type is the route's ACTUAL payload — the
    // route answers ok({ deleted: true }) (the pre-fix annotation
    // claimed a project wrapper that never existed; it worked by
    // truthiness but lied by type — a future data.project.id read
    // would crash past the type gate).
    const data = await call<{ deleted: boolean }>(
      `/api/projects/${project.id}`,
      { method: "DELETE" },
      { errorTitle: "Delete failed" },
    );
    if (data) {
      onDeleted?.(project.id);
      setDeleteConfirmOpen(false);
      toast.success("Project deleted", project.name);
    }
    setDeleting(false);
  }

  return (
    // Session 70 (S70-A / M-A1 — the eighteenth audit): the WAI-ARIA
    // button-pattern violation closed — the root carried role="button" +
    // tabIndex + the Enter/Space onKeyDown with NESTED interactive
    // descendants (the rename Input, the Check/X buttons, the ellipsis
    // trigger), which AT flattens or misannounces. The canonical
    // stretched-button form: a real absolute inset-0 <button> owns the
    // open; the content layer suppresses pointer events; the interactive
    // children opt back in (pointer-events-auto). The [aria-label^='Open ']
    // locator family survives byte-identically; the S31-3/S58-B
    // stopPropagation wrappers stay as belt-and-braces.
    <div className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-md focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-1">
      <button
        type="button"
        aria-label={`Open ${project.name}`}
        onClick={() => void openProject()}
        className="absolute inset-0 z-0 cursor-pointer"
      />
      <div className="pointer-events-none relative z-10 block w-full text-left">
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
          <CanvasThumbnail project={project} elements={elements} />
          {/* Session 63 (S63-A / A-H1 — the eleventh audit's HIGH): the
              pre-fix overlay used the v3 opacity-utility syntax that
              Tailwind v4 REMOVED — v4 emits none of those selectors, so
              `.bg-black` painted a fully OPAQUE overlay, hiding every grid
              card's thumbnail behind (0,0,0) since the first commit. The
              v4 modifier form restores the original intent: transparent
              at rest, 10% black on hover. */}
          <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10" />
        </div>
      </div>
      {/* Session 70 (S70-A): the content blocks BOTH carry relative z-10 —
          a non-positioned sibling paints BELOW the positioned stretched
          button (z-0), so the hit test would land on the button even over
          the pointer-events-auto ellipsis. */}
      <div className="pointer-events-none relative z-10 p-3">
        <div className="mb-2 flex items-start justify-between">
          {/* Session 41 (RA-52): the ellipsis Rename opens the reference's
              INLINE header-row editor (input + Check/X icon buttons), not a
              dialog — the whole title row swaps (the ellipsis hides while
              renaming, matching the reference's w-full row). */}
          {renameOpen ? (
            <InlineProjectRename
              project={project}
              onRenamed={(updated) => {
                setRenameOpen(false);
                onRenamed?.(updated);
              }}
              onCancel={() => setRenameOpen(false)}
            />
          ) : (
            <>
          <h3 className="flex-1 truncate pr-2 text-sm font-semibold leading-tight text-gray-800">
            {project.name}
          </h3>
          {/* Session 58 (S58-B — the sixth audit's A-M-2): the ellipsis
              wrapper stops keydown as well as click — the file's own
              convention (the rename row + the delete dialog). Without the
              keydown stop, Enter/Space on the Radix trigger (whose handlers
              never stopPropagation) bubbled to the card root's onKeyDown,
              navigating to the editor and unmounting the menu — keyboard
              users could not Rename/Delete from a grid card. */}
          <div
            className="pointer-events-auto"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
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
                    setRenameOpen(true);
                  }}
                >
                  <Pencil />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    setDeleteConfirmOpen(true);
                  }}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
            </>
          )}
        </div>
        {/* Session 61 (S61-B — the ninth audit's M-2): gray-500 (#6b7280)
            reads at 4.83:1 on white — AA at 12px. The pre-fix gray-400
            (#9ca3af) computed to 2.54:1. */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            <span>{openedLabel}</span>
          </div>
          {/* Session 41 (RA-53): the reference's card avatar pair, decoded
              verbatim from its bundle — "A" on the blue-500 -> purple-600
              gradient and "B" on the green-500 -> teal-600 gradient, w-5 h-5
              rounded-full border-2 border-white with the text-[9px] font-
              medium white initials, NO titles. The FIRST chip keeps the
              clone's real-user identity (title "You", the RA-40 working-
              superset family) but adopts the reference's gradient paint. */}
          <div className="flex -space-x-2">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gradient-to-r from-blue-500 to-purple-600"
              title="You"
            >
              <span className="text-[9px] font-medium text-white">{userInitial}</span>
            </div>
            <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gradient-to-r from-green-500 to-teal-600">
              <span className="text-[9px] font-medium text-white">B</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card-local dialogs render through React PORTALS — and React
          propagates portal events through the REACT tree, not the DOM tree,
          so every click inside them would bubble to this card's
          openProject() onClick and navigate to the editor (the S31-3
          discovery). The wrapper stops the synthetic bubble at the React
          seam — the same convention the inline rename row and the
          ellipsis-menu wrapper use. Keydown too: Enter inside the dialog
          must never reach the card's Enter/Space openProject handler.
          (Session 41, RA-52: the Rename DIALOG retired — the rename is the
          reference's INLINE header-row editor above; only the delete
          confirm remains here.) */}
      <div
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[420px] [&>button]:h-11 [&>button]:w-11">
          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>
            <DialogDescription>
              This permanently removes &ldquo;{project.name}&rdquo; and its canvas. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" disabled={deleting} onClick={deleteProject}>
              {deleting ? "Deleting…" : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
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
  onCreated: (project: ProjectSummaryDTO) => void;
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
    // Session 71 (S71-A / L-A1): the create POST rides the ONE call()
    // seam with the dialog's own error copy as the errorTitle (the
    // hand-rolled unwrap + catch branches died with the migration).
    const data = await call<{ project: ProjectSummaryDTO }>(
      "/api/projects",
      {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          template,
          backgroundColor: background,
        }),
      },
      { errorTitle: "Could not create the project" },
    );
    if (data) {
      // Session 70 (S70-C): the created project flows into the
      // summary-typed list state — the POST ships the same bounded
      // thumbnail projection as the list family since session 73 (a
      // create seeds no elements; the include form is the S73-H
      // honesty rider).
      onCreated(data.project);
      onOpenChange(false);
      reset();
      toast.success("Project created", data.project.name);
    }
    setSubmitting(false);
  }

  function reset() {
    setName("");
    setDescription("");
    setBackground(CANVAS_BACKGROUND_PRESETS[0]?.value ?? "#0D1117");
    // Session 98 (S98-B — A98-L1, the forty-sixth audit): the custom-color
    // draft joins the reset contract — pre-fix a custom pick survived the
    // reset, so reopening the dialog showed the stale swatch behind the
    // restored preset background (isPreset true, the color input reading
    // customColor). The CreateTeamDialog sibling resets its color the
    // same way (teams-view.tsx setColor(TEAM_COLORS[0])).
    setCustomColor(CANVAS_BACKGROUND_PRESETS[0]?.value ?? "#0D1117");
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
      <DialogContent className="max-h-[90vh] w-[95vw] overflow-y-auto sm:w-full sm:max-w-4xl [&>button]:h-11 [&>button]:w-11">
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
