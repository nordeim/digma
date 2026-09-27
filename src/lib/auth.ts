import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "./db";

// Hand-rolled cookie sessions (ADR-003 in the inherited architecture):
// scrypt password hashes + stateless HMAC-signed tokens. Auditable crypto
// using Node built-ins; tokens verify without a session store;
// timingSafeEqual on both password and signature comparisons.

const SESSION_COOKIE = "digma_session";
const SESSION_TTL_DAYS = 7;
const KEY_LENGTH = 64;

// Dev-only fallback when AUTH_SECRET is unset — loudly documented. Production
// MUST set AUTH_SECRET (openssl rand -hex 32); rotating it invalidates every
// session (documented in README troubleshooting).
function secret(): string {
  return process.env.AUTH_SECRET || "digma-dev-only-insecure-secret";
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createSessionToken(userId: string): string {
  const expiry = Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${userId}.${expiry}`;
  return `${payload}.${sign(payload)}`;
}

export function parseSessionToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, expiry, signature] = parts;
  const expected = sign(`${userId}.${expiry}`);
  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(expiry) < Date.now()) return null;
  return userId;
}

export async function setSessionCookie(userId: string, response: NextResponse): Promise<void> {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: createSessionToken(userId),
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
  const userId = parseSessionToken(store.get(SESSION_COOKIE)?.value);
  if (!userId) return null;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, avatarColor: true },
  });
  return user;
}
