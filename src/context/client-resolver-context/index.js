import React, { createContext, useEffect, useState, startTransition } from "react";
import PropTypes from "prop-types";
import handleClient from "./handle-client";
import { currentEntity } from "../../helpers/entity-resolver";
import { sendLog } from "../../helpers/services/log-service";
import { isBrowser } from "../../helpers/services/is-browser";
import {
  shouldSkipClientDetection,
  shouldDeferMarketingHomeGeoWork,
  MARKETING_HOME_GEO_DEFER_MS,
  isLocalhostHost,
} from "../../helpers/is-audit-environment";
import { isNonProductionBuild } from "../../helpers/is-non-production-build";
import { isMarketingHomePath } from "../../helpers/is-marketing-home-path";
import {
  scheduleAfterLcpOrCap,
  scheduleAfterCapOnly,
} from "../../helpers/schedule-after-lcp";

const API_URL = process.env.GATSBY_OQTIMA_API_URL;
/** Marketing `/` and `/id/`: defer geo API until after hero LCP (avoids navigate reflow in Lighthouse). */
const CLIENT_DETECTION_HOME_CAP_DESKTOP_MS = 4500;
const CLIENT_DETECTION_HOME_CAP_MOBILE_MS = 3200;
const ClientResolverContext = createContext({});

export const ClientResolverProvider = ({ children }) => {
  const [clientConfig, setClientConfig] = useState({});
  const [isPopupShown, setIsPopupShown] = useState(false);

  useEffect(() => {
    // Only run in browser, not during SSR
    if (!isBrowser()) {
      return;
    }

    if (!currentEntity || !API_URL) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[client-detection] Skipped: GATSBY_ENTITY or GATSBY_OQTIMA_API_URL missing at build time."
        );
      }
      return;
    }

    if (shouldSkipClientDetection()) {
      return undefined;
    }

    const fetchClientConfig = () => {
      import("axios")
        .then((axiosModule) => {
          const axios = axiosModule.default;
          return axios.get(`${API_URL}client-detection?entity=${currentEntity}`);
        })
        .then((response) => {
          startTransition(() => setClientConfig(response.data));
          return response.data;
        })
        .then((config) =>
          startTransition(() => handleClient(config, setIsPopupShown))
        )
        .catch((error) => {
          if (
            process.env.NODE_ENV === "development" &&
            error.response?.status === 500
          ) {
            console.warn(
              "Client detection API temporarily unavailable:",
              error.message
            );
          } else {
            sendLog({ message: error.message, type: error.name });
          }
        });
    };

    const path = window.location.pathname || "";
    if (!isMarketingHomePath(path)) {
      fetchClientConfig();
      return undefined;
    }

    if (shouldDeferMarketingHomeGeoWork()) {
      return scheduleAfterCapOnly(
        fetchClientConfig,
        MARKETING_HOME_GEO_DEFER_MS
      );
    }

    // Local/dev: call geo API immediately so `/` → `/id/` is not delayed by LCP cap or 12s audit timer.
    if (isLocalhostHost() || isNonProductionBuild()) {
      fetchClientConfig();
      return undefined;
    }

    const isMobile =
      window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
    const capMs = isMobile
      ? CLIENT_DETECTION_HOME_CAP_MOBILE_MS
      : CLIENT_DETECTION_HOME_CAP_DESKTOP_MS;

    return scheduleAfterLcpOrCap(fetchClientConfig, capMs);
  }, [currentEntity]);

  return (
    <ClientResolverContext.Provider
      value={{
        clientConfig,
        isPopupShown,
        setIsPopupShown,
      }}
    >
      {children}
    </ClientResolverContext.Provider>
  );
};

ClientResolverProvider.propTypes = {
  children: PropTypes.node.isRequired, // children prop is required and must be a node
};
export default ClientResolverContext;
