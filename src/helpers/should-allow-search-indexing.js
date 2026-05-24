/**
 * Search indexing at build time (Gatsby inlines GATSBY_*).
 * Allow only when deploy env is production AND GATSBY_NOINDEX is not set.
 * LP / staging / dev use GATSBY_NOINDEX=1 and/or GATSBY_ENV !== production.
 *
 * CommonJS only — required from gatsby-node.js (Node require, no ESM).
 */
function shouldAllowSearchIndexing() {
  const noIndexFlag = Boolean(Number(process.env.GATSBY_NOINDEX));
  const isProductionEnv = process.env.GATSBY_ENV === "production";
  return isProductionEnv && !noIndexFlag;
}

module.exports = { shouldAllowSearchIndexing };
