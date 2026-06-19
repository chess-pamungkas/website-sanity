/**
 * Inline critical CSS for /partners/ (hero LCP + income-slider CLS before deferred CSS flip).
 * Injected in gatsby-ssr <head> on partners routes.
 */
export const PARTNERS_HERO_CRITICAL_CSS = [
  "body.homepage-bg-1 .partners-page-community #main-container{min-height:0!important;flex-grow:0;contain:none}",
  "@media(max-width:768px){.partners{position:relative;width:100vw;left:50%;margin-left:-50vw;margin-right:-50vw;min-height:953px;height:auto;padding-top:73px;padding-bottom:20px;box-sizing:border-box;overflow:visible}}",
  "@media(min-width:768px) and (max-width:1023px){.partners{position:relative;width:100vw;left:50%;margin-left:-50vw;margin-right:-50vw;min-height:calc(73px + 555px);height:auto;padding-top:70px;padding-bottom:0;box-sizing:border-box;overflow:visible}}",
  "@media(min-width:1024px){.partners{position:relative;width:100vw;left:50%;margin-left:-50vw;margin-right:-50vw;min-height:666px;height:auto;padding-top:83px;box-sizing:border-box;overflow:visible}}",
  "@media(max-width:768px){.partners__hero-container{min-height:953px;height:auto;position:absolute;top:73px;left:50%;transform:translateX(-50%);width:100%;max-width:393px;box-sizing:border-box;border-radius:20px;background:#000;overflow:hidden}}",
  "@media(min-width:768px) and (max-width:1023px){.partners__hero-container{top:73px;height:555px;min-height:555px;position:absolute;left:50%;transform:translateX(-50%);width:calc(100% - 48px);max-width:100%;padding-left:24px;padding-right:24px;box-sizing:border-box;border-radius:24px;background:#000;overflow:hidden}}",
  "@media(min-width:1024px){.partners__hero-container{top:83px;height:583px;min-height:583px;position:absolute;left:50%;transform:translateX(-50%);width:100%;max-width:1400px;box-sizing:border-box;border-radius:24px;background:#000;overflow:hidden}}",
  ".partners__hero-bg,.partners__hero-bg-lcp{position:absolute;inset:0;width:100%;height:100%}",
  ".partners__hero-bg picture{display:block;position:absolute;inset:0;width:100%;height:100%}",
  ".partners__hero-bg-lcp{display:block;width:100%;height:100%;object-fit:cover;object-position:center center}",
  "@media(min-width:1024px) and (max-width:1919px){.partners__hero-bg-lcp{object-position:42% 50%}}",
  ".partners__content-container{position:relative;z-index:4}",
  ".partners__trust-pilot{min-height:30px;height:30px;box-sizing:border-box}",
  ".income-slider{box-sizing:border-box;padding:75px 0 40px;min-height:520px}",
  "@media(min-width:768px) and (max-width:1023px){.income-slider{min-height:520px;padding:75px 0 40px}}",
  "@media(max-width:767px){.income-slider{min-height:480px;padding:75px 0 40px}}",
  ".income-slider__badge-icon{width:16px;height:16px;display:block;flex-shrink:0}",
  ".income-slider__main-container{box-sizing:border-box;min-height:214px;width:100%;max-width:1241px}",
].join("");
