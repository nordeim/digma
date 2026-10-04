import { createHmac, timingSafeEqual } from "node:crypto";
// Session 70 (S70-D / L-A5): the pure crypto trio lives in
// src/lib/password.ts (the node:crypto-only seam the seed script can
// import); this module re-exports it so the routes' existing import
// surface (import { hashPassword } from "@/lib/auth") survives
// byte-identically.
import { generateVerifyCode, hashPassword, verifyPassword } from "@/lib/password";
export { generateVerifyCode, hashPassword, verifyPassword };
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "./db";

// Hand-rolled cookie sessions (ADR-003 in the inherited architecture):
// scrypt password hashes + stateless HMAC-signed tokens. Auditable crypto
// using Node built-ins; tokens verify without a session store;
// timingSafeEqual on both password and signature comparisons.

const SESSION_COOKIE = "digma_session";
const SESSION_TTL_DAYS = 7;

// Dev-only fallback when AUTH_SECRET is unset — loudly documented. Production
// MUST set AUTH_SECRET (openssl rand -hex 32); rotating it invalidates every
// session (documented in README troubleshooting).
// Session 66 (S66-C — the fourteenth audit's B-8): the fallback now WARNS,
// once per process — a production deploy that forgot the variable used to
// mint forgeable tokens in complete silence (the only prior signal was this
// comment). The once-guard keeps the per-token-mint seam from spamming the
// log; the message names the fix.
let warnedInsecureSecret = false;
function secret(): string {
  const from = process.env.AUTH_SECRET;
  if (!from && !warnedInsecureSecret) {
    warnedInsecureSecret = true;
    console.warn(
      "[auth] AUTH_SECRET is not set — falling back to the INSECURE dev-only constant. " +
        "Session tokens are forgeable by anyone who reads the repo. " +
        "Generate a real secret: openssl rand -hex 32",
    );
  }
  return from || "digma-dev-only-insecure-secret";
}


function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createSessionToken(userId: string, tokenVersion: number): string {
  const expiry = Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000;
  // Session 67 (S67-A / M-1): the version rides the payload (and therefore
  // the signature) — `userId.version.expiry`. The bare `userId.expiry`
  // form had no revocation dimension: a password reset left every
  // previously minted cookie valid for its full TTL.
  const payload = `${userId}.${tokenVersion}.${expiry}`;
  return `${payload}.${sign(payload)}`;
}

export type ParsedSession = { userId: string; tokenVersion: number };

export function parseSessionToken(token: string | undefined | null): ParsedSession | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [userId, version, expiry, signature] = parts;
  const tokenVersion = Number(version);
  if (!Number.isInteger(tokenVersion) || tokenVersion < 0) return null;
  const expected = sign(`${userId}.${tokenVersion}.${expiry}`);
  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(expiry) < Date.now()) return null;
  return { userId, tokenVersion };
}

export async function setSessionCookie(
  userId: string,
  tokenVersion: number,
  response: NextResponse,
): Promise<void> {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: createSessionToken(userId, tokenVersion),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie(response: NextResponse): Promise<void> {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  avatarColor: string;
};

/** Resolves the current user from the session cookie (null when signed out). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const session = parseSessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, avatarColor: true, tokenVersion: true },
  });
  // Session 67 (S67-A / M-1): the database-seam version check — a token
  // minted before a password reset still parses and still carries a valid
  // signature, but its embedded version no longer matches the holder's
  // live row. This is the eviction the stateless format needed: the reset
  // increments tokenVersion and every pre-reset cookie dies with it.
  if (!user || user.tokenVersion !== session.tokenVersion) return null;
  const { tokenVersion: _revoked, ...sessionUser } = user;
  return sessionUser;
}
