"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Download, FileCode2, Image as ImageIcon, Keyboard, Palette, Play, Redo2, Share2, SlidersHorizontal, Undo2, Users, ZoomIn, ZoomOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Toolbar } from "./toolbar";
import { Canvas } from "./canvas";
import { LayersPanel } from "./layers-panel";
import { ComponentsPanel } from "./components-panel";
import { CanvasBackgroundSection, PropertiesPanel, PropertiesSections } from "./properties-panel";
import { AiAssistant } from "./ai-assistant";
import { useEditorStore } from "./editor-store";
import { toast } from "@/hooks/use-toast";
import type { HeaderUser } from "@/components/app-header";
import { ProjectDTO, canvasFontFamily, EDITOR_SHORTCUTS, fillPaintFor, toolForShortcut, type DesignElementDTO } from "@/lib/editor";
import {
  EXPORT_BOARD_HEIGHT,
  EXPORT_BOARD_WIDTH,
  downloadPng,
  downloadSvg,
  elementsToSvg,
  exportFilename,
  svgToPngBlob,
} from "@/lib/export-png";

// The Untitled editor state (ADR-009): loaded when the ?projectId is unknown
// or missing — the reference app renders a fully working "Untitled" canvas
// in that case instead of an error page. id stays EMPTY until the first
// autosave creates the backing project (useAutosave.ensureProject).
const UNTITLED_PROJECT: ProjectDTO = {
  id: "",
  name: "Untitled",
  description: null,
  template: "blank",
  backgroundColor: "#0D1117",
  lastOpenedAt: new Date(0).toISOString(),
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
  elements: [],
};

// ---------------------------------------------------------------------------
// Autosave: PUT the full element list (plus project meta) whenever the store
// goes unsaved; debounced 800ms. On success the server's fresh ids replace
// the local ones (selection remapped by index-stable order).
//
// Untitled mode (ADR-009): the store may hold NO projectId yet (unknown or
// missing ?projectId — reference parity: the live app opens a working
// "Untitled" editor). The FIRST flush creates the project via
// POST /api/projects, binds the new id (store.attachProject), and adopts it
// in the address bar via history.replaceState — the reference app instead
// saves the canvas SILENTLY into the most-recent project (a data bug this
// clone deliberately does not copy).

function useAutosave() {
  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    async function ensureProject(): Promise<string | null> {
      const store = useEditorStore.getState();
      if (store.projectId) return store.projectId;
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: store.projectName || "Untitled",
          template: "blank",
          backgroundColor: store.backgroundColor,
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) return null;
      const id = body.data.project.id as string;
      useEditorStore.getState().attachProject(id);
      // Adopt the new id in the URL without a navigation entry (a reload
      // now opens the real project; the back button still leaves the page).
      window.history.replaceState(null, "", `/Editor?projectId=${id}`);
      return id;
    }

    async function flush() {
      const store = useEditorStore.getState();
      if (store.saveState !== "unsaved") return;
      store.setSaving();
      try {
        const projectId = await ensureProject();
        if (!projectId) {
          toast.error("Autosave failed", "The design file could not be created.");
          return;
        }
        const response = await fetch(`/api/projects/${projectId}/elements`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          // Session 33 (S33-3): the body carries the FULL canvas state —
          // elements AND the canvas background. The pre-fix body carried
          // only elements, so a Background Color change flipped unsaved,
          // fired this PUT, and silently reverted on reload (the store's
          // setBackgroundColor was already wired; the seam was the body).
          body: JSON.stringify({
            elements: useEditorStore.getState().elements,
            backgroundColor: useEditorStore.getState().backgroundColor,
          }),
        });
        const body = await response.json().catch(() => null);
        if (!response.ok || !body?.ok) {
          toast.error("Autosave failed", body?.error?.message ?? "Your changes are not saved yet.");
          return;
        }
        const elements = body.data.elements as ProjectDTO["elements"];
        const oldIds = useEditorStore.getState().elements.map((el) => el.id);
        const remap = new Map<string, string>();
        elements?.forEach((el, i) => {
          const old = oldIds[i];
          if (old) remap.set(old, el.id);
        });
        useEditorStore.getState().markSaved(elements ?? [], remap);
      } catch {
        toast.error("Network error", "Autosave could not reach the server.");
      }
    }

    const unsubscribe = useEditorStore.subscribe((state) => {
      if (state.saveState === "unsaved" && !disposed) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(flush, 800);
      }
    });

    return () => {
      disposed = true;
      unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, []);
}

// ---------------------------------------------------------------------------
// Keyboard shortcuts: tools (V/H/F/R/O/L/T), Delete, undo/redo, zoom.

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable;
}

