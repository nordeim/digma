// Session-59 baseline: verify the dev DB is at the pristine seed contract.
// Usage: cd /home/z/my-project/digma && unset DATABASE_URL && bun run scripts/check-db-contract.ts
import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl, candidateRoots } from "../src/lib/db-path";

const url = resolveDatabaseUrl(process.env.DATABASE_URL ?? "file:../db/custom.db", candidateRoots());
console.log("[db] URL ->", url);
const prisma = new PrismaClient({ datasources: { db: { url } } });

async function main() {
  const [users, projects, elements, teams, members] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.designElement.count(),
    prisma.team.count(),
    prisma.teamMember.count(),
  ]);
  console.log(
    `users=${users} projects=${projects} elements=${elements} teams=${teams} members=${members}`
  );
  // Session 73 (S73-D — B-F9): the FIFTH count joins the contract — the
  // documented pristine form is 1/2/6/1/3, and a member-row mutation in
  // the dev DB previously passed this gate unchallenged.
  const ok = users === 1 && projects === 2 && elements === 6 && teams === 1 && members === 3;
  console.log(ok ? "PRISTINE CONTRACT OK" : "CONTRACT MISMATCH — re-seed needed");
  process.exit(ok ? 0 : 1);
}

main().finally(() => prisma.$disconnect());
