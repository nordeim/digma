import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl, candidateRoots, redactDatabaseUrl } from "./db-path";

// Normalize the SQLite URL BEFORE the first client is constructed (Pattern B
// in the architecture doc). Session 74 (S74-D — B74-F1): the mechanism
// corrected to match db-path.ts — the Prisma CLI AND the Prisma 6 runtime
// both anchor relative file: URLs against the schema directory (the CLI
// against prisma/schema.prisma; the runtime against the schema directory
// the client was GENERATED against, NOT the process CWD — session 73's
// live probes). The standalone trap is the TRACED SCHEMA COPY into
// .next/standalone/prisma/, which relocates the engine's anchor; the
// chdir was causally irrelevant. One rule, applied here.
const rawEnv = process.env.DATABASE_URL;
const roots = candidateRoots();
const resolvedUrl = resolveDatabaseUrl(rawEnv, roots);
process.env.DATABASE_URL = resolvedUrl;
// One startup log line — the README's #1 troubleshooting entry is the SQLite
// path (error 14), so make the resolved URL visible in every mode. Session
// 64 (S64-F): the line routes through the redaction seam — a credentialed
// (non-SQLite) connection string must never print its secret to stdout.
console.log(`[db] DATABASE_URL -> ${redactDatabaseUrl(resolvedUrl)} (anchors: ${roots.join(",")})`);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
