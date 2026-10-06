import { expect, test } from "@playwright/test";

// Session 67 — the fifteenth Mode C audit's chosen e2e pins (the
// USER-VISIBLE behavioral defects of the batch: S67-A the stateless
// session's revocation gap — a password reset did NOT evict previously
// minted cookies, so a stolen/observed session outlived the very reset
// performed to kill it; S67-C the assistant's missing rate limit — an
// authenticated caller drove unbounded LLM completions; S67-D the
// Dashboard's list view rendered a stray empty bordered container above
// the empty state). The pure-seam fixes S67-B carry their pins in the
// unit suite's tests/request-surface-s67.test.ts.
//
// Contexts arrive AUTHENTICATED (the setup project's storageState).
// This file declares its OWN X-Forwarded-For bucket (198.51.100.67):
// its five auth calls (register, verify, forgot, reset, the final
// login) never touch the auth.spec.ts shared budget, and its assistant
// calls key the DEDICATED ai: bucket — never the auth: bucket (the
// documented deferral reason: the suites share one localhost IP).

test.use({ extraHTTPHeaders: { "X-Forwarded-For": "198.51.100.67" } });

test.describe("session 67 — the tokenVersion revocation (S67-A / M-1)", () => {
  test("a password reset evicts the pre-reset session cookie", async ({ page }) => {
    // A DEDICATED scratch account: the demo user's tokenVersion stays
    // untouched — the shared storageState keeps authorizing the ~50
    // specs that run after this file alphabetically (the re-anchoring
    // discipline: the reset round-trip in reset-password.spec.ts moved
    // onto its own scratch account this session for the same reason).
    const scratchEmail = `s67-revoke-${Date.now()}@e2e.test`;
    const scratchPassword = "Scratch67Pass!";

    // Relative fetches need an app origin — land on the authenticated
    // dashboard first (the storageState session).
    await page.goto("/");

    // 1. Register the scratch account — the code travels in the
    //    response (the ADR-014 in-app delivery).
    const register = await page.evaluate(
      async ({ email, password }) => {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: "S67 Scratch" }),
        });
        return res.json();
      },
      { email: scratchEmail, password: scratchPassword },
    );
    expect(register.ok).toBe(true);
    const code = register.data.verificationCode as string;

    // 2. Verify — the scratch session cookie lands in the browser
    //    context (tokenVersion 0).
    const verify = await page.evaluate(
      async ({ email, code: otp }) => {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: otp }),
        });
        return res.json();
      },
      { email: scratchEmail, code },
    );
    expect(verify.ok).toBe(true);

    // The scratch session authorizes the app…
    await expect(page.getByRole("heading", { name: /Good (morning|afternoon|evening)/ })).toBeVisible();

    // Capture the pre-reset cookie for the direct API-level check.
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find((c) => c.name === "digma_session");
    expect(sessionCookie).toBeTruthy();
    const preResetToken = sessionCookie!.value;

    // 3. The forgot → reset round-trip on the scratch account.
    const forgot = await page.evaluate(
      async (email) => {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        return res.json();
      },
      scratchEmail,
    );
    expect(forgot.ok).toBe(true);
    const resetToken = (forgot.data.resetUrl as string).split("token=")[1];
    expect(resetToken).toBeTruthy();

    const reset = await page.evaluate(
      async ({ token, password }) => {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reset_token: token, new_password: password }),
        });
        return { status: res.status, body: await res.json() };
      },
      { token: resetToken, password: "Scratch67New!" },
    );
    expect(reset.status).toBe(200);
    expect(reset.body.ok).toBe(true);

    // 4. THE PIN — the pre-reset cookie is DEAD: the browser context's
    //    own session (the one that just authorized "/") no longer
    //    passes the server's session gate. THE DEFECT: pre-fix the
    //    reload still renders the dashboard (the cookie outlives the
    //    reset for its full 7-day TTL).
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });

    // The honest-moment evidence (the F42 discipline): the screenshot
    // lands AT the verified assertion — the login card rendered by the
    // redirect that the DEAD pre-reset session took.
    await page.screenshot({
      path: "docs/screenshots/ref-audit-s77/clone-18-revocation-redirect.png",
    });

    // And at the API level: the CAPTURED pre-reset token no longer
    // authorizes a session-guarded route — /api/stats answers the 401
    // envelope (the same form the smoke suite's logout check uses).
    // (/api/auth/me deliberately answers 200 { user: null } when signed
    // out — its contract is the user probe, not the gate; the first
    // draft of this pin mistook that 200 for a surviving session.)
    const stats = await page.request.get("/api/stats", {
      headers: { cookie: `digma_session=${preResetToken}` },
    });
    expect(stats.status()).toBe(401);

    // 5. The NEW password signs in — the round-trip stays closed.
    await page.getByLabel("Email").fill(scratchEmail);
    await page.getByLabel("Password").fill("Scratch67New!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("heading", { name: /Good (morning|afternoon|evening)/ })).toBeVisible({
      timeout: 15_000,
    });
  });
});

