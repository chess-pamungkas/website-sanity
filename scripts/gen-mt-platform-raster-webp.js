/**
 * Rasterize large MT4/MT5 promo SVGs (embedded rasters) to WebP under static/images/.
 * Avoids ~7MB webpack /static/*.svg payloads on /mt4/ and /mt5/.
 *   npm run gen:mt-platform-raster-webp
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.join(__dirname, "..");

const jobs = [
  {
    label: "mt4",
    src: path.join(root, "src/assets/images/mt4/mt4.svg"),
    out: path.join(root, "static/images/mt4/mt4.webp"),
    width: 405,
    height: 588,
  },
  {
    label: "mt4-mobile",
    src: path.join(root, "src/assets/images/mt4/mt4.svg"),
    out: path.join(root, "static/images/mt4/mt4-mobile.webp"),
    width: 405,
    height: 588,
  },
  {
    label: "mt5",
    src: path.join(root, "src/assets/images/mt5/mt5.svg"),
    out: path.join(root, "static/images/mt5/mt5.webp"),
    width: 405,
    height: 588,
  },
  {
    label: "mt5-mobile",
    src: path.join(root, "src/assets/images/mt5/mt5.svg"),
    out: path.join(root, "static/images/mt5/mt5-mobile.webp"),
    width: 405,
    height: 588,
  },
];

/** mt4.svg / mt5.svg embed a huge PNG; the XML wrapper breaks sharp/librsvg. */
function readEmbeddedPngFromSvg(svgPath) {
  const svg = fs.readFileSync(svgPath, "utf8");
  const match = svg.match(
    /xlink:href="data:image\/png;base64,([A-Za-z0-9+/=]+)"/
  );
  if (!match) {
    throw new Error(`No embedded PNG in ${svgPath}`);
  }
  return Buffer.from(match[1], "base64");
}

async function runJob(job) {
  if (!fs.existsSync(job.src)) {
    throw new Error(`Missing source: ${job.src}`);
  }
  fs.mkdirSync(path.dirname(job.out), { recursive: true });
  const input = readEmbeddedPngFromSvg(job.src);
  await sharp(input)
    .resize(job.width, job.height, {
      fit: "contain",
      position: "centre",
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    })
    .webp({ quality: 88 })
    .toFile(job.out);
  const kb = Math.round(fs.statSync(job.out).size / 1024);
  console.log(`  ${job.label}: ${kb} KiB → ${path.basename(job.out)}`);
}

async function main() {
  console.log("Generating MT4/MT5 promo raster WebP…");
  for (const job of jobs) {
    await runJob(job);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
