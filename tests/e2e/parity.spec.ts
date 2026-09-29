import { expect, test, type Locator } from "@playwright/test";

// Visual-parity pins from the session-8 live audit of the reference app
// (https://digma-371dfd0d.base44.app/). Every assertion here was measured in
// the reference's DOM first — computed styles, not screenshots — and pins the
// clone to the same values. Contexts arrive AUTHENTICATED (setup-project
// storageState) except the logged-out describe at the bottom.

test.describe("workspace parity pins (session 8)", () => {
  test("the app renders a sans font, not the UA serif default (the @theme var() trap)", async ({ page }) => {
    // Shipped bug (sessions 1-7): `--font-sans: var(--font-inter), …` computed
    // to guaranteed-invalid at :root (next/font scopes --font-inter to <body>),
    // so the whole tree inherited "Times New Roman" and Inter never loaded.
    await page.goto("/");
    const font = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(font).not.toMatch(/Times New Roman/i);
    expect(font).toMatch(/Inter|sans-serif/i);
  });

  test("the desktop nav highlights the CURRENT route — exact pathname match, no pill at / (session-12 scope fix)", async ({ page }) => {
    // Session 8 recorded "no active pill" from a PRE-HYDRATION read of the
    // reference (its SSR shell ships bare <a> tags; client hydration applies
    // the classes). Session 10 restored the pill — but over-scoped it to the
    // root "/". Session 12 re-measured the reference on FOUR routes with
    // long settles: the reference's active logic is an EXACT pathname match —
    // at "/" NO link is active (all three plain, no aria-current); at
    // /Dashboard, /Recent and /Teams the current route's link renders
    // bg-purple-50 text-purple-700. This pin asserts all three states so a
    // static-class bug AND an over-scoped active check can't pass.
    const readPainted = (link: Locator) =>
      link.evaluate((node) => {
        const ctx = document.createElement("canvas").getContext("2d")!;
        ctx.fillStyle = getComputedStyle(node).backgroundColor;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
      });

    // 1) At the root "/", the reference renders the dashboard view with a
    //    completely UN-highlighted nav — the Dashboard link's href is
    //    /Dashboard and "/" matches nothing.
    await page.goto("/");
    let links = page.getByRole("navigation", { name: "Primary" }).getByRole("link");
    await expect(links).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect(readPainted(links.nth(i))).resolves.toBe("000000");
      await expect(links.nth(i)).not.toHaveAttribute("aria-current");
    }

    // 2) On the canonical /Dashboard route, the Dashboard link carries the
    //    purple-50 pill + purple-700 text; the others stay transparent.
    await page.goto("/Dashboard");
    links = page.getByRole("navigation", { name: "Primary" }).getByRole("link");
    await expect(readPainted(links.nth(0))).resolves.toBe("faf5ff");
    const activeColor = await links.nth(0).evaluate((el) => getComputedStyle(el).color);
    expect(activeColor).toBe("rgb(126, 34, 206)"); // purple-700 #7e22ce
    await expect(readPainted(links.nth(1))).resolves.toBe("000000");
    await expect(readPainted(links.nth(2))).resolves.toBe("000000");
    // a11y is preserved on the canonical route (the reference itself ships
    // no aria-current — the clone's superset, tied to the same active flag).
    await expect(links.nth(0)).toHaveAttribute("aria-current", "page");

    // 3) Same contract on /Teams — the TEAMS link is the highlighted one.
    await page.goto("/Teams");
    links = page.getByRole("navigation", { name: "Primary" }).getByRole("link");
    await expect(readPainted(links.nth(2))).resolves.toBe("faf5ff");
    const teamsColor = await links.nth(2).evaluate((el) => getComputedStyle(el).color);
    expect(teamsColor).toBe("rgb(126, 34, 206)");
    await expect(readPainted(links.nth(0))).resolves.toBe("000000");
  });

  test("the active view toggle is near-black, not purple (reference --primary #171717)", async ({ page }) => {
    await page.goto("/");
    const grid = page.getByRole("button", { name: "Grid view" });
    await expect(grid).toHaveAttribute("aria-pressed", "true");
    const bg = await grid.evaluate((el) => {
      // Paint the computed color and read the PIXEL — always sRGB bytes,
      // regardless of the lab()/oklch() functions Tailwind v4 emits.
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    });
    expect(bg).toBe("171717"); // neutral-900 — the reference's primary
    // And on /Recent, same contract for its toggle.
    await page.goto("/Recent");
    const recentGrid = page.getByRole("button", { name: "Grid view" });
    const recentBg = await recentGrid.evaluate((el) => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    });
    expect(recentBg).toBe("171717");
  });

  test("the Teams page is flat: no gradient main, blue Create Team button", async ({ page }) => {
    await page.goto("/Teams");
    // The reference's Teams main has NO background wash (unlike /Recent).
    const mainBg = await page.evaluate(() => {
      const main = document.querySelector("main");
      return main ? getComputedStyle(main).backgroundImage : "no-main";
    });
    expect(mainBg).toBe("none");
    // The reference's Create Team is solid blue-600, not a purple gradient.
    const create = page.getByRole("button", { name: "Create Team", exact: true });
    const bg = await create.evaluate((el) => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    });
    expect(bg).toBe("2563eb"); // blue-600
    const color = await create.evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe("rgb(255, 255, 255)");
  });
});

