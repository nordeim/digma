import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-107 spec (the fifty-fifth audit's chosen work):
//
// S107-A — the upload guard's live-state read (A-I1, the headline): the
//   F90–F93 no-op family closed every INPUT CHANNEL through the
//   patchDiffers seam — but the upload channel's guard compares against
//   a SNAPSHOT. commitUpload closes over the render-time `element`
//   prop, and the FileReader + downscaleDataUrl continuation lands
//   after an async window during which a fill change on the SAME
//   element (a gradient applied, a color picked through a sibling tab)
//   is invisible to the guard: patchDiffers(element, patch) evaluates
//   its truth against the PAST — mis-evaluating both directions (a
//   re-pick that differs from the LIVE state bails; a re-pick
//   identical to the LIVE state commits as a no-op). Every sibling
//   commit in the panel is synchronous per-render; this is the one
//   async seam. The guard now re-derives the LIVE element at commit
//   time through the panel's own subscription seam
//   (useEditorStore.getState().elements.find(…)), the stale prop
//   demoted to the id lookup + the delete-mid-window fallback.
//
// S107-B — the dead-export twin unexport (B-L2): `export type Bounds`
//   (editor.ts:607) and `export type RateLimitResult`
//   (rate-limit.ts:8) have zero external consumers — both are
//   self-consumed solely as internal annotations of their modules'
//   exported functions. Exactly the shape S104-I/S105-C unexported
//   (ShortcutHelpItem, ElementStyle, LlmOperation, SaveState, Toast,
//   ParsedSession, BoundedJson, EXPORT_SCALE) — these two escaped both
//   censuses.
//
// S107-C — the count-truth repairs (B-L1 + A-L1): "requireSession()
//   first at all 14 guarded handlers" is a miscount — the live tree
//   carries SIXTEEN await requireSession() call sites (the count
//   regressed through the records 16 → 15 → unnumbered → 14 while the
//   tree stayed at 16, cross-contaminated with the true 14-site
//   readBoundedJson census named in the same sentence); and the
//   session-105 plan's helper attribution says "the guardedUpdate
//   helper at the twelve number-field consumers" — the helper serves
//   ELEVEN (the twelfth number field, the gradient stop position,
//   rides its own inline patchDiffers seam, listed separately in the
//   same sentence — the totals stay thirteen guards).
//
// S107-D — the script fold (B-L3 + B-I2): the derived
//   ref-audit-s107.sh left four provenance comments un-bumped ("Session
//   106 (S106 derivation of the S105-E form …)" while the same lines'
//   numbers moved — the B-L2-ordinal family inside the same comment);
//   and verify-nav-s107.sh carries no automated pin of its own yet —
//   the per-session pin lands here (the ordinal/descriptor/session/
//   log-file/9-check-enumeration contract).
//
// The S107 delivered counts — this file's 13 pins grow the suite
// 1369 -> 1382 unit / 168 -> 169 files (the F68/F70 discipline: the
// constants ride the count family's live anchor — the PAD §7.1
// Unit-total row — so the whole family moves together in the same
// commit).
const UNIT = "1408";
const FILES = "171";

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

const PANEL = src("src/components/editor/properties-panel.tsx");
const EDITOR_LIB = src("src/lib/editor.ts");
const RATE_LIMIT = src("src/lib/rate-limit.ts");
const PLAN_105 = src("docs/remediation-plan-session105.md");
const PLAN_106 = src("docs/remediation-plan-session106.md");
const WORKLOG = src("worklog.md");
const REF_AUDIT_107 = src("scripts/ref-audit-s107.sh");
const NAV_SCRIPT_107 = src("scripts/verify-nav-s107.sh");

/** The rendered window of a named function component in the panel source. */
function componentWindow(name: string): string {
  const start = PANEL.indexOf(`function ${name}(`);
  expect(start).toBeGreaterThan(-1);
  const next = PANEL.indexOf("\nfunction ", start + 1);
  return PANEL.slice(start, next === -1 ? undefined : next);
}

/** The commitUpload helper body inside the ImagePanel window. */
function commitUploadHelper(): string {
  const w = componentWindow("ImagePanel");
  const helper = w.match(/const commitUpload = \(fillImage: string\) => \{[\s\S]*?\n  \};/);
  expect(helper).not.toBeNull();
  return helper![0];
}

describe("S107-A the upload guard's live-state read (A-I1 — the headline, the family's temporal member)", () => {
  it("DEFECT: the guard re-derives the LIVE element at commit time (the store read)", () => {
    // RED pre-fix: the helper read only the render-time `element` prop
    // — `if (patchDiffers(element, patch)) update(patch)` — comparing
    // against the state at RENDER time, not the state at COMMIT time.
    // The FileReader + downscaleDataUrl continuation lands after an
    // async window; the guard must read the store the same way the
    // panel's own gesture seams do (useEditorStore.getState()).
    const helper = commitUploadHelper();
    const liveIdx = helper.indexOf("useEditorStore.getState().elements.find");
    const guardIdx = helper.indexOf("patchDiffers(");
    expect(liveIdx).toBeGreaterThan(-1);
    expect(guardIdx).toBeGreaterThan(-1);
    expect(liveIdx).toBeLessThan(guardIdx);
    // the id comes from the (possibly stale) prop — the STATE from the
    // store. The lookup is by id, never by array position.
    expect(helper).toMatch(/elements\.find\(\(el\) => el\.id === element\.id\)/);
  });

  it("DEFECT: the compare target is the live element, not the render-time prop", () => {
    // RED pre-fix: `patchDiffers(element, patch)` — the stale-prop
    // compare. The fix's form: the found live element feeds the guard;
    // the stale-prop form is gone from the helper entirely.
    const helper = commitUploadHelper();
    expect(helper).toMatch(/patchDiffers\(live, patch\)/);
    expect(helper).not.toContain("patchDiffers(element, patch)");
  });

  it("DEFECT: the delete-mid-window fallback preserves the stale prop as the floor", () => {
    // RED pre-fix: no fallback existed (none was needed — the prop was
    // the only read). When the element is deleted inside the decode
    // window the find returns undefined; the `?? element` fallback
    // keeps the guard's compare well-defined (patchDiffers sees the
    // last-known row, the patch differs, and update() no-ops on the
    // missing id through the store's own membership scan — the same
    // behavior the pre-fix form carried).
    const helper = commitUploadHelper();
    expect(helper).toMatch(/\?\? element;/);
  });

  it("SURVIVAL: both branches still route through the ONE guarded helper (the S106-A contract)", () => {
    // The S106-A closure must survive the S107-A hardening untouched:
    // the downscale success AND the decode-failure fallback both call
    // commitUpload; the patch stays the WHOLE sibling-clearing unit
    // (the fill-paint precedence doctrine); no raw update() survives
    // inside the continuation itself.
    const w = componentWindow("ImagePanel");
    expect(w).toMatch(/\.then\(\(stored\) => commitUpload\(stored\)\)/);
    expect(w).toMatch(/\.catch\(\(\) => commitUpload\(dataUrl\)\)/);
    const cont = w.match(/downscaleDataUrl\(dataUrl\)[\s\S]*?\}\);/);
    expect(cont).not.toBeNull();
    expect(cont![0]).not.toMatch(/update\(\{/);
    const helper = commitUploadHelper();
    expect(helper).toMatch(/const patch = \{ fillImage, fillGradient: null, fillImageFit: null \};/);
    expect(helper).toMatch(/setBusy\(false\)/);
  });

  it("SURVIVAL: the upload's own ride-ON contracts + the panel census stay TEN", () => {
    // The busy-flag re-entry gate, the 500 KB cap, and the five-family
    // whitelist are the contracts the live read rides ON — untouched.
    // The patchDiffers census stays TEN (the guard still calls the
    // seam; the compare TARGET changes, not the call).
    const w = componentWindow("ImagePanel");
    expect(w).toMatch(/if \(!file \|\| busy\) return;/);
    expect(w).toMatch(/500 \* 1024/);
    // the whitelist's own regex form: jpe?g (not jpeg|jpg) and the
    // escaped-plus svg\+xml — the s106 pin-design repair's form.
    expect(w).toMatch(/data:image\\\/\(png\|jpe\?g\|gif\|svg\\\+xml\|webp\);base64,/);
    const guarded = PANEL.match(/patchDiffers\(/g);
    expect(guarded?.length).toBe(10);
  });
});

describe("S107-B the dead-export twin unexport (B-L2 — the S104-I/S105-C family's surviving members)", () => {
  it("DEFECT: the Bounds type unexports with its internal annotations surviving", () => {
    // RED pre-fix: `export type Bounds = { … }` (editor.ts:607) with
    // zero external consumers — self-consumed solely as the return
    // annotation of boundsOf (:625) and the parameter annotation of
    // fitToBounds (:676). The S104-I/S105-C unexport form: the export
    // keyword drops, the type + its annotations survive verbatim.
    expect(EDITOR_LIB).not.toMatch(/export type Bounds/);
    expect(EDITOR_LIB).toMatch(/\ntype Bounds = \{ minX: number; minY: number; maxX: number; maxY: number \};/);
    expect(EDITOR_LIB).toContain("): Bounds | null {");
    expect(EDITOR_LIB).toContain("bounds: Bounds | null,");
  });

  it("DEFECT: the RateLimitResult type unexports with its three annotations surviving", () => {
    // RED pre-fix: `export type RateLimitResult = { … }`
    // (rate-limit.ts:8) with zero external consumers — self-consumed
    // as the return annotations of the bucket probe (:33) and both
    // exported limiter entry points (:71/:88). The same unexport form.
    expect(RATE_LIMIT).not.toMatch(/export type RateLimitResult/);
    expect(RATE_LIMIT).toMatch(/\ntype RateLimitResult = \{/);
    expect(RATE_LIMIT).toContain("): RateLimitResult {");
    expect(RATE_LIMIT).toContain("): RateLimitResult {");
    const count = (RATE_LIMIT.match(/\): RateLimitResult \{/g) || []).length;
    expect(count).toBe(3);
  });
});

describe("S107-C the count-truth repairs (B-L1 + A-L1 — the F78 doc-truth family)", () => {
  it("DEFECT: the session-106 plan's audit record says SIXTEEN guarded handlers", () => {
    // RED pre-fix: remediation-plan-session106.md:35 read "requireSession()
    // first at all 14 guarded handlers" — the live tree carries SIXTEEN
    // await requireSession() call sites (ai-assistant 1, projects 2,
    // projects/[id] 3, duplicate 1, elements 3, stats 1, teams 2,
    // teams/[id] 2, members 1). The count regressed through the records
    // 16 → 15 → unnumbered → 14 while the tree stayed at 16. The TRUE
    // 14-site readBoundedJson census named in the same sentence stays.
    expect(PLAN_106).toContain("`requireSession()` first at all 16 guarded handlers");
    expect(PLAN_106).not.toContain("first at all 14 guarded handlers");
  });

  it("DEFECT: the worklog's session-106 audit record says SIXTEEN guarded handlers", () => {
    // RED pre-fix: worklog.md's digma-s106-audit-b record read
    // "requireSession() first at all 14 guarded handlers". The repair
    // is line-scoped: the s107 auditor's own finding entry quotes the
    // false claim verbatim (a faithful quote that must survive), so
    // the pin extracts the audit-record line by its stable prefix.
    const record = WORKLOG.split("\n").find((l) => l.includes("Clean layers re-verified live: 14 readBoundedJson"));
    expect(record).toBeDefined();
    expect(record!).toContain("requireSession() first at all 16 guarded handlers");
    expect(record!).not.toContain("first at all 14 guarded handlers");
  });

  it("DEFECT: the session-105 plan's helper attribution says ELEVEN consumers", () => {
    // RED pre-fix: remediation-plan-session105.md:7 read "the
    // `guardedUpdate` helper at the twelve number-field consumers" —
    // the helper serves ELEVEN (X, Y, W, H, Font Size, the four corner
    // radii, Rotation, Opacity); the twelfth number field (the gradient
    // stop position) deliberately rides its own inline patchDiffers
    // seam, which the SAME sentence lists separately. The totals stay
    // thirteen guards (11 + the Content typing guard + the stop seam).
    // The :39 sibling phrase ("the twelve number-field consumers" as a
    // CLASS — 11 helper + 1 stop — without the helper attribution) is
    // true and survives.
    expect(PLAN_105).toContain("helper at the eleven number-field consumers");
    expect(PLAN_105).not.toContain("helper at the twelve number-field consumers");
    expect(PLAN_105).toContain("thirteen guards total");
  });
});

describe("S107-D the script fold (B-L3 + B-I2 — the ordinal/pin family)", () => {
  it("DEFECT: the ref-audit s107 provenance comments carry the S107 anchor (all four)", () => {
    // RED pre-fix: four inline comments still read "Session 106 (S106
    // derivation of the S105-E form …)" — un-bumped from the s106
    // derivation while the same lines' numbers moved (the clip
    // provenance 42nd/81st → 43rd/82nd at :120-121). Inconsistent
    // bumping INSIDE the same comment — the B-L2-ordinal family. All
    // four anchors re-derive onto the S107 form.
    expect(REF_AUDIT_107).not.toMatch(/Session 106 \(S106 derivation/);
    const anchors = REF_AUDIT_107.match(/Session 107 \(S107 derivation of the s106 standing form/g) || [];
    expect(anchors.length).toBe(4);
  });

  it("PIN: the verify-nav s107 contract (the B-I2 closure — the per-session pin lands)", () => {
    // GREEN by design — the derived script is already correct; this
    // pin lands its contract so a future derivation that misses an
    // ordinal/descriptor/session-name/log-file fails loudly (the
    // lows-s102 family's per-session form).
    expect(NAV_SCRIPT_107).toContain("the 84th consecutive session");
    expect(NAV_SCRIPT_107).toContain("the S106 delivery ae5b816 + the S107 remediation");
    expect(NAV_SCRIPT_107).toContain("digma-nav107.log");
    expect(NAV_SCRIPT_107).not.toContain("nav106");
    expect(NAV_SCRIPT_107).not.toContain("digma-nav106");
    expect(NAV_SCRIPT_107).not.toContain("83rd consecutive");
    expect(NAV_SCRIPT_107).toMatch(/The 9 checks:/);
    expect(NAV_SCRIPT_107).toMatch(/boundary, and[\s\S]{0,120}Tailwind v4 class-A guard/);
    expect(NAV_SCRIPT_107).toContain("(84th session, S107-cycle");
    // the hermetic boot line keeps the seven-knob env -u strip.
    expect(NAV_SCRIPT_107).toMatch(
      /env -u DIGMA_PROXY_HOPS -u DIGMA_DISABLE_IN_APP_RESET -u DIGMA_DISABLE_IN_APP_OTP -u DIGMA_REPO_ROOT -u DIGMA_SITE_URL -u HOSTNAME -u KEEP_ALIVE_TIMEOUT/,
    );
  });

  it("SURVIVAL: the ref-audit s107 keeps the fail-loud datum pins the comment bumps must not disturb", () => {
    // The standing contracts: the login assertion (F89 — the audit
    // does not proceed past a failed login), the shot() non-empty
    // discipline, the nav datum pin, the clip datum pin, and the
    // S92-B env-var login form (never a literal credential in tracked
    // source).
    expect(REF_AUDIT_107).toContain("F89 CHECK FAILED");
    expect(REF_AUDIT_107).toMatch(/\[ -s "\$1" \]/);
    expect(REF_AUDIT_107).toContain("nav=[124x36,96x36,92x36]");
    expect(REF_AUDIT_107).toContain("clip=[Share:L385-R458,Present:L466-R551]");
    expect(REF_AUDIT_107).toContain('REF_EMAIL="${REF_LOGIN_EMAIL:-}"');
    expect(REF_AUDIT_107).not.toContain("sepnetflix2023");
  });
});
