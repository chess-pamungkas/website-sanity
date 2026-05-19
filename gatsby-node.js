const fs = require("fs-extra");
const path = require("path");

// Build deferred fonts CSS and copy fonts to static/ before any build/develop (keeps them out of webpack critical path)
// Compress hero WebP images (globe*.webp) to reduce Lighthouse "Improve image delivery" (~10 KiB)
exports.onPreInit = async () => {
  require("./src/scripts/build-deferred-fonts-css/index.js");
  try {
    await require("./scripts/compress-hero-images.js");
  } catch (e) {
    // no-op if script or sharp fails
  }
};

// Replace debug's node.js with SSR-safe shim to avoid "WARN" = namespaces in SSR bundle (render-page.js)
// Use i18next ESM build in client bundle for better tree-shaking (reduces ~6.6 KiB unused JS in Lighthouse)
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  if (stage === "build-html" || stage === "develop-html") {
    const webpack = require("webpack");
    actions.setWebpackConfig({
      plugins: [
        new webpack.NormalModuleReplacementPlugin(
          /[\\/]debug[\\/]src[\\/]node\.js$/,
          path.resolve(__dirname, "src/scripts/ssr-debug-shim/node.js")
        ),
      ],
    });
  }
  // Client: develop + build-javascript. DEV_SSR uses develop-html for in-dev page SSR — keep
  // i18n aliases aligned so SSR and client both resolve TransWithoutContext + Babel helpers the same way.
  if (
    stage === "develop" ||
    stage === "build-javascript" ||
    stage === "develop-html"
  ) {
    const webpack = require("webpack");
    const i18nextEsm = path.resolve(
      __dirname,
      "node_modules/i18next/dist/esm/i18next.js"
    );
    const babelRuntimeHelpersEsm = path.resolve(
      __dirname,
      "node_modules/@babel/runtime/helpers/esm"
    );
    const transStub = path.resolve(
      __dirname,
      "src/stubs/trans-without-context.js"
    );
    const reactI18nextEntry = path.resolve(
      __dirname,
      "src/stubs/react-i18next-entry.js"
    );
    const htmlParseStringifyEsm = path.resolve(
      __dirname,
      "node_modules/html-parse-stringify/dist/html-parse-stringify.module.js"
    );
    actions.setWebpackConfig({
      resolve: {
        alias: {
          i18next: i18nextEsm,
          // Precompiled packages (e.g. react-i18next) import @babel/runtime/helpers/* which
          // otherwise resolves to CJS (require). In the browser that surfaces as "require is not defined".
          "@babel/runtime/helpers": babelRuntimeHelpersEsm,
          // Main package entry (require("react-i18next")): avoid real index → Trans → TransWithoutContext → html-parse-stringify CJS.
          "react-i18next$": reactI18nextEntry,
          "react-i18next/dist/es/index.js": reactI18nextEntry,
          "html-parse-stringify": htmlParseStringifyEsm,
          "react-i18next/dist/es/TransWithoutContext.js": transStub,
          "react-i18next/dist/commonjs/TransWithoutContext.js": transStub,
          "react-i18next/dist/es/Trans.js": path.resolve(
            __dirname,
            "src/stubs/react-i18next-Trans.js"
          ),
          "react-i18next/dist/commonjs/Trans.js": path.resolve(
            __dirname,
            "src/stubs/react-i18next-Trans.js"
          ),
          // Package exports subpath (webpack resolves before dist/es/...); keep stub in sync.
          "react-i18next/TransWithoutContext": transStub,
          "react-i18next/TransWithoutContext.js": transStub,
        },
      },
      plugins: [
        // Force any resolution of TransWithoutContext to our stub (catches plugin bundling)
        // No $ anchor: resource paths may include query strings in dev; $ broke replacement on some hosts.
        new webpack.NormalModuleReplacementPlugin(
          /[\\/]react-i18next[\\/]dist[\\/](es|commonjs)[\\/]TransWithoutContext\.js/,
          transStub
        ),
      ],
      // Dedupe localization-variables.js (Lighthouse "Duplicated JavaScript" ~0.8 KiB). Merge with existing splitChunks.
      ...(stage === "build-javascript"
        ? (() => {
            const config = getConfig();
            const existing = config?.optimization?.splitChunks?.cacheGroups || {};
            return {
              optimization: {
                splitChunks: {
                  ...config?.optimization?.splitChunks,
                  cacheGroups: {
                    ...existing,
                    localizationVars: {
                      // Function so we match regardless of path format (Windows, query strings, etc.)
                      test: (module) => {
                        const id = module.identifier?.() || module.resource || "";
                        return /localization-variables\.js/.test(id);
                      },
                      name: "localization-vars",
                      chunks: "all",
                      enforce: true,
                      priority: 20,
                    },
                    // Dedupe critical icons and menu config (Lighthouse "Duplicated JavaScript" ~2.8 KiB)
                    sharedIconsAndMenu: {
                      test: (module) => {
                        const id = module.identifier?.() || module.resource || "";
                        return /icons[/\\]critical\.js/.test(id) || /menu-structure\.config\.js/.test(id);
                      },
                      name: "shared-icons-menu",
                      chunks: "all",
                      enforce: true,
                      priority: 19,
                    },
                  },
                },
              },
            };
          })()
        : {}),
    });
  }
};

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
