/**
 * Copy swap-free section/card SVGs to static/images so /images/bg/swap-free/* URLs resolve
 * (avoids broken ../../assets paths in emitted CSS).
 */
const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "../src/assets/images/bg/swap-free");
const destDir = path.join(__dirname, "../static/images/bg/swap-free");

function main() {
  if (!fs.existsSync(srcDir)) {
    console.warn("sync-swap-free-bg-static: missing", srcDir);
    return;
  }
  fs.mkdirSync(destDir, { recursive: true });
  let n = 0;
  for (const name of fs.readdirSync(srcDir)) {
    if (!name.endsWith(".svg")) continue;
    fs.copyFileSync(path.join(srcDir, name), path.join(destDir, name));
    n += 1;
  }
  console.log(
    `sync-swap-free-bg-static: copied ${n} SVG(s) → static/images/bg/swap-free`
  );
}

main();
