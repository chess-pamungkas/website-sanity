/**
 * Trustpilot widget loads this Google Fonts file without font-display. Register the same URL
 * in critical CSS first so Lighthouse font-display insight passes.
 */
export const TRUSTPILOT_ROBOTO_WOFF2 =
  "https://fonts.gstatic.com/s/roboto/v48/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBHMdazQ.woff2";

export const trustpilotRobotoFontFaceCritical = `@font-face{font-family:"Roboto";font-style:normal;font-weight:400;font-stretch:100%;font-display:swap;src:url("${TRUSTPILOT_ROBOTO_WOFF2}") format("woff2")}`;
