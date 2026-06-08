/**
 * Inline critical CSS for .legal-regulated-content (legal page CLS + LCP).
 * Injected in SSR <head> (gatsby-ssr) and adjacent to the section in React so rules
 * apply before the block is laid out.
 */
export const LEGAL_REGULATED_CRITICAL_CSS = [
  ".legal-regulated-content{position:relative;box-sizing:border-box;display:grid;grid-template-columns:1fr;grid-template-rows:1fr;width:100vw;left:50%;margin-left:-50vw;margin-right:-50vw;overflow:visible;color:#fff}",
  ".legal-regulated-content>*{grid-column:1;grid-row:1}",
  "@media(max-width:767px){.legal-regulated-content{min-height:953px;padding-top:0;padding-bottom:0}}",
  "@media(min-width:768px) and (max-width:1023px){.legal-regulated-content{min-height:555px;padding-top:0;padding-bottom:0}}",
  "@media(min-width:1024px){.legal-regulated-content{min-height:583px;padding-top:0;padding-bottom:0}}",
  ".legal-regulated-content__hero-bg{position:relative;z-index:1;align-self:stretch;justify-self:stretch;width:100%;height:100%;min-height:100%;overflow:hidden;pointer-events:none}",
  ".legal-regulated-content__hero-bg picture{display:block;position:relative;width:100%;height:100%;min-height:100%}",
  ".legal-regulated-content__hero-bg-img{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;object-position:center center}",
  ".legal-regulated-content__wrapper{z-index:2;position:relative;align-self:stretch;justify-self:stretch;width:100%;min-height:100%;box-sizing:border-box;padding:75px 20px}",
  "@media(max-width:767px){.legal-regulated-content__wrapper{padding:48px 20px}}",
  "@media(min-width:768px) and (max-width:1023px){.legal-regulated-content__wrapper{padding:48px 24px}}",
  "@media(max-width:767px){.legal-regulated-content__hero-bg{position:absolute;inset:0;border-radius:9.92px}.legal-regulated-content__hero-bg picture{position:absolute;inset:0;width:100%;height:100%;min-height:100%}}",
  "@media(min-width:768px) and (max-width:1023px){.legal-regulated-content__hero-bg{width:100%;max-width:none}.legal-regulated-content__hero-bg-img{object-fit:cover;object-position:center center}}",
].join("");
