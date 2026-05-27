import React, { useEffect, useRef, useContext, useState } from "react";
import {
  HEADER_BIG_HEIGHT,
  HEADER_SMALL_HEIGHT,
} from "../../helpers/constants";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
import { useLoadingWatchdog } from "../../helpers/hooks/use-loading-watchdog";
import { MT_LANGUAGES_MAP } from "../../helpers/lang-options.config";
import LanguageContext from "../../context/language-context";
import {
  loadMetaTraderWidgetScript,
  preloadMetaTraderWidgetScript,
} from "../../helpers/services/load-metatrader-widget";

const MT4_WATCHDOG_MS = 28000;
const TERMINAL_READY_MAX_MS = 12000;

const Mt4WebTraderLink = () => {
  const { isDesktop } = useWindowSize();
  const { selectedLanguage } = useContext(LanguageContext);
  const isIFrameAdded = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);
  const readinessTimeoutRef = useRef(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

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
          containerRef.current.style.setProperty(
            "--header-height",
            headerHeight
          );
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
  }, [isDesktop, selectedLanguage.id]);

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
      style={{
        paddingTop: isDesktop
          ? HEADER_BIG_HEIGHT + 20
          : HEADER_SMALL_HEIGHT + 10,
        height: isMobile ? "calc(100vh - 75px)" : "calc(100vh - 223px)",
      }}
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
          width: "100%",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
      ></div>
    </div>
  );
};

export default Mt4WebTraderLink;
