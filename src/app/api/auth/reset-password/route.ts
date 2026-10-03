import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { authRateLimit, clientIpOf } from "@/lib/rate-limit";
import { resetTokenAlive } from "@/lib/validation";

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

  const body = await request.json().catch(() => null);
  const resetToken = typeof body?.reset_token === "string" ? body.reset_token.trim() : "";
  const newPassword = typeof body?.new_password === "string" ? body.new_password : "";

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
  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hashPassword(newPassword),
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  });

  return ok({ message: "Password reset successfully" });
}
