// ---------------------------------------------------------------------------
// The canvas PNG export (session 51, S51-1 — a pure clone superset; the
// reference has no export anywhere, Present is its only output surface).
//
// The PURE layer maps the element tree to a standalone SVG document of the
// fixed 1000×700 board — the Present overlay's own canvas area, so "the
// export is the presentation, as a file." Every mapping mirrors the DOM
// render sites' contracts (canvas / thumbnail / present):
//
//   - Transform parity: CSS `transform: translate(x,y) scale(s) rotate(r)`
//     with `transform-origin: 0px 0px` is EXACTLY the SVG
//     `transform="translate(x y) scale(s) rotate(r)"` — the same matrix
//     product applied around the element's top-left corner.
//   - The ONE paint chain (fillPaintFor precedence: image > gradient >
//     solid) decides every non-text fill, with gradients serialized into
//     <defs> and image fills mapped to <image preserveAspectRatio>.
//   - Border-box stroke inset: Tailwind's preflight sets
//     `box-sizing: border-box`, so a DOM border paints INSIDE the
//     element's width/height while an SVG stroke paints centered on the
//     path — parity insets the shape by strokeWidth/2.
//   - The line's SVG diagonal contract (session 29, RA-8): stroke feeds
//     the <line>, never a box border.
//   - Text geometry: the flex alignItems:center + justifyContent mapping
//     becomes text-anchor/x (horizontal) and the block-centered
//     dominant-baseline="central" y (vertical), one <tspan> per explicit
//     newline (whiteSpace: pre-wrap honored for explicit breaks).
//   - The frame renders border-without-label (the thumbnail convention,
//     RA-19 — the name chip is editor chrome and stays out of artifacts).
//   - visible=false skips (the thumbnail/present filter); locked elements
//     RENDER (the lock is an interaction wall, not a visual state).
//
// The BROWSER layer (svgToPngBlob + downloadPng) rasterizes the SVG
// through an <img> onto a 2× canvas and triggers the download. Known
// fidelity limit: an <img>-rasterized SVG cannot see the DOCUMENT's
// webfonts — text renders in the platform's fallback family when the
// named font isn't installed (Inter on most systems). Shapes, gradients,
// images, and geometry are exact. Pinned by tests/e2e/export-png.spec.ts
// (the download event, the PNG magic bytes, and the 2× IHDR dimensions).
// ---------------------------------------------------------------------------

import {
  canvasFontFamily,
  FALLBACK_WHITE,
  fillPaintFor,
  parseGradient,
  type DesignElementDTO,
  type GradientFill,
} from "@/lib/editor";

/** The exported board's dimensions — the Present overlay's canvas area. */
export const EXPORT_BOARD_WIDTH = 1000;
export const EXPORT_BOARD_HEIGHT = 700;

/** The raster multiplier (2× → a 2000×1400 PNG). */
export const EXPORT_SCALE = 2;

export type ExportOptions = {
  backgroundColor?: string;
  width?: number;
  height?: number;
};

/** XML-escape a text node's content. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Round to 2 decimals — no 33.333333333333336 artifacts in the SVG. */
function n(value: number): string {
  return String(Math.round(value * 100) / 100);
}

/** CSS background-size fit → the SVG preserveAspectRatio form. Cover is
 * the reference's upload default; "auto" maps to meet (the documented
 * approximation: CSS auto backgrounds tile, the SVG does not). */
function preserveAspectRatioFor(fit: string | null | undefined): string {
  switch (fit) {
    case "contain":
    case "auto":
      return "xMidYMid meet";
    case "stretch":
      return "none";
    default:
      return "xMidYMid slice";
  }
}

/** The CSS linear-gradient angle → the SVG gradient vector in
 * objectBoundingBox units. CSS 0deg points UP (increasing clockwise):
 * direction = (sin(A), −cos(A)) in screen coords (y down), so the vector
 * runs from (0.5 − sin/2, 0.5 + cos/2) to (0.5 + sin/2, 0.5 − cos/2). */
function linearGradientVector(angle: number): { x1: string; y1: string; x2: string; y2: string } {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad) / 2;
  const dy = -Math.cos(rad) / 2;
  return {
    x1: n(0.5 - dx),
    y1: n(0.5 - dy),
    x2: n(0.5 + dx),
    y2: n(0.5 + dy),
  };
}

function gradientDefs(gradient: GradientFill, id: string): string {
  const stops = [...gradient.stops]
    .sort((a, b) => a.position - b.position)
    .map((stop) => `<stop offset="${n(stop.position)}%" stop-color="${escapeXml(stop.color)}"/>`)
    .join("");
  if (gradient.type === "radial") {
    return `<radialGradient id="${id}" cx="0.5" cy="0.5" r="0.5">${stops}</radialGradient>`;
  }
  const v = linearGradientVector(gradient.angle);
  return `<linearGradient id="${id}" x1="${v.x1}" y1="${v.y1}" x2="${v.x2}" y2="${v.y2}">${stops}</linearGradient>`;
}

