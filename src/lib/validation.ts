// Pure validation helpers shared by the project/element routes. Manual
// guards (trim, length caps, enum membership) — no schema library, per the
// inherited conventions.

const TEMPLATES = new Set(["blank", "mobile", "desktop", "website"]);
const ELEMENT_TYPES = new Set([
  "rectangle",
  "ellipse",
  "line",
  "text",
  "frame",
  "image",
  "path",
]);

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function clampTemplate(value: string): string {
  return TEMPLATES.has(value) ? value : "blank";
}

export function isElementType(value: string): boolean {
  return ELEMENT_TYPES.has(value);
}

/** Accepts #RGB / #RRGGBB hex colors; falls back to the canvas default. */
export function clampColor(value: string, fallback = "#0D1117"): string {
  const trimmed = value?.trim();
  if (trimmed && HEX_COLOR.test(trimmed)) return trimmed;
  return fallback;
}

export function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

export function clampText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

export function clampOptionalText(value: unknown, maxLength: number): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

const FONT_WEIGHTS = new Set(["300", "400", "500", "600", "700", "800"]);
const TEXT_ALIGNS = new Set(["left", "center", "right"]);

// The reference's Font Family combobox options, measured live (session 29,
// RA-10): exactly seven families on its Radix Select.
export const FONT_FAMILIES = [
  "Inter",
  "Roboto",
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Verdana",
] as const;

export function clampFontFamily(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return (FONT_FAMILIES as readonly string[]).includes(value) ? value : null;
}

export function clampFontWeight(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return FONT_WEIGHTS.has(value) ? value : null;
}

export function clampTextAlign(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return TEXT_ALIGNS.has(value) ? value : null;
}

// Session 46 (RA-65/RA-66): the reference's /reset-password landing page
// keys its two states on the ?token= query param — only a NON-EMPTY token
// opens the "Set new password" form; a missing, empty, or differently-named
// param renders the "Invalid Reset Link" card (measured live on ?code=…
// and ?token=). The token's server-side validity is a separate concern
// (checked at submit — 400 "Invalid or expired reset token").
export function normalizeResetToken(raw: string | null | undefined): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** The reset token's 60-minute window ("invalid or HAS EXPIRED", RA-65). */
export function resetTokenAlive(
  expiresAt: Date | string | null | undefined,
  now: number = Date.now(),
): boolean {
  if (!expiresAt) return false;
  const expiry = expiresAt instanceof Date ? expiresAt.getTime() : Date.parse(expiresAt);
  if (!Number.isFinite(expiry)) return false;
  return expiry > now;
}

// Session 58 (S58-C — the sixth audit's A-M-3): the login's ?from_url
// target must be SITE-LOCAL. The raw param was previously pushed verbatim
// into router.push after sign-in/verify — Next 16's router hard-navigates
// external URLs (isExternalURL -> location.assign), so a crafted
// /login?from_url=https://attacker.example sent the victim off-site
// immediately after authentication (CWE-601). The guard: a leading "/"
// that is NOT protocol-relative "//" (the browser parses //host as a
// scheme-relative origin); backslashes are rejected the same way (some
// browsers normalize them); everything else falls back to the app root.
export function safeFromUrl(raw: string | null | undefined): string {
  if (typeof raw !== "string") return "/";
  const value = raw.trim();
  if (value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")) {
    return value;
  }
  return "/";
}

// Session 67 (S67-B — the fifteenth audit's M-4 + L-1): the authenticated
// request-surface ceilings. The S66-C caps bounded per-field lengths, but
// the elements PUT's AGGREGATE was unbounded — request.json() buffered up
// to ~2000 × ~722 KB ≈ 1.45 GB before any validation ran (App Router
// handlers ship no default body-size cap), OOMing small self-hosted boxes
// inside the interactive transaction. The creation routes had no ceiling
// at all (an authenticated loop inserts unbounded rows; each duplicate
// copies up to 2000 element rows per call).

/** The aggregate request-body ceiling: 32 MB — the documented
 * self-hosted ceiling (a 2000-element board of image fills sits far
 * under it; the 1.45 GB abuse family sits far over). */
export const REQUEST_BODY_LIMIT_BYTES = 32_000_000;

/** Pure: does the request's declared content-length exceed the cap?
 * An absent or non-numeric header passes — chunked uploads carry no
 * content-length, and the per-field caps (fillImage ≤ 700,000 chars,
 * ELEMENT_LIMIT ≤ 2000) still bound those bodies after the parse. */
export function bodySizeRejected(contentLength: string | null): boolean {
  if (!contentLength) return false;
  const bytes = Number(contentLength);
  if (!Number.isFinite(bytes) || bytes < 0) return false;
  return bytes > REQUEST_BODY_LIMIT_BYTES;
}

/** The creation ceilings (coherent-superset decisions at self-hosted
 * scale, documented as such — the reference's own limits are
 * unmeasurable): the ELEMENT_LIMIT style reaching the surfaces it
 * missed. */
export const PROJECT_LIMIT = 500;
export const TEAM_LIMIT = 100;
export const MEMBER_LIMIT = 100;
