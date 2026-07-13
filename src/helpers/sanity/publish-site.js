/**
 * Maps the current Gatsby build target to Sanity `publishToSites` values.
 * Override with GATSBY_SANITY_PUBLISH_SITE (com | jp | lp-com).
 */
function getSanityPublishSite() {
  const explicit = (process.env.GATSBY_SANITY_PUBLISH_SITE || "").trim();
  if (explicit) return explicit;

  if (process.env.GATSBY_IS_LP === "1" || process.env.GATSBY_IS_LP === "true") {
    return "lp-com";
  }

  const siteUrl = (process.env.GATSBY_SITE_URL || "").toLowerCase();
  if (siteUrl.includes("oqtima.co")) return "jp";

  return "com";
}

function articleMatchesPublishSite(article, site = getSanityPublishSite()) {
  const sites = article?.publishToSites;
  if (!Array.isArray(sites) || sites.length === 0) return true;
  return sites.includes(site);
}

module.exports = {
  getSanityPublishSite,
  articleMatchesPublishSite,
};