/** The fill attributes for a non-text element from the ONE paint chain:
 * solid → fill="…", gradient → the url(#…) fill reference (the defs entry
 * itself is derived by the caller — elementsToSvg owns the single
 * derivation), image → an <image> child. Returns the attribute string
 * plus any children. */
function paintFor(
  el: DesignElementDTO,
  gradientId: string,
): { attrs: string; children: string } {
  if (el.fillImage) {
    return {
      // fill="none" (session 53, S53-B): the parent shape must paint NO
      // backing fill — SVG's initial fill (black) would otherwise back a
      // letterboxed (contain/auto) or transparent image, where the DOM
      // paint chain leaves the area transparent. The <image> child
      // renders on top of the unfilled shape.
      attrs: 'fill="none"',
      children:
        `<image href="${escapeXml(el.fillImage)}" x="0" y="0" width="${n(el.width)}" height="${n(el.height)}" ` +
        `preserveAspectRatio="${preserveAspectRatioFor(el.fillImageFit)}"/>`,
    };
  }
  const gradient = parseGradient(el.fillGradient);
  if (gradient) {
    return { attrs: `fill="url(#${gradientId})"`, children: "" };
  }
  return { attrs: el.fill ? `fill="${escapeXml(el.fill)}"` : 'fill="none"', children: "" };
}

/** The stroke attributes + the border-box inset (sw/2 on every side). A
 * line NEVER takes these (its stroke feeds the diagonal — RA-8). */
function strokeFor(
  el: DesignElementDTO,
): { attrs: string; inset: number } {
  if (el.type !== "line" && el.stroke && el.strokeWidth > 0) {
    return {
      attrs: ` stroke="${escapeXml(el.stroke)}" stroke-width="${n(el.strokeWidth)}"`,
      inset: el.strokeWidth / 2,
    };
  }
  return { attrs: "", inset: 0 };
}

function elementToSvg(el: DesignElementDTO, gradientId: string): string {
  const paint = paintFor(el, gradientId);
  const stroke = strokeFor(el);
  const transform =
    el.x === 0 && el.y === 0 && (el.scale ?? 1) === 1 && el.rotation === 0
      ? ""
      : ` transform="translate(${n(el.x)} ${n(el.y)}) scale(${n(el.scale ?? 1)}) rotate(${n(el.rotation)})"`;
  const opacity = el.opacity !== 1 ? ` opacity="${n(el.opacity)}"` : "";

  if (el.type === "line") {
    const strokeColor = el.stroke ?? FALLBACK_WHITE;
    // Session 103 (S103-B / A-L4 — the stored-vs-rendered agreement):
    // the stored number IS the export truth — a strokeWidth of 0 (the
    // slider's own min) exports stroke-width="0" (SVG paints no
    // stroke, the border-0 semantics lines share with rectangles);
    // fresh lines carry defaultGeometry's 2.
    const strokeWidth = el.strokeWidth;
    return (
      `<line x1="0" y1="0" x2="${n(el.width)}" y2="${n(el.height)}" ` +
      `stroke="${escapeXml(strokeColor)}" stroke-width="${n(strokeWidth)}" stroke-linecap="round"` +
      `${transform}${opacity}/>`
    );
  }

  if (el.type === "text") {
    const fontSize = el.fontSize ?? 16;
    const lineHeight = fontSize * 1.2;
    const lines = (el.text ?? "").split("\n");
    const align = el.textAlign ?? "left";
    const anchor = align === "center" ? "middle" : align === "right" ? "end" : "start";
    const x = align === "center" ? el.width / 2 : align === "right" ? el.width : 0;
    // The flex alignItems:center mapping: the text BLOCK centers at H/2,
    // so the first line's central baseline sits at H/2 − (n−1)·line/2.
    const firstY = el.height / 2 - ((lines.length - 1) * lineHeight) / 2;
    const tspans = lines
      .map((line, i) =>
        i === 0
          ? `<tspan x="${n(x)}" y="${n(firstY)}">${escapeXml(line)}</tspan>`
          : `<tspan x="${n(x)}" dy="${n(lineHeight)}">${escapeXml(line)}</tspan>`,
      )
      .join("");
    return (
      `<text font-family="${escapeXml(canvasFontFamily(el.fontFamily))}" ` +
      `font-size="${n(fontSize)}" font-weight="${escapeXml(el.fontWeight ?? "500")}" ` +
      `fill="${escapeXml(el.fill ?? FALLBACK_WHITE)}" text-anchor="${anchor}" ` +
      `dominant-baseline="central"${transform}${opacity}>${tspans}</text>`
    );
  }

  if (el.type === "ellipse") {
    const rx = Math.max(el.width / 2 - stroke.inset, 0);
    const ry = Math.max(el.height / 2 - stroke.inset, 0);
    return (
      `<ellipse cx="${n(el.width / 2)}" cy="${n(el.height / 2)}" rx="${n(rx)}" ry="${n(ry)}" ` +
      `${paint.attrs}${stroke.attrs}${transform}${opacity}>${paint.children}</ellipse>`
    );
  }

  // rectangle + frame: the box form, inset by the border-box stroke.
  const x = stroke.inset;
  const y = stroke.inset;
  const width = Math.max(el.width - stroke.inset * 2, 0);
  const height = Math.max(el.height - stroke.inset * 2, 0);
  const rx = el.radius > 0 ? ` rx="${n(el.radius)}"` : "";
  return (
    `<rect x="${n(x)}" y="${n(y)}" width="${n(width)}" height="${n(height)}"${rx} ` +
    `${paint.attrs}${stroke.attrs}${transform}${opacity}>${paint.children}</rect>`
  );
}

