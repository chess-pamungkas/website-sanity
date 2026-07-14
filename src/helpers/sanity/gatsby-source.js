const { createClient } = require("@sanity/client");
const {
  PUBLISHED_ID_FILTER,
  filterPublishedSanityDocuments,
  isPublishedSanityDocument,
} = require("./published-only");

function getSanityClient(options = {}) {
  const { preview = false } = options;
  const token = process.env.SANITY_API_TOKEN;

  return createClient({
    projectId:
      process.env.GATSBY_SANITY_PROJECT_ID ||
      process.env.SANITY_PROJECT_ID ||
      "ms3sz7xq",
    dataset:
      process.env.GATSBY_SANITY_DATASET ||
      process.env.SANITY_DATASET ||
      "production",
    apiVersion: "2024-01-01",
    useCdn: !preview,
    token: preview ? token : token || undefined,
    perspective: preview ? "previewDrafts" : "published",
    ...(preview ? { stega: false } : {}),
  });
}

function getSanityFetchClient(options = {}) {
  return getSanityClient(options);
}

function buildLandingPageQuery(preview = false) {
  const idFilter = preview ? "true" : PUBLISHED_ID_FILTER;
  return `
  *[_type == "tradingHubPage" && ${idFilter}][0]{
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

function buildCategoriesQuery(preview = false) {
  const idFilter = preview ? "true" : PUBLISHED_ID_FILTER;
  return `
  *[_type == "hubCategory" && isActive == true && ${idFilter}] | order(sortOrder asc) {
    _id,
    sortOrder,
    isActive,
    slug,
    title
  }
`;
}

function buildArticlesQuery(preview = false) {
  const idFilter = preview ? "true" : PUBLISHED_ID_FILTER;
  // Preview: allow drafts without publishedAt so never-published articles can be reviewed
  const publishedAtFilter = preview ? "true" : "defined(publishedAt)";
  return `
  *[_type == "hubArticle" && ${idFilter} && ${publishedAtFilter}] | order(orderRank asc, publishedAt desc) {
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

async function fetchTradingHubData(options = {}) {
  const preview = options.preview === true;
  const client = getSanityFetchClient({ preview });

  if (preview && !process.env.SANITY_API_TOKEN) {
    throw new Error("SANITY_API_TOKEN is required for draft preview fetches");
  }

  const [landingPage, categories, articles] = await Promise.all([
    client.fetch(buildLandingPageQuery(preview)),
    client.fetch(buildCategoriesQuery(preview)),
    client.fetch(buildArticlesQuery(preview)),
  ]);

  if (preview) {
    return {
      landingPage: landingPage || null,
      categories: Array.isArray(categories) ? categories : [],
      articles: Array.isArray(articles) ? articles : [],
      isPreview: true,
    };
  }

  const publishedLandingPage =
    landingPage && isPublishedSanityDocument(landingPage) ? landingPage : null;

  return {
    landingPage: publishedLandingPage,
    categories: filterPublishedSanityDocuments(categories),
    articles: filterPublishedSanityDocuments(articles),
    isPreview: false,
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
  const sanitizedId = String(doc._id || "").replace(/^drafts\./, "");
  return { ...doc, id: sanitizedId || doc._id, sanityId: sanitizedId || doc._id };
}

/**
 * Fetches fresh Trading Hub data from Sanity at request time (SSR).
 * Pass `{ preview: true }` to read draft overlays (requires SANITY_API_TOKEN).
 */
async function fetchTradingHubDataSSR(options = {}) {
  const preview = options.preview === true;
  const { landingPage, categories, articles, isPreview } =
    await fetchTradingHubData({ preview });

  return {
    landingPage: landingPage ? normalizeSanityDocForSSR(landingPage) : null,
    categories: (categories || []).map(normalizeSanityDocForSSR),
    articles: (articles || []).map((a) =>
      normalizeSanityDocForSSR({
        ...a,
        category: a.category ? normalizeSanityDocForSSR(a.category) : null,
      })
    ),
    isPreview: Boolean(isPreview),
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
