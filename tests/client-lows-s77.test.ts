import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-77 client low batch (S77-A + S77-B + S77-C + S77-D + S77-E —
// the twenty-fifth audit's A-L4, A-L1, A-L2, A-L3, A-L5).
//
// S77-A — THE DEFECT: the 44px close-target floor lived in TEN duplicated
// call-site overrides ([&>button]:h-11 [&>button]:w-11) while the vendored
// Sheet/Dialog primitives' own close buttons stayed ~20px — the S76-E
// toaster fix's drift-hazard twin (the F35e class applied to a11y): the
// next consumer that forgets the override silently ships a sub-floor
// mobile close target.
//
// THE FIX: the primitives own the floor — SheetContent's and
// DialogContent's built-in close buttons carry h-11 w-11 flex
// items-center justify-center; the call-site overrides become inert
// (the rendered geometry is unchanged at every existing consumer —
// all ten already apply the same floor).
//
// S77-B — THE DEFECT: the Recent list card's title anchor unconditionally
// preventDefault()ed — a Cmd/Ctrl/Shift/Alt+click (new tab / new window)
// had its native behavior canceled and got a same-tab SPA navigation
// instead, on a FILE LIST, the exact surface where tab-opening is a
// habit. Every other navigation surface is a Button or a Next Link
// (modifier-aware); this was the only hand-rolled intercept.
//
// THE FIX: the handler bails before preventDefault() when a modifier is
// held — the browser's native secondary-click behavior runs; the SPA
// navigation + the silent lastOpened PATCH fire on the plain path only.
//
// S77-C — THE DEFECT: the AI chat transcript container had no role="log"
// — assistant replies were never announced to screen readers (silence
// until manual navigation into the list). The complementary gap to
// S76-D: that pass correctly removed per-TICK live regions, but ARRIVAL
// announcements are the legitimate use, and messages append atomically.
//
// THE FIX: role="log" on the messages container (the implicit polite
// region — no per-message aria-live attribute, so the S76-D
// exactly-one-live-region contract in the editor DOM is preserved).
//
// S77-D — THE DEFECT: the editor header's avatar initial was the one
// site without the guarded form — user.name.charAt(0) with no
// trim/upper/fallback (a whitespace-leading name renders a blank chip).
//
// THE FIX: the user-initial family's guarded expression reaches the
// fourth site: user.name.trim().charAt(0).toUpperCase() || "D".
//
// S77-E — THE DEFECT: the editor's different-project load branch never
// re-armed loading — a soft /Editor?projectId=A -> /Editor?projectId=B
// swap kept project A painting for the full GET window (the header, the
// canvas) while the fetch ran; only programmatic/URL-level navigation
// reaches it (in-app exits unmount first), and the S57-B swap guards
// kept data integrity.
//
// THE FIX: setLoading(true) at the head of the different-project branch
// (inside the async IIFE's sync prefix — the sanctioned form).

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

// ---------------------------------------------------------------------------
// S77-A — the primitive 44px close floor
// ---------------------------------------------------------------------------
describe("the primitive close-button floor (S77-A / A-L4 — the headline)", () => {
  const sheet = src("src/components/ui/sheet.tsx");
  const dialog = src("src/components/ui/dialog.tsx");

  it("SheetContent's built-in close button carries the 44px floor", () => {
    // THE DEFECT PIN: pre-fix the primitive's close stayed ~20px
    // (absolute right-4 top-4 + a h-5 w-5 glyph) — the floor held only
    // where consumers remembered the [&>button]:h-11 override.
    const m = sheet.match(/<SheetPrimitive\.Close className="([^"]+)"/);
    expect(m).not.toBeNull();
    expect(m?.[1]).toMatch(/\bh-11\b/);
    expect(m?.[1]).toMatch(/\bw-11\b/);
    expect(m?.[1]).toMatch(/\bflex\b/);
    expect(m?.[1]).toMatch(/\bitems-center\b/);
    expect(m?.[1]).toMatch(/\bjustify-center\b/);
  });

  it("SheetContent's close keeps its sr-only label (the floor must not eat the a11y name)", () => {
    // PRESERVATION: the visually-hidden "Close" label is the button's
    // accessible name — the floor classes must not displace it.
    const m = sheet.match(/<SheetPrimitive\.Close[\s\S]*?<\/SheetPrimitive\.Close>/);
    expect(m).not.toBeNull();
    expect(m?.[0]).toMatch(/sr-only/);
    expect(m?.[0]).toMatch(/Close/);
  });

  it("DialogContent's built-in close button carries the 44px floor", () => {
    // THE DEFECT PIN: the Dialog twin of the same primitive gap.
    const m = dialog.match(/<DialogPrimitive\.Close className="([^"]+)"/);
    expect(m).not.toBeNull();
    expect(m?.[1]).toMatch(/\bh-11\b/);
    expect(m?.[1]).toMatch(/\bw-11\b/);
    expect(m?.[1]).toMatch(/\bflex\b/);
    expect(m?.[1]).toMatch(/\bitems-center\b/);
    expect(m?.[1]).toMatch(/\bjustify-center\b/);
  });

  it("the call-site overrides are inert now (at least one consumer keeps its override — the belt)", () => {
    // PRESERVATION (the F35e discipline): the primitive owning the floor
    // makes the override redundant, but the repo keeps them — zero
    // behavioral delta either way. Pin that a consumer still compiles
    // the pair (the override form is harmless beside the primitive's).
    const header = src("src/components/app-header.tsx");
    expect(header).toMatch(/\[\&>button\]:h-11/);
  });
});

