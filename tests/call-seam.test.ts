import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The shared client call() seam (session 65, S65-E — the thirteenth
// audit's A-5).
//
// THE DEFECT: the envelope-unwrap helper existed as THREE per-view
// copies — two identical init-aware twins and a files-view variant
// that had already LOST the request-init parameter (the drift the
// audit predicted had happened). The documented contract is ONE
// unwrap seam for every client view; duplicated domain helpers drift
// by construction (the single-sourced predicate lesson the editor
// learned the session before).
//
// THE FIX: one client module carries the init-aware superset form;
// the three views consume the import and carry no local copy.

const callModulePath = path.resolve(import.meta.dirname, "../src/lib/call.ts");
const viewFiles = [
  "../src/components/dashboard-view.tsx",
  "../src/components/teams-view.tsx",
  "../src/components/recent-view.tsx",
];

describe("the shared call() seam (session 65, S65-E / A-5)", () => {
  it("the client lib module exists with the init-aware form", () => {
    // THE DEFECT PIN: pre-fix no shared module existed — the form
    // lived (twice) inside the view files.
    const src = readFileSync(callModulePath, "utf8");
    expect(src).toMatch(/export async function call<T>\(url: string, init\?: RequestInit\)/);
    expect(src).toMatch(/toast\.error\(/);
    expect(src).toMatch(/"Content-Type": "application\/json"/);
  });

  it("no view carries a local unwrap helper anymore", () => {
    // THE DEFECT PIN: pre-fix all three views declared their own.
    for (const file of viewFiles) {
      const src = readFileSync(path.resolve(import.meta.dirname, file), "utf8");
      expect(src).not.toMatch(/async function call<T>\(/);
    }
  });

  it("all three views consume the shared seam", () => {
    for (const file of viewFiles) {
      const src = readFileSync(path.resolve(import.meta.dirname, file), "utf8");
      expect(src).toMatch(/from "@\/lib\/call"/);
    }
  });
});
