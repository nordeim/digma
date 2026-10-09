// Pure editor domain: types, defaults, geometry, and naming for the design
// canvas. No React, no DB — unit-testable seams the editor components and the
// AI-assistant route both import.

// The editor's pure geometry + paint seams. Keep this module import-free
// except the shared validation helpers — it is the domain core every render
// site consumes (session 70 widened the import surface to the full clamp
// family for the ONE row-builder seam the elements routes consume).
import {
  clampColor,
  clampFontFamily,
  clampFontWeight,
  clampNumber,
  clampText,
  clampTextAlign,
  clampTextContent,
  isElementType,
} from "@/lib/validation";

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
  // Session 70 (S70-B / L-A1): the dead DTO fields deleted with their
  // schema columns — src/path (written by the row-builders, zero read
  // sites) and zIndex (written + round-tripped, zero read sites).
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

// Session 70 (S70-C / L-A3 — the eighteenth audit): the bounded
// thumbnail projection for the LIST-family routes. The list GET, the
// PATCH response, and the duplicate response previously shipped FULL
// element rows — every column including the ≤700 KB data-URL fillImage —
// to feed 320×200 card thumbnails. The projection below ships exactly
// the fields CanvasThumbnail + boundsOf consume: the geometry/paint
// chain. NOT shipped: name (frames render no thumbnail label, RA-19),
// locked (thumbnails render locked elements — visible is the only
// filter), sortOrder (the array IS the order), timestamps, and the dead
// columns S70-B dropped. Session 75 (S75-C / B75-F2): projectId joins
// the Omit list — the SELECT never ships the column (the row already
// rides inside its project's response), so the TYPE promising it was a
// type/wire divergence: a future consumer trusting the declared shape
// would read undefined. The Omit set and the SELECT's omission set are
// now the same set (pinned by tests/server-lows-s75.test.ts).
export type ThumbnailElementDTO = Omit<DesignElementDTO, "name" | "locked" | "sortOrder" | "projectId">;

/** The list-family project shape: the project fields + the projected
 * (bounded) element rows. The DETAIL route (GET /api/projects/[id] — the
 * editor's surface) keeps the full-row include and the full ProjectDTO. */
export type ProjectSummaryDTO = Omit<ProjectDTO, "elements"> & { elements: ThumbnailElementDTO[] };

/** The shared Prisma select object for the projection — one source for
 * the four list-family routes (list GET, PATCH response, duplicate
 * response, and — since session 73's S73-H/B-F8 — the POST response).
 * A plain const (no Prisma type import — the route files pass it
 * straight into the include's select). */
export const THUMBNAIL_ELEMENT_SELECT = {
  id: true,
  type: true,
  x: true,
  y: true,
  width: true,
  height: true,
  rotation: true,
  scale: true,
  opacity: true,
  fill: true,
  fillGradient: true,
  fillImage: true,
  fillImageFit: true,
  stroke: true,
  strokeWidth: true,
  radius: true,
  text: true,
  fontSize: true,
  fontWeight: true,
  fontFamily: true,
  textAlign: true,
  visible: true,
} as const;


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

