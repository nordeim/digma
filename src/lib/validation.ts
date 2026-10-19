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

// Session 152 (S152-A / B148-I2 closed — the one-hundredth audit's
// chosen work): the truncation family's UTF-16-safe seam. A raw
// String.slice cap can split a surrogate pair at the boundary — a
// stored name carrying a lone high surrogate renders a broken glyph
// (cosmetic, self-healing on rename; registered at s148, closed here
// at the nine censused members — the F139 class-census-at-fix
// doctrine: the fix's census is the live derivation). The boundary
// never stores a dangling half: an astral-plane character is kept
// whole or dropped entirely, and the cap contract holds (the safe
// form is never longer than the raw slice).
export function truncateUtf16Safe(value: string, maxLength: number): string {
  const sliced = value.slice(0, maxLength);
  const last = sliced.charCodeAt(sliced.length - 1);
  // A high surrogate at the end means a pair was split (or the input
  // itself ended malformed) — drop the dangling half either way.
  if (last >= 0xd800 && last <= 0xdbff) return sliced.slice(0, -1);
  return sliced;
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
  return truncateUtf16Safe(trimmed, maxLength);
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
  return truncateUtf16Safe(value, maxLength);
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

// Session 111 (S111-D / B-I3 — the fifty-ninth audit): the email
// normalization seam — one source for the auth family's existing
// trim().toLowerCase() contract, now consumed by all SEVEN
// email-reading sites (register, login, verify-otp, resend-otp,
// forgot-password + the two invite paths). The invite reads carried
// bare trim() while the whole auth family normalized — and the new
// (teamId, email) unique constraint rides a BINARY-collation SQLite
// index, so without the shared normalization the constraint is
// bypassable by case variation (Alex@digma.app != alex@digma.app).
export function normalizeEmail(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.trim().toLowerCase();
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
 * self-hosted ceiling. Two claims, kept separate (the S111-C
 * comment-truth repair — the S76-F rewording's own compound residual):
 * typical image-carrying boards sit FAR UNDER the cap, while a ~25 MB
 * board is the heaviest-legitimate form that fits JUST under it (the
 * census bound + the fixed per-row slack — S118-D3's re-anchor onto
 * the post-S117-A arithmetic; the pre-census 30 MB figure counted
 * the fills-only bound plus the then-uncounted text channel) —
 * not "far under" (the 2000 × ~722 KB full-image board ≈ 1.45 GB
 * sits far OVER — the elements PUT's own arithmetic — and the S67-B
 * abuse family the cap exists to stop). The sticky-wedge honest form
 * (the S112-D amendment, completed by S117-A / B117-M1 — the
 * sixty-fifth audit's headline): the scripted elements POST path's
 * stored bytes are bounded since S112-C (the maintained
 * Project.fillImageBytes counter against the shared 24 MB constant),
 * and since S117-A the census enumerates the NON-FILL channel too —
 * the rowStoredBytes seam counts text/name/fillGradient at their
 * JSON-escaped wire lengths beside both fill families (the pre-fix
 * fills-only arithmetic let a scripted client stack ~9.8 MB of
 * max-length text rows the counter scored 0, then drive the fill
 * gate to its ceiling — the wedge constructible from scratch), so
 * the construction route that could stack a stored board past this
 * line is closed; a board that nevertheless sits over it (a legacy
 * row set predating the census) wedges the full-list PUT — every
 * save answers the payload-too-large 400 until enough image elements
 * are deleted that the serialized body crosses back under the cap
 * (the recovery path the client's payloadDeadRef terminal rides: the
 * same-state never re-uploads, and deleting image elements re-arms
 * the flush), and any reload before that crossing reverts the
 * deletion work (the last persisted list predates it — close the tab
 * only after the badge reads saved again). */
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
  // Session 148 (S148-A / B148-L1 — the ninety-sixth audit's Low): the
  // CONTENT-TYPE CSRF GATE, ahead of every byte read. A JSON-parse
  // seam blocks unparseable bodies, never form-originated transports:
  // an HTML <form method="POST" enctype="text/plain"> (the classic
  // name/value trick) posts a body that parses as valid JSON, so the
  // parse alone never barred the cross-site form POST — and the public
  // auth family MINTS cookies on POST (login/verify-otp), making the
  // class a login-CSRF: the attacker's session planted in the victim's
  // jar (sameSite:"lax" gates cookie SENDING on cross-site POSTs,
  // never cookie SETTING — the exact asymmetry S136-A documented for
  // the clear direction; the S136-A "JSON-body gate" claim over-covered
  // this seam, the B125-I2 over-coverage class at the parse seam). The
  // gate: a Content-Type not carrying application/json (case-
  // insensitive; the "; charset=" suffix tolerated) is
  // unparseable-by-policy — the null-on-unparseable contract below,
  // the call sites' field narrowing untouched, zero call-site changes.
  // First-party consumers all send application/json (the lead-verified
  // census: the call() seam's body-conditional merge, the ten direct
  // fetch sites, the smoke suite's curl -H family, Playwright's
  // object-data default, the in-page e2e fetch headers). The stream is
  // cancelled like the tooLarge fast path — a kept-open stream would
  // hold the connection.
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    await request.body?.cancel().catch(() => {});
    return { tooLarge: false, value: null };
  }
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

/** S158-A/S159-A: a TOTAL, STRING-TYPED description of an unknown
 *  rejection — the guarded form of the S157-A dereference (String()
 *  itself throws on a null-prototype object, a hostile
 *  toString/Symbol.toPrimitive rethrows through the coercion, and an
 *  Error subclass can carry a throwing message getter — B158-I1, the
 *  B157-I1 family's residual closed at the coercion seam): the
 *  catch-side log line can never itself escape as the bare 500 the
 *  catch exists to make impossible. S159-A (I159-B-I1, the
 *  string-honesty member): the Error arm narrows the message — an
 *  overridden non-string message (null, a number) answers the guarded
 *  default, the : string annotation a claim the mechanism keeps for
 *  every shape. */
export function describeRejection(error: unknown): string {
  try {
    if (error instanceof Error) {
      return typeof error.message === "string"
        ? error.message
        : "[unloggable rejection]";
    }
    return String(error);
  } catch {
    return "[unloggable rejection]";
  }
}
