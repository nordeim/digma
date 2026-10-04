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
    await page.getByRole("button", { name: "Open Marketing Hero Banner" }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    await expect(page.getByRole("heading", { name: "Marketing Hero Banner" })).toBeVisible();
    await expect(page.getByRole("toolbar", { name: "Editor tools" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Layers" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Layer Headline", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
  });

  test("the bell popover closes on Escape (session 56, S56-I / L-5)", async ({ page }) => {
    // The Mode C audit's L-5: the popover carries role="dialog" but had no
    // Escape-close — a keyboard user could not dismiss it (the
    // pointerdown-outside handler covers pointers only).
    await page.goto("/");
    await page.getByRole("button", { name: "Notifications" }).click();
    const popover = page.getByRole("dialog", { name: "Notifications" });
    await expect(popover).toBeVisible();
    await expect(popover.getByText("You're all caught up")).toBeVisible();

    // Escape dismisses it.
    await page.keyboard.press("Escape");
    await expect(popover).toBeHidden();
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
    await page.getByRole("button", { name: "Open Marketing Hero Banner" }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);

    const before = await page.getByRole("button", { name: /^Layer / }).count();
    await page.getByRole("textbox", { name: "Message the AI design assistant" }).fill("Add 2 blue squares");
    await page.getByRole("button", { name: "Send message" }).click();

    // A reply arrives — the DETERMINISTIC fallback's exact phrasing (the
    // e2e webServer sets DIGMA_DISABLE_AI_LLM=1, session 27: the reachable
    // SDK's free-form replies made this assertion non-deterministic; the
    // fallback's reply for "Add 2 blue squares" is "Added 2 squares.")…
    await expect(page.getByText("Added 2 squares")).toBeVisible({ timeout: 15_000 });
    // …the canvas grew…
    await expect.poll(() => page.getByRole("button", { name: /^Layer / }).count()).toBeGreaterThan(before);
    // …the "Try: …" suggestions line is STILL visible post-send (session 35,
    // RA-33 — double-measured on the reference: its line renders
    // UNCONDITIONALLY, persisting after every send with the reply rendered;
    // the clone's pre-fix "initial state only" gate rested on the stale
    // "post-send DOM unmeasurable" justification that session 27's live
    // reply measurements had already dissolved)…
    await expect(page.getByText(/^Try:/)).toBeVisible();
    // …and the page is still fully interactive (no blank-screen crash).
    await expect(page.getByRole("heading", { name: "Marketing Hero Banner" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Layers" })).toBeVisible();
  });
});

test.describe("project delete confirm (session 31)", () => {
  test("deletion confirms before deleting — Cancel keeps, Yes Delete removes", async ({ page }) => {
    // The reference's delete guard (RA-16, measured live): a confirm step
    // before the destructive DELETE. The pre-fix clone fired the DELETE
    // immediately on the menu click (live-verified: the project vanished on
    // the first click). The port: a dialog local to the card — Cancel keeps
    // the project, "Yes, Delete" removes it.
    //
    // Setup: create a sacrificial project through the real dialog flow.
    await page.goto("/");
    await page.getByRole("button", { name: "Create New Design" }).click();
    const create = page.getByRole("dialog");
    await create.getByLabel("Project Name *").fill("Delete Confirm Spec");
    await create.getByRole("button", { name: "Create Project" }).click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/, { timeout: 15_000 });
    await page.goto("/");

    // Session 70 (S70-A): the accessible-name carrier is the STRETCHED
    // BUTTON; the ellipsis trigger renders in the card ROOT around it.
    const card = page
      .getByRole("button", { name: "Open Delete Confirm Spec" })
      .first();
    await expect(card).toBeVisible();
    const cardRoot = card.locator("xpath=..");

    // Open the ellipsis menu and click Delete — the CONFIRM renders (the
    // pre-fix code deleted immediately: this assertion is the RED line).
    await cardRoot.getByRole("button", { name: /More options for Delete Confirm Spec/ }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    const confirm = page.getByRole("dialog");
    await expect(confirm.getByRole("heading", { name: "Delete project?" })).toBeVisible();

    // Cancel: the project survives.
    await confirm.getByRole("button", { name: "Cancel" }).click();
    await expect(confirm).toHaveCount(0);
    await expect(card).toBeVisible();

    // Delete again — "Yes, Delete" removes the project (and cleans up).
    await cardRoot.getByRole("button", { name: /More options for Delete Confirm Spec/ }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await expect(confirm.getByRole("heading", { name: "Delete project?" })).toBeVisible();
    await confirm.getByRole("button", { name: "Yes, Delete" }).click();
    await expect(card).toHaveCount(0, { timeout: 10_000 });
  });
});
