const { buildClearPreviewCookie } = require("../helpers/sanity/preview");

/**
 * Exit draft preview mode and return to published view.
 * Usage: /api/exit-preview?slug=/trading-hub/
 */
export default function exitPreviewHandler(req, res) {
  const rawSlug =
    req.query?.slug ||
    (req.url && new URL(req.url, "http://localhost").searchParams.get("slug"));
  const slug =
    rawSlug && typeof rawSlug === "string" && rawSlug.startsWith("/")
      ? rawSlug
      : "/trading-hub/";

  res.setHeader("Set-Cookie", buildClearPreviewCookie());
  res.writeHead(307, { Location: slug });
  res.end();
}
