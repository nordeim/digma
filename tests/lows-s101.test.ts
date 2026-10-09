import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildElementRow } from "../src/lib/editor";

// The session-101 spec (the forty-ninth audit's chosen work):
//
// S101-A — the strict boolean acceptance (B101-L1, the headline):
//   buildElementRow's visible/locked were the ONE field family in the
//   shared row-builder seam without strict validation — every sibling
//   field carries a hex regex, an enum set, or a numeric clamp, while
//   these two rode `Boolean(raw?.x)`: a scripted API consumer PUTting
//   `"locked": "false"` (a truthy string) got `locked: true` — the
//   EXACT INVERSION of the stated JSON intent — silently persisted;
//   `visible: 0` (a falsy number) got `hidden`. First-party impact
//   nil (the client store sends real booleans), so the defect is
//   API-consumer-only — but the strict form closes the door: only a
//   REAL boolean writes, every non-boolean falls to the safe default.
//
// S101-B — the ten→nine count correction (A101-L1, the F78
// count-falsified-by-grep class): both `[&>button]:h-11` belt
// comments in the primitives claimed "ten" call sites while the repo
// carries NINE (wrong at birth — git archaeology confirms nine at the
// S77-A commit too). The fix corrects both comments AND lands the
// live-derived count pin (the F78 discipline: the count form gets
// its pin the moment it is discovered — the day a tenth call site
// lands, the pin fires and the comments must move with it).
//
// S101-C — the zoom single-seam ride (A102-L2, the F35e
// two-maps-of-one-domain class): the store's setZoom/zoomIn/zoomOut
// hand-maintained the [0.1, 5] range as local literals while the
// exported clampZoom seam (its only consumer the Ctrl+wheel path in
// canvas.tsx) held the same constants — a future zoom-range change
// must touch both files; they can silently diverge. The three store
// actions now ride clampZoom (byte-identical behavior, one seam).
//
// S101-D — the useMediaQuery stable identities (A103-L3, the React 19
// external-store contract): both the subscribe and the getSnapshot
// passed to useSyncExternalStore were inline arrows — a NEW IDENTITY
// EVERY RENDER — so React resubscribed (tearing down and re-adding
// the MediaQueryList listener) on every consumer re-render, and every
// getSnapshot call allocated a fresh MQL. EditorView (the primary
// consumer, 2 instances) re-renders on every zoom step and autosave
// flip — the churn was continuous. The module-level per-query cache
// (one MQL + one stable subscribe + one stable getSnapshot per query
// string; the app's reality is two queries — md and lg) closes it.
//
// S101-E — the smalls fold (A104-I1 + B101-I4 + B101-I1): the
// stripAgedSnapshots "lands exactly at the cap" claim gains the
// zero-action qualifier (a reply applying zero operations appends no
// snapshot, leaving cap−1); the lint-gate comment's "13 libs" count
// corrected to the live FOURTEEN (password.ts landed one session
// BEFORE the comment did — wrong at birth); the LLM completion text
// gains the 64KB cap before the JSON scan (the user side was already
// bounded — message 1000, ids ≤64×100, ops ≤50 — while the model's
// reply buffered unbounded; the SDK call sets no max_tokens).
//
// The S101 delivered counts — this file's 18 pins grow the suite
// 1252 -> 1270 unit / 162 -> 163 files (the F68/F70 discipline: the
// constants ride the count family's live anchor — the PAD §7.1
// Unit-total row — so the whole family moves together in the same
// commit).
const UNIT = "1356";
const FILES = "167";

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

const EDITOR_LIB = src("src/lib/editor.ts");
const DIALOG = src("src/components/ui/dialog.tsx");
const SHEET = src("src/components/ui/sheet.tsx");
const STORE = src("src/components/editor/editor-store.ts");
const HOOK = src("src/hooks/use-media-query.ts");
const ASSISTANT_UI = src("src/components/editor/ai-assistant.tsx");
const ESLINT_CONFIG = src("eslint.config.mjs");
const AI_ROUTE = src("src/app/api/ai-assistant/route.ts");
const PAD = src("Project_Architecture_Document.md");
const AGENTS = src("AGENTS.md");

// ---------------------------------------------------------------------------

