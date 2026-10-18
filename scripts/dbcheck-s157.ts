// dbcheck-s157.ts — the S157 DB census helper (the dbcheck-s156.ts pattern, ESM imports per the lint lesson)
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const users = await db.user.count();
  const projects = await db.project.count();
  const elements = await db.designElement.count();
  const teams = await db.team.count();
  const members = await db.teamMember.count();
  console.log(`users=${users} projects=${projects} elements=${elements} teams=${teams} members=${members}`);
  await db.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