test.describe("editor parity pins (session 8)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByText("Marketing Hero Banner").filter({ visible: true }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    // The RSC transition flips the URL before the editor streams in — wait
    // for the chrome (auto-retrying) before any raw evaluate below.
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
  });

  test("zoom controls use magnifier icons (zoom-in first, zoom-out second)", async ({ page }) => {
    const zoomIn = page.getByRole("button", { name: "Zoom in" });
    const zoomOut = page.getByRole("button", { name: "Zoom out" });
    await expect(zoomIn.locator("svg.lucide-zoom-in")).toHaveCount(1);
    await expect(zoomOut.locator("svg.lucide-zoom-out")).toHaveCount(1);
    // Reference order: the 100% pill, then zoom-in, then zoom-out.
    const order = await page.evaluate(() => {
      const pill = Array.from(document.querySelectorAll("div,span")).find(
        (d) => d.textContent.trim() === "100%" && d.children.length === 0,
      );
      const wrap = pill?.parentElement;
      if (!wrap) return [];
      return Array.from(wrap.querySelectorAll("button svg")).map((s) =>
        (s.getAttribute("class") || "").match(/lucide-[\w-]+/)?.[0] ?? "?",
      );
    });
    expect(order).toEqual(["lucide-zoom-in", "lucide-zoom-out"]);
  });

  test("the AI assistant panel follows the reference chrome", async ({ page }) => {
    // Wrapper height h-80 (320px) — the reference's chat column.
    const height = await page.evaluate(() => {
      const h3 = Array.from(document.querySelectorAll("h3")).find(
        (h) => h.textContent.trim() === "AI Assistant",
      );
      let panel: HTMLElement | null = h3 ?? null;
      while (panel && !panel.className.includes("flex-col")) panel = panel.parentElement;
      const wrapper = panel?.parentElement ?? null;
      return wrapper ? getComputedStyle(wrapper).height : "none";
    });
    expect(height).toBe("320px");

    // Header: the reference leads with a blue Bot icon (no gradient circle).
    const header = page.getByRole("heading", { name: "AI Assistant" }).locator("..");
    await expect(header.locator("svg.lucide-bot")).toHaveCount(1);
    await expect(header.locator("svg.lucide-wand-sparkles")).toHaveCount(1);

    // Assistant messages carry the bot avatar chip and the timestamp sits
    // BELOW the bubble (a sibling), not inside it.
    const structure = await page.evaluate(() => {
      const intro = Array.from(document.querySelectorAll("p")).find((p) =>
        p.textContent.includes("AI design assistant"),
      );
      const bubble = intro?.closest("div[class*=bg-]") as HTMLElement | null;
      const group = bubble?.parentElement as HTMLElement | null;
      const row = group?.closest("div.flex") as HTMLElement | null;
      return {
        rowHasAvatar: !!(row?.querySelector("div.rounded-full svg.lucide-bot")),
        bubbleClasses: bubble?.className ?? "",
        groupChildren: group ? Array.from(group.children).map((c) => c.tagName) : [],
        timestampInsideBubble: !!(bubble?.querySelector("p.mt-1")),
      };
    });
    expect(structure.rowHasAvatar).toBe(true);
    expect(structure.bubbleClasses).toContain("rounded-lg");
    expect(structure.bubbleClasses).not.toContain("rounded-xl");
    expect(structure.groupChildren).toEqual(["DIV", "DIV"]); // bubble + timestamp below
    expect(structure.timestampInsideBubble).toBe(false);

    // The input row: h-8 input + a SEPARATE blue send button (reference).
    // Session-14 reversal: session 8 recorded "no suggestions line" — a
    // misread (the reference's DOM, its session-10/12 screenshots, and
    // digma_SKILL §6 all carry the line). The reference wraps the form AND a
    // `mt-1 text-xs text-gray-500` suggestions div in a `p-3 border-t`
    // container; the Try: line is the reference's initial-state hint.
    const input = page.getByRole("textbox", { name: "Message the AI design assistant" });
    await expect(input).toBeVisible();
    const inputHeight = await input.evaluate((el) => getComputedStyle(el).height);
    expect(inputHeight).toBe("32px");
    const send = page.getByRole("button", { name: "Send message" });
    const sendBg = await send.evaluate((el) => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    });
    expect(sendBg).toBe("2563eb"); // blue-600

    // The suggestions line (session-14 reversal of session 8's "no line"
    // misread): visible in the initial state, below the form, inside the
    // border-t container, with the reference's classes and exact text.
    const suggestion = page.getByText(/^Try:/);
    await expect(suggestion).toBeVisible();
    const suggestionInfo = await suggestion.evaluate((el) => {
      const parent = el.parentElement as HTMLElement;
      const form = parent.querySelector("form");
      const container = parent.parentElement as HTMLElement | null;
      const siblingsAfter = form
        ? Array.from(form.parentElement?.children ?? []).filter(
            (c) => c !== form && (c as HTMLElement).tagName !== "FORM",
          ).map((c) => (c as HTMLElement).tagName)
        : [];
      return {
        tag: el.tagName,
        classes: el.className,
        text: el.textContent ?? "",
        parentTag: parent.tagName,
        parentHasBorderT: parent.className.includes("border-t"),
        formClasses: form?.className ?? "",
        formIsSibling: siblingsAfter.length > 0,
        containerClasses: container?.className ?? "",
      };
    });
    expect(suggestionInfo.tag).toBe("P");
    expect(suggestionInfo.classes).toContain("mt-1");
    expect(suggestionInfo.classes).toContain("text-xs");
    expect(suggestionInfo.classes).toContain("text-gray-500");
    expect(suggestionInfo.text).toBe(
      'Try: "Add 3 colored circles", "Make selected elements red", "Create a login form"',
    );
    // The form and the suggestions line are siblings inside the p-3
    // border-t wrapper (the reference's exact structure — the border lives
    // on the wrapper, not the form).
    expect(suggestionInfo.formIsSibling).toBe(true);
    expect(suggestionInfo.parentHasBorderT).toBe(true);
    expect(suggestionInfo.parentTag).toBe("DIV");
  });
});

