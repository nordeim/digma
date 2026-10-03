import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const [u, p, e, t, m] = await Promise.all([
    prisma.user.count(), prisma.project.count(), prisma.designElement.count(),
    prisma.team.count(), prisma.teamMember.count()
  ]);
  console.log(`users=${u} projects=${p} elements=${e} teams=${t} members=${m}`);
  await prisma.$disconnect();
}
main();
