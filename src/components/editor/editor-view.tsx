"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Minus, Play, Plus, Redo2, Share2, Undo2, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Toolbar } from "./toolbar";
import { Canvas } from "./canvas";
import { LayersPanel } from "./layers-panel";
import { PropertiesPanel } from "./properties-panel";
import { AiAssistant } from "./ai-assistant";
import { useEditorStore } from "./editor-store";
import { toast } from "@/hooks/use-toast";
import type { HeaderUser } from "@/components/app-header";
import { ProjectDTO } from "@/lib/editor";

// ---------------------------------------------------------------------------
// Autosave: PUT the full element list (plus project meta) whenever the store
// goes unsaved; debounced 800ms. On success the server's fresh ids replace
// the local ones (selection remapped by index-stable order).

function useAutosave(projectId: string) {
  React.useEffect(() => {
    if (!projectId) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    async function flush() {
      const store = useEditorStore.getState();
      if (store.saveState !== "unsaved" || !store.projectId) return;
      store.setSaving();
      try {
        const response = await fetch(`/api/projects/${store.projectId}/elements`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ elements: store.elements }),
        });
        const body = await response.json().catch(() => null);
        if (!response.ok || !body?.ok) {
          toast.error("Autosave failed", body?.error?.message ?? "Your changes are not saved yet.");
          return;
        }
        const elements = body.data.elements as ProjectDTO["elements"];
        const oldIds = store.elements.map((el) => el.id);
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
  }, [projectId]);
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
          store.deleteElements(store.selectedIds);
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

  return (
    <div
      ref={canvasRef}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ backgroundColor }}
      role="dialog"
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
                transform: `rotate(${el.rotation}deg)`,
                opacity: el.opacity,
                backgroundColor: el.fill ?? undefined,
                borderRadius: el.type === "ellipse" ? "50%" : el.radius || undefined,
                border: el.stroke && el.strokeWidth ? `${el.strokeWidth}px solid ${el.stroke}` : undefined,
                color: el.type === "text" ? el.fill ?? "#fff" : undefined,
                fontSize: el.type === "text" ? (el.fontSize ?? undefined) : undefined,
                fontWeight: el.type === "text" ? (el.fontWeight ?? undefined) : undefined,
                display: el.type === "text" ? "flex" : undefined,
                alignItems: el.type === "text" ? "center" : undefined,
              }}
            >
              {el.type === "text" ? el.text : null}
            </div>
          ))}
      </div>
      <button
        type="button"
        onClick={onExit}
        className="fixed bottom-4 right-4 rounded-lg border border-white/20 bg-black/50 px-4 py-2 text-xs text-white backdrop-blur-sm"
      >
        Exit presentation (Esc)
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
  const [notFound, setNotFound] = React.useState(false);
  const [presenting, setPresenting] = React.useState(false);

  const projectName = useEditorStore((s) => s.projectName);
  const saveState = useEditorStore((s) => s.saveState);
  const zoom = useEditorStore((s) => s.zoom);
  const past = useEditorStore((s) => s.past);
  const future = useEditorStore((s) => s.future);

  useEditorShortcuts();
  useAutosave(projectId);

  // Load the project once — setState lands in the async continuation only.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!projectId) {
        await Promise.resolve();
        if (!cancelled) {
          setNotFound(true);
          setLoading(false);
        }
        return;
      }
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        const body = await response.json().catch(() => null);
        if (cancelled) return;
        if (!response.ok || !body?.ok) {
          setNotFound(true);
        } else {
          useEditorStore.getState().loadProject(body.data.project as ProjectDTO);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
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
    // Flush pending edits before leaving.
    const store = useEditorStore.getState();
    if (store.saveState === "unsaved") {
      fetch(`/api/projects/${projectId}/elements`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elements: store.elements }),
      }).catch(() => null);
    }
    router.push("/");
  }

  if (notFound) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d1117] text-white">
        <div className="text-center">
          <h1 className="mb-2 text-xl font-semibold">Project not found</h1>
          <p className="mb-6 text-sm text-gray-400">The design file may have been deleted.</p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0d1117]">
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
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-medium text-white"
                title="AI Assistant"
                style={{ backgroundColor: "#8B5CF6" }}
              >
                AI
              </div>
            </div>
            <div className="hidden items-center gap-1 text-sm text-gray-400 sm:flex">
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

      {/* Main row: toolbar | layers | canvas+assistant | properties. */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Toolbar />

        {/* Left panel: layers (bottom tabs switch content). */}
        <div className="hidden w-60 flex-shrink-0 flex-col border-r border-[#30363d] bg-[#161b22] md:flex">
          <div className="min-h-0 flex-1">
            <LayersPanel />
          </div>
          <div className="flex flex-shrink-0 gap-1 border-t border-[#30363d] p-2" role="tablist" aria-label="Panel mode">
            {["Layers", "Components", "Properties"].map((tab, index) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={index === 0}
                className={cn(
                  "rounded px-3 py-1 text-xs transition-colors",
                  index === 0 ? "bg-[#0d1117] text-white" : "bg-[#161b22] text-gray-400 hover:text-white",
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

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
            {/* Zoom controls — measured: top-left, 100% + minus/plus. */}
            <div className="absolute left-4 top-4 flex items-center gap-1 rounded-lg border border-[#30363d] bg-[#161b22] p-1">
              <button
                type="button"
                onClick={() => useEditorStore.getState().zoomOut()}
                aria-label="Zoom out"
                className="flex h-6 w-6 items-center justify-center rounded text-gray-400 transition-colors hover:text-white"
              >
                <Minus className="h-3 w-3" aria-hidden />
              </button>
              <span className="min-w-[44px] text-center text-xs text-gray-300" aria-live="polite">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => useEditorStore.getState().zoomIn()}
                aria-label="Zoom in"
                className="flex h-6 w-6 items-center justify-center rounded text-gray-400 transition-colors hover:text-white"
              >
                <Plus className="h-3 w-3" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => useEditorStore.getState().resetView()}
                aria-label="Reset zoom"
                className="rounded px-2 text-[10px] text-gray-400 transition-colors hover:text-white"
              >
                Fit
              </button>
            </div>
          </div>

          {/* AI assistant — bottom of the canvas column. */}
          <div className="h-56 flex-shrink-0">
            <AiAssistant />
          </div>
        </div>

        {/* Right: properties. */}
        <div className="hidden w-72 flex-shrink-0 border-l border-[#30363d] lg:flex">
          <PropertiesPanel />
        </div>
      </div>

      {presenting && <PresentOverlay onExit={() => setPresenting(false)} />}
    </div>
  );
}
