/**
 * Raster dimensions match SVG artboards under src/assets/images/.../trading-tools.
 * WebP + mirrored SVG copies are written to static/images (served as /images/...).
 */
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC_BG = path.join(ROOT, "src/assets/images/bg/trading-tools");
const SRC_TC = path.join(ROOT, "src/assets/images/trading-tools");
const OUT_BG = path.join(ROOT, "static/images/bg/trading-tools");
const OUT_TC = path.join(ROOT, "static/images/trading-tools");

/** @typedef {{ id: string, srcSvg: string, outWebp: string, staticSvg: string, width: number, height: number }} SectionWebpJob */

/**
 * @returns {SectionWebpJob[]}
 */
function getTradingToolsSectionWebpJobs() {
  return [
    {
      id: "alpha-mobile",
      srcSvg: path.join(SRC_BG, "bg-alpha-generation-mobile.svg"),
      outWebp: path.join(OUT_BG, "bg-alpha-generation-mobile.webp"),
      staticSvg: path.join(OUT_BG, "bg-alpha-generation-mobile.svg"),
      width: 393,
      height: 1246,
    },
    {
      id: "alpha-desktop",
      srcSvg: path.join(SRC_BG, "bg-alpha-generation-desktop.svg"),
      outWebp: path.join(OUT_BG, "bg-alpha-generation-desktop.webp"),
      staticSvg: path.join(OUT_BG, "bg-alpha-generation-desktop.svg"),
      width: 1440,
      height: 826,
    },
    {
      id: "featured-mobile",
      srcSvg: path.join(SRC_BG, "bg-feature-ideas-mobile.svg"),
      outWebp: path.join(OUT_BG, "bg-feature-ideas-mobile.webp"),
      staticSvg: path.join(OUT_BG, "bg-feature-ideas-mobile.svg"),
      width: 393,
      height: 1246,
    },
    {
      id: "featured-desktop",
      srcSvg: path.join(SRC_BG, "bg-feature-ideas-desktop.svg"),
      outWebp: path.join(OUT_BG, "bg-feature-ideas-desktop.webp"),
      staticSvg: path.join(OUT_BG, "bg-feature-ideas-desktop.svg"),
      width: 1440,
      height: 826,
    },
    {
      id: "calendar-mobile",
      srcSvg: path.join(SRC_TC, "trading-calendar-mobile.svg"),
      outWebp: path.join(OUT_TC, "trading-calendar-mobile.webp"),
      staticSvg: path.join(OUT_TC, "trading-calendar-mobile.svg"),
      width: 353,
      height: 300,
    },
    {
      id: "calendar-desktop",
      srcSvg: path.join(SRC_TC, "trading-calendar-desktop.svg"),
      outWebp: path.join(OUT_TC, "trading-calendar-desktop.webp"),
      staticSvg: path.join(OUT_TC, "trading-calendar-desktop.svg"),
      width: 589,
      height: 433,
    },
  ];
}

module.exports = {
  getTradingToolsSectionWebpJobs,
  OUT_BG,
  OUT_TC,
};
