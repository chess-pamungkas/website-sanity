const STRIDE_PX = 267.2 + 16;
const REFERENCE_CARD_COUNT = 40;
const REFERENCE_DURATION_SEC = 90;

function prepareSymbolCount(rawCount) {
  if (!rawCount) return 0;
  let count = rawCount;
  while (count > 0 && count < 20) count *= 2;
  return count;
}

function expectedDurationSec(preparedCardCount) {
  if (!preparedCardCount) return REFERENCE_DURATION_SEC;
  return (preparedCardCount / REFERENCE_CARD_COUNT) * REFERENCE_DURATION_SEC;
}

function scrollPxPerSec(preparedCardCount, durationSec) {
  const distancePx = preparedCardCount * STRIDE_PX * 0.5;
  return distancePx / durationSec;
}

function makeMockSymbol(symbol) {
  return {
    symbol,
    direction: "up",
    bid: "1.00000",
    ask: "1.00010",
    spread: "1.0",
  };
}

/** Different raw counts per section — regression for fixed 90s animation. */
const MOCK_STOCKS_BY_SECTION = {
  metals: Array.from({ length: 6 }, (_, i) => makeMockSymbol(`XAU${i}`)),
  shares: Array.from({ length: 28 }, (_, i) => makeMockSymbol(`SHR${i}`)),
  forex: Array.from({ length: 12 }, (_, i) => makeMockSymbol(`EUR${i}`)),
  crypto: Array.from({ length: 8 }, (_, i) => makeMockSymbol(`BTC${i}`)),
};

/** Tab order matches getTradingSections() in config (locale-independent). */
const SECTION_TAB_INDEX = {
  metals: 0,
  crypto: 1,
  forex: 2,
  shares: 3,
  indices: 4,
  energies: 5,
  etf: 6,
};

async function ensureEnglishHomepage(page) {
  const baseURL =
    process.env.PLAYWRIGHT_BASE_URL || "http://localhost:9000";
  await page.context().addCookies([
    {
      name: "lastLanguage",
      value: "en",
      url: baseURL.replace(/\/$/, "") + "/",
    },
  ]);
}

async function waitForHomepageHydration(page) {
  await page.waitForLoadState("load");
  await page.waitForSelector("#___gatsby, #gatsby-focus-wrapper", {
    state: "attached",
    timeout: 45_000,
  });

  await page.waitForFunction(
    () => document.documentElement.getAttribute("data-audit") !== "1",
    { timeout: 30_000 }
  );

  await page.waitForSelector(".trading-section-title", {
    state: "visible",
    timeout: 90_000,
  });
  await page.waitForFunction(
    () => document.querySelectorAll(".trading-section-title").length >= 5,
    { timeout: 30_000 }
  );

  await page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      })
  );
}

async function installTradingTickerSocketMock(page) {
  await page.addInitScript((stocksBySection) => {
    window.__playwrightSocketIoFactory = function playwrightSocketIo() {
      const handlers = {};
      const socket = {
        connected: true,
        on(event, handler) {
          handlers[event] = handler;
        },
        emit(event, sectionId) {
          if (event !== "stocks") return;
          const rows = stocksBySection[sectionId] || [];
          queueMicrotask(() => handlers.reply?.(rows));
        },
        disconnect() {},
        removeAllListeners() {},
      };
      queueMicrotask(() => handlers.connect?.());
      return socket;
    };
  }, MOCK_STOCKS_BY_SECTION);
}

async function readTickerScrollMetrics(page) {
  return page.evaluate(() => {
    const track = document.querySelector(".trading-symbols--css-auto-scroll");
    if (!track) return null;
    const raw = track.style.getPropertyValue("--ticker-auto-scroll-duration");
    const durationSec = raw ? parseFloat(raw) : NaN;
    const cardCount = track.querySelectorAll(".trading-symbol-card").length;
    return { durationSec, cardCount };
  });
}

module.exports = {
  STRIDE_PX,
  MOCK_STOCKS_BY_SECTION,
  prepareSymbolCount,
  expectedDurationSec,
  scrollPxPerSec,
  SECTION_TAB_INDEX,
  ensureEnglishHomepage,
  waitForHomepageHydration,
  installTradingTickerSocketMock,
  readTickerScrollMetrics,
};