// ---------------------------------------------------------------------------
// S77-B — the modifier-click preservation on the Recent title anchor
// ---------------------------------------------------------------------------
describe("the Recent title anchor's modifier-click preservation (S77-B / A-L1)", () => {
  const recent = src("src/components/recent-view.tsx");

  it("the handler bails before preventDefault when a modifier is held", () => {
    // THE DEFECT PIN: pre-fix the handler unconditionally
    // preventDefault()ed — Ctrl/Cmd/Shift/Alt+click was swallowed into
    // a same-tab SPA navigation.
    const m = recent.match(
      /<a\s+href=\{`\/Editor\?projectId=\$\{project\.id\}`\}\s*onClick=\{\(event\) => \{([\s\S]*?)\}\}/,
    );
    expect(m).not.toBeNull();
    const body = m?.[1] ?? "";
    const bail = body.indexOf("metaKey");
    const pd = body.indexOf("event.preventDefault()");
    expect(bail).toBeGreaterThan(-1);
    expect(pd).toBeGreaterThan(-1);
    // The modifier bail must PRECEDE the preventDefault — the native
    // secondary-click behavior runs when a modifier is held.
    expect(bail).toBeLessThan(pd);
    expect(body).toMatch(/ctrlKey/);
    expect(body).toMatch(/shiftKey/);
    expect(body).toMatch(/altKey/);
  });

  it("the plain-click path keeps the SPA navigation + the silent lastOpened PATCH", () => {
    // PRESERVATION: the openProject helper is untouched — the PATCH
    // rides the ONE call() seam's silent variant, then router.push.
    const m = recent.match(/function openProject\(\) \{[\s\S]*?\n  \}/);
    expect(m).not.toBeNull();
    expect(m?.[0]).toMatch(/lastOpened: true/);
    expect(m?.[0]).toMatch(/\{ silent: true \}/);
    expect(m?.[0]).toMatch(/router\.push\(`\/Editor\?projectId=\$\{project\.id\}`\)/);
  });
});

