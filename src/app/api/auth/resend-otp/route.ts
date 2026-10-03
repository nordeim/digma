import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { generateVerifyCode } from "@/lib/auth";
import { authRateLimit, clientIpOf } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** POST /api/auth/resend-otp (session 43, RA-58): regenerates the pending
 * 6-digit code and RESETS the wrong-code counter (the recovery path from the
 * attempts ceiling). The reference's Resend carries NO cooldown (live-measured
 * un-disabled and timerless after a resend) — the clone matches. The code
 * travels in the response (the self-hosted in-app delivery: no email
 * service — the register route documents the same deviation). */
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

  // Session 66 (S66-C — the fourteenth audit's B-4): the S62-G caps family
  // reaches the sibling public routes (no default body-size cap in App
  // Router handlers — unbounded strings reached the SQLite lookups).
  if (email.length > 200) {
    return fail("VALIDATION", "Email must be reasonably sized", 400);
  }

  if (!email) {
    return fail("VALIDATION", "Enter a valid email address", 400);
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    // Unknown emails answer identically to the verify route (no account
    // enumeration).
    return fail("VALIDATION", "Enter a valid email address", 400);
  }
  if (user.verified) {
    return fail("CONFLICT", "This account is already verified — sign in.", 409);
  }

  const verifyCode = generateVerifyCode();
  await db.user.update({
    where: { id: user.id },
    data: { verifyCode, verifyAttempts: 0 },
  });

  return ok({ verificationCode: verifyCode });
}
