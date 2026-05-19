/**
 * Rasterize trading hero SVGs to WebP (all slugs under static/images/bg/hero).
 * Run after syncing SVGs from the reference website project:
 *   npm run gen:trading-hero-webp
 */
const path = require("path");
const sharp = require("sharp");
const { SLUGS, getTradingHeroWebpJobs } = require("./trading-hero-webp-jobs");

const base = path.join(__dirname, "../static/images/bg/hero");
const jobs = getTradingHeroWebpJobs(base);

Promise.all(
  jobs.map((job) =>
    sharp(job.srcPath, { density: 144 })
      // `contain` keeps the full SVG in frame; `cover` on 768×900 cropped all 393×953 artboards.
      .resize(job.width, job.height, {
        fit: "contain",
        position: "centre",
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      })
      .webp({ quality: 82 })
      .toFile(job.outPath)
  )
)
  .then(() => console.log("Wrote trading hero WebP for:", SLUGS.join(", ")))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
