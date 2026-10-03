// Pure editor domain: types, defaults, geometry, and naming for the design
// canvas. No React, no DB — unit-testable seams the editor components and the
// AI-assistant route both import.

// The editor's pure geometry + paint seams. Keep this module import-free
// except the shared validation helpers (clampColor) — it is the domain core
// every render site consumes.
import { clampColor } from "@/lib/validation";

export type ElementType =
  | "rectangle"
  | "ellipse"
  | "line"
  | "text"
  | "frame"
  | "image"
  | "path";

export type EditorTool =
  | "select"
  | "hand"
  | "frame"
  | "rectangle"
  | "ellipse"
  | "line"
  | "pen"
  | "text"
  | "image";

// Session 63 (S63-G / B-L1): the dead tool-list export is deleted — it
// had zero consumers in src AND tests (grep-verified; the vocabulary
// lives in the EditorTool union and the shortcut map pins completeness).

// The single-source keyboard-shortcut map (session 48, S48-1). The toolbar
// titles advertise `"{Tool} ({shortcut})"` and the keyboard handler resolves
// keys — before this seam the two lived in separate hand-maintained lists
// and the handler only wired seven of the nine advertised shortcuts ("Pen
// Tool (P)" and "Image (I)" were fiction). Both surfaces consume THIS map;
// the unit suite pins its completeness against the EditorTool vocabulary.
// Session 49 (S49-2): the LABELS moved here too (out of toolbar.tsx's
// TOOL_META, which keeps only the icons) so the toolbar titles AND the
// shortcuts dialog consume one label source (the F35e lesson: two maps of
// the same domain will diverge).
export const TOOL_SHORTCUTS: ReadonlyArray<{
  id: EditorTool;
  label: string;
  shortcut: string;
}> = [
  { id: "select", label: "Select", shortcut: "V" },
  { id: "hand", label: "Hand", shortcut: "H" },
  { id: "frame", label: "Frame", shortcut: "F" },
  { id: "rectangle", label: "Rectangle", shortcut: "R" },
  { id: "ellipse", label: "Ellipse", shortcut: "O" },
  { id: "line", label: "Line", shortcut: "L" },
  { id: "pen", label: "Pen Tool", shortcut: "P" },
  { id: "text", label: "Text", shortcut: "T" },
  { id: "image", label: "Image", shortcut: "I" },
];

/** Resolve a keystroke to its tool (case-insensitive); null when unmapped. */
export function toolForShortcut(key: string): EditorTool | null {
  const normalized = key.toLowerCase();
  const entry = TOOL_SHORTCUTS.find((tool) => tool.shortcut.toLowerCase() === normalized);
  return entry ? entry.id : null;
}

// The help-dialog inventory (session 49, S49-2 — the discoverability
// affordance). The toolbar titles are hover-only and never render on touch
// devices; this grouped list is what the Keyboard-shortcuts dialog renders.
// The Tools group DERIVES from TOOL_SHORTCUTS (the single source) so the
// dialog can never advertise a shortcut the handler doesn't wire — the
// View/Editing groups mirror the exact commands useEditorShortcuts
// implements (Ctrl/Cmd = the meta modifier; Space is hold-to-pan).
export type ShortcutHelpItem = { label: string; keys: string[] };

export const EDITOR_SHORTCUTS: ReadonlyArray<{
  group: string;
  items: ReadonlyArray<ShortcutHelpItem>;
}> = [
  {
    group: "Tools",
    items: TOOL_SHORTCUTS.map((entry) => ({ label: entry.label, keys: [entry.shortcut] })),
  },
  {
    group: "View",
    items: [
      { label: "Zoom in", keys: ["Ctrl+="] },
      { label: "Zoom out", keys: ["Ctrl+-"] },
      { label: "Reset view", keys: ["Ctrl+0"] },
      { label: "Pan canvas", keys: ["Space"] },
    ],
  },
  {
    group: "Editing",
    items: [
      { label: "Undo", keys: ["Ctrl+Z"] },
      { label: "Redo", keys: ["Ctrl+Shift+Z", "Ctrl+Y"] },
      { label: "Delete selection", keys: ["Del"] },
      { label: "Deselect", keys: ["Esc"] },
    ],
  },
];

