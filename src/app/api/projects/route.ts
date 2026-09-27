import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";
import { clampColor, clampTemplate } from "@/lib/validation";

export const dynamic = "force-dynamic";

/** GET /api/projects — list projects (search + template filter). */
export async function GET(request: NextRequest) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to view projects", 401);

  const search = request.nextUrl.searchParams.get("search")?.trim() ?? "";
  const template = request.nextUrl.searchParams.get("template")?.trim() ?? "";

  const projects = await db.project.findMany({
    where: {
      ...(search ? { name: { contains: search } } : {}),
      ...(template ? { template } : {}),
    },
    orderBy: [{ lastOpenedAt: "desc" }],
    include: { elements: { orderBy: { sortOrder: "asc" } } },
  });

  return ok({ projects });
}

/** POST /api/projects — create a project (the Create New Design dialog). */
export async function POST(request: NextRequest) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to create projects", 401);

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim().slice(0, 500) : null;
  const template = clampTemplate(typeof body?.template === "string" ? body.template : "blank");
  const backgroundColor = clampColor(typeof body?.backgroundColor === "string" ? body.backgroundColor : "#0D1117");

  if (!name) return fail("VALIDATION", "Project name is required", 400);
  if (name.length > 120) return fail("VALIDATION", "Project name is too long (max 120)", 400);

  const project = await db.project.create({
    data: { name, description: description || null, template, backgroundColor },
    include: { elements: true },
  });

  return ok({ project }, 201);
}
