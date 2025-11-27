import React, { useRef, useState, useEffect } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import arrowUp from "../../../../assets/images/icons/trading-ticker/arrow-up.svg";
import arrowDown from "../../../../assets/images/icons/trading-ticker/arrow-down.svg";
import { getIcon } from "./icon-loader";
import symbolMapping from "./symbol-icon-mapping.json";

const TradingSymbols = ({ className, symbols, uniqueId = "default" }) => {
  const symbolsRef = useRef();
  const isRTL = useRtlDirection();
  const { isMobile } = useWindowSize();
  const { t } = useTranslationWithVariables();
  const margin = isMobile ? 10 : 0;
  const scrollStep = 1;
  const [isTouched, setIsTouched] = useState(false);
  const scrollMetricsRef = useRef({ scrollWidth: 0 });
  const scrollPositionRef = useRef(0);

  const getCardWidth = (card) => {
    if (!card) return 0;
    const cachedWidth = card.dataset.cardWidth;
    if (cachedWidth) {
      return Number(cachedWidth);
    }
    const measuredWidth =
      card.offsetWidth || card.getBoundingClientRect().width;
    card.dataset.cardWidth = String(measuredWidth);
    return measuredWidth;
  };

  useEffect(() => {
    const container = symbolsRef.current;
    if (!container) return;

    let frameId = requestAnimationFrame(() => {
      scrollMetricsRef.current.scrollWidth = container.scrollWidth;
      scrollPositionRef.current = container.scrollLeft || 0;
      container.querySelectorAll(".trading-symbol-card").forEach((card) => {
        if (!card.dataset.cardWidth) {
          card.dataset.cardWidth = String(card.offsetWidth);
        }
      });
    });

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [symbols, isMobile]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let resizeFrame = null;

    const measure = () => {
      const container = symbolsRef.current;
      if (!container) return;
      container.querySelectorAll(".trading-symbol-card").forEach((card) => {
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

  // Get icon(s) for a symbol
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
          className="trading-symbol-card__icon"
        />
      );
    }

    // Render combined icons
    return (
      <div className="trading-symbol-card__combined-icons">
        {icons.map((icon, index) => (
          <img
            key={index}
            src={icon}
            alt={`${symbol}_icon_${index}`}
            className="trading-symbol-card__icon"
          />
        ))}
      </div>
    );
  };

  // Infinite scroll logic (repeat symbols if needed)
  const prepareSymbols = (symbols) => {
    return symbols.length > 0 && symbols.length < 20
      ? prepareSymbols(symbols.concat(symbols))
      : symbols;
  };

  // check is scroll passed center of scroll width
  const isMiddleOfScroll = (width, offset) =>
    width > 0 ? Math.abs(offset) > width / 2 : false;
  // check is scroll passed center of scroll width in reversed direction, used for check when manual scroll is active
  const isMiddleOfScrollReversed = (width, offset) =>
    width > 0 ? Math.abs(offset) < width / 2 : false;

  const performScroll = () => {
    const cont = symbolsRef.current;
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
      const lastchild = cont.lastElementChild;
      if (lastchild) {
        const lastChildWidth = getCardWidth(lastchild);
        cont.prepend(lastchild);
        targetScrollLeft += lastChildWidth + margin;
      }
    }
    // perform auto scroll when not touched
    if (!isTouched) {
      targetScrollLeft += scrollStep;
    }
    scrollPositionRef.current = targetScrollLeft;
    cont.scrollLeft = targetScrollLeft;
  };

  const performScrollRTL = () => {
    const cont = symbolsRef.current;
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
      const lastchild = cont.lastElementChild;
      if (lastchild) {
        const lastChildWidth = getCardWidth(lastchild);
        cont.prepend(lastchild);
        targetScrollLeft -= lastChildWidth + margin;
      }
    }
    if (!isTouched) {
      targetScrollLeft -= scrollStep;
    }
    scrollPositionRef.current = targetScrollLeft;
    cont.scrollLeft = targetScrollLeft;
  };

  useEffect(() => {
    if (isTouched) return;

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
  }, [isTouched, isRTL]);

  return (
    <div
      className={cn("trading-symbols-wrapper", className, {
        "trading-symbols-wrapper--rtl": isRTL,
      })}
    >
      <div className="scroll-disabler"></div>
      <div
        id={`trading-symbols-${uniqueId}`}
        className="trading-symbols"
        ref={symbolsRef}
        onTouchStart={() => setIsTouched(true)}
        onTouchEnd={() => setIsTouched(false)}
        onScroll={() => {
          const container = symbolsRef.current;
          if (!container) return;
          scrollPositionRef.current = container.scrollLeft;
        }}
      >
        {prepareSymbols(symbols).map((symbol, key) => (
          <div
            className="trading-symbol-card"
            key={`TradingSymbol${symbol.symbol}-${key}`}
          >
            {/* Product Info Card */}
            <div className="trading-symbol-card__info">
              {/* Product Header */}
              <div className="trading-symbol-card__header">
                <div className="trading-symbol-card__name-container">
                  {/* Product Icon(s) */}
                  <div className="trading-symbol-card__icon-container">
                    {renderSymbolIcons(symbol.symbol)}
                  </div>
                  <span className="trading-symbol-card__name">
                    {symbol.symbol}
                  </span>
                </div>
                <img
                  src={symbol.direction === "up" ? arrowUp : arrowDown}
                  className="trading-symbol__arrow"
                  alt={symbol.direction}
                  style={{ width: 20, height: 20 }}
                />
              </div>
              {/* Product Details */}
              <div className="trading-symbol-card__details">
                <div className="trading-symbol-card__bid-container">
                  <span className="trading-symbol-card__label">
                    {t("trading-symbol-bid")}
                  </span>
                  <span className="trading-symbol-card__bid-value">
                    {symbol.bid}
                  </span>
                </div>
                <div className="trading-symbol-card__ask-container">
                  <span className="trading-symbol-card__label">
                    {t("trading-symbol-ask")}
                  </span>
                  <span
                    className={cn("trading-symbol-card__ask-value", {
                      "trading-symbol-card__ask-value--up":
                        symbol.direction === "up",
                      "trading-symbol-card__ask-value--down":
                        symbol.direction === "down",
                    })}
                  >
                    {symbol.ask}
                  </span>
                </div>
                <div className="trading-symbol-card__spread-container">
                  <span className="trading-symbol-card__label">
                    {t("trading-symbol-spread")}
                  </span>
                  <span className="trading-symbol-card__spread-value">
                    {symbol.spread}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

TradingSymbols.propTypes = {
  className: PropTypes.string,
  symbols: PropTypes.arrayOf(
    PropTypes.shape({
      symbol: PropTypes.string.isRequired,
      direction: PropTypes.oneOf(["up", "down"]).isRequired,
      bid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      ask: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      spread: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ),
  uniqueId: PropTypes.string,
};

export default TradingSymbols;
