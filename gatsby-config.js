const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
require("dotenv").config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});

const languages = require(`${__dirname}/src/locales/language.config`);
const { processLanguagesForConfig } = require(
  `${__dirname}/src/locales/processLanguages`,
);

const indexedLocaleData = processLanguagesForConfig(languages.uniqueList);

module.exports = {
  siteMetadata: {
    title: `website`,
    siteUrl: `https://www.yourdomain.tld`,
    indexedLocaleData,
  },
  // Optimize query performance
  flags: {
    FAST_DEV: true,
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
    PARALLEL_SOURCING: true,
  },
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-image",
    "gatsby-plugin-sitemap",
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
    // GTM loaded via deferred script in gatsby-ssr (10s after load) for Lighthouse/TBT; not using plugin
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
  ],
};
