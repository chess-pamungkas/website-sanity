#!/usr/bin/env node

/**
 * Builds deferred fonts CSS and copies fonts to static/ so they are NOT in the
 * webpack bundle. This keeps non-critical fonts out of the Lighthouse critical path.
 * Output: static/css/deferred-fonts.css, static/fonts/*, and synced hero assets under static/images/bg/hero/* when present in src.
 */

const fs = require("fs");
const path = require("path");
const sass = require("sass");

const root = process.cwd();
const fontsSrc = path.join(root, "src", "assets", "fonts");
const fontsDest = path.join(root, "static", "fonts");
const scssFontsPath = path.join(
  root,
  "src",
  "assets",
  "styles",
  "typography-deferred.scss"
);
const cssFontsDest = path.join(root, "static", "css", "deferred-fonts.css");
const scssDeferredHomePath = path.join(
  root,
  "src",
  "assets",
  "styles",
  "index-deferred-home.scss"
);
const cssDeferredHomeDest = path.join(
  root,
  "static",
  "css",
  "deferred-styles.css"
);
const scssDeferredHome2Path = path.join(
  root,
  "src",
  "assets",
  "styles",
  "index-deferred-home-2.scss"
);
const cssDeferredHome2Dest = path.join(
  root,
  "static",
  "css",
  "deferred-styles-2.css"
);
const scssDeferredPagesPath = path.join(
  root,
  "src",
  "assets",
  "styles",
  "index-deferred-pages.scss"
);
const cssDeferredPagesDest = path.join(
  root,
  "static",
  "css",
  "deferred-styles-pages.css"
);
const scssCriticalFontsPath = path.join(
  root,
  "src",
  "assets",
  "styles",
  "typography-critical.scss"
);
const cssCriticalFontsDest = path.join(
  root,
  "static",
  "css",
  "fonts-critical.css"
);
const loadPaths = [path.join(root, "src", "assets", "styles")];

// Ensure static/css and static/fonts exist
fs.mkdirSync(path.dirname(cssFontsDest), { recursive: true });
fs.mkdirSync(fontsDest, { recursive: true });

// Copy font files to static/fonts (so /fonts/* works when CSS is at /css/deferred-fonts.css)
const fontFiles = fs.readdirSync(fontsSrc);
fontFiles.forEach((file) => {
  fs.copyFileSync(path.join(fontsSrc, file), path.join(fontsDest, file));
});

// Copy images referenced by deferred SCSS (deferred-styles.css is in static/css/, so url() must be root-relative; copy to static/images/)
const imagesDest = path.join(root, "static", "images", "bg");
const deferredImages = [
  ["account-comparison", "pricing-card.svg"],
  ["technology-infrastructure", "layer.svg"],
  ["main-page", "bg-card-market-sentiment.svg"],
  ["main-page", "bg-card-features-light.svg"],
  ["main-page", "bg-card-features-dark.svg"],
  // Compiled deferred-styles-pages.css references url(../images/bg/hero/all-markets/*.svg)
  // from /css/*.css → must exist under static/images/bg/hero/all-markets/
  ["hero/all-markets", "all-markets-desktop.svg"],
  ["hero/all-markets", "all-markets-mobile.svg"],
];
deferredImages.forEach(([dir, file]) => {
  const src = path.join(root, "src", "assets", "images", "bg", dir, file);
  const destDir = path.join(imagesDest, dir);
  if (fs.existsSync(src)) {
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, path.join(destDir, file));
  }
});

