/**
 * Runs gatsby build. On Windows, sets GATSBY_CPU_COUNT=1 to avoid
 * "unknown error, open ... index.html" during slice stitching (file lock/race).
 * Retries up to 2 times on failure to work around flaky Windows file locks.
 * See BUILD-WINDOWS.md.
 *
 * Before Gatsby: compiles typography-critical → static/css/fonts-critical.css
 * (and other deferred SCSS / font copies). Keeps static/ in sync with SCSS sources.
 */
const { spawnSync } = require("child_process");
const path = require("path");

const isWindows = process.platform === "win32";
const cwd = path.join(__dirname, "..");
const maxAttempts = 3;

const env = { ...process.env };
if (isWindows) {
  env.GATSBY_CPU_COUNT = "1";
}

const deferredFontsCssScript = path.join(
  cwd,
  "src",
  "scripts",
  "build-deferred-fonts-css",
  "index.js"
);

function runDeferredFontsCss() {
  const r = spawnSync(process.execPath, [deferredFontsCssScript], {
    cwd,
    env,
    stdio: "inherit",
  });
  if (r.status !== 0 || r.signal) {
    const code =
      r.status !== null && r.status !== undefined
        ? r.status
        : r.signal === "SIGKILL"
          ? 137
          : 1;
    console.error("[gatsby-build] build-deferred-fonts-css failed.");
    process.exit(code);
  }
}

function runBuild() {
  // On Windows: shell required so npx.cmd runs; pass env so GATSBY_CPU_COUNT=1 avoids slice-stitch file lock errors
  if (isWindows) {
    return spawnSync("npx gatsby build", {
      env,
      stdio: "inherit",
      cwd,
      shell: true,
    });
  }
  return spawnSync("npx", ["gatsby", "build"], {
    env,
    stdio: "inherit",
    cwd,
  });
}

runDeferredFontsCss();

let attempt = 1;
let result = runBuild();

while (
  (result.status !== 0 || result.status === null) &&
  attempt < maxAttempts
) {
  console.error(
    `\n[gatsby-build] Attempt ${attempt} failed (exit ${
      result.status ?? "null"
    }). Retrying (${attempt + 1}/${maxAttempts})...\n`
  );
  attempt += 1;
  // On Windows, brief delay before retry to allow file locks to release
  if (isWindows && attempt < maxAttempts) {
    const waitMs = 5000;
    console.error(`[gatsby-build] Waiting ${waitMs / 1000}s before retry...\n`);
    const deadline = Date.now() + waitMs;
    while (Date.now() < deadline) {
      // Busy-wait (cross-platform, no extra process)
    }
  }
  result = runBuild();
}

if (result.status === 0) {
  require("./defer-global-css-html.js");
  require("./prune-production-html.js");
}

process.exit(result.status !== null ? result.status : 1);
