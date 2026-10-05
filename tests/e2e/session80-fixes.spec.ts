import { expect, test } from "@playwright/test";

// Session 80 (the twenty-eighth audit's chosen e2e discriminators).
//
// S80-A / A-M1 (the headline): the swap-boundary flush did not WAIT.
// An edit landing while the 800ms timer's flush was IN FLIGHT was
// silently lost on a fast same-instance soft swap: the boundary's
// fire-and-forget flushNow() early-returned on `flushing` (it set
// `pending` and captured NOTHING); B's GET resolved before the
// outgoing PUT's response; loadProject(B) stamped "saved"; the
// outgoing response was dropped by the machine's swap guard BEFORE
// the elements-reference guard could setUnsaved; the pending re-run
// early-returned on the loaded "saved". This spec reproduces the
// race LIVE with the route-delayed PUT (the autosave-race spec's own
// pattern — every elements PUT held 700ms client-side) so the
// in-flight window is deterministic, and pins the mid-flight edit's
// persistence through the swap.
//
// S80-B / A-L1: the transcript-reset subscription keyed on projectId
// alone — an Untitled->Untitled LOAD (a soft swap to an UNKNOWN
// projectId; both sides fall to the Untitled fallback's
// loadProject(UNTITLED_PROJECT)) is projectId-shaped like a no-op
// ("" === "") but the epoch moves — a lineage break. The stale
// conversation survived the load. Post-fix the reset fires on the
// epoch move.
//
// Contexts arrive AUTHENTICATED.

const PROJECT_A = "Marketing Hero Banner";
const PROJECT_B = "Portfolio Website Redesign";

