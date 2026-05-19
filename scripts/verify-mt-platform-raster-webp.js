/**
 * Verify MT4/MT5 promo WebP assets (see scripts/gen-mt-platform-raster-webp.js).
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const checks = [
  { path: "static/images/mt4/mt4.webp", width: 405, height: 588 },
  { path: "static/images/mt4/mt4-mobile.webp", width: 405, height: 588 },
  { path: "static/images/mt5/mt5.webp", width: 405, height: 588 },
  { path: "static/images/mt5/mt5-mobile.webp", width: 405, height: 588 },
];

async function main() {
  const root = path.join(__dirname, "..");
  const errors = [];
  for (const { path: rel, width, height } of checks) {
    const p = path.join(root, rel);
    if (!fs.existsSync(p)) {
      errors.push(`Missing ${rel} — run: npm run gen:mt-platform-raster-webp`);
      continue;
    }
    const meta = await sharp(p).metadata();
    if (meta.width !== width || meta.height !== height) {
      errors.push(
        `${rel}: expected ${width}×${height}, got ${meta.width}×${meta.height}`
      );
    }
  }
  if (errors.length) {
    console.error("verify-mt-platform-raster-webp failed:\n");
    errors.forEach((e) => console.error(" ", e));
    process.exit(1);
  }
  console.log("OK: MT4/MT5 promo WebP assets present.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
