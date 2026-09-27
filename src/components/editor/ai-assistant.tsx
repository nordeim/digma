"use client";

import * as React from "react";
import { Send, Sparkles } from "lucide-react";

import { useEditorStore } from "./editor-store";
import { toast } from "@/hooks/use-toast";
import type { AiOperation } from "@/lib/ai-assistant";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
};

const SUGGESTIONS = [
  "Add 3 colored circles",
  "Make selected elements red",
  "Create a login form",
];

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
    <div className="flex h-full min-h-0 flex-col border-t border-[#30363d] bg-[#161b22]">
      <div className="flex items-center gap-2 px-4 py-2.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
          <Sparkles className="h-3.5 w-3.5 text-white" aria-hidden />
        </span>
        <h3 className="text-sm font-medium text-white">AI Assistant</h3>
      </div>

      <div className="editor-scroll min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-2">
        {messages.map((message) => (
          <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                message.role === "user"
                  ? "max-w-[85%] rounded-xl rounded-br-sm bg-blue-600 px-3 py-2 text-xs text-white"
                  : "max-w-[85%] rounded-xl rounded-bl-sm bg-[#21262d] px-3 py-2 text-xs text-gray-200"
              }
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
              <p className="mt-1 text-right text-[9px] text-gray-400/70">{message.time}</p>
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-xl rounded-bl-sm bg-[#21262d] px-3 py-2 text-xs text-gray-400">
              Thinking…
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
        className="border-t border-[#30363d] p-3"
      >
        <div className="relative">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Create a blue button, make it bigger, delete selected..."
            aria-label="Message the AI design assistant"
            className="h-9 w-full rounded-lg border border-[#30363d] bg-[#0d1117] pr-10 pl-3 text-xs text-gray-200 placeholder:text-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            aria-label="Send message"
            className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition-colors hover:text-blue-400 disabled:opacity-40"
          >
            <Send className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <p className="mt-2 truncate text-[10px] text-gray-600">
          Try: {SUGGESTIONS.map((s) => `"${s}"`).join(", ")}
        </p>
      </form>
    </div>
  );
}