test.describe("session 67 — the assistant's dedicated rate limit (S67-C / M-2)", () => {
  test("the 21st rapid assistant request answers the 429 envelope with Retry-After", async ({ page }) => {
    // THE DEFECT: pre-fix every request answers 200 — the route has no
    // limiter at all (an authenticated caller drives unbounded LLM
    // completions). The pin drives the route 21 times from this spec's
    // own XFF bucket (ai:198.51.100.67 — never the shared ai:unknown
    // bucket the other specs' nine sends live under: editor-panels ×4
    // (the askAssistant helper at :1047/:1080/:1106 + the direct send at
    // :1133), workspace ×1 (:126), session78-fixes ×1 (:38),
    // session79-fixes ×2 (:48/:114), session80-fixes ×1 (:152) — 11
    // headroom under the 20/5min ceiling; S87-D re-anchored the count
    // the sessions-78/79/80 deliveries had silently outgrown, and
    // tests/doc-lows-s87.test.ts pins it LIVE-DERIVED so it can never
    // rot again).
    await page.goto("/");
    const statuses = await page.evaluate(async () => {
      const seen: number[] = [];
      for (let i = 0; i < 21; i++) {
        const res = await fetch("/api/ai-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "add 1 blue square", targetIds: [] }),
        });
        seen.push(res.status);
      }
      return seen;
    });
    expect(statuses.slice(0, 20)).toEqual(Array(20).fill(200));
    // THE DEFECT PIN: the 21st must be the limiter's 429.
    expect(statuses[20]).toBe(429);

    // The 429 carries the family envelope + Retry-After.
    const limited = await page.evaluate(async () => {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "add 1 blue square", targetIds: [] }),
      });
      return {
        status: res.status,
        retryAfter: res.headers.get("retry-after"),
        body: await res.json(),
      };
    });
    expect(limited.status).toBe(429);
    expect(Number(limited.retryAfter)).toBeGreaterThan(0);
    expect(limited.body.error.code).toBe("RATE_LIMITED");
  });
});

test.describe("session 67 — the Dashboard's list-view empty state (S67-D / A-L-1)", () => {
  test("an empty filtered list renders the empty state with NO stray bordered container", async ({ page }) => {
    // THE DEFECT: pre-fix the bordered list container renders
    // unconditionally (zero children) above the separately-gated
    // empty state — a 2px rounded gray hairline above "No projects
    // match". The Recent view gates correctly; the Dashboard did not.
    await page.goto("/Dashboard");

    // Toggle to the list view, then search for a non-matching term.
    await page.getByRole("button", { name: "List view" }).click();
    await page.getByPlaceholder("Search projects...").fill("zzz-definitely-no-match-67");

    // The empty state renders…
    await expect(page.getByText(/No projects match/)).toBeVisible();

    // THE DEFECT PIN: the stray bordered container (the list wrapper's
    // class signature with ZERO children — the hairline above the
    // empty state) must NOT render. Pre-fix the count reads 1; the
    // other bordered containers (stats card, project cards) all carry
    // children and never match.
    const strayContainers = await page.evaluate(() =>
      [...document.querySelectorAll("div.overflow-hidden.rounded-lg.border")].filter(
        (el) => el.children.length === 0,
      ).length,
    );
    expect(strayContainers).toBe(0);

    // The honest-moment evidence (the F42 discipline): the empty state
    // AT the verified assertion — no hairline above the message.
    await page.screenshot({
      path: "docs/screenshots/ref-audit-s77/clone-19-dashboard-list-empty-state.png",
    });
  });
});
