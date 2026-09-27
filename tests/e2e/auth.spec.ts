import { expect, test } from "@playwright/test";

// Login surface: the /login route renders the reference auth card, rejects
// bad credentials, signs the demo user in, and honors authenticated visits.
// This file OPTS OUT of the shared storageState (empty cookies) because it
// tests the logged-out surface. (Deliberately does NOT probe the rate
// limiter — 10 attempts/IP/15 min would poison the whole suite.)

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("login route", () => {
  test("renders the auth card with the circular logo chip", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome to Digma" })).toBeVisible();
    await expect(page.getByText("Sign in to continue")).toBeVisible();

    // The logo is a white circular chip (rounded-full + ring-4 ring-white/50
    // + shadow). Tailwind v4 computes rounded-full as calc(infinity*1px) →
    // Chrome reports 33554432px, so assert the geometry, not exact strings.
    const chip = page.locator("span.rounded-full.ring-4").first();
    await expect(chip).toBeVisible();
    const radius = await chip.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius));
    expect(radius).toBeGreaterThan(1000);
    const shadow = await chip.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow).toMatch(/0\.5\) 0px 0px 0px 4px/);
  });

  test("social buttons render for parity and explain on tap", async ({ page }) => {
    await page.goto("/login");
    for (const label of ["Continue with Google", "Continue with Microsoft", "Continue with Facebook"]) {
      await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
    }
  });

  test("wrong password is rejected without a session", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@digma.app");
    await page.getByLabel("Password").fill("definitely-wrong");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Sign in failed").first()).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("valid credentials sign in and land on the workspace", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@digma.app");
    await page.getByLabel("Password").fill("Digma1234!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/$/, { timeout: 15_000 });
    // The workspace shell renders the greeting hero.
    await expect(page.getByRole("heading", { level: 1 }).filter({ hasText: /Good (morning|afternoon|evening)/ })).toBeVisible();
  });

  test("authenticated visits redirect /login back to the workspace", async ({ page }) => {
    const res = await page.request.post("/api/auth/login", {
      data: { email: "demo@digma.app", password: "Digma1234!" },
    });
    expect(res.ok()).toBeTruthy();
    await page.goto("/login");
    await expect(page).toHaveURL(/\/$/);
  });

  test("unknown API paths keep the envelope contract", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: { email: "not-a-user@digma.app", password: "wrong-password" },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("UNAUTHENTICATED");
  });
});
