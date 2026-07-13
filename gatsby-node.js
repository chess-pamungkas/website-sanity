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
            const existing =
              config?.optimization?.splitChunks?.cacheGroups || {};
            return {
              optimization: {
                splitChunks: {
                  ...config?.optimization?.splitChunks,
                  cacheGroups: {
                    ...existing,
                    localizationVars: {
                      // Function so we match regardless of path format (Windows, query strings, etc.)
                      test: (module) => {
                        const id =
                          module.identifier?.() || module.resource || "";
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
                        const id =
                          module.identifier?.() || module.resource || "";
                        return (
                          /icons[/\\]critical\.js/.test(id) ||
                          /menu-structure\.config\.js/.test(id)
                        );
                      },
                      name: "shared-icons-menu",
                      chunks: "all",
                      enforce: true,
                      priority: 19,
                    },
                    gatsbyReactI18next: {
                      test: (module) => {
                        const id =
                          module.identifier?.() || module.resource || "";
                        return /gatsby-plugin-react-i18next/.test(id);
                      },
                      name: "gatsby-react-i18next",
                      chunks: "all",
                      enforce: true,
                      priority: 18,
                    },
                    recaptchaV3: {
                      test: (module) => {
                        const id =
                          module.identifier?.() || module.resource || "";
                        return /react-google-recaptcha-v3/.test(id);
                      },
                      name: "react-google-recaptcha-v3",
                      chunks: "all",
                      enforce: true,
                      priority: 22,
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

const {
  shouldAllowSearchIndexing,
} = require("./src/helpers/should-allow-search-indexing");

/** Google / Lighthouse require an absolute Sitemap URL (not `/sitemap-index.xml`). */
const getSitemapLine = () => {
  const base = (process.env.GATSBY_SITE_URL || "").trim().replace(/\/$/, "");
  if (!base || !/^https?:\/\//i.test(base)) return null;
  return `Sitemap: ${base}/sitemap-index.xml`;
};

const writeRobotsTxt = async (publicDir, allowIndex) => {
  const robotsPath = path.join(publicDir, "robots.txt");
  const lines = ["User-agent: *"];
  if (allowIndex) {
    lines.push("Allow: /", "");
    const sitemapLine = getSitemapLine();
    if (sitemapLine) lines.push(sitemapLine, "");
  } else {
    lines.push("Disallow: /", "");
  }
  await fs.writeFile(robotsPath, `${lines.join("\n")}\n`, "utf8");
};

const { ENTITY_LANGUAGES } = require("./src/helpers/lang.config");
const {
  syncTradingHubNodes,
  syncTradingHubPages,
} = require("./src/helpers/sanity/sync-trading-hub");
const {
  setupTradingHubWatch,
  registerTradingHubPageSync,
  storeTradingHubSourceHelpers,
} = require("./src/helpers/sanity/gatsby-watch");

const DEFAULT_NEW_BADGE_LABEL = [{ language: "en", value: "New", _key: "en" }];
const DEFAULT_SEARCH_PLACEHOLDER = "What do you want to learn today?";

function normalizeLocalizedStringArray(field, defaultValue = "") {
  if (!Array.isArray(field) || field.length === 0) {
    return [{ language: "en", value: defaultValue, _key: "en" }];
  }

  return field.map((entry) => ({
    ...entry,
    _key: entry._key || entry.language || "en",
    language: entry.language || entry._key || "en",
    value:
      typeof entry?.value === "string" && entry.value.length > 0
        ? entry.value
        : defaultValue,
  }));
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type SanityHubArticleSeoValue {
      title: String
      description: String
      _type: String
    }

    type SanityHubArticleDetailHeroImageAsset {
      _id: String
      url: String
    }

    type SanityHubArticleDetailHeroImage {
      asset: SanityHubArticleDetailHeroImageAsset
    }

    type SanityHubArticleAuthorPhotoAsset {
      _id: String
      url: String
    }

    type SanityHubArticleAuthorPhotoHotspot {
      x: Float
      y: Float
      height: Float
      width: Float
    }

    type SanityHubArticleAuthorPhotoCrop {
      top: Float
      bottom: Float
      left: Float
      right: Float
    }

    type SanityHubArticleAuthorPhoto {
      asset: SanityHubArticleAuthorPhotoAsset
      hotspot: SanityHubArticleAuthorPhotoHotspot
      crop: SanityHubArticleAuthorPhotoCrop
    }

    type SanityHubArticle implements Node {
      orderRank: String
      sanityId: String
      relatedContentMode: String
      relatedArticles: [String]
      heroImageDesktop: SanityHubArticleDetailHeroImage
      heroImageMobile: SanityHubArticleDetailHeroImage
    }
  `);
};

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    SanityTradingHubPage: {
      newBadgeLabel: {
        type: "[SanityTradingHubPageLoadMoreLabel]",
        resolve: (source) => source.newBadgeLabel ?? DEFAULT_NEW_BADGE_LABEL,
      },
      searchPlaceholder: {
        type: "[SanityTradingHubPageSearchPlaceholder]",
        resolve: (source) =>
          normalizeLocalizedStringArray(
            source.searchPlaceholder,
            DEFAULT_SEARCH_PLACEHOLDER
          ),
      },
    },
    SanityTradingHubPageSearchPlaceholder: {
      value: {
        type: "String",
        resolve: (source) => source?.value ?? "",
      },
    },
    SanityHubArticle: {
      orderRank: {
        type: "String",
        resolve: (source) => source.orderRank || null,
      },
      relatedContentMode: {
        type: "String",
        resolve: (source) => source.relatedContentMode || null,
      },
      relatedArticles: {
        type: "[String]",
        resolve: (source) =>
          (source.relatedArticles || [])
            .map((entry) =>
              typeof entry === "string" ? entry : entry?._id
            )
            .filter((id) => Boolean(id) && id !== "null"),
      },
      sanityId: {
        type: "String",
        resolve: (source) => source.sanityId || source._id || null,
      },
      isNew: {
        type: "Boolean",
        resolve: (source) => source.isNew === true,
      },
      categorySlug: {
        type: "String",
        resolve: (source) =>
          source.categorySlug || source.category?.slug?.current || "",
      },
      heroImageDesktop: {
        type: "SanityHubArticleDetailHeroImage",
        resolve: (source) => source.heroImageDesktop || source.heroImage || null,
      },
      heroImageMobile: {
        type: "SanityHubArticleDetailHeroImage",
        resolve: (source) =>
          source.heroImageMobile ||
          source.heroImageDesktop ||
          source.heroImage ||
          null,
      },
    },
    SanityHubArticleSeo: {
      value: {
        type: "SanityHubArticleSeoValue",
        resolve: (source) => source?.value ?? null,
      },
    },
  });
};

exports.sourceNodes = async (helpers) => {
  const { reporter } = helpers;

  try {
    storeTradingHubSourceHelpers(helpers);
    await syncTradingHubNodes(helpers);
  } catch (error) {
    reporter.warn(`Trading Hub Sanity source skipped: ${error.message}`);
  }
};

exports.createPages = async ({ graphql, actions, reporter, getNodes, getNodesByType }) => {
  const { createRedirect } = actions;

  registerTradingHubPageSync(() =>
    syncTradingHubPages({ actions, reporter, getNodes, getNodesByType })
  );

  await syncTradingHubPages({ actions, reporter, getNodes, getNodesByType });
  setupTradingHubWatch({ actions, reporter, getNodes, getNodesByType });

  const result = await graphql(`
    query TradingHubPages {
      categories: allSanityHubCategory(filter: { isActive: { eq: true } }) {
        nodes {
          id
        }
      }
      articles: allSanityHubArticle {
        nodes {
          id
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild("Trading Hub createPages GraphQL errors", result.errors);
    return;
  }

  const categories = result.data?.categories?.nodes || [];
  const articles = result.data?.articles?.nodes || [];

  if (!categories.length && !articles.length) {
    reporter.warn(
      "Trading Hub: no Sanity categories/articles found — only /trading-hub/ landing will be available."
    );
  }

  const legacyRedirects = [
    { from: "/trading-academy/", to: "/trading-hub/trading-academy/" },
    { from: "/beginners-guide/", to: "/trading-hub/beginners-guide/" },
    { from: "/intermediate-lessons/", to: "/trading-hub/intermediate-lessons/" },
    { from: "/advanced-playbook/", to: "/trading-hub/advanced-playbook/" },
    {
      from: "/platform-setup-guides/",
      to: "/trading-hub/platform-setup-guides/",
    },
  ];

  ENTITY_LANGUAGES.forEach((lang) => {
    const prefix = lang.URIPart || "";
    legacyRedirects.forEach(({ from, to }) => {
      createRedirect({
        fromPath: `${prefix}${from}`,
        toPath: `${prefix}${to}`,
        isPermanent: true,
      });
    });
  });
};

// Make sure the registration script is copied to the public folder
exports.onPostBuild = async ({ reporter }) => {
  const scriptsDir = path.join(process.cwd(), "src", "scripts");
  const publicDir = path.join(process.cwd(), "public");
  const publicScriptsDir = path.join(publicDir, "scripts");

  // Ensure the scripts directory exists in public
  await fs.ensureDir(publicScriptsDir);

  const allowIndex = shouldAllowSearchIndexing();
  try {
    await writeRobotsTxt(publicDir, allowIndex);
    if (!allowIndex) {
      const entries = await fs.readdir(publicDir);
      await Promise.all(
        entries
          .filter((name) => /^sitemap(-|\.)/i.test(name) && /\.xml$/i.test(name))
          .map((name) => fs.remove(path.join(publicDir, name)))
      );
    }
    reporter.info(
      `robots.txt written (${allowIndex ? "Allow /" : "Disallow /"}) — GATSBY_ENV=${
        process.env.GATSBY_ENV ?? "(unset)"
      }, GATSBY_NOINDEX=${process.env.GATSBY_NOINDEX ?? "(unset)"}`
    );
  } catch (err) {
    reporter.error("Error writing robots.txt", err);
  }

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
