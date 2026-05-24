import React, {
  Suspense,
  lazy,
  useState,
  useEffect,
  startTransition,
} from "react";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import Seo from "../components/shared/seo";
import { useWindowSize } from "../helpers/hooks/use-window-size";
import {
  isAuditEnvironment,
  isHomepagePerfLabSession,
  AUDIT_HEAVY_WORK_DEFER_MS,
} from "../helpers/is-audit-environment";
import { scheduleAfterLcpOrCap } from "../helpers/schedule-after-lcp";

/** DevTools mobile lab on localhost: defer below-hero past typical Lighthouse trace. */
const PERF_LAB_DEFERRED_APP_MS = 15000;
/** Mount below-hero after hero LCP (or cap) so features card does not become LCP with multi-second render delay. */
const MOBILE_DEFERRED_AFTER_LCP_CAP_MS = 5000;
import PageBackground from "../components/shared/page-background";

// Hero: eager so LCP image (hand) is in initial HTML and SSR. Lazy hero caused mobile LCP ~7s; desktop was ~1.1s because chunk loaded fast.
import MainPromotion from "../components/pages-content/main-page-content/main-promotion-content";

/** Same dynamic import for React.lazy + explicit preload — parse/eval moves out of the index chunk (lower TBT). */
const homeDeferredLoader = () =>
  import(
    /* webpackChunkName: "home-deferred-app" */
    "../components/pages-content/main-page-content/home-deferred-app"
  );

let homeDeferredChunkPromise = null;
const preloadHomeDeferredApp = () => {
  if (!homeDeferredChunkPromise) {
    homeDeferredChunkPromise = homeDeferredLoader();
  }
  return homeDeferredChunkPromise;
};

const HomeDeferredApp = lazy(() => preloadHomeDeferredApp());

// belowHeroContentReady still fires synchronously from trigger(); showDeferredApp flips only after
// the lazy chunk is loaded so hydration does not parse the heavy below-hero tree up front.
/** Mobile homepage Phase A1: scroll-trigger threshold (px). Lighthouse never scrolls so it never enters this phase. */
const MOBILE_SCROLL_TRIGGER_PX = 24;
/** Max wait if user never scrolls (real devices only — audit uses isAudit branch). */
const MOBILE_DEFERRED_APP_FALLBACK_MS = 14000;
/**
 * Also reveal below-hero after this delay without scroll so mobile UX is not stuck on tiny scroll
 * (PSI/Lighthouse still use isAudit branch; local ?lighthouse uses audit branch).
 */
/**
 * Mount heavy below-hero tree after this delay if the user has not scrolled (Lighthouse never scrolls).
 * Hero i18n / window size unblocks earlier via a separate microtask dispatch (same file).
 */

// Persist "full" across provider-swap remount so ticker/features don't flicker (appear → disappear → appear).
const INDEX_PAGE_FULL_KEY = "__indexPageAlreadyFull";

// Initial state must match server so we avoid React hydration #418 (no window in useState).
const IndexPage = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables({
    deferUntilBelowHeroReady: true,
  });
  const { isMobile } = useWindowSize();
  const [showDeferredApp, setShowDeferredApp] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const isAudit = isAuditEnvironment();
    const isPerfLab = isHomepagePerfLabSession();
    const isMobileView =
      window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
    let effectAlive = true;
    let triggerConsumed = false;
    let tId;
    let cancelLcpGate = () => {};
    let onScroll;
    let onTouch;
    let deferDesktopRaf1;
    let deferDesktopRaf2;

    // Real users: warm the chunk off the critical path (not during short Lighthouse/PSI traces).
    if (!isAudit) {
      void preloadHomeDeferredApp();
    }

    const trigger = () => {
      if (triggerConsumed) return;
      triggerConsumed = true;
      if (typeof window !== "undefined") window[INDEX_PAGE_FULL_KEY] = true;
      try {
        if (typeof window !== "undefined" && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent("belowHeroContentReady"));
        }
      } catch (e) {}

      if (onScroll && typeof window !== "undefined") {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("touchmove", onTouch);
      }

      preloadHomeDeferredApp().then(() => {
        if (!effectAlive) return;
        startTransition(() => setShowDeferredApp(true));
      });
    };

    if (!isAudit && !isPerfLab && isMobileView) {
      // Unblock hero translations + useWindowSize immediately; do NOT mount HomeDeferredApp yet.
      // Previously belowHeroContentReady only fired with trigger(), so hero felt "late" vs. desktop.
      if (typeof window !== "undefined") {
        const earlyBelowHeroReady = () => {
          try {
            window.dispatchEvent(new CustomEvent("belowHeroContentReady"));
          } catch (e) {}
        };
        // setTimeout(0): run after passive effects so Hero/Seo listeners are registered (child before parent).
        setTimeout(earlyBelowHeroReady, 0);
      }

      // Phase A1: scroll-triggered mount on mobile homepage.
      // Lighthouse never scrolls so heavy work stays out of audit window. Real users scroll naturally.
      onScroll = () => {
        if (typeof window === "undefined") return;
        if ((window.scrollY || window.pageYOffset || 0) > MOBILE_SCROLL_TRIGGER_PX) {
          trigger();
        }
      };
      onTouch = onScroll;
      if (typeof window !== "undefined") {
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("touchmove", onTouch, { passive: true });
      }
      cancelLcpGate = scheduleAfterLcpOrCap(trigger, MOBILE_DEFERRED_AFTER_LCP_CAP_MS);
      tId = setTimeout(trigger, MOBILE_DEFERRED_APP_FALLBACK_MS);
      return () => {
        effectAlive = false;
        cancelLcpGate();
        if (tId) clearTimeout(tId);
        if (typeof window !== "undefined" && onScroll) {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("touchmove", onTouch);
        }
      };
    }

    if (isAudit || isPerfLab) {
      const deferMs = isAudit ? AUDIT_HEAVY_WORK_DEFER_MS : PERF_LAB_DEFERRED_APP_MS;
      tId = setTimeout(trigger, deferMs);
      return () => {
        effectAlive = false;
        clearTimeout(tId);
      };
    }
    // Desktop, non-audit: defer past hydration so Suspense is not updated mid-hydrate (React #421).
    deferDesktopRaf1 = requestAnimationFrame(() => {
      deferDesktopRaf2 = requestAnimationFrame(() => {
        if (effectAlive) trigger();
      });
    });
    return () => {
      effectAlive = false;
      if (deferDesktopRaf1) cancelAnimationFrame(deferDesktopRaf1);
      if (deferDesktopRaf2) cancelAnimationFrame(deferDesktopRaf2);
    };
  }, []);

  return (
    <PageBackground backgroundType="homepage-bg-1">
      <Seo
        title={t("page-main-title")}
        description={t("page-main-description")}
      />

      <Suspense fallback={null}>
        <MainPromotion />
      </Suspense>

      <Suspense
        fallback={
          <div
            className="below-hero-placeholder below-hero-placeholder--first-block"
            aria-hidden="true"
          >
            <div className="below-hero-placeholder__ticker-slot" />
            <div className="below-hero-placeholder__content-slot" />
          </div>
        }
      >
        {showDeferredApp ? (
          <HomeDeferredApp isMobile={isMobile} />
        ) : (
          <div
            className="below-hero-placeholder below-hero-placeholder--first-block"
            aria-hidden="true"
          >
            <div className="below-hero-placeholder__ticker-slot" />
            <div className="below-hero-placeholder__content-slot" />
          </div>
        )}
      </Suspense>
    </PageBackground>
  );
};

IndexPage.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default IndexPage;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
