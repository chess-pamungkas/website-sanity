const { test, expect } = require("./fixtures");
const {
  waitForGatsbyHydration,
  openPlatformWebTraderTab,
  webTraderCardLocator,
} = require("./helpers/webtrader");

test.describe("Localized WebTrader links", () => {
  test("MT4 card on /jp/mt4/ navigates to /jp/mt4-webtrader/", async ({
    page,
  }) => {
    await page.goto("/jp/mt4/", { waitUntil: "load" });
    await waitForGatsbyHydration(page);

    await openPlatformWebTraderTab(page, "mt4-webtrader");

    const card = webTraderCardLocator(page, "/jp", "mt4-webtrader");
    await expect(card).toBeVisible({ timeout: 15_000 });
    await expect(card).toHaveAttribute("href", /\/jp\/mt4-webtrader\/?/);

    await card.click();
    await expect(page).toHaveURL(/\/jp\/mt4-webtrader\/?/);
  });

  test("MT5 card on /id/mt5/ navigates to /id/mt5-webtrader/", async ({
    page,
  }) => {
    await page.goto("/id/mt5/", { waitUntil: "load" });
    await waitForGatsbyHydration(page);

    await openPlatformWebTraderTab(page, "mt5-webtrader");

    const card = webTraderCardLocator(page, "/id", "mt5-webtrader");
    await expect(card).toBeVisible({ timeout: 15_000 });
    await expect(card).toHaveAttribute("href", /\/id\/mt5-webtrader\/?/);

    await card.click();
    await expect(page).toHaveURL(/\/id\/mt5-webtrader\/?/);
  });

  test("MT4 card on default /mt4/ navigates to /mt4-webtrader/ without locale prefix", async ({
    page,
  }) => {
    await page.goto("/mt4/", { waitUntil: "load" });
    await waitForGatsbyHydration(page);

    await openPlatformWebTraderTab(page, "mt4-webtrader");

    const card = webTraderCardLocator(page, "", "mt4-webtrader");
    await expect(card).toBeVisible({ timeout: 15_000 });

    const href = await card.getAttribute("href");
    expect(href).toMatch(/^\/?(?:en\/)?mt4-webtrader\/?$/);

    await card.click();
    await expect(page).toHaveURL(/\/(?:en\/)?mt4-webtrader\/?$/);
    expect(page.url()).not.toMatch(/\/(jp|id)\/mt4-webtrader/);
  });
});
