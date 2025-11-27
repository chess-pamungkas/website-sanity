import React, { createContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { getTradingSections } from "../../helpers/config";
import { io } from "socket.io-client";
import { sendLog } from "../../helpers/services/log-service";
import { isBrowser } from "../../helpers/services/is-browser";

const API_URL = process.env.GATSBY_OQTIMA_API_URL;
const TradingContext = createContext({});

export const TradingProvider = ({ children }) => {
  const [selectedSection, setSelectedSection] = useState(
    getTradingSections()[0]
  );
  const [tradingSymbols, setTradingSymbols] = useState([]);
  const [needToLoadSymbols, setNeedToLoadSymbols] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!API_URL || !isBrowser()) {
      return undefined;
    }

    const normalizedUrl = API_URL.endsWith("/")
      ? `${API_URL}ws-stocks/`
      : `${API_URL}/ws-stocks/`;

    try {
      const socketInstance = io(normalizedUrl, {
        transports: ["polling", "websocket"], // Fallback to polling if websocket fails
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socketRef.current = socketInstance;

      // Handle connection errors silently (don't spam console)
      socketInstance.on("connect_error", (error) => {
        // Only log in development, suppress in production
        if (process.env.NODE_ENV === "development") {
          console.debug("Socket.IO connection error:", error.message);
        }
      });

      socketInstance.on("disconnect", (reason) => {
        // Only log unexpected disconnects
        if (
          reason !== "io client disconnect" &&
          process.env.NODE_ENV === "development"
        ) {
          console.debug("Socket.IO disconnected:", reason);
        }
      });

      socketInstance.on("connect", () => {
        setSocketReady(true);
      });

      return () => {
        socketInstance.off("reply");
        socketInstance.off("connect_error");
        socketInstance.off("disconnect");
        socketInstance.off("connect");
        socketInstance.disconnect();
        socketRef.current = null;
        setSocketReady(false);
      };
    } catch (error) {
      // Only log critical errors
      if (process.env.NODE_ENV === "development") {
        console.error("Socket.IO initialization error:", error);
      }
      return undefined;
    }
  }, []);

  useEffect(() => {
    const socketInstance = socketRef.current;
    if (!socketInstance || !API_URL || !socketReady) {
      return undefined;
    }

    const fetchData = () => {
      try {
        if (API_URL) {
          socketInstance.emit("stocks", selectedSection.id);
        }
      } catch (error) {
        sendLog({ message: error.message, type: error.name });
      }
    };

    const handleReply = (data) => {
      if (data) setTradingSymbols(data);
    };

    socketInstance.on("reply", handleReply);
    fetchData(); // Initial fetch

    let intervalId;
    if (needToLoadSymbols) {
      intervalId = setInterval(fetchData, 700);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      socketInstance.off("reply", handleReply);
    };
  }, [selectedSection?.id, needToLoadSymbols, socketReady]);

  return (
    <TradingContext.Provider
      value={{
        selectedSection,
        setSelectedSection,
        tradingSymbols,
        setTradingSymbols,
        needToLoadSymbols,
        setNeedToLoadSymbols,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

TradingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default TradingContext;
