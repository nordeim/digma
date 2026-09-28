import { expect, test } from "@playwright/test";

// Workspace surface at desktop width: the path routes serve each view, the
// dashboard renders the seeded demo workspace, the create-project dialog
// validates, and the editor loads a project with its canvas.
// Contexts arrive AUTHENTICATED (setup-project storageState).

test.describe("workspace shell (desktop)", () => {
  test("dashboard renders the seeded demo workspace", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1 }).filter({ hasText: /Good (morning|afternoon|evening)/ }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Quick Stats" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Continue Working" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "All Projects" })).toBeVisible();
    // The seeded projects surface.
    await expect(page.getByText("Marketing Hero Banner").filter({ visible: true }).first()).toBeVisible();
  });

  for (const [path, heading] of [
    ["/Recent", "Recent Files"],
    ["/Teams", "Teams"],
  ] as const) {
    test(`path route ${path} serves the ${heading} view`, async ({ page }) => {
      await page.goto(path);
      await expect(
        page.getByRole("heading", { name: heading, exact: true }).filter({ visible: true }).first(),
      ).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`${path.replace("/", "\\/")}/?$`));
    });
  }

  test("unknown paths return 404", async ({ page }) => {
    const res = await page.goto("/definitely-not-a-route");
    expect(res?.status()).toBe(404);
  });

  test("legacy lowercase routes 307-redirect to the canonical capitalized routes", async ({ page }) => {
    // ADR-008: the canonical routes are CAPITALIZED for reference parity;
    // legacy lowercase bookmarks are redirected by src/proxy.ts (the Next 16
    // `proxy` convention — migrated from middleware.ts in session 12; this
    // characterization pin was written BEFORE the migration and must stay
    // green through it). next.config redirects() cannot express this (its
    // source matching is case-insensitive in Next 16 — observed self-loop).
    for (const [legacy, canonical, heading] of [
      ["/dashboard", "/Dashboard", "Quick Stats"],
      ["/recent", "/Recent", "Recent Files"],
      ["/teams", "/Teams", "Teams"],
    ] as const) {
      const res = await page.goto(legacy);
      // 307 through to the canonical route…
      expect(res?.request().redirectedFrom()?.url()).toContain(legacy);
      await expect(page).toHaveURL(new RegExp(`${canonical.replace("/", "\\/")}/?$`));
      // …and the canonical view actually renders.
      await expect(
        page.getByRole("heading", { name: heading, exact: true }).filter({ visible: true }).first(),
      ).toBeVisible();
    }
    // The editor's query survives the redirect (?projectId=… is load-bearing).
    await page.goto("/editor?projectId=seed-1");
    await expect(page).toHaveURL(/\/Editor\/?\?projectId=seed-1$/);
  });

  test("the create-project dialog validates and creates", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Create New Design" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Create New Design File" })).toBeVisible();

    // Validation: an empty name keeps the submit disabled.
    const submit = dialog.getByRole("button", { name: "Create Project" });
    await expect(submit).toBeDisabled();

    await dialog.getByLabel("Project Name *").fill("E2E spec project");
    await submit.click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "E2E spec project" })).toBeVisible();
  });

  test("the editor loads a seeded project with layers", async ({ page }) => {
    // Navigate through the dashboard (the real user path).
    await page.goto("/");
    await page.getByText("Marketing Hero Banner").filter({ visible: true }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    await expect(page.getByRole("heading", { name: "Marketing Hero Banner" })).toBeVisible();
    await expect(page.getByRole("toolbar", { name: "Editor tools" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Layers" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Layer Headline" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
  });

  test("the teams view renders the seeded team", async ({ page }) => {
    await page.goto("/Teams");
    await expect(page.getByRole("heading", { name: "Design Team" })).toBeVisible();
    await expect(page.getByText("Alex Design")).toBeVisible();
  });

  test("the AI assistant never takes the page down (live-app crash regression)", async ({ page }) => {
    // The REFERENCE app crashes on AI submission (TypeError reading 'charAt',
    // React root unmounts — reproduced live 2026-09-27). This clone's
    // degrade-not-fail contract must keep the page alive, answer, and mutate
    // the canvas even when the LLM layer is unavailable.
    await page.goto("/");
    await page.getByText("Marketing Hero Banner").filter({ visible: true }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);

    const before = await page.getByRole("button", { name: /^Layer / }).count();
    await page.getByRole("textbox", { name: "Message the AI design assistant" }).fill("Add 2 blue squares");
    await page.getByRole("button", { name: "Send message" }).click();

    // A reply arrives (deterministic fallback when the SDK is down)…
    await expect(page.getByText("Added 2 blue squares")).toBeVisible({ timeout: 15_000 });
    // …the canvas grew…
    await expect.poll(() => page.getByRole("button", { name: /^Layer / }).count()).toBeGreaterThan(before);
    // …and the page is still fully interactive (no blank-screen crash).
    await expect(page.getByRole("heading", { name: "Marketing Hero Banner" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Layers" })).toBeVisible();
  });
});
