import { expect, test } from "@playwright/test";

// Session 65 — the thirteenth Mode C audit's chosen e2e pins (the
// USER-VISIBLE behavioral defects of the batch: S65-A the thumbnail
// parent-fit — the fixed 320x200 painted space never scaled to its
// parent, so the files-list's 40x40 slot showed a corner sliver and
// the grid's ratio-locked slot cropped up to ~28% of the fitted
// content at laptop widths; S65-B the sliderGesture unmount leak — a
// slider drag alive at the moment the mobile Sheet closes never
// received its terminal pointer event, so the armed snapshot leaked
// and the autosave's saved-marking deferred forever (the badge never
// converging, ~1 PUT/s); S65-C the number-input per-keystroke history
// — every DIGIT of a typed value pushed a full snapshot, so one undo
// stepped back into the middle of the typing burst). The pure-seam
// fixes S65-D/S65-E carry their pins in the unit suite's
// tests/low-batch-s65.test.ts and tests/call-seam.test.ts.
//
// Contexts arrive AUTHENTICATED (the setup project's storageState).
// The fixture discipline (the session-64 spec's own): own project
// through the public API, elements at KNOWN coordinates, deleted in a
// finally + the afterAll sweep; the REAL mouse for the drags (the
// F47 lesson); the F36c hydration gate before coordinate
// interactions.

const FIXTURE_NAME = "Session65 Fixture ZZ";

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

