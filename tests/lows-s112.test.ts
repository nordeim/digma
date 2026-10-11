import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

import { useEditorStore } from "@/components/editor/editor-store";
import type { DesignElementDTO } from "@/lib/editor";

// The session-112 spec (the sixtieth audit's chosen work):
//
// S112-A — the multi-selection color-guard scope (A-L1, the headline):
//   the S105-A same-value guard inside HexColorRow compares against
//   `value` — the FIRST selected member's fill — while the commit
//   targets ALL selected ids. Marquee-select A (fill #FFFFFF) + B
//   (fill #000000); the row displays #FFFFFF; picking #FFFFFF to
//   unify the group compares equal → onChange never fires → B
//   silently stays black (a dead control for that intent, both
//   surfaces — the desktop panel and the mobile Sheet render the one
//   exported MultiSelectionSection). The F96 doctrine inverted: the
//   guard landed at a layer (the shared component's single-value
//   scope) that does not own the multi-target truth. The fix: an
//   optional `wouldCommit` prop on HexColorRow (absent = the
//   single-value compare, byte-identical for the four single-scope
//   consumers); MultiSelectionSection supplies the selection-scope
//   truth through the exported pure `selectionWouldCommit` helper
//   (patchDiffers per member, the clearing siblings joining the
//   compare per the S78-D paint-precedence form).
//
// S112-B — the `crud:` limiter bucket (B-I4, the s111 plan's deferred
//   front, the s112 measured design): crudRateLimit in rate-limit.ts
//   (the `crud:` prefix, 60/5min, riding the same pure checkRate
//   core) wired into the FIVE creation routes (projects POST,
//   duplicate POST, teams POST, members POST, elements POST)
//   immediately after the requireSession gate; the elements PUT is
//   EXCLUDED — the absence is itself the contract (the 800ms-
//   debounced autosave rides the PUT; the measured e2e in-bucket
//   burn is ~31 executions — the page.route interception sites the
//   s112 auditor counted are route MOCKS, not server calls).
//
// S112-C — the board-size write bound + the autosave payload
//   terminal (B92-I1 leg (a) + A-I4): the schema gains a maintained
//   Project.fillImageBytes counter; FILL_IMAGE_PROJECT_LIMIT_BYTES =
//   24_000_000 lands in editor.ts beside ELEMENT_LIMIT (one source
//   shared with the client); the elements POST checks the cumulative
//   bound inside the existing transaction answering the
//   recovery-naming 400; the elements PUT RECOMPUTES the counter on
//   every full-list save (maintenance only — the PUT enforces its
//   own 32 MB body cap, never the 24 MB fillImage bound: the ~30 MB
//   heaviest-legitimate PUT doctrine must survive); the duplicate
//   route seeds the copy's counter; the client commitUpload
//   pre-empts at the upload seam; the autosave machine gains the
//   payloadDeadRef terminal (the same unsaved state never re-uploads;
//   a state change re-arms; the drain's busy predicate exempts the
//   payload-dead state — the S82-B sessionDead form).
//
// S112-D — the three comment-truth repairs (A-I1 + the sticky-wedge
//   honest form + B-I2): the S111-B header's shared verb "re-arm" is
//   loose for the adoption path (its only flag write is a settle — a
//   redundant false write); the validation.ts sticky-wedge note gains
//   the recovery path + the reload-reverts fine print; the verify-nav
//   ninth-check attribution is restored to its BIRTH form (session
//   108 — the s109-audit-b adjudication: a birth attribution is
//   frozen, not a bumpable; the s110 bump falsified it and three
//   derivations carried the wrong form).
//
// S112-E — the per-session pin family (the s112 forms' contracts):
//   the verify-nav s112 contract, the ref-audit s112 provenance
//   anchors, the seo-check s112 fail-loud carried forms, and the
//   standing datum survival pins.

