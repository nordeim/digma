import { expect, test } from "@playwright/test";

// Session 69 — the TDD pin for the seventeenth audit's L-C (the
// login screen's OTP-knob dead end — an S67-C aftershock).
//
// THE DEFECT: the login screen's VERIFY_EMAIL recovery guard requires
// a TRUTHY body.verificationCode. Under DIGMA_DISABLE_IN_APP_OTP=1
// the route answers verificationCode: null (login/route.ts — the
// S67-C knob contract), the guard fails, and an unverified user gets
// the generic "Verify your email to sign in…" string as a plain
// inline error on the sign-in card with NO path to the verify card:
// the knob posture locks them out of the recovery flow entirely.
// Register's sibling already degrades correctly (enterVerify(String(
// body?.data?.verificationCode ?? "")) opens the card with an empty
// hint).
//
// THE PIN: the login POST is intercepted and fulfilled with the
// route's REAL documented response shape under the knob — 403 with
// { ok: false, error: { code: "VERIFY_EMAIL", message: …,
// verificationCode: null } } (byte-shape from login/route.ts — the
// session-71 envelope fold moved the code INSIDE error and deleted
// the dead top-level email field) — and the card must OPEN the verify
// state (the h2 + the six digit inputs). Pre-fix: the inline error
// renders and the digits never appear (the dead end). The route-mocked
// response carries the real knob-posture shape; the route's own knob
// behavior is unit-pinned (tests/ai-limit-otp-s67.test.ts), so this
// spec pins the CLIENT contract exactly.
//
// This file OPTS OUT of the shared storageState (empty cookies) —
// it tests the logged-out surface (the auth.spec.ts convention).

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("session 69 — the login VERIFY_EMAIL recovery under the OTP knob (S69-C / L-C)", () => {
  test("a null verificationCode still opens the verify card (the knob posture keeps the recovery path)", async ({
    page,
  }) => {
    // The route's real knob-posture response: 403, the VERIFY_EMAIL
    // envelope with the code nulled INSIDE error (the emailed-code
    // delivery posture — S67-C; the session-71 envelope fold).
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({
          ok: false,
          error: {
            code: "VERIFY_EMAIL",
            message: "Verify your email to sign in — we've sent a fresh 6-digit code.",
            verificationCode: null,
          },
        }),
      });
    });

    await page.goto("/login");
    await page.getByLabel("Email").fill("knob-posture@example.com");
    await page.getByLabel("Password").fill("Whatever123!");
    await page.getByRole("button", { name: "Sign in" }).click();

    // POST-FIX: the verify card OPENS — the h2, the email line, and
    // the six digit inputs all render. PRE-FIX (the honest RED): the
    // guard fails on the null code, the generic inline error renders
    // instead, and the digit inputs never appear.
    await expect(
      page.getByRole("heading", { name: "Verify your email", exact: true }),
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("We've sent a 6-digit code to")).toBeVisible();
    for (let i = 1; i <= 6; i += 1) {
      await expect(page.getByLabel(`Verification code digit ${i}`)).toBeVisible();
    }

    // The sign-in card's inline error dead end is GONE. Scoped inside
    // <main>: Next.js's own __next-route-announcer__ is a body-level,
    // visually-hidden role="alert" element (aria-live=assertive) that
    // appears after client-side navigation — an unscoped
    // getByRole("alert") always counts it (the F56 en-route lesson).
    await expect(page.locator("main").getByRole("alert")).toHaveCount(0);
    await expect(page.getByText("Verify your email to sign in")).toHaveCount(0);

    // The honest-moment evidence (the F42 discipline): the knob-posture
    // verify card at its verified state — captured BY the pin at the
    // moment every assertion above has passed.
    await page.screenshot({
      path: "docs/screenshots/ref-audit-s79/clone-21-knob-posture-verify-card.png",
    });
  });
});
