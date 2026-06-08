/**
 * Rasterize legal regulated backgrounds + FAQ market card SVGs to WebP under static/images/.
 * Dimensions match the source SVG width/height (artboard).
 *
 *   node scripts/gen-legal-faq-card-webp.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.join(__dirname, "..");

const jobs = [
  {
    inRel: "src/assets/images/legal/bg-regulated-desktop.svg",
    outRel: "static/images/legal/bg-regulated-desktop.webp",
    width: 1440,
    height: 1049,
  },
  {
    inRel: "src/assets/images/legal/bg-regulated-mobile.svg",
    outRel: "static/images/legal/bg-regulated-mobile.webp",
    width: 393,
    height: 1795,
  },
  /** FSA regulated card art (was ~3.5 MB + ~1.8 MB embedded-raster SVGs → WebP for legal page payload). */
  {
    inRel: "src/assets/images/legal/fsa-regulated-desktop.svg",
    outRel: "static/images/legal/fsa-regulated-desktop.webp",
    width: 483,
    height: 360,
  },
  {
    inRel: "src/assets/images/legal/fsa-regulated-mobile.svg",
    outRel: "static/images/legal/fsa-regulated-mobile.webp",
    width: 340,
    height: 254,
  },
  {
    inRel: "src/assets/images/faq/card-oqtima-markets-desktop.svg",
    outRel: "static/images/faq/card-oqtima-markets-desktop.webp",
    width: 404,
    height: 201,
  },
  {
    inRel: "src/assets/images/faq/card-oqtima-markets-mobile.svg",
    outRel: "static/images/faq/card-oqtima-markets-mobile.webp",
    width: 347,
    height: 170,
  },
];

async function main() {
  for (const job of jobs) {
    const input = path.join(root, job.inRel);
    const output = path.join(root, job.outRel);
    if (!fs.existsSync(input)) {
      console.error("Missing input:", input);
      process.exit(1);
    }
    fs.mkdirSync(path.dirname(output), { recursive: true });
    await sharp(input, { density: 144 })
      .resize(job.width, job.height, {
        fit: "contain",
        position: "centre",
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      })
      .webp({ quality: 82 })
      .toFile(output);
    console.log("Wrote", job.outRel, `${job.width}×${job.height}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
