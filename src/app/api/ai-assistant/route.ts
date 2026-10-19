import { NextResponse, type NextRequest } from "next/server";
import { fail, ok, requireSession } from "@/lib/api";
import { describeRejection, readBoundedJson, clampText } from "@/lib/validation";
import { parseFallbackCommand, sanitizeElementSummary, sanitizeLlmOperations, type AiCommand } from "@/lib/ai-assistant";
import { aiRateLimit, clientIpOf } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Session 114 (S114-D / A114-I1 + B114-L4 — the deferred-queue front's
// call): the SERVER-SIDE duration bound the self-hosted posture lacked.
// The SDK's fetch carries no signal (a hanging upstream held the handler
// open indefinitely — maxDuration is the serverless hint the standalone
// server ignores, and the client's own 30s abort recovers the panel but
// never cancels the handler). 25s sits 5s INSIDE the client's abort so
// the deterministic fallback arrives usable, not as a dead reply.
const LLM_REQUEST_TIMEOUT_MS = 25_000;

/**
 * POST /api/ai-assistant — the editor's AI design assistant.
 *
 * Degrade-not-fail (inherited doctrine): the LLM shapes the reply, but when
 * the SDK is unavailable, the model output is malformed, or sanitization
 * rejects it, the deterministic parser in src/lib/ai-assistant.ts answers
 * with the same operation vocabulary — the assistant never hard-fails.
 */
export async function POST(request: NextRequest) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to use the assistant", 401);

  // Session 67 (S67-C / M-2): the dedicated limiter — BEFORE the body
  // parse (the auth family's own ordering discipline; an oversized or
  // malformed request burns no parse work once the bucket is dry). The
  // `ai:` bucket never touches the auth budget (the e2e/smoke suites
  // drive both routes from one localhost IP).
  const limit = aiRateLimit(clientIpOf(request.headers));
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false as const, error: { code: "RATE_LIMITED", message: "Too many assistant requests. Try again in a moment." } },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  // Session 68 (S68-A — the sixteenth audit's M-A): the S67-B parse
  // guard reaches every request.json() site — App Router handlers
  // ship no default body-size cap, so the per-field caps only bound
  // what SURVIVES the parse; this bounds the parse itself.
  const parsed = await readBoundedJson(request);
  if (parsed.tooLarge) {
    return fail("VALIDATION", "Request body too large (max 32 MB)", 400);
  }
  const body = parsed.value;
  // Session 99 (S99-D / B99-I1): the inline trim-slice twin joins the
  // S71-D clampText fold — semantics byte-identical (null/trim/slice;
  // empty → "" via the nullish fallback).
  const message = clampText(body?.message, 1000) ?? "";
  // Session 77 (S77-F / B-L1): the per-string clamp joins the count cap
  // — pre-fix the filter checked only typeof, so a scripted caller could
  // pad the system prompt with up to ~32 MB of id-shaped prose (100
  // strings x ~320 KB) beside the bounded siblings (message 1000,
  // elementSummary sanitized to 500). Real element ids are cuid-length
  // (~25); 64 is the generous bound. The fallback's ids echo inherits
  // the clamp automatically (the same array flows).
  const targetIds = Array.isArray(body?.targetIds)
    ? (body.targetIds as unknown[]).filter((i): i is string => typeof i === "string" && i.length <= 64).slice(0, 100)
    : [];
  // The selected ids whose elements are LOCKED (session 27): the fallback's
  // delete branch skips them (the wall's AI contract, S27-1) and the LLM's
  // system prompt is told to leave them alone — an instruction-level delete
  // never removes what the wall protects.
  // Session 77 (S77-F): the twin filter carries the same per-string clamp.
  const lockedTargetIds = Array.isArray(body?.lockedTargetIds)
    ? (body.lockedTargetIds as unknown[]).filter((i): i is string => typeof i === "string" && i.length <= 64).slice(0, 100)
    : [];
  // Session 75 (S75-F): the summary rides the system role, so it passes
  // through the server-side sanitizer first — one line, control-free,
  // capped at 500 (the pre-S75 raw 3000-char slice kept newlines and the
  // whole control-character family: a scripted client could forge the
  // system prompt's line structure). The legit client builder is
  // enum/geometry prose and passes through verbatim.
  const elementSummary = sanitizeElementSummary(
    typeof body?.elementSummary === "string" ? body.elementSummary : "",
  );

  if (!message) return fail("VALIDATION", "A message is required", 400);

  const fallback: AiCommand = parseFallbackCommand(message, targetIds, lockedTargetIds);

  let command: AiCommand = fallback;
  // The LLM path is the upgrade, not the contract: DIGMA_DISABLE_AI_LLM=1
  // forces the deterministic fallback (the e2e suite pins its exact replies,
  // and production can force-degrade the same way — the knob is the honest,
  // explicit form of the SDK-is-down path the try/catch below already owns).
  if (process.env.DIGMA_DISABLE_AI_LLM !== "1") {
    try {
      const { default: ZAI } = await import("z-ai-web-dev-sdk");
      const zai = await ZAI.create();
      const system = [
        "You are a design assistant embedded in a canvas editor. You reply with a JSON object ONLY:",
        '{"reply": string, "operations": Array<{op: "add", element: {type, x, y, width, height, fill, text, fontSize, radius}} | {op: "update", ids: string[], patch: {fill, opacity, width, height, text}} | {op: "delete", ids: string[]}>}',
        'type is one of rectangle | ellipse | line | text | frame. Colors are hex strings like "#3B82F6".',
        `Currently selected element ids: ${JSON.stringify(targetIds)}. ${elementSummary}`,
        `Locked element ids (NEVER delete or move these — the lock is a wall): ${JSON.stringify(lockedTargetIds)}.`,
        "Canvas coordinate space: x 0-1000, y 0-700 typical. Keep replies short.",
      ].join("\n");

      // Session 114 (S114-D): the race bounds the handler — a rejection
      // (timeout OR SDK failure) lands in the catch below and the
      // deterministic fallback answers. The timer clears on EVERY exit
      // (a fast SDK rejection must not strand a pending timer).
      let llmTimer: ReturnType<typeof setTimeout> | undefined;
      try {
        const completion = await Promise.race([
          zai.chat.completions.create({
            messages: [
              { role: "system", content: system },
              { role: "user", content: message },
            ],
            thinking: { type: "disabled" },
          }),
          new Promise<never>((_, reject) => {
            llmTimer = setTimeout(
              () => reject(new Error("LLM request exceeded the 25s bound")),
              LLM_REQUEST_TIMEOUT_MS,
            );
          }),
        ]);

        // Session 101 (S101-E / B101-I1): the completion text rides a 64KB
        // cap before the JSON scan — the user-supplied side was already
        // bounded (message 1000, ids ≤64×100, ops ≤50 after sanitize) while
        // the model's reply buffered unbounded (the SDK call sets no
        // max_tokens; a pathological repetition glitch is the realistic
        // case, and 64KB is ~100× the headroom the accepted ops need).
        const text = (completion.choices[0]?.message?.content ?? "").slice(0, 65_536);
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}");
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
          const sanitized = sanitizeLlmOperations(parsed, targetIds);
          if (sanitized) command = sanitized;
        }
      } finally {
        if (llmTimer) clearTimeout(llmTimer);
      }
    } catch (error) {
      // SDK unavailable / malformed output — the deterministic fallback already
      // holds a valid answer. Answer 200 either way, every rejection shape (S157-A/S158-A).
      console.warn("[ai-assistant] LLM path failed, using deterministic fallback:", describeRejection(error));
    }
  }

  return ok({ reply: command.reply, operations: command.operations });
}
