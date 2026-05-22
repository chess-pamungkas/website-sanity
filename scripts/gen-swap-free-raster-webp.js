/**
 * Rasterize large swap-free SVGs (embedded rasters) to WebP under static/images/.
 * Avoids ~7MB webpack /static/*.svg payloads on /swap-free/.
 *   npm run gen:swap-free-raster-webp
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.join(__dirname, "..");

const jobs = [
  {
    label: "swap-free-freedom",
    src: path.join(root, "src/assets/images/swap-free/swap-free-freedom.svg"),
    out: path.join(root, "static/images/swap-free/swap-free-freedom.webp"),
    width: 589,
    height: 500,
  },
  {
    label: "swap-free-freedom-mobile",
    src: path.join(root, "src/assets/images/swap-free/swap-free-freedom.svg"),
    out: path.join(
      root,
      "static/images/swap-free/swap-free-freedom-mobile.webp"
    ),
    width: 393,
    height: 334,
  },
  {
    label: "bg-how-to-trade-mobile",
    src: path.join(
      root,
      "src/assets/images/bg/swap-free/bg-how-to-trade-mobile.svg"
    ),
    out: path.join(
      root,
      "static/images/bg/swap-free/bg-how-to-trade-mobile.webp"
    ),
    width: 393,
    height: 1075,
  },
  {
    label: "bg-how-to-trade-desktop",
    src: path.join(
      root,
      "src/assets/images/bg/swap-free/bg-how-to-trade-desktop.svg"
    ),
    out: path.join(
      root,
      "static/images/bg/swap-free/bg-how-to-trade-desktop.webp"
    ),
    width: 1440,
    height: 659,
  },
];

async function runJob(job) {
  if (!fs.existsSync(job.src)) {
    throw new Error(`Missing source: ${job.src}`);
  }
  fs.mkdirSync(path.dirname(job.out), { recursive: true });
  await sharp(job.src, { density: 120 })
    .resize(job.width, job.height, {
      fit: "contain",
      position: "centre",
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    })
    .webp({ quality: 82 })
    .toFile(job.out);
  const kb = Math.round(fs.statSync(job.out).size / 1024);
  console.log(`  ${job.label}: ${kb} KiB → ${path.basename(job.out)}`);
}

async function main() {
  console.log("Generating swap-free raster WebP…");
  for (const job of jobs) {
    await runJob(job);
  }
  console.log("Done. Replace WebPs with design exports when available.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
