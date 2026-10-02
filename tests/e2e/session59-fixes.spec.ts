import { expect, test } from "@playwright/test";

// Session 59 — the seventh Mode C audit's chosen e2e pins (S59-A and
// S59-E — the two USER-VISIBLE defects of the batch; the pure-seam fixes
// S59-B/C/D/H carry their behavioral pins in the unit suite, and the
// canvas seams S59-F/G are source-contract pins).
//
// S59-A (B-M-1): the layer row's Enter/Space handler unconditionally
// preventDefault()ed ANY bubbled keydown — a Space typed in the rename
// input was canceled before character insertion (multi-word layer names
// untypeable by keyboard; the existing e2e rename pin uses fill(), which
// bypasses per-key keydowns), and Enter/Space on the eye/lock/trash
// buttons had their native activations canceled (keyboard-inoperable).
//
// S59-E (A-L-3): the multi-selection Fill row committed through a
// truthiness guard that silently DISCARDED the null clear — the field
// showed the "transparent" placeholder while the elements kept their
// fill.

const SEEDED_PROJECT = "Marketing Hero Banner";

async function openSeededEditor(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByText(SEEDED_PROJECT).filter({ visible: true }).first().click();
  await expect(page).toHaveURL(/\/Editor\?projectId=/);
  await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
}

test.describe("session 59 — the layers-row keyboard exemption (S59-A / B-M-1)", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
  });

  test("a Space typed in the rename input inserts the character (multi-word names typeable)", async ({
    page,
  }) => {
    const firstRow = page.locator("[role=button][aria-label^='Layer']").first();
    const originalLabel = (await firstRow.getAttribute("aria-label")) ?? "";

    // Enter rename mode (the reference's double-click contract).
    await firstRow.dblclick();
    const input = firstRow.locator("input");
    await expect(input).toBeVisible();

    // Per-key typing — NOT fill() (the existing chrome pin's fill() sets
    // the value directly and masks the keydown defect this pin guards).
    // Clear the seeded draft first so the assertion reads the typed run.
    await input.fill("");
    await input.pressSequentially("Two Words");

    // THE DEFECT PIN: pre-fix the row's keydown canceled the Space before
    // character insertion — the draft read "TwoWords".
    await expect(input).toHaveValue("Two Words");

    // Blur commits the multi-word name; then restore the original (the
    // shared-e2e-DB hygiene convention — never leave a rename behind).
    await input.blur();
    await expect(
      page.locator("[role=button][aria-label^='Layer']").first(),
    ).toContainText("Two Words");

    const renamedRow = page.locator("[role=button][aria-label^='Layer']").first();
    await renamedRow.dblclick();
    const restoreInput = renamedRow.locator("input");
    await restoreInput.fill(originalLabel.replace(/^Layer /, ""));
    await restoreInput.blur();
    await expect(page.locator("[role=button][aria-label^='Layer']").first()).toHaveAttribute(
      "aria-label",
      originalLabel,
    );
  });

  test("Space activates the focused eye button (the layer toggles visibility by keyboard)", async ({
    page,
  }) => {
    const firstRow = page.locator("[role=button][aria-label^='Layer']").first();
    const originalLabel = (await firstRow.getAttribute("aria-label")) ?? "";

    // The eye button of the first row (visible layer → "Hide layer").
    const eye = firstRow.locator("button[aria-label='Hide layer']").first();
    await eye.focus();

    // THE DEFECT PIN: pre-fix the bubbled keydown was preventDefault()ed
    // by the row's own handler — the native Space activation never fired
    // and the layer stayed visible.
    await eye.press(" ");
    await expect(
      firstRow.locator("button[aria-label='Show layer']").first(),
    ).toBeAttached();

    // Toggle back (the shared-e2e-DB hygiene convention).
    const eyeNow = firstRow.locator("button[aria-label='Show layer']").first();
    await eyeNow.focus();
    await eyeNow.press(" ");
    await expect(firstRow.locator("button[aria-label='Hide layer']").first()).toBeAttached();
    await expect(firstRow).toHaveAttribute("aria-label", originalLabel);
  });
});

test.describe("session 59 — the multi-selection fill clear (S59-E / A-L-3)", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
  });

  test("clearing the multi-selection Fill hex commits the transparent state", async ({ page }) => {
    // Select two filled elements through the LAYER ROWS (the
    // gesture-undo order-independence convention: earlier specs in the
    // same run can leave the shared e2e DB's Glow element LOCKED by the
    // session-23 wall contract — the canvas click would hit the pointer
    // wall, while the row click selects regardless of lock state).
    await page.locator("[role=button][aria-label='Layer Glow']").click();
    await page.locator("[role=button][aria-label='Layer Accent Bar']").click({
      modifiers: ["Shift"],
    });
    await expect(page.getByRole("heading", { name: "2 elements selected" })).toBeVisible();

    const glow = page.locator("[data-element-id][aria-label='Glow']");
    const preFill = await glow.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(preFill).toBe("rgb(139, 92, 246)"); // the seeded #8B5CF6

    // Clear the hex field (the emptied field emits the null commit).
    await page.getByRole("textbox", { name: "Fill Color hex" }).fill("");

    // THE DEFECT PIN: pre-fix the truthiness guard dropped the null — the
    // elements kept their fill (the field's placeholder lied).
    await expect(glow).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(
      page.locator("[data-element-id][aria-label='Accent Bar']"),
    ).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");

    // Restore the seeded fill (the shared-e2e-DB hygiene convention) and
    // wait for the debounced autosave to persist before leaving the page
    // (the session-21 discipline — the next test re-opens this project).
    await page.getByRole("textbox", { name: "Fill Color hex" }).fill("#8B5CF6");
    await expect(glow).toHaveCSS("background-color", "rgb(139, 92, 246)");
    await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
  });
});
