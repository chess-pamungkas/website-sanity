/**
 * Fast static server for local Lighthouse (port 9000).
 * Preloads HTML into memory + optional gzip — avoids slow TTFB from gatsby serve on Windows.
 * Usage: npm run build && npm run serve:perf
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const publicDir = path.join(__dirname, "..", "public");
const port = Number(process.env.PORT) || 9000;
const host = process.env.HOST || "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

/** @type {Map<string, { raw: Buffer, gz: Buffer, mime: string }>} */
const fileCache = new Map();

function mimeFor(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function cacheFile(absPath, urlPath) {
  try {
    const raw = fs.readFileSync(absPath);
    const gz = zlib.gzipSync(raw, { level: 6 });
    fileCache.set(urlPath, { raw, gz, mime: mimeFor(absPath) });
  } catch {
    /* skip unreadable */
  }
}

function warmCache(dir, urlPrefix = "") {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const stat = fs.statSync(abs);
    const urlPath = `${urlPrefix}/${name}`.replace(/\/+/g, "/");
    if (stat.isDirectory()) {
      warmCache(abs, urlPath);
    } else if (stat.isFile()) {
      cacheFile(abs, urlPath);
    }
  }
}

function resolveUrlPath(urlPath) {
  let p = urlPath.split("?")[0];
  if (p.endsWith("/")) p += "index.html";
  if (!path.extname(p)) {
    const asDir = path.join(publicDir, p, "index.html");
    if (fs.existsSync(asDir)) p = `${p}/index.html`.replace(/\/+/g, "/");
  }
  return p;
}

warmCache(publicDir);
console.log(
  `[serve-static-fast] Cached ${fileCache.size} files from public/ — http://localhost:${port}/`
);

const server = http.createServer((req, res) => {
  const urlPath = resolveUrlPath(req.url || "/");
  const entry = fileCache.get(urlPath);
  if (!entry) {
    res.statusCode = 404;
    res.end("Not found");
    return;
  }
  const acceptGzip = (req.headers["accept-encoding"] || "").includes("gzip");
  const body = acceptGzip ? entry.gz : entry.raw;
  res.statusCode = 200;
  res.setHeader("Content-Type", entry.mime);
  res.setHeader("Cache-Control", "public, max-age=60");
  if (acceptGzip) res.setHeader("Content-Encoding", "gzip");
  res.setHeader("Vary", "Accept-Encoding");
  res.end(body);
});

server.listen(port, host, () => {
  console.log(`[serve-static-fast] Listening on http://${host === "0.0.0.0" ? "localhost" : host}:${port}`);
});
