/**
 * Build `bg-commission-mobile.webp` for /spreads-and-fees/ (Komisi mobile background).
 *
 * Older repo versions used a SVG with an embedded multi-MB JPEG (~3 MB+ over the wire).
 * Regenerate WebP from a JPEG source when art changes:
 *
 *   node scripts/gen-commission-mobile-webp.js
 *
 * Inputs (first match wins):
 *   COMMISSION_MOBILE_SRC — absolute or repo-relative JPEG path (recommended)
 *   Or legacy svg at src/assets/images/bg/spreads-fees/bg-commission-mobile.svg with embedded jpeg
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const outPath = path.join(
  __dirname,
  "../src/assets/images/bg/spreads-fees/bg-commission-mobile.webp"
);

async function bufferFromEmbeddedSvg(svgPath) {
  const svg = fs.readFileSync(svgPath, "utf8");
  const m = svg.match(/xlink:href="data:image\/jpeg;base64,([^"]+)"/);
  if (!m) return null;
  return Buffer.from(m[1], "base64");
}

async function main() {
  const envSrc =
    typeof process.env.COMMISSION_MOBILE_SRC === "string" &&
    process.env.COMMISSION_MOBILE_SRC.trim();
  let buf = null;
  const svgFallback = path.join(
    __dirname,
    "../src/assets/images/bg/spreads-fees/bg-commission-mobile.svg"
  );

  if (envSrc) {
    const p = path.isAbsolute(envSrc)
      ? envSrc
      : path.join(__dirname, "..", envSrc);
    buf = fs.readFileSync(p);
    console.log("Source JPEG:", p, buf.length, "bytes");
  } else if (fs.existsSync(svgFallback)) {
    buf = await bufferFromEmbeddedSvg(svgFallback);
    if (buf) {
      console.log("Extracted JPEG from SVG:", buf.length, "bytes");
    }
  }

  if (!buf) {
    console.error(
      "No source data: set COMMISSION_MOBILE_SRC to a JPEG, or restore bg-commission-mobile.svg (embedded jpeg)."
    );
    process.exit(1);
  }

  await sharp(buf)
    .resize(393, 840, { fit: "cover", position: "centre" })
    .webp({ quality: 84, effort: 4 })
    .toFile(outPath);

  console.log("Wrote", outPath, "→", fs.statSync(outPath).size, "bytes");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
