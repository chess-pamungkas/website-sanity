/**
 * Tablet hero shell (768–1023px): side gutters + inner padding (iPad Air / main-promotion).
 */
export function heroTabletContainerCritical(selector, heightPx, topPx = 66) {
  return `@media(min-width:768px) and (max-width:1023px){${selector}{top:${topPx}px;height:${heightPx}px;min-height:${heightPx}px;position:absolute;left:50%;transform:translateX(-50%);width:calc(100% - 48px);max-width:100%;padding-left:24px;padding-right:24px;box-sizing:border-box;border-radius:24px;background:#000;overflow:visible}}`;
}

/** LCP img crop: mobile ≤767; tablet 768–1023 uses desktop asset + right-weighted position. */
export function heroTabletBgLcpCritical(
  rootClass,
  tabletObjectPosition = "78% 100%"
) {
  return [
    `@media(max-width:767px){.${rootClass}__hero-bg-lcp{object-fit:cover;object-position:center bottom;display:block}}`,
    `@media(min-width:768px) and (max-width:1023px){.${rootClass}__hero-bg-lcp{object-fit:cover;object-position:${tabletObjectPosition};display:block}}`,
  ].join("");
}

/** Arabic RTL tablet — match rtl-hero-bg-lcp.scss (height 80%, no padding-top). */
export function heroArabicTabletBgLcpCritical(
  rootClass,
  tabletObjectPosition = "175% 100%"
) {
  return [
    `@media(max-width:767px){.${rootClass}__hero-bg-lcp{object-fit:cover;object-position:center bottom;display:block}}`,
    `@media(min-width:768px) and (max-width:1023px){.${rootClass}__hero-bg{background-image:none!important;background-color:#000!important}.${rootClass}__hero-bg-lcp{height:80%!important;padding-top:0!important;object-fit:cover!important;object-position:${tabletObjectPosition};display:block}}`,
  ].join("");
}

/** Outer hero section shell (drops 100vh gap below hero on iPad). */
export function heroPageShellCritical(
  rootClass,
  artboardPx,
  topPx = 73,
  paddingTopPx = 70
) {
  return `@media(min-width:768px) and (max-width:1023px){.${rootClass}{min-height:calc(${topPx}px + ${artboardPx}px);height:auto;padding-top:${paddingTopPx}px;padding-bottom:0;box-sizing:border-box}}`;
}

/**
 * Arabic RTL tablet for heroes that use CSS background on __hero-bg (company — no LCP <img>).
 * Do not use heroArabicTabletBgLcpCritical here — that sets background-image:none on __hero-bg.
 */
export function heroArabicTabletBgCssCritical(
  rootClass,
  imageUrl,
  tabletBackgroundPosition = "175% 100%"
) {
  const sel = `.${rootClass}__hero-bg`;
  const arSel = `html[lang="ar"] ${sel},html[dir="rtl"] ${sel},body[dir="rtl"] ${sel},[dir="rtl"] ${sel}`;
  return `@media(min-width:768px) and (max-width:1023px){${arSel}{background-image:url("${imageUrl}")!important;background-repeat:no-repeat!important;background-size:cover!important;background-position:${tabletBackgroundPosition}!important;background-color:transparent!important}}`;
}

/** Arabic RTL desktop: LCP img only (no legacy CSS bg), matches rtl-hero-bg-lcp.scss. */
export function heroArabicDesktopBgLcpCritical(
  rootClass,
  lgObjectPosition = "-820px center",
  xlObjectPosition = "-750px center"
) {
  const desktopLcpBase =
    "width:100%!important;height:100%!important;padding-top:0!important;object-fit:cover!important;display:block";
  return [
    `@media(min-width:1024px){.${rootClass}__hero-bg{background-image:none!important;background-color:#000!important}}`,
    `@media(min-width:1024px) and (max-width:1919px){.${rootClass}__hero-bg-lcp{${desktopLcpBase};object-position:${lgObjectPosition}}}`,
    `@media(min-width:1920px){.${rootClass}__hero-bg-lcp{${desktopLcpBase};object-position:${xlObjectPosition}}}`,
  ].join("");
}
