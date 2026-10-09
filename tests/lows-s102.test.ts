import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as editorLib from "../src/lib/editor";

// The session-102 spec (the fiftieth audit's chosen work):
//
// S102-A — the evidence ordering + the fail-loud assertions (B-M1, the
//   headline): the capture script's flip-evidence curls ran AFTER the
//   kill of the very server they curl — the delivered clone-58
//   flipped artifacts are 0 bytes while `|| true` masked the failure
//   (the F83 family: evidence must tell the truth about what it saw).
//   The fix reorders the evidence writes BEFORE the kill and asserts
//   every saved file is non-empty — an evidence write that fails must
//   fail the script, never pass silently.
//
// S102-B — the three P2025 guards (B-L1, the F78 ledger-count class):
//   the B101-I3 record claimed TWO unguarded single-row user writes
//   while a grep census finds THREE (login:69 joined its documented
//   siblings forgot-password:74 + resend-otp:76). The guards close
//   the family to ZERO by construction (the route family's own
//   try/catch P2025 → 404-envelope form).
//
// S102-C — the derived nav script's ordinal (B-L2): the delivered
//   verify-nav-s101.sh header said "# session 100" (the derivation
//   bumped every field EXCEPT the header's own session ordinal), and
//   the s102 derivation initially inherited the off-by-one. The pin
//   makes the ordinal a checked field so the family cannot inherit it
//   again.
//
// S102-D — the auth.spec port derivation (B-L3, the F87 knob-consumer
//   class): one toHaveURL assertion hardcoded localhost:3100 while
//   the suite's own E2E_PORT/E2E_BASE_URL knobs exist and six sibling
//   specs derive from them. The expected origin now derives the same
//   way.
//
// S102-E — the patchDiffers no-op bail seam (A-L1, the client
//   headline — the S78-C doctrine's click/select completion): every
//   discrete commit control in the properties panel (Text Align
//   buttons, Gradient Type buttons, the Font Family and Background
//   Size selects) re-committed its CURRENT value unguarded — pushing
//   an inert history snapshot, wiping redo, flipping the badge, and
//   scheduling a PUT of a byte-identical list. The blur-commit
//   siblings have carried the changed-value guard since S78-C; the
//   click/select family now rides ONE exported pure seam.
//
// S102-F — the mobile chips' mount gating (A-I1, the S75-E family's
//   selector-level residual): the two mobile property chips stayed
//   MOUNTED above lg (CSS-only hiding), so their selectors ran an
//   O(n) find over the full element list on every store commit at
//   ANY viewport. The isLg mount gate is the S75-E doctrine reaching
//   its last two members.
//
// S102-G — the smalls fold (A-I2 + A-I3 + A-I4): the radius gate's
//   truthiness form aligned to its strict siblings; the clamp-domain
//   bounds ±100000/100000 named and single-sourced (the F35e class
//   at literal granularity); the Image tab's "PNG, JPG, SVG" hint
//   gains the provenance comment (the measured parity datum; the
//   toast is the honest five-family inventory).
//
// The S102 delivered counts — this file's 21 pins grow the suite
// 1271 -> 1292 unit / 163 -> 164 files (the F68/F70 discipline: the
// constants ride the count family's live anchor — the PAD §7.1
// Unit-total row — so the whole family moves together in the same
// commit).
const UNIT = "1312";
const FILES = "165";

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

const EDITOR_LIB = src("src/lib/editor.ts");
const PANEL = src("src/components/editor/properties-panel.tsx");
const EDITOR_VIEW = src("src/components/editor/editor-view.tsx");
const ASSISTANT_UI = src("src/components/editor/ai-assistant.tsx");
const LOGIN_ROUTE = src("src/app/api/auth/login/route.ts");
const FORGOT_ROUTE = src("src/app/api/auth/forgot-password/route.ts");
const RESEND_ROUTE = src("src/app/api/auth/resend-otp/route.ts");
const AUTH_SPEC = src("tests/e2e/auth.spec.ts");
const CAPTURE = src("scripts/capture-session102.sh");
const NAV_SCRIPT = src("scripts/verify-nav-s102.sh");
const PAD = src("Project_Architecture_Document.md");
const AGENTS = src("AGENTS.md");

// The S78-C completion's pure seam — accessed through the namespace
// (an undefined export is a clean RED, never a file-level crash).
const ns = editorLib as unknown as Record<string, unknown>;
const patchDiffers = ns.patchDiffers as
  | (<T extends object>(element: T, patch: Partial<T>) => boolean)
  | undefined;

