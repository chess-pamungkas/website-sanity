/**
 * Resolve category/article slugs for Trading Hub SSR pages.
 * Prefers query params (draft-preview redirect), then matchPath params,
 * then pageContext, then URL pathname.
 */
function pathnameFromRequestUrl(url) {
  if (!url || typeof url !== "string") return "";
  try {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return new URL(url).pathname || "";
    }
  } catch {
    // fall through
  }
  return url.split("?")[0] || "";
}

function queryFromRequestUrl(url) {
  if (!url || typeof url !== "string") return {};
  try {
    const href =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `http://localhost${url.startsWith("/") ? url : `/${url}`}`;
    return Object.fromEntries(new URL(href).searchParams.entries());
  } catch {
    return {};
  }
}

function parseTradingHubPathname(pathname) {
  const path = String(pathname || "");
  if (path.includes("/trading-hub/draft-preview/")) {
    return { categorySlug: null, articleSlug: null };
  }

  const match = path.match(
    /(?:^|\/)trading-hub\/([^/]+)(?:\/([^/]+))?\/?$/
  );
  if (!match) {
    return { categorySlug: null, articleSlug: null };
  }

  return {
    categorySlug: match[1] || null,
    articleSlug: match[2] || null,
  };
}

function resolveTradingHubSlugs({ params, pageContext, url, query } = {}) {
  const fromUrlQuery = queryFromRequestUrl(url);
  const fromQuery = {
    categorySlug: query?.categorySlug || fromUrlQuery.categorySlug || null,
    articleSlug: query?.articleSlug || fromUrlQuery.articleSlug || null,
  };
  const fromParams = {
    categorySlug: params?.categorySlug || null,
    articleSlug: params?.articleSlug || null,
  };
  const fromContext = {
    categorySlug: pageContext?.categorySlug || null,
    articleSlug: pageContext?.articleSlug || null,
  };
  const fromUrl = parseTradingHubPathname(pathnameFromRequestUrl(url));

  const reserved = new Set([
    "draft-preview",
    "__draft_category",
    "__draft_article",
  ]);

  const categorySlug =
    [
      fromQuery.categorySlug,
      fromParams.categorySlug,
      fromContext.categorySlug,
      fromUrl.categorySlug,
    ].find((value) => value && !reserved.has(value)) || null;

  const articleSlug =
    [
      fromQuery.articleSlug,
      fromParams.articleSlug,
      fromContext.articleSlug,
      fromUrl.articleSlug,
    ].find((value) => value && !reserved.has(value)) || null;

  return { categorySlug, articleSlug };
}

module.exports = {
  resolveTradingHubSlugs,
  parseTradingHubPathname,
};
