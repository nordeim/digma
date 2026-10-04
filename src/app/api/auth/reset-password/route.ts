import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { authRateLimit, clientIpOf } from "@/lib/rate-limit";
import { readBoundedJson, resetTokenAlive } from "@/lib/validation";

export const dynamic = "force-dynamic";

/** Session 46, RA-65: the reference's reset submit takes exactly
 * {reset_token, new_password} (the field names measured via its FastAPI
 * 422 on a wrong shape). The token is validated BEFORE the password — an
 * invalid token + a weak password still answers the TOKEN error
 * (live-measured). An invalid/expired/consumed token answers 400
 * "Invalid or expired reset token" (the reference's exact text). */
const INVALID_TOKEN_MESSAGE = "Invalid or expired reset token";

export async function POST(request: NextRequest) {
  const limit = authRateLimit(clientIpOf(request.headers));
  if (!limit.allowed) {
    // Session 58 (S58-F — the sixth audit's B-L-2): the Retry-After header
    // the five sibling auth routes already carry — the raw-envelope pattern
    // (the documented limiter contract: "429 RATE_LIMITED + Retry-After").
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
  const resetToken = typeof body?.reset_token === "string" ? body.reset_token.trim() : "";
  const newPassword = typeof body?.new_password === "string" ? body.new_password : "";

  // Session 66 (S66-C — the fourteenth audit's B-4): the S62-G caps family
  // reaches the sibling public routes (no default body-size cap in App
  // Router handlers — an unbounded token reached the SQLite equality
  // lookup verbatim; the password cap exists since session 64 below).
  if (resetToken.length > 200) {
    return fail("VALIDATION", "Token must be reasonably sized", 400);
  }

  // The token check comes FIRST (the measured ordering).
  if (!resetToken) {
    return fail("VALIDATION", INVALID_TOKEN_MESSAGE, 400);
  }
  const user = await db.user.findFirst({ where: { resetToken } });
  if (!user || !resetTokenAlive(user.resetTokenExpiresAt)) {
    return fail("VALIDATION", INVALID_TOKEN_MESSAGE, 400);
  }

  // The weak-password contract (the RA-63 exact text — the reference's
  // register route answers the same message for the same violation).
  if (newPassword.length < 8) {
    return fail("VALIDATION", "Password must be at least 8 characters long", 400);
  }
  // Session 64 (S64-E — the twelfth audit's B-12): the register surface
  // caps the password at 200 chars; this surface is the SAME contract —
  // the two password-setting paths must not diverge (scrypt cost is
  // length-independent, so the cap is hygiene — but asymmetry is drift).
  if (newPassword.length > 200) {
    return fail("VALIDATION", "Password must be reasonably sized", 400);
  }

  // The success path (unmeasurable on the reference — its token is
  // email-only): the coherent reading. The hash updates, the token CLEARS
  // (single-use — a replay answers the invalid-token 400), and no session
  // opens (the user signs in with the new password on /login).
  // Session 76 (S76-A — the twenty-fourth audit's B-L1): the write is the
  // ATOMIC conditional form its verify-otp sibling received in S70-D. The
  // where-clause carries the token AND the live expiry, so a racing replay
  // whose read interleaved before this commit lands count 0 (the token is
  // already consumed) and answers the invalid-token 400 instead of
  // overwriting the just-reset password on the bare row id.
  const result = await db.user.updateMany({
    where: { id: user.id, resetToken, resetTokenExpiresAt: { gt: new Date() } },
    data: {
      passwordHash: hashPassword(newPassword),
      resetToken: null,
      resetTokenExpiresAt: null,
      // Session 67 (S67-A — the fifteenth audit's M-1): the eviction. Every
      // cookie minted before this reset embeds the pre-increment version and
      // dies at the getSessionUser comparison — a stolen/observed session no
      // longer outlives the reset performed specifically to kill it.
      tokenVersion: { increment: 1 },
    },
  });
  // A zero count means the token went stale between the pre-read and
  // this commit (the racing-replay shape — a concurrent reset consumed
  // it first): the invalid-token 400, never a success envelope.
  if (result.count === 0) {
    return fail("VALIDATION", INVALID_TOKEN_MESSAGE, 400);
  }

  return ok({ message: "Password reset successfully" });
}
