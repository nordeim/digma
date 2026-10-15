import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { fail, ok, requireSession } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST() {
  // Session 136 (S136-A / B136-L1 — the FIX form, the eighty-fourth
  // audit's one Low): the logout session gate. The pre-fix route read
  // no body, required no session, and unconditionally set
  // digma_session="" maxAge:0 — a cross-site top-level <form
  // method="POST"> (or a mode:"no-cors" fetch) drove the handler in
  // the victim's browser, and sameSite:"lax" gates cookie SENDING,
  // never cookie CLEARING — the clearing Set-Cookie from the
  // cross-site response still landed in the victim's jar (a
  // forced-sign-out CSRF; every other mutation route was already safe
  // through the session gate or the JSON-body gate — logout was the
  // one mutation that needed neither, the PAD §6 belt's over-covered
  // member, the B125-I2 over-coverage class on the CSRF row). The
  // closure: requireSession before the clear — the cross-site
  // caller's cookie-less POST (lax withholds the session cookie on
  // cross-site POSTs) 401s here and the Set-Cookie NEVER LANDS. The
  // consumer census makes the gate safe: every live consumer carries
  // a live session (the smoke suite's logout rides the post-restore
  // RELOGIN jar with the current tokenVersion; the e2e
  // reset-password scratch session is live per its own comment) — the
  // 401 fires only for the cookie-less caller, and a signed-out
  // caller's logout is semantically empty anyway (signing out
  // requires being signed in). The B125-I2 no-limiter posture rides
  // unchanged: the gate 401s before any work, so there is nothing to
  // rate-limit.
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "No session to sign out", 401);
  const response = ok({ signedOut: true });
  await clearSessionCookie(response);
  return response;
}
