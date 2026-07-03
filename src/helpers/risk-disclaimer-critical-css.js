/**
 * Sitewide inline critical CSS for the risk disclaimer modal (mobile positioning).
 * Ships in SSR <head> so mobile layout applies even when hashed main CSS is stale at the CDN.
 */
export const RISK_DISCLAIMER_CRITICAL_CSS = [
  ".risk-disclaimer-popup{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;pointer-events:auto;touch-action:none}",
  "@media screen and (max-width:767px){.risk-disclaimer-popup{align-items:flex-start;padding:calc(var(--compliance-banner-height,102px) + 12px) 16px 16px}}",
  "@media screen and (max-width:767px){.risk-disclaimer-popup__dialog{max-height:calc(100dvh - var(--compliance-banner-height,102px) - 28px);overflow-y:auto;-webkit-overflow-scrolling:touch}}",
].join("");