// ---------------------------------------------------------------------------

describe("S102-A the evidence ordering + the fail-loud assertions (B-M1 — the headline)", () => {
  it("DEFECT: the flip-evidence curls run BEFORE the kill of the server they curl", () => {
    // RED pre-fix: `kill $SRV3; sleep 1` executed first, so the two
    // flipped evidence writes hit the dead port and saved 0 bytes —
    // hollow artifacts the docs then referenced side by side.
    const killIdx = CAPTURE.indexOf("kill $SRV3 >/dev/null 2>&1; sleep 1");
    const flippedIdx = CAPTURE.indexOf("clone-58-robots-flipped.txt");
    expect(flippedIdx).toBeGreaterThan(-1);
    expect(killIdx).toBeGreaterThan(-1);
    expect(flippedIdx).toBeLessThan(killIdx);
  });

  it("DEFECT: no evidence write is masked by || true — every saved file carries the non-empty assertion", () => {
    // RED pre-fix: each curl ended `2>/dev/null || true` — a failure
    // hidden in the very artifact meant to prove success. The fix
    // drops the mask and asserts grep -q . on every saved file.
    expect(CAPTURE).not.toMatch(/clone-58-robots-flipped\.txt" 2>\/dev\/null \|\| true/);
    expect(CAPTURE).not.toMatch(/clone-58-sitemap-flipped\.xml" 2>\/dev\/null \|\| true/);
    expect(CAPTURE).not.toMatch(/clone-58-robots-default\.txt" 2>\/dev\/null \|\| true/);
    expect(CAPTURE).toMatch(/grep -q \./);
  });

  it("SURVIVAL: the inline F42 flip checks stay (the live flip verification)", () => {
    // GREEN by design: the FROBOTS/FSMAP/LOK inline greps ran against
    // the LIVE server — the runtime flip was genuinely verified; only
    // the persisted evidence was hollow.
    expect(CAPTURE).toMatch(/the flipped server's \/robots\.txt must carry the env origin/);
    expect(CAPTURE).toMatch(/the flipped server's \/sitemap\.xml must carry the env origin URLs/);
    expect(CAPTURE).toMatch(/must keep the localhost forms/);
  });
});

// ---------------------------------------------------------------------------

describe("S102-B the three P2025 guards (B-L1 — the ledger undercount closed)", () => {
  it("DEFECT: login's unverified-recovery update carries the P2025 envelope catch", () => {
    // RED pre-fix: the THIRD bare db.user.update (the B101-I3 record
    // counted two) — the unverified-recovery branch's verify-code
    // regen ran unguarded past the envelope.
    expect(LOGIN_ROUTE).toMatch(/error\.code === "P2025"/);
    expect(LOGIN_ROUTE).toMatch(/fail\("NOT_FOUND", "User not found", 404\)/);
  });

  it("DEFECT: forgot-password's reset-token write carries the P2025 guard (the no-enumeration-preserving form)", () => {
    // RED pre-fix: the documented sibling, unguarded since B101-I3.
    // The guard SWALLOWS to the no-enumeration 200 (a row vanishing
    // mid-request IS an unknown email by response time) and leaves
    // the resetUrl null — never deliver a link the store cannot honor.
    expect(FORGOT_ROUTE).toMatch(/error\.code === "P2025"/);
    expect(FORGOT_ROUTE).toMatch(/if \(stored && inAppResetEnabled\)/);
  });

  it("DEFECT: resend-otp's code re-issue write carries the P2025 envelope catch", () => {
    // RED pre-fix: the other documented sibling, unguarded since B101-I3.
    expect(RESEND_ROUTE).toMatch(/error\.code === "P2025"/);
    expect(RESEND_ROUTE).toMatch(/fail\("NOT_FOUND", "User not found", 404\)/);
  });

  it("LIVE-DERIVED: every db.user.update site in the route family carries the guard (the census)", () => {
    // The family-completeness census: any src/app/api file that writes
    // db.user.update( must also carry the P2025 catch — the count is
    // derived LIVE so a future bare site fails this pin the day it
    // lands (the F78 pin-the-form discipline).
    const walk = (dir: string): string[] => {
      const out: string[] = [];
      for (const entry of readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...walk(full));
        else if (entry.name.endsWith(".ts")) out.push(full);
      }
      return out;
    };
    const offenders = walk("src/app/api").filter(
      (f) => src(f).includes("db.user.update(") && !src(f).includes("P2025"),
    );
    expect(offenders).toEqual([]);
  });
});

// ---------------------------------------------------------------------------

describe("S102-C the derived nav script's ordinal (B-L2)", () => {
  it("DEFECT: the script's header names its OWN session", () => {
    // RED pre-fix: "# session 101 —" in a session-102 script (the
    // off-by-one the s101 delivery itself carried at line 2).
    expect(NAV_SCRIPT).toMatch(/^# session 102 —/m);
  });

  it("SURVIVAL: the nine-check contract and its summary echo stay", () => {
    // GREEN by design: the verification form is untouched — only the
    // header ordinal and the tree descriptors move.
    expect(NAV_SCRIPT).toMatch(/MOBILE NAV CONTRACT/);
    expect(NAV_SCRIPT).toMatch(/Navigation menu/);
    expect(NAV_SCRIPT).toMatch(/79th session/);
  });
});

// ---------------------------------------------------------------------------

describe("S102-D the auth.spec port derivation (B-L3 — the F87 knob-consumer class)", () => {
  it("DEFECT: the from_url guard's expected origin derives from E2E_BASE_URL, never a hardcoded port", () => {
    // RED pre-fix: `toHaveURL(/localhost:3100\/$/)` — the single
    // assertion that ignored the suite's own E2E_PORT/E2E_BASE_URL
    // knobs (any E2E_PORT=3200 run failed exactly this line).
    expect(AUTH_SPEC).not.toMatch(/toHaveURL\(\/localhost:3100/);
    expect(AUTH_SPEC).toMatch(/E2E_BASE_URL/);
  });

  it("SURVIVAL: the from_url guard test keeps its attacker-origin route-abort pin", () => {
    // GREEN by design: the test's contract (never left the app) is
    // unchanged — only the expected-origin derivation moves.
    expect(AUTH_SPEC).toMatch(/attacker\.example/);
    expect(AUTH_SPEC).toMatch(/leftTheApp/);
  });
});

// ---------------------------------------------------------------------------

describe("S102-E the patchDiffers no-op bail seam (A-L1 — the S78-C completion)", () => {
  it("DEFECT (behavioral): the seam exists", () => {
    // RED pre-fix: the function is absent — the click/select family
    // had no shared changed-value guard to ride.
    expect(typeof patchDiffers).toBe("function");
  });

  it("DEFECT (behavioral): identical patches answer false, changed patches answer true", () => {
    // The decision table: an identical value is the no-op (false);
    // a changed value, an added key, or any one changed key in a
    // multi-key patch is a real commit (true); the empty patch is
    // never a commit (false).
    if (typeof patchDiffers !== "function") return; // the pin above already failed
    const rect = { x: 10, y: 20, textAlign: "left" };
    expect(patchDiffers(rect, { x: 10 })).toBe(false);
    expect(patchDiffers(rect, { x: 11 })).toBe(true);
    expect(patchDiffers(rect, {})).toBe(false);
    expect(patchDiffers(rect, { x: 10, textAlign: "center" })).toBe(true);
    expect(patchDiffers(rect, { textAlign: "left" })).toBe(false);
  });

  it("DEFECT (source): all five commit sites route through the seam", () => {
    // RED pre-fix: the unguarded forms — update({ textAlign: align }),
    // apply({ ...gradient, type: "linear" }) and its radial twin,
    // update({ fontFamily }), update({ fillImageFit: fit }).
    expect(PANEL).toMatch(/if \(patchDiffers\(element, \{ textAlign: align \}\)\) update\(\{ textAlign: align \}\)/);
    expect(PANEL).toMatch(/if \(patchDiffers\(gradient, \{ type: "linear" \}\)\) apply\(\{ \.\.\.gradient, type: "linear" \}\)/);
    expect(PANEL).toMatch(/if \(patchDiffers\(gradient, \{ type: "radial" \}\)\) apply\(\{ \.\.\.gradient, type: "radial" \}\)/);
    expect(PANEL).toMatch(/if \(patchDiffers\(element, \{ fontFamily \}\)\) update\(\{ fontFamily \}\)/);
    expect(PANEL).toMatch(/if \(patchDiffers\(element, \{ fillImageFit: fit \}\)\) update\(\{ fillImageFit: fit \}\)/);
  });

  it("SURVIVAL: the blur-commit siblings keep their changed-value guards (the S78-C form)", () => {
    // GREEN by design: the doctrine's original carriers stay guarded.
    expect(PANEL).toMatch(/a blur with an[\s\S]{0,20}unchanged value must not push a history snapshot/);
    expect(PANEL).toMatch(/if \(clamped !== \(element\.text \?\? ""\)\)/);
  });
});

// ---------------------------------------------------------------------------

describe("S102-F the mobile chips' mount gating (A-I1 — the S75-E residual)", () => {
  it("DEFECT: both mobile chip mounts gate on !isLg (no selector churn above lg)", () => {
    // RED pre-fix: both components mounted unconditionally — their
    // wrappers were CSS-only lg:hidden, so the O(n) first-selected
    // find ran on every store commit at ANY viewport.
    expect(EDITOR_VIEW).toMatch(/\{!isLg && <MobilePropertiesEditor \/>\}/);
    expect(EDITOR_VIEW).toMatch(/\{!isLg && <MobileCanvasProperties \/>\}/);
  });
});

// ---------------------------------------------------------------------------

describe("S102-G the smalls fold (A-I2 + A-I3 + A-I4)", () => {
  it("DEFECT: the radius gate rides the strict sibling form, not truthiness", () => {
    // RED pre-fix: `if (operation.element.radius) {` — the seam's last
    // coercion-shaped member (fill/text/fontSize above it are strict).
    expect(ASSISTANT_UI).toMatch(/if \(operation\.element\.radius !== null && operation\.element\.radius !== undefined\) \{/);
    expect(ASSISTANT_UI).not.toMatch(/if \(operation\.element\.radius\) \{/);
  });

  it("DEFECT: the clamp-domain bounds are named and single-sourced (one map of the domain)", () => {
    // RED pre-fix: the ±100000/100000 literals hand-mirrored in two
    // spellings inside one file (the helpers vs the row-builder).
    expect(EDITOR_LIB).toMatch(/export const POSITION_BOUND = 100000;/);
    expect(EDITOR_LIB).toMatch(/export const SIZE_MAX = 100000;/);
    expect(EDITOR_LIB).toMatch(/Math\.min\(Math\.max\(value, -POSITION_BOUND\), POSITION_BOUND\)/);
    expect(EDITOR_LIB).toMatch(/clampNumber\(raw\?\.x, -POSITION_BOUND, POSITION_BOUND, 0\)/);
    expect(EDITOR_LIB).toMatch(/clampNumber\(raw\?\.width, 0, SIZE_MAX, 100\)/);
    // The raw literals are gone from both spellings:
    expect(EDITOR_LIB).not.toMatch(/, -100000\)/);
    expect(EDITOR_LIB).not.toMatch(/0, 100000, 100\)/);
  });

  it("DEFECT: the Image tab's hint carries the provenance comment", () => {
    // RED pre-fix: the measured "PNG, JPG, SVG" text stood alone — the
    // deliberate parity under-listing (vs the honest five-family
    // toast) was undocumented at the site.
    expect(PANEL).toMatch(/under-lists the accepted families/);
    expect(PANEL).toMatch(/PNG, JPG, SVG<\/span>/);
  });

  it("SURVIVAL: the accept regex + the honest rejection toast stay", () => {
    // GREEN by design: the five-family inventory is unchanged.
    expect(PANEL).toMatch(/png\|jpe\?g\|gif\|svg\\\+xml\|webp/);
    expect(PANEL).toMatch(/PNG, JPG, GIF, WebP, or SVG images are supported/);
  });
});

// ---------------------------------------------------------------------------

describe("S102 the live anchors", () => {
  it("LIVE ANCHOR: the delivered constants equal the PAD §7.1 Unit-total row (the family moves together)", () => {
    // RED pre-fix by construction: the §7.1 row still reads the S101
    // delivery's 1271 / 163 files until the S102-H docs pass re-anchors
    // it to this file's grown totals (1292 / 164). The count family's
    // forcing function: the spec's constants and the PAD row must agree
    // in the same commit (the F68/F70 discipline).
    const padFiles = PAD.match(/\| \*\*Unit total\*\* \| \*\*(\d+) files\*\*/)?.[1];
    const padTests = PAD.match(
      /\| \*\*Unit total\*\* \| \*\*\d+ files\*\* \| \*\*(\d+)\*\*/,
    )?.[1];
    expect(FILES).toBe(padFiles);
    expect(UNIT).toBe(padTests);
    expect(AGENTS).toContain(`(${UNIT} checks)`);
    expect(AGENTS).toContain(`${FILES} files`);
  });
});
