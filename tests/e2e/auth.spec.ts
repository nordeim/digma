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

// The reference app's auth card RESTRUCTURES itself per mode (decoded from
// the live DOM 2026-09-27): sign-in keeps the logo + social buttons + h1,
// but sign-up and forgot switch to a minimal card — a "Back to sign in"
// link at the top, an h2 heading, NO logo, NO social buttons, NO divider.
// Sign-up adds a Confirm Password field with inline mismatch validation;
// it has NO name field (the register API derives the name from the email).

test.describe("auth card state structure (reference parity)", () => {
  test("signup state swaps to the minimal card: back-link + h2, no logo or social", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Need an account\? Sign up/ }).click();

    await expect(page.getByRole("heading", { name: "Create your account", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Back to sign in" })).toBeVisible();

    // The logo chip and social buttons are GONE in signup mode.
    await expect(page.locator("span.rounded-full.ring-4")).toHaveCount(0);
    for (const label of ["Continue with Google", "Continue with Microsoft", "Continue with Facebook"]) {
      await expect(page.getByRole("button", { name: label, exact: true })).toHaveCount(0);
    }
  });

  test("signup state has Confirm Password, the Min. 8 characters placeholder, and no Name field", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Need an account\? Sign up/ }).click();

    await expect(page.getByLabel("Confirm Password")).toBeVisible();
    await expect(page.getByPlaceholder("Re-enter password")).toBeVisible();
    await expect(page.getByPlaceholder("Min. 8 characters")).toBeVisible();
    await expect(page.getByLabel("Name")).toHaveCount(0);
  });

  test("mismatched passwords show the inline error and do not navigate", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Need an account\? Sign up/ }).click();

    await page.getByLabel("Email").fill("parity-check@digma.app");
    await page.getByLabel("Password", { exact: true }).fill("Password123");
    await page.getByLabel("Confirm Password").fill("Different999");
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByText("Passwords do not match")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("the signup back-link returns to the sign-in card", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Need an account\? Sign up/ }).click();
    await page.getByRole("button", { name: "Back to sign in" }).click();

    await expect(page.getByRole("heading", { name: "Welcome to Digma" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue with Google" })).toBeVisible();
  });

  test("forgot state renders the reference card: back-link + Reset your password + email only", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Forgot password?" }).click();

    await expect(page.getByRole("heading", { name: "Reset your password", exact: true })).toBeVisible();
    await expect(
      page.getByText("Enter your email and we'll send you a link to reset your password"),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Back to sign in" })).toBeVisible();

    // Email only — no password fields, no logo, no social buttons.
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toHaveCount(0);
    await expect(page.locator("span.rounded-full.ring-4")).toHaveCount(0);

    // The reference's bottom toggles are gone in forgot mode.
    await expect(page.getByRole("button", { name: "Forgot password?" })).toHaveCount(0);

    await page.getByLabel("Email").fill("reset-me@digma.app");
    await page.getByRole("button", { name: "Send reset link" }).click();
    await expect(page.getByText("Reset link sent").first()).toBeVisible();
  });
});
