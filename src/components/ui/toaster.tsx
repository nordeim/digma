"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useToastList, toast } from "@/hooks/use-toast";

// Plain-div toaster (the toast store already handles timing/dismissal; the
// Radix toast primitive added nothing the fixed-position list needed). The
// list is fixed bottom-right, auto-dismisses, and is fully pointer-interactive.
export function Toaster() {
  const toasts = useToastList();

  return (
    <div
      className="pointer-events-none fixed bottom-0 right-0 z-[100] flex w-full max-w-sm flex-col gap-2 p-4 sm:top-auto"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          className={cn(
            "pointer-events-auto animate-in slide-in-from-bottom-5 fade-in-90 relative flex w-full items-start justify-between gap-3 rounded-lg border p-4 pr-8 shadow-lg",
            t.variant === "destructive"
              ? "border-destructive/40 bg-destructive text-destructive-foreground"
              : "border bg-background text-foreground",
          )}
        >
          <div className="grid gap-0.5">
            {t.title && <p className="text-sm font-semibold">{t.title}</p>}
            {t.description && (
              <p
                className={cn(
                  "text-sm",
                  t.variant === "destructive" ? "text-destructive-foreground/90" : "text-muted-foreground",
                )}
              >
                {t.description}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => toast.dismiss(t.id)}
            className="absolute right-1.5 top-1.5 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
