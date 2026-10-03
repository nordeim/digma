"use client";

import { toast } from "@/hooks/use-toast";

/**
 * The ONE client-side envelope unwrapper (session 65, S65-E — the
 * thirteenth audit's A-5). Every client view fetches through this
 * seam: the `{ ok, data } | { ok, error }` envelope unwraps to the
 * data payload, and a non-ok response (or a network failure) becomes
 * a DESTRUCTIVE toast + `null` — never a thrown error into render.
 *
 * THE DEFECT this closes: the helper lived as THREE per-view copies —
 * two identical init-aware twins and a files-view variant that had
 * already LOST the request-init parameter. Duplicated domain helpers
 * drift by construction (the single-sourced predicate lesson the
 * editor learned the session before); the documented contract is ONE
 * unwrap seam for every client view.
 *
 * The init-aware form is the superset: a body-carrying init gets the
 * JSON content type merged into its headers; a body-less init (the
 * plain GET) passes through unchanged — the files view's GET-only
 * call sites are behavior-identical through this form.
 */
export async function call<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...init,
      ...(init?.body ? { headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } } : {}),
    });
    const body = await response.json().catch(() => null);
    if (!response.ok || !body?.ok) {
      toast.error("Something went wrong", body?.error?.message ?? `Request failed (${response.status}).`);
      return null;
    }
    return (body.data ?? null) as T | null;
  } catch {
    toast.error("Network error", "Could not reach the server.");
    return null;
  }
}