// Trading hero assets (Hero LCP uses /images/bg/hero/<slug>/*.webp from static/). Gatsby copies static/ → public/
// on each build; gatsby clean deletes public/. Edits under src/assets/.../bg/hero/<slug>/ were ignored unless synced here.
// Run `node scripts/gen-trading-hero-webp.js` only when you want to regenerate WebP from SVG into static/ (overwrites WebP).
const tradingHeroSlugs = [
  "all-markets",
  "forex",
  "metals",
  "crypto",
  "indices",
  "shares",
  "energies",
  "etf",
  "trading-tools",
];
const heroSrcRoot = path.join(root, "src", "assets", "images", "bg", "hero");
const heroStaticRoot = path.join(root, "static", "images", "bg", "hero");
tradingHeroSlugs.forEach((slug) => {
  const srcDir = path.join(heroSrcRoot, slug);
  if (!fs.existsSync(srcDir)) return;
  const destDir = path.join(heroStaticRoot, slug);
  fs.mkdirSync(destDir, { recursive: true });
  fs.readdirSync(srcDir).forEach((name) => {
    const srcFile = path.join(srcDir, name);
    if (!fs.statSync(srcFile).isFile()) return;
    fs.copyFileSync(srcFile, path.join(destDir, name));
  });
});

// Trading-tools / deferred-pages SCSS uses url("/images/bg/trading-tools/*") — keep static/ in sync with src/
const tradingToolsBgSrc = path.join(
  root,
  "src",
  "assets",
  "images",
  "bg",
  "trading-tools"
);
const tradingToolsBgDest = path.join(
  root,
  "static",
  "images",
  "bg",
  "trading-tools"
);
if (fs.existsSync(tradingToolsBgSrc)) {
  fs.mkdirSync(tradingToolsBgDest, { recursive: true });
  fs.readdirSync(tradingToolsBgSrc).forEach((name) => {
    const srcFile = path.join(tradingToolsBgSrc, name);
    if (!fs.statSync(srcFile).isFile()) return;
    fs.copyFileSync(srcFile, path.join(tradingToolsBgDest, name));
  });
}

// Copy account-comparison icons referenced by deferred SCSS (root-relative /images/icons/account-comparison/)
const iconsAccPath = path.join(
  root,
  "src",
  "assets",
  "images",
  "icons",
  "account-comparison"
);
const iconsAccDest = path.join(
  root,
  "static",
  "images",
  "icons",
  "account-comparison"
);
["star-most-popular-hover.svg"].forEach((file) => {
  const src = path.join(iconsAccPath, file);
  if (fs.existsSync(src)) {
    fs.mkdirSync(iconsAccDest, { recursive: true });
    fs.copyFileSync(src, path.join(iconsAccDest, file));
  }
});

// Compile typography-critical.scss to static/css/fonts-critical.css (loaded async to shorten Network dependency tree)
const resultCriticalFonts = sass.compile(scssCriticalFontsPath, {
  loadPaths,
  style: "compressed",
});
fs.writeFileSync(cssCriticalFontsDest, resultCriticalFonts.css, "utf8");

// Compile typography-deferred.scss (compressed for Lighthouse "Minify CSS")
const resultFonts = sass.compile(scssFontsPath, {
  loadPaths,
  style: "compressed",
});
fs.writeFileSync(cssFontsDest, resultFonts.css, "utf8");

// Compile index-deferred-home.scss (homepage first chunk)
const resultDeferredHome = sass.compile(scssDeferredHomePath, {
  loadPaths,
  style: "compressed",
});
fs.writeFileSync(cssDeferredHomeDest, resultDeferredHome.css, "utf8");

// Compile index-deferred-home-2.scss (homepage second chunk – load after 1.5s to reduce unused CSS on first paint)
const resultDeferredHome2 = sass.compile(scssDeferredHome2Path, {
  loadPaths,
  style: "compressed",
});
fs.writeFileSync(cssDeferredHome2Dest, resultDeferredHome2.css, "utf8");

// Compile index-deferred-pages.scss (other routes – loaded when user navigates off homepage)
const resultDeferredPages = sass.compile(scssDeferredPagesPath, {
  loadPaths,
  style: "compressed",
});
fs.writeFileSync(cssDeferredPagesDest, resultDeferredPages.css, "utf8");

console.log(
  "Deferred: built",
  cssFontsDest,
  cssDeferredHomeDest,
  cssDeferredHome2Dest,
  cssDeferredPagesDest,
  cssCriticalFontsDest,
  "and copied fonts to",
  fontsDest
);