export type DesignElementDTO = {
  id: string;
  projectId: string;
  type: ElementType;
  name: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  /** Per-element visual scale (reference parity: slider 0.1–3.0, default 1;
   * rendered in the transform chain between translate and rotate). */
  scale: number;
  opacity: number;
  fill: string | null;
  stroke: string | null;
  strokeWidth: number;
  radius: number;
  text: string | null;
  fontSize: number | null;
  fontWeight: string | null;
  /** The reference's Font Family combobox value (7 options, session 29);
   * null falls back to Inter at every render site. */
  fontFamily: string | null;
  textAlign: string | null;
  src: string | null;
  path: string | null;
  /** The Gradient tab's persisted document (session 41, RA-54) — a JSON
   * string on the wire and in the store, parsed by parseGradient at the
   * consumption seams. Null = no gradient (the solid `fill` paints). */
  fillGradient: string | null;
  /** The Image tab's persisted data URL (session 41, RA-54). Null = no
   * image fill. Wins over fillGradient when set. */
  fillImage: string | null;
  /** The Image tab's Background Size select (session 43, RA-61): the
   * stored fit enum ("cover" | "contain" | "auto" | "stretch") — null
   * paints as cover (the reference's upload default). Stretch maps to the
   * reference's "100% 100%" backgroundSize at the paint seam. */
  fillImageFit: string | null;
  zIndex: number;
  visible: boolean;
  locked: boolean;
  sortOrder: number;
};

export type ProjectDTO = {
  id: string;
  name: string;
  description: string | null;
  template: string;
  backgroundColor: string;
  lastOpenedAt: string;
  createdAt: string;
  updatedAt: string;
  elements?: DesignElementDTO[];
};

export const TEMPLATE_META: Record<string, { label: string; description: string; image: string }> = {
  blank: {
    label: "Blank Canvas",
    description: "Start from scratch with an empty design",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=200&fit=crop",
  },
  mobile: {
    label: "Mobile App",
    description: "Mobile app design template",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop",
  },
  desktop: {
    label: "Desktop App",
    description: "Desktop application interface",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=300&h=200&fit=crop",
  },
  website: {
    label: "Website",
    description: "Website design template",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
  },
};

export const CANVAS_BACKGROUND_PRESETS: Array<{ title: string; value: string }> = [
  { title: "Dark", value: "#0D1117" },
  { title: "Light", value: "#F9FAFB" },
  { title: "Purple", value: "#F3E8FF" },
  { title: "Blue", value: "#E0F2FE" },
];

export const DEFAULT_FILL = "#3B82F6";

// Session 61 (S61-F — the ninth audit's A-L-5, the residual half of
// S60-D's B-L-2): the single seam for the board-size ceiling. The PUT
// route carried it as a literal since session 33; S60-D added the POST
// literal; the CLIENT add paths (the store's addElements — the canvas
// draw commit, the text tool, the AI add branch) stayed uncapped, so
// crossing the ceiling client-side wedged every subsequent autosave PUT
// in a 400-retry loop. The route imports this constant too — one
// source of truth for the server caps and the client clamp.
export const ELEMENT_LIMIT = 2000;

/** Session 64 (S64-G — the twelfth audit's A-4): the ONE typing-target
 * predicate, single-sourced. The editor shell and the canvas had carried
 * two hand-maintained copies that had already drifted (the shell's copy
 * carried the range carve-out below; the canvas copy predated it). A
 * RANGE input accepts no text — the keyboard shortcuts (above all
 * Ctrl+Z — the most likely next action after a slider drag) must NOT
 * stand down behind it. The pre-fix blanket input exemption left the
 * undo shortcut dead with focus resting on a slider: the drag's own
 * undo entry existed but was unreachable from the keyboard.
 * Text/password/email inputs keep the exemption (typing must never
 * trigger shortcuts). */
export function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  if (tag === "input") {
    const type = (el as HTMLInputElement).type;
    return type !== "range";
  }
  return tag === "textarea" || tag === "select" || el.isContentEditable;
}

