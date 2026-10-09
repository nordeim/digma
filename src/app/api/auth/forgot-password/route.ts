import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "node:crypto";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { readBoundedJson } from "@/lib/validation";
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

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail("VALIDATION", "Enter a valid email address", 400);
  }

  // The no-enumeration contract: the same 200 + message whether or not the
  // account exists. The reference's token is email-only (it never travels
  // in any response — fetch-measured); the clone carries the SELF-HOSTED
  // in-app delivery (the ADR-014 family, same as the OTP): the resetUrl
  // rides along for existing accounts so the demo flow works end-to-end.
  // Session 64 (S64-D — the twelfth audit's B-1): the production swap is
  // now a MECHANISM, not an intention — setting the suppression knob
  // keeps the link out of every response (an email service owns the
  // delivery); the no-enumeration 200 and its message are unchanged
  // either way, and the client's sent card degrades gracefully (it
  // renders the link only when the field is a string).
  //
  // Session 105 (S105-G / B-L5 — the S72-C equalizer family's missed
  // sibling, the DOCUMENTED-RESIDUAL posture): the BODY is
  // byte-identical across the known/unknown branches but the TIMING
  // is not — the known-email branch performs randomBytes + a SQLite
  // user.update (with fsync) before answering while the unknown-email
  // branch returns immediately. The timing residual is accepted: (a)
  // the delta
  // is fsync-scale (≤10ms on a local disk, under network jitter); (b) a
  // naive scrypt burn on the unknown branch (the login equalizer's
  // S72-C form) would INVERT the signal — scryptSync costs ~100ms and
  // dwarfs the write, making unknown emails measurably SLOWER instead;
  // (c) register's 409 openly enumerates by design, so this route is
  // not the enumeration boundary; (d) the route is rate-limited (10/IP/
  // 15min). The B84-I3 inert-residue family.
  //
  // The URL is RELATIVE on purpose (the e2e trace caught the absolute form
  // breaking the standalone deploy): Next's standalone server rebuilds
  // request.url from its BIND address, so `new URL(request.url).origin`
  // yielded http://0.0.0.0:3100 — a host Chrome refuses cookies on, which
  // killed the post-login session. A relative href resolves against the
  // page's own origin everywhere (dev, standalone, any prod host).
  const inAppResetEnabled = process.env.DIGMA_DISABLE_IN_APP_RESET !== "1";
  let resetUrl: string | null = null;
  const user = await db.user.findUnique({ where: { email } });
  if (user) {
    const token = randomBytes(32).toString("hex");
    // Session 102 (S102-B / B-L1): the P2025 guard joins the family in
    // this route's OWN doctrine-preserving form — a row vanishing
    // mid-request (the unreachable-via-API class; no user-delete
    // endpoint exists) is an unknown email by response time, so the
    // guard SWALLOWS to the no-enumeration 200 and the resetUrl stays
    // null (never deliver a link the store cannot honor — the token
    // never persisted).
    let stored = false;
    try {
      await db.user.update({
        where: { id: user.id },
        data: {
          resetToken: token,
          resetTokenExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        },
      });
      stored = true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        stored = false;
      } else {
        throw error;
      }
    }
    if (stored && inAppResetEnabled) {
      resetUrl = `/reset-password?token=${token}`;
    }
  }

  return ok({ message: NO_ENUMERATION_MESSAGE, resetUrl });
}
