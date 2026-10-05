// Session-79 plan validation: count seeded elements per project.
import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl, candidateRoots } from "../src/lib/db-path";

const url = resolveDatabaseUrl("file:../db/custom.db", candidateRoots());
const db = new PrismaClient({ datasources: { db: { url } } });
const rs = await db.project.findMany({ select: { name: true, _count: { select: { elements: true } } } });
rs.forEach((r) => console.log(r.name, "->", r._count.elements));
await db.$disconnect();
