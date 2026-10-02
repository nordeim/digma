import { expect, test } from "@playwright/test";

// THE mobile navigation regression suite. The reference app ships NO mobile
// navigation at all (the desktop nav is `hidden md:flex` with no fallback —
// Tailwind v4 failure class A from the skills' taxonomy). This clone fixes
// it with a hamburger + Radix Sheet drawer, and this spec pins the fix:
// the trigger is visible below md, the drawer opens as a dialog, links
// navigate, the drawer closes on navigation, focus is trapped, and the
// desktop nav never shows the hamburger. Contexts arrive AUTHENTICATED.

test.describe("mobile navigation (390×844)", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("the hamburger trigger is visible below md with expanded state wiring", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Navigation menu" });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    // 44px touch target (the accessibility floor).
    const box = await trigger.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test("the desktop nav links are hidden below md", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav).toBeHidden();
  });

  test("tapping the hamburger opens the drawer with all links", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Navigation menu" });
    await trigger.tap();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    for (const label of ["Dashboard", "Recent", "Teams"]) {
      await expect(dialog.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    // The trigger reports the open state. Radix marks the rest of the app
    // aria-hidden while the dialog is open, so role-based locators cannot
    // see it — assert on the CSS selector instead.
    const triggerById = page.locator('button[aria-controls="mobile-nav-sheet"]');
    await expect(triggerById).toHaveAttribute("aria-expanded", "true");
    // Session 54 (S54-B — the session-53 audit's deferred F-5): the
    // drawer announces its PURPOSE. Radix wires the SheetDescription
    // into the dialog's aria-describedby; the attribute must resolve to
    // a real element carrying the purpose text (screen readers get the
    // announcement structurally, not hand-rolled).
    const describedBy = await dialog.getAttribute("aria-describedby");
    expect(describedBy, "the drawer must carry aria-describedby").toBeTruthy();
    await expect(page.locator(`[id="${describedBy}"]`)).toHaveText(
      "Navigate between Digma's main pages.",
    );
  });

  test("tapping a link navigates AND closes the drawer", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Navigation menu" });
    await trigger.tap();
    await page.getByRole("dialog").getByRole("link", { name: "Recent", exact: true }).tap();

    await expect(page).toHaveURL(/\/Recent\/?$/);
    await expect(page.getByRole("heading", { name: "Recent Files", exact: true })).toBeVisible();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("Escape closes the drawer and focus returns", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Navigation menu" });
    await trigger.tap();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    // Focus management: the trigger regains focus after close (Radix).
    await expect(trigger).toBeFocused();
  });

  test("the drawer traps focus while open", async ({ page }) => {
    await page.getByRole("button", { name: "Navigation menu" }).tap();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // After several Tabs, focus stays inside the dialog.
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
    }
    const focusedInDialog = await page.evaluate(() => {
      const dialog = document.querySelector("[role='dialog']");
      return !!dialog?.contains(document.activeElement);
    });
    expect(focusedInDialog).toBe(true);
  });

  test("the drawer body scroll locks while open", async ({ page }) => {
    await page.getByRole("button", { name: "Navigation menu" }).tap();
    await expect(page.getByRole("dialog")).toBeVisible();
    // Radix/react-remove-scroll marks the lock with data-scroll-locked and
    // disables body pointer events (not overflow:hidden on body).
    const locked = await page.evaluate(() => document.body.hasAttribute("data-scroll-locked"));
    expect(locked).toBe(true);
  });
});

test.describe("desktop navigation (1280)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("the desktop nav shows the links and never the hamburger", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav).toBeVisible();
    for (const label of ["Dashboard", "Recent", "Teams"]) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await expect(page.getByRole("button", { name: "Navigation menu" })).toHaveCount(0);
  });
});

test.describe("tablet navigation (768)", () => {
  test.use({ viewport: { width: 768, height: 844 } });

  test("the nav links are visible at md — no hamburger needed", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Navigation menu" })).toBeHidden();
  });
});
