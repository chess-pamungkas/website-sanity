import { MARKETING_GET_PARAMS } from "../marketing.config";
import { isBrowser } from "./is-browser";
import { IB_PARAMS } from "./ib-service";

/** Fisher–Yates partial shuffle — avoids pulling in full `lodash` for marketing helpers. */
function sampleSize(arr, count) {
  if (!arr?.length || count <= 0) return [];
  const len = arr.length;
  const take = Math.min(count, len);
  const copy = arr.slice();
  for (let i = 0; i < take; i++) {
    const j = i + Math.floor(Math.random() * (len - i));
    const t = copy[i];
    copy[i] = copy[j];
    copy[j] = t;
  }
  return copy.slice(0, take);
}

export const getRandomArray = (arr, count) => sampleSize(arr, count);

const getParamsFromUrl = () => {
  return new URLSearchParams(window.location.search);
};

export const getMarketingParamsFromUrl = () => {
  return {
    content: getParamsFromUrl().get(MARKETING_GET_PARAMS.content),
    sect1: getParamsFromUrl().get(MARKETING_GET_PARAMS.sect1),
    sect2: getParamsFromUrl().get(MARKETING_GET_PARAMS.sect2),
    source: getParamsFromUrl().get(MARKETING_GET_PARAMS.source),
    medium: getParamsFromUrl().get(MARKETING_GET_PARAMS.medium),
    campaign: getParamsFromUrl().get(MARKETING_GET_PARAMS.campaign),
  };
};

export const transformParamToKey = (param) => {
  if (param == null || typeof param !== "string") return "";
  const paramWithoutSymbols = param.replace(/\+/g, " ");
  return paramWithoutSymbols.trim().toLowerCase();
};

export const CAMPAIGN_PARAMS = {
  campaign_code: "campaign_code",
};

export const getCampaignParamsAndSetToStorage = () => {
  if (isBrowser()) {
    const urlParams = getParamsFromUrl();
    const campaignCode = urlParams.get(CAMPAIGN_PARAMS.campaign_code);
    const utmSource = urlParams.get("utm_source");
    const utmMedium = urlParams.get("utm_medium");
    const utmCampaign = urlParams.get("utm_campaign");

    // Check if campaign_code or UTM parameters exist in URL
    const hasCampaignCode = !!campaignCode;
    const hasUTMParams = !!(utmSource || utmMedium || utmCampaign);

    if (hasCampaignCode || hasUTMParams) {
      // Store campaign_code if exists
      if (campaignCode) {
        localStorage.setItem(CAMPAIGN_PARAMS.campaign_code, campaignCode);
        localStorage.removeItem(IB_PARAMS.r_code);
      }

      // Store UTM parameters in localStorage if they exist
      if (utmSource) localStorage.setItem("utm_source", utmSource);
      if (utmMedium) localStorage.setItem("utm_medium", utmMedium);
      if (utmCampaign) localStorage.setItem("utm_campaign", utmCampaign);

      // Remove campaign_code and UTM parameters from URL immediately and forcefully
      const cleanUrlFromParams = () => {
        const currentUrl = new URL(window.location.href);
        let urlChanged = false;

        // Remove campaign_code parameter
        if (currentUrl.searchParams.has(CAMPAIGN_PARAMS.campaign_code)) {
          currentUrl.searchParams.delete(CAMPAIGN_PARAMS.campaign_code);
          urlChanged = true;
        }

        // Remove UTM parameters if they exist in URL
        if (currentUrl.searchParams.has("utm_source")) {
          currentUrl.searchParams.delete("utm_source");
          urlChanged = true;
        }
        if (currentUrl.searchParams.has("utm_medium")) {
          currentUrl.searchParams.delete("utm_medium");
          urlChanged = true;
        }
        if (currentUrl.searchParams.has("utm_campaign")) {
          currentUrl.searchParams.delete("utm_campaign");
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

          console.log("Cleaning URL:", {
            from: window.location.href,
            to: cleanUrl,
          });

          // Update URL immediately
          window.history.replaceState(null, "", cleanUrl);

          return true; // URL was cleaned
        }
        return false; // No parameters found to clean
      };

      // Clean URL immediately
      const cleaned = cleanUrlFromParams();
      console.log("Initial URL clean result:", cleaned);

      // Also clean after a short delay to catch any late URL manipulations
      setTimeout(() => {
        const cleaned2 = cleanUrlFromParams();
        if (cleaned2) {
          console.log("URL cleaned again after 10ms");
        }
      }, 10);

      // And clean again after a longer delay to be absolutely sure
      setTimeout(() => {
        const cleaned3 = cleanUrlFromParams();
        if (cleaned3) {
          console.log("URL cleaned again after 100ms");
        }
        // Final check - log if URL still has parameters
        const finalCheck = new URL(window.location.href);
        const stillHasParams =
          finalCheck.searchParams.has(CAMPAIGN_PARAMS.campaign_code) ||
          finalCheck.searchParams.has("utm_source") ||
          finalCheck.searchParams.has("utm_medium") ||
          finalCheck.searchParams.has("utm_campaign");
        if (stillHasParams) {
          console.warn(
            "WARNING: URL still contains parameters after cleaning:",
            window.location.href
          );
        } else {
          console.log("✓ URL successfully cleaned:", window.location.href);
        }
      }, 100);
    }
  }
};

export const setCampaignParamsToLink = () => {
  if (isBrowser()) {
    const campaign_code = localStorage.getItem(CAMPAIGN_PARAMS.campaign_code);
    const utmSource = localStorage.getItem("utm_source");
    const utmMedium = localStorage.getItem("utm_medium");
    const utmCampaign = localStorage.getItem("utm_campaign");

    let queryString = "";

    // Check conditions and construct the query string accordingly
    if (campaign_code) {
      queryString = `?${CAMPAIGN_PARAMS.campaign_code}=${campaign_code}`;

      // Add UTM parameters if they exist
      if (utmSource) queryString += `&utm_source=${utmSource}`;
      if (utmMedium) queryString += `&utm_medium=${utmMedium}`;
      if (utmCampaign) queryString += `&utm_campaign=${utmCampaign}`;

      return queryString;
    }
  }

  return "";
};
