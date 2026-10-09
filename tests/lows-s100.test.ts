import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-100 spec (the forty-eighth audit's chosen work):
//
// S100-A — the SEO routes' runtime-env delivery (B100-H1, the
// headline): the S99-G DIGMA_SITE_URL knob was INERT at runtime —
// Next's build statically prerendered both metadata routes and baked
// the build-time env into .next/server/app/robots.txt.body +
// sitemap.xml.body (the only .body artifacts in the whole build). The
// lead's live reproduction: the built standalone server booted with
// DIGMA_SITE_URL=https://digma.example.com still served
// "Sitemap: http://localhost:3000/sitemap.xml" and four
// <loc>http://localhost:3000/... values — an operator who builds once
// (CI/Docker) and configures at runtime (the documented production
// posture — every other env knob in this app is read per-request)
// ships a public sitemap pointing every crawler at localhost. The fix:
// export const dynamic = "force-dynamic"; in both files (the
// codebase's own convention on every API route), with the e2e
// hermeticity additions in the same commit (B100-L2 — the S83-C/S84-C
// removal lists gain the knob so a parent-shell export can never
// steer the e2e server's SEO surfaces) and a live flip witness in the
// capture (a second server booted with the env set — the S70-A
// second-server precedent).
//
// S100-B — the empty-draft resync (A100-L1): the S99-A guard
// `if (Number(draft) !== value) setDraft(display)` admits an unintended
// equivalence — Number("") === 0 — so a user who CLEARS a field (the
// S21-2 empty-guard never commits it; the model keeps its old value)
// and then receives an external change landing on EXACTLY 0 (an AI
// patch may carry height: 0 — 0 is inside the sanitizer's clamp) finds
// the resync SKIPPED: the field renders BLANK while the committed
// model is 0, until blur restores the display. The coercion artifact,
// not a truthful parse, holds the field hostage. THE LEAD'S CORRECTION
// to the auditor's proposed form: `draft.trim() !== "" && ...` keeps
// the field blank for EVERY external value (the wrong polarity — the
// pre-fix code already resyncs empty drafts for non-zero values since
// Number("") !== 250). The correct form inverts the empty arm:
// `if (draft.trim() === "" || Number(draft) !== value) setDraft(display);`
// — an empty draft holds NO truth so it ALWAYS resyncs; a NON-EMPTY
// draft that parses to the value still survives verbatim (the S99-A
// contract — typing 12.375 and 0.00 survives).
//
// S100-C — the stale-comment re-anchor (A100-L2, the F78
// claim-falsified-by-grep class): three client-side comments still
// describe the pre-S99-B server (the TextSection block claimed "the
// server's buildElementRow clamps text through clampText(raw?.text,
// 2000) (trim + slice...) edge whitespace lost on the round-trip" and
// the two ai-assistant blocks claimed the AI path "commits through the
// SAME clamp the server's buildElementRow applies"). Since S99-B the
// server rides the slice-only clampTextContent — the round-trip
// PRESERVES edge whitespace. The AI apply-path's client-side clampText
// STAYS (the lead's doctrine decision: it is the commit-boundary form —
// the blur-trim sibling; the machine's generated text commits trimmed
// before the user ever sees it, and the round-trip is byte-stable
// through the slice-only server either way).
//
// S100-D — the smalls fold (B100-L1 + B100-L2 + A100-I2): DEPLOYMENT.md
// §3's environment-variable table omits DIGMA_SITE_URL (the F78
// sibling-sweep class — .env.example gained it, the deployment doc's
// env inventory did not); neither the playwright env -u list nor
// global-setup's hermetic delete removes the knob (the S84-C family's
// missed member); NumberField's width prop has zero call-site consumers
// (the F79 dead-member class — every site rides the "w-full" default).
//
// The S100 delivered counts — this file's 14 pins grow the suite
// 1238 -> 1252 unit / 161 -> 162 files (the F68/F70 discipline: the
// constants ride the count family's live anchor — the PAD §7.1
// Unit-total row — so the whole family moves together in the same
// commit).
const UNIT = "1356";
const FILES = "167";

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

const PANEL = src("src/components/editor/properties-panel.tsx");
const AI_PANEL = src("src/components/editor/ai-assistant.tsx");
const ROBOTS = src("src/app/robots.ts");
const SITEMAP = src("src/app/sitemap.ts");
const DEPLOYMENT = src("docs/DEPLOYMENT.md");
const PLAYWRIGHT = src("playwright.config.ts");
const GLOBAL_SETUP = src("tests/e2e/global-setup.ts");
const PAD = src("Project_Architecture_Document.md");
const AGENTS = src("AGENTS.md");

// ---------------------------------------------------------------------------

describe("S100-A the SEO routes' runtime-env delivery (B100-H1 — the headline)", () => {
  it("DEFECT: robots.ts carries the force-dynamic segment config (the knob answers at RUNTIME)", () => {
    // RED pre-fix: the route is statically prerendered — the build bakes
    // the build-time env into .next/server/app/robots.txt.body and the
    // running server serves the stale form forever. The codebase's own
    // convention (every API route) is the segment config.
    expect(ROBOTS).toMatch(/export const dynamic = "force-dynamic";/);
  });

  it("DEFECT: sitemap.ts carries the force-dynamic segment config", () => {
    // RED pre-fix: same prerender defect — four <loc> values baked at
    // build; the runtime knob is inert.
    expect(SITEMAP).toMatch(/export const dynamic = "force-dynamic";/);
  });

  it("SURVIVAL (behavioral): both modules read DIGMA_SITE_URL at CALL time — set, call, flip, restore", async () => {
    // The module-level contract the segment config finally makes REAL
    // at the served layer (pre-fix this passes at the unit level while
    // the BUILD prerendered the body — the S99-G witness could not
    // discriminate build-time vs runtime because both runs had the env
    // unset; the capture's live flip witness closes that gap).
    const robotsMod = (await import("../src/app/robots")) as {
      default: () => { sitemap?: string };
    };
    const sitemapMod = (await import("../src/app/sitemap")) as {
      default: () => { url: string }[];
    };
    const prev = process.env.DIGMA_SITE_URL;
    try {
      process.env.DIGMA_SITE_URL = "https://digma.example.com";
      expect(robotsMod.default().sitemap).toBe("https://digma.example.com/sitemap.xml");
      expect(sitemapMod.default().map((e) => e.url)).toEqual([
        "https://digma.example.com/",
        "https://digma.example.com/Editor",
        "https://digma.example.com/Recent",
        "https://digma.example.com/Teams",
      ]);
      process.env.DIGMA_SITE_URL = "https://other.example.org/";
      expect(robotsMod.default().sitemap).toBe("https://other.example.org/sitemap.xml");
      // The trailing-slash strip (the S99-G form) rides through:
      expect(sitemapMod.default()[0]?.url).toBe("https://other.example.org/");
    } finally {
      if (prev === undefined) delete process.env.DIGMA_SITE_URL;
      else process.env.DIGMA_SITE_URL = prev;
    }
  });
});

describe("S100-B the empty-draft resync (A100-L1)", () => {
  it("DEFECT: NumberField's guard carries the empty-draft arm in the corrected polarity", () => {
    // RED pre-fix: `if (Number(draft) !== value) setDraft(display);` —
    // Number("") === 0 skips the resync for a cleared field receiving
    // an external 0 (blank field, model 0). The corrected polarity: an
    // empty draft holds NO truth so it ALWAYS resyncs; a non-empty
    // draft that parses to the value survives (the S99-A contract).
    const start = PANEL.indexOf("function NumberField(");
    const end = PANEL.indexOf("\nfunction ", start + 10);
    expect(start, "the NumberField definition must be findable").toBeGreaterThan(-1);
    const body = PANEL.slice(start, end);
    expect(body).toMatch(/if \(draft\.trim\(\) === "" \|\| Number\(draft\) !== value\) setDraft\(display\);/);
  });

  it("DEFECT: GuardedNumberInput's guard carries the same empty-draft arm", () => {
    const start = PANEL.indexOf("function GuardedNumberInput(");
    const end = PANEL.indexOf("\nfunction ", start + 10);
    expect(start, "the GuardedNumberInput definition must be findable").toBeGreaterThan(-1);
    const body = PANEL.slice(start, end);
    expect(body).toMatch(/if \(draft\.trim\(\) === "" \|\| Number\(draft\) !== value\) setDraft\(display\);/);
  });

  it("SURVIVAL: the rounded display derivation, the S21-2 empty-draft commit guard, and the blur restore stay untouched", () => {
    // The S99-A survival set rides through the S100-B edit: the
    // rounding is the intended half (resize/slider floats), the
    // empty-draft commit guard (S21-2) and the blur restore are the
    // standing contracts.
    expect(PANEL).toMatch(/String\(Math\.round\(value \* 100\) \/ 100\)/);
    expect(PANEL).toMatch(/event\.target\.value\.trim\(\) === ""/);
    expect(PANEL).toMatch(/Number\.isFinite\(parsed\)/);
  });
});

describe("S100-C the stale-comment re-anchor (A100-L2 — the F78 class)", () => {
  it("DEFECT: the TextSection comment no longer claims the server trims the element TEXT", () => {
    // RED pre-fix: the comment says "clamps text through
    // clampText(raw?.text, 2000) (trim + slice, all-whitespace → null)"
    // and "edge whitespace lost on the round-trip" — both FALSE since
    // S99-B (the server rides the slice-only clampTextContent).
    expect(PANEL).not.toMatch(/edge whitespace lost on the round-trip/);
    expect(PANEL).not.toMatch(/clamps text through\s+clampText\(raw\?\.text, 2000\)/);
    // The re-anchored reality (the S99-B doctrine at the server):
    expect(PANEL).toMatch(/clampTextContent/);
  });

  it("DEFECT: the two ai-assistant comments no longer claim the SAME-clamp identity with the server", () => {
    // RED pre-fix: "the AI path's text commits through the SAME clamp
    // the server's buildElementRow applies" and "rides the same clamp"
    // — no longer the same clamp (the server is slice-only since
    // S99-B). The comments must carry the commit-boundary doctrine.
    expect(AI_PANEL).not.toMatch(/the SAME clamp the server's buildElementRow applies/);
    expect(AI_PANEL).not.toMatch(/rides\s+the same clamp/);
    expect(AI_PANEL).toMatch(/commit-boundary/);
  });

  it("SURVIVAL: the clampText calls themselves stay (the S86-B behavioral contract)", () => {
    // The AI apply-path's client-side trim STAYS — the lead's doctrine
    // decision: the commit-boundary form (the blur-trim sibling). The
    // machine's text commits trimmed; the round-trip is byte-stable
    // through the slice-only server either way.
    expect(AI_PANEL).toMatch(/partial\.text = clampText\(operation\.element\.text, 2000\)/);
    expect(AI_PANEL).toMatch(/patch\.text = clampText\(operation\.patch\.text, 2000\)/);
  });
});

describe("S100-D the smalls fold (B100-L1 + B100-L2 + A100-I2)", () => {
  it("DEFECT: DEPLOYMENT.md §3's environment table carries the DIGMA_SITE_URL row", () => {
    // RED pre-fix: .env.example gained the knob in S99-G but the
    // deployment doc's env inventory did not (the F78 sibling-sweep
    // class — the one doc an operator uses to enumerate production
    // env missed the new var entirely).
    expect(DEPLOYMENT).toMatch(/\| `DIGMA_SITE_URL` \|/);
  });

  it("DEFECT: the playwright webServer command removes the knob from the parent shell", () => {
    // RED pre-fix: the S83-C/S84-C removal lists miss the fifth app
    // knob — the exact class the hermeticity discipline exists to
    // close (a parent-shell export steering the e2e server's
    // behavior).
    expect(PLAYWRIGHT).toMatch(/-u DIGMA_SITE_URL/);
  });

  it("DEFECT: global-setup's hermetic env deletes the knob", () => {
    expect(GLOBAL_SETUP).toMatch(/delete hermetic\.DIGMA_SITE_URL;/);
  });

  it("DEFECT: NumberField's dead width prop is gone while the input keeps w-full", () => {
    // RED pre-fix: the prop has zero call-site consumers (the F79
    // dead-member class — every site rides the "w-full" default; the
    // docblock's "w-16" example has no user).
    const start = PANEL.indexOf("function NumberField(");
    const end = PANEL.indexOf("\nfunction ", start + 10);
    const body = PANEL.slice(start, end);
    expect(body).not.toMatch(/width\?: string;/);
    expect(body).not.toMatch(/^\s*width,$/m);
    // The static class list carries w-full (the template-literal +
    // default-arm consumption form is gone with the prop):
    expect(body).toMatch(/className="[^"]*\bw-full\b[^"]*"/);
    expect(body).not.toMatch(/width \?\? "w-full"/);
  });
});

// ---------------------------------------------------------------------------
// The live anchors (the count family's forcing function)
// ---------------------------------------------------------------------------

describe("S100 the live anchors", () => {
  it("LIVE ANCHOR: the delivered constants equal the PAD §7.1 Unit-total row (the family moves together)", () => {
    // RED pre-fix by construction: the §7.1 row still reads the S99
    // delivery's 1238 / 161 files until the S100-E docs pass re-anchors
    // it to this file's grown totals (1252 / 162). The count family's
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
