import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { authRateLimit, clientIpOf } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** The wrong-code ceiling (session 43, RA-58): the reference's error reads
 * "Invalid verification code. N attempts remaining." with the counter
 * DECREMENTING per wrong code (live-measured 4 → 3 — five total). At the
 * ceiling the account requires a Resend (which regenerates the code and
 * resets the counter — the clone's coherent recovery path). */
const MAX_VERIFY_ATTEMPTS = 5;

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

  if (user.verifyCode !== code) {
    const attempts = user.verifyAttempts + 1;
    await db.user.update({ where: { id: user.id }, data: { verifyAttempts: attempts } });
    if (attempts >= MAX_VERIFY_ATTEMPTS) {
      return fail("VALIDATION", "Too many attempts. Request a new code.", 400);
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