test.describe("session 80 — the in-flight swap-boundary race (S80-A / A-M1)", () => {
  test("an edit landing while a flush is IN FLIGHT persists through the soft swap (the boundary drain)", async ({ page }) => {
    // Delay every elements PUT by 700ms — the in-flight window is
    // deterministic (the response lands well after the mid-flight
    // edit and the swap).
    await page.route("**/api/projects/*/elements", async (route) => {
      await page.waitForTimeout(700);
      await route.continue();
    });

    // Open project A's editor.
    await page.goto("/");
    await page.getByRole("button", { name: `Open ${PROJECT_A}` }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    await expect(page.getByRole("heading", { name: PROJECT_A })).toBeVisible();

    // The BEFORE state (order-independent — the shared e2e database's
    // Accent Bar may carry X mutations from earlier specs; the
    // discriminator is the spec's OWN relative values).
    const ids = await page.evaluate(async () => {
      const res = await fetch("/api/projects");
      const body = await res.json();
      const a = body.data.projects.find((p: { name: string }) => p.name === "Marketing Hero Banner");
      const b = body.data.projects.find((p: { name: string }) => p.name === "Portfolio Website Redesign");
      return { a: a.id as string, b: b.id as string };
    });
    const beforeX = await page.evaluate(async (aId) => {
      const res = await fetch(`/api/projects/${aId}`);
      const body = await res.json();
      const bar = body.data.project.elements.find((e: { name: string }) => e.name === "Accent Bar");
      return bar.x as number;
    }, ids.a);
    const a1X = beforeX + 80;
    const a2X = beforeX + 160;

    // Select the Accent Bar through its LAYER ROW (the established
    // form; no canvas coordinates).
    await page.locator("button[aria-label='Layer Accent Bar']").click();
    await expect(page.getByText("1 selected", { exact: true })).toBeVisible();

    // Edit A1: the X input commits live; the 800ms debounce arms.
    const x = page.getByRole("spinbutton", { name: "X" });
    await x.fill(String(a1X));
    await expect
      .poll(() => page.locator("[data-element-id][aria-label='Accent Bar']").evaluate((n) => n.style.transform), {
        timeout: 5_000,
      })
      .toContain(`translate(${a1X}px`);

    // Wait PAST the debounce so flush A1 is IN FLIGHT (its body
    // carries a1X; the response is 700ms away).
    await page.waitForTimeout(1_000);

    // Edit A2 lands mid-flight (the documented edit-during-flight
    // case — the machine's elements-reference guard keeps it unsaved
    // for the pending re-run).
    await x.fill(String(a2X));
    await expect
      .poll(() => page.locator("[data-element-id][aria-label='Accent Bar']").evaluate((n) => n.style.transform), {
        timeout: 5_000,
      })
      .toContain(`translate(${a2X}px`);

    // THE PRECONDITION ASSERT (session 81, S81-D / A81-L3): pin the
    // mid-flight state the discriminator depends on — the machine's
    // setSaving runs in the flush's synchronous prefix, so the badge
    // reads "Saving…" exactly while A1's PUT is in flight (its
    // response is 700ms out). Without this assert, a slow fill/poll
    // on a loaded machine could let the machine go idle before the
    // pushState — the boundary flushNow() would then capture A2
    // directly and the PRE-FIX build would also persist it (the
    // discriminator silently losing its RED-ness).
    await expect(page.getByText("Saving…", { exact: true })).toBeVisible();

    // THE SOFT SWAP — the true same-instance form (the Next-patched
    // pushState). The boundary flushNow() finds the machine mid-flight
    // (A1's PUT in flight) — pre-fix it captured NOTHING; B's GET
    // raced the A1 response and loadProject stamped "saved" before
    // the pending A2 re-run could fire.
    await page.evaluate((url) => {
      window.history.pushState({}, "", url);
    }, `/Editor?projectId=${ids.b}`);

    // Project B loads through the same instance (post-fix: AFTER the
    // drain — the machine's in-flight A1 PUT answered AND the pending
    // A2 re-run answered).
    await expect(page.getByRole("heading", { name: PROJECT_B })).toBeVisible({ timeout: 15_000 });

    // THE DISCRIMINATOR: project A's Accent Bar must read a2X (the
    // mid-flight edit persisted). Pre-fix: A reads a1X (A2 lost —
    // from the store, from history, never PUT). Poll the API — the
    // boundary drain is awaited but the polling keeps the assertion
    // robust against the delayed transport.
    const finalX = await page.evaluate(async ({ aId, want }) => {
      for (let i = 0; i < 60; i++) {
        const res = await fetch(`/api/projects/${aId}`);
        const body = await res.json();
        const bar = body?.data?.project?.elements?.find((e: { name: string }) => e.name === "Accent Bar");
        if (bar && bar.x === want) return bar.x as number;
        await new Promise((r) => setTimeout(r, 250));
      }
      const res = await fetch(`/api/projects/${aId}`);
      const body = await res.json();
      const bar = body.data.project.elements.find((e: { name: string }) => e.name === "Accent Bar");
      return bar.x as number;
    }, { aId: ids.a, want: a2X });
    expect(finalX, "the mid-flight edit must persist through the swap (the boundary drain)").toBe(a2X);
  });
});

test.describe("session 80 — the Untitled-to-Untitled load resets the transcript (S80-B / A-L1)", () => {
  test("a soft swap to an UNKNOWN projectId resets the transcript to the intro bubble", async ({ page }) => {
    // Open the UNTITLED editor (the bare /Editor route — ADR-009).
    await page.goto("/Editor");
    await expect(page.getByRole("heading", { name: "Untitled", exact: true })).toBeVisible();

    // Send an AI command the deterministic parser answers with real
    // operations — the transcript gains the exchange.
    const input = page.getByLabel("Message the AI design assistant");
    await input.fill("add 3 circles");
    await input.press("Enter");
    await expect(page.getByText(/action\(s\) performed/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('[role="log"]').getByText(/add 3 circles/i)).toBeVisible();

    // THE SOFT SWAP to an UNKNOWN projectId — both sides are Untitled
    // (the unknown id's GET fails; the load effect falls through to
    // the Untitled fallback's loadProject(UNTITLED_PROJECT): a
    // FRESH EMPTY BOARD, the epoch moved, projectId stays "").
    await page.evaluate(() => {
      window.history.pushState({}, "", "/Editor?projectId=nonexistent-s80-probe");
    });

    // The fallback board loads (the same instance; the fresh Untitled
    // canvas).
    await expect(page.getByRole("heading", { name: "Untitled", exact: true })).toBeVisible({
      timeout: 10_000,
    });
    // The fresh board is EMPTY (the lineage break happened — the
    // canvas was wiped).
    await expect(page.getByText("0 layers", { exact: true })).toBeVisible({ timeout: 5_000 });

    // Post-fix: the transcript RESETS to the intro bubble (the
    // epoch-aware reset — the ""-boundary lineage break). Pre-fix:
    // the exchange (and its belt-defused dead Revert) survived the
    // load — the stale-transcript residue.
    const intro = page.locator('[role="log"]').getByText(/Hi! I'm your AI design assistant/);
    await expect(intro).toBeVisible();
    await expect(page.locator('[role="log"]').getByText(/add 3 circles/i)).toHaveCount(0);
    await expect(page.locator('[role="log"]').getByText(/action\(s\) performed/i)).toHaveCount(0);
  });
});
