import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session 63 (S63-G — the eleventh audit's dead-code Low batch):
// A-L1 the dead `avatarColor` field on HeaderUser (declared, constructed
// by every page, never consumed — the header avatar renders a static
// gradient + User icon); A-L5 the Recent dead nested container (the
// inner `mx-auto max-w-7xl px-0 py-8 sm:px-0` classes are no-ops inside
// the identical parent — only py-8 is load-bearing); B-L1-partial the
// dead ELEMENT_TOOLS export in lib/editor.ts (zero consumers in src AND
// tests); B-L2 the broken db:reset script (prisma migrate reset without
// prisma/migrations/ — the project is db-push flow); B-L4 the dead
// supabase remotePatterns grant (next/image is never imported).

const headerSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/app-header.tsx"),
  "utf8",
);
const recentSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/recent-view.tsx"),
  "utf8",
);
const editorSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const pkgSource = readFileSync(
  path.resolve(import.meta.dirname, "../package.json"),
  "utf8",
);
const nextConfigSource = readFileSync(
  path.resolve(import.meta.dirname, "../next.config.ts"),
  "utf8",
);

describe("the dead-code Low batch (session 63, S63-G)", () => {
  it("HeaderUser carries no dead avatarColor field (A-L1)", () => {
    // THE DEFECT PIN: pre-fix the interface declared avatarColor: string
    // with zero readers.
    expect(headerSource).not.toContain("avatarColor");
  });

  it("the Recent nested container carries only its load-bearing class (A-L5)", () => {
    // Pre-fix: <div className="mx-auto max-w-7xl px-0 py-8 sm:px-0"> —
    // every class except py-8 is a no-op inside the identical parent.
    // Post-fix: className="py-8" (layout pixel-identical).
    expect(recentSource).not.toContain("max-w-7xl px-0");
    expect(recentSource).toContain('className="py-8"');
  });

  it("lib/editor.ts exports no dead ELEMENT_TOOLS (B-L1-partial)", () => {
    // Pre-fix: export const ELEMENT_TOOLS: EditorTool[] — zero
    // consumers anywhere (grep-verified across src/ and tests/).
    expect(editorSource).not.toContain("ELEMENT_TOOLS");
  });

  it("package.json ships no broken db:reset script (B-L2)", () => {
    // Pre-fix: "db:reset": "prisma migrate reset" — errors without
    // prisma/migrations/ (db:push + db:seed are the documented flow).
    expect(pkgSource).not.toContain("db:reset");
  });

  it("next.config.ts grants no dead supabase image host (B-L4)", () => {
    // Pre-fix: the qtrypzzcjebvfcihiynt.supabase.co remotePatterns entry —
    // next/image is never imported (plain <img> everywhere).
    expect(nextConfigSource).not.toContain("supabase.co");
  });

  it("the elementToStyle doc comment carries the honest test-only status (B-L1 honesty)", () => {
    // The stale comment claimed "The inline style the canvas renders an
    // element with" — the canvas re-implements the chain inline; the
    // export pins the reference geometry contract through the unit
    // suite. The comment now says so (TEST-ONLY marker, uppercase).
    expect(editorSource).toContain("TEST-ONLY");
  });
});
