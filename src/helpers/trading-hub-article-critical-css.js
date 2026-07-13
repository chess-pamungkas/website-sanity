/**
 * Inline critical CSS for /trading-hub/:category/:article/ detail hero (LCP before deferred CSS).
 * Layout mirrors trading-hub-critical-css with compliance-banner offsets.
 */
export const TRADING_HUB_ARTICLE_HERO_CRITICAL_CSS = [
  "@media(max-width:768px){.trading-hub-article-hero{position:relative;width:100vw;left:50%;margin-left:-50vw;margin-right:-50vw;min-height:calc(var(--compliance-banner-height,102px) + 73px + 680px);height:auto;padding-top:calc(var(--compliance-banner-height,102px) + 73px);padding-bottom:20px;box-sizing:border-box;overflow:visible}}",
  "@media(max-width:480px){.trading-hub-article-hero{min-height:calc(var(--compliance-banner-height,102px) + 73px + 560px)}}",
  "@media(min-width:768px) and (max-width:1023px){.trading-hub-article-hero{position:relative;width:100vw;left:50%;margin-left:-50vw;margin-right:-50vw;min-height:calc(var(--compliance-banner-height,77px) + 73px + 320px);height:auto;padding-top:calc(var(--compliance-banner-height,77px) + 70px);padding-bottom:0;box-sizing:border-box;overflow:visible}}",
  "@media(min-width:1024px){.trading-hub-article-hero{position:relative;width:100vw;left:50%;margin-left:-50vw;margin-right:-50vw;min-height:calc(var(--compliance-banner-height,65px) + 83px + 320px);height:auto;padding-top:calc(var(--compliance-banner-height,65px) + 83px);box-sizing:border-box;overflow:visible}}",
  "@media(max-width:768px){.trading-hub-article-hero__hero-container{height:680px;min-height:680px;position:absolute;top:calc(var(--compliance-banner-height,102px) + 73px);left:50%;transform:translateX(-50%);width:100%;max-width:100%;box-sizing:border-box;border-radius:20px;background:#000;overflow:hidden}}",
  "@media(max-width:480px){.trading-hub-article-hero__hero-container{height:560px;min-height:560px}}",
  "@media(min-width:768px) and (max-width:1023px){.trading-hub-article-hero__hero-container{top:calc(var(--compliance-banner-height,77px) + 73px);height:320px;min-height:320px;position:absolute;left:50%;transform:translateX(-50%);width:calc(100% - 48px);max-width:100%;padding-left:24px;padding-right:24px;box-sizing:border-box;border-radius:24px;background:#000;overflow:hidden}}",
  "@media(min-width:1024px){.trading-hub-article-hero__hero-container{top:calc(var(--compliance-banner-height,65px) + 83px);height:320px;min-height:320px;position:absolute;left:50%;transform:translateX(-50%);width:100%;max-width:1400px;box-sizing:border-box;border-radius:24px;background:#000;overflow:hidden}}",
  ".trading-hub-article-hero__hero-bg,.trading-hub-article-hero__hero-bg-lcp{position:absolute;inset:0;width:100%;height:100%}",
  ".trading-hub-article-hero__hero-bg picture{display:block;position:absolute;inset:0;width:100%;height:100%}",
  ".trading-hub-article-hero__hero-bg-lcp{display:block;width:100%;height:100%;object-fit:cover;object-position:center center}",
  ".trading-hub-article-hero__content-container{position:relative;z-index:4}",
].join("");
