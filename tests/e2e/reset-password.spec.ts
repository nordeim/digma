import { expect, test } from "@playwright/test";

// Session 46 (RA-65/RA-66): the reference's /reset-password landing page —
// a PUBLIC, session-agnostic route the clone lacked entirely until this
// session. Two states keyed on the ?token= query param: only a NON-EMPTY
// token opens the "Set new password" form; a missing, empty, or differently
// named param renders the "Invalid Reset Link" card. The submit's invalid
// token answers 400 "Invalid or expired reset token" rendered as the INLINE
// destructive alert (the RA-60 family), and the token is validated BEFORE
// the password. The valid-token success path is the documented coherent
// superset (the token is email-only on the reference — unmeasurable).
//
// This file OPTS OUT of the shared storageState (the surface is public and
// session-agnostic — the reference renders it while logged in) and declares
// its own X-Forwarded-For bucket so its six auth calls never touch the
// auth.spec.ts shared budget (src/lib/rate-limit.ts keys on XFF).

test.use({ storageState: { cookies: [], origins: [] } });
test.use({ extraHTTPHeaders: { "X-Forwarded-For": "198.51.100.46" } });

test.describe("reset-password landing (no token → invalid-link card)", () => {
  test("renders the Invalid Reset Link card and Back to Login navigates to /login", async ({ page }) => {
    await page.goto("/reset-password");
    await expect(page.getByRole("heading", { name: "Invalid Reset Link" })).toBeVisible();
    await expect(page.getByText("This password reset link is invalid or has expired.")).toBeVisible();

    // The red circle-alert icon (h-10 w-10 text-red-600) above the heading.
    const icon = page.locator("svg.circle-alert, svg.lucide-circle-alert").first();
    await expect(icon).toBeVisible();
    const iconColor = await icon.evaluate((el) => getComputedStyle(el).color);
    expect(iconColor).toBe("rgb(220, 38, 38)"); // text-red-600

    // The card family: flat gray-50 page (NOT the login's slate gradient)
    // + rounded-lg shadow-lg plain-white card.
    const card = page.locator("div.max-w-md").first();
    const cardShadow = await card.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(cardShadow).toMatch(/rgba\(0, 0, 0, 0\.1\)/); // shadow-lg
    const pageBg = await page.evaluate(() => getComputedStyle(document.querySelector(".min-h-screen")!).backgroundColor);
    expect(pageBg).toBe("rgb(249, 250, 251)"); // bg-gray-50

    // Back to Login (capital L on this state) → /login.
    await page.getByRole("button", { name: "Back to Login" }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Welcome to Digma" })).toBeVisible();
  });

  test("an empty token and a differently-named param both render the invalid card (RA-66)", async ({ page }) => {
    await page.goto("/reset-password?token=");
    await expect(page.getByRole("heading", { name: "Invalid Reset Link" })).toBeVisible();
    await page.goto("/reset-password?code=abc123");
    await expect(page.getByRole("heading", { name: "Invalid Reset Link" })).toBeVisible();
  });
});

test.describe("reset-password form (non-empty token)", () => {
  test("renders the measured form structure with no client-side minLength", async ({ page }) => {
    await page.goto("/reset-password?token=e2e-shape-probe");
    await expect(page.getByRole("heading", { name: "Set new password" })).toBeVisible();
    await expect(page.getByText("Enter your new password for Digma")).toBeVisible();

    const password = page.locator("input#password");
    const confirm = page.locator("input#confirmPassword");
    await expect(password).toBeVisible();
    await expect(confirm).toBeVisible();

    // The measured attributes: required, the bullet placeholder, NO
    // minLength (RA-63 family — the reference measured -1 on both fields),
    // and a lock icon (no eye toggle on the reference's reset card).
    const attrs = await password.evaluate((el) => ({
      minLength: (el as HTMLInputElement).minLength,
      required: (el as HTMLInputElement).required,
      placeholder: (el as HTMLInputElement).placeholder,
      type: (el as HTMLInputElement).type,
    }));
    expect(attrs.minLength).toBe(-1);
    expect(attrs.required).toBe(true);
    expect(attrs.placeholder).toBe("••••••••");
    expect(attrs.type).toBe("password");
    await expect(page.locator("svg.lock, svg.lucide-lock").first()).toBeVisible();

    // The helper + the measured button pair (primary + the bare link).
    await expect(page.getByText("Must be at least 8 characters")).toBeVisible();
    await expect(page.getByRole("button", { name: "Reset password", exact: true })).toBeVisible();
    const backLink = page.getByRole("button", { name: "Back to login" }); // lowercase l on this state
    await expect(backLink).toBeVisible();
    const backCls = await backLink.evaluate((el) => el.className);
    expect(backCls).toContain("text-gray-600"); // the bare w-full text link
  });

  test("mismatched passwords render the inline error and do not submit", async ({ page }) => {
    await page.goto("/reset-password?token=e2e-shape-probe");
    await page.locator("input#password").fill("NewPass1234!");
    await page.locator("input#confirmPassword").fill("Different99!");
    await page.getByRole("button", { name: "Reset password", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Passwords do not match" })).toBeVisible();
    // Still on the reset page — the guard blocked the submit.
    await expect(page).toHaveURL(/\/reset-password/);
  });

  test("the invalid-token submit renders the reference's inline alert", async ({ page }) => {
    await page.goto("/reset-password?token=e2e-invalid-token");
    await page.locator("input#password").fill("NewPass1234!");
    await page.locator("input#confirmPassword").fill("NewPass1234!");
    await page.getByRole("button", { name: "Reset password", exact: true }).click();
    const alert = page.getByRole("alert").filter({ hasText: "Invalid or expired reset token" });
    await expect(alert).toBeVisible({ timeout: 15_000 });
    // The destructive family: bg-red-50/50 + border-red-200.
    const cls = await alert.evaluate((el) => el.className);
    expect(cls).toContain("red");
  });

  test("the bare Back to login link returns to the sign-in card", async ({ page }) => {
    await page.goto("/reset-password?token=e2e-shape-probe");
    await page.getByRole("button", { name: "Back to login" }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Welcome to Digma" })).toBeVisible();
  });
});

test.describe("the full reset round-trip (the in-app delivery, ADR-014 family)", () => {
  test("forgot → the sent card carries the link → set a new password → sign in with it", async ({ page }) => {
    // 1. The forgot request on the demo account.
    await page.goto("/login");
    await page.getByRole("button", { name: "Forgot password?" }).click();
    await page.getByLabel("Email").fill("demo@digma.app");
    await page.getByRole("button", { name: "Send reset link" }).click();
    await expect(page.getByRole("heading", { name: "Check your email", exact: true })).toBeVisible({ timeout: 15_000 });

    // 2. The self-hosted in-app delivery: the sent card carries the reset
    //    link in the blue info-alert family (no email service — ADR-014).
    const infoLink = page.getByRole("link", { name: /reset your password/i });
    await expect(infoLink).toBeVisible({ timeout: 15_000 });
    const href = await infoLink.evaluate((el) => (el as HTMLAnchorElement).href);
    expect(href).toMatch(/\/reset-password\?token=.+/);

    // 3. Follow the link → the form renders with the LIVE token.
    await infoLink.click();
    await expect(page.getByRole("heading", { name: "Set new password" })).toBeVisible();
    await expect(page).toHaveURL(/\/reset-password\?token=.+/);

    // 4. Set the new password.
    await page.locator("input#password").fill("Reset1234!");
    await page.locator("input#confirmPassword").fill("Reset1234!");
    await page.getByRole("button", { name: "Reset password", exact: true }).click();

    // 5. The success card (the coherent superset — the reference's own
    //    success path is unmeasurable), then back to login.
    await expect(page.getByRole("heading", { name: /password reset/i })).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: /Back to login/i }).click();
    await expect(page).toHaveURL(/\/login$/);

    // 6. The OLD password no longer signs in; the NEW one does.
    await page.getByLabel("Email").fill("demo@digma.app");
    await page.getByLabel("Password").fill("Digma1234!");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Invalid email or password" })).toBeVisible();

    await page.getByLabel("Password").fill("Reset1234!");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page.getByRole("heading", { name: /Good (morning|afternoon|evening)/ })).toBeVisible({ timeout: 15_000 });

    // 7. Restore the demo password (the e2e DB re-seeds per run, but the
    //    spec stays self-contained for a reused-server re-run).
    await page.evaluate(() => fetch("/api/auth/logout", { method: "POST" }).then(() => undefined));
    await page.goto("/login");
    await page.getByRole("button", { name: "Forgot password?" }).click();
    await page.getByLabel("Email").fill("demo@digma.app");
    await page.getByRole("button", { name: "Send reset link" }).click();
    const restoreLink = page.getByRole("link", { name: /reset your password/i });
    await expect(restoreLink).toBeVisible({ timeout: 15_000 });
    await restoreLink.click();
    await page.locator("input#password").fill("Digma1234!");
    await page.locator("input#confirmPassword").fill("Digma1234!");
    await page.getByRole("button", { name: "Reset password", exact: true }).click();
    await expect(page.getByRole("heading", { name: /password reset/i })).toBeVisible({ timeout: 15_000 });
  });
});
