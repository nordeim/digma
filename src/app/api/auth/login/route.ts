import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { generateVerifyCode, setSessionCookie, verifyPassword } from "@/lib/auth";
import { ok, fail } from "@/lib/api";
import { authRateLimit, clientIpOf } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

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
  const password = typeof body?.password === "string" ? body.password : "";

  // Session 66 (S66-C — the fourteenth audit's B-4): the S62-G caps family
  // reaches the sibling public routes — App Router handlers ship no default
  // body-size cap, so an unbounded password reached scryptSync and the
  // SQLite equality lookup verbatim. scrypt cost is length-independent;
  // the cap is hygiene, but register capping while login does not is drift.
  if (email.length > 200 || password.length > 200) {
    return fail("VALIDATION", "Email and password must be reasonably sized", 400);
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json(
      // The reference's measured text (session 43, RA-60): the inline alert
      // inside the sign-in form reads "Invalid email or password" — the
      // client renders the message verbatim.
      { ok: false as const, error: { code: "UNAUTHENTICATED", message: "Invalid email or password" } },
      { status: 401 },
    );
  }

  // Session 43, RA-58/RA-60: the reference's own login on a
  // correct-password-but-UNVERIFIED account returns the SAME generic 400
  // "Invalid email or password" (live-measured on the probe account) — a
  // dead end with no path back to the verify card. The clone ports the
  // WORKING SUPERSET instead (the mobile-nav/eye-toggle family): the login
  // regenerates the code and the client re-opens the verify-email card —
  // the recovery path the reference lacks. Documented in the PAD's
  // deviation ledger.
  if (!user.verified) {
    const verifyCode = generateVerifyCode();
    await db.user.update({ where: { id: user.id }, data: { verifyCode, verifyAttempts: 0 } });
    // Session 67 (S67-C / M-3): the OTP suppression knob — the recovery
    // path's delivered code nulls under DIGMA_DISABLE_IN_APP_OTP=1, the
    // same form register's and resend's carry.
    const inAppOtpEnabled = process.env.DIGMA_DISABLE_IN_APP_OTP !== "1";
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: "VERIFY_EMAIL", message: "Verify your email to sign in — we've sent a fresh 6-digit code." },
        email,
        verificationCode: inAppOtpEnabled ? verifyCode : null,
      },
      { status: 403 },
    );
  }

  const response = ok({ user: { id: user.id, email: user.email, name: user.name, avatarColor: user.avatarColor } });
  // Session 67 (S67-A): the mint carries the holder's live tokenVersion —
  // a later reset (which increments it) evicts this cookie.
  await setSessionCookie(user.id, user.tokenVersion, response);
  return response;
}
