import { expect, test } from "@playwright/test";

// Editor panel chrome — measured from the reference app's DOM:
// the bottom-left chips are INDEPENDENT panel visibility toggles (Layers,
// Components, Properties — default ON/OFF/ON), the Layers header button
// toggles Select All / Deselect All, and the properties panel follows the
// reference's section layout (Position & Size, Corner Radius, Fill & Stroke,
// Transform, Opacity; Canvas Properties → Background Color when nothing is
// selected). Contexts arrive AUTHENTICATED (setup-project storageState).

const SEEDED_PROJECT = "Marketing Hero Banner";

async function openSeededEditor(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByText(SEEDED_PROJECT).filter({ visible: true }).first().click();
  await expect(page).toHaveURL(/\/Editor\?projectId=/);
}

test.describe("editor panel toggles (desktop)", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
  });

  test("chips default to Layers on, Components off, Properties on", async ({ page }) => {
    const layers = page.getByRole("button", { name: "Toggle Layers panel" });
    const components = page.getByRole("button", { name: "Toggle Components panel" });
    const properties = page.getByRole("button", { name: "Toggle Properties panel" });

    await expect(layers).toHaveAttribute("aria-pressed", "true");
    await expect(components).toHaveAttribute("aria-pressed", "false");
    await expect(properties).toHaveAttribute("aria-pressed", "true");

    // The toggled-on panels are actually rendered.
    await expect(page.getByRole("heading", { name: "Layers" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
    await expect(page.getByText("No components yet")).toBeHidden();
  });

  test("the Components chip adds the components panel beside Layers", async ({ page }) => {
    await page.getByRole("button", { name: "Toggle Components panel" }).click();

    await expect(page.getByRole("heading", { name: "Components", exact: true })).toBeVisible();
    await expect(page.getByText("No components yet")).toBeVisible();
    await expect(page.getByText("Create reusable design components")).toBeVisible();
    // The layers panel stays — the toggles are independent, not exclusive.
    await expect(page.getByRole("heading", { name: "Layers" })).toBeVisible();
  });

  test("the Properties chip hides the right panel", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
    await page.getByRole("button", { name: "Toggle Properties panel" }).click();

    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeHidden();
    // The canvas and the rest of the editor keep working.
    await expect(page.getByRole("heading", { name: "Layers" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
  });

  test("the Layers chip hides the layers panel", async ({ page }) => {
    await page.getByRole("button", { name: "Toggle Layers panel" }).click();

    await expect(page.getByRole("heading", { name: "Layers" })).toBeHidden();
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
  });
});

test.describe("layers header selection toggle", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
  });

  test("Select All selects everything and flips to Deselect All", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "Select All" });
    await expect(toggle).toBeVisible();

    await toggle.click();
    await expect(page.getByRole("button", { name: "Deselect All" })).toBeVisible();
    await expect(page.getByText("• 6 selected")).toBeVisible();

    await page.getByRole("button", { name: "Deselect All" }).click();
    await expect(page.getByRole("button", { name: "Select All" })).toBeVisible();
    await expect(page.getByText(/• \d+ selected/)).toBeHidden();
  });
});

test.describe("properties panel section layout", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
  });

  test("nothing selected: Canvas Properties offers the Background Color row", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 4, name: "Background Color" })).toBeVisible();
  });

  test("one element selected: the reference's five sections render", async ({ page }) => {
    await page.getByRole("button", { name: "Layer Headline" }).click();

    for (const section of ["Position & Size", "Corner Radius", "Fill & Stroke", "Transform", "Opacity"]) {
      await expect(page.getByRole("heading", { level: 4, name: section })).toBeVisible();
    }
    await expect(page.getByRole("heading", { name: "Properties", exact: true })).toBeVisible();
  });
});

test.describe("transform section: scale + rotation inputs (reference parity)", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
    await page.getByRole("button", { name: "Layer Headline" }).click();
    await expect(page.getByRole("heading", { level: 4, name: "Transform" })).toBeVisible();
  });

  test("Rotation pairs its slider with an editable number input", async ({ page }) => {
    const numberInput = page.getByRole("spinbutton", { name: "Rotation value" });
    await expect(numberInput).toBeVisible();
    await expect(numberInput).toHaveValue("0");

    await numberInput.fill("45");
    await expect(numberInput).toHaveValue("45");
    // The slider follows the typed value.
    const slider = page.getByRole("slider", { name: "Rotation" });
    await expect(slider).toHaveValue("45");
  });

  test("Scale shows the 1.0x default readout and the 0.1–3.0 slider", async ({ page }) => {
    const slider = page.getByRole("slider", { name: "Scale" });
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute("min", "0.1");
    await expect(slider).toHaveAttribute("max", "3");
    await expect(page.getByTestId("scale-value")).toHaveText("1.0x");
  });

  test("scaling an element grows its visual footprint and persists", async ({ page }) => {
    const slider = page.getByRole("slider", { name: "Scale" });
    // Keyboard-driven slider steps (0.1 per step) reach 2.0 deterministically.
    await slider.focus();
    for (let i = 0; i < 10; i++) await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("scale-value")).toHaveText("2.0x");

    // The element's rendered transform chain carries scale (canvas space).
    const transform = await page.locator('[data-element-id][aria-label="Headline"]').getAttribute("style");
    expect(transform).toContain("scale(2)");

    // Autosave persists the scale; a reload re-renders the scaled element.
    await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
    await page.reload();
    await expect(page.getByTestId("scale-value")).toBeHidden(); // nothing selected after reload
    await page.getByRole("button", { name: "Layer Headline" }).click();
    await expect(page.getByTestId("scale-value")).toHaveText("2.0x");
  });
});

test.describe("panel chips render only where their panels can (responsive fix)", () => {
  test("chips are hidden on the mobile editor (no dead controls)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();

    await expect(page.getByRole("button", { name: "Toggle Layers panel" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Toggle Components panel" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Toggle Properties panel" })).toBeHidden();
    // The canvas and the AI assistant still work — the editor is not gutted.
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
  });

  test("the Properties chip waits for lg (its panel is lg:flex)", async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 900 }); // md..lg zone
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();

    await expect(page.getByRole("button", { name: "Toggle Layers panel" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Toggle Properties panel" })).toBeHidden();

    // Desktop (>= lg): all three chips are back.
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.getByRole("button", { name: "Toggle Properties panel" })).toBeVisible();
  });
});
