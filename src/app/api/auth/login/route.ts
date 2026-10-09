import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { generateVerifyCode, setSessionCookie, timingEqualizerHash, verifyPassword } from "@/lib/auth";
import { ok, fail } from "@/lib/api";
import { readBoundedJson } from "@/lib/validation";
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
  // Session 72 (S72-C / L-B2 — the documented deferred B-L2): the
  // constant-work envelope. The pre-fix `!user ||` short-circuit skipped
  // the scrypt work for unknown emails, so response latency distinguished
  // registered emails (the timing oracle that survived S71-C's
  // status-code fix). The equal work burns against a precomputed hash of
  // a throwaway constant — the 401 envelope family below stays
  // byte-identical, only the timing changes.
  const passwordOk = verifyPassword(password, user?.passwordHash ?? timingEqualizerHash());
  if (!user || !passwordOk) {
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
    // Session 102 (S102-B / B-L1): the P2025 envelope catch joins the
    // route family's guard form — a row vanishing mid-request (the
    // unreachable-via-API class; no user-delete endpoint exists)
    // answers the 404 envelope, never a 500 past it. This was the
    // THIRD bare site (the B101-I3 ledger counted two); the family
    // closes to zero.
    try {
      await db.user.update({ where: { id: user.id }, data: { verifyCode, verifyAttempts: 0 } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return fail("NOT_FOUND", "User not found", 404);
      }
      throw error;
    }
    // Session 67 (S67-C / M-3): the OTP suppression knob — the recovery
    // path's delivered code nulls under DIGMA_DISABLE_IN_APP_OTP=1, the
    // same form register's and resend's carry.
    const inAppOtpEnabled = process.env.DIGMA_DISABLE_IN_APP_OTP !== "1";
    // Session 71 (S71-C / L-A5 — the nineteenth audit's B-F3): the
    // envelope fold. Pre-fix this response carried TWO fields OUTSIDE
    // the envelope member — email (read by nobody; the client renders
    // its own local state) and verificationCode (the one consumed
    // field, top-level). The code now rides INSIDE error — the response
    // is a plain envelope shape; the single consumer
    // (login-screen.tsx) reads error.verificationCode.
    return NextResponse.json(
      {
        ok: false as const,
        error: {
          code: "VERIFY_EMAIL",
          message: "Verify your email to sign in — we've sent a fresh 6-digit code.",
          verificationCode: inAppOtpEnabled ? verifyCode : null,
        },
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
