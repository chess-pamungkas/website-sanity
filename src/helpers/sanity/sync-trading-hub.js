const {
  fetchTradingHubData,
  createSanityNodeFactory,
  filterPublishedSanityDocuments,
} = require("./gatsby-source");
const { syncTradingHubPages, isManagedTradingHubPagePath } = require("./sync-trading-hub-pages");

const DEFAULT_NEW_BADGE_LABEL = [{ language: "en", value: "New", _key: "en" }];
const DEFAULT_SEARCH_PLACEHOLDER = "What do you want to learn today?";

const TRADING_HUB_NODE_TYPES = [
  "SanityTradingHubPage",
  "SanityHubCategory",
  "SanityHubArticle",
];

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

async function syncTradingHubNodes({
  actions,
  createNodeId,
  createContentDigest,
  getNodesByType,
  reporter,
}) {
  const { createNode, touchNode } = actions;
  const { landingPage, categories, articles } = await fetchTradingHubData();
  const publishedArticles = filterPublishedSanityDocuments(articles);
  const createSanityNode = createSanityNodeFactory({
    createNode,
    createNodeId,
    createContentDigest,
    touchNode,
  });
  const activeNodeIds = new Set();

  if (landingPage) {
    const nodeId = createSanityNode("SanityTradingHubPage", {
      ...landingPage,
      newBadgeLabel: landingPage.newBadgeLabel ?? DEFAULT_NEW_BADGE_LABEL,
      searchPlaceholder: normalizeLocalizedStringArray(
        landingPage.searchPlaceholder,
        DEFAULT_SEARCH_PLACEHOLDER
      ),
    });
    if (nodeId) activeNodeIds.add(nodeId);
  }

  categories.forEach((category) => {
    const nodeId = createSanityNode("SanityHubCategory", category);
    if (nodeId) activeNodeIds.add(nodeId);
  });

  publishedArticles.forEach((article) => {
    const categoryId = article.category?._id;
    const categorySlug = article.category?.slug?.current || "";
    const nodeId = createSanityNode("SanityHubArticle", {
      ...article,
      heroImageDesktop: article.heroImageDesktop || article.heroImage || null,
      heroImageMobile:
        article.heroImageMobile ||
        article.heroImageDesktop ||
        article.heroImage ||
        null,
      categorySlug,
      ...(categoryId && article.category
        ? {
            category: {
              ...article.category,
              id: createNodeId(`SanityHubCategory-${categoryId}`),
            },
          }
        : {}),
    });
    if (nodeId) activeNodeIds.add(nodeId);
  });

  TRADING_HUB_NODE_TYPES.forEach((type) => {
    getNodesByType(type).forEach((node) => {
      if (!activeNodeIds.has(node.id)) {
        actions.deleteNode(node);
      }
    });
  });

  reporter.info(
    `Trading Hub: synced ${categories.length} categories and ${publishedArticles.length} published articles from Sanity`
  );

  return { landingPage, categories, articles: publishedArticles };
}

module.exports = {
  syncTradingHubNodes,
  syncTradingHubPages,
  isManagedTradingHubPagePath,
};
