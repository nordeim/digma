import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

import { useEditorStore } from "@/components/editor/editor-store";
import type { DesignElementDTO } from "@/lib/editor";

// The session-111 spec (the fifty-ninth audit's chosen work):
//
// S111-A — the no-op commit family's GESTURE-SEAM completion (A-L1,
//   the headline): the S110-A closure enumerated eight mutation arms
//   and called the census closed, but the gesture-seam trio
//   (beginGesture/endGesture/cancelGesture) was absent from the
//   enumeration entirely — and endGesture (:551-559) PUSHES past and
//   WIPES future with only a null-snapshot bail. Every terminal
//   discriminates on "an event happened," never "the net state
//   differs": the canvas sets moved:true on ANY pointermove
//   (canvas.tsx:260) and the panel's markText() sets changed on any
//   real commit (properties-panel.tsx:518-520). Drag right 50px, drag
//   back, release: the net state is IDENTICAL, yet the pre-fix
//   endGesture pushes an inert history entry (the next Ctrl+Z
//   visibly does nothing), wipes the redo stack, and (canvas path)
//   the per-move moveElements calls already armed a byte-identical
//   PUT — verbatim the S78-C pre-fix symptom list. Sub-item: the
//   moveElements moved flag (:390-399) is MEMBERSHIP-based
//   (idSet.has && !locked), not delta-based — moveElements(ids, 0, 0)
//   with matched ids commits new identities + "unsaved" while the
//   comment (:385-388) claims "saveState flips only when something
//   moved" (falsified at dx=dy=0). The F97 lesson one session later:
//   a closure claim is itself a census claim — the S110-A census
//   missed the ninth arm at the same layer.
//
// S111-B — the load-effect header's four-family taxonomy (A-L2):
//   the S110-C re-anchor scoped the S85-A leave-transport await to
//   "the swap path," but that await sits inside if (projectId) —
//   OUTSIDE the !firstRunRef.current swap block — and its designed
//   case is the RE-ENTRY MOUNT (a plain mount with a registered
//   transport). Separately the Untitled/fallback paths settle after
//   await Promise.resolve() — not "in the sync prefix before the
//   first await." The comment's honest form names four families.
//   Zero behavior change.
//
// S111-C — the two comment-truth repairs (B-L1 + B-I4): the
//   verify-nav-s111 derivation re-badged the port-squat closure's
//   audit ordinal 58->59 on a HISTORICAL provenance attribution
//   (the closure was S110-B, the fifty-eighth audit's); and
//   validation.ts:160-162 compounds the two claims the S76-F
//   rewording separated (typical boards sit far under; a ~30 MB
//   board is the heaviest-legitimate form that fits JUST under).
//
// S111-D — the TeamMember invite dedup (B-I3, the reference gate
//   LIFTED): this cycle's reference measurement found ZERO teams on
//   the reference, its Create-Team control dead chrome, and no
//   reachable invite flow — no reference behavior exists to mirror,
//   so the clone's dedup is a working superset (the mobile-nav /
//   eye-toggle family precedent). The fix: @@unique([teamId, email])
//   in the schema; a shared normalizeEmail seam (trim +
//   toLowerCase, the auth family's existing contract, now one
//   source) consumed at all seven email-reading sites — SQLite
//   unique indexes are BINARY-collation, so without normalization
//   the constraint is bypassable by case variation; the members
//   POST's dedup sentinel INSIDE the existing transaction (409
//   CONFLICT, the register family's envelope, BEFORE the
//   MEMBER_LIMIT check) plus the P2002 race arm; the teams POST's
//   inline first member structurally exempt (the first row of a
//   brand-new team cannot duplicate); the smoke 409 re-invite check
//   (63 -> 64).
//
// S111-E — the per-session pin family (the s111 forms' contracts):
//   the verify-nav s111 contract, the ref-audit s111 provenance
//   anchors, the seo-check s111 fail-loud carried forms, and the
//   standing datum survival pins.