// Session 97 (S97-A — A97-M1/A97-L1, the forty-fifth audit): the single
// source for the render white — the model's null-fill default (a text
// with no fill paints white; a line with no stroke paints white — the
// same white, one source). DATA, not chrome (the F82/F83 separation):
// this is NOT a token indirection — #ffffff is incidentally the value
// five @theme tokens declare, but the fallback is the canvas DATA
// default (what the reference's text/line defaults paint), and riding a
// var() would re-pin the text default to the app-shell background
// token. Consumed at every render/model seam: defaultElementFor's text
// + line factories, elementToStyle, buildElementRow, the
// canvas/thumbnail/present render sites, and the export seam — closing
// the #fff/#FFFFFF spelling divergence (twelve hand-maintained copies
// of one datum, already split two ways). The DATA carve-outs stay
// literal: the AI's color-word map + template fills (ai-assistant.ts —
// authored data), the gradient add-stop's lowercase #ffffff (the
// reference's decoded RA-54 datum below).
export const FALLBACK_WHITE = "#FFFFFF";

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
 * Session 83 (S83-G — the thirty-first audit's A83-M1): the same
 * carve-out reaches type="color" — a native color swatch input accepts
 * no text either, and after the picker closes, focus rests on the
 * swatch: the Fill/Stroke/Text/Background pickers would otherwise
 * stand Ctrl+Z down behind a focused color input (the S64-G defect
 * class on the one input type the carve-out never reached).
 * Text/password/email inputs keep the exemption (typing must never
 * trigger shortcuts). */
export function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  if (tag === "input") {
    const type = (el as HTMLInputElement).type;
    return type !== "range" && type !== "color";
  }
  return tag === "textarea" || tag === "select" || el.isContentEditable;
}

/** Session 102 (S102-G / A-I3 — the F35e two-spellings class): the
 * clamp-domain bounds, named and single-sourced. The helpers below
 * and buildElementRow's row-builder spellings hand-mirrored the
 * ±100000/100000 literals (two maps of one domain inside one file);
 * both spellings now ride these named members. Session 103 (S103-C /
 * A-L3) completes the fold: the fontSize, radius-ceiling, and scale
 * domains join (the scale one a CROSS-FILE mirror into the AI
 * sanitizer — one domain, one map, wherever it lives). */
export const POSITION_BOUND = 100000;
export const SIZE_MAX = 100000;
export const FONT_SIZE_MIN = 1;
export const FONT_SIZE_MAX = 500;
export const RADIUS_MAX = 2000;
export const SCALE_MIN = 0.05;
export const SCALE_MAX = 20;

/** Session 84 (S84-B — the thirty-second audit's A84-L1): the panel
 * number-field clamps, single-sourced. The properties panel's X/Y/W/H
 * and Font Size fields lacked the server's bounds (buildElementRow
 * clamps x/y to ±100000, width/height to 0..100000, fontSize to
 * 1..500) while the Radius/Stroke/Rotation/Opacity siblings all clamped
 * at their consumers — so an out-of-range value typed into the panel
 * rendered locally until the autosave PUT's response replaced the store
 * list and the value visibly teleported to the clamped form. These
 * helpers mirror the server's bounds at the consumer; the mobile
 * properties Sheet rides the SHARED PropertiesSections composition, so
 * one seam covers both surfaces. */
export function clampPositionField(value: number): number {
  return Math.min(Math.max(value, -POSITION_BOUND), POSITION_BOUND);
}

/** The W/H form: the type-aware floor survives (a line allows a 0
 * extent, every other shape floors at 1 — the S70-D contract) and the
 * server's 100000 ceiling joins it. */
export function clampSizeField(value: number, type: ElementType): number {
  const floor = type === "line" ? 0 : 1;
  return Math.min(Math.max(value, floor), SIZE_MAX);
}