/** Default geometry + styling for a freshly drawn element of each type. */
export function defaultElementFor(
  type: ElementType,
  x: number,
  y: number,
  width: number,
  height: number,
  sortOrder: number,
): Omit<DesignElementDTO, "id" | "projectId"> {
  const base: Omit<DesignElementDTO, "id" | "projectId"> = {
    type,
    name: defaultNameFor(type, sortOrder),
    x,
    y,
    width,
    height,
    rotation: 0,
    scale: 1,
    opacity: 1,
    fill: DEFAULT_FILL,
    stroke: null,
    strokeWidth: 0,
    radius: 0,
    text: null,
    fontSize: null,
    fontWeight: null,
    fontFamily: null,
    textAlign: null,
    src: null,
    path: null,
    fillGradient: null,
    fillImage: null,
    fillImageFit: null,
    zIndex: sortOrder,
    visible: true,
    locked: false,
    sortOrder,
  };

  if (type === "text") {
    return {
      ...base,
      fill: "#FFFFFF",
      // The reference's measured fresh-text contract (session 29, RA-10):
      // the Content INPUT's VALUE is "Type here..." (not a placeholder),
      // Font Size is a fixed 16, and the Font Family combobox defaults to
      // Inter.
      text: "Type here...",
      fontSize: 16,
      fontWeight: "500",
      fontFamily: "Inter",
      textAlign: "left",
    };
  }
  if (type === "frame") {
    // The reference's frame is a LABELED CONTAINER (session 31, RA-13/RA-18):
    // a TRANSPARENT body whose structural border comes from the STROKE model
    // fields (1px solid #555555 — measured live in its Fill & Stroke panel)
    // with radius 0. The pre-fix clone rendered a solid #161B22 panel with
    // radius 8 — the pre-measurement invention.
    return { ...base, fill: null, stroke: "#555555", strokeWidth: 1, radius: 0 };
  }
  if (type === "line") {
    return { ...base, height: 0, stroke: "#FFFFFF", strokeWidth: 2, fill: null };
  }
  return base;
}

const TYPE_LABELS: Record<ElementType, string> = {
  rectangle: "Rectangle",
  ellipse: "Ellipse",
  line: "Line",
  text: "Text",
  frame: "Frame",
  image: "Image",
  path: "Path",
};

export function defaultNameFor(type: ElementType, index: number): string {
  return `${TYPE_LABELS[type]} ${index + 1}`;
}

/** Normalizes a drag rectangle (any drag direction) into x/y/w/h.
 * TEST-ONLY (session 68, S68-D): zero production consumers — the
 * canvas commits drags through its own drag-state math. The seam
 * stays because the geometry contract is unit-pinned
 * (editor.test.ts); do not wire new surfaces to it without retiring
 * the pin's honest status first. */
export function normalizeRect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): { x: number; y: number; width: number; height: number } {
  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
  };
}

export type ElementStyle = Record<string, string>;

/** The Corner Radius slider's DYNAMIC max — half the element's smaller side
 * (session 33, RA-29 — triple-measured on the reference: a 200x150 rectangle
 * reads aria-valuemax="75" = 150/2; a 46x23.366 rectangle reads
 * 11.68298487339743 = 23.366/2; a 156x117 frame reads 58.41492436698704 =
 * 117/2). The historical "fixed 75" reading was the 200x150-class audit
 * rectangle's own min/2 — the cap is a FUNCTION of the element, never a
 * constant. */
export function cornerRadiusMax(el: Pick<DesignElementDTO, "width" | "height">): number {
  return Math.min(el.width, el.height) / 2;
}

/** The font chain the canvas renders a text element with (session 33,
 * RA-30): the reference's fresh text measures computed font-family
 * "Inter, sans-serif" — ONLY the default (null/undefined/"Inter") carries
 * the fallback; chosen families render verbatim (Roboto -> "Roboto",
 * Arial -> "Arial"). The Font Family COMBOBOX still displays the model
 * value ("Inter") — this is the render-side chain only. */
export function canvasFontFamily(fontFamily?: string | null): string {
  return fontFamily && fontFamily !== "Inter" ? fontFamily : "Inter, sans-serif";
}

/** TEST-ONLY reference-geometry contract (session 63, S63-G — the honest
 * status): the canvas re-implements this style chain inline at its render
 * site; this export exists so the unit suite pins the geometry the canvas
 * must reproduce (translate(x,y) scale(s) rotate(r) — scale sits between
 * the translate and the rotate, exactly the chain the reference DOM
 * ships). Making the canvas consume this seam directly is the deferred
 * Mode D refactor. */
