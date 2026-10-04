import { expect, test } from "@playwright/test";

// The session-73 fixes (S73-A + S73-F half B — the twenty-first audit's
// A-F1/A-F2 headline and the upload-downscale payload bound).
//
// 1. THE PRESENT-MODE TEXT ALIGNMENT: the canvas maps textAlign to
//    justify-content (the measured reference contract) but the
//    PresentOverlay never did — a CENTERED text element rendered
//    left-aligned in the one surface whose job is faithful fullscreen
//    rendering. The pin: set the seeded Headline's alignment to center
//    through the REAL Text Align buttons, enter Present, and assert the
//    computed justify-content on the rendered text element.
// 2. THE UPLOAD DOWNSCALE: the upload seam stored the raw data URL with
//    no dimension bound — those bytes ride every autosave PUT, detail
//    GET, and list GET. The pin: upload a browser-generated 2400x2400
//    PNG through the real file input, assert the painted fill decodes at
//    <=1200 (the aspect preserved).
//
// Contexts arrive AUTHENTICATED (the storageState). The cleanup restores
// the seeded state before leaving (the session-41 discipline).

const SEEDED_PROJECT = "Marketing Hero Banner";
const CTA = '[data-element-id][aria-label="CTA Button"]';

async function openSeededEditor(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: `Open ${SEEDED_PROJECT}` }).first().click();
  await expect(page).toHaveURL(/\/Editor\?projectId=/);
}

async function waitForSaved(page: import("@playwright/test").Page) {
  // Deterministic (the session-41 lesson): the badge may already read
  // "Saved" from a PREVIOUS save — polling for the badge alone passes on
  // the STALE badge while the debounced autosave is still pending.
  await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(300);
}

test.describe("session 73 — the render-surface text alignment (S73-A)", () => {
  test("a CENTERED text renders centered in Present mode (the canvas's own mapping)", async ({ page }) => {
    await openSeededEditor(page);

    // Select the seeded Headline and center it through the REAL control
    // (the Text Align buttons — the measured functional family).
    const headline = page.locator("[data-element-id][aria-label='Headline']");
    await headline.click();
    await page.getByRole("button", { name: "Align center" }).click();
    // The canvas surface already renders the alignment (the ground truth
    // this pin holds the OTHER surfaces to).
    await expect(headline).toHaveCSS("justify-content", "center");

    // Enter Present and assert the SAME mapping on the overlay's copy.
    await page.getByRole("button", { name: "Present" }).click();
    const overlay = page.getByRole("dialog");
    await expect(overlay).toBeVisible();
    const presentHeadline = overlay.getByText("Design faster,");
    await expect(presentHeadline).toBeVisible();
    // THE DEFECT PIN: pre-fix this computes "normal" — the flex text node
    // ignores textAlign, so centered text renders left-aligned.
    await expect(presentHeadline).toHaveCSS("justify-content", "center");

    // Exit and restore the seeded left alignment before leaving.
    await page.keyboard.press("Escape");
    await expect(overlay).not.toBeVisible();
    await page.getByRole("button", { name: "Align left" }).click();
    await waitForSaved(page);
  });

  test("a CENTERED text renders centered in the card thumbnail (the third surface)", async ({ page }) => {
    await openSeededEditor(page);

    const headline = page.locator("[data-element-id][aria-label='Headline']");
    await headline.click();
    await page.getByRole("button", { name: "Align center" }).click();
    await waitForSaved(page);

    // Leave to the Recent list — the card thumbnail re-renders the board.
    await page.goto("/Recent");
    // The card's stretched button carries the Open aria-label (the S70-A
    // form); the seeded Headline's text renders only inside the card's
    // canvas thumbnail on this page.
    await expect(
      page.locator('button[aria-label="Open Marketing Hero Banner"]').first(),
    ).toBeVisible({ timeout: 10_000 });
    // THE DEFECT PIN: pre-fix the thumbnail's text div computes
    // justify-content "normal" — centered text left-aligned in the card.
    const thumbText = page.getByText("Design faster,").first();
    await expect(thumbText).toBeVisible();
    await expect(thumbText).toHaveCSS("justify-content", "center");

    // Restore the seeded alignment (the pristine-DB discipline).
    await page.goto("/");
    await page.getByRole("button", { name: `Open ${SEEDED_PROJECT}` }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    await page.locator("[data-element-id][aria-label='Headline']").click();
    await page.getByRole("button", { name: "Align left" }).click();
    await waitForSaved(page);
  });
});

test.describe("session 73 — the upload downscale (S73-F half B)", () => {
  test("an oversized-dimension image uploads DOWNSCALED to <=1200 (the payload bound)", async ({ page }) => {
    await openSeededEditor(page);

    // Select the CTA and open the Image tab.
    await page.getByRole("button", { name: "Layer CTA Button", exact: true }).click();
    await expect(page.getByRole("heading", { level: 4, name: "Fill & Stroke" })).toBeVisible();
    await page.getByRole("tab", { name: "Image" }).click();

    // Generate a 2400x2400 solid PNG IN THE BROWSER (a solid-color PNG is
    // tiny in bytes — the FILE gate passes; the DIMENSION is what must
    // trip the downscale).
    const dataUrl = await page.evaluate(() => {
      const c = document.createElement("canvas");
      c.width = 2400;
      c.height = 2400;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#3366aa";
      ctx.fillRect(0, 0, 2400, 2400);
      return c.toDataURL("image/png");
    });
    const buffer = Buffer.from(dataUrl.split(",")[1], "base64");

    await page
      .locator("section[aria-label='Fill and stroke'] input[type=file]")
      .setInputFiles({ name: "large-dimension.png", mimeType: "image/png", buffer });

    // The paint lands; THE DEFECT PIN: the stored data URL must decode at
    // <=1200 (pre-fix it decodes at the full 2400).
    await expect(page.locator(CTA)).toHaveCSS("background-image", /data:image\/png;base64,/);
    const bg = await page.locator(CTA).evaluate((el) =>
      getComputedStyle(el).backgroundImage,
    );
    const url = bg.slice(bg.indexOf("data:image"), bg.lastIndexOf('")'));
    const dims = await page.evaluate(async (u) => {
      const img = new Image();
      img.src = u;
      await img.decode();
      return { w: img.naturalWidth, h: img.naturalHeight };
    }, url);
    expect(dims.w).toBeLessThanOrEqual(1200);
    expect(dims.h).toBeLessThanOrEqual(1200);
    // The square aspect survives the fit.
    expect(dims.w).toBe(dims.h);

    await waitForSaved(page);

    // Cleanup: back to the seeded solid fill (the pristine-DB discipline).
    await page.getByRole("button", { name: "Layer CTA Button", exact: true }).click();
    await expect(page.getByRole("tab", { name: "Image" })).toHaveAttribute("data-state", "active");
    await page.getByRole("tab", { name: "Solid" }).click();
    await page
      .locator("section[aria-label='Fill and stroke'] input[type='text']")
      .first()
      .fill("#3B82F6");
    await waitForSaved(page);
  });
});
