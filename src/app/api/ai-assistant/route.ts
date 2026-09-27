import { type NextRequest } from "next/server";
import { fail, ok, requireSession } from "@/lib/api";
import { parseFallbackCommand, sanitizeLlmOperations, type AiCommand } from "@/lib/ai-assistant";

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

  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 1000) : "";
  const targetIds = Array.isArray(body?.targetIds)
    ? (body.targetIds as unknown[]).filter((i): i is string => typeof i === "string").slice(0, 100)
    : [];
  const elementSummary = typeof body?.elementSummary === "string" ? body.elementSummary.slice(0, 3000) : "";

  if (!message) return fail("VALIDATION", "A message is required", 400);

  const fallback: AiCommand = parseFallbackCommand(message, targetIds);

  let command: AiCommand = fallback;
  try {
    const { default: ZAI } = await import("z-ai-web-dev-sdk");
    const zai = await ZAI.create();
    const system = [
      "You are a design assistant embedded in a canvas editor. You reply with a JSON object ONLY:",
      '{"reply": string, "operations": Array<{op: "add", element: {type, x, y, width, height, fill, text, fontSize, radius}} | {op: "update", ids: string[], patch: {fill, opacity, width, height, text}} | {op: "delete", ids: string[]}>}',
      'type is one of rectangle | ellipse | line | text | frame. Colors are hex strings like "#3B82F6".',
      `Currently selected element ids: ${JSON.stringify(targetIds)}. ${elementSummary}`,
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

  return ok({ reply: command.reply, operations: command.operations });
}
