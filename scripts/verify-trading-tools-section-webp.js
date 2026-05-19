/**
 * Fail build if section WebPs are missing or wrong dimensions vs SVG artboards.
 * Run: node scripts/verify-trading-tools-section-webp.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { getTradingToolsSectionWebpJobs } = require("./trading-tools-section-webp-jobs");

const jobs = getTradingToolsSectionWebpJobs();

async function main() {
  const errors = [];

  for (const job of jobs) {
    if (!fs.existsSync(job.srcSvg)) {
      errors.push(`Missing source SVG: ${job.srcSvg}`);
      continue;
    }
    if (!fs.existsSync(job.staticSvg)) {
      errors.push(
        `Missing static SVG copy (run: npm run gen:trading-tools-section-webp): ${job.staticSvg}`
      );
      continue;
    }
    if (!fs.existsSync(job.outWebp)) {
      errors.push(
        `Missing WebP (run: npm run gen:trading-tools-section-webp): ${job.outWebp}`
      );
      continue;
    }
    let meta;
    try {
      meta = await sharp(job.outWebp).metadata();
    } catch (e) {
      errors.push(`${job.outWebp}: ${e.message}`);
      continue;
    }
    if (meta.width !== job.width || meta.height !== job.height) {
      errors.push(
        `${path.basename(job.outWebp)}: expected ${job.width}×${job.height}, got ${meta.width}×${meta.height}. Run: npm run gen:trading-tools-section-webp`
      );
    }
  }

  if (errors.length) {
    console.error("trading-tools section WebP check failed:\n");
    errors.forEach((m) => console.error(`  - ${m}`));
    process.exit(1);
  }
  console.log(
    `OK: ${jobs.length} trading-tools section WebP files match artboard dimensions.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
