import React, { useEffect, useRef, useContext, useState } from "react";
import {
  HEADER_BIG_HEIGHT,
  HEADER_SMALL_HEIGHT,
} from "../../helpers/constants";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
import { MT_LANGUAGES_MAP } from "../../helpers/lang-options.config";
import LanguageContext from "../../context/language-context";
import {
  isMobileDevice,
  waitForMetaTraderScript,
  addMobileViewportListeners,
  removeMobileViewportListeners,
  getWebtraderHeight,
} from "../../helpers/mobile-utils";

const Mt4WebTraderLink = () => {
  const { isDesktop, isMobile } = useWindowSize();
  const { selectedLanguage } = useContext(LanguageContext);
  const isIFrameAdded = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [viewportHeight, setViewportHeight] = useState("100vh");
  const containerRef = useRef(null);

  // Handle viewport changes for mobile devices
  const handleViewportChange = () => {
    if (isMobileDevice()) {
      const headerHeight = isDesktop ? "100vh" : HEADER_SMALL_HEIGHT;
      const newHeight = getWebtraderHeight(headerHeight);
      setViewportHeight(newHeight);
    }
  };

  useEffect(() => {
    // Set initial viewport height
    handleViewportChange();

    // Add mobile viewport listeners
    addMobileViewportListeners(handleViewportChange);

    return () => {
      removeMobileViewportListeners(handleViewportChange);
    };
  }, [isDesktop]);

  useEffect(() => {
    if (isIFrameAdded.current) return;

    const initializeWebTrader = async () => {
      try {
        // Wait for MetaTrader script to be available
        const scriptAvailable = await waitForMetaTraderScript(15000);

        if (!scriptAvailable) {
          console.error(
            "MetaTraderWebTerminal script not available after timeout"
          );
          setHasError(true);
          setIsLoading(false);
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

        // Set loading to false after a delay to allow initialization
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);

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
          {isMobileDevice()
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
      className="mt4-webtrader"
      ref={containerRef}
      style={{
        paddingTop: isDesktop
          ? HEADER_BIG_HEIGHT + 0
          : HEADER_SMALL_HEIGHT + 10,
        height: viewportHeight,
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
