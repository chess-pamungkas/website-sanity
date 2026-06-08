/**
 * Copy VPS card/section SVGs to static/images so /images/bg/vps/* URLs resolve
 * (same pattern as trading-tools rasters; avoids broken ../../assets paths in emitted CSS).
 */
const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "../src/assets/images/bg/vps");
const destDir = path.join(__dirname, "../static/images/bg/vps");

function main() {
  if (!fs.existsSync(srcDir)) {
    console.warn("sync-vps-bg-static: missing", srcDir);
    return;
  }
  fs.mkdirSync(destDir, { recursive: true });
  let n = 0;
  for (const name of fs.readdirSync(srcDir)) {
    if (!name.endsWith(".svg")) continue;
    fs.copyFileSync(path.join(srcDir, name), path.join(destDir, name));
    n += 1;
  }
  console.log(`sync-vps-bg-static: copied ${n} SVG(s) → static/images/bg/vps`);
}

main();
