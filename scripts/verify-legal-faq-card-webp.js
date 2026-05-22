/**
 * Ensures WebP rasters exist for legal regulated backgrounds + FAQ market cards
 * (see scripts/gen-legal-faq-card-webp.js).
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

const expected = [
  "static/images/legal/bg-regulated-desktop.webp",
  "static/images/legal/bg-regulated-mobile.webp",
  "static/images/legal/fsa-regulated-desktop.webp",
  "static/images/legal/fsa-regulated-mobile.webp",
  "static/images/faq/card-oqtima-markets-desktop.webp",
  "static/images/faq/card-oqtima-markets-mobile.webp",
];

function main() {
  let ok = true;
  for (const rel of expected) {
    const p = path.join(root, rel);
    if (!fs.existsSync(p)) {
      console.error("verify-legal-faq-card-webp: missing", rel);
      ok = false;
    }
  }
  if (!ok) {
    console.error("Run: node scripts/gen-legal-faq-card-webp.js");
    process.exit(1);
  }
  console.log("verify-legal-faq-card-webp: OK");
}

main();
