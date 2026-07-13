import {
  getLocalizedString,
  getLocalizedValue,
  getLocalizedObject,
} from "./get-localized-value";
import { buildArticleSearchText } from "./trading-hub-search";

export function normalizeSanityDocumentId(id) {
  if (id == null || id === "") return "";
  return String(id).replace(/^drafts\./, "");
}

function collectRelatedArticleIds(relatedArticleIds = [], relatedArticles = []) {
  return new Set(
    [
      ...relatedArticleIds,
      ...relatedArticles.map((ref) =>
        typeof ref === "string" ? ref : ref?._id || ref?.id || ref?.sanityId
      ),
    ]
      .map(normalizeSanityDocumentId)
      .filter((id) => Boolean(id) && id !== "null")
  );
}

function articleMatchesRelatedIds(entry, manualIds) {
  const candidateIds = [
    normalizeSanityDocumentId(entry.sanityId),
    normalizeSanityDocumentId(entry._id),
    entry.id,
  ].filter(Boolean);

  return candidateIds.some((id) => manualIds.has(id));
}

export function mapLandingPage(node, locale) {
  if (!node) return null;

  const seo = getLocalizedValue(node.seo, locale) || {};

  return {
    heroBadge: getLocalizedString(node.heroBadge, locale),
    heroTitle: getLocalizedString(node.heroTitle, locale),
    heroSubtitle: getLocalizedString(node.heroSubtitle, locale),
    heroCtaLabel: getLocalizedString(node.heroCtaLabel, locale),
    heroCtaUrl: node.heroCtaUrl || "",
    heroImageDesktop: node.heroImageDesktop,
    heroImageMobile: node.heroImageMobile,
    sectionEyebrow: getLocalizedString(node.sectionEyebrow, locale),
    allTabLabel: getLocalizedString(node.allTabLabel, locale),
    hubTitle: getLocalizedString(node.hubTitle, locale),
    searchPlaceholder:
      getLocalizedString(node.searchPlaceholder, locale) ||
      "What do you want to learn today?",
    loadMoreLabel: getLocalizedString(node.loadMoreLabel, locale),
    newBadgeLabel: getLocalizedString(node.newBadgeLabel, locale),
    seo,
  };
}

export function mapCategory(node, locale) {
  if (!node) return null;

  return {
    id: node.id,
    slug: node.slug,
    title: getLocalizedString(node.title, locale),
    sortOrder: node.sortOrder,
  };
}

export function mapArticle(node, locale) {
  if (!node) return null;

  const seo = getLocalizedObject(node.seo, locale) || {};
  const category = node.category || {};
  const author = node.author || {};

  const mapped = {
    id: node.id,
    sanityId: node.sanityId || node._id,
    title: getLocalizedString(node.title, locale),
    subtitle: getLocalizedString(node.subtitle, locale),
    body: getLocalizedValue(node.body, locale) || [],
    slug: node.slug,
    orderRank: node.orderRank,
    publishedAt: node.publishedAt,
    readTimeMinutes: node.readTimeMinutes,
    isNew: node.isNew === true,
    publishToSites: node.publishToSites,
    thumbnail: node.thumbnail,
    heroImageDesktop: node.heroImageDesktop || node.heroImage,
    heroImageMobile: node.heroImageMobile,
    heroImage: node.heroImage,
    categorySlug: node.categorySlug || category.slug?.current,
    categoryTitle: getLocalizedString(category.title, locale),
    authorName: author.name || "",
    authorRole: getLocalizedString(author.role, locale),
    authorBio: getLocalizedString(author.bio, locale),
    authorPhoto: author.photo || null,
    relatedContentMode: node.relatedContentMode,
    relatedArticles: node.relatedArticles || [],
    locale,
    seo,
  };

  mapped.searchText = buildArticleSearchText(mapped);

  return mapped;
}

export function sortArticlesByOrderRank(articles) {
  return [...articles].sort((a, b) => {
    const rankA = a.orderRank || "";
    const rankB = b.orderRank || "";

    if (rankA && rankB && rankA !== rankB) {
      return rankA.localeCompare(rankB);
    }
    if (rankA && !rankB) return -1;
    if (!rankA && rankB) return 1;

    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  });
}

export function resolveRelatedArticles(
  article,
  allArticles,
  locale,
  limit = 4,
  relatedArticleIds = []
) {
  if (!article) return [];

  const mapped = allArticles
    .map((node) => mapArticle(node, locale))
    .filter((entry) => entry && entry.id !== article.id);

  const manualIds = collectRelatedArticleIds(
    relatedArticleIds,
    article.relatedArticles
  );

  const matchesManual = (entry) => articleMatchesRelatedIds(entry, manualIds);

  if (article.relatedContentMode === "manual") {
    return mapped.filter(matchesManual).slice(0, limit);
  }

  if (article.relatedContentMode === "sameCategory") {
    return mapped
      .filter((entry) => entry.categorySlug === article.categorySlug)
      .slice(0, limit);
  }

  const manual = mapped.filter(matchesManual);
  const fallback = mapped.filter(
    (entry) =>
      !matchesManual(entry) && entry.categorySlug === article.categorySlug
  );

  return [...manual, ...fallback].slice(0, limit);
}
