import { isBrowser } from "./is-browser";
import { CAMPAIGN_PARAMS } from "./marketing-service";

export const IB_PARAMS = {
  r_code: "r_code", // New parameter
};

const getParamsFromUrl = () => {
  return new URLSearchParams(window.location.search);
};

export const getIBParamsAndSetToStorage = () => {
  if (isBrowser()) {
    const urlParams = getParamsFromUrl();
    const r_code = urlParams.get(IB_PARAMS.r_code);
    const expiry_date = urlParams.get("expiry_date");

    // Remove r_code and expiry_date parameters from URL immediately and forcefully
    const cleanUrlFromParams = () => {
      const currentUrl = new URL(window.location.href);
      let urlChanged = false;

      // Remove r_code parameter
      if (currentUrl.searchParams.has(IB_PARAMS.r_code)) {
        currentUrl.searchParams.delete(IB_PARAMS.r_code);
        urlChanged = true;
      }

      // Remove expiry_date parameter
      if (currentUrl.searchParams.has("expiry_date")) {
        currentUrl.searchParams.delete("expiry_date");
        urlChanged = true;
      }

      if (urlChanged) {
        // Build clean URL - preserve pathname, other params, and hash
        let cleanUrl = currentUrl.pathname;

        // Add remaining query parameters if any
        const remainingParams = currentUrl.searchParams.toString();
        if (remainingParams) {
          cleanUrl += `?${remainingParams}`;
        }

        // Add hash if exists
        if (currentUrl.hash) {
          cleanUrl += currentUrl.hash;
        }

        // Update URL immediately
        window.history.replaceState(null, "", cleanUrl);

        return true; // URL was cleaned
      }
      return false; // No parameters found to clean
    };

    // Check if r_code parameter exists in URL (regardless of position)
    if (r_code) {
      // Save to localStorage first
      localStorage.setItem(IB_PARAMS.r_code, r_code);
      localStorage.removeItem(CAMPAIGN_PARAMS.campaign_code);

      // Clean URL immediately
      cleanUrlFromParams();

      // Also clean after a short delay to catch any late URL manipulations
      setTimeout(() => {
        cleanUrlFromParams();
      }, 10);

      // And clean again after a longer delay to be absolutely sure
      setTimeout(() => {
        cleanUrlFromParams();
      }, 100);
    } else if (expiry_date) {
      // If only expiry_date exists (without r_code), still clean it from URL
      cleanUrlFromParams();

      // Also clean after a short delay to catch any late URL manipulations
      setTimeout(() => {
        cleanUrlFromParams();
      }, 10);

      // And clean again after a longer delay to be absolutely sure
      setTimeout(() => {
        cleanUrlFromParams();
      }, 100);
    }
  }
};

export const setIBparamsToLink = () => {
  if (isBrowser()) {
    const r_code = localStorage.getItem(IB_PARAMS.r_code);

    // Check conditions and construct the query string accordingly
    if (r_code) {
      return `?${IB_PARAMS.r_code}=${r_code}`; // Only r_code
    }
  }

  return "";
};
