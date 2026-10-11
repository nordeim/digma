import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

import { useEditorStore, type EditorSnapshot } from "@/components/editor/editor-store";
import type { DesignElementDTO } from "@/lib/editor";

// The session-114 spec (the sixty-second audit's chosen work):
//
// S114-A — the thumb channel joins the cumulative bound (B114-M1, the
//   headline): the S113-D codec added fillImageThumb with a 200K-char
//   clamp ceiling but the S112-C cumulative bound counted only the
//   full fill — the POST's addBytes, the PUT recompute, the duplicate
//   seed, and the client's aggregate pre-emption all summed fillImage
//   alone, so a scripted client could stack ~200K thumb chars per row
//   across image-less rows (addBytes 0 — the 24 MB check never trips)
//   into hundreds of MB of un-counted stored bytes per board. The
//   schema note justified the exclusion with the 32 MB body cap — a
//   PER-REQUEST bound standing in for the CUMULATIVE bound the
//   counter exists to enforce. The fix: the thumb length joins every
//   sum; the counter's note states the honest includes-form; the
//   heaviest-legitimate element ceiling moves ~34 -> ~32 (each
//   heaviest element now carries its thumb beside its fill).
//
// S114-B — the restoreSnapshot net-zero guard (A114-L1): the no-op
//   commit family's eleventh arm. Every sibling mutation action
//   carries a would-change guard (the S109-A id-match pair, the
//   S110-A trio + floors, the S111-A gesture seam) — restoreSnapshot
//   pushed past unconditionally: an AI reply's Revert, reached again
//   by undoing the apply's commits, landed an IDENTICAL-value
//   snapshot in history (the next Ctrl+Z visibly did nothing, redo
//   wiped, the badge flipped, the autosave PUT a byte-identical
//   list). The S110-A census had classified the arm "by-definition
//   real" — falsified by the constructible window (the F97 class).
//   The fix rides the S111-A snapshotsEqual seam.
//
// S114-C — the thumbnailFor small-source guard (A114-L2): a source
//   already at or under the 320px thumb dimension got k=1 — a full
//   canvas re-encode stored as a SECOND near-identical copy (JPEG
//   generation loss included), doubling the small-image board's
//   editor payloads with zero list-projection benefit. An
//   already-small source IS its own thumb (the graceful legacy
//   fallback ships it in the fillImage slot at the same size). The
//   fix answers null above the intrinsic-size check.
//
// S114-D — the LLM duration bound + the comment truth (A114-I1 +
//   B114-L4): the SDK call carried no timeout (the SDK's fetch
//   passes no signal), maxDuration=60 is the serverless hint the
//   standalone server ignores, and the client's 30s abort recovers
//   the panel but not the server handler — while rate-limit.ts's
//   own comment asserted "up to 60s of held server work" as if a
//   mechanism enforced it. The fix: LLM_REQUEST_TIMEOUT_MS = 25_000
//   (5s inside the client's abort so the fallback arrives usable)
//   races the SDK call, the rejection lands in the existing catch ->
//   the deterministic fallback answers, the timer clears in a
//   finally; the comment states the honest arithmetic.
//
// S114-E — the fine prints + the per-session family (B114-L1 +
//   B114-L2 + B114-L3 + B114-I2 + the s114 forms): the smoke thumb
//   pair's null-grep could not discriminate the projection's
//   thumb-nulling half (a copy-not-move regression kept it green
//   while doubling the thumb wire cost — the ! grep '"data:' arm
//   closes it); normalize-member-emails's header claimed a
//   DEPLOYMENT.md reference that did not exist (the upgrade note
//   becomes real); the one-shot's $transaction carries the route
//   family's { timeout: 30_000 } doctrine; the resend-otp route doc
//   names the OTP suppression knob beside its in-response delivery.

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const editorLibSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const elementsRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
  "utf8",
);
const duplicateRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/duplicate/route.ts"),
  "utf8",
);
const schemaSource = readFileSync(
  path.resolve(import.meta.dirname, "../prisma/schema.prisma"),
  "utf8",
);
const aiRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/ai-assistant/route.ts"),
  "utf8",
);
const rateLimitSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/rate-limit.ts"),
  "utf8",
);
const smokeSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/smoke-test.sh"),
  "utf8",
);
const deploymentSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/DEPLOYMENT.md"),
  "utf8",
);
const normalizeScriptSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/normalize-member-emails.ts"),
  "utf8",
);
const resendOtpSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/resend-otp/route.ts"),
  "utf8",
);
const nav114Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s114.sh"),
  "utf8",
);
const refAudit114Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s114.sh"),
  "utf8",
);
const seo114Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s114.sh"),
  "utf8",
);

