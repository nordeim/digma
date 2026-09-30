"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useEditorStore } from "./editor-store";
import { boundsOf, canvasFontFamily, clampZoom, fillPaintFor, type DesignElementDTO, type EditorTool } from "@/lib/editor";

// ---------------------------------------------------------------------------
// The canvas: a DOM-element canvas (the reference's approach — absolutely
// positioned divs inside a pan/zoom wrapper over a 20px grid). Supports
// drawing (shape tools), marquee + click + shift-click selection, moving,
// 8-handle resizing, panning (hand tool / space / middle button / wheel),
// and ctrl+wheel zoom.

type DragState =
  | { kind: "none" }
  | { kind: "draw"; type: DesignElementDTO["type"]; startX: number; startY: number; x: number; y: number; w: number; h: number }
  | { kind: "move"; startX: number; startY: number; lastX: number; lastY: number; ids: string[] }
  | { kind: "resize"; handle: Handle; startBounds: { x: number; y: number; w: number; h: number }; el: DesignElementDTO }
  | { kind: "marquee"; startX: number; startY: number; x: number; y: number; w: number; h: number }
  | { kind: "pan"; lastX: number; lastY: number };

type Handle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

const HANDLES: Array<{ id: Handle; cursor: string; style: React.CSSProperties }> = [
  { id: "nw", cursor: "nwse-resize", style: { left: -4, top: -4 } },
  { id: "n", cursor: "ns-resize", style: { left: "calc(50% - 4px)", top: -4 } },
  { id: "ne", cursor: "nesw-resize", style: { right: -4, top: -4 } },
  { id: "e", cursor: "ew-resize", style: { right: -4, top: "calc(50% - 4px)" } },
  { id: "se", cursor: "nwse-resize", style: { right: -4, bottom: -4 } },
  { id: "s", cursor: "ns-resize", style: { left: "calc(50% - 4px)", bottom: -4 } },
  { id: "sw", cursor: "nesw-resize", style: { left: -4, bottom: -4 } },
  { id: "w", cursor: "ew-resize", style: { left: -4, top: "calc(50% - 4px)" } },
];

const TOOL_TO_TYPE: Partial<Record<EditorTool, DesignElementDTO["type"]>> = {
  rectangle: "rectangle",
  ellipse: "ellipse",
  line: "line",
  frame: "frame",
};

function elementIsPointInside(el: DesignElementDTO, px: number, py: number): boolean {
  if (el.rotation !== 0) {
    // Rotate the point into the element's local space.
    const cx = el.x + el.width / 2;
    const cy = el.y + el.height / 2;
    const rad = (-el.rotation * Math.PI) / 180;
    const dx = px - cx;
    const dy = py - cy;
    const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
    const ry = dx * Math.sin(rad) + dy * Math.cos(rad);
    return Math.abs(rx) <= el.width / 2 && Math.abs(ry) <= el.height / 2;
  }
  return px >= el.x && px <= el.x + el.width && py >= el.y && py <= el.y + el.height;
}