function useEditorShortcuts(onOpenShortcuts: () => void) {
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;
      // While ANY Radix dialog is open (the shortcuts dialog itself, a
      // dropdown portal that renders a dialog, …) the editor's global
      // shortcuts STAND DOWN — no accidental tool switches while reading
      // the help, and Escape stays the dialog's own close (Radix handles
      // it + returns focus to the trigger). The hand-rolled PresentOverlay
      // carries no data-state and keeps its established behavior.
      if (document.querySelector('[role="dialog"][data-state="open"]')) return;
      const store = useEditorStore.getState();
      const meta = event.ctrlKey || event.metaKey;

      // Session 49 (S49-2): Shift+/ — the standard discoverability
      // convention — opens the shortcut help from anywhere in the editor.
      if (event.key === "?") {
        event.preventDefault();
        onOpenShortcuts();
        return;
      }

      if (meta && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) store.redo();
        else store.undo();
        return;
      }
      if (meta && event.key.toLowerCase() === "y") {
        event.preventDefault();
        store.redo();
        return;
      }
      if (meta && (event.key === "=" || event.key === "+")) {
        event.preventDefault();
        store.zoomIn();
        return;
      }
      if (meta && event.key === "-") {
        event.preventDefault();
        store.zoomOut();
        return;
      }
      if (meta && event.key === "0") {
        event.preventDefault();
        store.resetView();
        return;
      }
      if (event.key === "Delete" || event.key === "Backspace") {
        if (store.selectedIds.length > 0) {
          event.preventDefault();
          // The wall's keyboard contract (S25-1): locked elements never ride
          // along with a keyboard delete — the same guard moveElements
          // carries (S23-3). The layer-row TRASH is the explicit per-element
          // delete and DELIBERATELY deletes locked elements (the reference's
          // measured semantics — verified live on its locked rectangle: the
          // row trash removed it while its own keyboard was entirely dead),
          // so the guard lives HERE, in the keyboard seam, not in the shared
          // deleteElements action.
          const unlockedIds = store.elements
            .filter((el) => store.selectedIds.includes(el.id) && !el.locked)
            .map((el) => el.id);
          if (unlockedIds.length > 0) store.deleteElements(unlockedIds);
        }
        return;
      }
      if (event.key === "Escape") {
        store.deselectAll();
        return;
      }

      // The tool keys resolve through the SINGLE-SOURCE seam (session 48,
      // S48-1): the toolbar titles advertise "{Tool} ({shortcut})" from the
      // same TOOL_SHORTCUTS map — before this, the hand-rolled switch below
      // wired only seven of the nine advertised shortcuts (P and I were
      // fiction in the titles).
      const tool = toolForShortcut(event.key);
      if (tool) store.setTool(tool);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenShortcuts]);
}

// ---------------------------------------------------------------------------
// The keyboard-shortcuts help dialog (session 49, S49-2 — the discoverability
// affordance). The toolbar titles are hover-only and never render on touch
// devices; this dialog surfaces the FULL map. Its inventory comes from the
// EDITOR_SHORTCUTS seam in src/lib/editor.ts (the Tools group derives from
// TOOL_SHORTCUTS — the dialog can never advertise a shortcut the handler
// doesn't wire). A pure clone-side superset: the reference carries NO
// shortcut affordance anywhere (24th/25th audit datum). The chrome is the
// editor's own dark panel family, not the light app chrome.

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-[#30363d] bg-[#0d1117] px-1.5 py-0.5 font-mono text-xs text-gray-300">
      {children}
    </kbd>
  );
}