export function elementToStyle(el: DesignElementDTO): ElementStyle {
  const style: ElementStyle = {
    transform: `translate(${el.x}px, ${el.y}px) scale(${el.scale}) rotate(${el.rotation}deg)`,
    transformOrigin: "0px 0px",
    opacity: String(el.opacity),
    mixBlendMode: "normal",
    width: `${el.width}px`,
    height: `${el.height}px`,
  };
  // The one fill paint seam (session 41, RA-54) — image > gradient > solid;
  // TEXT keeps its own color contract below and never takes a background.
  // Session 43 (RA-61): the image paint also carries backgroundSize +
  // backgroundPosition (the Background Size select's contract).
  if (el.type !== "text") {
    const paint = fillPaintFor(el);
    if (paint.backgroundColor) style.backgroundColor = paint.backgroundColor;
    if (paint.backgroundImage) style.backgroundImage = paint.backgroundImage;
    if (paint.backgroundSize) style.backgroundSize = paint.backgroundSize;
    if (paint.backgroundPosition) style.backgroundPosition = paint.backgroundPosition;
  }
  // A line's stroke feeds its SVG diagonal, NEVER the box border (the
  // reference's line div measured border-0 on all four sides despite
  // stroke #FFFFFF + strokeWidth 2 — session 29, RA-8).
  if (el.type !== "line" && el.stroke && el.strokeWidth > 0) {
    style.border = `${el.strokeWidth}px solid ${el.stroke}`;
  }
  if (el.radius > 0) style.borderRadius = `${el.radius}px`;
  if (el.type === "text" && el.text) {
    style.fontSize = `${el.fontSize ?? 16}px`;
    style.fontWeight = el.fontWeight ?? "500";
    style.fontFamily = canvasFontFamily(el.fontFamily);
    style.color = el.fill ?? "#FFFFFF";
    style.display = "flex";
    style.alignItems = "center";
    style.textAlign = el.textAlign ?? "left";
    style.whiteSpace = "pre-wrap";
    style.overflow = "hidden";
  }
  if (el.type === "ellipse") {
    style.borderRadius = "50%";
  }
  return style;
}

export type Bounds = { minX: number; minY: number; maxX: number; maxY: number };

/** Content bounding box of a set of elements (used by thumbnails + zoom-to-fit).
 * VISUAL bounds: a scaled element occupies width*scale x height*scale —
 * the selection outline, marquee containment, and thumbnails all need the
 * on-screen footprint, not the model footprint.
 * Session 64 (S64-C — the twelfth audit's A-3): the footprint is
 * ROTATION-AWARE. The render chain is translate(x,y) scale(s) rotate(r)
 * with transform-origin 0 0 — the hit-test already inverse-maps through
 * that chain, but the bounds ran on the unrotated footprint, so a
 * rotated element's selection outline, resize handles, and marquee
 * containment landed off its visual. The AABB folds the four rotated
 * corners; the zero-angle path returns the historical math exactly. */
export function boundsOf(elements: DesignElementDTO[]): Bounds | null {
  if (elements.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const el of elements) {
    const s = el.scale ?? 1;
    const rot = el.rotation ?? 0;
    if (rot === 0) {
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + el.width * s);
      maxY = Math.max(maxY, el.y + el.height * s);
      continue;
    }
    // Corner-anchored rotation (transform-origin 0 0): the local
    // corners (0,0), (w,0), (0,h), (w,h) rotate then translate by
    // (x,y) — all through the uniform scale first.
    const rad = (rot * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const w = el.width * s;
    const h = el.height * s;
    for (const [cx, cy] of [
      [0, 0],
      [w, 0],
      [0, h],
      [w, h],
    ]) {
      const px = el.x + cx * cos - cy * sin;
      const py = el.y + cx * sin + cy * cos;
      minX = Math.min(minX, px);
      minY = Math.min(minY, py);
      maxX = Math.max(maxX, px);
      maxY = Math.max(maxY, py);
    }
  }
  return { minX, minY, maxX, maxY };
}

/** Zoom + translate that fits the content bounds (with margin) into a box.
 * TEST-ONLY (session 68, S68-D): zero production consumers — the
 * thumbnails consume thumbnailFit since S65-A and no zoom-to-fit
 * control exists (the pre-session-68 comment claimed thumbnail+zoom
 * consumers it no longer has). The seam stays because the geometry
 * contract is unit-pinned (editor.test.ts, bounds-rotation.test.ts —
 * the "zoom-to-fit composes with the rotated bounds" pin); do not
 * wire new surfaces to it without retiring the pin's honest status
 * first. */
