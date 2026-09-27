import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";
import { clampColor, clampOptionalText, clampText } from "@/lib/validation";
import { memberDisplayFor } from "@/lib/team";

export const dynamic = "force-dynamic";

/** GET /api/teams — teams with member counts and member lists. */
export async function GET(_request: NextRequest) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to view teams", 401);

  const teams = await db.team.findMany({
    orderBy: { createdAt: "asc" },
    include: { members: { orderBy: { createdAt: "asc" } } },
  });
  return ok({ teams });
}

/** POST /api/teams — create a team (optionally with the first member). */
export async function POST(request: NextRequest) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to create teams", 401);

  const body = await request.json().catch(() => null);
  const name = clampText(body?.name, 80);
  if (!name) return fail("VALIDATION", "Team name is required", 400);

  const description = clampOptionalText(body?.description, 300);
  const color = clampColor(String(body?.color ?? "#8B5CF6"), "#8B5CF6");

  const team = await db.team.create({
    data: {
      name,
      description,
      color,
      ...(body?.memberEmail
        ? {
            members: {
              create: {
                name: memberDisplayFor(String(body.memberEmail)),
                email: clampOptionalText(body.memberEmail, 200),
                role: clampOptionalText(body?.memberRole, 80),
                avatarColor: "#3B82F6",
              },
            },
          }
        : {}),
    },
    include: { members: { orderBy: { createdAt: "asc" } } },
  });

  return ok({ team }, 201);
}
