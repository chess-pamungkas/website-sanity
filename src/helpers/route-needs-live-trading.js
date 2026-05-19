/**
 * Routes that mount TradingTicker and/or read live `tradingSymbols` from TradingContext.
 * Used to gate socket / symbol-stream work so static marketing pages skip that path.
 * Match on path segments so locale prefixes (`/en/metals`) are covered.
 */
const LIVE_TRADING_SEGMENTS = new Set([
  "forex",
  "metals",
  "crypto",
  "indices",
  "energies",
  "etf",
  "shares",
  "spreads-and-fees",
  "all-markets",
]);

export function routeNeedsLiveTrading(pathname) {
  if (!pathname || typeof pathname !== "string") {
    return false;
  }
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/") {
    return true;
  }
  if (/^\/[a-z]{2}$/i.test(normalized)) {
    return true;
  }
  const segments = normalized
    .toLowerCase()
    .split("/")
    .filter(Boolean);
  return segments.some((seg) => LIVE_TRADING_SEGMENTS.has(seg));
}
