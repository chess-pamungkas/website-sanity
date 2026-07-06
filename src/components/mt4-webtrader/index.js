import React, { useEffect, useRef, useContext, useState, useCallback } from "react";
import {
  HEADER_BIG_HEIGHT,
  HEADER_SMALL_HEIGHT,
} from "../../helpers/constants";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
import { useLoadingWatchdog } from "../../helpers/hooks/use-loading-watchdog";
import { MT_LANGUAGES_MAP } from "../../helpers/lang-options.config";
import LanguageContext from "../../context/language-context";
import CommonContext from "../../context/common-context";
import { useIsomorphicLayoutEffect } from "../../helpers/hooks/use-isomorphic-layout-effect";
import { isBrowser } from "../../helpers/services/is-browser";
import { MOBILE_VIEWPORT_MQ } from "../../helpers/viewport-media";
import {
  loadMetaTraderWidgetScript,
  preloadMetaTraderWidgetScript,
} from "../../helpers/services/load-metatrader-widget";

const MT4_WATCHDOG_MS = 28000;
const TERMINAL_READY_MAX_MS = 12000;
const MT4_CHROME_SAFE_INSET = 8;
const MT4_MOBILE_NAV_HEIGHT = 76;

const isMobileViewport = () =>
  isBrowser() &&
  typeof window.matchMedia === "function" &&
  window.matchMedia(MOBILE_VIEWPORT_MQ).matches;

const readCssPxVar = (name, fallbackPx) => {
  if (!isBrowser()) return fallbackPx;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallbackPx;
};

