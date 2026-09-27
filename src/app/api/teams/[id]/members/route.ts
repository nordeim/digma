import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";
import { clampOptionalText } from "@/lib/validation";
import { memberColorFor, memberDisplayFor } from "@/lib/team";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** POST /api/teams/[id]/members — invite a member by email + role. */
export async function POST(request: NextRequest, { params }: Params) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to invite members", 401);

  const { id } = await params;
  const team = await db.team.findUnique({ where: { id } });
  if (!team) return fail("NOT_FOUND", "Team not found", 404);

  const body = await request.json().catch(() => null);
  const email = clampOptionalText(body?.email, 200);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail("VALIDATION", "Enter a valid email address", 400);
  }

  const member = await db.teamMember.create({
    data: {
      teamId: id,
      name: clampOptionalText(body?.name, 80) ?? memberDisplayFor(email),
      email,
      role: clampOptionalText(body?.role, 80),
      avatarColor: memberColorFor(email),
    },
  });

  return ok({ member }, 201);
}
