import { expect, test } from "@playwright/test";

// The gesture undo direction (session 56, S56-A — the Mode C audit's H-1).
//
// The pre-fix code called store.commit() at pointer-UP, which pushes the
// POST-gesture state — the FIRST Ctrl+Z after a drag restored the state
// the canvas was already in (a silent no-op), and the pre-drag layout was
// unreachable except by also reverting an older action. A plain CLICK on
// an element also pushed a redundant snapshot and WIPED the redo stack.
//
// The fix: the pre-gesture snapshot is captured at pointer-DOWN
// (beginGesture) and pushed at pointer-UP only when the gesture actually
// moved (endGesture / cancelGesture).
//
// Order-independence (the session-25 discipline): earlier specs in the
// same run can leave the shared e2e DB moved/scaled/locked — the Accent
// Bar's position is NORMALIZED through the panel inputs before each
// gesture, and selection goes through the LAYER ROW (immune to canvas
// geometry). Contexts arrive AUTHENTICATED.

const SEEDED_PROJECT = "Marketing Hero Banner";

async function openSeededEditor(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: `Open ${SEEDED_PROJECT}` }).first().click();
  await expect(page).toHaveURL(/\/Editor\?projectId=/);
}

/** Select the Accent Bar via its layer row and normalize its geometry. */
async function normalizeAccentBar(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "Layer Accent Bar", exact: true }).click();
  // exact: true — the bare "Y" name substring-matches "Opacity value"
  // (the F41 lesson applies to spinbuttons too). Earlier specs in the
  // same run can leave the shared canvas moved/resized — the fills make
  // every gesture START from the seeded geometry regardless.
  await page.getByRole("spinbutton", { name: "X", exact: true }).fill("120");
  await page.getByRole("spinbutton", { name: "Y", exact: true }).fill("80");
  await page.getByRole("spinbutton", { name: "H", exact: true }).fill("8");
}

/**
 * The drag anchor: 40% across the bar — NEVER its visual center. A
 * selected element renders its resize HANDLES at the center column
 * (n/s) and the side edges (w/e); the seeded 8px-tall bar's center line
 * IS the n/s handle line, so a center click starts a RESIZE, not a move
 * (discovered live: the drag's x never changed). 40% width clears every
 * handle for any bar height.
 */
function dragAnchor(box: { x: number; y: number; width: number; height: number }) {
  return { cx: box.x + box.width * 0.4, cy: box.y + box.height / 2 };
}

test.describe("the gesture undo direction (session 56, S56-A / H-1)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await normalizeAccentBar(page);
  });

  test("a SINGLE Ctrl+Z restores the pre-drag position", async ({ page }) => {
    // The normalized Accent Bar (120, 80). Drag it by (90, 50)…
    const element = page.locator("[data-element-id][aria-label='Accent Bar']");
    await expect(element).toHaveCount(1);
    const inlineTransform = () => element.evaluate((node) => node.style.transform);
    await expect.poll(inlineTransform, { timeout: 5_000 }).toContain("translate(120px");

    const box = await element.boundingBox();
    const { cx, cy } = dragAnchor(box!);
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 90, cy + 50, { steps: 8 });
    await page.mouse.up();

    // …the drag committed live (the transform moved)…
    await expect.poll(inlineTransform, { timeout: 5_000 }).toContain("translate(210px");

    // …and ONE undo reaches the pre-drag layout. The pre-fix first undo
    // was a silent no-op (it pushed the post-drag state, so undo restored
    // what the canvas already showed).
    await page.keyboard.press("Control+z");
    await expect.poll(inlineTransform, { timeout: 5_000 }).toContain("translate(120px");
  });

  test("a plain click preserves the redo stack (no redundant snapshot)", async ({ page }) => {
    // One real gesture, then undo it — the redo stack now holds it.
    const element = page.locator("[data-element-id][aria-label='Accent Bar']");
    const inlineTransform = () => element.evaluate((node) => node.style.transform);
    const box = await element.boundingBox();
    const { cx, cy } = dragAnchor(box!);

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 60, cy + 30, { steps: 6 });
    await page.mouse.up();
    await expect.poll(inlineTransform, { timeout: 5_000 }).toContain("translate(180px");
    await page.keyboard.press("Control+z");
    await expect.poll(inlineTransform, { timeout: 5_000 }).toContain("translate(120px");

    // A plain CLICK on the same element (pointerdown + pointerup, no
    // movement). The pre-fix click pushed a redundant snapshot of the
    // CURRENT state — which WIPED the redo stack; the redo below then
    // no-op'd and the transform never returned to 180.
    await page.mouse.click(cx, cy);
    await page.keyboard.press("Control+Shift+z");
    await expect.poll(inlineTransform, { timeout: 5_000 }).toContain("translate(180px");

    // Cleanup: undo back to the seeded position before leaving (a failure
    // must never leave the shared e2e DB mutated).
    await page.keyboard.press("Control+z");
    await expect.poll(inlineTransform, { timeout: 5_000 }).toContain("translate(120px");
    await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
  });
});