test.describe("session 65 — the thumbnail parent-fit (S65-A / A-1)", () => {
  test("every painted element sits inside its rendered thumbnail box in the files list", async ({ page }) => {
    await page.goto("/Recent");
    const fixture = await createFixture(page);
    try {
      await page.goto("/Recent");
      // Switch to the list view (the 40x40 thumbnail slots — the
      // tightest parent the mini-canvas renders into).
      await page.getByRole("button", { name: "List view" }).click();
      await expect(page.getByText(FIXTURE_NAME).first()).toBeVisible();

      // THE DEFECT PIN: pre-fix the thumbnail painted its fixed
      // 320x200 space anchored at the parent's top-left with no
      // scale-to-parent transform — in the 40x40 slot every element
      // div's rect overflowed the root (the seeded content sat at
      // x 160..480 in a 40px box: a corner sliver at best). Post-fix
      // the wrapper carries the measured min-fit scale + centering
      // translate: the WRAPPER and every PAINTED ELEMENT div's rect
      // is contained within the root's rect. (The content-fit's own
      // transform carrier — the inner "relative" div — is skipped:
      // its box maps through the content transform, so its RECT is a
      // positioning artifact; its paint is its children, which the
      // element checks cover.)
      const overflows = await page.evaluate(() => {
        const roots = [...document.querySelectorAll("div.overflow-hidden")].filter((el) => {
          const parent = el.parentElement;
          return parent instanceof HTMLElement && parent.className.includes("h-10");
        });
        const bad: string[] = [];
        for (const root of roots) {
          const rr = root.getBoundingClientRect();
          const eps = 1;
          const check = (node: Element, what: string) => {
            const cr = node.getBoundingClientRect();
            if (cr.width === 0 && cr.height === 0) return;
            if (
              cr.left < rr.left - eps ||
              cr.right > rr.right + eps ||
              cr.top < rr.top - eps ||
              cr.bottom > rr.bottom + eps
            ) {
              bad.push(
                `${what}: root ${Math.round(rr.width)}x${Math.round(rr.height)} child ${Math.round(cr.left - rr.left)},${Math.round(cr.top - rr.top)} ${Math.round(cr.width)}x${Math.round(cr.height)}`,
              );
            }
          };
          const wrapper = root.firstElementChild;
          if (wrapper) check(wrapper, "wrapper");
          for (const child of root.querySelectorAll("div")) {
            if (child instanceof HTMLElement && child.style.left !== "") {
              check(child, "element");
            }
          }
        }
        return { roots: roots.length, bad };
      });

      // The fixture card + the seeded projects' cards all render
      // thumbnails in the list view.
      expect(overflows.roots).toBeGreaterThan(0);
      expect(overflows.bad).toEqual([]);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});

test.describe("session 65 — the mid-drag Sheet close (S65-B / B-1)", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("a slider drag alive at Sheet close converges the badge to Saved", async ({ page }) => {
    await page.goto("/");
    const fixture = await createFixture(page);
    try {
      await page.goto(`/Editor?projectId=${fixture.id}`);
      // The F36c hydration gate — the elements load asynchronously.
      await expect(page.getByText("Fixture headline").first()).toBeVisible();

      // Tap the button rectangle's exposed strip (canvas y 300-344;
      // screen y = canvas + 105 — the wrapped mobile header. Session 78
      // (S78-F) geometry re-anchor: the header grew 73 -> 101px (the
      // 44px touch floor on Back/Undo/Redo/Share/Present), the canvas
      // offset 77 -> 105 — 382 -> 410).
      await page.mouse.click(300, 410);

      const chip = page.getByRole("button", { name: "Edit properties" });
      await expect(chip).toBeVisible();
      await chip.click();
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();

      const slider = sheet.locator("input[aria-label='Opacity']");
      await expect(slider).toBeAttached();
      await slider.scrollIntoViewIfNeeded();
      expect(await slider.inputValue()).toBe("100");

      // THE DEFECT REPRODUCTION: a REAL-mouse drag with intermediate
      // ticks, CLOSED MID-DRAG — the pointer stays DOWN while the
      // Sheet unmounts, so the slider never receives its terminal
      // pointerup/cancel/lostcapture.
      const box = (await slider.boundingBox())!;
      const y = box.y + box.height / 2;
      await page.mouse.move(box.x + box.width * 0.95, y);
      await page.mouse.down();
      for (let i = 1; i <= 4; i++) {
        await page.mouse.move(box.x + box.width * (0.95 - (0.4 * i) / 4), y, { steps: 2 });
      }
      await page.keyboard.press("Escape");
      await expect(sheet).not.toBeVisible();
      // Release the still-held pointer on the detached surface.
      await page.mouse.up();

      // THE DEFECT PIN: the armed snapshot must not outlive the
      // surface that owned it. Pre-fix the leaked gesture kept the
      // autosave's saved-marking deferred forever — the badge cycling
      // Saving…/Unsaved with ~1 PUT/s and NEVER reading Saved.
      // Post-fix the unmount reset ends the gesture, the pending
      // flush PUTs once, and the badge converges.
      await expect
        .poll(async () => page.getByText("Saved", { exact: true }).count(), { timeout: 10_000 })
        .toBeGreaterThan(0);

      // The F42 evidence shot — captured BY the pin at the verified
      // assertion (the honest-moment discipline: the screenshot shows
      // the converged badge the programmatic check just proved).
      await page.screenshot({
        path: "docs/screenshots/ref-audit-s75/clone-13-mid-drag-close-convergence.png",
      });
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});

test.describe("session 65 — the number-field burst coalescing (S65-C / B-2)", () => {
  test("one undo restores the whole typed value, not one digit", async ({ page }) => {
    await page.goto("/");
    const fixture = await createFixture(page);
    try {
      await page.goto(`/Editor?projectId=${fixture.id}`);
      await expect(page.getByText("Fixture headline").first()).toBeVisible();

      // Select the rectangle through a MEASURED canvas-relative click
      // (the desktop chrome heights differ from the mobile wrap — the
      // canvas element's own rect is the ground truth). The rectangle
      // spans canvas (160..320, 300..344); the fixture carries no
      // overlapping label, the whole strip is exposed.
      const canvasBox = await page.getByRole("application").boundingBox();
      expect(canvasBox).not.toBeNull();
      await page.mouse.click(canvasBox!.x + 252, canvasBox!.y + 305);
      const panel = page.getByRole("heading", { name: "Properties" });
      await expect(panel).toBeVisible();

      const xField = page.locator("input[aria-label='X']");
      await expect(xField).toBeAttached();
      await xField.scrollIntoViewIfNeeded();
      // The fixture's rectangle x (the KNOWN pre-typing value).
      expect(await xField.inputValue()).toBe("160");

      // Type a three-digit replacement PER DIGIT (select-all then the
      // sequential key presses — each keystroke a discrete onChange
      // commit; a fill() would collapse the burst into one event and
      // hide the defect).
      await xField.click();
      await page.keyboard.press("Control+a");
      await page.keyboard.type("250", { delay: 40 });

      // Blur through the DOM (a plain canvas click would deselect and
      // unmount the panel; the field's own blur finishes the gesture).
      await page.evaluate(() => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      });

      // THE DEFECT PIN: the whole burst is ONE history entry — one
      // Ctrl+Z restores the pre-typing 160. Pre-fix every digit had
      // pushed its own snapshot: the first undo landed on 25 (one
      // digit into the burst) — the per-digit granularity the
      // one-entry-per-gesture doctrine forbids.
      await page.keyboard.press("Control+z");
      await expect
        .poll(async () => xField.inputValue(), { timeout: 5_000 })
        .toBe("160");
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});
