// Session-203 opening census probe (the standing pristine check: 1/2/6/1/3)
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const u = await db.user.count();
const p = await db.project.count();
const e = await db.designElement.count();
const t = await db.team.count();
const m = await db.teamMember.count();
console.log(`CENSUS: users=${u} projects=${p} elements=${e} teams=${t} members=${m}`);
const expect = { u: 1, p: 2, e: 6, t: 1, m: 3 };
if (u === expect.u && p === expect.p && e === expect.e && t === expect.t && m === expect.m) {
  console.log("PRISTINE 1/2/6/1/3 ✓");
} else {
  console.log("DRIFT — expected 1/2/6/1/3");
  process.exit(1);
}
await db.$disconnect();