test.describe("create-project dialog parity pins (session 15)", () => {
  // Measured this session at DOM level on both apps (the sixth audit went
  // INSIDE the dialogs, not just the page chrome):
  //   - the reference's template cards carry per-template lucide icons
  //     (file-text / smartphone / monitor / globe — verified by SVG path
  //     data), text-purple-600, NO selected/unselected opacity variation;
  //   - the selected color-swatch preset renders a lucide Check SVG
  //     (w-4 h-4 sm:w-5 sm:h-5, white) — not a text glyph;
  //   - the Create Project submit button is text-only (no icon).
  // The clone shipped Plus icons on all four cards, a "✓" text char, and a
  // Plus in the submit button — all fixed in session 15 and pinned here.
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Create New Design" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("the template cards carry the reference's per-template icons (no Plus)", async ({ page }) => {
    const dialog = page.getByRole("dialog");
    const expected: Array<[string, string]> = [
      ["Blank Canvas", "lucide-file-text"],
      ["Mobile App", "lucide-smartphone"],
      ["Desktop App", "lucide-monitor"],
      ["Website", "lucide-globe"],
    ];
    for (const [label, iconClass] of expected) {
      const card = dialog.locator("button", { hasText: label }).first();
      await expect(card).toBeVisible();
      // The icon sits in the title row next to the label.
      await expect(card.locator(`svg.${iconClass}`)).toHaveCount(1);
    }
    // The old bug: a Plus icon on every card.
    await expect(dialog.locator("svg.lucide-plus")).toHaveCount(0);
    // The reference renders every template icon identically in selected and
    // unselected states — no opacity dimming (measured: computed opacity 1).
    const opacities = await dialog
      .locator("button")
      .filter({ hasText: /canvas|mobile|desktop|website/i })
      .locator("svg")
      .evaluateAll((svgs) =>
        svgs.map((s) => Number(getComputedStyle(s as SVGElement).opacity)),
      );
    expect(opacities).toHaveLength(4);
    for (const opacity of opacities) expect(opacity).toBe(1);
  });

  test("the selected color swatch renders the reference's Check SVG", async ({ page }) => {
    const dark = page.getByRole("button", { name: "Background color Dark" });
    await expect(dark).toBeVisible();
    await expect(dark).toHaveAttribute("aria-pressed", "true");
    // The reference's selected marker: a lucide Check icon (w-4 h-4, white).
    await expect(dark.locator("svg.lucide-check")).toHaveCount(1);
    // The unselected presets render no marker at all (measured in the
    // reference DOM: empty buttons).
    const light = page.getByRole("button", { name: "Background color Light" });
    await expect(light.locator("svg")).toHaveCount(0);
    await expect(light).toHaveText("");
  });

  test("the Create Project submit button is text-only (reference parity)", async ({ page }) => {
    const create = page.getByRole("button", { name: /Create Project/ });
    await expect(create).toBeVisible();
    await expect(create.locator("svg")).toHaveCount(0);
    await expect(create).toHaveText(/Create Project/);
  });
});

