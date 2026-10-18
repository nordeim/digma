// DB count check — the pristine census form (users/projects/elements/teams/members)
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const [u, pr, e, t, m] = await Promise.all([
    p.user.count(),
    p.project.count(),
    p.designElement.count(),
    p.team.count(),
    p.teamMember.count(),
  ]);
  console.log(`users=${u} projects=${pr} elements=${e} teams=${t} members=${m}`);
  await p.$disconnect();
}
main().catch((err) => { console.error(err); process.exit(1); });
