/**
 * Served from static/images/... (see npm run gen:trading-tools-section-webp).
 * Prefer <picture> WebP + SVG fallback to avoid multi‑MiB SVG network payloads on mobile.
 */
export const TRADING_TOOLS_SECTION_BG = "/images/bg/trading-tools";

export const TRADING_TOOLS_SECTION_IMAGES = "/images/trading-tools";

/** Column-layout backgrounds (mobile + tablet 768–1023px). */
export const TRADING_TOOLS_SECTION_BG_STACKED_MQ = "(max-width: 1023px)";
export const TRADING_TOOLS_SECTION_BG_WIDE_MQ = "(min-width: 1024px)";

/** Dimensions match SVG artboards; use on <img> for layout stability. */
export const ALPHA_GENERATION_BG = {
  mobileWebp: `${TRADING_TOOLS_SECTION_BG}/bg-alpha-generation-mobile.webp`,
  desktopWebp: `${TRADING_TOOLS_SECTION_BG}/bg-alpha-generation-desktop.webp`,
  mobileSvg: `${TRADING_TOOLS_SECTION_BG}/bg-alpha-generation-mobile.svg`,
  desktopSvg: `${TRADING_TOOLS_SECTION_BG}/bg-alpha-generation-desktop.svg`,
  widthMobile: 393,
  heightMobile: 1246,
  widthDesktop: 1440,
  heightDesktop: 826,
};

export const FEATURED_IDEAS_BG = {
  mobileWebp: `${TRADING_TOOLS_SECTION_BG}/bg-feature-ideas-mobile.webp`,
  desktopWebp: `${TRADING_TOOLS_SECTION_BG}/bg-feature-ideas-desktop.webp`,
  mobileSvg: `${TRADING_TOOLS_SECTION_BG}/bg-feature-ideas-mobile.svg`,
  desktopSvg: `${TRADING_TOOLS_SECTION_BG}/bg-feature-ideas-desktop.svg`,
  widthMobile: 393,
  heightMobile: 1246,
  widthDesktop: 1440,
  heightDesktop: 826,
};

export const TRADING_CALENDAR_IMG = {
  mobileWebp: `${TRADING_TOOLS_SECTION_IMAGES}/trading-calendar-mobile.webp`,
  desktopWebp: `${TRADING_TOOLS_SECTION_IMAGES}/trading-calendar-desktop.webp`,
  mobileSvg: `${TRADING_TOOLS_SECTION_IMAGES}/trading-calendar-mobile.svg`,
  desktopSvg: `${TRADING_TOOLS_SECTION_IMAGES}/trading-calendar-desktop.svg`,
  widthMobile: 353,
  heightMobile: 300,
  widthDesktop: 589,
  heightDesktop: 433,
};
