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

  test("the editor's keyboard shortcuts STAND DOWN behind the overlay (session 56, S56-D)", async ({
    page,
  }) => {
    // The Mode C audit's M-3: the stand-down guard matches only
    // [role="dialog"][data-state="open"] — the hand-rolled overlay carried
    // no data-state, so Delete deleted the (invisible) selection while
    // presenting, tool keys switched tools, and ? opened the shortcuts
    // dialog over the presentation. The fix puts data-state="open" on the
    // overlay's dialog element (the SAME guard then covers it).
    await openSeededEditor(page);

    // Select the Accent Bar BEFORE presenting (a selection that stays
    // live behind the pre-fix overlay). Selection goes through the LAYER
    // ROW — order-independent against whatever geometry earlier specs in
    // the same run left on the shared canvas (a scaled headline can
    // intercept canvas clicks).
    await page.getByRole("button", { name: "Layer Accent Bar", exact: true }).click();
    await expect(page.getByText("1 selected", { exact: true })).toBeVisible();

    await enterPresentation(page);

    // Delete behind the overlay: the pre-fix canvas deleted the invisible
    // selection (autosaved 800ms later — data loss behind the takeover).
    await page.keyboard.press("Delete");
    await page.waitForTimeout(300);
    await expect(page.getByRole("dialog")).toBeVisible();

    // A tool key must not switch tools either (V is the Select shortcut).
    await page.keyboard.press("v");
    await page.waitForTimeout(200);

    // Exit and verify the selection SURVIVED both keystrokes.
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.locator("[data-element-id][aria-label='Accent Bar']")).toHaveCount(1);
    // …and the tool stayed Select (V was absorbed by the stand-down).
    await expect(page.getByRole("button", { name: "Select tool" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("Tab stays trapped on the exit affordance (the aria-modal contract, session 56, S56-D)", async ({
    page,
  }) => {
    // The Mode C audit's L-4: the overlay declares aria-modal="true" but
    // Tab used to escape into the background content. The exit pill is the
    // only focusable — Tab routes focus back to it.
    await openSeededEditor(page);
    await enterPresentation(page);
    const exit = page.getByRole("button", { name: /Exit presentation/ });
    await expect(exit).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(exit).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(exit).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});
