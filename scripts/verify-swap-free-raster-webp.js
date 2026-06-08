/**
 * Verify swap-free raster WebP assets (see scripts/gen-swap-free-raster-webp.js).
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const checks = [
  {
    path: "static/images/swap-free/swap-free-freedom.webp",
    width: 589,
    height: 500,
  },
  {
    path: "static/images/swap-free/swap-free-freedom-mobile.webp",
    width: 393,
    height: 334,
  },
  {
    path: "static/images/bg/swap-free/bg-how-to-trade-mobile.webp",
    width: 393,
    height: 1075,
  },
  {
    path: "static/images/bg/swap-free/bg-how-to-trade-desktop.webp",
    width: 1440,
    height: 659,
  },
];

async function main() {
  const root = path.join(__dirname, "..");
  const errors = [];
  for (const { path: rel, width, height } of checks) {
    const p = path.join(root, rel);
    if (!fs.existsSync(p)) {
      errors.push(`Missing ${rel} — run: npm run gen:swap-free-raster-webp`);
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
    console.error("verify-swap-free-raster-webp failed:\n");
    errors.forEach((e) => console.error(" ", e));
    process.exit(1);
  }
  console.log("OK: swap-free freedom + how-to-trade WebP assets present.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