const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const editorLibSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const rateLimitSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/rate-limit.ts"),
  "utf8",
);
const validationSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/validation.ts"),
  "utf8",
);
const schemaSource = readFileSync(
  path.resolve(import.meta.dirname, "../prisma/schema.prisma"),
  "utf8",
);
const projectsRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/route.ts"),
  "utf8",
);
const duplicateRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/duplicate/route.ts"),
  "utf8",
);
const teamsRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/teams/route.ts"),
  "utf8",
);
const membersRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/teams/[id]/members/route.ts"),
  "utf8",
);
const elementsRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
  "utf8",
);
const smokeSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/smoke-test.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s112.sh"),
  "utf8",
);
const refSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s112.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s112.sh"),
  "utf8",
);
const s112Plan = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session112.md"),
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
const panelCollapsed = collapsed(panelSource);
const validationCollapsed = collapsed(validationSource);
const rateLimitCollapsed = collapsed(rateLimitSource);

/** A minimal rectangle DTO for driving the store and the pure helpers.
 * The fill-family fields are carried EXPLICITLY null — the real model
 * (the server rows, the store's elements) always carries them as null,
 * never undefined, and patchDiffers' !== compare treats undefined vs
 * null as a difference (the pin-layer F89 lesson: the fixture must
 * match the model's real shape or the no-op pins lie). */
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
    fillGradient: null,
    fillImage: null,
    fillImageFit: null,
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

