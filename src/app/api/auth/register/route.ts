import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { generateVerifyCode, hashPassword } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
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
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail("VALIDATION", "Enter a valid email address", 400);
  }
  // Session 62 (S62-G / B-L3): the public route's input lengths are
  // capped — the pre-fix form stored unbounded name/email/password
  // strings verbatim (row bloat; every other stored string in the app
  // was already capped). scrypt cost is length-independent, so the
  // password cap costs nothing.
  if (name.length > 80 || email.length > 200 || password.length > 200) {
    return fail("VALIDATION", "Name, email, and password must be reasonably sized", 400);
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
  // Session 64 (S64-E — the twelfth audit's B-4): the findUnique→create
  // pair raced — a concurrent same-email register surfaced the Prisma
  // unique-constraint error as an unstructured 500. The catch answers
  // the SAME conflict envelope the pre-check path answers (the
  // bare-throw family the S56-H/S62-G passes closed elsewhere).
  let user;
  try {
    user = await db.user.create({
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
  } catch (error) {
    const code = (error as { code?: string } | null)?.code;
    if (code === "P2002") {
      return fail("CONFLICT", "An account with this email already exists", 409);
    }
    throw error;
  }

  return ok({ user, verificationCode: verifyCode }, 201);
}
