import { expect, test } from "@playwright/test";

// Session 77 — the S77-B discriminator: the Recent list card's title
// anchor preserves the browser's native secondary-click behavior. Pre-fix
// the onClick handler unconditionally preventDefault()ed — a Ctrl+Click
// (open-in-new-tab) was swallowed into a same-tab SPA navigation, on a
// FILE LIST, the exact surface where tab-opening is a habit.
//
// The probe: switch to the list view, Ctrl+Click the first title anchor.
// Post-fix the browser opens the editor in a POPUP and the source page
// STAYS on /Recent (no SPA navigation ran). Pre-fix: no popup ever fires
// and the current page navigates to /Editor.

test.describe("session 77 — the modifier-click preservation (S77-B)", () => {
  test("a Ctrl+Click on the list title opens a new tab (the SPA navigation stays put)", async ({ page }) => {
    await page.goto("/Recent");
    await page.getByRole("button", { name: "List view" }).click();
    await page.waitForLoadState("networkidle");

    const link = page.locator("main .space-y-2 a").first();
    await expect(link).toBeVisible();

    // The probe (session 77 en-route): Ctrl+Click's new tab carries NO
    // opener relationship, so Playwright's "popup" event never fires —
    // the new page appears in the CONTEXT's pages() instead. The
    // discriminator: a second page exists at /Editor?projectId= AND the
    // source page never ran the SPA navigation (stays on /Recent).
    const pagesBefore = page.context().pages().length;
    await link.click({ modifiers: ["Control"] });
    await page.waitForTimeout(1000);

    const pages = page.context().pages();
    expect(pages.length).toBeGreaterThan(pagesBefore);

    const newPage = pages.find((p) => p.url().includes("/Editor?projectId="));
    expect(newPage).toBeDefined();

    // The source page never ran the SPA navigation — it stays on /Recent
    // (the lastOpened PATCH is skipped on the modifier path by design).
    expect(page.url()).toContain("/Recent");
  });

  test("a plain click still navigates in-tab (the SPA path is preserved)", async ({ page }) => {
    await page.goto("/Recent");
    await page.getByRole("button", { name: "List view" }).click();
    await page.waitForLoadState("networkidle");

    const link = page.locator("main .space-y-2 a").first();
    await link.click();
    await page.waitForURL(/\/Editor\?projectId=/);
    expect(page.url()).toContain("/Editor?projectId=");
  });
});

// Session 77 — the S77-A discriminator: the vendored primitives own the
// 44px close floor now. A dialog whose consumer carries the override AND
// one whose consumer does not both measure >= 44px on the built-in close
// control. The Recent delete-confirm dialog (consumer keeps the
// override) is the probe — the primitive floor makes the measurement
// independent of the override.

test.describe("session 77 — the primitive close floor (S77-A)", () => {
  test("the dialog's built-in close button meets the 44px floor at the mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/Recent");
    await page.getByRole("button", { name: "List view" }).click();
    await page.waitForLoadState("networkidle");

    // Open the first card's ellipsis menu, then Delete -> the confirm dialog.
    const card = page.locator("main .space-y-2 > div").first();
    await card.hover();
    await card.getByRole("button", { name: /More options/ }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // The built-in close is the Radix Close (the sr-only "Close" label).
    const close = dialog.getByRole("button", { name: "Close" });
    await expect(close).toBeVisible();
    // The dialog's zoom-in-95 entry animation (200ms) scales the content
    // to ~97% mid-flight (44 x 0.97 = 42.7) — settle before measuring.
    await page.waitForTimeout(400);
    const box = await close.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

    // Cancel — leave the board pristine (the seeded project survives).
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).not.toBeVisible();
  });
});
