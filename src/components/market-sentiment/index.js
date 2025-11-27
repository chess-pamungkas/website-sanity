import React, { useState, useContext, useEffect, useRef } from "react";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
import { useRtlDirection } from "../../helpers/hooks/use-rtl-direction";
import { useTranslationWithVariables } from "../../helpers/hooks/use-translation-with-vars";
import { ShowRegistrationPopup } from "../../helpers/constants";
import { ChevronDownIcon, ChevronUpIcon } from "../shared/icons";
import LanguageContext from "../../context/language-context";
import desktopBgSVG from "../../assets/images/bg/main-page/real-time-market-desktop.svg";
import mobileBgSVG from "../../assets/images/bg/main-page/real-time-market-mobile.svg";
import badgeIcon from "../../assets/images/icons/main-page/market-sentiment/badge-market-sentiment.svg";
import arrowUp from "../../assets/images/icons/main-page/market-sentiment/arrow-up.svg";
import arrowDown from "../../assets/images/icons/main-page/market-sentiment/arrow-down.svg";
import { getIcon } from "../trading-ticker/components/trading-symbols/icon-loader";
import symbolMapping from "../trading-ticker/components/trading-symbols/symbol-icon-mapping.json";
import { getTradingSections } from "../../helpers/config";
import { filterSymbols } from "../../helpers/services/filter-symbols";
import { io } from "socket.io-client";
import { isBrowser } from "../../helpers/services/is-browser";

