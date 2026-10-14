// Session 128 utility: the pristine-contract DB census (1/2/6/1/3 expected).
// Run: env -u DATABASE_URL bun run scripts/dbcheck.ts
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const [u, p, e, t, m] = await Promise.all([
  db.user.count(),
  db.project.count(),
  db.designElement.count(),
  db.team.count(),
  db.teamMember.count(),
]);
console.log(`users=${u} projects=${p} elements=${e} teams=${t} members=${m}`);
await db.$disconnect();
