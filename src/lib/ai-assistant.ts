// Pure AI-assistant command parsing — the deterministic fallback seam.
// The route tries the LLM first; whatever it cannot produce, this module
// provides. "AI features degrade, never fail" (inherited doctrine): every
// assistant utterance resolves to element operations + a reply string.

export type AiOperation =
  | {
      op: "add";
      element: {
        type: "rectangle" | "ellipse" | "line" | "text" | "frame";
        x: number;
        y: number;
        width: number;
        height: number;
        fill?: string | null;
        text?: string | null;
        fontSize?: number | null;
        radius?: number;
      };
    }
  | {
      op: "update";
      ids: string[]; // "all" | "selected" resolved by the caller into ids
      // Session 68 (S68-C — the sixteenth audit's L-3): the patch type
      // is NAMED and exported. The pre-fix inline form fed an untyped
      // record through a broken conditional cast — the conditional
      // resolved to `never`, so the cast never checked anything (the
      // "inert sanitizer cast" the session-67 plan deferred). The named
      // type describes exactly what the sanitizer builds and what the
      // client applies.
      patch: AssistantUpdatePatch;
    }
  | { op: "delete"; ids: string[] };

// The update operation's sanitized patch — the fields the sanitizer
// clamps and the client applies (fill hex-validated, opacity 0..1,
// width 1..20000, height 0..20000, scale 0.05..20, text ≤ 500 chars).
// Session 69 (S69-D): the dead positional fields the sanitizer never
// built and the client never applied are deleted — the type describes
// exactly what flows.
export type AssistantUpdatePatch = {
  fill?: string | null;
  opacity?: number;
  width?: number | null;
  height?: number | null;
  scale?: number; // relative resize (1.25 = +25%)
  text?: string | null;
};

export type AiCommand = {
  reply: string;
  operations: AiOperation[];
};

const COLORS: Record<string, string> = {
  red: "#EF4444",
  crimson: "#DC2626",
  blue: "#3B82F6",
  sky: "#0EA5E9",
  green: "#10B981",
  emerald: "#10B981",
  teal: "#14B8A6",
  yellow: "#F59E0B",
  amber: "#F59E0B",
  orange: "#F97316",
  purple: "#8B5CF6",
  violet: "#8B5CF6",
  pink: "#EC4899",
  magenta: "#EC4899",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#6B7280",
  grey: "#6B7280",
  cyan: "#06B6D4",
  lime: "#84CC16",
  indigo: "#6366F1",
};

const SHAPES: Record<string, "rectangle" | "ellipse"> = {
  circle: "ellipse",
  circles: "ellipse",
  ellipse: "ellipse",
  ellipses: "ellipse",
  rectangle: "rectangle",
  rectangles: "rectangle",
  square: "rectangle",
  squares: "rectangle",
  box: "rectangle",
  boxes: "rectangle",
  button: "rectangle",
  buttons: "rectangle",
};

