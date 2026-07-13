const fs = require("fs-extra");
const path = require("path");
const { ENTITY_LANGUAGES } = require("../lang.config");

function getTradingHubPageDataDirs() {
  const pageDataRoot = path.join(process.cwd(), "public", "page-data");
  const prefixes = [
    "",
    ...ENTITY_LANGUAGES.map((lang) => (lang.URIPart || "").replace(/^\//, "")).filter(
      Boolean
    ),
  ];

  return prefixes.map((prefix) =>
    prefix
      ? path.join(pageDataRoot, prefix, "trading-hub")
      : path.join(pageDataRoot, "trading-hub")
  );
}

async function clearTradingHubPageDataCache() {
  if (process.env.NODE_ENV !== "development") return false;

  let cleared = false;
  for (const dir of getTradingHubPageDataDirs()) {
    if (await fs.pathExists(dir)) {
      await fs.remove(dir);
      cleared = true;
    }
  }
  return cleared;
}

module.exports = {
  clearTradingHubPageDataCache,
};
