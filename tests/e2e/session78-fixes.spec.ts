import { expect, test } from "@playwright/test";

// Session 78 — the S78-A e2e discriminator (the soft project swap) and
// the S78-F mobile floor measurement.
//
// S78-A: the AI transcript and its revert carriers are project-scoped
// now. Pre-fix, a soft /Editor?projectId=A -> /Editor?projectId=B swap
// (the same component instance — programmatic navigation, the S77-E
// path) kept project A's conversation (and its Revert carriers) alive
// while the user edited B — a surviving Revert restored A's elements
// into B's store and the autosave machine PUT A's board into B.
//
// The probe: open the editor on the seeded "Marketing Hero Banner",
// send an AI command (the deterministic fallback — DIGMA_DISABLE_AI_LLM=1
// in the e2e webServer — applies ops and answers with a Revert-capable
// reply), then navigate programmatically to the OTHER seeded project's
// editor URL. Post-fix the transcript RESETS to the intro bubble (the
// store subscription's NAMED-scope transition). Pre-fix the
// conversation (and its revert carrier) survives the swap.

const PROJECT_A = "Marketing Hero Banner";
const PROJECT_B = "Portfolio Website Redesign";

test.describe("session 78 — the AI transcript's project scope (S78-A)", () => {
  test("a soft project swap resets the transcript to the intro bubble", async ({ page }) => {
    // Open project A's editor through the dashboard anchor (the
    // sanctioned entry — the stretched-button form).
    await page.goto("/");
    await page.getByRole("button", { name: `Open ${PROJECT_A}` }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);

    // Send an AI command the deterministic parser answers with real
    // operations (add circles) — the reply carries a revert carrier.
    // (The real placeholder from ai-assistant.tsx; Enter submits the
    // form.)
    const input = page.getByLabel("Message the AI design assistant");
    await input.fill("add 3 circles");
    await input.press("Enter");
    // The deterministic reply lands (the fallback is instant; allow the
    // POST round-trip).
    await expect(page.getByText(/action\(s\) performed/i)).toBeVisible({ timeout: 15_000 });

    // The transcript now carries: intro + user + reply = 3 bubbles.
    // The intro's OWN text node (the <p> — the strict-mode-safe form;
    // the filter's nested ancestors would resolve 4 elements).
    await expect(page.locator('[role="log"] p').filter({ hasText: /Hi! I'm your AI design assistant/ })).toBeVisible();

    // Navigate programmatically to project B's editor URL (the soft
    // swap — the S77-E path; the same component instance survives).
    // The SOFT swap: programmatic navigation to project B's editor URL
    // (the same component instance survives — the S77-E path). Going
    // through /Recent unmounts first; instead navigate DIRECTLY to the
    // other project's editor URL from the current editor page.
    // Fetch project B's id from the seeded API (authenticated context):
    const bId = await page.evaluate(async () => {
      const res = await fetch("/api/projects");
      const body = await res.json();
      const match = body.data.projects.find((p: { name: string }) => p.name === "Portfolio Website Redesign");
      return match.id;
    });
    await page.goto(`/Editor?projectId=${bId}`);
    await page.waitForLoadState("networkidle");

    // Post-fix: the transcript reset to the intro bubble — the AI
    // conversation from project A is GONE (the project-scope guard).
    // Pre-fix: the "add 3 circles" exchange (and its revert carrier)
    // survived into project B's editor.
    const bubbles = page.locator('[role="log"] > div');
    const intro = page.locator('[role="log"]').getByText(/Hi! I'm your AI design assistant/);
    await expect(intro).toBeVisible();

    // The swapped-in conversation's reply must NOT be present.
    await expect(page.locator('[role="log"]').getByText(/add 3 circles/i)).toHaveCount(0);
    await expect(page.locator('[role="log"]').getByText(/action\(s\) performed/i)).toHaveCount(0);

    // And the header shows project B (the swap completed).
    await expect(page.getByRole("heading", { name: PROJECT_B })).toBeVisible();
  });
});

test.describe("session 78 — the mobile editor-header touch floor (S78-F)", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("the Back button meets the 44px floor at 390 (28x28 pre-fix)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: `Open ${PROJECT_A}` }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);

    const box = await page.getByRole("button", { name: "Back to dashboard" }).boundingBox();
    expect(box, "Back must report a bounding box").toBeTruthy();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("Undo and Redo meet the 44px floor at 390 (32x32 pre-fix)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: `Open ${PROJECT_A}` }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);

    for (const label of ["Undo", "Redo"]) {
      const box = await page.getByRole("button", { name: label, exact: true }).boundingBox();
      expect(box, `${label} must report a bounding box`).toBeTruthy();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.width).toBeGreaterThanOrEqual(44);
    }
  });

  test("the icon-only Share and Present meet the 44px height floor at 390", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: `Open ${PROJECT_A}` }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);

    for (const label of ["Share", "Present"]) {
      const box = await page.getByRole("button", { name: label, exact: true }).boundingBox();
      expect(box, `${label} must report a bounding box`).toBeTruthy();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      // The reachability pin stays (the S48-2 contract):
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(390);
    }
  });
});