export function clampFontSizeField(value: number): number {
  // Session 103 (S103-C / A-L3): the named bound — buildElementRow's
  // fontSize spelling rides the same member (one domain, one map).
  return Math.min(Math.max(value, FONT_SIZE_MIN), FONT_SIZE_MAX);
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
    fillGradient: null,
    fillImage: null,
    fillImageFit: null,
    visible: true,
    locked: false,
    sortOrder,
  };

  if (type === "text") {
    return {
      ...base,
      fill: FALLBACK_WHITE,
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
    return { ...base, height: 0, stroke: FALLBACK_WHITE, strokeWidth: 2, fill: null };
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
 * constant.
 *
 * Session 88 (S88-A / A88-L1): the dynamic max COMPOSES with the server's
 * radius ceiling — buildElementRow clamps the field at 2000
 * (clampNumber(raw?.radius, 0, RADIUS_MAX, 0) — the S103-C named bound),
 * and min/2 alone exceeds 2000 for
 * any element whose smaller side tops 4000 (fully legal since S87-B widened
 * the W/H panel fields to the server's 100000 ceiling): a radius typed to
 * min/2 past 2000 rendered locally, then visibly TELEPORTED to the server's
 * clamp on the store-replacing autosave PUT (the S84-B teleport family's
 * residual member — the dynamic bound escaped the clamp enumeration because
 * no literal number sat at the consumer). The composition caps at 2000
 * INSIDE the one seam every consumer rides; the reference-measured dynamic
 * behavior is untouched (every measured element is far below the cap). */
export function cornerRadiusMax(el: Pick<DesignElementDTO, "width" | "height">): number {
  // Session 103 (S103-C / A-L3): the ceiling named — buildElementRow's
  // radius spelling rides the same member.
  return Math.min(Math.min(el.width, el.height) / 2, RADIUS_MAX);
}

/** The ONE slider fill-percentage seam (session 71, S71-D / L-A9 — the
 * nineteenth audit's A-F2): the panel's --range-fill custom property
 * needs a clamped 0..100 percentage. The S70-D SliderRow guard covered
 * ONE of the five sites — the rotation and scale INLINE sliders computed
 * raw percentages (a persisted rotation 900 — server-clamped ±3600 —
 * rendered a 300% fill; a persisted scale 0.05 — server-clamped [0.05,
 * 20] — rendered a negative fill). The degenerate max === min (a
 * 0-dimension element) answers 0 (never NaN). */
export function rangeFillPercent(value: number, min: number, max: number): number {
  return max > min ? Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100) : 0;
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

/** Session 73 (S73-A — the render-surface parity seam): the ONE mapping
 * from a text element's stored textAlign onto the flex-row justification
 * that makes the alignment VISIBLE. The canvas always carried it (the
 * measured reference contract — its Text Align buttons flip the computed
 * justify-content); the PresentOverlay and the CanvasThumbnail previously
 * set display:flex + textAlign with NO justifyContent, so a content-sized
 * flex text node ignored text-align and centered text rendered
 * left-aligned in presentation mode and in every card thumbnail. Every
 * text render site consumes this seam now (the S58-E "exact contract"
 * citation finally names a seam that exists). */
export function textAlignToJustify(
  align: string | null | undefined,
): "flex-start" | "center" | "flex-end" {
  if (align === "center") return "center";
  if (align === "right") return "flex-end";
  // left, unset, and any unknown value degrade to the leading edge —
  // the hand-rolled validation doctrine (never throw on foreign data).
  return "flex-start";
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
    style.color = el.fill ?? FALLBACK_WHITE;
    style.display = "flex";
    style.alignItems = "center";
    style.textAlign = el.textAlign ?? "left";
    // Session 74 (S74-A — A74-L1): the TEST-ONLY seam joins the S73-A
    // family — the canvas maps textAlign onto justify-content through
    // the one seam (canvas.tsx) and this export claims to pin "the
    // geometry the canvas must reproduce", so the mapping belongs here
    // too (pre-fix the text-alignment half of that claim was false).
    style.justifyContent = textAlignToJustify(el.textAlign);
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
export function boundsOf(
  // Session 70 (S70-C): the signature widens to the structural geometry
  // subset — full DTO rows AND the projected thumbnail rows both fit
  // (the list routes ship the bounded projection).
  elements: Array<Pick<DesignElementDTO, "x" | "y" | "width" | "height" | "rotation" | "scale">>,
): Bounds | null {
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

/** Session 102 (S102-E / A-L1 — the S78-C doctrine's click/select
 * completion): a discrete control re-committing its CURRENT value is
 * NOT a no-op at the store — the unconditional commit path pushes a
 * history snapshot, wipes redo, flips the saveState badge, and
 * schedules an autosave PUT of a byte-identical list. The blur-commit
 * siblings have carried the changed-value guard since S78-C; the
 * click/select family (Text Align buttons, Gradient Type buttons, the
 * Font Family and Background Size selects) now rides this ONE seam.
 * The empty patch answers false (nothing to commit). */
export function patchDiffers<T extends object>(element: T, patch: Partial<T>): boolean {
  return (Object.keys(patch) as (keyof T)[]).some((key) => patch[key] !== element[key]);
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

/** The Image tab's self-hosted fill cap — a ~500 KB data URL plus the
 * base64 overhead (session 70 moved the constant here with the clamp it
 * parameterizes; the elements route owned both before the row-builder
 * dedup). */
const FILL_IMAGE_MAX_CHARS = 700_000;

/** Session 73 (S73-F — the deferred DQ-3): the client-side downscale
 * bound. An image fill's stored data URL rides EVERY payload family —
 * the 800ms-debounced autosave PUT (the full-list replace body), the
 * detail GET, and the list GET (the thumbnail projection still ships
 * fillImage; the thumbnail paint needs it). The upload seam downscales
 * any image whose LONGEST side exceeds this bound before storing, so a
 * 4000x3000 photo under the 500 KB file gate can no longer become a
 * ~683k-char data URL that inflates every request the editor makes. */
export const FILL_IMAGE_MAX_DIM = 1200;

/** Whether an image's intrinsic dimensions exceed the stored bound. */
export function shouldDownscale(width: number, height: number): boolean {
  return width > FILL_IMAGE_MAX_DIM || height > FILL_IMAGE_MAX_DIM;
}

/** The longest-side fit: the longest dimension lands exactly at
 * FILL_IMAGE_MAX_DIM and the aspect is preserved (a 4000x3000 photo fits
 * to 1200x900). Dimensions already within the bound pass through
 * unchanged; degenerate (<=0) dimensions pass through untouched — an SVG
 * with no intrinsic size is the caller's no-op. */
export function downscaledDimensions(
  width: number,
  height: number,
): { width: number; height: number } {
  if (width <= 0 || height <= 0) return { width, height };
  const longest = Math.max(width, height);
  if (longest <= FILL_IMAGE_MAX_DIM) return { width, height };
  const k = FILL_IMAGE_MAX_DIM / longest;
  return { width: Math.round(width * k), height: Math.round(height * k) };
}

/** The image-fill sanitize seam: only data-URLs of the five supported
 * raster/SVG families within the size cap pass (the autosave PUT carries
 * the full element list — an unbounded image would bloat every save);
 * anything else nulls. (Session 70 moved this from the elements route —
 * the ONE row-builder seam consumes it.) */
export function clampFillImage(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (!/^data:image\/(png|jpeg|jpg|gif|svg\+xml|webp);base64,[A-Za-z0-9+/=]+$/.test(value)) return null;
  if (value.length > FILL_IMAGE_MAX_CHARS) return null;
  return value;
}

/** The element row shape the elements routes persist (session 70's
 * S70-B / L-A2 — the three-convention row-builder dedup): every field
 * clamp the POST and the PUT previously hand-rolled twice, in ONE seam.
 * `mode: "create"` synthesizes the POST's omitted-field defaults (an
 * omitted fill/stroke paints the brand defaults); `mode: "replace"`
 * nulls omitted PAINT/TEXT fields (the PUT's whole-list replace
 * contract — the client is sovereign and sends exactly what the canvas
 * carries). The NAME is the honest exception in both modes (session 78,
 * S78-G / B-L7 — this doc previously claimed the validation "stays at
 * the routes"): an omitted or empty name falls back to the sequential
 * default (`defaultNameFor` — "Rectangle 3" by type+index) in create AND
 * replace, and the name clamp (80) lives HERE in the seam; only the
 * TYPE check stays at the routes (the PUT's pre-validation loop / the
 * POST's isElementType). The sortOrder source stays at the routes too
 * (they differ legitimately: the POST's derives from the count-fallback
 * clamp, the PUT's from the array index). */
export function buildElementRow(
  raw: Record<string, unknown>,
  index: number,
  mode: "create" | "replace",
): {
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  opacity: number;
  fill: string | null;
  fillGradient: string | null;
  fillImage: string | null;
  fillImageFit: string | null;
  stroke: string | null;
  strokeWidth: number;
  radius: number;
  text: string | null;
  fontSize: number | null;
  fontWeight: string | null;
  fontFamily: string | null;
  textAlign: string | null;
  visible: boolean;
  locked: boolean;
  sortOrder: number;
} {
  const type = typeof raw?.type === "string" ? raw.type : "";
  const synthesize = mode === "create";
  return {
    type,
    name: clampText(raw?.name, 80) ?? defaultNameFor(type as ElementType, index),
    x: clampNumber(raw?.x, -POSITION_BOUND, POSITION_BOUND, 0),
    y: clampNumber(raw?.y, -POSITION_BOUND, POSITION_BOUND, 0),
    width: clampNumber(raw?.width, 0, SIZE_MAX, 100),
    height: clampNumber(raw?.height, 0, SIZE_MAX, 100),
    rotation: clampNumber(raw?.rotation, -3600, 3600, 0),
    scale: clampNumber(raw?.scale, SCALE_MIN, SCALE_MAX, 1),
    opacity: clampNumber(raw?.opacity, 0, 1, 1),
    // THE ONE convention asymmetry, made explicit and parameterized: an
    // EXPLICIT null clears in both modes (the historical POST contract);
    // only an UNDEFINED field differs — create synthesizes the brand
    // default, replace nulls (the whole-list contract).
    fill:
      raw?.fill === null
        ? null
        : raw?.fill === undefined
          ? synthesize
            ? DEFAULT_FILL
            : null
          : clampColor(String(raw.fill), DEFAULT_FILL),
    fillGradient:
      raw?.fillGradient === null || raw?.fillGradient === undefined
        ? null
        : (() => {
            const g = parseGradient(String(raw.fillGradient));
            return g ? JSON.stringify(g) : null;
          })(),
    fillImage: clampFillImage(raw?.fillImage),
    fillImageFit: clampFillImageFit(raw?.fillImageFit),
    stroke:
      raw?.stroke === null
        ? null
        : raw?.stroke === undefined
          ? synthesize
            ? FALLBACK_WHITE
            : null
          : clampColor(String(raw.stroke), FALLBACK_WHITE),
    strokeWidth: clampNumber(raw?.strokeWidth, 0, 100, 0),
    radius: clampNumber(raw?.radius, 0, RADIUS_MAX, 0),
    // Session 99 (S99-B / A99-L2): the text field rides the slice-only
    // clamp — edge whitespace is real content (the S85-B doctrine's own
    // words); the identity/prose fields (name below) keep clampText.
    text: clampTextContent(raw?.text, 2000),
    fontSize: raw?.fontSize === null || raw?.fontSize === undefined ? null : clampNumber(raw?.fontSize, FONT_SIZE_MIN, FONT_SIZE_MAX, 16),
    fontWeight: clampFontWeight(raw?.fontWeight),
    fontFamily: clampFontFamily(raw?.fontFamily),
    textAlign: clampTextAlign(raw?.textAlign),
    // Session 101 (S101-A / B101-L1): strict acceptance — only a REAL
    // boolean writes. These two were the ONE field family at this seam
    // without strict validation (every sibling carries a hex regex, an
    // enum set, or a numeric clamp), and the truthiness coercion
    // INVERTED a scripted consumer's stated intent: Boolean("false")
    // === true locked what the body asked to unlock; Boolean(0) ===
    // false hid what the body never asked to hide. A non-boolean now
    // falls to the safe default, never the coercion artifact.
    visible: raw?.visible === false ? false : true,
    locked: raw?.locked === true,
    sortOrder: index,
  };
}
