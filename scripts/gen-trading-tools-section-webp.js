/**
 * Copy section SVGs to static/images for /images/... fallback URLs, then rasterize to WebP.
 *   npm run gen:trading-tools-section-webp
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { getTradingToolsSectionWebpJobs } = require("./trading-tools-section-webp-jobs");

const jobs = getTradingToolsSectionWebpJobs();

for (const job of jobs) {
  fs.mkdirSync(path.dirname(job.staticSvg), { recursive: true });
  fs.copyFileSync(job.srcSvg, job.staticSvg);
}

Promise.all(
  jobs.map((job) =>
    sharp(job.srcSvg, { density: 144 })
      .resize(job.width, job.height, {
        fit: "contain",
        position: "centre",
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      })
      .webp({ quality: 82 })
      .toFile(job.outWebp)
  )
)
  .then(() =>
    console.log(
      "Wrote trading-tools section WebP (+ static SVG mirrors):",
      jobs.map((j) => path.basename(j.outWebp)).join(", ")
    )
  )
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
