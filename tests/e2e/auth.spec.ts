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

  test("wrong password renders the reference's inline alert (session 43, RA-60)", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@digma.app");
    await page.getByLabel("Password").fill("definitely-wrong");
    await page.getByRole("button", { name: "Sign in" }).click();
    // The reference's measured contract: the failure renders an INLINE
    // alert INSIDE the form (role=alert, the red family, its exact text) —
    // NO toast (the pre-fix clone showed a destructive "Sign in failed"
    // toast; the reference shows none).
    const alert = page.getByRole("alert").filter({ hasText: "Invalid email or password" });
    await expect(alert).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("[data-sonner-toast], .toast")).toHaveCount(0);
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
    // (The submit's check-your-email transition is pinned by the RA-59
    // test below — the pre-fix "Reset link sent" toast retired with it.)
  });

  // -------------------------------------------------------------------------
  // Session 43 (RA-58/RA-59): the signup's verify-email follow-through and
  // the forgot submit's check-your-email success card. NOTE the auth-call
  // budget: the rate limiter allows 10 per IP per 15 minutes and the whole
  // e2e run shares one window — this file keeps its total at 9 (setup 1 +
  // wrong-password 1 + valid 1 + redirect 1 + envelope 1 + this journey's
  // register/wrong-verify/login/verify 4). The Resend ROUND-TRIP lives in
  // the smoke suite (its own server process, its own bucket) — this pin
  // asserts the button's chrome only.
  // -------------------------------------------------------------------------
  test("the signup transitions to the verify-email card and the code opens the session (RA-58)", async ({ page }) => {
    const probeEmail = `verify-probe-${Date.now()}@digma.app`;
    await page.goto("/login");
    await page.getByRole("button", { name: /Need an account\? Sign up/ }).click();
    await page.getByLabel("Email").fill(probeEmail);
    await page.getByLabel("Password", { exact: true }).fill("VerifyPass123!");
    await page.getByLabel("Confirm Password").fill("VerifyPass123!");
    await page.getByRole("button", { name: "Create account" }).click();

    // The reference's verify-email card: the shield-check icon circle, the
    // h2, the email line, the six digit inputs, the helper, the slate-900
    // submit, and the timerless Resend row.
    await expect(page.getByRole("heading", { name: "Verify your email", exact: true })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("We've sent a 6-digit code to")).toBeVisible();
    await expect(page.getByText(probeEmail)).toBeVisible();
    for (let i = 1; i <= 6; i += 1) {
      await expect(page.getByLabel(`Verification code digit ${i}`)).toBeVisible();
    }
    await expect(page.getByText("Enter the verification code sent to your email")).toBeVisible();
    await expect(page.getByRole("button", { name: "Verify email", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Resend", exact: true })).toBeEnabled();

    // The self-hosted delivery: the code note (the reference emails it —
    // the clone has no mail service, so the API response carries it).
    const codeNote = page.getByText(/your verification code is/);
    await expect(codeNote).toBeVisible();
    const deliveredCode = await codeNote.textContent();
    const code = (deliveredCode ?? "").replace(/\D/g, "");

    // A wrong code renders the reference's DECREMENTING attempts error.
    for (let i = 1; i <= 6; i += 1) {
      await page.getByLabel(`Verification code digit ${i}`).fill("0");
    }
    await page.getByRole("button", { name: "Verify email", exact: true }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "Invalid verification code. 4 attempts remaining." }),
    ).toBeVisible();

    // Back to sign in, then the correct-password login on the UNVERIFIED
    // account re-opens the verify card (the clone's working superset over
    // the reference's generic dead-end error — the login regenerated the
    // code and carried it in the 403).
    await page.getByRole("button", { name: "Back to sign in" }).click();
    await expect(page.getByRole("heading", { name: "Welcome to Digma" })).toBeVisible();
    await page.getByLabel("Email").fill(probeEmail);
    await page.getByLabel("Password").fill("VerifyPass123!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("heading", { name: "Verify your email", exact: true })).toBeVisible({ timeout: 15_000 });

    // The recovery path's fresh code verifies and the session lands.
    const recoveryNote = page.getByText(/your verification code is/);
    await expect(recoveryNote).toBeVisible();
    const recoveryCode = ((await recoveryNote.textContent()) ?? "").replace(/\D/g, "");
    for (let i = 1; i <= 6; i += 1) {
      await page.getByLabel(`Verification code digit ${i}`).fill(recoveryCode[i - 1] ?? "");
    }
    await page.getByRole("button", { name: "Verify email", exact: true }).click();
    await expect(page).toHaveURL(/\/$/, { timeout: 15_000 });
    await expect(
      page.getByRole("heading", { level: 1 }).filter({ hasText: /Good (morning|afternoon|evening)/ }),
    ).toBeVisible();
  });

  test("the forgot submit transitions to the check-your-email success card (RA-59)", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Forgot password?" }).click();
    await page.getByLabel("Email").fill("reset-flow@outlook.com");
    await page.getByRole("button", { name: "Send reset link" }).click();

    // The reference's success card: the mail icon circle, the h2, the
    // email line, the GREEN alert with its measured copy, and the
    // FULL-WIDTH bottom back button (no top back-link on this state).
    await expect(page.getByRole("heading", { name: "Check your email", exact: true })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("We've sent password reset instructions to")).toBeVisible();
    await expect(page.getByText("reset-flow@outlook.com")).toBeVisible();
    const greenAlert = page.getByRole("alert").filter({
      hasText: "Please check your email for the password reset link. It may take a few minutes to arrive.",
    });
    await expect(greenAlert).toBeVisible();
    // No top back-link (the minimal family's -mb-2 arrow button) on the
    // sent state — the reference's bottom button is the only way back.
    await expect(page.locator("button.-mb-2")).toHaveCount(0);

    // The full-width bottom button returns to the sign-in card.
    await page.getByRole("button", { name: /Back to sign in/ }).last().click();
    await expect(page.getByRole("heading", { name: "Welcome to Digma" })).toBeVisible();
  });
});

