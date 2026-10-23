import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()
const [u,p,d,t,m] = await Promise.all([
  db.user.count(), db.project.count(), db.designElement.count(),
  db.team.count(), db.teamMember.count()])
console.log(`User=${u} Project=${p} DesignElement=${d} Team=${t} TeamMember=${m}`)
await db.$disconnect()
