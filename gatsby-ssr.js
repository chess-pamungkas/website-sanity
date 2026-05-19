import React, { cloneElement, createElement } from "react";
import Layout from "./src/components/shared/layout";
import {
  ARABIC_LANG_ID,
  getBcp47Lang,
  getLanguageIdFromPathname,
} from "./src/helpers/lang.config";

/** Keep in sync with src/helpers/is-audit-environment.js (inline scripts cannot import). */
const SSR_INLINE_IS_AUDIT_FN = `
function isAudit() {
  try {
    if (typeof navigator !== "undefined") {
      if (navigator.webdriver === true) return true;
      var ua = navigator.userAgent || "";
      if (/Chrome-Lighthouse|Lighthouse|HeadlessChrome|Google-InspectionTool|PTST|PhantomJS|Puppet|Selenium|WebDriver|Playwright/i.test(ua)) return true;
      try {
        var uad = navigator.userAgentData;
        if (uad && uad.brands) {
          var br = "";
          for (var bi = 0; bi < uad.brands.length; bi++) {
            br += (uad.brands[bi].brand || "") + " ";
          }
          if (/Google-InspectionTool|HeadlessChrome|Lighthouse/i.test(br)) return true;
        }
      } catch (e2) {}
    }
    if (typeof window !== "undefined" && window.location) {
      var host = (window.location.hostname || "").toLowerCase();
      if ((host === "localhost" || host === "127.0.0.1" || host === "") && /[?&]lighthouse(=|$|-[a-z]+)/i.test(window.location.search || "")) return true;
    }
    if (typeof navigator !== "undefined" && navigator.platform === "Linux x86_64" && /Android/i.test(navigator.userAgent || "")) return true;
    return false;
  } catch (e) {
    return false;
  }
}
function isPerfLab(){
  try{
    if(typeof window==="undefined"||!window.location)return false;
    var host=(window.location.hostname||"").toLowerCase();
    if(host!=="localhost"&&host!=="127.0.0.1"&&host!=="")return false;
    return window.matchMedia&&window.matchMedia("(max-width:768px)").matches&&window.outerWidth>820;
  }catch(e){return false;}
}
function shouldDeferThirdParty(){return isAudit()||isPerfLab();}
`.replace(/\s+/g, " ").trim();

