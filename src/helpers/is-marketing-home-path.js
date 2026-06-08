/**
 * Locale marketing homepage routes only: `/` and `/id/` style (exactly two-segment locale root).
 * Excludes `/id/about`, `/en/contact-us`, etc.
 */
export function isMarketingHomePath(pathname) {
  if (!pathname || typeof pathname !== "string") {
    return false;
  }
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/") {
    return true;
  }
  return /^\/[a-z]{2}$/i.test(normalized);
}
