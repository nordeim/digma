import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { authRateLimit, clientIpOf } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** A fresh 6-digit verification code (session 43, RA-58): the reference's
 * verify-email card consumes exactly six digits; crypto-random with the
 * leading-zero-preserving modulo. */
function generateVerifyCode(): string {
  return String(100000 + (Math.floor(Math.random() * 900000)));
}

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
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail("VALIDATION", "Enter a valid email address", 400);
  }
  if (password.length < 8) {
    // Session 45, RA-63: the reference's exact measured text (its 400
    // renders verbatim in the signup card's inline alert).
    return fail("VALIDATION", "Password must be at least 8 characters long", 400);
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return fail("CONFLICT", "An account with this email already exists", 409);
  }

  // Session 43, RA-58: the reference's register does NOT open a session —
  // its signup transitions to the "Verify your email" card and the session
  // only lands on a verified OTP. The clone ports the flow with the
  // SELF-HOSTED delivery deviation: no email service exists, so the 6-digit
  // code travels in the response and the client renders it in the card's
  // info alert (the deterministic seam the e2e suite pins). Seeded/demo
  // accounts are pre-verified (the schema default) and never see this flow.
  const verifyCode = generateVerifyCode();
  const user = await db.user.create({
    data: {
      email,
      name: name || email.split("@")[0] || "Designer",
      passwordHash: hashPassword(password),
      avatarColor: "#3B82F6",
      verified: false,
      verifyCode,
      verifyAttempts: 0,
    },
    select: { id: true, email: true, name: true, avatarColor: true },
  });

  return ok({ user, verificationCode: verifyCode }, 201);
}
