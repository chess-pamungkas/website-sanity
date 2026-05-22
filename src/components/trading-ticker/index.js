import React, { useEffect, useContext, useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import TradingSymbols from "./components/trading-symbols";
import { getTradingSections } from "../../helpers/config";
import TradingSections from "./components/trading-sections";
import { filterSymbols } from "../../helpers/services/filter-symbols";
import TradingContext from "../../context/trading-context";
import { isBrowser } from "../../helpers/services/is-browser";
import { loadSocketIo } from "../../helpers/services/load-socket-io";
import {
  shouldDeferHeavyWorkForLighthouse,
  AUDIT_HEAVY_WORK_DEFER_MS,
} from "../../helpers/is-audit-environment";
import { isMobileViewportMedia } from "../../helpers/viewport-media";

const API_URL = process.env.GATSBY_OQTIMA_API_URL;
/** Homepage ticker: desktop — fixed timer after hydrate (avoid rIC starving under load). Audits defer separately. */
const HOMEPAGE_SYMBOLS_BOOT_DELAY_MS = 260;
/** Mobile: show strip soon after hero; LH still skips heavy socketwork via defer flags on provider. */
const HOMEPAGE_SYMBOLS_BOOT_DELAY_MOBILE_MS = 55;
/**
 * Page-specific ticker (all-markets): connect in the next microtask so work isn’t stuck behind
 * requestIdleCallback (which can wait up to the timeout on busy main thread). Audits still defer
 * via shouldDeferHeavyWorkForLighthouse().
 */

const TradingTicker = ({
  className,
  title,
  pageSpecificSection,
  isInfiniteAutoScroll,
  uniqueId,
}) => {
  const tradingSection = getTradingSections();
  const {
    tradingSymbols: globalTradingSymbols,
    selectedSection: globalSelectedSection,
    setSelectedSection,
    setNeedToLoadSymbols,
  } = useContext(TradingContext);

  // Local state for page-specific sections (like in all-markets page)
  const [localTradingSymbols, setLocalTradingSymbols] = useState([]);
  const [localSelectedSection, setLocalSelectedSection] = useState(
    pageSpecificSection || tradingSection[0]
  );

  // Determine if this is a page-specific ticker or homepage ticker
  const isHomepage = !title && !pageSpecificSection;
  const isPageSpecific = !!pageSpecificSection;

  // For page-specific sections, fetch their own data
  useEffect(() => {
    if (!isPageSpecific) {
      // Homepage ticker - use global context
      let cancelled = false;
      let delayId;
      setSelectedSection(tradingSection[0]);
      const enable = () => {
        if (!cancelled) setNeedToLoadSymbols(true);
      };
      let idleCallbackId = null;
      const isNarrowViewport = isMobileViewportMedia();
      const bootDelayMs = isNarrowViewport
        ? HOMEPAGE_SYMBOLS_BOOT_DELAY_MOBILE_MS
        : HOMEPAGE_SYMBOLS_BOOT_DELAY_MS;
      if (shouldDeferHeavyWorkForLighthouse()) {
        if (typeof requestIdleCallback !== "undefined") {
          idleCallbackId = requestIdleCallback(enable, {
            timeout: bootDelayMs,
          });
        } else {
          delayId = setTimeout(enable, bootDelayMs);
        }
      } else {
        delayId = setTimeout(enable, bootDelayMs);
      }
      return () => {
        cancelled = true;
        if (
          idleCallbackId != null &&
          typeof cancelIdleCallback !== "undefined"
        ) {
          cancelIdleCallback(idleCallbackId);
        }
        if (delayId) clearTimeout(delayId);
        setNeedToLoadSymbols(false);
      };
    }

    if (!API_URL || !isBrowser()) {
      return undefined;
    }

    let cancelled = false;
    let intervalId;
    let socketInstance = null;
    let cancelBoot = null;
    const apiBase =
      typeof API_URL === "string"
        ? API_URL.replace(/\/+$/, "")
        : "";
    const wsStocksUrl = apiBase ? `${apiBase}/ws-stocks/` : "";

    const handleReply = (data) => {
      if (data) setLocalTradingSymbols(data);
    };

    const tearDownSocket = () => {
      const socket = socketInstance;
      socketInstance = null;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
      if (!socket) return;
      try {
        socket.off("reply", handleReply);
        socket.removeAllListeners("connect_error");
        socket.disconnect();
      } catch (e) {
        /* noop */
      }
    };

    const startSocket = () => {
      if (cancelled || !pageSpecificSection || !wsStocksUrl) return;
      loadSocketIo()
        .then((io) => {
          if (cancelled || !pageSpecificSection) return;
          const socket = io(wsStocksUrl, {
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
            timeout: 10000,
          });
          socketInstance = socket;

          socket.on("connect_error", (error) => {
            if (process.env.NODE_ENV === "development") {
              console.debug("Socket.IO connection error:", error.message);
            }
          });

          socket.on("reply", handleReply);

          const fetchData = () => {
            try {
              if (cancelled || !socket || !pageSpecificSection) return;
              if (!socket.connected) return;
              socket.emit("stocks", pageSpecificSection.id);
            } catch (error) {
              if (process.env.NODE_ENV === "development") {
                console.debug("Socket.IO emit error:", error.message);
              }
            }
          };

          fetchData();
          intervalId = setInterval(fetchData, 700);

          if (cancelled) {
            tearDownSocket();
          }
        })
        .catch(() => {});
    };

    if (shouldDeferHeavyWorkForLighthouse()) {
      const bootDelayId = setTimeout(startSocket, AUDIT_HEAVY_WORK_DEFER_MS);
      cancelBoot = () => clearTimeout(bootDelayId);
    } else {
      queueMicrotask(() => {
        if (!cancelled) startSocket();
      });
      cancelBoot = () => {};
    }

    return () => {
      cancelled = true;
      if (cancelBoot) cancelBoot();
      tearDownSocket();
    };
  }, [pageSpecificSection?.id]);

  // Determine which symbols and section to use
  const symbols = isPageSpecific ? localTradingSymbols : globalTradingSymbols;
  const selectedSection = isPageSpecific
    ? localSelectedSection
    : globalSelectedSection;

  return (
    <section className={cn("trading-ticker-wrapper", className)}>
      {isHomepage && (
        <TradingSections
          tradingSection={tradingSection}
          title={title}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
      )}
      <TradingSymbols
        symbols={filterSymbols(symbols, selectedSection.id)}
        isInfiniteAutoScroll={
          isHomepage && isInfiniteAutoScroll !== false
        }
        uniqueId={uniqueId}
      />
    </section>
  );
};

TradingTicker.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  pageSpecificSection: PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }),
  isInfiniteAutoScroll: PropTypes.bool,
  uniqueId: PropTypes.string,
};
export default TradingTicker;