function colorFor(text: string): string | null {
  const lowered = text.toLowerCase();
  // Session 59 (S59-B — the seventh audit's B-L-1): the \b word boundary,
  // the SHAPES matcher's own convention two branches below. The plain
  // substring match made "colored" resolve to RED (its last three
  // letters) — the panel's first advertised suggestion "Add 3 colored
  // circles" deterministically created red circles.
  for (const [word, hex] of Object.entries(COLORS)) {
    if (new RegExp(`\\b${word}\\b`).test(lowered)) return hex;
  }
  const hexMatch = lowered.match(/#([0-9a-f]{6}|[0-9a-f]{3})\b/);
  return hexMatch ? hexMatch[0] : null;
}

const DEFAULT_SIZE = 100;
const SPACING = 30;

/**
 * Deterministic parser for the assistant's advertised example commands:
 * "Add 3 colored circles", "Make selected elements red", "Create a login
 * form", "Delete selected", "Make it bigger". Unknown input returns a
 * helpful no-op reply (never throws, never fails the request).
 *
 * The delete branch is LOCK-AWARE (session 27): `lockedTargetIds` carries
 * the selected ids whose elements are locked, and an instruction-level
 * delete never removes them — the wall's AI contract (S27-1; the reference's
 * only measured outcome for the seam is the locked element SURVIVING its AI
 * delete, RA-1). The replies are honest about the skip (never the
 * reference's false "I have deleted X" claim over an unchanged canvas).
 */
export function parseFallbackCommand(
  message: string,
  targetIds: string[],
  lockedTargetIds: string[] = [],
): AiCommand {
  const lowered = message.toLowerCase().trim();
  const countMatch = lowered.match(/(?:add|create|draw)\s+(\d+)/);
  const count = countMatch ? Math.min(Math.max(parseInt(countMatch[1], 10), 1), 50) : 1;

  // ---- delete ----
  if (/\b(delete|remove)\b/.test(lowered)) {
    if (targetIds.length > 0) {
      // The wall's AI contract: locked elements never ride along with an
      // instruction-level delete — the same guard the keyboard seam carries
      // (S25-1). The layer-row TRASH is the explicit per-element delete and
      // DELIBERATELY deletes locked elements (reference parity R1); an AI
      // instruction is an indirect selection-level action.
      const locked = new Set(lockedTargetIds);
      const unlocked = targetIds.filter((id) => !locked.has(id));
      if (unlocked.length === 0) {
        return {
          reply: "The selection is locked — unlock it first, then ask me to delete it.",
          operations: [],
        };
      }
      if (unlocked.length < targetIds.length) {
        const skipped = targetIds.length - unlocked.length;
        return {
          reply: `Deleted ${unlocked.length} element${unlocked.length > 1 ? "s" : ""} — skipped ${skipped} locked (unlock ${skipped > 1 ? "them" : "it"} to delete).`,
          operations: [{ op: "delete", ids: unlocked }],
        };
      }
      return { reply: `Deleted ${targetIds.length} element${targetIds.length > 1 ? "s" : ""}.`, operations: [{ op: "delete", ids: targetIds }] };
    }
    return { reply: "Nothing selected to delete. Select elements first, then try again.", operations: [] };
  }

  // ---- recolor ----
  if (/\b(make|color|paint|set|change|fill|turn)\b/.test(lowered) && colorFor(lowered)) {
    const fill = colorFor(lowered);
    if (targetIds.length > 0) {
      return {
        reply: `Set ${targetIds.length} element${targetIds.length > 1 ? "s" : ""} to ${fill}.`,
        operations: [{ op: "update", ids: targetIds, patch: { fill } }],
      };
    }
    return {
      reply: `No selection — recoloring needs selected elements. Click shapes first (or ask me to add new ones in ${fill}).`,
      operations: [],
    };
  }

  // ---- resize ----
  if (/\b(bigger|larger|big)\b/.test(lowered)) {
    if (targetIds.length > 0) {
      return {
        reply: "Scaled the selection up by 25%.",
        operations: [{ op: "update", ids: targetIds, patch: { scale: 1.25 } }],
      };
    }
    return { reply: "Select elements first, then ask me to make them bigger.", operations: [] };
  }
  if (/\b(smaller|small|shrink)\b/.test(lowered)) {
    if (targetIds.length > 0) {
      return {
        reply: "Scaled the selection down by 20%.",
        operations: [{ op: "update", ids: targetIds, patch: { scale: 0.8 } }],
      };
    }
    return { reply: "Select elements first, then ask me to shrink them.", operations: [] };
  }

  // ---- login form template ----
  if (/\b(login|sign[- ]?in|sign[- ]?up)\b.*\b(form|page|screen)\b|\b(form|page|screen)\b.*\b(login|sign[- ]?in|sign[- ]?up)\b/.test(lowered)) {
    return {
      reply: "Created a login form — frame, headline, email + password fields, and a submit button.",
      operations: [
        { op: "add", element: { type: "frame", x: 240, y: 120, width: 320, height: 360, fill: "#161B22", radius: 12 } },
        { op: "add", element: { type: "text", x: 280, y: 160, width: 240, height: 32, fill: "#FFFFFF", text: "Sign in", fontSize: 24 } },
        { op: "add", element: { type: "rectangle", x: 280, y: 220, width: 240, height: 40, fill: "#0D1117", radius: 8 } },
        { op: "add", element: { type: "text", x: 292, y: 232, width: 200, height: 16, fill: "#8B949E", text: "Email", fontSize: 13 } },
        { op: "add", element: { type: "rectangle", x: 280, y: 280, width: 240, height: 40, fill: "#0D1117", radius: 8 } },
        { op: "add", element: { type: "text", x: 292, y: 292, width: 200, height: 16, fill: "#8B949E", text: "Password", fontSize: 13 } },
        { op: "add", element: { type: "rectangle", x: 280, y: 360, width: 240, height: 44, fill: "#3B82F6", radius: 8 } },
        { op: "add", element: { type: "text", x: 352, y: 374, width: 100, height: 16, fill: "#FFFFFF", text: "Sign in", fontSize: 14 } },
      ],
    };
  }

  // ---- add shapes ----
  for (const [word, shape] of Object.entries(SHAPES)) {
    if (new RegExp(`\\b${word}\\b`).test(lowered) && /\b(add|create|draw|place)\b/.test(lowered)) {
      const fill = colorFor(lowered) ?? "#3B82F6";
      const size = shape === "ellipse" ? 100 : 120;
      const elements = Array.from({ length: count }, (_, i) => ({
        type: shape,
        x: 200 + (i % 5) * (size + SPACING),
        y: 160 + Math.floor(i / 5) * (size + SPACING),
        width: word === "button" ? 160 : size,
        height: word === "button" ? 44 : size,
        fill,
        radius: word === "button" || word === "buttons" ? 8 : 0,
      }));
      return {
        // Session 58 (S58-F — the sixth audit's B-L-6): the dead color
        // ternary removed (both branches were "" — the color-naming intent
        // never fired). The reply string is UNCHANGED: "Added N squares." is
        // the pinned contract across three test sites (the honest-count
        // doctrine — describe what actually happened).
        reply: `Added ${count} ${word}${count > 1 && !word.endsWith("s") ? "s" : ""}.`,
        operations: elements.map((element) => ({ op: "add" as const, element })),
      };
    }
  }

  // ---- add text ----
  if (/\b(text|label|title|heading)\b/.test(lowered) && /\b(add|create|place)\b/.test(lowered)) {
    const quoted = message.match(/"([^"]+)"|'([^']+)'/);
    const content = quoted?.[1] ?? quoted?.[2] ?? "Text";
    return {
      reply: `Added a text element: "${content}".`,
      operations: [{ op: "add", element: { type: "text", x: 240, y: 200, width: 280, height: 40, fill: "#FFFFFF", text: content, fontSize: 24 } }],
    };
  }

  // ---- unknown ----
  return {
    reply:
      'I can add shapes ("Add 3 colored circles"), restyle the selection ("Make selected elements red"), build UI ("Create a login form"), or remove things ("Delete selected"). What would you like?',
    operations: [],
  };
}

