/**
 * Post-build: trim non-essential bytes from shipped HTML (smaller document → faster
 * download on Lighthouse mobile throttling). Safe, idempotent string passes only.
 */
const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

function walkDir(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkDir(full, callback);
    else if (e.isFile() && e.name.toLowerCase() === "index.html") callback(full);
  }
}

function pruneHtml(html) {
  let out = html;
  // Dev-only Convrs debug hook (also omitted from SSR in production).
  out = out.replace(
    /<script>\(function\(\)\{function isAudit\(\)[\s\S]*?__checkConvrsPresence[\s\S]*?\}\)\(\);<\/script>/g,
    ""
  );
  // Collapse excessive whitespace between tags (keeps text nodes intact).
  out = out.replace(/>\s{2,}</g, "><");
  return out;
}

let count = 0;
let saved = 0;
if (!fs.existsSync(publicDir)) {
  console.warn("[prune-production-html] public/ not found — skip.");
  process.exit(0);
}

walkDir(publicDir, (filePath) => {
  const before = fs.readFileSync(filePath, "utf8");
  const after = pruneHtml(before);
  if (after !== before) {
    fs.writeFileSync(filePath, after, "utf8");
    count += 1;
    saved += before.length - after.length;
  }
});

if (count > 0) {
  console.log(
    `[prune-production-html] Pruned ${count} HTML file(s); ~${Math.round(saved / 1024)} KiB saved.`
  );
}