const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s111.sh"),
  "utf8",
);
const refSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s111.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s111.sh"),
  "utf8",
);
const s111Plan = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session111.md"),
  "utf8",
);
const schemaSource = readFileSync(
  path.resolve(import.meta.dirname, "../prisma/schema.prisma"),
  "utf8",
);
const validationSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/validation.ts"),
  "utf8",
);
const membersSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/teams/[id]/members/route.ts"),
  "utf8",
);
const teamsSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/teams/route.ts"),
  "utf8",
);
const smokeSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/smoke-test.sh"),
  "utf8",
);

/** Whitespace-collapsed view — an ABSENT pin on the raw text is hollow
 * when the target is line-broken or comment-prefixed (the F89 lesson,
 * applied at the pin layer since S110: strip the // and # comment
 * prefixes BEFORE the join so multi-line targets stay visible). */
function collapsed(source: string): string {
  return source
    .split("\n")
    .map((l) => l.replace(/^\s*(?:\/\/|#)\s?/, "").trim())
    .filter((l) => l.length > 0)
    .join(" ")
    .replace(/\s+/g, " ");
}

const viewCollapsed = collapsed(viewSource);
const navCollapsed = collapsed(navSource);
const validationCollapsed = collapsed(validationSource);

/** A minimal rectangle DTO for driving the store directly. */
function rect(id: string, x: number, y: number): DesignElementDTO {
  return {
    id,
    projectId: "p1",
    type: "rectangle",
    name: id,
    sortOrder: 0,
    x,
    y,
    width: 200,
    height: 150,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    fill: "#3B82F6",
    stroke: null,
    strokeWidth: 0,
    radius: 0,
  } as DesignElementDTO;
}

beforeEach(() => {
  useEditorStore.setState({
    projectId: "p1",
    projectName: "Test",
    projectDescription: null,
    backgroundColor: "#0D1117",
    elements: [rect("a", 60, 80), rect("b", 220, 140)],
    selectedIds: ["a", "b"],
    tool: "select",
    zoom: 1,
    panX: 0,
    panY: 0,
    boardEpoch: 0,
    saveState: "saved",
    past: [],
    future: [],
    gestureSnapshot: null,
  });
});

describe("S111-A the no-op commit family's gesture-seam completion (A-L1 — the headline)", () => {
  it("DEFECT (behavioral): the NET-ZERO gesture never pushes an inert history entry and never wipes the redo stack", () => {
    // Arm a redo entry first: a live gesture, then undo.
    useEditorStore.getState().beginGesture();
    useEditorStore.getState().moveElements(["a"], 40, 0);
    useEditorStore.getState().endGesture();
    useEditorStore.getState().undo();
    const before = useEditorStore.getState();
    expect(before.future).toHaveLength(1); // the redo entry exists

    // The net-zero gesture: right 50, back 50 — the net state is identical.
    useEditorStore.getState().beginGesture();
    useEditorStore.getState().moveElements(["a"], 50, 0);
    useEditorStore.getState().moveElements(["a"], -50, 0);
    useEditorStore.getState().endGesture();
    const s = useEditorStore.getState();
    expect(s.past).toHaveLength(before.past.length); // pre-fix: +1 (the inert entry)
    expect(s.future).toHaveLength(1); // pre-fix: 0 (the redo wiped by the inert commit)
    expect(s.gestureSnapshot).toBeNull();
    // The net state really is identical (the pin's own sanity floor).
    expect(s.elements[0]!.x).toBe(60);
  });

  it("DEFECT (behavioral): moveElements with a ZERO delta never flips saveState and keeps the elements identity", () => {
    const elementsBefore = useEditorStore.getState().elements;
    useEditorStore.getState().moveElements(["a", "b"], 0, 0);
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("saved"); // pre-fix: "unsaved" (membership moved)
    expect(s.elements).toBe(elementsBefore); // pre-fix: new same-value identities
    expect(s.past).toHaveLength(0);
    expect(s.future).toHaveLength(0);
  });

  it("DEFECT (behavioral): the CLAMP member — a move whose delta the position bound absorbs never commits", () => {
    // Park "a" at the bound, then push past it: the clamped position is
    // unchanged, so nothing moved (pre-fix: membership flipped "unsaved"
    // and churned identities for a zero-effect move).
    useEditorStore.setState({
      elements: [rect("a", 100000, 80), rect("b", 220, 140)],
    });
    const elementsBefore = useEditorStore.getState().elements;
    useEditorStore.getState().moveElements(["a"], 500, 0);
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("saved");
    expect(s.elements).toBe(elementsBefore);
    expect(s.elements[0]!.x).toBe(100000); // the clamp held
  });

  it("SURVIVAL (behavioral): the LIVE gesture still pushes history through endGesture", () => {
    useEditorStore.getState().beginGesture();
    useEditorStore.getState().moveElements(["a"], 40, 0);
    useEditorStore.getState().endGesture();
    const s = useEditorStore.getState();
    expect(s.past).toHaveLength(1);
    expect(s.future).toHaveLength(0);
    expect(s.gestureSnapshot).toBeNull();
    expect(s.saveState).toBe("unsaved");
    expect(s.elements[0]!.x).toBe(100);
    // Undo restores the pre-gesture position (the snapshot is live).
    useEditorStore.getState().undo();
    expect(useEditorStore.getState().elements[0]!.x).toBe(60);
  });

  it("SURVIVAL (behavioral): a live moveElements delta keeps the full contract", () => {
    useEditorStore.getState().moveElements(["a"], 10, 5);
    const s = useEditorStore.getState();
    expect(s.saveState).toBe("unsaved");
    expect(s.elements[0]!.x).toBe(70);
    expect(s.elements[0]!.y).toBe(85);
    expect(s.elements[1]!.x).toBe(220); // untouched member keeps identity
  });

  it("DEFECT (source): endGesture carries the net-zero guard (the snapshot-identity compare with the cancel-shaped bail)", () => {
    // Pre-fix: the arm's only bail is the null-snapshot one — the armed
    // snapshot is pushed unconditionally.
    expect(storeSource).toMatch(/function snapshotsEqual\(/);
    expect(storeSource).toMatch(/endGesture:[\s\S]{0,600}?snapshotsEqual\(state\.gestureSnapshot/);
    // The guard bails to the cancel shape (no past push, no future wipe).
    expect(storeSource).toMatch(/endGesture:[\s\S]{0,600}?gestureSnapshot:\s*null\s*\}/);
  });

  it("DEFECT (source): moveElements' moved flag is VALUE-based (the clamp-aware position compare), not membership-based", () => {
    // Pre-fix: moved flips on idSet.has(el.id) && !el.locked — the
    // position compare never runs.
    expect(storeSource).toMatch(/nx !== el\.x \|\| ny !== el\.y/);
    // The membership scan no longer sets moved by itself.
    const moveArm = storeSource.slice(
      storeSource.indexOf("moveElements:"),
      storeSource.indexOf("deleteElements:"),
    );
    expect(moveArm).not.toMatch(/moved = true;\s*\n\s*\/\/[^\n]*\n\s*return \{\s*\.\.\.el,/);
  });

  it("DEFECT (source): the moveElements comment no longer over-claims (the falsified 'flips only when something moved' form is re-anchored)", () => {
    const storeCollapsed = collapsed(storeSource);
    // The S111-A marker names the delta-based repair.
    expect(storeCollapsed).toMatch(/S111-A/);
  });
});

describe("S111-B the load-effect header's four-family taxonomy (A-L2 — comment truth)", () => {
  it("DEFECT: the swap-scoped transport attribution is ABSENT from the header (the await is not swap-scoped)", () => {
    // Pre-fix: "on the swap path the S80-A drain and the S85-A
    // leave-transport awaits precede it" — falsified by the await's
    // placement inside if (projectId), outside the swap block, with
    // its designed case the RE-ENTRY MOUNT.
    expect(viewCollapsed).not.toContain(
      "on the swap path the S80-A drain and the S85-A leave-transport awaits precede it",
    );
  });

  it("DEFECT: the honest four-family form is PRESENT (the re-entry-mount family named + the fallback-path Promise.resolve acknowledged)", () => {
    expect(viewCollapsed).toMatch(/re-entry mount/i);
    expect(viewCollapsed).toMatch(/Promise\.resolve/);
    expect(viewCollapsed).toMatch(/S111-B/);
  });

  it("SURVIVAL: the universally-true core survives (never in the effect's sync body directly)", () => {
    expect(viewCollapsed).toContain("never in the effect's sync body directly");
  });
});

describe("S111-C the two comment-truth repairs (B-L1 + B-I4)", () => {
  it("DEFECT: the verify-nav provenance attribution names S110-B / the fifty-eighth audit (the closure's own audit), not the fifty-ninth", () => {
    // Pre-fix: "Session 111 (S111 — the fifty-ninth audit's port-squat
    // closure)" — the derivation re-badged a HISTORICAL attribution.
    expect(navCollapsed).not.toMatch(/fifty-ninth audit's port-squat/);
    expect(navCollapsed).toMatch(/S110-B/);
    expect(navCollapsed).toMatch(/fifty-eighth audit/);
  });

  it("DEFECT: the validation cap comment separates the two claims (typical boards far under vs the heaviest-legitimate form just under)", () => {
    // Pre-fix: "sits far under it at ~30 MB of data-URL prose" — the
    // compound form the S76-F rewording had separated.
    expect(validationCollapsed).not.toContain("far under it at ~30 MB");
    expect(validationCollapsed).toMatch(/S111-C/);
  });
});

describe("S111-D the TeamMember invite dedup (B-I3 — the reference gate lifted)", () => {
  it("DEFECT: the schema carries the compound unique constraint on (teamId, email)", () => {
    expect(schemaSource).toMatch(/@@unique\(\[teamId, email\]\)/);
  });

  it("DEFECT: the normalizeEmail seam exists in validation.ts", () => {
    expect(validationSource).toMatch(/export function normalizeEmail\(/);
    const seam = validationSource.slice(
      validationSource.indexOf("export function normalizeEmail("),
    );
    expect(seam.slice(0, 400)).toMatch(/toLowerCase/);
    expect(seam.slice(0, 400)).toMatch(/trim/);
  });

  it("DEFECT: all five auth email reads consume the seam (zero raw trim().toLowerCase() forms left)", () => {
    for (const route of [
      "register",
      "login",
      "verify-otp",
      "resend-otp",
      "forgot-password",
    ]) {
      const src = readFileSync(
        path.resolve(import.meta.dirname, `../src/app/api/auth/${route}/route.ts`),
        "utf8",
      );
      expect(src).toMatch(/normalizeEmail\(/);
      expect(src).not.toMatch(/body\?\.email\.[\s\S]{0,40}trim\(\)\.toLowerCase\(\)/);
    }
  });

  it("DEFECT: both invite email reads consume the seam (members + teams routes)", () => {
    expect(membersSource).toMatch(/normalizeEmail\(/);
    expect(teamsSource).toMatch(/normalizeEmail\(/);
    expect(membersSource).not.toMatch(/body\?\.email\.[\s\S]{0,40}trim\(\)(?!\.)/);
    expect(teamsSource).not.toMatch(/body\?\.memberEmail\.[\s\S]{0,40}trim\(\)(?!\.)/);
  });

  it("DEFECT: the members POST carries the dedup sentinel INSIDE the transaction, BEFORE the ceiling check, answering 409 CONFLICT", () => {
    // The sentinel: a same-team same-email lookup inside the tx.
    expect(membersSource).toMatch(/findFirst\(\{\s*where:\s*\{\s*teamId:\s*id,\s*email/);
    // The 409 envelope (the register family's form).
    expect(membersSource).toMatch(
      /fail\("CONFLICT", "This member is already on the team", 409\)/,
    );
    // Ordering: the dedup diagnosis precedes the ceiling (a re-invite at
    // the ceiling answers 409, not the ceiling's 400).
    const sentinelIdx = membersSource.indexOf("findFirst({ where: { teamId: id, email");
    const ceilingIdx = membersSource.indexOf("memberCount >= MEMBER_LIMIT");
    expect(sentinelIdx).toBeGreaterThanOrEqual(0);
    expect(ceilingIdx).toBeGreaterThan(sentinelIdx);
    // The P2002 race arm (the register family's S64-E form).
    expect(membersSource).toMatch(/P2002/);
    expect(membersSource).toMatch(
      /code === "P2002"[\s\S]{0,200}This member is already on the team/,
    );
  });

  it("DEFECT: the teams POST's inline first member carries the structural-exemption comment", () => {
    expect(teamsSource).toMatch(/S111-D/);
    expect(teamsSource).toMatch(/first (?:row|member) of a brand-new team/i);
  });

  it("DEFECT: the smoke suite carries the 409 re-invite check", () => {
    expect(smokeSource).toMatch(/409/);
    expect(smokeSource).toMatch(/already on the team|re-invite/i);
  });

  it("SURVIVAL: the existing invite contracts survive (the honest 400s, the derivations, the ceiling)", () => {
    expect(membersSource).toMatch(
      /fail\("VALIDATION", "Email is too long \(max 200\)", 400\)/,
    );
    expect(membersSource).toMatch(/memberDisplayFor\(email\)/);
    expect(membersSource).toMatch(/memberColorFor\(email\)/);
    expect(membersSource).toMatch(/memberCount >= MEMBER_LIMIT/);
    expect(teamsSource).toMatch(/memberDisplayFor\(memberEmail\)/);
    expect(teamsSource).toMatch(/clampText\(body\?\.memberRole,\s*80\)/);
  });
});

describe("S111-E the per-session pin family (the s111 forms' contracts)", () => {
  it("the verify-nav s111 contract: the 88th ordinal, the S110-delivery descriptor, the nav111 session, the fail-loud triple, zero nav110 residue", () => {
    expect(navSource).toContain("88th consecutive session");
    expect(navSource).toContain("907fd83");
    expect(navSource).toContain("--session nav111");
    expect(navSource).toContain("/tmp/digma-nav111.log");
    expect(navSource).not.toContain("--session nav110");
    // The fail-loud triple (the S110-B product carried forward).
    expect(navSource).toMatch(/pkill -f "standalone\/server\.js"/);
    expect(navSource).toMatch(/something already answers :3000/);
    // The never-up gate (the S110-B product, shell-quoted form).
    expect(navSource).toMatch(/UP" != "1"/);
    // The nine-check enumeration with the class-A guard.
    expect(navSource).toMatch(/failure class A/);
    expect(navSource).toMatch(/The 9 checks/);
  });

  it("the ref-audit s111 provenance: the Session 111 form, the 87th audit, the s121 evidence, the live111 session, the 48th@87th clip ordinal, the S110 delivery descriptor", () => {
    expect(refSource).toMatch(/Session 111/);
    expect(refSource).toContain("87th reference audit");
    expect(refSource).toContain("ref-audit-s121");
    expect(refSource).toContain("--session live111");
    expect(refSource).toContain("the 48th");
    expect(refSource).toContain("907fd83");
    expect(refSource).not.toContain("--session live110");
    expect(refSource).not.toContain("ref-audit-s120");
    // The fail-loud members.
    expect(refSource).toMatch(/REF_LOGIN_EMAIL/);
    expect(refSource).toMatch(/F89 CHECK FAILED/);
  });

  it("the seo-check s111 fail-loud carried forms", () => {
    expect(seoSource).toContain("session 111");
    expect(seoSource).toContain("/tmp/digma-seo-s111.log");
    expect(seoSource).toMatch(/already answers/);
    expect(seoSource).toMatch(/never came up/);
    expect(seoSource).toMatch(/\[ "\$FAIL" = "0" \] \|\| exit 1/);
  });

  it("the remediation plan exists with the S111-A..E sections and the honest record", () => {
    expect(s111Plan).toMatch(/# Remediation Plan — Session 111/);
    expect(s111Plan).toMatch(/S111-A/);
    expect(s111Plan).toMatch(/S111-B/);
    expect(s111Plan).toMatch(/S111-C/);
    expect(s111Plan).toMatch(/S111-D/);
    expect(s111Plan).toMatch(/S111-E/);
    // The B-I3 reference measurement is recorded (the gate lift).
    expect(s111Plan).toMatch(/ZERO teams/);
  });

  it("SURVIVAL: the standing datum pins survive (the S110 store guards, the s110 spec)", () => {
    // The five S110-A guards + the S109-A pair (the family's closed set).
    expect(storeSource.match(/if \(!matched\) return \{\};/g)).toHaveLength(5);
    expect(storeSource).toMatch(/if \(accepted\.length === 0\) return \[\];/);
    expect(storeSource).toMatch(/if \(state\.backgroundColor === color\) return \{\};/);
    const s110Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s110.test.ts"),
      "utf8",
    );
    expect(s110Spec).toMatch(/S110-A/);
  });
});
