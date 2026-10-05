import { expect, test } from "@playwright/test";

// Session 81 (the twenty-ninth audit's chosen e2e discriminator).
//
// S81-B / A81-L2: the post-GET flush+drain pair lacked the first-run
// guard. The FIRST boundary deliberately skips the mount run ("a
// mount's previous instance already owned its boundary through the
// unmount cleanup's own captured-state PUT — no double-PUT, the
// S71-B discipline"), but the SECOND boundary (the post-GET
// pre-load pair) had no such guard: on Editor(A) → Back → Dashboard
// → open B (a MOUNT; the store singleton still holds A's unsaved
// state), the pair flushed and PUT A's full body AGAIN — a
// redundant full-replace transaction for the same project, the
// exact class S71-B closed for the exit path.
//
// THE DISCRIMINATOR: count the PUTs to project A's elements route
// through the mount navigation. The edit arms the 800ms debounce;
// goBack() lands INSIDE the window (the machine's flush never
// fired), so the unmount cleanup's captured-state PUT is transport
// #1. Pre-fix the mount's post-GET pair re-PUT the same body
// (transport #2). Post-fix the isMountRun guard skips the pair.
//
// Contexts arrive AUTHENTICATED.

const PROJECT_A = "Marketing Hero Banner";
const PROJECT_B = "Portfolio Website Redesign";

test.describe("session 81 — the mount double-PUT guard (S81-B / A81-L2)", () => {
  test("a MOUNT into a different project does NOT re-PUT the outgoing body the cleanup already transported", async ({ page }) => {
    // Land on the app first — a relative-fetch evaluate needs the
    // page on the origin (about:blank cannot resolve "/api/…", the
    // F45 lesson).
    await page.goto("/");

    // The ids (the shared e2e database's seeded projects).
    const ids = await page.evaluate(async () => {
      const res = await fetch("/api/projects");
      const body = await res.json();
      const a = body.data.projects.find((p: { name: string }) => p.name === "Marketing Hero Banner");
      const b = body.data.projects.find((p: { name: string }) => p.name === "Portfolio Website Redesign");
      return { a: a.id as string, b: b.id as string };
    });

    // Count every PUT to project A's elements route (the transport
    // discriminator — GETs and B-side traffic never touch it).
    let putCount = 0;
    await page.route(`**/api/projects/${ids.a}/elements`, async (route) => {
      if (route.request().method() === "PUT") putCount += 1;
      await route.continue();
    });

    // Open project A's editor.
    await page.getByRole("button", { name: `Open ${PROJECT_A}` }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    await expect(page.getByRole("heading", { name: PROJECT_A })).toBeVisible();

    // Edit the Accent Bar's X — the 800ms debounce arms; the
    // machine's flush has NOT fired when goBack lands below.
    await page.locator("button[aria-label='Layer Accent Bar']").click();
    await expect(page.getByText("1 selected", { exact: true })).toBeVisible();
    const beforeX = await page.evaluate(async (aId) => {
      const res = await fetch(`/api/projects/${aId}`);
      const body = await res.json();
      const bar = body.data.project.elements.find((e: { name: string }) => e.name === "Accent Bar");
      return bar.x as number;
    }, ids.a);
    const x = page.getByRole("spinbutton", { name: "X" });
    await x.fill(String(beforeX + 60));
    await expect
      .poll(() => page.locator("[data-element-id][aria-label='Accent Bar']").evaluate((n) => n.style.transform), {
        timeout: 5_000,
      })
      .toContain(`translate(${beforeX + 60}px`);

    // THE MOUNT-LEAVE — goBack INSIDE the debounce window. The
    // machine's flush never fired; the unmount cleanup's
    // captured-state PUT is transport #1 (the S62-C discipline).
    await page.goBack();
    await expect(page).toHaveURL(/\/(Dashboard)?$|\/$/);
    await expect(page.getByRole("heading", { name: PROJECT_B }).first()).toBeHidden();
    // The Dashboard lands (the Editor unmounted — the cleanup ran).
    await expect(page.getByText("Continue Working").first()).toBeVisible();

    // THE MOUNT — open project B (a fresh Editor mount; the store
    // singleton still holds A's unsaved state). Pre-fix: the
    // post-GET pair re-PUT A's body (transport #2). Post-fix: the
    // isMountRun guard skips the pair — B loads through the GET
    // alone.
    await page.getByRole("button", { name: `Open ${PROJECT_B}` }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    await expect(page.getByRole("heading", { name: PROJECT_B })).toBeVisible();

    // Let the post-GET window pass (the pair fires between the GET's
    // response and loadProject; a settle covers the async chain).
    await page.waitForTimeout(1_200);

    // THE DISCRIMINATOR: exactly ONE transport PUT — the cleanup's.
    // Pre-fix: 2 (the cleanup + the mount's post-GET re-PUT).
    expect(putCount).toBe(1);

    // B's board renders (the mount completed cleanly).
    await expect(page.getByRole("heading", { name: PROJECT_B })).toBeVisible();
  });
});
