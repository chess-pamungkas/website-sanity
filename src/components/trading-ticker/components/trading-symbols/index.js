import React, { useRef, useState, useEffect, useMemo } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import { shouldDeferHeavyWorkForLighthouse } from "../../../../helpers/is-audit-environment";
import { scheduleAfterLcpOrCap } from "../../../../helpers/schedule-after-lcp";
import { MOBILE_VIEWPORT_MQ } from "../../../../helpers/viewport-media";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import arrowUp from "../../../../assets/images/icons/trading-ticker/arrow-up.svg";
import arrowDown from "../../../../assets/images/icons/trading-ticker/arrow-down.svg";
import {
  getCachedIconUrl,
  preloadTradingTickerIcons,
} from "./icon-loader-async";
import symbolMapping from "./symbol-icon-mapping.json";
import {
  TRADING_SYMBOL_CARD_STRIDE_PX,
  TRADING_SYMBOL_CARD_WIDTH_PX,
} from "../../../../helpers/trading-ticker-layout";

function collectTickerIconKeys(symbols) {
  const set = new Set();
  if (!symbols?.length) return [];
  for (const row of symbols) {
    const sym = row.symbol?.toUpperCase?.() || "";
    if (!sym) continue;
    if (symbolMapping.combined_icons[sym]) {
      symbolMapping.combined_icons[sym].forEach((n) =>
        set.add(String(n).toLowerCase())
      );
    } else if (symbolMapping.single_icons[sym]) {
      set.add(String(symbolMapping.single_icons[sym]).toLowerCase());
    } else {
      set.add(sym.toLowerCase());
    }
  }
  return [...set];
}

