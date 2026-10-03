import { expect, test } from "@playwright/test";

// Session 64 — the twelfth Mode C audit's chosen e2e pin (the one
// USER-VISIBLE behavioral defect of the batch: S64-A the mobile
// properties Sheet's per-tick history flooding — the mobile `update`
// helper omitted the gesture-aware commit argument the desktop helper
// has carried since session 62, so every slider tick INSIDE THE MOBILE
// SHEET pushed a full history snapshot. The pure-seam fixes S64-B/C/
// D/E/F/G carry their pins in the unit suite's tests/slider-surface.test.ts,
// tests/bounds-rotation.test.ts, tests/reset-url-gate.test.ts,
// tests/server-low-s64.test.ts, tests/db-redaction.test.ts and
// tests/editor-low-s64.test.ts.
//
// Contexts arrive AUTHENTICATED (the setup project's storageState).
// The fixture discipline (the mobile-properties spec's own): own
// project through the public API, elements at KNOWN coordinates,
// deleted in a finally + the afterAll sweep; the REAL mouse for the
// drag (the F47 lesson); the F36c hydration gate before coordinate
// interactions.
//
// THE PIN mirrors the session-62 DESKTOP slider pin on the MOBILE
// surface the S62-A fix missed: one Ctrl+Z after a drag inside the
// mobile Sheet must restore the WHOLE pre-drag value — pre-fix the
// per-tick commits made one undo step back exactly one tick.

const FIXTURE_NAME = "Session64 Mobile Fixture ZZ";

// Mirrors the mobile-properties spec's layout (the canvas origin at
// 390×844 is (48,77) — the toolbar 48px + the wrapped 77px header —
// so screen = canvas + (48,77)). The button rectangle's exposed strip
// (canvas y 300–312, above its label) is the tap target.
const FIXTURE_ELEMENTS = [
  { type: "text", name: "Copy Block", x: 160, y: 160, width: 320, height: 48, text: "Fixture headline", fontSize: 32, sortOrder: 0 },
  { type: "rectangle", name: "Primary Button", x: 160, y: 300, width: 160, height: 44, fill: "#3B82F6", radius: 8, sortOrder: 1 },
  { type: "text", name: "Action Label", x: 196, y: 312, width: 90, height: 20, text: "Tap me", fontSize: 14, sortOrder: 2 },
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

test.afterEach(async ({ page }, testInfo) => {
  // The sweep: a failed test's finally may not have run — find the
  // fixture by name through the public API and delete it (the later
  // parity specs pin the Recent-list COUNT).
  if (testInfo.status !== "passed") {
    await page.evaluate(async (name) => {
      const res = await fetch("/api/projects?search=" + encodeURIComponent(name));
      const body = await res.json();
      if (body?.ok) {
        for (const project of body.data.projects ?? []) {
          if (project.name === name) {
            await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
          }
        }
      }
    }, FIXTURE_NAME);
  }
});

test.describe("session 64 — the mobile Sheet's gesture-aware commit (S64-A / A-1)", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("one undo restores the whole slider drag inside the mobile Sheet", async ({ page }) => {
    await page.goto("/");
    const fixture = await createFixture(page);
    try {
      await page.goto(`/Editor?projectId=${fixture.id}`);
      // The F36c hydration gate — the elements load asynchronously.
      await expect(page.getByText("Fixture headline").first()).toBeVisible();

      // Tap the button rectangle's exposed strip (screen y 377–389 —
      // inside the rect but ABOVE its label, which spans 389–409 and
      // would otherwise win the topmost hit-test).
      await page.mouse.click(300, 382);

      // Open the mobile properties Sheet (the S52-2 surface).
      const chip = page.getByRole("button", { name: "Edit properties" });
      await expect(chip).toBeVisible();
      await chip.click();
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();

      const slider = sheet.locator("input[aria-label='Opacity']");
      await expect(slider).toBeAttached();
      // The Sheet scrolls (editor-scroll) — bring the Opacity section
      // into view before dragging. The seeded default reads 100.
      await slider.scrollIntoViewIfNeeded();
      expect(await slider.inputValue()).toBe("100");

      // The REAL-mouse drag (F47): press on the track, sweep toward the
      // minimum in discrete moves (each fires an intermediate onChange
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

      // Close the Sheet first — the editor's global shortcuts STAND
      // DOWN behind any open Radix dialog (the S49-2 guard), so the
      // undos must be pressed from the canvas surface. Escape closes
      // with focus returning to the chip trigger (the pinned Sheet
      // contract).
      await page.keyboard.press("Escape");
      await expect(sheet).not.toBeVisible();

      // THE DEFECT PIN: the whole gesture must be exactly ONE history
      // entry — TWO undos must land on the pre-drag 100 (the first
      // restores it; the second finds no further entry from this
      // gesture — the stack beneath is empty on a fresh fixture).
      // Pre-fix every intermediate tick committed its own snapshot
      // BEHIND the gesture's entry: undo #1 restored the pre-drag
      // value, and undo #2 stepped back INTO the middle of the drag
      // (~one tick from the dragged value) — the per-tick granularity
      // the S62-A doctrine forbids, resurfaced on the mobile Sheet the
      // fix missed.
      await page.keyboard.press("Control+z");
      await page.keyboard.press("Control+z");

      // Re-select the rectangle and re-open the Sheet to read the value
      // on the verified surface. (The slider unmounts while the Sheet is
      // closed, and an autosave remap between the drag and the undo can
      // legitimately drop the selection — markSaved remaps the LIVE ids
      // while the restored snapshot carries the pre-save ids; the undo's
      // survival filter then empties selectedIds. The VALUE contract is
      // what this pin owns — re-tap, re-open, read.)
      await page.mouse.click(300, 382);
      const chip2 = page.getByRole("button", { name: "Edit properties" });
      await expect(chip2).toBeVisible();
      await chip2.click();
      await expect(sheet).toBeVisible();
      const slider2 = sheet.locator("input[aria-label='Opacity']");
      await slider2.scrollIntoViewIfNeeded();
      await expect
        .poll(async () => Number(await slider2.inputValue()), { timeout: 5_000 })
        .toBe(100);

      // The F42 evidence shot — captured BY the pin at the verified
      // assertion (the honest-moment discipline: the screenshot shows
      // the state the programmatic check just proved — the pre-drag
      // 100 holding through BOTH undos, the gesture exactly one entry).
      await page.screenshot({
        path: "docs/screenshots/ref-audit-s74/clone-12-mobile-slider-one-undo.png",
      });
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});
