const fs = require("fs-extra");
const path = require("path");

// Make sure the registration script is copied to the public folder
exports.onPostBuild = async ({ reporter }) => {
  const scriptsDir = path.join(process.cwd(), "src", "scripts");
  const publicScriptsDir = path.join(process.cwd(), "public", "scripts");

  // Ensure the scripts directory exists in public
  await fs.ensureDir(publicScriptsDir);

  // Copy the registration script to the public folder
  try {
    await fs.copy(
      path.join(scriptsDir, "registration-popup-script", "index.js"),
      path.join(publicScriptsDir, "registration-popup-script.js")
    );
    reporter.info("Registration script copied to public folder");
  } catch (err) {
    reporter.error("Error copying registration script", err);
  }
};