/** The pure seam: the element tree → a standalone SVG document of the
 * 1000×700 board (backgroundColor from the store; hidden elements
 * skipped; gradients collected into <defs> with deterministic ids). */
export function elementsToSvg(
  elements: DesignElementDTO[],
  options: ExportOptions = {},
): string {
  const width = options.width ?? EXPORT_BOARD_WIDTH;
  const height = options.height ?? EXPORT_BOARD_HEIGHT;
  const backgroundColor = options.backgroundColor ?? "#0D1117";

  const visible = elements.filter((el) => el.visible);
  const defs: string[] = [];
  const shapes = visible
    .map((el, index) => {
      const gradientId = `grad-${index}`;
      const shape = elementToSvg(el, gradientId);
      // Collect the defs AFTER the shape is built (the id allocation must
      // stay index-stable regardless of which elements carry gradients).
      if (el.fillImage === null || el.fillImage === undefined) {
        const gradient = parseGradient(el.fillGradient);
        if (gradient) defs.push(gradientDefs(gradient, gradientId));
      }
      return shape;
    })
    .join("");

  const defsBlock = defs.length > 0 ? `<defs>${defs.join("")}</defs>` : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect x="0" y="0" width="${width}" height="${height}" fill="${escapeXml(backgroundColor)}"/>` +
    defsBlock +
    shapes +
    `</svg>`
  );
}

/** The download filename from the project name: path-hostile characters
 * stripped, whitespace collapsed, trimmed — "design" when empty. */
export function exportFilename(name: string | null | undefined): string {
  if (!name) return "design";
  const cleaned = name
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned === "" ? "design" : cleaned;
}

// ---------------------------------------------------------------------------
// The browser layer (NOT unit-tested — node has no Image/canvas; the e2e
// suite pins the download event, the PNG magic bytes, and the dimensions).
// ---------------------------------------------------------------------------

/** Rasterize the SVG string to a PNG Blob at the given scale. */
export async function svgToPngBlob(
  svg: string,
  width: number,
  height: number,
  scale: number = EXPORT_SCALE,
): Promise<Blob> {
  const blobUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const image = new Image();
    image.width = width;
    image.height = height;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("The export SVG could not be rasterized."));
      image.src = blobUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("The export canvas context is unavailable.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("The PNG encoding failed."));
      }, "image/png");
    });
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

/**
 * Trigger the browser download of a Blob through the anchor dance
 * (session 54, S54-A): createObjectURL → a hidden <a download> → click
 * → remove → a delayed revoke. ONE copy of the mechanics, consumed by
 * BOTH downloadPng and downloadSvg (the F35e single-source rule — the
 * 5s revoke grace is the established pattern; an immediate revoke can
 * cancel a not-yet-started fetch in some engines).
 */
function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5_000);
}

/** Trigger the browser download of a PNG Blob. */
export function downloadPng(blob: Blob, filename: string): void {
  triggerBlobDownload(blob, filename);
}

/**
 * Trigger the browser download of the SVG document itself (session 54,
 * S54-A — the session-65 suggestion #2). The serializer's output IS a
 * standalone SVG of the 1000×700 board, so the vector format costs a
 * Blob wrap, not a new serialization seam: no rasterization, no 2×
 * scale, and no webfont fidelity limit — the document names the font
 * family and any viewer with the font installed renders it exactly
 * (the documented PNG limitation does not apply). The XML declaration
 * is prepended when absent: a saved .svg file carries no HTTP charset
 * header, so the in-file `encoding="UTF-8"` declaration is what makes
 * the artifact self-describing (the serializer itself stays pure — its
 * <img>-rasterization consumers don't need it).
 */
export function downloadSvg(svg: string, filename: string): void {
  const document_ = svg.startsWith("<?xml") ? svg : `<?xml version="1.0" encoding="UTF-8"?>\n${svg}`;
  triggerBlobDownload(new Blob([document_], { type: "image/svg+xml;charset=utf-8" }), filename);
}