export function fitToBounds(
  bounds: Bounds | null,
  boxWidth: number,
  boxHeight: number,
  margin = 10,
): { scale: number; offsetX: number; offsetY: number } {
  if (!bounds) return { scale: 1, offsetX: 0, offsetY: 0 };
  const contentW = Math.max(bounds.maxX - bounds.minX, 1);
  const contentH = Math.max(bounds.maxY - bounds.minY, 1);
  const scale = Math.min((boxWidth - margin * 2) / contentW, (boxHeight - margin * 2) / contentH);
  return {
    scale,
    offsetX: margin - bounds.minX * scale + (boxWidth - margin * 2 - contentW * scale) / 2,
    offsetY: margin - bounds.minY * scale + (boxHeight - margin * 2 - contentH * scale) / 2,
  };
}

/** Min-fit scale + centering translate that adapts a fixed painted box
 * (the 320x200 thumbnail coordinate space) to its RENDERED parent box.
 * Session 65 (S65-A — the thirteenth audit's A-1): the card thumbnail
 * painted its fixed space anchored at the parent's top-left and let the
 * parent's overflow crop do the "sizing" — the files-list's square slot
 * showed a corner sliver (the seeded demo elements measured zero visible
 * area) and the grid's ratio-locked slot cropped up to ~28% of the fitted
 * content at laptop widths. The reference's own decoded contract scales
 * the mini-canvas INSIDE the slot (the session-39 RA-48 measurement).
 * The translate composes FIRST in the outer space (then the scale) so
 * the scaled box centers exactly; a parent sharing the box's aspect
 * ratio fills it exactly (tx = ty = 0 — the wide grid path is
 * pixel-identical to the historical full-box paint). Degenerate
 * non-positive parent dimensions (an unmeasured or hidden container)
 * return the identity — the painted structure stands until a real
 * measurement lands. */
export function thumbnailFit(
  parentW: number,
  parentH: number,
  boxW: number,
  boxH: number,
): { scale: number; tx: number; ty: number } {
  if (parentW <= 0 || parentH <= 0) return { scale: 1, tx: 0, ty: 0 };
  const scale = Math.min(parentW / boxW, parentH / boxH);
  return {
    scale,
    tx: (parentW - boxW * scale) / 2,
    ty: (parentH - boxH * scale) / 2,
  };
}

/** Clamps zoom to the editor's supported range — the reference's measured
 * [10%, 500%] (session 39, RA-50; the Ctrl+wheel superset inherits it). */
export function clampZoom(zoom: number): number {
  // The reference's measured range (session 39, RA-50): [10%, 500%].
  return Math.min(Math.max(zoom, 0.1), 5);
}

// ---------------------------------------------------------------------
// Session 41 (RA-54) — the Fill/Gradient/Image seams. The reference's
// segmented control is a fully functional three-tab editor; these pure
// seams serve its model, CSS rendering, sanitization, and the one paint
// chain every render site (canvas / thumbnail / present) consumes.
// ---------------------------------------------------------------------

export type GradientStop = { color: string; position: number };
export type GradientFill = {
  type: "linear" | "radial";
  angle: number;
  stops: GradientStop[];
};

const GRADIENT_STOP_CAP = 8;

/** The reference's measured defaults (RA-54): a Linear gradient at 0deg
 * from #3b82f6 (0%) to #8b5cf6 (100%) — the two stops its Color Stops
 * list opens with. */
export function defaultGradient(): GradientFill {
  return {
    type: "linear",
    angle: 0,
    stops: [
      { color: "#3b82f6", position: 0 },
      { color: "#8b5cf6", position: 100 },
    ],
  };
}

/** The CSS the canvas paints for a gradient fill — stops sorted by
 * position (the list is user-editable and not guaranteed ordered). */
export function gradientCss(g: GradientFill): string {
  const stops = [...g.stops]
    .sort((a, b) => a.position - b.position)
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");
  if (g.type === "radial") return `radial-gradient(circle, ${stops})`;
  return `linear-gradient(${g.angle}deg, ${stops})`;
}

/** The add-stop button's measured behavior (RA-54): inserts a #ffffff stop
 * at 50%, at its position-sorted index (the reference's stop list renders in
 * position order — [#3b82f6 0, #ffffff 50, #8b5cf6 100] after one add).
 * Returns the list unchanged at the stop cap. */
