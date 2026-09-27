"use client";

import * as React from "react";
import { Bot, Send, WandSparkles } from "lucide-react";

import { useEditorStore } from "./editor-store";
import { toast } from "@/hooks/use-toast";
import type { AiOperation } from "@/lib/ai-assistant";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
};

function nowLabel(): string {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

// The AI Assistant — measured from the reference: a chat panel anchored at
// the bottom of the canvas column with an intro bubble, suggestions, and an
// input with send button. Commands POST to /api/ai-assistant (LLM first,
// deterministic parser as the never-fail fallback) and apply the returned
// element operations to the canvas.
export function AiAssistant() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      text: "Hi! I'm your AI design assistant. I can make changes directly to your canvas. Try asking me to create shapes, modify elements, or organize your design.",
      time: nowLabel(),
    },
  ]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  function applyOperations(operations: AiOperation[]) {
    const store = useEditorStore.getState();
    for (const operation of operations) {
      if (operation.op === "add") {
        store.addElements([
          {
            type: operation.element.type,
            x: operation.element.x,
            y: operation.element.y,
            width: operation.element.width,
            height: operation.element.height,
            fill: operation.element.fill ?? undefined,
            text: operation.element.text ?? undefined,
            fontSize: operation.element.fontSize ?? undefined,
            radius: operation.element.radius || undefined,
          },
        ]);
      } else if (operation.op === "update") {
        const targets = operation.ids.filter((id) => store.elements.some((el) => el.id === id));
        if (targets.length === 0) continue;
        const patch: Record<string, unknown> = {};
        if (operation.patch.fill !== undefined) patch.fill = operation.patch.fill;
        if (operation.patch.opacity !== undefined) patch.opacity = operation.patch.opacity;
        if (operation.patch.width !== undefined && operation.patch.width !== null) patch.width = operation.patch.width;
        if (operation.patch.height !== undefined && operation.patch.height !== null) patch.height = operation.patch.height;
        if (operation.patch.text !== undefined) patch.text = operation.patch.text;
        if (operation.patch.scale !== undefined) {
          store.scaleElements(targets, operation.patch.scale);
          continue;
        }
        if (Object.keys(patch).length > 0) store.updateElements(targets, patch as never);
      } else if (operation.op === "delete") {
        const targets = operation.ids.filter((id) => store.elements.some((el) => el.id === id));
        if (targets.length > 0) store.deleteElements(targets);
      }
    }
  }

  async function send(text: string) {
    const message = text.trim();
    if (!message || sending) return;
    setInput("");
    setSending(true);

    const state = useEditorStore.getState();
    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: message,
      time: nowLabel(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const summary =
        state.elements.length > 0
          ? `Canvas has ${state.elements.length} elements: ${state.elements
              .slice(0, 20)
              .map((el) => `${el.type} (${Math.round(el.x)},${Math.round(el.y)} ${Math.round(el.width)}x${Math.round(el.height)})`)
              .join("; ")}`
          : "Canvas is empty.";

      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          targetIds: state.selectedIds,
          elementSummary: summary,
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) {
        toast.error("Assistant unavailable", body?.error?.message ?? "Please try again.");
        return;
      }

      const { reply, operations } = body.data as { reply: string; operations: AiOperation[] };
      applyOperations(operations);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: reply, time: nowLabel() },
      ]);
    } catch {
      toast.error("Network error", "The assistant could not be reached.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#161b22]">
      {/* Header — measured live: a blue Bot glyph leads, a purple WandSparkles
          trails, on a border-b p-3 row (no gradient circle). */}
      <div className="flex items-center gap-2 border-b border-[#30363d] p-3">
        <Bot className="h-4 w-4 text-blue-400" aria-hidden />
        <h3 className="text-sm font-medium text-white">AI Assistant</h3>
        <WandSparkles className="h-3 w-3 text-purple-400" aria-hidden />
      </div>

      <div className="editor-scroll min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {messages.map((message) =>
          message.role === "user" ? (
            /* User rows: right-aligned bubble, timestamp below (the reference
               itself crashes on send — its user bubble is unmeasurable, so the
               clone adopts the assistant bubble's measured geometry). */
            <div key={message.id} className="flex justify-end">
              <div className="max-w-[80%]">
                <div className="rounded-lg bg-blue-600 p-2 text-xs text-white">
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
                <div className="mt-1 text-right text-xs text-gray-500">{message.time}</div>
              </div>
            </div>
          ) : (
            /* Assistant rows — measured live: a blue→purple gradient bot
               avatar chip, an 80%-width p-2 rounded-lg bubble, and the
               timestamp BELOW the bubble (a sibling, text-left). */
            <div key={message.id} className="flex justify-start gap-2">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <Bot className="h-3 w-3 text-white" aria-hidden />
              </div>
              <div className="max-w-[80%]">
                <div className="rounded-lg bg-[#21262d] p-2 text-xs text-gray-300">
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
                <div className="mt-1 text-left text-xs text-gray-500">{message.time}</div>
              </div>
            </div>
          ),
        )}
        {sending && (
          <div className="flex justify-start gap-2">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <Bot className="h-3 w-3 text-white" aria-hidden />
            </div>
            <div className="rounded-lg bg-[#21262d] p-2 text-xs text-gray-400">Working on it...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input — measured live: p-3 border-t row, a flex gap-2 form with an
          h-8 flex-1 input and a SEPARATE blue-600 send button (no inline
          icon, no suggestions line). */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
        className="flex gap-2 border-t border-[#30363d] p-3"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Create a blue button, make it bigger, delete selected..."
          aria-label="Message the AI design assistant"
          className="h-8 w-full flex-1 rounded-md border border-[#30363d] bg-[#0d1117] px-3 text-xs text-white shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          aria-label="Send message"
          className="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-blue-600 px-2 text-xs font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          <Send className="h-3 w-3" aria-hidden />
        </button>
      </form>
    </div>
  );
}
