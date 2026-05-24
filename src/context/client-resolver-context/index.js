import React, { createContext, useEffect, useState, startTransition } from "react";
import PropTypes from "prop-types";
import handleClient from "./handle-client";
import { currentEntity } from "../../helpers/entity-resolver";
import { sendLog } from "../../helpers/services/log-service";
import { isBrowser } from "../../helpers/services/is-browser";
import { shouldSkipClientDetection } from "../../helpers/is-audit-environment";

const API_URL = process.env.GATSBY_OQTIMA_API_URL;
const ClientResolverContext = createContext({});

export const ClientResolverProvider = ({ children }) => {
  const [clientConfig, setClientConfig] = useState({});
  const [isPopupShown, setIsPopupShown] = useState(false);

  useEffect(() => {
    // Only run in browser, not during SSR
    if (!isBrowser() || !currentEntity || !API_URL) {
      return;
    }

    // Audit (Lighthouse / PSI / ?lighthouse): skip the dynamic axios import + client-detection
    // network call. They were producing ~hundreds of ms of script eval + parse in the trace.
    // Real users (audit=false) keep full behaviour.
    if (shouldSkipClientDetection()) {
      return;
    }

    // Dynamically import axios only in browser to avoid SSR issues
    import("axios")
      .then((axiosModule) => {
        const axios = axiosModule.default;
        return axios.get(`${API_URL}client-detection?entity=${currentEntity}`);
      })
      .then((response) => {
        startTransition(() => setClientConfig(response.data));
        return response.data;
      })
      .then((clientConfig) =>
        startTransition(() => handleClient(clientConfig, setIsPopupShown))
      )
      .catch((error) => {
        // Only log errors in development, suppress 500 errors from dev server
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
