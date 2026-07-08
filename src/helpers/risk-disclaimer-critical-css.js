/**
 * Sitewide inline critical CSS for the risk disclaimer modal.
 * Ships in SSR <head> so layout applies even when hashed main CSS is stale at the CDN.
 */
export const RISK_DISCLAIMER_CRITICAL_CSS = [
  ".risk-disclaimer-popup{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;pointer-events:auto;touch-action:none}",
  "@media screen and (max-width:767px){.risk-disclaimer-popup__dialog{max-height:calc(100dvh - 32px);overflow-y:auto;-webkit-overflow-scrolling:touch}}",
].join("");
