/**
 * Rasterize large VPS section SVGs (embedded rasters) to WebP under static/.
 * Avoids multi‑MB /static/*.svg payloads on /vps/ (Lighthouse network payload).
 *   npm run gen:vps-section-raster-webp
 *
 * Do NOT add jobs for design-owned WebPs (never overwrite via this script):
 *   static/images/bg/vps/keep-your-vps-forever-mobile.webp (393×1669)
 *   static/images/vps/hand-desktop.webp (123×137)
 *   static/images/vps/hand-mobile.webp (135×97)
 *   static/images/vps/oqtima-forex-cfd-dark-desktop.webp (242×251)
 *   static/images/vps/oqtima-forex-cfd-dark-mobile.webp (242×251)
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.join(__dirname, "..");

/** @param {string} svgPath */
function readEmbeddedRasterFromSvg(svgPath) {
  const svg = fs.readFileSync(svgPath, "utf8");
  const match = svg.match(
    /xlink:href="data:image\/(png|jpeg);base64,([A-Za-z0-9+/=]+)"/
  );
  if (!match) {
    return null;
  }
  return Buffer.from(match[2], "base64");
}

/**
 * @param {{ label: string, src: string, out: string, width: number, height: number, vectorOnly?: boolean }} job
 */
async function runJob(job) {
  if (!fs.existsSync(job.src)) {
    throw new Error(`Missing source: ${job.src}`);
  }
  fs.mkdirSync(path.dirname(job.out), { recursive: true });

  let input = readEmbeddedRasterFromSvg(job.src);
  if (!input) {
    if (!job.vectorOnly) {
      throw new Error(`No embedded raster in ${job.src}`);
    }
    input = fs.readFileSync(job.src);
  }

  await sharp(input)
    .resize(job.width, job.height, {
      fit: "contain",
      position: "centre",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 88 })
    .toFile(job.out);

  const kb = Math.round(fs.statSync(job.out).size / 1024);
  console.log(`  ${job.label}: ${kb} KiB → ${path.relative(root, job.out)}`);
}

const jobs = [
  {
    label: "keep-your-vps-bg-desktop",
    src: path.join(
      root,
      "src/assets/images/bg/vps/keep-your-vps-forever-desktop.svg"
    ),
    out: path.join(root, "static/images/bg/vps/keep-your-vps-forever-desktop.webp"),
    width: 1440,
    height: 748,
    vectorOnly: true,
  },
  {
    label: "forex-cfd-light-desktop",
    src: path.join(root, "src/assets/images/vps/oqtima-forex-cfd-light-desktop.svg"),
    out: path.join(root, "static/images/vps/oqtima-forex-cfd-light-desktop.webp"),
    width: 222,
    height: 230,
    vectorOnly: true,
  },
  {
    label: "forex-cfd-light-mobile",
    src: path.join(root, "src/assets/images/vps/oqtima-forex-cfd-light-mobile.svg"),
    out: path.join(root, "static/images/vps/oqtima-forex-cfd-light-mobile.webp"),
    width: 314,
    height: 246,
    vectorOnly: true,
  },
];

async function main() {
  console.log("Generating VPS section raster WebP…");
  for (const job of jobs) {
    await runJob(job);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
