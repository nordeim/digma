import { expect, test } from "@playwright/test";

// The autosave state machine (session 56, S56-B + S56-C — the Mode C
// audit's H-2 + M-1 + M-2).
//
// H-2: the pre-fix flush was unserialized and markSaved unconditional —
// an edit landing between the PUT body build and its response was
// silently reverted locally (markSaved replaced the element list with the
// older server list), marked "Saved", and never re-flushed. This spec
// reproduces the race LIVE with a route-delayed PUT and pins the edit's
// survival.
//
// M-2: the pre-fix exit() fired its own elements-only PUT — a Background
// change followed by Back inside the debounce window was silently lost on
// reload. This spec pins the exit flush's full-body persistence.
//
// Contexts arrive AUTHENTICATED.

const SEEDED_PROJECT = "Marketing Hero Banner";

async function openSeededEditor(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByText(SEEDED_PROJECT).filter({ visible: true }).first().click();
  await expect(page).toHaveURL(/\/Editor\?projectId=/);
}

async function waitForSaved(page: import("@playwright/test").Page) {
  await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
}

test.describe("the autosave state machine (session 56, S56-B / H-2)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("an edit made DURING an in-flight PUT survives (the markSaved clobber)", async ({
    page,
  }) => {
    // Delay every elements PUT by 700ms so the response lands well after
    // the second edit commits — the exact interleaving the audit found.
    await page.route("**/api/projects/*/elements", async (route) => {
      await page.waitForTimeout(700);
      await route.continue();
    });
    await openSeededEditor(page);

    // Edit A: move the Accent Bar's X 120 → 200 (a real, committed edit).
    await page.locator("[role=button][aria-label='Layer Accent Bar']").click();
    const element = page.locator("[data-element-id][aria-label='Accent Bar']");
    const inlineTransform = () => element.evaluate((node) => node.style.transform);
    const x = page.getByRole("spinbutton", { name: "X" });
    await x.fill("200");
    await expect.poll(inlineTransform, { timeout: 5_000 }).toContain("translate(200px");

    // Wait past the 800ms debounce so flush A is IN FLIGHT (its body
    // carries X=200; the response is 700ms away)…
    await page.waitForTimeout(1_000);

    // …then edit B lands mid-flight: X 200 → 280.
    await x.fill("280");
    await expect.poll(inlineTransform, { timeout: 5_000 }).toContain("translate(280px");

    // The delayed response arrives and (pre-fix) markSaved adopts the
    // SERVER list — the X=200 body — reverting edit B. Post-fix the
    // reference guard keeps edit B and the follow-up flush persists it.
    // The Saved badge settles only when the machine is done.
    await waitForSaved(page);
    await expect.poll(inlineTransform, { timeout: 10_000 }).toContain("translate(280px");
    await expect(x).toHaveValue("280");

    // …and it PERSISTS: reload and the element still sits at 280.
    await page.reload();
    await page.locator("[role=button][aria-label='Layer Accent Bar']").click();
    await expect(page.getByRole("spinbutton", { name: "X" })).toHaveValue("280");

    // Cleanup: restore the seeded X before leaving (a failure must never
    // leave the shared e2e DB mutated).
    await page.getByRole("spinbutton", { name: "X" }).fill("120");
    await waitForSaved(page);
    await page.unroute("**/api/projects/*/elements");
  });
});

test.describe("the exit flush parity (session 56, S56-C / M-2)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("a Background change followed by Back inside the debounce persists", async ({ page }) => {
    // Delay the elements PUTs so the 800ms timer cannot complete before
    // the Back click — the exit flush is the ONLY path that can carry the
    // change, which is exactly the M-2 seam.
    await page.route("**/api/projects/*/elements", async (route) => {
      await page.waitForTimeout(700);
      await route.continue();
    });
    await openSeededEditor(page);

    // Change the canvas background (nothing selected → Canvas Properties).
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
    await page.getByRole("textbox", { name: "Color hex" }).fill("#1a2b3c");

    // Back IMMEDIATELY — well inside the 800ms debounce.
    await page.getByRole("button", { name: "Back to dashboard" }).click();
    await expect(page).toHaveURL(/\/Dashboard/);

    // The fire-and-forget exit flush completes in the background; give it
    // generous settle time, then reopen the project.
    await page.waitForTimeout(2_500);
    await page.getByText(SEEDED_PROJECT).filter({ visible: true }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);

    // The pre-fix exit PUT carried elements ONLY — the background silently
    // reverted on reload (live-reproduced by the audit). Post-fix the exit
    // flush routes through the same machine as the autosave, full body.
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Color hex" })).toHaveValue("#1a2b3c");

    // Cleanup: restore the seeded background.
    await page.getByRole("textbox", { name: "Color hex" }).fill("#0D1117");
    await waitForSaved(page);
    await page.unroute("**/api/projects/*/elements");
  });
});