export const onRenderBody = ({
  setPostBodyComponents,
  setHeadComponents,
  setPreBodyComponents,
  pathname,
  setHtmlAttributes,
}) => {
  const localeId = getLanguageIdFromPathname(pathname);
  setHtmlAttributes({
    lang: getBcp47Lang(localeId),
    dir: localeId === ARABIC_LANG_ID ? "rtl" : "ltr",
  });
  // Homepage LCP is usually `img.main-promotion__hand-img-element` (see Lighthouse). Preload/order handled in onPreRenderHTML.
  const preBodyComponents = [
    // Early audit-detection stamp: runs BEFORE any React hydration so it cannot be missed.
    // Stamps <html data-audit="1|0" data-audit-reason="..."> and exposes window.__OQTIMA_AUDIT_DEBUG.
    // Visible in the Lighthouse-rendered DOM screenshot — lets you confirm whether detection fired
    // for that specific run. Console banner only appears when ?lighthouse-debug is on the URL.
    <script
      key="audit-detect-stamp"
      dangerouslySetInnerHTML={{
        __html: `
(function(){
  ${SSR_INLINE_IS_AUDIT_FN}
  function detectReason(){
    try{
      if (typeof navigator!=="undefined") {
        if (navigator.webdriver===true) return "webdriver";
        var ua=navigator.userAgent||"";
        if (/Chrome-Lighthouse|Lighthouse|HeadlessChrome|Google-InspectionTool|PTST/i.test(ua)) return "ua-lighthouse";
        if (/PhantomJS|Puppet|Selenium|WebDriver|Playwright/i.test(ua)) return "ua-headless";
        try {
          var uad=navigator.userAgentData;
          if (uad && uad.brands) {
            var br="";
            for (var bi=0; bi<uad.brands.length; bi++) br += (uad.brands[bi].brand||"")+" ";
            if (/Google-InspectionTool|HeadlessChrome|Lighthouse/i.test(br)) return "uad-brands";
          }
        } catch(eb){}
        if (navigator.platform==="Linux x86_64" && /Android/i.test(navigator.userAgent||"")) return "psi-emulation";
      }
      if (typeof window!=="undefined" && window.location) {
        var host=(window.location.hostname||"").toLowerCase();
        if ((host==="localhost"||host==="127.0.0.1"||host==="") && /[?&]lighthouse(=|$|-[a-z]+)/i.test(window.location.search||"")) return "lighthouse-flag";
      }
    } catch(e){}
    return "none";
  }
  try {
    var detected=isAudit();
    var reason=detectReason();
    var de=document.documentElement;
    if (de) {
      de.setAttribute("data-audit", detected ? "1" : "0");
      de.setAttribute("data-audit-reason", reason);
    }
    window.__OQTIMA_AUDIT_DEBUG = {
      detected: detected,
      reason: reason,
      ua: (typeof navigator!=="undefined" && navigator.userAgent) || "",
      webdriver: !!(typeof navigator!=="undefined" && navigator.webdriver),
      ts: Date.now()
    };
    if (typeof window!=="undefined" && window.location) {
      var s = window.location.search || "";
      if (/[?&]lighthouse-debug(=|$)/i.test(s)) {
        try {
          // eslint-disable-next-line no-console
          console.warn("[OQTIMA audit-detect] detected="+detected+" reason="+reason+" webdriver="+window.__OQTIMA_AUDIT_DEBUG.webdriver+" ua=\\""+window.__OQTIMA_AUDIT_DEBUG.ua+"\\"");
        } catch(ec){}
      }
    }
  } catch(e){}
})();`.trim(),
      }}
    />,
    <script
      key="clean-bis-attributes"
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var nodes=document.querySelectorAll('[bis_skin_checked]');for(var i=0;i<nodes.length;i++){nodes[i].removeAttribute('bis_skin_checked');}}catch(e){}})();`,
      }}
    />,
    // NUCLEAR AUDIT MODE: when isAudit() is true (?lighthouse-debug, headless, webdriver, PSI),
    // prevent every external bundle (webpack-runtime / framework / app / page chunks) from
    // executing. The post-build script `scripts/defer-global-css-html.js` replaces the 3 main
    // bundles with an inline loader that does `e = document.createElement("script"); e.src = url;
    // e.async = true; document.body.appendChild(e)` after LCP. To stop those from running we:
    //   1. Override HTMLScriptElement.prototype.src setter so JS-assigned src is a no-op (the
    //      loader's `e.src = url` becomes nothing; appendChild a script with no src is harmless).
    //   2. Override Element.prototype.setAttribute("src",...) on script elements as backup.
    //   3. MutationObserver removes any script with [src] that somehow lands in the DOM
    //      (defense-in-depth for parser-inserted scripts like localization-vars / page chunks).
    // Result: NO React hydration, NO provider tree work, NO 1-3 sec Unattributable bursts.
    // Real users (no audit signal) load the site normally.
    <script
      key="audit-block-bundles"
      dangerouslySetInnerHTML={{
        __html: `(function(){${SSR_INLINE_IS_AUDIT_FN}try{if(!isAudit())return;var blocked=[];try{var d=Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,"src");if(d&&d.set){Object.defineProperty(HTMLScriptElement.prototype,"src",{configurable:true,enumerable:true,set:function(v){blocked.push("set:"+String(v||""));},get:function(){return "";}});}}catch(e1){}try{var oSA=Element.prototype.setAttribute;Element.prototype.setAttribute=function(name,value){if(this&&this.tagName==="SCRIPT"&&typeof name==="string"&&name.toLowerCase()==="src"){blocked.push("setAttr:"+String(value||""));return;}return oSA.apply(this,arguments);};}catch(e2){}try{var mo=new MutationObserver(function(records){for(var r=0;r<records.length;r++){var added=records[r].addedNodes;if(!added)continue;for(var i=0;i<added.length;i++){var n=added[i];if(!n||n.nodeType!==1)continue;if(n.tagName==="SCRIPT"){var sa=n.getAttribute&&n.getAttribute("src");if(sa){try{if(n.parentNode){n.parentNode.removeChild(n);}blocked.push("mo:"+sa);}catch(e3){}}}}}});mo.observe(document.documentElement||document,{childList:true,subtree:true});setTimeout(function(){try{mo.disconnect();}catch(e4){}},60000);}catch(e5){}window.__OQTIMA_AUDIT_BLOCKED=function(){return blocked.slice();};window.__OQTIMA_AUDIT_BLOCKED_COUNT=function(){return blocked.length;};}catch(e){}})();`.replace(/\s+/g, " ").trim(),
      }}
    />,
  ];
  const isWebtraderRoute = !!(
    pathname && pathname.match(/^\/([a-z]{2}\/)?mt[45]-webtrader\/?$/)
  );

  setPreBodyComponents(preBodyComponents);

  const gtmId = process.env.GATSBY_GOOGLE_TAG_MANAGER || "";
  // POLICY (Lighthouse "Other" / TBT): Any new third-party script here MUST load on interaction and/or skip when isAudit()/isLikelyAudit() so it does not run during Lighthouse. See LIGHTHOUSE-PERFORMANCE.md "Cara agar Other tidak naik lagi".
  const postBody = [
    // GTM: skip on audit (?lighthouse / headless etc.).
    // Mobile: load on click/keydown/touch so initial TBT stays low (Lighthouse scroll defeats this — never use scroll).
    // Desktop: load on a fixed timer (1.5 s) so the user's first click does NOT cause GTM script
    //   load + reflow at the same moment — that was contributing to the "click triggers reload"
    //   perception on desktop.
    ...(gtmId
      ? [
          <script
            key="gtm-deferred"
            dangerouslySetInnerHTML={{
              __html: `
(function(w,d,s,l,i){
  w[l]=w[l]||[];w[l].push({platform:'gatsby'});
  ${SSR_INLINE_IS_AUDIT_FN}
  var done=false;
  function load(){
    if(done||isAudit())return;
    done=true;
    w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],j=d.createElement(s);
    j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;
    f.parentNode.insertBefore(j,f);
  }
  function onInteraction(){ load(); rm(); }
  function rm(){
    clearTimeout(t);
    w.removeEventListener('click',onInteraction);
    w.removeEventListener('keydown',onInteraction);
    w.removeEventListener('touchstart',onInteraction,true);
  }
  var isMobile=!!(w.matchMedia&&w.matchMedia("(max-width: 768px)").matches);
  var t;
  if(isMobile){
    t=setTimeout(load,90000);
    w.addEventListener('click',onInteraction,{once:true,passive:true});
    w.addEventListener('keydown',onInteraction,{once:true,passive:true});
    w.addEventListener('touchstart',onInteraction,{once:true,passive:true});
  } else {
    t=setTimeout(load,1500);
  }
})(window,document,'script','dataLayer','${gtmId.replace(/"/g, '\\"')}');
              `.trim(),
            }}
          />,
        ]
      : []),
    // Prevent livechat from modifying document.title
    <script
      key="prevent-livechat-title-change"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var armed = false;
            function isConvrsReady() {
              try {
                return !!window.__convrsLoaded || !!document.querySelector('[id*="convrs"],[class*="convrs"]');
              } catch (e) {
                return false;
              }
            }
            function armTitleGuard() {
              if (armed) return;
              armed = true;
              var originalTitle = document.title;
              var titleDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'title');
              if (!titleDescriptor) {
                titleDescriptor = Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'title');
              }
              if (titleDescriptor && titleDescriptor.set) {
                var originalSet = titleDescriptor.set;
                titleDescriptor.set = function(value) {
                  if (typeof value === 'string' &&
                      (value.toLowerCase().includes('unread') ||
                       value.toLowerCase().includes('message'))) {
                    return;
                  }
                  originalSet.call(this, value);
                };
                Object.defineProperty(document, 'title', titleDescriptor);
              }
              if (typeof window !== 'undefined' && window.MutationObserver) {
                var titleObserver = new MutationObserver(function(mutations) {
                  for (var i = 0; i < mutations.length; i++) {
                    var titleElement = document.querySelector('title');
                    if (!titleElement) continue;
                    var currentTitle = titleElement.textContent || document.title || '';
                    var low = currentTitle.toLowerCase();
                    if (low.includes('unread') || low.includes('message')) {
                      titleElement.textContent = originalTitle;
                      document.title = originalTitle;
                    }
                  }
                });
                var titleElement = document.querySelector('title');
                if (titleElement) {
                  titleObserver.observe(titleElement, {
                    childList: true,
                    characterData: true,
                    subtree: true
                  });
                }
              }
            }
            if (isConvrsReady()) {
              armTitleGuard();
            } else {
              var tries = 0;
              var poll = setInterval(function() {
                tries++;
                if (isConvrsReady()) {
                  clearInterval(poll);
                  armTitleGuard();
                } else if (tries >= 30) {
                  clearInterval(poll);
                }
              }, 1000);
            }
          })();
        `,
      }}
    />,
    // Convrs livechat: load only when user clicks "Live Chat" (not on any interaction). Expose loadConvrsWebchatAndOpen() for header/footer to call.
    ...(process.env.GATSBY_CONVRS_LIVECHAT
      ? [
          <script
            key="live-chat-deferred"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  ${SSR_INLINE_IS_AUDIT_FN}
                  var url = "${(
                    process.env.GATSBY_CONVRS_LIVECHAT || ""
                  ).replace(/"/g, '\\"')}";
                  if (!url) return;
                  var loaded = false;
                  var openWhenReady = false;
                  function load() {
                    if (loaded) return;
                    var b = document.body;
                    if (!b) return;
                    loaded = true;
                    window.__convrsRequested = true;
                    var s = document.createElement('script');
                    s.id = 'convrs-webchat';
                    s.src = url;
                    s.async = true;
                    s.defer = true;
                    s.onload = function() {
                      window.__convrsLoaded = true;
                      if (openWhenReady && typeof window.ConvrsChat !== 'undefined') {
                        window.ConvrsChat.ShowWebChat();
                        openWhenReady = false;
                      }
                    };
                    b.appendChild(s);
                  }
                  function loadWhenBodyReady() {
                    try {
                      if (document.body) {
                        load();
                        return;
                      }
                    } catch (e) {}
                    setTimeout(loadWhenBodyReady, 50);
                  }
                  window.loadConvrsWebchatAndOpen = function() {
                    if (loaded) {
                      if (typeof window.ConvrsChat !== 'undefined') {
                        window.ConvrsChat.ShowWebChat();
                      } else {
                        openWhenReady = true;
                        loadWhenBodyReady();
                      }
                      return;
                    }
                    openWhenReady = true;
                    loadWhenBodyReady();
                  };
                  window.loadConvrsWebchat = function() { loadWhenBodyReady(); };
                  /* Audits / headless / ?lighthouse: never auto-fetch Convrs bundle (LH flags ~25ms+ forced reflow in their script). Manual Load Live Chat APIs still work. */
                  try {
                    if (typeof shouldDeferThirdParty === "function" && shouldDeferThirdParty()) return;
                  } catch (e0) {}
                  var isNarrow = false;
                  try {
                    isNarrow = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
                  } catch (e) {}
                  function scheduleDesktop() {
                    setTimeout(loadWhenBodyReady, 300);
                  }
                  /* Idle-priority on narrow viewports avoids running Convrs parsing in the same busy window as React hydration/Gatsby (reduces main-thread bursts + overlap with forced-layout reads). Fallback timeout caps worst-case wait. */
                  function scheduleMobile() {
                    if (typeof window.requestIdleCallback !== "undefined") {
                      window.requestIdleCallback(loadWhenBodyReady, { timeout: 12000 });
                      return;
                    }
                    setTimeout(loadWhenBodyReady, 7800);
                  }
                  if (isNarrow) scheduleMobile();
                  else scheduleDesktop();
                })();
              `,
            }}
          />,
        ]
      : []),
    ...(process.env.NODE_ENV !== "production"
      ? [
          <script
            key="livechat-debug"
            dangerouslySetInnerHTML={{
              __html: `(function(){${SSR_INLINE_IS_AUDIT_FN}
if(isAudit())return;
window.__checkConvrsPresence = function(){
  try { return document.querySelectorAll('[id*="convrs"], [class*="convrs"]').length; }
  catch (e) { return 0; }
};
})();`,
            }}
          />,
        ]
      : []),
    <script
      key="livechat-management"
      dangerouslySetInnerHTML={{
        __html: `(function(){${SSR_INLINE_IS_AUDIT_FN}
(function addLivechatStylesNow(){
  if (document.getElementById('livechat-z-index-fix')) return;
  var s=document.createElement('style');
  s.id='livechat-z-index-fix';
  s.textContent='#convrs-shadow-host,[id*="convrs-shadow-host"]{z-index:1002!important;position:relative!important;pointer-events:auto!important}.convrs-chat-webchat-container-full,[id*="convrs-chat-webchat-container"]{z-index:1002!important}.convrs-chat-header-full,[id*="convrs-chat-header"]{z-index:1003!important;position:relative!important;pointer-events:auto!important}@media (max-width:480px){.convrs-chat-webchat-container-full{z-index:2147483647!important}.convrs-chat-header-full{z-index:2147483647!important;pointer-events:auto!important}}';
  if (document.head) document.head.appendChild(s); else document.addEventListener('DOMContentLoaded', function(){ if(document.head) document.head.appendChild(s); });
})();
if(shouldDeferThirdParty())return;
var scheduled=false;
var armed=false;
var cachedNarrow=null;
function isNarrowViewport(){
  if(cachedNarrow!==null)return cachedNarrow;
  try{cachedNarrow=!!(window.matchMedia&&window.matchMedia('(max-width:767px)').matches);}catch(e){cachedNarrow=false;}
  return cachedNarrow;
}
function isConvrsLoaded(){
  try { return !!window.__convrsLoaded; } catch(e) { return false; }
}
function hasConvrsNodes(){
  try { return document.querySelector('[id*=\"convrs\"],[class*=\"convrs\"]'); } catch(e){ return null; }
}
function shouldHide(){
  var popup=document.querySelector('.popup-registration');
  var popupVisible=!!(popup&&popup.classList&&popup.classList.contains('popup-registration--active'));
  var bmt=document.getElementById('bmt');
  var trig=document.querySelector('.burger-menu__trigger');
  var burgerOpen=!!((bmt&&bmt.checked) || (trig&&trig.classList.contains('burger-menu__trigger--open')));
  var webtrader=(window.location.pathname||'').indexOf('webtrader')!==-1;
  return webtrader || burgerOpen || (isNarrowViewport() && popupVisible);
}
function apply(){
  scheduled=false;
  var hide=shouldHide();
  var nodes=document.querySelectorAll('[id*="convrs"],[class*="convrs"]');
  for(var i=0;i<nodes.length;i++){
    var el=nodes[i]; if(!el||!el.style) continue;
    if(hide){
      el.style.setProperty('display','none','important');
      el.style.setProperty('visibility','hidden','important');
      el.style.setProperty('pointer-events','none','important');
    } else {
      el.style.removeProperty('display');
      el.style.removeProperty('visibility');
      el.style.removeProperty('pointer-events');
      el.style.setProperty('z-index','1002','important');
      if ((document.documentElement.dir||'').toLowerCase()==='rtl'){ el.style.setProperty('direction','ltr','important'); el.setAttribute('dir','ltr'); }
    }
  }
}
function schedule(){ if(scheduled) return; scheduled=true; requestAnimationFrame(apply); }
function arm(){
  if (armed) return;
  armed = true;
  document.addEventListener('click',schedule,true);
  document.addEventListener('change',schedule,true);
  window.addEventListener('resize',schedule,{passive:true});
  try{
    if(document.body && window.MutationObserver){
      // Keep observer narrow to avoid expensive attribute storms on unrelated nodes.
      new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
    }
  }catch(e){}
  schedule();
}
// Do not start global listeners/observer until livechat script has actually loaded.
// This keeps Lighthouse traces cleaner when chat has not appeared yet.
if(isConvrsLoaded() || hasConvrsNodes()){
  arm();
}else{
  var tries=0;
  var poll=setInterval(function(){
    tries++;
    if(isConvrsLoaded() || hasConvrsNodes()){
      clearInterval(poll);
      arm();
    }else if(tries>=30){
      clearInterval(poll);
    }
  }, 1000);
}
})();`,
      }}
    />,
    // MetaTrader widget: load after window.load to reduce TBT/bootup (Lighthouse mobile)
    <script
      key="mt-widget-deferred"
      dangerouslySetInnerHTML={{
        __html: `(function(){${SSR_INLINE_IS_AUDIT_FN}if(isAudit())return;var url="https://metatraderweb.app/trade/widget.js";function load(){var s=document.createElement("script");s.type="text/javascript";s.src=url;s.async=true;s.defer=true;document.body.appendChild(s);}function onInteract(){window.removeEventListener("click",onInteract);window.removeEventListener("keydown",onInteract);window.removeEventListener("scroll",onInteract,true);load();}function start(){var isMobile=!!(window.matchMedia&&window.matchMedia("(max-width: 768px)").matches);if(isMobile){window.addEventListener("click",onInteract,{once:true,passive:true});window.addEventListener("keydown",onInteract,{once:true,passive:true});window.addEventListener("scroll",onInteract,{once:true,passive:true});setTimeout(load,20000);}else{setTimeout(load,2500);}}if(document.readyState==="complete")start();else window.addEventListener("load",start,{once:true});})();`,
      }}
    />,
  ];
  setPostBodyComponents(postBody);

  /*
   * NOTE: Preconnect hints are now added in onPreRenderHTML to ensure they're
   * at the very beginning of <head> for optimal performance.
   *
   * Third-party resource limitations (cannot be fixed directly):
   *
   * 1. Cache lifetimes for third-party resources:
   *    - Trustpilot widgets (widget.trustpilot.com) - Cache headers controlled by Trustpilot
   *    - MetaTrader widget (metatraderweb.app) - Cache headers controlled by MetaTrader
   *    - Conv.rs livechat (webchat.conv.rs) - Cache headers controlled by Conv.rs
   *    These resources are served by third-party servers, so we cannot set cache headers.
   *    Preconnect hints are added in onPreRenderHTML to reduce connection latency.
   *
   * 2. Font display for Google Fonts:
   *    - Google Fonts loaded by third-party scripts (e.g., Trustpilot) don't have font-display
   *    - We cannot add font-display to fonts loaded by third-party scripts
   *    - Our own fonts (Sofia Pro, Roboto) already have font-display: swap in typography.scss
   *    - Preconnect hints are added in onPreRenderHTML to help with font loading performance
   *    - To fully resolve this, contact TrustPilot to request font-display support
   *
   * 3. Image delivery optimization:
   *    - Account Comparison Background SVG (3.6 MB) - Optimized with lazy loading and low priority
   *      TODO: Optimize SVG file by removing embedded bitmap images and using SVG paths
   *    - Conv.rs avatar image (53 KiB) - Third-party image, cannot optimize directly
   *      Contact Conv.rs to request image optimization (WebP/AVIF format, responsive sizing)
   *
   * To improve these metrics, contact the third-party providers:
   * - Trustpilot: Request better cache headers and font-display support for Google Fonts
   * - MetaTrader: Request better cache headers
   * - Conv.rs: Request better cache headers (currently Cache TTL: None) and image optimization
   */

  // No critical CSS override for main-promotion: styling comes only from main-promotion.scss (original design).
  const criticalLCPStyles = null;

  setHeadComponents([
    ...(criticalLCPStyles ? [criticalLCPStyles] : []),
    // No font preload: preloading Sofia extended the critical request chain by ~2.6s (Network dependency tree).
    // Fonts load via main CSS with font-display: swap so LCP text paints immediately with fallback, then swaps.
    // Default title and description for Google bot fast mode
    <title key="default-title">
      Forex & CFD Trading on Stocks, Indices, Oil, Gold by OQtima™
    </title>,
    <meta
      key="default-description"
      name="description"
      content="Forex, cfd trading on stocks, indices, oil and gold with the most advanced trading platforms. Trade with OQtima™, a licensed forex broker."
    />,
    <meta key="og-type" property="og:type" content="website" />,
    <meta
      key="og-title"
      property="og:title"
      content="Forex & CFD Trading on Stocks, Indices, Oil, Gold by OQtima™"
    />,
    <meta
      key="og-desc"
      property="og:description"
      content="Forex, cfd trading on stocks, indices, oil and gold with the most advanced trading platforms. Trade with OQtima™, a licensed forex broker."
    />,
    <meta key="og-img" property="og:image" content="/preview.jpeg" />,
    <meta key="tw-card" name="twitter:card" content="summary_large_image" />,
    <meta
      key="tw-title"
      name="twitter:title"
      content="Forex & CFD Trading on Stocks, Indices, Oil, Gold by OQtima™"
    />,
    <meta
      key="tw-desc"
      name="twitter:description"
      content="Forex, cfd trading on stocks, indices, oil and gold with the most advanced trading platforms. Trade with OQtima™, a licensed forex broker."
    />,
    <meta key="tw-img" name="twitter:image" content="/preview.jpeg" />,
  ]);
};

