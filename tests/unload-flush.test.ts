import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The unload keepalive flush (session 61, S61-I — session-60's
// deferred A-3, the design now decided).
//
// The autosave machine flushed ONLY via the 800ms debounce timer and
// exit() — no pagehide/sendBeacon/keepalive anywhere in src (grep-
// verified again this session). Edits inside the debounce window were
// lost on F5 / tab close / browser Back.
//
// The design: a pagehide listener beside the autosave machine fires
// the captured-body PUT with keepalive: true — the browser completes
// it through the unload. The honest limits are coded, not hidden:
// - The JSON body is size-guarded (keepalive bodies cap at 64KB in
//   Chromium; the PUT sends the FULL element list, so large boards are
//   skipped — documented, not silent).
// - Untitled mode is skipped (the creation POST's adoption contract is
//   out of unload scope).
// - The listener is cleaned up on unmount (the editor's lifecycle).

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

describe("the unload keepalive flush (session 61, S61-I / A-3)", () => {
  it("the autosave machine registers a pagehide listener and cleans it up", () => {
    // THE DEFECT PIN: pre-fix no pagehide listener existed — edits in
    // the debounce window were lost on refresh/tab close.
    expect(viewSource).toMatch(/addEventListener\("pagehide", onUnload\)/);
    expect(viewSource).toMatch(/removeEventListener\("pagehide", onUnload\)/);
  });

  it("the unload PUT carries keepalive and the captured body", () => {
    // THE DEFECT PIN: pre-fix the machine's only transports were the
    // timer and exit() — neither survives unload.
    const start = viewSource.indexOf("function onUnload()");
    expect(start).toBeGreaterThan(-1);
    const end = viewSource.indexOf('window.addEventListener("pagehide", onUnload);', start);
    expect(end).toBeGreaterThan(start);
    const body = viewSource.slice(start, end);
    expect(body).toContain("keepalive: true");
    expect(body).toContain("/elements");
    expect(body).toContain("backgroundColor");
  });

  it("the flush is honest about the keepalive body cap, skips Untitled mode, and NEVER declines behind an in-flight regular PUT", () => {
    const start = viewSource.indexOf("function onUnload()");
    const end = viewSource.indexOf('window.addEventListener("pagehide", onUnload);');
    expect(end).toBeGreaterThan(start);
    const body = viewSource.slice(start, end);
    // The size guard: a board whose full-list body exceeds the
    // keepalive cap is skipped (documented limitation).
    expect(body).toMatch(/JSON\.stringify\(\{\s*elements:/);
    // Session 62 (S62-F / A-L1 — a legitimate contract update): the
    // guard now measures BYTES (Blob.size) — the pre-fix
    // payload.length counted UTF-16 code units, so a CJK/emoji-heavy
    // body under 60,000 units could still exceed Chromium's 64KB
    // keepalive byte cap.
    expect(body).toMatch(/if \(new Blob\(\[payload\]\)\.size > 60_000\) return;/);
    // The Untitled skip: no projectId means no PUT target (the creation
    // POST's adoption contract is out of unload scope).
    expect(body).toMatch(/if \(!projectId\) return;/);
    // Session 61 (S61-I, en-route): the flushing guard is GONE — a
    // regular in-flight fetch does not survive teardown, so declining
    // behind it lost exactly the edits the listener exists to save
    // (observed live: the machine's PUT canceled mid-flight at reload
    // with the guard in place).
    expect(body).not.toMatch(/if \(flushing\) return;/);
  });

  it("the loader's adoption guard — a replaceState-triggered re-run must not clobber the live store", () => {
    // Session 61 (S61-I, en-route — the adoption-clobber guard): Next
    // 14.1+ integrates window.history.replaceState into the App Router,
    // so the Untitled adoption's replaceState re-runs the load effect
    // with the fresh id. THE DEFECT: the re-run's GET raced the
    // machine's own first PUT, returned the project WITHOUT the
    // just-drawn elements, and the unconditional loadProject clobbered
    // the live store with the stale server list.
    const effectStart = viewSource.indexOf("React.useEffect(() => {", viewSource.indexOf("const flushNow = useAutosave();"));
    expect(effectStart).toBeGreaterThan(-1);
    const effectEnd = viewSource.indexOf("function onShare()", effectStart);
    const effect = viewSource.slice(effectStart, effectEnd);
// Session 85 (S85-A / A85-M1): re-anchored onto the !isMountRun form —
    // the adoption-clobber guard gained the mount discriminator (a fresh
    // re-entry mount LOADS; the replaceState re-run keeps its skip). The
    // intent (the adoption re-run must not clobber the live store)
    // unchanged.
    expect(effect).toMatch(
      /if \(!isMountRun && useEditorStore\.getState\(\)\.projectId === projectId\) \{/,
    );
  });
});
