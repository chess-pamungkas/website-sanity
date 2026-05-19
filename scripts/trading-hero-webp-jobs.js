/**
 * Single source of truth for trading hero raster dimensions (see Hero HERO_LCP_DIM).
 * Used by gen-trading-hero-webp.js and verify-trading-hero-webp.js.
 */
const path = require("path");

const SLUGS = [
  "all-markets",
  "forex",
  "metals",
  "crypto",
  "indices",
  "shares",
  "energies",
  "etf",
  /** Account types hero (same SVG artboard dims as trading-product heroes). */
  "accounts-type",
  /** Funding page uses URL segment /funding/; assets live under funding-withdrawals/. */
  "funding-withdrawals",
  /** URL segment /spreads-and-fees/; folder spreads-fees/. */
  "spreads-fees",
  /** /trading-tools/ — SVGs embed large rasters; WebP keeps LCP + payload sane. */
  "trading-tools",
  /** /vps/ — hero LCP must be discoverable <img> + WebP preload (not CSS background). */
  "vps",
  /** /swap-free/ */
  "swap-free",
  /** /mt4/ — desktop artboard 1400×583 */
  "mt4",
  /** /mt5/ */
  "mt5",
];

const DESKTOP = { width: 1440, height: 583 };
/** Platform heroes use 1400×583 desktop SVGs (not 1440). */
const DESKTOP_BY_SLUG = {
  mt4: { width: 1400, height: 583 },
  mt5: { width: 1400, height: 583 },
};
/** Matches `*-mobile.svg` artboards (e.g. width="393" height="953" viewBox="0 0 393 953"). */
const MOBILE = { width: 393, height: 953 };

/**
 * @param {string} staticHeroBase - absolute path to static/images/bg/hero
 * @returns {{ slug: string, srcSvg: string, outWebp: string, width: number, height: number, outPath: string, srcPath: string }[]}
 */
function getTradingHeroWebpJobs(staticHeroBase) {
  return SLUGS.flatMap((slug) => {
    const dir = path.join(staticHeroBase, slug);
    const desktop = DESKTOP_BY_SLUG[slug] || DESKTOP;
    return [
      {
        slug,
        srcSvg: `${slug}-desktop.svg`,
        outWebp: `${slug}-desktop.webp`,
        width: desktop.width,
        height: desktop.height,
        srcPath: path.join(dir, `${slug}-desktop.svg`),
        outPath: path.join(dir, `${slug}-desktop.webp`),
      },
      {
        slug,
        srcSvg: `${slug}-mobile.svg`,
        outWebp: `${slug}-mobile.webp`,
        width: MOBILE.width,
        height: MOBILE.height,
        srcPath: path.join(dir, `${slug}-mobile.svg`),
        outPath: path.join(dir, `${slug}-mobile.webp`),
      },
    ];
  });
}

module.exports = {
  SLUGS,
  DESKTOP,
  DESKTOP_BY_SLUG,
  MOBILE,
  getTradingHeroWebpJobs,
};
