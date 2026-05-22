/**
 * Base URL for OQtima backend (GATSBY_OQTIMA_API_URL), safe for browser and SSR.
 * Ensures a trailing slash so callers can append paths like `client-consent`.
 */
export function getOqtimaApiUrl() {
  const raw = process.env.GATSBY_OQTIMA_API_URL;
  if (raw == null || typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}