test.describe("logged-out parity pins (session 8 + session 10)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("the login card carries no demo-account hint (reference parity)", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome to Digma" })).toBeVisible();
    await expect(page.getByText(/seed ships a demo account/i)).toHaveCount(0);
    await expect(page.getByText(/demo@digma\.app/i)).toHaveCount(0);
  });

  test("nothing renders below the login card (session-10 fix)", async ({ page }) => {
    // The clone used to ship a "Digma — design workspace" link below the
    // auth card; the reference renders NOTHING under the card (measured:
    // zero text nodes below the card rect).
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome to Digma" })).toBeVisible();
    await expect(page.getByText(/design workspace/i)).toHaveCount(0);
    const below = await page.evaluate(() => {
      const card = document.querySelector("main .max-w-md > div") as HTMLElement | null;
      if (!card) return "no-card";
      const cardRect = card.getBoundingClientRect();
      const stray = Array.from(document.querySelectorAll("main a, main p, main span, main div"))
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.top >= cardRect.bottom - 4 && r.height > 0 && el.children.length === 0;
        })
        .map((el) => (el.textContent || "").trim())
        .filter(Boolean);
      return JSON.stringify(stray);
    });
    expect(below).toBe("[]");
  });

  test("the login chip carries the brand mark on black, not a gradient (session-10 fix)", async ({ page }) => {
    // The reference's logo chip: a rounded-full container (shadow ring,
    // already parity) whose inner surface is the brand mark itself — a
    // colorful abstract mark on a black field. The clone used to back the
    // chip with a blue→purple gradient around the old substitute mark.
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome to Digma" })).toBeVisible();
    const chip = page.locator("span.rounded-full.ring-4").first();
    await expect(chip).toBeVisible();
    // The mark svg fills the chip.
    await expect(chip.locator("svg")).toHaveCount(1);
    // No gradient anywhere inside the chip (the old backing is gone).
    const gradients = await chip.evaluate((el) =>
      Array.from(el.querySelectorAll("*")).filter(
        (child) => getComputedStyle(child).backgroundImage !== "none",
      ).length,
    );
    expect(gradients).toBe(0);
    // The mark's own field is the reference's near-black (#0d1017).
    const field = await chip.locator("svg > rect").first().getAttribute("fill");
    expect(field?.toLowerCase()).toBe("#0d1017");
    // The mark carries all six measured brand shapes (5 pills + the circle).
    const fills = await chip.locator("svg > path, svg > circle").evaluateAll((els) =>
      els.map((el) => (el.getAttribute("fill") || "").toLowerCase()),
    );
    expect(fills.sort()).toEqual(
      ["#20bc72", "#325ddd", "#4cb6f2", "#b03af2", "#f33559", "#f4a24c"].sort(),
    );
  });
});
