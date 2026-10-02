// Session-59 baseline: verify the dev DB is at the pristine seed contract.
// Usage: cd /home/z/my-project/digma && unset DATABASE_URL && bun run scripts/check-db-contract.ts
import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl, candidateRoots } from "../src/lib/db-path";

const url = resolveDatabaseUrl(process.env.DATABASE_URL ?? "file:../db/custom.db", candidateRoots());
console.log("[db] URL ->", url);
const prisma = new PrismaClient({ datasources: { db: { url } } });

async function main() {
  const [users, projects, elements, teams] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.designElement.count(),
    prisma.team.count(),
  ]);
  console.log(`users=${users} projects=${projects} elements=${elements} teams=${teams}`);
  const ok = users === 1 && projects === 2 && elements === 6 && teams === 1;
  console.log(ok ? "PRISTINE CONTRACT OK" : "CONTRACT MISMATCH — re-seed needed");
  process.exit(ok ? 0 : 1);
}

main().finally(() => prisma.$disconnect());
