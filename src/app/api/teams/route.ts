import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { fail, ok, requireSession } from "@/lib/api";
import { readBoundedJson, clampColor, clampText, TEAM_LIMIT } from "@/lib/validation";
import { memberColorFor, memberDisplayFor } from "@/lib/team";

export const dynamic = "force-dynamic";

/** GET /api/teams — teams with member counts and member lists. */
export async function GET(_request: NextRequest) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to view teams", 401);

  const teams = await db.team.findMany({
    // Session 78 (S78-E / B-L1 — the S73-F list-bound family's missed
    // sibling): take: TEAM_LIMIT — the projects list GET's own form.
    // Pre-fix NOTHING stood between the caller and an unbounded scan;
    // the creation ceiling (100) bounds it today, but the bound is
    // now enforced at the read seam too (the include's members stay
    // take-less — MEMBER_LIMIT bounds them, matching the projects
    // GET's include form).
    take: TEAM_LIMIT,
    orderBy: { createdAt: "asc" },
    include: { members: { orderBy: { createdAt: "asc" } } },
  });
  return ok({ teams });
}

/** POST /api/teams — create a team (optionally with the first member). */
export async function POST(request: NextRequest) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHENTICATED", "Sign in to create teams", 401);

  // Session 68 (S68-A — the sixteenth audit's M-A): the S67-B parse
  // guard reaches every request.json() site — App Router handlers
  // ship no default body-size cap, so the per-field caps only bound
  // what SURVIVES the parse; this bounds the parse itself.
  const parsed = await readBoundedJson(request);
  if (parsed.tooLarge) {
    return fail("VALIDATION", "Request body too large (max 32 MB)", 400);
  }
  const body = parsed.value;
  // Session 97 (S97-C — B97-L1, the forty-fifth audit): names are
  // identity — REJECT, the project family's S73-E doctrine reaching its
  // sibling (a 200-char scripted name previously truncated silently to
  // 80; the UI's maxLength=80 makes this API-consumer-only). The
  // description below stays truncate — prose, the doctrine's other half.
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) return fail("VALIDATION", "Team name is required", 400);
  if (name.length > 80) return fail("VALIDATION", "Team name is too long (max 80)", 400);

  const description = clampText(body?.description, 300);
  const color = clampColor(String(body?.color ?? "#8B5CF6"), "#8B5CF6");

  // Session 60 (S60-C — the eighth audit's B-L-1): the inline first-member
  // invitation validates the email with the SAME contract the members
  // route enforces. Pre-fix the raw truthy gate wrote the text-clamped
  // memberEmail with NO format check, so "abc" in the
  // Create Team dialog silently created a garbage member while the same
  // input in the Invite Member dialog 400'd with "Enter a valid email
  // address" — the two invite paths must answer identically.
  const memberEmail = clampText(body?.memberEmail, 200);
  if (memberEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberEmail)) {
    return fail("VALIDATION", "Enter a valid email address", 400);
  }

  // Session 67 (S67-B / L-1): the creation ceiling — the ELEMENT_LIMIT
  // style reaching the surface it missed.
  // Session 72 (S72-E / L-B5): the count and the create (with the
  // nested first member) now run INSIDE one transaction — the pre-fix
  // count-then-create pair was a TOCTOU window (a concurrent burst
  // between the two awaits could insert past the ceiling; SQLite
  // serializes writers, so the transaction closes the window). The
  // envelope is byte-identical.
  let overCap = false;
  // Session 78 (S78-B / B-M1 — the transaction-abort family
  // completion): the teams POST's count+create transaction gains the
  // S77-G catch arm (the projects POST's twin this session) — the
  // P2024/P2028 abort families are not row-size-dependent, and the
  // abort previously rethrew past the { ok, error } envelope as an
  // unstructured 500. The structured 503 UNAVAILABLE answers with the
  // human copy; the helper keeps the transactional shape unchanged.
  const runCreateTx = () =>
    db.$transaction(async (tx) => {
      const teamCount = await tx.team.count();
      if (teamCount >= TEAM_LIMIT) {
        overCap = true;
        return null;
      }
      return tx.team.create({
        data: {
          name,
          description,
          color,
          ...(memberEmail
            ? {
                members: {
                  create: {
                    name: memberDisplayFor(memberEmail),
                    email: memberEmail,
                    role: clampText(body?.memberRole, 80),
                    // Session 64 (S64-F — the twelfth audit's B-7): the
                    // same derivation the invite-member route uses — the
                    // two member-creation paths must agree on the color
                    // seed (the same email, the same chip, whichever
                    // dialog created it).
                    avatarColor: memberColorFor(memberEmail),
                  },
                },
              }
            : {}),
        },
        include: { members: { orderBy: { createdAt: "asc" } } },
      });
    });
  let team: Awaited<ReturnType<typeof runCreateTx>>;
  try {
    team = await runCreateTx();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2024" || error.code === "P2028")
    ) {
      return fail("UNAVAILABLE", "The team took too long to create — the database timed out. Try again.", 503);
    }
    throw error;
  }
  if (overCap) {
    return fail("VALIDATION", "Too many teams (max 100)", 400);
  }
  if (!team) {
    // Unreachable (the transaction either created the row or set the
    // over-cap sentinel) — the guard exists for the type narrowing only.
    return fail("VALIDATION", "Too many teams (max 100)", 400);
  }

  return ok({ team }, 201);
}
