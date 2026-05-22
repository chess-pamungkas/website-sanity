/**
 * Post-build: (1) Replace Gatsby's inline global CSS with non-blocking link (`media="print"`).
 * (2) Replace webpack-runtime/framework/app script tags with a loader that flips print→screen CSS
 *     immediately then injects scripts after double-rAF — keeps stylesheet activation off the slower path
 *     that inflated Lighthouse `elementRenderDelay` for LCP hero images.
 * Mutates HTML files in public/.
 */
const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

function replaceInlineGlobalCss(html) {
  const regex = /<style\s+data-href="([^"]+)"\s+data-identity="gatsby-global-css"[^>]*>[\s\S]*?<\/style>/g;
  return html.replace(regex, (_, href) => {
    return `<link rel="stylesheet" href="${href}" media="print"/>`;
  });
}

function makeLcpLoader(urlsJson) {
  // flip: activate Gatsby global CSS (print → all) — MUST run ASAP so LCP <img>
  // subtree gets layout/size from real screen stylesheets (deferring flip behind
  // double-rAF caused multi-second Lighthouse `elementRenderDelay` when network was fast).
  // inj: inject webpack-runtime / framework / app after double-rAF — keeps bulky parse/eval off the first frames.
  return `<script>(function(){var u=${urlsJson};function inj(){u.forEach(function(s){var e=document.createElement("script");e.src=s;e.async=true;document.body.appendChild(e);});}var flipDone=false;function flip(){if(flipDone)return;flipDone=true;var s=document.querySelectorAll('link[rel="stylesheet"][media="print"]');[].forEach.call(s,function(l){l.media='all';if(l.onload)l.onload();});}var jsDone=false;function injJs(){if(jsDone)return;jsDone=true;inj();}flip();requestAnimationFrame(function(){requestAnimationFrame(function(){injJs();});});})();</script>`;
}

function replaceAppScriptsWithDeferLoader(html) {
  const threeScriptsRegex = /<script\s+src="(\/webpack-runtime-[^"]+\.js)"\s+async\s*><\/script>\s*<script\s+src="(\/framework-[^"]+\.js)"\s+async\s*><\/script>\s*<script\s+src="(\/app-[^"]+\.js)"\s+async\s*><\/script>/;
  const m = html.match(threeScriptsRegex);
  if (m) {
    const urls = JSON.stringify([m[1], m[2], m[3]]);
    return html.replace(threeScriptsRegex, makeLcpLoader(urls));
  }
  // Already has a loader: replace old (isAudit/?lighthouse) loader with LCP-based loader
  const oldLoaderRegex = /<script>\(function\(\)\{var u=\[([^\]]+)\];[\s\S]*?\}\);<\/script>/;
  const oldMatch = html.match(oldLoaderRegex);
  if (oldMatch) {
    const urlsJson = "[" + oldMatch[1] + "]";
    return html.replace(oldLoaderRegex, makeLcpLoader(urlsJson));
  }
  return html;
}

// Remove standalone stylesheet flipper so only the loader's doInj flips styles (after LCP). Avoids applying main CSS before LCP and hiding hero.
function removeStandaloneStylesheetFlipper(html) {
  const standaloneFlipper = /<script>\(function\(\)\{var s=document\.querySelectorAll\('link\[rel="stylesheet"\]\[media="print"\]'\);\[\]\.forEach\.call\(s,function\(l\)\{l\.onload=function\(\)\{l\.media='all';};if\(l\.sheet\)l\.media='all';\}\);\}\)\(\);<\/script>/g;
  return html.replace(standaloneFlipper, "");
}

// Ensure loader's doInj flips print stylesheets before inj(). Idempotent.
function ensureLoaderFlipperInDoInj(html) {
  const doInjOnlyInj = /function doInj\(\)\{if\(done\)return;done=true;inj\(\);\}/;
  const doInjWithFlipper = "function doInj(){if(done)return;done=true;var s=document.querySelectorAll('link[rel=\"stylesheet\"][media=\"print\"]');[].forEach.call(s,function(l){l.media='all';if(l.onload)l.onload();});inj();}";
  if (doInjOnlyInj.test(html)) {
    return html.replace(doInjOnlyInj, doInjWithFlipper);
  }
  return html;
}


function walkDir(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkDir(full, callback);
    else if (e.isFile() && e.name.toLowerCase() === "index.html") callback(full);
  }
}

let cssCount = 0;
let scriptsCount = 0;
let flipperRemovedCount = 0;
walkDir(publicDir, (filePath) => {
  let html = fs.readFileSync(filePath, "utf8");
  const afterCss = replaceInlineGlobalCss(html);
  if (afterCss !== html) cssCount += 1;
  let afterScripts = replaceAppScriptsWithDeferLoader(afterCss);
  if (afterScripts !== afterCss) scriptsCount += 1;
  const afterFlipper = removeStandaloneStylesheetFlipper(afterScripts);
  if (afterFlipper !== afterScripts) flipperRemovedCount += 1;
  const afterEnsureFlipper = ensureLoaderFlipperInDoInj(afterFlipper);
  if (afterEnsureFlipper !== html) {
    fs.writeFileSync(filePath, afterEnsureFlipper, "utf8");
  }
});

if (cssCount > 0) {
  console.log(`[defer-global-css-html] Replaced inline gatsby-global-css with link in ${cssCount} HTML file(s).`);
}
if (scriptsCount > 0) {
  console.log(`[defer-global-css-html] Replaced app/framework scripts with deferred loader in ${scriptsCount} HTML file(s) (sync CSS flip, double-rAF script inject).`);
}
if (flipperRemovedCount > 0) {
  console.log(`[defer-global-css-html] Removed standalone stylesheet flipper from ${flipperRemovedCount} HTML file(s) (loader owns stylesheet activation).`);
}
