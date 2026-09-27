import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";

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

  const copy = await db.project.create({
    data: {
      name: `${source.name} (Copy)`,
      description: source.description,
      template: source.template,
      backgroundColor: source.backgroundColor,
    },
  });

  if (source.elements.length > 0) {
    await db.designElement.createMany({
      data: source.elements.map((el) => {
        const { id: _id, projectId: _projectId, createdAt: _c, updatedAt: _u, ...rest } = el;
        return { ...rest, projectId: copy.id };
      }),
    });
  }

  const project = await db.project.findUnique({
    where: { id: copy.id },
    include: { elements: { orderBy: { sortOrder: "asc" } } },
  });
  return ok({ project }, 201);
}
