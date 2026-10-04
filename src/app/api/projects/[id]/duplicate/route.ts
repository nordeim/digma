import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";
import { THUMBNAIL_ELEMENT_SELECT } from "@/lib/editor";
import { PROJECT_LIMIT } from "@/lib/validation";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** POST /api/projects/[id]/duplicate — copy a project and its elements. */
export async function POST(_request: NextRequest, { params }: Params) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to duplicate projects", 401);

  const { id } = await params;
  const source = await db.project.findUnique({
    where: { id },
    include: { elements: { orderBy: { sortOrder: "asc" } } },
  });
  if (!source) return fail("NOT_FOUND", "Project not found", 404);

  // Session 67 (S67-B / L-1): the SAME project ceiling the create POST
  // carries — each duplicate also copies up to 2000 element rows per
  // call, so an unbounded duplicate loop multiplies row-bloat fast.
  const projectCount = await db.project.count();
  if (projectCount >= PROJECT_LIMIT) {
    return fail("VALIDATION", "Too many projects (max 500)", 400);
  }

  // Session 62 (S62-G / B-L5): the copy is ATOMIC and the name respects
  // the route family's own 120-char cap. The pre-fix form ran create +
  // createMany as two separate awaits (a failure between them left a
  // half-populated "(Copy)" project) and the name could reach 127 chars
  // from a 120-char source — a later rename PATCH would silently
  // truncate it while the create POST rejects at 120.
  const copy = await db.$transaction(async (tx) => {
    const created = await tx.project.create({
      data: {
        name: `${source.name} (Copy)`.slice(0, 120),
        description: source.description,
        template: source.template,
        backgroundColor: source.backgroundColor,
      },
    });
    if (source.elements.length > 0) {
      await tx.designElement.createMany({
        data: source.elements.map((el) => {
          const { id: _id, projectId: _projectId, createdAt: _c, updatedAt: _u, ...rest } = el;
          return { ...rest, projectId: created.id };
        }),
      });
    }
    return created;
  });

  const project = await db.project.findUnique({
    where: { id: copy.id },
    // Session 70 (S70-C): the duplicate RESPONSE ships the bounded
    // thumbnail projection (the copy's SOURCE read above keeps every
    // column — the copy itself is lossless).
    include: { elements: { orderBy: { sortOrder: "asc" }, select: THUMBNAIL_ELEMENT_SELECT } },
  });
  return ok({ project }, 201);
}
