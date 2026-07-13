function readEnvFlag(name, defaultValue) {
  const raw = process.env[name];
  if (raw == null || String(raw).trim() === "") return defaultValue;
  const value = String(raw).trim().toLowerCase();
  if (value === "true" || value === "1" || value === "yes") return true;
  if (value === "false" || value === "0" || value === "no") return false;
  return defaultValue;
}

function isSanityWatchModeEnabled() {
  if (process.env.NODE_ENV !== "development") return false;
  return readEnvFlag("GATSBY_SANITY_WATCH_MODE", true);
}

function isSanityOverlayDraftsEnabled() {
  // Draft overlay is disabled for the public Gatsby frontend.
  // Only published Sanity documents are synced to the site.
  return false;
}

function getSanityWatchModeBufferMs() {
  const parsed = Number.parseInt(
    process.env.GATSBY_SANITY_WATCH_MODE_BUFFER || "300",
    10
  );
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 300;
}

module.exports = {
  isSanityWatchModeEnabled,
  isSanityOverlayDraftsEnabled,
  getSanityWatchModeBufferMs,
};
