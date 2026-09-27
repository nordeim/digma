// Pure editor domain: types, defaults, geometry, and naming for the design
// canvas. No React, no DB — unit-testable seams the editor components and the
// AI-assistant route both import.

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

export const ELEMENT_TOOLS: EditorTool[] = [
  "rectangle",
  "ellipse",
  "line",
  "text",
  "frame",
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
  textAlign: string | null;
  src: string | null;
  path: string | null;
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
    radius: type === "frame" ? 8 : 0,
    text: null,
    fontSize: null,
    fontWeight: null,
    textAlign: null,
    src: null,
    path: null,
    zIndex: sortOrder,
    visible: true,
    locked: false,
    sortOrder,
  };

  if (type === "text") {
    return {
      ...base,
      fill: "#FFFFFF",
      text: "Text",
      fontSize: Math.min(Math.max(height, 16), 32),
      fontWeight: "500",
      textAlign: "left",
    };
  }
  if (type === "frame") {
    return { ...base, fill: "#161B22", radius: 8 };
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

/** Normalizes a drag rectangle (any drag direction) into x/y/w/h. */
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

/** The inline style the canvas renders an element with (mirrors the
 * reference: translate(x,y) scale(s) rotate(r) — scale sits between the
 * translate and the rotate, exactly the chain the reference DOM ships). */
export function elementToStyle(el: DesignElementDTO): ElementStyle {
  const style: ElementStyle = {
    transform: `translate(${el.x}px, ${el.y}px) scale(${el.scale}) rotate(${el.rotation}deg)`,
    transformOrigin: "0px 0px",
    opacity: String(el.opacity),
    mixBlendMode: "normal",
    width: `${el.width}px`,
    height: `${el.height}px`,
  };
  if (el.fill) style.backgroundColor = el.fill;
  if (el.stroke && el.strokeWidth > 0) {
    style.border = `${el.strokeWidth}px solid ${el.stroke}`;
  }
  if (el.radius > 0) style.borderRadius = `${el.radius}px`;
  if (el.type === "text" && el.text) {
    style.fontSize = `${el.fontSize ?? 16}px`;
    style.fontWeight = el.fontWeight ?? "500";
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
 * on-screen footprint, not the model footprint. */
export function boundsOf(elements: DesignElementDTO[]): Bounds | null {
  if (elements.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const el of elements) {
    const s = el.scale ?? 1;
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + el.width * s);
    maxY = Math.max(maxY, el.y + el.height * s);
  }
  return { minX, minY, maxX, maxY };
}

/** Zoom + translate that fits the content bounds (with margin) into a box. */
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

/** Clamps zoom to the editor's supported range (5% — 800%). */
export function clampZoom(zoom: number): number {
  return Math.min(Math.max(zoom, 0.05), 8);
}
