import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";
import { readBoundedJson, clampText } from "@/lib/validation";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/teams/[id] — rename / re-describe a team. */
export async function PATCH(request: NextRequest, { params }: Params) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to update teams", 401);

  const { id } = await params;
  const existing = await db.team.findUnique({ where: { id } });
  if (!existing) return fail("NOT_FOUND", "Team not found", 404);

  // Session 68 (S68-A — the sixteenth audit's M-A): the S67-B parse
  // guard reaches every request.json() site — App Router handlers
  // ship no default body-size cap, so the per-field caps only bound
  // what SURVIVES the parse; this bounds the parse itself.
  const parsed = await readBoundedJson(request);
  if (parsed.tooLarge) {
    return fail("VALIDATION", "Request body too large (max 32 MB)", 400);
  }
  const body = parsed.value ?? {};
  const data: Record<string, unknown> = {};
  if (body?.name !== undefined) {
    const name = clampText(body.name, 80);
    if (!name) return fail("VALIDATION", "Team name is required", 400);
    data.name = name;
  }
  if (body?.description !== undefined) {
    // Session 72 (S72-D / L-B4): the fold's ninth site — the inline
    // trim-and-slice twin died; the shared clampText seam carries the
    // identical null/trim/slice semantics (the S71-D fold missed this
    // one — exactly the twin-hazard the fold's rationale names).
    data.description = clampText(body.description, 300);
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

  // Session 69 (S69-C / L-B): a concurrent DELETE racing this one makes
  // the loser throw P2025 past the envelope — answer 404 instead (the
  // sibling PATCH's S62-G form; the resource is gone either way).
  try {
    await db.team.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return fail("NOT_FOUND", "Team not found", 404);
    }
    throw error;
  }
  return ok({ deleted: true });
}