describe("S101-A the strict boolean acceptance (B101-L1 — the headline)", () => {
  it("DEFECT (behavioral): a string \"false\" no longer locks — the truthiness inversion closed", () => {
    // RED pre-fix: Boolean("false") === true — the scripted consumer's
    // stated intent (unlock) stored as LOCKED, silently persisted.
    const row = buildElementRow({ type: "rectangle", locked: "false" }, 0, "create");
    expect(row.locked).toBe(false);
  });

  it("DEFECT (behavioral): a numeric 0 no longer hides — the falsy coercion closed", () => {
    // RED pre-fix: Boolean(0) === false — `visible: 0` hid the element.
    // The null twin belongs to the same falsy-coercion family: null was
    // never a hide signal in the client contract, and the strict form
    // stops coercing it into one.
    const row = buildElementRow({ type: "rectangle", visible: 0 }, 0, "create");
    expect(row.visible).toBe(true);
    expect(buildElementRow({ type: "rectangle", visible: null }, 0, "create").visible).toBe(true);
  });

  it("DEFECT (behavioral): a numeric 1 no longer locks", () => {
    // RED pre-fix: Boolean(1) === true — a non-boolean locked the row.
    const row = buildElementRow({ type: "rectangle", locked: 1 }, 0, "create");
    expect(row.locked).toBe(false);
  });

  it("DEFECT (source): the seam carries the strict acceptance forms", () => {
    // RED pre-fix: the Boolean() coercion forms. Only a REAL boolean
    // writes — the sibling doctrine (hex regex / enum set / clamp)
    // finally covers the last two members.
    expect(EDITOR_LIB).toMatch(/visible: raw\?\.visible === false \? false : true,/);
    expect(EDITOR_LIB).toMatch(/locked: raw\?\.locked === true,/);
    // The coercion forms are gone:
    expect(EDITOR_LIB).not.toMatch(/: Boolean\(raw\?\.visible\)/);
    expect(EDITOR_LIB).not.toMatch(/: Boolean\(raw\?\.locked\)/);
  });

  it("SURVIVAL (behavioral): the real-boolean and default forms hold", () => {
    // GREEN by design: the first-party contract (the client store
    // sends real booleans at every write site) and the defaults.
    expect(buildElementRow({ type: "rectangle", locked: true }, 0, "create").locked).toBe(true);
    expect(buildElementRow({ type: "rectangle", visible: false }, 0, "create").visible).toBe(false);
    expect(buildElementRow({ type: "rectangle" }, 0, "create").visible).toBe(true);
    expect(buildElementRow({ type: "rectangle" }, 0, "create").locked).toBe(false);
    // locked: null — Boolean(null) === false and the strict form agrees
    // (null was never a lock signal; the behavior is unchanged):
    expect(buildElementRow({ type: "rectangle", locked: null }, 0, "create").locked).toBe(false);
  });

  it("SURVIVAL (source): the sibling strict-validation forms stay (the seam's doctrine)", () => {
    // GREEN by design: every OTHER field already validates strictly —
    // the S101-A fix brings the last two members into the family.
    expect(EDITOR_LIB).toMatch(/: clampColor\(String\(raw\.fill\), DEFAULT_FILL\)/);
    expect(EDITOR_LIB).toMatch(/: clampNumber\(raw\?\.width, 0, SIZE_MAX, 100\)/);
    expect(EDITOR_LIB).toMatch(/: clampTextContent\(raw\?\.text, 2000\)/);
  });
});

// ---------------------------------------------------------------------------

describe("S101-B the ten→nine count correction (A101-L1 — the F78 class)", () => {
  it("DEFECT: dialog.tsx no longer claims the ten call-site form", () => {
    // RED pre-fix: "the ten call-site [&>button]:h-11 overrides" — the
    // count was falsified by grep at birth (nine then, nine now).
    expect(DIALOG).not.toMatch(/ten call-site/);
  });

  it("DEFECT: sheet.tsx no longer claims the ten duplicated form", () => {
    // RED pre-fix: "in ten duplicated call-site [&>button]:h-11
    // overrides" — same falsified count, the twin comment.
    expect(SHEET).not.toMatch(/ten duplicated call-site/);
  });

  it("LIVE-DERIVED: the repo-wide [&>button]:h-11 call-site count is NINE and both comments say nine", () => {
    // RED pre-fix: the comments say "ten". The F78 pin-the-form
    // discipline: the count is derived LIVE over src/**/*.tsx
    // (excluding the two primitives' own files — their COMMENTS cite
    // the class), so the day a tenth call site lands, this pin fires
    // and the comments must move with it in the same commit.
    const walk = (dir: string): string[] => {
      const out: string[] = [];
      for (const entry of readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...walk(full));
        else if (entry.name.endsWith(".tsx")) out.push(full);
      }
      return out;
    };
    const files = walk("src").filter(
      (f) => f !== "src/components/ui/dialog.tsx" && f !== "src/components/ui/sheet.tsx",
    );
    const count = files.reduce(
      (n, f) =>
        n + (readFileSync(path.join(ROOT, f), "utf8").match(/\[&>button\]:h-11/g) ?? []).length,
      0,
    );
    expect(count).toBe(9);
    // The corrected claim — both primitives name the live count:
    expect(DIALOG).toMatch(/nine call-site/);
    expect(SHEET).toMatch(/nine duplicated call-site/);
  });
});

// ---------------------------------------------------------------------------

