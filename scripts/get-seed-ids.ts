// Session-59 capture prep: read the seeded project ids.
import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl, candidateRoots } from "../src/lib/db-path";

const url = resolveDatabaseUrl("file:../db/custom.db", candidateRoots());
console.log("[db] URL ->", url);
const prisma = new PrismaClient({ datasources: { db: { url } } });
const projects = await prisma.project.findMany({ select: { id: true, name: true } });
console.log(JSON.stringify(projects));
await prisma.$disconnect();
