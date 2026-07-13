const {
  getSanityClient,
  TRADING_HUB_LISTEN_QUERY,
} = require("./gatsby-source");
const {
  isSanityWatchModeEnabled,
  getSanityWatchModeBufferMs,
} = require("./sanity-config");
const { syncTradingHubNodes } = require("./sync-trading-hub");
const { syncTradingHubPages } = require("./sync-trading-hub-pages");
const { clearTradingHubPageDataCache } = require("./clear-trading-hub-page-data");

let pageSyncCallback = null;
let sourceHelpers = null;
let watchSubscription = null;
let syncTimer = null;
let syncInFlight = false;
let syncQueued = false;

function registerTradingHubPageSync(callback) {
  pageSyncCallback = callback;
}

function storeTradingHubSourceHelpers(helpers) {
  sourceHelpers = helpers;
}

function getWatchHelpers(pageHelpers = {}) {
  return {
    ...sourceHelpers,
    ...pageHelpers,
  };
}

function clearSyncTimer() {
  if (syncTimer) {
    clearTimeout(syncTimer);
    syncTimer = null;
  }
}

async function runTradingHubSync(helpers, reporter) {
  if (syncInFlight) {
    syncQueued = true;
    return;
  }

  syncInFlight = true;
  try {
    await syncTradingHubNodes(helpers);
    if (pageSyncCallback) {
      await pageSyncCallback();
    }
    const cleared = await clearTradingHubPageDataCache();
    if (cleared) {
      reporter.info(
        "Trading Hub: cleared cached page-data — hard-refresh article and listing pages in the browser"
      );
    }
  } catch (error) {
    reporter.warn(`Trading Hub watch sync failed: ${error.message}`);
  } finally {
    syncInFlight = false;
    if (syncQueued) {
      syncQueued = false;
      await runTradingHubSync(helpers, reporter);
    } else {
      reporter.info(
        "Trading Hub: Sanity resync complete — open the new slug URL or hard-refresh (Ctrl+Shift+R)"
      );
    }
  }
}

function scheduleTradingHubSync(helpers, reporter) {
  clearSyncTimer();
  syncTimer = setTimeout(() => {
    syncTimer = null;
    runTradingHubSync(helpers, reporter);
  }, getSanityWatchModeBufferMs());
}

function setupTradingHubWatch(pageHelpers) {
  if (!isSanityWatchModeEnabled() || watchSubscription) return;
  if (!sourceHelpers) return;

  const helpers = getWatchHelpers(pageHelpers);
  const { reporter } = helpers;
  const client = getSanityClient();

  watchSubscription = client
    .listen(TRADING_HUB_LISTEN_QUERY, {}, { includeResult: false })
    .subscribe({
      next: (event) => {
        if (event.type !== "mutation") return;
        reporter.info(
          `Trading Hub: Sanity change detected (${event.transition || "mutation"}${event.documentId ? ` · ${event.documentId}` : ""}), scheduling resync…`
        );
        scheduleTradingHubSync(helpers, reporter);
      },
      error: (error) => {
        reporter.warn(`Trading Hub Sanity listener error: ${error.message}`);
      },
    });

  reporter.info(
    `Trading Hub: Sanity watch mode enabled (${getSanityWatchModeBufferMs()}ms debounce)`
  );
}

function stopTradingHubWatch() {
  clearSyncTimer();
  if (watchSubscription) {
    watchSubscription.unsubscribe();
    watchSubscription = null;
  }
  pageSyncCallback = null;
}

module.exports = {
  setupTradingHubWatch,
  registerTradingHubPageSync,
  storeTradingHubSourceHelpers,
  stopTradingHubWatch,
};
