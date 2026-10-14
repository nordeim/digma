// Seed: mirrors the reference Digma workspace.
// Idempotent: clears domain tables, then inserts the canonical demo data.
// Run: bunx tsx prisma/seed.ts  (or: bun prisma/seed.ts)

import { PrismaClient } from "@prisma/client";
// Session 70 (S70-D / L-A5): the seed imports the PURE password seam —
// the pre-fix duplicate of the scrypt parameter set (16-byte salt, 64-byte
// key) drifted silently against src/lib/auth.ts. The seam is node:crypto
// only, so this bare-PrismaClient script imports it safely.
import { hashPassword } from "../src/lib/password";
// Session 118 (S118-D2 / A118-I2 — the sixty-sixth audit's second
// Informational): the seed imports the pure rowStoredBytes seam for
// its census-true counter below (the same ONE-seam doctrine —
// editor.ts is import-free beyond the shared validation helpers, and
// bun resolves the tsconfig paths this script's hashPassword import
// already rides).
import { rowStoredBytes } from "../src/lib/editor";

const db = new PrismaClient();

// Calendar-independent demo dates (S90-B / B90-I1): every seeded date is
// RELATIVE to the seed moment, so the stats route's 7-day "Active this
// week" window and the backdate discriminator keep their designed shape
// on any future re-seed, any calendar (the pre-S90-B fixed 2026-09
// literals aged out of the window silently — the time-bomb form).
const daysAgo = (days: number): Date =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000);

