import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { bodySizeRejected } from "@/lib/validation";
import { authRateLimit, clientIpOf } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** The wrong-code ceiling (session 43, RA-58; session 45, RA-62): the
 * reference's error reads "Invalid verification code. N attempts remaining."
 * with the counter DECREMENTING per wrong code (live-measured 4 → 3 — five
 * total). At the ceiling the reference answers 429 "Too many failed
 * attempts. Please request a new verification code." — and the pending code
 * is DEAD: only a Resend (or the login's unverified-recovery branch, both
 * of which regenerate the code and reset the counter) reopens the path. */
const MAX_VERIFY_ATTEMPTS = 5;
const EXHAUSTED_MESSAGE = "Too many failed attempts. Please request a new verification code.";

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
  if (bodySizeRejected(request.headers.get("content-length"))) {
    return fail("VALIDATION", "Request body too large (max 32 MB)", 400);
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const code = typeof body?.code === "string" ? body.code.trim() : "";

  // Session 66 (S66-C — the fourteenth audit's B-4): the S62-G caps family
  // reaches the sibling public routes (no default body-size cap in App
  // Router handlers — unbounded strings reached the SQLite lookups).
  if (email.length > 200 || code.length > 32) {
    return fail("VALIDATION", "Email and code must be reasonably sized", 400);
  }
  if (!email || !/^\d{6}$/.test(code)) {
    return fail("VALIDATION", "Enter the 6-digit code from your email", 400);
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user || user.verified || !user.verifyCode) {
    // Already-verified accounts and unknown emails answer identically (no
    // account enumeration through this route).
    return fail("VALIDATION", "Enter the 6-digit code from your email", 400);
  }

  // Session 45, RA-62: the exhaustion LOCK — once the ceiling is hit, even
  // the CORRECT code is rejected (the reference's measured message demands a
  // new code and its measured recovery is the Resend, which resets the
  // counter; the exhausted-then-correct path on the reference itself is
  // unmeasurable — the code is email-only — so the lock is the coherent
  // reading of the measured contract, the same superset convention as
  // ADR-014's delivery deviation).
  // Session 70 (S70-D / L-A4): this PRE-READ check is the display
  // fast-path only — the ENFORCEMENT is atomic, in the where-clauses of
  // the two updateMany calls below (the success path's bound is the fix:
  // a request that read 4 could previously sail past this check while a
  // concurrent request tripped 5, then open a session past the ceiling
  // through the non-conditional update).
  if (user.verifyAttempts >= MAX_VERIFY_ATTEMPTS) {
    return fail("VERIFY_LOCKED", EXHAUSTED_MESSAGE, 429);
  }

  // Session 70 (S70-D / L-A4): the ATOMIC SUCCESS — the conditional
  // updateMany carries BOTH the code match AND the attempts bound, so
  // the stale-read race is closed at the database (the S62-E increment's
  // sibling fix the success path never received). count === 1 opens the
  // session; count === 0 means the code is wrong OR concurrently stale
  // (a Resend regenerated it) OR the ceiling tripped mid-flight — the
  // wrong-code family below answers every one of those.
  const verifiedResult = await db.user.updateMany({
    where: { id: user.id, verifyCode: code, verifyAttempts: { lt: MAX_VERIFY_ATTEMPTS } },
    data: { verified: true, verifyCode: null, verifyAttempts: 0 },
  });
  if (verifiedResult.count === 1) {
    // Verified: clear the pending code and open the session (the register
    // route never sets the cookie — this is the flow's session landing).
    // Session 67 (S67-A): the select carries tokenVersion so the mint
    // embeds the holder's live version (a later reset evicts this
    // cookie).
    const verified = await db.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, avatarColor: true, tokenVersion: true },
    });
    if (!verified) {
      return fail("VALIDATION", "Enter the 6-digit code from your email", 400);
    }
    // The version rides the cookie, not the response body (shape
    // unchanged).
    const { tokenVersion: mintVersion, ...verifiedUser } = verified;
    const response = ok({ user: verifiedUser });
    await setSessionCookie(verified.id, mintVersion, response);
    return response;
  }

  if (verifiedResult.count === 0) {
    // Session 62 (S62-E / B-M2): the counter is a conditional
    // updateMany — the pre-fix read-modify-write (the findUnique read
    // above, then this update) UNDERCOUNTED under concurrency: N
    // simultaneous wrong codes all read the same verifyAttempts and
    // wrote the same increment, so the 5-attempt ceiling let a
    // concurrent guess loop through. The conditional increment is
    // atomic at the database; count === 0 means the ceiling was
    // already reached (the exhausted 429).
    //
    // Session 73 (S73-H — B-F6): the half-dead first disjunct died —
    // reaching this line implies the atomic update matched ZERO rows
    // (the count === 1 path returned above), so the old
    // `user.verifyCode !== code ||` guard was always true here and
    // TypeScript could not prove the function exhaustive. The live
    // condition stands alone.
    const result = await db.user.updateMany({
      where: { id: user.id, verifyAttempts: { lt: MAX_VERIFY_ATTEMPTS } },
      data: { verifyAttempts: { increment: 1 } },
    });
    if (result.count === 0) {
      return fail("VERIFY_LOCKED", EXHAUSTED_MESSAGE, 429);
    }
    // Session 70 (S70-D): the display derives from the POST-INCREMENT
    // read — the pre-fix `user.verifyAttempts + 1` reused the stale
    // findUnique value, so a concurrent attempt made the "N attempts
    // remaining" message lie.
    const fresh = await db.user.findUnique({
      where: { id: user.id },
      select: { verifyAttempts: true },
    });
    const attempts = fresh?.verifyAttempts ?? MAX_VERIFY_ATTEMPTS;
    if (attempts >= MAX_VERIFY_ATTEMPTS) {
      // The fifth wrong code trips the ceiling (session 45, RA-62: the
      // reference answers 429 here, not 400).
      return fail("VERIFY_LOCKED", EXHAUSTED_MESSAGE, 429);
    }
    // The reference's measured decrementing counter: 5 wrong codes max, so
    // the first wrong attempt reads "4 attempts remaining."
    return fail("VALIDATION", `Invalid verification code. ${MAX_VERIFY_ATTEMPTS - attempts} attempts remaining.`, 400);
  }

  // Session 74 (S74-H — B74-F6): the terminal return. A unique-id
  // updateMany answers exactly 0 or 1, and both counts returned above —
  // but noImplicitReturns is off, so nothing but a source pin holds the
  // function's totality. The impossible-count fall-through previously
  // returned undefined (an empty 200). The vanished-user race family's
  // own form answers here: the user row the handler read at the top can
  // only be gone through an out-of-band DB mutation mid-request (no
  // user-delete endpoint exists), and the family's every sibling
  // answers 404 through the envelope.
  return fail("NOT_FOUND", "User not found", 404);
}