const Mt4WebTraderLink = () => {
  const { isDesktop } = useWindowSize();
  const { selectedLanguage } = useContext(LanguageContext);
  const { headerRef, complianceBannerRef } = useContext(CommonContext);
  const isIFrameAdded = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);
  const readinessTimeoutRef = useRef(null);
  const lastChromeTopRef = useRef(null);
  const retryTimeoutIdsRef = useRef([]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const getFallbackChromeTop = useCallback(() => {
    const bannerHeight = readCssPxVar("--compliance-banner-height", 150);
    return Math.ceil(bannerHeight + MT4_MOBILE_NAV_HEIGHT + MT4_CHROME_SAFE_INSET);
  }, []);

  const syncMt4MobileChromeTop = useCallback(() => {
    if (!isMobileViewport()) return;

    const headerEl = headerRef?.current;
    const measuredBottom = headerEl
      ? Math.ceil(headerEl.getBoundingClientRect().bottom) + MT4_CHROME_SAFE_INSET
      : 0;
    const chromeTop = Math.max(measuredBottom, getFallbackChromeTop());

    if (lastChromeTopRef.current === chromeTop) return;

    lastChromeTopRef.current = chromeTop;
    document.documentElement.style.setProperty(
      "--webtrader-mt4-chrome-top",
      `${chromeTop}px`
    );
  }, [headerRef, getFallbackChromeTop]);

  const scheduleMt4ChromeTopSync = useCallback(() => {
    if (!isMobileViewport()) return;

    syncMt4MobileChromeTop();
    requestAnimationFrame(syncMt4MobileChromeTop);

    retryTimeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    retryTimeoutIdsRef.current = [100, 300, 800, 1500].map((delayMs) =>
      window.setTimeout(syncMt4MobileChromeTop, delayMs)
    );
  }, [syncMt4MobileChromeTop]);

  const resetMt4HorizontalScroll = useCallback(() => {
    const scrollHost = containerRef.current;
    if (!scrollHost) return;
    scrollHost.scrollLeft = 0;
    scrollHost.scrollTop = 0;
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!isBrowser()) return undefined;

    document.body.classList.add("webtrader-page", "mt4-webtrader-page");

    return () => {
      document.body.classList.remove("webtrader-page", "mt4-webtrader-page");
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!isMobileViewport()) return undefined;

    scheduleMt4ChromeTopSync();

    const observed = [headerRef?.current, complianceBannerRef?.current].filter(
      Boolean
    );

    const onResize = () => scheduleMt4ChromeTopSync();

    if (!observed.length || typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        retryTimeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
      };
    }

    const observer = new ResizeObserver(onResize);
    observed.forEach((el) => observer.observe(el));
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      retryTimeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, [headerRef, complianceBannerRef, scheduleMt4ChromeTopSync]);

  useEffect(() => {
    if (!isMobileViewport()) return undefined;

    const onLoad = () => scheduleMt4ChromeTopSync();
    window.addEventListener("load", onLoad);

    if (document.fonts?.ready) {
      document.fonts.ready.then(scheduleMt4ChromeTopSync).catch(() => {});
    }

    return () => window.removeEventListener("load", onLoad);
  }, [scheduleMt4ChromeTopSync]);

  useLoadingWatchdog({
    isLoading,
    onTimeout: () => {
      setHasError(true);
      setIsLoading(false);
    },
    timeoutMs: MT4_WATCHDOG_MS,
    deps: [selectedLanguage?.id],
  });

  useEffect(() => {
    preloadMetaTraderWidgetScript();
  }, []);

  useEffect(() => {
    if (isIFrameAdded.current) return undefined;

    let cancelled = false;

    const waitForTerminalReady = () =>
      new Promise((resolve) => {
        const startedAt = Date.now();
        const tick = () => {
          if (cancelled) return;
          const root = document.getElementById("webterminal");
          const hasContent = !!(root && root.childElementCount > 0);
          const hasIframe = !!(root && root.querySelector("iframe"));
          if (hasContent || hasIframe) {
            readinessTimeoutRef.current = setTimeout(resolve, 120);
            return;
          }
          if (Date.now() - startedAt > TERMINAL_READY_MAX_MS) {
            resolve();
            return;
          }
          readinessTimeoutRef.current = setTimeout(tick, 150);
        };
        readinessTimeoutRef.current = setTimeout(tick, 100);
      });

    const initializeWebTrader = async () => {
      try {
        await loadMetaTraderWidgetScript();
        if (cancelled) return;

        if (containerRef.current?.style) {
          const headerHeight = isDesktop
            ? HEADER_BIG_HEIGHT
            : HEADER_SMALL_HEIGHT;
          containerRef.current.style.setProperty("--header-height", headerHeight);
        }

        window.MetaTraderWebTerminal("webterminal", {
          version: 4,
          servers: ["OqtimaGlobal-Demo", "OqtimaGlobal-Server"],
          server: "OqtimaGlobal-Server",
          startMode: "login",
          language: MT_LANGUAGES_MAP[selectedLanguage.id],
          colorScheme: "green_on_black",
        });

        await waitForTerminalReady();
        if (cancelled) return;

        isIFrameAdded.current = true;
        setIsLoading(false);
        scheduleMt4ChromeTopSync();
        resetMt4HorizontalScroll();
        window.setTimeout(resetMt4HorizontalScroll, 200);
      } catch (error) {
        console.error("Error initializing MT4 WebTrader:", error);
        if (!cancelled) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    initializeWebTrader();

    return () => {
      cancelled = true;
      if (readinessTimeoutRef.current) {
        clearTimeout(readinessTimeoutRef.current);
        readinessTimeoutRef.current = null;
      }
    };
  }, [
    isDesktop,
    selectedLanguage.id,
    scheduleMt4ChromeTopSync,
    resetMt4HorizontalScroll,
  ]);

  const retryInitialization = () => {
    setHasError(false);
    setIsLoading(true);
    isIFrameAdded.current = false;
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (hasError) {
    return (
      <div className="mt4-webtrader webtrader-error" ref={containerRef}>
        <div className="error-icon">⚠️</div>
        <div className="error-message">
          {isMobile
            ? "Unable to load MT4 WebTrader on this device. Please try using a desktop or tablet browser."
            : "Unable to load MT4 WebTrader. Please check your internet connection and try again."}
        </div>
        <button className="retry-button" onClick={retryInitialization}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className={`mt4-webtrader ${isLoading ? "mt4-webtrader--loading" : ""}`}
      ref={containerRef}
    >
      {isLoading && (
        <div className="webtrader-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div
        id="webterminal"
        style={{
          height: "100%",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
      ></div>
    </div>
  );
};

export default Mt4WebTraderLink;
