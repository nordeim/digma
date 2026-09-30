import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";

export const dynamic = "force-dynamic";

/** GET /api/stats — the dashboard's Quick Stats card. */
export async function GET(_request: NextRequest) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to view stats", 401);

  const [projects, teams] = await Promise.all([db.project.count(), db.team.count()]);

  // "Active this week" is ACCESS-based — the reference's contract, decoded
  // verbatim from its shipped client bundle (session 35, RA-37):
  //   project.last_accessed || project.created_date > now − 7d
  // The clone's lastOpenedAt is its last_accessed analog (touched by the
  // open flow) and is always set (@default(now())), so the created fallback
  // is structurally satisfied. The pre-fix EDIT-based count (updatedAt)
  // diverged whenever access and edit recency diverged: a project edited
  // 8+ days ago but opened today counts on the reference and not on the
  // edit-based count — and the inverse.
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activeThisWeek = await db.project.count({
    where: { lastOpenedAt: { gte: weekAgo } },
  });

  return ok({
    projects,
    teams,
    activeThisWeek,
    plan: "Pro",
  });
}
