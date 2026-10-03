import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The open-navigation batch (session 61, S61-H — the ninth Mode C
// audit's B-L-4 + B-L-5 + B-L-2).
//
// B-L-4: the Continue-Working "View all" link was a raw <a href> — a
// full document reload in the App Router (client state lost, prefetch
// gone) while every other internal link uses next/link.
//
// B-L-5: both openProject variants (grid card + list row) AWAITED the
// lastOpened PATCH before router.push — on a slow network the click
// appeared dead for the full round-trip.
//
// B-L-2: the bell trigger was a 36px target (p-2 + h-5 icon) below
// the project's own 44px convention for mobile header controls (the
// bell sits beside the 44px hamburger at 390), and the popover carried
// role="dialog" without aria-haspopup="dialog" on the trigger.

const dashSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/dashboard-view.tsx"),
  "utf8",
);
const cardSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/project-card.tsx"),
  "utf8",
);
const recentSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/recent-view.tsx"),
  "utf8",
);
const headerSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/app-header.tsx"),
  "utf8",
);

describe("the View-all soft navigation (session 61, S61-H / B-L-4)", () => {
  it("the link is a next/link Link, not a raw anchor", () => {
    // THE DEFECT PIN: pre-fix it was <a href="/Recent" …> — a full
    // document reload.
    expect(dashSource).toMatch(/import Link from "next\/link";/);
    expect(dashSource).toMatch(/<Link\s+href="\/Recent"/);
    expect(dashSource).not.toMatch(/<a\s+href="\/Recent"/);
  });
});

describe("the immediate card open (session 61, S61-H / B-L-5)", () => {
  it("the grid-card openProject navigates without awaiting the PATCH", () => {
    // THE DEFECT PIN: pre-fix the PATCH was awaited before
    // router.push — the click blocked on the round-trip.
    const start = cardSource.indexOf("async function openProject() {");
    expect(start).toBeGreaterThan(-1);
    const end = cardSource.indexOf("router.push(", start);
    const body = cardSource.slice(start, end);
    expect(body).not.toMatch(/await fetch/);
    expect(body).toContain("fetch(`/api/projects/${project.id}`, {");
  });

  it("the list-row openProject navigates without awaiting the PATCH", () => {
    const start = recentSource.indexOf("async function openProject() {");
    expect(start).toBeGreaterThan(-1);
    const end = recentSource.indexOf("router.push(", start);
    const body = recentSource.slice(start, end);
    expect(body).not.toMatch(/await fetch/);
    expect(body).toContain("fetch(`/api/projects/${project.id}`, {");
  });
});

describe("the bell 44px trigger + dialog semantics (session 61, S61-H / B-L-2)", () => {
  it("the trigger is a 44px flex-centered target carrying aria-haspopup=dialog", () => {
    // THE DEFECT PIN: pre-fix the trigger was
    // "rounded-lg p-2 text-gray-400 …" (36px) with no aria-haspopup.
    const start = headerSource.indexOf('aria-label="Notifications"');
    expect(start).toBeGreaterThan(-1);
    const buttonStart = headerSource.lastIndexOf("<button", start);
    const buttonEnd = headerSource.indexOf("</button>", start);
    const button = headerSource.slice(buttonStart, buttonEnd);
    expect(button).toContain('aria-haspopup="dialog"');
    expect(button).toContain("flex h-11 w-11 items-center justify-center");
    // The popover's own role/aria-label stay (pinned at workspace.spec.ts:94).
    expect(headerSource.slice(buttonEnd)).toContain('role="dialog"');
  });
});
