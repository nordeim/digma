import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";
import { bodySizeRejected, clampText, MEMBER_LIMIT } from "@/lib/validation";
import { memberColorFor, memberDisplayFor } from "@/lib/team";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** POST /api/teams/[id]/members — invite a member by email + role. */
export async function POST(request: NextRequest, { params }: Params) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to invite members", 401);

  const { id } = await params;
  const team = await db.team.findUnique({ where: { id } });
  if (!team) return fail("NOT_FOUND", "Team not found", 404);

  // Session 68 (S68-A — the sixteenth audit's M-A): the S67-B parse
  // guard reaches every request.json() site — App Router handlers
  // ship no default body-size cap, so the per-field caps only bound
  // what SURVIVES the parse; this bounds the parse itself.
  if (bodySizeRejected(request.headers.get("content-length"))) {
    return fail("VALIDATION", "Request body too large (max 32 MB)", 400);
  }

  const body = await request.json().catch(() => null);
  const email = clampText(body?.email, 200);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail("VALIDATION", "Enter a valid email address", 400);
  }

  // Session 67 (S67-B / L-1): the per-team member ceiling — the
  // ELEMENT_LIMIT style reaching the surface it missed.
  // Session 72 (S72-E / L-B5): the count and the create now run INSIDE
  // one transaction — the pre-fix count-then-create pair was a TOCTOU
  // window (a concurrent burst between the two awaits could insert
  // past the ceiling; SQLite serializes writers, so the transaction
  // closes the window). The S69-C race catch survives around it.
  // Session 69 (S69-C / L-B): the team can vanish between the
  // pre-check and the create (a concurrent DELETE) — P2003 then
  // throws past the envelope. Answer 404 instead: the invite target
  // no longer exists.
  let overCap = false;
  let member;
  try {
    member = await db.$transaction(async (tx) => {
      const memberCount = await tx.teamMember.count({ where: { teamId: id } });
      if (memberCount >= MEMBER_LIMIT) {
        overCap = true;
        return null;
      }
      return tx.teamMember.create({
        data: {
          teamId: id,
          name: clampText(body?.name, 80) ?? memberDisplayFor(email),
          email,
          role: clampText(body?.role, 80),
          avatarColor: memberColorFor(email),
        },
      });
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return fail("NOT_FOUND", "Team not found", 404);
    }
    throw error;
  }
  if (overCap) {
    return fail("VALIDATION", "Too many members (max 100)", 400);
  }
  if (!member) {
    // Unreachable (the transaction either created the row or set the
    // over-cap sentinel) — the guard exists for the type narrowing only.
    return fail("VALIDATION", "Too many members (max 100)", 400);
  }

  return ok({ member }, 201);
}
