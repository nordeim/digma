import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
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
  // Session 72 (S72-E / L-B5): the count moved INSIDE the copy
  // transaction — the pre-fix count-then-create pair was a TOCTOU
  // window (a concurrent burst between the count and the copy could
  // insert past the ceiling; SQLite serializes writers, so the
  // transaction closes the window). The envelope is byte-identical.

  // Session 62 (S62-G / B-L5): the copy is ATOMIC and the name respects
  // the route family's own 120-char cap. The pre-fix form ran create +
  // createMany as two separate awaits (a failure between them left a
  // half-populated "(Copy)" project) and the name could reach 127 chars
  // from a 120-char source — a later rename PATCH would silently
  // truncate it while the create POST rejects at 120.
  // Session 73 (S73-C — B-F2): the copy transaction recreates up to
  // ELEMENT_LIMIT full element rows; Prisma's default 5s interactive-
  // transaction timeout can abort a max-ceiling copy on a slow
  // self-hosted disk — the P2028-family escape surfaced as an
  // unstructured 500 outside the envelope through session 76 (this
  // route had NO catch at all on the transaction). 30s covers the
  // documented worst case (2000 rows under the 32 MB body cap) with
  // margin.
  // Session 77 (S77-G / B-I2 — the twenty-fifth audit's honesty loop):
  // the escape CLOSED — the P2024 (pool-wait) and P2028 (transaction-
  // timeout) families answer the structured 503 UNAVAILABLE envelope
  // (the elements PUT's sibling arm; both transient, retryable). The
  // transaction body moves into a helper so the catch wraps it without
  // changing the transactional shape (the over-cap sentinel, the
  // atomicity, and the 30s timeout all ride unchanged).
  let overCap = false;
  const runCopyTx = async (): Promise<{ id: string } | null> => {
    return db.$transaction(async (tx) => {
      const projectCount = await tx.project.count();
      if (projectCount >= PROJECT_LIMIT) {
        overCap = true;
        return null;
      }
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
    }, { timeout: 30_000 });
  }
  let copy: { id: string } | null = null;
  try {
    copy = await runCopyTx();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2024" || error.code === "P2028")
    ) {
      return fail("UNAVAILABLE", "The copy took too long — the database timed out. Try again.", 503);
    }
    throw error;
  }
  if (overCap) {
    return fail("VALIDATION", "Too many projects (max 500)", 400);
  }
  if (!copy) {
    // Unreachable (the transaction either created the copy or set the
    // over-cap sentinel) — the guard exists for the type narrowing only.
    return fail("VALIDATION", "Too many projects (max 500)", 400);
  }

  const project = await db.project.findUnique({
    where: { id: copy.id },
    // Session 70 (S70-C): the duplicate RESPONSE ships the bounded
    // thumbnail projection (the copy's SOURCE read above keeps every
    // column — the copy itself is lossless).
    include: { elements: { orderBy: { sortOrder: "asc" }, select: THUMBNAIL_ELEMENT_SELECT } },
  });
  // Session 73 (S73-B — B-F1): the one post-commit read left unguarded.
  // A concurrent DELETE of the copy between the commit and this re-read
  // previously answered `ok({ project: null }, 201)` — a success-status
  // envelope with a null payload — while every sibling in the race-
  // hygiene family (the PATCH/DELETE P2025 pair, the elements PUT/POST
  // P2025/P2003 catches) answers 404 for a vanished row. The duplicate
  // has no first-party consumer today, so the impact was API-consumer-
  // only — but the envelope contract is uniform now.
  if (!project) return fail("NOT_FOUND", "Project not found", 404);
  return ok({ project }, 201);
}
