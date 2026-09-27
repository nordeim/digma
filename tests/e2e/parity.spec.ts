import { expect, test } from "@playwright/test";

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

  test("the desktop nav has NO active-state pill (reference parity)", async ({ page }) => {
    await page.goto("/");
    const links = page.getByRole("navigation", { name: "Primary" }).getByRole("link");
    await expect(links).toHaveCount(3);
    for (const link of await links.all()) {
      // The reference styles every link text-gray-600 with a transparent
      // background — no per-route highlight.
      const bg = await link.evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(bg).toBe("rgba(0, 0, 0, 0)");
    }
    // a11y is preserved: the current route still carries aria-current.
    await expect(links.first()).toHaveAttribute("aria-current", "page");
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

    // The input row: h-8 input + a SEPARATE blue send button (reference), no
    // "Try:" suggestions line.
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
    await expect(page.getByText(/^Try:/)).toHaveCount(0);
  });
});

test.describe("logged-out parity pins (session 8)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("the login card carries no demo-account hint (reference parity)", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome to Digma" })).toBeVisible();
    await expect(page.getByText(/seed ships a demo account/i)).toHaveCount(0);
    await expect(page.getByText(/demo@digma\.app/i)).toHaveCount(0);
  });
});
