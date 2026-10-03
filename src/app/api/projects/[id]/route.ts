import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";
import { bodySizeRejected, clampColor, clampText } from "@/lib/validation";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** GET /api/projects/[id] — project with its elements (sorted). */
export async function GET(_request: NextRequest, { params }: Params) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to view projects", 401);

  const { id } = await params;
  const project = await db.project.findUnique({
    where: { id },
    include: { elements: { orderBy: { sortOrder: "asc" } } },
  });
  if (!project) return fail("NOT_FOUND", "Project not found", 404);
  return ok({ project });
}

/** PATCH /api/projects/[id] — rename / re-describe / re-color / touch. */
export async function PATCH(request: NextRequest, { params }: Params) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to update projects", 401);

  const { id } = await params;
  const existing = await db.project.findUnique({ where: { id } });
  if (!existing) return fail("NOT_FOUND", "Project not found", 404);

  // Session 68 (S68-A — the sixteenth audit's M-A): the S67-B parse
  // guard reaches every request.json() site — App Router handlers
  // ship no default body-size cap, so the per-field caps only bound
  // what SURVIVES the parse; this bounds the parse itself.
  if (bodySizeRejected(request.headers.get("content-length"))) {
    return fail("VALIDATION", "Request body too large (max 32 MB)", 400);
  }

  const body = await request.json().catch(() => ({}));
  const data: Record<string, unknown> = {};

  if (body?.name !== undefined) {
    const name = clampText(body.name, 120);
    if (!name) return fail("VALIDATION", "Project name is required", 400);
    data.name = name;
  }
  if (body?.description !== undefined) {
    data.description = clampText(body.description, 500);
  }
  if (body?.backgroundColor !== undefined) {
    data.backgroundColor = clampColor(String(body.backgroundColor), existing.backgroundColor);
  }
  if (body?.lastOpened !== undefined) {
    data.lastOpenedAt = new Date();
  }

  // Session 62 (S62-G / B-L7): a concurrent DELETE racing this update
  // throws Prisma P2025 outside the envelope — answer 404 instead.
  try {
    const project = await db.project.update({
      where: { id },
      data,
      include: { elements: { orderBy: { sortOrder: "asc" } } },
    });
    return ok({ project });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return fail("NOT_FOUND", "Project not found", 404);
    }
    throw error;
  }
}

/** DELETE /api/projects/[id] — remove the project (elements cascade). */
export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to delete projects", 401);

  const { id } = await params;
  const existing = await db.project.findUnique({ where: { id } });
  if (!existing) return fail("NOT_FOUND", "Project not found", 404);

  // Session 69 (S69-C / L-B): a concurrent DELETE racing this one makes
  // the loser throw P2025 past the envelope — answer 404 instead (the
  // sibling PATCH's S62-G form; the resource is gone either way).
  try {
    await db.project.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return fail("NOT_FOUND", "Project not found", 404);
    }
    throw error;
  }
  return ok({ deleted: true });
}
