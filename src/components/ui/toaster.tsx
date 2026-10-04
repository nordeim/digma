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
      // Session 72 (S72-B / L-A2): z-[300] stacks the toasts ABOVE the
      // PresentOverlay's z-[200] — the autosave machine keeps running
      // during a presentation, and its failure family (the destructive
      // "Autosave failed" toast, the S68-D "Session expired" terminal,
      // the network-error toast) previously painted BEHIND the fullscreen
      // overlay for the toast's whole lifetime. Above every dialog/sheet
      // (z-50) and the presentation — the standard toast convention.
      className="pointer-events-none fixed bottom-0 right-0 z-[300] flex w-full max-w-sm flex-col gap-2 p-4 sm:top-auto"
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
          {/* Session 76 (S76-E — the twenty-fourth audit's A-L3): the
              dismiss control meets the repo's 44px touch floor (every
              other mobile close target already does via the h-11
              family) — the hit area is the floor, the glyph stays 16px. */}
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => toast.dismiss(t.id)}
            className="absolute right-1.5 top-1.5 flex h-11 w-11 items-center justify-center rounded-md opacity-50 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
