import { type NextRequest } from "next/server";
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
import { defaultNameFor, type ElementType } from "@/lib/editor";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

async function loadProject(id: string) {
  return db.project.findUnique({ where: { id } });
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
  if (list.length > 2000) return fail("VALIDATION", "Too many elements (max 2000)", 400);

  const rows = list.map((raw: Record<string, unknown>, index: number) => {
    const type = typeof raw?.type === "string" ? raw.type : "";
    if (!isElementType(type)) throw new Error(`invalid type at ${index}`);
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

  await db.$transaction(async (tx) => {
    await tx.designElement.deleteMany({ where: { projectId: id } });
    if (rows.length > 0) {
      await tx.designElement.createMany({ data: rows.map((r) => ({ ...r, projectId: id })) });
    }
    await tx.project.update({ where: { id }, data: { updatedAt: new Date() } });
  });

  const elements = await db.designElement.findMany({
    where: { projectId: id },
    orderBy: { sortOrder: "asc" },
  });
  return ok({ elements });
}
