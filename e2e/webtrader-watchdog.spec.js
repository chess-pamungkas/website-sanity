const { test, expect } = require("./fixtures");
const {
  waitForGatsbyHydration,
  waitForMt4TerminalReady,
  waitForMt5Iframe,
  expectLoaderCompletes,
  expectWatchdogError,
  stubMt4Widget,
  stubMt5Terminal,
  runMt4WidgetStub,
} = require("./helpers/webtrader");

test.describe("MT4 WebTrader watchdog", () => {
  test("clears loader when widget script loads", async ({ page }) => {
    await page.clock.install();
    await stubMt4Widget(page);

    await page.goto("/mt4-webtrader/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#webterminal", { timeout: 45_000 });
    await runMt4WidgetStub(page);
    await waitForGatsbyHydration(page);
    await page.waitForSelector(".mt4-webtrader", { timeout: 45_000 });

    await expect(page.locator("#webterminal iframe")).toBeVisible({
      timeout: 15_000,
    });
    await expectLoaderCompletes(page);
  });

  test("shows error UI when widget script is blocked", async ({ page }) => {
    await page.clock.install();
    await page.route("**/metatraderweb.app/**", (route) => route.abort());

    await page.goto("/mt4-webtrader/", { waitUntil: "load" });
    await waitForGatsbyHydration(page);
    await page.waitForSelector(".mt4-webtrader", { timeout: 45_000 });

    await expectWatchdogError(page, ".mt4-webtrader", 28_000);
  });
});

test.describe("MT5 WebTrader watchdog", () => {
  test("clears loader when terminal iframe loads", async ({ page }) => {
    await stubMt5Terminal(page);

    await page.goto("/mt5-webtrader/", { waitUntil: "load" });
    await waitForGatsbyHydration(page);
    await page.waitForSelector(".mt5-webtrader", { timeout: 45_000 });

    await waitForMt5Iframe(page);
    await expectLoaderCompletes(page);

    await expect(page.locator(".mt5-webtrader.webtrader-error")).toBeHidden();
    await expect(page.locator(".mt5-webtrader iframe")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("shows error UI when terminal iframe is blocked", async ({ page }) => {
    await page.clock.install();
    await page.route("**/webtrader.oqtima.com/**", (route) => route.abort());

    await page.goto("/mt5-webtrader/", { waitUntil: "load" });
    await waitForGatsbyHydration(page);
    await page.waitForSelector(".mt5-webtrader", { timeout: 45_000 });

    await expectWatchdogError(page, ".mt5-webtrader");
  });
});