describe("S112-A the multi-selection color-guard scope (A-L1 — the headline)", () => {
  it("DEFECT (behavioral): the UNIFY case — picking the row's displayed color on a heterogeneous selection COMMITS (the second member changes)", async () => {
    const { selectionWouldCommit } = await import("@/components/editor/properties-panel");
    const a = { ...rect("a", 0, 0), fill: "#FFFFFF" };
    const b = { ...rect("b", 10, 10), fill: "#000000" };
    // Pre-fix: the guard compares against value (= a.fill = #FFFFFF) and
    // suppresses the commit — b silently stays black.
    expect(selectionWouldCommit([a, b], "#FFFFFF", "fill")).toBe(true);
  });

  it("DEFECT (behavioral): the ALL-SAME no-op — a uniform selection picking the shared value commits NOTHING", async () => {
    const { selectionWouldCommit } = await import("@/components/editor/properties-panel");
    const a = { ...rect("a", 0, 0), fill: "#FFFFFF" };
    const b = { ...rect("b", 10, 10), fill: "#FFFFFF" };
    expect(selectionWouldCommit([a, b], "#FFFFFF", "fill")).toBe(false);
  });

  it("DEFECT (behavioral): the CLEARING-SIBLING join — a member whose fill equals the pick but whose higher-precedence paint would clear still COMMITS", async () => {
    const { selectionWouldCommit } = await import("@/components/editor/properties-panel");
    // The S78-D paint-precedence form: the fill patch carries
    // fillGradient/fillImage null — a member painting a gradient must
    // be seen as changing.
    const a = { ...rect("a", 0, 0), fill: "#FFFFFF", fillGradient: '{"type":"linear"}' };
    const b = { ...rect("b", 10, 10), fill: "#FFFFFF" };
    expect(selectionWouldCommit([a, b], "#FFFFFF", "fill")).toBe(true);
  });

  it("DEFECT (behavioral): the NULL clear — commits iff some member has something to clear", async () => {
    const { selectionWouldCommit } = await import("@/components/editor/properties-panel");
    const filled = { ...rect("a", 0, 0), fill: "#FFFFFF" };
    const unfilled = { ...rect("b", 10, 10), fill: null };
    expect(selectionWouldCommit([filled, unfilled], null, "fill")).toBe(true);
    expect(selectionWouldCommit([unfilled, { ...rect("c", 20, 20), fill: null }], null, "fill")).toBe(false);
  });

  it("DEFECT (behavioral): the STROKE kind — the same selection-scope truth without clearing siblings", async () => {
    const { selectionWouldCommit } = await import("@/components/editor/properties-panel");
    const stroked = { ...rect("a", 0, 0), stroke: "#FFFFFF" };
    const bare = { ...rect("b", 10, 10), stroke: null };
    expect(selectionWouldCommit([stroked, bare], "#FFFFFF", "stroke")).toBe(true);
    expect(selectionWouldCommit([bare, { ...rect("c", 20, 20), stroke: null }], null, "stroke")).toBe(false);
  });

  it("DEFECT (source): HexColorRow carries the optional wouldCommit prop consumed at ALL THREE branch guards", () => {
    // The prop exists on the signature.
    expect(panelSource).toMatch(/wouldCommit\?: \(next: string \| null\) => boolean/);
    // The swatch branch consumes it (the single-value compare becomes
    // the fallback, not the truth).
    expect(panelSource).toMatch(
      /wouldCommit\s*\?\s*wouldCommit\(event\.target\.value\)\s*:\s*event\.target\.value\.toUpperCase\(\)/,
    );
    // The complete-hex branch consumes it.
    expect(panelSource).toMatch(
      /wouldCommit\s*\?\s*wouldCommit\(next\)\s*:\s*next\.toUpperCase\(\) !== \(value \?\? ""\)\.toUpperCase\(\)/,
    );
    // The empty-draft branch consumes it (the clear commits iff some
    // member has something to clear — the value !== null floor is the
    // single-scope fallback only).
    expect(panelSource).toMatch(/wouldCommit \? wouldCommit\(null\) : value !== null/);
  });

  it("DEFECT (source): MultiSelectionSection supplies the selection-scope wouldCommit for BOTH rows", () => {
    const section = panelSource.slice(
      panelSource.indexOf("export function MultiSelectionSection("),
      panelSource.indexOf("export function PropertiesPanel(") > 0
        ? panelSource.indexOf("export function PropertiesPanel(")
        : panelSource.length,
    );
    expect(section.length).toBeGreaterThan(200); // the slice found the section
    // Both rows carry the prop (the Fill row and the Stroke row).
    const fillRows = section.match(/<HexColorRow[\s\S]*?\/>/g) ?? [];
    expect(fillRows.length).toBe(2);
    for (const row of fillRows) {
      expect(row).toMatch(/wouldCommit=/);
    }
    // The Fill row's truth joins the clearing siblings (the S78-D form).
    expect(section).toMatch(/selectionWouldCommit\(selected, (fill|next|stroke|next\)|\w+), "fill"\)|"fill"\)/);
  });

  it("SURVIVAL (source): the single-scope HexColorRow consumers carry NO wouldCommit (the default single-value compare)", () => {
    // The four single-scope consumers: the TEXT section's Color row,
    // the Solid tab's Fill row, the single-selection Stroke row, and
    // the CanvasBackground row. None of them may pass the prop — the
    // S105-A contract is byte-identical for the single scope.
    const solidSection = panelSource.slice(
      panelSource.indexOf('"Solid"'),
      panelSource.indexOf('"Gradient"'),
    );
    expect(solidSection).not.toMatch(/wouldCommit=/);
    const textSection = panelSource.slice(
      panelSource.indexOf("TEXT section"),
      panelSource.indexOf("Transform"),
    );
    expect(textSection).not.toMatch(/wouldCommit=/);
    const bgSection = panelSource.slice(
      panelSource.indexOf("export function CanvasBackgroundSection("),
      panelSource.indexOf("export function MultiSelectionSection("),
    );
    expect(bgSection).not.toMatch(/wouldCommit=/);
  });
});

