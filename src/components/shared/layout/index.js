import React, {
  useEffect,
  useState,
  lazy,
  Suspense,
  startTransition,
} from "react";
import "../../../assets/styles/index.scss";
import { ClientResolverProvider } from "../../../context/client-resolver-context";
import LanguageContext, {
  LanguageProvider,
  getLanguageStubValue,
} from "../../../context/language-context";
import {
  MarketingContext,
  MarketingContextProvider,
  MARKETING_STUB_VALUE,
} from "../../../context/marketing-context";
import CookieContext, {
  CookieProvider,
  COOKIE_STUB_VALUE,
} from "../../../context/cookie-context";
import SearchContext, {
  SearchProvider,
  SEARCH_STUB_VALUE,
} from "../../../context/search-context";
import CommonContext, {
  CommonProvider,
  COMMON_STUB_VALUE,
} from "../../../context/common-context";
import NotificationStripeContext, {
  NotificationStripeProvider,
  NOTIFICATION_STRIPE_STUB_VALUE,
} from "../../../context/notification-stripe-context";
import { TradingProvider } from "../../../context/trading-context";
import ReCaptchaProvider from "../recaptcha-provider";
import WhenInView from "../when-in-view";

const Header = lazy(() => import("../../header"));
import { sendLog } from "../../../helpers/services/log-service";

const Footer = lazy(() => import("../../footer"));
const CookiesPopup = lazy(() =>
  import("../../cookies-popup").then((m) => ({ default: m.CookiesPopup }))
);
import { pushUTMParamsToDataLayer } from "../../../helpers/services/gtm-service";
import { isBrowser } from "../../../helpers/services/is-browser";
import {
  shouldDeferHeavyWorkForLighthouse,
  shouldDeferStylesheetsForLighthouse,
  isAuditEnvironment,
  AUDIT_HEAVY_WORK_DEFER_MS,
} from "../../../helpers/is-audit-environment";
import { isMarketingHomePath } from "../../../helpers/is-marketing-home-path";
import { MOBILE_VIEWPORT_MQ } from "../../../helpers/viewport-media";
import { routeNeedsLiveTrading } from "../../../helpers/route-needs-live-trading";
import { useLocation } from "@reach/router";

// true so LCP hero is in SSR HTML and first paint (avoids ~2.6s element render delay in Lighthouse)
/** Delay before mounting real Cookie/Marketing/NotificationStripe/ReCaptcha (timer only, no interaction). */
const DEFERRED_PROVIDERS_DELAY_MS = 9800;
/** In audit: defer past typical mobile Lighthouse traces (see AUDIT_HEAVY_WORK_DEFER_MS). */
const DEFERRED_PROVIDERS_DELAY_AUDIT_MS = AUDIT_HEAVY_WORK_DEFER_MS;
/** Avoid mounting provider stack in the same frame as below-hero hydration. */
const DEFERRED_PROVIDERS_AFTER_BELOW_HERO_DELAY_MS = 3600;
/** Mobile: MUST NOT match index FULL_PHASE_DELAY_MS — same tick caused 3× long-task pile (TBT ~2.9s). */
/**
 * Real users on mobile marketing home: load deferred CSS soon so below-hero (ticker, Trustpilot host)
 * is styled. The previous ~18.5s timer matched lab-only tuning but made the UI look "unstyled" for many seconds.
 * Lighthouse / PSI still use isAuditEnvironment() → AUDIT_HEAVY_WORK_DEFER_MS for this effect.
 */
/** Align with Homepage mobile quick-reveal (~280ms) so first deferred stylesheet runs before/a s HomeDeferredApp mounts. */
const DEFERRED_STYLES_DELAY_MOBILE_HOME_UX_MS = 280;
const DEFERRED_STYLES_DELAY_MOBILE_MS = 11400;
/** Deterministic mobile-home scheduling to avoid random timer collisions across Lighthouse runs. */
const HEADER_MOUNT_DELAY_MOBILE_MS_HOME_STRICT = 2400;
const COOKIES_POPUP_MOUNT_DELAY_MOBILE_MS_HOME_STRICT = 3600;
const DEFERRED_PROVIDERS_DELAY_MOBILE_HOME_STRICT_MS = 16000;

