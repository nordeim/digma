import { expect, test } from "@playwright/test";

// Session 62 — the tenth Mode C audit's chosen e2e pins (the two
// USER-VISIBLE behavioral defects of the batch: S62-A the slider
// per-tick undo flooding, S62-C the soft-leave data loss on browser
// Back. The pure-seam fixes S62-B/D/E/F/G carry their pins in the unit
// suite's tests/undo-selectors.test.ts, tests/verify-atomic.test.ts,
// tests/editor-low-s62.test.ts and tests/server-low-s62.test.ts).
//
// Contexts arrive AUTHENTICATED (the setup project's storageState).
// The fixture discipline: own project through the public API, deleted
// in a finally + the afterAll sweep; real-mouse interactions for the
// drag paths (the F47 lesson — synthetic PointerEvents do not survive
// React 19's delegated pipeline); hydration gates before raw
// keypresses (F36c).

const FIXTURE_NAME = "Session62 Fixture ZZ";

type Fixture = { id: string };

async function createFixture(page: import("@playwright/test").Page): Promise<Fixture> {
  const id = await page.evaluate(
    async ({ name }) => {
      const headers = { "Content-Type": "application/json" };
      const res = await fetch("/api/projects", {
        method: "POST",
        headers,
        body: JSON.stringify({ name, template: "blank" }),
      });
      const body = await res.json();
      if (!body?.ok) throw new Error("fixture create failed");
      return body.data.project.id as string;
    },
    { name: FIXTURE_NAME },
  );
  return { id };
}

async function deleteFixture(page: import("@playwright/test").Page, id: string) {
  await page.evaluate(async (pid) => {
    await fetch(`/api/projects/${pid}`, { method: "DELETE" });
  }, id);
}

test.describe("session 62 — the slider gesture seam (S62-A / A-M2)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("one undo restores the whole slider drag (one history entry per gesture)", async ({ page }) => {
    // The seeded Glow element — selected through the lock-immune layer
    // row (the gesture-undo order-independence convention).
    await page.goto("/");
    await page.getByRole("button", { name: "Open Marketing Hero Banner" }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    await expect(page.getByText("6 layers", { exact: true })).toBeVisible();
    await page.locator("button[aria-label='Layer Glow']").click();
    await expect(page.getByRole("heading", { name: "Properties" })).toBeVisible();

    const slider = page.locator("input[aria-label='Opacity']");
    await expect(slider).toBeVisible();
    // The seeded opacity defaults to 1 → the readout at 100.
    expect(await slider.inputValue()).toBe("100");

    // The REAL-mouse drag (F47): hover the track, press, sweep toward
    // the minimum in discrete moves (each fires an intermediate onChange
    // tick — the pre-fix flood), release.
    const box = (await slider.boundingBox())!;
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width * 0.95, y);
    await page.mouse.down();
    for (let i = 1; i <= 8; i++) {
      await page.mouse.move(box.x + box.width * (0.95 - (0.85 * i) / 8), y, { steps: 2 });
    }
    await page.mouse.up();

    // The drag landed somewhere near the low end (NOT 100).
    const dragged = Number(await slider.inputValue());
    expect(dragged).toBeLessThan(40);

    // THE DEFECT PIN: pre-fix every intermediate tick committed its own
    // history snapshot — one Ctrl+Z stepped back ONE TICK (the value
    // crept back to ~dragged+10, and a full 0→100 drag evicted ~60
    // earlier undo levels through the 60-deep cap). Post-fix the whole
    // gesture is ONE entry: a single Ctrl+Z restores the pre-drag 100.
    await page.keyboard.press("Control+z");
    await expect
      .poll(async () => Number(await slider.inputValue()), { timeout: 5_000 })
      .toBe(100);

    // The F42 evidence shot — captured BY the pin at the verified
    // assertion (the honest-moment discipline: the screenshot shows the
    // state the programmatic check just proved — the pre-drag 100
    // restored by the SINGLE undo).
    await page.screenshot({
      path: "docs/screenshots/ref-audit-s72/clone-09-slider-one-undo.png",
    });
  });
});

