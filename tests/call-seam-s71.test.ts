import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-71 call() consolidation (S71-A — the nineteenth audit's
// L-A1 + L-A2).
//
// THE DEFECTS: (L-A1) SIX card-level raw fetch sites bypass the ONE
// `call()` seam (src/lib/call.ts, the S65-E contract): the rename PATCH,
// the lastOpened fire-and-forget PATCH, the DELETE, and the create POST in
// project-card.tsx + the lastOpened PATCH and the DELETE in
// recent-view.tsx — each hand-rolling envelope unwrapping + its own error
// copy + a .catch network branch (exactly the three-copies drift family
// S65-E closed for the views). The seam itself hardcodes the failure toast
// title "Something went wrong" and ALWAYS toasts, so the fire-and-forget
// family cannot migrate without an errorTitle option + a silent variant.
// (L-A2) the Dashboard's LIST-row open never touches lastOpenedAt
// (dashboard-view.tsx — a bare router.push) while the grid card and the
// Recent list card both fire the PATCH — "Continue Working" and Recent
// ordering silently disagree with the card-family paths.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the call() options surface (S71-A / L-A1)", () => {
  const call = src("src/lib/call.ts");

  it("the signature carries the opts parameter (errorTitle + silent)", () => {
    // THE DEFECT PIN: pre-fix the signature is call<T>(url, init?) with
    // no options surface — the title is hardcoded and every failure
    // toasts.
    expect(call).toMatch(/export interface CallOptions \{\s*errorTitle\?:\s*string;\s*silent\?:\s*boolean;\s*\}/);
    expect(call).toMatch(/call<T>\(\s*url:\s*string,\s*init\?:\s*RequestInit,\s*opts\?:\s*CallOptions\)/);
  });

  it("the failure toast title derives from opts (errorTitle ?? the default)", () => {
    // THE DEFECT PIN: pre-fix toast.error("Something went wrong", …) is
    // unconditional.
    expect(call).toMatch(/errorTitle\s*\?\?\s*"Something went wrong"/);
  });

  it("silent suppresses BOTH toast families (envelope failure + network catch)", () => {
    // THE DEFECT PIN: pre-fix no silent concept exists — the
    // fire-and-forget PATCH family cannot migrate without spamming a
    // destructive toast on every failure.
    const envelopeIdx = call.indexOf("toast.error(");
    const catchIdx = call.indexOf("} catch {");
    expect(envelopeIdx).toBeGreaterThan(-1);
    expect(catchIdx).toBeGreaterThan(envelopeIdx);
    // Both toast sites sit behind the same silent guard.
    expect(call).toMatch(/if\s*\(!opts\?\.silent\)\s*\{\s*toast\.error\(/);
    const matches = call.match(/if\s*\(!opts\?\.silent\)\s*\{/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("the default behavior is preserved for every existing call site (the S65-E contract)", () => {
    // THE PRESERVATION PIN: opts is optional; the JSON content-type merge
    // and the data unwrap survive untouched.
    expect(call).toMatch(/\.\.\.\(init\?\.body\s*\?\s*\{\s*headers:\s*\{\s*"Content-Type":\s*"application\/json"/);
    expect(call).toMatch(/return\s*\(body\.data\s*\?\?\s*null\)\s*as\s*T\s*\|\s*null/);
  });
});

describe("the six-site migration (S71-A / L-A1)", () => {
  it("project-card.tsx carries ZERO raw fetch calls", () => {
    // THE DEFECT PIN: pre-fix four raw sites (rename :253, lastOpened
    // :365, DELETE :376, create POST :590).
    const card = src("src/components/project-card.tsx");
    expect(card).not.toMatch(/\bfetch\(/);
  });

  it("recent-view.tsx carries ZERO raw fetch calls", () => {
    // THE DEFECT PIN: pre-fix two raw sites (lastOpened :104, DELETE
    // :115).
    const recent = src("src/components/recent-view.tsx");
    expect(recent).not.toMatch(/\bfetch\(/);
  });

  it("the awaited sites keep their toast titles through errorTitle", () => {
    // THE DEFECT PIN: pre-fix the titles live in per-site hand-rolled
    // branches; post-fix they ride the seam's options.
    const card = src("src/components/project-card.tsx");
    const recent = src("src/components/recent-view.tsx");
    expect(card).toMatch(/errorTitle:\s*"Rename failed"/);
    expect(card).toMatch(/errorTitle:\s*"Delete failed"/);
    expect(card).toMatch(/errorTitle:\s*"Could not create the project"/);
    expect(recent).toMatch(/errorTitle:\s*"Delete failed"/);
  });

  it("the two lastOpened fire-and-forget PATCHes are silent", () => {
    // THE DEFECT PIN: pre-fix the PATCHes hand-roll .catch(() => null)
    // with no toast — the S61-H toast-less contract; post-fix the silence
    // is the seam's declared option.
    const card = src("src/components/project-card.tsx");
    const recent = src("src/components/recent-view.tsx");
    const cardSilent = card.match(/silent:\s*true/g) ?? [];
    const recentSilent = recent.match(/silent:\s*true/g) ?? [];
    expect(cardSilent.length).toBe(1);
    expect(recentSilent.length).toBe(1);
  });
});

describe("the Dashboard list-row lastOpened PATCH (S71-A / L-A2)", () => {
  it("the list-row open touches lastOpenedAt through the silent PATCH", () => {
    // THE DEFECT PIN: pre-fix openEditor is a bare router.push
    // (dashboard-view.tsx:79-81) — the list-row open never reorders
    // "Continue Working" or Recent.
    const dashboard = src("src/components/dashboard-view.tsx");
    expect(dashboard).toMatch(/lastOpened:\s*true/);
    expect(dashboard).toMatch(/silent:\s*true/);
  });
});
