import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { readBoundedJson } from "@/lib/validation";
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
  const parsed = await readBoundedJson(request);
  if (parsed.tooLarge) {
    return fail("VALIDATION", "Request body too large (max 32 MB)", 400);
  }
  const body = parsed.value;
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
    // Session 71 (S71-C / L-A4 — the nineteenth audit's B-F2): the
    // account-state oracle closed. Pre-fix this branch answered a
    // distinct CONFLICT status — known+verified / known+unverified /
    // unknown emails were distinguishable by status code across the
    // three branches, an enumeration the DIGMA_DISABLE_IN_APP_OTP
    // production knob does NOT close (it nulls the payload, not the
    // shape). The uniform answer mirrors the verify route's own
    // verified-case convention: the same VALIDATION 400 as an unknown
    // email, byte-identical. Session 99 (S99-D / B99-L1 — the
    // forty-seventh audit's B-L1, the B97-I1 honest-comment class):
    // VERIFIED and UNKNOWN are indistinguishable; the
    // pending-unverified state remains distinguishable BY DESIGN —
    // the delivery 200 is the route's function (the ADR-014
    // self-hosted family's inherent shape, surviving the knob with a
    // null code). The residual "unverified-signup-exists" oracle is
    // the documented ADR-014 residue, not a closed surface. The
    // client's resend path is only reachable from an unverified
    // account's verify card, so no consumer changes.
    return fail("VALIDATION", "Enter a valid email address", 400);
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
