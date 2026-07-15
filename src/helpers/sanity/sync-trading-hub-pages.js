const path = require("path");
const { getSanityPublishSite } = require("./publish-site");
const { ENTITY_LANGUAGES } = require("../lang.config");

function normalizeSanityDocumentId(id) {
  if (id == null || id === "") return "";
  return String(id).replace(/^drafts\./, "");
}

function isManagedTradingHubPagePath(pagePath) {
  return /^\/trading-hub\/[^/]+(\/[^/]+)?\/$/.test(pagePath);
}

function isManagedTradingHubArticlePath(pagePath) {
  return /^\/trading-hub\/[^/]+\/[^/]+\/$/.test(pagePath);
}

function normalizeRelatedArticleIds(relatedArticles) {
  return (Array.isArray(relatedArticles) ? relatedArticles : [])
    .map((entry) =>
      normalizeSanityDocumentId(
        typeof entry === "string" ? entry : entry?._id || entry?.sanityId
      )
    )
    .filter((id) => Boolean(id) && id !== "null");
}

function createLocalizedRedirects({ createRedirect, fromPath, toPath, isPermanent }) {
  createRedirect({ fromPath, toPath, isPermanent });
  ENTITY_LANGUAGES.forEach((lang) => {
    const prefix = lang.URIPart || "";
    if (!prefix) return;
    createRedirect({
      fromPath: `${prefix}${fromPath}`,
      toPath: `${prefix}${toPath}`,
      isPermanent,
    });
  });
}

async function syncTradingHubPages({
  actions,
  reporter,
  getNodes,
  getNodesByType,
}) {
  const { createPage, deletePage, createRedirect } = actions;
  const publishSite = getSanityPublishSite();
  const categoryTemplate = path.resolve(
    process.cwd(),
    "src/templates/trading-hub-category.js"
  );
  const articleTemplate = path.resolve(
    process.cwd(),
    "src/templates/trading-hub-article.js"
  );

  const existingArticlePages = getNodes()
    .filter(
      (node) =>
        node.internal.type === "SitePage" &&
        isManagedTradingHubArticlePath(node.path)
    )
    .map((node) => ({
      path: node.path,
      articleId: node.context?.articleId,
    }));

  const categories = (getNodesByType("SanityHubCategory") || []).filter(
    (category) => category.isActive !== false
  );

  const articles = (getNodesByType("SanityHubArticle") || []).filter(
    (article) => {
      const sites = article.publishToSites;
      if (!Array.isArray(sites) || sites.length === 0) return true;
      return sites.includes(publishSite);
    }
  );

  const expectedPaths = new Set();
  const articleIdToPath = new Map();

  // Always-built SSR bases for draft-only slugs (duplicates that are not published yet).
  // Pretty /trading-hub/{slug}/ URLs 404 until a Vercel rebuild creates that path;
  // /api/preview redirects here with ?categorySlug=&articleSlug= instead.
  // Do NOT set matchPath — it breaks Gatsby SSR on Vercel (reach-router match null / window).
  const draftCategoryPreviewPath = `/trading-hub/draft-preview/category/`;
  const draftArticlePreviewPath = `/trading-hub/draft-preview/article/`;
  expectedPaths.add(draftCategoryPreviewPath);
  expectedPaths.add(draftArticlePreviewPath);

  createPage({
    path: draftCategoryPreviewPath,
    component: categoryTemplate,
    context: {
      categoryId: "__trading_hub_draft_catch_all__",
      categorySlug: "",
      isDraftCatchAll: true,
    },
  });

  createPage({
    path: draftArticlePreviewPath,
    component: articleTemplate,
    context: {
      articleId: "__trading_hub_draft_catch_all__",
      categorySlug: "",
      articleSlug: "",
      relatedContentMode: null,
      relatedArticleIds: [],
      isDraftCatchAll: true,
    },
  });

  categories.forEach((category) => {
    const categorySlug = category.slug?.current;
    if (!categorySlug) return;

    const pagePath = `/trading-hub/${categorySlug}/`;
    expectedPaths.add(pagePath);
    createPage({
      path: pagePath,
      component: categoryTemplate,
      context: {
        categoryId: category.id,
        categorySlug,
      },
    });
  });

  articles.forEach((article) => {
    const articleSlug = article.slug?.current;
    const categorySlug =
      article.categorySlug || article.category?.slug?.current;
    if (!articleSlug || !categorySlug) return;

    const pagePath = `/trading-hub/${categorySlug}/${articleSlug}/`;
    expectedPaths.add(pagePath);
    articleIdToPath.set(article.id, pagePath);

    createPage({
      path: pagePath,
      component: articleTemplate,
      context: {
        articleId: article.id,
        categorySlug,
        articleSlug,
        relatedContentMode: article.relatedContentMode || null,
        relatedArticleIds: normalizeRelatedArticleIds(article.relatedArticles),
      },
    });
  });

  existingArticlePages.forEach(({ path: oldPath, articleId }) => {
    if (!articleId || expectedPaths.has(oldPath)) return;

    const newPath = articleIdToPath.get(articleId);
    if (!newPath || newPath === oldPath) return;

    createLocalizedRedirects({
      createRedirect,
      fromPath: oldPath,
      toPath: newPath,
      isPermanent: true,
    });
  });

  getNodes()
    .filter((node) => node.internal.type === "SitePage")
    .forEach((page) => {
      if (
        isManagedTradingHubPagePath(page.path) &&
        !expectedPaths.has(page.path)
      ) {
        deletePage(page);
      }
    });

  reporter.info(
    `Trading Hub: synced ${expectedPaths.size} page path(s) from ${articles.length} article node(s)`
  );
}

module.exports = {
  syncTradingHubPages,
  isManagedTradingHubPagePath,
  isManagedTradingHubArticlePath,
};
