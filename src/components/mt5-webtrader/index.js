import React, { useContext, useState, useRef, useEffect } from "react";
import {
  HEADER_BIG_HEIGHT,
  HEADER_SMALL_HEIGHT,
} from "../../helpers/constants";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
import LanguageContext from "../../context/language-context";
import { getWebTraderUrl } from "./webtrader-url";

const WebTraderLink = () => {
  const { isDesktop } = useWindowSize();
  const { selectedLanguage } = useContext(LanguageContext);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);

  // Simple mobile detection without external utilities
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    // Set CSS custom property for header height
    if (containerRef.current && containerRef.current.style) {
      const headerHeight = isDesktop ? HEADER_BIG_HEIGHT : HEADER_SMALL_HEIGHT;
      containerRef.current.style.setProperty("--header-height", headerHeight);
    }
  }, [isDesktop]);

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
      <div className="mt5-webtrader webtrader-error" ref={containerRef}>
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
    <div
      className="mt5-webtrader"
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
      <iframe
        src={getWebTraderUrl(selectedLanguage)}
        width="100%"
        height="100%"
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
  );
};

export default WebTraderLink;