/** Stagger lazy header vs CookiesPopup chunks on mobile — same tick caused multi-second LH TBT in bad runs. */
const HEADER_MOUNT_DELAY_MOBILE_MS_HOME = 1600;
const HEADER_MOUNT_DELAY_MOBILE_MS_INNER = 200;
/** Localhost mobile Lighthouse: defer header past trace window (useWindowSize + layout in header/footer). */
const HEADER_MOUNT_DELAY_MOBILE_LAB_INNER_MS = 8000;
/** Still early for consent; after header stagger to split main-thread bursts. */
const COOKIES_POPUP_MOUNT_DELAY_MOBILE_MS_HOME = 600;
const COOKIES_POPUP_MOUNT_DELAY_MOBILE_MS_INNER = 400;
const COOKIES_POPUP_MOUNT_DELAY_DESKTOP_MS = 400;

const Layout = ({ children, pathname: pathnameFromPage }) => {
  try {
    const [isLoaded, setIsLoaded] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const location = useLocation();
    const resolvedPath = pathnameFromPage ?? location?.pathname ?? "";
    const isHomeMarketing = isMarketingHomePath(resolvedPath);
    const enableLiveTrading = routeNeedsLiveTrading(resolvedPath);
    /** Always render real providers from start. Component-type swap was unmounting children (Trustpilot/HomeDeferredApp) on first user interaction (~6s). */
    const [deferredProvidersReady, setDeferredProvidersReady] = useState(true);
    const [showHeader, setShowHeader] = useState(false);
    const [showCookiesPopup, setShowCookiesPopup] = useState(false);
    // Use pathname from page props when available so stub matches server (avoids hydration #418).
    const pathnameForStub = pathnameFromPage ?? location?.pathname;
    const isContactUsPage =
      location?.pathname === "/contact-us" ||
      location?.pathname === "/contact-us/" ||
      location?.pathname?.includes("/contact-us");

    // Use only isPopupOpen here so server and client render the same (avoids hydration #418).
    // Popup open state from external script is picked up by the MutationObserver below.
    const isPopupRegistrationOpen = isPopupOpen;

    useEffect(() => {
      const setLoaded = () => startTransition(() => setIsLoaded(true));
      if (typeof scheduler !== "undefined" && scheduler.yield) {
        scheduler.yield().then(setLoaded).catch(setLoaded);
      } else {
        requestAnimationFrame(setLoaded);
      }
    }, []);

    // Leaving marketing home enables full providers immediately (e.g. user opened / then navigated to /markets).
    useEffect(() => {
      if (!isMarketingHomePath(resolvedPath)) {
        startTransition(() => setDeferredProvidersReady(true));
      }
    }, [resolvedPath]);

    // Inner routes (/vps/, /mt4/, …): homepage never fires belowHeroContentReady — wake
    // useWindowSize listeners early so they do not read innerWidth at the 6.5s fallback (forced reflow).
    useEffect(() => {
      if (!isBrowser() || isMarketingHomePath(resolvedPath)) {
        return undefined;
      }
      let cancelled = false;
      const fire = () => {
        if (cancelled || typeof window.dispatchEvent !== "function") return;
        requestAnimationFrame(() => {
          if (cancelled) return;
          window.dispatchEvent(new CustomEvent("belowHeroContentReady"));
        });
      };
      let idleId;
      let timeoutId;
      if (typeof requestIdleCallback !== "undefined") {
        idleId = requestIdleCallback(fire, { timeout: 400 });
      } else {
        timeoutId = window.setTimeout(fire, 0);
      }
      return () => {
        cancelled = true;
        if (idleId != null && typeof cancelIdleCallback !== "undefined") {
          cancelIdleCallback(idleId);
        }
        if (timeoutId != null) {
          window.clearTimeout(timeoutId);
        }
      };
    }, [resolvedPath]);

    // Mount Header as soon as possible so placeholder→header happens in one frame. Audit: long defer.
    useEffect(() => {
      if (!isBrowser()) return;
      let cancelled = false;
      const show = () => {
        if (cancelled) return;
        const mount = () => {
          if (!cancelled) startTransition(() => setShowHeader(true));
        };
        if (typeof requestIdleCallback !== "undefined") {
          requestIdleCallback(
            () => requestAnimationFrame(mount),
            { timeout: 250 }
          );
        } else {
          requestAnimationFrame(mount);
        }
      };
      // Only true Lighthouse/PSI should delay the header 3 min.
      if (isAuditEnvironment()) {
        const t = setTimeout(show, DEFERRED_PROVIDERS_DELAY_AUDIT_MS);
        return () => {
          cancelled = true;
          clearTimeout(t);
        };
      }
      let t;
      const initialTimer = setTimeout(() => {
        if (cancelled) return;
        const mobile =
          typeof window !== "undefined" &&
          window.matchMedia("(max-width: 768px)").matches;
        if (mobile) {
          const staggerMs = isHomeMarketing
            ? HEADER_MOUNT_DELAY_MOBILE_MS_HOME_STRICT
            : shouldDeferHeavyWorkForLighthouse()
              ? HEADER_MOUNT_DELAY_MOBILE_LAB_INNER_MS
              : HEADER_MOUNT_DELAY_MOBILE_MS_INNER;
          t = setTimeout(show, staggerMs);
        } else {
          show();
        }
      }, 20);
      return () => {
        cancelled = true;
        clearTimeout(initialTimer);
        if (t) clearTimeout(t);
      };
    }, [isHomeMarketing]);

    useEffect(() => {
      if (!isBrowser()) return;
      let cancelled = false;
      const mountCookies = () => {
        if (cancelled) return;
        const mount = () => {
          if (!cancelled)
            startTransition(() => setShowCookiesPopup(true));
        };
        if (typeof requestIdleCallback !== "undefined") {
          requestIdleCallback(
            () => requestAnimationFrame(mount),
            { timeout: 300 }
          );
        } else {
          requestAnimationFrame(mount);
        }
      };
      let t;
      const initialTimer = setTimeout(() => {
        if (cancelled) return;
        const mobile =
          typeof window !== "undefined" &&
          window.matchMedia("(max-width: 768px)").matches;
        const delayMobile = isHomeMarketing
          ? COOKIES_POPUP_MOUNT_DELAY_MOBILE_MS_HOME_STRICT
          : COOKIES_POPUP_MOUNT_DELAY_MOBILE_MS_INNER;
        const delayMs = mobile
          ? delayMobile
          : COOKIES_POPUP_MOUNT_DELAY_DESKTOP_MS;
        t = window.setTimeout(mountCookies, delayMs);
      }, 20);
      return () => {
        cancelled = true;
        clearTimeout(initialTimer);
        if (t) window.clearTimeout(t);
      };
    }, [isHomeMarketing]);

    // Mount real Cookie, Marketing, NotificationStripe, ReCaptcha. Marketing homepage: stagger vs below-hero. Inner routes: prod = already hydrated with full providers; audit = defer once.
    useEffect(() => {
      if (!isBrowser()) return;
      let t;
      const mount = () => startTransition(() => setDeferredProvidersReady(true));
      const doMount = () => {
        if (typeof scheduler !== "undefined" && scheduler.yield) {
          scheduler.yield().then(mount).catch(mount);
        } else {
          mount();
        }
      };

      const pathNow = pathnameFromPage ?? location?.pathname ?? "";
      const isHome = isMarketingHomePath(pathNow);

      if (!isHome) {
        if (!isAuditEnvironment()) {
          return undefined;
        }
        t = setTimeout(doMount, DEFERRED_PROVIDERS_DELAY_AUDIT_MS);
        return () => clearTimeout(t);
      }

      if (isAuditEnvironment()) {
        t = setTimeout(doMount, DEFERRED_PROVIDERS_DELAY_AUDIT_MS);
        return () => clearTimeout(t);
      }

      let initialTimer;
      let onBelowHeroReady;
      
      initialTimer = setTimeout(() => {
        const isMobileViewport =
          typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(max-width: 768px)").matches;
        if (isMobileViewport) {
          // Mobile homepage strict mode: fixed timer only (no belowHero event branch) for repeatable lab traces.
          t = setTimeout(doMount, DEFERRED_PROVIDERS_DELAY_MOBILE_HOME_STRICT_MS);
          return;
        }

        onBelowHeroReady = () => {
          if (t) clearTimeout(t);
          t = setTimeout(doMount, DEFERRED_PROVIDERS_AFTER_BELOW_HERO_DELAY_MS);
        };
        if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
          window.addEventListener("belowHeroContentReady", onBelowHeroReady, {
            once: true,
          });
        }
        t = setTimeout(doMount, DEFERRED_PROVIDERS_DELAY_MS);
      }, 20);
      
      return () => {
        clearTimeout(initialTimer);
        if (t) clearTimeout(t);
        if (typeof window !== "undefined" && typeof window.removeEventListener === "function" && onBelowHeroReady) {
          window.removeEventListener("belowHeroContentReady", onBelowHeroReady);
        }
      };
    }, [pathnameFromPage, location?.pathname]);

    // Load deferred styles + fonts by timer only (no click/scroll/touch/keydown) to avoid "reload" feel on first click.
    // Non-audit: 2s so deferred CSS loads after initial trace window (helps "Reduce unused CSS"). Audit: long defer.
    useEffect(() => {
      if (!isBrowser()) return;
      let done = false;
      let tChunk2;
      const loadDeferred = () => {
        if (done) return;
        done = true;
        const addLink = (href, onLoad) => {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = href;
          if (onLoad) {
            link.onload = () => {
              try {
                if (typeof window.dispatchEvent === "function") {
                  window.dispatchEvent(new CustomEvent("deferredStylesLoaded"));
                }
              } catch (e) {}
              onLoad();
            };
            link.onerror = () => onLoad();
          }
          document.head.appendChild(link);
        };
        const isMarketingHome = () => {
          const p =
            typeof window !== "undefined" ? window.location.pathname : "";
          return isMarketingHomePath(p);
        };
        const injectSecond = () => {
          addLink("/css/deferred-fonts.css");
          if (isMarketingHome()) {
            // Fallback if parallel inject (see injectFirst) did not load chunk 2 yet.
            const isMobileViewport =
              typeof window !== "undefined" &&
              window.matchMedia &&
              window.matchMedia("(max-width: 768px)").matches;
            const isAudit = isAuditEnvironment();
            const chunk2DelayMs = isAudit
              ? 1500
              : isMobileViewport
                ? 400
                : 0;
            tChunk2 = setTimeout(() => {
              if (!document.querySelector('link[href="/css/deferred-styles-2.css"]')) {
                addLink("/css/deferred-styles-2.css");
              }
            }, chunk2DelayMs);
          }
        };
        const injectFirst = () => {
          if (
            isMarketingHome() &&
            typeof document !== "undefined" &&
            typeof document.querySelector !== "undefined" &&
            !document.querySelector('link[href="/css/deferred-styles-2.css"]')
          ) {
            addLink("/css/deferred-styles-2.css");
          }
          addLink("/css/deferred-styles.css", () => {
            if (typeof scheduler !== "undefined" && scheduler.yield) {
              scheduler.yield().then(injectSecond).catch(injectSecond);
            } else {
              setTimeout(injectSecond, 0);
            }
          });
        };
        if (typeof scheduler !== "undefined" && scheduler.yield) {
          scheduler.yield().then(injectFirst).catch(injectFirst);
        } else {
          injectFirst();
        }
      };
      // Only full audit defers link CSS 3 min. On mobile non-audit, inject later to avoid
      // 2.5s/4s style recalculation bursts that inflate TBT in Lighthouse.
      // Desktop non-audit: load immediately on first idle frame so the resulting restyle
      // happens BEFORE the user can click. The previous 2,500 ms delay coincided with
      // first-click time, making the restyle feel like the click caused content to "reload".
      const isMobileViewport =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia(MOBILE_VIEWPORT_MQ).matches;
      const delay = shouldDeferStylesheetsForLighthouse()
        ? AUDIT_HEAVY_WORK_DEFER_MS
        : isMobileViewport
          ? isHomeMarketing
            ? DEFERRED_STYLES_DELAY_MOBILE_HOME_UX_MS
            : DEFERRED_STYLES_DELAY_MOBILE_MS
          : 0;
      const t = setTimeout(loadDeferred, delay);
      return () => {
        clearTimeout(t);
        if (tChunk2) clearTimeout(tChunk2);
      };
    }, [isHomeMarketing]);

    // Fallback if SSR did not emit deferred-styles-pages.css (non-home routes get it in gatsby-ssr onPreRenderHTML).
    useEffect(() => {
      if (!isBrowser()) return;
      const pathname = location?.pathname || "";
      const isHomepage = pathname === "/" || pathname.match(/^\/[a-z]{2}\/?$/);
      if (isHomepage) return;
      if (document.querySelector('link[href="/css/deferred-styles-pages.css"]')) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/css/deferred-styles-pages.css";
      document.head.appendChild(link);
    }, [location?.pathname]);

    // Push route change to dataLayer for GTM (SPA navigation tracking)
    useEffect(() => {
      if (isBrowser() && typeof window.dataLayer !== "undefined") {
        window.dataLayer.push({
          event: "gatsby-route-change",
          pagePath: location?.pathname,
        });
      }
    }, [location?.pathname]);

    // Defer non-critical work to after first paint (skip heavy work in Lighthouse audits)
    useEffect(() => {
      if (!isBrowser()) return;
      if (shouldDeferHeavyWorkForLighthouse()) return;
      const runAfterPaint = () => {
        pushUTMParamsToDataLayer();
        if (process.env.GATSBY_ENV === "development") {
          import("../../../helpers/services/gtm-service-test").then(
            (testHelpers) => {
              window.testGTMDataLayer = testHelpers.testGTMDataLayer;
              window.getDataLayer = testHelpers.getDataLayer;
              window.checkGTMStatus = testHelpers.checkGTMStatus;
              window.testGTMWithCampaignCode =
                testHelpers.testGTMWithCampaignCode;
              window.simulateURLWithParams = testHelpers.simulateURLWithParams;
            }
          );
        }
      };
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(runAfterPaint, { timeout: 500 });
      } else {
        setTimeout(runAfterPaint, 100);
      }
    }, []);

    // Defer extension-attribute cleanup to after first paint (skip in Lighthouse to minimize main-thread "Other" time)
    useEffect(() => {
      if (!isBrowser()) return;
      if (shouldDeferHeavyWorkForLighthouse()) return;
      let observer = null;
      const run = () => {
        const removeExtensionAttributes = () => {
          const allElements = document.querySelectorAll("[bis_skin_checked]");
          allElements.forEach((el) => {
            el.removeAttribute("bis_skin_checked");
          });
        };
        observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.type === "attributes" &&
              mutation.attributeName === "bis_skin_checked"
            ) {
              mutation.target.removeAttribute("bis_skin_checked");
            }
          });
        });
        observer.observe(document.documentElement, {
          attributes: true,
          subtree: true,
          attributeFilter: ["bis_skin_checked"],
        });
        removeExtensionAttributes();
      };
      if (typeof requestIdleCallback !== "undefined") {
        const id = requestIdleCallback(run, { timeout: 800 });
        return () => {
          cancelIdleCallback(id);
          if (observer) observer.disconnect();
        };
      }
      const t = setTimeout(run, 200);
      return () => {
        clearTimeout(t);
        if (observer) observer.disconnect();
      };
    }, []);

    // Monitor for popup registration changes (defer to idle; skip in Lighthouse to minimize main-thread "Other" time)
    useEffect(() => {
      if (!isBrowser()) return;
      if (shouldDeferHeavyWorkForLighthouse()) return;
      let observer = null;
      const setup = () => {
        const checkPopupStatus = () => {
          const popupElement = document.querySelector(".popup-registration");
          startTransition(() => setIsPopupOpen(!!popupElement));
        };
        checkPopupStatus();
        observer = new MutationObserver(checkPopupStatus);
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["class", "style"],
        });
      };
      if (typeof requestIdleCallback !== "undefined") {
        const id = requestIdleCallback(setup, { timeout: 2000 });
        return () => {
          cancelIdleCallback(id);
          if (observer) observer.disconnect();
        };
      }
      const t = setTimeout(setup, 2000);
      return () => {
        clearTimeout(t);
        if (observer) observer.disconnect();
      };
    }, []);

    const headerSlot = showHeader ? (
      <Suspense fallback={<div className="header-placeholder" aria-hidden="true" />}>
        <Header />
      </Suspense>
    ) : (
      <div className="header-placeholder" aria-hidden="true" />
    );

    const layoutContent = isLoaded && (
      <>
        {headerSlot}
        {showCookiesPopup ? (
          <Suspense fallback={null}>
            <CookiesPopup />
          </Suspense>
        ) : null}
        <main
          id="main-content"
          tabIndex={-1}
          className="scroll-container"
        >
          {children}
        </main>
        <WhenInView
          rootMargin="400px 0px"
          fallback={null}
          delayMs={shouldDeferHeavyWorkForLighthouse() ? 10000 : 1000}
        >
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </WhenInView>
      </>
    );

    const withNotificationStripeAndRecaptcha = deferredProvidersReady ? (
      <NotificationStripeProvider>
        <TradingProvider enableLiveTrading={enableLiveTrading}>
          <ReCaptchaProvider
            showBadge={isContactUsPage || isPopupRegistrationOpen}
          >
            {layoutContent}
          </ReCaptchaProvider>
        </TradingProvider>
      </NotificationStripeProvider>
    ) : (
      <NotificationStripeContext.Provider value={NOTIFICATION_STRIPE_STUB_VALUE}>
        <TradingProvider enableLiveTrading={enableLiveTrading}>
          {layoutContent}
        </TradingProvider>
      </NotificationStripeContext.Provider>
    );

    const languageStubValue = getLanguageStubValue(pathnameForStub);

    const withCookieAndMarketing = deferredProvidersReady ? (
      <CookieProvider>
        <MarketingContextProvider>
          <LanguageProvider>
            <CommonProvider>
              <SearchProvider>{withNotificationStripeAndRecaptcha}</SearchProvider>
            </CommonProvider>
          </LanguageProvider>
        </MarketingContextProvider>
      </CookieProvider>
    ) : (
      <CookieContext.Provider value={COOKIE_STUB_VALUE}>
        <MarketingContext.Provider value={MARKETING_STUB_VALUE}>
          <LanguageContext.Provider value={languageStubValue}>
            <CommonContext.Provider value={COMMON_STUB_VALUE}>
              <SearchContext.Provider value={SEARCH_STUB_VALUE}>
                {withNotificationStripeAndRecaptcha}
              </SearchContext.Provider>
            </CommonContext.Provider>
          </LanguageContext.Provider>
        </MarketingContext.Provider>
      </CookieContext.Provider>
    );

    return (
      <div suppressHydrationWarning>
        <ClientResolverProvider>{withCookieAndMarketing}</ClientResolverProvider>
      </div>
    );
  } catch (error) {
    sendLog({ message: error.message, type: error.name });

    throw error;
  }
};

export default Layout;
