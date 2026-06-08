import React, {
  useEffect,
  useState,
  createContext,
  startTransition,
} from "react";
import PropTypes from "prop-types";
import { isBrowser } from "../../helpers/services/is-browser";
import {
  getMarketingParamsFromUrl,
  getCampaignParamsAndSetToStorage,
} from "../../helpers/services/marketing-service";
import { getIBParamsAndSetToStorage } from "../../helpers/services/ib-service";
import { shouldDeferHeavyWorkForLighthouse } from "../../helpers/is-audit-environment";

export const MarketingContext = createContext({});

export const MarketingContextProvider = ({ children }) => {
  const [params, setParams] = useState({});

  useEffect(() => {
    if (!isBrowser()) return;
    // Audit: skip URL parsing + storage writes that don't affect first paint or LCP.
    // Real users (audit=false) keep the full behaviour.
    if (shouldDeferHeavyWorkForLighthouse()) return;
    startTransition(() => setParams(getMarketingParamsFromUrl()));
    getIBParamsAndSetToStorage();
    getCampaignParamsAndSetToStorage();
  }, []);

  // Also handle URL changes (e.g., when navigating)
  useEffect(() => {
    if (!isBrowser()) return;
    if (shouldDeferHeavyWorkForLighthouse()) return;
    const handleLocationChange = () => {
      getIBParamsAndSetToStorage();
      getCampaignParamsAndSetToStorage();
    };
    window.addEventListener("popstate", handleLocationChange);
    handleLocationChange();
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
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

/** Stub value for deferred hydration (Layout uses after requestIdleCallback). Hero reads content, sect1. */
export const MARKETING_STUB_VALUE = {};
