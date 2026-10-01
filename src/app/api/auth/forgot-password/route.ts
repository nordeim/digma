import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { authRateLimit, clientIpOf } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** Session 46, RA-65: the reference's reset request answers the
 * no-enumeration 200 with exactly this message (fetch-measured) — the same
 * body for known and unknown emails alike. */
const NO_ENUMERATION_MESSAGE =
  "If an account exists with this email, you will receive a password reset link.";

/** The reset window: the reference's message reads "invalid or has
 * expired" — the coherent reading is a bounded window (60 minutes). */
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

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

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail("VALIDATION", "Enter a valid email address", 400);
  }

  // The no-enumeration contract: the same 200 + message whether or not the
  // account exists. The reference's token is email-only (it never travels
  // in any response — fetch-measured); the clone carries the SELF-HOSTED
  // in-app delivery (the ADR-014 family, same as the OTP): the resetUrl
  // rides along for existing accounts so the demo flow works end-to-end.
  // Production with an email service should switch the delivery and drop
  // the URL — the response shape stays compatible.
  //
  // The URL is RELATIVE on purpose (the e2e trace caught the absolute form
  // breaking the standalone deploy): Next's standalone server rebuilds
  // request.url from its BIND address, so `new URL(request.url).origin`
  // yielded http://0.0.0.0:3100 — a host Chrome refuses cookies on, which
  // killed the post-login session. A relative href resolves against the
  // page's own origin everywhere (dev, standalone, any prod host).
  let resetUrl: string | null = null;
  const user = await db.user.findUnique({ where: { email } });
  if (user) {
    const token = randomBytes(32).toString("hex");
    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });
    resetUrl = `/reset-password?token=${token}`;
  }

  return ok({ message: NO_ENUMERATION_MESSAGE, resetUrl });
}
