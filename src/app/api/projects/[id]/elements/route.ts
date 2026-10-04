import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";
import { readBoundedJson, clampColor, clampNumber, isElementType } from "@/lib/validation";
// Session 70 (S70-B): the row-builder family (buildElementRow +
// clampFillImage + the field clamps) lives in the ONE seam —
// src/lib/editor.ts — consumed by both handlers below.
import { buildElementRow, ELEMENT_LIMIT } from "@/lib/editor";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

async function loadProject(id: string) {
  return db.project.findUnique({ where: { id } });
}


/**
 * GET /api/projects/[id]/elements — the canvas element list.
 *
 * Session 76 (S76-F): an honest API-surface note —
 * no first-party client surface calls this list route today (the
 * clone's client loads the board through GET /api/projects/[id],
 * which ships the same full rows through its include). The session
 * guard + the 404 keep it safe to expose either way.
 */
export async function GET(_request: NextRequest, { params }: Params) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to view elements", 401);

  const { id } = await params;
  const project = await loadProject(id);
  if (!project) return fail("NOT_FOUND", "Project not found", 404);

  const elements = await db.designElement.findMany({
    where: { projectId: id },
    orderBy: { sortOrder: "asc" },
  });
  return ok({ elements });
}

/**
 * POST /api/projects/[id]/elements — create one element.
 *
 * Session 72 (S72-D): an honest API-surface note — the clone's client
 * persists exclusively through the full-list PUT below (the autosave
 * replace contract), so this route serves external/API consumers (and
 * the smoke suite's validation probes); no first-party client surface
 * calls it today. The ceiling + the P2003 envelope keep it safe to
 * expose either way.
 */
export async function POST(request: NextRequest, { params }: Params) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to edit elements", 401);

  const { id } = await params;
  const project = await loadProject(id);
  if (!project) return fail("NOT_FOUND", "Project not found", 404);

  // Session 67 (S67-B / M-4): the aggregate body cap BEFORE the parse —
  // request.json() buffers the whole payload in memory first, and App
  // Router handlers ship no default body-size cap. The per-field caps
  // only bound what SURVIVES the parse; this guard bounds the parse
  // itself (the 1.45 GB abuse family never reaches it).
  const parsed = await readBoundedJson(request);
  if (parsed.tooLarge) {
    return fail("VALIDATION", "Elements payload too large (max 32 MB)", 400);
  }
  const body = parsed.value ?? {};
  const type = typeof body?.type === "string" ? body.type : "";
  if (!isElementType(type)) return fail("VALIDATION", "Unknown element type", 400);

  // Session 72 (S72-C + S72-E / L-B1 + L-B5): the count, the clamp, and
  // the create now run INSIDE one transaction — (E) the pre-fix
  // count-then-create pair was a TOCTOU window (a concurrent burst
  // between the two awaits could insert past the ELEMENT_LIMIT ceiling;
  // SQLite serializes writers, so the transaction closes the window),
  // and (C) the create is wrapped for P2003 — the project can vanish
  // between the loadProject pre-check and the create (a concurrent
  // DELETE), and the FK violation previously escaped as an unstructured
  // 500. The members POST's S69-C form answers it through the envelope.
  let overCap = false;
  let element: Awaited<ReturnType<typeof db.designElement.create>> | null = null;
  try {
    element = await db.$transaction(async (tx) => {
      // Session 60 (S60-D — the eighth audit's B-L-2): the POST enforces
      // the SAME ceiling the PUT carries. Pre-fix the count fed only the
      // sortOrder default — the single-element route (and the client add
      // paths through it) could push a project PAST 2000, after which
      // every autosave PUT failed with the "Too many elements (max
      // 2000)" 400 toast and the design was unsavable until the user
      // deleted back below the cap. Session 61 (S61-F): the literal
      // becomes the shared ELEMENT_LIMIT seam (src/lib/editor.ts) — one
      // source of truth with the client clamp.
      const count = await tx.designElement.count({ where: { projectId: id } });
      if (count >= ELEMENT_LIMIT) {
        overCap = true;
        return null;
      }
      // Session 71 (S71-C / L-A7 — the nineteenth audit's B-F11): the
      // clamp max agrees with the 2000-element ceiling — the stale 999
      // clamped an explicit end-append past element #1000 to a 999 tie
      // (unstable order), and the count fallback escaped the clamp
      // entirely. The count is bounded by the ceiling check above, so
      // the fallback is always in range.
      const sortOrder = clampNumber(body?.sortOrder, 0, ELEMENT_LIMIT - 1, count);

      // Session 70 (S70-B / L-A2 — the row-builder dedup): the POST
      // consumes the ONE shared seam (create mode synthesizes the
      // omitted-field defaults; the clamps live in src/lib/editor.ts
      // beside the domain types).
      return tx.designElement.create({
        data: {
          projectId: id,
          ...buildElementRow(body, sortOrder, "create"),
        },
      });
    });
  } catch (error) {
    // Session 72 (S72-C / L-B1): a vanished project between the
    // pre-check and the create answers the envelope, never a bare 500.
    // Session 75 (S75-G / B75-F5): the catch joins the family's
    // instanceof dialect (the PUT's own form) — the duck-typed cast
    // would swallow any non-Prisma error carrying the same code string.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return fail("NOT_FOUND", "Project not found", 404);
    }
    throw error;
  }
  if (overCap) {
    return fail("VALIDATION", "Too many elements (max 2000)", 400);
  }
  if (!element) {
    // Unreachable (the transaction either created the row or set the
    // over-cap sentinel) — the guard exists for the type narrowing only.
    return fail("VALIDATION", "Too many elements (max 2000)", 400);
  }

  return ok({ element }, 201);
}

