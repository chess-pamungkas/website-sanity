/**
 * Inline critical CSS for /company/ — hero shell + gap under hero before main CSS / deferred flip.
 * Keep breakpoints in sync with src/assets/styles/company.scss + vars.scss ($company-page-*).
 */
export const COMPANY_CRITICAL_CSS = [
  "body.homepage-bg-1 .company+#main-container{min-height:0!important;flex-grow:0!important;height:auto!important;contain:none}",
  ".company+#main-container .header-offset-placeholder{height:0!important}",
  "@media(max-width:767px){.company{position:relative;width:100vw;left:50%;margin-left:-50vw;margin-right:-50vw;min-height:953px!important;height:auto!important;padding-top:73px!important;padding-bottom:0;box-sizing:border-box;overflow:visible}}",
  "@media(min-width:768px) and (max-width:1023px){.company{position:relative;width:100vw;left:50%;margin-left:-50vw;margin-right:-50vw;min-height:calc(73px + 555px)!important;height:auto!important;padding-top:70px!important;padding-bottom:0;box-sizing:border-box;border-radius:24px;overflow:visible}}",
  "@media(min-width:1024px) and (max-width:1919px){.company{position:relative;width:100vw;left:50%;margin-left:-50vw;margin-right:-50vw;min-height:calc(77px + 540px)!important;height:auto!important;padding-top:83px!important;padding-bottom:0;box-sizing:border-box;border-radius:24px;overflow:visible}}",
  "@media(min-width:1920px){.company{position:relative;width:100vw;left:50%;margin-left:-50vw;margin-right:-50vw;min-height:623px!important;height:auto!important;padding-top:83px!important;padding-bottom:0;box-sizing:border-box;border-radius:24px;overflow:visible}}",
  "@media(max-width:767px){.company__hero-container{width:100%;max-width:100%;height:953px;min-height:953px;position:absolute;top:73px;left:50%;transform:translateX(-50%);margin:0 auto;border-radius:20px;background:#000;overflow:hidden;box-sizing:border-box}}",
  "@media(min-width:768px) and (max-width:1023px){.company__hero-container{top:73px;height:555px;min-height:555px;position:absolute;left:50%;transform:translateX(-50%);width:calc(100% - 48px);max-width:100%;padding-left:24px;padding-right:24px;box-sizing:border-box;border-radius:24px;background:#000;overflow:hidden}}",
  "@media(min-width:1024px) and (max-width:1919px){.company__hero-container{top:77px;height:540px;min-height:540px;position:absolute;left:50%;transform:translateX(-50%);width:calc(100vw - 20px);max-width:1200px;box-sizing:border-box;border-radius:24px;background:#000;overflow:visible}}",
  "@media(min-width:1920px){.company__hero-container{top:83px;height:540px;min-height:540px;position:absolute;left:50%;transform:translateX(-50%);width:calc(100vw - 120px);max-width:1400px;box-sizing:border-box;border-radius:24px;background:#000;overflow:visible}}",
  ".company__hero-bg{position:absolute;inset:0;width:100%;height:100%;border-radius:inherit;overflow:hidden}",
  "@media(max-width:767px){.company-page{padding-top:32px;margin-top:0}.company-page .features-products{padding:0 0 30px!important}}",
  "@media(min-width:768px) and (max-width:1023px){.company-page{padding-top:32px;margin-top:0;margin-bottom:24px}.company-page .features-products{padding:0 0 60px!important}}",
  "@media(min-width:1024px){.company-page{padding-top:40px;margin-top:0;margin-bottom:24px}.company-page .features-products{padding:0 0 60px!important}}",
  "@media(min-width:1920px){.company-page{padding-top:40px;margin-bottom:32px}}",
].join("");