export function Canvas() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [drag, setDrag] = React.useState<DragState>({ kind: "none" });
  const [spaceDown, setSpaceDown] = React.useState(false);

  const elements = useEditorStore((s) => s.elements);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const tool = useEditorStore((s) => s.tool);
  const zoom = useEditorStore((s) => s.zoom);
  const panX = useEditorStore((s) => s.panX);
  const panY = useEditorStore((s) => s.panY);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);

  const selected = React.useMemo(
    () => elements.filter((el) => selectedIds.includes(el.id)),
    [elements, selectedIds],
  );
  const selectionBounds = React.useMemo(() => boundsOf(selected), [selected]);

  // ---- coordinate conversion -------------------------------------------
  function toCanvas(event: { clientX: number; clientY: number }): { x: number; y: number } {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (event.clientX - rect.left - panX) / zoom,
      y: (event.clientY - rect.top - panY) / zoom,
    };
  }

  function isPanning(): boolean {
    return tool === "hand" || spaceDown;
  }

  // ---- pointer handlers ---------------------------------------------------
  function onPointerDown(event: React.PointerEvent) {
    if (event.button === 1 || isPanning()) {
      (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
      setDrag({ kind: "pan", lastX: event.clientX, lastY: event.clientY });
      return;
    }
    if (event.button !== 0) return;

    const point = toCanvas(event);
    const drawType = TOOL_TO_TYPE[tool];

    if (drawType) {
      setDrag({
        kind: "draw",
        type: drawType,
        startX: point.x,
        startY: point.y,
        x: point.x,
        y: point.y,
        w: 0,
        h: 0,
      });
      return;
    }

    if (tool === "text") {
      const { addElement } = useEditorStore.getState();
      addElement({ type: "text", x: point.x, y: point.y, width: 200, height: 40 });
      useEditorStore.getState().setTool("select");
      return;
    }

    // select tool: hit-test the TOPMOST VISIBLE element — a LOCKED element
    // is hit too. It is a pointer WALL (reference parity, S23-1): the locked
    // element INTERCEPTS the interaction and consumes it — no selection
    // change, no drag, and nothing beneath is selected or displaced (the
    // reference's measured semantics: a drag/click on its locked element
    // moves nothing, selects nothing, and preserves the current selection).
    // The pre-fix code skipped locked elements here (and rendered them
    // pointer-events:none), turning the lock into a WINDOW — drags fell
    // through and displaced the element underneath.
    const hit = [...elements]
      .reverse()
      .find((el) => el.visible && elementIsPointInside(el, point.x, point.y));

    if (hit) {
      if (hit.locked) return;
      const already = selectedIds.includes(hit.id);
      const nextIds = event.shiftKey
        ? already
          ? selectedIds.filter((id) => id !== hit.id)
          : [...selectedIds, hit.id]
        : already
          ? selectedIds
          : [hit.id];
      useEditorStore.getState().select(nextIds);
      setDrag({ kind: "move", startX: point.x, startY: point.y, lastX: point.x, lastY: point.y, ids: nextIds });
    } else {
      if (!event.shiftKey) useEditorStore.getState().deselectAll();
      setDrag({ kind: "marquee", startX: point.x, startY: point.y, x: point.x, y: point.y, w: 0, h: 0 });
    }
  }

  function onPointerMove(event: React.PointerEvent) {
    if (drag.kind === "none") return;
    const store = useEditorStore.getState();

    if (drag.kind === "pan") {
      store.panBy(event.clientX - drag.lastX, event.clientY - drag.lastY);
      setDrag({ ...drag, lastX: event.clientX, lastY: event.clientY });
      return;
    }

    const point = toCanvas(event);

    if (drag.kind === "draw") {
      setDrag({
        ...drag,
        x: Math.min(drag.startX, point.x),
        y: Math.min(drag.startY, point.y),
        w: Math.abs(point.x - drag.startX),
        h: Math.abs(point.y - drag.startY),
      });
      return;
    }

    if (drag.kind === "marquee") {
      setDrag({
        ...drag,
        x: Math.min(drag.startX, point.x),
        y: Math.min(drag.startY, point.y),
        w: Math.abs(point.x - drag.startX),
        h: Math.abs(point.y - drag.startY),
      });
      return;
    }

    if (drag.kind === "move") {
      store.moveElements(drag.ids, point.x - drag.lastX, point.y - drag.lastY);
      setDrag({ ...drag, lastX: point.x, lastY: point.y });
      return;
    }

    if (drag.kind === "resize") {
      const { el, startBounds, handle } = drag;
      // Pointer coordinates live in VISUAL space; a scaled element occupies
      // w*scale x h*scale on screen. Run the whole drag in visual space,
      // then divide by the scale on write-back so the model stays the
      // source of truth (scale stays untouched — resizing never rescales).
      const s = el.scale ?? 1;
      const vw = startBounds.w * s;
      const vh = startBounds.h * s;
      const minV = (n: number) => (el.type === "line" ? 0 : 1) * s;
      let x = startBounds.x;
      let y = startBounds.y;
      let w = vw;
      let h = vh;

      if (handle.includes("e")) w = Math.max(point.x - x, minV(1));
      if (handle.includes("w")) {
        w = Math.max(x + vw - point.x, minV(1));
        x = x + vw - w;
      }
      if (handle.includes("s")) h = Math.max(point.y - y, minV(1));
      if (handle.includes("n")) {
        h = Math.max(y + vh - point.y, minV(1));
        y = y + vh - h;
      }
      store.updateElements(
        [el.id],
        { x, y, width: Math.max(w / s, 1), height: Math.max(h / s, el.type === "line" ? 0 : 1) },
        false,
      );
    }
  }

  function onPointerUp() {
    const store = useEditorStore.getState();

    if (drag.kind === "draw") {
      if (drag.w > 3 || drag.h > 3) {
        store.addElement({
          type: drag.type,
          x: drag.x,
          y: drag.y,
          width: drag.type === "line" ? drag.w : Math.max(drag.w, 1),
          height: drag.type === "line" ? drag.h : Math.max(drag.h, 1),
        });
        store.setTool("select");
      }
    } else if (drag.kind === "marquee") {
      if (drag.w > 2 && drag.h > 2) {
        // Containment against VISUAL footprints (scale-aware).
        const inside = elements.filter(
          (el) => {
            const s = el.scale ?? 1;
            return (
              el.visible &&
              !el.locked &&
              el.x >= drag.x &&
              el.x + el.width * s <= drag.x + drag.w &&
              el.y >= drag.y &&
              el.y + el.height * s <= drag.y + drag.h
            );
          },
        );
        if (inside.length > 0) store.select(inside.map((el) => el.id));
      }
    } else if (drag.kind === "move" || drag.kind === "resize") {
      // The live edits avoided history pushes; snapshot now.
      store.commit();
    }

    setDrag({ kind: "none" });
  }

  // ---- wheel: pan by default, zoom with ctrl/meta -----------------------
  function onWheel(event: React.WheelEvent) {
    const store = useEditorStore.getState();
    if (event.ctrlKey || event.metaKey) {
      store.setZoom(clampZoom(store.zoom * (event.deltaY < 0 ? 1.1 : 0.9)));
    } else {
      store.panBy(-event.deltaX, -event.deltaY);
    }
  }

  // ---- space-to-pan -------------------------------------------------------
  React.useEffect(() => {
    function down(event: KeyboardEvent) {
      if (event.code === "Space" && !isTypingTarget(event.target)) {
        event.preventDefault();
        setSpaceDown(true);
      }
    }
    function up(event: KeyboardEvent) {
      if (event.code === "Space") setSpaceDown(false);
    }
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const cursor = isPanning()
    ? drag.kind === "pan"
      ? "grabbing"
      : "grab"
    : drag.kind === "draw"
      ? "crosshair"
      : drag.kind === "move"
        ? "move"
        : "default";

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor, cursor }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={onWheel}
      role="application"
      aria-label="Design canvas"
    >
      {/* Grid — 20px like the reference */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${panX}px ${panY}px`,
        }}
        aria-hidden
      />
      {/* Origin marker */}
      <div
        className="pointer-events-none absolute h-px w-px bg-red-500 opacity-50"
        style={{ left: panX, top: panY, transform: "translate(-0.5px, -0.5px)" }}
        aria-hidden
      />

      {/* The pan/zoom wrapper */}
      <div
        className="absolute left-0 top-0"
        style={{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})`, transformOrigin: "0px 0px" }}
      >
        {/* Session-19 fix (S19-3): hidden elements must NOT render on the
            canvas. Every other consumer of element.visible already agrees —
            the click hit-test ("topmost visible unlocked element"), the
            marquee containment, presentation mode, and the thumbnails — but
            the canvas kept painting hidden elements, so the layer row's eye
            icon said "hidden" while the canvas said "visible" (an internally
            inconsistent state; the reference's own eye is a no-op — this
            clone ships the working superset, and the whole contract must be
            coherent). */}
        {elements.filter((el) => el.visible).map((el) => (
          <CanvasElement
            key={el.id}
            element={el}
            selected={selectedIds.includes(el.id)}
            // Only frames consume the zoom (the label's counter-scale) —
            // undefined for every other type keeps their renders memoized
            // across zoom changes.
            zoom={el.type === "frame" ? zoom : undefined}
          />
        ))}

        {/* Selection outline + handles (single selection only) */}
        {selected.length === 1 && selectionBounds && (
          <div
            className="pointer-events-none absolute"
            style={{
              left: selectionBounds.minX,
              top: selectionBounds.minY,
              width: selectionBounds.maxX - selectionBounds.minX,
              height: selectionBounds.maxY - selectionBounds.minY,
            }}
          >
            <div className="absolute inset-0 border border-blue-500" aria-hidden />
            {/* A locked element cannot be canvas-transformed (the wall) —
                its selection renders the outline but NOT the resize handles
                (S23-2: the affordance the contract forbids). */}
            {!selected[0]!.locked &&
              HANDLES.map((handle) => (
              <div
                key={handle.id}
                className="pointer-events-auto absolute h-2 w-2 rounded-sm border border-white bg-blue-500"
                style={{ ...handle.style, cursor: handle.cursor }}
                role="presentation"
                onPointerDown={(event) => {
                  event.stopPropagation();
                  const el = selected[0]!;
                  (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
                  setDrag({
                    kind: "resize",
                    handle: handle.id,
                    startBounds: { x: el.x, y: el.y, w: el.width, h: el.height },
                    el,
                  });
                }}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              />
            ))}
          </div>
        )}
        {selected.length > 1 && selectionBounds && (
          <div
            className="pointer-events-none absolute border border-dashed border-blue-400"
            style={{
              left: selectionBounds.minX,
              top: selectionBounds.minY,
              width: selectionBounds.maxX - selectionBounds.minX,
              height: selectionBounds.maxY - selectionBounds.minY,
            }}
            aria-hidden
          />
        )}

        {/* Draw preview */}
        {drag.kind === "draw" && (
          <div
            className="absolute border-2 border-dashed border-blue-400 bg-blue-400/10"
            style={{ left: drag.x, top: drag.y, width: drag.w, height: drag.h }}
            aria-hidden
          />
        )}
        {drag.kind === "marquee" && drag.w > 2 && (
          <div
            className="absolute border border-blue-400 bg-blue-400/10"
            style={{ left: drag.x, top: drag.y, width: drag.w, height: drag.h }}
            aria-hidden
          />
        )}
      </div>

      {/* "N selected" badge — measured from the reference */}
      {selected.length > 0 && (
        <div className="pointer-events-none absolute right-4 top-4 rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2 text-xs text-gray-300">
          {selected.length} selected
        </div>
      )}
    </div>
  );
}

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable;
}