/**
 * PUT /api/projects/[id]/elements — full-list replacement (autosave sync).
 * Transactional delete-then-recreate keeps ids fresh and order canonical;
 * the client owns the complete element state (undo/redo safe).
 */
export async function PUT(request: NextRequest, { params }: Params) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to edit elements", 401);

  const { id } = await params;
  const project = await loadProject(id);
  if (!project) return fail("NOT_FOUND", "Project not found", 404);

  // Session 67 (S67-B / M-4): the aggregate body cap BEFORE the parse —
  // THE DEFECT: request.json() buffers the whole payload in memory first
  // (up to 2000 × ~722 KB ≈ 1.45 GB under the per-field caps), with no
  // App Router body-size default, OOMing small self-hosted boxes inside
  // the interactive transaction. The count check below only bounds what
  // SURVIVES the parse; this guard bounds the parse itself.
  const parsed = await readBoundedJson(request);
  if (parsed.tooLarge) {
    return fail("VALIDATION", "Elements payload too large (max 32 MB)", 400);
  }
  const body = parsed.value;
  const list = Array.isArray(body?.elements) ? body.elements : null;
  if (!list) return fail("VALIDATION", "elements array is required", 400);
  if (list.length > ELEMENT_LIMIT) return fail("VALIDATION", "Too many elements (max 2000)", 400);

  // Session 33 (S33-3): the autosave PUT carries the FULL canvas state —
  // an optional backgroundColor alongside the element list. Validated like
  // every other color field and written inside the SAME transaction as the
  // element replace (one atomic save). Absent/invalid → "" → the stored
  // background is untouched (backward-compatible with every other caller).
  const backgroundColor =
    typeof body?.backgroundColor === "string" ? clampColor(body.backgroundColor, "") : "";

  // Session 56 (S56-H — the Mode C audit's L-1): the type check runs as a
  // PRE-VALIDATION loop returning the envelope failure. The old bare
  // `throw new Error("invalid type at …")` inside the row map escaped
  // the { ok, error } contract as an unstructured 500.
  for (let index = 0; index < list.length; index += 1) {
    const type = typeof list[index]?.type === "string" ? list[index].type : "";
    if (!isElementType(type)) {
      return fail("VALIDATION", `Invalid element type at index ${index}`, 400);
    }
  }

  const rows = list.map((raw: Record<string, unknown>, index: number) =>
    // Session 70 (S70-B / L-A2 — the row-builder dedup): replace mode
    // nulls omitted fields (the whole-list replace contract); the dead
    // src/path/zIndex writes died with their columns.
    buildElementRow(raw, index, "replace"),
  );

  // Session 56 (S56-H — L-2): the response read runs INSIDE the interactive
  // transaction. The old outside-read could interleave with a concurrent
  // PUT landing between this request's commit and its read — returning a
  // list this request did not write.
  //
  // Session 62 (S62-G / B-L7): a project DELETE racing this long-running
  // PUT makes the transaction's project.update (or the element writes)
  // throw Prisma P2025/P2003 OUTSIDE the envelope — an unstructured 500
  // violating the S56-H no-bare-throw discipline (this route IS the
  // autosave: the failure toast then claims "Autosave failed" with a
  // null message). The known-request races answer 404 through the
  // envelope.
  try {
    const elements = await db.$transaction(async (tx) => {
      await tx.designElement.deleteMany({ where: { projectId: id } });
      if (rows.length > 0) {
        await tx.designElement.createMany({ data: rows.map((r) => ({ ...r, projectId: id })) });
      }
      await tx.project.update({
        where: { id },
        data: { updatedAt: new Date(), ...(backgroundColor ? { backgroundColor } : {}) },
      });
      return tx.designElement.findMany({
        where: { projectId: id },
        orderBy: { sortOrder: "asc" },
      });
    }, { timeout: 30_000 });
    // Session 73 (S73-C — B-F2): the replace transaction deletes and
    // recreates up to ELEMENT_LIMIT rows — a legitimate ~30 MB of
    // fillImage data-URLs under the 32 MB body cap. Prisma's DEFAULT
    // interactive-transaction timeout is 5s; a max-ceiling save on a
    // slow self-hosted disk (the documented deploy posture) can exceed
    // it, and the P2028-family abort matched neither P2025 nor P2003 —
    // through session 76 it rethrowed through the catch below as an
    // unstructured 500, exactly the no-bare-throw family this route's
    // own comments enforce. 30s covers the documented worst case with
    // margin.
    // Session 77 (S77-G / B-I2 — the twenty-fifth audit's honesty
    // loop): that residual CLOSED — the P2024 (pool-wait) and P2028
    // (transaction-timeout) families now answer the structured 503
    // UNAVAILABLE envelope instead of the bare 500. Both are transient
    // server-side conditions (retryable by the caller); the client's
    // call() seam surfaces the envelope's message as the toast copy.
    return ok({ elements });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2025" || error.code === "P2003")
    ) {
      return fail("NOT_FOUND", "Project not found", 404);
    }
    // Session 77 (S77-G / B-I2): the transaction-abort family —
    // P2024 = timed out waiting for a pool connection, P2028 = the
    // interactive transaction timed out. Transient by nature; the
    // envelope answers 503 with the human copy.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2024" || error.code === "P2028")
    ) {
      return fail("UNAVAILABLE", "The board took too long to save — the database timed out. Try again.", 503);
    }
    throw error;
  }
}
