"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Play, Redo2, Share2, Undo2, Users, ZoomIn, ZoomOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { Toolbar } from "./toolbar";
import { Canvas } from "./canvas";
import { LayersPanel } from "./layers-panel";
import { ComponentsPanel } from "./components-panel";
import { PropertiesPanel } from "./properties-panel";
import { AiAssistant } from "./ai-assistant";
import { useEditorStore } from "./editor-store";
import { toast } from "@/hooks/use-toast";
import type { HeaderUser } from "@/components/app-header";
import { ProjectDTO, canvasFontFamily, fillPaintFor } from "@/lib/editor";

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

function useEditorShortcuts() {
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;
      const store = useEditorStore.getState();
      const meta = event.ctrlKey || event.metaKey;

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

      switch (event.key.toLowerCase()) {
        case "v":
          store.setTool("select");
          break;
        case "h":
          store.setTool("hand");
          break;
        case "f":
          store.setTool("frame");
          break;
        case "r":
          store.setTool("rectangle");
          break;
        case "o":
          store.setTool("ellipse");
          break;
        case "l":
          store.setTool("line");
          break;
        case "t":
          store.setTool("text");
          break;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
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
  // Defaults mirror the reference: Layers on, Components off, Properties on.
  const [panels, setPanels] = React.useState({ layers: true, components: false, properties: true });

  const projectName = useEditorStore((s) => s.projectName);
  const saveState = useEditorStore((s) => s.saveState);
  const zoom = useEditorStore((s) => s.zoom);
  const past = useEditorStore((s) => s.past);
  const future = useEditorStore((s) => s.future);

  useEditorShortcuts();
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
      {/* Top bar — measured: h-12, back, name, Saved badge, undo/redo, avatars, Share/Present. */}
      <header className="flex h-12 flex-shrink-0 items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={exit}
            aria-label="Back to dashboard"
            className="rounded p-1 text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="font-medium text-white">{loading ? "Loading…" : projectName}</h1>
            <span
              className={cn(
                "rounded-full px-2 py-1 text-xs text-white",
                saveState === "saved" ? "bg-green-500" : saveState === "saving" ? "bg-amber-500" : "bg-gray-600",
              )}
              aria-live="polite"
            >
              {saveState === "saved" ? "Saved" : saveState === "saving" ? "Saving…" : "Unsaved"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
          <div className="mx-2 h-6 w-px bg-[#30363d]" role="separator" aria-hidden />

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

          <button
            type="button"
            onClick={onShare}
            className="ml-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Share2 className="mr-2 inline h-4 w-4" aria-hidden />
            Share
          </button>
          <button
            type="button"
            onClick={() => setPresenting(true)}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            <Play className="mr-2 inline h-4 w-4" aria-hidden />
            Present
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
                Ctrl/Cmd+0). */}
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
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
    </div>
  );
}