function ShortcutsDialog({
  open,
  onOpenChange,
  triggerRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[85vh] gap-0 overflow-y-auto border-[#30363d] bg-[#161b22] p-0 text-white sm:max-w-[420px]"
        aria-label="Keyboard shortcuts"
        // The app's dialog convention (F34): focus returns to the trigger on
        // close. Radix's default return targets the DialogTrigger — none
        // exists here (the chip opens via controlled state), so the return
        // is explicit.
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          triggerRef.current?.focus();
        }}
      >
        <DialogTitle className="border-b border-[#30363d] px-5 py-4 text-lg font-semibold text-white">
          Keyboard shortcuts
        </DialogTitle>
        <div className="space-y-5 px-5 py-4">
          {EDITOR_SHORTCUTS.map((group) => (
            <section key={group.group} aria-label={group.group}>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                {group.group}
              </h4>
              <ul className="space-y-1.5">
                {group.items.map((item) => (
                  <li key={item.label} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-300">{item.label}</span>
                    <span className="flex flex-shrink-0 items-center gap-1">
                      {item.keys.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <p className="text-xs text-gray-500">
            Tip: press <Kbd>?</Kbd> anywhere in the editor to open this dialog.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Present mode: fullscreen the canvas content (fits to viewport).

function PresentOverlay({ onExit }: { onExit: () => void }) {
  const elements = useEditorStore((s) => s.elements);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const exitRef = React.useRef<HTMLButtonElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    function compute() {
      if (!canvasRef.current) return;
      const { width, height } = canvasRef.current.getBoundingClientRect();
      // Fit the seed/reference canvas area (1000x700) into the viewport.
      setScale(Math.min(width / 1000, height / 700));
    }
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  React.useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onExit();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  // Session 47 (S47-1): the dialog-management conventions the Sheet already
  // pins, applied to the presentation takeover. (1) The body scroll lock —
  // data-scroll-locked + overflow:hidden while presenting (react-remove-
  // scroll's convention; the overlay and the workspace Sheet can never be
  // open together, so no lock-owner conflict). (2) Focus moves INTO the
  // dialog on open — onto the exit affordance, the only actionable control —
  // and RETURNS to the element that opened it (the Present trigger) on
  // close, the Sheet's focus contract.
  React.useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const restoreFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    body.setAttribute("data-scroll-locked", "1");
    body.style.overflow = "hidden";
    exitRef.current?.focus();
    return () => {
      body.removeAttribute("data-scroll-locked");
      body.style.overflow = prevOverflow;
      restoreFocus?.focus();
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ backgroundColor }}
      role="dialog"
      aria-modal="true"
      aria-label="Presentation mode — press Escape to exit"
    >
      <div
        className="relative"
        style={{
          width: 1000,
          height: 700,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
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
                // border (session 29, RA-8).
                border:
                  el.type !== "line" && el.stroke && el.strokeWidth
                    ? `${el.strokeWidth}px solid ${el.stroke}`
                    : undefined,
                borderRadius: el.type === "ellipse" ? "50%" : el.radius || undefined,
                color: el.type === "text" ? el.fill ?? "#fff" : undefined,
                fontSize: el.type === "text" ? (el.fontSize ?? undefined) : undefined,
                fontWeight: el.type === "text" ? (el.fontWeight ?? undefined) : undefined,
                fontFamily: el.type === "text" ? canvasFontFamily(el.fontFamily) : undefined,
                display: el.type === "text" ? "flex" : undefined,
                alignItems: el.type === "text" ? "center" : undefined,
                textAlign: (el.type === "text" ? el.textAlign ?? "left" : undefined) as React.CSSProperties["textAlign"],
              }}
            >
              {el.type === "text" ? el.text : null}
              {el.type === "line" ? (
                // The reference's line rendering (session 29, RA-8): the SVG
                // diagonal stroke the canvas shows, in the presentation.
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
      {/* S47-1: the 44px touch floor (min-h-11 — the mobile-nav convention,
          every touch target at least 44px tall) + the device-coherent copy:
          the (Esc) hint renders only at >=640px viewports (hidden sm:inline)
          — a phone has no Esc key, so the label stops teaching the wrong
          exit on the device that needs the button most. */}
      <button
        ref={exitRef}
        type="button"
        onClick={onExit}
        className="fixed bottom-4 right-4 min-h-11 rounded-lg border border-white/20 bg-black/50 px-4 text-xs text-white backdrop-blur-sm"
      >
        Exit presentation<span className="hidden sm:inline"> (Esc)</span>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The mobile properties surface (session 50 S50-2 → extended session 52
// S52-2 — the working superset). The properties panel renders `hidden …
// lg:flex`, so below lg there is NO properties surface of any kind: a
// phone can DRAW elements (the tools work at mobile; addElements
// selects the fresh element) but could never EDIT them — the measured
// gap (live-verified at 390×844: zero text-content inputs in the
// editor, and the session-50 Sheet carried only the TEXT section, so
// position/size/fill/stroke/radius/transform/opacity were still
// desktop-only). The reference's own mobile editor has no usable
// properties panel either (its clipped 126px sliver + 24px chip
// targets — re-confirmed the 28th audit), so this is the documented
// mobile-editor improvement family (ADR-010's full-width canvas,
// S47-1's Present exit, S48-2's header wrap) — not a parity surface
// to copy.
//
// The chip mirrors the zoom cluster's placement (its bottom-right
// counterpart; the bottom-left panel-chip bar is hidden below md, so no
// collision) and meets the F34 touch floor (min-h-11/min-w-11 = 44px —
// the Present-exit convention; the zoom chips are the reference-measured
// 36px chrome and stay untouched). The surface is a BOTTOM Sheet — the
// mobile-nav drawer's contract family (Radix focus trap, Escape + scrim
// close, body scroll lock, native focus return through SheetTrigger) —
// carrying the SHARED PropertiesSections composition (S52-1: the SAME
// type-conditional section stack the desktop panel renders — Position &
// Size, Corner Radius, Fill & Stroke, TEXT, Transform, Opacity) in the
// editor's dark chrome. The chip renders for ANY single selected
// element (the same condition under which the desktop panel shows its
// sections) and only below lg (`lg:hidden` — at ≥1024 the panel is the
// surface).
function MobilePropertiesEditor() {
  // The selector returns the selected element's STABLE object identity
  // (the store's immutable updates keep unrelated elements' identity), so
  // this component re-renders only when the selected element itself
  // changes — EditorView stays free of elements/selection subscriptions
  // (the shell deliberately subscribes only to projectName/saveState/
  // zoom/past/future). ANY single selection surfaces the chip (session
  // 52 — the surface carries every section, not just TEXT).
  const selectedElement = useEditorStore((s) => {
    if (s.selectedIds.length !== 1) return null;
    const el = s.elements.find((e) => e.id === s.selectedIds[0]);
    return el ?? null;
  });

  const [open, setOpen] = React.useState(false);
  const hasSelection = selectedElement !== null;
  // The sanctioned render-time compare-and-adjust (React 19's
  // set-state-in-render form): if the selection stops being a single
  // element while the Sheet is open (delete/deselect — the modal
  // scrim makes this rare, but the autosave's id remap and any store
  // mutation can land between frames), the Sheet closes so a later
  // re-selection never re-opens it spontaneously.
  const [prevHasSelection, setPrevHasSelection] = React.useState(hasSelection);
  if (prevHasSelection !== hasSelection) {
    setPrevHasSelection(hasSelection);
    if (!hasSelection) setOpen(false);
  }

  // Reads the store at CALL time (never a stale closure) and re-derives
  // the same single-selection guard — the same updateElements path
  // the desktop panel uses, so autosave, undo/redo, and the Unsaved
  // badge all flow unchanged.
  const update = React.useCallback((patch: Partial<DesignElementDTO>) => {
    const s = useEditorStore.getState();
    if (s.selectedIds.length !== 1) return;
    const el = s.elements.find((e) => e.id === s.selectedIds[0]);
    if (!el) return;
    s.updateElements([el.id], patch);
  }, []);

  if (!hasSelection) return null;

  return (
    <div className="absolute bottom-4 right-4 z-10 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Edit properties"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#30363d] bg-[#161b22] p-2 text-gray-400 transition-colors hover:text-white"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
          </button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[80vh] overflow-y-auto border-[#30363d] bg-[#161b22] p-0 text-white"
        >
          <SheetHeader className="border-b border-[#30363d] px-4 py-3">
            <SheetTitle className="text-left text-sm font-medium text-white">Edit properties</SheetTitle>
            {/* Session 54 (S54-B — the session-53 audit's deferred F-5):
                the dialog's PURPOSE for screen readers, wired by Radix
                into the dialog's aria-describedby. Visually sr-only —
                the Sheet's chrome is pixel-identical. */}
            <SheetDescription className="sr-only text-left">
              Edit the selected element's properties.
            </SheetDescription>
          </SheetHeader>
          <div className="p-4">
            {selectedElement && <PropertiesSections element={selectedElement} update={update} />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// The canvas-properties counterpart — session 53 (S53-C). The
// Edit-properties chip renders exactly when a SINGLE element is
// selected; this chip renders exactly when NOTHING is (the two are
// mutually exclusive — each surfaces exactly when its desktop panel
// branch is the content, so the bottom-right slot never double-books).
// The reference's own mobile editor carries its background-color pair
// only inside a clipped ~126px Canvas-Properties sliver (the
// 29th-audit datum); this working Sheet completes the mobile surface
// family (sessions 50/52 built the element surfaces). The Sheet carries
// the SHARED CanvasBackgroundSection through the store's
// setBackgroundColor — the session-33 persistence path (the autosave
// PUT carries backgroundColor) flows unchanged. The chrome is the
// Edit-properties chip's verbatim (the 44px F34 floor, lg:hidden, the
// bottom-right placement, the dark bottom Sheet family), the icon the
// Palette metaphor, and the label honest (F39): "Edit canvas
// properties" describes what the Sheet actually carries.
function MobileCanvasProperties() {
  // The selector subscribes to the empty-selection state + the color it
  // renders — the shell stays free of element/selection subscriptions,
  // and this leaf re-renders only when the background actually changes.
  const noSelection = useEditorStore((s) => s.selectedIds.length === 0);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);

  const [open, setOpen] = React.useState(false);
  // The sanctioned render-time compare-and-adjust: if a selection
  // appears while the Sheet is open (draw/marquee between frames), the
  // Sheet closes so the element-properties chip takes the slot cleanly.
  const [prevNoSelection, setPrevNoSelection] = React.useState(noSelection);
  if (prevNoSelection !== noSelection) {
    setPrevNoSelection(noSelection);
    if (!noSelection) setOpen(false);
  }

  // Reads the store at CALL time (never a stale closure) — the same
  // setBackgroundColor action the desktop panel calls.
  const update = React.useCallback((color: string) => {
    useEditorStore.getState().setBackgroundColor(color);
  }, []);

  if (!noSelection) return null;

  return (
    <div className="absolute bottom-4 right-4 z-10 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Edit canvas properties"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#30363d] bg-[#161b22] p-2 text-gray-400 transition-colors hover:text-white"
          >
            <Palette className="h-4 w-4" aria-hidden />
          </button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[80vh] overflow-y-auto border-[#30363d] bg-[#161b22] p-0 text-white"
        >
          <SheetHeader className="border-b border-[#30363d] px-4 py-3">
            <SheetTitle className="text-left text-sm font-medium text-white">Canvas properties</SheetTitle>
            {/* Session 54 (S54-B): the same aria-describedby contract as
                the element Sheet — the canvas Sheet's purpose. */}
            <SheetDescription className="sr-only text-left">
              Edit the canvas background color.
            </SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <CanvasBackgroundSection backgroundColor={backgroundColor} onChange={update} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The editor shell.

export function EditorView({ user }: { user: HeaderUser }) {
  const router = useRouter();
  const params = useSearchParams();
  const projectId = params.get("projectId") ?? "";

  const [loading, setLoading] = React.useState(true);
  const [presenting, setPresenting] = React.useState(false);

  // Panel visibility — INDEPENDENT toggles driven by the bottom-left chips
  // (measured from the reference: Layers and Components are separate w-60
  // columns that can both be open; Properties toggles the right panel).
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);
  const shortcutsChipRef = React.useRef<HTMLButtonElement | null>(null);

  // Defaults mirror the reference: Layers on, Components off, Properties on.
  const [panels, setPanels] = React.useState({ layers: true, components: false, properties: true });

  const projectName = useEditorStore((s) => s.projectName);
  const saveState = useEditorStore((s) => s.saveState);
  const zoom = useEditorStore((s) => s.zoom);
  const past = useEditorStore((s) => s.past);
  const future = useEditorStore((s) => s.future);

  useEditorShortcuts(React.useCallback(() => setShortcutsOpen(true), []));
  useAutosave();

  // Load the project once — setState lands in the async continuation only.
  // Unknown or missing projectId NEVER dead-ends: the editor opens in
  // "Untitled" mode (reference parity, ADR-009) and the first autosave
  // creates the backing project.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (projectId) {
        try {
          const response = await fetch(`/api/projects/${projectId}`);
          const body = await response.json().catch(() => null);
          if (!cancelled && response.ok && body?.ok) {
            useEditorStore.getState().loadProject(body.data.project as ProjectDTO);
            setLoading(false);
            return;
          }
        } catch {
          // fall through to the Untitled fallback below
        }
      }
      await Promise.resolve();
      if (!cancelled) {
        useEditorStore.getState().loadProject(UNTITLED_PROJECT);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  function onShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard
      ?.writeText(url)
      .then(() => toast.success("Share link copied", url))
      .catch(() => toast.show({ title: "Share this project", description: url }));
  }

  // Session 51 (S51-2): the canvas PNG export — a pure clone superset
  // (the reference has no export anywhere; Present is its only output
  // surface). Reads the store at CALL time (getState() — no new shell
  // subscriptions), serializes the board through the pure seam, and
  // degrades to a toast on any failure (never a thrown error into
  // render — the app's discipline).
  async function onDownloadPng() {
    try {
      const store = useEditorStore.getState();
      const svg = elementsToSvg(store.elements, { backgroundColor: store.backgroundColor });
      const blob = await svgToPngBlob(svg, EXPORT_BOARD_WIDTH, EXPORT_BOARD_HEIGHT);
      const filename = `${exportFilename(store.projectName || "design")}.png`;
      downloadPng(blob, filename);
      toast.success("PNG downloaded", filename);
    } catch {
      toast.error("Export failed", "The canvas could not be exported as PNG.");
    }
  }

  // Session 54 (S54-A): the SVG twin — the serializer's own document
  // downloaded as the vector artifact (no rasterization, no 2× scale,
  // no webfont fidelity limit — the 1000×700 viewBox is the contract).
  // The same read-at-call-time + degrade-to-toast discipline.
  function onDownloadSvg() {
    try {
      const store = useEditorStore.getState();
      const svg = elementsToSvg(store.elements, { backgroundColor: store.backgroundColor });
      const filename = `${exportFilename(store.projectName || "design")}.svg`;
      downloadSvg(svg, filename);
      toast.success("SVG downloaded", filename);
    } catch {
      toast.error("Export failed", "The canvas could not be exported as SVG.");
    }
  }

  function exit() {
    // Flush pending edits before leaving. The store's projectId is
    // authoritative (in Untitled mode it may be empty — nothing to flush;
    // the 800ms autosave will have created the project by then in the
    // common case).
    const store = useEditorStore.getState();
    if (store.saveState === "unsaved" && store.projectId) {
      fetch(`/api/projects/${store.projectId}/elements`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elements: store.elements }),
      }).catch(() => null);
    }
    router.push("/Dashboard");
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#0d1117]">
      {/* Top bar — measured: h-12, back, name, Saved badge, undo/redo, avatars, Share/Present.
          Mobile wrap (session 48, S48-2): at <sm the right group wraps onto its
          own row — pre-fix Share (L413) and Present (L493) rendered OFF-SCREEN
          at 390×844 inside the root overflow-hidden, so a phone could neither
          present nor share. At ≥sm the content fits one row inside the fixed
          48px — pixel-identical to the pre-fix rendering (flex-wrap is inert
          when everything fits). The reference's own header clips Share/Present
          at 390 too (evidence ref-audit-s52/ref-02) — this is the clone's
          documented mobile-editor improvement family (ADR-010, F34). */}
      <header className="flex min-h-12 flex-shrink-0 flex-wrap items-center justify-between gap-y-1 border-b border-[#30363d] bg-[#161b22] px-4 py-1 sm:h-12 sm:py-0">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={exit}
            aria-label="Back to dashboard"
            className="rounded p-1 text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="min-w-0 truncate font-medium text-white">{loading ? "Loading…" : projectName}</h1>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-1 text-xs text-white",
                saveState === "saved" ? "bg-green-500" : saveState === "saving" ? "bg-amber-500" : "bg-gray-600",
              )}
              aria-live="polite"
            >
              {saveState === "saved" ? "Saved" : saveState === "saving" ? "Saving…" : "Unsaved"}
            </span>
          </div>
        </div>

        <div className="ml-auto flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => useEditorStore.getState().undo()}
            disabled={past.length === 0}
            aria-label="Undo"
            className="p-2 text-gray-400 transition-colors hover:text-white disabled:opacity-50"
          >
            <Undo2 className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => useEditorStore.getState().redo()}
            disabled={future.length === 0}
            aria-label="Redo"
            className="p-2 text-gray-400 transition-colors hover:text-white disabled:opacity-50"
          >
            <Redo2 className="h-4 w-4" aria-hidden />
          </button>
          <div className="mx-2 hidden h-6 w-px bg-[#30363d] sm:block" role="separator" aria-hidden />

          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-medium text-white"
                title={user.name}
                style={{ backgroundColor: "#3B82F6" }}
              >
                {user.name.charAt(0)}
              </div>
              {/* Second collaborator chip — the reference's VERBATIM identity
                  (session 37, RA-41, bundle-decoded): its avatar stack renders
                  two HARDCODED placeholder collaborators — "Alex Design"
                  (#3b82f6) + "Sarah UI" (#10b981) — seeded through a useEffect
                  with fake cursor data that is never rendered (dead
                  collaboration theater; never the logged-in account). The
                  clone's FIRST chip stays the REAL user (the RA-40
                  working-superset family); this second chip carries the
                  reference's exact "S" / "Sarah UI" / #10B981. Presentation-only
                  (the schema has no project-collaborator relation yet). */}
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-medium text-white"
                title="Sarah UI"
                style={{ backgroundColor: "#10B981" }}
              >
                S
              </div>
            </div>
            {/* The reference's counter is UNGATED (session 37, RA-41 —
                live-measured display:flex at BOTH 1440x900 and 390x844):
                `flex items-center gap-1 text-gray-400 text-sm` + the Users
                icon (w-4 h-4) + the count. No hidden/sm:flex gating. */}
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Users className="h-4 w-4" aria-hidden />2
            </div>
          </div>

          {/* Icon-only below sm (session 48, S48-2): the wrapped row must fit
              390px — the labeled pair measures 95+107px and overflows the
              wrapped row by 33px. Below sm the buttons render their lucide glyph
              alone (aria-label keeps the accessible name — the F34
              device-coherent-copy family); ≥sm restores the labeled pill
              pixel-identical to the reference chrome. */}
          <button
            type="button"
            onClick={onShare}
            aria-label="Share"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Share2 className="inline h-4 w-4" aria-hidden />
            <span className="ml-2 hidden sm:inline">Share</span>
          </button>
          <button
            type="button"
            onClick={() => setPresenting(true)}
            aria-label="Present"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            <Play className="inline h-4 w-4" aria-hidden />
            <span className="ml-2 hidden sm:inline">Present</span>
          </button>
        </div>
      </header>

      {/* Main row: toolbar | layers | components | canvas+assistant | properties. */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Toolbar />

        {/* Left panels — each column is an INDEPENDENT chip toggle (the
            reference renders Layers and Components side by side). Both stay
            hidden below md: the mobile editor keeps a full-width canvas —
            a deliberate improvement over the reference, which squeezes all
            columns to unreadable widths at 390px. */}
        {panels.layers && (
          <div className="hidden w-60 flex-shrink-0 flex-col border-r border-[#30363d] bg-[#161b22] md:flex">
            <div className="min-h-0 flex-1">
              <LayersPanel />
            </div>
          </div>
        )}
        {panels.components && (
          <div className="hidden w-60 flex-shrink-0 flex-col border-r border-[#30363d] bg-[#161b22] md:flex">
            <ComponentsPanel />
          </div>
        )}

        {/* Center: canvas + AI assistant. */}
        <div className="relative flex min-w-0 flex-1 flex-col bg-[#0d1117]">
          <div className="relative min-h-0 flex-1">
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                Loading canvas…
              </div>
            ) : (
              <Canvas />
            )}
            {/* Zoom controls — measured from the reference DOM: a separate
                100% chip followed by lucide zoom-in and zoom-out MAGNIFIER
                icon chips (in that order) — top-left, gap-2, one border/bg
                pair per chip (no merged cluster, no Fit button; reset stays on
                Ctrl/Cmd+0). The measured trio lives in its OWN wrapper so the
                parity pin's DOM boundary (the pill's parent) stays exactly
                the reference's — the Keyboard chip below is a SEPARATE
                sibling cluster, never a fourth member of the measured one. */}
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-1 text-sm text-gray-300" aria-live="polite">
                  {Math.round(zoom * 100)}%
                </div>
                <button
                  type="button"
                  onClick={() => useEditorStore.getState().zoomIn()}
                  aria-label="Zoom in"
                  className="rounded-lg border border-[#30363d] bg-[#161b22] p-2 text-gray-400 transition-colors hover:text-white"
                >
                  <ZoomIn className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => useEditorStore.getState().zoomOut()}
                  aria-label="Zoom out"
                  className="rounded-lg border border-[#30363d] bg-[#161b22] p-2 text-gray-400 transition-colors hover:text-white"
                >
                  <ZoomOut className="h-4 w-4" aria-hidden />
                </button>
              </div>
              {/* Session 49 (S49-2): the discoverability affordance — the
                  toolbar titles are hover-only (and titles never render on
                  touch devices at all). A pure clone-side superset: the
                  reference carries NO shortcut affordance anywhere (24th/25th
                  audit datum). Same chip chrome as the zoom pair, visible at
                  every viewport — its own sibling cluster beside the
                  reference-measured zoom trio. */}
              <button
                type="button"
                onClick={() => setShortcutsOpen(true)}
                ref={shortcutsChipRef}
                aria-label="Keyboard shortcuts"
                title="Keyboard shortcuts (?)"
                className="rounded-lg border border-[#30363d] bg-[#161b22] p-2 text-gray-400 transition-colors hover:text-white"
              >
                <Keyboard className="h-4 w-4" aria-hidden />
              </button>
              {/* Session 51 (S51-2): the canvas PNG export — the Keyboard
                  chip's direct sibling (the S49-2 utility-cluster
                  convention). NOT in the header: the tablet 600 short-name
                  pin holds the header to a single 48px row and the right
                  group already sits ~20px under that threshold — the
                  cluster carries no such flex arithmetic, renders at every
                  viewport (the F37 rule), and the export is a canvas
                  action. The chip chrome is the cluster family
                  (reference-measured 36px, like the Keyboard chip). */}
              {/* Session 54 (S54-A): the Download chip became a FORMAT
                  MENU — the session-65 suggestion ("a second download
                  option would be a menu, not a new seam"). The trigger
                  keeps the single chip's EXACT chrome and position (the
                  F38g placement study holds trivially — the footprint
                  is identical, the trio DOM-boundary guard reads the
                  pill's parent, and this stays its SIBLING); the honest
                  label (F39) is "Download" — the chip opens a menu of
                  formats, and a label naming one format would oversell.
                  The PNG item keeps the session-51 2× raster path; the
                  SVG item is the serializer's own document (the TRUE
                  vector artifact — no rasterization, no webfont
                  fidelity limit). The vendored DropdownMenu is the
                  project-card-ellipsis convention. */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="rounded-lg border border-[#30363d] bg-[#161b22] p-2 text-gray-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <button type="button" aria-label="Download" title="Download">
                    <Download className="h-4 w-4" aria-hidden />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 border-[#30363d] bg-[#161b22] text-gray-200">
                  <DropdownMenuItem
                    onSelect={onDownloadPng}
                    className="gap-2 focus:bg-[#30363d] focus:text-white"
                  >
                    <ImageIcon className="h-4 w-4" aria-hidden />
                    Download PNG
                    <span className="ml-auto text-xs text-gray-500">2× raster</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={onDownloadSvg}
                    className="gap-2 focus:bg-[#30363d] focus:text-white"
                  >
                    <FileCode2 className="h-4 w-4" aria-hidden />
                    Download SVG
                    <span className="ml-auto text-xs text-gray-500">vector</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Session 50 (S50-2) → session 52 (S52-2): the mobile
                properties surface — the bottom-right mirror of the zoom
                cluster, visible only below lg (where the properties panel
                does not exist) and for any single selected element. See
                MobilePropertiesEditor. */}
            <MobilePropertiesEditor />
            {/* Session 53 (S53-C): the canvas-properties counterpart —
                the same bottom-right slot when NOTHING is selected (the
                two chips are mutually exclusive). See
                MobileCanvasProperties. */}
            <MobileCanvasProperties />
          </div>

          {/* AI assistant — bottom of the canvas column. The reference wraps
              it in an h-80 (320px) border-t column. */}
          <div className="h-80 flex-shrink-0 border-t border-[#30363d] bg-[#161b22]">
            <AiAssistant />
          </div>
        </div>

        {/* Right: properties (chip-toggled). */}
        {panels.properties && (
          <div className="hidden w-72 flex-shrink-0 border-l border-[#30363d] bg-[#161b22] lg:flex">
            <PropertiesPanel />
          </div>
        )}
      </div>

      {/* Panel-toggle chips — measured from the reference DOM: a floating
          chip bar (absolute bottom-4 left-4) where each chip is an
          independent panel visibility toggle, NOT an exclusive tab switch:
          ON = bg-blue-600 text-white, OFF = panel-dark. They float over the
          toolbar/layers column bottom, exactly like the reference.
          Responsive guard (a clone fix): the chips only render where their
          panels CAN render — the bar is hidden below md (the panels are
          md:flex/lg:flex), and the Properties chip additionally hides below
          lg. Without this, the chips flip aria-pressed with no visible
          effect — dead controls that lie about state. */}
      <div className="absolute bottom-4 left-4 z-10 hidden gap-2 md:flex">
        {([
          { key: "layers", label: "Layers" },
          { key: "components", label: "Components" },
          { key: "properties", label: "Properties", hideBelow: "lg" },
        ] as const).map((chip) => (
          <button
            key={chip.key}
            type="button"
            aria-pressed={panels[chip.key]}
            aria-label={`Toggle ${chip.label} panel`}
            onClick={() => setPanels((p) => ({ ...p, [chip.key]: !p[chip.key] }))}
            className={cn(
              "rounded px-3 py-1 text-xs transition-colors",
              "hideBelow" in chip && chip.hideBelow === "lg" && "hidden lg:inline-block",
              panels[chip.key] ? "bg-blue-600 text-white" : "bg-[#161b22] text-gray-400 hover:text-white",
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {presenting && <PresentOverlay onExit={() => setPresenting(false)} />}

      {/* Session 49 (S49-2): the shortcuts help dialog (opens via the
          Keyboard chip in the zoom cluster or the ? key). */}
      <ShortcutsDialog
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
        triggerRef={shortcutsChipRef}
      />
    </div>
  );
}
