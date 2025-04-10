#!/usr/bin/env node

/**
 * This script copies the registration popup script to the static folder
 * so it can be accessed during development.
 *
 * Environment variables used by the script:
 * - IFRAME_REGISTRATION_API_KEY - Variable used for API key authentication
 */

const fs = require("fs-extra");
const path = require("path");

const scriptsDir = path.join(process.cwd(), "src", "scripts");
const staticScriptsDir = path.join(process.cwd(), "static", "scripts");

// Ensure the scripts directory exists in static
fs.ensureDirSync(staticScriptsDir);

// Copy the registration script to the static folder
try {
  fs.copySync(
    path.join(scriptsDir, "registration-popup-script", "index.js"),
    path.join(staticScriptsDir, "registration-popup-script.js")
  );
  console.log("Registration script copied to static folder");
} catch (err) {
  console.error("Error copying registration script", err);
  process.exit(1);
}

console.log(
  "Script is now available at: /scripts/registration-popup-script.js"
);

// Log environment variable usage information
console.log("\nEnvironment variables used by the script:");
console.log(
  " - IFRAME_REGISTRATION_API_KEY: " +
    (process.env.IFRAME_REGISTRATION_API_KEY || "(not set)")
);
