import { useEffect, useRef } from "react";

export const useLoadingWatchdog = ({
  isLoading,
  onTimeout,
  timeoutMs = 12000,
  deps = [],
}) => {
  const timerRef = useRef(null);
  const latestTimeoutHandlerRef = useRef(onTimeout);

  useEffect(() => {
    latestTimeoutHandlerRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    if (!isLoading) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setTimeout(() => {
      if (typeof latestTimeoutHandlerRef.current === "function") {
        latestTimeoutHandlerRef.current();
      }
    }, timeoutMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isLoading, timeoutMs, ...deps]);
};
