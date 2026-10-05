import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { generateVerifyCode, hashPassword } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { readBoundedJson, USER_LIMIT } from "@/lib/validation";
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
  // Session 82 (S82-C / B82-L4): the create also gains the
  // creation-ceiling family's TOCTOU-safe form — the PUBLIC register
  // route was the only unbounded creation surface (every authenticated
  // surface carries one: 500/100/100/2000), and each accepted request
  // burns a scrypt hash. The count check and the create share ONE
  // transaction (the projects route's own pattern) so a concurrent
  // register cannot slip past the ceiling; the P2002 catch wraps the
  // transaction unchanged (the S64-E contract survives the re-shape).
  let overCap = false;
  let user;
  // Session 83 (S83-D — the thirty-first audit's B83-L2): the scrypt
  // hash is computed BEFORE the transaction opens — the S82-C re-shape
  // had placed hashPassword() inside the interactive callback, sync
  // CPU work inside the SQLite writer window (lengthening both the
  // held transaction and the event-loop block mid-transaction). The
  // hash has no transaction dependency; behavior is identical.
  const passwordHash = hashPassword(password);
  try {
    user = await db.$transaction(async (tx) => {
      const userCount = await tx.user.count();
      if (userCount >= USER_LIMIT) {
        overCap = true;
        return null;
      }
      return tx.user.create({
        data: {
          email,
          // Session 84 (S84-D / B84-I2): the DERIVED name caps at the same
          // 80-char bound the explicit name path enforces above — an email
          // with a ~190-char local part (the 200-char email cap) previously
          // stored a ~190-char User.name, the one path around S62-G's cap.
          name: (name || email.split("@")[0] || "Designer").slice(0, 80),
          passwordHash,
          avatarColor: "#3B82F6",
          verified: false,
          verifyCode,
          verifyAttempts: 0,
        },
        select: { id: true, email: true, name: true, avatarColor: true },
      });
    });
  } catch (error) {
    // Session 75 (S75-G / B75-F5): the catch joins the envelope-catch
    // family's instanceof dialect — the duck-typed cast would swallow
    // any non-Prisma error carrying the same code string into the 409.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return fail("CONFLICT", "An account with this email already exists", 409);
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2024" || error.code === "P2028")
    ) {
      // The transaction-abort envelope family (S77-G/S78-B): a
      // concurrent row-heavy writer can queue this transaction past
      // Prisma's interactive timeout — the structured 503 answers.
      return fail("UNAVAILABLE", "Registration took too long — the database timed out. Try again.", 503);
    }
    throw error;
  }
  if (overCap) {
    return fail("VALIDATION", "Too many users (max 500)", 400);
  }

  // Session 67 (S67-C / M-3): the OTP half of the ADR-014 suppression
  // family. DIGMA_DISABLE_IN_APP_OTP=1 nulls the in-response code — the
  // same one-step deploy form its sibling DIGMA_DISABLE_IN_APP_RESET gives
  // the resetUrl. Set it when a real email service owns the delivery: the
  // code must not ride an API payload.
  const inAppOtpEnabled = process.env.DIGMA_DISABLE_IN_APP_OTP !== "1";
  return ok({ user, verificationCode: inAppOtpEnabled ? verifyCode : null }, 201);
}