async function main() {
  // Session 128 (S128-E / B128-I1 — the seventy-sixth audit's
  // Informational): the wipe+insert rides ONE interactive transaction
  // (the S62-G doctrine's last writer — a mid-run failure between the
  // sequential awaits used to leave a half-seeded DB: wiped tables
  // with partial re-inserts, healed only by re-running; every other
  // multi-write surface closed this shape, the normalize-member-emails
  // script the direct form). The 30s timeout mirrors that script's
  // headroom over Prisma's 5s default.
  // Session 129 (S129-C / B129-I1 — the seventy-seventh audit's first
  // server-side Informational): the scrypt hash is computed BEFORE the
  // transaction opens — register's own S83-D form (sync CPU work inside
  // the SQLite writer window lengthens both the held transaction and
  // the event-loop block mid-transaction; the hash has no transaction
  // dependency).
  const demoPasswordHash = hashPassword("Digma1234!");
  const demoUserId = await db.$transaction(
    async (tx) => {
      // Idempotency: wipe domain data, keep schema.
      await tx.designElement.deleteMany();
      await tx.project.deleteMany();
      await tx.teamMember.deleteMany();
      await tx.team.deleteMany();
      await tx.user.deleteMany();

      const demoUser = await tx.user.create({
        data: {
          email: "demo@digma.app",
          name: "Designer",
          passwordHash: demoPasswordHash,
          avatarColor: "#3B82F6",
        },
      });

      // ---- Project 1: a starter canvas with a few shapes (Blank Canvas) ----
      const p1elements: Array<{
        type: string;
        name?: string;
        x: number;
        y: number;
        width: number;
        height: number;
        fill?: string;
        fillGradient?: string;
        fillImage?: string;
        stroke?: string;
        strokeWidth?: number;
        radius?: number;
        text?: string;
        fontSize?: number;
        fontWeight?: string;
        textAlign?: string;
        sortOrder: number;
      }> = [
        // The frame carries the reference's container contract (session 31,
        // RA-13): a TRANSPARENT labeled container — 1px #555555 border via the
        // stroke fields, radius 0 (the pre-fix seed was a solid #161B22 panel).
        { type: "frame", name: "Hero Section", x: 120, y: 80, width: 560, height: 320, stroke: "#555555", strokeWidth: 1, radius: 0, sortOrder: 0 },
        { type: "rectangle", name: "Accent Bar", x: 120, y: 80, width: 560, height: 8, fill: "#8B5CF6", radius: 4, sortOrder: 1 },
        { type: "ellipse", name: "Glow", x: 480, y: 140, width: 160, height: 160, fill: "#8B5CF6", sortOrder: 2 },
        { type: "text", name: "Headline", x: 160, y: 160, width: 320, height: 48, text: "Design faster,\ntogether.", fontSize: 32, fontWeight: "700", textAlign: "left", sortOrder: 3 },
        { type: "rectangle", name: "CTA Button", x: 160, y: 300, width: 160, height: 44, fill: "#3B82F6", radius: 8, sortOrder: 4 },
        { type: "text", name: "CTA Label", x: 196, y: 312, width: 90, height: 20, text: "Get started", fontSize: 14, fontWeight: "600", textAlign: "left", sortOrder: 5 },
      ];

      const p1 = await tx.project.create({
        data: {
          name: "Marketing Hero Banner",
          description: "Landing page hero concept for the Q3 campaign.",
          template: "blank",
          backgroundColor: "#0D1117",
          // Session 118 (S118-D2 / A118-I2): the CENSUS-TRUE counter. The
          // seed writes its rows directly (no bound site ever runs against
          // a fresh database), and post-S117-A the counted payload
          // includes the seeded names/text — the same rowStoredBytes
          // seam the duplicate route rides. Pre-fix the column default
          // left the counter at 0 while the board carried counted bytes;
          // the fresh-database contract is the counter equaling its
          // board's counted sum from the first read. (The elements array
          // now precedes the create — the counter consumes it.)
          fillImageBytes: p1elements.reduce((sum, el) => sum + rowStoredBytes(el), 0),
          lastOpenedAt: daysAgo(2),
          createdAt: daysAgo(8),
        },
      });

      for (const el of p1elements) {
        await tx.designElement.create({
          data: {
            projectId: p1.id,
            type: el.type,
            name: el.name ?? null,
            x: el.x,
            y: el.y,
            width: el.width,
            height: el.height,
            fill: el.fill ?? null,
            fillGradient: el.fillGradient ?? null,
            fillImage: el.fillImage ?? null,
            stroke: el.stroke ?? null,
            strokeWidth: el.strokeWidth ?? 0,
            radius: el.radius ?? 0,
            text: el.text ?? null,
            fontSize: el.fontSize ?? null,
            fontWeight: el.fontWeight ?? null,
            textAlign: el.textAlign ?? null,
            opacity: 1,
            visible: true,
            sortOrder: el.sortOrder,
          },
        });
      }

      // ---- Project 2: empty Website template (fresh workspace feel) ----
      await tx.project.create({
        data: {
          name: "Portfolio Website Redesign",
          description: "Personal site refresh — dark theme, big type.",
          template: "website",
          backgroundColor: "#F9FAFB",
          lastOpenedAt: daysAgo(3),
          createdAt: daysAgo(6),
        },
      });

      // ---- Teams: the reference app starts empty; seed one team + members so
      // the Teams page has content in the demo workspace. ----
      const team = await tx.team.create({
        data: {
          name: "Design Team",
          description: "Core product design crew.",
          color: "#8B5CF6",
        },
      });

      const members: Array<{ name: string; email: string; role: string; avatarColor: string }> = [
        { name: "Alex Design", email: "alex@digma.app", role: "Lead Designer", avatarColor: "#3B82F6" },
        { name: "Sarah UI", email: "sarah@digma.app", role: "UX Designer", avatarColor: "#10B981" },
        { name: "Dev Team", email: "dev@digma.app", role: "Engineering", avatarColor: "#F59E0B" },
      ];

      for (const m of members) {
        await tx.teamMember.create({
          data: { teamId: team.id, name: m.name, email: m.email, role: m.role, avatarColor: m.avatarColor },
        });
      }

      return demoUser.id;
    },
    { timeout: 30_000 },
  );

  // The post-commit census (the transactional reads outside the wrap —
  // the committed state, not the in-flight one).
  const counts = {
    users: await db.user.count(),
    projects: await db.project.count(),
    elements: await db.designElement.count(),
    teams: await db.team.count(),
    members: await db.teamMember.count(),
  };
  console.log("Seeded:", counts, "demo user id:", demoUserId);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
