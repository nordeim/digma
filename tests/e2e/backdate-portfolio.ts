import { PrismaClient } from "@prisma/client";

/**
 * E2E-only seed amendment (session 35, S35-1): backdate the "Portfolio
 * Website Redesign" seed project's lastOpenedAt to now − 11 days.
 *
 * The reference's Quick Stats "Active this week" formula — decoded from its
 * shipped client bundle (RA-37) — counts projects whose
 * `last_accessed || created_date` falls within the last 7 days (ACCESS-based,
 * NOT edit-based). The seed's two fixed dates (Sep 26 / Sep 25) both sit
 * inside the window on fresh re-seeds, so the seeded data can never
 * discriminate the formula (the F26 lesson generalized: a formula pinned on
 * data that never exercises its boundary is unpinned).
 *
 * This step produces EXACTLY the discriminating state: Prisma's `@updatedAt`
 * bumps `updatedAt` to now on this write, so the project is
 * recently-UPDATED but long-UNOPENED — active under the clone's pre-fix
 * edit-based count, inactive under the reference's access-based contract.
 * The parity spec derives its expected tally from /api/projects, so the pin
 * is order-independent against later specs' created projects.
 *
 * Dev-seed untouched: this runs only against db/e2e.db (DATABASE_URL is set
 * by the global setup's env).
 */
const db = new PrismaClient();

async function main(): Promise<void> {
  const elevenDaysAgo = new Date(Date.now() - 11 * 24 * 60 * 60 * 1000);
  const result = await db.project.updateMany({
    where: { name: "Portfolio Website Redesign" },
    data: { lastOpenedAt: elevenDaysAgo },
  });
  if (result.count === 0) {
    throw new Error('backdate-portfolio: seed project "Portfolio Website Redesign" not found');
  }
  console.log(`[e2e-seed] backdated ${result.count} project's lastOpenedAt to ${elevenDaysAgo.toISOString()}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