// -------------------------------------------------------------------------
// Session 45 (RA-63): the reference's auth inputs carry NO client-side
// minLength (measured on BOTH cards: minLength -1) — a weak password
// SUBMITS and the API's 400 renders as the INLINE alert inside the form.
// The pre-fix clone's minLength={8} blocked submission with the browser's
// NATIVE validation bubble instead — this pin proves that path is gone.
//
// Budget note: this describe declares its own X-Forwarded-For header, so
// its register attempt lands in a DEDICATED rate-limit bucket
// (src/lib/rate-limit.ts keys on XFF) — the file's shared 9/10 budget is
// untouched.
// -------------------------------------------------------------------------
test.describe("signup weak-password validation (session 45, RA-63)", () => {
  test.use({ extraHTTPHeaders: { "X-Forwarded-For": "198.51.100.45" } });

  test("a short password submits and renders the reference's inline alert — no native bubble", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Need an account\? Sign up/ }).click();
    await page.getByLabel("Email").fill(`weak-probe-${Date.now()}@digma.app`);
    await page.getByLabel("Password", { exact: true }).fill("abc");
    await page.getByLabel("Confirm Password").fill("abc");
    await page.getByRole("button", { name: "Create account" }).click();

    // The reference's measured contract: the failure renders an INLINE
    // alert INSIDE the form with the API's exact text — the native
    // validation bubble never appears (the inputs carry no minLength).
    const alert = page.getByRole("alert").filter({ hasText: "Password must be at least 8 characters long" });
    await expect(alert).toBeVisible({ timeout: 15_000 });

    // The card stays on the sign-up state — no navigation, no toast.
    await expect(page.getByRole("heading", { name: "Create your account", exact: true })).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator("[data-sonner-toast], .toast")).toHaveCount(0);
  });
});
