/**
 * Write placeholder WebPs for VPS join-community (SVGs are too large / fragile for sharp).
 * Replace files in static/images/bg/vps/ with design exports when available.
 *   npm run gen:vps-join-community-webp
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const outDir = path.join(__dirname, "../static/images/bg/vps");

const jobs = [
  {
    out: "join-our-community-vps-desktop.webp",
    width: 1240,
    height: 501,
    /** Dark card tone; replace with exported art */
    background: { r: 12, g: 12, b: 14, alpha: 1 },
  },
  {
    out: "join-our-community-vps-mobile.webp",
    width: 393,
    height: 809,
    background: { r: 12, g: 12, b: 14, alpha: 1 },
  },
];

fs.mkdirSync(outDir, { recursive: true });

Promise.all(
  jobs.map((j) =>
    sharp({
      create: {
        width: j.width,
        height: j.height,
        channels: 4,
        background: j.background,
      },
    })
      .webp({ quality: 85 })
      .toFile(path.join(outDir, j.out))
  )
)
  .then(() =>
    console.log(
      "Wrote placeholder WebP:",
      jobs.map((j) => j.out).join(", "),
      "(replace with design exports)"
    )
  )
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
