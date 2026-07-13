/**
 * Inline critical CSS for /trading-hub/* (hero LCP before deferred CSS flip).
 * Layout mirrors partners-critical-css with compliance-banner offsets.
 */
export const TRADING_HUB_HERO_CRITICAL_CSS = [
  "@media(max-width:768px){.trading-hub{position:relative;width:100vw;left:50%;margin-left:-50vw;margin-right:-50vw;min-height:calc(var(--compliance-banner-height,102px) + 73px + 953px);height:auto;padding-top:calc(var(--compliance-banner-height,102px) + 73px);padding-bottom:20px;box-sizing:border-box;overflow:visible}}",
  "@media(min-width:768px) and (max-width:1023px){.trading-hub{position:relative;width:100vw;left:50%;margin-left:-50vw;margin-right:-50vw;min-height:calc(var(--compliance-banner-height,77px) + 73px + 555px);height:auto;padding-top:calc(var(--compliance-banner-height,77px) + 70px);padding-bottom:0;box-sizing:border-box;overflow:visible}}",
  "@media(min-width:1024px){.trading-hub{position:relative;width:100vw;left:50%;margin-left:-50vw;margin-right:-50vw;min-height:calc(var(--compliance-banner-height,65px) + 83px + 583px);height:auto;padding-top:calc(var(--compliance-banner-height,65px) + 83px);box-sizing:border-box;overflow:visible}}",
  "@media(max-width:768px){.trading-hub__hero-container{min-height:953px;height:auto;position:absolute;top:calc(var(--compliance-banner-height,102px) + 73px);left:50%;transform:translateX(-50%);width:100%;max-width:393px;box-sizing:border-box;border-radius:20px;background:#000;overflow:hidden}}",
  "@media(min-width:768px) and (max-width:1023px){.trading-hub__hero-container{top:calc(var(--compliance-banner-height,77px) + 73px);height:555px;min-height:555px;position:absolute;left:50%;transform:translateX(-50%);width:calc(100% - 48px);max-width:100%;padding-left:24px;padding-right:24px;box-sizing:border-box;border-radius:24px;background:#000;overflow:hidden}}",
  "@media(min-width:1024px){.trading-hub__hero-container{top:calc(var(--compliance-banner-height,65px) + 83px);height:583px;min-height:583px;position:absolute;left:50%;transform:translateX(-50%);width:100%;max-width:1400px;box-sizing:border-box;border-radius:24px;background:#000;overflow:hidden}}",
  ".trading-hub__hero-bg,.trading-hub__hero-bg-lcp{position:absolute;inset:0;width:100%;height:100%}",
  ".trading-hub__hero-bg picture{display:block;position:absolute;inset:0;width:100%;height:100%}",
  ".trading-hub__hero-bg-lcp{display:block;width:100%;height:100%;object-fit:cover;object-position:center center}",
  "@media(min-width:1024px) and (max-width:1919px){.trading-hub__hero-bg-lcp{object-position:42% 50%}}",
  ".trading-hub__content-container{position:relative;z-index:4}",
].join("");
