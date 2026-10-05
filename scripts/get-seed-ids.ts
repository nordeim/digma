// Session-59 capture prep: read the seeded project ids.
import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl, candidateRoots, redactDatabaseUrl } from "../src/lib/db-path";

const url = resolveDatabaseUrl("file:../db/custom.db", candidateRoots());
// Session 79 (S79-C / B-I2): the print routes through redactDatabaseUrl —
// the third sibling of the redaction family (db.ts:21 and
// check-db-contract.ts:53 both do; the raw print bypassed the seam).
console.log("[db] URL ->", redactDatabaseUrl(url));
const prisma = new PrismaClient({ datasources: { db: { url } } });
const projects = await prisma.project.findMany({ select: { id: true, name: true } });
console.log(JSON.stringify(projects));
await prisma.$disconnect();
