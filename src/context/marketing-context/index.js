import React, { useEffect, useState, createContext } from "react";
import PropTypes from "prop-types";
import { isBrowser } from "../../helpers/services/is-browser";
import {
  getMarketingParamsFromUrl,
  getCampaignParamsAndSetToStorage,
} from "../../helpers/services/marketing-service";
import { getIBParamsAndSetToStorage } from "../../helpers/services/ib-service";

export const MarketingContext = createContext({});

export const MarketingContextProvider = ({ children }) => {
  const [params, setParams] = useState({});

  useEffect(() => {
    if (isBrowser()) {
      setParams(getMarketingParamsFromUrl());

      // handle IB registration params
      getIBParamsAndSetToStorage();

      // handle Campaign params
      getCampaignParamsAndSetToStorage();
    }
  }, []);

  // Also handle URL changes (e.g., when navigating)
  useEffect(() => {
    if (isBrowser()) {
      const handleLocationChange = () => {
        getIBParamsAndSetToStorage();
        getCampaignParamsAndSetToStorage();
      };

      // Listen for popstate events (back/forward navigation)
      window.addEventListener("popstate", handleLocationChange);

      // Also check on initial load and when location changes
      handleLocationChange();

      return () => {
        window.removeEventListener("popstate", handleLocationChange);
      };
    }
  }, []);

  return (
    <MarketingContext.Provider value={params}>
      {children}
    </MarketingContext.Provider>
  );
};

MarketingContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