describe("S112-B the crud: limiter bucket (B-I4 — the s111 deferred front)", () => {
  it("DEFECT (behavioral): crudRateLimit allows 60 creations and refuses the 61st with a retry hint", async () => {
    const { crudRateLimit } = await import("@/lib/rate-limit");
    // Deterministic clock — the shared module bucket is keyed on the
    // dedicated test IP, so no cross-file interference.
    const t0 = 1_000_000;
    for (let i = 1; i <= 60; i += 1) {
      const r = crudRateLimit("192.0.2.112", t0 + i);
      expect(r.allowed).toBe(true); // pre-fix: the export does not exist
    }
    const refused = crudRateLimit("192.0.2.112", t0 + 61);
    expect(refused.allowed).toBe(false);
    expect(refused.retryAfterSeconds).toBeGreaterThanOrEqual(1);
    // A different IP is unaffected (the per-key isolation).
    expect(crudRateLimit("192.0.2.113", t0 + 61).allowed).toBe(true);
  });

  it("DEFECT (source): the crudRateLimit wrapper + constants in rate-limit.ts (the crud: prefix, 60/5min)", () => {
    expect(rateLimitSource).toMatch(/const CRUD_LIMIT = 60;/);
    expect(rateLimitSource).toMatch(/const CRUD_WINDOW_MS = 5 \* 60 \* 1000;/);
    expect(rateLimitSource).toMatch(/export function crudRateLimit\(/);
    expect(rateLimitSource).toMatch(/`crud:\$\{ip\}`/);
  });

  it("DEFECT (source): the wiring present in all FIVE creation routes, after the session gate, before the pre-check/parse", () => {
    const routes: Array<[string, string]> = [
      ["projects POST", projectsRouteSource],
      ["duplicate POST", duplicateRouteSource],
      ["teams POST", teamsRouteSource],
      ["members POST", membersRouteSource],
      ["elements POST", elementsRouteSource],
    ];
    for (const [name, source] of routes) {
      expect(source, name).toMatch(/crudRateLimit\(clientIpOf\(request\.headers\)\)/);
      // After requireSession, before the parse/pre-check: the limiter's
      // index exceeds the session gate's and precedes readBoundedJson
      // (or the duplicate route's loadProject read).
      const sessionIdx = source.indexOf("requireSession()");
      const limitIdx = source.indexOf("crudRateLimit(clientIpOf(request.headers))");
      const parseIdx = source.indexOf("readBoundedJson(request)");
      const readIdx = parseIdx > 0 ? parseIdx : source.indexOf("findUnique({");
      expect(limitIdx, name).toBeGreaterThan(sessionIdx);
      expect(readIdx, name).toBeGreaterThan(limitIdx);
    }
  });

  it("DEFECT (source): the elements PUT carries NO crudRateLimit — the exclusion is the contract (the autosave rides the PUT)", () => {
    const putArm = elementsRouteSource.slice(
      elementsRouteSource.indexOf("export async function PUT("),
    );
    expect(putArm).not.toMatch(/crudRateLimit/);
    expect(putArm).not.toMatch(/clientIpOf/);
  });

  it("DEFECT (source): the 429 envelope carries Retry-After (the auth family's documented contract)", () => {
    // The envelope's two members sit on the same object literal (the
    // five-route uniform form) — the pin's first draft expected them
    // ADJACENT (a comma-joined pair), but the real shape carries the
    // `message:` key between (the F89 pin-layer lesson applied to the
    // pin's own regex: the fixture must match the model's real shape).
    expect(rateLimitCollapsed + collapsed(projectsRouteSource)).toMatch(
      /"Retry-After": String\(limit\.retryAfterSeconds\)/,
    );
    expect(projectsRouteSource).toMatch(
      /code: "RATE_LIMITED", message: "Too many requests\. Try again later\."/,
    );
  });

  it("DEFECT (source): the smoke crud-limiter trio present (the 61st-creation 429 on the dedicated XFF, Retry-After, the RATE_LIMITED code)", () => {
    expect(smokeSource).toMatch(/crud rate limit engages on the 61st creation/);
    expect(smokeSource).toMatch(/the crud 429 carries Retry-After/);
    expect(smokeSource).toMatch(/the crud 429 envelope carries RATE_LIMITED/);
    // The dedicated XFF burn (the S82-D body-cap precedent — the burn
    // never touches the localhost bucket the CRUD checks ride).
    expect(smokeSource).toMatch(/203\.0\.113\.90/);
  });
});

describe("S112-C the board-size write bound + the autosave payload terminal (B92-I1 leg (a) + A-I4)", () => {
  it("DEFECT (behavioral): FILL_IMAGE_PROJECT_LIMIT_BYTES is 24 MB (the shared client/server constant)", async () => {
    const { FILL_IMAGE_PROJECT_LIMIT_BYTES } = await import("@/lib/editor");
    expect(FILL_IMAGE_PROJECT_LIMIT_BYTES).toBe(24_000_000); // pre-fix: absent
  });

  it("DEFECT (source): the schema's maintained Project.fillImageBytes counter with the honest comment", () => {
    expect(schemaSource).toMatch(/fillImageBytes\s+Int\s+@default\(0\)/);
    // The maintained-counter doctrine: the full-list PUT recomputes it
    // on every save (the honest note about pre-column rows reading 0).
    expect(collapsed(schemaSource)).toMatch(/full-list PUT recomputes/);
  });

  it("DEFECT (source): the elements POST checks the cumulative bound INSIDE the transaction BEFORE the create, answering the recovery-naming 400", () => {
    const postArm = elementsRouteSource.slice(
      elementsRouteSource.indexOf("export async function POST("),
      elementsRouteSource.indexOf("export async function PUT("),
    );
    expect(postArm).toMatch(/FILL_IMAGE_PROJECT_LIMIT_BYTES/);
    // The check precedes the create inside the transaction.
    const txIdx = postArm.indexOf("$transaction");
    const boundIdx = postArm.indexOf("FILL_IMAGE_PROJECT_LIMIT_BYTES");
    const createIdx = postArm.indexOf("tx.designElement.create");
    expect(boundIdx).toBeGreaterThan(txIdx);
    expect(createIdx).toBeGreaterThan(boundIdx);
    // The recovery-naming envelope.
    expect(postArm).toMatch(/remove some image/i);
    // The counter increments in the same transaction.
    expect(postArm).toMatch(/fillImageBytes: \{ increment:/);
  });

  it("SURVIVAL (source): the elements PUT does NOT enforce the fillImage bound — the 32 MB body cap subsumes it (the ~30 MB heaviest-legitimate PUT doctrine)", () => {
    const putArm = elementsRouteSource.slice(
      elementsRouteSource.indexOf("export async function PUT("),
    );
    expect(putArm).not.toMatch(/FILL_IMAGE_PROJECT_LIMIT_BYTES/);
  });

  it("DEFECT (source): the elements PUT RECOMPUTES the counter from its in-memory rows on every full-list save", () => {
    const putArm = elementsRouteSource.slice(
      elementsRouteSource.indexOf("export async function PUT("),
    );
    expect(putArm).toMatch(/fillImageBytes: total/);
    expect(putArm).toMatch(/reduce\(/);
  });

  it("DEFECT (source): the duplicate route seeds the copy's counter from source.elements in the same transaction", () => {
    expect(duplicateRouteSource).toMatch(/fillImageBytes:/);
    expect(duplicateRouteSource).toMatch(/source\.elements\.reduce\(/);
  });

  it("DEFECT (source): the client commitUpload pre-empts at the upload seam (the selection-scope aggregate, the guidance toast)", () => {
    // The seam runs from commitUpload (the aggregate pre-emption
    // lives at its head, BEFORE the FileReader continuation) to the
    // readFile helper — the pin's first draft sliced from readFile
    // alone, which starts BELOW the block it pins.
    const uploadSeam = panelSource.slice(
      panelSource.indexOf("const commitUpload ="),
      panelSource.indexOf("const readFile ="),
    );
    expect(uploadSeam).toMatch(/FILL_IMAGE_PROJECT_LIMIT_BYTES/);
    // The live element's own fillImage is EXCLUDED (a re-pick replaces,
    // not adds) — the others-sum form.
    expect(uploadSeam).toMatch(/el\.id === element\.id \? 0 :/);
    expect(uploadSeam).toMatch(/remove an image before adding more/i);
  });

  it("DEFECT (source): the autosave machine's payloadDeadRef terminal (the same-state skip, the state-change re-arm, the one-time guidance toast)", () => {
    // The terminal variable lives in the machine closure beside sessionDead.
    expect(viewSource).toMatch(/let payloadDeadRef[^\n]*= null;/);
    // The flush entry skips the SAME unsaved state (retrying a body the
    // cap will reject again can never succeed).
    expect(viewSource).toMatch(/payloadDeadRef !== null && payloadDeadRef === store\.elements/);
    // The detection rides the smoke-pinned message family.
    expect(viewSource).toMatch(/\/too large\/i/);
    // The one-time guidance toast (the transition form).
    expect(viewSource).toMatch(/payloadDeadRef !== capturedElements/);
    // The drain's busy predicate exempts the payload-dead state (the
    // S82-B sessionDead form — a payload-dead board's "unsaved" is
    // honest-IDLE).
    expect(viewSource).toMatch(
      /!\(payloadDeadRef !== null && payloadDeadRef === useEditorStore\.getState\(\)\.elements\)/,
    );
    // A successful flush clears the terminal (the recovery path —
    // deleting image elements resumes saving).
    expect(viewSource).toMatch(/payloadDeadRef = null;/);
  });

  it("DEFECT (source): the smoke fillImage pair present (the 34th under the bound succeeds; the 35th answers the recovery 400)", () => {
    expect(smokeSource).toMatch(/34 max-length image elements fit under the aggregate bound/);
    expect(smokeSource).toMatch(/the 35th image element answers the recovery-naming 400/);
    // The burn rides its own XFF identity (never the localhost bucket).
    expect(smokeSource).toMatch(/203\.0\.113\.91/);
  });
});

describe("S112-D the three comment-truth repairs (A-I1 + the sticky-wedge form + B-I2)", () => {
  it("DEFECT (source): the four-family header's shared verb is SPLIT — the adoption path SETTLES the flag (a redundant false write), it does not re-arm it", () => {
    // The falsified shared-verb form is absent from the collapsed view.
    expect(viewCollapsed).not.toMatch(
      /the adoption path both re-arm the loading flag/,
    );
    // The honest verb-split form is present (the adoption settle named).
    expect(viewCollapsed).toMatch(/the adoption path settles/);
    expect(viewCollapsed).toMatch(/redundant false write/);
  });

  it("DEFECT (source): the validation.ts sticky-wedge note carries the recovery path + the reload-reverts fine print", () => {
    expect(validationCollapsed).toMatch(/crosses back under/);
    expect(validationCollapsed).toMatch(/reload/);
  });

  it("DEFECT (source): the verify-nav ninth-check attribution is RESTORED to its birth form (session 108 — a birth attribution is not a bumpable)", () => {
    // The wrong-bumped form (carried by three derivations since s110)
    // is absent.
    expect(navSource).not.toMatch(/session 109's standing form enumerates it as the ninth/);
    // The birth attribution is restored.
    expect(navSource).toMatch(/session 108's standing form enumerates it as the ninth/);
  });
});

describe("S112-E the per-session pin family (the s112 forms' contracts)", () => {
  it("SURVIVAL (source): the verify-nav s112 contract (the 89th ordinal, the S111-delivery descriptor, the nav112 session, the 9-check enumeration, the fail-loud triple, zero nav111 residue)", () => {
    expect(navSource).toMatch(/session 112 — the clone's mobile navigation contract/);
    expect(navSource).toMatch(/the 89th consecutive session/);
    expect(navSource).toMatch(/the S111 delivery 2ee2e97 \+ the S112 remediation/);
    expect(navSource).toMatch(/--session nav112/);
    expect(navSource).toMatch(/digma-nav112\.log/);
    expect(navSource).toMatch(/89th session, S112-cycle/);
    // The fail-loud triple.
    expect(navSource).toMatch(/pkill -f "standalone\/server\.js"/);
    expect(navSource).toMatch(/something already answers :3000/);
    expect(navSource).toMatch(/the nav server never came up/);
    // The hermetic boot strip.
    expect(navSource).toMatch(/env -u DIGMA_PROXY_HOPS -u DIGMA_DISABLE_IN_APP_RESET/);
    // Zero nav111 session-name residue.
    expect(navSource).not.toMatch(/--session nav111/);
  });

  it("SURVIVAL (source): the ref-audit s112 provenance anchors (the 88th ordinal, the s122 evidence, the live112 session, the 49th@88th clip ordinal, the S111 delivery descriptor)", () => {
    expect(refSource).toMatch(/Session 112 — the 88th reference audit/);
    expect(refSource).toMatch(/the S111 delivery at HEAD 2ee2e97 \+ the session_189\/190\/191 log pushes/);
    expect(refSource).toMatch(/ref-audit-s122/);
    expect(refSource).toMatch(/--session live112/);
    expect(refSource).toMatch(/the 49th/);
    expect(refSource).toMatch(/consecutive session at the 88th audit/);
    // Zero Session-111 leftovers in the bumpable positions.
    expect(refSource).not.toMatch(/87th reference audit/);
    expect(refSource).not.toMatch(/--session live111/);
  });

  it("SURVIVAL (source): the seo-check s112 fail-loud carried forms", () => {
    expect(seoSource).toMatch(/Session 112 — the per-session SEO runtime-delivery check/);
    expect(seoSource).toMatch(/digma-seo-s112\.log/);
    expect(seoSource).toMatch(/session 112, S112-cycle/);
    // The fail-loud quartet.
    expect(seoSource).toMatch(/port \$SEO_PORT already answers/);
    expect(seoSource).toMatch(/the SEO server never came up/);
    expect(seoSource).toMatch(/\[ "\$FAIL" = "0" \] \|\| exit 1/);
  });

  it("SURVIVAL (source): the standing datum survival pins (the clip datum + the nav datum byte-identical)", () => {
    expect(refSource).toMatch(/Share:L385-R458,Present:L466-R551/);
    expect(refSource).toMatch(/nav=\[124x36,96x36,92x36\]/);
  });

  it("SURVIVAL (source): the s112 plan exists and records the audit + the execution boxes", () => {
    expect(s112Plan).toMatch(/Session 112 \(the Sixtieth Audit\)/);
    expect(s112Plan).toMatch(/0 Critical \/ 0 High \/ 0 Medium \/ 2 Low \/ 8 Informational/);
    expect(s112Plan).toMatch(/B-L1 \(Low — REJECTED by lead verification, the F99 lesson\)/);
    expect(s112Plan).toMatch(/FILL_IMAGE_PROJECT_LIMIT_BYTES = 24_000_000/);
  });

  it("SURVIVAL (source): the S111 seams stay intact (the net-zero guard + the value-based moved flag + the invite dedup)", () => {
    // The S111-A guard survives S112 untouched.
    expect(storeSource).toMatch(/snapshotsEqual\(state\.gestureSnapshot, snapshotOf\(state\)\)/);
    expect(storeSource).toMatch(/nx !== el\.x \|\| ny !== el\.y/);
    // The S111-D dedup survives.
    expect(schemaSource).toMatch(/@@unique\(\[teamId, email\]\)/);
    expect(validationSource).toMatch(/export function normalizeEmail\(/);
    expect(membersRouteSource).toMatch(/already on the team/);
  });
});
