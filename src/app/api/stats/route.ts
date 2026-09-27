import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";

export const dynamic = "force-dynamic";

/** GET /api/stats — the dashboard's Quick Stats card. */
export async function GET(_request: NextRequest) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to view stats", 401);

  const [projects, teams] = await Promise.all([db.project.count(), db.team.count()]);

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activeThisWeek = await db.project.count({
    where: { updatedAt: { gte: weekAgo } },
  });

  return ok({
    projects,
    teams,
    activeThisWeek,
    plan: "Pro",
  });
}
