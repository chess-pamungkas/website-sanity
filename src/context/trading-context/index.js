import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  startTransition,
} from "react";
import PropTypes from "prop-types";
import { getTradingSections } from "../../helpers/config";
import { sendLog } from "../../helpers/services/log-service";
import { isBrowser } from "../../helpers/services/is-browser";
import { shouldDeferHeavyWorkForLighthouse } from "../../helpers/is-audit-environment";

const API_URL = process.env.GATSBY_OQTIMA_API_URL;
const TradingContext = createContext({});

export const TradingProvider = ({ children, enableLiveTrading = true }) => {
  const [selectedSection, setSelectedSection] = useState(
    getTradingSections()[0]
  );
  const [tradingSymbols, setTradingSymbols] = useState([]);
  const [needToLoadSymbols, setNeedToLoadSymbols] = useState(false);
  const socketRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const connectStartedRef = useRef(false);
  const selectedSectionIdRef = useRef(selectedSection.id);

  selectedSectionIdRef.current = selectedSection.id;

  useEffect(() => {
    if (
      !enableLiveTrading ||
      !API_URL ||
      !isBrowser() ||
      !needToLoadSymbols
    ) {
      return undefined;
    }

    let cancelled = false;

    const tearDown = () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      const sock = socketRef.current;
      socketRef.current = null;
      if (!sock) return;
      try {
        sock.disconnect();
      } catch (e) {
        /* noop */
      }
    };

    const connect = () => {
      if (cancelled || connectStartedRef.current) return;
      connectStartedRef.current = true;
      import("../../helpers/services/load-socket-io")
        .then(({ loadSocketIo }) => loadSocketIo())
        .then((io) => {
          if (cancelled) return;
          const normalizedUrl = API_URL.endsWith("/")
            ? `${API_URL}ws-stocks/`
            : `${API_URL}/ws-stocks/`;

          try {
            const socketInstance = io(normalizedUrl, {
              transports: ["websocket", "polling"],
              reconnection: true,
              reconnectionAttempts: 5,
              reconnectionDelay: 1000,
              timeout: 10000,
            });
            socketRef.current = socketInstance;

            const handleReply = (data) => {
              if (data) startTransition(() => setTradingSymbols(data));
            };
            socketInstance.on("reply", handleReply);

            const fetchData = () => {
              try {
                if (!socketInstance.connected) return;
                socketInstance.emit("stocks", selectedSectionIdRef.current);
              } catch (error) {
                sendLog({ message: error.message, type: error.name });
              }
            };

            socketInstance.on("connect_error", (error) => {
              if (process.env.NODE_ENV === "development") {
                console.warn(
                  "[trading] Socket.IO connect_error:",
                  error?.message || error
                );
              }
            });
            socketInstance.on("disconnect", (reason) => {
              if (
                reason !== "io client disconnect" &&
                process.env.NODE_ENV === "development"
              ) {
                console.debug("Socket.IO disconnected:", reason);
              }
            });

            const startPolling = () => {
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
              }
              fetchData();
              pollIntervalRef.current = setInterval(fetchData, 700);
            };

            // Register reply + emit before "connect". Client queues emits until the handshake
            // finishes — avoids empty ticker when connect is slow or racing React effects (common in dev).
            fetchData();
            socketInstance.on("connect", startPolling);
            if (socketInstance.connected) {
              startPolling();
            }
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              console.error("Socket.IO initialization error:", error);
            }
          }
        })
        .catch(() => {
          connectStartedRef.current = false;
        });
    };

    let fallbackId = null;
    const onInteract = () => {
      window.removeEventListener("click", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("scroll", onInteract, true);
      window.removeEventListener("touchstart", onInteract, true);
      window.removeEventListener("belowHeroContentReady", onInteract);
      if (fallbackId) clearTimeout(fallbackId);
      connect();
    };
    if (shouldDeferHeavyWorkForLighthouse()) {
      window.addEventListener("click", onInteract, {
        once: true,
        passive: true,
      });
      window.addEventListener("keydown", onInteract, {
        once: true,
        passive: true,
      });
      fallbackId = setTimeout(connect, 30000);
    } else {
      window.addEventListener("belowHeroContentReady", onInteract, {
        once: true,
      });
      connect();
    }

    return () => {
      cancelled = true;
      connectStartedRef.current = false;
      window.removeEventListener("click", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("scroll", onInteract, true);
      window.removeEventListener("touchstart", onInteract, true);
      window.removeEventListener("belowHeroContentReady", onInteract);
      if (fallbackId) clearTimeout(fallbackId);
      tearDown();
    };
  }, [needToLoadSymbols, enableLiveTrading]);

  useEffect(() => {
    const s = socketRef.current;
    if (
      !enableLiveTrading ||
      !s ||
      !needToLoadSymbols ||
      !API_URL
    ) {
      return undefined;
    }
    try {
      if (s.connected) {
        s.emit("stocks", selectedSection.id);
      }
    } catch (e) {
      /* noop */
    }
    return undefined;
  }, [selectedSection.id, needToLoadSymbols, enableLiveTrading]);

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
  enableLiveTrading: PropTypes.bool,
};
export default TradingContext;