const MarketSentimentContent = () => {
  const { isMobile } = useWindowSize();
  const isRTL = useRtlDirection();
  const { t } = useTranslationWithVariables();
  const { selectedLanguage } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState("Forex");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dynamicTradingData, setDynamicTradingData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isTouched, setIsTouched] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const symbolsGridRef = useRef();
  const scrollMetricsRef = useRef({ scrollWidth: 0 });
  const scrollPositionRef = useRef(0);

  const getCardWidth = (card) => {
    if (!card) return 0;
    const cached = card.dataset.cardWidth;
    if (cached) {
      return Number(cached);
    }
    const width = card.offsetWidth || card.getBoundingClientRect().width;
    card.dataset.cardWidth = String(width);
    return width;
  };

  useEffect(() => {
    const container = symbolsGridRef.current;
    if (!container) return;

    let frameId = requestAnimationFrame(() => {
      scrollMetricsRef.current.scrollWidth = container.scrollWidth;
      scrollPositionRef.current = container.scrollLeft || 0;
      container
        .querySelectorAll(".market-sentiment__symbol-card")
        .forEach((card) => {
          if (!card.dataset.cardWidth) {
            card.dataset.cardWidth = String(card.offsetWidth);
          }
        });
    });

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [activeTab, dynamicTradingData, isMobile]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let resizeFrame = null;

    const measure = () => {
      const container = symbolsGridRef.current;
      if (!container) return;
      container
        .querySelectorAll(".market-sentiment__symbol-card")
        .forEach((card) => {
          delete card.dataset.cardWidth;
        });
      scrollMetricsRef.current.scrollWidth = container.scrollWidth;
      scrollPositionRef.current = container.scrollLeft || 0;
    };

    const handleResize = () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(measure);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
    };
  }, []);

  // Registration popup handlers
  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const API_URL = process.env.GATSBY_OQTIMA_API_URL;
  const tradingSections = getTradingSections();

  // Map market sentiment categories to trading sections
  const categoryToSectionMap = {
    Forex: "forex",
    Indices: "indices",
    Commodities: "metals", // Use metals for commodities like Gold, Silver
    Crypto: "crypto",
  };

  // Function to generate sentiment data based on trading data
  const generateSentimentData = (symbol, price) => {
    // Generate pseudo-random but consistent sentiment data based on symbol
    const hash = symbol.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const percentage = Math.abs(hash % 60) + 30; // 30-90%
    const isLong = percentage > 60;
    const sentiment = isLong
      ? t("market-sentiment_long")
      : t("market-sentiment_short");
    const color = isLong ? "#00D084" : "#FF4444";

    return {
      percentage: `${percentage}%`,
      sentiment,
      status: "Contrarian",
      recommendation: t("market-sentiment_consider-long"),
      color,
    };
  };

  // Function to get user-friendly display name
  const getDisplayName = (symbol) => {
    // Common symbol transformations for better UX
    const displayNameMap = {
      EURUSD: "EUR/USD",
      GBPUSD: "GBP/USD",
      USDJPY: "USD/JPY",
      AUDUSD: "AUD/USD",
      USDCAD: "USD/CAD",
      USDCHF: "USD/CHF",
      NZDUSD: "NZD/USD",
      XAUUSD: "GOLD",
      XAGUSD: "SILVER",
      XAU: "GOLD",
      XAG: "SILVER",
      XTI: "OIL",
      XBR: "BRENT",
      BTCUSD: "BTC/USD",
      ETHUSD: "ETH/USD",
      ADAUSD: "ADA/USD",
      LTCUSD: "LTC/USD",
      US500: "S&P 500",
      NAS100: "NASDAQ",
      US30: "DOW JONES",
      UK100: "FTSE 100",
      GER40: "DAX",
      FRA40: "CAC 40",
    };

    return displayNameMap[symbol] || symbol;
  };

  // Function to transform trading symbols to market sentiment format
  const transformToMarketSentiment = (symbols, maxItems = 4) => {
    return symbols.slice(0, maxItems).map((symbol) => {
      const sentimentData = generateSentimentData(symbol.symbol, symbol.ask);
      return {
        symbol: symbol.symbol,
        displayName: getDisplayName(symbol.symbol),
        direction: symbol.direction, // Include direction from trading data
        ...sentimentData,
      };
    });
  };

  // Fetch data for all categories
  useEffect(() => {
    if (!API_URL || !isBrowser()) {
      setIsLoading(false);
      return;
    }

    const socket = io(`${API_URL}ws-stocks/`, {
      transports: ["polling", "websocket"], // Fallback to polling if websocket fails
      timeout: 10000, // 10 second timeout
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });

    const fetchDataForCategory = (category, sectionId) => {
      socket.emit("stocks", sectionId);
    };

    // Set up timeout to stop loading after 10 seconds if no data received
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    // Set up event listener for replies
    socket.on("reply", (data) => {
      if (data && data.length > 0) {
        // Determine which category this data belongs to by checking symbol patterns
        const firstSymbol = data[0].symbol;
        let category = "Forex"; // default

        // Simple logic to categorize based on symbol patterns
        if (
          firstSymbol.includes("BTC") ||
          firstSymbol.includes("ETH") ||
          firstSymbol.includes("ADA") ||
          firstSymbol.includes("LTC")
        ) {
          category = "Crypto";
        } else if (
          firstSymbol.includes("US") ||
          firstSymbol.includes("NAS") ||
          firstSymbol.includes("GER") ||
          firstSymbol.includes("UK")
        ) {
          category = "Indices";
        } else if (
          firstSymbol.includes("XAU") ||
          firstSymbol.includes("XAG") ||
          firstSymbol.includes("XTI") ||
          firstSymbol.includes("XBR")
        ) {
          category = "Commodities";
        }

        const sectionId = categoryToSectionMap[category];
        const filteredSymbols = filterSymbols(data, sectionId);
        const marketSentimentData = transformToMarketSentiment(filteredSymbols);

        setDynamicTradingData((prev) => ({
          ...prev,
          [category]: marketSentimentData,
        }));

        // Set loading to false once we have data for any category
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      }
    });

    // Handle connection errors silently (don't spam console)
    socket.on("connect_error", (error) => {
      // Only log in development, suppress in production
      if (process.env.NODE_ENV === "development") {
        console.debug("Socket.IO connection error:", error.message);
      }
      clearTimeout(loadingTimeout);
      setIsLoading(false);
    });

    socket.on("disconnect", (reason) => {
      // Only log unexpected disconnects
      if (
        reason !== "io client disconnect" &&
        process.env.NODE_ENV === "development"
      ) {
        console.debug("Socket.IO disconnected:", reason);
      }
    });

    // Fetch data for each category
    Object.entries(categoryToSectionMap).forEach(([category, sectionId]) => {
      fetchDataForCategory(category, sectionId);
    });

    // Set up interval to refresh data
    const intervalId = setInterval(() => {
      Object.entries(categoryToSectionMap).forEach(([category, sectionId]) => {
        fetchDataForCategory(category, sectionId);
      });
    }, 5000); // Refresh every 5 seconds

    return () => {
      clearInterval(intervalId);
      clearTimeout(loadingTimeout);
      socket.off("reply");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [API_URL]);

  // Get icon(s) for a symbol - similar to trading ticker
  const getSymbolIcons = (symbol) => {
    const symbolUpper = symbol.toUpperCase();

    // Check if it's a combined icon symbol
    if (symbolMapping.combined_icons[symbolUpper]) {
      const icons = symbolMapping.combined_icons[symbolUpper]
        .map((iconName) => getIcon(iconName))
        .filter(Boolean);

      // If we have at least one icon, return it (fallback to partial icons)
      if (icons.length > 0) {
        return icons;
      }
    }

    // Check if it's a single icon symbol
    if (symbolMapping.single_icons[symbolUpper]) {
      const icon = getIcon(symbolMapping.single_icons[symbolUpper]);
      return icon ? [icon] : [];
    }

    // Fallback: try to get icon directly by symbol name
    const directIcon = getIcon(symbolUpper);
    return directIcon ? [directIcon] : [];
  };

  // Render icon(s) for a symbol
  const renderSymbolIcons = (symbol) => {
    const icons = getSymbolIcons(symbol);

    if (icons.length === 0) {
      return null;
    }

    if (icons.length === 1) {
      return (
        <img
          src={icons[0]}
          alt={symbol}
          className="market-sentiment__symbol-flag"
        />
      );
    }

    // Render combined icons
    return (
      <div className="market-sentiment__symbol-flags-combined">
        {icons.map((icon, index) => (
          <img
            key={index}
            src={icon}
            alt={`${symbol}_icon_${index}`}
            className="market-sentiment__symbol-flag"
          />
        ))}
      </div>
    );
  };

  // Tab configuration
  const tabs = [
    { id: "Forex", label: t("market-sentiment_tab-forex") },
    { id: "Indices", label: t("market-sentiment_tab-indices") },
    { id: "Commodities", label: t("market-sentiment_tab-commodities") },
    { id: "Crypto", label: t("market-sentiment_tab-crypto") },
  ];

  // Use dynamic trading data or fallback to empty arrays
  const getCurrentTradingData = () => {
    return dynamicTradingData[activeTab] || [];
  };

  // Infinite scroll logic (repeat symbols if needed) - same as TradingTicker
  const prepareSymbols = (symbols) => {
    if (!symbols || symbols.length === 0) return [];

    // Duplicate symbols recursively if we have fewer than 12 items for smooth infinite scrolling
    return symbols.length > 0 && symbols.length < 12
      ? prepareSymbols(symbols.concat(symbols))
      : symbols;
  };

  // Scroll logic similar to TradingTicker
  const margin = isMobile ? 10 : 15; // Gap between cards

  // check is scroll passed center of scroll width
  const isMiddleOfScroll = (width, offset) =>
    width > 0 ? Math.abs(offset) > width / 2 : false;

  // check is scroll passed center of scroll width in reversed direction
  const isMiddleOfScrollReversed = (width, offset) =>
    width > 0 ? Math.abs(offset) < width / 2 : false;

  const performScroll = () => {
    const cont = symbolsGridRef.current;
    if (!cont) return;
    const { scrollWidth } = scrollMetricsRef.current;
    if (!scrollWidth) return;
    let targetScrollLeft = scrollPositionRef.current;

    if (isMiddleOfScroll(scrollWidth, targetScrollLeft)) {
      // move first child to the end when center of scroll width passed
      const first = cont.firstElementChild;
      if (first) {
        const firstWidth = getCardWidth(first);
        cont.appendChild(first);
        targetScrollLeft -= firstWidth + margin;
      }
    }

    if (isMiddleOfScrollReversed(scrollWidth, targetScrollLeft) && isTouched) {
      // move last child to the start when center of scroll width passed in reversed direction while manual scroll is active
      const lastChild = cont.lastElementChild;
      if (lastChild) {
        const lastChildWidth = getCardWidth(lastChild);
        cont.prepend(lastChild);
        targetScrollLeft += lastChildWidth + margin;
      }
    }

    // perform auto scroll when not touched - always scroll if not at end
    if (!isTouched) {
      targetScrollLeft += 1;
    }
    scrollPositionRef.current = targetScrollLeft;
    cont.scrollLeft = targetScrollLeft;
  };

  const performScrollRTL = () => {
    const cont = symbolsGridRef.current;
    if (!cont) return;
    const { scrollWidth } = scrollMetricsRef.current;
    if (!scrollWidth) return;
    let targetScrollLeft = scrollPositionRef.current;

    if (isMiddleOfScroll(scrollWidth, targetScrollLeft)) {
      const first = cont.firstElementChild;
      if (first) {
        const firstWidth = getCardWidth(first);
        cont.appendChild(first);
        targetScrollLeft += firstWidth + margin;
      }
    }

    if (isMiddleOfScrollReversed(scrollWidth, targetScrollLeft) && isTouched) {
      const lastChild = cont.lastElementChild;
      if (lastChild) {
        const lastChildWidth = getCardWidth(lastChild);
        cont.prepend(lastChild);
        targetScrollLeft -= lastChildWidth + margin;
      }
    }

    if (!isTouched) {
      targetScrollLeft -= 1;
    }
    scrollPositionRef.current = targetScrollLeft;
    cont.scrollLeft = targetScrollLeft;
  };

  // Auto scroll effect - continuous infinite scrolling
  useEffect(() => {
    if (isLoading || isTouched) return;
    if (getCurrentTradingData().length === 0) return;

    let animationFrameId;

    const tick = () => {
      if (isRTL) {
        performScrollRTL();
      } else {
        performScroll();
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isTouched, isRTL, activeTab, isLoading, dynamicTradingData]);

  const backgroundSrc = isMobile ? mobileBgSVG : desktopBgSVG;

  return (
    <div className="market-sentiment">
      {/* Background */}
      <div className="market-sentiment__background">
        <img
          src={backgroundSrc}
          alt={t("market-sentiment_background-alt")}
          className="market-sentiment__background-image"
        />
      </div>

      <div className="market-sentiment__container">
        {/* Header */}
        <div className="market-sentiment__header">
          <div className="badge-row">
            <img src={badgeIcon} alt={t("market-sentiment_badge-icon-alt")} />
            <span className="badge-label">
              {t("market-sentiment_badge-text")}
            </span>
          </div>

          <h2 className="market-sentiment__title">
            {t("market-sentiment_title")}
          </h2>

          <p className="market-sentiment__description">
            {t("market-sentiment_description")}
          </p>
        </div>

        {/* Desktop Tabs */}
        <div className="market-sentiment__tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`market-sentiment__tab ${
                activeTab === tab.id ? "market-sentiment__tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Dropdown */}
        <div
          className="market-sentiment__dropdown"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="market-sentiment__dropdown-label">
            {tabs.find((tab) => tab.id === activeTab)?.label}
          </span>
          <div
            className={`market-sentiment__dropdown-icon ${
              isDropdownOpen ? "market-sentiment__dropdown-icon--active" : ""
            }`}
          >
            <ChevronDownIcon
              className={`market-sentiment__chevron-icon ${
                isDropdownOpen ? "rotated" : ""
              }`}
              color="#ffffff"
            />
          </div>

          {/* Dropdown Options */}
          <div
            className={`market-sentiment__dropdown-options ${
              isDropdownOpen ? "market-sentiment__dropdown-options--open" : ""
            }`}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`market-sentiment__dropdown-option ${
                  activeTab === tab.id
                    ? "market-sentiment__dropdown-option--active"
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab(tab.id);
                  setIsDropdownOpen(false);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trading Symbols Grid */}
        <div
          className="market-sentiment__symbols-grid"
          ref={symbolsGridRef}
          onTouchStart={() => setIsTouched(true)}
          onTouchEnd={() => setIsTouched(false)}
          onScroll={() => {
            const container = symbolsGridRef.current;
            if (!container) return;
            scrollPositionRef.current = container.scrollLeft;
          }}
        >
          {isLoading
            ? // Loading state
              Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="market-sentiment__symbol-card market-sentiment__symbol-card--loading"
                >
                  <div className="market-sentiment__symbol-header">
                    <div className="market-sentiment__symbol-flags">
                      <div className="market-sentiment__symbol-flag market-sentiment__loading-placeholder"></div>
                    </div>
                    <div className="market-sentiment__symbol-name market-sentiment__loading-placeholder"></div>
                  </div>
                  <div className="market-sentiment__symbol-content">
                    <div className="market-sentiment__symbol-percentage market-sentiment__loading-placeholder"></div>
                    <div className="market-sentiment__symbol-direction">
                      <span className="market-sentiment__loading-placeholder"></span>
                    </div>
                  </div>
                  <div className="market-sentiment__symbol-status market-sentiment__loading-placeholder"></div>
                  <div className="market-sentiment__symbol-recommendation market-sentiment__loading-placeholder"></div>
                </div>
              ))
            : prepareSymbols(getCurrentTradingData()).map((item, index) => (
                <div
                  key={`market-sentiment-${item.symbol}-${index}`}
                  className="market-sentiment__symbol-card"
                >
                  {/* Symbol Header */}
                  <div className="market-sentiment__symbol-header">
                    <div className="market-sentiment__symbol-flags">
                      {renderSymbolIcons(item.symbol)}
                    </div>
                    <div className="market-sentiment__symbol-name">
                      {item.displayName || item.symbol}
                    </div>
                  </div>

                  {/* Symbol Content */}
                  <div className="market-sentiment__symbol-content">
                    <div className="market-sentiment__symbol-percentage">
                      {item.percentage}
                    </div>
                    <div
                      className={`market-sentiment__symbol-direction ${
                        item.sentiment === t("market-sentiment_short")
                          ? "market-sentiment__symbol-direction--short"
                          : "market-sentiment__symbol-direction--long"
                      }`}
                    >
                      <span className="market-sentiment__symbol-direction-text">
                        {item.sentiment}
                      </span>
                      <div
                        className={`market-sentiment__symbol-direction-icon ${
                          item.sentiment === t("market-sentiment_long")
                            ? "market-sentiment__symbol-direction-icon--up"
                            : "market-sentiment__symbol-direction-icon--down"
                        }`}
                      >
                        <img
                          src={
                            item.sentiment === t("market-sentiment_long")
                              ? arrowUp
                              : arrowDown
                          }
                          alt={
                            item.sentiment === t("market-sentiment_long")
                              ? t("market-sentiment_arrow-up-alt")
                              : t("market-sentiment_arrow-down-alt")
                          }
                          className="market-sentiment__arrow-icon"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Symbol Bottom */}
                  <div className="market-sentiment__symbol-bottom">
                    <div className="market-sentiment__symbol-sentiment">
                      <span className="market-sentiment__symbol-sentiment-text">
                        {item.status}
                      </span>
                    </div>
                    <div className="market-sentiment__symbol-recommendation">
                      {item.recommendation}
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Action Buttons */}
        <div className="market-sentiment__actions">
          <button
            className="market-sentiment__btn market-sentiment__btn--primary"
            onClick={handleShowRegistrationPopup}
          >
            <span className="button-text">
              {t("market-sentiment_cta_primary")}
            </span>
            <span className="button-arrow">
              <svg
                width="9.33"
                height="9.33"
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={isRTL ? "arrow-rtl" : ""}
              >
                <path
                  d={
                    isRTL
                      ? "M10.3333 5.50004H1M1 5.50004L5.66667 0.833374M1 5.50004L5.66667 10.1667"
                      : "M1 5.50004H10.3333M10.3333 5.50004L5.66667 0.833374M10.3333 5.50004L5.66667 10.1667"
                  }
                  stroke="currentColor"
                  strokeWidth="1.3333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          <button
            className="market-sentiment__btn market-sentiment__btn--secondary"
            onClick={handleShowRegistrationPopup}
          >
            <span className="button-text">
              {t("market-sentiment_cta_secondary")}
            </span>
            <span className="button-arrow">
              <svg
                width="9.33"
                height="9.33"
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={isRTL ? "arrow-rtl" : ""}
              >
                <path
                  d={
                    isRTL
                      ? "M10.3333 5.50004H1M1 5.50004L5.66667 0.833374M1 5.50004L5.66667 10.1667"
                      : "M1 5.50004H10.3333M10.3333 5.50004L5.66667 0.833374M10.3333 5.50004L5.66667 10.1667"
                  }
                  stroke="currentColor"
                  strokeWidth="1.3333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Registration Popup */}
      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={selectedLanguage.id}
        />
      )}
    </div>
  );
};

export default MarketSentimentContent;