// ---------------------------------------------------------------------------
// S77-C — the AI transcript role="log"
// ---------------------------------------------------------------------------
describe("the AI transcript's arrival announcements (S77-C / A-L2)", () => {
  const assistant = src("src/components/editor/ai-assistant.tsx");

  it("the messages container carries role=log (the implicit polite arrival region)", () => {
    // THE DEFECT PIN: pre-fix the transcript scroll container had no
    // log role — assistant replies were never announced.
    const m = assistant.match(
      /<div role="log" className="editor-scroll min-h-0 flex-1 space-y-3 overflow-y-auto p-3">/,
    );
    expect(m).not.toBeNull();
  });

  it("no per-message live attribute was reintroduced (the S76-D contract holds)", () => {
    // PRESERVATION: role=log on the CONTAINER is the arrival form; the
    // per-message bubbles must not carry their own live attributes (the
    // exactly-one-live-region-in-the-editor-DOM discipline). Scoped to
    // the element openings — the comment-literal discipline (F58): a
    // whole-file absence grep would false-fail on this spec's own
    // explanatory comments in the source.
    const bubbleOpens = assistant.match(/<(div|p) className="[^"]*"[^>]*>/g) ?? [];
    for (const open of bubbleOpens) {
      expect(open).not.toMatch(/aria-live/);
    }
    expect(assistant).not.toMatch(/<div[^>]*aria-live/);
  });
});

// ---------------------------------------------------------------------------
// S77-D — the editor avatar guarded initial
// ---------------------------------------------------------------------------
describe("the editor header avatar's guarded initial (S77-D / A-L3)", () => {
  const editor = src("src/components/editor/editor-view.tsx");

  it("the first chip renders the family's guarded expression (trim + upper + fallback)", () => {
    // THE DEFECT PIN: pre-fix the chip rendered the bare
    // user.name.charAt(0) — a whitespace-leading name rendered a blank
    // chip (the user-initial family's fourth site, the last unguarded).
    const m = editor.match(/\{user\.name\.trim\(\)\.charAt\(0\)\.toUpperCase\(\) \|\| "D"\}/);
    expect(m).not.toBeNull();
    expect(editor).not.toMatch(/\{user\.name\.charAt\(0\)\}/);
  });

  it("the chip keeps its title contract (the hover identity)", () => {
    // PRESERVATION: the real-user chip's title stays the user's name.
    const m = editor.match(/title=\{user\.name\}/);
    expect(m).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// S77-E — the project-swap loading re-arm
// ---------------------------------------------------------------------------
describe("the editor's project-swap loading re-arm (S77-E / A-L5)", () => {
  const editor = src("src/components/editor/editor-view.tsx");

  it("the different-project branch re-arms loading BEFORE its fetch", () => {
    // THE DEFECT PIN: pre-fix the branch never set loading — a soft
    // A -> B swap kept project A painting for the whole GET window.
    const branch = editor.slice(
      editor.indexOf("const response = await fetch(`/api/projects/${projectId}`);"),
    );
    // The setLoading(true) call must exist in the effect BEFORE the
    // fetch call (the effect's sync prefix — the sanctioned form).
    const effectStart = editor.indexOf("React.useEffect(() => {", editor.indexOf("UNTITLED_PROJECT") > 0 ? 0 : 0);
    const loadEffect = editor.slice(
      editor.lastIndexOf("React.useEffect(() => {", editor.indexOf("const response = await fetch(`/api/projects/${projectId}`);")),
    );
    const rearm = loadEffect.indexOf("setLoading(true)");
    const fetch = loadEffect.indexOf("const response = await fetch(`/api/projects/${projectId}`);");
    expect(rearm).toBeGreaterThan(-1);
    expect(fetch).toBeGreaterThan(-1);
    expect(rearm).toBeLessThan(fetch);
    // The re-arm sits INSIDE the different-project branch — AFTER the
    // same-project skip guard's early return (the skip path must not
    // flash the loading gate).
    const skipReturn = loadEffect.indexOf("loadProject(UNTITLED_PROJECT)");
    void branch;
    void effectStart;
    const skipGuard = loadEffect.indexOf("useEditorStore.getState().projectId === projectId");
    expect(rearm).toBeGreaterThan(skipGuard);
  });

  it("the same-project skip path never arms the loading gate (no flash on the adoption re-run)", () => {
    // PRESERVATION: the S61-I adoption-clobber skip keeps its
    // setLoading(false) form — the URL catching up must not flash.
    const m = editor.match(/if \(useEditorStore\.getState\(\)\.projectId === projectId\) \{\s*setLoading\(false\);/);
    expect(m).not.toBeNull();
  });
});
