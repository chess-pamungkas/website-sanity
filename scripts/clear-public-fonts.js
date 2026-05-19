#!/usr/bin/env node
/**
 * Gatsby copies static/fonts -> public/fonts during develop. On Windows, locked
 * destination files cause EBUSY and crash `yarn start`. Remove (or rename) public/fonts
 * before start so copyFile can succeed.
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "public", "fonts");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  if (!fs.existsSync(dir)) return;

  for (let i = 0; i < 6; i++) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      return;
    } catch (e) {
      if (i === 5) break;
      await sleep(350);
    }
  }

  try {
    const stale = `${dir}.stale.${Date.now()}`;
    fs.renameSync(dir, stale);
    return;
  } catch {
    /* ignore */
  }

  console.warn(
    "[clear-public-fonts] Could not clear public/fonts — it may be locked (another Gatsby tab, Node process, or antivirus). Close other dev servers, stop processes on port 8000, add an AV exclusion for this repo, then run yarn start again."
  );
}

main().catch((err) => {
  console.warn(err);
});
