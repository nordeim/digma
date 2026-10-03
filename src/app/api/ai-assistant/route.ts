import { NextResponse, type NextRequest } from "next/server";
import { fail, ok, requireSession } from "@/lib/api";
import { parseFallbackCommand, sanitizeLlmOperations, type AiCommand } from "@/lib/ai-assistant";
import { aiRateLimit, clientIpOf } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 1000) : "";
  const targetIds = Array.isArray(body?.targetIds)
    ? (body.targetIds as unknown[]).filter((i): i is string => typeof i === "string").slice(0, 100)
    : [];
  // The selected ids whose elements are LOCKED (session 27): the fallback's
  // delete branch skips them (the wall's AI contract, S27-1) and the LLM's
  // system prompt is told to leave them alone — an instruction-level delete
  // never removes what the wall protects.
  const lockedTargetIds = Array.isArray(body?.lockedTargetIds)
    ? (body.lockedTargetIds as unknown[]).filter((i): i is string => typeof i === "string").slice(0, 100)
    : [];
  const elementSummary = typeof body?.elementSummary === "string" ? body.elementSummary.slice(0, 3000) : "";

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

      const completion = await zai.chat.completions.create({
        messages: [
          { role: "system", content: system },
          { role: "user", content: message },
        ],
        thinking: { type: "disabled" },
      });

      const text = completion.choices[0]?.message?.content ?? "";
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
        const sanitized = sanitizeLlmOperations(parsed, targetIds);
        if (sanitized) command = sanitized;
      }
    } catch (error) {
      // SDK unavailable / malformed output — the deterministic fallback already
      // holds a valid answer. Log for the dev trail, answer 200 either way.
      console.warn("[ai-assistant] LLM path failed, using deterministic fallback:", (error as Error).message);
    }
  }

  return ok({ reply: command.reply, operations: command.operations });
}
