const { test: base, expect } = require("@playwright/test");

/**
 * Gatsby SSR treats Playwright as a Lighthouse/audit session and blocks JS bundles
 * (see gatsby-ssr.js audit-block-bundles). Neutralize that before page scripts run.
 */
const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
        configurable: true,
      });

      // Headless Chromium exposes Google-InspectionTool / HeadlessChrome in userAgentData.brands.
      if (navigator.userAgentData) {
        const brands = [
          { brand: "Google Chrome", version: "121" },
          { brand: "Chromium", version: "121" },
          { brand: "Not_A Brand", version: "24" },
        ];
        Object.defineProperty(navigator, "userAgentData", {
          get: () => ({
            brands,
            mobile: false,
            platform: "Windows",
            getHighEntropyValues: async () => ({}),
          }),
          configurable: true,
        });
      }

      try {
        document.documentElement?.removeAttribute("data-audit");
        document.documentElement?.removeAttribute("data-audit-reason");
      } catch {
        /* ignore */
      }
    });

    await use(page);
  },
});

module.exports = { test, expect };
