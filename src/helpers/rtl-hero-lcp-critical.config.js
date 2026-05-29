/**
 * Arabic RTL hero LCP critical CSS values — must match src/assets/styles/rtl-hero-bg-lcp.scss
 * (used by gatsby-ssr inline critical styles before the main bundle flips print→all).
 */
export const RTL_HERO_TABLET_LCP_DEFAULT = "175% 100%";

export const RTL_HERO_DESKTOP_LG_DEFAULT = "-820px center";
export const RTL_HERO_DESKTOP_XL_DEFAULT = "-750px center";

/** Per-page tablet object-position overrides (768–1023px). */
export const RTL_HERO_TABLET_LCP_BY_ROOT = {
  "spreads-fees": "185% 100%",
};

/** Tablet background-position for CSS-only heroes (e.g. /company/ __hero-bg, no LCP <img>). */
export const RTL_HERO_TABLET_BG_CSS_BY_ROOT = {
  company: "150% 100%",
};

/** Per-page desktop-lg object-position overrides (1024–1919px). */
export const RTL_HERO_DESKTOP_LG_LCP_BY_ROOT = {
  crypto: "-830px center",
};

export function getRtlHeroTabletLcpPosition(rootClass) {
  return RTL_HERO_TABLET_LCP_BY_ROOT[rootClass] ?? RTL_HERO_TABLET_LCP_DEFAULT;
}

export function getRtlHeroTabletBgCssPosition(rootClass) {
  return (
    RTL_HERO_TABLET_BG_CSS_BY_ROOT[rootClass] ?? RTL_HERO_TABLET_LCP_DEFAULT
  );
}

export function getRtlHeroDesktopLgLcpPosition(rootClass) {
  return (
    RTL_HERO_DESKTOP_LG_LCP_BY_ROOT[rootClass] ?? RTL_HERO_DESKTOP_LG_DEFAULT
  );
}
