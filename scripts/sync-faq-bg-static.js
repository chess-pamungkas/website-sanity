/**
 * Copy FAQ section SVGs to static/ so /images/bg/faq/* and /images/faq/* resolve
 * (avoids broken ../../assets paths in deferred CSS bundles).
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

const copies = [
  {
    srcDir: path.join(root, "src/assets/images/bg/faq"),
    destDir: path.join(root, "static/images/bg/faq"),
  },
  {
    srcDir: path.join(root, "src/assets/images/faq"),
    destDir: path.join(root, "static/images/faq"),
  },
];

function main() {
  let total = 0;
  for (const { srcDir, destDir } of copies) {
    if (!fs.existsSync(srcDir)) {
      console.warn("sync-faq-bg-static: missing", srcDir);
      continue;
    }
    fs.mkdirSync(destDir, { recursive: true });
    for (const name of fs.readdirSync(srcDir)) {
      if (!name.endsWith(".svg")) continue;
      fs.copyFileSync(path.join(srcDir, name), path.join(destDir, name));
      total += 1;
    }
  }
  console.log(`sync-faq-bg-static: copied ${total} SVG(s) → static/images/`);
}

main();
