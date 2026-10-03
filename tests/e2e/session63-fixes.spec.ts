import { expect, test } from "@playwright/test";

// Session 63 — the eleventh Mode C audit's chosen e2e pin (the one
// USER-VISIBLE behavioral defect of the batch: S63-A the opaque-black
// thumbnail overlay — the v3 opacity utilities Tailwind v4 removed, so
// every grid card's CanvasThumbnail rendered behind solid (0,0,0) since
// the first commit. The pure-seam fixes S63-B/C/D/E/F/G carry their pins
// in the unit suite's tests/teams-contrast-s63.test.ts,
// tests/user-initial.test.ts, tests/layers-rename-cap.test.ts,
// tests/reset-url-guard.test.ts, tests/recent-mount-guard.test.ts and
// tests/dead-code-s63.test.ts; the avatar-initial contract update rides
// the standing parity pin).
//
// Contexts arrive AUTHENTICATED (the setup project's storageState).
// The assertion reads PAINTED PIXELS (the AGENTS discipline — v4 emits
// lab()/oklch() computed strings, so geometry/contrast contracts pin
// through canvas getImageData on a screenshot of the region).

test.describe("session 63 — the thumbnail overlay fix (S63-A / A-H1)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("a dashboard grid card's thumbnail paints — not a solid black rectangle", async ({ page }) => {
    await page.goto("/");
    // The "Continue Working" grid renders the seeded projects; the card
    // thumbnail box is the aspect-[16/10] region inside the first card.
    const card = page.locator("main .grid .group").first();
    await expect(card).toBeVisible();
    const thumb = card.locator(".relative.aspect-\\[16\\/10\\]").first();
    await expect(thumb).toBeVisible();
    const box = (await thumb.boundingBox())!;

    // Painted-pixel probe: screenshot the thumbnail region, decode it in
    // the page, count near-black pixels. Pre-fix the overlay paints the
    // WHOLE region opaque black (ratio ~1.0); post-fix the blue-50 ->
    // purple-50 gradient + the CanvasThumbnail shapes paint (ratio ~0).
    const clip = { x: box.x, y: box.y, width: box.width, height: box.height };
    const buf = await page.screenshot({ clip });
    const base64 = buf.toString("base64");
    const blackRatio = await page.evaluate(async (b64: string) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d");
      if (!ctx) return -1;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      let black = 0;
      let total = 0;
      for (let i = 0; i < data.length; i += 4) {
        total++;
        if (data[i] < 12 && data[i + 1] < 12 && data[i + 2] < 12) black++;
      }
      return black / total;
    }, base64);

    // The honest-moment evidence (F49(4)): capture exactly the state the
    // programmatic check just proved.
    await thumb.screenshot({ path: "docs/screenshots/ref-audit-s73/clone-11-thumbnail-painted.png" });

    expect(blackRatio).toBeGreaterThanOrEqual(0);
    expect(blackRatio).toBeLessThan(0.05);
  });

  test("the recent grid's card thumbnails paint too (the second consumer surface)", async ({ page }) => {
    await page.goto("/Recent");
    const card = page.locator("main .grid .group").first();
    await expect(card).toBeVisible();
    const thumb = card.locator(".relative.aspect-\\[16\\/10\\]").first();
    await expect(thumb).toBeVisible();
    const box = (await thumb.boundingBox())!;

    const clip = { x: box.x, y: box.y, width: box.width, height: box.height };
    const buf = await page.screenshot({ clip });
    const base64 = buf.toString("base64");
    const blackRatio = await page.evaluate(async (b64: string) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d");
      if (!ctx) return -1;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      let black = 0;
      let total = 0;
      for (let i = 0; i < data.length; i += 4) {
        total++;
        if (data[i] < 12 && data[i + 1] < 12 && data[i + 2] < 12) black++;
      }
      return black / total;
    }, base64);

    expect(blackRatio).toBeGreaterThanOrEqual(0);
    expect(blackRatio).toBeLessThan(0.05);
  });
});
