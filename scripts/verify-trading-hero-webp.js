/**
 * Fail if trading hero WebP dimensions drift from the artboard (avoids Lighthouse
 * "Improve image delivery" on /indices, /forex, etc. when someone drops a huge raster).
 *
 * Run: node scripts/verify-trading-hero-webp.js
 * Invoked automatically via npm prebuild (before npm run build).
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { getTradingHeroWebpJobs } = require("./trading-hero-webp-jobs");

const base = path.join(__dirname, "../static/images/bg/hero");
const jobs = getTradingHeroWebpJobs(base);

async function main() {
  const errors = [];

  for (const job of jobs) {
    if (!fs.existsSync(job.outPath)) {
      errors.push(`Missing file: ${job.outPath}`);
      continue;
    }
    let meta;
    try {
      meta = await sharp(job.outPath).metadata();
    } catch (e) {
      errors.push(`${job.outPath}: ${e.message}`);
      continue;
    }
    if (meta.width !== job.width || meta.height !== job.height) {
      errors.push(
        `${job.outPath}: expected ${job.width}×${job.height}, got ${meta.width}×${meta.height}. Run: npm run gen:trading-hero-webp`
      );
    }
  }

  if (errors.length) {
    console.error("trading hero WebP dimension check failed:\n");
    errors.forEach((m) => console.error(`  - ${m}`));
    process.exit(1);
  }
  console.log(
    `OK: ${jobs.length} trading hero WebP files match artboard dimensions (1440×583 desktop, 393×953 mobile).`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