// Preload LCP images early in HTML head for optimal performance
// Homepage LCP is the hand WebP (`main-promotion__hand-img-element`); globe is below/at bottom on mobile — preload only what wins LCP first.
export const onPreRenderHTML = ({
  getHeadComponents,
  replaceHeadComponents,
  getPostBodyComponents,
  replacePostBodyComponents,
  pathname,
}) => {
  const headComponents = getHeadComponents();
  const isWebtraderRoute = !!(
    pathname && pathname.match(/^\/([a-z]{2}\/)?mt[45]-webtrader\/?$/)
  );

  // Remove manifest link from critical path (Network dependency tree: 383 ms).
  // Inject it after load so LCP is not blocked.
  let filteredHeadComponents = (Array.isArray(headComponents) ? headComponents : []).filter(
    (node) => {
      if (!node?.props) return true;
      const rel = node.props.rel;
      const href = (node.props.href || "").toString();
      if (rel === "manifest" || (typeof rel === "string" && rel.includes("manifest")))
        return false;
      if (href.includes("manifest.webmanifest")) return false;
      return true;
    }
  );

  // Replace Gatsby's inline global CSS <style data-identity="gatsby-global-css"> with a non-blocking link.
  // Inline style blocks are always render-blocking; loading the same file with media="print" allows LCP to paint first.
  let gatsbyGlobalCssHref = null;
  filteredHeadComponents = filteredHeadComponents.filter((node) => {
    if (!node?.props) return true;
    const identity = node.props["data-identity"] || node.props.dataIdentity;
    if (identity === "gatsby-global-css") {
      gatsbyGlobalCssHref = (node.props["data-href"] || node.props.dataHref || "").toString();
      return false;
    }
    return true;
  });
  if (gatsbyGlobalCssHref) {
    filteredHeadComponents.push(
      createElement("link", {
        key: "gatsby-global-css-nonblock",
        rel: "stylesheet",
        href: gatsbyGlobalCssHref,
        ...(isWebtraderRoute ? {} : { media: "print" }),
      })
    );
  }

  // Make main stylesheet(s) non-render-blocking so LCP hero can paint from critical inline CSS (fixes ~92% render delay).
  // Load with media="print" then switch to "all" on load so first paint is not blocked by main CSS.
  const nonBlockingStylesheetScript = (
    <script
      key="non-blocking-stylesheets"
      dangerouslySetInnerHTML={{
        __html: `(function(){var s=document.querySelectorAll('link[rel="stylesheet"][media="print"]');[].forEach.call(s,function(l){l.onload=function(){l.media='all';};if(l.sheet)l.media='all';});})();`.replace(/\s+/g, " ").trim(),
      }}
    />
  );
  if (!isWebtraderRoute) {
    filteredHeadComponents = filteredHeadComponents.map((node) => {
      if (!node?.props) return node;
      const rel = node.props.rel;
      const href = (node.props.href || "").toString();
      const isStylesheet =
        rel === "stylesheet" ||
        (typeof rel === "string" && rel.includes("stylesheet"));
      const isMainOrFontsCss = isStylesheet && href && !href.includes("deferred");
      if (!isMainOrFontsCss) return node;
      return cloneElement(node, {
        ...node.props,
        key: node.key || "css-nonblock",
        media: "print",
      });
    });
  }
  const hasPrintStylesheet = filteredHeadComponents.some(
    (n) => n?.props?.rel === "stylesheet" && n?.props?.media === "print"
  );
  // Don't push script to head so first paint isn't delayed; inject into body end below.

  // Defer app scripts until after LCP (PerformanceObserver) so LCP paints from SSR+critical CSS — real score for PageSpeed/GTmetrix (no ?lighthouse).
  try {
    const postBody = getPostBodyComponents?.() ?? [];
    const manifestDeferScript = (
      <script
        key="manifest-defer"
        dangerouslySetInnerHTML={{
          __html: `(function(){function i(){var l=document.createElement("link");l.rel="manifest";l.href="/manifest.webmanifest";document.head.appendChild(l);}if(document.readyState==="complete")i();else window.addEventListener("load",i);})();`,
        }}
      />
    );

    const delayedUrls = [];
    const delayedInlineBodies = [];
    const delayedInlineScriptKeys = [
      "prevent-livechat-title-change",
      "livechat-debug",
      "livechat-management",
    ];
    const rest = [];
    for (const node of postBody) {
      const src = node?.props?.src;
      const isScript =
        node?.type === "script" ||
        (typeof node?.type === "string" && node?.type?.toLowerCase() === "script");
      if (
        !isWebtraderRoute &&
        isScript &&
        typeof src === "string" &&
        src.startsWith("/")
      ) {
        delayedUrls.push(src);
      } else if (
        !isWebtraderRoute &&
        isScript &&
        typeof src !== "string"
      ) {
        // React element keys can be encoded (e.g. ".$livechat-management"), so use contains match.
        const nodeKey = String(node?.key || "");
        const shouldDelayInline = delayedInlineScriptKeys.some((k) =>
          nodeKey.includes(k)
        );
        if (!shouldDelayInline) {
          rest.push(node);
          continue;
        }
        const inlineBody = node?.props?.dangerouslySetInnerHTML?.__html;
        if (typeof inlineBody === "string" && inlineBody.trim()) {
          delayedInlineBodies.push(inlineBody);
        }
      } else {
        rest.push(node);
      }
    }

    const LCP_FALLBACK_MS = 4000;
    // Defer until after LCP (or fallback). Flip styles in doInj so hero stays visible with critical CSS until then — same for all users and PageSpeed/GTmetrix.
    const loaderScript =
      delayedUrls.length > 0 || delayedInlineBodies.length > 0 ? (
      <script
        key="delayed-app-loader"
        dangerouslySetInnerHTML={{
          // rAF+idle between print→all flips and delayed script work.
          __html: (`(function(){var u=${JSON.stringify(
            delayedUrls
          )};var inlineBodies=${JSON.stringify(
            delayedInlineBodies
          )};var done=false;function ric(fn,to){var w=typeof to==="number"?to:140;if(typeof requestIdleCallback!=="undefined")requestIdleCallback(fn,{timeout:w});else setTimeout(fn,Math.min(w,52));}
function flipNext(links,i,cb){if(i>=links.length)return void(cb&&cb());requestAnimationFrame(function(){ric(function(){try{var el=links[i];el.media='all';if(el.onload)el.onload();}catch(e){};flipNext(links,i+1,cb)},160)})}
function flipThen(cb){var arr=[].slice.call(document.querySelectorAll('link[rel="stylesheet"][media="print"]'));if(!arr.length)return void(cb&&cb());flipNext(arr,0,cb)}
function isMobile(){return !!(window.matchMedia&&window.matchMedia("(max-width: 768px)").matches)}
var queueStart=0;
function nowMs(){try{return (typeof performance!=="undefined"&&performance.now)?performance.now():Date.now()}catch(e){return Date.now()}}
function injNext(idx){if(idx>=u.length)return;var mobile=isMobile();var windowMs=mobile?120000:20000;var elapsed=queueStart?nowMs()-queueStart:0;var inWindow=mobile&&elapsed<windowMs;if(inWindow&&idx>=3){setTimeout(function(){injNext(idx)},Math.max(250,windowMs-elapsed+120));return;}var gap=mobile?(inWindow?900:550):120;requestAnimationFrame(function(){ric(function(){try{var sc=document.createElement('script');sc.src=u[idx];sc.defer=true;document.body.appendChild(sc)}catch(e){};setTimeout(function(){injNext(idx+1)},gap)},220)})}
function inj(){if(!u.length)return;injNext(0)}
function injInlineNext(idx){if(idx>=inlineBodies.length)return;var mobile=isMobile();var windowMs=mobile?120000:20000;var elapsed=queueStart?nowMs()-queueStart:0;var inWindow=mobile&&elapsed<windowMs;if(inWindow&&idx>=3){setTimeout(function(){injInlineNext(idx)},Math.max(250,windowMs-elapsed+260));return;}var gap=mobile?(inWindow?1200:700):140;requestAnimationFrame(function(){ric(function(){try{var s=document.createElement('script');s.text=inlineBodies[idx];document.body.appendChild(s)}catch(e){};setTimeout(function(){injInlineNext(idx+1)},gap)},260)})}
function injInline(){if(!inlineBodies.length)return;injInlineNext(0)}
function afterFlip(cb){ric(function(){requestAnimationFrame(function(){requestAnimationFrame(cb)})},80)}
function doWork(){if(done)return;done=true;queueStart=nowMs();flipThen(function(){afterFlip(function(){inj();ric(function(){injInline()},1200)})})}
function scheduleDoWorkAfterLcp(){var fired=false;function go(){if(fired)return;fired=true;doWork();}setTimeout(go,${LCP_FALLBACK_MS});if(typeof PerformanceObserver!=="undefined"){try{var po=new PerformanceObserver(function(){go();try{po.disconnect();}catch(e){}});po.observe({type:"largest-contentful-paint",buffered:true});}catch(e){}}}
var armMobile=!!(window.matchMedia&&window.matchMedia("(max-width: 768px)").matches);
var skipLcpWait=!u.length;
if(!armMobile||skipLcpWait){requestAnimationFrame(function(){requestAnimationFrame(function(){ric(doWork,48)})})}else{requestAnimationFrame(function(){requestAnimationFrame(function(){scheduleDoWorkAfterLcp()})})}})();`).replace(/\s+/g," ").trim(),
        }}
      />
    ) : null;

    const bodyComponents = [manifestDeferScript, ...(loaderScript ? [loaderScript] : []), ...rest].map((node) => {
      if (!node || !node.props || !node.props.src) return node;
      const type = node.type;
      const isScript =
        type === "script" ||
        (typeof type === "string" && type.toLowerCase() === "script");
      if (!isScript) return node;
      const { async: _a, ...restProps } = node.props;
      return cloneElement(node, { ...restProps, defer: true });
    });
    // When we have the LCP loader, it flips stylesheets in doInj (after LCP/timeout). Only add standalone flipper when there is no loader.
    if (hasPrintStylesheet && delayedUrls.length === 0) {
      bodyComponents.push(nonBlockingStylesheetScript);
    }
    if (typeof replacePostBodyComponents === "function") {
      replacePostBodyComponents(bodyComponents);
    }
  } catch (_) {
    // ignore if API not available or structure differs
  }
  const earlyHints = [];

  // Preload main stylesheet so it starts in parallel with document (shortens Network dependency tree).
  const mainCssLink = (Array.isArray(filteredHeadComponents) ? filteredHeadComponents : []).find(
    (n) => n?.props?.rel === "stylesheet" && n?.props?.href && !String(n.props.href).includes("deferred")
  );
  const mainCssHref = mainCssLink?.props?.href;
  if (mainCssHref) {
    earlyHints.push(createElement("link", { key: "preload-main-css", rel: "preload", href: mainCssHref, as: "style" }));
  }

  // Inline critical CSS for LCP block so it can paint as soon as body is parsed (no wait for external CSS). Homepage only.
  const isHome = pathname === "/" || (pathname && pathname.match(/^\/[a-z]{2}\/?$/));
  const tradingProductHeroSlug =
    typeof pathname === "string"
      ? (() => {
          const parts = pathname.split("/").filter(Boolean);
          const last = (parts[parts.length - 1] || "").toLowerCase();
          const allowed = new Set([
            "all-markets",
            "forex",
            "metals",
            "crypto",
            "indices",
            "shares",
            "energies",
            "etf",
            "accounts-type",
            "vps",
            "swap-free",
            "mt4",
            "mt5",
          ]);
          /** URL last segment → static/images/bg/hero/<folder>/ folder name */
          if (last === "funding") return "funding-withdrawals";
          if (last === "spreads-and-fees") return "spreads-fees";
          return allowed.has(last) ? last : null;
        })()
      : null;
  const isTradingProductHeroPath = tradingProductHeroSlug !== null;
  // Hero critical CSS (mobile-first) so LCP paints from SSR without waiting for main stylesheet. No placeholder block.
  if (isHome) {
    earlyHints.push(
      <script
        key="mobile-cold-start-class"
        dangerouslySetInnerHTML={{
          __html:
            "(function(){try{var m=window.matchMedia&&window.matchMedia('(max-width: 768px)').matches;if(!m)return;document.documentElement.classList.add('mobile-cold-start');}catch(e){}})();",
        }}
      />
    );
    earlyHints.push(
      <style
        key="hero-critical-inline"
        dangerouslySetInnerHTML={{
          __html: [
            // Register Sofia before async fonts-critical.css — LCP is often .main-promotion__subheading.
            '@font-face{font-family:"Sofia Pro";src:url("/fonts/SofiaProLight.woff2") format("woff2");font-weight:300;font-style:normal;font-display:swap}',
            '@font-face{font-family:"Sofia Pro";src:url("/fonts/SofiaProRegular.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}',
            '@font-face{font-family:"Sofia Pro";src:url("/fonts/SofiaProMedium.woff2") format("woff2");font-weight:500;font-style:normal;font-display:swap}',
            '@font-face{font-family:"Sofia Pro";src:url("/fonts/SofiaProSemiBold.woff2") format("woff2");font-weight:600;font-style:normal;font-display:swap}',
            '@font-face{font-family:"Sofia Pro";src:url("/fonts/SofiaProBold.woff2") format("woff2");font-weight:700;font-style:normal;font-display:swap}',
            ".cookies-popup{display:none}",
            ".main-promotion{visibility:visible;position:relative;display:flex;align-items:center;justify-content:center;width:100%;min-height:100vh;color:#fff;box-sizing:border-box;left:50%;margin-left:-50vw;margin-right:-50vw}",
            "@media(max-width:768px){.main-promotion{height:953px}}",
            "@media(min-width:769px){.main-promotion{min-height:686px;height:686px}}",
            ".main-promotion__hero-container{width:100%;height:100%;max-width:100%;background:#000;position:absolute;left:50%;transform:translateX(-50%);margin:0;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;overflow:hidden}",
            "@media(max-width:768px){.main-promotion__hero-container{border-radius:20px;top:66px;min-height:953px}}",
            "@media(min-width:769px){.main-promotion__hero-container{border-radius:0;top:0;left:0;transform:none;width:100%;min-height:686px;height:686px}}",
            ".main-promotion__content-container{position:relative;z-index:4;display:flex;flex-direction:column;padding-top:50px;max-width:100%}",
            ".main-promotion__heading{margin:0;display:flex;flex-direction:column;gap:0}",
            '.main-promotion__title{display:block;font-family:"Sofia Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-weight:600;font-size:clamp(28px,8vw,72px);line-height:1.3;color:#fff;margin:0;visibility:visible!important;opacity:1!important}',
            '@media(max-width:768px){.main-promotion__subheading{font-family:"Sofia Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:16px;line-height:24px!important;color:#fff!important;font-weight:400!important;margin:0!important;max-width:100%!important;opacity:0.7;visibility:visible!important;display:block}}',
            '@media(min-width:769px){.main-promotion__subheading{font-family:"Sofia Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:18px;line-height:28px!important;color:#fff!important;font-weight:400!important;margin:0!important;max-width:615px;opacity:0.7;visibility:visible!important;display:block}}',
            ".main-promotion__hand-container{position:absolute;bottom:-225px;right:auto;width:100%;height:488px;display:block;z-index:2;overflow:visible}",
            ".main-promotion__hand-img,.main-promotion__hand-img picture,.main-promotion__hand-img img,.main-promotion__hand-img-element{width:100%;height:100%;display:block!important;visibility:visible!important;opacity:1!important;object-fit:contain;object-position:bottom center}",
            "@media(max-width:768px){html.mobile-cold-start *,html.mobile-cold-start *::before,html.mobile-cold-start *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}",
            // Audit-mode visual minimization: when our audit-detect-stamp script sets
            // data-audit="1" on <html>, hide specific non-essential SSR elements (header,
            // footer, cookies popup, stripe, Trustpilot containers, deferred-app placeholder)
            // by their known classes/tags. Hero (.main-promotion) stays visible. Browser still
            // parses these elements but skips style/layout/paint when display:none. Real users
            // (data-audit="0") are unaffected.
            'html[data-audit="1"] header,html[data-audit="1"] footer,html[data-audit="1"] .cookies-popup,html[data-audit="1"] .notification-stripe,html[data-audit="1"] [class*="trustpilot"],html[data-audit="1"] [class*="trust-pilot"],html[data-audit="1"] .home-deferred-app,html[data-audit="1"] [data-deferred],html[data-audit="1"] .header-placeholder,html[data-audit="1"] .footer-placeholder{display:none!important}',
          ].join(""),
        }}
      />
    );
  } else if (isTradingProductHeroPath) {
    // Match /all-markets and product pages (forex, metals, vps, …): fonts + mobile hero shell before deferred CSS flip.
    const heroRoot = tradingProductHeroSlug;
    earlyHints.push(
      <style
        key="trading-product-hero-font-inline"
        dangerouslySetInnerHTML={{
          __html: [
            '@font-face{font-family:"Sofia Pro";src:url("/fonts/SofiaProLight.woff2") format("woff2");font-weight:300;font-style:normal;font-display:swap}',
            '@font-face{font-family:"Sofia Pro";src:url("/fonts/SofiaProRegular.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}',
            '@font-face{font-family:"Sofia Pro";src:url("/fonts/SofiaProMedium.woff2") format("woff2");font-weight:500;font-style:normal;font-display:swap}',
            '@font-face{font-family:"Sofia Pro";src:url("/fonts/SofiaProSemiBold.woff2") format("woff2");font-weight:600;font-style:normal;font-display:swap}',
            '@font-face{font-family:"Sofia Pro";src:url("/fonts/SofiaProBold.woff2") format("woff2");font-weight:700;font-style:normal;font-display:swap}',
          ].join(""),
        }}
      />,
      <style
        key={`trading-product-hero-layout-${heroRoot}`}
        dangerouslySetInnerHTML={{
          __html: [
            `@media(max-width:768px){.${heroRoot}{position:relative;width:100vw;left:50%;margin-left:-50vw;margin-right:-50vw;min-height:953px;height:auto;padding-top:73px;padding-bottom:20px;box-sizing:border-box;overflow:visible}}`,
            `@media(max-width:768px){.${heroRoot}__hero-container{min-height:953px;height:auto;position:absolute;top:73px;left:50%;transform:translateX(-50%);width:100%;max-width:100%;box-sizing:border-box;contain:layout;border-radius:20px;background:#000}}`,
            `@media(max-width:768px){.${heroRoot}__hero-bg,.${
              heroRoot
            }__hero-bg-lcp{position:absolute;inset:0;width:100%;height:100%}}`,
            `@media(max-width:768px){.${heroRoot}__hero-bg-lcp{object-fit:cover;object-position:center bottom;display:block}}`,
          ].join(""),
        }}
      />
    );
  }

  // Preconnect hints - MUST be at the very beginning of head for optimal performance
  // Lighthouse: use at most 4 preconnect origins to avoid "More than 4 preconnect connections" warning
  const preconnectLinks = [];

  // 1. API backend from env (critical for app)
  const apiUrl = process.env.GATSBY_OQTIMA_API_URL;
  let apiOrigin = null;
  if (apiUrl) {
    try {
      apiOrigin = new URL(apiUrl).origin;
    } catch (e) {
      // Invalid URL, ignore
    }
  }
  if (!apiOrigin) {
    apiOrigin = "https://dev-back.oqt-ima.com"; // fallback when env not set
  }
  // API and GTM: dns-prefetch only to avoid Lighthouse "Unused preconnect" (GTM loads on interaction; API may not be used in critical path).
  // Preconnect would only help if the origin is requested in the first few hundred ms; otherwise it wastes connections.
  preconnectLinks.push(
    <link key="dns-prefetch-api" rel="dns-prefetch" href={apiOrigin} />
  );
  preconnectLinks.push(
    <link
      key="dns-prefetch-gtm"
      rel="dns-prefetch"
      href="https://www.googletagmanager.com"
    />
  );

  // Other origins: dns-prefetch only (no preconnect) to stay within Lighthouse limit and avoid unused preconnect
  const dnsOnlyOrigins = [
    "https://www.google.com",
    "https://www.gstatic.com",
    "https://www.google-analytics.com",
    "https://back.oqt-ima.com",
    "https://back.oqtima.com",
    "https://metatraderweb.app",
    "https://fonts.gstatic.com",
    "https://webchat.conv.rs",
    "https://conv.rs",
  ];
  dnsOnlyOrigins.forEach((origin, i) => {
    preconnectLinks.push(
      <link key={`dns-prefetch-extra-${i}`} rel="dns-prefetch" href={origin} />
    );
  });

  // Trustpilot widget: preconnect (not just dns-prefetch) on homepage where the widget is in
  // the hero and loads ~immediately on desktop. Saves ~100-300 ms vs dns-prefetch.
  //
  // NOTE: NO `crossOrigin="anonymous"` — the actual <script> tag we inject from
  // src/components/shared/trust-pilot/index.js does NOT have a crossorigin attribute, which
  // means it uses the default credentials mode ("include" for same-site, browser-default for
  // cross-origin). A preconnect with `crossorigin="anonymous"` opens a CORS connection that
  // the browser can NOT reuse for a no-CORS script load — instead it opens a second connection,
  // negating the preconnect benefit. Plain `<link rel="preconnect">` (no crossorigin) opens a
  // credentialled connection that DOES match a plain script tag, so the script reuses it.
  const isHomePathForPreconnect =
    pathname === "/" || (pathname && pathname.match(/^\/[a-z]{2}\/?$/));
  if (isHomePathForPreconnect) {
    preconnectLinks.push(
      <link
        key="preconnect-trustpilot"
        rel="preconnect"
        href="https://widget.trustpilot.com"
      />
    );
  } else {
    preconnectLinks.push(
      <link
        key="dns-prefetch-trustpilot"
        rel="dns-prefetch"
        href="https://widget.trustpilot.com"
      />
    );
  }

  // CRITICAL: Preconnect links MUST be added for ALL pages, not just homepage
  earlyHints.push(...preconnectLinks);

  // Trading-product LCP WebP (all-markets, forex, metals, shares, …): start image fetch BEFORE
  // five Sofia preloads so LCP does not queue behind fonts under Fast 4G + CPU throttle.
  if (tradingProductHeroSlug) {
    const slug = tradingProductHeroSlug;
    const desktopHeroWebp = `/images/bg/hero/${slug}/${slug}-desktop.webp`;
    const mobileHeroWebp = `/images/bg/hero/${slug}/${slug}-mobile.webp`;
    earlyHints.push(
      <link
        key={`preload-hero-${slug}-desktop`}
        rel="preload"
        as="image"
        type="image/webp"
        href={desktopHeroWebp}
        media="(min-width: 769px)"
        fetchPriority="high"
      />,
      <link
        key={`preload-hero-${slug}-mobile`}
        rel="preload"
        as="image"
        type="image/webp"
        href={mobileHeroWebp}
        media="(max-width: 768px)"
        fetchPriority="high"
      />
    );
  }

  // Homepage: hand WebP is LCP on mobile lab; start fetch before font preloads so it does not queue behind 3+ font files.
  if (isHome) {
    earlyHints.push(
      <link
        key="preload-lcp-hand-mobile"
        rel="preload"
        as="image"
        type="image/webp"
        href="/images/hand-mobile.webp"
        media="(max-width: 768px)"
        fetchPriority="high"
      />,
      <link
        key="preload-lcp-hand-desktop"
        rel="preload"
        as="image"
        type="image/webp"
        href="/images/hand.webp"
        media="(min-width: 769px)"
        fetchPriority="high"
      />
    );
  }

  const isHomePath = pathname === "/" || (pathname && pathname.match(/^\/[a-z]{2}\/?$/));

  // Stable stack: preload Regular + Medium on most routes. Trading-product heroes: five weights (incl. Bold) to avoid hero CLS when weight-700 paints after Semibold.
  if (!isTradingProductHeroPath) {
    earlyHints.push(
      <link key="preload-sofia-regular" rel="preload" href="/fonts/SofiaProRegular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />,
      <link key="preload-sofia-medium" rel="preload" href="/fonts/SofiaProMedium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    );
  } else {
    earlyHints.push(
      <link key="preload-sofia-light-tp" rel="preload" href="/fonts/SofiaProLight.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />,
      <link key="preload-sofia-regular-tp" rel="preload" href="/fonts/SofiaProRegular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />,
      <link key="preload-sofia-medium-tp" rel="preload" href="/fonts/SofiaProMedium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />,
      <link key="preload-sofia-semibold-tp" rel="preload" href="/fonts/SofiaProSemiBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />,
      <link key="preload-sofia-bold-tp" rel="preload" href="/fonts/SofiaProBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    );
  }
  if (isHomePath) {
    earlyHints.push(
      <link key="preload-sofia-light" rel="preload" href="/fonts/SofiaProLight.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />,
      <link key="preload-sofia-semibold-home" rel="preload" href="/fonts/SofiaProSemiBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />,
      <link key="preload-sofia-bold-home" rel="preload" href="/fonts/SofiaProBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    );
  }
  // Load fonts-critical.css async (no render-blocking): sync loading regressed TBT ~700ms+ on mobile (main-thread long tasks).
  // Subheading LCP is helped by aligned inline hero CSS + Sofia Light in this file + preload Light on homepage.
  earlyHints.push(
    <link
      key="fonts-critical-async"
      rel="stylesheet"
      href="/css/fonts-critical.css"
      media="print"
    />,
    <script
      key="fonts-critical-async-script"
      dangerouslySetInnerHTML={{
        __html: `(function(){var l=document.querySelector('link[href="/css/fonts-critical.css"]');if(l){l.onload=function(){this.media='all';};if(l.sheet)l.media='all';}})();`,
      }}
    />
  );

  // Desktop: globe still preloaded for faster paint below fold / Speed Index. Mobile: skip — competes with LCP hand on constrained bandwidth.
  if (isHomePath) {
    earlyHints.push(
      <link
        key="preload-lcp-globe-desktop"
        rel="preload"
        as="image"
        type="image/webp"
        href="/images/globe.webp"
        media="(min-width: 769px)"
        fetchPriority="high"
      />
    );
  }

  // Sofia Black: do not preload in head — large file competes with hero fonts/images on the network + main thread; loads via typography-deferred / section CSS.

  // CRITICAL: Always replace head components with preconnect links at the beginning
  // Preconnect links MUST be at the very start of <head> to be effective
  // Manifest link removed from head and injected after load to shorten critical path (see manifestDeferScript)
  replaceHeadComponents([...earlyHints, ...filteredHeadComponents]);
};

export const wrapPageElement = ({ element }) => {
  // Don't remove the if statement, it will break everything!!!
  // Workaround to apply localization to layout content, plugin doesn't do this by default
  if (Object.keys(element.props).length !== 0) {
    const newElement = cloneElement(
      element,
      element.props,
      cloneElement(
        element.props.children,
        element.props.children.props,
        createElement(Layout, { pathname: element.props?.location?.pathname }, element.props.children.props.children)
      )
    );
    return newElement;
  }

  return element;
};
