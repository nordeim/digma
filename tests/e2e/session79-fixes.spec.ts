import { expect, test } from "@playwright/test";

// Session 79 — the S79-A Untitled-boundary soft-swap discriminator, the
// S79-B swap-boundary flush persistence, and the S79-E hidden-selection
// chrome check.
//
// S79-A: the S78-A scope guards' "" boundary — a live UNTITLED editor
// that soft-swaps to a named project kept its transcript (the
// adoption-shaped exemption passed a loadProject transition; an
// ""-scoped revert carrier passed the falsy belt; an Untitled send
// passed the mid-flight guard). THE SOFT-SWAP FORM: window.history.
// pushState — the Next 14.1+ patched-history soft navigation the S61-I
// documentation itself proves (a FULL page.goto remounts the component
// and resets the transcript trivially — the s78 spec's goto form was a
// weaker discriminator than its comment claimed; this spec uses the
// true soft form).
//
// S79-B: the outgoing project's pending edits — pre-fix the 800ms
// debounce timer's flush early-returned once loadProject(B) stamped
// saveState "saved" and no other transport fires on a same-route swap
// (the unmount cleanup is keyed [] and never runs; exit()/pagehide are
// different boundaries) — an edit inside the window was silently lost.
// Post-fix the load effect flushes through the machine BEFORE the
// load. The probe: send "add 3 circles" on project A (6 seeded
// elements -> 9 pending), pushState-swap to project B inside the
// window, then read project A through the API — 9 post-fix, 6 pre-fix.
//
// S79-E: an eye-hidden selected element kept its selection outline +
// 8 draggable handles over blank canvas (the element render filters
// visible; the chrome did not). The probe: select the seeded
// rectangle, hide it through the layers row's eye, the outline box is
// gone.

const PROJECT_A = "Marketing Hero Banner";
const PROJECT_B = "Portfolio Website Redesign";

