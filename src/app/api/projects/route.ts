import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";
import { THUMBNAIL_ELEMENT_SELECT } from "@/lib/editor";
import { bodySizeRejected, clampColor, clampTemplate, PROJECT_LIMIT } from "@/lib/validation";

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
    // Session 70 (S70-C / L-A3 — the eighteenth audit): the bounded
    // thumbnail projection — the list previously shipped FULL element
    // rows (every column including the ≤700 KB data-URL fillImage) to
    // feed 320×200 card thumbnails; the response side was never bounded
    // by the 32 MB request cap. The projection ships exactly the
    // fields CanvasThumbnail + boundsOf consume.
    include: { elements: { orderBy: { sortOrder: "asc" }, select: THUMBNAIL_ELEMENT_SELECT } },
  });

  return ok({ projects });
}

/** POST /api/projects — create a project (the Create New Design dialog). */
export async function POST(request: NextRequest) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to create projects", 401);

  // Session 68 (S68-A — the sixteenth audit's M-A): the S67-B parse
  // guard reaches every request.json() site — App Router handlers
  // ship no default body-size cap, so the per-field caps only bound
  // what SURVIVES the parse; this bounds the parse itself.
  if (bodySizeRejected(request.headers.get("content-length"))) {
    return fail("VALIDATION", "Request body too large (max 32 MB)", 400);
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim().slice(0, 500) : null;
  const template = clampTemplate(typeof body?.template === "string" ? body.template : "blank");
  const backgroundColor = clampColor(typeof body?.backgroundColor === "string" ? body.backgroundColor : "#0D1117");

  if (!name) return fail("VALIDATION", "Project name is required", 400);
  if (name.length > 120) return fail("VALIDATION", "Project name is too long (max 120)", 400);

  // Session 67 (S67-B / L-1): the creation ceiling — the ELEMENT_LIMIT
  // style reaching the surface it missed. An authenticated loop could
  // previously insert unbounded rows (each duplicate below copies up to
  // 2000 element rows per call).
  // Session 72 (S72-E / L-B5): the count and the create now run INSIDE
  // one transaction — the pre-fix count-then-create pair was a TOCTOU
  // window (a concurrent burst between the two awaits could insert past
  // the ceiling; SQLite serializes writers, so the transaction closes
  // the window). The envelope is byte-identical.
  let overCap = false;
  const project = await db.$transaction(async (tx) => {
    const projectCount = await tx.project.count();
    if (projectCount >= PROJECT_LIMIT) {
      overCap = true;
      return null;
    }
    return tx.project.create({
      data: { name, description: description || null, template, backgroundColor },
      include: { elements: true },
    });
  });
  if (overCap) {
    return fail("VALIDATION", "Too many projects (max 500)", 400);
  }
  if (!project) {
    // Unreachable (the transaction either created the row or set the
    // over-cap sentinel) — the guard exists for the type narrowing only.
    return fail("VALIDATION", "Too many projects (max 500)", 400);
  }

  return ok({ project }, 201);
}
