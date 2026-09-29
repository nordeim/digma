import { expect, test } from "@playwright/test";

// The unknown/missing-projectId contract (parity with the live reference):
// /Editor with a bogus or absent projectId opens a WORKING "Untitled"
// editor — never a dead-end error page. The first save creates a new
// project behind the scenes and the URL adopts its real id.
//
// Deviation (documented in the PAD ADR-009): the live app instead saves
// the unknown-id canvas SILENTLY into the most-recently-accessed project
// (a data bug observed while auditing: the drawing landed in "Test
// Project One" even though the URL said projectId=test). This clone
// creates a fresh project instead — same visible UX ("Untitled" editor),
// no silent data corruption.

test.describe("untitled editor (unknown or missing projectId)", () => {
  test("a bogus projectId opens the Untitled editor, not an error page", async ({ page }) => {
    await page.goto("/Editor?projectId=definitely-not-a-real-id");
    await expect(page.getByRole("heading", { name: "Untitled", exact: true })).toBeVisible();
    await expect(page.getByText("Project not found")).toHaveCount(0);
    await expect(page.getByRole("toolbar", { name: "Editor tools" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
    await expect(page.getByText("No layers yet")).toBeVisible();
  });

  test("no projectId at all opens the same Untitled editor", async ({ page }) => {
    await page.goto("/Editor");
    await expect(page.getByRole("heading", { name: "Untitled", exact: true })).toBeVisible();
    await expect(page.getByRole("toolbar", { name: "Editor tools" })).toBeVisible();
  });

  test("drawing in the Untitled editor creates a project and persists it", async ({ page }) => {
    await page.goto("/Editor?projectId=definitely-not-a-real-id");
    await expect(page.getByRole("heading", { name: "Untitled", exact: true })).toBeVisible();

    // Select the rectangle tool and draw on the canvas.
    await page.getByRole("button", { name: /Rectangle/ }).click();
    const canvas = page.getByRole("application", { name: "Design canvas" });
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + 320, box!.y + 200);
    await page.mouse.down();
    await page.mouse.move(box!.x + 440, box!.y + 280, { steps: 5 });
    await page.mouse.up();

    // First save creates the project: the URL adopts its real id (no
    // longer the bogus value from the address we opened).
    await expect(page).toHaveURL(/\/Editor\?projectId=(?!definitely-not-a-real-id)\w+/, {
      timeout: 10_000,
    });

    // The canvas survives a reload (the created project is real now).
    await page.reload();
    // Exact match: the layer-row trash button ("Delete layer Rectangle 1")
    // also matches a /Rectangle 1/ substring (session-17 row action).
    await expect(page.getByRole("button", { name: "Layer Rectangle 1", exact: true })).toBeVisible({ timeout: 10_000 });
  });
});
