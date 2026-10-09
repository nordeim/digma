import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";
import { DEFAULT_CANVAS_BACKGROUND, THUMBNAIL_ELEMENT_SELECT } from "@/lib/editor";
import { readBoundedJson, clampColor, clampTemplate, clampText, PROJECT_LIMIT } from "@/lib/validation";

export const dynamic = "force-dynamic";

/** GET /api/projects — list projects (search + template filter).
 *
 * Session 73 (S73-F — the deferred DQ-2 half A): the findMany carries
 * `take: PROJECT_LIMIT` now — the aggregate is BOUNDED BY CONSTRUCTION at
 * the product ceiling (500 rows). The views render the full list (the
 * reference has no pagination either — a take/cursor product decision
 * this closes the honest way: bounded at the ceiling, not paginated);
 * pre-fix NOTHING stood between the caller and an unbounded scan.
 * `?search=` is e2e-infra-only and `?template=` has zero consumers — the
 * honest API-surface note (the S72-D family extension). */
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
    // Session 73 (S73-F — the deferred DQ-2 half A): bounded by
    // construction at the creation ceiling — see the doc comment above.
    take: PROJECT_LIMIT,
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
  const parsed = await readBoundedJson(request);
  if (parsed.tooLarge) {
    return fail("VALIDATION", "Request body too large (max 32 MB)", 400);
  }
  const body = parsed.value;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  // Session 99 (S99-D / B99-I1): the inline trim-slice twin joins the
  // S71-D clampText fold — semantics byte-identical (null/trim/slice;
  // empty → null), the divergence hazard deleted.
  const description = clampText(body?.description, 500);
  const template = clampTemplate(typeof body?.template === "string" ? body.template : "blank");
  const backgroundColor = clampColor(typeof body?.backgroundColor === "string" ? body.backgroundColor : DEFAULT_CANVAS_BACKGROUND);

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
  // Session 78 (S78-B / B-M1 — the transaction-abort family
  // completion): the count+create transaction gains the S77-G catch
  // arm — P2024 (pool-wait) and P2028 (interactive-transaction
  // timeout) are not row-size-dependent (a concurrent small create
  // queues behind a row-heavy 30s-allowed writer on a slow self-hosted
  // disk and hits Prisma's DEFAULT 5s interactive timeout), and the
  // abort previously rethrew PAST the { ok, error } envelope as an
  // unstructured 500 — the no-bare-throw discipline this route family's
  // own comments enforce. The structured 503 UNAVAILABLE answers with
  // the human copy; both families are transient and retryable. The
  // runCopyTx-style helper keeps the transactional shape unchanged.
  const runCreateTx = () =>
    db.$transaction(async (tx) => {
      const projectCount = await tx.project.count();
      if (projectCount >= PROJECT_LIMIT) {
        overCap = true;
        return null;
      }
      return tx.project.create({
        data: { name, description: description || null, template, backgroundColor },
        // Session 73 (S73-H — B-F8): the one list-family reply still on
        // the full-row element form flips onto the S70-C bounded
        // projection — a create seeds no elements (the array is always
        // []), so the payload is byte-identical TODAY, but the include
        // stays honest if template-seeding ever lands (the three siblings
        // — the list GET, the PATCH response, the duplicate response —
        // already ship this exact form).
        include: { elements: { orderBy: { sortOrder: "asc" }, select: THUMBNAIL_ELEMENT_SELECT } },
      });
    });
  let project: Awaited<ReturnType<typeof runCreateTx>>;
  try {
    project = await runCreateTx();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2024" || error.code === "P2028")
    ) {
      return fail("UNAVAILABLE", "The project took too long to create — the database timed out. Try again.", 503);
    }
    throw error;
  }
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
