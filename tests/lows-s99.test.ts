import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-99 spec (the forty-seventh audit's chosen work):
//
// S99-A — the numeric fields' draft-survival guard (A99-L1, the
// headline): both NumberField and GuardedNumberInput derived
// `display = String(Math.round(value * 100) / 100)` and the render-time
// resync (`if (prevValue !== value) { setPrevValue(value);
// setDraft(display); }`) applied it to the USER'S OWN COMMIT — typing
// 12.375 into any X/Y/W/H/Font Size/Rotation/Opacity/stop-position field
// snapped to 12.38 under the caret at the committing keystroke (a
// >2-decimal value was IMPOSSIBLE to enter; the field then displayed a
// value differing from the committed model — the "a control must never
// lie about the committed state" doctrine, S78-C/S87-C; 0.00 snapped to
// 0 the same way). The rounding itself is intended for resize/slider
// floats (133.33333 artifacts); the defect was its application to the
// TYPING direction. The guard: a draft whose parse equals the new value
// already tells the truth about it — only an EXTERNAL change
// resynchronizes through the rounded display.
//
// S99-B — the text-content round-trip (A99-L2): the server's
// buildElementRow clamped text through clampText (trim + slice) while
// the S85-B doctrine's own words say "edge whitespace is real content —
// the canvas renders whiteSpace: pre-wrap". A composer typing "hello "
// and pausing >=800ms (still focused) got the PUT round-trip: the
// server trimmed the trailing space, markSaved adopted the server list,
// and the controlled input re-rendered with "hello" — the just-typed
// space silently deleted mid-composition (the S85-B rationale — "a
// per-keystroke trim would delete a trailing space AS IT IS TYPED" —
// violated one layer down, by the round-trip). The fix: the TEXT field
// rides a slice-only clamp (clampTextContent); names/emails/
// descriptions keep clampText (identity/prose — trimmed at the
// boundary); the client's blur trim-at-commit STAYS (the S85-B
// boundary form — the store reconciles when the user leaves the field).
//
// S99-C — the leave-transport keyed registry (A99-L3): the single
// one-shot slot (`leaveTransportFor`) let an intermediate project's
// mount DISCARD a pending transport it never awaited — X->Y->X: Y's
// mount nulled the slot, and X's re-entry GET raced X's still-in-flight
// at-unmount PUT (the A87-M1 silent-edit-deletion class through the
// FIFTH interleaving S87-A never enumerated: double navigation within
// one PUT flight). The registry becomes a per-project Map drained on
// match with ONE registration seam; entries self-clean at resolution
// (a resolved transport's await is a no-op passthrough).
//
// S99-D — the server smalls fold (B99-L1 + B99-I1 + B99-I2 + B99-I3):
// the resend-otp comment overclaimed ("no remote reader can tell the
// three states apart" — but the pending-unverified branch answers the
// delivery 200, by necessity, and survives the OTP knob; the B97-I1
// honest-comment class); two inline trim-slice twins survived the
// S71-D clampText fold (projects description + ai-assistant message);
// the one bare "crypto" import (forgot-password); the elements POST's
// explicit-sortOrder tie gets its honest note (the behavior stays
// deferred — no first-party consumer).
//
// S99-E — the client smalls fold (A99-I1 + A99-I2): a 3-digit hex fill
// rendered a BLACK swatch beside its truthful hex field
// (input[type=color] requires #rrggbb and coerces "#abc" to #000000);
// the swatch binding rides expandShortHex. The editor's load fetch
// interpolates the raw projectId — encodeURIComponent for uniformity.
//
// S99-F — the smoke suite's port-ownership refusal (B99-L2, the S73-D
// mechanism-vs-discipline class): the pre-kill covered only the
// standalone and `next start` patterns — a lingering `next dev` would
// answer the health probe and every check would silently certify DEV
// code instead of the built artifact. The pre-kill gains the dev
// pattern AND a pre-boot probe that REFUSES when anything already
// answers the port.
//
// S99-G — the SEO parity (the directive's sitemap/SEO item, measured
// live on the reference at the 75th reference audit): the reference
// serves /robots.txt (User-agent: * / Allow: / / the sitemap pointer)
// and /sitemap.xml (exactly 4 URLs — "/" at 1.0, /Editor /Recent
// /Teams at 0.8, all weekly; NO /Dashboard, /login, /reset-password).
// The clone served neither; the Next Metadata-route conventions
// implement them riding the DIGMA_SITE_URL knob.
//
// The S99 delivered counts — this file's 26 pins grow the suite
// 1212 -> 1238 unit / 160 -> 161 files (the F68/F70 discipline: the
// constants ride the count family's live anchor — the PAD §7.1
// Unit-total row — so the whole family moves together in the same
// commit).
const UNIT = "1332";
const FILES = "166";

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

const PANEL = src("src/components/editor/properties-panel.tsx");
const EDITOR_TS = src("src/lib/editor.ts");
const EDITOR_VIEW = src("src/components/editor/editor-view.tsx");
const VALIDATION = src("src/lib/validation.ts");
const UTILS = src("src/lib/utils.ts");
const RESEND_ROUTE = src("src/app/api/auth/resend-otp/route.ts");
const PROJECTS_ROUTE = src("src/app/api/projects/route.ts");
const AI_ROUTE = src("src/app/api/ai-assistant/route.ts");
const FORGOT_ROUTE = src("src/app/api/auth/forgot-password/route.ts");
const ELEMENTS_ROUTE = src("src/app/api/projects/[id]/elements/route.ts");
const SMOKE = src("scripts/smoke-test.sh");
const ENV_EXAMPLE = src(".env.example");
const ENV = src(".env");
const AGENTS = src("AGENTS.md");
const PAD = src("Project_Architecture_Document.md");

// ---------------------------------------------------------------------------

describe("S99-A the numeric fields' draft-survival guard (A99-L1 — the headline)", () => {
  it("DEFECT: NumberField's render-time resync carries the draft-survival guard", () => {
    // RED pre-fix: the resync is unconditional — setDraft(display)
    // fires on the user's OWN commit, snapping 12.375 to 12.38 under
    // the caret. Post-fix a draft whose parse equals the new value
    // already tells the truth about it; only an external change
    // (slider/resize/undo/AI) resynchronizes through the rounded
    // display. Session 100 (S100-B / A100-L1) re-anchored in-commit:
    // the guard gained the EMPTY-DRAFT arm — Number("") === 0 is a
    // coercion artifact, not a truthful parse, so a cleared field
    // always resyncs (the S93-A precedent: the prior-session pin
    // tracks the delivered form).
    const start = PANEL.indexOf("function NumberField(");
    const end = PANEL.indexOf("\nfunction ", start + 10);
    expect(start, "the NumberField definition must be findable").toBeGreaterThan(-1);
    const body = PANEL.slice(start, end);
    expect(body).toMatch(
      /if \(draft\.trim\(\) === "" \|\| Number\(draft\) !== value\) setDraft\(display\);/,
    );
  });

  it("DEFECT: GuardedNumberInput's render-time resync carries the same guard", () => {
    const start = PANEL.indexOf("function GuardedNumberInput(");
    const end = PANEL.indexOf("\nfunction ", start + 10);
    expect(start, "the GuardedNumberInput definition must be findable").toBeGreaterThan(-1);
    const body = PANEL.slice(start, end);
    // Session 100 (S100-B / A100-L1) re-anchored in-commit: the empty-draft
    // arm joins the sibling's guard (the corrected polarity).
    expect(body).toMatch(
      /if \(draft\.trim\(\) === "" \|\| Number\(draft\) !== value\) setDraft\(display\);/,
    );
  });

  it("SURVIVAL: the rounded display derivation, the empty-draft guard, and the blur restore stay untouched", () => {
    // The rounding is the INTENDED half — resize/slider floats
    // (133.33333 artifacts) still display clean; the empty-draft guard
    // (S21-2) and the blur restore are the standing contracts.
    expect(PANEL).toMatch(/String\(Math\.round\(value \* 100\) \/ 100\)/);
    expect(PANEL).toMatch(/event\.target\.value\.trim\(\) === ""/);
    expect(PANEL).toMatch(/Number\.isFinite\(parsed\)/);
  });
});

describe("S99-B the text-content round-trip (A99-L2)", () => {
  it("DEFECT: validation.ts exports clampTextContent — the slice-only clamp beside clampText", () => {
    expect(VALIDATION).toMatch(/export function clampTextContent\(/);
  });

  it("DEFECT (behavioral): clampTextContent preserves edge whitespace, slices at the bound, nulls non-strings", async () => {
    const validation = await import("../src/lib/validation");
    expect(
      typeof validation.clampTextContent,
      "clampTextContent must be exported (S99-B)",
    ).toBe("function");
    // Edge whitespace is real content (the S85-B doctrine's own words):
    const fn = validation.clampTextContent as (v: unknown, max: number) => string | null;
    expect(fn("hello ", 2000)).toBe("hello ");
    expect(fn(" leading", 2000)).toBe(" leading");
    expect(fn(" spaced  inner ", 2000)).toBe(" spaced  inner ");
    // The length bound still slices:
    expect(fn("a".repeat(2001), 2000)).toBe("a".repeat(2000));
    expect(fn("a".repeat(2000), 2000)).toBe("a".repeat(2000));
    // Non-strings null; the empty string (a mid-composition state) keeps:
    expect(fn(null, 2000)).toBeNull();
    expect(fn(undefined, 2000)).toBeNull();
    expect(fn(42, 2000)).toBeNull();
    expect(fn("", 2000)).toBe("");
  });

  it("DEFECT: buildElementRow's text site rides clampTextContent (the trim leaves the round-trip)", () => {
    // RED pre-fix: `text: clampText(raw?.text, 2000)` — the server-side
    // trim deleted a focused composer's edge whitespace at the autosave
    // round-trip.
    expect(EDITOR_TS).toMatch(/text: clampTextContent\(raw\?\.text, 2000\)/);
    expect(EDITOR_TS).not.toMatch(/text: clampText\(raw\?\.text, 2000\)/);
  });

  it("SURVIVAL: clampText itself is unchanged — the identity/prose family keeps its trim", async () => {
    const validation = await import("../src/lib/validation");
    expect(validation.clampText("  edge  ", 100)).toBe("edge");
    expect(validation.clampText("   ", 100)).toBeNull();
    expect(validation.clampText("", 100)).toBeNull();
    expect(validation.clampText("a".repeat(101), 100)).toBe("a".repeat(100));
    expect(validation.clampText(null, 100)).toBeNull();
  });
});

describe("S99-C the leave-transport keyed registry (A99-L3)", () => {
  it("DEFECT: the registry is a per-project Map with the match-drain form", () => {
    expect(EDITOR_VIEW).toMatch(/const leaveTransports = new Map<string, Promise<unknown>>\(\)/);
    expect(EDITOR_VIEW).toMatch(
      /const transport = leaveTransports\.get\(projectId\);\s*if \(transport\) \{\s*leaveTransports\.delete\(projectId\);\s*await transport;/,
    );
  });

  it("DEFECT: the one-shot slot is GONE — no unconditional discard on mismatch", () => {
    expect(EDITOR_VIEW).not.toMatch(/let leaveTransportFor: \{ projectId: string; done/);
    expect(EDITOR_VIEW).not.toMatch(/leaveTransportFor = null;/);
  });

  it("DEFECT: registerLeaveTransport is the ONE seam and both registration sites ride it", () => {
    expect(EDITOR_VIEW).toMatch(
      /function registerLeaveTransport\(projectId: string, done: Promise<unknown>\): void/,
    );
    const calls = EDITOR_VIEW.match(/registerLeaveTransport\(/g) ?? [];
    // The definition itself + exactly TWO call sites (the exit-path
    // machineFlight form and the cleanup-path flightDone form).
    expect(calls.length).toBe(3);
  });

  it("SURVIVAL: the same-project await + the cancelled check ride through (the S85-A contract)", () => {
    expect(EDITOR_VIEW).toMatch(/await transport;\s*if \(cancelled\) return;/);
  });
});

describe("S99-D the server smalls fold (B99-L1 + B99-I1 + B99-I2 + B99-I3)", () => {
  it("DEFECT: the resend-otp comment no longer overclaims the three-way closure", () => {
    // RED pre-fix: "no remote reader can tell the three states apart" —
    // while the pending-unverified branch answers the delivery 200 (by
    // necessity, surviving the OTP knob). The B97-I1 honest-comment
    // class.
    expect(RESEND_ROUTE).not.toMatch(/no remote reader can tell the three states apart/);
    expect(RESEND_ROUTE).toMatch(/pending-unverified state remains distinguishable BY DESIGN/);
  });

  it("DEFECT: both trim-slice twins ride clampText (the S71-D fold completed)", () => {
    expect(PROJECTS_ROUTE).toMatch(/clampText\(body\?\.description, 500\)/);
    expect(AI_ROUTE).toMatch(/clampText\(body\?\.message, 1000\) \?\? ""/);
    // The inline twins are gone from src/app:
    expect(PROJECTS_ROUTE).not.toMatch(/\.trim\(\)\.slice\(/);
    expect(AI_ROUTE).not.toMatch(/\.trim\(\)\.slice\(/);
  });

  it("DEFECT: the bare crypto import gains the node: prefix (zero bare builtin imports)", () => {
    expect(FORGOT_ROUTE).toMatch(/from "node:crypto"/);
    expect(FORGOT_ROUTE).not.toMatch(/from "crypto"/);
  });

  it("SURVIVAL: the uniform 400 envelopes stay + the B99-I3 sortOrder-tie note lands", () => {
    // The S71-C contract: the format check, unknown, and verified ALL
    // answer the same VALIDATION 400 envelope (three sites).
    const envelopes = RESEND_ROUTE.match(
      /fail\("VALIDATION", "Enter a valid email address", 400\)/g,
    ) ?? [];
    expect(envelopes.length).toBe(3);
    // The honest note beside the S71-C comment (the behavior deferred —
    // the client persists exclusively via the full-list PUT):
    expect(ELEMENTS_ROUTE).toMatch(/B99-I3/);
  });
});

describe("S99-E the client smalls fold (A99-I1 + A99-I2)", () => {
  it("DEFECT (behavioral): expandShortHex expands 3-digit hexes, passes 6-digit and null through", async () => {
    const utils = await import("../src/lib/utils");
    expect(typeof utils.expandShortHex, "expandShortHex must be exported (S99-E)").toBe("function");
    const fn = utils.expandShortHex as (v: string | null) => string | null;
    expect(fn("#abc")).toBe("#aabbcc");
    expect(fn("#0f0")).toBe("#00ff00");
    expect(fn("#ABC")).toBe("#AABBCC");
    expect(fn("#aabbcc")).toBe("#aabbcc");
    expect(fn("#0D1117")).toBe("#0D1117");
    expect(fn(null)).toBeNull();
  });

  it("DEFECT: the Fill/Stroke swatch binding rides the expansion (no more black 3-digit swatch)", () => {
    expect(PANEL).toMatch(/value=\{expandShortHex\(value\) \?\? "#000000"\}/);
    expect(PANEL).toMatch(/import \{[^}]*expandShortHex[^}]*\} from "@\/lib\/utils"/);
  });

  it("DEFECT: the editor's load fetch encodes the projectId", () => {
    expect(EDITOR_VIEW).toMatch(
      /fetch\(`\/api\/projects\/\$\{encodeURIComponent\(projectId\)\}`\)/,
    );
  });

  it("SURVIVAL: the hex text row, the stored datum, and the canvas paint are untouched", () => {
    // The display-only seam: the hex field keeps showing the STORED
    // spelling (both controls now agree on the COLOR); the sanitizer's
    // 3-digit acceptance stays (the canvas accepts it, the AI may emit
    // it); the canvas paint is not involved.
    expect(src("src/lib/ai-assistant.ts")).toMatch(/\^#\[0-9a-fA-F\]\{3\}\$/);
  });
});

describe("S99-F the smoke suite's port-ownership refusal (B99-L2)", () => {
  it("DEFECT: the pre-kill covers next dev AND the pre-boot probe refuses a port squatter", () => {
    expect(SMOKE).toMatch(/pkill -f "next dev"/);
    expect(SMOKE).toMatch(/REFUSED: something already answers/);
    expect(SMOKE).toMatch(/curl -sf -m 2 "\$BASE\/api\/health"/);
  });

  it("SURVIVAL: the S73-D parent-DATABASE_URL refusal rides through unchanged", () => {
    expect(SMOKE).toMatch(/REFUSED: DATABASE_URL is exported in the parent shell/);
  });
});

describe("S99-G the SEO parity (the reference's measured robots + sitemap)", () => {
  it("DEFECT (behavioral): the sitemap carries the reference's measured 4-URL set", async () => {
    const mod = await import("../src/app/sitemap").catch(() => null);
    expect(mod, "src/app/sitemap.ts must exist (the SEO parity)").not.toBeNull();
    const sitemap = (mod as { default: () => { url: string; changeFrequency?: string; priority?: number }[] })
      .default;
    const entries = sitemap();
    expect(entries.map((e) => new URL(e.url).pathname)).toEqual(["/", "/Editor", "/Recent", "/Teams"]);
    const byPath = new Map(entries.map((e) => [new URL(e.url).pathname, e]));
    expect(byPath.get("/")?.priority).toBe(1);
    expect(byPath.get("/")?.changeFrequency).toBe("weekly");
    for (const p of ["/Editor", "/Recent", "/Teams"]) {
      expect(byPath.get(p)?.priority).toBe(0.8);
      expect(byPath.get(p)?.changeFrequency).toBe("weekly");
    }
    // The reference's own set: NO /Dashboard, /login, /reset-password.
    expect(entries.map((e) => new URL(e.url).pathname)).not.toContain("/Dashboard");
    expect(entries.map((e) => new URL(e.url).pathname)).not.toContain("/login");
  });

  it("DEFECT (behavioral): the robots file allows all + points at the sitemap", async () => {
    const mod = await import("../src/app/robots").catch(() => null);
    expect(mod, "src/app/robots.ts must exist (the SEO parity)").not.toBeNull();
    const robots = (mod as { default: () => { rules: { userAgent: string; allow: string } | Array<{ userAgent: string; allow: string }>; sitemap?: string } })
      .default;
    const doc = robots();
    const rules = Array.isArray(doc.rules) ? doc.rules : [doc.rules];
    expect(rules.some((r) => r.userAgent === "*" && r.allow === "/")).toBe(true);
    expect(doc.sitemap).toMatch(/\/sitemap\.xml$/);
  });

  it("DEFECT: .env.example documents the DIGMA_SITE_URL knob (and .env carries it)", () => {
    expect(ENV_EXAMPLE).toMatch(/DIGMA_SITE_URL/);
    expect(ENV).toMatch(/DIGMA_SITE_URL/);
  });

  it("SURVIVAL: the layout metadata and the S79-D security headers stay untouched", () => {
    const layout = src("src/app/layout.tsx");
    expect(layout).toMatch(/title:\s*\{/);
    expect(layout).toMatch(/template: "%s \| Digma"/);
    expect(layout).toMatch(/icons: \{ icon: "\/logo\.svg" \}/);
    expect(src("next.config.ts")).toMatch(/X-Frame-Options/);
  });
});

// ---------------------------------------------------------------------------
// The live anchors (the count family's forcing function)
// ---------------------------------------------------------------------------

describe("S99 the live anchors", () => {
  it("LIVE ANCHOR: the delivered constants equal the PAD §7.1 Unit-total row (the family moves together)", () => {
    // RED pre-fix by construction: the §7.1 row still reads the S98
    // delivery's 1212 / 160 files until the S99-H docs pass re-anchors
    // it to this file's grown totals (1238 / 161). The count family's
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
