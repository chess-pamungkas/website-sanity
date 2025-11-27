require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const languages = require(`${__dirname}/src/locales/language.config`);
const {
  processLanguagesForConfig,
} = require(`${__dirname}/src/locales/processLanguages`);

const indexedLocaleData = processLanguagesForConfig(languages.uniqueList);
exports.onRenderBody = ({ setHtmlAttributes }) => {
  setHtmlAttributes({ lang: languages.list.id });
};

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
    ...(process.env.GATSBY_GOOGLE_TAG_MANAGER
      ? [
          {
            resolve: "gatsby-plugin-google-tagmanager",
            options: {
              id: process.env.GATSBY_GOOGLE_TAG_MANAGER,
              defaultDataLayer: { platform: "gatsby" },
              // Enable GTM in development for testing
              includeInDevelopment:
                process.env.GATSBY_ENABLE_GTM_DEV === "true",
              // Route change event name
              routeChangeEventName: "gatsby-route-change",
            },
          },
        ]
      : []),
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
