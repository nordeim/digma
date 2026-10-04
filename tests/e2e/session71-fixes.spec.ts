import { expect, test } from "@playwright/test";

// Session 71 — the TDD pins for the nineteenth audit's chosen work.
//
// THE PINS (all honestly RED against the pre-fix build):
// 1. S71-B / L-A3 — the exit() single-PUT contract: an edit followed by
//    the Back button persists exactly ONE full-replace PUT. Pre-fix: the
//    machine's flush PUT AND the unmount cleanup PUT both fire (the same
//    pending edit persists twice).
// 2. S71-A / L-A2 — the Dashboard LIST-row open touches lastOpenedAt:
//    the list-row button fires the silent fire-and-forget PATCH before
//    navigating (the grid card's and the Recent list card's contract).
//    Pre-fix: openEditor is a bare router.push — ZERO PATCHes.
// 3. S71-C / L-A4 — the resend-otp uniform 400: a VERIFIED account
//    answers the same VALIDATION 400 as an unknown email (the
//    200/409/400 account-state oracle closed). Pre-fix: 409 CONFLICT.
// 4. S71-C / L-A5 — the login 403 envelope fold: verificationCode rides
//    INSIDE error and the dead top-level email field is gone. Pre-fix:
//    both extras sit outside the envelope member.
//
// Auth budget: describes 3 and 4 declare their OWN X-Forwarded-For
// buckets (the auth.spec.ts convention — the shared 10/15-min window
// never sees their calls).
//
// Contexts arrive AUTHENTICATED (the setup project's storageState);
// describes 3/4 opt out (the logged-out surface convention).

// ---------------------------------------------------------------------------
// The fixture discipline (the session-65 spec's own): own project through
// the public API, elements at KNOWN coordinates, deleted in a finally.

const FIXTURE_NAME = "Session71 Fixture ZZ";

const FIXTURE_ELEMENTS = [
  { type: "text", name: "Copy Block", x: 160, y: 160, width: 320, height: 48, text: "Fixture headline", fontSize: 32, sortOrder: 0 },
  { type: "rectangle", name: "Primary Button", x: 160, y: 300, width: 160, height: 44, fill: "#3B82F6", radius: 8, sortOrder: 1 },
];

type Fixture = { id: string };

async function createFixture(page: import("@playwright/test").Page): Promise<Fixture> {
  const id = await page.evaluate(
    async ({ name, elements }) => {
      const headers = { "Content-Type": "application/json" };
      const res = await fetch("/api/projects", {
        method: "POST",
        headers,
        body: JSON.stringify({ name, template: "blank" }),
      });
      const body = await res.json();
      if (!body?.ok) throw new Error("fixture create failed");
      const pid = body.data.project.id as string;
      const put = await fetch(`/api/projects/${pid}/elements`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ elements }),
      });
      const putBody = await put.json();
      if (!putBody?.ok) throw new Error("fixture elements failed");
      return pid;
    },
    { name: FIXTURE_NAME, elements: FIXTURE_ELEMENTS },
  );
  return { id };
}

async function deleteFixture(page: import("@playwright/test").Page, id: string) {
  await page.evaluate(async (pid) => {
    await fetch(`/api/projects/${pid}`, { method: "DELETE" });
  }, id);
}

// ---------------------------------------------------------------------------

test.describe("session 71 — the exit() single-PUT contract (S71-B / L-A3)", () => {
  test("an edit followed by Back persists exactly ONE full-replace PUT", async ({ page }) => {
    await page.goto("/");
    const fixture = await createFixture(page);
    try {
      // Count the elements PUTs from the START (the fixture's own PUT
      // rides page.evaluate — a different context from the page's
      // request listener, so only the editor's own PUTs are counted).
      const elementPuts: string[] = [];
      page.on("request", (req) => {
        if (req.method() === "PUT" && req.url().includes("/elements")) {
          elementPuts.push(req.url());
        }
      });

      await page.goto(`/Editor?projectId=${fixture.id}`);
      await expect(page.getByRole("button", { name: "Layer Copy Block", exact: true })).toBeVisible({
        timeout: 15_000,
      });
      await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 15_000 });

      // Select through the layer row (the S70-A button-region form) and
      // commit ONE property edit — the X field's onChange flips
      // saveState to "unsaved" and arms the 800ms timer.
      await page.getByRole("button", { name: "Layer Copy Block", exact: true }).click();
      const xField = page.locator("input[aria-label='X']");
      await expect(xField).toBeAttached();
      await xField.click();
      await page.keyboard.press("Control+a");
      await page.keyboard.type("250", { delay: 25 });

      // Exit IMMEDIATELY (inside the debounce window — the discriminating
      // interleaving): exit() flushes through the machine, the soft
      // navigation unmounts the editor, and the cleanup decides whether
      // a SECOND PUT is needed.
      await page.getByRole("button", { name: "Back to dashboard" }).click();
      await expect(page).toHaveURL(/\/Dashboard/, { timeout: 15_000 });

      // Let the machine's PUT and any cleanup PUT settle before counting.
      await page.waitForTimeout(1_500);

      // THE DEFECT PIN: pre-fix the machine's flush PUT AND the unmount
      // cleanup PUT both fire for the same pending edit (the full-replace
      // transaction runs twice); post-fix the cleanup SKIPS — the
      // machine's in-flight fetch carries exactly the live state and
      // survives the soft navigation.
      expect(elementPuts.length).toBe(1);

      // The edit DID persist through the single PUT (the machine's
      // transport works — the skip never loses data).
      await page.goto(`/Editor?projectId=${fixture.id}`);
      await page.getByRole("button", { name: "Layer Copy Block", exact: true }).click();
      await expect(page.locator("input[aria-label='X']")).toHaveValue("250", {
        timeout: 10_000,
      });

      // The honest-moment evidence (the F42 discipline): the exit
      // contract at its verified state.
      await page.screenshot({
        path: "docs/screenshots/ref-audit-s81/clone-21-exit-single-put.png",
      });
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});

test.describe("session 71 — the Dashboard list-row lastOpened PATCH (S71-A / L-A2)", () => {
  test("the list-row open fires the silent lastOpened PATCH before navigating", async ({ page }) => {
    await page.goto("/Dashboard");
    await expect(page.getByRole("heading", { name: "Continue Working" })).toBeVisible({
      timeout: 15_000,
    });

    // Switch the All Projects section to the LIST view (the surface whose
    // rows are the bare router.push openers pre-fix).
    await page.getByRole("button", { name: "List view" }).click();

    const lastOpenedPatches: string[] = [];
    page.on("request", (req) => {
      if (
        req.method() === "PATCH" &&
        req.url().includes("/api/projects/") &&
        (req.postData() ?? "").includes("lastOpened")
      ) {
        lastOpenedPatches.push(req.url());
      }
    });

    // The LIST row (the anchored form — the grid card's stretched button
    // answers the "Open …" aria-label, never a bare-name anchor).
    // Marketing Hero Banner is the seeded most-recent project — the
    // touch keeps the Recent ordering stable (the backdated Portfolio
    // project stays 11 days stale).
    const row = page.getByRole("button", { name: /^Marketing Hero Banner/ });
    await expect(row).toBeVisible({ timeout: 15_000 });
    await row.click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/, { timeout: 15_000 });

    // THE DEFECT PIN: pre-fix the list-row open is a bare router.push —
    // ZERO lastOpened PATCHes fire ("Continue Working" and Recent
    // silently disagree with the card-family paths); post-fix exactly
    // ONE silent fire-and-forget PATCH precedes the navigation.
    expect(lastOpenedPatches.length).toBe(1);
  });
});