export function addGradientStop(stops: GradientStop[]): GradientStop[] {
  if (stops.length >= GRADIENT_STOP_CAP) return stops;
  const stop: GradientStop = { color: "#ffffff", position: 50 };
  const index = stops.findIndex((s) => s.position > 50);
  if (index === -1) return [...stops, stop];
  return [...stops.slice(0, index), stop, ...stops.slice(index)];
}

/** The stop row's remove button (session 43, RA-55 — decoded verbatim
 * `i.length>2 && <Button onClick={()=>y(w)}>`): removes the stop at the
 * index, guarded at the two-stop minimum — at length <= 2 the SAME array
 * reference returns unchanged (no remove buttons render there, so the
 * seam can never fire from the UI; the guard keeps every caller safe). */
export function removeGradientStop(stops: GradientStop[], index: number): GradientStop[] {
  if (stops.length <= 2) return stops;
  return stops.filter((_, i) => i !== index);
}

/** The sanitize seam for the stored gradient JSON (the clampColor family):
 * type/enum, angle [0,360], stop positions [0,100], stop colors, and the
 * stop count are clamped; anything malformed yields null (the solid fill
 * paints — the degrade-not-fail discipline). */
export function parseGradient(raw: string | null | undefined): GradientFill | null {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const obj = parsed as Record<string, unknown>;
  if (!Array.isArray(obj.stops) || obj.stops.length === 0) return null;
  const type = obj.type === "radial" ? "radial" : "linear";
  const angle = typeof obj.angle === "number" && Number.isFinite(obj.angle)
    ? Math.min(Math.max(obj.angle, 0), 360)
    : 0;
  const stops = (obj.stops as unknown[])
    .filter((s): s is Record<string, unknown> => typeof s === "object" && s !== null)
    .slice(0, GRADIENT_STOP_CAP)
    .map((s) => ({
      color: clampColor(typeof s.color === "string" ? s.color : "", "#0D1117"),
      position:
        typeof s.position === "number" && Number.isFinite(s.position)
          ? Math.min(Math.max(s.position, 0), 100)
          : 0,
    }));
  if (stops.length === 0) return null;
  return { type, angle, stops };
}

/** The ONE paint seam for an element's fill (session 41, RA-54): the image
 * wins, then the gradient, then the solid fill — the precedence the
 * reference's setters maintain (a Solid hex edit clears both non-solid
 * modes; applying an image clears the gradient). Consumers: the canvas
 * element, the card thumbnail, and the present overlay. TEXT keeps its own
 * `color: fill` contract and never consults this seam.
 *
 * Session 43, RA-61: the image branch paints the reference's Background
 * Size contract — `background-size: <fit>` (stretch = "100% 100%", the
 * default cover) + `background-position: center` (the reference's upload
 * handler sets both; its select edits the size). */
export function fillPaintFor(
  el: Pick<DesignElementDTO, "fill" | "fillGradient" | "fillImage" | "fillImageFit">,
): { backgroundColor?: string; backgroundImage?: string; backgroundSize?: string; backgroundPosition?: string } {
  if (el.fillImage) {
    return {
      backgroundImage: `url("${el.fillImage}")`,
      backgroundSize: fillImageSizeFor(el.fillImageFit),
      backgroundPosition: "center",
    };
  }
  const gradient = parseGradient(el.fillGradient);
  if (gradient) return { backgroundImage: gradientCss(gradient) };
  if (el.fill) return { backgroundColor: el.fill };
  return {};
}

/** The Image tab's Background Size mapping (session 43, RA-61 — decoded:
 * the reference's select stores cover | contain | auto | "100% 100%"; the
 * clone stores the enum and maps "stretch" to the CSS value at the seam).
 * Null/unknown defaults to cover — the reference's upload default. */
export function fillImageSizeFor(fit: string | null | undefined): string {
  switch (fit) {
    case "contain":
    case "auto":
      return fit;
    case "stretch":
      return "100% 100%";
    default:
      return "cover";
  }
}

/** The route sanitize seam for the fit enum (session 43): the four stored
 * values pass verbatim; everything else nulls (a null fit paints as cover
 * at fillPaintFor — the degrade-not-fail discipline). */
export function clampFillImageFit(value: unknown): "cover" | "contain" | "auto" | "stretch" | null {
  if (value === "cover" || value === "contain" || value === "auto" || value === "stretch") return value;
  return null;
}
