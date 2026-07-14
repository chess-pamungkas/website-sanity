const PREVIEW_COOKIE = "sanity-preview";
const PREVIEW_COOKIE_MAX_AGE = 60 * 60; // 1 hour

function isPreviewEnabled() {
  const flag = (process.env.SANITY_PREVIEW_ENABLED || "").trim().toLowerCase();
  return flag === "1" || flag === "true" || flag === "yes";
}

function getPreviewSecret() {
  return (process.env.SANITY_PREVIEW_SECRET || "").trim();
}

function parseCookieHeader(cookieHeader) {
  if (!cookieHeader || typeof cookieHeader !== "string") return {};
  return cookieHeader.split(";").reduce((acc, part) => {
    const idx = part.indexOf("=");
    if (idx === -1) return acc;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

function getCookieHeader(headers) {
  if (!headers) return "";
  if (typeof headers.get === "function") {
    return headers.get("cookie") || headers.get("Cookie") || "";
  }
  return headers.cookie || headers.Cookie || "";
}

function isPreviewRequest(headersOrCookie) {
  if (!isPreviewEnabled()) return false;
  const cookieHeader =
    typeof headersOrCookie === "string"
      ? headersOrCookie
      : getCookieHeader(headersOrCookie);
  const cookies = parseCookieHeader(cookieHeader);
  return cookies[PREVIEW_COOKIE] === "true";
}

function buildPreviewCookie(value = "true") {
  const secure =
    process.env.NODE_ENV === "production" || process.env.VERCEL === "1"
      ? "; Secure"
      : "";
  return `${PREVIEW_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${PREVIEW_COOKIE_MAX_AGE}${secure}`;
}

function buildClearPreviewCookie() {
  const secure =
    process.env.NODE_ENV === "production" || process.env.VERCEL === "1"
      ? "; Secure"
      : "";
  return `${PREVIEW_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

function normalizePreviewSlug(slug) {
  if (!slug || typeof slug !== "string") return "/trading-hub/";
  let next = slug.trim();
  if (!next.startsWith("/")) next = `/${next}`;
  if (!next.startsWith("/trading-hub")) {
    next = "/trading-hub/";
  }
  return next;
}

module.exports = {
  PREVIEW_COOKIE,
  isPreviewEnabled,
  getPreviewSecret,
  isPreviewRequest,
  buildPreviewCookie,
  buildClearPreviewCookie,
  normalizePreviewSlug,
};
