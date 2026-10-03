import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-68 client/test-infra low batch (S68-D — the sixteenth
// audit's L-2 + L-4 + L-5 + L-6).
//
// THE DEFECTS: (L-2) the autosave machine has no terminal state for
// auth failures — every !response.ok resets to "unsaved" and re-arms,
// so a 401 (cookie expired mid-session) loops the PUT at ~1 req/s
// forever with the generic "Autosave failed" toast. (L-4)
// `fitToBounds`/`normalizeRect` in lib/editor.ts carry zero production
// consumers with a stale "used by thumbnails" claim (both are
// unit-pinned geometry contracts — the honest fix is the TEST-ONLY
// doc status, the session-63 elementToStyle precedent). (L-5) the
// dead `@radix-ui/react-toast` dependency (zero imports — the custom
// globalThis toast store owns the surface). (L-6) the playwright
// `reuseExistingServer` leftover-server hazard — a stale :3100 server
// is silently reused with its old code and in-memory rate-limit
// buckets.
//
// THE FIX: the 401 terminal (a sessionDead flag + the distinct
// "Session expired" toast + no further attempts); the TEST-ONLY doc
// markers; the dependency removed; the webServer pre-kill + fresh
// boot.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the autosave 401 terminal (S68-D / L-2)", () => {
  const view = src("src/components/editor/editor-view.tsx");

  it("the PUT failure branch discriminates 401 BEFORE the generic retry family", () => {
    // THE DEFECT PIN: pre-fix every !response.ok lands in one branch
    // — no status discrimination anywhere in the machine.
    expect(view).toMatch(/response\.status === 401/);
    const branch = view.slice(view.indexOf("if (!response.ok || !body?.ok)"));
    const statusCheck = branch.indexOf("response.status === 401");
    const genericToast = branch.indexOf('"Autosave failed"');
    expect(statusCheck).toBeGreaterThan(-1);
    expect(genericToast).toBeGreaterThan(statusCheck);
  });

  it("the distinct session-expired toast fires once", () => {
    expect(view).toMatch(/"Session expired"/);
    expect(view).toMatch(/sign in again to save your changes/);
  });

  it("a dead session stops the machine — the flush early-returns on the flag", () => {
    expect(view).toMatch(/sessionDead/);
    const flush = view.slice(view.indexOf("async function flush()"), view.indexOf("async function flush()") + 900);
    expect(flush).toMatch(/if \(sessionDead\) return/);
  });

  it("the Untitled-mode creation POST obeys the same terminal", () => {
    // A dead session must not loop the /api/projects creation POST
    // either — ensureProject checks the 401 the same way.
    const ensure = view.slice(
      view.indexOf("async function ensureProject()"),
      view.indexOf("async function ensureProject()") + 1200,
    );
    expect(ensure).toMatch(/response\.status === 401/);
  });

  it("the network-error catch keeps its retry family (preservation)", () => {
    // The 401 terminal is for DEAD SESSIONS ONLY — a network error or
    // a 5xx still retries through the S56-B machine.
    expect(view).toMatch(/toast\.error\("Network error", "Autosave could not reach the server\."\)/);
  });
});

describe("the playwright leftover-server guard (S68-D / L-6)", () => {
  it("the webServer command pre-kills any stale standalone server (the anchored form)", () => {
    const config = src("playwright.config.ts");
    // THE DEFECT PIN: pre-fix the command boots bare and
    // reuseExistingServer trusts whatever holds the port. The ANCHORED
    // pattern matches only a real bun server process — never the
    // command's own shell (the naive unanchored form's shell carried
    // the pattern text in its cmdline and killed itself).
    expect(config).toMatch(/pkill -f "\^bun \.next\/standalone"/);
    // The fresh boot always wins the port — a leftover server is
    // never silently reused.
    expect(config).toMatch(/reuseExistingServer: false/);
    expect(config).not.toMatch(/reuseExistingServer: !process\.env\.CI/);
  });
});

describe("the dead dependency is gone (S68-D / L-5)", () => {
  it("package.json carries no @radix-ui/react-toast", () => {
    const pkg = src("package.json");
    expect(pkg).not.toMatch(/@radix-ui\/react-toast/);
  });

  it("the install script carries no @radix-ui/react-toast", () => {
    const script = src("scripts/install_packages.sh");
    expect(script).not.toMatch(/@radix-ui\/react-toast/);
  });

  it("no source file imports @radix-ui/react-toast (the absence contract)", () => {
    // The custom globalThis toast store owns the surface — the
    // dependency was pure dead weight.
    const files = [
      "src/hooks/use-toast.ts",
      "src/components/ui/toaster.tsx",
      "src/components/editor/ai-assistant.tsx",
    ];
    for (const file of files) {
      expect(src(file), `${file} must not import the radix toast`).not.toMatch(
        /@radix-ui\/react-toast/,
      );
    }
  });
});

describe("the TEST-ONLY doc markers on the pinned geometry seams (S68-D / L-4)", () => {
  it("fitToBounds carries the honest TEST-ONLY status (zero production consumers)", () => {
    const editor = src("src/lib/editor.ts");
    // The marker lives in the doc comment ABOVE the signature — slice
    // from the comment's start, not the export line.
    const fn = editor.slice(editor.lastIndexOf("/**", editor.indexOf("export function fitToBounds")));
    expect(fn.slice(0, 700)).toMatch(/TEST-ONLY/i);
  });

  it("normalizeRect carries the honest TEST-ONLY status", () => {
    const editor = src("src/lib/editor.ts");
    const fn = editor.slice(editor.lastIndexOf("/**", editor.indexOf("export function normalizeRect")));
    expect(fn.slice(0, 700)).toMatch(/TEST-ONLY/i);
  });
});
