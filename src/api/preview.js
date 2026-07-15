const {
  isPreviewEnabled,
  getPreviewSecret,
  buildPreviewCookie,
  normalizePreviewSlug,
} = require("../helpers/sanity/preview");

/**
 * Map pretty Trading Hub slugs onto always-built draft-preview pages.
 * Unpublished duplicate drafts have no static page yet, so /trading-hub/new-slug/ 404s.
 * Draft-preview bases exist at every deploy and resolve content via SSR + preview cookie.
 */
function resolvePreviewRedirectPath(slug) {
  const normalized = normalizePreviewSlug(slug);
  if (normalized === "/trading-hub/" || normalized === "/trading-hub") {
    return "/trading-hub/";
  }

  const parts = normalized
    .replace(/^\/trading-hub\/?/, "")
    .split("/")
    .filter(Boolean);

  if (parts.length === 1) {
    const url = new URL(
      "/trading-hub/draft-preview/category/",
      "http://localhost"
    );
    url.searchParams.set("categorySlug", parts[0]);
    return `${url.pathname}?${url.searchParams.toString()}`;
  }

  if (parts.length >= 2) {
    const url = new URL(
      "/trading-hub/draft-preview/article/",
      "http://localhost"
    );
    url.searchParams.set("categorySlug", parts[0]);
    url.searchParams.set("articleSlug", parts[1]);
    return `${url.pathname}?${url.searchParams.toString()}`;
  }

  return "/trading-hub/";
}

/**
 * Enable draft preview: sets httpOnly cookie then redirects to Trading Hub slug.
 * Usage: /api/preview?secret=...&slug=/trading-hub/...
 */
export default function previewHandler(req, res) {
  if (!isPreviewEnabled()) {
    res.status(403).json({
      message: "Preview is disabled on this environment (SANITY_PREVIEW_ENABLED).",
    });
    return;
  }

  const secret = getPreviewSecret();
  if (!secret) {
    res.status(500).json({ message: "SANITY_PREVIEW_SECRET is not configured." });
    return;
  }

  const requestSecret =
    req.query?.secret ||
    (req.url && new URL(req.url, "http://localhost").searchParams.get("secret"));

  if (!requestSecret || requestSecret !== secret) {
    res.status(401).json({ message: "Invalid preview secret." });
    return;
  }

  if (!process.env.SANITY_API_TOKEN) {
    res.status(500).json({
      message: "SANITY_API_TOKEN is required to preview drafts.",
    });
    return;
  }

  const rawSlug =
    req.query?.slug ||
    (req.url && new URL(req.url, "http://localhost").searchParams.get("slug"));
  const location = resolvePreviewRedirectPath(rawSlug);

  res.setHeader("Set-Cookie", buildPreviewCookie("true"));
  res.writeHead(307, { Location: location });
  res.end();
}
