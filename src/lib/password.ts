// Session 70 (S70-D / L-A5 — the eighteenth audit): the PURE password/
// code crypto seam. These three functions previously lived in
// src/lib/auth.ts — whose transitive Next.js-server and DB imports made
// it un-importable from the bare-`PrismaClient` seed script, so
// prisma/seed.ts DUPLICATED the scrypt parameter set (16-byte salt,
// 64-byte key): a change in one place silently broke demo login in the
// other. This module is node:crypto ONLY — both consumers import it, and
// auth.ts re-exports for the routes' existing import surface.
import { randomBytes, randomInt, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

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

// Session 62 (S62-G / B-L1): the single crypto-random verify-code
// generator. The pre-fix form was Math.random() triplicated across the
// register/login/resend-otp routes while its own comment claimed
// "crypto-random" — a doc-integrity defect on the OTP (the only
// email-ownership proof). randomInt is the CSPRNG-backed, modulo-bias-
// free form; the range [100000, 1000000) preserves the six-digit
// leading-zero-free shape the reference's verify-email card consumes
// (session 43, RA-58).
export function generateVerifyCode(): string {
  return String(randomInt(100000, 1000000));
}

// Session 72 (S72-C / L-B2): the login route's timing equalizer. The
// pre-fix `!user || !verifyPassword(...)` short-circuit skipped the
// scrypt work for unknown emails — response latency distinguished
// registered emails even after S71-C closed the status-code oracle.
// The fix burns the SAME scrypt work on the miss branch against a
// precomputed hash of a throwaway constant (the constant-work envelope;
// the 401 envelope family stays byte-identical). LAZY: computed once on
// the first miss, never a cold-start scrypt on every module import —
// the login route is the only consumer.
let equalizerHash: string | null = null;

export function timingEqualizerHash(): string {
  if (equalizerHash === null) {
    equalizerHash = hashPassword("digma-timing-equalizer-constant");
  }
  return equalizerHash;
}
