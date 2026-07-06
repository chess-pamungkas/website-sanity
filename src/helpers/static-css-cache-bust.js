/** Bump when static /css/*.css assets must bypass CDN immutable cache (query string bust). */
export const STATIC_CSS_CACHE_BUST = "ow960-1";

export const staticCssUrl = (pathname) => {
  if (!pathname || typeof pathname !== "string") return pathname;
  const separator = pathname.includes("?") ? "&" : "?";
  return `${pathname}${separator}v=${STATIC_CSS_CACHE_BUST}`;
};

export const isStaticCssLinkLoaded = (pathname) => {
  if (typeof document === "undefined") return false;
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  for (let i = 0; i < links.length; i += 1) {
    const href = links[i].getAttribute("href") || "";
    if (href === pathname || href.startsWith(`${pathname}?`)) return true;
  }
  return false;
};
