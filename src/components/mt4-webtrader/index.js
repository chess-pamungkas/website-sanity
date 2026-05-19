import React, { useEffect, useRef, useContext, useState } from "react";
import {
  HEADER_BIG_HEIGHT,
  HEADER_SMALL_HEIGHT,
} from "../../helpers/constants";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
import { MT_LANGUAGES_MAP } from "../../helpers/lang-options.config";
import LanguageContext from "../../context/language-context";

const Mt4WebTraderLink = () => {
  const { isDesktop } = useWindowSize();
  const { selectedLanguage } = useContext(LanguageContext);
  const isIFrameAdded = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);

  // Simple mobile detection without external utilities
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    if (isIFrameAdded.current) return;

    const initializeWebTrader = () => {
      try {
        // Simple script availability check
        if (typeof window.MetaTraderWebTerminal !== "function") {
          console.warn("MetaTraderWebTerminal not available, retrying...");
          setTimeout(initializeWebTrader, 250);
          return;
        }

        // Set CSS custom property for header height
        if (containerRef.current && containerRef.current.style) {
          const headerHeight = isDesktop
            ? HEADER_BIG_HEIGHT
            : HEADER_SMALL_HEIGHT;
          containerRef.current.style.setProperty(
            "--header-height",
            headerHeight
          );
        }

        // Initialize MT4 WebTrader
        window.MetaTraderWebTerminal("webterminal", {
          version: 4,
          servers: ["OqtimaGlobal-Demo", "OqtimaGlobal-Server"],
          server: "OqtimaGlobal-Server",
          startMode: "login",
          language: MT_LANGUAGES_MAP[selectedLanguage.id],
          colorScheme: "green_on_black",
        });

        // Reveal quickly once terminal node exists, but keep a tiny settle buffer
        // so users don't see temporary intermediate widget state.
        const startedAt = Date.now();
        const waitForTerminalReady = () => {
          const root = document.getElementById("webterminal");
          const hasChildren = !!(root && root.childElementCount > 0);
          const hasIframe = !!(root && root.querySelector("iframe"));
          if (hasChildren || hasIframe) {
            setTimeout(() => setIsLoading(false), 120);
            return;
          }
          if (Date.now() - startedAt > 3500) {
            // Fallback: never keep loader forever.
            setIsLoading(false);
            return;
          }
          setTimeout(waitForTerminalReady, 150);
        };
        setTimeout(waitForTerminalReady, 100);

        isIFrameAdded.current = true;
      } catch (error) {
        console.error("Error initializing MT4 WebTrader:", error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    initializeWebTrader();
  }, [isDesktop, selectedLanguage.id]);

  const retryInitialization = () => {
    setHasError(false);
    setIsLoading(true);
    isIFrameAdded.current = false;

    // Force re-initialization
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