describe("S101-C the zoom single-seam ride (A102-L2 — the F35e class)", () => {
  it("DEFECT (source): the store imports clampZoom from the one seam", () => {
    // RED pre-fix: no clampZoom import — the store hand-rolled the
    // range as local literals beside the exported seam.
    expect(STORE).toMatch(/import \{[\s\S]*?\bclampZoom\b[\s\S]*?\} from "@\/lib\/editor";/);
  });

  it("DEFECT (source): no [0.1, 5] literal remains in the store — the three actions ride clampZoom", () => {
    // RED pre-fix: setZoom/zoomIn/zoomOut each carried the local
    // `clamp(..., 0.1, 5)` form.
    expect(STORE).not.toMatch(/0\.1, 5\)/);
    expect(STORE).toMatch(/setZoom: \(zoom\) => set\(\{ zoom: clampZoom\(zoom\) \}\)/);
    expect(STORE).toMatch(/zoom: clampZoom\(state\.zoom \* 1\.2\)/);
    expect(STORE).toMatch(/zoom: clampZoom\(state\.zoom \/ 1\.2\)/);
  });

  it("SURVIVAL (source): the RA-50 range doctrine comment and the reorder clamp stay", () => {
    // GREEN by design: the measured-range provenance ([10%, 500%])
    // and the local index clamp's legit consumer.
    expect(STORE).toMatch(/\[10%, 500%\]/);
    expect(STORE).toMatch(/function clamp\(value: number, min: number, max: number\): number/);
  });
});

// ---------------------------------------------------------------------------

describe("S101-D the useMediaQuery stable identities (A103-L3 — the React 19 contract)", () => {
  it("DEFECT (source): the per-query cache forms are present", () => {
    // RED pre-fix: both callbacks were inline arrows — a new identity
    // every render — so React resubscribed on every consumer
    // re-render and every getSnapshot call allocated a fresh MQL.
    expect(HOOK).toMatch(/new Map<string, MediaQueryList>/);
    expect(HOOK).toMatch(/function mqlFor\(query: string\): MediaQueryList/);
    expect(HOOK).toMatch(/function subscribeFor\(query: string\)/);
    expect(HOOK).toMatch(/function snapshotFor\(query: string\)/);
    // The hook rides the cached identities:
    expect(HOOK).toMatch(/useSyncExternalStore\(\s*subscribeFor\(query\),\s*snapshotFor\(query\),/);
  });

  it("SURVIVAL (source): the s75 contracts hold through the cache", () => {
    // GREEN by design: the S75-E pins — the external-store API, no
    // useState/useEffect, the change-listener pair, the desktop-first
    // server snapshot.
    expect(HOOK).toMatch(/useSyncExternalStore/);
    expect(HOOK).not.toMatch(/useState/);
    expect(HOOK).not.toMatch(/useEffect/);
    expect(HOOK).toMatch(/addEventListener\(\s*"change"/);
    expect(HOOK).toMatch(/removeEventListener\(\s*"change"/);
    expect(HOOK).toMatch(/=>[\s\S]{0,12}true/);
  });
});

// ---------------------------------------------------------------------------

describe("S101-E the smalls fold (A104-I1 + B101-I4 + B101-I1)", () => {
  it("DEFECT: the stripAgedSnapshots claim gains the zero-action qualifier", () => {
    // RED pre-fix: the unqualified "lands exactly at the cap" — a
    // zero-action reply appends NO snapshot, leaving cap−1.
    expect(ASSISTANT_UI).not.toMatch(/the total retained lands exactly at the cap\./);
    expect(ASSISTANT_UI).toMatch(/when the reply carries a[\s\S]{0,10}snapshot/);
  });

  it("DEFECT: the lint-gate comment no longer undercounts the libs", () => {
    // RED pre-fix: "13 libs" — the live count is FOURTEEN (password.ts
    // landed one session before the comment did).
    expect(ESLINT_CONFIG).not.toMatch(/13 libs/);
    expect(ESLINT_CONFIG).toMatch(/14 libs/);
  });

  it("DEFECT: the LLM completion text rides the 64KB cap before the JSON scan", () => {
    // RED pre-fix: the model's reply buffered unbounded before
    // JSON.parse (the user side was already bounded; the SDK call
    // sets no max_tokens).
    expect(AI_ROUTE).toMatch(/\.slice\(0, 65_536\)/);
  });

  it("SURVIVAL (source): the stripAgedSnapshots signature + spread-call forms stay (the s76 pins)", () => {
    // GREEN by design: the S76-C contracts survive the comment edit.
    expect(ASSISTANT_UI).toMatch(/function stripAgedSnapshots\(prev: ChatMessage\[\]\): ChatMessage\[\] \{/);
    expect(ASSISTANT_UI).toMatch(/\.\.\.stripAgedSnapshots\(prev\),/);
  });
});

// ---------------------------------------------------------------------------

describe("S101 the live anchors", () => {
  it("LIVE ANCHOR: the delivered constants equal the PAD §7.1 Unit-total row (the family moves together)", () => {
    // RED pre-fix by construction: the §7.1 row still reads the S100
    // delivery's 1252 / 162 files until the S101-F docs pass re-anchors
    // it to this file's grown totals (1270 / 163). The count family's
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
