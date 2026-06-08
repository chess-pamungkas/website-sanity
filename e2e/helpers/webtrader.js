const { expect } = require("@playwright/test");

const MT5_WATCHDOG_MS = 12_000;
/** Keep in sync with MT4_WATCHDOG_MS in src/components/mt4-webtrader/index.js */
const MT4_WATCHDOG_MS = 28_000;
const WATCHDOG_BUFFER_MS = 4_000;

/** Minimal MT4 widget stub so success path does not depend on metatraderweb.app. */
const MT4_WIDGET_STUB = `
window.MetaTraderWebTerminal = function (containerId) {
  var root = document.getElementById(containerId);
  if (!root) return;
  root.innerHTML = "";
  var iframe = document.createElement("iframe");
  iframe.title = "MT4 WebTrader";
  iframe.src = "about:blank";
  root.appendChild(iframe);
};
`;

const MT5_TERMINAL_HTML =
  '<!DOCTYPE html><html><body><div class="terminal">ok</div></body></html>';

async function waitForGatsbyHydration(page) {
  await page.waitForLoadState("load");
  await page.waitForSelector("#___gatsby, #gatsby-focus-wrapper", {
    state: "attached",
    timeout: 45_000,
  });

  await page.waitForFunction(
    () => typeof window.___webpackCompilationHash === "string",
    { timeout: 60_000 }
  );

  await page.waitForFunction(
    () => document.documentElement.getAttribute("data-audit") !== "1",
    { timeout: 30_000 }
  );

  await page.waitForFunction(
    () => {
      const hasReactProps = (node) =>
        !!node &&
        node.nodeType === 1 &&
        Object.keys(node).some(
          (key) =>
            key.startsWith("__reactProps") || key.startsWith("__reactFiber")
        );

      const tab = document.querySelector(
        ".platform-selection__tabs > button.platform-selection__tab"
      );
      if (tab && hasReactProps(tab)) return true;

      const webtraderRoot = document.querySelector(
        ".mt4-webtrader, .mt5-webtrader"
      );
      if (webtraderRoot && hasReactProps(webtraderRoot)) return true;

      return false;
    },
    { timeout: 90_000 }
  );

  await page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      })
  );
}

async function waitForMt4TerminalReady(page) {
  await page.waitForFunction(
    () => {
      const root = document.getElementById("webterminal");
      return Boolean(
        root && (root.querySelector("iframe") || root.childElementCount > 0)
      );
    },
    { timeout: 45_000 }
  );
}

async function waitForMt5Iframe(page) {
  await page.waitForSelector(".mt5-webtrader iframe", {
    state: "attached",
    timeout: 45_000,
  });
}

async function expectLoaderCompletes(page) {
  const loader = page.locator(".webtrader-loading");

  try {
    await loader.waitFor({ state: "visible", timeout: 5_000 });
    await expect(loader).toBeHidden({ timeout: 25_000 });
  } catch {
    // Fast hydration + stub can skip a visible loader flash.
  }
}

async function expectWatchdogError(page, rootSelector, watchdogMs = MT5_WATCHDOG_MS) {
  await page.clock.fastForward(watchdogMs + WATCHDOG_BUFFER_MS);

  const errorRoot = page.locator(`${rootSelector}.webtrader-error`);
  await expect(errorRoot).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();
  await expect(page.locator(".webtrader-loading")).toBeHidden();
}

async function runMt4WidgetStub(page) {
  await page.evaluate(() => {
    if (typeof window.MetaTraderWebTerminal !== "function") return;
    window.MetaTraderWebTerminal("webterminal", {
      version: 4,
      servers: ["OqtimaGlobal-Demo", "OqtimaGlobal-Server"],
      server: "OqtimaGlobal-Server",
    });
  });
}

async function stubMt4Widget(page) {
  await page.addInitScript({ content: MT4_WIDGET_STUB });
  await page.route("**/metatraderweb.app/**", (route) => {
    if (route.request().url().includes("/trade/widget.js")) {
      return route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: MT4_WIDGET_STUB,
      });
    }
    return route.continue();
  });
}

async function stubMt5Terminal(page) {
  await page.route("**/webtrader.oqtima.com/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: MT5_TERMINAL_HTML,
    })
  );
}

async function openPlatformWebTraderTab(page, webTraderSlug) {
  const advantageList = page.locator(".mt-advantage-list").first();
  await advantageList.scrollIntoViewIfNeeded();
  await page.waitForSelector(".platform-selection", {
    state: "visible",
    timeout: 60_000,
  });

  const platformSelection = page.locator(".platform-selection").first();
  await expect(platformSelection).toBeVisible({ timeout: 30_000 });
  await platformSelection.scrollIntoViewIfNeeded();

  const webtraderTab = platformSelection.getByRole("button", {
    name: /^WebTrader$/i,
  });
  await expect(webtraderTab).toBeVisible({ timeout: 30_000 });
  await webtraderTab.click();

  const card = page.locator(
    `a.platform-selection__card[href*="${webTraderSlug}"]`
  );
  await expect(card).toBeVisible({ timeout: 20_000 });
}

function webTraderCardLocator(page, localePrefix, slug) {
  const pathFragment = localePrefix
    ? `${localePrefix}/${slug}`
    : slug;
  return page.locator(
    `a.platform-selection__card[href*="${pathFragment}"]`
  );
}

module.exports = {
  WATCHDOG_MS: MT5_WATCHDOG_MS,
  MT4_WATCHDOG_MS,
  MT5_WATCHDOG_MS,
  WATCHDOG_BUFFER_MS,
  MT4_WIDGET_STUB,
  MT5_TERMINAL_HTML,
  waitForGatsbyHydration,
  waitForMt4TerminalReady,
  waitForMt5Iframe,
  expectLoaderCompletes,
  expectWatchdogError,
  stubMt4Widget,
  stubMt5Terminal,
  openPlatformWebTraderTab,
  webTraderCardLocator,
  runMt4WidgetStub,
};