// ---------------------------------------------------------------------------
// A single rendered element — mirrors the reference's inline-style rendering
// (transform translate/rotate, opacity, blend, width/height, fill, border,
// radius). Locked elements dim slightly; hidden ones don't render at all.

function CanvasElement({
  element,
  selected,
  zoom,
}: {
  element: DesignElementDTO;
  selected: boolean;
  // Passed ONLY to frame elements (the label's counter-scale consumer) so
  // non-frame elements keep their memoized renders across zoom changes.
  zoom?: number;
}) {
  const tool = useEditorStore((s) => s.tool);

  const style: React.CSSProperties = {
    // The reference's transform chain: translate, scale, then rotate.
    transform: `translate(${element.x}px, ${element.y}px) scale(${element.scale ?? 1}) rotate(${element.rotation}deg)`,
    transformOrigin: "0px 0px",
    opacity: element.opacity,
    width: element.width,
    height: element.type === "line" ? Math.max(element.height, 0) : element.height,
    cursor: element.locked
      ? "not-allowed"
      : tool === "select"
        ? "default"
        : "crosshair",
    userSelect: "none",
    boxShadow: selected ? "0 0 0 2px rgba(59, 130, 246, 0.9)" : undefined,
  };

  // The ONE fill paint seam (session 41, RA-54): image > gradient > solid —
  // the reference's measured precedence. TEXT keeps its own `color: fill`
  // contract below and never takes a background paint. Session 43 (RA-61):
  // the image branch also carries backgroundSize (the Background Size
  // select's fit, stretch = "100% 100%") + backgroundPosition center.
  if (element.type !== "text") {
    const paint = fillPaintFor(element);
    if (paint.backgroundColor) style.backgroundColor = paint.backgroundColor;
    if (paint.backgroundImage) style.backgroundImage = paint.backgroundImage;
    if (paint.backgroundSize) style.backgroundSize = paint.backgroundSize;
    if (paint.backgroundPosition) style.backgroundPosition = paint.backgroundPosition;
  }
  // A line's stroke feeds its SVG diagonal, NEVER the box border (the
  // reference's line div measured border-0 on all four sides despite
  // stroke #FFFFFF + strokeWidth 2 — session 29, RA-8).
  if (element.type !== "line" && element.stroke && element.strokeWidth > 0) {
    style.border = `${element.strokeWidth}px solid ${element.stroke}`;
  }
  if (element.type === "ellipse") style.borderRadius = "50%";
  else if (element.radius > 0) style.borderRadius = element.radius;

  if (element.type === "text") {
    style.color = element.fill ?? "#FFFFFF";
    style.fontSize = element.fontSize ?? 16;
    style.fontWeight = element.fontWeight ?? "500";
    // The reference's Font Family combobox (session 29, RA-10) — measured
    // functional live (picking Arial changed its canvas text's computed
    // font-family). Session 33 (RA-30): the DEFAULT chain carries the
    // reference's fallback — "Inter, sans-serif" (measured on a fresh text);
    // chosen families render verbatim.
    style.fontFamily = canvasFontFamily(element.fontFamily);
    style.display = "flex";
    style.alignItems = "center";
    // The reference's Text Align buttons are functional too (measured:
    // picking center changed its canvas text's computed text-align). The
    // flex row maps the alignment to justify-content so it is VISIBLE,
    // and the text-align itself stays measurable on the computed style.
    const align = element.textAlign ?? "left";
    style.textAlign = align as React.CSSProperties["textAlign"];
    style.justifyContent = (
      align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start"
    ) as React.CSSProperties["justifyContent"];
    style.whiteSpace = "pre-wrap";
    style.overflow = "hidden";
  }

  return (
    <div
      className={cn(
        "absolute select-none",
        selected && "ring-2 ring-blue-500 ring-offset-0",
        // The reference's measured chrome: its locked element carries the
        // cursor-not-allowed class (the affordance that says "blocked").
        element.locked && "cursor-not-allowed",
      )}
      style={style}
      data-element-id={element.id}
      aria-label={element.name ?? element.type}
    >
      {element.type === "text" ? element.text : null}
      {element.type === "line" ? (
        <svg
          className="absolute left-0 top-0 overflow-visible"
          width={Math.max(element.width, 1)}
          height={Math.max(element.height, 1)}
          viewBox={`0 0 ${Math.max(element.width, 1)} ${Math.max(element.height, 1)}`}
          aria-hidden
        >
          <line
            x1={0}
            y1={0}
            x2={element.width}
            y2={element.height}
            stroke={element.stroke ?? "#FFFFFF"}
            strokeWidth={element.strokeWidth || 2}
            strokeLinecap="round"
          />
        </svg>
      ) : null}
      {element.type === "frame" && element.name ? (
        // The reference's frame label (session 31, RA-13): an ALWAYS-ON name
        // chip at -top-5 left-0 — text-xs text-gray-300 on bg-[#161b22] with
        // px-1.5 py-0.5 padding, pointer-events-none so it never intercepts
        // canvas interaction, and a 1/zoom COUNTER-SCALE (measured at 128%
        // zoom: scale 0.778866 = 1/1.28392) so the label's text stays at a
        // constant screen size at any zoom while its distance from the frame
        // scales with the canvas. nowrap keeps long names on one line.
        <span
          className="pointer-events-none absolute -top-5 left-0 whitespace-nowrap bg-[#161b22] px-1.5 py-0.5 text-xs text-gray-300"
          style={{ transform: `scale(${1 / (zoom ?? 1)})`, transformOrigin: "left top" }}
          aria-hidden
        >
          {element.name}
        </span>
      ) : null}
    </div>
  );
}
