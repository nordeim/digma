import { expect, test } from "@playwright/test";

// Session 76 — the S76-E discriminator: the toast dismiss control
// meets the repo's 44px touch floor. Pre-fix the button hit ~24px
// (a 16px glyph with p-1 padding) — the one mobile close target in
// the app below the floor every other surface meets via the h-11
// family.
//
// The trigger: the editor's Share button. With the clipboard present
// (Playwright's secure context) the copy path fires a success toast;
// with it absent the fallback fires directly (S60-G) — either way a
// toast mounts with the dismiss control, whose box is measured.

test.describe("session 76 — the toast dismiss 44px floor (S76-E)", () => {
  test("the dismiss control meets the 44px touch floor", async ({ page }) => {
    await page.goto("/Editor");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Share" }).click();

    const dismiss = page.getByRole("button", { name: "Dismiss notification" });
    await expect(dismiss).toBeVisible();
    const box = await dismiss.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  });
});
