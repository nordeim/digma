import { NextResponse } from "next/server";
import { getSessionUser, type SessionUser } from "./auth";

// The uniform API envelope (ADR-006 in the inherited architecture):
// every handler except /api/health returns { ok: true, data } or
// { ok: false, error: { code, message } } — the health route is the
// documented liveness carve-out (a bare { status, app, ts } probe
// shape, pinned by doc-lows-s83 against the README).
// The client's call() helper unwraps success data or surfaces a destructive
// toast and returns null — failures never throw into React render.

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ ok: true as const, data }, { status });
}

export function fail(code: string, message: string, status: number): NextResponse {
  return NextResponse.json({ ok: false as const, error: { code, message } }, { status });
}

/**
 * Route-handler guard: returns the session user, or null when the request
 * carries no valid session (the handler should then return a 401 envelope).
 */
export async function requireSession(): Promise<SessionUser | null> {
  return getSessionUser();
}
