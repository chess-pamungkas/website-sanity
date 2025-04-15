#!/usr/bin/env node

/**
 * This script copies the registration popup script to the static folder
 * so it can be accessed during development.
 * It also creates a minified version of the script.
 *
 * Environment variables used by the script:
 * - IFRAME_REGISTRATION_API_KEY - Variable used for API key authentication
 */

const fs = require("fs-extra");
const path = require("path");
const { minify } = require("terser");

// Fixed paths
const root = process.cwd(); // Get the current working directory
const scriptsDir = path.join(root, "src", "scripts");
const registrationScriptDir = path.join(
  scriptsDir,
  "registration-popup-script"
);
const registrationScriptFile = path.join(registrationScriptDir, "index.js");

const staticDir = path.join(root, "static");
const staticScriptsDir = path.join(staticDir, "scripts");
const regularOutputPath = path.join(
  staticScriptsDir,
  "registration-popup-script.js"
);
const minifiedOutputPath = path.join(
  staticScriptsDir,
  "registration-popup-script.min.js"
);

// Output paths for debugging
console.log("Current working directory:", root);
console.log("Registration script source:", registrationScriptFile);
console.log("Regular output path:", regularOutputPath);
console.log("Minified output path:", minifiedOutputPath);

// Ensure directories exist
fs.ensureDirSync(staticDir);
fs.ensureDirSync(staticScriptsDir);

async function processScripts() {
  try {
    // Check if source file exists
    if (!fs.existsSync(registrationScriptFile)) {
      throw new Error(`Source file not found: ${registrationScriptFile}`);
    }

    // Copy the unminified registration script
    fs.copySync(registrationScriptFile, regularOutputPath);
    console.log("✓ Registration script copied to static folder");

    // Read the source file for minification
    const sourceCode = fs.readFileSync(registrationScriptFile, "utf8");

    // Minify the code
    console.log("Minifying registration script...");
    const minifyOptions = {
      compress: {
        drop_console: false, // Keep console logs for debugging
        drop_debugger: true,
      },
      mangle: true,
      output: {
        comments: /^!|@license|@author|copyright/i, // Preserve important comments
      },
    };

    const minified = await minify(sourceCode, minifyOptions);

    if (minified.error) {
      throw new Error(`Minification failed: ${minified.error}`);
    }

    // Write the minified file
    fs.writeFileSync(minifiedOutputPath, minified.code);
    console.log("✓ Minified registration script created");

    // Calculate size reduction
    const originalSize = fs.statSync(regularOutputPath).size;
    const minifiedSize = fs.statSync(minifiedOutputPath).size;
    const reduction = (
      ((originalSize - minifiedSize) / originalSize) *
      100
    ).toFixed(2);

    console.log("\nSize comparison:");
    console.log(` - Original: ${formatBytes(originalSize)}`);
    console.log(` - Minified: ${formatBytes(minifiedSize)}`);
    console.log(` - Reduction: ${reduction}%`);

    console.log("\nScripts are now available at:");
    console.log(` - Regular:  /scripts/registration-popup-script.js`);
    console.log(` - Minified: /scripts/registration-popup-script.min.js`);

    // Log environment variable usage information
    console.log("\nEnvironment variables used by the script:");
    console.log(
      " - IFRAME_REGISTRATION_API_KEY: " +
        (process.env.IFRAME_REGISTRATION_API_KEY || "(not set)")
    );
  } catch (err) {
    console.error("Error processing registration script:", err);
    process.exit(1);
  }
}

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// Run the script
processScripts();
