/** Root-relative WebP under static/ — keeps huge VPS SVGs out of the JS bundle. */

export const KEEP_YOUR_VPS_BG_DESKTOP_WEBP =
  "/images/bg/vps/keep-your-vps-forever-desktop.webp";
/** Design-owned (393×1669) — do not regenerate via gen:vps-section-raster-webp */
export const KEEP_YOUR_VPS_BG_MOBILE_WEBP =
  "/images/bg/vps/keep-your-vps-forever-mobile.webp";

/** Design-owned — do not regenerate via gen:vps-section-raster-webp */
export const VPS_HAND_DESKTOP_WEBP = "/images/vps/hand-desktop.webp";
export const VPS_HAND_MOBILE_WEBP = "/images/vps/hand-mobile.webp";

/** Design-owned — do not regenerate via gen:vps-section-raster-webp */
export const VPS_FOREX_CFD_DARK_DESKTOP_WEBP =
  "/images/vps/oqtima-forex-cfd-dark-desktop.webp";
export const VPS_FOREX_CFD_DARK_MOBILE_WEBP =
  "/images/vps/oqtima-forex-cfd-dark-mobile.webp";
export const VPS_FOREX_CFD_LIGHT_DESKTOP_WEBP =
  "/images/vps/oqtima-forex-cfd-light-desktop.webp";
export const VPS_FOREX_CFD_LIGHT_MOBILE_WEBP =
  "/images/vps/oqtima-forex-cfd-light-mobile.webp";

/** Matches SVG viewBox / artboard sizes */
export const KEEP_YOUR_VPS_BG_DIMENSIONS = {
  desktop: { width: 1440, height: 748 },
  mobile: { width: 393, height: 1669 },
};
export const VPS_HAND_DIMENSIONS = {
  desktop: { width: 123, height: 137 },
  mobile: { width: 135, height: 97 },
};
export const VPS_FOREX_CFD_DARK_DIMENSIONS = {
  desktop: { width: 242, height: 251 },
  mobile: { width: 242, height: 251 },
};
export const VPS_FOREX_CFD_LIGHT_DIMENSIONS = {
  desktop: { width: 222, height: 230 },
  mobile: { width: 314, height: 246 },
};

/** Align with $lg / desktop-lg (1024px) for hand + card art swaps */
export const VPS_DESKTOP_PICTURE_MEDIA = "(min-width: 1024px)";
