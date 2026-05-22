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

/** Outer hero section shell (drops 100vh gap below hero on iPad). */
export function heroPageShellCritical(
  rootClass,
  artboardPx,
  topPx = 73,
  paddingTopPx = 70
) {
  return `@media(min-width:768px) and (max-width:1023px){.${rootClass}{min-height:calc(${topPx}px + ${artboardPx}px);height:auto;padding-top:${paddingTopPx}px;padding-bottom:0;box-sizing:border-box}}`;
}
