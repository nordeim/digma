"use client";

import { toast } from "@/hooks/use-toast";

/**
 * The ONE client-side envelope unwrapper (session 65, S65-E — the
 * thirteenth audit's A-5). The seam serves the envelope-consuming
 * list views (Dashboard, Recent, Teams, project-card — the
 * errorTitle/silent/load consumers): the `{ ok, data } | { ok,
 * error }` envelope unwraps to the data payload, and a non-ok
 * response (or a network failure) becomes a DESTRUCTIVE toast +
 * `null` — never a thrown error into render.
 *
 * THE DEFECT this closes: the helper lived as THREE per-view copies —
 * two identical init-aware twins and a files-view variant that had
 * already LOST the request-init parameter. Duplicated domain helpers
 * drift by construction (the single-sourced predicate lesson the
 * editor learned the session before); the consolidated contract is
 * ONE unwrap seam for the views that consume the envelope.
 *
 * Session 168 (S168-A / A168-L-1 — the docblock scope correction):
 * the seam does NOT serve every client view. Eleven deliberate
 * raw-fetch bypass sites live outside it, each correct and
 * self-documented at its own site — the auth cards' inline-alert
 * flows (login-screen x4, reset-password-screen x1 — the RA-60
 * reference contract: a failed sign-in renders the inline red alert
 * inside the form, never a toast, so these MUST NOT migrate through
 * this seam); the AI send's operations envelope (ai-assistant.tsx —
 * its own ok/error contract with the scope belts); and the editor's
 * serialized autosave machine plus its load effect and boundary
 * transports (editor-view.tsx x5 — the ordering/terminal machinery
 * owns its own fetch lifecycle). A future contributor migrating
 * these through call() would regress the reference's inline
 * sign-in alerts into destructive toasts.
 *
 * The init-aware form is the superset: a body-carrying init gets the
 * JSON content type merged into its headers; a body-less init (the
 * plain GET) passes through unchanged — the files view's GET-only
 * call sites are behavior-identical through this form.
 */
/**
 * The per-call options (session 71, S71-A — the nineteenth audit's
 * L-A1): `errorTitle` overrides the failure toast's title (the card
 * family's per-site copy — "Rename failed" / "Delete failed" /
 * "Could not create the project" — rides the seam instead of per-site
 * hand-rolled branches); `silent` suppresses BOTH toast families — the
 * fire-and-forget PATCH contract (the S61-H lastOpened family does not
 * care about failures and must not spam destructive toasts on every
 * network hiccup).
 */
export interface CallOptions {
  errorTitle?: string;
  silent?: boolean;
}

export async function call<T>(url: string, init?: RequestInit, opts?: CallOptions): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...init,
      ...(init?.body ? { headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } } : {}),
    });
    const body = await response.json().catch(() => null);
    if (!response.ok || !body?.ok) {
      if (!opts?.silent) {
        toast.error(opts?.errorTitle ?? "Something went wrong", body?.error?.message ?? `Request failed (${response.status}).`);
      }
      return null;
    }
    return (body.data ?? null) as T | null;
  } catch {
    if (!opts?.silent) {
      toast.error("Network error", "Could not reach the server.");
    }
    return null;
  }
}
