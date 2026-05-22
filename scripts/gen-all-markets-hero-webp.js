/**
 * Rasterize all-markets hero SVGs to WebP (faster LCP than heavy SVG decode).
 * Run: node scripts/gen-all-markets-hero-webp.js
 */
const path = require("path");
const sharp = require("sharp");

const dir = path.join(__dirname, "../static/images/bg/hero/all-markets");
const jobs = [
  ["all-markets-desktop.svg", 1440, 583, "all-markets-desktop.webp"],
  ["all-markets-mobile.svg", 768, 900, "all-markets-mobile.webp"],
];

Promise.all(
  jobs.map(([src, w, h, out]) =>
    sharp(path.join(dir, src), { density: 144 })
      .resize(w, h, { fit: "cover", position: "center" })
      .webp({ quality: 82 })
      .toFile(path.join(dir, out))
  )
)
  .then(() => console.log("Wrote:", jobs.map((j) => j[3]).join(", ")))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
