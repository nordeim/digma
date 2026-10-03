import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";
import {
  clampColor,
  clampFontFamily,
  clampFontWeight,
  clampNumber,
  clampOptionalText,
  clampTextAlign,
  isElementType,
} from "@/lib/validation";
import { clampFillImageFit, defaultNameFor, ELEMENT_LIMIT, parseGradient, type ElementType } from "@/lib/editor";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

async function loadProject(id: string) {
  return db.project.findUnique({ where: { id } });
}

const FILL_IMAGE_MAX_CHARS = 700_000; // ~500 KB data URL + overhead — the Image tab's self-hosted cap

/** The Image tab's data-URL sanitize: accepts ONLY well-formed image data
 * URLs within the size cap (the autosave PUT carries the full element list —
 * an unbounded image would bloat every save); anything else nulls it. */
function clampFillImage(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (!/^data:image\/(png|jpeg|jpg|gif|svg\+xml|webp);base64,[A-Za-z0-9+/=]+$/.test(value)) return null;
  if (value.length > FILL_IMAGE_MAX_CHARS) return null;
  return value;
}

/** GET /api/projects/[id]/elements — the canvas element list. */
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
 * POST /api/projects/[id]/elements — create one element (drawn on the canvas,
 * spawned by the AI assistant, or re-added from history).
 */
export async function POST(request: NextRequest, { params }: Params) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to edit elements", 401);

  const { id } = await params;
  const project = await loadProject(id);
  if (!project) return fail("NOT_FOUND", "Project not found", 404);

  const body = await request.json().catch(() => null);
  const type = typeof body?.type === "string" ? body.type : "";
  if (!isElementType(type)) return fail("VALIDATION", "Unknown element type", 400);

  const count = await db.designElement.count({ where: { projectId: id } });
  // Session 60 (S60-D — the eighth audit's B-L-2): the POST enforces the
  // SAME ceiling the PUT carries. Pre-fix the count fed only the sortOrder
  // default — the single-element route (and the client add paths through
  // it) could push a project PAST 2000, after which every autosave PUT
  // failed with the "Too many elements (max 2000)" 400 toast and the
  // design was unsavable until the user deleted back below the cap.
  // Session 61 (S61-F): the literal becomes the shared ELEMENT_LIMIT seam
  // (src/lib/editor.ts) — one source of truth with the client clamp.
  if (count >= ELEMENT_LIMIT) {
    return fail("VALIDATION", "Too many elements (max 2000)", 400);
  }
  const sortOrder = clampNumber(body?.sortOrder, 0, 999, count);

  const element = await db.designElement.create({
    data: {
      projectId: id,
      type,
      name: clampOptionalText(body?.name, 80) ?? defaultNameFor(type as ElementType, sortOrder),
      x: clampNumber(body?.x, -100000, 100000, 0),
      y: clampNumber(body?.y, -100000, 100000, 0),
      width: clampNumber(body?.width, 0, 100000, 100),
      height: clampNumber(body?.height, 0, 100000, 100),
      rotation: clampNumber(body?.rotation, -3600, 3600, 0),
      scale: clampNumber(body?.scale, 0.05, 20, 1),
      opacity: clampNumber(body?.opacity, 0, 1, 1),
      fill: body?.fill === null ? null : clampColor(String(body?.fill ?? "#3B82F6"), "#3B82F6"),
      fillGradient:
        body?.fillGradient === null || body?.fillGradient === undefined
          ? null
          : (() => { const g = parseGradient(String(body.fillGradient)); return g ? JSON.stringify(g) : null; })(),
      fillImage: clampFillImage(body?.fillImage),
      fillImageFit: clampFillImageFit(body?.fillImageFit),
      stroke: body?.stroke === null ? null : clampColor(String(body?.stroke ?? "#FFFFFF"), "#FFFFFF"),
      strokeWidth: clampNumber(body?.strokeWidth, 0, 100, 0),
      radius: clampNumber(body?.radius, 0, 2000, 0),
      text: clampOptionalText(body?.text, 2000),
      fontSize: body?.fontSize === null || body?.fontSize === undefined ? null : clampNumber(body?.fontSize, 1, 500, 16),
      fontWeight: clampFontWeight(body?.fontWeight),
      fontFamily: clampFontFamily(body?.fontFamily),
      textAlign: clampTextAlign(body?.textAlign),
      src: clampOptionalText(body?.src, 2000),
      path: clampOptionalText(body?.path, 20000),
      zIndex: clampNumber(body?.zIndex, 0, 99999, sortOrder),
      visible: body?.visible === undefined ? true : Boolean(body?.visible),
      locked: body?.locked === undefined ? false : Boolean(body?.locked),
      sortOrder,
    },
  });

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

  const body = await request.json().catch(() => null);
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

  const rows = list.map((raw: Record<string, unknown>, index: number) => {
    const type = typeof raw?.type === "string" ? raw.type : "";
    return {
      type,
      name: clampOptionalText(raw?.name, 80) ?? defaultNameFor(type as ElementType, index),
      x: clampNumber(raw?.x, -100000, 100000, 0),
      y: clampNumber(raw?.y, -100000, 100000, 0),
      width: clampNumber(raw?.width, 0, 100000, 100),
      height: clampNumber(raw?.height, 0, 100000, 100),
      rotation: clampNumber(raw?.rotation, -3600, 3600, 0),
      scale: clampNumber(raw?.scale, 0.05, 20, 1),
      opacity: clampNumber(raw?.opacity, 0, 1, 1),
      fill: raw?.fill === null || raw?.fill === undefined ? null : clampColor(String(raw.fill), "#3B82F6"),
      fillGradient: (() => {
        if (raw?.fillGradient === null || raw?.fillGradient === undefined) return null;
        const g = parseGradient(String(raw.fillGradient));
        return g ? JSON.stringify(g) : null;
      })(),
      fillImage: clampFillImage(raw?.fillImage),
      fillImageFit: clampFillImageFit(raw?.fillImageFit),
      stroke: raw?.stroke === null || raw?.stroke === undefined ? null : clampColor(String(raw.stroke), "#FFFFFF"),
      strokeWidth: clampNumber(raw?.strokeWidth, 0, 100, 0),
      radius: clampNumber(raw?.radius, 0, 2000, 0),
      text: clampOptionalText(raw?.text, 2000),
      fontSize: raw?.fontSize === null || raw?.fontSize === undefined ? null : clampNumber(raw?.fontSize, 1, 500, 16),
      fontWeight: clampFontWeight(raw?.fontWeight),
      fontFamily: clampFontFamily(raw?.fontFamily),
      textAlign: clampTextAlign(raw?.textAlign),
      src: clampOptionalText(raw?.src, 2000),
      path: clampOptionalText(raw?.path, 20000),
      zIndex: clampNumber(raw?.zIndex, 0, 99999, index),
      visible: raw?.visible === undefined ? true : Boolean(raw?.visible),
      locked: raw?.locked === undefined ? false : Boolean(raw?.locked),
      sortOrder: index,
    };
  });

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
    });
    return ok({ elements });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2025" || error.code === "P2003")
    ) {
      return fail("NOT_FOUND", "Project not found", 404);
    }
    throw error;
  }
}
