import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { authRateLimit, clientIpOf } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** The wrong-code ceiling (session 43, RA-58; session 45, RA-62): the
 * reference's error reads "Invalid verification code. N attempts remaining."
 * with the counter DECREMENTING per wrong code (live-measured 4 → 3 — five
 * total). At the ceiling the reference answers 429 "Too many failed
 * attempts. Please request a new verification code." — and the pending code
 * is DEAD: only a Resend (or the login's unverified-recovery branch, both
 * of which regenerate the code and reset the counter) reopens the path. */
const MAX_VERIFY_ATTEMPTS = 5;
const EXHAUSTED_MESSAGE = "Too many failed attempts. Please request a new verification code.";

export async function POST(request: NextRequest) {
  const limit = authRateLimit(clientIpOf(request.headers));
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false as const, error: { code: "RATE_LIMITED", message: "Too many attempts. Try again later." } },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const code = typeof body?.code === "string" ? body.code.trim() : "";

  if (!email || !/^\d{6}$/.test(code)) {
    return fail("VALIDATION", "Enter the 6-digit code from your email", 400);
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user || user.verified || !user.verifyCode) {
    // Already-verified accounts and unknown emails answer identically (no
    // account enumeration through this route).
    return fail("VALIDATION", "Enter the 6-digit code from your email", 400);
  }

  // Session 45, RA-62: the exhaustion LOCK — once the ceiling is hit, even
  // the CORRECT code is rejected (the reference's measured message demands a
  // new code and its measured recovery is the Resend, which resets the
  // counter; the exhausted-then-correct path on the reference itself is
  // unmeasurable — the code is email-only — so the lock is the coherent
  // reading of the measured contract, the same superset convention as
  // ADR-014's delivery deviation).
  if (user.verifyAttempts >= MAX_VERIFY_ATTEMPTS) {
    return fail("VERIFY_LOCKED", EXHAUSTED_MESSAGE, 429);
  }

  if (user.verifyCode !== code) {
    const attempts = user.verifyAttempts + 1;
    await db.user.update({ where: { id: user.id }, data: { verifyAttempts: attempts } });
    if (attempts >= MAX_VERIFY_ATTEMPTS) {
      // The fifth wrong code trips the ceiling (session 45, RA-62: the
      // reference answers 429 here, not 400).
      return fail("VERIFY_LOCKED", EXHAUSTED_MESSAGE, 429);
    }
    // The reference's measured decrementing counter: 5 wrong codes max, so
    // the first wrong attempt reads "4 attempts remaining."
    return fail("VALIDATION", `Invalid verification code. ${MAX_VERIFY_ATTEMPTS - attempts} attempts remaining.`, 400);
  }

  // Verified: clear the pending code and open the session (the register
  // route never sets the cookie — this is the flow's session landing).
  const verified = await db.user.update({
    where: { id: user.id },
    data: { verified: true, verifyCode: null, verifyAttempts: 0 },
    select: { id: true, email: true, name: true, avatarColor: true },
  });
  const response = ok({ user: verified });
  await setSessionCookie(verified.id, response);
  return response;
}
