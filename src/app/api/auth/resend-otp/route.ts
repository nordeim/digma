import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { bodySizeRejected } from "@/lib/validation";
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

  // Session 68 (S68-A — the sixteenth audit's M-A): the S67-B parse
  // guard reaches every request.json() site — App Router handlers
  // ship no default body-size cap, so the per-field caps only bound
  // what SURVIVES the parse; this bounds the parse itself.
  if (bodySizeRejected(request.headers.get("content-length"))) {
    return fail("VALIDATION", "Request body too large (max 32 MB)", 400);
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

  // Session 67 (S67-C / M-3): the OTP suppression knob — the resend's
  // delivered code nulls under DIGMA_DISABLE_IN_APP_OTP=1 exactly like
  // register's and login's unverified branch (the email-service posture).
  const inAppOtpEnabled = process.env.DIGMA_DISABLE_IN_APP_OTP !== "1";
  return ok({ verificationCode: inAppOtpEnabled ? verifyCode : null });
}