test.describe("session 79 — the Untitled-boundary transcript scope (S79-A)", () => {
  test("a soft swap from a live UNTITLED editor resets the transcript to the intro bubble", async ({ page }) => {
    // Open the UNTITLED editor (the bare /Editor route — ADR-009).
    await page.goto("/Editor");
    await expect(page.getByRole("heading", { name: "Untitled", exact: true })).toBeVisible();

    // Send an AI command the deterministic parser answers with real
    // operations (add circles) — the reply carries a revert carrier
    // captured under the Untitled ("") scope.
    const input = page.getByLabel("Message the AI design assistant");
    await input.fill("add 3 circles");
    await input.press("Enter");
    await expect(page.getByText(/action\(s\) performed/i)).toBeVisible({ timeout: 15_000 });

    // The transcript now carries: intro + user + reply = 3 bubbles.
    await expect(
      page.locator('[role="log"] p').filter({ hasText: /Hi! I'm your AI design assistant/ })
    ).toBeVisible();

    // Fetch project B's id from the seeded API (authenticated context).
    const bId = await page.evaluate(async () => {
      const res = await fetch("/api/projects");
      const body = await res.json();
      const match = body.data.projects.find((p: { name: string }) => p.name === "Portfolio Website Redesign");
      return match.id as string;
    });

    // THE SOFT SWAP — the true same-instance form (the patched
    // pushState the S61-I replaceState documentation proves; a goto
    // would remount and reset trivially).
    await page.evaluate((url) => {
      window.history.pushState({}, "", url);
    }, `/Editor?projectId=${bId}`);

    // Project B loads (the swap completed through the same instance).
    await expect(page.getByRole("heading", { name: PROJECT_B })).toBeVisible({ timeout: 10_000 });

    // Post-fix: the transcript RESETS to the intro bubble (the
    // load-aware exemption — the epoch moved). Pre-fix: the Untitled
    // exchange (and its revert carrier) survived into project B.
    const intro = page.locator('[role="log"]').getByText(/Hi! I'm your AI design assistant/);
    await expect(intro).toBeVisible();
    await expect(page.locator('[role="log"]').getByText(/add 3 circles/i)).toHaveCount(0);
    await expect(page.locator('[role="log"]').getByText(/action\(s\) performed/i)).toHaveCount(0);
  });
});

test.describe("session 79 — the swap-boundary flush (S79-B)", () => {
  test("the outgoing project's pending edits persist through a soft swap inside the debounce window", async ({ page }) => {
    // Open project A's editor.
    await page.goto("/");
    await page.getByRole("button", { name: `Open ${PROJECT_A}` }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    await expect(page.getByRole("heading", { name: PROJECT_A })).toBeVisible();

    // The BEFORE count (order-independent: the shared e2e database's
    // project A may carry mutations from earlier specs in the full-suite
    // run — the F65 order-dependence lesson).
    const ids = await page.evaluate(async () => {
      const res = await fetch("/api/projects");
      const body = await res.json();
      const a = body.data.projects.find((p: { name: string }) => p.name === "Marketing Hero Banner");
      const b = body.data.projects.find((p: { name: string }) => p.name === "Portfolio Website Redesign");
      return { a: a.id as string, b: b.id as string };
    });
    const before = await page.evaluate(async (aId) => {
      const res = await fetch(`/api/projects/${aId}`);
      const body = await res.json();
      return Array.isArray(body?.data?.project?.elements) ? body.data.project.elements.length : -1;
    }, ids.a);
    expect(before).toBeGreaterThanOrEqual(0);

    // Make a pending edit that flips saveState to unsaved: the AI's
    // "add 3 circles" (the deterministic fallback applies exactly 3
    // elements — before + 3 pending).
    const input = page.getByLabel("Message the AI design assistant");
    await input.fill("add 3 circles");
    await input.press("Enter");
    await expect(page.getByText(/action\(s\) performed/i)).toBeVisible({ timeout: 15_000 });

    // Swap to B IMMEDIATELY (inside the 800ms debounce window — the
    // timer must not win the race).
    await page.evaluate((url) => {
      window.history.pushState({}, "", url);
    }, `/Editor?projectId=${ids.b}`);

    // Project B loads through the same instance.
    await expect(page.getByRole("heading", { name: PROJECT_B })).toBeVisible({ timeout: 10_000 });

    // Post-fix: the machine flushed A's before+3 elements at the boundary
    // (the swap-boundary flushNow). Pre-fix: A stayed at its before-count
    // (the pending timer early-returned on the loaded "saved"). Poll the
    // API — the flush PUT is fire-and-forget.
    const count = await page.evaluate(async ({ aId, expected }) => {
      for (let i = 0; i < 40; i++) {
        const res = await fetch(`/api/projects/${aId}`);
        const body = await res.json();
        if (body?.ok && Array.isArray(body.data.project.elements) && body.data.project.elements.length === expected) {
          return body.data.project.elements.length;
        }
        await new Promise((r) => setTimeout(r, 250));
      }
      const res = await fetch(`/api/projects/${aId}`);
      const body = await res.json();
      return Array.isArray(body?.data?.project?.elements) ? body.data.project.elements.length : -1;
    }, { aId: ids.a, expected: before + 3 });
    expect(count, "project A must persist the +3 elements through the swap (the swap-boundary flush)").toBe(before + 3);
  });
});

test.describe("session 79 — the hidden-selection chrome (S79-E)", () => {
  test("an eye-hidden selected element renders NO outline or handles", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: `Open ${PROJECT_A}` }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);

    // Select the Accent Bar through its LAYER ROW (the row's select
    // button — the established form; no canvas coordinates).
    const rowContainer = page
      .locator("[data-layer-row]")
      .filter({ has: page.locator("button[aria-label='Layer Accent Bar']") });
    await page.locator("button[aria-label='Layer Accent Bar']").click();
    await expect(page.getByText("1 selected", { exact: true })).toBeVisible();

    // The selection outline is live (the chrome renders for a VISIBLE
    // selected element) — the outline box inside the chrome wrapper.
    const outline = page.locator("div.pointer-events-none.absolute > div.border-blue-500");
    await expect(outline).toBeVisible();

    // Hide the selected element through the layers row's eye toggle.
    await rowContainer.getByRole("button", { name: "Hide layer" }).click();
    await expect(rowContainer.getByRole("button", { name: "Show layer" })).toBeVisible();

    // Post-fix: the outline + handles are GONE (the chrome gates on
    // visibility). Pre-fix: a floating outline with 8 live handles
    // stayed over blank canvas (the element itself no longer renders
    // — the render filter — but the chrome derived from the unfiltered
    // selection).
    await expect(outline).toHaveCount(0);
  });
});
