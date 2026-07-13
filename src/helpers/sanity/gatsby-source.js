const { createClient } = require("@sanity/client");
const {
  PUBLISHED_ID_FILTER,
  filterPublishedSanityDocuments,
  isPublishedSanityDocument,
} = require("./published-only");

function getSanityClient() {
  return createClient({
    projectId:
      process.env.GATSBY_SANITY_PROJECT_ID ||
      process.env.SANITY_PROJECT_ID ||
      "ms3sz7xq",
    dataset:
      process.env.GATSBY_SANITY_DATASET || process.env.SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  });
}

function getSanityFetchClient() {
  // Public frontend always reads the published perspective only.
  return getSanityClient().withConfig({ perspective: "published" });
}

function buildLandingPageQuery() {
  return `
  *[_type == "tradingHubPage" && ${PUBLISHED_ID_FILTER}][0]{
    _id,
    heroBadge,
    heroTitle,
    heroSubtitle,
    heroCtaLabel,
    heroCtaUrl,
    heroImageDesktop{asset->{_id, url}},
    heroImageMobile{asset->{_id, url}},
    sectionEyebrow,
    allTabLabel,
    hubTitle,
    searchPlaceholder,
    loadMoreLabel,
    newBadgeLabel,
    seo
  }
`;
}

function buildCategoriesQuery() {
  return `
  *[_type == "hubCategory" && isActive == true && ${PUBLISHED_ID_FILTER}] | order(sortOrder asc) {
    _id,
    sortOrder,
    isActive,
    slug,
    title
  }
`;
}

function buildArticlesQuery() {
  return `
  *[_type == "hubArticle" && ${PUBLISHED_ID_FILTER} && defined(publishedAt)] | order(orderRank asc, publishedAt desc) {
    _id,
    publishToSites,
    orderRank,
    slug,
    title,
    subtitle,
    body,
    publishedAt,
    readTimeMinutes,
    isNew,
    thumbnail{asset->{_id, url}},
    heroImageDesktop{asset->{_id, url}},
    heroImageMobile{asset->{_id, url}},
    heroImage{asset->{_id, url}},
    relatedContentMode,
    "relatedArticles": array::compact(relatedArticles[]->._id),
    category->{
      _id,
      slug,
      title
    },
    author->{
      name,
      photo{asset->{_id, url}, hotspot, crop},
      role,
      bio
    },
    seo
  }
`;
}

async function fetchTradingHubData() {
  const client = getSanityFetchClient();
  const [landingPage, categories, articles] = await Promise.all([
    client.fetch(buildLandingPageQuery()),
    client.fetch(buildCategoriesQuery()),
    client.fetch(buildArticlesQuery()),
  ]);

  const publishedLandingPage =
    landingPage && isPublishedSanityDocument(landingPage) ? landingPage : null;

  return {
    landingPage: publishedLandingPage,
    categories: filterPublishedSanityDocuments(categories),
    articles: filterPublishedSanityDocuments(articles),
  };
}

function normalizeInternationalizedArrays(data) {
  if (data == null) return data;

  if (Array.isArray(data)) {
    if (
      data.length > 0 &&
      data.every(
        (item) =>
          item &&
          typeof item === "object" &&
          typeof item.language === "string" &&
          "value" in item
      )
    ) {
      return data.map((item) => ({
        ...item,
        _key: item.language,
      }));
    }
    return data.map(normalizeInternationalizedArrays);
  }

  if (typeof data === "object") {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = normalizeInternationalizedArrays(value);
    }
    return result;
  }

  return data;
}

function createSanityNodeFactory({
  createNode,
  createNodeId,
  createContentDigest,
  touchNode,
}) {
  return function createSanityNode(type, doc) {
    if (!isPublishedSanityDocument(doc)) return null;

    const normalizedDoc = normalizeInternationalizedArrays(doc);
    const nodeId = createNodeId(`${type}-${doc._id}`);

    createNode({
      ...normalizedDoc,
      id: nodeId,
      sanityId: doc._id,
      parent: null,
      children: [],
      internal: {
        type,
        contentDigest: createContentDigest(normalizedDoc),
      },
    });

    if (typeof touchNode === "function") {
      touchNode({ nodeId });
    }

    return nodeId;
  };
}

const TRADING_HUB_LISTEN_QUERY =
  '*[_type in ["hubArticle", "hubCategory", "hubAuthor", "tradingHubPage"]]';

function normalizeSanityDocForSSR(doc) {
  if (!doc || typeof doc !== "object") return doc;
  return { ...doc, id: doc._id, sanityId: doc._id };
}

/**
 * Fetches fresh Trading Hub data from Sanity at request time (SSR).
 * Normalises each document so map-trading-hub-data helpers receive
 * the same shape as Gatsby GraphQL nodes (id, sanityId present).
 */
async function fetchTradingHubDataSSR() {
  const { landingPage, categories, articles } = await fetchTradingHubData();
  return {
    landingPage: landingPage ? normalizeSanityDocForSSR(landingPage) : null,
    categories: (categories || []).map(normalizeSanityDocForSSR),
    articles: (articles || []).map((a) =>
      normalizeSanityDocForSSR({
        ...a,
        category: a.category ? normalizeSanityDocForSSR(a.category) : null,
      })
    ),
  };
}

module.exports = {
  getSanityClient,
  fetchTradingHubData,
  fetchTradingHubDataSSR,
  createSanityNodeFactory,
  TRADING_HUB_LISTEN_QUERY,
  isPublishedSanityDocument,
  filterPublishedSanityDocuments,
};