// ---------------------------------------------------------------------------
// LLM output sanitation: bounds whatever the model returns before it can
// touch the canvas (the same doctrine the reference's planner uses).

/**
 * Session 75 (S75-F — the elementSummary server-side sanitizer, the
 * deferred queue's middle option): the client-supplied element summary
 * rides the request and is interpolated into the LLM's system role — a
 * scripted client (not the UI, whose builder is enum/geometry-only)
 * could otherwise forge the system prompt's line structure with
 * newlines/control characters or pad it with kilobytes of hostile
 * prose. The full server-side re-derivation was judged not worth a
 * protocol change (the request carries no projectId; the injection is
 * self-scoped — own canvas, sanitized operations, the client lock wall
 * + Revert); the SANITIZER is the chosen posture: newlines and control
 * characters collapse to spaces (one line, always), the printable
 * allowlist keeps the legitimate summary's punctuation, and the cap
 * tightens from the route's old raw 3000-char slice to 500. Pure and
 * unit-pinned (tests/server-lows-s75.test.ts).
 */
export function sanitizeElementSummary(raw: string): string {
  const flattened = raw.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  return flattened.slice(0, 500);
}

export type LlmOperation = { op: string; element?: Record<string, unknown>; ids?: unknown; patch?: Record<string, unknown> };

