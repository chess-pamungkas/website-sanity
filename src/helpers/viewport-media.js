import {
  SM_MAX_WIDTH,
  WINDOW_SIZE_LG,
  WINDOW_SIZE_MD,
  MD_MAX_WIDTH,
} from "./constants";

/** Matches SCSS `@include mobile` (max-width: 767px). */
export const MOBILE_VIEWPORT_MQ = `(max-width: ${SM_MAX_WIDTH}px)`;

/** Matches SCSS `@include tablet` (768px–1023px). */
export const TABLET_VIEWPORT_MQ = `(min-width: ${WINDOW_SIZE_MD}px) and (max-width: ${MD_MAX_WIDTH}px)`;

/** Hero <picture> / preload: mobile asset only ≤767px (768px iPad = desktop art + tablet crop). */
export const HERO_ASSET_MOBILE_MQ = MOBILE_VIEWPORT_MQ;

/** Hero <picture> / preload: desktop/tablet asset from 768px. */
export const HERO_ASSET_DESKTOP_MQ = `(min-width: ${WINDOW_SIZE_MD}px)`;

/** Matches SCSS `@include desktop-lg` (min-width: 1024px). */
export const DESKTOP_LG_VIEWPORT_MQ = `(min-width: ${WINDOW_SIZE_LG}px)`;

/**
 * Breakpoint flags via matchMedia (viewport width), not screen.width or UA.
 * Synthetic width keeps useWindowSize consumers stable without reading innerWidth.
 */
export function readViewportSizeFromMedia() {
  if (typeof window === "undefined") {
    return { width: undefined, height: undefined };
  }

  const isMobile = window.matchMedia(MOBILE_VIEWPORT_MQ).matches;
  const isDesktop = window.matchMedia(DESKTOP_LG_VIEWPORT_MQ).matches;
  const isTablet = !isMobile && !isDesktop;

  const width = isMobile
    ? WINDOW_SIZE_MD - 1
    : isTablet
      ? Math.floor((WINDOW_SIZE_MD + WINDOW_SIZE_LG) / 2)
      : WINDOW_SIZE_LG;

  return { width, height: 1 };
}

export function isMobileViewportMedia() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_VIEWPORT_MQ).matches;
}
