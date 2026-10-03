import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";
import { clampText } from "@/lib/validation";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/teams/[id] — rename / re-describe a team. */
export async function PATCH(request: NextRequest, { params }: Params) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to update teams", 401);

  const { id } = await params;
  const existing = await db.team.findUnique({ where: { id } });
  if (!existing) return fail("NOT_FOUND", "Team not found", 404);

  const body = await request.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (body?.name !== undefined) {
    const name = clampText(body.name, 80);
    if (!name) return fail("VALIDATION", "Team name is required", 400);
    data.name = name;
  }
  if (body?.description !== undefined) {
    data.description = typeof body.description === "string" ? body.description.trim().slice(0, 300) || null : null;
  }

  // Session 62 (S62-G / B-L7): a concurrent DELETE racing this update
  // throws Prisma P2025 outside the envelope — answer 404 instead.
  try {
    const team = await db.team.update({
      where: { id },
      data,
      include: { members: { orderBy: { createdAt: "asc" } } },
    });
    return ok({ team });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return fail("NOT_FOUND", "Team not found", 404);
    }
    throw error;
  }
}

/** DELETE /api/teams/[id] — remove a team (members cascade). */
export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to delete teams", 401);

  const { id } = await params;
  const existing = await db.team.findUnique({ where: { id } });
  if (!existing) return fail("NOT_FOUND", "Team not found", 404);

  await db.team.delete({ where: { id } });
  return ok({ deleted: true });
}