export function sanitizeLlmOperations(
  raw: unknown,
  targetIds: string[],
): AiCommand | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const reply = typeof obj.reply === "string" ? obj.reply.trim().slice(0, 500) : "";
  const list = Array.isArray(obj.operations) ? obj.operations : [];
  const operations: AiOperation[] = [];

  for (const item of list.slice(0, 50)) {
    const op = (item as LlmOperation)?.op;
    if (op === "add" && (item as LlmOperation)?.element) {
      const el = (item as LlmOperation).element as Record<string, unknown>;
      const type = String(el.type ?? "rectangle");
      if (!["rectangle", "ellipse", "line", "text", "frame"].includes(type)) continue;
      const element = {
        type: type as "rectangle" | "ellipse" | "line" | "text" | "frame",
        x: clamp(el.x, -50000, 50000, 200),
        y: clamp(el.y, -50000, 50000, 200),
        width: clamp(el.width, 1, 20000, 120),
        height: clamp(el.height, 0, 20000, 120),
        // Session 59 (S59-C — the seventh audit's B-L-2): the exactly-3-or-6
        // contract (validation.ts's HEX_COLOR shape, the clampColor
        // doctrine). The lax {3,6} accepted 4/5-digit hex the browser drops
        // locally — then the elements PUT's clampColor silently rewrote it
        // to the #3B82F6 fallback after save.
        fill:
          typeof el.fill === "string" && /^#[0-9a-fA-F]{3}$|^#[0-9a-fA-F]{6}$/.test(el.fill)
            ? el.fill
            : null,
        text: typeof el.text === "string" ? el.text.slice(0, 500) : null,
        fontSize: clamp(el.fontSize, 1, 200, 16),
        radius: clamp(el.radius, 0, 500, 0),
      };
      operations.push({ op: "add", element });
    } else if (op === "update" || op === "delete") {
      const rawIds = (item as LlmOperation)?.ids;
      // Session 68 (S68-C — the sixteenth audit's L-A): the ids cap the
      // route already enforces on the CLIENT's targetIds (100), mirrored
      // onto the model's reply — a hallucinated ids array can no longer
      // drive an O(ids x elements) membership filter at the client seam.
      const ids = Array.isArray(rawIds)
        ? rawIds.filter((i): i is string => typeof i === "string").slice(0, 100)
        : targetIds;
      if (ids.length === 0) continue;
      if (op === "delete") {
        operations.push({ op: "delete", ids });
      } else {
        const patchRaw = (item as LlmOperation).patch ?? {};
        // Session 68 (S68-C): the patch is BUILT TYPED — the broken
        // conditional cast is gone (the type now checks what the code
        // actually constructs; the clamped field set is unchanged).
        const patch: AssistantUpdatePatch = {};
        if (
          typeof patchRaw.fill === "string" &&
          /^#[0-9a-fA-F]{3}$|^#[0-9a-fA-F]{6}$/.test(patchRaw.fill)
        )
          patch.fill = patchRaw.fill;
        if (typeof patchRaw.opacity === "number") patch.opacity = clamp(patchRaw.opacity, 0, 1, 1);
        if (typeof patchRaw.width === "number") patch.width = clamp(patchRaw.width, 1, 20000, 100);
        if (typeof patchRaw.height === "number") patch.height = clamp(patchRaw.height, 0, 20000, 100);
        if (typeof patchRaw.scale === "number") patch.scale = clamp(patchRaw.scale, 0.05, 20, 1);
        if (typeof patchRaw.text === "string") patch.text = patchRaw.text.slice(0, 500);
        if (Object.keys(patch).length === 0) continue;
        operations.push({ op: "update", ids, patch });
      }
    }
  }

  // Session 60 (S60-E — the eighth audit's B-L-3): the guard splits.
  // Pre-fix `!reply || operations.length === 0` rejected a well-formed
  // NON-EMPTY reply carrying zero operations, so the route kept the
  // deterministic fallback — with the LLM enabled (the production
  // default), any conversational model answer with no operations was
  // thrown away and the user always saw the canned "I can add shapes…"
  // reply. The client already handles empty operations[] safely
  // (applied = 0); only an empty/missing reply still rejects.
  if (!reply) return null;
  return { reply, operations };
}

function clamp(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}
