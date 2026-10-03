import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";
import { clampColor, clampOptionalText, clampText } from "@/lib/validation";
import { memberColorFor, memberDisplayFor } from "@/lib/team";

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

  // Session 60 (S60-C — the eighth audit's B-L-1): the inline first-member
  // invitation validates the email with the SAME contract the members
  // route enforces. Pre-fix the raw truthy gate wrote
  // clampOptionalText(memberEmail) with NO format check, so "abc" in the
  // Create Team dialog silently created a garbage member while the same
  // input in the Invite Member dialog 400'd with "Enter a valid email
  // address" — the two invite paths must answer identically.
  const memberEmail = clampOptionalText(body?.memberEmail, 200);
  if (memberEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberEmail)) {
    return fail("VALIDATION", "Enter a valid email address", 400);
  }

  const team = await db.team.create({
    data: {
      name,
      description,
      color,
      ...(memberEmail
        ? {
            members: {
              create: {
                name: memberDisplayFor(memberEmail),
                email: memberEmail,
                role: clampOptionalText(body?.memberRole, 80),
                // Session 64 (S64-F — the twelfth audit's B-7): the
                // same derivation the invite-member route uses — the
                // two member-creation paths must agree on the color
                // seed (the same email, the same chip, whichever
                // dialog created it).
                avatarColor: memberColorFor(memberEmail),
              },
            },
          }
        : {}),
    },
    include: { members: { orderBy: { createdAt: "asc" } } },
  });

  return ok({ team }, 201);
}
