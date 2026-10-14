import { NextResponse } from "next/server";
import { getSessionUser, type SessionUser } from "./auth";

// The uniform API envelope (the PAD §3 Application Architecture
// convention — the ok()/fail() envelope paragraph; the historical
// "ADR-006 in the inherited architecture" citation re-anchored in
// session 124, S124-D / B124-I3: the inherited template's registry
// never existed in this repo, and the PAD's own ADR-006 is the
// AI-assistant degrade decision — an unrelated decision a reader
// following the old citation landed on): every handler except /api/health returns
// { ok: true, data } or
// { ok: false, error: { code, message } } — the health route is the
// documented liveness carve-out (a bare { status, app, ts } probe
// shape, pinned by doc-lows-s83 against the README).
// The client's call() helper unwraps success data or surfaces a destructive
// toast and returns null — failures never throw into React render.

// Session 130 (S130-C / B130-L7 — the seventy-eighth audit's Reasoned Low,
// the either-way decision REGISTERED): the read path carries NO P2024/P2028
// envelope arm — every db.*.findUnique/findFirst/findMany/count site (the
// six pure-read handlers, the pre-check reads ahead of every write
// try-block, and getSessionUser's findUnique on every session-gated
// request) sits outside any try/catch. Under the documented
// slow-disk/concurrent-writer posture a long interactive transaction
// (the duplicate/elements-PUT 30s windows) can exhaust the pool wait and
// a P2024/P2028 rethrows past this envelope as a bare 500. The S124-A
// write-window arms stay scoped by design; the read-path posture is the
// documented bounded trade — envelope-consistency only (the client's
// call() degrades to a toast; server pages hit Next's error boundary; no
// data harm — the B129-I2 documented-absence form). The mechanical
// extension (a shared read-path envelope helper wrapping the find sites)
// is the registered follow-up if the posture ever changes.

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