// Budget note: this describe declares its own X-Forwarded-For header, so
// its auth calls never touch the shared 10/15-min window (the auth.spec
// convention).
test.describe("session 71 — the resend-otp uniform 400 (S71-C / L-A4)", () => {
  test.use({ extraHTTPHeaders: { "X-Forwarded-For": "198.51.100.71" } });

  test("a VERIFIED account answers the same VALIDATION 400 as an unknown email (no 409 oracle)", async ({
    request,
  }) => {
    // The seeded demo account is verified — the branch that answered
    // 409 CONFLICT pre-fix.
    const res = await request.post("/api/auth/resend-otp", {
      data: { email: "demo@digma.app" },
    });

    // THE DEFECT PIN: pre-fix status 409 + error.code "CONFLICT" — a
    // remotely measurable account-state oracle that survives the OTP
    // production knob (the knob nulls the payload, not the shape).
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("VALIDATION");
    expect(body.error.message).toBe("Enter a valid email address");

    // The unknown-email twin answers byte-identically (the uniformity).
    const unknown = await request.post("/api/auth/resend-otp", {
      data: { email: "nobody-here@example.com" },
    });
    expect(unknown.status()).toBe(400);
    const unknownBody = await unknown.json();
    expect(unknownBody.error.code).toBe("VALIDATION");
    expect(unknownBody.error.message).toBe("Enter a valid email address");
  });
});

// Budget note: this describe declares its own X-Forwarded-For header and
// opts out of the shared storageState (the logged-out surface).
test.describe("session 71 — the login 403 envelope fold (S71-C / L-A5)", () => {
  test.use({
    storageState: { cookies: [], origins: [] },
    extraHTTPHeaders: { "X-Forwarded-For": "198.51.100.72" },
  });

  test("verificationCode rides inside error; the top-level extras are gone", async ({ page }) => {
    const email = `s71-fold-${Date.now()}@example.com`;
    const password = "FoldTest123!";

    // A fresh UNVERIFIED account (the 403's precondition).
    const register = await page.request.post("/api/auth/register", {
      data: { email, password, name: "Fold Test" },
    });
    expect(register.ok()).toBe(true);

    // The browser login (the 403 round-trip) — capture the response for
    // the shape assertions while the card reacts to it.
    const loginPromise = page.waitForResponse("**/api/auth/login");
    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();
    const login = await loginPromise;

    expect(login.status()).toBe(403);
    const body = await login.json();

    // THE DEFECT PIN: pre-fix the response carries { ok, error, email,
    // verificationCode } — two fields OUTSIDE the envelope member (and
    // email is read by nobody). Post-fix: verificationCode rides INSIDE
    // error; the top-level extras are gone.
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("VERIFY_EMAIL");
    expect(typeof body.error.verificationCode).toBe("string");
    expect(body.email).toBeUndefined();
    expect(body.verificationCode).toBeUndefined();

    // The client follows the fold (the single consumer reads
    // error.verificationCode): the verify card OPENS on the 403.
    await expect(
      page.getByRole("heading", { name: "Verify your email", exact: true }),
    ).toBeVisible({ timeout: 10_000 });

    // The honest-moment evidence (the F42 discipline).
    await page.screenshot({
      path: "docs/screenshots/ref-audit-s81/clone-22-login-403-fold.png",
    });
  });
});
