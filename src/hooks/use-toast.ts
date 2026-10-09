"use client";

// React 19 + useSyncExternalStore-safe toast store (the M-3 idiom: never a
// useState initializer or effect-body setState). The state AND the listener
// set live on globalThis so every client chunk (page bundles vs. the root
// layout's Toaster) shares ONE store — Turbopack code-splitting can
// otherwise hand two copies of this module two separate module-level
// variables, and the Toaster would never hear the push.

import * as React from "react";

// Session 105 (S105-C / A-L1 — the F79 dead-export class's N−4 shape):
// the export keyword drops — zero external importers (every consumer
// takes toast/toast.error/useToastList by value; the alias is
// self-consumed only as the list's element annotation).
type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

type ToastStore = {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
};

type ToastInfra = {
  store: ToastStore;
  listeners: Set<() => void>;
  counter: number;
};

const globalForToasts = globalThis as unknown as { __digmaToastInfra?: ToastInfra };

const infra: ToastInfra = (globalForToasts.__digmaToastInfra ??= {
  store: {
    toasts: [],
    push: () => {},
    dismiss: () => {},
  },
  listeners: new Set<() => void>(),
  counter: 0,
});

function emit() {
  for (const listener of infra.listeners) listener();
}

function setToasts(updater: (prev: Toast[]) => Toast[]) {
  infra.store.toasts = updater(infra.store.toasts);
  emit();
}

infra.store.push = (toast) => {
  const id = `toast-${++infra.counter}-${Date.now()}`;
  setToasts((prev) => [...prev, { ...toast, id }].slice(-5));
  setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, 5000);
};

infra.store.dismiss = (id) => {
  setToasts((prev) => prev.filter((t) => t.id !== id));
};

function subscribe(listener: () => void) {
  infra.listeners.add(listener);
  return () => infra.listeners.delete(listener);
}

const empty: Toast[] = [];

/** SSR-safe toast list subscription. */
export function useToastList(): Toast[] {
  return React.useSyncExternalStore(subscribe, () => infra.store.toasts, () => empty);
}

/** Imperative toast API — safe to call from any client component. */
export const toast = {
  show(input: Omit<Toast, "id">) {
    infra.store.push(input);
  },
  success(title: string, description?: string) {
    infra.store.push({ title, description });
  },
  error(title: string, description?: string) {
    infra.store.push({ title, description, variant: "destructive" });
  },
  dismiss(id: string) {
    infra.store.dismiss(id);
  },
};
