import { expect, test } from "@playwright/test";

// THE present-mode regression suite. The reference app's Present button is
// DEAD chrome (20+ live confirmations — no dialog, no overlay, no
// navigation), so the clone's working presentation overlay is a documented
// superset. Session 47 (the 23rd audit) polished that superset's MOBILE
// exit affordance to the app's own conventions — the 44px touch floor the
// mobile-nav drawer pins, device-coherent copy (the Esc hint only where a
// keyboard can exist), the Sheet's body-scroll-lock + focus contracts —
// and this spec pins every one of those behaviors at 390×844 plus the
// desktop Escape regression. Contexts arrive AUTHENTICATED.

const SEEDED_PROJECT = "Marketing Hero Banner";

async function openSeededEditor(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByText(SEEDED_PROJECT).filter({ visible: true }).first().click();
  await expect(page).toHaveURL(/\/Editor\?projectId=/);
}

async function enterPresentation(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "Present" }).click();
  const overlay = page.getByRole("dialog");
  await expect(overlay).toBeVisible();
  return overlay;
}

test.describe("present mode — mobile exit affordance (390×844)", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
  });

  test("the exit affordance meets the 44px touch floor", async ({ page }) => {
    await enterPresentation(page);
    const exit = page.getByRole("button", { name: /Exit presentation/ });
    await expect(exit).toBeVisible();

    // The mobile-nav convention: every touch target is at least 44px tall
    // (the hamburger is h-11, every Sheet link is h-11). The exit pill is
    // a touch target too.
    const box = await exit.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test("the exit button's accessible name drops the Esc hint below sm", async ({ page }) => {
    await enterPresentation(page);

    // A phone has no Esc key — the keyboard-only hint would be incoherent
    // on the exact device that needs the button. The (Esc) hint renders
    // only at >=640px viewports (hidden sm:inline).
    await expect(page.getByRole("button", { name: /Exit presentation/ })).toHaveAccessibleName(
      "Exit presentation"
    );
  });

  test("tapping the exit button exits the presentation (the touch path)", async ({ page }) => {
    const overlay = await enterPresentation(page);
    await page.getByRole("button", { name: /Exit presentation/ }).tap();

    await expect(overlay).toBeHidden();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
  });

  test("the body scroll locks while presenting and releases on exit", async ({ page }) => {
    await enterPresentation(page);

    // The Sheet's convention (react-remove-scroll): data-scroll-locked on
    // <body> while a takeover surface is open. The presentation overlay is
    // a fullscreen takeover — the same lock applies.
    const locked = await page.evaluate(() => document.body.hasAttribute("data-scroll-locked"));
    expect(locked).toBe(true);

    await page.getByRole("button", { name: /Exit presentation/ }).tap();
    await expect(page.getByRole("dialog")).toBeHidden();
    const unlocked = await page.evaluate(
      () => !document.body.hasAttribute("data-scroll-locked")
    );
    expect(unlocked).toBe(true);
  });

  test("focus moves into the overlay on open and returns to the Present trigger on exit", async ({ page }) => {
    const present = page.getByRole("button", { name: "Present" });
    await enterPresentation(page);

    // The dialog contract: focus lands on the exit affordance (the only
    // actionable control), never on the dead page behind the overlay.
    await expect(page.getByRole("button", { name: /Exit presentation/ })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    // Focus returns to the trigger that opened the overlay (the Sheet's
    // focus-return contract).
    await expect(present).toBeFocused();
  });
});

test.describe("present mode — desktop contract (1280)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("Escape exits and the (Esc) hint renders at >=sm", async ({ page }) => {
    await openSeededEditor(page);
    await enterPresentation(page);

    // Desktop keeps the keyboard hint in the accessible name…
    await expect(page.getByRole("button", { name: /Exit presentation/ })).toHaveAccessibleName(
      "Exit presentation (Esc)"
    );

    // …and the keyboard path still works.
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
  });
});
