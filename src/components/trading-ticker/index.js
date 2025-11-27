import React, { useEffect, useContext, useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import TradingSymbols from "./components/trading-symbols";
import { getTradingSections } from "../../helpers/config";
import TradingSections from "./components/trading-sections";
import { filterSymbols } from "../../helpers/services/filter-symbols";
import TradingContext from "../../context/trading-context";
import { io } from "socket.io-client";
import { sendLog } from "../../helpers/services/log-service";
import { isBrowser } from "../../helpers/services/is-browser";

const API_URL = process.env.GATSBY_OQTIMA_API_URL;

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
      setSelectedSection(tradingSection[0]);
      setNeedToLoadSymbols(true);
      return () => setNeedToLoadSymbols(false);
    }

    if (!API_URL || !isBrowser()) {
      return;
    }

    // Page-specific ticker - use local socket connection
    const socket = io(`${API_URL}ws-stocks/`, {
      transports: ["polling", "websocket"], // Fallback to polling if websocket fails
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    // Handle connection errors silently
    socket.on("connect_error", (error) => {
      if (process.env.NODE_ENV === "development") {
        console.debug("Socket.IO connection error:", error.message);
      }
    });

    const handleReply = (data) => {
      if (data) setLocalTradingSymbols(data);
    };

    socket.on("reply", handleReply);

    const fetchData = () => {
      try {
        if (API_URL && pageSpecificSection) {
          socket.emit("stocks", pageSpecificSection.id);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.debug("Socket.IO emit error:", error.message);
        }
      }
    };

    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, 700);

    return () => {
      clearInterval(intervalId);
      socket.off("reply", handleReply);
      socket.off("connect_error");
      socket.disconnect();
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
        isInfiniteAutoScroll={isInfiniteAutoScroll}
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
