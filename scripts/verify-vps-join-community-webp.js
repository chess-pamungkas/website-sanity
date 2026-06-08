/**
 * Verify VPS join-community WebP assets exist (see scripts/gen-vps-join-community-webp.js).
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const outBase = path.join(__dirname, "../static/images/bg/vps");

const checks = [
  { file: "join-our-community-vps-desktop.webp", width: 1240, height: 501 },
  { file: "join-our-community-vps-mobile.webp", width: 393, height: 809 },
];

async function main() {
  const errors = [];
  for (const { file, width, height } of checks) {
    const p = path.join(outBase, file);
    if (!fs.existsSync(p)) {
      errors.push(`Missing ${p} — run: npm run gen:vps-join-community-webp`);
      continue;
    }
    const meta = await sharp(p).metadata();
    if (meta.width !== width || meta.height !== height) {
      errors.push(
        `${file}: expected ${width}×${height}, got ${meta.width}×${meta.height}`
      );
    }
  }
  if (errors.length) {
    console.error("verify-vps-join-community-webp failed:\n");
    errors.forEach((e) => console.error(" ", e));
    process.exit(1);
  }
  console.log("OK: join-our-community-vps desktop + mobile WebP present.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
