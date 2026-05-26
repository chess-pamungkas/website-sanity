const { test, expect } = require("./fixtures");
const {
  MOCK_STOCKS_BY_SECTION,
  SECTION_TAB_INDEX,
  prepareSymbolCount,
  expectedDurationSec,
  scrollPxPerSec,
  ensureEnglishHomepage,
  waitForHomepageHydration,
  installTradingTickerSocketMock,
  readTickerScrollMetrics,
} = require("./helpers/trading-ticker");

test.describe("Trading ticker scroll speed", () => {
  test("layout helper keeps constant px/s for every symbol count", () => {
    const rawCounts = [6, 8, 12, 20, 28, 40];
    const preparedCounts = rawCounts.map(prepareSymbolCount);
    const pxPerSecValues = preparedCounts.map((count) =>
      scrollPxPerSec(count, expectedDurationSec(count))
    );

    for (let i = 1; i < pxPerSecValues.length; i++) {
      expect(pxPerSecValues[i]).toBeCloseTo(pxPerSecValues[0], 8);
    }

    expect(expectedDurationSec(prepareSymbolCount(6))).toBeCloseTo(54, 5);
    expect(expectedDurationSec(prepareSymbolCount(28))).toBeCloseTo(63, 5);
    expect(expectedDurationSec(40)).toBe(90);
  });

  test("homepage sets scroll duration proportional to each product tab", async ({
    page,
  }) => {
    await installTradingTickerSocketMock(page);
    await ensureEnglishHomepage(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForHomepageHydration(page);

    const ticker = page.locator(".trading-ticker-wrapper").first();
    await ticker.scrollIntoViewIfNeeded();
    await expect(
      page.locator(".trading-symbols--css-auto-scroll").first()
    ).toBeVisible({ timeout: 30_000 });

    const sectionIds = ["metals", "shares", "forex"];

    const samples = [];

    for (const sectionId of sectionIds) {
      const tab = ticker
        .locator(".trading-section-title")
        .nth(SECTION_TAB_INDEX[sectionId]);
      await tab.scrollIntoViewIfNeeded();
      await tab.click();
      const rawCount = MOCK_STOCKS_BY_SECTION[sectionId].length;
      const preparedCount = prepareSymbolCount(rawCount);
      await expect
        .poll(async () => {
          const metrics = await readTickerScrollMetrics(page);
          return metrics?.cardCount === preparedCount ? metrics : null;
        })
        .not.toBeNull();

      const metrics = await readTickerScrollMetrics(page);
      samples.push({
        sectionId,
        ...metrics,
        preparedCount,
        expectedDuration: expectedDurationSec(preparedCount),
      });
    }

    expect(samples.length).toBeGreaterThan(1);

    const pxPerSecValues = samples.map((s) =>
      scrollPxPerSec(s.preparedCount, s.durationSec)
    );
    for (let i = 1; i < pxPerSecValues.length; i++) {
      expect(pxPerSecValues[i]).toBeCloseTo(pxPerSecValues[0], 4);
    }

    for (const sample of samples) {
      expect(sample.durationSec).toBeCloseTo(sample.expectedDuration, 2);
    }

    const metals = samples.find((s) => s.sectionId === "metals");
    const shares = samples.find((s) => s.sectionId === "shares");
    expect(shares.durationSec).toBeGreaterThan(metals.durationSec);
  });
});
