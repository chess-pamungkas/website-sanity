const {
  isPreviewEnabled,
  getPreviewSecret,
  buildPreviewCookie,
  normalizePreviewSlug,
} = require("../helpers/sanity/preview");

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
  const slug = normalizePreviewSlug(rawSlug);

  res.setHeader("Set-Cookie", buildPreviewCookie("true"));
  res.writeHead(307, { Location: slug });
  res.end();
}
