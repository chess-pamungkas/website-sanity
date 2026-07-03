import React, { useContext, useState, useRef, useEffect } from "react";
import {
  HEADER_BIG_HEIGHT,
  HEADER_SMALL_HEIGHT,
} from "../../helpers/constants";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
import { useLoadingWatchdog } from "../../helpers/hooks/use-loading-watchdog";
import LanguageContext from "../../context/language-context";
import { getWebTraderUrl } from "./webtrader-url";

const WebTraderLink = () => {
  const { isDesktop } = useWindowSize();
  const { selectedLanguage } = useContext(LanguageContext);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [interfaceType, setInterfaceType] = useState("login"); // Default to login
  const containerRef = useRef(null);

  // Simple mobile detection without external utilities
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useLoadingWatchdog({
    isLoading,
    onTimeout: () => {
      setHasError(true);
      setIsLoading(false);
    },
    timeoutMs: 12000,
    deps: [selectedLanguage?.id],
  });

  useEffect(() => {
    // Set CSS custom property for header height
    if (containerRef.current && containerRef.current.style) {
      const headerHeight = isDesktop ? HEADER_BIG_HEIGHT : HEADER_SMALL_HEIGHT;
      containerRef.current.style.setProperty("--header-height", headerHeight);
    }
  }, [isDesktop]);

  // Detect interface type based on iframe content
  useEffect(() => {
    const iframe = containerRef.current?.querySelector("iframe");
    if (iframe) {
      const checkInterfaceType = () => {
        try {
          // Try to access iframe content to detect interface type
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            // Look for trading interface elements
            const hasTradingElements = iframeDoc.querySelector(
              ".terminal, .chart, .market-watch, .trading-panel, .terminal-container"
            );
            if (hasTradingElements) {
              setInterfaceType("trading");
            } else {
              setInterfaceType("login");
            }
          }
        } catch (error) {
          // Cross-origin restrictions, use URL-based detection
          const iframeSrc = iframe.src;
          if (
            iframeSrc &&
            (iframeSrc.includes("terminal") || iframeSrc.includes("trading"))
          ) {
            setInterfaceType("trading");
          } else {
            setInterfaceType("login");
          }
        }
      };

      // Check immediately and after load
      checkInterfaceType();
      iframe.addEventListener("load", checkInterfaceType);

      // Fallback: assume trading interface after 5 seconds
      const fallbackTimer = setTimeout(() => {
        if (interfaceType === "login") {
          setInterfaceType("trading");
        }
      }, 5000);

      return () => {
        iframe.removeEventListener("load", checkInterfaceType);
        clearTimeout(fallbackTimer);
      };
    }
  }, [isLoading, interfaceType]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const retryInitialization = () => {
    setHasError(false);
    setIsLoading(true);
    // Force iframe reload
    const iframe = containerRef.current?.querySelector("iframe");
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  if (hasError) {
    return (
      <div
        className="mt5-webtrader webtrader-error"
        ref={containerRef}
      >
        <div className="error-icon">⚠️</div>
        <div className="error-message">
          {isMobile
            ? "Unable to load MT5 WebTrader on this device. Please try using a desktop or tablet browser."
            : "Unable to load MT5 WebTrader. Please check your internet connection and try again."}
        </div>
        <button className="retry-button" onClick={retryInitialization}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div
        className="mt5-webtrader"
        ref={containerRef}
        data-interface={interfaceType}
      >
        <div className="mt5-webtrader__frame">
          {isLoading && (
            <div className="webtrader-loading">
              <div className="loading-spinner"></div>
            </div>
          )}
          <iframe
            src={getWebTraderUrl(selectedLanguage)}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{
              border: "none",
              opacity: isLoading ? 0 : 1,
              transition: "opacity 0.3s ease-in-out",
            }}
            title="MT5 WebTrader"
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      </div>
    </div>
  );
};

export default WebTraderLink;
