/**
 * Inline critical CSS for .legal-regulated-content (legal page CLS + LCP).
 * Injected in SSR <head> (gatsby-ssr) and adjacent to the section in React so rules
 * apply before the block is laid out.
 */
export const LEGAL_REGULATED_CRITICAL_CSS = [
  ".legal-regulated-content{position:relative;box-sizing:border-box;display:grid;grid-template-columns:1fr;grid-template-rows:1fr;width:100vw;left:50%;margin-left:-50vw;margin-right:-50vw;overflow:visible;color:#fff}",
  ".legal-regulated-content>*{grid-column:1;grid-row:1}",
  "@media(max-width:767px){.legal-regulated-content{min-height:953px;padding-top:70px;padding-bottom:70px}}",
  "@media(min-width:768px) and (max-width:1023px){.legal-regulated-content{min-height:555px;padding-top:70px}}",
  "@media(min-width:1024px){.legal-regulated-content{min-height:583px;padding-top:75px;padding-bottom:75px}}",
  ".legal-regulated-content__hero-bg{position:relative;z-index:1;align-self:stretch;justify-self:stretch;width:100%;min-height:100%;overflow:hidden;pointer-events:none}",
  ".legal-regulated-content__hero-bg picture{display:block;position:relative;width:100%;height:100%;min-height:100%}",
  ".legal-regulated-content__hero-bg-img{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;object-position:center center}",
  ".legal-regulated-content__wrapper{z-index:2;position:relative;align-self:center;justify-self:center;width:100%}",
  "@media(max-width:767px){.legal-regulated-content__hero-bg{border-radius:9.92px}}",
  "@media(min-width:768px) and (max-width:1023px){.legal-regulated-content__hero-bg-img{object-fit:contain}}",
].join("");
