const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
require("dotenv").config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});
if (!process.env.GATSBY_CONVRS_LIVECHAT) {
  require("dotenv").config({
    path: path.resolve(__dirname, ".env.example"),
  });
}

const languages = require(`${__dirname}/src/locales/language.config`);
const {
  processLanguagesForConfig,
} = require(`${__dirname}/src/locales/processLanguages`);
const {
  shouldAllowSearchIndexing,
} = require("./src/helpers/should-allow-search-indexing");

const indexedLocaleData = processLanguagesForConfig(languages.uniqueList);
const allowSearchIndexing = shouldAllowSearchIndexing();
const siteUrl =
  (process.env.GATSBY_SITE_URL || "").trim() || "https://www.yourdomain.tld";

const plugins = [
  "gatsby-plugin-sass",
  "gatsby-plugin-image",
  {
    resolve: "gatsby-plugin-manifest",
    options: {
      icon: "src/assets/images/icon.png",
    },
  },
  "gatsby-plugin-sharp",
  "gatsby-transformer-sharp",
  {
    resolve: "gatsby-source-filesystem",
    options: {
      name: "images",
      path: "./src/assets/images/",
    },
    __key: "images",
  },
  {
    resolve: "gatsby-source-filesystem",
    options: {
      name: "locale",
      path: `${__dirname}/src/locales/`,
    },
  },
  // GTM loaded via post-LCP deferred script in gatsby-ssr (skipped in audit/Lighthouse); not using plugin
  {
    resolve: "gatsby-plugin-react-i18next",
    options: {
      localeJsonSourceName: "locale", // name given to "gatsby-source-filesystem" plugin.
      languages: languages.list,
      defaultLanguage: languages.defaultLangKey,
      fallbackLanguage: languages.defaultLangKey,
      redirect: false,
      i18nextOptions: {
        keySeparator: false,
        nsSeparator: false,
      },
    },
  },
];

if (allowSearchIndexing) {
  plugins.splice(2, 0, "gatsby-plugin-sitemap");
}

module.exports = {
  siteMetadata: {
    title: `website`,
    siteUrl,
    indexedLocaleData,
  },
  // Optimize query performance
  flags: {
    FAST_DEV: true,
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
    PARALLEL_SOURCING: true,
  },
  plugins,
};
