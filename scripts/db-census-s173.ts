// The per-session DB census — users/projects/elements/teams/members.
// Run: env -u DATABASE_URL bun scripts/db-census-s173.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const [u, pr, e, t, m] = await Promise.all([
  db.user.count(),
  db.project.count(),
  db.designElement.count(),
  db.team.count(),
  db.teamMember.count(),
]);
console.log(`CENSUS: ${u}/${pr}/${e}/${t}/${m}`);
await db.$disconnect();
