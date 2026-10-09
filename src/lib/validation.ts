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

/**
 * Accepts #RGB / #RRGGBB hex colors; falls back to the canvas default.
 *
 * Session 104 (S104-C / A-L3): the default param's literal IS the
 * canvas-background datum (DEFAULT_CANVAS_BACKGROUND in editor.ts) —
 * kept literal here because editor.ts imports this module (the
 * circular-import constraint; the S95-A provenance-comment precedent).
 * The no-fallback call sites carry their own domain defaults.
 */
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
  // Session 71 (S71-D / L-A10 — the nineteenth audit's B-F4): the ONE
  // text clamp. The deleted "optional" twin was behaviorally identical
  // (both returned null for absent/non-string/empty; both trim+slice)
  // — the names implied semantics that never existed, the hazard being
  // a future edit "fixing" one twin. The 8 former call sites migrated
  // unchanged.
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

// Session 99 (S99-B / A99-L2 — the forty-seventh audit's A-2): the
// TEXT-CONTENT variant — edge whitespace is real content. The S85-B
// doctrine's own words ("the canvas renders whiteSpace: pre-wrap,
// edge whitespace is real content") make the server-side trim the
// violation: a composer typing "hello " and pausing past the 800ms
// autosave debounce got the PUT round-trip — the trim deleted the
// trailing space mid-composition while the input still held focus
// (the next word joined: "helloworld"). clampText (trim + slice,
// all-whitespace → null) stays the IDENTITY/PROSE family's clamp —
// names, emails, descriptions are trimmed at the boundary; the
// element TEXT field is renderable canvas content and rides this
// slice-only form, making the round-trip byte-stable. The client's
// blur trim-at-commit stays (the S85-B boundary form — the store
// reconciles when the user LEAVES the field, never mid-composition).
export function clampTextContent(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  return value.slice(0, maxLength);
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
 * self-hosted ceiling (a typical image-carrying board sits far under
 * it at ~30 MB of data-URL prose; the 2000 × ~722 KB full-image
 * board ≈ 1.45 GB sits far OVER — the elements PUT's own arithmetic —
 * and the S67-B abuse family the cap exists to stop). Note the
 * scripted elements POST path has no aggregate cap below this line,
 * so a stored board larger than 32 MB is constructible — after which
 * every full-list PUT answers the payload-too-large 400 until the
 * oversized elements are removed (the documented known edge). */
export const REQUEST_BODY_LIMIT_BYTES = 32_000_000;

/** Pure: does the request's declared content-length exceed the cap?
 * An absent or non-numeric header passes — the STREAM COUNTER in
 * readBoundedJson bounds those bodies (chunked uploads carry no
 * content-length; the counter rejects mid-read at the same cap). */
export function bodySizeRejected(contentLength: string | null): boolean {
  if (!contentLength) return false;
  const bytes = Number(contentLength);
  if (!Number.isFinite(bytes) || bytes < 0) return false;
  return bytes > REQUEST_BODY_LIMIT_BYTES;
}

/** The bounded body-parse result: `tooLarge` answers the 32 MB
 * envelope; `value` carries the parsed JSON (null when unparseable —
 * the sites' historical `.catch(() => null)` contract). */
// Session 105 (S105-C / B-L3 — the F79 dead-export class's N−4 shape):
// the export keyword drops — zero external importers (the 14 route
// sites import readBoundedJson the FUNCTION; the alias is
// self-consumed solely as its return annotation).
type BoundedJson =
  | { tooLarge: true }
  | { tooLarge: false; value: Record<string, unknown> | null };

/** Session 75 (S75-B / B75-F1 — the chunked-parse bound): the ONE
 * seam every request.json() parse site consumes. The pre-S68/S67 form
 * (a content-length-only guard before an unbounded request.json())
 * left the chunked-transfer family open: a Transfer-Encoding: chunked
 * request carries NO content-length, so the guard passed and the
 * parse buffered the whole body before any per-field cap ran — six of
 * the fourteen sites unauthenticated (the OOM rationale the family
 * itself documented). The seam's two layers: the content-length fast
 * path (a declared over-cap body rejects before ANY read — the
 * bodySizeRejected logic, unchanged) and the stream counter
 * (request.body read chunk-by-chunk, rejecting + cancelling the read
 * past REQUEST_BODY_LIMIT_BYTES — the bound the header family could
 * never see). The decode+parse tail keeps the null-on-unparseable
 * contract, so the call sites' field narrowing is untouched. */
export async function readBoundedJson(request: Request): Promise<BoundedJson> {
  // Fast path: a declared content-length over the cap rejects before
  // any byte is read — and the unconsumed stream is cancelled (the
  // symmetric twin of the stream-counter path's own cancel below: a
  // kept-open stream would hold the connection and buffer the
  // producer's remaining chunks server-side). The optional chain
  // guards the body-less GET-shaped case.
  if (bodySizeRejected(request.headers.get("content-length"))) {
    await request.body?.cancel().catch(() => {});
    return { tooLarge: true };
  }
  const body = request.body;
  if (!body) {
    // No stream to bound (a body-less request): the standard parse,
    // guarded the same way the sites' old form was.
    try {
      return { tooLarge: false, value: (await request.json()) as Record<string, unknown> };
    } catch {
      return { tooLarge: false, value: null };
    }
  }
  // The stream counter — the chunked family's only bound.
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      total += value.byteLength;
      if (total > REQUEST_BODY_LIMIT_BYTES) {
        // Stop the producer before returning — a kept-open stream would
        // hold the connection and buffer the attacker's remaining
        // chunks server-side.
        await reader.cancel().catch(() => {});
        return { tooLarge: true };
      }
      chunks.push(value);
    }
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return { tooLarge: false, value: JSON.parse(new TextDecoder().decode(merged)) as Record<string, unknown> };
  } catch {
    return { tooLarge: false, value: null };
  }
}

/** The creation ceilings (coherent-superset decisions at self-hosted
 * scale, documented as such — the reference's own limits are
 * unmeasurable): the ELEMENT_LIMIT style reaching the surfaces it
 * missed. */
export const PROJECT_LIMIT = 500;
export const TEAM_LIMIT = 100;
export const MEMBER_LIMIT = 100;
/** Session 82 (S82-C / B82-L4): the register route's user ceiling —
 * the PUBLIC route was the only unbounded creation surface (every
 * authenticated surface carries one), and each accepted request also
 * burns a scrypt hash. The self-hosted single-tenant story (ADR-003)
 * sits far under 500 accounts; the bound also amortizes the
 * credential-less loop the XFF-spoofable auth limiter cannot fully
 * stop at the default trust depth. */
export const USER_LIMIT = 500;