test.describe("session 62 — the soft-leave flush on browser Back (S62-C / A-M1)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("an edit inside the debounce window survives an in-app (soft) browser Back", async ({ page }) => {
    // The relative-fetch fixture needs an origin first.
    await page.goto("/");
    const fixture = await createFixture(page);
    try {
      // Re-goto so the dashboard's already-fetched list includes the
      // fixture (the F45 order discipline: create -> re-navigate ->
      // interact). The editor entry below is a pushState on THIS
      // document — the goBack stays a same-document traversal.
      await page.goto("/");
      // Enter the editor through CLIENT-SIDE navigation (the card's
      // router.push) — the App Router's same-document traversal. A
      // page.goto would make the subsequent goBack a CROSS-document
      // traversal (pagehide territory — the S61-I path, not this pin).
      // Session 70 (S70-A): the stretched button IS the click target.
      const card = page.getByRole("button", { name: `Open ${FIXTURE_NAME}` }).first();
      await expect(card).toBeVisible();
      await card.click();
      await expect(page).toHaveURL(new RegExp(`/Editor\\?projectId=${fixture.id}`));
      await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();

      // Draw a rectangle inside the debounce window (the 800ms timer is
      // armed but far from firing). The F36c hydration gate: the
      // aria-pressed check proves the keypress landed (a press in the
      // SSR window is lost and the assertion fails loudly).
      await page.keyboard.press("r");
      await expect(page.getByRole("button", { name: "Rectangle tool" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      await page.mouse.move(400, 300);
      await page.mouse.down();
      await page.mouse.move(520, 380, { steps: 5 });
      await page.mouse.up();
      // The layer row proves the draw committed client-side (the count
      // widget prints the singular "1 layer" at 1 — the row locator is
      // unambiguous).
      await expect(page.locator("button[aria-label='Layer Rectangle 1']")).toBeVisible();

      // IMMEDIATELY browser Back — a same-document popstate: pagehide
      // NEVER fires, the effect's cleanup clears the timer, and pre-fix
      // nothing flushed (the edit died; S61-I's Back claim covered only
      // the cross-document form). Post-fix the cleanup's fire-and-forget
      // PUT survives the unmount (the document persists through soft
      // navigation).
      await page.goBack();
      await expect(page).toHaveURL(/localhost:\d+\/$/);

      // THE DEFECT PIN: the drawn element persisted. Pre-fix the count
      // stays 0 forever (the poll times out RED at exactly the defect);
      // post-fix the cleanup PUT lands within the poll window.
      await expect
        .poll(
          async () => {
            const res = await page.request.get(`/api/projects/${fixture.id}`);
            const body = await res.json();
            return body?.data?.project?.elements?.length ?? 0;
          },
          { timeout: 10_000 },
        )
        .toBe(1);

      // The F42 evidence shot — the pin returns to the editor and
      // captures the drawn rectangle that survived the soft Back (the
      // programmatic API check above just proved the persistence; the
      // shot shows the element on the board).
      await page.goto(`/Editor?projectId=${fixture.id}`);
      await expect(page.locator("button[aria-label='Layer Rectangle 1']")).toBeVisible();
      await page.screenshot({
        path: "docs/screenshots/ref-audit-s72/clone-10-soft-leave-persisted.png",
      });
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});

// The orphan sweep: a crashed test can leak its fixture past the
// finally (the parity specs later in the run pin the Recent-list count
// and the name-sort discriminator — a leaked project breaks them).
test.afterAll(async ({ request }) => {
  const res = await request.get("/api/projects");
  const body = await res.json().catch(() => null);
  if (!body?.ok) return;
  for (const project of body.data.projects as Array<{ id: string; name: string }>) {
    if (project.name === FIXTURE_NAME) {
      await request.delete(`/api/projects/${project.id}`);
    }
  }
});