/** The comment-stripped collapsed view (the F89/F100 form: line
 * prefixes stripped BEFORE the join so multi-line targets stay
 * visible; the receiver-prefixed code forms discriminate code from
 * the repair's own prose). */
function collapsed(source: string): string {
  return source
    .split("\n")
    .map((l) => l.replace(/^\s*(?:\/\/|#)\s?/, "").trim())
    .filter((l) => l.length > 0)
    .join(" ")
    .replace(/\s+/g, " ");
}

const panelCollapsed = collapsed(panelSource);
const storeCollapsed = collapsed(storeSource);
const elementsCollapsed = collapsed(elementsRouteSource);
const duplicateCollapsed = collapsed(duplicateRouteSource);
const schemaCollapsed = collapsed(schemaSource);
const aiRouteCollapsed = collapsed(aiRouteSource);
const rateLimitCollapsed = collapsed(rateLimitSource);
const normalizeCollapsed = collapsed(normalizeScriptSource);
const resendOtpCollapsed = collapsed(resendOtpSource);

/** A minimal rectangle DTO for driving the store (the F89 fixture
 * lesson: the fill-family fields carried EXPLICITLY null — the real
 * model never carries undefined). */
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
    fillImageThumb: null,
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

describe("S114-A the thumb channel joins the cumulative bound (B114-M1 — the headline)", () => {
  it("DEFECT (source): the elements POST's addBytes sums BOTH fill families", () => {
    // Session 117 re-anchor (S117-A / B117-M1, the F89 form with
    // provenance): the sixty-fifth audit's headline folded the
    // two-term form into the ONE shared rowStoredBytes seam — the
    // non-fill free-text members (text/name/fillGradient at their
    // JSON-escaped wire lengths) join both fill families. The
    // both-fill-families claim survives INSIDE the seam.
    expect(elementsCollapsed).toMatch(/const addBytes = rowStoredBytes\(row\);/);
    expect(editorLibSource).toMatch(
      /row\.fillImage != null \? row\.fillImage\.length : 0[\s\S]*row\.fillImageThumb != null \? row\.fillImageThumb\.length : 0/,
    );
  });

  it("DEFECT (source): the PUT recompute's reduce sums BOTH fill families", () => {
    // Session 117 re-anchor (S117-A): the reduce rides the shared
    // rowStoredBytes seam — the census carries both fill families
    // plus the non-fill free-text members.
    expect(elementsCollapsed).toMatch(/const total = rows\.reduce\(\(sum, r\) => sum \+ rowStoredBytes\(r\), 0\);/);
  });

  it("DEFECT (source): the duplicate route's counter seed sums BOTH fill families", () => {
    // Session 117 re-anchor (S117-A): the seed rides the shared
    // rowStoredBytes seam.
    expect(duplicateCollapsed).toMatch(
      /fillImageBytes: source\.elements\.reduce\(\(sum, el\) => sum \+ rowStoredBytes\(el\), 0\),/,
    );
  });

  it("DEFECT (source): the client's aggregate pre-emption counts others' thumbs AND the incoming thumb", () => {
    // Session 117 re-anchor (S117-A): the client's mirror rides the
    // same shared rowStoredBytes seam — the others' reduce and the
    // projected post-upload row (the incoming pair + the surviving
    // text/name members; the upload patch clears fillGradient).
    expect(panelCollapsed).toMatch(
      /const othersBytes = useEditorStore\.getState\(\)\.elements\.reduce\( \(sum, el\) => sum \+ \(el\.id === element\.id \? 0 : rowStoredBytes\(el\)\), 0, \);/,
    );
    expect(panelCollapsed).toMatch(
      /const incomingBytes = rowStoredBytes\(\{ \.\.\.selfRow, fillImage, fillImageThumb, fillGradient: null \}\);/,
    );
    expect(panelCollapsed).toMatch(
      /if \(othersBytes \+ incomingBytes > FILL_IMAGE_PROJECT_LIMIT_BYTES\) \{/,
    );
  });

  it("DEFECT (source): the schema note states the honest includes-form (the counter measures the stored fill-family payload)", () => {
    expect(schemaCollapsed).toMatch(/fillImage \+ fillImageThumb/);
    expect(schemaCollapsed).toMatch(/S114-A/);
  });

  it("SURVIVAL (source): the bound constant and the recovery envelope unchanged", () => {
    expect(editorLibSource).toMatch(/FILL_IMAGE_PROJECT_LIMIT_BYTES = 24_000_000/);
    expect(elementsRouteSource).toMatch(/overImageCap/);
    expect(elementsCollapsed).toMatch(/fillImageBytes: \{ increment:/);
    expect(elementsCollapsed).toMatch(/fillImageBytes: total/);
    expect(elementsCollapsed).toMatch(/This board's images are too large — remove some image fills before adding more/);
  });

  it("SURVIVAL (source): the legacy zero-counter x POST intersection phrase stays (the B-I4 pin family)", () => {
    expect(schemaCollapsed).toMatch(/legacy zero-counter x POST intersection/i);
  });
});

describe("S114-B the restoreSnapshot net-zero guard (A114-L1)", () => {
  it("DEFECT (source): the arm consults the S111-A snapshotsEqual seam before committing", () => {
    const idx = storeSource.indexOf("restoreSnapshot: (snapshot)");
    expect(idx).toBeGreaterThan(0);
    const arm = storeSource.slice(idx, idx + 1700);
    // The F100 length floor — the slice must carry the whole arm.
    expect(arm.length).toBeGreaterThan(300);
    expect(arm).toMatch(/snapshotsEqual\(snapshotOf\(state\), snapshot\)/);
    expect(arm).toMatch(/return \{\};/);
  });

  it("DEFECT (behavioral): an identical-value restore is a no-op — no inert snapshot, redo preserved, no phantom badge", () => {
    const s = useEditorStore.getState();
    const identical: EditorSnapshot = {
      elements: s.elements.map((el) => ({ ...el })),
      backgroundColor: s.backgroundColor,
    };
    useEditorStore.getState().restoreSnapshot(identical);
    const after = useEditorStore.getState();
    expect(after.past.length).toBe(0);
    expect(after.future.length).toBe(0);
    expect(after.saveState).toBe("saved");
    expect(after.elements.length).toBe(2);
  });

  it("SURVIVAL (behavioral): a genuinely different restore still commits (the undoable-restore contract, session 27)", () => {
    const different: EditorSnapshot = {
      elements: [rect("a", 60, 80)],
      backgroundColor: "#FFFFFF",
    };
    useEditorStore.getState().restoreSnapshot(different);
    const after = useEditorStore.getState();
    expect(after.past.length).toBe(1);
    expect(after.elements.length).toBe(1);
    expect(after.backgroundColor).toBe("#FFFFFF");
    expect(after.saveState).toBe("unsaved");
  });

  it("SURVIVAL (source): the past-push, the redo wipe, and the selection filter keep their shapes", () => {
    const idx = storeSource.indexOf("restoreSnapshot: (snapshot)");
    const arm = storeSource.slice(idx, idx + 1700);
    expect(arm).toMatch(/past: \[\.\.\.state\.past, snapshotOf\(state\)\]\.slice\(-60\)/);
    expect(arm).toMatch(/future: \[\]/);
    expect(arm).toMatch(/selectedIds: state\.selectedIds\.filter\(\(id\) => snapshot\.elements\.some\(\(el\) => el\.id === id\)\)/);
  });

  it("SURVIVAL (source): undo/redo keep their empty-stack and traversal forms (no collateral)", () => {
    expect(storeCollapsed).toMatch(/if \(state\.past\.length === 0\) return state;/);
    expect(storeCollapsed).toMatch(/if \(state\.future\.length === 0\) return state;/);
  });
});

describe("S114-C the thumbnailFor small-source guard (A114-L2)", () => {
  it("DEFECT (source): a source at or under the thumb dimension answers null (an already-small source IS its own thumb)", () => {
    const longestIdx = panelSource.indexOf("const longest = Math.max(w, h);");
    expect(longestIdx).toBeGreaterThan(0);
    // Session 115 (S115-C / A115-I1 — the F89 re-anchor): the k-form
    // anchor follows the simplified ratio (the ternary's false-arm
    // died with the guard above it).
    const kIdx = panelSource.indexOf("const k = THUMB_MAX_DIM / longest;", longestIdx);
    // The F100 closeIdx-greater floor — the zone must be a real slice.
    expect(kIdx).toBeGreaterThan(longestIdx);
    const guardZone = panelSource.slice(longestIdx, kIdx);
    expect(guardZone).toMatch(/if \(longest <= THUMB_MAX_DIM\) return null;/);
  });

  it("SURVIVAL (source): the intrinsic-size check, the k-form, the family-encoding rule, and the catch-null intact", () => {
    const idx = panelSource.indexOf("async function thumbnailFor");
    expect(idx).toBeGreaterThan(0);
    const body = panelSource.slice(idx, idx + 2400);
    expect(body.length).toBeGreaterThan(600);
    expect(body).toMatch(/if \(w <= 0 \|\| h <= 0\) return null;/);
    // Session 115 (S115-C / A115-I1 — the F89 re-anchor): the ternary's
    // false-arm died with the S114-C guard above it — the honest k is
    // the plain ratio, re-anchored here from the delivered
    // `longest > THUMB_MAX_DIM ? THUMB_MAX_DIM / longest : 1` form.
    expect(body).toMatch(/const k = THUMB_MAX_DIM \/ longest;/);
    expect(body).not.toMatch(/longest > THUMB_MAX_DIM \? THUMB_MAX_DIM \/ longest : 1/);
    expect(body).toMatch(/canvas\.toDataURL\("image\/jpeg", 0\.85\)/);
    expect(body).toMatch(/canvas\.toDataURL\("image\/png"\)/);
    expect(body).toMatch(/catch \{[\s\S]*?return null;/);
  });

  it("SURVIVAL (source): THUMB_MAX_DIM stays 320 and the codec doctrine comment survives", () => {
    expect(panelSource).toMatch(/const THUMB_MAX_DIM = 320;/);
    expect(panelSource).toMatch(/the thumb is an optimization, never a block/);
  });
});

describe("S114-D the LLM duration bound + the comment truth (A114-I1 + B114-L4)", () => {
  it("DEFECT (source): the route carries LLM_REQUEST_TIMEOUT_MS at 25s (5s inside the client's 30s abort)", () => {
    expect(aiRouteSource).toMatch(/const LLM_REQUEST_TIMEOUT_MS = 25_000;/);
  });

  it("DEFECT (source): the SDK call rides the Promise.race with the rejection timer", () => {
    expect(aiRouteCollapsed).toMatch(
      /const completion = await Promise\.race\(\[\s*zai\.chat\.completions\.create\(/,
    );
    expect(aiRouteCollapsed).toMatch(
      /new Promise<never>\(\(_, reject\) => \{\s*llmTimer = setTimeout\(\s*\(\) => reject\(new Error\("LLM request exceeded the 25s bound"\)\),\s*LLM_REQUEST_TIMEOUT_MS,\s*\);/,
    );
  });

  it("DEFECT (source): the timer clears in a finally on every exit", () => {
    expect(aiRouteCollapsed).toMatch(/\} finally \{\s*if \(llmTimer\) clearTimeout\(llmTimer\);/);
  });

  it("DEFECT (source): the rate-limit comment's honest amendment (the 25s mechanism, the serverless-only scope of maxDuration)", () => {
    expect(rateLimitCollapsed).toMatch(/bounded at 25s by the route's own LLM_REQUEST_TIMEOUT_MS/);
    // The false claim is GONE (comment-truth: no asserted bound without
    // a mechanism).
    expect(rateLimitCollapsed).not.toMatch(/up to 60s of held server work/);
  });

  it("SURVIVAL (source): the degrade-not-fail doctrine intact — the 64KB cap, the catch-fallback, maxDuration stays", () => {
    expect(aiRouteSource).toMatch(/export const maxDuration = 60;/);
    expect(aiRouteCollapsed).toMatch(/\.slice\(0, 65_536\)/);
    expect(aiRouteCollapsed).toMatch(/console\.warn\("\[ai-assistant\] LLM path failed, using deterministic fallback:"/);
    expect(aiRouteCollapsed).toMatch(/return ok\(\{ reply: command\.reply, operations: command\.operations \}\);/);
  });
});

describe("S114-E the fine prints + the per-session family (B114-L1 + B114-L2 + B114-L3 + B114-I2 + the s114 forms)", () => {
  it("DEFECT (source): the smoke thumb pair's second check discriminates the thumb-nulling half", () => {
    expect(smokeSource).toMatch(/&& ! echo "\$THUMB_LIST" \| grep -q '"fillImageThumb":"data:'/);
  });

  it("DEFECT (source): DEPLOYMENT.md carries the real upgrade note for pre-S111 databases", () => {
    expect(deploymentSource).toMatch(/normalize-member-emails/);
    expect(deploymentSource).toMatch(/--dry-run/);
  });

  it("DEFECT (source): the one-shot's transaction carries the route family's timeout doctrine", () => {
    expect(normalizeCollapsed).toMatch(/\}, \{ timeout: 30_000 \},\s*\);/);
  });

  it("DEFECT (source): the resend-otp ROUTE DOC names the OTP suppression knob beside the in-response delivery", () => {
    // The knob already names itself at the delivery site (:104-106) —
    // B114-I2's fine print is the ROUTE DOC block (lines ~9-16) carrying
    // "The code travels in the response" with no knob mention. The pin
    // slices the doc block only (the F100 closeIdx-greater floor).
    const docStart = resendOtpSource.indexOf("POST /api/auth/resend-otp");
    expect(docStart).toBeGreaterThan(0);
    const fnIdx = resendOtpSource.indexOf("export async function POST", docStart);
    expect(fnIdx).toBeGreaterThan(docStart);
    const docBlock = resendOtpSource.slice(docStart, fnIdx);
    expect(docBlock).toMatch(/DIGMA_DISABLE_IN_APP_OTP/);
  });

  it("SURVIVAL (source): the one-shot's dedup-first policy and the NULL/empty guard intact", () => {
    expect(normalizeCollapsed).toMatch(/--dry-run/);
    expect(normalizeCollapsed).toMatch(/earliest createdAt survivor/i);
    expect(normalizeCollapsed).toMatch(/NULL and empty-string emails stay untouched/i);
    expect(normalizeScriptSource).toMatch(/normalizeEmail/);
    expect(normalizeScriptSource).toMatch(/\$transaction/);
  });

  it("SURVIVAL (source): the verify-nav s114 contract — the 91st ordinal, the S113-delivery descriptor, the nav114 session", () => {
    expect(nav114Source).toMatch(/91st consecutive session/);
    expect(nav114Source).toMatch(/the S113 delivery 1bfade5 \+ the S114 remediation/);
    expect(nav114Source).toMatch(/--session nav114/);
    expect(nav114Source).toMatch(/digma-nav114\.log/);
    // The birth attribution stays frozen at session 108 (the S111-C
    // B-L1 lesson — a historical attribution is not a bumpable).
    expect(nav114Source).toMatch(/born at\s+s108|born at session 108|enumeration was born at/i);
  });

  it("SURVIVAL (source): the ref-audit s114 provenance anchors — the 90th form, the 51st consecutive clip ordinal", () => {
    expect(refAudit114Source).toMatch(/90th reference audit/);
    expect(refAudit114Source).toMatch(/the S113 delivery at HEAD 1bfade5 \+ the session_193\/194 log pushes/);
    expect(refAudit114Source).toMatch(/byte-identical the 51st/);
    expect(refAudit114Source).toMatch(/consecutive session at the 90th audit/);
    expect(refAudit114Source).toMatch(/--session live114/);
    expect(refAudit114Source).toMatch(/ref-audit-s124/);
  });

  it("SURVIVAL (source): the seo-check s114 fail-loud form carried", () => {
    expect(seo114Source).toMatch(/session 114, S114-cycle/);
    expect(seo114Source).toMatch(/digma-seo-s114\.log/);
  });

  it("SURVIVAL (source): the standing datums — the 1526/175/73/262 count family at the claim sites", () => {
    // The count family re-anchors AFTER the delivery (the run-output
    // truth); at RED time the standing constants are the S113
    // delivery's own.
    expect(editorLibSource).toMatch(/FILL_IMAGE_THUMB_MAX_CHARS = 200_000/);
    expect(schemaSource).toMatch(/fillImageThumb\s+String\?/);
  });
});