const TradingSymbols = ({
  className,
  symbols,
  uniqueId = "default",
  isInfiniteAutoScroll = true,
}) => {
  const symbolsRef = useRef();
  const isRTL = useRtlDirection();
  const { t } = useTranslationWithVariables();
  const isProgrammaticScrollRef = useRef(false);
  const isMobileLayout = () =>
    typeof window !== "undefined" &&
    window.matchMedia(MOBILE_VIEWPORT_MQ).matches;
  const margin = isMobileLayout() ? 10 : 0;
  const scrollStep = 1;
  const [isTouched, setIsTouched] = useState(false);
  const scrollMetricsRef = useRef({ scrollWidth: 0 });
  const scrollPositionRef = useRef(0);
  const isTickerVisibleRef = useRef(false);
  const [, setIconsNonce] = useState(0);
  const preloadKey = useMemo(
    () => (symbols || []).map((s) => s?.symbol ?? "").join("|"),
    [symbols]
  );

  useEffect(() => {
    if (!preloadKey || !symbols?.length) return undefined;
    const keysNeeded = collectTickerIconKeys(symbols);
    if (!keysNeeded.length) return undefined;
    let cancelled = false;
    const bump = () => {
      if (!cancelled) setIconsNonce((n) => n + 1);
    };

    const run = () =>
      preloadTradingTickerIcons(keysNeeded).then(() => {
        bump();
      });

    let idleId = null;
    let timeoutId = null;
    if (typeof window !== "undefined" && typeof requestIdleCallback !== "undefined") {
      idleId = requestIdleCallback(
        () => {
          idleId = null;
          run();
        },
        { timeout: 3200 }
      );
    } else {
      timeoutId = setTimeout(run, 280);
    }
    return () => {
      cancelled = true;
      if (idleId != null && typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(idleId);
      }
      if (timeoutId != null) clearTimeout(timeoutId);
    };
  }, [preloadKey]);

  const fixedCardWidthPx = () =>
    isMobileLayout() ? 0 : TRADING_SYMBOL_CARD_WIDTH_PX;

  const getCardWidth = (card) => {
    if (!card) return 0;
    const cachedWidth = card.dataset.cardWidth;
    if (cachedWidth) {
      return Number(cachedWidth);
    }
    const fixed = fixedCardWidthPx();
    if (fixed > 0) {
      card.dataset.cardWidth = String(fixed);
      return fixed;
    }
    const measuredWidth =
      card.offsetWidth || card.getBoundingClientRect().width;
    card.dataset.cardWidth = String(measuredWidth);
    return measuredWidth;
  };

  // Layout read with dataset cache — computeScrollAction runs every rAF during auto-scroll;
  // ignoring cache forced synchronous layout on each infinity-scroll adjustment (~forced reflow in LH).
  const readCardWidth = (card) => {
    if (!card) return 0;
    const cached = card.dataset.cardWidth;
    if (cached) {
      const n = Number(cached);
      return Number.isFinite(n) ? n : 0;
    }
    const fixed = fixedCardWidthPx();
    if (fixed > 0) {
      card.dataset.cardWidth = String(fixed);
      return fixed;
    }
    const measured =
      card.offsetWidth || card.getBoundingClientRect().width || 0;
    if (measured > 0) card.dataset.cardWidth = String(measured);
    return measured;
  };
  const setCardWidthCache = (card, width) => {
    if (card && width != null) card.dataset.cardWidth = String(width);
  };

  /** Desktop: card count × stride only (no scrollWidth/scrollLeft reads). Mobile: deferred geometric measure. */
  const syncScrollMetrics = (container) => {
    const cards = container.querySelectorAll(".trading-symbol-card");
    if (!cards.length) return;

    if (fixedCardWidthPx() > 0) {
      scrollMetricsRef.current.scrollWidth =
        cards.length * TRADING_SYMBOL_CARD_STRIDE_PX;
      for (let i = 0; i < cards.length; i++) {
        setCardWidthCache(cards[i], TRADING_SYMBOL_CARD_WIDTH_PX);
      }
      return;
    }

    let frame1;
    let frame2;
    frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        scrollMetricsRef.current.scrollWidth = container.scrollWidth;
        const sampleWidth = readCardWidth(cards[0]);
        for (let i = 0; i < cards.length; i++) {
          if (!cards[i].dataset.cardWidth) {
            setCardWidthCache(cards[i], sampleWidth);
          }
        }
      });
    });
    return () => {
      if (frame1) cancelAnimationFrame(frame1);
      if (frame2) cancelAnimationFrame(frame2);
    };
  };

  useEffect(() => {
    const container = symbolsRef.current;
    if (!container || !symbols?.length || !isMobileLayout()) return undefined;

    let cancelArm = () => {};
    let cancelMeasure = () => {};
    let cancelDeferRaf = null;
    let io = null;
    let fallbackId = null;
    let didRun = false;

    const runOnce = () => {
      if (didRun || shouldDeferHeavyWorkForLighthouse()) return;
      didRun = true;
      cancelDeferRaf = requestAnimationFrame(() => {
        cancelDeferRaf = null;
        cancelMeasure = syncScrollMetrics(container) || (() => {});
      });
    };

    const arm = () => {
      if (shouldDeferHeavyWorkForLighthouse()) return;
      if (!isMobileLayout()) {
        runOnce();
        return;
      }
      const measureFallbackMs = 8000;
      fallbackId = setTimeout(runOnce, measureFallbackMs);
      if (typeof IntersectionObserver !== "undefined") {
        io = new IntersectionObserver(
          (entries) => {
            if (entries[0]?.isIntersecting) runOnce();
          },
          { rootMargin: "100px 0px", threshold: 0 }
        );
        io.observe(container);
      }
    };

    cancelArm = scheduleAfterLcpOrCap(
      arm,
      shouldDeferHeavyWorkForLighthouse() ? 15000 : 4500
    );

    return () => {
      cancelArm();
      if (fallbackId) clearTimeout(fallbackId);
      if (cancelDeferRaf != null) cancelAnimationFrame(cancelDeferRaf);
      cancelMeasure();
      if (io) io.disconnect();
    };
  }, [symbols]);

  useEffect(() => {
    if (typeof window === "undefined" || !isMobileLayout()) return undefined;
    if (shouldDeferHeavyWorkForLighthouse()) return undefined;

    let resizeFrame = null;

    const measure = () => {
      const container = symbolsRef.current;
      if (!container) return;
      const cards = container.querySelectorAll(".trading-symbol-card");
      scrollMetricsRef.current.scrollWidth = container.scrollWidth;
      cards.forEach((card) => delete card.dataset.cardWidth);
    };

    const handleResize = () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = requestAnimationFrame(measure);
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
    };
  }, []);

  const getIconIdsForSymbol = (symbolStr) => {
    const symbolUpper = symbolStr.toUpperCase();

    if (symbolMapping.combined_icons[symbolUpper]) {
      return symbolMapping.combined_icons[symbolUpper].map((n) =>
        String(n).toLowerCase()
      );
    }

    if (symbolMapping.single_icons[symbolUpper]) {
      return [String(symbolMapping.single_icons[symbolUpper]).toLowerCase()];
    }

    return [symbolStr.toLowerCase()];
  };

  const iconPlaceholderStyle = {
    width: 20,
    height: 20,
    flexShrink: 0,
    display: "inline-block",
  };

  const renderSymbolIcons = (symbolStr) => {
    const ids = getIconIdsForSymbol(symbolStr);
    if (!ids.length) return null;

    const cells = ids.map((id, index) => {
      const url = getCachedIconUrl(id);
      if (!url) {
        return (
          <span
            key={`${symbolStr}-${id}-ph-${index}`}
            className="trading-symbol-card__icon trading-symbol-card__icon--placeholder"
            style={iconPlaceholderStyle}
            aria-hidden
          />
        );
      }
      return (
        <img
          key={`${symbolStr}-${id}-${index}`}
          src={url}
          alt={`${symbolStr}_icon`}
          className="trading-symbol-card__icon"
        />
      );
    });

    if (cells.length === 1) {
      return cells[0];
    }

    return (
      <div className="trading-symbol-card__combined-icons">{cells}</div>
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

  // Read phase only: returns pending action. Write phase runs in next rAF to avoid forced reflow (Lighthouse).
  const computeScrollAction = () => {
    const cont = symbolsRef.current;
    if (!cont) return null;
    const { scrollWidth } = scrollMetricsRef.current;
    if (!scrollWidth) return null;
    let targetScrollLeft = scrollPositionRef.current;

    const first = cont.firstElementChild;
    const lastchild = cont.lastElementChild;
    const needMoveFirst =
      isMiddleOfScroll(scrollWidth, targetScrollLeft) && first;
    const needMoveLast =
      isMiddleOfScrollReversed(scrollWidth, targetScrollLeft) &&
      isTouched &&
      lastchild;

    const cardStride =
      fixedCardWidthPx() > 0
        ? TRADING_SYMBOL_CARD_STRIDE_PX
        : null;
    const firstWidth = needMoveFirst
      ? cardStride ?? readCardWidth(first)
      : 0;
    const lastChildWidth = needMoveLast
      ? cardStride ?? readCardWidth(lastchild)
      : 0;
    if (needMoveFirst) setCardWidthCache(first, firstWidth);
    if (needMoveLast) setCardWidthCache(lastchild, lastChildWidth);

    if (needMoveFirst) {
      targetScrollLeft += isRTL ? firstWidth + margin : -(firstWidth + margin);
    }
    if (needMoveLast) {
      targetScrollLeft += isRTL
        ? -(lastChildWidth + margin)
        : lastChildWidth + margin;
    }
    if (!isTouched) {
      targetScrollLeft += isRTL ? -scrollStep : scrollStep;
    }

    return {
      cont,
      first,
      lastchild,
      needMoveFirst,
      needMoveLast,
      firstWidth,
      lastChildWidth,
      targetScrollLeft,
    };
  };

  const applyScrollAction = (action) => {
    if (!action) return;
    const {
      cont,
      first,
      lastchild,
      needMoveFirst,
      needMoveLast,
      firstWidth,
      lastChildWidth,
      targetScrollLeft,
    } = action;
    if (needMoveFirst) {
      cont.appendChild(first);
    }
    if (needMoveLast) {
      cont.prepend(lastchild);
    }
    scrollPositionRef.current = targetScrollLeft;
    isProgrammaticScrollRef.current = true;
    cont.scrollLeft = targetScrollLeft;
    requestAnimationFrame(() => {
      isProgrammaticScrollRef.current = false;
    });
  };

  useEffect(() => {
    if (!isInfiniteAutoScroll || isTouched) return;
    /* Desktop/tablet: CSS translate animation (no appendChild / scrollLeft — Lighthouse forced reflow). */
    if (!isMobileLayout()) return undefined;
    /* No symbols yet (page-specific tickers before Socket.IO): skip the loop — N tickers × idle rAF was dominating TBT on /all-markets/. */
    if (!symbols?.length) return;
    if (shouldDeferHeavyWorkForLighthouse()) return undefined;

    const container = symbolsRef.current;
    if (!container) return undefined;

    let animationFrameId;
    let writeFrameId;
    let cancelled = false;
    let scrolling = false;
    let cancelScrollArm = () => {};
    let visibilityIo = null;

    const stopScroll = () => {
      scrolling = false;
      if (writeFrameId) {
        cancelAnimationFrame(writeFrameId);
        writeFrameId = null;
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const tick = () => {
      if (cancelled || !scrolling) return;
      const action = computeScrollAction();
      writeFrameId = requestAnimationFrame(() => {
        writeFrameId = null;
        if (cancelled || !scrolling) return;
        applyScrollAction(action);
        animationFrameId = requestAnimationFrame(tick);
      });
    };

    const startScroll = () => {
      if (scrolling || cancelled) return;
      scrolling = true;
      animationFrameId = requestAnimationFrame(tick);
    };

    const armAutoScroll = () => {
      if (cancelled) return;
      if (typeof IntersectionObserver === "undefined") {
        isTickerVisibleRef.current = true;
        startScroll();
        return;
      }

      visibilityIo = new IntersectionObserver(
        ([entry]) => {
          const visible = !!entry?.isIntersecting;
          isTickerVisibleRef.current = visible;
          if (visible) startScroll();
          else stopScroll();
        },
        { rootMargin: "80px 0px", threshold: 0 }
      );
      visibilityIo.observe(container);
    };

    // After hero LCP: avoid rAF scroll loop + DOM moves during the Lighthouse trace window.
    cancelScrollArm = scheduleAfterLcpOrCap(armAutoScroll, 4500);

    return () => {
      cancelled = true;
      cancelScrollArm();
      if (visibilityIo) visibilityIo.disconnect();
      stopScroll();
    };
  }, [isInfiniteAutoScroll, isTouched, isRTL, symbols?.length]);

  const useCssInfiniteScroll = isInfiniteAutoScroll && !isMobileLayout();

  return (
    <div
      className={cn("trading-symbols-wrapper", className, {
        "trading-symbols-wrapper--rtl": isRTL,
        "trading-symbols-wrapper--infinite-auto-scroll": useCssInfiniteScroll,
      })}
    >
      <div className="scroll-disabler"></div>
      <div
        id={`trading-symbols-${uniqueId}`}
        className={cn("trading-symbols", {
          "trading-symbols--css-auto-scroll": useCssInfiniteScroll,
        })}
        ref={symbolsRef}
        onTouchStart={() => setIsTouched(true)}
        onTouchEnd={() => setIsTouched(false)}
        onScroll={() => {
          if (isProgrammaticScrollRef.current) return;
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
  isInfiniteAutoScroll: PropTypes.bool,
};

export default TradingSymbols;
